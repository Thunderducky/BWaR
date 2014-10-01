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

		// update animation
		if(me.body.vel.x != 0 || me.body.vel.y != 0){
			me._super(melon.Entity, 'update', [dt]);
			return true;
		}

		return false;
	}
}); 