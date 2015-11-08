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
function Enemy(descr) {

    //Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = this.sprite || g_sprites.enemy1;
    this._scale = 1;
}

Enemy.prototype = new Entity();

// Initial, inheritable, default values
Enemy.prototype.cx = 40;
Enemy.prototype.cy = 350;

Enemy.prototype.update = function(du) {
     // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    //remember previous position
    //var oldCx = this.cx;
    //var oldCy = this.cy;

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
    
    //if colliding with the wall, turn around
    if (this.isColliding()) {
        if (this.isColliding() instanceof Wall) {
            this.moveEnemy = !(this.moveEnemy);
        }
    }


    spatialManager.register(this);
}

var NOMINAL_WALKSPEED = 4;
Enemy.prototype.moveEnemy = true;
Enemy.prototype.computePosition = function () {
    //Enemy moves by default
    //var moveEnemy = true;
    if(this.moveEnemy){
        this.cx += NOMINAL_WALKSPEED;
    }
    else{
        this.cx -= NOMINAL_WALKSPEED;
    }
    //if the enemy has reached a certain point, change the value of moveEnemy to false and move left
    if(this.cx > 640){
        this.moveEnemy = false;
    }
    //if the enemy has reached a certain point, change the value of MoveEnemy to true again and move right
    else if(this.cx < 40){
        this.moveEnemy = true;
    }
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
