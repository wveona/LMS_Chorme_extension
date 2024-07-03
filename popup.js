let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

 // Execute script in the current tab
function onAndoff(st){
    if(st==0){
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                alert('LMS 확장 꺼짐')
            }
        });
    }
    else{
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                alert('LMS 확장 꺼짐')
            }
        });
    }
}