// They really shouldn't use ME as their namespace, but what are you going to do?
var melon = me;

var game = {
	data : {
		// DATA THAT PERSISTS
	},
	onload : function(){
		// Initialize
		if(!melon.video.init("screen", melon.video.CANVAS, 480, 320, true, 'auto')){
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
		// melon.loader.preload(game.resources);
		melon.state.change(melon.state.LOADING);
	},
	loaded: function(){
		// me.state.set(me.state.MENU, new game.TitleScreen());
		// me.state.set(me.state.PLAY, new game.PlayScreen());

		// // Start the game.
		// me.state.change(me.state.PLAY);
	}
};