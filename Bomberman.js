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
Bomberman.prototype.walkspeed = 1.5;

// Sprite sheet properties
/*
Bomberman.prototype.width = 14;
Bomberman.prototype.height = 19;
*/

Bomberman.prototype.width = 19;//23.2;
Bomberman.prototype.height = 21;

//13 rammar, frá 0 - 12
Bomberman.prototype.downFrameLimit = 12; // 3 rammar. 0,1,2
Bomberman.prototype.currentdownFrame = 0;
Bomberman.prototype.downStartX = 0;
Bomberman.prototype.downStartY = 0;

Bomberman.prototype.upFrameLimit = 12;
Bomberman.prototype.currentupFrame = 0;
Bomberman.prototype.upStartX = 0;
Bomberman.prototype.upStartY = 23; //20

Bomberman.prototype.leftFrameLimit = 12;
Bomberman.prototype.currentleftFrame = 0;
Bomberman.prototype.leftStartX = 0; //42;
Bomberman.prototype.leftStartY = 45; //20;

Bomberman.prototype.rightFrameLimit = 12;
Bomberman.prototype.currentrightFrame = 0;
Bomberman.prototype.rightStartX = 0; //41;
Bomberman.prototype.rightStartY = 68;

Bomberman.prototype.spritePosX = 0;
Bomberman.prototype.spritePosY = 0;






var moveLeftRight = new Audio("Sounds/Bomberman SFX (1).wav");
var moveUpDown = new Audio("Sounds/Bomberman SFX (2).wav");
var dropBomb = new Audio("Sounds/Bomberman SFX (3).wav");

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


Bomberman.prototype.computePosition = function () {
	// Sound loop
	moveUpDown.loop = false;

	// Variables for position logic
	var wallIdLeft,
		wallIdRight,
		wallIdTop,
		wallIdBottom,
		leftX = this.cx-this.getRadius(),
		rightX = this.cx+this.getRadius(),
		topY = this.cy-this.getRadius(),
		bottomY = this.cy+this.getRadius();

	if (keys[this.KEY_UP]) {
		var newTopY = topY - this.walkspeed;

		// If newTopY is out of bounds, fix it
		if (newTopY < g_playzone[1][0]){
			this.cy = g_playzone[1][0]+this.getRadius();
		}
		else {
			wallIdLeft = this.getWallId(leftX,newTopY);
			wallIdRight = this.getWallId(rightX,newTopY);
			if (!this.checkForWall(wallIdLeft[0],wallIdLeft[1]) &&
				 !this.checkForWall(wallIdRight[0],wallIdRight[1])) {
				this.cy -= this.walkspeed;
			}
		}

		// Animation
		if(moveUpDown.currentTime > 0.3) {
			moveUpDown.currentTime = 0;
		}
		if(this.currentupFrame === 0) {
			this.spritePosX = this.upStartX;
			this.spritePosY = this.upStartY;
		}
		if(this.currentupFrame < this.upFrameLimit) {
			++this.currentupFrame;
			this.spritePosX += this.width;
		}

		else {
			this.spritePosX = this.upStartX;
			this.currentupFrame = 0;
		}
		moveUpDown.play();
	}


	if (keys[this.KEY_DOWN] && bottomY < g_playzone[1][1]) {
		var newBottomY = bottomY + this.walkspeed;

		// If newBottomY is out of bounds, fix it
		if (newBottomY > g_playzone[1][1]){
			this.cy = g_playzone[1][1]-this.getRadius()-1;
		}
		else {
			wallIdLeft = this.getWallId(leftX,newBottomY);
			wallIdRight = this.getWallId(rightX,newBottomY);
			if (!this.checkForWall(wallIdLeft[0],wallIdLeft[1]) &&
				 !this.checkForWall(wallIdRight[0],wallIdRight[1])) {
				this.cy += this.walkspeed;
			}
		}
			// ANIMATION
			if(moveUpDown.currentTime > 0.3) {
				moveUpDown.currentTime = 0;
			}

			if(this.currentdownFrame === 0) {
				this.spritePosX = this.downStartX;
				this.spritePosY = this.downStartY;
			}
			if(this.currentdownFrame < this.downFrameLimit){
				++this.currentdownFrame;
				this.spritePosX += this.width;
			}
			else {
				this.spritePosX = this.downStartX;
				this.currentdownFrame = 0;
			}
			moveUpDown.play();
	}

	if (keys[this.KEY_LEFT]) {
		var newLeftX = leftX - this.walkspeed;

		// If newTopY is out of bounds, fix it
		if (newLeftX < g_playzone[0][0]){
			this.cx = g_playzone[0][0]+this.getRadius();
		}
		else {
			wallIdTop = this.getWallId(newLeftX,topY);
			wallIdBottom = this.getWallId(newLeftX,bottomY);
			if (!this.checkForWall(wallIdTop[0],wallIdTop[1]) &&
				 !this.checkForWall(wallIdBottom[0],wallIdBottom[1])) {
				this.cx -= this.walkspeed;
			}
		}
			// ANIMATION
			if(moveLeftRight.currentTime > 0.3) {
				moveLeftRight.currentTime = 0;
			}
			if(this.currentleftFrame === 0) {
				this.spritePosX = this.leftStartX;
				this.spritePosY = this.leftStartY;
			}
			if(this.currentleftFrame < this.leftFrameLimit) {
				++this.currentleftFrame;
				this.spritePosX += this.width;
			}
			else {
				this.spritePosX = this.leftStartX;
				this.currentleftFrame = 0;
			}
			moveLeftRight.play();
	}

	if (keys[this.KEY_RIGHT]) {
		var newRightX = rightX + this.walkspeed;

		// If newTopY is out of bounds, fix it
		if (newRightX > g_playzone[0][1]){
			this.cx = g_playzone[0][1]-this.getRadius()-1;
		}
		else {
			wallIdTop = this.getWallId(newRightX,topY);
			wallIdBottom = this.getWallId(newRightX,bottomY);
			if (!this.checkForWall(wallIdTop[0],wallIdTop[1]) &&
				 !this.checkForWall(wallIdBottom[0],wallIdBottom[1])) {
				this.cx += this.walkspeed;
			}
		}

			// ANIMATION
			if(moveLeftRight.currentTime > 0.3) {
				moveLeftRight.currentTime = 0;
			}
			if(this.currentrightFrame === 0) {
				this.spritePosX = this.rightStartX;
				this.spritePosY = this.rightStartY;
			}
			if(this.currentrightFrame < this.rightFrameLimit) {
				++this.currentrightFrame;
				this.spritePosX += this.width;
			}
			else {
				this.spritePosX = this.rightStartX;
				this.currentrightFrame = 0;
			}
			moveLeftRight.play();
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
      this.cy += this.walkspeed;
  }
  if (this.cy < bomba.cy && topY > g_playzone[1][0]) {
    wallId = this.getWallId(this.cx, topY);
    if (!this.checkForWall(wallId[0], wallId[1]))
      this.cy -= this.walkspeed;
  }
  if (this.cx > bomba.cx && rightX < g_playzone[0][1]) {
    wallId = this.getWallId(rightX, this.cy);
    if (!this.checkForWall(wallId[0], wallId[1]))
      this.cx += this.walkspeed;
  }
  if (this.cx < bomba.cx && leftX > g_playzone[0][0]) {
    wallId = this.getWallId(leftX, this.cy);
    if (!this.checkForWall(wallId[0], wallId[1]))
      this.cx -= this.walkspeed;
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
  if (this._spatialID > 1) {
    g_score.P2_maxBombs += this.noBombs;
    this.noBombs = 0;
    return g_score.P2_maxBombs;
  }
};

Bomberman.prototype.maybeDropBomb = function() {
  if (keys[this.KEY_FIRE]) {
	  // Don't drop bomb if there is one already in the square
	  var hitEntity = spatialManager.findEntityInRange(this.cx, this.cy, 1);
	  if (hitEntity instanceof Bomb) return;

    // Can only drop one at a time
    if (this.checkBombBag() > 0) {
      dropBomb.currentTime = 0; // Resets the sounds to 0 sec. Allowing "overlapping".
      dropBomb.play();
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
  this.walkspeed = 3;
};

Bomberman.prototype.getRadius = function () {
    return this.width*0.8;
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
    this.sprite.animate(ctx,this.cx,this.cy,this.width,this.height,this.spritePosX,this.spritePosY);
    //this.sprite.drawCentredAt(ctx, this.cx, this.cy);
    this.sprite.scale = origScale;
};
