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
};

Explosion.prototype = new Entity();

// Initial, inheritable, default values
Explosion.prototype.rotation = 0;
Explosion.prototype.cx = 16;
Explosion.prototype.cy = 200;
Explosion.prototype.velX = 1;
Explosion.prototype.velY = 1;

// Convert times from milliseconds to "nominal" time units.
Explosion.prototype.lifeSpan = 800 / NOMINAL_UPDATE_INTERVAL;
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
    if ((hitEntity instanceof Bomberman || hitEntity instanceof Enemy) &&
      this.immunity < 20) {
      this.updatePlayerScore(hitEntity);
    }
	else if (hitEntity instanceof Explosion)
		return entityManager.KILL_ME_NOW;
  }

  spatialManager.register(this);
};

Explosion.prototype.getRadius = function() {
  return g_images.explosion.width/2;
  return g_images.explosion.width/2*0.8;
};

Explosion.prototype.takeExplosionHit = function() {
  this.kill();
};

// distributes points, player gets a point for killing enemies and the enemy
// gets a point if the player dies
Explosion.prototype.updatePlayerScore = function(hitEntity) {
  if (hitEntity instanceof Bomberman) {
    if (this.bombermanID === 1 && this.immunity > -5.0) {
      g_score.P2_score += 1;
    } else if (this.bombermanID > 1 && this.immunity > -5.0) {
      g_score.P1_score += 1;
    }
    this.immunity = 4000 / NOMINAL_UPDATE_INTERVAL;
  } else if (hitEntity instanceof Enemy) {
    if (this.bombermanID === 1 && this.immunity > -5.0) {
      g_score.P1_score += 1;
    } else if (this.bombermanID > 1 && this.immunity > -5.0) {
      g_score.P2_score += 1;
    }
    this.immunity = 4000 / NOMINAL_UPDATE_INTERVAL;
  }
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
