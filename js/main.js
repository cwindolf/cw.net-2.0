// init physicsjs
		var world = Physics();
		world.add(Physics.renderer('paper'));
		Physics.util.ticker.on(function( time ){
			world.step( time );
		});
		world.on('step', function() {
			world.render()
		});
		// collisions
		var viewportBounds = Physics.aabb(view.bounds.x,view.bounds.y,
			view.bounds.width,view.bounds.height);
		world.add(Physics.behavior('edge-collision-detection', {
			aabb: viewportBounds,
			restitution: 0.99,
			cof: 0.99
		}));
		world.add( Physics.behavior('body-impulse-response') );

		var gravity = Physics.behavior('constant-acceleration', {
   			acc: { x : 0, y: 1 } // this is the default
		});		
		world.add( gravity );

		// init model
		var b = new Bacterium(100, 100);

		// go!
		Physics.util.ticker.start();