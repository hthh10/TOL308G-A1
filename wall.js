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
doorNr : 1,

// Init function to set variables that must first be defined
init : function(){
	this.baseWallReset = this.baseWall;
	this.brickImg = g_images.brick;
	this.wallImg = g_images.wall;
	this.width  = this.brickImg.width;
	this.height = this.brickImg.height;
},

initMultiplayer : function() {
	this.generateLevel(1);
},

initStorymode : function() {
	this.generateLevel(1);
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

generateBrickVal: function(level) {
  var luck = Math.random();
  // býr til eina hurð sem er falin undir steini 1 til 20
  if (0 < wall.doorNr) {
    if (wall.doorNr > 20 || luck < 0.05) {
      wall.doorNr = -100;
      return 10;
    }
  }
  if (luck < 0.5) {
    wall.doorNr += 1;
    return 2;
  } else {
    wall.doorNr += 1;
    return this.selectItem();
  }
},

//random powerup ef við viljum hafa eitthvert þeirra algengara en annað
selectItem: function() {
  var luck = Math.random();
  if (luck < 0.33) {
    return 3;
  } else if (0.33 < luck > 0.66) {
    return 4;
  } else return 5;
},

destroyBrick : function (yId, xId) {
	var centerPos = this.wallIdToCxCy(yId, xId);
	var descr = {
		cx : centerPos[0],
		cy : centerPos[1]
	};
	// býr til hurð
	if (this.baseWall[yId][xId] === 10) {
	  entityManager.generateDoor(descr);
	  this.baseWall[yId][xId] = -10;
	}
	else if (this.baseWall[yId][xId] === 2) this.baseWall[yId][xId] = 0;
	else if (this.baseWall[yId][xId] > 2){
		for (var i = 3; i<10; i++) {
			descr.id = i-2;
			// ATH: EFTIR AÐ CROSS REFERENCE'A OG ÚTFÆRA GENERATE
			if (this.baseWall[yId][xId] === i) {
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

renderEdges : function(ctx) {
	// Start a little off screen to make playable are larger
	var height = g_images.wall.height, width = g_images.wall.width;

	var baseCx = -0.5*width, baseCy = 1.25*height;
	var stepCx = baseCx, stepCy = baseCy
	// Top left to bottom left
	for(var i = 0; i < Math.floor((g_canvas.height-baseCy)/height); i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCy += g_images.wall.height;
	}
	// bottom left to bottom right
	for(var i = 0; i < g_canvas.width/g_images.wall.width; i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCx += g_images.wall.width;
	}

	// bottom right to top right
	for(var i = 0; i < Math.floor((g_canvas.height-baseCy)/height); i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCy -= g_images.wall.height;
	}
	//top right to top left
	for(var i = 0; i < g_canvas.width/g_images.wall.width; i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCx -= g_images.wall.width;
	}

},

render : function(ctx){
	this.renderEdges(ctx);
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
