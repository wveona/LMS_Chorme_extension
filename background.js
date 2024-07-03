chrome.runtime.onInstalled.addListener(() => {
    // 초기 상태 설정
    chrome.storage.local.set({ isEnabled: false });
  });