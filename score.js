// ============
// SCORE STUFF
// ============
// Score

var g_score = {
    P1_score: 0,
	P2_score: 0,
    P1_lives: 3,
	P2_lives: undefined,
    P1_maxBombs:2,
  P2_maxBombs:1
};

function renderScore (ctx) {
	renderP1Score(ctx);
	renderP2Score(ctx);
	renderEdges(ctx);

	ctx.save();
    if (!g_gameStarted && g_score.P1_lives > 0) {
		ctx.font="20px Arial";
		ctx.fillStyle = "orange";
		ctx.textAlign = "center"
        ctx.fillText("Press space to start!", g_canvas.width/2,g_canvas.height/16);
    }
	/* Game over condition - To be implemented
    if (g_score.P1_lives <= 0 &&
	    (g_score.P2_lives <= 0 || g_score.P2_lives === 'undefined')) {
        ctx.font="40px Arial";
        ctx.fillText("Game Over",  g_canvas.width/2,250);
        ctx.font="25px Arial";
        ctx.fillText("Press 'N' to start a new game.",  g_canvas.width/2,300);
        g_gameOver = true;
    }
	*/
	ctx.restore();
}
function renderEdges (ctx) {
	// Start a little off screen to make playable are larger
	var height = g_images.wall.height, width = g_images.wall.width;

	var baseCx = -0.5*width, baseCy = 1.25*height;
	var stepCx = baseCx, stepCy = baseCy
	// Top left to bottom left
	for(var i = 0; i < Math.floor((g_canvas.height-baseCy)/height); i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCy += g_images.wall.height;
	}
	// bottom left to bottom right
	for(var i = 0; i < g_canvas.width/g_images.wall.width; i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCx += g_images.wall.width;
	}

	// bottom right to top right
	for(var i = 0; i < Math.floor((g_canvas.height-baseCy)/height); i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCy -= g_images.wall.height;
	}
	//top right to top left
	for(var i = 0; i < g_canvas.width/g_images.wall.width; i++) {
		ctx.drawImage(g_images.wall,stepCx,stepCy);
		stepCx -= g_images.wall.width;
	}

}

function renderP1Score (ctx) {
	ctx.save();
	ctx.font="20px Arial";
    ctx.fillStyle = "red";
	ctx.textAlign = "left"
    ctx.fillText("Lives:" + g_score.P1_lives, 5, 30);
	ctx.fillText("Score:" + g_score.P1_score, 150, 30);
	ctx.restore();
}

function renderP2Score (ctx) {
	ctx.save();
	ctx.font="20px Arial";
    ctx.fillStyle = "blue";
	ctx.textAlign = "right"
	if (!g_multiplayer) ctx.fillText("Press 'O' to start", g_canvas.width-5, 30);
    else {
		ctx.fillText("Lives:" + g_score.P1_lives, g_canvas.width-5, 30);
		ctx.fillText("Score:" + g_score.P1_score, g_canvas.width-150, 30);
	}
	ctx.restore();
}
