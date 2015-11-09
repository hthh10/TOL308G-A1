/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// "PRIVATE" METHODS
//
// <none yet>


// PUBLIC METHODS

getNewSpatialID : function() {
	this._nextSpatialID += 1;
	return this._nextSpatialID - 1;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();

	// TODO: YOUR STUFF HERE!
    this._entities[spatialID] = {
		entity : entity,
		posX : pos.posX,
		posY : pos.posY,
		radius : entity.getRadius()
	};

},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    // TODO: YOUR STUFF HERE!
	this._entities[spatialID] = {};
},

findEntityInRange: function(posX, posY, radius) {

    // TODO: YOUR STUFF HERE!
	for (var ID in this._entities) {
		var e = this._entities[ID];
		var distanceSq = util.distSq(posX, posY, e.posX, e.posY);
		var limitSq = util.square(radius + e.radius);
		if (distanceSq < limitSq) {
			return e.entity;
		}
	}
},

// returns true if there's a wall there
checkForWall: function(posX, posY) {	//THAT'S SOME MAGIC NUMBER RIGHT THERE
//    if(this.findEntityInRange(posX, posY, 14) instanceof Wall) {
//      return true;
//    }
//    return false;
},
render: function(ctx) {
	var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}
