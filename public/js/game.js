// They really shouldn't use ME as their namespace, but what are you going to do?
var melon = me;

var game = {
	data : {
		// DATA THAT PERSISTS
	},
	onload : function(){
		// Initialize
		if(!melon.video.init("screen", melon.video.CANVAS, 640, 480, true, 'auto')){
			alert("Your browser does not support HTML5 canvas");
		}

		// Add Debug Panel if necessary
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				melon.plugin.register.defer(this, debugPanel, "debug");
			});
		}

		melon.audio.init("mp3,ogg");
		melon.loader.onload = this.loaded.bind(this);

		// Need to add that file later
		melon.loader.preload(game.resources);
		melon.state.change(melon.state.LOADING);
	},
	loaded: function(){
		//melon.state.set(me.state.MENU, new game.TitleScreen());
		melon.state.set(me.state.PLAY, new game.PlayScreen());

		melon.pool.register("mainPlayer", game.PlayerEntity);
		melon.pool.register("levelGate", game.LevelGate);
		melon.pool.register("killPlane", game.KillPlane);
		//melon.pool.register("levelGate", game.LevelGate)

		melon.input.bindKey(me.input.KEY.LEFT,  "left");
    	melon.input.bindKey(me.input.KEY.A,  	"left");
    	melon.input.bindKey(me.input.KEY.RIGHT, "right");
    	melon.input.bindKey(me.input.KEY.D,  	"right");

    	melon.input.bindKey(me.input.KEY.ESC, "pause", true);

    	melon.input.bindKey(me.input.KEY.SPACE,     "jump", true);

		// Start the game.
		melon.state.change(me.state.PLAY);
	}
};