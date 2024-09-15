function extractParagraphText() {
  const paragraphs = document.getElementsByTagName('p');
  const textContent = Array.from(paragraphs).map(p => p.textContent);
  return textContent;
}

// Extract the text
const paragraphText = extractParagraphText();

// Send the extracted text to the background script
setTimeout(() => {
  chrome.runtime.sendMessage({type: "paraphrase", data: paragraphText}, function(response) {

  });

}, 2000);

var count = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const paragraphs = document.getElementsByTagName('p');

  Array.from(paragraphs)[count].textContent = request
  count += 1
})