var melon = me;

game.PlayScreen = melon.ScreenObject.extend({
	onResetEvent: function(){
		melon.levelDirector.loadLevel("area02");
		// RESET OPTIONS
		// ADD HUD TO GAME WORLD

	},
	onDestroyEvent: function(){
		// REMOVE HUD FROM THE GAME WORLD
	}
});