```mermaid
flowchart TB
  subgraph WaterfallFramework
    direction TB
    WFP[Waterfall Pipeline]
    BP[Boxer Pipeline]

    WFP -->|Uses| GSAPI[Google Search API]
    WFP -->|Generates| SUM[Summaries]
    WFP -->|Calculates| EMB[Embeddings]
    WFP -->|Performs| CLU[Clustering]
    WFP -->|Generates| IAR[Interactive Analysis Reports]
    WFP -->|Sends Email Summaries| EMA[Email Summaries]

    BP -->|Downloads| YTPS[YouTube Playlists]
    BP -->|Processes| WURL[Web URLs]
    BP -->|Chunks| DOCSEG[Document Segments]
    BP -->|Generates| SUM2[Summaries]
    BP -->|Embeds| EMB2[Embeddings]
    BP -->|Powers| BIF[Boxer Interface]

    subgraph BoxerPipeline
      direction TB
      YTPS --> YTS[YTube Transcript Downloader]
      YTS --> YTC[YTube Transcript Chunker]
      WURL --> HLK[HTML Link Crawler]
      HLK --> HFD[HTML File Downloader]
      SUM2 --> EMB2
    end

    subgraph KeyModules
      direction TB
      KR[Chunker]
      KR --> CLU2[Cluster Analyser]
      KR --> DBA[DB Repository]
      KR --> EMBE[Embedder]
      KR --> FIND[Embedding Finder]
      KR --> FR[File Repository]
      KR --> HFD2[HTML File Downloader]
      KR --> HLK2[HTML Link Crawler]
      KR --> SUMM[Summariser]
      KR --> WR[Web Searcher]
      KR --> YPS[YouTube Playlist Searcher]
      KR --> YTC2[YTube Transcript Chunker]
      KR --> YTD[YTube Transcript Downloader]
    end

    EMA -->|Sends via| GM[Google Mailer]
    IAR --> RPT[Reports]
    RPT -->|Reporting as| SHT[HTML/JSON Formats]
    YTC2 -> KR
    UV[University Content] -- Input --> WFP & BP
    ART[Articles] -- Input --> WFP & BP
    DOC[Documentation] -- Input --> WFP & BP
    VID[Video Content] -- Input --> WFP & BP
  end

```