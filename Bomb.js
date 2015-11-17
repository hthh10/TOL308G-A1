// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bomb(descr) {

  // Common inherited setup logic from Entity

  this.setup(descr);
  this.sprite = g_sprites.bomb;
  this.logBomb(1);

  // Make a noise when I am created (i.e. fired)
  //this.fireSound.play();

  /*
      // Diagnostics to check inheritance stuff
      this._bulletProperty = true;
      console.dir(this);
  */

}

Bomb.prototype = new Entity();


// Initial, inheritable, default values
Bomb.prototype.rotation = 0;
Bomb.prototype.cx = 16;
Bomb.prototype.cy = 200;
Bomb.prototype.velX = 1;
Bomb.prototype.velY = 1;
Bomb.prototype.KEY_P1_TRIGGER   = '3'.charCodeAt(0);
Bomb.prototype.KEY_P2_TRIGGER   = '0'.charCodeAt(0);
Bomb.prototype.explodeSound = new Audio("Sounds/Explosion.wav");
//Bomb.prototype.explodeSound.src = "Sounds/Explosion.wav";
Bomb.prototype.width = 19;
Bomb.prototype.height = 22;

// animation stuff
Bomb.prototype.spritePosX = 179.5;
Bomb.prototype.spritePosY = 90;
Bomb.prototype.SlideWidth = 30;
Bomb.prototype.counter = 0;
Bomb.prototype.interval = 300;
Bomb.prototype.lifeSpan = 3000 / NOMINAL_UPDATE_INTERVAL;

var eatBomb = new Audio("Sounds/Eat Bomb.wav");

Bomb.prototype.update = function(du) {

  spatialManager.unregister(this);
  if (this._isDeadNow) {
    this.logBomb(-1);
    return entityManager.KILL_ME_NOW;
  }

  this.maybeDetonate();
  this.animate();
  this.lifeSpan -= du;
  if (this.lifeSpan < 40) {
    this.configureExplosion();
    this.logBomb(-1);
    return entityManager.KILL_ME_NOW;
  }

  // ef sprengjan verður fyrir sprengingu springur hún
  if (this.isColliding() && (this.isColliding() instanceof Explosion)) {
    this.configureExplosion();
  }

  if (this.isColliding() instanceof Pakupaku) {
    eatBomb.play();
    this.kill();
  }
  spatialManager.register(this);
};


Bomb.prototype.animate = function() {
  var i = this.interval;
  var hradi = 150;

  if (this.lifeSpan < (3000 - i) / NOMINAL_UPDATE_INTERVAL && this.counter < 1) {
    this.spritePosX += this.SlideWidth;
    this.counter += 1;
    this.interval += hradi;
  } else if (this.lifeSpan < (3000 - i) / NOMINAL_UPDATE_INTERVAL && this.counter < 2) {
    this.spritePosX += this.SlideWidth;
    this.counter += 1;
    this.interval += hradi;
  } else if (this.lifeSpan < (3000 - i) / NOMINAL_UPDATE_INTERVAL && this.counter < 3) {
    this.spritePosX -= this.SlideWidth;
    this.counter += 1;
    this.interval += hradi;
  } else if (this.lifeSpan < (3000 - i) / NOMINAL_UPDATE_INTERVAL && this.counter < 4) {
    this.spritePosX -= this.SlideWidth;
    this.counter = 0;
    this.interval += hradi;
  }
};

// sendir entitymanager upplýsingar um sprengingu
Bomb.prototype.configureExplosion = function() {
	this.kill();
	entityManager.explode(this.cx,this.cy,this.xPos,this.yPos,
		this.strength, this.bombermanID,this.explodeSound);

};

Bomb.prototype.maybeDetonate = function () {
  if (this.trigger) {
    if (keys[this.KEY_P1_TRIGGER] && this.bombermanID === 1) {
      this.configureExplosion();
      this.lifeSpan -= this.lifeSpan;
    }
     if (keys[this.KEY_P2_TRIGGER] && this.bombermanID !== 1) {
       this.configureExplosion();
       this.lifeSpan -= this.lifeSpan;
     }
  }
};

Bomb.prototype.logBomb = function(x) {

  if(this.bombermanID === 1) {g_score.P1_maxBombs -= x;}
  if(this.bombermanID !== 1) {g_score.P2_maxBombs -= x;}
};

Bomb.prototype.getRadius = function() {
    return g_images.explosion.width/2;
};

Bomb.prototype.takeBombHit = function() {
  this.kill();

  // Make a noise when I am zapped by another bullet
  //this.zappedSound.play();
};

Bomb.prototype.render = function(ctx) {
  var fadeThresh = Bomb.prototype.lifeSpan / 3;

this.sprite.animate(ctx,this.cx,this.cy,this.width,this.height,this.spritePosX,this.spritePosY);
  // g_sprites.bomb.drawWrappedCentredAt(
  //   ctx, this.cx, this.cy
  // );

  ctx.globalAlpha = 1;
};
