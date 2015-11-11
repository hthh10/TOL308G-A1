// ==============
// STARTUP SCREEN
// ==============
var startupScreen = {

render : function(ctx) {
	ctx.save();
    if (!g_gameStarted) {
		ctx.font="20px Arial";
		ctx.fillStyle = "orange";
		ctx.textAlign = "center";
		ctx.fillText("WELCOME TO BOMBERMAN", g_canvas.width/2,g_canvas.height/2 - 125);
        ctx.fillText("Press 'space' to start story mode", g_canvas.width/2,g_canvas.height/2 - 45);
		ctx.fillText("Press 'M' to start versus mode", g_canvas.width/2,g_canvas.height/2 + 35);
    }
	ctx.restore();
},
}