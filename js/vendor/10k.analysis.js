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
(function (dataloader, $, undefined) {
    
    "use strict";
    /**
    * PRIVATE variables and methods.
    * 
    * In javascript public properties are defined by the "var" keyword
    * and private methods by "function" keyword.
    *
    */
    var data = new Data(),
        pieDataCaptured = false,
        lineDataCaptured = false,
        colours = ["#FFCC00", "#FF9900", "#CC3300", "#CC0033", "#CC3366", "#CC6666", "#CC9966", "#CC66CC", "#CC33FF", "#9966FF", "#9999FF", "#6699FF", "#6600FF"];
    
    /**
    * PRIVATE: addTestItem
    * 
    * Used for testing, add an item [string] and display in
    * the console.
    *
    */
    function addTestItem(item) {
        if (item !== undefined) {
            console.log("Adding " + item);
        }
    }
    
    /**
    * PRIVATE: $el
    * 
    * Similar to the JQuery method which returns the element 
    * with a specified Id.
    *
    */
    function $el(el) {
        return document.getElementById(el);
    }
    
    /**
    * PRIVATE: draw four sides of a rectangle
    * 
    * Create a rectangle at the given points.
    *
    */
    function drawRectangle(ctx, x, y, w, h, c) {
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
    }
    
    /**
    * PRIVATE: getDataAsync
    * 
    * Request data from the url passing the response 
    * to a callback method.
    *
    * This private method can be used by more than one 
    * public method to load data asynchronously.
    *
    */
    function getDataAsync(url, callback) {
    
        /*global XMLHttpRequest: false */
        var httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function () {
    
            // inline function to check the status
            // of our request, this is called on every state change
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {

                callback.call(httpRequest.responseXML);
            }
        };
    
        httpRequest.open('GET', url, false);
        httpRequest.send();
    }
    /**
    * PRIVATE: setClass
    * 
    * This function will set a css class to an element.
    *
    */
    function setClass(e, cl) {
     
        $el(e).setAttribute((document.all ? "className" : "class"), cl);
    }
    
    
    /**
    * PUBLIC variables and methods.
    * 
    * In javascript public properties are defined as [Object.variable] e.g. dataloader.quantity = 1; 
    * and public methods by [Object.method] = function () {}.
    *
    */
    dataloader.quantity = 1;

    /**
    * PUBLIC: test
    * 
    * run the test method.
    *
    */
    dataloader.test = function () {
        addTestItem("\t\n This test item \n\t");
        console.log("Adding " + dataloader.quantity);
        dataloader.quantity += 1;
    };
    
    
    /**
    * PUBLIC: loadLineXml
    * 
    * I'm not supporting anything less than IE7+. 
    * Code for modern browsers; IE7+, Firefox, Chrome, Opera, Safari.
    *
    */
    dataloader.loadLineXml = function (url) {

        getDataAsync(url, function () {

            //console.log(this);
            
            var xmlDoc = this,
                years = xmlDoc.getElementsByTagName("year"),
                runners = xmlDoc.getElementsByTagName("runners"),
                raised = xmlDoc.getElementsByTagName("raised"),
                i = 0;
            
            for (i = 0; i < years.length; i += 1) {
                
                data.loadLineData(years[i].childNodes[0].nodeValue, runners[i].childNodes[0].nodeValue, raised[i].childNodes[0].nodeValue);
            }

            console.log(data.getData(1)[0].year);
            
            lineDataCaptured = true;
        });
    };
    
    
    /**
    * PUBLIC: loadPieXml
    * 
    * I'm not supporting anything less than IE7+. 
    * Code for modern browsers; IE7+, Firefox, Chrome, Opera, Safari.
    *
    */
    dataloader.loadPieXml = function (url) {

        getDataAsync(url, function () {

            //console.log(this);
            
            var xmlDoc = this,
                charities = xmlDoc.getElementsByTagName("charity"),
                percents = xmlDoc.getElementsByTagName("percent"),
                i = 0;
            
            for (i = 0; i < charities.length; i += 1) {
                
                data.total(parseFloat(percents[i].childNodes[0].nodeValue));
                data.loadPieData(charities[i].childNodes[0].nodeValue, percents[i].childNodes[0].nodeValue);
            }
            
            setClass('charities', 'hidden');

            console.log(data.getData(0)[0].label);
            
            pieDataCaptured = true;
        });
    };
    
    /**
    * PUBLIC: loadPieInTable
    * 
    * I'm not supporting anything less than IE7+. 
    * Code for modern browsers; IE7+, Firefox, Chrome, Opera, Safari.
    *
    */
    dataloader.loadTablePieData = function () {
        
        var rows = $el('charities').getElementsByTagName('tr'), 
            i = 0;

        for (i = 0; i < rows.length; i++) {
            
            var th = rows[i].getElementsByTagName('th')[0],
                td = rows[i].getElementsByTagName('td')[0];

            data.total(parseFloat(td.innerHTML));
            data.loadPieData(th.innerHTML, td.innerHTML);
        }        
        /*
            Apply an css attribute to hide the table.  
        */            
        setClass('charities', 'hidden');

        console.log(data.getData(0)[0].label);
            
        pieDataCaptured = true;
    }
    

    /**
    * PUBLIC: pieChart
    * 
    * Draw a pie chart
    * 
    * The algorithm for making a simple pie chart is something like...
    * 1. Get the data that is being represented by the chart (it must be numerical)
    * 2. Calculate the total by adding all of the data together.
    * 3. Calculate the amount of pie for each piece of data by dividing it by the total.
    * 4. Multiply 2*pi radians by the amount of pie to get the length of the arc for that piece of pie.
    * 5. Draw the resulting arcs at a distance of r (the radius) from the center starting each arc at either 0 (the first arc) or from the end of the last drawn arc.
    * 6. Each arc has a line from its beginning and its ending to the center of the circle that is of length r    
    *
    */
    dataloader.pieChart = function (context) {
        
        if (!pieDataCaptured) { return; }
        
        console.log("total : " + data.getTotal());
        
        var t = data.getTotal(),
            el = $el(context),
            last = 0,
            ctx = el.getContext("2d"),
            oft = el.width,
            y = 20,
            radius = (el.height / 3.14),
            dis = data.getData(0),
            /*
            As in the comment below the x,y variables
            are defined as the center of the circle.
            */
            cX = radius + y,
            cY = (el.height / 2) - radius / 2,
            i = 0,
            anticlockwise = false,
            slice = 0,
            val = 0;
        
        ctx.font = "bold 12px sans-serif";

        for (i = 0; i < dis.length; i += 1) {
            
            val = parseFloat(dis[i].value);
            slice = (Math.PI * 2 * (val / t));
            ctx.fillStyle = colours[i];
            ctx.beginPath();
            ctx.moveTo(cX, cY);
            ctx.arc(cX, cY, radius, last, last + slice, anticlockwise);
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
            //ctx.r;
            last += Math.PI * 2 * (val / t);
            
            /*
            Probably need a legend
            */
            drawRectangle(ctx, oft - 220, y, 10, 10, colours[i]);
            ctx.fillText(dis[i].label, oft - 205, y + 10);
            
            y += 20;
        }
    };
    
    dataloader.barChart = function (context) {
        
        var ctx = $el(context).getContext("2d"),
            x = 10,
            y = 10,
            dis = data.getData(0),
            width = ($el(context).width - 20) / dis.length,
            i = 0;

        for (i = 0; i < dis.length; i += 1) {//
            
            /*
            Draw a rectangle of the specified colour
            */
            drawRectangle(ctx, x, y, width, dis[i].value * 4, colours[i]);
            x += width;
        }
    };
    

}(window.dataloader = window.dataloader || {}));

window.onload = function () {
    
    /*
    try {
    
    } catch( e ) {
        console.log( e.message ); //isHot is not defined
    }
    */
     
    "use strict";
    //dataloader.loadLineXml('lines.xml');
    dataloader.loadTablePieData();
    //dataloader.loadPieXml('splits.xml');
    dataloader.pieChart('canvas');
    //dataloader.barChart('canvas1');
};