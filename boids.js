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

    // this will set steer force to avoid walls
    wallAvoidance() {
        // check if is going to hit a wall
        let visionVector = this.velocity.copy();
        visionVector.setMag(this.sightRadius);
        visionVector.add(this.position);
        stroke(0, 255, 0);
        strokeWeight(4);
        // essa ai e a linha de visao dele
        line(this.position.x, this.position.y, visionVector.x, visionVector.y);
        let lineSight = {
            x1: this.position.x,
            y1: this.position.y,
            x2: visionVector.x,
            y2: visionVector.y
        }

        let rightWall = {
            x1: width,
            y1: 0,
            x2: width,
            y2: height,

            denominator: null
        }

        rightWall.denominator = (lineSight.x1 - lineSight.x2) * (rightWall.y1 - rightWall.y2) - (lineSight.y1 - lineSight.y2) * (rightWall.x1 - rightWall.x2);

        if (rightWall.denominator !== 0) {
            let t = ((lineSight.x1 - rightWall.x1) * (rightWall.y1 - rightWall.y2) - (lineSight.y1 - rightWall.y1) * (rightWall.x1 - rightWall.x2))
                    / rightWall.denominator;
            
            if (0 <= t && t <= 1){
                stroke(255, 0, 0);
                strokeWeight(10);
                // line(rightWall.x1, rightWall.y1, rightWall.x2, rightWall.y2);
                point(lineSight.x1 + t * (lineSight.x2 - lineSight.x1), lineSight.y1 + t * (lineSight.y2 - lineSight.y1))
            }
            
        }


        




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