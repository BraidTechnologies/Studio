# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
from sklearn.cluster import KMeans

from workflow import PipelineItem

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

class ClusterAnalyser:

   def __init__(self, items : list[PipelineItem], output_location: str):
      self.items = items
      self.output_location = output_location      

   def analyse(self, clusters: int) -> list[str]:       
   
      embeddings = []
      for item in self.items:           
         embeddings.append (item.embedding_as_float)

      logger.debug("Making cluster")
      kmeans = KMeans(n_clusters=clusters)
      kmeans.fit(embeddings)

      return kmeans.labels_

