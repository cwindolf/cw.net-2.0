/* Guy class *************************************************************** */
function Guy (x, y) {
	console.log("new Guy at (",x,",",y,")");
	this.x = x;
	this.y = y;
	this.dx = 200 * Math.random();
	this.dy = 200 * Math.random();

	this.pastLives = [];
	var c = new Shape.Circle({
			position: [x, y],
			radius: this.RADIUS,
			strokeColor: "black",
			strokeWidth: 1
	});
	this.pastLives.unshift(c);
}

Guy.prototype = {
	// params
	MEMORY: 100,
	FORGETFULNESS: 0.95,
	RADIUS: 20,
	FOV_SQUARED: Math.pow(0.3 * Math.min(view.size.width, view.size.height), 2),
	FRICTION: 0.997,
	STRENGTH: 0.1,

	// helpers
	updateRadii: function() {
		this.pastLives.forEach(function(circle, index) {
			circle.radius *= this.FORGETFULNESS;
			circle.opacity = (this.MEMORY - index) / this.MEMORY;
		}.bind(this));
	},

	squaredDistanceTo: function(guy) {
		return (guy.x - this.x) * (guy.x - this.x) + (guy.y - this.y) * (guy.y - this.y);
	},

	// behavior
	think: function(guys) {
		// dumb it down a bit
		var dxp = this.dx;
		var dyp = this.dy;
		this.dx = 0;
		this.dy = 0;
		// you too close man!
		guys.forEach(function(guy) {
			if (this.squaredDistanceTo(guy) < this.FOV_SQUARED) {
				this.dx += this.x - guy.x;
				this.dy += this.y - guy.y;
			}
		}.bind(this));
		this.dx = this.FRICTION * dxp + this.STRENGTH * this.dx;
		this.dy = this.FRICTION * dyp + this.STRENGTH * this.dy;
	},

	act: function(dt) {
		// move
		this.x += dt * this.dx;
		this.y += dt * this.dy;

	},

	redraw: function() {
		if (this.pastLives.length > this.MEMORY) {
			this.pastLives.pop().remove();
		}
		this.updateRadii();
		var c = new Shape.Circle({
			position: [this.x, this.y],
			radius: 25,
			strokeColor: "black",
			strokeWidth: 1
		});
		this.pastLives.unshift(c);
	}
};

/* main ******************************************************************** */
var guys = [];
var width = view.size.width; var height = view.size.height;

for (var i = 0; i < 12; i++) {
	guys.push(new Guy(Math.random() * width, Math.random() * height));
}

onFrame = function(event) {
	guys.forEach(function(guy) { guy.think(guys); });

	// guys don't know about the walls. we have to bounce
	// them ourselves.
	width = view.size.width; height = view.size.height;
	guys.forEach(function(guy) {
		if (guy.x < Guy.prototype.RADIUS && guy.dx < 0 
			|| guy.x > width - Guy.prototype.RADIUS && guy.dx > 0)
			guy.dx *= -1;
		if (guy.y < Guy.prototype.RADIUS && guy.dy < 0 
			|| guy.y > height - Guy.prototype.RADIUS && guy.dy > 0)
			guy.dy *= -1;
	});

	guys.forEach(function(guy) { guy.act(event.delta); });

	guys.forEach(function(guy) { guy.redraw(); });
};
