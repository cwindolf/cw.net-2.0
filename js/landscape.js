function Landscape (width, length, container) {
	this.MAX_HEIGHT = 200;
	this.xx = width;
	this.yy = 2 * length + this.MAX_HEIGHT * 2; // more, because of projection
	//
	this.heightmap = [];
	//
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = length;
	container.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
	this.color = false;
}

Landscape.prototype = {
	/* Fill the heightmap */
	sineFill: function() {
		delete this.heightmap;
		this.heightmap = [];

		console.log("sine fill");
		var x_period = this.xx / Math.pow(2,2 + Math.round(Math.random() * 3));
		var y_period = this.yy / Math.pow(2,4 + Math.round(Math.random() * 3));

		var x_amplitude = this.MAX_HEIGHT / 2 + Math.random() * this.MAX_HEIGHT / 2;
		var y_amplitude = this.MAX_HEIGHT / 2 + Math.random() * this.MAX_HEIGHT / 2;
		this.MAX_A = Math.max(x_amplitude,y_amplitude);

		var x_generator = function(x) {
			return x_amplitude * Math.sin((x) / (x_period));
		}

		var y_generator = function(y) {
			return y_amplitude * Math.sin((y) / (y_period));
		}

		for (var x = 0; x < this.xx; x++) {
			this.heightmap.push([]);
			for (var y = 0; y < this.yy; y++) {
				this.heightmap[x].push(x_generator(x) + y_generator(y));
			}
		}
	},

	perlinFill: function() {
		delete this.heightmap;
		this.heightmap = [];
		
		noise.seed(Math.random());

		for (var x = 0; x < this.xx; x++) {
			this.heightmap.push([]);
			for (var y = 0; y < this.yy; y++) {
				this.heightmap[x].push(noise.simplex2(x / 150,y / 150) * this.MAX_HEIGHT);
			}
		}
		this.MAX_A = this.MAX_HEIGHT;
	},
	/* Drawing */
	// where do we draw this 3d point on the 2d canvas
	project: function(_x,_y,_z) {
		return {
			x: _x, 
			y: 0.5 * _y - 0.5 * _z
		};
	},

	clear: function() {
		console.log("clear");
		this.context.clearRect(0,0,this.xx,this.yy);
	},

	draw: function() {
		var self = this;
		setTimeout(function() {
			console.log("draw");

			var p, z;

			self.context.strokeStyle = "black";
			self.context.fillStyle = "white";
			for (var x = 0; x < self.xx; x++) {
				for (var y = 0; y < self.yy; y++) {
					z = self.heightmap[x][y];
					p = self.project(x,y,z);
				if (z > 1) { // mountains
					if (self.color) {
						self.context.fillStyle = "hsl("+(20 + (z/self.MAX_A) * 60)+",40%,70%)";
					} else {
						self.context.fillStyle = "hsl(10,0%,"+ (10 + 70 * (z/self.MAX_A)) +"%)";
					}
					self.context.fillRect(p.x,p.y,1,1); 
				} else if (z <= 2 && z >= -2) { // shore
					self.context.fillStyle = "black";
					self.context.fillRect(p.x,p.y,2,2);
				} else if (z <= -(self.MAX_A / 3)) { // lakes
					if (Math.abs((x + y) % 100) <= 1) {
						if (self.color)
							self.context.fillStyle = "#7773ff";
						else
							self.context.fillStyle = "black";
						self.context.fillRect(x, y/2,2,2);
					}
				}
			}
		}},20);
	}
}