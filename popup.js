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
  const searchBUTTON=document.getElementById("search");
  searchBUTTON.addEventListener('click',()=>{
    let userInput = document.getElementById("query").value;
    let apiKey = ''; // 서버에서 관리되는 API 키
    const messages=[{
      "role":'user',
      "content":userInput
    }];
    $.ajax({
        url: 'https://api.openai.com/v1/engines/davinci-codex/completions', // API endpoint
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + apiKey
        },
        data: JSON.stringify({
          "model": 'gpt-3.5-turbo',
          "messages": messages,
          max_tokens: 150, // 응답받을 메시지 최대 토큰(단어) 수 설정
          top_p: 1, // 토큰 샘플링 확률을 설정
          frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
          presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
          temperature: 0.5,
        }),
        success: function(response) {
            $('p').text(response.choices[0].text);
        },
        error: function(error) {
            console.error('Error:', error);
            $('p').text('에러 발생');
        }
    });
  });
});