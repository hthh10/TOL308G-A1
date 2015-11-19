// ========
// PAKUPAKU
// ========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//Pakupaku moves slightly faster than Bomberman and eats the bombs it finds in it's way

//A generic constructor which accepts an arbitrary descriptor object
function Pakupaku(descr) {

    //Common inherited setup logic from Entity
    this.setup(descr);
    this._scale = 1;
}

//Pakupaku is an enemy so it inherits from the Enemy function
Pakupaku.prototype = new Enemy();

Pakupaku.prototype.width = 21;
Pakupaku.prototype.height = 20;
Pakupaku.prototype.speed = 2;

//10 frames, from 0 - 9

Pakupaku.prototype.upFrameLimit = 9;
Pakupaku.prototype.currentupFrame = 0;
Pakupaku.prototype.upStartX = 0; 
Pakupaku.prototype.upStartY = 0; 

Pakupaku.prototype.downFrameLimit = 9;
Pakupaku.prototype.currentdownFrame = 0;
Pakupaku.prototype.downStartX = 0; 
Pakupaku.prototype.downStartY = 21; 

Pakupaku.prototype.leftFrameLimit = 9;
Pakupaku.prototype.currentleftFrame = 0;
Pakupaku.prototype.leftStartX = 0; 
Pakupaku.prototype.leftStartY = 42; 

Pakupaku.prototype.rightFrameLimit = 9;
Pakupaku.prototype.currentrightFrame = 0;
Pakupaku.prototype.rightStartX = 0; 
Pakupaku.prototype.rightStartY = 63;

Pakupaku.prototype.eatLeftFrameLimit = 9;
Pakupaku.prototype.currentEatLeftFrame = 0;
Pakupaku.prototype.eatLeftStartX = 0;
Pakupaku.prototype.eatLeftStartY = 84;

Pakupaku.prototype.eatRightFrameLimit = 9;
Pakupaku.prototype.currentEatRightFrame = 0;
Pakupaku.prototype.eatRightStartX = 0;
Pakupaku.prototype.eatRightStartY = 105;

Pakupaku.prototype.spritePosX = 0;
Pakupaku.prototype.spritePosY = 0;

//Death animation stuff
Pakupaku.prototype.deadSpritePosX = 0;
Pakupaku.prototype.deadSpritePosY = 94;
Pakupaku.prototype.deathSlideWidth = 29;
Pakupaku.prototype.nrDeathSlides = 6;


Pakupaku.prototype.bombCollision = function() {
	//Checks to see if it's colliding with bomb
    //If it is colliding with a bomb and is going right or down, do the right animation
    if (this.isColliding() instanceof Bomb && (this.direction === 1 || this.direction ===2)){
        this.isCollidingWithBomb(this.isColliding());
        // Animation
        if(this.currentEatRightFrame === 0) {
            this.spritePosX = this.eatRightStartX;
            this.spritePosY = this.eatRightStartY;
        }
            if(this.currentEatRightFrame < this.eatRightFrameLimit) {
            ++this.currentEatRightFrame;
            this.spritePosX += this.width;
        }

        else {
            this.spritePosX = this.eatRightStartX;
            this.currenteatRightFrame = 0;
        }
    }
    //If it is colliding with a bomb and is going left or up, do the left animation
	if(this.isColliding() instanceof Bomb && (this.direction === 3 || this.direction === 4)){
		this.isCollidingWithBomb(this.isColliding());
		// Animation
        if(this.currentEatLeftFrame === 0) {
            this.spritePosX = this.eatLeftStartX;
            this.spritePosY = this.eatLeftStartY;
        }
            if(this.currentEatLeftFrame < this.eatLeftFrameLimit) {
            ++this.currentEatLeftFrame;
            this.spritePosX += this.width;
        }

        else {
            this.spritePosX = this.eatLeftStartX;
            this.currenteatLeftFrame = 0;
        }
	}
}

Pakupaku.prototype.computePosition = function () {
    //Enemy moves by default
    var leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

    var shouldITurn = (Math.random() < 0.5) ? true : false;

    // Going right
    if (this.direction === 1) {
		// going forward logic
		if(this.canMoveRight(leftX,rightX+this.speed,topY,bottomY)) {
			this.cx += this.speed;
			rightX += this.speed;
			leftX += this.speed;
		}
		else // if there is a wall
			this.wallCollide(this.direction, leftX, rightX, topY, bottomY);
		
		// Maybe change direction
		if (shouldITurn)
			this.changeDirection(this.direction, leftX, rightX, topY, bottomY);
			
        //Animation
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
    else if(this.direction === 2) {
		// going forward logic
		if(this.canMoveDown(leftX,rightX,topY,bottomY+this.speed)) {
			this.cy += this.speed;
			topY += this.speed;
			bottomY += this.speed;
		}
		else // if there is a wall
			this.wallCollide(this.direction, leftX, rightX, topY, bottomY);
			
		// Maybe change direction
		if (shouldITurn)
			this.changeDirection(this.direction, leftX, rightX, topY, bottomY);
		
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
    else if(this.direction === 3) {
		// going forward logic
		if(this.canMoveLeft(leftX-this.speed,rightX,topY,bottomY)) {
			this.cx -= this.speed;
			rightX -= this.speed;
			leftX -= this.speed;
		}
		else // if there is a wall
			this.wallCollide(this.direction, leftX, rightX, topY, bottomY);
		
		// Maybe change direction
		if (shouldITurn)
			this.changeDirection(this.direction, leftX, rightX, topY, bottomY);
				
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
    else if(this.direction === 4) {
        // going forward logic
		if(this.canMoveUp(leftX,rightX,topY-this.speed,bottomY)) {
			this.cy -= this.speed;
			topY -= this.speed;
			bottomY -= this.speed;
		}
		else // if there is a wall
			this.wallCollide(this.direction, leftX, rightX, topY, bottomY);
		
		// Maybe change direction
		if (shouldITurn)
			this.changeDirection(this.direction, leftX, rightX, topY, bottomY);
			
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
},

Pakupaku.prototype.getRadius = function() {
    return 19.9;
};
