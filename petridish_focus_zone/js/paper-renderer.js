// renderer
Physics.renderer('paper', function(parent) {
	var PaperRenderer = {
		init: function(options) {
			options = Physics.util.extend( {}, options );
			parent.init.call(this, options);
		},

		createView: function(g,s) {
			return true; // noop
		},

		drawMeta: function(g,s) {
			return true; // noop
		},

		drawBody: function(body) {
			// console.log("drawBody");
			var t = this._interpolateTime;
			var x = body.state.pos.get(0) + t * body.state.vel.get(0);
			var y = body.state.pos.get(1) + t * body.state.vel.get(1);
			var angle = body.state.angular.pos + t * body.state.angular.vel;
			// render
			body.view.renderAt(x, y, angle);

			// control the body:
			var thrust = body.view.getDecision();
			// var scratch = Physics.scratchpad();
			var v = Physics.vector({x: Math.cos(body.state.angular.pos),
							 		y: Math.sin(body.state.angular.pos),}).normalize();
			// console.log(v);
			body.applyForce(v.mult(thrust.left), v.perp());
			body.applyForce(v.mult(thrust.right), v.perp().mult(-1));
			if (body.state.angular.vel > 5) {
				body.state.angular.vel = 4.9;
				body.state.angular.acc = 0;
			}
			// scratch.done();
		}
	};
	return PaperRenderer;
})