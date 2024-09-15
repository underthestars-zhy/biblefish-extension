import axios from "axios";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);

  if (request.type === 'paraphrase' && request.data) {
    console.log("Received paraphrase request:", request.data);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const id = tabs[0]?.id;
      if (id === undefined) {
        console.error('No active tab found for paraphrase request');
        sendResponse({success: false, error: "No active tab found"});
        return;
      }
      chrome.storage.local.get(['level'], function(result) {
        (async () => {
          try {
            const item = request.data[0]; // We're only processing one paragraph at a time now
            const res = await axios.post("http://127.0.0.1:8000/paraphrase", {
              content: item.text,
              raw: item.raw,
              target_tier: result['level']
            });
            console.log("Paraphrase response:", res.data);
            chrome.tabs.sendMessage(id, { type: "updateParagraph", data: res.data }, (response) => {
              console.log('Update paragraph response:', response);
            });
            sendResponse({success: true, data: res.data});
          } catch (error) {
            console.error("Error in paraphrase request:", error);
            sendResponse({success: false, error: error instanceof Error ? error.message : String(error)});
          }
        })();
      });
    });
    return true; // Indicates we wish to send a response asynchronously
  } else if (request.type === 'startTranslation') {
    console.log("Start translation request received");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      if (currentTab.id) {
        chrome.tabs.sendMessage(currentTab.id, { type: "extractAndTranslate" }, (response) => {
          console.log('Extract and translate response:', response);
        });
      } else {
        console.error('No active tab found');
      }
    });
    sendResponse({success: true, message: "Translation started"});
    return true;
  }
});

console.log('Background script loaded');