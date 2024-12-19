**content.ts**

This TypeScript module functions as a content script for a Chrome extension, handling web scraping, text summarization, and content classification. It interacts with web pages and communicates with both the extension's background script and an external API service.

Key functions include `suppressUnhandledPromiseRejection` for managing unhandled promise rejections and sending error messages, and `startScrape` to orchestrate the entire scraping and summarization process, including API calls for text summarization and classification.

It uses global variables like `haveStartedScrape` to manage the scraping process and prevent concurrent operations. Dependencies include Artoo.js, Axios, and Chrome Extension APIs. The module includes comprehensive error handling and user feedback mechanisms.

