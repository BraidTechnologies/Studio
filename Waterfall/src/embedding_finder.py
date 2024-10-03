'''Find the nearest embedding to the target text based on cosine similarity.'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
from embedder import Embedder
from workflow import PipelineItem
import logging
import numpy as np
from numpy.linalg import norm

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)


def cosine_similarity(a, b):
    result = np.dot(a, b) / (norm(a) * norm(b))
    return result


class EmbeddingFinder:
    '''Find the nearest embedding to the target text based on cosine similarity.'''

    def __init__(self, embeddings: list[float], output_location: str):

        self.embeddings = embeddings
        self.output_location = output_location

    def find_nearest(self, target_text: str) -> list[float]:
        '''
        Find the nearest embedding to the target text based on cosine similarity.

        Parameters:
        target_text (str): The text to find the nearest embedding for.

        Returns:
        list[float]: The nearest embedding to the target text.
        '''
        pipeline_item = PipelineItem()
        pipeline_item.text = target_text
        embedder = Embedder(self.output_location)
        enriched_embeddding: PipelineItem = embedder.embed(pipeline_item)

        best_similarity = 0.0
        this_similarity = 0.0
        best_match = None

        for embeddding in self.embeddings:
            this_similarity = cosine_similarity(
                embeddding, enriched_embeddding.embedding)
            if this_similarity > best_similarity:
                best_similarity = this_similarity
                best_match = embeddding

        return best_match
