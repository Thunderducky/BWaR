var melon = me;

game.PlayScreen = melon.ScreenObject.extend({
	onResetEvent: function(){
		var loadLevel2 = function(){
			melon.levelDirector.loadLevel("area02");

			// Generate MORE Geometry

			// look for the Geometry layer and the collision layer, and randomly add something
			var level = melon.game.currentLevel;
			
			// find my layers
			var geometry = level.getLayerByName("Geometry");
			var collision = level.getLayerByName("collision");

			var lowHeight = 8;
			var gType = geometry.tileset.firstgid + 3;
			var cType = collision.tileset.firstgid;
			console.log(gType);
			console.log(cType);
			var tilesWide = geometry.cols;
			var randomX = Math.floor((Math.random() * tilesWide));
			var randomY = 9;

			// we'll need thinkgs like width in tiles and heights
			var BuildTrees = function(){};
			var BuildMountains = function(){};
			var BuildPlatforms = function(){};

			geometry.setTile(randomX, randomY, gType);
			collision.setTile(randomX, randomY, cType);

			// RESET OPTIONS
			// ADD HUD TO GAME WORLD
		};

		var loadLevel3 = function(){
			var me = this;
			melon.levelDirector.loadLevel("area03");

			var lg = new levelGenerator();
			lg.generateLevel(melon.game.currentLevel);

			game.data.screens = 0;
			game.data.deaths = 0;

			me.HUD = new game.HUD.Container();
			melon.game.world.addChild(me.HUD);

		};

		loadLevel3();

	},
	onDestroyEvent: function(){
		// REMOVE HUD FROM THE GAME WORLD
		melon.game.world.removeChild(this.HUD);
	}
});