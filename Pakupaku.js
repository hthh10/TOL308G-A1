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

Pakupaku.prototype.computePosition = function () {
    //Enemy moves by default
    var wallId,
        leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

        var upId, downId, leftId, rightId;

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
        else if(topY <= g_playzone[1][0] +5) {
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
            }
        }
        };
