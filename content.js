chrome.storage.sync.get("key", function(items){
    chrome.runtime.sendMessage({
        'token' : items["key"]
    });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse(document.all[0].outerHTML);
    }
});