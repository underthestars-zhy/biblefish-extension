interface ParagraphContent {
  text: string;
  raw: string;
}

interface UpdateParagraphMessage {
  type: "updateParagraph";
  data: string;
}

interface ExtractAndTranslateMessage {
  type: "extractAndTranslate";
}

type ContentScriptMessage = UpdateParagraphMessage | ExtractAndTranslateMessage;

let translationInterval: number | null = null;
let currentParagraphIndex = 0;

function extractParagraphContent(): ParagraphContent[] {
  console.log("Start extracting paragraph content");
  const paragraphs = document.getElementsByTagName('p');
  const content: ParagraphContent[] = Array.from(paragraphs).map(p => ({
    text: p.textContent || "",
    raw: p.innerHTML
  }));
  console.log(`Extracted ${content.length} paragraphs`);
  return content;
}

function updateParagraph(index: number, newContent: string): boolean {
  console.log(`Updating paragraph at index ${index}`);
  const paragraphs = document.getElementsByTagName('p');
  if (index < paragraphs.length) {
    paragraphs[index].textContent = newContent;
    console.log(`Paragraph ${index} updated successfully`);
    return true;
  }
  console.log(`Failed to update paragraph ${index}: out of range`);
  return false;
}

function startTranslationProcess() {
  const paragraphs = extractParagraphContent();
  
  translationInterval = window.setInterval(() => {
    if (currentParagraphIndex < paragraphs.length) {
      chrome.runtime.sendMessage({
        type: "paraphrase",
        data: [paragraphs[currentParagraphIndex]]
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending paraphrase message:", chrome.runtime.lastError.message);
        } else {
          console.log("Paraphrase request sent successfully, response:", response);
        }
      });
      currentParagraphIndex++;
    } else {
      stopTranslationProcess();
    }
  }, 2000);
}

function stopTranslationProcess() {
  if (translationInterval !== null) {
    clearInterval(translationInterval);
    translationInterval = null;
    currentParagraphIndex = 0;
    console.log("Translation process stopped");
  }
}

chrome.runtime.onMessage.addListener((request: ContentScriptMessage, sender, sendResponse) => {
  console.log('Content script received message:', request);

  if (request.type === "extractAndTranslate") {
    console.log("Extract and translate request received");
    startTranslationProcess();
    sendResponse({success: true, message: "Translation process started"});
  } else if (request.type === "updateParagraph") {
    console.log(`Update paragraph request received`);
    const updated = updateParagraph(currentParagraphIndex - 1, request.data);
    sendResponse({success: updated, message: updated ? "Paragraph updated successfully" : "Failed to update paragraph"});
  }

  return true;
});

console.log("Chinese Language Simplifier content script loaded");