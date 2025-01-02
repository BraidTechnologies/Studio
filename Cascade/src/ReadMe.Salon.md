**content.ts**

The module `Cascade/src/content.ts` is a TypeScript script for a Chrome extension focused on web scraping, text summarization, and content classification.

**Global Variables:**
- `haveStartedScrape` prevents concurrent scraping operations.
- External integrations: `artoo`, `chrome`, `axios`.

**Key Functions:**
1. `suppressUnhandledPromiseRejection(event)`: Handles unhandled promise rejections, resets scraping state, and sends error messages.
2. `startScrape(key)`: Manages the entire scraping, summarization, and classification process, utilizing web scraping for text extraction, enforcing text length limits, and communicating with external summarize and classify APIs.

**Message Handling:**
- Listens for messages to initiate scraping.
- Prevents concurrent operations for efficiency and stability.

**Error Handling:**
- Comprehensive error handling for API and operational failures with user feedback.

**Dependencies:**
- Uses Artoo.js for web scraping, Axios for HTTP requests, and Chrome Extension APIs for communication.

