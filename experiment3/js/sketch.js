var s = function( p ) { // p could be any variable name
  var x = 100; 
  var y = 100;
  p.setup = function() {
    p.createCanvas(400, 200);
  };

  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.rect(x,y,50,50);
  };
};
var myp5 = new p5(s, 'c1');

// Sketch Two
var t = function( p ) { 
  var x = 100.0; 
  var y = 100; 
  var speed = 2.5; 
  p.setup = function() {
    numCols = select("#asciiBox").attribute("rows") | 0;
    numRows = select("#asciiBox").attribute("cols") | 0;
  
    createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
    select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
  
    select("#reseedButton").mousePressed(reseed);
    select("#asciiBox").input(reparseGrid);
  
    reseed();
  };

  p.draw = function() {
    randomSeed(seed);
    drawGrid(currentGrid);
  };
};
var myp5 = new p5(t, 'c2');