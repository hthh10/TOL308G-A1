// ===============
// BOMBERMAN STUFF
// ===============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bomberman(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bomberman;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isReseting = false;
};

Bomberman.prototype = new Entity();

Bomberman.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
};

// Values for first bomberman
Bomberman.prototype.KEY_UP     = 'W'.charCodeAt(0);
Bomberman.prototype.KEY_DOWN   = 'S'.charCodeAt(0);
Bomberman.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Bomberman.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Bomberman.prototype.KEY_FIRE   = 'E'.charCodeAt(0);

Bomberman.prototype.cx = 50;
Bomberman.prototype.cy = 50;
Bomberman.prototype.velX = 0;
Bomberman.prototype.velY = 0;

Bomberman.prototype.reset = function () {

    this._isReseting = true;
    this._scaleDirn = -1;

    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Bomberman.prototype._updateReset = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;

    if (this._scale < 0.2) {

        this._moveToBeginning();
        this.halt();
        this._scaleDirn = 1;

    } else if (this._scale > 1) {

        this._scale = 1;
        this._isReseting = false;

        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
    }
};

Bomberman.prototype._moveToBeginning = function () {
    // Move to initial position
	this.cx = this.reset_cx;
    this.cy = this.reset_cy;
};

Bomberman.prototype.update = function (du) {

    // Handle warping
    if (this._isReseting) {
        this._updateReset(du);
        return;
    }

    // Unregister and check for death
	spatialManager.unregister(this);
	if (this._isDeadNow) return entityManager.KILL_ME_NOW;

	this.computePosition();

    // Handle firing
    this.maybeDropBomb();

    // Reset position if isColliding, otherwise Register
    // athuga hvort það er sprengja því þá viljum við ekki resetta. smá shitmix
    if (this.isColliding() && !(this.isColliding() instanceof Bomb) ) {
      console.log(this.isColliding());
        this.reset();
    }
	else {
		spatialManager.register(this);
	}
};

var NOMINAL_WALKSPEED = 4;

Bomberman.prototype.computePosition = function () {

    if (keys[this.KEY_UP]) {
        if(this.cy > this.sprite.height / 2) this.cy -= NOMINAL_WALKSPEED;
    }
    if (keys[this.KEY_DOWN]) {
        if(this.cy < (g_canvas.height - this.sprite.height / 2)) this.cy += NOMINAL_WALKSPEED;
    }
	if (keys[this.KEY_LEFT]) {
        if(this.cx >= this.sprite.width / 2) this.cx -= NOMINAL_WALKSPEED;
    }
    if (keys[this.KEY_RIGHT]) {
        if(this.cx <= (g_canvas.width - this.sprite.width / 2 )) this.cx += NOMINAL_WALKSPEED;
    }
};

Bomberman.prototype.maybeDropBomb = function () {
    if (keys[this.KEY_FIRE]) {
		entityManager.dropBomb(this.cx, this.cy);
    }

};

Bomberman.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Bomberman.prototype.takeBombHit = function () {
    this.reset();
};

Bomberman.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Bomberman.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy);
    this.sprite.scale = origScale;
};
