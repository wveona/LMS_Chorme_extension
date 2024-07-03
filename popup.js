document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    // 초기 상태 로드
    chrome.storage.local.get('isEnabled', (data) => {
      updateButton(data.isEnabled);
    });
  
    // 버튼 클릭 이벤트 리스너 추가
    toggleButton.addEventListener('click', () => {
      chrome.storage.local.get('isEnabled', (data) => {
        const newState = !data.isEnabled;
        var newURL = "http://stackoverflow.com/";
        chrome.tabs.create({ url: newURL });
        chrome.storage.local.set({ isEnabled: newState }, () => {
          updateButton(newState);
        });
      });
    });
  
    function updateButton(isEnabled) {
      if (isEnabled) {
        toggleButton.textContent = 'Disable';
        toggleButton.style.backgroundColor = 'red';
      } else {
        toggleButton.textContent = 'Enable';
        toggleButton.style.backgroundColor = 'green';
      }
    }
  });