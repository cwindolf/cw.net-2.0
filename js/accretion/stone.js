/* x, y in METERS */
function Stone (x, y) {
	console.log("new Stone at (",x,",",y,")", "paper coords", ppm() * x, ppm() * y);
	/* Body size */
	var rand = Math.random();
	this.r = rand * rand * rand * rand * rand * 1.5 + 0.25;
	/* Box body */
	this.bd = new Box2D.b2BodyDef();
	this.bd.set_type(Box2D.b2_dynamicBody);
	this.bd.set_position(new Box2D.b2Vec2(x, y));
	this.bd.set_bullet(true);
	this.body = world.CreateBody(this.bd);
	this.box_shape = createRandomPolygonShape(this.r);
	this.fd = new Box2D.b2FixtureDef();
	this.fd.set_shape(this.box_shape);
	this.fd.set_density(10.0);
	this.fd.set_friction(0.8);
	this.fd.set_restitution(0.1);
	this.body.CreateFixture(this.fd);
	this.body.SetLinearDamping(0.4);
	this.body.SetLinearVelocity(new Box2D.b2Vec2(-5,0));
	this.body.SetAngularDamping(0.5);
	/* /box */

	/* Paper body */
	this.color = randBlue();
	this.initShape();
	/* /paper */

	this.last_box_angle = 0;
}

Stone.prototype = {
	render: function() {
		var pos = this.body.GetPosition();
		var r = ppm();
		this.shape.position.x = pos.get_x() * r;
		this.shape.position.y = pos.get_y() * r;
		this.shape.rotate(-this.shape.rotation + this.body.GetAngle() * 180 / Math.PI);
	},

	initShape: function() {
		if (this.shape) this.shape.remove();
		this.shape = new paper.Path({
			strokeColor: 'black',
			fillColor: this.color,
			strokeWidth: 2
		});
		var n = this.box_shape.GetVertexCount();
		for (i = 0; i < n; i++) {
			var v = this.box_shape.GetVertex(i);
			var vert = boxVecToPaperPt(v);
			this.shape.add(vert);
		}
		this.shape.closed = true;
		this.shape.transformContent = false;
		this.shape.smooth({
			type: 'catmull-rom',
			factor: 0.5
		});
		this.shape.position.x = ppm() * this.body.GetPosition().get_x();
		this.shape.position.y = ppm() * this.body.GetPosition().get_y();
		this.shape.stone = this;
	}
}

