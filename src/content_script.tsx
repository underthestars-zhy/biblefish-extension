

/**
 * Function to extract the content of all paragraph elements <p> in a web page.
 * 
 * The function gets all the paragraph elements, then creates an array of objects
 * where each object contains two properties:
 * - text: The plain text content of the paragraph (using textContent)
 * - raw: The inner HTML of the paragraph, including any formatting or HTML tags
 * 
 * This is useful for capturing both the visual text and the raw HTML for later manipulation.
 */
function extractParagraphContent() {
  // Get all paragraph elements in the document
  const paragraphs = document.getElementsByTagName('p');

  // Convert the HTMLCollection to an array and map over it to extract content
  const content = Array.from(paragraphs).map(p => ({
    text: p.textContent,  // Extracts the plain text of the paragraph
    raw: p.innerHTML      // Extracts the raw HTML of the paragraph
  }));
  return content;  // Returns the array of paragraph content
}

// Extract the paragraph content on page load
const paragraphText = extractParagraphContent();

/**
 * Sends the extracted paragraph content to the background script via a Chrome runtime message.
 * This message is sent after a delay of 2 seconds to ensure that the content is fully loaded before being processed.
 * The type of the message is 'paraphrase', and the data sent is the array of paragraph content.
 */
setTimeout(() => {
  chrome.runtime.sendMessage({type: "paraphrase", data: paragraphText}, function(response) {
    // Optional callback function can be used to handle the response from the background script
  });
}, 2000);  // Waits for 2 seconds before sending the message to ensure content is ready

// Variable to keep track of which paragraph to update
var count = 0;

/**
 * Listens for messages from the background script.
 * 
 * When a message is received, it updates the innerHTML of the corresponding paragraph with the processed content.
 * If the request is 'nothing', it clears the paragraph's content.
 * The count variable is used to keep track of which paragraph should be updated.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Get all paragraph elements again
  const paragraphs = document.getElementsByTagName('p');

  // Update the innerHTML of the current paragraph based on the request
  Array.from(paragraphs)[count].innerHTML = request === 'nothing' ? '' : request;
  
  // Move to the next paragraph for future updates
  count += 1;
});



// function extractParagraphContent() {
  //   const paragraphs = document.getElementsByTagName('p');
  //   const content = Array.from(paragraphs).map(p => ({
  //     text: p.textContent,
  //     raw: p.innerHTML
  //   }));
  //   return content;
  // }
  
  // // Extract the text
  // const paragraphText = extractParagraphContent();
  
  // // Send the extracted text to the background script
  // setTimeout(() => {
  //   chrome.runtime.sendMessage({type: "paraphrase", data: paragraphText}, function(response) {
  
  //   });
  
  // }, 2000);
  
  // var count = 0;
  
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   const paragraphs = document.getElementsByTagName('p');
  
  //   Array.from(paragraphs)[count].innerHTML = request === 'nothing' ? '' : request
  //   count += 1
  // })