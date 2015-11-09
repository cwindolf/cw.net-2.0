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
			var decision = body.view.getDecision();
			// var scratch = Physics.scratchpad();
			var v = Physics.vector({x: Math.cos(body.state.angular.pos) * decision.a_linear,
							 		y: Math.sin(body.state.angular.pos) * decision.a_linear,})

			body.applyForce(v.mult(decision.a_linear));
			body.applyForce(v.perp().mult(decision.a_angular), {x:1,y:0});
			body.applyForce(v.perp().mult(-(decision.a_angular)), {x:-1,y:0});
			// scratch.done();
		}
	};
	return PaperRenderer;
})