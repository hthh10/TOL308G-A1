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
function Onil(descr) {

    //Common inherited setup logic from Entity
    this.setup(descr);

    this.sprite = this.sprite || g_sprites.onilLeft || g_sprites.onilRight;
    this._scale = 1;
}

Onil.prototype = new Entity();

// Initial, inheritable, default values
Onil.prototype.cx = 40;
Onil.prototype.cy = 350;
Onil.prototype.sprite = this.sprite;
Onil.prototype.immunity = 3000 / NOMINAL_UPDATE_INTERVAL;
//spawn immunity

Onil.prototype.update = function(du) {
    this.immunity -= du;
     // Unregister and check for death
    spatialManager.unregister(this);
    if (this._isDeadNow) return entityManager.KILL_ME_NOW;
    //remember previous position
    this.computePosition();

    // if colliding with a bomb, go away
    if (this.isColliding() instanceof Bomb){
        this.isCollidingWithBomb(this.isColliding());
        //Er mögulega frekar bjagaður kóði en hann virkar ágætlega... 
        if(this.direction === 1){
            if(Math.random() < 0.5) this.direction = 2;
            else this.direction = 3;
        }
        if(this.direction === 2){
            if(Math.random() < 0.5) this.direction = 3;
            else this.direction = 4;
        }
        if(this.direction === 3){
            if(Math.random() < 0.5) this.direction = 4;
            else this.direction = 1;
        }
        if(this.direction === 4){
            if(Math.random() < 0.5) this.direction = 1;
            else this.direction = 2;
        }
        /*
        if(Math.random() < 0.5) this.direction = 2;
        else this.direction = 4;
        if(Math.random() < 0.5) this.direction = 1;
        else this.direction = 3;
*/
    }
    // if standing in fire, die!
    if ((this.isColliding() instanceof Explosion) && this.immunity < 20){
        //award points?
        return entityManager.KILL_ME_NOW;
    }

    spatialManager.register(this);
}

Onil.prototype.speed = 3;
Onil.prototype.moveEnemy = true;
Onil.prototype.direction = 2; // 1 = Right, 2 = down, 3 = left, 4 = up
Onil.prototype.computePosition = function () {
    //Enemy moves by default
    var wallId,
        leftX = this.cx - this.getRadius(),
        rightX = this.cx + this.getRadius(),
        topY = this.cy - this.getRadius(),
        bottomY = this.cy + this.getRadius();

        var upId, downId, leftId, rightId;

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
        else if(topY <= g_playzone[1][0]) {
            this.cy += this.speed;
            if(Math.random() < 0.5) this.direction = 1;
            else this.direction = 3;
        }



        else {
            // Going right
            if (this.direction === 1) {

                wallId = this.getWallId(rightX,this.cy);
                //make ballom look right
                this.sprite = g_sprites.onilRight;
                // going forward logic. Check if the next block is a wall
                if (!this.checkForWall(wallId[0],wallId[1])) this.cx += this.speed;
                else{ // if there is a wall
                    if(Math.random() < 0.5) this.direction = 2; // 50% chance of going up
                    else this.direction = 4; // otherwise he goes up.
                }
            }
        }
            // going down.
            if(this.direction === 2) {
                wallId = this.getWallId(this.cx,bottomY);

                if (!this.checkForWall(wallId[0],wallId[1])) this.cy += this.speed;
                else{
                    if(Math.random() < 0.5) this.direction = 1;  // 50% chance of enemy going right
                    else this.direction = 3; // otherwise he goes left.
                }
            }


         // going left
            if(this.direction === 3) {
                wallId = this.getWallId(leftX,this.cy);
                //make ballom look left
                this.sprite = g_sprites.onilLeft;
                if (!this.checkForWall(wallId[0],wallId[1])) this.cx -= this.speed;
                else{
                    if(Math.random() < 0.5) this.direction = 4; // 50% chance of enemy going down
                    else this.direction = 2; // otherwise he goes up.
                    }
            }
                // Going up
            if(this.direction === 4) {
                wallId = this.getWallId(this.cx,topY);

                if (!this.checkForWall(wallId[0],wallId[1])) {
                    this.cy -= this.speed;
                }
                if(this.checkForWall(wallId[0],wallId[1])) {
                    if(Math.random() < 0.5) this.direction = 3; // 50% chance of enemy going left
                    else this.direction = 1; // otherwise he goes right.
                }
            }
        };

Onil.prototype.getRadius = function() {
    return (this.sprite.width / 2) * 0.7;
};
// athugar collision við sprengju og breytir hraðanum eftir því
Onil.prototype.isCollidingWithBomb = function (bomba) {
  if (this.cy > bomba.cy)   this.moveEnemy = true;
  if (this.cy < bomba.cy)   this.moveEnemy = false;
  if (this.cx > bomba.cx)   this.moveEnemy = true;
  if (this.cx < bomba.cx)   this.moveEnemy = false;
},

Onil.prototype.render = function(ctx){
    //var origScale = this.sprite.scale;
    //pass my scale into the sprite, for drawing
    //this.sprite.scale = this.scale;
    this.sprite.drawCentredAt(ctx, this.cx, this.cy);
    //this.sprite.scale = origScale;
}
