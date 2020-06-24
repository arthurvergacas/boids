// A boid, thought by Craig Reynolds

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();

        this.maxVelocity = 2;

        this.sightRadius = 60;
        
        this.totalSteerForce = 0.28;
        this.totalAlignForce = 0.8;
        this.totalCohesionForce = 1.5;
        this.totalSeparationForce = 1.42;
    }

    // this will set steer force to avoid walls
    wallAvoidance() {
        // only test purposes
        let visionVector = this.velocity.copy();
        visionVector.setMag(this.sightRadius);
        visionVector.add(this.position);
        stroke(0, 255, 0);
        strokeWeight(4);
        
        // line(this.position.x, this.position.y, visionVector.x, visionVector.y);

        let pointRight = createVector(width, this.position.y);
        let pointLeft = createVector(0, this.position.y);
        let pointTop = createVector(this.position.x, 0);
        let pointBottom = createVector(this.position.x, height);

        let allPoints = [pointRight, pointLeft, pointTop, pointBottom];


        let steerForce = createVector();
        
        for (let point of allPoints){
            let distance = dist(this.position.x, this.position.y, point.x, point.y);

            if (distance < this.sightRadius) {
                let desiredVelocity = p5.Vector.sub(this.position, point);

    
                steerForce = p5.Vector.sub(desiredVelocity, this.velocity);
                steerForce.div(pow(distance + 0.01, 0.05))
                


                let angleBetw = steerForce.angleBetween(this.velocity);
                                
                if (Math.abs(degrees(angleBetw)) >= 170 && Math.abs(degrees(angleBetw)) <= 180){
                    steerForce.rotate(radians(90) * random([1, -1]));
                    steerForce.setMag(10);
                }

                steerForce.limit(0.3);

                
    
            }
        }
        

        return steerForce;



    }
    
    // to avoid the mouse
    mouseAvoidance() {

        let mouse = createVector(mouseX, mouseY);

        // to see the mouse obstacle
        fill(255, 40, 40);
        circle(mouse.x, mouse.y, this.sightRadius - 20)

        let steerForce = createVector();

        let distance = dist(mouse.x, mouse.y, this.position.x, this.position.y);

        if (distance < this.sightRadius){
            let ahead = p5.Vector.add(this.position, this.velocity);
            let desiredVelocity = p5.Vector.sub(ahead, mouse);
            desiredVelocity.setMag(40);

            steerForce = p5.Vector.sub(desiredVelocity, this.velocity);
            steerForce.div(pow(distance + 0.01, 0.05));

            let angleBetw = steerForce.angleBetween(this.velocity);
                                
            if (Math.abs(degrees(angleBetw)) >= 170 && Math.abs(degrees(angleBetw)) <= 180){
                steerForce.rotate(radians(90) * random([1, -1]));
                steerForce.setMag(40);
            }

            steerForce.limit(0.3);


        }

        return steerForce;
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
            total = 1;
            avgAlign.div(total);

            avgCohesion.div(total);
            avgCohesion.sub(this.position);

            avgAlign.setMag(this.totalAlignForce);
            avgCohesion.setMag(this.totalCohesionForce);
            avgSepair.setMag(this.totalSeparationForce);

            steerForce.add(avgAlign);
            steerForce.add(avgCohesion);
            steerForce.add(avgSepair);
            
        }


        // to calculate the steer force, subtract the current velocity (this.velocity) from the
        // desired velocity (steerForce).
        steerForce.sub(this.velocity);

        // limiting the vector so the transition can be more soft
        steerForce.limit(this.totalSteerForce);

        // TO AVOID WALLS
        //let avoidWall = this.wallAvoidance();
        //steerForce.add(avoidWall);


        // TO AVOID THE MOUSE
        let avoidMouse = this.mouseAvoidance();
        steerForce.add(avoidMouse);

        
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