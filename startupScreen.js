// ======================
// STARTUP & TITLE SCREEN
// ======================
// Bomberman (nes) sprites ripped by Black Squirrel
// Music & SFX from http://www.sounds-resource.com/ & http://downloads.khinsider.com/game-soundtracks/album/bomberman-nes-
var titlescreen = new Audio("Sounds/titlescreen.mp3");
var g_showInfo = false;
var g_levelScreen = false;
var TOGGLE_INFO = 'V'.charCodeAt(0);



var startupScreen = {


render : function(ctx) {
	titlescreen.play();

	if(eatKey(TOGGLE_INFO)) g_showInfo = !g_showInfo;


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
		ctx.fillText("Controls", g_canvas.width/2,80);
		//ctx.textAlign = "right";
		ctx.font="16px Arial";
		ctx.fillText("Player 1 controls", g_canvas.width/2,120);
		ctx.fillText("WASD - Move player 1 ", g_canvas.width/2,160);
		ctx.fillText("E - Player 1 drop bomb ", g_canvas.width/2,180);
		ctx.fillText("Q - Player 1 detonate bomb (if active) ", g_canvas.width/2,200);
		ctx.fillText("Player 2 controls", g_canvas.width/2,240);
		ctx.fillText("0 - Add player 2 to story mode", g_canvas.width/2,260);

		ctx.fillText("IJKL - Move player 2 ", g_canvas.width/2,300);
		ctx.fillText("O - Player 2 drop bomb ", g_canvas.width/2,320);
		ctx.fillText("U - Player 2 detonate bomb (if active) ", g_canvas.width/2,340);
		ctx.font="24px Arial";
		ctx.fillText("Globals / Dev. options ", g_canvas.width/2,370);
		ctx.font="16px Arial";
		ctx.fillText("1 - 4 Level select", g_canvas.width/2,420);
		ctx.fillText("P - Pause", g_canvas.width/2,440);
		ctx.fillText("B - Step (while paused)", g_canvas.width/2,460);
		ctx.fillText("T - Frame Info", g_canvas.width/2,480);
		ctx.fillText("R - Toggle Render", g_canvas.width/2,500);
		ctx.fillText("C - Toggle Clear", g_canvas.width/2,520);

		ctx.fillText("Press ' V ' to go back to the main menu", g_canvas.width/2,550);



    }

	ctx.restore();
	ctx.fillStyle = oldFillStyle;
},
}
