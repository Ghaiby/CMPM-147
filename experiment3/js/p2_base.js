/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed2 = 0;
let tilesetImage2;
let currentGrid2 = [];
let numRows2, numCols2;

function preload() {
  tilesetImage2 = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed2 = (seed2 | 0) + 1109;
  randomSeed(seed2);
  noiseSeed(seed2);
  select("#seedReport").html("seed " + seed2);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols2, numRows2)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid2 = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols2 = select("#asciiBox").attribute("rows") | 0;
  numRows2 = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols2, 16 * numRows2).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed2);
  drawGrid(currentGrid2);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage2, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}


