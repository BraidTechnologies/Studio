```mermaid
classDiagram

class SystemBoundary {
    Container_Waterfall_Pipeline --> SystemWaterfall
    Container_Boxer_Pipeline --> SystemWaterfall
}

class SystemComponent {
    %% Components within Waterfall Pipeline
    class WebSearcher {
        search(query)
    }
    class Summariser {
        summarise(text)
    }
    class Embedder {
        embed(text)
    }
    class ClusterAnalyser {
        analyse(embeddings)
    }
    class EmailNotifier {
        sendEmails(reports)
    }

    %%Components within Boxer Pipeline
    SystemBoxerPipeline

    class YouTubePlaylistSearcher {
        search(playlists)
    }
    class YouTubeTranscriptDownloader {
        downloadTranscripts(video)
    }
    class YouTubeTranscriptChunker {
        chunk(transcript)
    }
    class HtmlLinkCrawler {
        crawl(url)
    }
    class HtmlFileDownloader {
        download(url)
    }
    class SaveChunks {
        savePipelineItemsToJson(items)
    }

    %%Re-Used Components
    class DbRepository {
        save(item)
    }
}

SystemBoundary -- Container_Waterfall_Pipeline : Pipeline

class WaterfallPipeline {
    WebSearcher
    Summariser
    Embedder
    ClusterAnalyser
    EmailNotifier
    DbRepository
}

Container_Waterfall_Pipeline --> SystemComponent : Components

SystemBoundary -- Container_Boxer_Pipeline : Pipeline

class BoxerPipeline {
    YouTubePlaylistSearcher
    YouTubeTranscriptDownloader
    YouTubeTranscriptChunker
    HtmlLinkCrawler
    HtmlFileDownloader
    Summariser
    Embedder
    SaveChunks
    DbRepository
}

Container_Boxer_Pipeline --> SystemComponent : Components
```