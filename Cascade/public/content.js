"use strict";
var haveStartedScrape = false;
/**
 * Function to handle unhandled promise rejections by logging a warning message,
 * resetting a flag 'haveStartedScrape' to false, and sending error messages to the background script.
 * Also prevents the default handling of the rejection event.
 *
 * @param event - The PromiseRejectionEvent object containing information about the unhandled promise rejection.
 */
function suppressUnhandledPromiseRejection(event) {
    console.warn("Unhandled promise rejection: ".concat(event.reason));
    haveStartedScrape = false;
    chrome.runtime.sendMessage({ type: "Summary", text: "Sorry, we encountered an error reading this page." });
    chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, we encountered an error reading this page." });
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
function startScrape(key) {
    var NN = 1024 * 100; // we only have an 8k buffer, 100k string is 12 calls to LLM then another to summarise that. 
    var haveSummary = false;
    var baseSummaryText = "Summarising ...";
    var haveClassification = false;
    var baseClassificationText = "Classifying ...";
    var allText = "";
    // This interval loop sends progress messages 
    var interval = setInterval(function () {
        if (!haveSummary || !haveClassification) {
            if (!haveSummary) {
                baseSummaryText = baseSummaryText + ".";
                chrome.runtime.sendMessage({ type: "Summary", text: baseSummaryText });
            }
            if (!haveClassification) {
                baseClassificationText = baseClassificationText + ".";
                chrome.runtime.sendMessage({ type: "Classification", text: baseClassificationText });
            }
        }
        else {
            clearInterval(interval);
        }
    }, 1000);
    // This timeout does the actual scrape  
    setTimeout(function () {
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
        catch (_a) {
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
        }).then(function (summaryRes) {
            haveSummary = true;
            if (summaryRes.status === 200) {
                chrome.runtime.sendMessage({ type: "Summary", text: summaryRes.data.summary });
                var classifications = ["Business", "Technology", "Politics", "Health", "Sport"];
                axios.post(classifyQuery, {
                    request: {
                        text: summaryRes.data.summary,
                        classifications: classifications
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (classifyRes) {
                    haveClassification = true;
                    if (classifyRes.status === 200) {
                        chrome.runtime.sendMessage({ type: "Classification", text: classifyRes.data.classification });
                    }
                    else {
                        chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
                    }
                    // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
                    haveStartedScrape = false;
                })
                    .catch(function (e) {
                    haveClassification = true;
                    console.error(e);
                    chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
                    // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
                    haveStartedScrape = false;
                });
            }
            else {
                haveSummary = true;
                haveClassification = true;
                chrome.runtime.sendMessage({ type: "Summary", text: "Sorry, could not fetch a summary from the Waterfall server." });
                chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
                // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
                haveStartedScrape = false;
            }
        })
            .catch(function (e) {
            haveSummary = true;
            haveClassification = true;
            console.error(e);
            chrome.runtime.sendMessage({ type: "Summary", text: "Sorry, could not fetch a summary from the Waterfall server." });
            chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
            // whenever we finish scraping - either successfully or a fail - we allow the user to start another one
            haveStartedScrape = false;
        });
    }, 500);
}
// Listen to messages from the popup.js script 
chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === "Key" && !haveStartedScrape) {
        haveStartedScrape = true;
        startScrape(message.text);
    }
});
//startScrape ("49b65194-26e1-4041-ab11-4078229f478a");
//# sourceMappingURL=content.js.map