"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let waterColors = [
  [90,255,251,160],
  [0,233,247,160],
  [39,234,225,160],
  [0,201,203,160]                    
];

let newWaterColors = []; 

let boatImg;
let waterImg;
let sandImg;
let grassImg;
let Ypirate;
let Gpirate;
let Rpirate;
let Bpirate;
let pirateImages;
let chestImg; 
function isEdgeTile(i, j, sandThreshold, noiseScale) {
  // Check all tiles excpet for this one to see if one is water, if yes return true 
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di === 0 && dj === 0) continue; // Skip this tile (i,j)
      let neighborNoise = noise((i + di) * noiseScale, (j + dj) * noiseScale);
      if (neighborNoise <= sandThreshold) {
        return true; // (i,j) is an edge 
      }
    }
  }
  return false; // Not an edge tile
}

//Applies noise to the colors of the water
function getNoiseColor(x, y, colors) {
  
  let noiseVal = noise(x * 0.25, y * 0.25); 

  let index = floor(map(noiseVal, 0, 1, 0, colors.length));

  // Retrieve and return the selected color from the array
  return colors[index];
}

//change colors of water based on key 
function adjustWaterColors() {

  newWaterColors = waterColors.map(color => {
    let newG = color[1] + floor(random(-35, 35));
    let newB = color[2] + floor(random(-35, 35));
    newG = constrain(newG, 0, 255); 
    newB = constrain(newB, 0, 255);
    return [color[0], newG, newB, color[3]]; 
  });
}


function p3_preload() {
  waterImg = loadImage('.Assets/water.png');
  sandImg = loadImage('.Assets/sand.png');
  grassImg = loadImage(".Assets/grass.png");
  Ypirate = loadImage(".Assets/p1");
  Gpirate = loadImage(".Assets/p2");
  Rpirate = loadImage(".Assets/p3");
  Bpirate = loadImage(".Assets/p4");
  boatImg = loadImage(".Assets/ship.png");
  pirateImages = [Ypirate, Gpirate, Rpirate, Bpirate];
  chestImg = loadImage("Assets/chest.png");
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  adjustWaterColors();
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j].toString();
  if (!clicks[key]) {
    clicks[key] = { count: 1, imageIndex: floor(random(pirateImages.length)) }; // store count and random image for pirates 
  } else {
    clicks[key].count++;
    clicks[key].imageIndex = floor(random(pirateImages.length));
  }
}

function p3_drawBefore() {
}

function p3_drawTile(i, j) {
  noStroke();
  
  let grassNoiseScale = 0.15;
  let grassThreshold = 0.63;
  
  let sandNoiseScale = 0.15;
  let sandThreshold = 0.55;

  let sandNoiseValue = noise(i * sandNoiseScale, j * sandNoiseScale);
  let grassNoiseValue = noise(i * grassNoiseScale, j * grassNoiseScale);
  
  
  let boatNoiseScale = 0.15;
  let boatThreshold = 0.2;

  let boatNoiseValue = noise(i * boatNoiseScale, j * boatNoiseScale);

  //if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
  if (sandNoiseValue > sandThreshold) {  
    
    let edge = isEdgeTile(i, j, sandThreshold, sandNoiseScale);

    // Draw grass or sand 
    if (!edge && grassNoiseValue > grassThreshold) {
      image(grassImg, -tw, -th, 2*tw, 2*th);
      if(grassNoiseValue > 0.76){
        image(chestImg, -tw, -th, 1.5*tw, 1.5*th);
      }
    } else {
      image(sandImg, -tw, -th, 2*tw, 2*th); 
    }
    
  } else {
    //draw water tile before color 
    image(waterImg, -tw, -th, 2*tw, 2*th);
    //add color on top
    const water = getNoiseColor(i, j, newWaterColors);
    fill(...water);
    push();

    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
    pop();
    
    if(sandNoiseValue < 0.22){
      if(boatNoiseValue > boatThreshold){
        image(boatImg, -tw, -th, 1.5*tw, 1.5*th); 
      }
    }

  }

  let key = [i, j].toString();
  let tileData = clicks[key];
  if (tileData && tileData.count % 2 == 1) {
    image(pirateImages[tileData.imageIndex], -tw, -th, 2*tw, 2*th); // draw pirate 
  }

}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {

}
