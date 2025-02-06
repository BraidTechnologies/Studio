**Waterfall** is a Python framework designed for processing documents using an AI enrichment pipeline. It automates document processing, enrichment, and analysis. The system is primarily focused on curated educational content related to AI/ML.

The framework is composed of two main pipelines:
*   **Waterfall Pipeline**: This is the core pipeline, which retrieves documents using the Google Search API. It generates AI-powered summaries of these documents and calculates document embeddings for semantic analysis. It then performs clustering to group related content and generates interactive analysis reports, sending email summaries to leadership.
*   **Boxer Pipeline**: This pipeline builds a knowledge base by downloading and processing content from web URLs and YouTube playlists. It chunks documents into processable segments, generates summaries and embeddings, and powers the semantic search functionality in the Boxer interface.

Key features of Waterfall include:
*   Document retrieval from multiple sources such as the Google Search API, web URLs, and YouTube playlists.
*   Text summarisation using AI models.
*   Embedding generation for semantic search and clustering.
*   Automated cluster analysis and reporting.
*   Email notifications with insights.
*   Integration with a Boxer search interface.

The system processes a range of source materials, including:
*   University course content (e.g., Stanford CS229, CS224N).
*   Industry expert articles and tutorials.
*   Technical documentation.
*   Educational video content.

The **Boxer pipeline** specifically handles:
*   Searching for YouTube playlists and transcripts using `YoutubePlaylistSearcher` and `YouTubeTranscriptDownloader`.
*   Breaking down YouTube transcripts into chunks via `YouTubeTranscriptChunker`.
*   Crawling and downloading HTML links with `HtmlLinkCrawler` and `HtmlFileDownloader`.
*   Summarising content using the `Summariser` class.
*   Embedding the summarised content using the `Embedder` class.

Several modules contribute to Waterfall's functionality, including:
*   **Chunker**: Segments text into smaller parts.
*   **ClusterAnalyser**: Performs KMeans clustering on the embedding vectors of PipelineItem objects.
*   **DbRepository**: Stores data in the Chunk table of the BraidApis database.
*  **Embedder**: Creates text string embeddings.
*   **EmbeddingFinder**: Computes the nearest embedding to a target text using cosine similarity.
*   **FileRespository**: Stores data in the local file system.
*  **HtmlFileDownloader**: Downloads the text of a web page and saves it locally.
*   **HtmlLinkCrawler**: Crawls web pages to extract sub-links.
*   **Summariser**: Creates summaries for a given text string.
*  **ThemeFinder**: Identifies themes for given paragraphs by calling an external API.
*   **WebSearcher**: Uses the Google Custom Search Engine API to find relevant URLs.
*   **YoutubePlaylistSearcher**: Gathers information about YouTube videos from specified playlists.
*  **YouTubeTranscriptChunker**: Divides the transcript of a YouTube video into manageable chunks.
*   **YouTubeTranscriptDownloader**: Downloads the YouTube transcript of videos in a playlist.

The system also includes reporting functionalities such as:
*   Generating reports in HTML and JSON formats.
*  Sending automated reports via email.
*   Saving chunks in a hierarchical structure within the database.

Waterfall uses classes like `PipelineItem`, `Theme`, and `PipelineSpec` to manage the workflow and data. The `PipelineItem` class represents a work item, while the `Theme` class represents a documented cluster of items.

Waterfall includes various tests for its components, ensuring the proper functioning of features like:
*   Boxer pipeline, chunker, cluster analyser, database repository, embedder, embedding finder, embedding repository, file repository, html file downloader, html link crawler, summariser, summarise fail suppressor, summary repository, text repository, theme finder, waterfall pipeline, web searcher, and youtube playlist.


