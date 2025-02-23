```mermaid
graph LR
subgraph Waterfall Pipeline
    PipelineItem --> Chunker --> ClusterAnalyser --> ThemeFinder --> Summariser --> Embedder
    PipelineItem --> DbRepository
    PipelineItem --> FileRespository
    PipelineItem --> HtmlFileDownloader
    PipelineItem --> HtmlLinkCrawler
    PipelineItem --> WebSearcher
    PipelineItem --> YoutubePlaylistSearcher --> YoutubeTranscriptChunker --> YoutubeTranscriptDownloader
end

subgraph Boxer Pipeline
    PipelineItem --> HtmlLinkCrawler --> HtmlFileDownloader
    PipelineItem --> YoutubePlaylistSearcher --> YoutubeTranscriptChunker --> YoutubeTranscriptDownloader
    PipelineItem --> Summariser --> Embedder
end
```