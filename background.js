chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  chrome.tabs.sendMessage(details.tabId, { url: details.url });
});

chrome.runtime.onInstalled.addListener(function () {
chrome.storage.sync.set({ isScriptEnabled: false }, function () {
  console.log('초기 상태는 꺼짐으로 설정되어 있음');
  });
});