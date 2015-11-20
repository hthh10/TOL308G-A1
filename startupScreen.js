// ==============
// STARTUP SCREEN
// ==============
// Bomberman (nes) sprites ripped by Black Squirrel
var g_showInfo = false;
var TOGGLE_OPTIONS = 'V'.charCodeAt(0);
var startupScreen = {


render : function(ctx) {
	if(eatKey(TOGGLE_OPTIONS)) g_showInfo = !g_showInfo;
	var oldFillStyle = ctx.fillStyle;
	var oldFont = ctx.font;

	ctx.save();
    if (!g_gameStarted) {
    	ctx.fillStyle = "black";
    	ctx.fillRect(0,0,640,640);
    	ctx.drawImage(g_images.Brickdeath,0,257,400,143,80,40,800,286);
		ctx.font="20px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		//ctx.fillText("WELCOME TO BOMBERMAN", g_canvas.width/2,g_canvas.height/2 - 125);
        ctx.fillText("Press 'space' to start story mode", g_canvas.width/2,g_canvas.height-280);
		ctx.fillText("Press 'M' to start versus mode", g_canvas.width/2,g_canvas.height-230);
		ctx.fillText("Press 'V' for INFO", g_canvas.width/2,g_canvas.height-180);
    }
    if(g_showInfo) {
    	
    	// linebreak = 20;
    	ctx.fillStyle = "black";
    	ctx.fillRect(0,0,g_canvas.width,g_canvas.height);
    	ctx.fillStyle = "orange";
		ctx.textAlign = "center";
		ctx.font="24px Arial";
		ctx.fillText("Controls", g_canvas.width/2,100);
		//ctx.textAlign = "right";
		ctx.font="16px Arial";
		ctx.fillText("Player 1 controls", g_canvas.width/2,140);
		ctx.fillText("WASD - Move player 1 ", g_canvas.width/2,160);
		ctx.fillText("E - Player 1 drop bomb ", g_canvas.width/2,180);
		ctx.fillText("Q - Player 1 detonate bomb (if active) ", g_canvas.width/2,200);
		ctx.fillText("Player 2 controls", g_canvas.width/2,240);
		ctx.fillText("IJKL - Move player 1 ", g_canvas.width/2,260);
		ctx.fillText("O - Player 2 drop bomb ", g_canvas.width/2,280);
		ctx.fillText("U - Player 2 detonate bomb (if active) ", g_canvas.width/2,300);

    }
	ctx.restore();
	ctx.fillStyle = oldFillStyle;
},
}