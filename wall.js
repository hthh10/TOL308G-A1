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

// 1 = wall
// 0 = possible brick
// 2 = blocked for player

// UGLY var for level layout...0,
var baseWall = [[2,2,0,0,0,0,0,0,0,0,0,0,0,2,2],
                [2,1,0,1,0,1,0,1,0,1,0,1,0,1,2],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                ];

function Wall(descr) {

	this.setup(descr);
	if (this.destroyable) this.sprite = g_sprites.brick;
    else this.sprite = g_sprites.wall;

}

Wall.prototype = new Entity();

// Initial, inheritable, default values

Wall.prototype.isBrick = function() {
    return this.destroyable;
}

Wall.prototype.getRadius = function () {
    return (this.sprite.width / 2) * 0.9;
};

Wall.prototype.update = function(du) {


    spatialManager.unregister(this);

    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    
    if (this.isColliding() instanceof Explosion && this.isBrick()) {
        this._isDeadNow = true; 
        }

    spatialManager.register(this);
}



Wall.prototype.render = function(ctx){

    this.sprite.drawCentredAt(ctx,this.cx,this.cy);
}
