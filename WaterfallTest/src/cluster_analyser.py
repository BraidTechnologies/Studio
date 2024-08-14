# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
from glob import glob

from embedder_repository_facade import EmbeddingRespositoryFacade

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

class ClusterAnalyser:

   def __init__(self, paths : list[str], output_location: str):
      self.paths = paths
      self.output_location = output_location      

   def analyse(self) -> list[str]: 
      
      embeddingRepostory = EmbeddingRespositoryFacade (self.output_location)

      clusters = []
      for path in self.paths:
         embedding = embeddingRepostory.load (path)
         clusters.append (embedding)


      return clusters

