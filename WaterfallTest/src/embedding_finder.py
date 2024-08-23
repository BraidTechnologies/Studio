# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import numpy as np
from numpy.linalg import norm

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

from workflow import PipelineItem
from embedder import Embedder

def cosine_similarity(a, b): 
   result = np.dot(a, b) / (norm(a) * norm(b))
   return result

class EmbeddingFinder:

   def __init__(self, embeddings: list[float], output_location: str):

      self.embeddings = embeddings 
      self.output_location = output_location


   def find_nearest (self, target_text: str) -> list[float]:       

      pipeline_item = PipelineItem()
      pipeline_item.text = target_text
      embedder = Embedder (self.output_location)
      enriched_embeddding : PipelineItem = embedder.embed (pipeline_item)

      best_similarity = 0.0
      this_similarity = 0.0
      best_match = None
      
      for embeddding in self.embeddings:       
         this_similarity = cosine_similarity(embeddding, enriched_embeddding.embedding_as_float)
         if this_similarity > best_similarity:
            best_similarity = this_similarity
            best_match = enriched_embeddding.embedding_as_float

      return best_match
   

   

