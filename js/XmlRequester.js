var Request = function (url, callback) {
    
    var req = new XmlHttpRequest();

    req.onreadystatechange = function () {

        if (req.readyState === 4 && req.status === 200) {

            callback.call(req.responseXML);
        }
    };

    req.open('GET', url, false);

    req.send();
}