"use strict";
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
    setTimeout(function () {
        try {
            // First try to get all plain text, if that doesnt work, get the headers
            var scraped = artoo.scrape('p', 'text');
            if (scraped.length === 0) {
                for (var i = 0; i < 6; i++) {
                    scraped = scraped = artoo.scrape('h' + i.toString(), 'text');
                }
            }
            allText = scraped.join(' \n');
            if (allText.length > NN)
                allText = allText.substring(0, NN);
        }
        catch (_a) {
            allText = "";
        }
        var summarizeQuery = 'https://braidapi.azurewebsites.net/api/summarize?session=49b65194-26e1-4041-ab11-4078229f478a';
        var classifyQuery = 'https://braidapi.azurewebsites.net/api/classify?session=49b65194-26e1-4041-ab11-4078229f478a';
        axios.post(summarizeQuery, {
            data: {
                text: allText
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (summaryRes) {
            haveSummary = true;
            if (summaryRes.status === 200) {
                chrome.runtime.sendMessage({ type: "Summary", text: summaryRes.data });
                axios.post(classifyQuery, {
                    data: {
                        text: summaryRes.data
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (classifyRes) {
                    haveClassification = true;
                    if (classifyRes.status === 200) {
                        chrome.runtime.sendMessage({ type: "Classification", text: classifyRes.data });
                    }
                    else {
                        chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
                    }
                })
                    .catch(function (e) {
                    haveClassification = true;
                    console.error(e);
                    chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
                });
            }
            else {
                haveSummary = true;
                haveClassification = true;
                chrome.runtime.sendMessage({ type: "Summary", text: "Sorry, could not fetch a summary from the Waterfall server." });
                chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
            }
        })
            .catch(function (e) {
            haveSummary = true;
            haveClassification = true;
            console.error(e);
            chrome.runtime.sendMessage({ type: "Summary", text: "Sorry, could not fetch a summary from the Waterfall server." });
            chrome.runtime.sendMessage({ type: "Classification", text: "Sorry, could not fetch a classification from the Waterfall server." });
        });
    }, 500);
}
var haveStartedScrape = false;
// Listen to messages from the popup.js script 
chrome.runtime.onMessage.addListener(function (message) {
    console.log("Got message");
    if (message.type === "Key" && !haveStartedScrape) {
        console.log("Starting scrape");
        haveStartedScrape = true;
        startScrape(message.text);
    }
});
console.log("Content script loaded");
//startScrape ("49b65194-26e1-4041-ab11-4078229f478a");
//# sourceMappingURL=content.js.map