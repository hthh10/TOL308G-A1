// ============
// SCORE STUFF
// ============
// Score

var g_score = {
    P1_score: 0,
	P2_score: 0,
    P1_lives: 3,
	P2_lives: 0,
    P1_maxBombs:1,
	P2_maxBombs:1,
	win: false
};

function resetScore() {
	g_score.P1_score = 0;
	g_score.P2_score = 0;
	g_score.P1_lives = 3;
	g_score.P2_lives = 0;
	g_score.P1_maxBombs = 1;
	g_score.P2_maxBombs = 1;
	g_score.win = false;
}

function renderScore (ctx) {
	renderP1Score(ctx);
	renderP2Score(ctx);

	ctx.save();
    if (!g_gameStarted && g_score.P1_lives > 0) {
		ctx.font="20px Arial";
		ctx.fillStyle = "orange";
		ctx.textAlign = "center";
        ctx.fillText("Press space to start!", g_canvas.width/2,g_canvas.height/16);
    }
	if (g_score.win) {
		renderWin(ctx);
	}
	else if (g_gameOver) {
		renderLose(ctx);
	}
	ctx.restore();
}

function renderWin (ctx) {
	ctx.save();
	ctx.font="60px Arial";
	ctx.textAlign = "center";
	if (!g_multiplayerMode) {
		ctx.fillText("VICTORY!", g_canvas.width/2, g_canvas.height/2 - 10);
	}
	else {
		if (g_score.P1_lives > 0) {
			ctx.fillStyle = "red";
			ctx.fillText("PLAYER 1 WINS!", g_canvas.width/2, g_canvas.height/2 - 10);
		}
		else {
			ctx.fillStyle = "blue";
			ctx.fillText("PLAYER 2 WINS!", g_canvas.width/2, g_canvas.height/2 - 10);
		}
	}
	ctx.font="20px Arial";
    ctx.fillText("Press 'space' to start story mode", g_canvas.width/2,g_canvas.height/2 + 35);
	ctx.fillText("Press 'M' to start versus mode", g_canvas.width/2,g_canvas.height/2 + 75);
	ctx.restore();
}

function renderLose (ctx) {
	ctx.save();
	ctx.font="60px Arial";
	ctx.textAlign = "center";
	if (!g_multiplayerMode) {
		ctx.fillText("GAME OVER", g_canvas.width/2, g_canvas.height/2 - 10);
	}
	else {
		ctx.fillText("NO WINNER", g_canvas.width/2, g_canvas.height/2 - 10);
	}
	ctx.font="20px Arial";
    ctx.fillText("Press 'space' to start story mode", g_canvas.width/2,g_canvas.height/2 + 35);
	ctx.fillText("Press 'M' to start versus mode", g_canvas.width/2,g_canvas.height/2 + 75);
	ctx.restore();
}


function renderP1Score (ctx) {
  var hp = new Image();
  hp.src = 'Sprites/bomberman.gif';
  ctx.drawImage(hp,10,12);
	ctx.save();
	ctx.font="20px Arial";
  ctx.fillStyle = "red";
	ctx.textAlign = "left";
  ctx.fillText(' x ' + g_score.P1_lives, 40, 30);
	ctx.fillText("Score:" + g_score.P1_score, 150, 30);
	ctx.fillText("Level: " + g_level, 280,30);
	ctx.restore();
}

function renderP2Score (ctx) {
  var hp = new Image();
  hp.src = 'Sprites/p2hp.gif';
	ctx.save();
	ctx.font="20px Arial";
    ctx.fillStyle = "blue";
	ctx.textAlign = "right";
	if (!g_player2) ctx.fillText("Press 'O' to start", g_canvas.width-5, 30);
    else {
    ctx.drawImage(hp,g_canvas.width-67,12);
		ctx.fillText(" x " + g_score.P2_lives, g_canvas.width-5, 30);
		ctx.fillText("Score:" + g_score.P2_score, g_canvas.width-150, 30);
	}
	ctx.restore();
}
