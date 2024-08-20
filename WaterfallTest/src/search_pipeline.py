# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json
import plotly.express as px
import umap.umap_ as umap

from web_searcher import WebSearcher
from html_file_downloader import HtmlFileDownloader
from summariser import Summariser
from embedder import Embedder
from cluster_analyser import ClusterAnalyser
from theme_finder import ThemeFinder
from embedding_finder import EmbeddingFinder

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

def sort_array_by_another(arr1: list[str], arr2:list[int]):
    
    # Combine the two arrays into a list of tuples
    combined = list(zip(arr2, arr1))
    
    # Sort the combined list by the first element of each tuple (values in arr2)
    combined.sort(reverse=True)
    
    # Extract the sorted arr1 from the combined list
    sorted_arr1 = [x for _, x in combined]
    
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
       

   def search (self, clusters: int) -> list[str]: 
      '''
      Searches for HTML content from a list of links.

      Returns:
          list[str]: A list of HTML content downloaded from the specified links.
      '''
      searcher = WebSearcher (self.output_location)

      links = searcher.search ()

      summaries = []
      embeddings = []
      embeddings_as_float = []
      path_embedding_tuples = []
      short_themes = []
      long_themes = []

      for link in links:
         downloader = HtmlFileDownloader (link, self.output_location)
         text = downloader.download ()

         summariser = Summariser (link, text, self.output_location)
         summary = summariser.summarise ()
         summaries.append (summary)

         embedder = Embedder (link, summary, self.output_location)
         embedding = embedder.embed ()
         embeddings.append (embedding)         

         path_embedding_tuple = (link, embedding)
         path_embedding_tuples.append (path_embedding_tuple)

      for embedding in embeddings:           
         embedding_as_float = Embedder.textToFloat (embedding)
         embeddings_as_float.append (embedding_as_float)         

      cluster_analyser = ClusterAnalyser (path_embedding_tuples, self.output_location) 
      classifications = cluster_analyser.analyse(clusters)
      
      accumulated_summaries = [""] * clusters
      accumulated_counts = [0] * clusters

      # Accumulate a set of summaries and counts of summaries according to classification
      for i, summary in enumerate (summaries):
         accumulated_summaries[classifications[i]] = accumulated_summaries[classifications[i]] + summary
         accumulated_counts[classifications[i]] = accumulated_counts[classifications[i]] + 1
     
      # Ask the theme finder to find a theme, then store it
      for accumulated_summary in accumulated_summaries:
         theme_finder = ThemeFinder (accumulated_summary)
         theme = theme_finder.find_theme (15)
         short_themes.append (theme)
         theme = theme_finder.find_theme (50)
         long_themes.append (theme)         

      reducer = umap.UMAP()
      logger.debug("Reducing cluster")      
      embeddings_2d = reducer.fit_transform(embeddings_as_float)

      logger.debug("Generating chart")
      #df = pd.DataFrame({'theme': themes})
      
      # Make a list of theme names which gets used as the legend in the chart
      theme_names = []
      for classification in classifications:
         theme_name = short_themes[classification]      
         theme_names.append(theme_name)
      
      fig = px.scatter(x=embeddings_2d[:, 0], y=embeddings_2d[:, 1], color=theme_names)
      fig.show()

      long_themes = sort_array_by_another(long_themes, accumulated_counts)
      top_themes = long_themes[:3]

      # Now we are looking for articles that best match the themes
      embedding_finder = EmbeddingFinder (embeddings_as_float, self.output_location)

      # Ask the embedding finder to find nearest article for top 3 themese
      nearest_summaries = []
      nearest_links = []
      for theme in top_themes:
         nearest_embedding = embedding_finder.find_nearest (None, theme)
         for i, embedding in enumerate (embeddings_as_float):
            if embedding == nearest_embedding:
               nearest_links.append(links[i])               
               nearest_summaries.append(summaries[i])

      output_results = []
      for i, text in enumerate(summaries):
         output_item = dict()
         output_item["summary"] = text
         output_item["embedding"] = embeddings[i]
         output_item["path"] = links[i]
         output_item["theme"] = theme_names[i]
         output_results.append (output_item)
      
      # save the test results to a json file
      output_file = os.path.join(self.output_location, "test_output.json")
      with open(output_file, "w+", encoding="utf-8") as f:
         json.dump(output_results, f)        
        
      return summaries
      
        

