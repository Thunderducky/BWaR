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

	me.init = function(x,y,width,height, tileId){
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
				column.push(new Tile().init(i,j, tileId));
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

	me.playerStart = {x:0,y:0};

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
	};

	me.generatePlatform = function(width, height, tileId, tileId2){
		var patch = new TilePatch().init(0,0,width,height);
		for(var i = 0; i < width; i++)
		{
			for(var j = 0; j < height; j++)
			{
				patch.tiles[i][j].tileId = j == 0 ? tileId : tileId2 || tileId;
			}
		}
		return patch;
	}

	var getRandom = function(min,max){
		return Math.floor(Math.random() * (max-min) + min);
	};

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

	var randomPick = function(choices){
		return choices[getRandom(0, choices.length)];
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

	me.generateLevel2 = function(level){
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

		// Generate foreground
		var minHeight = 1, height = 6; maxHeight = 8, maxDifference = 2;

		var heightController = new randomIntervalGenerator().init(2,8,
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

	me.generateLevel = function(level){
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

		var platformIndex = 0;
		var platformLength = 0, lengthMin = 2, lengthMax = 6;
		var platformHeight = 0, heightMin = 1, heightMax = 5;
		var airLength = 0, airMin = 2, airMax = 4;
		// build platforms
		while(platformIndex < level.cols - 1){
			

			platformLength = getRandom(lengthMin, lengthMax) + 1;
			platformHeight = getRandom(heightMin, heightMax);

			if(level.cols <= platformIndex + platformLength)
			{
				platformLength = level.cols - platformIndex;
			}

			var gPlatform = me.generatePlatform(platformLength, level.rows - platformHeight - 1, forestTS.firstgid + TL.forest.ground.top, forestTS.firstgid + TL.forest.ground.mid);
			var cPlatform = me.generatePlatform(platformLength, level.rows - platformHeight - 1, metaTS.firstgid + TL.meta.solid)
			
			gPlatform.origin.x = platformIndex;
			gPlatform.origin.y = level.rows - platformHeight - 1;
			cPlatform.origin.x = platformIndex;
			cPlatform.origin.y = level.rows - platformHeight - 1;

			platformIndex += platformLength;

			applyPatch(gPlatform, me.foreground);
			applyPatch(cPlatform, me.collision);

			// build an air space

			airLength = getRandom(airMin, airMax);
			platformIndex += airLength;
			// Build a Platform
			// Build Spacing
			// Edge check
			// Add
		}

		// Build Backgrounds

		// for now we're just going to build a giant patch to slap on the back
		var lightBGID = forestTS.firstgid + TL.forest.darkBG;
		var mountainTop = forestTS.firstgid + 10;
		var mountainMid = forestTS.firstgid + 28;
		var backgroundTilePatch = new TilePatch().init(0,3, level.cols, level.rows, mountainTop);
		var backgroundTilePatch2 = new TilePatch().init(0,4, level.cols, 1, mountainMid);
		var backgroundTilePatch3 = new TilePatch().init(0,5, level.cols, level.rows - 5, lightBGID);
		applyPatch(backgroundTilePatch, me.background3);
		applyPatch(backgroundTilePatch2, me.background3);
		applyPatch(backgroundTilePatch3, me.background3);
		
		// Build Trees
		// Find the where we need to start in the foreground, then build a tree up from there


		// FRONT TREES
		var treeColumnIndex = 0;
		var treeBot = forestTS.firstgid + TL.forest.tree1.bottom;
		var treeMid = forestTS.firstgid + TL.forest.tree1.middle[0];
		var treeMid2 = forestTS.firstgid + TL.forest.tree1.middle[1];

		var tree2Bot = forestTS.firstgid + TL.forest.tree2.bottom;
		var tree2Mid = forestTS.firstgid + TL.forest.tree2.middle[0];
		var tree2Mid2 = forestTS.firstgid + TL.forest.tree2.middle[1];
		

		var knothole = forestTS.firstgid + TL.forest.tree1.knothole;

		treeColumnIndex += getRandom(0,4);
		while(treeColumnIndex < level.cols){
			// find bottom
			var heightIndex = GetTopHeightIndex(me.foreground, treeColumnIndex);
			if(heightIndex < level.rows -1){
				// We've found a platform
				var use1 = randomPick([true,false]);
				var treePatch = null;

				// Tree 1
				if(randomPick([true,false]))
				{
					var treePatch = new TilePatch().init(treeColumnIndex, 0, 1, heightIndex ,randomPick([treeMid, treeMid2]));
					treePatch.tiles[0][treePatch.tilesHigh -1].tileId = treeBot;
					
					// Put in a knothole
					if(getRandom(0,5) == 0)
					{
						var knotholeIndex = getRandom(0, treePatch.tilesHigh - 1);
						treePatch.tiles[0][knotholeIndex].tileId = knothole;
					}
				}
				// Tree2
				else
				{
					var treePatch = new TilePatch().init(treeColumnIndex, 0, 1, heightIndex ,randomPick([tree2Mid, tree2Mid2]));
					treePatch.tiles[0][treePatch.tilesHigh -1].tileId = tree2Bot;
				}
				// randomize some pieces to switch out

				


				applyPatch(treePatch, me.background1);
			}
			treeColumnIndex+= getRandom(1,12);
		}

		// background trees
		var tree2Index = 0;
		var backTreeId = forestTS.firstgid + TL.forest.backgroundTrees1[0];
		var backTreeId2 = forestTS.firstgid + TL.forest.backgroundTrees1[1];
		tree2Index += getRandom(0,4);
		while(tree2Index < level.cols){
			// find bottom
			var backTreePatch = new TilePatch().init(tree2Index, 0, 1, level.cols-1, backTreeId);
			tree2Index+= getRandom(1,6);
			applyPatch(backTreePatch, me.background2);
		}

	};

	
};