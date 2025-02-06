# Cascade Chrome Extension

A Chrome extension for web scraping, text summarization, and content classification. This extension helps users extract, analyze, and classify web content efficiently.

## 🚀 Features
 - Web content scraping using artoo.js
 - Text summarization
 - Content classification
 - Session-based authentication
 - Real-time visual feedback
 - Rate limiting for API calls
 - Fallback scraping strategies

## 🛠️ Technical Architecture
The extension consists of two main components:

### 1. Content Script (`content.ts`)
 Handles web scraping operations
 Manages text extraction with fallback mechanisms
 Implements text length limitations (100KB max)
 Provides visual feedback during operations
 Communicates with external APIs for processing

### 2. Popup Interface (`popup.js`)
 Manages user authentication via session keys
 Implements debounced input handling
 Validates session GUIDs (36-character format)
 Displays processing results and feedback
 Communicates with Braid API

## 🔧 Setup & Installation
1. Clone this repository
. Install dependencies (if any)
. Load the extension in Chrome:
  - Open Chrome and navigate to `chrome://extensions/`
  - Enable "Developer mode"
  - Click "Load unpacked" and select the extension directory

## 🔑 Authentication
The extension requires a valid session key (GUID format) to operate. Users must:
 Enter a 36-character session key in the popup interface
 Wait for validation from the Braid API
 Receive confirmation before proceeding with operations

## 🌐 API Integration
The extension communicates with:
 Braid API (`braid-api.azurewebsites.net`) for session validation
 External APIs for text summarization and classification

## 🔄 Message Flow
. User inputs session key in popup
. Popup validates format and communicates with Braid API
. On validation, messages are sent to content scripts
. Content script performs scraping and processing
. Results are displayed in popup interface

## ⚠️ Error Handling
. Unhandled promise rejection suppression
. Input validation
. API call error handling
. Graceful fallbacks for scraping operations
. Rate limiting protection

