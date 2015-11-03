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

var baseWall = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

//function Wall(cx,cy,destroyable) {
function Wall(descr) {

	this.setup(descr);
    // this.cx = cx;
    // this.cy = cy;
    // this.destroyable = destroyable;
		// if(destroyable) this.sprite = g_sprites.brick;
    // else this.sprite = g_sprites.wall;
		if (this.destroyable) {this.sprite = g_sprites.brick; }
    else {this.sprite = g_sprites.wall;}

}

Wall.prototype = new Entity();

// Initial, inheritable, default values

Wall.prototype.update = function(du) {


    spatialManager.unregister(this);


    spatialManager.register(this);
}



Wall.prototype.render = function(ctx){

    this.sprite.drawCentredAt(ctx,this.cx,this.cy);
}
