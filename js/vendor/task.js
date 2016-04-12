self.addEventListener('message', function (e) {
    
    'use strict';
    try {
        
        
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {

            if (request.readyState === 4 && request.status === 200) {

                console.log('reponse: ' + request.response);
                self.postMessage(request.response);
            }
        };

        console.log('../' + e.data);

        request.open('GET', '../' + e.data, false);
        request.send();
    } catch (e) {

        alert('Mapping experienced an exception\nadding store data.' + e.message);
    }        
  
}, false);

/*

    To use in anotrher js file see code below.
    
            
    var worker = new Worker('js/task.js');

    worker.addEventListener('error', function (e) {

        alert(e);

    }, false);

    worker.addEventListener('message', function (e) {

        tx(e.data);

    }, false);

    worker.postMessage('storedata.xml');



*/