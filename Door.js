// =======
// Door
// =======

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




}

Door.prototype = new Entity();

// Initial, inheritable, default values
Door.prototype.cx = 0;
Door.prototype.cy = 0;
Door.prototype.lifeSpan = 0;


Door.prototype.update = function (du) {
  this.lifeSpan -= du;
    // Unregister and check for death
	spatialManager.unregister(this);

// setti timer á það að geta sprengt hurðina til að koma í veg fyrir milljón spawn
// í hverri sprengingu, koma oft tveir og deyja enn í sprengjunni
	if (this.isColliding() instanceof Explosion && this.lifeSpan < 10){
    this.lifeSpan = this.lifeSpan + (3500/ NOMINAL_UPDATE_INTERVAL);
    entityManager.generateRandomEnemy(this.cx, this.cy);
    }

    // (Re-)Register
	spatialManager.register(this);
};


Door.prototype.getRadius = function () {
    return 14;
};

Door.prototype.takeExplosiontHit = function () {
    this.kill();
};

Door.prototype.render = function (ctx) {
  // this.sprite.drawCentredAt(ctx, this.cx, this.cy);
  g_sprites.door.drawWrappedCentredAt(
    ctx, this.cx, this.cy
  );

};
