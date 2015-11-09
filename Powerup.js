// =======
// POWERUP
// =======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

/*
Powerup id list:
0: Do nothing
1: 
*/

// A generic contructor which accepts an arbitrary descriptor object
function Powerup(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

	this.sprite = this.sprite || g_sprites.powerups[this.id];
    this._scale = 1;
}

Powerup.prototype = new Entity();
    
// Initial, inheritable, default values
Powerup.prototype.cx = 0;
Powerup.prototype.cy = 0;
Powerup.prototype.id = 0;

// Convert times from milliseconds to "nominal" time units.
Powerup.prototype.lifeSpan = 4000 / NOMINAL_UPDATE_INTERVAL;

Powerup.prototype.update = function (du) {

    // TODO: YOUR STUFF HERE! --- Unregister and check for death
	spatialManager.unregister(this);
	if (this._isDeadNow) return entityManager.KILL_ME_NOW;
	
    this.lifeSpan -= du;
    if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;
    
    // TODO: YOUR STUFF HERE! --- (Re-)Register
	spatialManager.register(this);
};

Powerup.prototype.getRadius = function () {
    return 8;
};

Powerup.prototype.takeExplosiontHit = function () {
    this.kill();
};

Powerup.prototype.render = function (ctx) {

    var fadeThresh = Powerup.prototype.lifeSpan / 3;

    if (this.lifeSpan < fadeThresh) {
        ctx.globalAlpha = this.lifeSpan / fadeThresh;
    }
	
    this.sprite.drawCentredAt(ctx, this.cx, this.cy);

    ctx.globalAlpha = 1;
};
