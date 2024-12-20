**content.ts**

This TypeScript module is designed to function as a content script in a Chrome extension for web scraping, text summarization, and content classification.

The module's key functions are `suppressUnhandledPromiseRejection` to handle unhandled promise rejections, and `startScrape` to handle the scraping, summarization, and classification processes. 

It leverages `artoo.js` for web scraping, `axios` for HTTP requests, and Chrome Extension APIs for message passing. The `startScrape` function manages text extraction using fallback strategies, enforces text length limits (100KB), and interfaces with external APIs for summarization and classification.

The module also includes error handling, progressive visual feedback, and rate limiting to enhance user experience.

