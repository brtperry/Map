/*global console: false */
/*global Xmlifier: false */
/*global document: false */
/*global undefined: false */
/*global XMLHttpRequest: false */
var AsyncLoader = function () {
    
    "use strict";
    if (!(this instanceof AsyncLoader)) { return new AsyncLoader(); }
    
    // Private
    var asynchronousLoader = function (url, callback) {
    
        var httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function () {
    
            // inline function to check the status
            // of our request, this is called on every state change
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {

                callback.call(httpRequest.responseXML);
            }
        };
        
        try {
            
            httpRequest.open('GET', url, false);
            httpRequest.send();
    
        } catch (e) {
            
            console.log(e.message);
        }
    };
    
    // Priviliged method
    this.AsyncLoad = function (url, callback) {
        
        asynchronousLoader(url, function () {
            
            var xmlDoc = this,
                postcodes = xmlDoc.getElementsByTagName("postcode"),
                i = 0;
            
            for (i = 0; i < postcodes.length; i += 1) {
                
                callback(postcodes[i].childNodes[0].nodeValue); 
            }        
        });   
    };
    
    // Priviliged which returns the version as a string
    this.Version = function () {
        
        return "AsyncLoader : 1.0";
        
    }; 
};

var Xmlifier = function () {
    
    "use strict";
    if (!(this instanceof Xmlifier)) { return new Xmlifier(); }
    
    // Private
    var asynchronousLoader = new AsyncLoader();
    
    this.Load = function (url, callback) {
        
        asynchronousLoader.AsyncLoad(url, function (p) {
            
            callback(p);            

        });               
    };

    this.MapPoint = function (latlng) {
        
        var marker = new google.maps.Marker({
        
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: latlng,
            map: map
        });

        //Add a click event listener to the marker
        google.maps.event.addListener(marker, 'click', function (event) {

            alert("Marker click event"); // + event.latLng

            // move and center to this marker position after a .4 second delay.
            window.setTimeout(function () {
                map.panTo(marker.getPosition());
            }, 400);

        });       
    }
};

// Inherits Toaster methods
//Xmlifier.prototype = new AsyncLoader();

var map, google, geocoder;

function LoadMap() {
    
    "use strict";
    var blackpool, options;
    
    geocoder = new google.maps.Geocoder();
    
    // Enable the visual refresh.
    google.maps.visualRefresh = true;
    
    blackpool = new google.maps.LatLng(53.81741362363378, -3.052654266357422);

    options = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: blackpool
    }
    
    map = new google.maps.Map(document.getElementById("map_canvas"), options); 
    
    var analyser = new Xmlifier();
    
    analyser.MapPoint(blackpool);
    
    analyser.Load("test_postcodes.xml", function (p) {
               
        geocoder.geocode({ 'address': p }, function (results, status) {

            if (status !== google.maps.GeocoderStatus.OK) {

                return;
            }
            
            console.log(p);
            console.log(results[0].geometry.location);
            
            analyser.MapPoint(results[0].geometry.location);
        });       
    });   
}

google.maps.event.addDomListener(window, 'load', LoadMap);