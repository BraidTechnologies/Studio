```mermaid
graph LR

subgraph Pipeline [Pipeline]
    boxer_pipeline.py
    chunker.py
    cluster_analyser.py
    db_repository.py
    embedder.py
    embedder_repository_facade.py
    embedding_finder.py
    file_repository.py
    google_office_mailer.py
    html_file_downloader.py
    html_link_crawler.py
    make_local_file_path.py
    summariser.py
    summarise_fail_suppressor.py
    summary_repository_facade.py
    text_repository_facade.py
    theme_finder.py
    waterfall_pipeline.py
    waterfall_pipeline_report.py
    waterfall_pipeline_report_common.py
    waterfall_pipeline_save_chunks.py
    waterfall_survey_pipeline.py
    web_searcher.py
    workflow.py
    youtube_searcher.py
    youtube_transcript_chunker.py
    youtube_transcript_downloader.py
end

subgraph System [System]
    boxer_sources.py
end

subgraph External [External]
    YoutubePlaylistApi
    YouTubeTranscriptApi
    BraidApis
    Google Search API
    Google Custom Search Engine API
end

User-->Pipeline
Pipeline-->System
Pipeline-->External
System-->Pipeline
```