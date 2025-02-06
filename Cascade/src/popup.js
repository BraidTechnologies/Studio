/*
@module Cascade/src/popup.js  

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
*/

var haveQueuedCall = false;
var mostRecent = "";

document.addEventListener('DOMContentLoaded', function() {

   var inputElement = document.getElementById('key');

   // Add an event listener for the 'change' event
   inputElement.addEventListener('input', function() {
     console.log('Input value changed to: ' + inputElement.value);

     changeHandler (inputElement.value);
   });

   // Add an event listener for the 'paste' event
   inputElement.addEventListener('paste', function() {
      // Your script to run when the input value changes
      console.log('Input value pasted to: ' + inputElement.value);
    
      changeHandler (inputElement.value);
   });

  }, false)

function attemptSummary (key) {

   // Only try if it looks like a GUID
   if (key.length !== 36) {
      haveQueuedCall = false;
      return;
   }

   var sessionQuery = 'https://braid-api.azurewebsites.net/api/checksession?session=' + mostRecent;

   axios.post(sessionQuery, {
      headers: {
         'Content-Type': 'application/json'
      }
   }).then (async (checkSessionRes) => {
      haveQueuedCall = false;
      if (checkSessionRes.status === 200) {   

         // This test allows us to run this page by opening it in broswer, which helps debugging.         
         if (chrome?.tabs) {

            // Broadcast a message to all tabs with they key - query the active tab does not seem to always work
            chrome.tabs.query({}, tabs => {

               chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {                  
                  result = chrome.tabs.sendMessage(tabs[0].id, {type: "Key", text: mostRecent});

                  result
                  .then (() => {})
                  .catch (()=> {}); // swallow the exception case where there is no recieved               
               });
            });
         };            
      }
   })
   .catch ((e) => {
      haveQueuedCall = false;
      console.error (e);
   });
}

function changeHandler(value) {
   
   console.log (value);
   mostRecent = value;

   if (!haveQueuedCall) {

      haveQueuedCall = true;

      setTimeout (() => {

         attemptSummary (mostRecent);  
   
      }, 500);
   } 
}

// Inject the content.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
});

// Listen to messages from the payload.js script and write to popup.html
// This test allows us to run this page by opening it in broswer, which helps debugging. 
if (chrome?.extension) {

   chrome.runtime.onMessage.addListener(function (message) {
	
      if (message.type === "Summary")
	      document.getElementById('summarytext').innerHTML = message.text;
      if (message.type === "Classification")
	      document.getElementById('classificationtext').innerHTML = message.text;

   });
}