/*
@module Cascade/src/content.ts

## Overview
This TypeScript module serves as a content script for a Chrome extension that performs web scraping, text summarization, and content classification. It runs in the context of web pages and communicates with both the extension's background script and an external API service.

## Key Features
- Web scraping of text content from various HTML elements (paragraphs, headers, and divs)
- Progressive text summarization with visual feedback
- Content classification into predefined categories
- Error handling for unhandled promise rejections
- Rate limiting and text length restrictions
- Message passing between extension components

## Main Components

### Global Variables
- `haveStartedScrape`: Boolean flag to prevent concurrent scraping operations
- External declarations for `artoo`, `chrome`, and `axios` APIs

### Key Functions
1. `suppressUnhandledPromiseRejection(event)`
   - Handles unhandled promise rejections
   - Resets scraping state
   - Sends error messages to the background script

2. `startScrape(key)`
   - Main scraping function that orchestrates the entire process
   - Implements progressive feedback for long-running operations
   - Manages API calls for summarization and classification
   - Handles text extraction with fallback strategies
   - Enforces text length limits (100KB)

### Message Handling
- Listens for messages from the extension's popup
- Responds to "Key" type messages to initiate scraping
- Prevents concurrent scraping operations

## API Integration
Communicates with external API endpoints:
- `/api/summarize` - Text summarization
- `/api/classify` - Content classification into categories (Business, Technology, Politics, Health, Sport)

## Error Handling
- Comprehensive error handling for API calls
- Graceful degradation when scraping fails
- User feedback for all error states
- Prevention of concurrent operations

## Dependencies
- Artoo.js for web scraping
- Axios for HTTP requests
- Chrome Extension APIs for message passing

*/
declare var artoo: any;
declare var chrome: any;
declare var axios: any;

let haveStartedScrape = false;

/**
 * Function to handle unhandled promise rejections by logging a warning message,
 * resetting a flag 'haveStartedScrape' to false, and sending error messages to the background script.
 * Also prevents the default handling of the rejection event.
 * 
 * @param event - The PromiseRejectionEvent object containing information about the unhandled promise rejection.
 */
function suppressUnhandledPromiseRejection (event: PromiseRejectionEvent) {
   console.warn(`Unhandled promise rejection: ${event.reason}`); 
 
   haveStartedScrape = false;

   chrome.runtime.sendMessage({type: "Summary", text: "Sorry, we encountered an error reading this page."}); 
   chrome.runtime.sendMessage({type: "Classification", text: "Sorry, we encountered an error reading this page."}); 

   // Prevent the default handling (such as outputting the
   // error to the console)
   event.preventDefault();
}


/**
 * Function that performs a series of actions to summarize and classify text content.
 * It periodically sends messages to the Chrome runtime for summarization and classification progress.
 * Retrieves text content from the webpage, summarizes it using an external API, and then classifies the summary.
 * Utilizes internal organization modules for scraping, summarization, and classification.
 * @param key - A string key used for internal operations.
 */
function startScrape (key: string) : void {

    let NN = 1024*100; // we only have an 8k buffer, 100k string is 12 calls to LLM then another to summarise that. 
    let haveSummary = false;
    let baseSummaryText = "Summarising ...";
    let haveClassification = false;
    let baseClassificationText = "Classifying ...";
    let allText = "";

    // This interval loop sends progress messages 
    let interval = setInterval (() => {

      if (!haveSummary || !haveClassification) {

         if (!haveSummary) {
            baseSummaryText = baseSummaryText + ".";
            chrome.runtime.sendMessage({type: "Summary", text: baseSummaryText});       
         }

         if (!haveClassification) {
            baseClassificationText = baseClassificationText + ".";
            chrome.runtime.sendMessage({type: "Classification", text: baseClassificationText});       
         }

      }
      else {
         clearInterval (interval);
      }
    }, 1000);

    // This timeout does the actual scrape  
    setTimeout (() => {

      try {
         window.addEventListener("unhandledrejection", suppressUnhandledPromiseRejection);

         // First try to get all plain text, if that doesnt work, get the headers
         // If that doesnt work, scarape all divs (like 'the guardian' website)
         var scraped = artoo.scrape('p', 'text');
         if (scraped.length === 0) {
            for (var i = 0; i < 6; i++) {
               scraped = scraped = artoo.scrape('h' + i.toString(), 'text');
            }
         }
         if (scraped.length === 0) {
            scraped = artoo.scrape('div', 'text');
         }       
      
         allText = scraped.join(' \n');

         if (allText.length > NN) 
            allText = allText.substring(0, NN);

         window.removeEventListener("unhandledrejection", suppressUnhandledPromiseRejection);         
      }
      catch {
         window.removeEventListener("unhandledrejection", suppressUnhandledPromiseRejection);          
         allText = "";
      }

      var summarizeQuery = 'https://braid-api.azurewebsites.net/api/summarize?session=' + key.toString();
      var classifyQuery = 'https://braid-api.azurewebsites.net/api/classify?session=' + key.toString();

      axios.post(summarizeQuery, {
         request: {
            text: allText
         },
         headers: {
            'Content-Type': 'application/json'
         }
      }).then ((summaryRes: any) => {
         haveSummary = true;          
         if (summaryRes.status === 200) {
            chrome.runtime.sendMessage({type: "Summary", text: summaryRes.data.summary});
            var classifications = ["Business", "Technology", "Politics", "Health", "Sport"];

            axios.post(classifyQuery, {
               request: {
                  text: summaryRes.data.summary,
                  classifications: classifications
               },
               headers: {
                  'Content-Type': 'application/json'
               }
            }).then ((classifyRes: any) => {
               haveClassification = true;          
               if (classifyRes.status === 200) {
                  chrome.runtime.sendMessage({type: "Classification", text: classifyRes.data.classification});
               } 
               else {
                  chrome.runtime.sendMessage({type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server."}); 
               }
               // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
               haveStartedScrape = false;
            })
            .catch ((e : any) => {     
               haveClassification = true;  
               console.error (e);   
               chrome.runtime.sendMessage({type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server."});  
               // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
               haveStartedScrape = false;

            });        
         } 
         else {
            haveSummary = true;  
            haveClassification = true;   
            chrome.runtime.sendMessage({type: "Summary", text: "Sorry, could not fetch a summary from the Waterfall server."}); 
            chrome.runtime.sendMessage({type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server."}); 
            // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
            haveStartedScrape = false;

         }
      })
      .catch ((e: any) => {     
         haveSummary = true;  
         haveClassification = true;
         console.error (e);   
         chrome.runtime.sendMessage({type: "Summary", text: "Sorry, could not fetch a summary from the Waterfall server."});                 
         chrome.runtime.sendMessage({type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server."}); 
         // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
         haveStartedScrape = false;

      });   

    }, 500);

}


// Listen to messages from the popup.js script 
chrome.runtime.onMessage.addListener(function (message: any) {
	

   if (message.type === "Key" && !haveStartedScrape) {
      haveStartedScrape = true;
      startScrape (message.text);
   }
});    


//startScrape ("49b65194-26e1-4041-ab11-4078229f478a");