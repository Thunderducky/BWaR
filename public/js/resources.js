game.resources = [

	/* Graphics. 
	 * @example
	 * {name: "example", type:"image", src: "data/img/example.png"},
	 */

	 // Tileset
	 { name: "area01_level_tiles", type:"image", src:"game_assets/img/map/area01_level_tiles.png"},
	 { name: "forest", type:"image", src:"game_assets/img/map/forest.png"},
	 { name: "mountains", type:"image", src:"game_assets/img/map/mountains.png"},
	 { name: "metatiles32x32", type:"image", src:"game_assets/img/map/metatiles32x32.png"},
	 
	 // Parallax Background
	 { name: "area01_bkg0", type:"image", src: "game_assets/img/area01_bkg0.png"},
	 { name: "area01_bkg1", type:"image", src: "game_assets/img/area01_bkg1.png"},

	 // Player Sprite Sheet
	 { name: "test_run", type:"image", src:"game_assets/img/sprite/test_run.png" },
	 { name: "gripe_run_right", type:"image", src:"game_assets/img/sprite/gripe_run_right.png" },
	 { name: "player_animations", type:"image", src:"game_assets/img/sprite/runner.png"},

	 // Coins 
	 { name: "spinning_coin_gold", type: "image", src: "game_assets/img/sprite/spinning_coin_gold.png"},

	 // Enemy Entity
	 { name: "wheelie_right", type: "image", src: "game_assets/img/sprite/wheelie_right.png"},


	 // Maps
	 { name: "area01", type:"tmx", src: "game_assets/map/area01.tmx"},
	 { name: "area02", type:"tmx", src: "game_assets/map/area02.tmx"},
	 { name: "area03", type:"tmx", src: "game_assets/map/area03.tmx"},

	 // Mountains
	 {name: "32x32_font", type:"image", src: "game_assets/img/font/32x32_font.png"},

	 // Title Screen
	 { name: "title_screen", type:"image", src: "game_assets/img/title.png"},

	/* Atlases 
	 * @example
	 * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
	 */
		
	/* Maps. 
	 * @example
	 * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
	 * {name: "example01", type: "tmx", src: "data/map/example01.json"},
 	 */

	/* Background music. 
	 * @example
	 * {name: "example_bgm", type: "audio", src: "data/bgm/"},
	 */	

	/* Sound effects. 
	 * @example
	 * {name: "example_sfx", type: "audio", src: "data/sfx/"}
	 */
];
