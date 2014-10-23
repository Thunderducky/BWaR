var melon = me;
game.HUD = game.HUD || {}
game.HUD.Container = melon.Container.extend({
	init: function(){
		var me = this;
		me._super(melon.Container, 'init');
		me.isPersistent = true;
		me.z = Infinity;
		me.name = "HUD";

		me.addChild(new game.HUD.ScoreItem(630, 440));
	}
});
game.HUD.ScoreItem = melon.Renderable.extend({
	init: function(x,y){
		var me = this;
		me._super(melon.Renderable, 'init', [x,y, 10, 10]);
		
		me.font = new melon.BitmapFont("32x32_font", 32);
		me.font.set("right");

		me.deaths = -1;
		me.floating = true;
	},

	update : function(dt){
		var me = this;
		if(me.deaths !== game.data.deaths){
			me.deaths = game.data.deaths;
			return true;
		}
		return false;
	},
	draw : function(context){
		// Draw Code Goes Here
		var me = this;
		me.font.draw( context, game.data.deaths, me.pos.x, me.pos.y);
	}
});