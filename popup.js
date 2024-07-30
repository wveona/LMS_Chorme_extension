document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    // Load the current state from storage
    chrome.storage.sync.get(['isScriptEnabled'], function (result) {
      if (result.isScriptEnabled) {
        toggleButton.textContent = '끄기';
      } else {
        toggleButton.textContent = '켜기';
      }
    });
  
    // Toggle the content script state
    toggleButton.addEventListener('click', function () {
      chrome.storage.sync.get(['isScriptEnabled'], function (result) {
        const newState = !result.isScriptEnabled;
        chrome.storage.sync.set({ isScriptEnabled: newState }, function () {
          toggleButton.textContent = newState ? '끄기' : '켜기';
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['content.js']
            });
          });
        });
      });
    });
});