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
Enemy.prototype.cx = 50;
Enemy.prototype.cy = 350;

Enemy.prototype.update = function(du) {
     // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;

    this.computePosition();

    spatialManager.register(this);
}

var NOMINAL_WALKSPEED = 4;

Enemy.prototype.computePosition = function () {
    //Enemy moves by default
    var moveEnemy = true;
    if(this.moveEnemy){
        this.cx += NOMINAL_WALKSPEED;
    }
    else{
        this.cx -= NOMINAL_WALKSPEED;
    }
    //if the enemy has reached a certain point, change the value of moveEnemy to false and move left
    if(this.cx > 250){
        this.moveEnemy = false;
    }
    //if the enemy has reached a certain point, change the value of MoveEnemy to true again and move right
    else if(this.cx < 50){
        this.moveEnemy = true;
    }
};

Enemy.prototype.render = function(ctx){
    var origScale = this.sprite.scale;
    //pass my scale into the sprite, for drawing
    this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy);
    this.sprite.scale = origScale;
}