new p5((sketch) => {
    sketch.setup = function() {
      numCols = select("#asciiBox").attribute("rows") | 0;
      numRows = select("#asciiBox").attribute("cols") | 0;
    
      createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
      select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
    
      select("#reseedButton").mousePressed(reseed);
      select("#asciiBox").input(reparseGrid);
    
      reseed();
    };
  
    sketch.draw = function() {
      randomSeed(seed);
      drawGrid2(currentGrid);
    };
  }, 'sketch2');