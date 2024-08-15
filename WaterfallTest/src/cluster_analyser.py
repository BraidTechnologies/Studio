# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
from scipy.spatial import distance
import plotly.express as px
from sklearn.cluster import KMeans
import umap.umap_ as umap

from embedder import Embedder

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

class ClusterAnalyser:

   def __init__(self, path_embeddings : list[tuple [str,str]], output_location: str):
      self.path_embeddings = path_embeddings
      self.output_location = output_location      

   def analyse(self, clusters: int) -> list[str]:       
   
      embeddings = []
      for path_embedding in self.path_embeddings:           
         number_array = Embedder.textToFloat (path_embedding[1])
         embeddings.append (number_array)

      logger.debug("Making cluster")
      kmeans = KMeans(n_clusters=clusters)
      kmeans.fit(embeddings)

      #for n in kmeans.labels_.

      reducer = umap.UMAP()
      logger.debug("Reducing cluster")      
      embeddings_2d = reducer.fit_transform(embeddings)

      logger.debug("Generating chart")
      fig = px.scatter(x=embeddings_2d[:, 0], y=embeddings_2d[:, 1], color=kmeans.labels_)
      fig.show()

      return embeddings

