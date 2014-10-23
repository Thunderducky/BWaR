var melon = me;
game.TitleScreen = melon.ScreenObject.extend({
	onResetEvent: function(){
		// RESET OPTIONS
		// ADD HUD TO GAME WORLD
		melon.game.world.addChild(
			new melon.Sprite(
					0,0,
					melon.loader.getImage('title_screen')
				),
				1
		);

		melon.game.world.addChild(
			new (melon.Renderable.extend({
				init: function(){
					var me = this;
					me._super(melon.Renderable, 'init', [0, 0, melon.game.viewport.width, melon.game.viewport.height]);
					me.font = new melon.BitmapFont("32x32_font", 32);
				},
				scrollover : function(){},
				update : function(dt){ return true;},
				draw : function(context){
					//this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
				},
				onDestroyEvent : function(){
				}
			}))
		, 2);

		melon.input.bindKey(melon.input.KEY.ENTER, "enter", true);
        melon.input.bindPointer(melon.input.mouse.LEFT, melon.input.KEY.ENTER);
        this.handler = melon.event.subscribe(melon.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                me.state.change(me.state.PLAY);
            }
        });

	},
	onDestroyEvent: function(){
		melon.input.unbindKey(melon.input.KEY.ENTER);
        melon.input.unbindPointer(melon.input.mouse.LEFT);
        melon.event.unsubscribe(this.handler);
	}
});