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
  [150,42,42,100],
  [155,42,42,100],
  [165,42,42,100],
  [160,42,42,100]                    
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
    let newG = color[1] + floor(random(-10, 10));
    let newB = color[2] + floor(random(-10, 10));
    newG = constrain(newG, 0, 255); 
    newB = constrain(newB, 0, 255);
    return [color[0], newG, newB, color[3]]; 
  });
}


function p3_preload() {
  waterImg = loadImage('https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/road_dirt_xing_damaged.png?v=1714625883168');
  sandImg = loadImage('https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/ground_asphalt_damaged.png?v=1714625908181');
  grassImg = loadImage("https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/ground_grass_damaged.png?v=1714625851673");
  Ypirate = loadImage("https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/car_yellow_a_damaged.png?v=1714625757959");
  Gpirate = loadImage("https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/car_white_a_damaged.png?v=1714625802726");
  Rpirate = loadImage("https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/car_peach_a_damaged.png?v=1714625746559");
  Bpirate = loadImage("https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/truck_blue_a_damaged.png?v=1714625780310");
  boatImg = loadImage("https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/school_bus_b_damaged.png?v=1714625724258");
  pirateImages = [Ypirate, Gpirate, Rpirate, Bpirate];
  chestImg = loadImage("https://cdn.glitch.global/baacb5a6-ee4a-4271-b027-a885e667603d/house_large_brown_a_damaged.png?v=1714625828890");
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
      if(grassNoiseValue > 0.7){
        image(chestImg, -tw, -th, 1.7*tw, 1.7*th);
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
        image(boatImg, -tw, -th, 1.2*tw, 1.2*th); 
      }
    }

  }

  let key = [i, j].toString();
  let tileData = clicks[key];
  if (tileData && tileData.count % 2 == 1) {
    image(pirateImages[tileData.imageIndex], -tw, -th, 1.55*tw, 1.55*th); // draw pirate 
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
