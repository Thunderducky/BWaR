var melon = me;

game.PlayScreen = melon.ScreenObject.extend({
	onResetEvent: function(){
		melon.levelDirector.loadLevel("area02");

		// Generate MORE Geometry

		// look for the Geometry layer and the collision layer, and randomly add something
		var layers = melon.game.currentLevel.mapLayers;
		
		// find my layers
		var geometry = null;
		var collision = null;

		for(var i = 0; i < layers.length; i++)
		{
			if(layers[i].name == "Geometry")
			{
				geometry = layers[i];
			}
			else if (layers[i].name == "collision")
			{
				collision = layers[i];
			}
		}

		var lowHeight = 8;
		var gType = geometry.tileset.firstgid + 3;
		var cType = collision.tileset.firstgid;
		console.log(gType);
		console.log(cType);
		var tilesWide = geometry.cols;
		var randomX = Math.floor((Math.random() * tilesWide));
		var randomY = 9;

		geometry.setTile(randomX, randomY, gType);
		collision.setTile(randomX, randomY, cType);

		// RESET OPTIONS
		// ADD HUD TO GAME WORLD

	},
	onDestroyEvent: function(){
		// REMOVE HUD FROM THE GAME WORLD
	}
});