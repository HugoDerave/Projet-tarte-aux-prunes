chrome.storage.sync.get("key", function(items){
    chrome.runtime.sendMessage({
        'token' : items["key"]
    });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'report_back') {
        sendResponse(document.all[0].outerHTML);
    }else if(msg.text === 'post_success'){
        let test = document.getElementsByClassName("EmptyBox10 cacherImpression")[0];
        test.className = 'cir64 success';
        test.innerHTML = "Vos données ont été transmises à CIR64 !";
    }else if(msg.text === 'post_500'){
        let test = document.getElementsByClassName("EmptyBox10 cacherImpression")[0];
        test.className = 'cir64 error';
        test.innerHTML = "Données vides transmises à CIR64, pas d'envoi effectué.";
    }else if(msg.text === 'post_notfound'){
        let test = document.getElementsByClassName("EmptyBox10 cacherImpression")[0];
        test.className = 'cir64 error';
        test.innerHTML = "Token CIR64 introuvable dans la base de données, veuillez vérifier qu'il est bien valide !";
    }else if(msg.text === 'post_notset'){
        let test = document.getElementsByClassName("EmptyBox10 cacherImpression")[0];
        test.className = 'cir64 error';
        test.innerHTML = "Token CIR64 not défini dans l'extension. Veuillez le rentrer dans l'extension avant d'utiliser CIR64.";
    }
});