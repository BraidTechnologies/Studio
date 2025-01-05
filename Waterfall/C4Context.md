C4Context
    ...mermaid
    title System Context diagram for Cascade and Waterfall Systems

    System_Boundary(s0, "User") {
        Person(user, "User", "A user wanting to process and analyze content")
    }

    System_Boundary(s1, "Systems") {
        System(cascade, "Cascade System", "Chrome extension for web scraping and content analysis")
        System(waterfall, "Waterfall System", "Content processing and analysis pipeline")
    }

    System_Boundary(s2, "External APIs") {
        System_Ext(youtube, "YouTube API", "Video content and transcript service")
        System_Ext(gmail, "Gmail API", "Email service for sending reports")
        System_Ext(google_search, "Google Search API", "Web content search service")
    }
    System_Boundary(s3, "External APIs") {
        System_Ext(external_apis, "External APIs", "APIs for summarization, embedding, and classification")
    }    
    System_Boundary(s4, "Storage") {
        SystemDb(cosmos_db, "Braid Cosmos DB", "Stores processed chunks and metadata")
        SystemDb(file_system, "Local File System", "Stores temporary files and embeddings")
    }

    Rel(user, cascade, "Uses")
    Rel(user, waterfall, "Uses")
    
    Rel(cascade, external_apis, "Sends content for processing")
    
    Rel(waterfall, youtube, "Fetches videos and transcripts")
    Rel(waterfall, google_search, "Performs web searches")
    Rel(waterfall, gmail, "Sends reports")
    Rel(waterfall, external_apis, "Processes content")
    Rel(external_apis, cosmos_db, "Stores processed data")
    Rel(waterfall, file_system, "Stores temporary data")
    ...
