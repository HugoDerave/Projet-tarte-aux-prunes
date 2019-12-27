function onPageDetailsReceived(pageDetails) {
    document.getElementById('token').value = pageDetails.token;
}

let statusDisplay = null;

function checkLink() {
    event.preventDefault();

    let postUrl = 'https://cir64.fr/remote/checkToken.php';
    let xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    let token = document.getElementById('token');
    let params = 'token=' + encodeURIComponent(token.value);
    params = params.replace(/%20/g, '+');
    let formContentType = 'application/x-www-form-urlencoded';
    xhr.setRequestHeader('Content-type', formContentType);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 200) {
                statusDisplay.innerHTML = 'OK';
                chrome.storage.sync.set({ "key": token.value }, function(){});
                window.setTimeout(window.close, 1000);
            } else {
                statusDisplay.innerHTML = 'Ce token n\'existe pas :-(';
            }
        }
    };

    xhr.send(params);
    statusDisplay.innerHTML = 'Checking...';
}

window.addEventListener('load', function(evt) {
    statusDisplay = document.getElementById('status-display');
    document.getElementById('setLink')
        .addEventListener('submit', checkLink);

    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});