```mermaid
classDiagram
    class WaterfallFramework {
        +retrieve_documents()
        +process_contents()
        +generate_reports()
        +send_notifications()
    }

    class WaterfallPipeline {
        +retrieve_documents()
        +generate_summaries()
        +calculate_embeddings()
        +perform_clustering()
        +generate_reports()
        +send_email_summaries()
    }

    class BoxerPipeline {
        +download_content()
        +chunk_documents()
        +generate_summaries()
        +calculate_embeddings()
        +power_semantic_search()
    }

    class Chunker {
        +chunk_documents()
    }

    class ClusterAnalyser {
        +perform_clustering(PipelineItem[])
    }

    class DbRepository {
        +save(PipelineItem)
        +find(path)
        +exists(path)
    }

    class Embedder {
        +generate_embeddings(text)
    }

    class EmbeddingFinder {
        +find_nearest_embedding(target_text)
    }

    class FileRespository {
        +save(path, text)
        +load(path)
        +exists(path)
    }

    class HtmlFileDownloader {
        +download_html_content(url)
    }

    class HtmlLinkCrawler {
        +crawl_web_links(url)
    }

    class Summariser {
        +generate_summary(text)
    }

    class ThemeFinder {
        +identify_themes(paragraphs)
    }

    class WebSearcher {
        +search_web(query)
    }

    class YoutubePlaylistSearcher {
        +search_playlists(playlist)
    }

    class YouTubeTranscriptChunker {
        +chunk_transcript(transcript)
    }

    class YouTubeTranscriptDownloader {
        +download_transcript(video_id)
    }

    WaterfallFramework --|> WaterfallPipeline
    WaterfallFramework --|> BoxerPipeline

    WaterfallPipeline --> Chunker
    WaterfallPipeline --> ClusterAnalyser
    WaterfallPipeline --> DbRepository
    WaterfallPipeline --> Embedder
    WaterfallPipeline --> EmbeddingFinder
    WaterfallPipeline --> FileRespository
    WaterfallPipeline --> HtmlFileDownloader
    WaterfallPipeline --> HtmlLinkCrawler
    WaterfallPipeline --> Summariser
    WaterfallPipeline --> ThemeFinder
    WaterfallPipeline --> WebSearcher
    WaterfallPipeline --> YoutubePlaylistSearcher
    WaterfallPipeline --> YouTubeTranscriptChunker
    WaterfallPipeline --> YouTubeTranscriptDownloader

    BoxerPipeline --> YoutubePlaylistSearcher
    BoxerPipeline --> YouTubeTranscriptDownloader
    BoxerPipeline --> YouTubeTranscriptChunker
    BoxerPipeline --> HtmlLinkCrawler
    BoxerPipeline --> HtmlFileDownloader
    BoxerPipeline --> Summariser
    BoxerPipeline --> Embedder
```