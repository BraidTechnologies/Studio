**Waterfall** is a Python framework for processing documents through an AI enrichment pipeline. 
# Waterfall

**Waterfall** is a Python framework for processing documents through an AI enrichment pipeline. It provides automated document processing, enrichment, and analysis capabilities through two main pipelines.

## Key Features

- Document retrieval from multiple sources (Google Search API, web URLs, YouTube playlists)
- Text summarization using AI models
- Embedding generation for semantic search and clustering
- Automated cluster analysis and reporting
- Email notifications with insights
- Integration with Boxer search interface

## Main Components

### 1. Waterfall Pipeline
The core Waterfall pipeline handles document processing and analysis:

- Retrieves documents via Google Search API for configured sources
- Generates AI-powered summaries of documents
- Calculates document embeddings for semantic analysis  
- Performs clustering to group related content
- Generates interactive analysis reports
- Sends email summaries to leadership

### 2. Boxer Pipeline
The Boxer pipeline builds the knowledge base:

- Downloads and processes content from:
  - Configured web URLs (full page content)
  - YouTube playlists (video transcripts)
- Chunks documents into processable segments
- Generates summaries and embeddings
- Powers semantic search functionality in Boxer interface

## Source Materials

The system processes curated educational content focused on AI/ML topics including:

- University course content (Stanford CS229, CS224N)
- Industry expert articles and tutorials
- Technical documentation
- Educational video content

See [boxer_sources.py](src/boxer_sources.py) for the full list of source materials.

