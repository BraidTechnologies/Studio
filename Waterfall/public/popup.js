var setCall = false;
var mostRecent = "";

function changeHandler(value) {
   
   console.log (value);
   mostRecent = value;

   if (!setCall) {

      setCall = true;

      setTimeout (() => {

         var sessionQuery = 'https://braidapi.azurewebsites.net/api/checksession?session=' + mostRecent;

         axios.post(sessionQuery, {
            headers: {
               'Content-Type': 'application/json'
            }
         }).then ((checkSessionRes) => {
            setCall = false;
            if (checkSessionRes.status === 200) {
               window.localStorage.setItem ("session", checkSessionRes.data);
            }
         })
         .catch ((e) => {
            setCall = false;
            console.error (e);
         });   
   
      }, 500);
   } 
}

// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {

   chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'axios.min.js'
	});
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'jquery-2.2.1.js'
	});
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'artoo.chrome.js'
	});
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});
});

// Listen to messages from the payload.js script and write to popout.html
chrome.runtime.onMessage.addListener(function (message) {
	
   if (message.type === "Summary")
	   document.getElementById('summarytext').innerHTML = message.text;
   if (message.type === "Classification")
	   document.getElementById('classificationtext').innerHTML = message.text;

});