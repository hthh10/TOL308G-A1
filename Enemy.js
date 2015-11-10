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

    this.sprite = this.sprite || g_sprites.ballom || g_sprites.onil;
    this._scale = 1;
}

Enemy.prototype = new Entity();

// Initial, inheritable, default values
Enemy.prototype.cx = 40;
Enemy.prototype.cy = 350;
Enemy.prototype.sprite = this.sprite;

Enemy.prototype.update = function(du) {
     // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    //remember previous position
    this.computePosition();

    // if colliding with a bomb turn around
    if (this.isColliding() instanceof Bomb){
        this.isCollidingWithBomb(this.isColliding());
    }
    // if standing in fire, die!
    if (this.isColliding() instanceof Explosion){
        //award points?
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
}

var NOMINAL_WALKSPEED;
Enemy.prototype.speed = this.NOMINAL_WALKSPEED;
Enemy.prototype.moveEnemy = true;
Enemy.prototype.computePosition = function () {
    //Enemy moves by default
    var wallId,
        leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

    //Enemy moves by default
    //moves to the left
    if(!this.moveEnemy && leftX > g_playzone[0][0]){
        wallId = this.getWallId(leftX, this.cy);
        if(!this.checkForWall(wallId[0], wallId[1], wallId[2])){
            this.cx -= NOMINAL_WALKSPEED;
        }
        else{
            this.moveEnemy = !(this.moveEnemy);
        }
    }
    //moves to the right
    else if(this.moveEnemy && rightX < g_playzone[0][1]){
        wallId = this.getWallId(rightX, this.cy);
        if(!this.checkForWall(wallId[0], wallId[1], wallId[2])){
            this.cx += NOMINAL_WALKSPEED;
        }
        else{
            this.moveEnemy = !(this.moveEnemy);
        }
    }
    //moves up
    else if(this.moveEnemy && topY > g_playzone[1][0]){
        wallId = this.getWallId(this.cx, topY);
        if(!this.checkForWall(wallId[0], wallId[1], wallId[2])){
            this.cy -= NOMINAL_WALKSPEED;
        }
        else{
            this.moveEnemy = !(this.moveEnemy);
        }
        
    }
    //moves down
    else if(!this.moveEnemy && bottomY < g_playzone[1][1]){
        wallId = this.getWallId(this.cx, bottomY);
        if(!this.checkForWall(wallId[0], wallId[1], wallId[2])){
            this.cy += NOMINAL_WALKSPEED;
        }
        else{
            this.moveEnemy = !(this.moveEnemy);
        }
    }
    /*
    //if the enemy has reached a certain point, change the value of moveEnemy to false and move left
    if(this.cx > 600){
        this.moveEnemy = false;
    }
    //if the enemy has reached a certain point, change the value of MoveEnemy to true again and move right
    else if(this.cx < 40){
        this.moveEnemy = true;
    }
    */
};
Enemy.prototype.getRadius = function() {
      return (this.sprite.width / 2) * 0.7;
};
// athugar collision við sprengju og breytir hraðanum eftir því
Enemy.prototype.isCollidingWithBomb = function (bomba) {
  // if (this.cy > bomba.cy)   this.moveEnemy = true;
  // if (this.cy < bomba.cy)   this.moveEnemy = false;
  if (this.cx > bomba.cx)   this.moveEnemy = true;
  if (this.cx < bomba.cx)   this.moveEnemy = false;
},

Enemy.prototype.render = function(ctx){
    var origScale = this.sprite.scale;
    //pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy);
    this.sprite.scale = origScale;
}
