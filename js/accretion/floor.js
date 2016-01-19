function Floor (y) {
	console.log("the Floor is at", y);
	
	/* Box body */
	this.bd = new Box2D.b2BodyDef();
	this.bd.set_type(Box2D.b2_staticBody);
	this.body = world.CreateBody(this.bd);
	this.vertices = [];
	this.vertices.push(new Box2D.b2Vec2(-8, BOX_HEIGHT));
	this.vertices.push(new Box2D.b2Vec2(-4, y - 6));
	this.vertices.push(new Box2D.b2Vec2(-3, y - 4));
	this.vertices.push(new Box2D.b2Vec2(-2, y - 3));
	this.vertices.push(new Box2D.b2Vec2(-1, y - 2));
	this.vertices.push(new Box2D.b2Vec2(0, y - 1));
	this.vertices.push(new Box2D.b2Vec2(1, y));
	for (var i = 2; i <= 2 * BOX_WIDTH + 1; i++)
		this.vertices.push(new Box2D.b2Vec2(i, y + 2 * Math.random() - 1));
	this.vertices.push(new Box2D.b2Vec2(2 * BOX_WIDTH + 4, y - 1));
	this.vertices.push(new Box2D.b2Vec2(2 * BOX_WIDTH + 8, BOX_HEIGHT));
	this.box_shape = createChainShape(this.vertices, false);
	this.fd = new Box2D.b2FixtureDef();
	this.fd.set_shape(this.box_shape);
	this.fd.set_friction(0.8);
	this.fd.set_density(1);
	this.fd.set_restitution(0.2);
	this.body.CreateFixture(this.fd);
	/* /box */	
	/* Paper body */
	this.initShape();
	/* /paper */
}

Floor.prototype = {
	initShape: function() {
		if (this.shape) this.shape.remove();
		this.shape = new paper.Path({
			strokeColor: 'black',
			fillColor: 'black',
			strokeWidth: 2
		});
		var n = this.vertices.length;
		for (i = 0; i < n; i++) {
			var v = this.vertices[i];
			var vert = boxVecToPaperPt(v);
			this.shape.add(vert);
		}
		this.shape.closed = true;
		this.shape.smooth({
			type: 'catmull-rom',
			factor: 0.5
		});
	}
}