function Landscape (width, length, container) {
	this.MAX_HEIGHT = 200;
	this.xx = Math.round(width);
	this.yy = Math.round(2 * length + this.MAX_HEIGHT * 2); // more, because of projection
	//
	this.heightmap = [];
	//
	this.canvas = document.createElement("canvas");
	this.canvas.width = width;
	this.canvas.height = length;
	container.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
	this.context.imageSmoothingEnabled = false;
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
			y: Math.round(0.5 * _y - 0.5 * _z)
		};
	},

	clear: function() {
		console.log("clear");
		this.context.clearRect(0,0,this.xx,this.yy);
	},

	draw: function() {
		console.log("draw",this.xx,this.yy);

		var p, z, pi, i, s;
		var id = this.context.getImageData(0,0,this.xx,this.yy);
		var d = id.data;

		for (var x = 0; x < this.xx; x++) {
			for (var y = 0; y < this.yy; y++) {

				z = this.heightmap[x][y];
				s = z/this.MAX_A;
				p = this.project(x,y,z);
				i = 4 * (Math.round(0.5*y) * this.xx + x);
				pi = 4 * (p.y*this.xx + p.x);
				
				if (z > 3) { // mountains
					if (this.color) {
						d[pi] = Math.round(Math.sqrt(s) * 250);
						d[pi + 1] = Math.round(s * 250);
						d[pi + 2] = Math.round(s*s * 250);
						d[pi + 3] = 255;
					} else {
						d[pi] = Math.round(s * 250);
						d[pi + 1] = Math.round(s * 250);
						d[pi + 2] = Math.round(s * 250);
						d[pi + 3] = 255;
					}
				} 
				if (z <= 10 && z >= -3) { // shore
					d[i] = 0;
					d[i + 1] = 0;
					d[i + 2] = 0;
					d[i + 3] = 255;
				} 
				else if (z <= -(this.MAX_A / 2)) { // lakes
					
					if (Math.abs((x + y) % 100) <= 3) {
						// if (this.color) {
						// 	//todo
						// 	continue;
						// } else {
							d[i] = 0;
							d[i + 1] = 0;
							d[i + 2] = 0;
							d[i + 3] = 255;
						// }
					}

				}

			}
		}
		this.context.putImageData(id,0,0);
		console.log("drew");
	}
}