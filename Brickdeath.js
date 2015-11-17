// =======
// Brickdeath
// =======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Brickdeath(descr) {


  // Common inherited setup logic from Entity
  this.setup(descr);
  this._scale = 1;
  this.sprite = g_sprites.Brickdeath;
}

Brickdeath.prototype = new Entity();

// Initial, inheritable, default values
Brickdeath.prototype.cx = 0;
Brickdeath.prototype.cy = 0;
Brickdeath.prototype.spritePosX = 33.8;
Brickdeath.prototype.spritePosY = 238;
Brickdeath.prototype.width = 19; //23.2;
Brickdeath.prototype.height = 21;
Brickdeath.prototype.deathTimer = 475 / NOMINAL_UPDATE_INTERVAL;
Brickdeath.prototype.counter = 0;


Brickdeath.prototype.update = function(du) {
  if (this._isDeadNow) return entityManager.KILL_ME_NOW;
  var nextslide = 18.3;
  var i = 325;

  this.deathTimer -= du;
  if (this.deathTimer < 25 / NOMINAL_UPDATE_INTERVAL) {
    return entityManager.KILL_ME_NOW
  };
  if (this.deathTimer < i / NOMINAL_UPDATE_INTERVAL && this.counter < 4) {
    this.spritePosX += nextslide;
    this.counter += 1;
    i -= 75;
  }
};

Brickdeath.prototype.getRadius = function() {
  return 4;
};

Brickdeath.prototype.render = function(ctx) {
  var origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
  this.sprite.scale = this._scale;
  this.sprite.animate(ctx, this.cx, this.cy, this.width, this.height, this.spritePosX, this.spritePosY);
  //this.sprite.drawCentredAt(ctx, this.cx, this.cy);
  this.sprite.scale = origScale;
};
