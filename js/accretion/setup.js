/* 
 * Set up PAPER.js & related helpers
 */
var canvas = document.getElementById("cvs");
paper.setup(canvas);
paper.activate();
paperWidth = function() {
	return paper.view.viewSize.width;
};
paperHeight = function() {
	return paper.view.viewSize.height;
};

/*
 * Box init 
 */
var gravity = new Box2D.b2Vec2(-1, 2);
var world = new Box2D.b2World(gravity, false);

// helpful constants
var ZERO = new Box2D.b2Vec2(0.0, 0.0);
var BOX_WIDTH = 10; // snapshot at init time
var BOX_HEIGHT = 10 * paperHeight() / paperWidth();

// for interaction
var mouseBody = world.CreateBody(new Box2D.b2BodyDef());

/*
 * Pixel scale: 
 */
// when we load up, it's 1 to 1. paper's canvas is X by Y pixels,
// box2d's arena is X by Y meters. on resize, this should change.
// if (newX - oldX)/(newY - oldY) > 1, then height is limiting, and
// aspect ratio should be newY/oldY. here, old are arena coords, and
// new are paper's dynamic coords
function ppm() {
	return Math.min(paperWidth() / BOX_WIDTH, paperHeight() / BOX_HEIGHT);
}
function mpp() {
	return 1 / Math.min(paperWidth() / BOX_WIDTH, paperHeight() / BOX_HEIGHT);
}
function boxVecToPaperPt(vec) {
	var r = ppm();
	return new paper.Point(vec.get_x() * r, vec.get_y() * r);
}
function paperPtToBoxVec(pt) {
	var r = mpp();
	return new Box2D.b2Vec2(pt.x * r, pt.y * r);
}
function randInt(lo, hi) {
	return Math.floor(Math.random() * (hi - lo)) + lo;
}
function randBlue() {
	var r = randInt(100, 150);
	var g = randInt(100,150);
	var b = randInt(200,254);
	return "#" + ("0" + r.toString(16)).slice(-2) 
			   + ("0" + g.toString(16)).slice(-2) 
			   + ("0" + b.toString(16)).slice(-2);
}