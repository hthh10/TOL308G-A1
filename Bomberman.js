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

Bomberman.prototype.cx = 40;
Bomberman.prototype.cy = 120;
Bomberman.prototype.noBombs = 0;
Bomberman.prototype.bombStrength = 1;
Bomberman.prototype.trigger = false;
Bomberman.prototype.lives = 3;

Bomberman.prototype.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;
Bomberman.prototype.reset = function () {

    this._isReseting = true;
    this._scaleDirn = -1;
    this.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;

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

    this.immunity -= du;
    // Handle warping
    if (this._isReseting) {
        this._updateReset(du);
        return;
    }

	// Remember current position
	var oldCx = this.cx;
	var oldCy = this.cy;


    // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

	this.computePosition();

    // Handle firing
    this.maybeDropBomb();

    // Reset position if isColliding, otherwise Register
    // athuga hvort það er sprengja því þá viljum við ekki resetta. smá shitmix
	if (this.isColliding()) {
		var hitEntity = this.findHitEntity();
		if (hitEntity instanceof Powerup) {
			hitEntity.deliverPowerup(this);
		}
	else if ((hitEntity instanceof Ballom || hitEntity instanceof Onil || hitEntity instanceof Explosion) &&
  this.immunity < 20) {
			this.reset();
    }
	else if ((hitEntity instanceof Enemy || hitEntity instanceof Explosion) &&
    this.immunity < 20) {
		this.reset();
			this.lives -= 1;
			if (this._spatialID === 1) g_score.P1_lives -= 1;
			else g_score.P2_lives -= 1;

			if (this.lives <= 0) return entityManager.KILL_ME_NOW;
		}
		else if (hitEntity instanceof Door) {
			entityManager.checkWinConditions();
		}

      //athuga hvort hann collidar við sprengjuna eftir smá delay og
      // lokar svo fyrir að hann komist í gegnum hana
          // ATH HÉR GÆTI VERIÐ VANDAMÁL ÞEGAR BORÐIÐ ER FULLT AF HLUTUM SEM
          // BOMBERMAN GETUR ÓVART SKOTIST INNÍ
    }
     if (hitEntity instanceof Bomb && (hitEntity.lifeSpan < 100.0)) {
        this.isCollidingWithBomb(hitEntity);
    } else spatialManager.register(this);

    };

var NOMINAL_WALKSPEED = 2.5;


Bomberman.prototype.computePosition = function () {

	// Variables for position logic
	var wallId,
		leftX = this.cx-this.getRadius(),
		rightX = this.cx+this.getRadius(),
		topY = this.cy-this.getRadius(),
		bottomY = this.cy+this.getRadius();

	if (keys[this.KEY_UP] && topY > g_playzone[1][0]) {
        wallId = this.getWallId(this.cx,topY);
		if (!this.checkForWall(wallId[0],wallId[1]))
			this.cy -= NOMINAL_WALKSPEED;
    }
    if (keys[this.KEY_DOWN] && bottomY < g_playzone[1][1]) {
        wallId = this.getWallId(this.cx,bottomY);
		if (!this.checkForWall(wallId[0],wallId[1]))
			this.cy += NOMINAL_WALKSPEED;
    }
    if (keys[this.KEY_LEFT] && leftX > g_playzone[0][0]) {
        wallId = this.getWallId(leftX,this.cy);
		if (!this.checkForWall(wallId[0],wallId[1]))
			this.cx -= NOMINAL_WALKSPEED;
    }
    if (keys[this.KEY_RIGHT] && rightX < g_playzone[0][1]) {
        wallId = this.getWallId(rightX,this.cy);
		if (!this.checkForWall(wallId[0],wallId[1]))
			this.cx += NOMINAL_WALKSPEED;
    }
};

// athugar collision við sprengju og breytir hraðanum eftir því
Bomberman.prototype.isCollidingWithBomb = function(bomba) {

    var wallId,
    leftX = this.cx - this.getRadius(),
    rightX = this.cx + this.getRadius(),
    topY = this.cy - this.getRadius(),
    bottomY = this.cy + this.getRadius();

  if (this.cy > bomba.cy && bottomY < g_playzone[1][1]) {
    wallId = this.getWallId(this.cx, bottomY);
    if (!this.checkForWall(wallId[0], wallId[1]))
      this.cy += NOMINAL_WALKSPEED;
  }
  if (this.cy < bomba.cy && topY > g_playzone[1][0]) {
    wallId = this.getWallId(this.cx, topY);
    if (!this.checkForWall(wallId[0], wallId[1]))
      this.cy -= NOMINAL_WALKSPEED;
  }
  if (this.cx > bomba.cx && rightX < g_playzone[0][1]) {
    wallId = this.getWallId(rightX, this.cy);
    if (!this.checkForWall(wallId[0], wallId[1]))
      this.cx += NOMINAL_WALKSPEED;
  }
  if (this.cx < bomba.cx && leftX > g_playzone[0][0]) {
    wallId = this.getWallId(leftX, this.cy);
    if (!this.checkForWall(wallId[0], wallId[1]))
      this.cx -= NOMINAL_WALKSPEED;
  }
};

//Athugar hvor playerinn þetta er og kíkir hvað hann á margar sprengjur eftir
Bomberman.prototype.checkBombBag = function() {
  if (this._spatialID === 1) {
     g_score.P1_maxBombs += this.noBombs;
     this.noBombs = 0;
    return g_score.P1_maxBombs;
  }
  //krefst breytinga ef við bætum við fleiri playerum
  if (this._spatialID !== 1) {
    g_score.P2_maxBombs += this.noBombs;
    return g_score.P2_maxBombs;
  }
};

Bomberman.prototype.maybeDropBomb = function() {
  if (keys[this.KEY_FIRE]) {
    // Can only drop one at a time
    if (this.checkBombBag() > 0) {
      // Always drop bombs in center of the square
      // Some magic numbers: cx: 40, cy: 110 is the center of the first
      var baseCx = g_playzone[0][0],
        baseCy = g_playzone[1][0];
      var xPos = Math.floor((this.cx - baseCx) / g_sprites.wall.width),
        yPos = Math.floor((this.cy - baseCy) / g_sprites.wall.height);
      var bombCx = g_sprites.wall.width + (g_sprites.wall.width * xPos),
        bombCy = 110 + (g_sprites.wall.height * yPos);

      entityManager.dropBomb(bombCx, bombCy, xPos, yPos,
         this.bombStrength, this._spatialID, this.trigger);
    }
  }
};

Bomberman.prototype.applySpeed = function () {
  NOMINAL_WALKSPEED = 4;
};

Bomberman.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.8;
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
