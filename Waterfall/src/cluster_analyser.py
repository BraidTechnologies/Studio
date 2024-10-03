'''PipelineStep to analyse a set of embedding vectors by KMeans clustering'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
from sklearn.cluster import KMeans

from workflow import PipelineItem, PipelineStep

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)


class ClusterAnalyser (PipelineStep):
    '''PipelineStep that analyses a set of embedding vectors by KMeans clustering'''

    def __init__(self, output_location: str, clusters: int):
        '''
        Initializes the ClusterAnalyser object with the provided output location and target cluster count
        '''
        super(ClusterAnalyser, self).__init__(output_location)
        self.clusters = clusters

    def analyse(self, items: list[PipelineItem]) -> list[PipelineItem]:
        '''
        Analyzes the given clusters using KMeans clustering algorithm.

        Parameters:
           items: a set of Pipeline items to analyse

        Returns:
           list[PipelineItem]: A list of PipelineItem objects with updated cluster assignments.
        '''
        
        x = len (items[0].embedding)
        y = len (items)

        embeddings = [[0 for _ in range(x)] for _ in range(y)]
        for i, item in enumerate (items):
            embeddings[i] = item.embedding

        logger.debug('Making cluster')
        kmeans = KMeans(n_clusters=self.clusters)
        kmeans.fit(embeddings)

        for i, item in enumerate(items):
            item.cluster = int(kmeans.labels_[i])

        return items
