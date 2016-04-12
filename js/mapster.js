/*global alert: false */
/*global console: false */
/*global Worker: false */
/*global escape: false */
/*global google: false */
/*global poly: false */

/*

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

*/

// This isn't a singleton and the object [Store] is only assigned when [new] is
// called to create.  I think [Object.create] might also work

var map;

var Store = function (n, p, la, ln) {

    'use strict';
    this.Name = n;
    this.Postcode = p;
    this.Latitude = la;
    this.Longtitude = ln;
};

//        { hue: '#0022ff' },
//        { saturation: 50 },
//        { lightness: -10 },
//        { gamma: 0.90 }

var roadMapStyles =
    [
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers:
                [
                    { saturation: -100 },
                    { lightness: -8 },
                    { gamma: 1.18 }
                ]
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers:
                [
                    { saturation: -100 },
                    { gamma: 1 },
                    { lightness: -24 }
                ]
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers:
                [
                    { saturation: -100 }
                ]
        },
        {
            featureType: 'administrative',
            stylers:
                [
                    { saturation: -100 }
                ]
        },
        {
            featureType: 'transit',
            stylers:
                [
                    { saturation: -100 }
                ]
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers:
                [
                    { saturation: -100 }
                ]
        },
        {
            featureType: 'road',
            stylers:
                [
                    { saturation: -100 }
                ]
        },
        {
            featureType: 'administrative',
            stylers:
                [
                    { saturation: -100 }
                ]
        },
        {
            featureType: 'landscape',
            stylers:
                [
                    { saturation: -100 }
                ]
        },
        {
            featureType: 'poi',
            stylers:
                [
                    { saturation: -100 }
                ]
        }
    ];

// Like a singleton pattern in any other language, as it defined immediately
// and can be called as layer.bike for example.
var layer = {
            
    bike: null,

    weather: null,

    transit: null,

    cloud: null
};

// Like a singleton pattern in any other language, as it defined immediately
// and can be called as icon.office for example.
var icon = {
    
    //Google map icons available at http://mapicons.nicolasmollet.com/
    
    office: '../img/office.png',
    
    pin: '../img/pin.png',
    
    store: '../img/store.png',
    
    scotland: '../img/scotland.png',
    
    southeast: '../img/southeast.png',
    
    centralwest: '../img/centralwest.png',
    
    northwest: '../img/northwest.png',
    
    triangle: '../img/triangle.png'
};

// Like a singleton pattern in any other language, as it defined immediately
// and can be called as region.north for example.
var region = {
    
    north:
        [
            new google.maps.LatLng(56.1149, -0.0714),
            new google.maps.LatLng(62.3266, -0.03295),
            new google.maps.LatLng(57.0407, -21.6211),
            new google.maps.LatLng(53.3046, -2.6806),
            new google.maps.LatLng(56.1149, -0.0714)
        ],
    south:
        [
            new google.maps.LatLng(53.3046, -2.6806),
            new google.maps.LatLng(57.0407, -21.6211),
            new google.maps.LatLng(44.4023, -20.3906),
            new google.maps.LatLng(44.2137, -2.0214),
            new google.maps.LatLng(53.3046, -2.6806)
        ],
    east:
        [
            new google.maps.LatLng(53.3046, -2.6806),
            new google.maps.LatLng(56.1149, -0.0714),
            new google.maps.LatLng(53.9302, 9.0087),
            new google.maps.LatLng(50.3454, 7.2509),
            new google.maps.LatLng(53.3046, -2.6806)
        ],
    west:
        [
            new google.maps.LatLng(53.3046, -2.6806),
            new google.maps.LatLng(56.1149, -0.0714),
            new google.maps.LatLng(53.9302, 9.0087),
            new google.maps.LatLng(50.3454, 7.2509),
            new google.maps.LatLng(53.3046, -2.6806)
        ]
};

// A region is defined as a polygon on the map, each reference points to a 
// location on the map and circles around to connect the polygon loop.  As 
// you can see the first and last reference are equal.
//
// I may use polyline here instead of polygon, some thinking as to which 
// is going to be the best method.  See some example code below.
//
//        var flightPlanCoordinates = [
//                new google.maps.LatLng(53.3046, -2.6806),
//                new google.maps.LatLng(56.1149, -0.0714),
//                new google.maps.LatLng(53.9302, 9.0087),
//           // new google.maps.LatLng(44.2137, -2.0214),
//                new google.maps.LatLng(50.3454, 7.2509),
//                new google.maps.LatLng(53.3046, -2.6806)
//  ];
//  var flightPath = new google.maps.Polyline({
//    path: flightPlanCoordinates,
//    geodesic: true,
//    strokeColor: '#FF0000',
//    strokeOpacity: 1.0,
//    strokeWeight: 2
//  });
//
//  flightPath.setMap(map);

//var Requester = function(url, callback) {

//    var request = new XmlHttpRequest();

//    request.onreadystatechange = function() {

//        if (request.readyState === 4 && request.status === 200) {

//            callback.call(request.responseXML);
//        }
//    };

//    request.open('GET', url, false);

//    request.send();
//};

var Layer = function () {
    
    'use strict';
    this.DisplayLayer = function (l, add) {
        
        switch (l) {
         
        case 1:
               
            if (add) {
                
                layer.bike = new google.maps.BicyclingLayer();
                
                layer.bike.setMap(map);
                
            } else {
                
                layer.bike.setMap(null);
            }
                
            break;
                
        case 2:
               
            if (add) {
                
                layer.weather = new google.maps.weather.WeatherLayer({
                    temperatureUnits: google.maps.weather.TemperatureUnit.CELCIUS
                });
                
                layer.weather.setMap(map);
                
            } else {
                
                layer.weather.setMap(null);
            }
                
            break;
                
        case 3:
               
            if (add) {
                
                layer.transit = new google.maps.TransitLayer();
                
                layer.transit.setMap(map);
                
            } else {
                
                layer.transit.setMap(null);
            }
                
            break;
                
        case 4:
               
            if (add) {
                
                layer.cloud = new google.maps.weather.CloudLayer();
                
                layer.cloud.setMap(map);
                
            } else {
                
                layer.cloud.setMap(null);
            }
                
            break;
        }
    };
};

var Region = function () {
    
    'use strict';
    this.DisplayRegion = function (r) {
        
        var region = new google.maps.Polygon({
                paths: r,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

        region.setMap(map);
    };
};

// Display the route from a to b.
var Director = function () {
    
    'use strict';
    var display, service;
    
    this.InitializeDirectionService = function (callback) {
        
        try {
            
            display = new google.maps.DirectionsRenderer();
            service = new google.maps.DirectionsService();

            display.setMap(map);

            callback.call(this, true);
            
        } catch (e) {
            callback.call(this, false);
        }
    };
    
    this.DisplayRoute = function (start, end) {
        
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

// Every markers latitude and longtitude will be held by the Cluster object for 
// ease of adding the items for each region.  This object will require extra fields.
// 
var Cluster = function () {
    
    "use strict";
    var group = [];
    
    this.Retrieve = function (i) {
        return group[i];
    };
    
    this.Add = function (x, y, e, a) {
        group.push({Latitude: x, Longtitude: y, key: e, name: a});
    };
    
    this.Refresh = function (key, callback) {
        
        var response = Array.map.call(group, function (e) { return e === key; });
        
        callback.call(response);
    };
};

// This is the map constructor and controller
var Topology = function (element) {
    
    'use strict';
    if (!(this instanceof Topology)) { return new Topology(); }
    /*         
        Private       
    */
    var config = {
        
            allowRouting: false,
            
            canvas: element,

            center: 0,
            
            latitude: 53.7505694,
        
            longtitude: -3.0284623,
            
            level: 6,
        
            cluster: new Cluster()
        
        },
        geocoder = new google.maps.Geocoder();
    
    window.onresize = function () {
        
        setTimeout(function () {
            
            // Whatever you want to do after the wait of a 400th 
            map.panTo(config.center);
            
            //var infowindow;
            //infowindow.setContent('Hello from siing: ');
            //infowindow.open(map);
        }, 400);
    };
    
    function xmlHttpRequester(url, callback) {
        
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {

            if (request.readyState === 4 && request.status === 200) {

                callback.call(request.responseXML);
            }
        };

        request.open('GET', url, false);
        
        request.send();
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
    
    function addPointOnMap(ll, icon) {
        
        var marker = new google.maps.Marker({
        
            draggable: false,
            //animation: google.maps.Animation.DROP,
            position: ll,
            map: map,
            icon: icon
        });
        
        google.maps.event.addListener(marker, 'click', function (event) {

            //infowindow.open(map, marker);
            //alert('Marker click event: ' + event.latLng); // + event.latLng

            window.setTimeout(function () {
                
                map.setZoom(config.level + 2);
                map.panTo(marker.getPosition());
            }, 400);
        });
    }
    
    function addStoreToCluster() {
        
        //xmlHttpRequester
        
        xmlHttpRequester('storedata.xml', function () {

            try {

                var xmlDoc = this,
                    nam = xmlDoc.getElementsByTagName('name'),
                    poc = xmlDoc.getElementsByTagName('postcode'),
                    lat = xmlDoc.getElementsByTagName('lat'),
                    lng = xmlDoc.getElementsByTagName('lng'),
                    store,
                    point,
                    i,
                    p;

                for (i = 0; i < nam.length; i += 1) {
                    
                    config.cluster.Add(lat[i].childNodes[0].nodeValue,
                                       lng[i].childNodes[0].nodeValue,
                                       nam[i].childNodes[0].nodeValue,
                                       poc[i].childNodes[0].nodeValue);
                    
                    //
                    p = new google.maps.LatLng(lat[i].childNodes[0].nodeValue, lng[i].childNodes[0].nodeValue);
                    
                    addPointOnMap(p, icon.triangle);
                }
            } catch (e) {

                alert('Mapping experienced an exception\nadding store data.' + e.message);
            }
        });
    }
    
    /*
        Priviliged 
    */
    this.Initialise = function () {
        
        // It would be nice to load the store data concurrently, xmlHttpRequester to the rescue
        // which loads data with an async HttpRequest.  What about a HTML5 web worker invoking 
        // a separate file...Shame, the web worker sends back it's data in the response field, 
        // and it isn't formatted as xml.  No surprise, I'm using the xmlHttpRequester method.  
        setTimeout(function () {
            
            // Whatever you want to do after the wait of a 400th 
            addStoreToCluster();
            
        }, 1650);
         
        config.center = new google.maps.LatLng(config.latitude, config.longtitude);
        
        var roadMapType, styledMapOptions, options = {
            
            zoom: 6,
            
            center: config.center,
            
            mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'roadatlas'] }
            
        };

        google.maps.visualRefresh = true;
        
        map = new google.maps.Map(document.getElementById(config.canvas), options);

        roadMapType = new google.maps.StyledMapType(roadMapStyles, {});
        
        map.mapTypes.set('roadatlas', roadMapType);
        map.setMapTypeId('roadatlas');
        
        config.cluster.Add(config.latitude, config.longtitude, 'Toast', '');
            
        addPointOnMap(config.center, icon.office);
        
        //addStoreToCluster();
        
//        addPointOnMap(new google.maps.LatLng(55.640398956687356, -3.53759765625), icon.scotland);
//        
//        addPointOnMap(new google.maps.LatLng(54.50111704294316, -1.93359375), icon.northwest);
//        
//        addPointOnMap(new google.maps.LatLng(51.281435604431195, -1.0046875), icon.southeast);
//        
//        addPointOnMap(new google.maps.LatLng(52.93539665862318, -1.82373046875), icon.centralwest);
    };
    
    this.SupportsWebWorkers = function () {
        
        setTimeout(function () {
            
            var success = window.Worker !== null;

            if (success) {

                alert('Web workers are supported in this browser. :}');

            }
            
        }, 2000);
        

    };
    
    this.Shout = function (m) {
        
        if (m === undefined) {
            
            alert("Shout is empty");
            
            return;
        }
        
        alert(m);
    };
    
    this.ZoomChanged = function (callback) {
        
        google.maps.event.addListener(map, 'zoom_changed', function () {
           
            config.level = map.getZoom();
            
            callback(config.level);
        });
    };
    
    this.GeocodeResult = function (p) {
        
        geocoder.geocode({ 'address': p }, function (results, status) {

            if (status !== google.maps.GeocoderStatus.OK) {

                alert('Geocoder received a message from Google.\n\n' + status);

                return;
            }
            
            addPointOnMap(results[0].geometry.location);
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
            
            xmlHttpRequester(escape(evt.dataTransfer.files[0].name), function () {

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
};

// Cartographer is now inheriting AsyncLoader and it's priviliged methods.
Topology.prototype = new Director();

window.onload = function () {
    
    'use strict';
    var tp = new Topology('map_canvas');
    
    tp.Initialise();
    
    tp.Receive(function (p) {

        tp.GeocodeResult(p);
    });
    
    tp.SupportsWebWorkers();
    
/*    tp.InitializeDirectionService(function () {
        
        var ok = this;
        
        if (ok) {
            
            tp.DisplayRoute('fy41pa', 'OX16');
            
        } else {
            
            alert('Routing failed.');
        }
    });*/
};