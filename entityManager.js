/*
entityManager.js
A module which handles arbitrary entity-management for "Bomberman"
We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.
"Private" properties are denoted by an underscore prefix convention.
*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA
_bombs : [],
_bombermen : [],
_ballom : [],
_onil : [],
_explosions : [],
_powerups : [],

// -------------
// Ugly var for level design


// "PRIVATE" METHODS

_generateBombermen : function() {
    this.generateBomberman();
},

_generateEnemies : function() {
    this.generateEnemy();
},


_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {

    this._categories = [this._bombermen, this._ballom, this._onil, this._bombs, this._explosions, this._powerups];

},

init: function() {
    this._generateBombermen();
    this._generateEnemies();
},


dropBomb: function(cx, cy, xPos, yPos, strength, bombermanID) {
  this._bombs.push(new Bomb({
      cx   : cx,
      cy   : cy,
      xPos : xPos,
      yPos : yPos,
      strength : strength,
      bombermanID : bombermanID
  }));
},


explode : function(cx,cy,xPos,yPos,strength) {
  var step = g_images.wall.width;
  var right = true, left = true, up = true, down = true;



  //Middle
  this._bombs.push(new Explosion({
    cx : cx,
    cy : cy
  }));

  for(var i = 0; i < strength; i++) {
    // Right
    if(xPos < wall.baseWall[i].length-i && right) {
      if(wall.baseWall[yPos][xPos+i+1] <= 0) {
        this._bombs.push(new Explosion({
          cx : cx + step + (step*i),
          cy : cy
        }));
      }
      if(wall.baseWall[yPos][xPos+i+1] > 0 && right) {
        wall.destroyBrick(yPos,xPos+i+1);
        right = false;
        
      }
    }
    // Left
    if(xPos > 0+i) {
      if(wall.baseWall[yPos][xPos-i-1] <= 0 && left) {
        this._bombs.push(new Explosion({
          cx : cx - step - (step*i),
          cy : cy
        }));
      }
      if(wall.baseWall[yPos][xPos-i-1] > 0 && left) {
        wall.destroyBrick(yPos,xPos-i-1);
        left = false;
      }
    }
    //Up
    if(yPos > 0+i) {
      if(wall.baseWall[yPos-1-i][xPos] <= 0 && up) {
        this._bombs.push(new Explosion({
          cx : cx,
          cy : cy - step - (step*i)
        }));
      }
      if(wall.baseWall[yPos-i-1][xPos] > 0 && up) {
        wall.destroyBrick(yPos-i-1,xPos);
        up = false;
      }
    }
    //Down
    if(yPos < wall.baseWall.length-1-i) {
      if(wall.baseWall[yPos+1+i][xPos] <= 0 && down) {
        this._bombs.push(new Explosion({
          cx : cx,
          cy : cy + step + (step*i)
        }));
      }
      if(wall.baseWall[yPos+i+1][xPos] > 0 && down) {
        wall.destroyBrick(yPos+i+1,xPos);
        down = false;
      }
    }

  } // End of loop

},
  



generateBomberman : function(descr) {
  this._bombermen.push(new Bomberman(descr));
},

generateEnemy : function(){
    this._ballom.push(new Enemy({
      cx : 40,
      cy : 350,
      sprite : g_sprites.ballom
    }));

    this._onil.push(new Enemy({
      cx : 360,
      cy : 190,
      sprite : g_sprites.onil
    }));
},

generatePowerup : function(cx,cy) {
  this._powerups.push(new Powerup({
    cx:cx,
    cy:cy,
    id: util.randRange(0,3)
  }));
},

addPlayer2 : function() {
  this._bombermen.push(new Bomberman({
        cx   : g_canvas.width-40,
        cy   : 120,
    KEY_UP     : 'I'.charCodeAt(0),
    KEY_DOWN   : 'K'.charCodeAt(0),
    KEY_LEFT   : 'J'.charCodeAt(0),
    KEY_RIGHT  : 'L'.charCodeAt(0),

    KEY_FIRE   : '9'.charCodeAt(0)
    }));
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();