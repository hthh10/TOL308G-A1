// =======
// ENEMIES
// =======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

//A generic constructor which accepts an arbitrary descriptor object

// UGLY var for level layout...

// ATH: BREYTTI KÓÐUNINNI FYRIR BASE WALL
// 10 = brick with door
// 5 = brick with powerup3
// 4 = brick with powerup2
// 3 = brick with powerup1
// 2 = brick
// 1 = wall
// 0 = possible brick
// -1 = blocked for player
// -10 = level finish door


// UGLY var for level layout...0,
var g_playzone = [[20, 620],  // x-coords
				  [90, 610]]; // y-coords

var wall = {
// Private variables for the wall.
baseWall : [[-1,-1,0,0,0,0,0,0,0,0,0,0,0,-1,-1],
            [-1, 1,0,1,0,1,0,1,0,1,0,1,0, 1,-1],
            [ 0, 0,0,0,0,0,0,0,0,0,0,0,0, 0, 0],
            [ 0, 1,0,1,0,1,0,1,0,1,0,1,0, 1, 0],
            [ 0, 0,0,0,0,0,0,0,0,0,0,0,0, 0, 0],
            [ 0, 1,0,1,0,1,0,1,0,1,0,1,0, 1, 0],
            [-1,-1,0,0,0,0,0,0,0,0,0,0,0, 0, 0],
            [ 0, 1,0,1,0,1,0,1,0,1,0,1,0, 1, 0],
            [ 0, 0,0,0,0,0,0,0,0,0,0,0,0, 0, 0],
            [ 0, 1,0,1,0,1,0,1,0,1,0,1,0, 1, 0],
            [ 0, 0,0,0,0,0,0,0,0,0,0,0,0, 0, 0],
            [ 0, 1,0,1,0,1,0,1,0,1,0,1,0, 1, 0],
            [ 0, 0,0,0,0,0,0,0,0,0,0,0,0, 0, 0],
            ],
baseWallReset : [],
brickImg : [],
wallImg : [],
width  : [],
height : [],
baseCx : 40,
baseCy : 110,
stepCx : 40,
stepCy : 40,
scale : 1,
level : 1,

// Init function to set variables that must first be defined
init : function(){
	this.baseWallReset = this.baseWall;
	this.brickImg = g_images.brick;
	this.wallImg = g_images.wall;
	this.width  = this.brickImg.width;
	this.height = this.brickImg.height;
	this.generateLevel(this.level);
},


generateLevel : function(level){
//TODO: Magic numbers for position of wall/rock. Higly dependent on the size of Wall sprite
	this.baseWall = this.baseWallReset;
	if (level === 4) return;
	for(var i = 0; i < this.baseWall.length; i++) {
        var cy = this.baseCy + (i*this.stepCy), cx = this.baseCx;
        for(var j = 0; j < this.baseWall[i].length; j++) {
            if(this.baseWall[i][j] === 0) {
              if(Math.random() >= 0.65) 
				  this.baseWall[i][j] = this.generateBrickVal(level);
            }

          cx += this.stepCx;

        }
    }
},

generateBrickVal : function(level) {
	var luck = Math.random();
	if (luck < 0.5) 
		return 2;
	else 
		return 3;
},

destroyBrick : function (yId, xId) {
	if (this.baseWall[yId][xId] === 10) this.baseWall[yId][xId] = -10;
	else if (this.baseWall[yId][xId] === 2) this.baseWall[yId][xId] = 0;
	else {
		for (var i = 3; i<10; i++) {
			// ATH: EFTIR AÐ CROSS REFERENCE'A OG ÚTFÆRA GENERATE
			if (this.baseWall[yId][xId] === i) {
				var centerPos = this.wallIdToCxCy(yId, xId);
				var descr = {
					cx : centerPos[0],
					cy : centerPos[1],
					id : i-2
				};
				entityManager.generatePowerup(descr);
			}
		}
		this.baseWall[yId][xId] = 0;
	}
},

wallIdToCxCy : function (yId, xId) {
	var cx = g_playzone[0][0]+xId*this.stepCx+this.width/2,
		cy = g_playzone[1][0]+yId*this.stepCy+this.height/2;
	
	return [cx, cy];
},

drawWallCenteredAt : function (ctx, cx, cy, image) {
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(image, -w/2, -h/2);
    
    ctx.restore();
},

render : function(ctx){
	for (var i = 0; i<this.baseWall.length; i++){
        for (var j = 0; j<this.baseWall[i].length; j++){
			// Render rigid walls
            if (this.baseWall[i][j] === 1){
                this.drawWallCenteredAt(ctx,this.baseCx+j*this.stepCx,
				this.baseCy+i*this.stepCy, this.wallImg);
            }
			// Render breakable walls
			else if (this.baseWall[i][j] > 1){
				this.drawWallCenteredAt(ctx,this.baseCx+j*this.stepCx,
				this.baseCy+i*this.stepCy, this.brickImg);
            }
        }
    }
}
}