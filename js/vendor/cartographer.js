
  

/*

===================================================================================================================================
// This example creates an interactive map which constructs a
// polyline based on user clicks. Note that the polyline only appears
// once its path property contains two LatLng coordinates.

var poly;
var map;

function initialize() {
  var mapOptions = {
    zoom: 7,
    // Center the map on Chicago, USA.
    center: new google.maps.LatLng(41.879535, -87.624333)
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var polyOptions = {
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 3
  };
  poly = new google.maps.Polyline(polyOptions);
  poly.setMap(map);

  // Add a listener for the click event
  google.maps.event.addListener(map, 'click', addLatLng);
}

 Handles click events on a map, and adds a new point to the Polyline.
 @param {google.maps.MouseEvent} event
 
function addLatLng(event) {

  var path = poly.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  path.push(event.latLng);

  // Add a new marker at the new plotted point on the polyline.
  var marker = new google.maps.Marker({
    position: event.latLng,
    title: '#' + path.getLength(),
    map: map
  });
}

google.maps.event.addDomListener(window, 'load', initialize);



===================================================================================================================================


Default library, displays a map without the use of a key
src="http://maps.googleapis.com/maps/api/js?sensor=false">

Experimental version of the map, displays a map without the use of a key
src="http://maps.googleapis.com/maps/api/js?v=3.exp&libraries=visualization&sensor=false">

The library below shows my Google Map Id Key and uses the weather library.  
src="http://maps.googleapis.com/maps/api/js?libraries=weather&key=key&sensor=false"

The library below add the weather layer 
src="http://maps.googleapis.com/maps/api/js?libraries=weather&sensor=false">

The library below add the geometry layer 
src="http://maps.googleapis.com/maps/api/js?libraries=geometry&sensor=false">

The library below add the visualization layer  
src="http://maps.googleapis.com/maps/api/js?libraries=visualization&sensor=false">

Business key
src="http://maps.googleapis.com/maps/api/js?v=3&client=gme-businesname?sensor=false&signature=key"

*/

/*global console: false */
/*global Xmlifier: false */
/*global document: false */
/*global undefined: false */
/*global XMLHttpRequest: false */
/*global alert: false */
/*global escape: false */

var google, map, geocoder;

var XMLHttpRequester = function () {
    
    'use strict';
    if (!(this instanceof XMLHttpRequester)) { return new XMLHttpRequester(); }
    
    this.Load = function (url, callback) {
        
        try {
            
            var httpRequest = new XMLHttpRequest();
        
            httpRequest.onreadystatechange = function () {

                if (httpRequest.readyState === 4 && httpRequest.status === 200) {

                    callback.call(httpRequest.responseXML);
                }
            };
            
            httpRequest.open('GET', url, false);
            httpRequest.send();
    
        } catch (e) {
            
            console.log(e.message);
        }
    };
};

var Store = function (n, p, la, ln) {

    'use strict';
    this.Name = n;
    this.Postcode = p;
    this.Latitude = la;
    this.Longtitude = ln;
};


var Cartographer = function (element) {
    
    'use strict';
    if (!(this instanceof Cartographer)) { return new Cartographer(); }
    
    var options,
        director,
        httpRequester,

        config = {
            
            canvas: element,
            
            latitude: 0,
            
            longtitude: 0,
            
            level: 6,
            
            startingPoint: 0,
            
            allowRouting: false
            
        },
        
        layers = {
            
            bike: null,
            
            weather: null,
            
            transit: null,
            
            cloud: null
            
        };
    
    /// Some test stuff
    function ft(x) {
        return x + "e";
    }
    
    this.Wait = function (t, callback) {
        
        var p = ft(t);
        
        setTimeout(function () {
            
            // Whatever you want to do after the wait of 10000
            callback(p);
            
        }, 10000);
    };
    
    // Privileged methods
	// Can be invoked publicly and may access private methods and variables.
    
    // End test stuff
    
    // Detect browser and resize accordingly.
    function detectBrowser() {
        var useragent = navigator.userAgent;
        var mapdiv = document.getElementById("map_canvas");

        if (useragent.indexOf('iPhone') !== -1 || useragent.indexOf('Android') !== -1) {
            mapdiv.style.width = '100%';
            mapdiv.style.height = '100%';
        } else {
            mapdiv.style.width = '100%';
            mapdiv.style.height = '100%';
        }
    }    
    
    function addMarkerAtPoint(ll) {
        
        var marker, infowindow = new google.maps.InfoWindow({
            content: 'Hello'
        });
        
        marker = new google.maps.Marker({
        
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: ll,
            map: map,
            icon: "../img/dot.png"
        });

        google.maps.event.addListener(marker, 'click', function (event) {

            infowindow.open(map, marker);
            //alert('Marker click event'); // + event.latLng

            window.setTimeout(function () {
                map.panTo(marker.getPosition());
            }, 400);
        });
    }
    
    
    
    function drawRadius(ll) {
        
        var circle = {
            strokeColor: '#E00000 ',
            strokeOpacity: 0.2,
            strokeWeight: 1,
            fillColor: '#FF0000 ',
            fillOpacity: 0.40,
            map: map,
            center: ll,
            radius: map.getZoom() * 1000
        },
            radius = new google.maps.Circle(circle);

        // Add an event listener to the circle a click event to the map.
        // This event currently displays an Alert Box and adds a new marker.
        // If you the event to fire when the user clicks the map, replace 'citycircle'
        // with 'map'.
        google.maps.event.addListener(radius, 'click', function (event) {

            alert("Inside circle at point: " + event.latLng);
        });
    }
    
    function addStoreData() {
        
        httpRequester.Load('storedata.xml', function () {

            try {

                var xmlDoc = this,
                    name = xmlDoc.getElementsByTagName('name'),
                    postcode = xmlDoc.getElementsByTagName('postcode'),
                    lat = xmlDoc.getElementsByTagName('lat'),
                    lng = xmlDoc.getElementsByTagName('lng'),
                    store,
                    point,
                    i = 0;

                for (i = 0; i < name.length; i += 1) {

                    store = new Store();

                    store.Name = name[i].childNodes[0].nodeValue;
                    store.Postcode = postcode[i].childNodes[0].nodeValue;
                    store.Latitude = lat[i].childNodes[0].nodeValue;
                    store.Longtitude = lng[i].childNodes[0].nodeValue;
                    
                    point = new google.maps.LatLng(store.Latitude, store.Longtitude);
                    
                    addMarkerAtPoint(point);
                }
            } catch (e) {

                alert('Geocoder experienced an exception.\n\n' + e.message);
            }
        });
    }
        
      
    this.Configure = function (lat, lng, lev) {
        
        config.startingPoint = new google.maps.LatLng(lat, lng);
        
        config.level = lev;

        options = {
            
            zoom: config.level,
            
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            
            center: config.startingPoint
            
        };

        google.maps.visualRefresh = true;
        
        map = new google.maps.Map(document.getElementById(config.canvas), options);
        
        geocoder = new google.maps.Geocoder();
        
        httpRequester = new XMLHttpRequester();
        
        addMarkerAtPoint(config.startingPoint);
        
        drawRadius(config.startingPoint);
        
        setTimeout(function () {
            
            // Whatever you want to do after the wait of a 400th 
            addStoreData();
            
        }, 10000);
        /* 

                Heat Map Data points defined as an array of LatLng objects 

            */
        var heatmapData = [
                new google.maps.LatLng(53.81741, -3.052654),
                new google.maps.LatLng(53.91742, -3.052655),
                new google.maps.LatLng(53.61743, -3.052656),
                new google.maps.LatLng(53.21744, -3.052656),
                new google.maps.LatLng(53.41745, -3.052657),
                new google.maps.LatLng(53.5746, -3.052657),
                new google.maps.LatLng(53.1747, -3.052698),
                new google.maps.LatLng(53.3748, -3.052659)

            ];

        var pointArray = new google.maps.MVCArray(heatmapData);

        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray
        });

        var gradient = [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ];

        heatmap.setOptions({
            gradient: heatmap.get('gradient') ? null : gradient
        });

        heatmap.setMap(map);
        


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
        
            httpRequester.Load(escape(evt.dataTransfer.files[0].name), function () {
            
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
        }, false);
    };
       
    this.AddPointOnMap = function (ll) {
        
        addMarkerAtPoint(ll);
    };


    
    this.AllowRoutes = function () {
        
        if (config.allowRouting) { return; }
        
        config.allowRouting = true;
        
        director = new Director();
        
        director.Initialize(map);
    };
    
    this.Route = function (start, end) {
        
        if (!config.allowRouting) {
            
            alert('Routing needs to be initialised.');
            return;
        }
        
        director.Route(start, end);
    };
    
    this.AddLayer = function (layer, add) {
      
        switch (layer) {
         
        case 1:
               
            if (add) {
                
                layers.bike = new google.maps.BicyclingLayer();
                
                layers.bike.setMap(map);
                
            } else {
                
                layers.bike.setMap(null);
            }
                
            break;
                
        case 2:
               
            if (add) {
                
                layers.weather = new google.maps.weather.WeatherLayer({
                    temperatureUnits: google.maps.weather.TemperatureUnit.CELCIUS
                });
                
                layers.weather.setMap(map);
                
            } else {
                
                layers.weather.setMap(null);
            }
                
            break;
                
        case 3:
               
            if (add) {
                
                layers.transit = new google.maps.TransitLayer();
                
                layers.transit.setMap(map);
                
            } else {
                
                layers.transit.setMap(null);
            }
                
            break;
                
        case 4:
               
            if (add) {
                
                layers.cloud = new google.maps.weather.CloudLayer();
                
                layers.cloud.setMap(map);
                
            } else {
                
                layers.cloud.setMap(null);
            }
                
            break;
        }
    };
};

// Cartographer is now inheriting AsyncLoader and it's priviliged methods.
//Cartographer.prototype = new AsyncLoader();

//Cartographer.prototype.mapi = function (callback) {
//    
//    'use strict';
//    alert('do this');
//    
//    var f = 10000;
// 
//    callback(f);
//};
//
//function andthat(x) {
//    'use strict';
//    console.log('and that' + x);
// 
//    alert('and that' + x);
//}

//google.maps.event.addDomListener(window, 'load', LoadMap);

//function loadScript() {
//  var script = document.createElement('script');
//  script.type = 'text/javascript';
//  script.src = 'src=http://maps.googleapis.com/maps/api/js? v=3.13&libraries=visualization&' + 'callback=LoadMapAsync';
//    //script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' + 'callback=initialize';
//  document.body.appendChild(script);
//}
//
//function LoadMapAsync() {
//    
//        'use strict';
//    var cartographer = new Cartographer('map_canvas'), latitude = 53.81691362363378, longtitude = -3.053301266357422;
//      
//    cartographer.Configure(latitude, longtitude, 3);
//     
//    cartographer.Receive(function (p) {
//
//        cartographer.GeocodeResult(p);
//    });
//    
//}

//window.onload = loadScript;

//<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js? v=3.13&libraries=visualization"><

window.onload = function () {
    
    'use strict';
    var cartographer = new Cartographer('map_canvas'), latitude = 53.81691362363378, longtitude = -3.053301266357422;
      
    cartographer.Configure(latitude, longtitude, 3);
     
    cartographer.Receive(function (p) {

        cartographer.GeocodeResult(p);
    });
    
//    cartographer.mapi(andthat);
//    cartographer.ZoomChanged(function (i) {
//    
//        alert("Zoom level is: " + i);
//    
//    });
//    
//    cartographer.Wait("Toast", function (p) {
//        
//        //alert(p);
//        
//    });
};

