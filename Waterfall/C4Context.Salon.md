```mermaid
C4Context
title Waterfall System Context

Person(Developer, "User") <--> System

System_Boundary(Waterfall, "Waterfall") {
    SystemComponent(Boxer_Pipeline, "Boxer Pipeline", "Builds a knowledge base using web and YouTube content")
    SystemComponent(Waterfall_Pipeline, "Waterfall Pipeline", "Core pipeline for document processing and analysis using AI")
    SystemComponent(Waterfall_Components, "Components") {
        Component(Google_Search_API, "Google Search API", "Retrieves documents")
        Component(Summariser, "Summariser", "Generates summaries")
        Component(Embedder, "Embedder", "Generates embeddings")
        Component(YoutubePlaylistSearcher, "YouTubePlaylistSearcher", "Searches YouTube playlists")
        Component(HtmlLinkCrawler, "HtmlLinkCrawler", "Crawls HTML links")
        Component(HtmlFileDownloader, "HtmlFileDownloader", "Downloads HTML files")
        Component(YouTubeTranscriptDownloader, "YouTubeTranscriptDownloader", "Downloads YouTube transcripts")
        Component(YouTubeTranscriptChunker, "YouTubeTranscriptChunker", "Chunks YouTube transcripts")
    }
    SystemComponent(Boxer_Interface, "Boxer Interface", "Enables semantic search using processed knowledge base")
    SystemComponent(Email_Notifications, "Email Notifications", "Sends summarized insights to leadership")
}

Developer --> Boxer_Pipeline
Developer --> Waterfall_Pipeline
Waterfall_Pipeline --> Google_Search_API
Waterfall_Pipeline --> Summariser
Waterfall_Pipeline --> Embedder
Boxer_Pipeline --> YoutubePlaylistSearcher
Boxer_Pipeline --> HtmlLinkCrawler
Boxer_Pipeline --> HtmlFileDownloader
Boxer_Pipeline --> YouTubeTranscriptDownloader
Boxer_Pipeline --> YouTubeTranscriptChunker
Boxer_Pipeline --> Summariser
Boxer_Pipeline --> Embedder
Boxer_Pipeline --> Boxer_Interface
Boxer_Pipeline --> Email_Notifications
```