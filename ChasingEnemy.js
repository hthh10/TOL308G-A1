// ================
// PURSUING ENEMIES
// ================

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//A generic constructor which accepts an arbitrary descriptor object
function ChasingEnemy(descr){

	//Common inherited setup logic from Entity
	this.setup(descr);

	this.sprite = this.sprite || g_sprites.pasu;
	this._scale = 1;
};

ChasingEnemy.prototype = new Entity();

//Initial, inheritable default values
ChasingEnemy.prototype.cx = 140;
ChasingEnemy.prototype.cy = 200;
ChasingEnemy.prototype.sprite = this.sprite;
//spawn immunity
ChasingEnemy.prototype.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;

ChasingEnemy.prototype.update = function(du){
	this.immunity -= du;
	//unregister and check for death
	spatialManager.unregister(this);
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;
	//remember previous position
	this.computePosition();

	// if colliding with a bomb turn around
    if (this.isColliding() instanceof Bomb){
        this.isCollidingWithBomb(this.isColliding());
    }
    // if standing in fire, die!
    if ((this.isColliding() instanceof Explosion) && this.immunity < 10){
        //award points?
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
};

ChasingEnemy.prototype.speed = 2.5;
ChasingEnemy.prototype.moveEnemy = true;
ChasingEnemy.prototype.direction = 1; //1 = right, 2 = down, 3 = left, 4 = up
ChasingEnemy.prototype.computePosition = function() {
	//Enemy moves by default
	var wallId,
        leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

    // Going right
    if (rightX < g_playzone[0][1] && this.direction === 1) {
        wallId = this.getWallId(rightX,this.cy);
        if (!this.checkForWall(wallId[0],wallId[1])) {
            this.cx += this.speed;
        }
        if(this.checkForWall(wallId[0],wallId[1])) {
            if(Math.random() < 0.5) {
                // 50% chance of enemy going down
                this.direction = 2;
            }
            else this.direction = 4; // otherwise he goes up.

        }
    }
    // going down.
    if(this.direction === 2 && bottomY < g_playzone[1][1]) {
        wallId = this.getWallId(this.cx,bottomY);
        if (!this.checkForWall(wallId[0],wallId[1])) {
            this.cy += this.speed;
        }
        if(this.checkForWall(wallId[0],wallId[1])) {
            if(Math.random() < 0.5) {
                // 50% chance of enemy going right
                this.direction = 1;
            }
            else this.direction = 3; // otherwise he goes left.
        }
    } // going left
    if(this.direction === 3 && leftX > g_playzone[0][0]) {
        wallId = this.getWallId(leftX,this.cy);
        if (!this.checkForWall(wallId[0],wallId[1])) {
            this.cx -= this.speed;
        }
        if(this.checkForWall(wallId[0],wallId[1])) {
            if(Math.random() < 0.5) {
                // 50% chance of enemy going down
                this.direction = 4;
            }
            else this.direction = 2; // otherwise he goes up.
            }

        }
        // Going up
        if(this.direction === 4 && topY > g_playzone[1][0]) {
            wallId = this.getWallId(this.cx,topY);
            if (!this.checkForWall(wallId[0],wallId[1])) {
                this.cy -= this.speed;
            }
            if(this.checkForWall(wallId[0],wallId[1])) {
                if(Math.random() < 0.5) {
                    // 50% chance of enemy going left
                    this.direction = 3;
                }
                else this.direction = 1; // otherwise he goes right.
            }
        }
};

ChasingEnemy.prototype.getRadius = function() {
	return (this.sprite.width/2) * 0.7;
};

ChasingEnemy.prototype.isCollidingWithBomb = function(bomba){
	if(this.cy > bomba.cy) this.moveEnemy = true;
	if(this.cy < bomba.cy) this.moveEnemy = false;
	if(this.cx > bomba.cx) this.moveEnemy = true;
	if(this.cx < bomba.cx) this.moveEnemy = false;
};

ChasingEnemy.prototype.render = function(ctx){
	var origScale = this.sprite.scale;
	//pass my scale into the sprite, for drawing
	this.sprite.scale = this.scale;
	this.sprite.drawCenteredAt(ctx, this.cx, this.cy);
	this.sprite.scale = origScale;
};