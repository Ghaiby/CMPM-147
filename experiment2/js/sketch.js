// sketch.js - contain js code for drawing from glitch
// Author: Guy Haiby
// Date: 4/16/24

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

/* exported setup, draw */
let seed = 0;

const sandColor = "#A48571" ;
const skyColor = "#7DC1F3" ;
const cloudColor = "#F5F5F6" ;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// listener for reimagine button
$("#reimagine").click(function() {
  seed++;
});

function setup() {  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  randomSeed(seed);
  background(skyColor);
  
  noStroke();
  
  drawClouds();
  
  //Draw water as rectangle gradient. 
  for (let i = 0; i < height / 3; i++) {
    let inter = map(i, 0, height / 3, 0, 1);
    let c = lerpColor(color(10, 110, 154), color(179, 208, 246), inter);
    stroke(c);
    line(0, height / 2 + i,  width, height / 2 + i);
  }
  
  // Draw WaterEdge 
  fill(sandColor);
  beginShape();
  let waterLevel = height / 1.4;
  let noiseScale = 0.03; 
  let noiseHeight = height /10;  
  
  // Generate wavy line using noise
  for (let x = 0; x <= width; x += 4) {
    let y = noise((x + seed * 50) * noiseScale) * noiseHeight; // Perlin noise
    vertex(x, waterLevel + y);
  }
  //start sand at bottom corners of drawing
  vertex(width, height);
  vertex(0, height); 
  endShape(CLOSE);
  
}

function drawClouds() {
  let numClouds = 5;
  let time = millis() / 2000; 

  for (let i = 0; i < numClouds; i++) {

    let cloudRadiusX = random(50, 80); 
    let cloudRadiusY = random(10, 20);
    let cloudX = (random(0, width) + time * 30) % (width + 100) - 50; // move clouds and wrap 
    let cloudY = height /3; 
    let cloudDetail = random(2, 4);  // noise in cloud texture
    
    fill(cloudColor);
    noStroke();
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += radians(1)) {
      let offset = map(noise(cos(angle) * cloudDetail + seed, sin(angle) * cloudDetail + seed), 0, 1, -12, 12);
      let x = cloudX + (cloudRadiusX + offset) * cos(angle);
      let y = cloudY + (cloudRadiusY + offset) * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
