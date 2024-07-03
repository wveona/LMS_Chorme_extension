document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
  
    // 초기 상태 로드
    chrome.storage.local.get('isEnabled', (data) => {
      updateButton(data.isEnabled);
    });
  
    // 버튼 클릭 이벤트 리스너 추가
    toggleButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'toggle' }, (response) => {
        updateButton(response.isEnabled);
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