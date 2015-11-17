// ======
// BALLOM
// ======

"use strict";
/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//Ballom is an enemy that aimlessly wanders around at the same speed
//as Bomberman does.

//A generic constructor which accepts an arbitrary descriptor object
function Ballom(descr) {

    //Common inherited setup logic from Entity
    this.setup(descr);
    this._scale = 1;
}

//Ballom is an enemy so it inherits from the enemy function
Ballom.prototype = new Enemy();

Ballom.prototype.width = 19;//23.2;
Ballom.prototype.height = 20;

//15 rammar, frá 0 - 14
Ballom.prototype.downFrameLimit = 11; // 3 rammar. 0,1,2
Ballom.prototype.currentdownFrame = 0;
Ballom.prototype.downStartX = 0;
Ballom.prototype.downStartY = 0;

Ballom.prototype.upFrameLimit = 11;
Ballom.prototype.currentupFrame = 0;
Ballom.prototype.upStartX = 0;
Ballom.prototype.upStartY = 41; //20

Ballom.prototype.leftFrameLimit = 11;
Ballom.prototype.currentleftFrame = 0;
Ballom.prototype.leftStartX = 0; //42;
Ballom.prototype.leftStartY = 0; //20;

Ballom.prototype.rightFrameLimit = 11;
Ballom.prototype.currentrightFrame = 0;
Ballom.prototype.rightStartX = 0; //41;
Ballom.prototype.rightStartY = 20;

Ballom.prototype.spritePosX = 0;
Ballom.prototype.spritePosY = 0;

//Death animation stuff
Ballom.prototype.deadSpritePosX = 0;
Ballom.prototype.deadSpritePosY = 152;
Ballom.prototype.deathSlideWidth = 29;
Ballom.prototype.nrDeathSlides = 6;

Ballom.prototype.bombCollision = function(){
    //If colliding with a bomb, go the opposite way you came from
    if (this.isColliding() instanceof Bomb){
        this.isCollidingWithBomb(this.isColliding());
        if(this.direction === 1){
            this.direction = 3;
        }
        if(this.direction === 2){
            this.direction = 4;
        }
        if(this.direction === 3){
            this.direction = 1;
        }
        if(this.direction === 4){
            this.direction = 2;
        }

    }
}

Ballom.prototype.computePosition = function () {
    //Enemy moves by default
    var wallId,
        leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

        var downId = this.getWallId(this.cx,bottomY);
        var upId = this.getWallId(this.cx,topY)
        var rightId = this.getWallId(rightX,this.cy);
        var leftId = this.getWallId(leftX,this.cy);

        var shouldITurn = (Math.random() < 0.01) ? true : false;

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
        else if(topY <= g_playzone[1][0]) {
            this.cy += this.speed;
            if(Math.random() < 0.5) this.direction = 1;
            else this.direction = 3;
        }



        else {
            // Going right
            if (this.direction === 1) {

                wallId = this.getWallId(rightX,this.cy);

                if(!this.checkForWall(downId[0],downId[1]) && shouldITurn) {
                    this.direction = 2;
                }
                if(!this.checkForWall(upId[0],upId[1]) && shouldITurn) {
                    this.direction = 4;
                }
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

            // going down.
            if(this.direction === 2) {
                wallId = this.getWallId(this.cx,bottomY);

                if(!this.checkForWall(leftId[0],leftId[1]) && shouldITurn) this.direction = 3;
                if(!this.checkForWall(rightId[0],rightId[1]) && shouldITurn) this.direction = 1;

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

                if(!this.checkForWall(upId[0],upId[1]) && shouldITurn) this.direction = 4;
                if(!this.checkForWall(downId[0],downId[1]) && shouldITurn) this.direction = 2;
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

                if(!this.checkForWall(leftId[0],leftId[1]) && shouldITurn) this.direction = 3;
                if(!this.checkForWall(rightId[0],rightId[1]) && shouldITurn) this.direction = 1;

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
};
