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

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


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
    
    entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS
var g_renderSpatialDebug = false;
var g_multiplayer = false;

var KEY_SPATIAL = keyCode('X');

var KEY_PLAYER2  = keyCode('O');
var KEY_RESET = keyCode('R');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
	if (eatKey(KEY_PLAYER2) && !g_multiplayer) {
		g_multiplayer = true;
		entityManager.addPlayer2();
	}

    // if (eatKey(KEY_RESET)) entityManager.resetShips();
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

    entityManager.render(ctx);

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
		bomberman : "https://notendur.hi.is/~pk/308G/images/ship_2.png",
        enemy1 : "https://notendur.hi.is/~pk/308G/images/ship.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};


function preloadDone() {
	g_sprites.bomberman = new Sprite(g_images.bomberman);
    g_sprites.enemy1 = new Sprite(g_images.enemy1);
	
	entityManager.init();

    main.init();
}

// Kick it off
requestPreloads();