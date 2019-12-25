chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"key": null}, function() {
        console.log('Set default key value - Waiting for input');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'aurion.yncrea.fr'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

function getPageDetails(callback) {
    chrome.tabs.executeScript(null, { file: 'content.js' });
    chrome.runtime.onMessage.addListener(function(message) {
        callback(message);
    });
};

function doStuffWithDom(domContent) {
    let topush = domContent.substring(
        domContent.lastIndexOf('<tbody id="form:dataTableFavori_data" class="ui-datatable-data ui-widget-content">'),
        domContent.lastIndexOf('</tbody>')
    );

    chrome.storage.sync.get("key", function(items){
        if(items["key"] != null) {

            let postUrl = 'https://cir64.fr/GLOBAL_V3/remote/push.php?token='+items["key"];
            let xhr = new XMLHttpRequest();
            xhr.open('POST', postUrl, true);
            let params = 'data=' + encodeURIComponent(topush);
            params = params.replace(/%20/g, '+');
            let formContentType = 'application/x-www-form-urlencoded';
            xhr.setRequestHeader('Content-type', formContentType);
            xhr.send(params);
        }
    });
}

chrome.tabs.onUpdated.addListener(function (tabId , info, tab) {
    chrome.tabs.getSelected(null, function(tab) {
        if (info.status === 'complete') {
            if (tab.url === 'https://aurion.yncrea.fr/faces/LearnerNotationListPage.xhtml') {
                chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
            }
        }
    });
});