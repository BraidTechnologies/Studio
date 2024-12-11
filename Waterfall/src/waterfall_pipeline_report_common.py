''' Send a final Waterfall report by mail '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json
import plotly
import plotly.express as px
import umap
import umap.umap_ as umap__

from src.workflow import PipelineItem, Theme, WebSearchPipelineSpec

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)


def write_chart(output_location: str,
                items: list[PipelineItem],
                themes: list[Theme],
                spec: WebSearchPipelineSpec) -> str:
    '''
    Generates a report based on the provided PipelineItems, Themes, and PipelineSpec.

        Parameters:
        - output_location - directory to store file output
        - items (list[PipelineItem]): A list of PipelineItem objects to generate the report from.
        - themes (list[Theme]): A list of Theme objects associated with the PipelineItems.
        - spec (WebSearchPipelineSpec): The PipelineSpec object containing specifications for the report.

        Returns:
        - path to the created file
    '''

    reducer = umap__.UMAP()
    logger.debug('Reducing cluster')
    embeddings_as_float = []

    for item in items:
        embeddings_as_float.append(item.embedding)
    embeddings_2d = reducer.fit_transform(embeddings_as_float)

    logger.debug('Generating chart')

    # Make a list of theme names which gets used as the legend in the chart
    theme_names: list[str] = []
    for item in items:
        theme_name = themes[item.cluster].short_description
        theme_names.append(theme_name)

    fig = px.scatter(
        x=embeddings_2d[:, 0], y=embeddings_2d[:, 1], color=theme_names)

    # save an interactive HTML version
    html_path = os.path.join(output_location, spec.output_chart_name)
    plotly.offline.plot(fig, filename=html_path)

    return html_path


def write_details_json(output_location: str,
                       items: list[PipelineItem],
                       themes: list[Theme],
                       spec: WebSearchPipelineSpec) -> None:
    '''
    write the detailed items to a JSON file in case manual inspection is needed
    '''

    logger.debug('Writing output file')

    output_results = []
    for item in items:
        output_item = dict()
        output_item['summary'] = item.summary
        output_item['embedding'] = item.embedding
        output_item['path'] = item.path
        output_item['theme'] = themes[item.cluster].short_description
        output_results.append(output_item)

    # save the test results to a json file
    output_file = os.path.join(output_location, spec.output_data_name)
    with open(output_file, 'w+', encoding='utf-8') as f:
        json.dump(output_results, f)
