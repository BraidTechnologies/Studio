```mermaid
C4Context
title Waterfall System - C4 Container Diagram

Container_Boundary(mobileApp, "Waterfall Framework") {
    
    Container(WaterfallPipeline, "Waterfall Pipeline", "Python", "Core AI enrichment pipeline for document processing and analysis")
    Container(BoxerPipeline, "Boxer Pipeline", "Python", "Knowledge base and semantic search pipeline")
    Container(GoogleSearchAPI, "Google Search API", "External API", "Retrieves documents based on queries")
  
    Container_Boundary(AIProcessing, "AI Processing Components") {
        Container(Chunker, "Chunker", "Python", "Segments text into chunks")
        Container(ClusterAnalyser, "ClusterAnalyser", "Python", "Performs KMeans clustering on document embeddings")
        Container(DbRepository, "DbRepository", "Python", "Stores data in Chunk table of BraidApis database")
        Container(Embedder, "Embedder", "Python", "Creates text embeddings")
        Container(FileRespository, "FileRespository", "Python", "Manages file storage in the local system")
        Container(HtmlFileDownloader, "HtmlFileDownloader", "Python", "Downloads and processes HTML content")
        Container(HtmlLinkCrawler, "HtmlLinkCrawler", "Python", "Crawls web pages to extract sub-links")
        Container(Summariser, "Summariser", "Python", "Creates summaries for texts")
        Container(YouTubeTranscriptDownloader, "YouTubeTranscriptDownloader", "Python", "Downloads YouTube transcripts for videos")
        Container(YouTubeTranscriptChunker, "YouTubeTranscriptChunker", "Python","Breaks down transcripts into chunks")
        Container(YoutubePlaylistSearcher, "YoutubePlaylistSearcher", "Python", "Gathers YouTube video information")
        Container(WebSearcher, "WebSearcher", "Python", "Uses Google Custom Search Engine API for URL retrieval")
    }

    Container_Boundary(BoxerComponents, "Boxer Specific Components") {
        Container(EmbeddingFinder, "EmbeddingFinder", "Python", "Computes nearest text embedding using cosine similarity for semantic search")
    }
}

Container_Boundary(Reporting, "Reporting and Notifications") {
    Container(EmailModule, "Email Module", "Python", "Sends automated email reports")
    Container(HTMLReport, "HTML Report Generator", "Python", "Generates HTML reports")
    Container(JSONReport, "JSON Report Generator", "Python", "Generates JSON reports")
}

Person(User, "End User", "User interacting with the Waterfall system application")
Person(Leadership, "Leadership", "Receives summarized reports and notifications")

Rel(User, WaterfallPipeline, "Interacts with")
Rel(User, BoxerPipeline, "Uses for knowledge base and semantic search")
Rel(WaterfallPipeline, GoogleSearchAPI, "Retrieves documents using")
Rel(WaterfallPipeline, AIProcessing, "Uses components of")
Rel(WaterfallPipeline, Reporting, "Generates reports with")
Rel(BoxerPipeline, AIProcessing, "Uses for text summarization and embedding generation")
Rel(BoxerPipeline, BoxerComponents, "Uses for embedding and semantic search")
Rel(Reporting, Leadership, "Sends email notifications and reports to")

  
```