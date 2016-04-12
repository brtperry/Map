;(function(){

    'use strict';
    var mapPointLocator = function (id) {
        
        var map;
        /*         
            Private       
        */
        var config = {
            
            allowRouting: false,

            canvas: document.getElementById(id),

            center: 0,

            latitude: 53.7505694,

            longtitude: -3.0284623,

            level: 6,
            
            mapSize: { x: canvas.width, y: canvas.height }

            //cluster: new Cluster()
        };


        mapPointLocator.prototype = {
            
        };

    };

    window.onload = function () {

        console.log("Hi");

        mapPointLocator('e');

    };

})();


