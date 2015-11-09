function Plant(x, y) {}

Plant.prototype = {
    renderAt: function(x, y, angle) {},
    getDecision: function() {}
};

var CAPSULE = new Path.RoundRectangle(new Rectangle([ 0, 0 ], new Size(35, 20)), new Size(12, 12));

CAPSULE.strokeColor = "black";

CAPSULE.strokeWidth = 2;

CAPSULE.position = [ 0, 0 ];

var ORGANELLES = new Group([ new Shape.Circle(new Point(1, 6), 2), new Shape.Circle(new Point(4, -1), 3), new Shape.Circle(new Point(-3, 1), 2) ]);

ORGANELLES.position = new Point(3, 0);

ORGANELLES.fillColor = "black";

var BACTERIUM_BODY_PAPERJS = new Group([ CAPSULE, ORGANELLES ]);

BACTERIUM_BODY_PAPERJS.visible = false;

function Bacterium(_x, _y) {
    this.physics_body = Physics.body("compound", {
        x: _x,
        y: _y,
        children: [ Physics.body("rectangle", {
            x: 0,
            y: 0,
            width: 25,
            height: 20,
            mass: 800
        }), Physics.body("circle", {
            x: -12.5,
            y: 0,
            radius: 10,
            mass: 100
        }), Physics.body("circle", {
            x: 12.5,
            y: 0,
            radius: 10,
            mass: 100
        }) ],
        restitution: .8
    });
    this.paper_body = BACTERIUM_BODY_PAPERJS.clone();
    this.paper_body.visible = true;
    this.physics_body.sleep(false);
    this.paper_body.position = new Point(_x, _y);
    this.physics_body.view = this;
    this.old_angle = 0;
}

Bacterium.prototype = {
    renderAt: function(x, y, angle) {
        if (isNaN(x) || isNaN(y) || isNaN(angle)) return;
        this.paper_body.position.x = x;
        this.paper_body.position.y = y;
        this.paper_body.rotation = angle;
    },
    getDecision: function() {
        return {
            a_linear: Math.random(),
            a_angular: Math.random() - .5
        };
    }
};

Physics.renderer("paper", function(parent) {
    var PaperRenderer = {
        init: function(options) {
            options = Physics.util.extend({}, options);
            parent.init.call(this, options);
        },
        createView: function(g, s) {
            return true;
        },
        drawMeta: function(g, s) {
            return true;
        },
        drawBody: function(body) {
            var t = this._interpolateTime;
            var x = body.state.pos.get(0) + t * body.state.vel.get(0);
            var y = body.state.pos.get(1) + t * body.state.vel.get(1);
            var angle = body.state.angular.pos + t * body.state.angular.vel;
            body.view.renderAt(x, y, angle);
            var decision = body.view.getDecision();
            var v = Physics.vector({
                x: Math.cos(body.state.angular.pos) * decision.a_linear,
                y: Math.sin(body.state.angular.pos) * decision.a_linear
            });
            body.applyForce(v.mult(decision.a_linear));
            body.applyForce(v.perp().mult(decision.a_angular), {
                x: 1,
                y: 0
            });
            body.applyForce(v.perp().mult(-decision.a_angular), {
                x: -1,
                y: 0
            });
        }
    };
    return PaperRenderer;
});

var world = Physics({
    timestep: 6,
    maxIPF: 4,
    sleepDisabled: true
});

var renderer = Physics.renderer("paper", {
    meta: false
});

world.add(renderer);

var integrator = Physics.integrator("verlet", {
    drag: .005
});

world.add(integrator);

Physics.util.ticker.on(function(time) {
    world.step(time);
});

world.on("step", function() {
    world.render();
    view.update();
});

var b = [], pb, _b;

for (var i = 0; i < 10; i++) {
    var _b = new Bacterium(100 + Math.random() * 50 * i, 100 + 30 * i);
    b.push(_b);
    var pb = b[i].physics_body;
    console.log(pb);
    world.add(pb);
}

var viewportBounds = Physics.aabb(view.bounds.x, view.bounds.y, view.bounds.width, view.bounds.height);

world.add(Physics.behavior("edge-collision-detection", {
    aabb: viewportBounds,
    restitution: .8,
    cof: .99
}));

world.add(Physics.behavior("body-collision-detection"));

world.add(Physics.behavior("body-impulse-response"));

world.add(Physics.behavior("sweep-prune"));

Physics.util.ticker.start();