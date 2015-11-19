// ====
// ONIL
// ====

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//Onil is an enemy that's more dangerous than Ballom because it travels
//double the speed of Bomberman.

//A generic constructor which accepts an arbitrary descriptor object
function Onil(descr) {

    //Common inherited setup logic from Entity
    this.setup(descr);
    this._scale = 1;
}

//Onil is an enemy so it inherits from the Enemy function
Onil.prototype = new Enemy();

Onil.prototype.width = 21;
Onil.prototype.height = 21;
Onil.prototype.speed = 2.5;

//10 frames, from 0 - 9
Onil.prototype.downFrameLimit = 9;
Onil.prototype.currentdownFrame = 0;
Onil.prototype.downStartX = 0;
Onil.prototype.downStartY = 21;

Onil.prototype.upFrameLimit = 9;
Onil.prototype.currentupFrame = 0;
Onil.prototype.upStartX = 0;
Onil.prototype.upStartY = 0;

Onil.prototype.leftFrameLimit = 9;
Onil.prototype.currentleftFrame = 0;
Onil.prototype.leftStartX = 0; 
Onil.prototype.leftStartY = 0; 

Onil.prototype.rightFrameLimit = 9;
Onil.prototype.currentrightFrame = 0;
Onil.prototype.rightStartX = 0;
Onil.prototype.rightStartY = 21;

Onil.prototype.spritePosX = 0;
Onil.prototype.spritePosY = 0;

//Death animation stuff
Onil.prototype.deadSpritePosX = 0;
Onil.prototype.deadSpritePosY = 152;
Onil.prototype.deathSlideWidth = 29;
Onil.prototype.nrDeathSlides = 6;

Onil.prototype.bombCollision = function(){
    //If colliding with a bomb, go the opposite way you came from
    if (this.isColliding() instanceof Bomb){
        this.isCollidingWithBomb(this.isColliding());
        if(this.direction === 1) this.direction = 3;
        if(this.direction === 2) this.direction = 4;
        if(this.direction === 3) this.direction = 1;
        if(this.direction === 4) this.direction = 2;
    }
}

Onil.prototype.computePosition = function () {
    //Enemy moves by default
    var wallId,
        leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

    var upId, downId, leftId, rightId;

    // playzone rules - If the enemy hits the edges of the playfield
    // he is kindly asked to go away.
    if (rightX >= g_playzone[0][1]){
        this.cx -= this.speed;
        if(Math.random() < 0.5) this.direction = 2;
        else this.direction = 4;
    }
    else if (leftX <= g_playzone[0][0]) {
        this.cx += this.speed;
        if(Math.random() < 0.5) this.direction = 2;
        else this.direction = 4;
    }
    else if(bottomY >= g_playzone[1][1]) {
        this.cy -= this.speed;
        if(Math.random() < 0.5) this.direction = 1;
        else this.direction = 3;
    }
    else if(topY <= g_playzone[1][0] +5) {
        this.cy += this.speed;
        if(Math.random() < 0.5) this.direction = 1;
        else this.direction = 3;
    }

    else {
        // Going right
        if (this.direction === 1) {

            wallId = this.getWallId(rightX,this.cy);
            // going forward logic. Check if the next block is a wall
            if (!this.checkForWall(wallId[0],wallId[1])) this.cx += this.speed;
            else{ // if there is a wall
                if(Math.random() < 0.5) this.direction = 2; // 50% chance of going up
                else this.direction = 4; // otherwise he goes up.
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
        }

    }
        // going down.
        if(this.direction === 2) {
            wallId = this.getWallId(this.cx,bottomY);

            if (!this.checkForWall(wallId[0],wallId[1])) this.cy += this.speed;
                else{
                    if(Math.random() < 0.5) this.direction = 1;  // 50% chance of enemy going right
                    else this.direction = 3; // otherwise he goes left.
                }
            //Animation
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

        }


        // going left
        if(this.direction === 3) {
            wallId = this.getWallId(leftX,this.cy);
            if (!this.checkForWall(wallId[0],wallId[1])) this.cx -= this.speed;
            else{
                if(Math.random() < 0.5) this.direction = 4; // 50% chance of enemy going down
                else this.direction = 2; // otherwise he goes up.
                }
            // Animation
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
        }
        // Going up
        if(this.direction === 4) {
            wallId = this.getWallId(this.cx,topY);

            if (!this.checkForWall(wallId[0],wallId[1])) {
                this.cy -= this.speed;
            }
            if(this.checkForWall(wallId[0],wallId[1])) {
                if(Math.random() < 0.5) this.direction = 3; // 50% chance of enemy going left
                else this.direction = 1; // otherwise he goes right.
            }

            // Animation
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

        }
    }
	
Onil.prototype.getRadius = function() {
    return 19.9;
};
