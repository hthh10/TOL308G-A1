// ====
// Door
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// A generic contructor which accepts an arbitrary descriptor object
function Door(descr) {
  // Common inherited setup logic from Entity
  this.setup(descr);
};

Door.prototype = new Entity();

// Initial, inheritable, default values
Door.prototype.cx = 0;
Door.prototype.cy = 0;
Door.prototype.immunity = 0;


Door.prototype.update = function (du) {
  if (this.immunity > 2) {
    this.immunity -= du;
  }
  // Unregister and check for death
	spatialManager.unregister(this);

	if (this._isDeadNow) return entityManager.KILL_ME_NOW;

  // There's a timer on the capability of blowing up the door in order to avoid that
  // a million enemies spawn in each explosion. Two spawn often and sometimes die in the explosion
	if (this.isColliding() instanceof Explosion && this.immunity < 10){
    this.immunity += (3500/ NOMINAL_UPDATE_INTERVAL);
    entityManager.generateRandomEnemy(this.cx, this.cy);
  }
  // (Re-)Register
	spatialManager.register(this);
};


Door.prototype.getRadius = function () {
  return 4;
};

Door.prototype.takeExplosiontHit = function () {
  // this.kill();
};

Door.prototype.render = function (ctx) {
  g_sprites.door.drawWrappedCentredAt(
    ctx, this.cx, this.cy);
};
