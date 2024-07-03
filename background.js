chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isEnabled: false });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle') {
      chrome.storage.local.get('isEnabled', (data) => {
        const newState = !data.isEnabled;
        chrome.storage.local.set({ isEnabled: newState }, () => {
          sendResponse({ isEnabled: newState });
        });
      });
      return true; // sendResponse를 비동기적으로 호출하기 위해
    }
  });