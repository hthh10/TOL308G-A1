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
_pakupaku : [],
_explosions : [],
_powerups : [],
_door : [],

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

    this._categories = [this._bombermen, this._ballom, this._onil,
       this._bombs, this._explosions, this._powerups, this._door, this._pakupaku];

},

clearEntityType : function (aCategory) {
	for (var i = 0; i < aCategory.length; ++i) {
		aCategory[i].kill();
	}
},

initLevel: function(level) {
	console.log(g_level);
	if (level === 1) {
		this._generateBombermen();
		this._generateEnemies();
	}
	else if (level < 4) {
		this.resetBombermen();
		// Clear relevant entities
		this._door[0].kill();
		this.clearEntityType(this._bombs);
		this.clearEntityType(this._explosions);
		this.clearEntityType(this._powerups);
		
		// Generate new level
		this._generateEnemies();
		wall.generateLevel(g_level);
	}
	else if (level === 4) {
		g_score.win = true;
	}	
},

initStorymode : function() {
	this.initLevel(1);
},

initMultiplayer: function() {
	this._generateBombermen();
	this.addPlayer2();
},

checkWinConditions : function() {
	if (!g_multiplayerMode) {
		if (g_level < 4) {
			if (this._ballom.length < 1 && this._onil.length < 1) {
				g_level += 1;
				this.initLevel(g_level);
			}
		}
		else if (g_level === 4) {

		}
	}
	else {
		if (this._bombermen.length < 2) {
			g_score.win = true;
		}
	}

},


dropBomb: function(cx, cy, xPos, yPos, strength, bombermanID, trigger) {
  this._bombs.push(new Bomb({
      cx   : cx,
      cy   : cy,
      xPos : xPos,
      yPos : yPos,
      strength : strength,
      bombermanID : bombermanID,
      trigger : trigger
  }));
},


explode : function(cx,cy,xPos,yPos,strength, bombermanID,explodeSound) {
  var step = g_images.wall.width;
  var right = true, left = true, up = true, down = true;

  if(explodeSound.currentTime > 0.5) explodeSound.currentTime = 0;
  explodeSound.play();
  //Middle
  this._bombs.push(new Explosion({
    cx : cx,
    cy : cy,
    bombermanID : bombermanID
  }));

  for(var i = 0; i < strength; i++) {
    // Right
    if(xPos < wall.baseWall[i].length-i && right) {
      if(wall.baseWall[yPos][xPos+i+1] <= 0) {
        this._bombs.push(new Explosion({
          cx : cx + step + (step*i),
          cy : cy,
          bombermanID : bombermanID
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
          cy : cy,
          bombermanID : bombermanID
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
          cy : cy - step - (step*i),
          bombermanID : bombermanID
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
          cy : cy + step + (step*i),
          bombermanID : bombermanID
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
    this._ballom.push(new Ballom({
      cx : 40,
      cy : 350,
      sprite : g_sprites.ballomRight || g_sprites.ballomLeft ||
              g_sprites.ballomUp
    }));
    /*
    this._ballom.push(new Enemy({
      cx : 360,
      cy : 190,
      sprite : g_sprites.ballomRight || g_sprites.ballomLeft
    }));
*/
    this._onil.push(new Onil({
      cx : 360,
      cy : 190,
      sprite : g_sprites.onilLeft && g_sprites.onilRight,
      speed : 3
    }));

    this._pakupaku.push(new Pakupaku({
      cx : 600,
      cy : 150,
      sprite : g_sprites.pakupaku,
      speed : 2.2
    }));
},

// tímabundið fall til að messa ekki í enemies á meðan
// þeir eru svona mikið under construction
generateRandomEnemy : function(cx, cy){
    var luck = Math.random();
    if (luck<0.5) {
    this._ballom.push(new Ballom({
      cx : cx,
      cy : cy,
      sprite : g_sprites.onilLeft && g_sprites.onilRight,
      speed : 3
    }));
}
    else {
      this._onil.push(new Onil({
        cx : cx,
        cy : cy,
        sprite : g_sprites.onilLeft && g_sprites.onilRight,
        speed : 3
      }));
    }
},

//
// generatePowerup : function(cx,cy) {
//   this._powerups.push(new Powerup({
//     cx:cx,
//     cy:cy,
//     id: util.randRange(0,3)
//   }));
// },

generatePowerup : function(descr) {
	this._powerups.push(new Powerup(descr));
},

generateDoor : function(descr) {
	this._door.push(new Door(descr));
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

// Moves all bombermen to initial position
resetBombermen: function(du) {
    for (var i = 0; i < this._bombermen.length; i++) {
        this._bombermen[i]._moveToBeginning();
    }
},

reset: function() {
	this._bombs = [];
	this._bombermen = [];
	this._ballom = [];
	this._onil = [];
	this._explosions = [];
	this._powerups = [];
	this._door = [];
	this.deferredSetup();
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
