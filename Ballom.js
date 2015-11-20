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
};

//Ballom is an enemy so it inherits from the enemy function
Ballom.prototype = new Enemy();

Ballom.prototype.width = 19;
Ballom.prototype.height = 20;
Ballom.prototype.speed = 1.25;

//12 frames, from 0 - 11
Ballom.prototype.downFrameLimit = 11;
Ballom.prototype.currentdownFrame = 0;
Ballom.prototype.downStartX = 0;
Ballom.prototype.downStartY = 0;

Ballom.prototype.upFrameLimit = 11;
Ballom.prototype.currentupFrame = 0;
Ballom.prototype.upStartX = 0;
Ballom.prototype.upStartY = 41;

Ballom.prototype.leftFrameLimit = 11;
Ballom.prototype.currentleftFrame = 0;
Ballom.prototype.leftStartX = 0;
Ballom.prototype.leftStartY = 0;

Ballom.prototype.rightFrameLimit = 11;
Ballom.prototype.currentrightFrame = 0;
Ballom.prototype.rightStartX = 0;
Ballom.prototype.rightStartY = 20;

Ballom.prototype.spritePosX = 0;
Ballom.prototype.spritePosY = 0;
Ballom.prototype.orientation = 1; // 0 = right, 1 = down, 2 = left, 3 = up
//Death animation stuff
Ballom.prototype.deadSpritePosX = 0;
Ballom.prototype.deadSpritePosY = 152;
Ballom.prototype.deathSlideWidth = 29;
Ballom.prototype.nrDeathSlides = 6;

Ballom.prototype.bombCollision = function(){

    //If colliding with a bomb, go the opposite way you came from
    if (this.isColliding() instanceof Bomb){
        this.isCollidingWithBomb(this.isColliding());

        if(this.direction === 1) this.direction = 3;
        if(this.direction === 2) this.direction = 4;
        if(this.direction === 3) this.direction = 1;
        if(this.direction === 4) this.direction = 2;
    }
};

Ballom.prototype.computePosition = function () {
	var wallId,
		leftX = this.cx-this.getRadius(),
		rightX = this.cx+this.getRadius(),
		topY = this.cy-this.getRadius(),
		bottomY = this.cy+this.getRadius();

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
			
		// Animation
        if(this.orientation !== 0) {
          this.orientation = 0;
          this.currentrightFrame = 0;
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
        if(this.orientation !== 1) {
            this.orientation = 1;
            this.currentdownFrame = 0;
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
    }

    // going left
    else if (this.direction === 3) {
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
        if(this.orientation !== 2 ) {
            this.orientation = 2;
            this.currentleftFrame = 0;
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
	}

    // Going up
    else if (this.direction === 4) {
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
        if(this.orientation !== 3) {
          this.orientation = 3;
          this.currentupFrame = 0;
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
    }
};

Ballom.prototype.getRadius = function() {
    return 19.9;
};
