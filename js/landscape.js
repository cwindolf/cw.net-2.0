function Landscape (container) {
	this.container = container;
	// CONST
	this.MAX_HEIGHT = 300;
	this.Z_SCALE = 0.5; // how tall
	this.Y_SCALE = 6; // resolution
	this.SIMPLEX_DETAIL_FACTOR = 150;
	// UI
	this.color = true;
	// DATA
	this.heightmap = [];
	// DRAW
	this.canvas = document.createElement("canvas");
	this.container.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");
	// SIZE
	this.resize();
	// BIND TO RESIZE
	window.addEventListener("resize", this.resize.bind(this));
}

// Landscape.prototype = {
// 	init: function() {
// 		noise.seed(Math.random());
// 		this.height = 0;
// 	},

// 	resize: function() {
// 		console.log("resize");
// 		this.canvas.width = this.container.clientWidth;
// 		this.canvas.height = this.container.clientHeight;
// 		this.xx = Math.round(this.container.clientWidth);
// 		this.yy = Math.round(this.Y_SCALE * this.container.clientHeight + this.MAX_HEIGHT * this.Y_SCALE * 2);
// 		this.MAX_I = this.canvas.width * this.canvas.height * 4;
// 	},

// 	project: function(_x,_y,_z) {
// 		return {
// 			x: _x, 
// 			y: Math.round(_y - this.Z_SCALE * _z)
// 		};
// 	},

// 	draw: function() {
// 		console.log("animate at ",this.height," ", this);
// 		var p = pi = i = s = cy = 0;
// 		var id = this.context.getImageData(0,0,this.xx,this.yy);
// 		var d = id.data;

// 		for (var x = 0; x < this.xx; x++) {
// 			for (var y = 0; y < this.yy; y++) {
// 				cy = (y - this.MAX_HEIGHT * this.Y_SCALE)/this.Y_SCALE;
// 				s = noise.simplex3(x / this.SIMPLEX_DETAIL_FACTOR, y / (this.SIMPLEX_DETAIL_FACTOR * this.Y_SCALE), this.height);
// 				z = s * this.MAX_HEIGHT;
// 				i = 4 * Math.round((cy) * this.xx + x);
// 				p = this.project(x,cy,z);
// 				pi = 4 * (p.y*this.xx + p.x);
				
				 
// 				if ((z < -(this.MAX_HEIGHT / 3) + 1)) { // if (z <= -(2 * this.MAX_A / 4)) { // lakes
// 					// if (i > this.MAX_I) continue;
// 					var col = Math.round(s*s * 150);
// 					d[i] = d[i + 1] = 160 - col;
// 					d[i + 2] = this.color ? 240 : 175 - col;
// 					d[i + 3] = 255;
// 				}
// 				else if (z >= -(2 * this.MAX_HEIGHT / 2.5)) { // mountains
// 					if (this.color) {
// 						d[pi] = Math.round(s * 250);
// 						d[pi + 1] = Math.round(Math.sqrt(s) * 250);
// 						d[pi + 2] = Math.round(s*s * 250);
// 						d[pi + 3] = 255;
// 						// d[i] = Math.round(s * 250);
// 						// d[i + 1] = Math.round(Math.sqrt(s) * 250);
// 						// d[i + 2] = Math.round(s*s * 250);
// 						// d[i + 3] = 255;
// 					} else {
// 						var col = Math.round(s * 250);
// 						d[pi] = d[pi + 1] = d[pi + 2] = col;
// 						d[pi + 3] = 255;
// 					}
// 				}
// 			}
// 		}
// 		this.context.putImageData(id,0,0);
// 	},

// 	loop: function() {
// 		this.draw(this);
// 		this.height += 0.01;
// 		window.requestAnimationFrame(this.loop.bind(this));
// 	}
// }

Landscape.prototype = {
	/* Fill the heightmap */
	sineFill: function() {
		delete this.heightmap;
		this.heightmap = [];

		this.context.fillText("Generating Sine Landscape...",this.canvas.width/2, this.canvas.height/2 + 30);


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
		this.context.fillText("Generating Perlin Landscape...",this.canvas.width/2, this.canvas.height/2 + 30);
		
		noise.seed(Math.random());

		for (var x = 0; x < this.xx; x++) {
			this.heightmap.push([]);
			for (var y = 0; y < this.yy; y++) {
				this.heightmap[x].push(noise.perlin2(x / this.PERLIN_DETAIL_FACTOR, y / (this.PERLIN_DETAIL_FACTOR * 4)) * this.MAX_HEIGHT);
			}
		}
		this.MAX_A = this.MAX_HEIGHT;
	},

	simplexFill: function() {
		delete this.heightmap;
		this.heightmap = [];
		this.context.fillText("Generating Simplex Landscape...",this.canvas.width/2, this.canvas.height/2 + 30);
		
		noise.seed(Math.random());

		for (var x = 0; x < this.xx; x++) {
			this.heightmap.push([]);
			for (var y = 0; y < this.yy; y++) {
				this.heightmap[x].push(noise.simplex2(x / this.SIMPLEX_DETAIL_FACTOR, y / (this.SIMPLEX_DETAIL_FACTOR * 2)) * this.MAX_HEIGHT);
			}
		}
		this.MAX_A = this.MAX_HEIGHT;
	},
	/* Drawing */
	// where do we draw this 3d point on the 2d canvas
	project: function(_x,_y,_z) {
		return {
			x: _x, 
			y: Math.round((_y - 4 * this.MAX_HEIGHT) / this.Y_SCALE - this.Z_SCALE * _z)
		};
	},

	clear: function() {
		console.log("clear");
		this.context.fillStyle = "#aaa";
		this.context.fillRect(0,0,this.xx,this.yy);
		this.context.font = "20px Courier New";
		this.context.fillStyle = "white";
		this.context.textAlign = "center";
		this.context.fillText("Loading...",this.canvas.width/2, this.canvas.height/2);
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
				i = 4 * (Math.round((y - 4 * this.MAX_HEIGHT)/this.Y_SCALE) * this.xx + x);
				pi = 4 * (p.y*this.xx + p.x);
				
				if (z >= -(2 * this.MAX_A / 2.5)) { // mountains
					if (this.contour && !(z % this.CONTOUR_HEIGHT <= 2)) continue;
					if (this.color) {
						d[pi] = Math.round(s * 250);
						d[pi + 1] = Math.round(Math.sqrt(s) * 250);
						d[pi + 2] = Math.round(s*s * 250);
						d[pi + 3] = 255;
					} else {
						var col = Math.round(s * 250);
						d[pi] = col;
						d[pi + 1] = col;
						d[pi + 2] = col;
						d[pi + 3] = 255;
					}
				} 
				if ((z < -(2 * this.MAX_A / 4) + 1)) { // if (z <= -(2 * this.MAX_A / 4)) { // lakes
					
					var col = Math.round(s*s * 150);
					d[i] = 160 - col;
					d[i + 1] = 160 - col;
					d[i + 2] = this.color ? 240 : 175 - col;
					d[i + 3] = 255;

				}
				

			}
		}
		this.context.putImageData(id,0,0);
		console.log("drew");
	}
}