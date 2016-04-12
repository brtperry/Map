/*global undefined: false */
/*global alert: false */

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
    
    northwest: '../img/northwest.png'
};

function Manager(name, email) {
    
    'use strict';
    this.name = name;
    this.email = email;
}


function Area(icon, name, manager) {

    'use strict';
    var stores = [];
    this.icon = icon;
    this.name = name;
    this.manager = manager;
    
    this.addStore = function (store) {

        stores.push(store);
    };

    this.GetStore = function (index) {
        
        return stores[index];
    };
}



var cluster = (function () {
    
    'use strict';
    var areas = [];
    
    return {

        add: function (a) {
            
            areas.push(a);
        },
        getIcon: function (index) {
            
            return areas[index].area.icon;
        },
        getManager: function (index) {
            
            return areas[index].area.manager.name;
        },
        getStoreId: function (x, y) {
            
            return areas[x].area.GetStore(y).id;
        },
        getStoreManager: function (x, y) {
            
            return areas[x].area.GetStore(y).manager.name;
        }
    };
}());

window.onload = function () {
    
    'use strict';
    var e, eleimg, area = new Area(icon.northwest, 'Central West', new Manager('Matt Henry', 'matt.henry@email.co.uk'));

    area.addStore({
        id: "01",
        name: "Banbury",
        postcode: "OX16",
        point: {latitude: 52.0632, longtitude: -1.3339386},
        manager: new Manager("Dave Henry", "dave.henry@email.co.uk")
    });
    
    area.addStore({
        id: "0143",
        name: "Exeter",
        postcode: "OX16 5UW",
        point: {latitude: 52.0632075, longtitude: -1.3339386000000104},
        manager: new Manager("Bob Kelly", "bob.kelly@email.co.uk")
    });

    cluster.add({
        area: area
    });
    
    eleimg = document.getElementById('data-img');
    
    eleimg.src = cluster.getIcon(0);
    
    //e = clusterModule.getManager(0);
    
    //alert(e);
    
    e = cluster.getStoreManager(0, 1);
    
    alert(e);


};