/* this is PaperScript */
/* Node ******************************************************************** */
// Doubly Linked List structure w embodied differential properties
var node_count = 0;
var centers = {};
var d = { x: 0, y: 0 };
var dist = lin = 0;
function Node (x, y, brother, sister) {
	this.brother = brother; // brother comes before in dll
	this.sister = sister; // sister comes after
	/* draw */
	this.meat = new Shape.Circle({
		center: [x, y],
		radius: 3,
		fillColor: "white",
	});
	/* helpful */
	this.delta = {x: 0., y: 0.};
	this.uid = node_count++;
}

Node.prototype = {
	// species behaviors
	BIND_RADIUS: 1,
	REPEL_RADIUS: 70,
	STRONG_FORCE: 0.125,
	WEAK_FORCE: 0.035,
	DUMB_FORCE: 0.04,
	// where am I?
	center: function() {
		return this.meat.position;
	},
	// mitosis. we're gonna have a new sister
	divide: function() {
		if (!(!!this.brother && !!this.sister)) return;
		var mc = this.center();
		var sc = this.sister.center();
		var bc = this.brother.center();
		if (sc.getDistance(mc) > bc.getDistance(mc)) {
			var sis = this.sister; // grab old one before we lose it
			this.sister = new Node ((mc.x + sc.x) * 0.5, (mc.y + sc.y) * 0.5, this, sis);
			sis.brother = this.sister;
			// need good delta to be stable!!
			this.sister.delta.x += (this.delta.x + sis.delta.x) * 0.5;
			this.sister.delta.y += (this.delta.y + sis.delta.y) * 0.5;
		} else {
			var bro = this.brother;
			this.brother = new Node ((mc.x + bc.x) * 0.5, (mc.y + bc.y) * 0.5, bro, this);
			bro.sister = this.brother;
			this.brother.delta.x += (this.delta.x + bro.delta.x) * 0.5;
			this.brother.delta.y += (this.delta.y + bro.delta.y) * 0.5;
		}
	},
	// curvature at this node
	sine: function() {
		// law of sines:
		//		(bro)			area: T
		//	  c /	\  a
		//	   / A	 \
		//  (me)--b-(sis)		==> sin(A) = 2T/bc
		if (!(!!this.brother && !!this.sister)) return 0;
		var me = this.center(),
		   sis = this.sister.center(),
		   bro = this.brother.center();
		var a = sis.getDistance(bro),
		    b = me.getDistance(sis),
		    c = me.getDistance(bro);
		var s = (a + b + c) * 0.5;
		var t = Math.sqrt(s * (s - a) * (s - b) * (s - c));
		return 2. * t / (b * c);
	},
	// what's the move?
	think: function() {
		"use strict";
		// cluster towards center
		var mc = centers[this.uid]; // these were set by centers() wayy below
		this.delta.x += this.DUMB_FORCE * (view.center.x - mc.x);
		this.delta.y += this.DUMB_FORCE * (view.center.y - mc.y);
		if (this.sister) {
			// I want to be as close as possible to my siblings.
			// well, not too close ...
			dist = this.sister.center().getDistance(mc);
			lin = this.BIND_RADIUS - dist;
			d.x = this.STRONG_FORCE * lin * (centers[this.sister.uid].x - mc.x);
			d.y = this.STRONG_FORCE * lin * (centers[this.sister.uid].y - mc.y);
			this.delta.x -= d.x;
			this.delta.y -= d.y;
			this.sister.delta.x += d.x;
			this.sister.delta.y += d.y;
			// ... but as far away as I can from everybody else in my neighborhood.
			var curr = this.sister.sister;
			while (curr) {
				dist = mc.getDistance(centers[curr.uid]);
				if (dist < this.REPEL_RADIUS) {
					lin = this.REPEL_RADIUS - dist;
					d.x = this.WEAK_FORCE * lin * (centers[curr.uid].x - mc.x);
					d.y = this.WEAK_FORCE * lin * (centers[curr.uid].y - mc.y);
					this.delta.x -= d.x;
					this.delta.y -= d.y;
					curr.delta.x += d.x;
					curr.delta.y += d.y;
				}
				curr = curr.sister;
			}
		}
	},
	// make the move and reset
	act: function(dt) {
		this.meat.position.x += dt * this.delta.x;
		this.meat.position.y += dt * this.delta.y;
		this.delta.x = 0;
		this.delta.y = 0;
	},
	// remove everything
	destroy: function() {
		this.meat.remove();
		if (this.brother)
			this.brother = null;
		if (this.sister)
			this.sister.destroy();
	}
};


/* main ******************************************************************** */
// constants
tool.minDistance = 6;
tool.maxDistance = 9;
var STEP = 1/60;

// store nodes
var curr = dll = undefined;

// init mesh
onMouseDown = function(evt) {
	paper.view.onFrame = null;
	if (dll) dll.destroy();
	dll = curr = new Node(evt.point.x, evt.point.y);
};

// fill mesh - add sisters.
onMouseDrag = function(evt) {
	curr.sister = new Node(evt.point.x, evt.point.y, curr); // curr is brother
	curr = curr.sister;
};

// finalize mesh & begin stepping
onMouseUp = function(evt) {
	curr.sister = new Node(evt.point.x, evt.point.y, curr);
	begin();
};

// tell paper that we're live
begin = function() {
	window.guy = dll;
	paper.view.onFrame = function(evt) {
		calcCenters();
		thinkChain();
		var sis = window.guy.sister; // catch it before we add a new one
		window.r = Math.random();
		if (window.r > 0.96 || window.guy.sine() > 1.2 * window.r + 0.14159) {
			window.guy.divide();
		}
		window.guy = !!sis ? sis : dll;
		actChain(STEP);
	}
}
function calcCenters() {
	curr = dll;
	while (curr) {
		centers[curr.uid] = curr.center();
		curr = curr.sister;
	}
}
function thinkChain() {
	curr = dll;
	while (curr) {
		curr.think();
		curr = curr.sister;
	}
}
function actChain(dt) {
	curr = dll;
	while (curr) {
		curr.act(dt);
		curr = curr.sister;
	}
}
