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
    $.ajax({
        url: 'https://api.openai.com/v1/chat/completions', // API endpoint
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role:'user', content:userInput }]
        }),
        success: function(response) {
          const reply=response.choices[0].message.content;
          $("#GPTanswer").text(reply);
          console.log(reply);
        },
        error: function(xhr,status,error) {
            console.error('Error:', error);
            $(".GPTanswer").text('에러 발생');
        }
    });
  });
});