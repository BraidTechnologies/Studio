```mermaid
graph LR
subgraph Document Processing and Enrichment
  subgraph Boxer Data Pipeline
    BoxerDataPipeline[Boxer Data Pipeline]
    __init___[Input: output_location]
    search[Main Task]
    FileRespository[File Repository]
    GoogleOfficeMailer[Google Mail API]
    HtmlFileDownloader[HTML File Downloader]
    HtmlLinkCrawler[HTML Link Crawler]
    Summariser[Summariser]
    Embedder[Embedder]
    EmbedderRepositoryFacade[Embedding Repository Facade]
  end
  subgraph Boxer Sources
    BoxerSources[Educational Resources]
    YouTubePlaylists[YouTube Playlists]
    WebPages[Web Pages]
  end
  subgraph Chunker
    Chunker[Text Chunker]
    __init___[Input: output_location]
    chunk[Chunk Task]
  end
  subgraph Cluster Analyser
    ClusterAnalyser[Cluster Analyser]
    __init___[Input: output_location, num_clusters]
    analyse[Analyse Task]
  end
  subgraph DB Repository
    DbRepository[Database Repository]
    __init___[Input: application_id, context_id]
    save[Save Task]
    find[Find Task]
    exists[Exists Task]
  end
  subgraph Embedder
    Embedder[Embedder]
    __init___[Input: output_location]
    embed[Embed Task]
    embed_text[Embed Text Task]
  end
  subgraph Embedding Finder
    EmbeddingFinder[Embedding Finder]
    __init___[Input: embeddings, output_location]
    find_nearest[Find Nearest Task]
  end
  subgraph File Repository
    FileRepository[File Repository]
    __init___[Input: output_location]
    save[Save Task]
    load[Load Task]
    exists[Exists Task]
  end
  subgraph Google Office Mailer
    GoogleOfficeMailer[Google Office Mail API]
    send_mail[]
    send_message_with_attachment[]
    build_file_part[]
  end
  subgraph HTML File Downloader
    HtmlFileDownloader[HTML File Downloader]
    __init___[Input: output_location]
    download[Download Task]
  end
  subgraph HTML Link Crawler
    HtmlLinkCrawler[HTML Link Crawler]
    __init___[Input: output_location, max_depth]
    crawl[Crawl Task]
    crawl_links_recursively[Crawl Links Recursively Task]
    find_matching_entry[Find Matching Entry Task]
    deduplicate[Deduplicate Task]
    remove_exits[Remove Exits Task]
    add_prefix[Add Prefix Task]
    make_fully_qualified_path[Make Fully Qualified Path Task]
  end
  subgraph Make Local File Path
    MakeLocalFilePath[Local File Path Maker]
    make_local_file_path[Make Local File Path Task]
  end
  subgraph Summariser
    Summariser[Summariser]
    __init___[Input: output_location]
    summarise[Summarise Task]
  end
  subgraph Summarise Fail Suppressor
    SummariseFailSuppressor[Summarise Fail Suppressor]
    __init___[Input: output_location]
    should_suppress[Should Suppress Task]
  end
  subgraph Summary Repository Facade
    SummaryRepositoryFacade[Summary Repository Facade]
    __init___[Input: output_location]
    save[Save Task]
    load[Load Task]
    exists[Exists Task]
  end
  subgraph Text Repository Facade
    TextRepositoryFacade[Text Repository Facade]
    __init___[Input: output_location]
    save[Save Task]
    load[Load Task]
    exists[Exists Task]
  end
  subgraph Theme Finder
    ThemeFinder[Theme Finder]
    __init___[]
    find_theme[Find Theme Task]
  end
end
subgraph Workflow
  subgraph Waterfall Pipeline
    WaterfallDataPipeline[Waterfall Data Pipeline]
    __init___[Input: output_location]
    search_dynamic[Search Dynamic Task]
    search_static[Search Static Task]
    search_and_cluster[Search and Cluster Task]
    cluster_from_files[Cluster From Files Task]
    cluster[Cluster Task]
    create_themes[Create Themes Task]
    create_report[Create Report Task]
  end
  subgraph Waterfall Pipeline Report
    WaterfallPipelineReport[Waterfall Pipeline Report]
    __init___[]
    create_mail_report[Create Mail Report Task]
  end
  subgraph Waterfall Pipeline Report Common
    WaterfallPipelineReportCommon[Waterfall Pipeline Report Common]
    write_chart[Write Chart Task]
    write_details_json[Write Details JSON Task]
  end
  subgraph Waterfall Pipeline Save Chunks
    WaterfallPipelineSaveChunks[Waterfall Pipeline Save Chunks]
    set_timestamps[Set Timestamps Task]
    create_theme_chunk[Create Theme Chunk Task]
    save_chunks[Save Chunks Task]
    save_chunk_tree[Save Chunk Tree Task]
  end
  subgraph Waterfall Survey Pipeline
    WaterfallSurveyPipeline[Waterfall Survey Pipeline]
    set_timestamps[Set Timestamps Task]
    create_theme_chunk[Create Theme Chunk Task]
    save_chunks[Save Chunks Task]
    save_chunk_tree[Save Chunk Tree Task]
  end
  subgraph Web Searcher
    WebSearcher[Web Searcher]
    __init___[Input: output_location]
    search[Search Task]
  end
  subgraph Workflow
    Freezable[Freezable]
    PipelineItem[Pipeline Item]
    Theme[Theme]
    PipelineStep[Pipeline Step]
    PipelineSpec[Pipeline Spec]
    WebSearchPipelineSpec[Web Search Pipeline Spec]
    YouTubePipelineSpec[YouTube Pipeline Spec]
    HtmlDirectedPipelineSpec[HTML Directed Pipeline Spec]
    FileDirectedPipelineSpec[File Directed Pipeline Spec]
    PipelineFileSpec[Pipeline File Spec]
  end
  subgraph YouTube Searcher
    YouTubeSearcher[YouTube Searcher]
    __init___[Input: output_location]
    search[Search Task]
  end
  subgraph YouTube Transcript Chunker
    YouTubeTranscriptChunker[YouTube Transcript Chunker]
    __init___[Input: output_location]
    chunk[Chunk Task]
  end
  subgraph YouTube Transcript Downloader
    YouTubeTranscriptDownloader[YouTube Transcript Downloader]
    __init___[Input: output_location]
    download[Download Task]
  end
end
```