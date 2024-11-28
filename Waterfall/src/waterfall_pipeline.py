'''driver for the entire pipeline '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging

from src.workflow import PipelineItem, Theme, WebSearchPipelineSpec
from src.web_searcher import WebSearcher
from src.html_file_downloader import HtmlFileDownloader
from src.summariser import Summariser
from src.summarise_fail_suppressor import SummariseFailSuppressor
from src.embedder import Embedder
from src.cluster_analyser import ClusterAnalyser
from src.theme_finder import ThemeFinder
from src.embedding_finder import EmbeddingFinder
from src.waterfall_pipeline_report import create_mail_report
from src.waterfall_pipeline_report_common import write_details_json
from src.waterfall_pipeline_save_chunks import save_chunks

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)


def sort_array_by_another(arr1: list[Theme], arr2: list[int]) -> list[Theme]:
    '''
   orders list 1 using list 2 to drive the sort order

    Returns:
       list[Theme]: Ordered list of Themes.
    '''

    # Combine the two arrays into a list of tuples
    combined = list(zip(arr2, arr1))

    # Sort the combined list by the first element of each tuple (values in arr2)
    combined.sort(reverse=True)

    # Extract the sorted arr1 from the combined list
    sorted_arr1: list[Theme] = [x for _, x in combined]

    return sorted_arr1


class WaterfallDataPipeline:
    '''
    Searches for HTML content from a list of links.

    Returns:
       list[str]: A list of HTML content downloaded from the specified links.
    '''

    def __init__(self, output_location: str):
        self.output_location = output_location
        return

    def search(self, spec: WebSearchPipelineSpec, send_final: bool) -> list[Theme]:
        '''
        Searches for HTML content from a list of links.

        Returns:
            list[Theme]: A list of Theme objects 
        '''

        items: list[WebSearchPipelineSpec] = self.search_and_cluster(spec)

        themes: list[Theme] = self.create_themes(items, spec)

        self.create_report(items, themes, spec, send_final)

        return themes

    def search_and_cluster(self, spec: WebSearchPipelineSpec) -> list[PipelineItem]:
        '''
        Create themes based on the provided PipelineItems and PipelineSpec.

        Parameters:
           items (list[PipelineItem]): A list of PipelineItem objects to create themes from.
           spec (PipelineSpec): The PipelineSpec object containing specifications for 
           theme creation.

        Returns:
           list[Theme]: A list of Theme objects created based on the provided PipelineItems 
           and PipelineSpec.
        '''
        searcher = WebSearcher(self.output_location)

        input_items = searcher.search(spec)

        items: list[PipelineItem] = []

        downloader = HtmlFileDownloader(self.output_location)
        summariser = Summariser(self.output_location)
        suppressor = SummariseFailSuppressor(self.output_location)
        embedder = Embedder(self.output_location)
        cluster_analyser = ClusterAnalyser(self.output_location, spec.clusters)

        for item in input_items:
            downloaded = None
            suppression_checked = None
            summarised = None
            embedded = None

            downloaded = downloader.download(item)
            if downloaded:
                summarised = summariser.summarise(downloaded)
            if summarised:
                suppression_checked = suppressor.should_suppress(summarised)
            if suppression_checked:
                embedded = embedder.embed(suppression_checked)
            if embedded:
                items.append(embedded)

        items = cluster_analyser.analyse(items)

        return items

    def create_themes(self, items: list[PipelineItem], spec: WebSearchPipelineSpec) -> list[Theme]:
        '''
        Create themes based on the provided PipelineItems and PipelineSpec.

        Parameters:
           items (list[PipelineItem]): A list of PipelineItem objects to create themes from.
           spec (PipelineSpec): The PipelineSpec object containing specifications 
                for theme creation.

        Returns:
           list[Theme]: A list of Theme objects created based on the provided 
              PipelineItems and PipelineSpec.
        '''
        themes: list[Theme] = []

        accumulated_summaries: list[str] = [''] * spec.clusters
        accumulated_counts: list[int] = [0] * spec.clusters
        accumulated_members: list[list[PipelineItem]] = [None] * spec.clusters
        for x in range(spec.clusters):
            accumulated_members[x] = []

        # Accumulate a set of summaries and counts of summaries according to classification
        for i, item in enumerate(items):
            cluster = items[i].cluster
            accumulated_summaries[cluster] = accumulated_summaries[cluster] + \
                item.summary + "\n "
            accumulated_counts[cluster] = accumulated_counts[cluster] + 1
            accumulated_members[cluster].append(item)

        # Ask the theme finder to find a theme, then store it
        for i, accumulated_summary in enumerate(accumulated_summaries):
            theme_finder = ThemeFinder()
            short_description = theme_finder.find_theme(
                accumulated_summary, 15)
            long_description = theme_finder.find_theme(accumulated_summary, 50)
            theme = Theme()
            theme.member_pipeline_items = accumulated_members[i]
            theme.short_description = short_description
            theme.long_description = long_description
            themes.append(theme)

        # Ask the embedding finder to find nearest article for each theme
        enriched_themes = []
        for i, theme in enumerate(themes):
            logger.debug('Finding nearest embedding')

            # Accumulate the embeddings that are part of the cluster
            embeddings_for_theme = []
            for item in items:
                if item.cluster == i:
                    embeddings_for_theme.append(item.embedding)

            # Build embedding finder with the right embeddings,
            # then find the nearest one to the theme that is in the cluster
            embedding_finder = EmbeddingFinder(
                embeddings_for_theme, self.output_location)
            nearest_items: list[PipelineItem] = []
            nearest_embedding = embedding_finder.find_nearest(
                theme.long_description)

            # Store nearest item
            for item in items:
                if item.embedding == nearest_embedding:
                    nearest_items.append(item)
                    theme.example_pipeline_items = nearest_items
                    enriched_themes.append(theme)
                    break

        logger.debug('Ordering themes')
        ordered_themes = sort_array_by_another(
            enriched_themes, accumulated_counts)

        return ordered_themes

    def create_report(self, items: list[PipelineItem],
                      themes: list[Theme],
                      spec: WebSearchPipelineSpec,
                      send_final: bool) -> None:
        '''
        Generates a report based on the provided PipelineItems, Themes, and PipelineSpec. 

        Parameters:
        - items (list[PipelineItem]): A list of PipelineItem objects to generate the report from.
        - themes (list[Theme]): A list of Theme objects associated with the PipelineItems.
        - spec (PipelineSpec): The PipelineSpec object containing specifications for the report.
        - send_final - set to false to suppress ending the report - used in testing
        '''
        write_details_json( self.output_location, items, themes, spec)
        create_mail_report(self.output_location, items, themes, spec, send_final)
        save_chunks (self.output_location, items, themes, spec)
