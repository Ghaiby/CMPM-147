/* exported generateGrid, drawGrid */
/* global placeTile */

// Lookup table for tile offsets 
const lookup = [
    [-5,2], [-5,2], [-5,2], [1,2],
    [-5,2], [2,2], [0,2], [-5,2],
    [-5,2], [2,0], [0,0], [-5,2],
    [0,1], [-5,2], [-5,2], [-5,2]
  ];
  
  
  function generateGrid(numCols, numRows) {
    let grid = [];
  
    // Set all tiles to '.' 
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push('.');
      }
      grid.push(row);
    }
  
    // Random number of rooms between 3 and 4
    const numRooms = random(3,5);
  
    let noiseScale = 0.1; //noise level
  
    for (let n = 0; n < numRooms; n++) {
      let roomCenterX = floor(random(numCols / 4, (3 * numCols) / 4));
      let roomCenterY = floor(random(numRows / 4, (3 * numRows) / 4));
      let roomRadiusX = floor(random(5, 15)); // Random room width
      let roomRadiusY = floor(random(5, 15)); // Random room height
  
      // define Lake
      for (let i = -roomRadiusY; i <= roomRadiusY; i++) {
        for (let j = -roomRadiusX; j <= roomRadiusX; j++) {
          let x = roomCenterX + j;
          let y = roomCenterY + i;
          if (x >= 0 && x < numCols && y >= 0 && y < numRows) {
            let distance = dist(j, i, 0, 0);
            let noiseFactor = noise(x * noiseScale, y * noiseScale);
  
            // Use noise to make shape of lake 
            if (distance < (roomRadiusX * noiseFactor) && distance < (roomRadiusY * noiseFactor)) {
              grid[y][x] = '_'; // Fill in the room
            }
          }
        }
      }
    }
  
    // put walls on edges 
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        if (grid[y][x] === '_') {
          // Check adjacent tiles
          if ((y > 0 && grid[y-1][x] === '.') ||
                  (y < numRows - 1 && grid[y+1][x] === '.') ||
                  (x > 0 && grid[y][x-1] === '.') ||
                  (x < numCols - 1 && grid[y][x+1] === '.')) {
            grid[y][x] = 'X';
          }
        }
      }
    }
  
    
    //spawn random chests on floors 
    function spawnChests() {
      // all positioins with floor 
      let floorTiles = [];
  
      // find all floors 
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (grid[i][j] === '.') {
            floorTiles.push({ x: j, y: i });
          }
        }
      }
      // Determine how many chests to spawn
      let numChests = random(3,7); 
  
      // Shuffle floor tiles 
      for (let i = floorTiles.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [floorTiles[i], floorTiles[j]] = [floorTiles[j], floorTiles[i]]; // Swap elements
      }
  
      // pick n chests to spawn 'C'
      for (let i = 0; i < numChests; i++) {
        if (i < floorTiles.length) { 
          let tile = floorTiles[i];
          grid[tile.y][tile.x] = 'C'; // Spawn chest 
        }
      }
    }
    
  
    spawnChests();
    return grid;
  }
  
  function drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        // Drawing context depending on tile type
        if (gridCheck(grid, i, j, "X")) {
          drawContext(grid, i, j, "X", 9, 12);
        }else if (gridCheck(grid, i, j, "_")){
          placeTile(i, j,  random(0,4) | 0, 13);
        }else if (gridCheck(grid, i, j, "C")){
          placeTile(i, j,  27 | 0, random(0,4)|0);
        }else {
          placeTile(i, j,  random(0,4) | 0, 6);
        }
    
      }
    }
  
  }
  
  
  //If location i,j is inside the grid, does grid[i][j]==target? Otherise, return false
  function gridCheck(grid, i, j, target) {
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
      return grid[i][j] === target ? 1 : 0;
    }
    return 0;
  }
  
  // Forms a 4-bit code based on the NSWE neighbors of the tile at (i, j).
  function gridCode(grid, i, j, target) {
    let N = gridCheck(grid, i , j - 1, target);
    let S = gridCheck(grid, i , j + 1, target);
    let E = gridCheck(grid, i - 1, j, target);
    let W = gridCheck(grid, i + 1, j, target);
    return (N << 0) + (S << 1) + (E << 2) + (W<< 3);
  }
  
  // Draws the appropriate tile based on the code.
  function drawContext(grid, i, j, target, ti, tj) {
    let code = gridCode(grid, i, j, target);
    let [tiOffset, tjOffset] = lookup[code];
    placeTile(i, j,  random(0,4) | 0, 13);
    //fix the walls that are facing down and left, and connected walls 
    if((gridCheck(grid, i+1, j, "_")||gridCheck(grid, i+1, j, "C"))&&!gridCheck(grid, i-1, j, "X")){
      [tiOffset, tjOffset] = [1,0];
    }
    if((gridCheck(grid, i, j-1, "_")||gridCheck(grid, i, j-1, "C"))&&!gridCheck(grid, i, j+1, "X")){
      [tiOffset, tjOffset] = [2,1];
    }
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
  