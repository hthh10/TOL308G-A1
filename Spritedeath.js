// =======
// Spritedeath
// =======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Spritedeath(descr) {


  // Common inherited setup logic from Entity
  this.setup(descr);
  this._scale = 1;
  this.sprite = this.sprite || g_sprites.Spritedeath || g_sprites.deadBomberman;
}

Spritedeath.prototype = new Entity();

// Initial, inheritable, default values
Spritedeath.prototype.cx = 0;
Spritedeath.prototype.cy = 0;
Spritedeath.prototype.spritePosX = 33.8;
Spritedeath.prototype.spritePosY = 238;
Spritedeath.prototype.width = 19; //23.2;
Spritedeath.prototype.height = 21;
Spritedeath.prototype.deathTimer = 1000 / NOMINAL_UPDATE_INTERVAL;
Spritedeath.prototype.counter = 0;
Spritedeath.prototype.deathSlideWidth = 18.3;
Spritedeath.prototype.nrDeathSlides = 5;

Spritedeath.prototype.update = function(du) {
  if (this._isDeadNow) return entityManager.KILL_ME_NOW;
  //var nextslide = 18.3;
  //var nextslide = 18.3;
  //var i = 2000;

  this.deathTimer -= du;
  if (this.deathTimer < 25 / NOMINAL_UPDATE_INTERVAL &&
     this.counter < this.nrDeathSlides) {
    return entityManager.KILL_ME_NOW
  };
  if (this.deathTimer < 400 / NOMINAL_UPDATE_INTERVAL
     && this.counter < this.nrDeathSlides - 1) {
    this.spritePosX += this.deathSlideWidth;
    this.counter += 1;
  }
  if (this.deathTimer < 600 / NOMINAL_UPDATE_INTERVAL
     && this.counter < this.nrDeathSlides - 2) {
    this.spritePosX += this.deathSlideWidth;
    this.counter += 1;
  }
  if (this.deathTimer < 800 / NOMINAL_UPDATE_INTERVAL
     && this.counter < this.nrDeathSlides - 3) {
    this.spritePosX += this.deathSlideWidth;
    this.counter += 1;
  }
  if (this.deathTimer < 200 / NOMINAL_UPDATE_INTERVAL
     && this.counter < this.nrDeathSlides - 4) {
    this.spritePosX += this.deathSlideWidth;
    this.counter += 1;
  }
  if (this.deathTimer < 200 / NOMINAL_UPDATE_INTERVAL
     && this.counter < this.nrDeathSlides - 5) {
    this.spritePosX += this.deathSlideWidth;
    this.counter += 1;
  }
  if (this.deathTimer < 200 / NOMINAL_UPDATE_INTERVAL
     && this.counter < this.nrDeathSlides - 6) {
    this.spritePosX += this.deathSlideWidth;
    this.counter += 1;
  }
};

Spritedeath.prototype.getRadius = function() {
  return 4;
};

Spritedeath.prototype.render = function(ctx) {
  //var origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
//  this.sprite.scale = this._scale;
  this.sprite.animate(ctx, this.cx, this.cy, this.width, this.height, this.spritePosX, this.spritePosY);
  //this.sprite.drawCentredAt(ctx, this.cx, this.cy);
//  this.sprite.scale = origScale;
};
