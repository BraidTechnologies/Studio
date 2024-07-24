/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
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

   var sessionQuery = 'https://braidapi.azurewebsites.net/api/checksession?session=' + mostRecent;

   axios.post(sessionQuery, {
      headers: {
         'Content-Type': 'application/json'
      }
   }).then (async (checkSessionRes) => {
      haveQueuedCall = false;
      if (checkSessionRes.status === 200) {   

         // This test allows us to run this page by opening it in broswer, which helps debugging.         
         if (chrome?.tabs) {

            // Broadcast a message to all tabs with they key - query the active tab does not seem to alays work
            chrome.tabs.query({}, tabs => {

               chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {                  
                  result = chrome.tabs.sendMessage(tabs[0].id, {type: "Key", text: checkSessionRes.data});

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
var __webpack_export_target__ = window;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=popup.pack.js.map