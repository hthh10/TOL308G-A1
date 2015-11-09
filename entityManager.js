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

    this._categories = [this._bombermen, this._ballom, this._onil, this._bombs, this._explosions];

},

init: function() {
    this._generateBombermen();
    this._generateEnemies();
},


dropBomb: function(cx, cy, xPos, yPos, strength) {
  this._bombs.push(new Bomb({
      cx   : cx,
      cy   : cy,
      xPos : xPos,
      yPos : yPos,
      strength : strength
  }));
},


// explode: function(cx, cy) {
//   console.log(cx);
//   // 5 er lengd spreningar
//   // fyrir hvern hluta af sprengjunni er athugað hvort hún sé að fara útfyrir canvas
//   // ef svo er hættir hún
//   for (var i = 0; i < 5; i++) {
//
//         //((cx + 25 * i) < g_canvas.width - 20 / 2) &&
//     if (spatialManager.checkForWall((cx + 25 * i),cy)) {
//       this._bombs.push(new Explosion({
//         cx: cx + 25 * i,
//         cy: cy
//       }));
//     }
//     if ((cx - 25 * i) > 20) {
//       this._bombs.push(new Explosion({
//         cx: cx - 25 * i,
//         cy: cy
//       }));
//     }
//     if ((cy + 25 * i) < g_canvas.height - 20 / 2) {
//       this._bombs.push(new Explosion({
//         cx: cx,
//         cy: cy + 25 * i
//       }));
//     }
//     if ((cy - 25 * i) > 20) {
//       this._bombs.push(new Explosion({
//         cx: cx,
//         cy: cy - 25 * i
//       }));
//     }
//   }
// },




explode : function(cx,cy,xPos,yPos,strength) {
  //Middle
  console.log("xPos: ",xPos, "yPos", yPos,"strength", strength);
  this._bombs.push(new Explosion({
    cx : cx,
    cy : cy
  }));
  //Right
  //if(wall.baseWall[xPos+1][yPos] === 2)

 // this._bombs.push(new Explosion({
 //   cx: cx+g_images.explosion.width,
 //   cy: cy
 // }))




},


// OH THE HORROR
// each for loop checks if the explosion will hit a wall or exit the canvas
// if it does the loop is broken
/*explode: function(cx, cy) {
//TODO: Hreinsa þessa ósköp :)

// explosion to the right
  for (var i = 0; i < 2; i++) {
    if (((cx + 25 * i) > g_canvas.width - 20 / 2) ||
      (spatialManager.checkForWall((cx + 25 * i), cy))) {
      break;
    } else {
      this._bombs.push(new Explosion({
        cx: cx + 25 * i,
        cy: cy
      }));
    }
  }
  // explosion to the left
  for (var j = 0; j < 2; j++) {
    if (((cx - 25 * j) < 20) ||
      (spatialManager.checkForWall((cx - 25 * j), cy))) {
      break;
    } else {
      this._bombs.push(new Explosion({
        cx: cx - 25 * j,
        cy: cy
      }));
    }
  }
  //down
  for (var l = 0; l < 2; l++) {
    if (((cy + 25 * i) > g_canvas.height - 20 / 2) ||
      (spatialManager.checkForWall(cx, (cy + 25 * l)))) {
      break;
    } else {
      this._bombs.push(new Explosion({
        cx: cx,
        cy: cy + 25 * l
      }));
    }
  }
  // up
  for (var f = 0; f < 2; f++) {
    if (((cy - 25 * i) < 20) ||
      (spatialManager.checkForWall(cx, (cy - 25 * l)))) {
      break;
    } else {
      this._bombs.push(new Explosion({
        cx: cx,
        cy: cy - 25 * f
      }));
    }
  }
},

*/

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

addPlayer2 : function() {
	this._bombermen.push(new Bomberman({
        cx   : g_canvas.width-40,
        cy   : 120,
		KEY_UP     : 'I'.charCodeAt(0),
		KEY_DOWN   : 'K'.charCodeAt(0),
		KEY_LEFT   : 'J'.charCodeAt(0),
		KEY_RIGHT  : 'L'.charCodeAt(0),

		KEY_FIRE   : 'O'.charCodeAt(0)
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
