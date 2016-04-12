var map;

var google;

function loadGoogleMap() {
    
    "use strict";

    // Enable the visual refresh.
    google.maps.visualRefresh = true;

    var blackpool = new google.maps.LatLng(53.81741362363378, -3.052654266357422);

    var myOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: blackpool
    }

    // Load the map into the element 'map_canvas' with the options defined above.
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    addMarker(blackpool);

    // Add a faded circle layer to Blackpool.
    var fadedBlueCircle = {
        strokeColor: '#23ed00',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: '#23edef',
        fillOpacity: 0.25,
        map: map,
        center: blackpool,
        radius: map.getZoom() * 600
    };

    var blackpoolCircle = new google.maps.Circle(fadedBlueCircle);

    // Add an event listener to the circle a click event to the map.
    // This event currently displays an Alert Box and adds a new marker.
    // If you the event to fire when the user clicks the map, replace 'citycircle'
    // with 'map'.
    google.maps.event.addListener(blackpoolCircle, 'click', function (event) {

        alert("Inside circle at point: " + event.latLng);

        //addMarker(event.latLng);

    });

    // This 'bike layer' only shows when the zoom level is changed
    //
/*    var bikeLayer = new google.maps.BicyclingLayer();

    // Listen to zoom events
    google.maps.event.addListener(map, 'zoom_changed', function() {

        var zoomLevel = map.getZoom();               

        if (zoomLevel > 12)
        {               
            bikeLayer.setMap(map);                   
        }
        else
        {
            bikeLayer.setMap(null);   
        }
    }); */

    // Transit, weather and cloud layer can be added in much
    // the same way as the bike layer.

    //var transitLayer = new google.maps.TransitLayer();
    //transitLayer.setMap(map);

    /*
        Add the weather and cloud layers to the map.
        This layer could be added in the zoom listener
        to only display when the zoom level is at 6 for 
        instance.
    */
    //var weatherLayer = new google.maps.weather.WeatherLayer({
    //    temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
    //});
    //weatherLayer.setMap(map);

    //var cloudLayer = new google.maps.weather.CloudLayer();
    //cloudLayer.setMap(map);
    
    //Analyse("CustomerPostcodes.xml");
    
    PushAddressOnMap("FY41DW");
    
    PushAddressOnMap("FY81RE");

    return;

}

        /// [Private method] 
        /// [Load data asynchronously, passing to the callback method on completion.]
        function AsynchronousLoader(url, callback) {
    
            /*global XMLHttpRequest: false */
            var httpRequest = new XMLHttpRequest();
        
            httpRequest.onreadystatechange = function () {
    
                // inline function to check the status of our request this is called on every state change
                if (httpRequest.readyState === 4 && httpRequest.status === 200) {

                    callback.call(httpRequest.responseXML);
                }
            };
    
            httpRequest.open('GET', url, false);
            httpRequest.send();
        }
    
        /// [Private method] 
        /// [Add each postcode as a marker on the map.]   
        function PushAddressOnMap(postcode) {
            
            var address = "FY41DW"; //document.getElementById('address').value;
            
            //var geocoder;
            
            geocoder.geocode({ 'address': postcode }, function (results, status) {
                
                if (status !== google.maps.GeocoderStatus.OK) {
                 
                    return;
                }
                
                var marker = new google.maps.Marker({
                    draggable: false,
                    animation: google.maps.Animation.DROP,
                    position: results[0].geometry.location,
                    map: map
                });
            });
        }

        function Analyse(url) {
            
            var asl = new AsynchronousLoader(url, function () {
                
                console.log(this);
                
                var xmlDoc = this,
                    codes = xmlDoc.getElementsByTagName("postcode"),
                    arby = xmlDoc.getElementsByTagName("other"),
                    i = 0;
                
                geocoder = new google.maps.Geocoder();
            
                for (i = 0; i < codes.length; i += 1) {
                    
                    PushAddressOnMap(codes[0]);
                }
            });
        };

// Function which adds a marker to the map
function addMarker(latlng) {

    var marker = new google.maps.Marker({
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: latlng,
        map: map//,
        // use a default google marker icon
        //icon: "plus.png"
    })

    //Add a click event listener to the marker
    google.maps.event.addListener(marker, 'click', function (event) {

        alert("Marker click event"); // + event.latLng

        // move and center to this marker position after a .4 second delay.
        window.setTimeout(function () {
            map.panTo(marker.getPosition());
        }, 400);

    });
}

        function AsynchronousLoader(url, callback) {
    
            /*global XMLHttpRequest: false */
            var httpRequest = new XMLHttpRequest();
        
            httpRequest.onreadystatechange = function () {
    
                // inline function to check the status of our request this is called on every state change
                if (httpRequest.readyState === 4 && httpRequest.status === 200) {

                    callback.call(httpRequest.responseXML);
                }
            };
    
            httpRequest.open('GET', url, false);
            httpRequest.send();
        }

// This is a listener which runs the function 'loadmap' when the browser window
// has loaded.
google.maps.event.addDomListener(window, 'load', loadGoogleMap);