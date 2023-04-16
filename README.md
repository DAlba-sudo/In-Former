<div style="text-align: center; display:flex; flex-direction: row; justify-content: center;">
    <div style="display: inline-block;">
        <img height="200px" src="./icons/bitmap-lrg.png"/>
    </div>
</div>

<h1 style="text-align:center; font-family:'system-ui';">In-Former: The Chrome Extension That Could</h1>

<div style="background: #353851; padding: 10px; border-radius: 10px">
    <div style="display: flex; flex-direction: row; justify-content: center;">
        <img style="margin: 0 5px;" src="https://img.shields.io/badge/-Chrome%20Extension-brightgreen"/>
        <img style="margin: 0 5px;" src="https://img.shields.io/badge/-Potentially%20Malicious-red">
        <img style="margin: 0 5px;" src="https://img.shields.io/badge/-Education%20Only-blue">
    </div>

## The Inspiration 

They say that phishing is the leading way through which malware can infect computer systems, but my experience in the security industry tells me that we might be sleeping on a bigger threat - extensions. I made this project as an answer to the question:

```
If my grammarly extension wanted to, just how much harm could it do?
```

## What does In-Former do?

In-Former was designed originally as a dynamic information stealer, focusing on ingesting data from non-static sources (i.e., not hardcoded), but now includes malware injection capabilities, and many more features to come. Listed below is a list of features that this malicious extension provides.

1. <u>URL Tracking</u>: Keeps a history of the websites you visit and records relevant data such as time of visit, etc.
2. <u>Credential Stealing</u>: Upon a page load, it can inject event listeners that keep track of information in html input tags. 
3. <u>Stealthy Targeted Malware Injection</u>: Given a hard-coded set of websites and matching payloads, it can replace all download links to a malicious payload (changes the a tag's href attribute on clickup and then sets a timeout after which it is reset to its original value).
4. <u>Discord Webhook Payload Delivery</u>: Sends all of the information above using discord webhooks.
5. <u>Network Obfuscation</u>: Allows user to select from various payload deployment modes to allow for better network obfuscation. For example, send data to your discord webhook only on outgoing https requests (time based detection can no longer detect this extension's traffic). 
## What features are we getting?

There is a lot more that I'd like to do with this extension. Listed below is an updated list of higher-level todo items that I'd like to get done. Feel free to implement them:

1. <u>Web-Server Based Configuration</u>: Currently all of the relevant settings and information is hardcoded. What if we provided a way to ingest data from a web-server?
2. <u>Runtime Encryption</u>: All the cool kids are doing it, why not us? It would be nice to compile the executable as a string and have it decrypted at runtime and run in an eval function (scary, i know). 

```
This project is for educational purposes only. Please, don't use this for harm.
```



</div>


