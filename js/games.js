;(function(){
    
    //'use strict';
    
    var Game = function(id) {
        
        var canvas = document.getElementById(id);
        
        var screen = canvas.getContext('2d');
        
        var gameSize = { x: canvas.width, y: canvas.height };
        
        this.bodies = createInvadingAlienArmy(this).concat([new Player(this, gameSize)]);
              
        var self = this;
        
        var tick = function() {
            
            self.update();
            
            self.draw(screen, gameSize);
            
            requestAnimationFrame(tick);     
            
        };
        
        tick();
           
    };
    
    Game.prototype = {
        
        update: function() {
            
            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            }
            
        },
        
        draw: function(screen, gamesize) {

            screen.clearRect(0, 0, gamesize.x, gamesize.y);
            
            for (var i = 0; i < this.bodies.length; i++)
            {
                drawRect(screen, this.bodies[i]);
                
            }
        
        },

        addBody: function (body) {
            this.bodies.push(body);
        }
        
    };
    
    var Player = function(game, gamesize) {
        
        this.game = game;
        this.size = { x: 15, y: 15 };        
        this.center = { x: gamesize.x / 2, y: gamesize.y - this.size.x };
        this.keyBoarder = new KeyBoarder();
    };
    
    Player.prototype = {
        
        update: function () {

            if (this.keyBoarder.isDown(this.keyBoarder.KEYS.LEFT)) {

                this.center.x -= 2;

                //if (this.center.x 

            } else if (this.keyBoarder.isDown(this.keyBoarder.KEYS.RIGHT)) {

                this.center.x += 2;

            }

            if (this.keyBoarder.isDown(this.keyBoarder.KEYS.SPACE)) {

                var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x * 2}, { x: 0, y: -6 } );

                this.game.addBody(bullet);

            }           
        }     
    };

    var Invader = function (game, center) {
        this.game = game;
        this.size = { x: 15, y: 15 };
        this.center = center;
        this.patrolX = 0;
        this.speedX = 0.3;
    };

    Invader.prototype = {

        update: function () {

            if (this.patrolX < 0 || this.patrolX > 40) {
                this.speedX -= this.speedX;
            }

            this.center.x += this.speedX;
            this.patrolX += this.speedX;
        }
    };

    var createInvadingAlienArmy = function (game) {
        var invaders = [];

        for (var i = 0; i < 24; i++) {

            // X component of the alien,30 is where the alien sits in 
            // from the left to start, (i & 8) i mod 8 is so we can 
            // have 8 columns of invaders and then multiply by 30 so 
            // each alien is spaced 30 paces apart from each other.
            var x = 30 + (i % 8) * 30

            // Y component of the alien, (i & 3) i mod 3 is so we can 
            // have 3 rows of invaders.
            var y = 30 + (i % 3) * 30

            invaders.push(new Invader(game, { x: x, y: y }));
        }

        return invaders;
    };

    var Bullet = function (center, velocity) {

        this.size = { x: 3, y: 3 };
        this.center = center;
        this.velocity = velocity;
    };

    Bullet.prototype = {

        update: function () {

            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;

        }

    };

    
    var drawRect = function(screen, body) {    
        screen.fillRect(body.center.x - body.size.x / 2,
                        body.center.y - body.size.y / 2,
                        body.size.x, body.size.y);
    };

    var KeyBoarder = function () {

        var keyState = {};

        window.onkeydown = function (e) {

            keyState[e.keyCode] = true;
        };

        window.onkeyup = function (e) {

            keyState[e.keyCode] = false;
        };

        this.isDown = function (keyCode) {
            return keyState[keyCode] === true;
        };

        this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
    };


    
    window.onload = function() {
        
        //console.log("Hi");
        
        new Game("screen");
        
    

        
    };
    
})();

(function(global) {

function PhotonTorpedoSystem() {}
  PhotonTorpedoSystem.prototype.launch = function() {
  console.log('launching torpedos');
};

var torpedos = new PhotonTorpedoSystem(),

var weaponSystem = {
  torpedos: torpedos;
};

/* Create instance of enterprise etc */

global.PhotonTorpedoSystem = PhotonTorpedoSystem; // Export just this to the window
}(window));