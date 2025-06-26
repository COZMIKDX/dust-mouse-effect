

class PixelGridBuilder {
  constructor(pixelScale = 1, pixelSpacing = 0) {
    // The width and height of the pixel.
    this.pixelScale = pixelScale;
    
    // The amount of pixels around the center. pixelScale=1 would be make 3x3 square.
    this.pixelSpacing = pixelSpacing;
    
    // The amount of pixels away the next generated pixel centerpoint is from the previous one.
    // This is equal to the width or height of the square created by your choice of pixelSpacing.
    // Make your pixelScale the same value as this to get reduce the gap.
    this.spacingOffset = pixelSpacing * 2 + 1;
  }
  
  generatePixelGrid(bitmap, width, height) {
    let newBitmap = []
    
    // Go through each entry in the image array. Each represents one pixel and the rows and columns are coordinates.
    for (let row = 0; row < width; row++){
      for (let column = 0; column < height; column++){
        let point = [row, column];
        let k = row + column * height;
        if (bitmap[k] == 1) {
          let newPoint = point.map((entry) => {
              if (entry == 0) {
                // part of coordinate is next to edge. Apply pixelSpacing only.
                return this.pixelSpacing;
              } else {
                // part of coordinate is not next to edge.
                // Calculate new value. SpacingOffset is the size of the square around a point due to pixelSpacing.
                // Multiple that by the number of squares you want to offset by. Add pixel spacing for spacing.
                return entry * this.spacingOffset + this.pixelSpacing;
              }
            });
          
          // subtract the coordinate value by pixelSpacing
          let pixelData = {
            x: newPoint[0] - this.pixelSpacing,
            y: newPoint[1] - this.pixelSpacing,
            width: this.pixelScale,
            height: this.pixelScale,
          }
          newBitmap.push(pixelData);
        }
      }
    }
    
    return newBitmap;
  }
}


class ParticleBuilder {
  constructor() {
    
  }
  
  createParticle(x, y, pixelGridData, offset = 0) {
    let particleDiv = document.createElement('div');
    let x2 = x + offset;
    let y2 = y + offset;
    
    particleDiv.className = 'dust-div';
    particleDiv.style.left = x2 + 'px';
    particleDiv.style.top = y2 + 'px';
    
    for (const point of pixelGridData) {
      let newPixel = this.createPixel(point.x, point.y, point.width, point.height);
      particleDiv.appendChild(newPixel);
    }
    
    // TODO: decide if I want this here or have it be done outside, so you can choose which DOM object to append to.
    document.body.appendChild(particleDiv);
    
    let particle = new Particle(x, y, particleDiv);
    //particle.x = x2; // temp adjustment for offset testing.
    //particle.y = y2;
    return particle;
  }
  
  createPixel(x, y, width, height) {
    let pixel = document.createElement('div');
    pixel.className = 'dust-pixel2';
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    pixel.style.width = width + 'px';
    pixel.style.height = height + 'px';
    return pixel
  }
}

class Particle {
  constructor(x, y, particleDiv) {
    this.x = x;
    this.y = y;
    this.xTrigger = 0
    
    this.particleDiv = particleDiv;
    this.xSpeed = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
  }
  
  moveX(speed = 0) {    
    this.x = this.x + speed;
    this.particleDiv.style.left = this.x + 'px';
    
  }
  
  moveY(y) {
    this.y = this.y + y;  
    this.particleDiv.style.top = this.y + 'px';
  }
  
  deleteParticle() {
    this.pixels = [];
    this.particleDiv.remove(); // Removes child elements too.
  }
}

class AnimatedParticle {
  constructor(particle, multiFrameImageData, animationSpeed = 1000) {
    this.frame = 0;
    this.animationSpeed = animationSpeed;
    this.multiFrameImageData = multiFrameImageData; //Should just be a reference to the original.
    this.particle = particle;
    this.particleBuilder = new ParticleBuilder();
  }
  
  updateParticle(newParticle) {
    this.particle = newParticle;
    this.frame
  }
}
//////////////////////////////////////////////////////////////
// Example Usage
//////////////////////////////////////////////////////////////
var dotList = [];
let prevX = 0;
let prevY = 0;

let pixelScale = 1
let gridBuilder = new PixelGridBuilder(pixelScale, (pixelScale - 1) / 2);
let particleBuilder = new ParticleBuilder();

// Image data
let particle_x = 5; // width
let particle_y = 5; // height
let particle_1 = [
  0,0,1,0,0,
  0,0,1,0,0,
  1,1,1,1,1,
  0,0,1,0,0,
  0,0,1,0,0
]
let imageData = gridBuilder.generatePixelGrid(particle_1, particle_x, particle_y);

let multiFrame = [
  [
    1,1,0,1,1,
    1,0,1,0,1,
    0,1,0,1,0,
    1,0,1,0,1,
    1,1,0,1,1
  ],
  [
    0,0,0,0,0,
    0,1,0,1,0,
    0,0,1,0,0,
    0,1,0,1,0,
    0,0,0,0,0
  ],
  [
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,1,0,0,
    0,0,0,0,0,
    0,0,0,0,0
  ]
]

let animatedImage = multiFrame.map((entry) => {
  let imageData = gridBuilder.generatePixelGrid(entry, particle_x, particle_y);
  return imageData;
});


addEventListener('mousemove', (e) => {
  if (Math.abs(prevX - e.x) > 1  || Math.abs(prevY - e.y) > 1) {
    prevX = e.x;
    prevY = e.y;

    let newParticle = particleBuilder.createParticle(e.x, e.y, imageData); //new particle(e.x, e.y, imageData);

    // Hold onto particle objects and limit the amount.
    dotList.push(newParticle);
    /*if (dotList.length > 100) {
      let removedDot = dotList.shift();
      removedDot.deleteParticle();
    }*/
  }
});

function draw() {
  dotList.forEach((item) => {
    let min = 0;
    let max = 3;
    if (!item.direction) {
      item.direction = Math.random() < 0.5 ? (-1) : 1;  
      item.speed = Math.random() * .2;
    }
    
    item.moveX(item.speed * item.direction);
    item.moveY(0.5);
    
    
  });
}

function animate() {
  draw();
  requestAnimationFrame(animate);
}

//animate();

setInterval(draw, 16);
