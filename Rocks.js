// ==================
// DESTRUCTABLE ROCKS
// ==================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Rock(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.randomisePosition();
      
    // Default sprite and scale, if not otherwise specified
    this.sprite = this.sprite || g_sprites.brick;
    this.scale  = this.scale  || 1;

};

Rock.prototype = new Entity();

Rock.prototype.randomisePosition = function () {
    // Rock randomisation defaults (if nothing otherwise specified)
    this.cx = this.cx || Math.random() * g_canvas.width;
    this.cy = this.cy || Math.random() * g_canvas.height;
};

Rock.prototype.update = function (du) {

    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.wrapPosition();
    
    spatialManager.register(this);

};

Rock.prototype.getRadius = function () {
    return this.scale * (this.sprite.width / 2) * 0.9;
};

/*
// HACKED-IN AUDIO (no preloading)
Rock.prototype.splitSound = new Audio(
  "sounds/rockSplit.ogg");
Rock.prototype.evaporateSound = new Audio(
  "sounds/rockEvaporate.ogg");
*/

Rock.prototype.takeBombHit = function () {
    this.kill();
    
    /*    this.splitSound.play();
    else {
        this.evaporateSound.play();
    }
    */
};


Rock.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy);
    this.sprite.scale = origScale;
};
