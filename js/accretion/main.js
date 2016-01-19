var s = [];
var f = new Floor(4 * BOX_HEIGHT / 5);
// loop
var dt = 1/60.
paper.view.onFrame = function(evt) {
	world.Step(evt.delta, 8, 3);
	s.forEach(function(stone) {
		stone.render();
	});
	if (evt.count % 100 == 0)
		s.push(new Stone((mpp() * paper.view.bounds.width) + 3,0));
};
paper.view.onResize = function() {
	f.initShape();
	s.forEach(function(s) { s.initShape(); });
	console.log("resize");
};

// drag the rocks around
var mj = false;
var tool = new paper.Tool();
tool.onMouseDown = function(evt) {
	if (!mj && evt.item && evt.item.stone) {
		var body = evt.item.stone.body;
		// create mouse joint
		var md = new Box2D.b2MouseJointDef();
		md.set_bodyA(mouseBody);
		md.set_bodyB(body);
		md.set_target(paperPtToBoxVec(evt.point));
		md.set_maxForce(100 * body.GetMass());
		md.set_collideConnected(true);
		mj = Box2D.castObject(world.CreateJoint(md), Box2D.b2MouseJoint);
	}
};
tool.onMouseDrag = function(evt) {
	if (mj) {
		mj.SetTarget(paperPtToBoxVec(evt.point));
	}
};
tool.onMouseUp = function(evt) {
	if (mj) {
		world.DestroyJoint(mj);
		mj = false;
	}
};