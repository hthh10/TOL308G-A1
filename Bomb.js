// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bomb(descr) {

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

Bomb.prototype = new Entity();


// HACKED-IN AUDIO (no preloading)
// Bomb.prototype.fireSound = new Audio(
//   "sounds/bulletFire.ogg");
// Bomb.prototype.zappedSound = new Audio(
//   "sounds/bulletZapped.ogg");

// Initial, inheritable, default values
Bomb.prototype.rotation = 0;
Bomb.prototype.cx = 16;
Bomb.prototype.cy = 200;
Bomb.prototype.velX = 1;
Bomb.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
Bomb.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

Bomb.prototype.update = function(du) {
  var last_cy;
  var last_cx;

  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
    }


  this.lifeSpan -= du;
  if (this.lifeSpan < 0) return entityManager.KILL_ME_NOW;



  this.wrapPosition();

  // TODO? NO, ACTUALLY, I JUST DID THIS BIT FOR YOU! :-)
  //
  // Handle collisions
  //
  // var hitEntity = this.findHitEntity();
  // if (hitEntity) {
  //   var canTakeHit = hitEntity.takeBombHit;
  //   if (canTakeHit) canTakeHit.call(hitEntity);
  //   return entityManager.KILL_ME_NOW;
  // }


  //REGISTERA EKKI þar sem það vantar         !!!!
  //aðferð til að hafa mismunandi collisions

  spatialManager.register(this);
};

Bomb.prototype.getRadius = function() {
  return 4;
};

Bomb.prototype.takeBombHit = function() {
  this.kill();

  // Make a noise when I am zapped by another bullet
  //this.zappedSound.play();
};

Bomb.prototype.render = function(ctx) {

  var fadeThresh = Bomb.prototype.lifeSpan / 3;

  if (this.lifeSpan < fadeThresh) {
    ctx.globalAlpha = this.lifeSpan / fadeThresh;
  }

  g_sprites.bullet.drawWrappedCentredAt(
    ctx, this.cx, this.cy
  );

  ctx.globalAlpha = 1;
};