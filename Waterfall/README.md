**Waterfall** is a Python framework for processing documents through an AI enrichment pipeline. 

There are two main pipelines:

1. **Waterfall** itself - Waterfall calls a Google search API for a given set of sources, then summarises the documents, calculates an embedding, and uses the embeddings to find clusters. It then generates an interactive report and a mail summary on the clusters, which it send to Braid leadership.
2. **Boxer** - Waterfall generates the back end database used by Boxer - it downloads a tree from a set of web URLs, and it doenloads a set of transcripts from YouTube playlists, then it chunks, summarises, and calculates embeddings for the documents. The emnbeddings are then used to enriched search in Boxer. 
