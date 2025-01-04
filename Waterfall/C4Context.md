C4Context
    title System Context diagram for Cascade and Waterfall Systems

    Person(user, "User", "A user wanting to process and analyze content")
    
    System(cascade, "Cascade System", "Chrome extension for web scraping and content analysis")
    System(waterfall, "Waterfall System", "Content processing and analysis pipeline")
    
    System_Ext(youtube, "YouTube API", "Video content and transcript service")
    System_Ext(gmail, "Gmail API", "Email service for sending reports")
    System_Ext(google_search, "Google Search API", "Web content search service")
    System_Ext(external_apis, "External APIs", "APIs for summarization, embedding, and classification")
    
    SystemDb(cosmos_db, "Braid Cosmos DB", "Stores processed chunks and metadata")
    SystemDb(file_system, "Local File System", "Stores temporary files and embeddings")

    Rel(user, cascade, "Uses")
    Rel(user, waterfall, "Uses")
    
    Rel(cascade, external_apis, "Sends content for processing")
    
    Rel(waterfall, youtube, "Fetches videos and transcripts")
    Rel(waterfall, google_search, "Performs web searches")
    Rel(waterfall, gmail, "Sends reports")
    Rel(waterfall, external_apis, "Processes content")
    Rel(waterfall, cosmos_db, "Stores processed data")
    Rel(waterfall, file_system, "Stores temporary data")
