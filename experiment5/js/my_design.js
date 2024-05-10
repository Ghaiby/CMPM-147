/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
    return [
      {
        name: "Eye",
        assetUrl:
          "https://cdn.glitch.global/17900799-26c5-47ce-94b5-293023788dd9/insp11.jpeg?v=1715314716482",
        credit: "BBC",
      },
      {
        name: "Pier",
        assetUrl:
          "https://cdn.glitch.global/17900799-26c5-47ce-94b5-293023788dd9/insp33.jpeg?v=1715314655997",
        credit: "Buisness Insider",
      },
      {
        name: "Flower",
        assetUrl:
          "https://cdn.glitch.global/17900799-26c5-47ce-94b5-293023788dd9/insp22.jpeg?v=1715314649559",
        credit: "Stadium Talk",
      },
      {
        name: "Disaster Girl",
        assetUrl:
          "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
        credit: "Four-year-old Zoë Roth, 2005",
      },
    ];
  }
  
  function initDesign(inspiration) {
    
    let num_shapes = 100;
    let width_scale  = 4;
    let height_scale = 4; 
    
    
    // Load inspiring Image
    let img = loadImage(inspiration.assetUrl, () => {
      img.resize(width / 2, height / 2); // Resize the image
    });
  
    let design = {
      bg: 128, // Gray background
      fg: [],
    };
  
    img.loadPixels();
  
    // Create shapes with colors based on image pixels
    for (let i = 0; i < num_shapes; i++) {
      let x = random(width);
      let y = random(height);
  
      // Get the grayscale value from the corresponding image pixel
      let imgX = int(map(x, 0, width, 0, img.width));
      let imgY = int(map(y, 0, height, 0, img.height));
      let imgIndex = (imgY * img.width + imgX) * 4;
  
      let r = img.pixels[imgIndex];
      let g = img.pixels[imgIndex + 1];
      let b = img.pixels[imgIndex + 2];
      let grayscale = (r + g + b) / 3;
  
      design.fg.push({
        x: x,
        y: y,
        w: random(width / width_scale),
        h: random(height / height_scale),
        fill: grayscale,
      });
    }
  
    return design;
  }
  
  function renderDesign(design, inspiration) {
    // Background color gray
    background(design.bg);
  
    noStroke();
    for (let box of design.fg) {
      // Render each shape with grayscale fill
      fill(box.fill);
      if(inspiration.name == "Pier"){
        rect(box.x, box.y, box.w, box.h);
      }else{
        ellipse(box.x, box.y, box.w, box.h);
      }
    }
  }
  
  function mutateDesign(design, inspiration, rate) {
    // Mutate the background within grayscale range
    design.bg = mut(design.bg, 0, 255, rate);
  
  
    for (let box of design.fg) {
      box.fill = mut(box.fill, 0, 255, rate);
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 0, width / 2, rate);
      box.h = mut(box.h, 0, height / 2, rate);
    }
  }
  
  function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
  }
  