function extractParagraphContent() {
  const paragraphs = document.getElementsByTagName('p');
  const content = Array.from(paragraphs).map(p => ({
    text: p.textContent,
    raw: p.innerHTML
  }));
  return content;
}

// Extract the text
const paragraphText = extractParagraphContent();

// Send the extracted text to the background script
setTimeout(() => {
  chrome.runtime.sendMessage({type: "paraphrase", data: paragraphText}, function(response) {

  });

}, 2000);

var count = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const paragraphs = document.getElementsByTagName('p');

  Array.from(paragraphs)[count].innerHTML = request
  count += 1
})