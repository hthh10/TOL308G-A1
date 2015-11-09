// ===============
// BOMBERMAN STUFF
// ===============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bomberman(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.bomberman;

    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this._isReseting = false;
};

Bomberman.prototype = new Entity();

Bomberman.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
};

// Values for first bomberman
Bomberman.prototype.KEY_UP     = 'W'.charCodeAt(0);
Bomberman.prototype.KEY_DOWN   = 'S'.charCodeAt(0);
Bomberman.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Bomberman.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Bomberman.prototype.KEY_FIRE   = 'E'.charCodeAt(0);

Bomberman.prototype.cx = 40;
Bomberman.prototype.cy = 120;
Bomberman.prototype.velX = 0;
Bomberman.prototype.velY = 0;
Bomberman.prototype.noBombs = 1;

Bomberman.prototype.reset = function () {

    this._isReseting = true;
    this._scaleDirn = -1;

    // Unregister me from my old posistion
    // ...so that I can't be collided with while warping
    spatialManager.unregister(this);
};

Bomberman.prototype._updateReset = function (du) {

    var SHRINK_RATE = 3 / SECS_TO_NOMINALS;
    this._scale += this._scaleDirn * SHRINK_RATE * du;

    if (this._scale < 0.2) {

        this._moveToBeginning();
        this.halt();
        this._scaleDirn = 1;

    } else if (this._scale > 1) {

        this._scale = 1;
        this._isReseting = false;

        // Reregister me from my old posistion
        // ...so that I can be collided with again
        spatialManager.register(this);
    }
};

Bomberman.prototype._moveToBeginning = function () {
    // Move to initial position
    this.cx = this.reset_cx;
    this.cy = this.reset_cy;
};

Bomberman.prototype.update = function (du) {
    // Handle warping
    if (this._isReseting) {
        this._updateReset(du);
        return;
    }

	// Remember current position
	var oldCx = this.cx;
	var oldCy = this.cy;


    // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

	this.computePosition();

    // Handle firing
    this.maybeDropBomb();

    // Reset position if isColliding, otherwise Register
    // athuga hvort það er sprengja því þá viljum við ekki resetta. smá shitmix
  if (this.isColliding()) {
    if (this.isColliding() instanceof Enemy || this.isColliding() instanceof Explosion) {
			this.reset();
			g_score.P1_lives -= 1;
		}
      //athuga hvort hann collidar við sprengjuna eftir smá delay og
      // lokar svo fyrir að hann komist í gegnum hana
          // ATH HÉR GÆTI VERIÐ VANDAMÁL ÞEGAR BORÐIÐ ER FULLT AF HLUTUM SEM
          // BOMBERMAN GETUR ÓVART SKOTIST INNÍ
    } else if (this.isColliding() instanceof Bomb && (this.isColliding().lifeSpan < 100.0)) {
        this.isCollidingWithBomb(this.isColliding());
    } else spatialManager.register(this);

    };

var NOMINAL_WALKSPEED = 2.5;
var LEVEL_OFFSET_X = 40;
var LEVEL_OFFSET_Y = 110;

Bomberman.prototype.computePosition = function () {

    // Magic numbers: Offset for playable area
    var yMatrix = Math.ceil(this.cx / g_sprites.wall.width)-1;
    var xMatrix = Math.ceil(this.cy / g_sprites.wall.height)-3;

    if (keys[this.KEY_UP] && this.cy > g_sprites.wall.height*2.5) {
        console.log(xMatrix,yMatrix);
        if(!this.checkForWall(xMatrix,yMatrix)) this.cy -= NOMINAL_WALKSPEED;
        else this.bounce(xMatrix,yMatrix);

    }
    if (keys[this.KEY_DOWN] && this.cy <= (g_canvas.height - this.sprite.height)) {
        console.log(xMatrix,yMatrix);
        if(!this.checkForWall(xMatrix,yMatrix)) this.cy += NOMINAL_WALKSPEED;
        else this.bounce(xMatrix-1,yMatrix);
    }
    if (keys[this.KEY_LEFT] && this.cx >= this.sprite.width) {
        console.log(xMatrix,yMatrix);
        if(!this.checkForWall(xMatrix,yMatrix)) this.cx -= NOMINAL_WALKSPEED;
        else this.bounce(xMatrix,yMatrix+1);
        
    }
    
    if (keys[this.KEY_RIGHT] && this.cx < (g_canvas.width - this.sprite.width)) {
        console.log(xMatrix,yMatrix);
        console.log(this.cx,this.cy);
        if(!this.checkForWall(xMatrix,yMatrix)) this.cx += NOMINAL_WALKSPEED;
        else this.bounce(xMatrix,yMatrix-1);

    }
    //if (keys[this.KEY_RIGHT]) {
    //    if(this.cx <= (g_canvas.width - this.sprite.width / 2 )) this.cx += NOMINAL_WALKSPEED;
    //}
};

Bomberman.prototype.checkForWall = function (cx,cy) {
    if(wall.baseWall[cx][cy] === 2 || wall.baseWall[cx][cy] === 1) return true;
    else return false;

}
Bomberman.prototype.bounce = function (x,y) {
    console.log("bouncing to.. ", x,y);

    this.cx = LEVEL_OFFSET_X + (y*40);
    this.cy = 110 + (x*40);

    console.log("arriving at..", this.cx,this.cy);

}
// athugar collision við sprengju og breytir hraðanum eftir því
Bomberman.prototype.isCollidingWithBomb = function (bomba) {
  if (this.cy > bomba.cy) this.cy += NOMINAL_WALKSPEED;
  if (this.cy < bomba.cy) this.cy -= NOMINAL_WALKSPEED;
  if (this.cx > bomba.cx) this.cx += NOMINAL_WALKSPEED;
  if (this.cx < bomba.cx) this.cx -= NOMINAL_WALKSPEED;

},

Bomberman.prototype.maybeDropBomb = function () {
    if (keys[this.KEY_FIRE]) {

        // Can only drop one at a time
        //if(this.noBombs > 0) {
        //    this.noBombs -= 1;


            // Always drop bombs in center of the square
            // Some magic numbers: cx: 40, cy: 110 is the center of the first 
            var baseCx = 20, baseCy = 90; // Magic numbers, due to level being uneven.
            var xPos = (Math.floor((this.cx-baseCx) / g_sprites.wall.width)), yPos = Math.floor((this.cy-baseCy) / g_sprites.wall.height);
            var bombCx = g_sprites.wall.width + (g_sprites.wall.width * xPos), bombCy = 110 + (g_sprites.wall.height * yPos);

            entityManager.dropBomb(bombCx, bombCy, xPos, yPos);
        //}
    }

};

Bomberman.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.8;
};

Bomberman.prototype.takeBombHit = function () {
    this.reset();
};

Bomberman.prototype.halt = function () {
    this.velX = 0;
    this.velY = 0;
};

Bomberman.prototype.render = function (ctx) {
    var origScale = this.sprite.scale;
    // pass my scale into the sprite, for drawing
    this.sprite.scale = this._scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy);
    this.sprite.scale = origScale;
};
