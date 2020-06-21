// A boid, thought by Craig Reynolds

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();

        this.maxVelocity = 2;

        this.sightRadius = 60;
        
        this.totalSteerForce = 0.3;
        this.totalAlignForce = 0.8;
        this.totalCohesionForce = 1.4;
        this.totalSeparationForce = 1.42;
    }

    // this will define the steering acceleration
    setSteerForce(boids) {
        this.totalAlignForce = alignSlider.value();
        this.totalCohesionForce = cohesionSlider.value();
        this.totalSeparationForce = sepairSlider.value();


        let avgAlign = createVector(), 
        avgCohesion = createVector(), 
        avgSepair = createVector(); 

        let total = 0;

        for (let boid of boids) {
            let distance = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid !== this && distance < this.sightRadius) {
                
                
                // alignment
                avgAlign.add(boid.velocity);

                // cohesion
                avgCohesion.add(boid.position);

                // separation
                let separationForce = p5.Vector.sub(this.position, boid.position);
                separationForce.div(distance);
                avgSepair.add(separationForce);


                total++;
            }
        }

        let steerForce = createVector();

        if (total > 0){
            avgAlign.div(total);

            avgCohesion.div(total);
            avgCohesion.sub(this.position);

            avgAlign.setMag(this.totalAlignForce);
            avgCohesion.setMag(this.totalCohesionForce);
            avgSepair.setMag(this.totalSeparationForce);

            steerForce.add(avgAlign);
            steerForce.add(avgCohesion);
            steerForce.add(avgSepair);

            // to calculate the steer force, subtract the current velocity (this.velocity) from the
            // desired velocity (steerForce).
            steerForce.sub(this.velocity);

            // limiting the vector so the transition can be more soft
            steerForce.limit(this.totalSteerForce);
        }
        
        // set the acceleration (or force) of this boid to the desired steer force
        this.acceleration = steerForce;

    }


    show() {
        fill(255);
        noStroke();


        // to rotate to the direction it's moving
        push();
        let arrowSize = 12;
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();


    }

    update() {

        // to add movement
        this.velocity.add(this.acceleration);
        this.velocity.setMag(this.maxVelocity);
        this.position.add(this.velocity);

        // to travel through walls
        if (this.position.x > width) {
            this.position.x = 0;
        }
        else if (this.position.x < 0) {
            this.position.x = width;
        }
        
        if (this.position.y > height) {
            this.position.y = 0;
        }
        else if (this.position.y < 0) {
            this.position.y = height;
        }
    }
}