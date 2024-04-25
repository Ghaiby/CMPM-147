/* exported generateGrid, drawGrid */
/* global placeTile */

// Lookup table for tile offsets 
const lookup2 = [
    [-5,2], [-5,2], [-5,2], [1,2],
    [-5,2], [2,2], [0,2], [-5,2],
    [-5,2], [2,0], [0,0], [-5,2],
    [0,1], [-5,2], [-5,2], [-5,2]
  ];
  
  // Check if room overlaps
  function isOverlap(room, rooms) {
    for (let existing of rooms) {
      if (!(room.startX >= existing.endX || room.endX <= existing.startX ||
            room.startY >= existing.endY || room.endY <= existing.startY)) {
        return true;
      }
    }
    return false;
  }
  
  function generateGrid(numCols, numRows) {
    let grid = [];
    let rooms = [];
  
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
  
    for (let r = 0; r < numRooms; r++) {
      let validRoom = false;
      let roomWidth, roomHeight, roomStartX, roomStartY;
  
      while (!validRoom) {
        // Generate random dimensions and location for each room
        // make rooms atleast 4 by 4
        roomWidth = Math.floor(Math.random() * (numCols / 3 - 4)) + 4;  
        roomHeight = Math.floor(Math.random() * (numRows / 3 - 4)) + 4;
        roomStartX = Math.floor(Math.random() * (numCols - roomWidth));
        roomStartY = Math.floor(Math.random() * (numRows - roomHeight));
  
        let newRoom = {
          startX: roomStartX,
          startY: roomStartY,
          endX: roomStartX + roomWidth,
          endY: roomStartY + roomHeight
        };
  
        // Check if the new room overlaps
        if (!isOverlap(newRoom,rooms)) {
          validRoom = true;
          rooms.push(newRoom); // Add room to rooms array
        }
      }
  
      // Create the walls and floor of the room
      for (let i = roomStartY; i < roomStartY + roomHeight; i++) {
        for (let j = roomStartX; j < roomStartX + roomWidth; j++) {
          if (i === roomStartY || i === roomStartY + roomHeight - 1 || j === roomStartX || j === roomStartX + roomWidth - 1) {
            grid[i][j] = 'X';  // Wall
          } else {
            grid[i][j] = '_';  // Floor
          }
        }
      }
    }
  
    
    //connect rooms
    function connectRooms(grid, rooms) {
      function drawL(x1, y1, x2, y2) {
        // Start from the longer side of the L 
        if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
          drawHorizontal(y1,x1, x2);
          drawVertical(x2, y1, y2);
        } else {
          drawVertical(x1, y1, y2);
          drawHorizontal( y2, x1,x2);
        }
      }
  
      function drawHorizontal(y,x1, x2) {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        for (let x = start; x <= end; x++) {
          grid[y][x] = '_';
        }
      }
  
      function drawVertical(x, y1, y2) {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        for (let y = start; y <= end; y++) {
          grid[y][x] = '_';
        }
      }
  
      for (let i = 0; i < rooms.length - 1; i++) {
        // Connect each room to the next
        let room1 = rooms[i];
        let room2 = rooms[i + 1];
  
        // Calculate center points of each room
        let center1X = Math.floor((room1.startX + room1.endX) / 2);
        let center1Y = Math.floor((room1.startY + room1.endY) / 2);
        let center2X = Math.floor((room2.startX + room2.endX) / 2);
        let center2Y = Math.floor((room2.startY + room2.endY) / 2);
  
        // Draw L from the center of room 1 to room 2 
        drawL(center1X, center1Y, center2X, center2Y);
      }
    }
    
    //spawn random chests on floors 
    function spawnChests() {
      // all positioins with floor 
      let floorTiles = [];
  
      // find all floors 
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (grid[i][j] === '_') {
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
    
    connectRooms(grid, rooms);
    spawnChests();
    return grid;
  }
  
  function drawGrid2(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        // Drawing context depending on tile type
        if (gridCheck(grid, i, j, "X")) {
          drawContext(grid, i, j, "X", 5, 21);
        }else if (gridCheck(grid, i, j, "_")){
          placeTile(i, j,  0, 23);
        }else if (gridCheck(grid, i, j, "C")){
          placeTile(i, j,  random(3,6) | 0, random(28,31)|0);
        }else {
          placeTile(i, j, random(21,24) | 0, random(22,25) | 0);
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
    let [tiOffset, tjOffset] = lookup2[code];
    placeTile(i, j, 0, 23);
    //fix the walls that are facing down and left, and connected walls 
    if((gridCheck(grid, i+1, j, "_")||gridCheck(grid, i+1, j, "C"))&&!gridCheck(grid, i-1, j, "X")){
      [tiOffset, tjOffset] = [1,0];
    }
    if((gridCheck(grid, i, j-1, "_")||gridCheck(grid, i, j-1, "C"))&&!gridCheck(grid, i, j+1, "X")){
      [tiOffset, tjOffset] = [2,1];
    }
    placeTile(i, j, ti + tiOffset, tj + tjOffset);
  }
  