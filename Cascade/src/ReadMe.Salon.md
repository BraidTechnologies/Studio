**content.ts**

This TypeScript module is designed to function as a content script in a Chrome extension for web scraping, text summarization, and content classification.

The module's key functions are `suppressUnhandledPromiseRejection` to handle unhandled promise rejections, and `startScrape` to handle the scraping, summarization, and classification processes. 

It leverages `artoo.js` for web scraping, `axios` for HTTP requests, and Chrome Extension APIs for message passing. The `startScrape` function manages text extraction using fallback strategies, enforces text length limits (100KB), and interfaces with external APIs for summarization and classification.

The module also includes error handling, progressive visual feedback, and rate limiting to enhance user experience.


**popup.js**

This module handles the extension's popup UI functionality and communication with the Braid API. Here are its key responsibilities:

## Core Functionality
- Manages user input for session keys/GUIDs through an input field
- Implements debounced input handling for both typing and paste events
- Validates session keys (checks for 36-character GUID format)
- Communicates with the Braid API to verify session validity

## Communication Channels
- Sends messages to content scripts in active tabs when valid sessions are found
- Listens for incoming messages to update the popup UI with:
  - Summary information
  - Classification information

## Technical Details
- Uses axios for API requests
- Implements debouncing through a queue system to prevent API spam
- Handles both browser and Chrome extension environments for debugging purposes
- Communicates with the Braid API endpoint at `braid-api.azurewebsites.net`

## Error Handling
- Includes basic error handling for API calls
- Gracefully handles cases where message recipients aren't available
- Validates input before making API calls

This module serves as the main controller for the extension's popup interface, managing both user input and the display of session-related information.
