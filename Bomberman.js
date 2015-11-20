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
    this.sprite = this.sprite || g_sprites.bomberman || g_sprites.deadBomberman;

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
Bomberman.prototype.wallPass = false;

Bomberman.prototype.width = 19;
Bomberman.prototype.height = 21;

//13 frames, from 0 - 12
Bomberman.prototype.downFrameLimit = 12;
Bomberman.prototype.currentdownFrame = 0;
Bomberman.prototype.downStartX = 0;
Bomberman.prototype.downStartY = 0;

Bomberman.prototype.upFrameLimit = 12;
Bomberman.prototype.currentupFrame = 0;
Bomberman.prototype.upStartX = 0;
Bomberman.prototype.upStartY = 23; 

Bomberman.prototype.leftFrameLimit = 12;
Bomberman.prototype.currentleftFrame = 0;
Bomberman.prototype.leftStartX = 0; 
Bomberman.prototype.leftStartY = 45;

Bomberman.prototype.rightFrameLimit = 12;
Bomberman.prototype.currentrightFrame = 0;
Bomberman.prototype.rightStartX = 0; 
Bomberman.prototype.rightStartY = 68;

Bomberman.prototype.spritePosX = 0;
Bomberman.prototype.spritePosY = 0;
Bomberman.prototype.direction = 1; // 0 = right, 1 = down, 2 = left, 3 = up


//Death animation stuff
Bomberman.prototype.deadSpritePosX = 58;
Bomberman.prototype.deadSpritePosY = 32;
Bomberman.prototype.deathSlideWidth = 29;
Bomberman.prototype.nrDeathSlides = 7;


var moveLeftRight = new Audio("Sounds/Bomberman SFX (1).wav");
var moveUpDown = new Audio("Sounds/Bomberman SFX (2).wav");
var dropBomb = new Audio("Sounds/Bomberman SFX (3).wav");

Bomberman.prototype.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;
Bomberman.prototype.reset = function () {

    this._isReseting = true;
    this._scaleDirn = -1;
    this.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;

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
    this.respawan -= du;
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
  // Handle bombs
  this.maybeDropBomb();

  // Reset position if isColliding, otherwise Register
  // Check if there is a bomb because then we don't want to reset
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
      entityManager.killSprite(this.cx,this.cy,this.width,
        this.height,this.deadSpritePosX,this.deadSpritePosY,
        this.nrDeathSlides, this.deathSlideWidth, g_sprites.deadBomberman);
			if (this.lives <= 0)
			{
				entityManager.checkLoseConditions();
				return entityManager.KILL_ME_NOW;
			}
		}
		else if (hitEntity instanceof Door) {
			entityManager.checkWinConditions();
		}

      // Check if he collides with the bomb after a little delay and 
      // then gets rid of the possibility that he can go through it 
      // !!! But this could create an issue when the level is full of things Bomberman
      // can accidentally slip into 
    }
     if (hitEntity instanceof Bomb && (hitEntity.lifeSpan < 100.0)) {
        this.isCollidingWithBomb(hitEntity);
    } else spatialManager.register(this);

    };

Bomberman.prototype.computePosition = function () {
	// Variables for position logic
	var leftX = this.cx-this.getRadius(),
		rightX = this.cx+this.getRadius(),
		topY = this.cy-this.getRadius(),
		bottomY = this.cy+this.getRadius();

	if (keys[this.KEY_UP]) {
		if(this.canMoveUp(leftX, rightX, topY - this.walkspeed, bottomY)) 
			this.cy -= this.walkspeed;
		else // Smoothing logic
			this.smoothMove("up", leftX, rightX, topY, bottomY);

		// Animation
	  if(this.direction !== 3) {
	    this.direction = 3;
	    this.currentupFrame = 0;
	    }
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


	if (keys[this.KEY_DOWN]) {
		if (this.canMoveDown(leftX, rightX, topY, bottomY + this.walkspeed))
			this.cy += this.walkspeed;
		else // Smoothing logic
			this.smoothMove("down", leftX, rightX, topY, bottomY);

		//Animation
		if(this.direction !== 1) {
        this.direction = 1;
        this.currentdownFrame = 0;
    	}
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
		if (this.canMoveLeft(leftX - this.walkspeed, rightX, topY, bottomY))
			this.cx -= this.walkspeed;
		else // Smoothing logic
			this.smoothMove("left", leftX, rightX, topY, bottomY);

		//Animation
		if(this.direction !== 2 ) {
      this.direction = 2;
      this.currentleftFrame = 0;
      }

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
		if (this.canMoveRight(leftX, rightX + this.walkspeed, topY, bottomY))
			this.cx += this.walkspeed;
		else // Smoothing logic
			this.smoothMove("right", leftX, rightX, topY, bottomY);

		//Animation
		// reset the variables to a new direction
		if(this.direction !== 0) {
      this.direction = 0;
      this.currentrightFrame = 0;
      }
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

Bomberman.prototype.smoothMove = function(direction, leftX, rightX, topY, bottomY) {
	var wallWidth = wall.getWidth(),
		smoothingMargin = wall.getWidth()/2-this.getRadius()-0.1,
		wallId = this.getWallId(this.cx, this.cy),
		wallCxCy = wall.wallIdToCxCy(wallId[0],wallId[1]),
		offsetX = this.cx - wallCxCy[0],
		offsetY = this.cy - wallCxCy[1];
		
	// Terrible code, but it does the job
	switch (direction) {
		case "up":
			if (wallId[0] > 0) { // Not top edge wall
				if (wall.baseWall[wallId[0]-1][wallId[1]] === 1) { // Block above is solid
					if (offsetX > smoothingMargin) { // Right side of solid block
						if (this.canMoveUp(wallCxCy[0]+wallWidth, wallCxCy[0]+wallWidth, 
							topY-this.walkspeed, bottomY-this.walkspeed) && 
							this.canMoveRight(leftX+this.walkspeed, 
							rightX+this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_RIGHT] && !keys[this.KEY_LEFT]) {
							this.cx += this.walkspeed;
						}
					}
					else if (offsetX < -smoothingMargin) { // Left side of solid block
						if (this.canMoveUp(wallCxCy[0]-wallWidth, wallCxCy[0]-wallWidth, 
							topY-this.walkspeed, bottomY-this.walkspeed) && 
							this.canMoveLeft(leftX-this.walkspeed, 
							rightX-this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_LEFT] && !keys[this.KEY_RIGHT]) {
							this.cx -= this.walkspeed;
						}
					}
				}
				else if (wall.baseWall[wallId[0]-1][wallId[1]] <= 0) { // Block above is empty
					if (offsetX < -smoothingMargin) { // Right side of solid block
						if (this.canMoveUp(wallCxCy[0], wallCxCy[0], 
							topY-this.walkspeed, bottomY-this.walkspeed) && 
							this.canMoveRight(leftX+this.walkspeed, 
							rightX+this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_RIGHT] && !keys[this.KEY_LEFT]) {
							this.cx += this.walkspeed;
						}
					}
					else if(offsetX > smoothingMargin) {
						if (this.canMoveUp(wallCxCy[0], wallCxCy[0], 
							topY-this.walkspeed, bottomY-this.walkspeed) && 
							this.canMoveLeft(leftX-this.walkspeed, 
							rightX-this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_LEFT] && !keys[this.KEY_RIGHT]) {
							this.cx -= this.walkspeed;
						}
					}
				}
			}
			break;
			
		case "down":
			if (wallId[0] < wall.baseWall.length-1) { // Not bottom edge wall
				if (wall.baseWall[wallId[0]+1][wallId[1]] === 1) { // Block below is solid
					if (offsetX > smoothingMargin) { // Right side of solid block
						if (this.canMoveDown(wallCxCy[0]+wallWidth, wallCxCy[0]+wallWidth, 
							topY+this.walkspeed, bottomY+this.walkspeed) && 
							this.canMoveRight(leftX+this.walkspeed, 
							rightX+this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_RIGHT] && !keys[this.KEY_LEFT]) {
							this.cx += this.walkspeed;
						}
					}
					else if (offsetX < -smoothingMargin) { // Left side of solid block
						if (this.canMoveDown(wallCxCy[0]-wallWidth, wallCxCy[0]-wallWidth, 
							topY+this.walkspeed, bottomY+this.walkspeed) && 
							this.canMoveLeft(leftX-this.walkspeed, 
							rightX-this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_LEFT] && !keys[this.KEY_RIGHT]) {
							this.cx -= this.walkspeed;
						}
					}
				}
				else if (wall.baseWall[wallId[0]+1][wallId[1]] <= 0) { // Block above is empty
					if (offsetX < -smoothingMargin) { // Right side of solid block
						if (this.canMoveDown(wallCxCy[0], wallCxCy[0], 
							topY+this.walkspeed, bottomY+this.walkspeed) && 
							this.canMoveRight(leftX+this.walkspeed, 
							rightX+this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_RIGHT] && !keys[this.KEY_LEFT]) {
							this.cx += this.walkspeed;
						}
					}
					else if(offsetX > smoothingMargin) {
						if (this.canMoveDown(wallCxCy[0], wallCxCy[0], 
							topY+this.walkspeed, bottomY+this.walkspeed) && 
							this.canMoveLeft(leftX-this.walkspeed, 
							rightX-this.walkspeed, wallCxCy[1], wallCxCy[1]) &&
							!keys[this.KEY_LEFT] && !keys[this.KEY_RIGHT]) {
							this.cx -= this.walkspeed;
						}
					}
				}
			}
			break;
			
		case "left":
			if (wallId[1] > 0) { // Not left edge wall
				if (wall.baseWall[wallId[0]][wallId[1]-1] === 1) { // Block to left is solid
					if (offsetY > smoothingMargin) { // Bottom side of solid block
						if (this.canMoveLeft(leftX-this.walkspeed, rightX-this.walkspeed, 
							wallCxCy[1]+wallWidth, wallCxCy[1]+wallWidth) && 
							this.canMoveDown(wallCxCy[0], wallCxCy[0],
							topY+this.walkspeed, bottomY+this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy += this.walkspeed;
						}
					}
					else if (offsetY < -smoothingMargin) { // Top side of solid block
						if (this.canMoveLeft(leftX-this.walkspeed, rightX-this.walkspeed, 
							wallCxCy[1]-wallWidth, wallCxCy[1]-wallWidth) && 
							this.canMoveUp(wallCxCy[0], wallCxCy[0],
							topY-this.walkspeed, bottomY-this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy -= this.walkspeed;
						}
					}
				}
				else if (wall.baseWall[wallId[0]][wallId[1]-1] <= 0) { // Block to left is empty
					if (offsetY < -smoothingMargin) { // Bottom side of solid block
						if (this.canMoveLeft(leftX-this.walkspeed, rightX-this.walkspeed, 
							wallCxCy[1], wallCxCy[1]) && 
							this.canMoveDown(wallCxCy[0], wallCxCy[0],
							topY+this.walkspeed, bottomY+this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy += this.walkspeed;
						}
					}
					else if(offsetY > smoothingMargin) {
						if (this.canMoveLeft(leftX-this.walkspeed, rightX-this.walkspeed, 
							wallCxCy[1], wallCxCy[1]) && 
							this.canMoveUp(wallCxCy[0], wallCxCy[0],
							topY-this.walkspeed, bottomY-this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy -= this.walkspeed;
						}
					}
				}
			}
			break;
			
		case "right":
			if (wallId[1] < wall.baseWall[0].length-1) { // Not right edge wall
				if (wall.baseWall[wallId[0]][wallId[1]+1] === 1) { // Block to right is solid
					if (offsetY > smoothingMargin) { // Bottom side of solid block
						if (this.canMoveRight(leftX+this.walkspeed, rightX+this.walkspeed, 
							wallCxCy[1]+wallWidth, wallCxCy[1]+wallWidth) && 
							this.canMoveDown(wallCxCy[0], wallCxCy[0],
							topY+this.walkspeed, bottomY+this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy += this.walkspeed;
						}
					}
					else if (offsetY < -smoothingMargin) { // Top side of solid block
						if (this.canMoveRight(leftX+this.walkspeed, rightX+this.walkspeed, 
							wallCxCy[1]-wallWidth, wallCxCy[1]-wallWidth) && 
							this.canMoveUp(wallCxCy[0], wallCxCy[0],
							topY-this.walkspeed, bottomY-this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy -= this.walkspeed;
						}
					}
				}
				else if (wall.baseWall[wallId[0]][wallId[1]+1] <= 0) { // Block to right is empty
					if (offsetY < -smoothingMargin) { // Bottom side of solid block
						if (this.canMoveRight(leftX+this.walkspeed, rightX+this.walkspeed, 
							wallCxCy[1], wallCxCy[1]) && 
							this.canMoveDown(wallCxCy[0], wallCxCy[0],
							topY+this.walkspeed, bottomY+this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy += this.walkspeed;
						}
					}
					else if(offsetY > smoothingMargin) {
						if (this.canMoveRight(leftX-this.walkspeed, rightX-this.walkspeed, 
							wallCxCy[1], wallCxCy[1]) && 
							this.canMoveUp(wallCxCy[0], wallCxCy[0],
							topY-this.walkspeed, bottomY-this.walkspeed) &&
							!keys[this.KEY_UP] && !keys[this.KEY_DOWN]) {
							this.cy -= this.walkspeed;
						}
					}
				}
			}
			break;
	}
};

Bomberman.prototype.canMoveUp = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		  wallIdRight,
		  wallIdTop,
		  wallIdBottom;
	// If topY is out of bounds, fix it
	if (topY < g_playzone[1][0]) this.cy = g_playzone[1][0]+this.getRadius();
	else {
		wallIdLeft = this.getWallId(leftX,topY);
		wallIdRight = this.getWallId(rightX,topY);
		if (!this.checkForWall(wallIdLeft[0],wallIdLeft[1]) &&
			!this.checkForWall(wallIdRight[0],wallIdRight[1])) {
			return true;
		}
	}
	return false;
},

Bomberman.prototype.canMoveDown = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		  wallIdRight,
		  wallIdTop,
		  wallIdBottom;
	// If BottomY is out of bounds, fix it
	if (bottomY > g_playzone[1][1]) this.cy = g_playzone[1][1]-this.getRadius()-1;
	else {
		wallIdLeft = this.getWallId(leftX,bottomY);
		wallIdRight = this.getWallId(rightX,bottomY);
		if (!this.checkForWall(wallIdLeft[0],wallIdLeft[1]) &&
			!this.checkForWall(wallIdRight[0],wallIdRight[1])) {
			return true;
		}
	}
	return false;
},

Bomberman.prototype.canMoveLeft = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		  wallIdRight,
		  wallIdTop,
		  wallIdBottom;
	// If leftX is out of bounds, fix it
	if (leftX < g_playzone[0][0]) this.cx = g_playzone[0][0]+this.getRadius();
	else {
		wallIdTop = this.getWallId(leftX,topY);
		wallIdBottom = this.getWallId(leftX,bottomY);
		if (!this.checkForWall(wallIdTop[0],wallIdTop[1]) &&
			!this.checkForWall(wallIdBottom[0],wallIdBottom[1])) {
			return true;
		}
	}
	return false;
},

Bomberman.prototype.canMoveRight = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		  wallIdRight,
		  wallIdTop,
		  wallIdBottom;
	// If rightX is out of bounds, fix it
	if (rightX > g_playzone[0][1]) this.cx = g_playzone[0][1]-this.getRadius()-1;
	else {
		wallIdTop = this.getWallId(rightX,topY);
		wallIdBottom = this.getWallId(rightX,bottomY);
		if (!this.checkForWall(wallIdTop[0],wallIdTop[1]) &&
			!this.checkForWall(wallIdBottom[0],wallIdBottom[1])) {
			return true;
		}
	}
	return false;
},


// Checks for collision with a bomb and changes the speed in regards to that
Bomberman.prototype.isCollidingWithBomb = function(bomba) {
    var wallId,
        leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

    if (this.cy > bomba.cy && bottomY < g_playzone[1][1]) {
    	wallId = this.getWallId(this.cx, bottomY);
    	if (!this.checkForWall(wallId[0], wallId[1])) this.cy += this.walkspeed;
    }

    if (this.cy < bomba.cy && topY > g_playzone[1][0]) {
    	wallId = this.getWallId(this.cx, topY);
    	if (!this.checkForWall(wallId[0], wallId[1])) this.cy -= this.walkspeed;
    }
    if (this.cx > bomba.cx && rightX < g_playzone[0][1]) {
    	wallId = this.getWallId(rightX, this.cy);
    	if (!this.checkForWall(wallId[0], wallId[1])) this.cx += this.walkspeed;
    }
    if (this.cx < bomba.cx && leftX > g_playzone[0][0]) {
    	wallId = this.getWallId(leftX, this.cy);
    	if (!this.checkForWall(wallId[0], wallId[1])) this.cx -= this.walkspeed;
    }
};

//Checks which player this is and looks at how many bombs he's got left
Bomberman.prototype.checkBombBag = function() {
	if (this._spatialID === 1) {
		g_score.P1_maxBombs += this.noBombs;
		this.noBombs = 0;
		return g_score.P1_maxBombs;
  	}
  	//Works for now since we only have two players
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
			// Some magic numbers: 110 is the center of the first square
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
  this.sprite.animate(ctx,this.cx,this.cy,this.width,this.height,
  this.spritePosX,this.spritePosY);

};
