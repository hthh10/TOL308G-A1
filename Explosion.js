// ======
// EXPLOSION
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Explosion(descr) {

  // Common inherited setup logic from Entity
  this.setup(descr);


  // Make a noise when I am created (i.e. fired)
  //this.fireSound.play();

  /*
      // Diagnostics to check inheritance stuff
      this._bulletProperty = true;
      console.dir(this);
  */

}

Explosion.prototype = new Entity();


// HACKED-IN AUDIO (no preloading)
// Explosion.prototype.fireSound = new Audio(
//   "sounds/bulletFire.ogg");
// Explosion.prototype.zappedSound = new Audio(
//   "sounds/bulletZapped.ogg");

// Initial, inheritable, default values
Explosion.prototype.rotation = 0;
Explosion.prototype.cx = 16;
Explosion.prototype.cy = 200;
Explosion.prototype.velX = 1;
Explosion.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
Explosion.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Explosion.prototype.update = function(du) {

  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
    }


  this.lifeSpan -= du;
  if (this.lifeSpan < 0) {
    return entityManager.KILL_ME_NOW;
}


  this.wrapPosition();

  // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
  //
  // Handle collisions
  //
  // var hitEntity = this.findHitEntity();
  // if (hitEntity && !(hitEntity instanceof Bomb)) {
  //   var canTakeHit = hitEntity.takeExplosionHit;
  //   if (canTakeHit) canTakeHit.call(hitEntity);
  //   return entityManager.KILL_ME_NOW;
  // }



  spatialManager.register(this);
};



Explosion.prototype.getRadius = function() {
    return 14;
};

Explosion.prototype.takeExplosionHit = function() {
  this.kill();

  // Make a noise when I am zapped by another bullet
  //this.zappedSound.play();
};

Explosion.prototype.render = function(ctx) {

  var fadeThresh = Explosion.prototype.lifeSpan / 3;

  if (this.lifeSpan < fadeThresh) {
    ctx.globalAlpha = this.lifeSpan / fadeThresh;
  }

  g_sprites.Explosion.drawWrappedCentredAt(
    ctx, this.cx, this.cy
  );

  ctx.globalAlpha = 1;
};
