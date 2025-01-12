```mermaid
flowchart TB
    User["User"]
    
    subgraph Waterfall ["Waterfall"]
        subgraph WaterfallPipeline
            WS["WebSearcher"]
            HFDownloader["HtmlFileDownloader"]
            Sum["Summariser"]
            SFS["SummariseFailSuppressor"]
            Emb["Embedder"]
            CAnalyser["ClusterAnalyser"]
            TF["ThemeFinder"]
            EF["EmbeddingFinder"]
        end
        
        subgraph BoxerPipeline
            YTSearcher["YoutubePlaylistSearcher"]
            YTDownloader["YouTubeTranscriptDownloader"]
            YTC["YouTubeTranscriptChunker"]
            HLCrawler["HtmlLinkCrawler"]
            HFDownloader_B["HtmlFileDownloader"]
            Sum_B["Summariser"]
            Emb_B["Embedder"]
        end
        
        Chunker["Chunker"]
        DBRepo["DbRepository"]
        FRepo["FileRepository"]
        MWMailer["Google Office Mailer"]
        SummaryRepo["Summary Repository"]
        EmbFinder["Embedding Finder"]
        
        User --> WaterfallPipeline
        User --> BoxerPipeline
        WaterfallPipeline --> Chunker
        WaterfallPipeline --> SummaryRepo
        WaterfallPipeline --> DBRepo
        WaterfallPipeline --> EmbFinder
        WaterfallPipeline --> FRepo
        WaterfallPipeline --> MWMailer
        BoxerPipeline --> SummaryRepo
        BoxerPipeline --> DBRepo
        BoxerPipeline --> Chunker
        BoxerPipeline --> EmbFinder
        
        WS --> HFDownloader
        HFDownloader --> Sum
        Sum --> SFS
        SFS --> Emb
        Emb --> CAnalyser
        CAnalyser --> TF
        TF --> EF
        
        YTSearcher --> YTDownloader
        YTDownloader --> YTC
        YTC --> HLCrawler
        HLCrawler --> HFDownloader_B
        HFDownloader_B --> Sum_B
        Sum_B --> Emb_B
    end
```

This diagram represents the context of the Waterfall framework and its main components. Each pipeline and module are grouped within their respective containers. Key interactions between users and the framework, as well as between components, are illustrated to provide a clear understanding of the system.