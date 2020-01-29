chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"key": null}, function() {
        console.log('Set default key value - Waiting for input');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostEquals: 'aurion.yncrea.fr'},
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostEquals: 'cir64.fr'},
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
            let manifestData = chrome.runtime.getManifest();

            let postUrl = 'https://cir64.fr/remote/push.php?v='+manifestData.version+'&token='+items["key"];
            let xhr = new XMLHttpRequest();
            xhr.open('POST', postUrl, true);
            let params = 'data=' + encodeURIComponent(topush);
            params = params.replace(/%20/g, '+');
            let formContentType = 'application/x-www-form-urlencoded';
            xhr.setRequestHeader('Content-type', formContentType);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    chrome.tabs.getSelected(null, function(tab) {
                        if (tab.url === 'https://aurion.yncrea.fr/faces/LearnerNotationListPage.xhtml') {
                            if(xhr.status == 200){
                                chrome.tabs.sendMessage(tab.id, {text: 'post_success'});
                            }else if(xhr.status == 500){
                                chrome.tabs.sendMessage(tab.id, {text: 'post_500'});
                            }else if(xhr.status == 404){
                                chrome.tabs.sendMessage(tab.id, {text: 'post_notfound'});
                            }
                        }
                    });
                }
            }

            xhr.send(params);
        }else{
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.sendMessage(tab.id, {text: 'post_notset'});
            });
        }
    });
}

chrome.tabs.onUpdated.addListener(function (tabId , info, tab) {
    chrome.tabs.getSelected(null, function(tab) {
        if (info.status === 'complete') {
            if (tab.url === 'https://aurion.yncrea.fr/faces/LearnerNotationListPage.xhtml') {
                chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
            }else if(tab.url.indexOf("cir64.fr") !== -1) {
                chrome.tabs.sendMessage(tab.id, {text: 'get_token_from_cir64'});
            }
        }
    });
});