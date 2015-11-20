// =========
// BOMBERMAN
// =========
/*
TEXT HERE
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {

    processDiagnostics();


if (g_gameStarted) {
    entityManager.update(du);
    titlescreen.pause();
}

// Prevent perpetual firing!
eatKey(Bomberman.prototype.KEY_FIRE);

}

// GAME-SPECIFIC DIAGNOSTICS
var g_renderSpatialDebug = false;
var g_multiplayerMode = false;
var g_player2 = false;
var g_gameStarted = false;
var g_level = 1;
var g_gameOver = false;

var KEY_SPATIAL = keyCode('X');

var KEY_STORYMODE  = keyCode(' ');
var KEY_MULTIPLAYER  = keyCode('M');
var KEY_PLAYER2  = keyCode('0');
var KEY_RESET = keyCode('R');

var KEY_LEVEL1 = keyCode('1');
var KEY_LEVEL2 = keyCode('2');
var KEY_LEVEL3 = keyCode('3');
var KEY_LEVEL4 = keyCode('4');

function resetControlVars() {
	g_multiplayerMode = false;
	g_player2 = false;
	g_level = 1;
	g_gameOver = false;
}

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
	if (eatKey(KEY_PLAYER2) && !g_player2 && !g_gameOver) {
		g_player2 = true;
		entityManager.addPlayer2();
	}
	if (eatKey(KEY_STORYMODE) && (!g_gameStarted || g_gameOver)) {
		resetControlVars();
		g_gameStarted = true;
		startStorymode();
	}
	else if (eatKey(KEY_MULTIPLAYER) && (!g_gameStarted || g_gameOver)) {
		resetControlVars();
		g_gameStarted = true;
		g_player2 = true;
		g_multiplayerMode = true;
		startMultiplayer();
	}
    //Cheat code to skip to each level
    if(eatKey(KEY_LEVEL1)){
        entityManager.resetBombermen();
        entityManager.clearLevelEntities();
        g_level = 1;
        entityManager.initLevel();
    }
    if(eatKey(KEY_LEVEL2)){
        g_level = 2;
        entityManager.initLevel();
    }
    if(eatKey(KEY_LEVEL3)){
        g_level = 3;
        entityManager.initLevel();
    }
    if(eatKey(KEY_LEVEL4)){
        g_level = 4;
        entityManager.initLevel();
    }
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
	wall.render(ctx);

    if(g_gameStarted){
        backgroundMusic.play();
    }

    if(g_isUpdatePaused){
        backgroundMusic.pause();
    }

	if (!g_gameStarted) {
		startupScreen.render(ctx);
	}
	else {
		renderScore(ctx);
	}

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}

// ==========================
// LEVEL/GAME MODE MANAGEMENT
// ==========================

function resetManagers() {
	entityManager.reset();
	spatialManager.reset();
}

function startStorymode() {
	resetManagers();
	resetScore();
	entityManager.initStorymode();
}

function startMultiplayer() {
	resetManagers();
	resetScore();
	entityManager.initMultiplayer();
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        wall : "Sprites/wall.png",
        brick : "Sprites/brick.png",
        ballom : "Sprites/ballomSpritesheet.png",
        onil : "Sprites/onilSpritesheet.png",
        pakupaku : "Sprites/pakupakuSpritesheet.png",
        Bomb : "Sprites/Evildeathsheet.gif",
	      bomberman : "Sprites/bombermanSpritesheet.png",
        explosion : "Sprites/Explosion.gif",
        door: "Sprites/Door.gif",
        bagspace:"Sprites/bagspace.gif",
        trigger:"Sprites/trigger.gif",
        strength:"Sprites/Strength.gif",
        speed: "Sprites/Speed.gif",
        evilbomberman: "Sprites/EvilbombermanSpritesheet.gif",
        Brickdeath: "Sprites/Spritesheet.png",
        deadBomberman: "Sprites/Deathsheet.gif",
        deadBallom: "Sprites/Deathsheet.gif",
        deadOnil: "Sprites/Evildeathsheet.gif",
        deadPakupaku: "Sprites/Evildeathsheet.gif",
        deadEvilBomberman: "Sprites/Evildeathsheet.gif",
        player2: "Sprites/p2.png"

    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};


function preloadDone() {
    g_sprites.brick = new Sprite(g_images.brick);
    g_sprites.wall = new Sprite(g_images.wall);
	g_sprites.bomberman = new Sprite(g_images.bomberman);
    g_sprites.ballom = new Sprite(g_images.ballom);
    g_sprites.onil = new Sprite(g_images.onil);
    g_sprites.pakupaku = new Sprite(g_images.pakupaku);
    g_sprites.bomb = new Sprite(g_images.Bomb);
    g_sprites.Explosion = new Sprite(g_images.explosion);
	g_sprites.powerups = [new Sprite(g_images.bagspace),
						  new Sprite(g_images.trigger),
                          new Sprite(g_images.strength),
                          new Sprite(g_images.speed)];
    g_sprites.door = new Sprite(g_images.door);
    g_sprites.evilbomberman = new Sprite(g_images.evilbomberman);
    g_sprites.Brickdeath = new Sprite(g_images.Brickdeath);
    g_sprites.deadBomberman = new Sprite(g_images.deadBomberman);
    g_sprites.deadBallom = new Sprite(g_images.deadBallom);
    g_sprites.deadOnil = new Sprite(g_images.deadOnil);
    g_sprites.deadPakupaku = new Sprite(g_images.deadPakupaku);
    g_sprites.deadEvilBomberman = new Sprite(g_images.deadEvilBomberman);
    g_sprites.player2 = new Sprite(g_images.player2);

	wall.init();

    main.init();
}

// Kick it off
requestPreloads();
