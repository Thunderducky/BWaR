var melon = me;

var maxFallSpeed = 0.1;

game.PlayerEntity = melon.Entity.extend({
	init: function(x,y, settings){
		var me = this;
		me._super(melon.Entity, 'init', [x,y,settings]);
		me.body.setVelocity(5,15);

		// Camera follows player 
		melon.game.viewport.follow(me.pos, melon.game.viewport.AXIS.BOTH);
	
		me.alwaysUpdate = true;
		console.log(me.body.collisionType);
	},

	update: function(dt){

		var me = this;

		// Left / Right 
		if(melon.input.isKeyPressed('left')){
			me.flipX(true);
			me.body.vel.x -= me.body.accel.x * melon.timer.tick;
		}
		else if(melon.input.isKeyPressed('right')){
			me.flipX(false);
			me.body.vel.x += me.body.accel.x * melon.timer.tick;
		}
		else {
			me.alpha = 1;
			me.body.vel.x = 0;
		}

		// Jump
		if(melon.input.isKeyPressed('jump')){
			if(!me.body.jumping && !me.body.falling){
				me.body.vel.y = -me.body.maxVel.y * melon.timer.tick;
				me.body.jumping = true;
			}
		}
		if(melon.input.keyStatus('jump') && me.body.falling)
		{
			me.body.vel.y = maxFallSpeed;
		}
		me.body.update(dt);

		melon.collision.check(me, true, me.collideHandler.bind(me), true);

		// update animation
		if(me.body.vel.x != 0 || me.body.vel.y != 0){
			me._super(melon.Entity, 'update', [dt]);
			return true;
		}



		return false;
	},

	collideHandler : function(response){
		console.log(response.b);
		var me = this;
		if(response.b.name == "levelgate")
		{
			// Remove myself
			//melon.game.world.removeChild(me);

			//melon.levelDirector.loadLevel("area03");



			// var lg = new levelGenerator();
			// lg.generateLevel(melon.game.currentLevel);
		}
	}
}); 

game.LevelGate = melon.LevelEntity.extend({
	init: function(x,y, settings){
		var me = this;
		me._super(melon.LevelEntity, 'init', [x,y,settings]);
	},
	getShape : function(){
		var me = this;
		return new me.Rect(me.x, me.y, me.width, me.height);
	},
	goTo : function (level) {
		var me = this;
        me.gotolevel = level || me.nextlevel;
        // load a level
        //console.log("going to : ", to);
        if (me.fade && me.duration) {
            if (!me.fading) {
                me.fading = true;
                melon.game.viewport.fadeIn(me.fade, me.duration, me.onFadeComplete.bind(me));
            }
        } else {
            melon.levelDirector.loadLevel(me.gotolevel);
            console.log("HIT");
            var lg = new levelGenerator();
			lg.generateLevel(melon.game.currentLevel);
        }
    },

    /** @ignore */
    onCollision : function () {
        this.goTo();
    },

    onFadeComplete : function () {
    		var me = this;
            melon.levelDirector.loadLevel(me.gotolevel);
            melon.game.viewport.fadeOut(me.fade, me.duration);
            console.log("HIT");
            var lg = new levelGenerator();
			lg.generateLevel(melon.game.currentLevel);
    },
});

