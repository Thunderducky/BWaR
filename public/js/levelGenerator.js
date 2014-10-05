var melon = me;

var Tile = function(){
	var me = this;
	me.x = 0;
	me.y = 0;
	me.tileId = null;

	me.init = function(x,y,id){
		me.x = x;
		me.y = y;
		me.tileId = id;
		return me;
	}
};

var TilePatch = function(){
	var me = this;
	me.origin = {x:0,y:0};

	// Needs to be initialized to be a 2D array
	me.tiles = [];
	me.tilesHigh = 0;
	me.tilesWide = 0;

	me.init = function(x,y,width,height){
		me.origin.x = x;
		me.origin.y = y;

		me.tilesHigh = height;
		me.tilesWide = width;
		me.tiles = [];

		for(var i = 0; i < width; i++)
		{
			var column = [];

			for(var j = 0; j < height; j++)
			{
				column.push(new Tile().init(i,j));
			}
			me.tiles.push(column);
		}

		return me;
	};
};

var levelGenerator = function(){
	var me = this;
	me.level = null;
	
	me.background1 = null;
	me.background2 = null;
	me.background3 = null;

	me.foreground = null;
	me.collision = null;

	me.generatePatchColumn = function(height, segmentLengths, segmentData){
		var patch = new TilePatch().init(0,0,1,height);
		var index = 0;
		for(var i = 0; i < segmentLengths.length; i++)
		{
			for(var j = 0; j < segmentLengths[i]; j++)
			{
				patch.tiles[0][index++].tileId = segmentData[i];
			}
		}
		return patch;
	}

	me.generateLevel = function(level){
		//me.map = map;
		me.level = level;

		// Get Tilesets
		var tilesets = level.tilesets.tilesets;

		var mountainTS = null;
		var forestTS = null
		var metaTS = null;
		for(var i = 0; i < tilesets.length; i++){
			if(tilesets[i].name == "mountains"){ 			mountainTS = tilesets[i];}
			else if(tilesets[i].name == "forest"){ 			forestTS = tilesets[i];}
			else if(tilesets[i].name == "metatiles32x32"){ 	metaTS = tilesets[i];}
		}

		// Get Layers
		for(var i = 0; i < level.mapLayers.length; i++)
		{
			// Background Layers
			if(level.mapLayers[i].name == "Background1"){ 
				me.background1 = level.mapLayers[i];
			} else if (level.mapLayers[i].name == "Background2"){
				me.background2 = level.mapLayers[i];
			} else if (level.mapLayers[i].name == "Background3"){
				me.background3 = level.mapLayers[i];
			} 

			// Foreground and Collision
			else if (level.mapLayers[i].name == "Foreground"){
				me.foreground = level.mapLayers[i];
			} else if (level.mapLayers[i].name == "collision"){
				me.collision = level.mapLayers[i];
			}

		}
		var TL = tileIdLibrary;

		var getRandom = function(min,max){
			return Math.floor(Math.random() * (max-min) + min);
		}

		var randomIntervalGenerator = function(){
			var me = this;
			me.intervalLeft = 0;
			me.minInterval = 1;
			me.maxInterval = 1;

			me.tick = function(){
				me.intervalLeft--;
				if(me.intervalLeft <= 0){
					me.onReset();
					me.intervalLeft = getRandom(me.minInterval, me.maxInterval);
				}
				
			};
			me.onReset = function(){};

			me.init = function(min,max,onReset){

				me.minInterval = min;
				me.maxInterval = max;
				me.intervalLeft = getRandom(me.minInterval, me.maxInterval);
				me.onReset = onReset || me.onReset;

				return me;
			}
		};
		

		// Generate foreground
		var minHeight = 1, height = 6; maxHeight = 8, maxDifference = 2;

		var heightController = new randomIntervalGenerator().init(4,12,
			function(){
				// Generate the new height
				height = getRandom(height - maxDifference, height + maxDifference + 1);
				if(height > maxHeight) height = maxHeight;
				if(height < minHeight) height = minHeight;
			});

		for(var i = 0; i < level.cols; i++){

			// Let's build some VARIANCE
			heightController.tick();

			// This is where the height gets translated
			var spacing = [level.rows - height,1,height-1];
			var gData = [null, forestTS.firstgid + TL.forest.ground.top, forestTS.firstgid + TL.forest.ground.mid]
			var cData = [null, metaTS.firstgid + TL.meta.solid, metaTS.firstgid + TL.meta.solid]
			var graphicColumn = me.generatePatchColumn(level.rows, spacing, gData);
			var collisionColumn = me.generatePatchColumn(level.rows, spacing, cData);
			
			graphicColumn.origin.x = i;
			graphicColumn.origin.y = 0;
			collisionColumn.origin.x = i;
			collisionColumn.origin.y = 0;

			applyPatch(graphicColumn, me.foreground);
			applyPatch(collisionColumn, me.collision);
		}

		// Build Level gate for the very right
		//var levelGate = new game.LevelGate(4,0, {width: 32, height: level.rows*32});
		//levelGate.addShape((level.cols-1)*32,0,32,level.rows*32);
		//melon.game.world.addChild(levelGate);
		// for now we're going to build column patches and apply them

	};

	var GetTopHeightIndex = function(layer, column){
		for(var i = 0; i < layer.rows; i++)
		{
			if(layer.getTile(column*32 + 1, i * 32 + 1) !== null)
			{
				return i;
			}
		}
		return layer.rows - 1;
	};

	var applyPatch = function(patch, layer){
		for(var i = 0; i < patch.tilesWide; i++)
		{
			for(var j = 0; j < patch.tilesHigh; j++)
			{
				var patchTile = patch.tiles[i][j];
				// If it's not null, because 0 might be a valid item
				if(patchTile.tileId !== null){
					layer.setTile(patchTile.x + patch.origin.x, patchTile.y + patch.origin.y, patchTile.tileId);
				}
			}
		}
	};
};