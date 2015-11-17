// ================
// HARMLESS ENEMIES
// ================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//A generic constructor which accepts an arbitrary descriptor object
function Enemy(descr) {

    //Common inherited setup logic from Entity
    this.setup(descr);
    this.sprite = this.sprite;
    this._scale = 1;
}

Enemy.prototype = new Entity();

// Initial, inheritable, default values
Enemy.prototype.cx = 40;
Enemy.prototype.cy = 350;
Enemy.prototype.sprite = this.sprite;
Enemy.prototype.lifeSpan = 1000 / NOMINAL_UPDATE_INTERVAL;
Enemy.prototype.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;


Enemy.prototype.update = function(du) {
     // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    //spawn immunity
    this.immunity -= du;

    //remember previous position
    this.computePosition();


    this.bombCollision();

    // if standing in fire, die!
    if ((this.isColliding() instanceof Explosion) && this.immunity < 10){
        //award points?
        if (this.deathsheet) {
          entityManager.killSprite(this.cx,this.cy,this.width,
            this.height,this.deadSpritePosX,this.deadSpritePosY,
            this.nrDeathSlides, this.deathSlideWidth, this.deathsheet);
        }
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
}

Enemy.prototype.speed = 1.5;
Enemy.prototype.moveEnemy = true;
Enemy.prototype.direction = 2; // 1 = Right, 2 = down, 3 = left, 4 = up

Enemy.prototype.getRadius = function() {
    return this.width*0.9;
};
// athugar collision við sprengju og breytir hraðanum eftir því
Enemy.prototype.isCollidingWithBomb = function(bomba) {

  var leftX = this.cx - this.getRadius(),
    rightX = this.cx + this.getRadius(),
    topY = this.cy - this.getRadius(),
    bottomY = this.cy + this.getRadius();

  if (this.cy > bomba.cy && bottomY >= g_playzone[1][1]) {
    if (Math.random() < 0.5) this.direction = 2;
    else this.direction = 4;
    this.cy -= this.speed;
  }
  if (this.cy < bomba.cy && topY <= g_playzone[1][0]) {
    if (Math.random() < 0.5) this.direction = 1;
    else this.direction = 3;
    this.cy += this.speed;
  }
  if (this.cx > bomba.cx && rightX >= g_playzone[0][1]) {
    if (Math.random() < 0.5) this.direction = 2;
    else this.direction = 4;
    this.cx -= this.speed;
  }
  if (this.cx < bomba.cx && leftX <= g_playzone[0][0]) {
    if (Math.random() < 0.5) this.direction = 2;
    else this.direction = 4;
    this.cx += this.speed;
  }
};

Enemy.prototype.canMoveUp = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		wallIdRight,
		wallIdTop,
		wallIdBottom;
	// If topY is out of bounds, fix it
	if (topY < g_playzone[1][0]){
		return false;
	}
	else {
		wallIdLeft = this.getWallId(leftX,topY);
		wallIdRight = this.getWallId(rightX,topY);
		if (!this.checkForWall(wallIdLeft[0],wallIdLeft[1]) &&
			!this.checkForWall(wallIdRight[0],wallIdRight[1])) {
			return true;
		}
		return false;
	}
},

Enemy.prototype.canMoveDown = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		wallIdRight,
		wallIdTop,
		wallIdBottom;
	// If BottomY is out of bounds, fix it
	if (bottomY > g_playzone[1][1]){
		return false;
	}
	else {
		wallIdLeft = this.getWallId(leftX,bottomY);
		wallIdRight = this.getWallId(rightX,bottomY);
		if (!this.checkForWall(wallIdLeft[0],wallIdLeft[1]) &&
			!this.checkForWall(wallIdRight[0],wallIdRight[1])) {
			return true;
		}
		return false;
	}
},

Enemy.prototype.canMoveLeft = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		wallIdRight,
		wallIdTop,
		wallIdBottom;
	// If leftX is out of bounds, fix it
	if (leftX < g_playzone[0][0]){
		return false;
	}
	else {
		wallIdTop = this.getWallId(leftX,topY);
		wallIdBottom = this.getWallId(leftX,bottomY);
		if (!this.checkForWall(wallIdTop[0],wallIdTop[1]) &&
			!this.checkForWall(wallIdBottom[0],wallIdBottom[1])) {
			return true;
		}
		return false;
	}
},

Enemy.prototype.canMoveRight = function(leftX, rightX, topY, bottomY) {
	var wallIdLeft,
		wallIdRight,
		wallIdTop,
		wallIdBottom;
	// If rightX is out of bounds, fix it
	if (rightX > g_playzone[0][1]){
		return false;
	}
	else {
		wallIdTop = this.getWallId(rightX,topY);
		wallIdBottom = this.getWallId(rightX,bottomY);
		if (!this.checkForWall(wallIdTop[0],wallIdTop[1]) &&
			!this.checkForWall(wallIdBottom[0],wallIdBottom[1])) {
			return true;
		}
		return false;
	}
},

Enemy.prototype.render = function(ctx){

    //var origScale = this.sprite.scale;
    //pass my scale into the sprite, for drawing
    //this.sprite.scale = this.scale;
    //this.sprite.drawCentredAt(ctx, this.cx, this.cy);
    this.sprite.animate(ctx,this.cx,this.cy,this.width,this.height,this.spritePosX,this.spritePosY);
    //this.sprite.scale = origScale;
};
