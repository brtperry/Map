function Store(name) {

    this.Name = name;

}

Store.prototype.addLocation = function (lt, lng) {

    this.Lat = lt;
    this.Lng = lng;

};

Store.prototype.sayName = function () {

    alert('hello ' + this.Name);

};

Store.prototype.sayLocation = function () {

    alert(this.Lat);

};