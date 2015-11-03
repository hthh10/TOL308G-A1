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
_explosions : [],


// "PRIVATE" METHODS

_generateBombermen : function() {
    this.generateBomberman();
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
    this._categories = [this._bombs, this._bombermen, this._explosions];
},

init: function() {
    this._generateBombermen();
},


dropBomb: function(cx, cy) {
  this._bombs.push(new Bomb({
      cx   : cx,
      cy   : cy

  }));
},


explode: function(cx, cy) {
  console.log(cx);
  // 5 er lengd spreningar
  // fyrir hvern hluta af sprengjunni er athugað hvort hún sé að fara útfyrir canvas
  // ef svo er hættir hún
  for (var i = 0; i < 5; i++) {

    if ((cx + 25 * i) < g_canvas.width - 20 / 2) {
      this._bombs.push(new Explosion({
        cx: cx + 25 * i,
        cy: cy
      }));
    }
    if ((cx - 25 * i) > 20) {
      this._bombs.push(new Explosion({
        cx: cx - 25 * i,
        cy: cy
      }));
    }
    if ((cy + 25 * i) < g_canvas.height - 20 / 2) {
      this._bombs.push(new Explosion({
        cx: cx,
        cy: cy + 25 * i
      }));
    }
    if ((cy - 25 * i) > 20) {
      this._bombs.push(new Explosion({
        cx: cx,
        cy: cy - 25 * i
      }));
    }
  }
},

generateBomberman : function(descr) {
	this._bombermen.push(new Bomberman(descr));
},

addPlayer2 : function() {
	this._bombermen.push(new Bomberman({
        cx   : g_canvas.width-50,
        cy   : 50,
		KEY_UP     : 'I'.charCodeAt(0),
		KEY_DOWN   : 'K'.charCodeAt(0),
		KEY_LEFT   : 'J'.charCodeAt(0),
		KEY_RIGHT  : 'L'.charCodeAt(0),

		KEY_FIRE   : 'O'.charCodeAt(0)
    }));
},

generateShip : function(descr) {
    this._ships.push(new Ship(descr));
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
