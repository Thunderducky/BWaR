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

		me.paused = false;

		// let's try adding animations in here
		var playerRender = me.renderable;
		playerRender.addAnimation("run",[0,1,2,3,4],33)
		playerRender.addAnimation("jump",[10,11,12,13,14,15,16],33)
		playerRender.addAnimation("glide",[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],33)
	
		playerRender.setCurrentAnimation("run");
	},

	update: function(dt){

		var me = this;

		me.body.vel.x = 10;

		var playerRender = me.renderable;
		// Jump
		if(melon.input.isKeyPressed('jump')){
			if(!me.body.jumping && !me.body.falling){
				me.body.vel.y = -me.body.maxVel.y * melon.timer.tick;
				me.body.jumping = true;
				if(!playerRender.isCurrentAnimation("jump")){
				playerRender.setCurrentAnimation("jump");
			}
			}

		}

		if(melon.input.keyStatus('jump') && me.body.falling)
		{
			me.body.vel.y = maxFallSpeed;
			if(!playerRender.isCurrentAnimation("glide")){
				playerRender.setCurrentAnimation("glide");
			}
		}

		if(melon.input.isKeyPressed('pause')){
			me.paused = !me.paused;
		}

		if(!me.body.falling && !me.body.jumping){
			if(!playerRender.isCurrentAnimation("run")){
				playerRender.setCurrentAnimation("run");
			}
		}

		if(!me.paused)
		{
			me.body.update(dt);
			melon.collision.check(me, true, me.collideHandler.bind(me), true);

			// update animation
			if(me.body.vel.x != 0 || me.body.vel.y != 0){
				me._super(melon.Entity, 'update', [dt]);
				return true;
			}
			return false;
		}
		else
		{
			return false;
		}

	},

	collideHandler : function(response){
		if(response.b.name == "killplane"){
			var me = this;
			me.bounds.pos.x = 0;
			me.bounds.pos.y = 0;
			game.data.deaths += 1;
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
		game.data.deaths = 0;
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
            var lg = new levelGenerator();
			lg.generateLevel(melon.game.currentLevel);
    		game.data.deaths = 0;
    },
});

game.KillPlane = melon.Entity.extend({
	init: function(x,y, settings){
		var me = this;
		me._super(melon.Entity, 'init', [x,y,settings]);
	},
	getShape : function(){
		var me = this;
		return new me.Rect(me.x, me.y, me.width, me.height);
	},

    /** @ignore */
    onCollision : function () {
        // Reset to initial start

    },
});

