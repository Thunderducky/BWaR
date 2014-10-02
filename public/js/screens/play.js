var melon = me;

game.PlayScreen = melon.ScreenObject.extend({
	onResetEvent: function(){
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

	},
	onDestroyEvent: function(){
		// REMOVE HUD FROM THE GAME WORLD
	}
});