// statics to help bacterium constructor
// drawing
var CAPSULE = new Path.RoundRectangle(new Rectangle([0,0], new Size(35,20)), new Size(12,12));
	CAPSULE.strokeColor = 'black';
	CAPSULE.strokeWidth = 2;
	CAPSULE.position = [0, 0];
var ORGANELLES = new Group([
		new Shape.Circle(new Point(1, 6), 2),
		new Shape.Circle(new Point(4, -1), 3),
		new Shape.Circle(new Point(-3, 1), 2)
	]);
	ORGANELLES.position = new Point(3,0);
ORGANELLES.fillColor = 'black';
var BACTERIUM_BODY_PAPERJS = new Group([CAPSULE, ORGANELLES]);
	BACTERIUM_BODY_PAPERJS.visible = false;

function Bacterium (_x,_y) {
	// phys
	// this.physics_body = Physics.body('rectangle', {
	// 				x: _x,
	// 				y: _y,
	// 				width: 25,
	// 				height: 20,
	// 				mass: 400
	// 			}),
	this.physics_body = Physics.body('compound', {
			// com
			x: _x,
			y: _y,
			// faux-rounded rect
			children: [
				// central rect
				Physics.body('rectangle', {
					x: 0,
					y: 0,
					width: 25,
					height: 20,
					mass: 800
				}),
				// left circle
				Physics.body('circle', {
					x: -12.5,
					y: 0,
					radius: 10,
					mass: 100
				}),
				// right circle
				Physics.body('circle', {
					x: 12.5,
					y: 0,
					radius: 10,
					mass: 100
				}),
			],
			restitution: 0.8
		});
	// view
	this.paper_body = BACTERIUM_BODY_PAPERJS.clone();
	this.paper_body.visible = true;
	// sync init positions
	this.physics_body.sleep(false);
	this.paper_body.position = new Point(_x, _y);
	// backreference for physics rendering loop
	this.physics_body.view = this;
	this.old_angle = 0;
};

Bacterium.prototype = {
	renderAt: function(x, y, angle) {
		if(isNaN(x) || isNaN(y) || isNaN(angle)) return;
		// console.log("renderAt: ", x, y, angle);
		this.paper_body.position.x = x;
		this.paper_body.position.y = y;
		this.paper_body.rotation = angle;
	},

	getDecision: function() {
		return {
			a_linear: Math.random(),
			a_angular: (Math.random() - 0.5)
		};
	}
};