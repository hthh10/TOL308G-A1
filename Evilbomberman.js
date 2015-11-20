// ==============
// EVIL BOMBERMAN
// ==============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//Evilbomberman moves slightly faster than Bomberman and eats the bombs it finds in it's way

//A generic constructor which accepts an arbitrary descriptor object
function Evilbomberman(descr) {

  //Common inherited setup logic from Entity
  this.setup(descr);
  this._scale = 1;

  // Default sprite, if not otherwise specified
  this.sprite = this.sprite || g_sprites.deadBomberman;
  this.sprite.width = 28;
}

//Evilbomberman is an enemy so it inherits from the Enemy function
Evilbomberman.prototype = new Enemy();

// Sprite sheet properties
Evilbomberman.prototype.cx = 40;
Evilbomberman.prototype.cy = 350;
Evilbomberman.prototype.width = 19;
Evilbomberman.prototype.height = 21;
Evilbomberman.prototype.speed = 2;

//13 frames, from 0 - 12
Evilbomberman.prototype.downFrameLimit = 12;
Evilbomberman.prototype.currentdownFrame = 0;
Evilbomberman.prototype.downStartX = 0;
Evilbomberman.prototype.downStartY = 0;

Evilbomberman.prototype.upFrameLimit = 12;
Evilbomberman.prototype.currentupFrame = 0;
Evilbomberman.prototype.upStartX = 0;
Evilbomberman.prototype.upStartY = 23;

Evilbomberman.prototype.leftFrameLimit = 12;
Evilbomberman.prototype.currentleftFrame = 0;
Evilbomberman.prototype.leftStartX = 0;
Evilbomberman.prototype.leftStartY = 45;

Evilbomberman.prototype.rightFrameLimit = 12;
Evilbomberman.prototype.currentrightFrame = 0;
Evilbomberman.prototype.rightStartX = 0;
Evilbomberman.prototype.rightStartY = 68;

Evilbomberman.prototype.spritePosX = 0;
Evilbomberman.prototype.spritePosY = 0;
Evilbomberman.prototype.orientation = 1; // 0 = right, 1 = down, 2 = left, 3 = up

Evilbomberman.prototype.Bombinterval = 5000 / NOMINAL_UPDATE_INTERVAL;
Evilbomberman.prototype.canDropBomb = true;
Evilbomberman.prototype.lives = 3;
Evilbomberman.prototype.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;

//Death animation stuff
Evilbomberman.prototype.deadSpritePosX = 58;
Evilbomberman.prototype.deadSpritePosY = 32;
Evilbomberman.prototype.deathSlideWidth = 29;
Evilbomberman.prototype.nrDeathSlides = 7;


Evilbomberman.prototype.update = function(du) {
  // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

  if (this.lives < 1) {
    entityManager.killSprite(this.cx, this.cy, this.width,
      this.height, this.deadSpritePosX, this.deadSpritePosY,
      this.nrDeathSlides, this.deathSlideWidth, g_sprites.deadEvilBomberman);

    return entityManager.KILL_ME_NOW;
  }

  this.immunity -= du;
  this.Bombinterval -= du;
  this.computePosition();
  this.maybeDropBomb();


  if (this.isColliding()) {
    var hitEntity = this.findHitEntity();

    //If colliding with a bomb, go the opposite way you came from
    if (hitEntity instanceof Bomb && (hitEntity.lifeSpan < 100.0)) {
      this.isCollidingWithBomb(hitEntity);

      if(this.direction === 1) this.direction = 3;
      if(this.direction === 2) this.direction = 4;
      if(this.direction === 3) this.direction = 1;
      if(this.direction === 4) this.direction = 2;
    }
    // if hit by player's bombs, lose hp.
    if ((hitEntity instanceof Explosion && hitEntity.bombermanID > 0) &&
          this.immunity < 20) {
      //award points?
      this.lives -= 1;
      this.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;
      console.log('evil hp = ' + this.lives);
    }
  }

  if (this.Bombinterval < 0) {
    this.Bombinterval = 4000 / NOMINAL_UPDATE_INTERVAL;
    this.canDropBomb = true;
  }

  spatialManager.register(this);

};

Evilbomberman.prototype.maybeDropBomb = function() {
  if ((this.canDropBomb && this.Bombinterval < 1000 / NOMINAL_UPDATE_INTERVAL) ||
    Math.random() < 0.005) {

    // Don't drop bomb if there is one already in the square
    var hitEntity = spatialManager.findEntityInRange(this.cx, this.cy, 1);
    if (hitEntity instanceof Bomb) return;

    var baseCx = g_playzone[0][0],
      baseCy = g_playzone[1][0];
    var xPos = Math.floor((this.cx - baseCx) / g_sprites.wall.width),
      yPos = Math.floor((this.cy - baseCy) / g_sprites.wall.height);
    var bombCx = g_sprites.wall.width + (g_sprites.wall.width * xPos),
      bombCy = 110 + (g_sprites.wall.height * yPos);

    entityManager.dropBomb(bombCx, bombCy, xPos, yPos,
      6, 0 - this._spatialID, false);

    this.canDropBomb = false;

  }
};

Evilbomberman.prototype.computePosition = function() {


  var wallId,
    leftX = this.cx - this.getRadius(),
    rightX = this.cx + this.getRadius(),
    topY = this.cy - this.getRadius(),
    bottomY = this.cy + this.getRadius();

  var upId, downId, leftId, rightId;

  downId = this.getWallId(this.cx, bottomY);
  upId = this.getWallId(this.cx, topY);
  rightId = this.getWallId(rightX, this.cy);
  leftId = this.getWallId(leftX, this.cy);

  var shouldITurn = (Math.random() < 0.7) ? true : false;


  // Going right
  if (this.direction === 1) {

    // going forward logic
    if (this.canMoveRight(leftX, rightX + this.speed, topY, bottomY)) {
      this.cx += this.speed;
      rightX += this.speed;
      leftX += this.speed;
    } else // if there is a wall
      this.wallCollide(this.direction, leftX, rightX, topY, bottomY);

    //Animation
    if (this.orientation !== 0) {
      this.orientation = 0;
      this.currentrightFrame = 0;
    }
    if (this.currentrightFrame === 0) {
      this.spritePosX = this.rightStartX;
      this.spritePosY = this.rightStartY;
    }
    if (this.currentrightFrame < this.rightFrameLimit) {
      ++this.currentrightFrame;
      this.spritePosX += this.width;
    } else {
      this.spritePosX = this.rightStartX;
      this.currentrightFrame = 0;
    }
  }

  // going down.
  else if (this.direction === 2) {
    // going forward logic
    if (this.canMoveDown(leftX, rightX, topY, bottomY + this.speed)) {
      this.cy += this.speed;
      topY += this.speed;
      bottomY += this.speed;
    } else // if there is a wall
      this.wallCollide(this.direction, leftX, rightX, topY, bottomY);

    // Maybe change direction
    if (shouldITurn)
      this.changeDirection(this.direction, leftX, rightX, topY, bottomY);

    //Animation
    if (this.orientation !== 1) {
      this.orientation = 1;
      this.currentdownFrame = 0;
    }
    if (this.currentdownFrame === 0) {
      this.spritePosX = this.downStartX;
      this.spritePosY = this.downStartY;
    }
    if (this.currentdownFrame < this.downFrameLimit) {
      ++this.currentdownFrame;
      this.spritePosX += this.width;
    } else {
      this.spritePosX = this.downStartX;
      this.currentdownFrame = 0;
    }
  }


  // going left
  else if (this.direction === 3) {
    // going forward logic
    if (this.canMoveLeft(leftX - this.speed, rightX, topY, bottomY)) {
      this.cx -= this.speed;
      rightX -= this.speed;
      leftX -= this.speed;
    } else // if there is a wall
      this.wallCollide(this.direction, leftX, rightX, topY, bottomY);

    // Maybe change direction
    if (shouldITurn)
      this.changeDirection(this.direction, leftX, rightX, topY, bottomY);


    //Animation
    if (this.orientation !== 2) {
      this.orientation = 2;
      this.currentleftFrame = 0;
    }
    if (this.currentleftFrame === 0) {
      this.spritePosX = this.leftStartX;
      this.spritePosY = this.leftStartY;
    }
    if (this.currentleftFrame < this.leftFrameLimit) {
      ++this.currentleftFrame;
      this.spritePosX += this.width;
    } else {
      this.spritePosX = this.leftStartX;
      this.currentleftFrame = 0;
    }
  }
  // Going up
  else if (this.direction === 4) {
    // going forward logic
    if (this.canMoveUp(leftX, rightX, topY - this.speed, bottomY)) {
      this.cy -= this.speed;
      topY -= this.speed;
      bottomY -= this.speed;
    } else // if there is a wall
      this.wallCollide(this.direction, leftX, rightX, topY, bottomY);

    // Maybe change direction
    if (shouldITurn)
      this.changeDirection(this.direction, leftX, rightX, topY, bottomY);

    // Animation
    if (this.orientation !== 3) {
      this.orientation = 3;
      this.currentupFrame = 0;
    }
    if (this.currentupFrame === 0) {
      this.spritePosX = this.upStartX;
      this.spritePosY = this.upStartY;
    }
    if (this.currentupFrame < this.upFrameLimit) {
      ++this.currentupFrame;
      this.spritePosX += this.width;
    } else {
      this.spritePosX = this.upStartX;
      this.currentupFrame = 0;
    }
  }
};

Evilbomberman.prototype.changeDirection = function(direction, leftX, rightX, topY, bottomY) {

  var bmanX = spatialManager.findBomberman().posX;
  var bmanY = spatialManager.findBomberman().posY;
  var bmanXprox = this.cx - bmanX;
  var bmanYprox = this.cy - bmanY;

  switch(direction) {
		case 1:
			if (bmanYprox < 0) { // 50% chance on checking down first
				if(this.canMoveDown(leftX,rightX,topY,bottomY+this.getRadius()))
					this.direction = 2;
				else if(this.canMoveUp(leftX,rightX,topY-this.getRadius(),bottomY))
					this.direction = 4;
			}
			else { // 50% chance on checking up first
				if(this.canMoveUp(leftX,rightX,topY-this.getRadius(),bottomY))
					this.direction = 4;
				else if(this.canMoveDown(leftX,rightX,topY,bottomY+this.getRadius()))
					this.direction = 2;
			}
			break;

		case 2:
			if (bmanXprox > 0) { // 50% chance checking move left first
				if(this.canMoveLeft(leftX-this.getRadius(),rightX,topY,bottomY))
					this.direction = 3;
				else if (this.canMoveRight(leftX,rightX+this.getRadius(),topY,bottomY))
					this.direction = 1;
			}
			else { // 50% chance on checking move right first
				if(this.canMoveRight(leftX,rightX+this.getRadius(),topY,bottomY))
					this.direction = 1;
				else if (this.canMoveLeft(leftX-this.getRadius(),rightX,topY,bottomY))
					this.direction = 3;
			}
			break;

		case 3: // Going left
			if (bmanYprox < 0) { // 50% chance on checking down first
				if(this.canMoveDown(leftX,rightX,topY,bottomY+this.getRadius()))
					this.direction = 2;
				else if(this.canMoveUp(leftX,rightX,topY-this.getRadius(),bottomY))
					this.direction = 4;
			}
			else { // 50% chance on checking up first
				if(this.canMoveUp(leftX,rightX,topY-this.getRadius(),bottomY))
					this.direction = 4;
				else if(this.canMoveDown(leftX,rightX,topY,bottomY+this.getRadius()))
					this.direction = 2;
			}
			break;

		case 4: // Going up
			if (bmanXprox > 0) { // 50% chance checking move left first
				if(this.canMoveLeft(leftX-this.getRadius(),rightX,topY,bottomY))
					this.direction = 3;
				else if (this.canMoveRight(leftX,rightX+this.getRadius(),topY,bottomY))
					this.direction = 1;
			}
			else { // 50% chance on checking move right first
				if(this.canMoveRight(leftX,rightX+this.getRadius(),topY,bottomY))
					this.direction = 1;
				else if (this.canMoveLeft(leftX-this.getRadius(),rightX,topY,bottomY))
					this.direction = 3;
			}
			break;
	}
},
Evilbomberman.prototype.getRadius = function () {
    return 19.9;
};

Evilbomberman.prototype.render = function(ctx) {
  var origScale = this.sprite.scale;
  // pass my scale into the sprite, for drawing
  this.sprite.scale = this._scale;
  this.sprite.animate(ctx, this.cx, this.cy, this.width, this.height, this.spritePosX, this.spritePosY);
  this.sprite.scale = origScale;
};
