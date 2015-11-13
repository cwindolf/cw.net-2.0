// init physicsjs
var world = Physics({
	timestep: 6,
	maxIPF: 4,
	sleepDisabled: true
});
var renderer = Physics.renderer('paper', {
	meta:false
});
world.add(renderer);
var integrator = Physics.integrator('verlet', {
	drag: 0.008
});
world.add(integrator);
Physics.util.ticker.on(function( time ){
	world.step( time );
});
world.on('step', function() {
	world.render();
	view.update();
});

// init model
var b = [], pb, _b;
for (var i = 0; i < 1; i++) {
	var _b = new Bacterium(100 + Math.random() * 50 * i, 100 + 30 * i, Math.random() * Math.PI);
	b.push(_b);
	var pb = b[i].physics_body;
	console.log(pb);
	world.add(pb);
	pb.state.angular.pos = 1.5;
}

// collisions
var viewportBounds = Physics.aabb(view.bounds.x,view.bounds.y,
								  view.bounds.width,view.bounds.height);
world.add(Physics.behavior('edge-collision-detection', {
	aabb: viewportBounds,
	restitution: 0.8,
	cof: 0.99
}));
world.add(Physics.behavior('body-collision-detection'));
world.add( Physics.behavior('body-impulse-response') );
world.add( Physics.behavior('sweep-prune') );

// go!
Physics.util.ticker.start();
// world.pause();