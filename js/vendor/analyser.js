var Data = function () {
    
    "use strict";
    var t = 0,
        pie = [],
        line = [];
        
    this.total = function (x) {
        t += x;
    };
    
    this.getData = function (i) {
        return i === 0 ? pie : line;
    };

    this.getTotal = function () {
        return t;
    };
    
    this.loadPieData = function (e, f) {
        pie.push({label: e, value: f});
    };
    
    this.loadLineData = function (e, f, g) {
        line.push({year: e, runners: f, money: g});
    };
};

/**
* Dataloader Extendable Javascript Library. An implementation of an asynchronous xml file loader.
* 
* Data is extracted from xml files or a html table asynchronously
* and used to draw pie chart, bar chart or bezier curves onto a
* HTML 5 canvas.
*
* The * global * declarations handle JSLint errors.
*
*/
/*global console: false */
/*global dataloader: false */
/*global document: false */
/*global window: false */
/*global undefined: false */
var DataAnalyser = function () {
    
    "use strict";
    
    // Always start over with a *new* object
    
    if (!(this instanceof DataAnalyser)) { return new DataAnalyser(); }
    
    // Private methods:
    function $(id) {
        if (typeof id === 'string') {
            return document.getElementById(id);
        }
        return id;
    }
    
    function rect(ctx, x, y, w, h, c) {
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
    }
    
    function asyncXml(url, callback) {
    
        /*global XMLHttpRequest: false */
        var httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function () {
    
            // inline function to check the status
            // of our request
            // this is called on every state change
    
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {

                callback.call(httpRequest.responseXML);
            }
        };
    
        httpRequest.open('GET', url, false);
        httpRequest.send();
    
    }
    /*
    
    Public methods:
    
    First analyse the data and place the labels and values into 
    the data array.
    
    */
    var colours = ["#FFCC00", "#FF9900", "#CC3300", "#CC0033", "#CC3366", "#CC6666", "#CC9966", "#CC66CC", "#CC33FF", "#9966FF", "#9999FF", "#6699FF", "#6600FF"],
        data = new Data();
    
    var setClass = function (e, cl) {
     
        $(e).setAttribute((document.all ? "className" : "class"), cl);    
    }
    
    // Asynchronous call to load bezier data
    // from xml file.
    /*
    this.asyncLoad = function (url) {
        
        // I'm not supporting anything less than IE7+.  Code for modern browsers...IE7+, Firefox, Chrome, Opera, Safari
        asyncXml(url, function () {
            
            console.log(this);
            var xmlDoc = this,
                years = xmlDoc.getElementsByTagName("year"),
                runners = xmlDoc.getElementsByTagName("runners"),
                raised = xmlDoc.getElementsByTagName("raised");
            
            console.log(runners[14].childNodes[0].nodeValue);
   
        
        });
    }
    */
    this.analyse = function () {
        
        var rows = $('charities').getElementsByTagName('tr'),
            i = 0;
        for (i = 0; i < rows.length; i += 1) {
            
            var th = rows[i].getElementsByTagName('th')[0],
                td = rows[i].getElementsByTagName('td')[0];

            data.total(parseFloat(td.innerHTML));
            data.loadPieData(th.innerHTML, td.innerHTML);
        }        
        /*
            Apply an css attribute to hide the table.  
        */            
        $('charities').setAttribute((document.all ? "className" : "class"), "hidden");
    };
    
    /*
    this.bezierData = function () {
        
        var rows = $('beziers').getElementsByTagName('tr'),
            i = 0;
    
        for (i = 0; i < rows.length; i++) {
            
            var th = rows[i].getElementsByTagName('th')[0],
                td = rows[i].getElementsByTagName('td')[0],
                te = rows[i].getElementsByTagName('td')[1];
            
            data.loadLineData({year: th.innerHTML, runners: td.innerHTML, money: te.innerHTML});
        }  
        $('beziers').setAttribute((document.all ? "className" : "class"), "hidden");   
    };
    */
    
    /*
    
    Draw a pie chart
    The algorithm for making a simple pie chart is something like...
    
    1. Get the data that is being represented by the chart (it must be numerical)
    2. Calculate the total by adding all of the data together.
    3. Calculate the amount of pie for each piece of data by dividing it by the total.
    4. Multiply 2*pi radians by the amount of pie to get the length of the arc for that piece of pie.
    5. Draw the resulting arcs at a distance of r (the radius) from the center starting each arc at either 0 (the first arc) or from the end of the last drawn arc.
    6. Each arc has a line from its beginning and its ending to the center of the circle that is of length r    
        
    */
    this.pieChart = function (context) {
        
        var t = data.getTotal(),
            last = 0,
            ctx = $(context).getContext("2d"),
            oft = $(context).width,  
            y = 20,
            radius = ($(context).height / 3.14),
            dis = data.getData(0),
            /*
            As in the comment below the x,y variables
            are defined as the center of the circle.
            */
            cX = radius + y,
            cY = ($(context).height / 2) - radius / 2,
            i = 0;
        
        ctx.font = "bold 12px sans-serif";

        for (i = 0; i < dis.length; i++) {
            
            var val = parseFloat(dis[i].value),
                slice = (Math.PI*2*(val/t));

            ctx.fillStyle = colours[i];
            ctx.beginPath();
            ctx.moveTo(cX,cY);
            ctx.arc(cX,cY,radius,last,last + slice,false);
            /*
            
            arc(x, y, radius, startAngle, endAngle, anticlockwise)
            
            This method takes five parameters: x and y are the coordinates of the circle's center. Radius is self explanatory. 
            The startAngle and endAngle parameters define the start and end points of the arc in radians. The starting and 
            closing angle are measured from the x axis. The anticlockwise parameter is a Boolean value which when true draws 
            the arc anticlockwise, otherwise in a clockwise direction.
            Note: Angles in the arc function are measured in radians, not degrees. To convert degrees to radians you can use 
            the following JavaScript expression: var radians = (Math.PI/180)*degrees.

            https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes#
            
            */
            ctx.lineTo(cX, cY);
            ctx.fill();
            ctx.r;
            last += Math.PI*2*(val/t);
            /*
            Probably need a legend
            */
            rect(ctx, oft-220, y, 10, 10, colours[i]);
            ctx.fillText(dis[i].label, oft-205, y + 10);
            
            y += 20;
        }
    };

    /*
    
    This will require a collections of points.
    
    
    this.quadraticCurve = function () {
        
        var ctx = $('canvas').getContext('2d');
        // Quadratric curves example
        
        ctx.beginPath();
        ctx.moveTo(75, 25);
        //ctx.quadraticCurveTo(25,25,25,62.5);
        //ctx.quadraticCurveTo(25,100,50,100);
        //ctx.quadraticCurveTo(50,120,30,125);
        ctx.quadraticCurveTo(60, 120, 65, 100);
        ctx.quadraticCurveTo(125, 100, 125, 62.5);
        ctx.quadraticCurveTo(125, 25, 75, 25);
        ctx.stroke();        
    }
    
    this.barChart = function (context) {
        
        var ctx = $(context).getContext("2d"), 
            x = 10,
            y = 10,
            dis = data.getData(0),
            width = ($(context).width - 20) / dis.length,
            i = 0;
        
        for (i = 0; i < dis.length; i++) {//
            
            
            //Draw a rectangle of the specified colour
            
            rect(ctx, x, y, width, dis[i].value * 4, colours[i]);
            x += width;
        }
    }    
    */
    /*
    
    This will require a collections of points.
    
    
    
    this.bezierCurve = function () {
        
        var ctx = $('canvas').getContext('2d');
        // Quadratric curves example
        ctx.beginPath();
        ctx.moveTo(75,40);
        ctx.bezierCurveTo(75,37,70,25,50,25);
        ctx.bezierCurveTo(20,25,20,62.5,20,62.5);
        ctx.bezierCurveTo(20,80,40,102,75,120);
        ctx.bezierCurveTo(110,102,130,80,130,62.5);
        ctx.bezierCurveTo(130,62.5,130,25,100,25);
        ctx.bezierCurveTo(85,25,75,37,75,40);
        ctx.fill();      
    } 
    */    
    
}

/*
DataAnalyser.prototype.map = function (callback) {
    
    alert('do this');
 
    callback.call();
}

function andthat() {
    
    console.log('and that');
 
    alert('and that');
}
*/

window.onload = function () {
     
    var analyser = new DataAnalyser ();
    analyser.analyse();
    analyser.pieChart('canvas');
    
    
    //analyser.map(andthat);
    
    //analyser.barChart('canvas1');
    //analyser.bezierData();
}
                     


/*




*/