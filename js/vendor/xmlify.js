/*global console: false */
/*global Xmlifier: false */
/*global document: false */
/*global undefined: false */
/*global XMLHttpRequest: false */
/*global alert: false */
/*global escape: false */
var google, map, mapCenterPoint, AsyncLoader = function () {
    
    'use strict';
    if (!(this instanceof AsyncLoader)) { return new AsyncLoader(); }
    
    // Private
    var asynchronousLoader = function (url, callback) {
    
        var httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function () {

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
            
            try {
                
                var xmlDoc = this,
                    postcodes = xmlDoc.getElementsByTagName('postcode'),
                    i = 0;

                for (i = 0; i < postcodes.length; i += 1) {

                    callback(postcodes[i].childNodes[0].nodeValue);
                }
            } catch (e) {
                
                alert('Geocoder experienced an exception.\n\n' + e.message);
            }
        });
    };
};

var Director = function () {
    
    'use strict';
    
    var initialized = false, display, service;
    
    this.Initialize = function (m) {
        
        display = new google.maps.DirectionsRenderer();
        service = new google.maps.DirectionsService();
        
        display.setMap(m);
        
        initialized = true;
    };
    
    this.Route = function (start, end) {
        
        if (!initialized) {
            
            alert('Geocoder requires direction service initialised.');
        }
        
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        
        service.route(request, function (result, status) {
            
            if (status === google.maps.DirectionsStatus.OK) {
              
                display.setDirections(result);
            }
        });
    };
};

var Cartographer = function (element) {
    
    'use strict';
    if (!(this instanceof Cartographer)) { return new Cartographer(); }
    
    var options,

        config = {
            
            canvas: element,
            
            latitude: 0,
            
            longtitude: 0,
            
            level: 6,
            
            startingPoint: 0
            
        };
    
    function mapPoint(ll) {
        
        var marker = new google.maps.Marker({
        
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: ll,
            map: map
        });

        google.maps.event.addListener(marker, 'click', function (event) {

            alert('Marker click event'); // + event.latLng

            window.setTimeout(function () {
                map.panTo(marker.getPosition());
            }, 400);
        });
    }
    
    function drawRadius(ll) {
        
        var fadedBlueCircle = {
            strokeColor: '#E00000 ',
            strokeOpacity: 0.2,
            strokeWeight: 1,
            fillColor: '#FF0000 ',
            fillOpacity: 0.40,
            map: map,
            center: ll,
            radius: map.getZoom() * 1000
        },
            radius = new google.maps.Circle(fadedBlueCircle);

        // Add an event listener to the circle a click event to the map.
        // This event currently displays an Alert Box and adds a new marker.
        // If you the event to fire when the user clicks the map, replace 'citycircle'
        // with 'map'.
        google.maps.event.addListener(radius, 'click', function (event) {

            alert("Inside circle at point: " + event.latLng);
        });
    }
    
    //An example of how to handle zoom events is below.
    //
    //cartographer.ZoomChanged(function (i) {
    //
    //    //alert("Zoom level is: " + i);
    //
    //});
    /////
    this.ZoomChanged = function (callback) {
        
        google.maps.event.addListener(map, 'zoom_changed', function () {
           
            config.level = map.getZoom();
            
            callback(config.level);
        });
    };
      
    this.Configure = function (lat, lng, lev) {
        
        config.startingPoint = new google.maps.LatLng(lat, lng);
        
        config.level = lev;

        options = {
            
            zoom: config.level,
            
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            
            center: config.startingPoint
            
        };
        
        mapCenterPoint = options.center;

        google.maps.visualRefresh = true;
        
        map = new google.maps.Map(document.getElementById(config.canvas), options);
        
        mapPoint(config.startingPoint);
        
        drawRadius(config.startingPoint);
    };
    
    this.Feed = function (xml) {
        
        var geocoder = new google.maps.Geocoder();

        this.AsyncLoad(xml, function (p) {

            geocoder.geocode({ 'address': p }, function (results, status) {

                if (status !== google.maps.GeocoderStatus.OK) {

                    alert('Geocoder received a message from Google.\n\n' + status);
                    
                    return;
                }

                //console.log(p);
                //console.log(results[0].geometry.location);

                mapPoint(results[0].geometry.location);
            });
        });
    };
    
    this.Receive = function (callback) {
        
        var dropZone = document.getElementById(config.canvas);
        
        dropZone.addEventListener('dragover', function (evt) {
        
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'all';
        
        }, false);
        
        dropZone.addEventListener('drop', function (evt) {
        
            evt.stopPropagation();
            evt.preventDefault();
            
            var xml = 'text/xml';
            
            if (evt.dataTransfer.files[0].type !== xml) {
                
                alert('Invalid file type dropped!');
                
                return;
            }
            
            callback(escape(evt.dataTransfer.files[0].name));
        
        }, false);
    };
};

// Cartographer is now inheriting AsyncLoader and it's priviliged methods.
Cartographer.prototype = new AsyncLoader();

window.onload = function () {
    
    'use strict';
    var director, cartographer = new Cartographer('map_canvas'), latitude = 53.81741362363378, longtitude = -3.052654266357422;
    
    cartographer.Configure(latitude, longtitude, 6);
    
    cartographer.Receive(function (p) {
        
        cartographer.Feed(p);
    });
    
    director = new Director();
    
    director.Initialize(map);
    
    director.Route(mapCenterPoint, 'CT1 2SS');
};

window.onresize = function () {
    
    'use strict';
    map.panTo(mapCenterPoint);
};

