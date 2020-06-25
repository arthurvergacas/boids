<h1>Flocking Simulation - Boids</h1>

<p>This project was made using <a href = "https://p5js.org/">p5.js</a> and was inspired by Craig Reynolds's <a href = "https://www.red3d.com/cwr/boids/">Boids</a> and 
<a href = "https://www.red3d.com/cwr/steer/gdc99/">Steering Behaviors For Autonomous Characters</a> articles.</p>
<p>In this project were implemented the following concepts:</p>
<ul>
  <li><strong>Alignment</strong></li>
  <li><strong>Cohesion</strong></li>
  <li><strong>Separation</strong></li>
  <li><strong>Flee (obstacle avoidance)</strong></li>
</ul>
<p>The method to calculate the steer force necessary in this project was basically a vector subtraction of the current boid velocity from the desired velocity.</p>
<p>Although all the methods worked as intended, when the <strong>Boids</strong> algorithm is merged with the <strong>Flee</strong> concept some conflict issues occur.</p>
