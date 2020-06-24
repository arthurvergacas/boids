// Flocking simulation idealized by Craig Reynalds
// Made by: Arthur Vergaças <github: arthurvergacas>

var boids = [];

var boidsNum = 30;

var chunkScale = 5; // this means that there'll be 25 chunks


var alignSlider, cohesionSlider, sepairSlider;

function setup() {
	let canvas = createCanvas(600, 600);
	canvas.parent("sketch_holder");

	alignSlider = createSlider(0, 10, 0.8, 0.2);
	alignSlider.parent("align_slider_holder");

	cohesionSlider = createSlider(0, 10, 1.4, 0.2);
	cohesionSlider.parent("cohesion_slider_holder");

	sepairSlider = createSlider(0, 10, 1.42, 0.2);
	sepairSlider.parent("sepair_slider_holder");


	for (let i = 0; i < boidsNum; i++) {
		boids.push(new Boid());
	}

}

function draw() {
	background(0);
	frameRate(60);

	// to visualize the chunks

	// stroke(255);
	// for (let i = 0; i < chunkScale; i++) {
	// 	line(width/chunkScale * i, 0, width/chunkScale * i, height);
	// 	for (let j = 0; j < chunkScale; j++) {
	// 		line(0, height/chunkScale * j, width, height/chunkScale * j);
	// 	}
	// }


	// chunk system
	for (let i = 0; i < chunkScale; i++) {
		for (let j = 0; j < chunkScale; j++) {
			let setOfBoids = [];
			for (let boid of boids) {
				// for x coordinate
				if (boid.position.x >= width/chunkScale * i && boid.position.x <= width/chunkScale * (i + 1)) {
					// for y cordinate
					if (boid.position.y >= height/chunkScale * j && boid.position.y <= height/chunkScale * (j + 1)) {
						setOfBoids.push(boid);
					}
				}
			}

			for (let boid of setOfBoids) {

				boid.show();
				boid.setSteerForce(setOfBoids);
				boid.update();

				boid.wallAvoidance();
		
			}

		}
	}

}
