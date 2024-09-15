import axios from "axios";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("re", request.data)
  if (request.type == 'paraphrase' && request.data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.storage.local.get('level', function(result) {
        (async () => {
          let replace = []
          for (const item of request.data) {
            const res = await axios.post("http://127.0.0.1:8000/paraphrase", {
              content: item,
              target_tier: result['level'] as number
            })

            console.log(res.data)

            chrome.tabs.sendMessage(tabs[0].id!, res.data)
          }
        })().then()
      });
    });
  }

  return true
})