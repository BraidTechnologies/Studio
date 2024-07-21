
var loaded = false;

// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {

   chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'dist/axios.min.js'
	});
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'dist/jquery-2.2.1.js'
	});
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'dist/artoo.chrome.js'
	});
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: './payload.js'
	});
});

// Listen to messages from the payload.js script and write to popout.html
chrome.runtime.onMessage.addListener(function (message) {
	
   if (message.type === "Summary")
	   document.getElementById('summarytext').innerHTML = message.text;
   if (message.type === "Classification")
	   document.getElementById('classificationtext').innerHTML = message.text;

});