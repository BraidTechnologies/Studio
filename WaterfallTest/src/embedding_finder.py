# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import numpy as np
from numpy.linalg import norm

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

def cosine_similarity(a, b): 
   result = np.dot(a, b) / (norm(a) * norm(b))
   return result

class EmbeddingFinder:

   def __init__(self, embeddings: list[float]):

      self.embeddings = embeddings 


   def find_nearest (self, target: list[float]) -> list[float]:       

      best_similarity = 0.0
      this_similarity = 0.0
      best_match = None
      
      for embedding in self.embeddings:       
         this_similarity = cosine_similarity(embedding, target)
         if this_similarity > best_similarity:
            best_similarity = this_similarity
            best_match = embedding

      return best_match
   

   

