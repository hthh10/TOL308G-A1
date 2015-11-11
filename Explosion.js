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
Explosion.prototype.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;
Explosion.prototype.immunity = 0 / NOMINAL_UPDATE_INTERVAL;

Explosion.prototype.update = function(du) {

  spatialManager.unregister(this);
  if (this._isDeadNow) {
    return entityManager.KILL_ME_NOW;
    }

  this.immunity -= du;
  this.lifeSpan -= du;
  if (this.lifeSpan < 0) {
    return entityManager.KILL_ME_NOW;
}

  if (this.isColliding()) {
    var hitEntity = this.findHitEntity();
  if ((hitEntity instanceof Bomberman) && this.immunity < 20) {
    this.updatePlayerScore(hitEntity);
  }
}

  spatialManager.register(this);
};

Explosion.prototype.getRadius = function() {
    return g_images.explosion.width/2;
};

Explosion.prototype.takeExplosionHit = function() {
  this.kill();
};
// distributes points
Explosion.prototype.updatePlayerScore = function (player) {

  if(player._spatialID === 1) {g_score.P2_score = g_score.P2_score + 1;this.immunity = 4000 / NOMINAL_UPDATE_INTERVAL;}
  if(player._spatialID !== 1) {g_score.P1_score += 1;this.immunity = 4000 / NOMINAL_UPDATE_INTERVAL;}

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
