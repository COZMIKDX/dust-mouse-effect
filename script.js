let particle_x = 5;
let particle_y = 5;
let particle_1 = [
  1,1,0,1,1,
  1,0,1,0,1,
  0,1,0,1,0,
  1,0,1,0,1,
  1,1,0,1,1
]

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


var dotList = [];

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
    particle.x = x2;
    particle.y = y2;
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
    this.particleDiv = particleDiv;
  }
  
  moveX(x) {
    this.elem.style.left = x + 'px';
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


//////////////////////////////////////////////////////////////
// Example Usage
//////////////////////////////////////////////////////////////

let prevX = 0;
let PrevY = 0;
addEventListener('mousemove', (e) => {
  if (Math.abs(prevX - e.x) > 50  || Math.abs(prevY - e.y) > 50) {
    prevX = e.x;
    prevY = e.y;
  
  let pixelScale = 1
  let gridBuilder = new PixelGridBuilder(pixelScale, (pixelScale - 1) / 2);
  let particleBuilder = new ParticleBuilder();
  
  let imageData = gridBuilder.generatePixelGrid(particle_1, particle_x, particle_y);
  let newParticle = particleBuilder.createParticle(e.x, e.y, imageData); //new particle(e.x, e.y, imageData);
  
  dotList.push(newParticle);
  if (dotList.length > 20) {
    let removedDot = dotList.shift();
    removedDot.deleteParticle();
  }
  }
});

function draw() {
  dotList.forEach((item) => {
    item.moveY(1);
  });
}

function animate() {
  draw();
  requestAnimationFrame(animate);
}

animate();

//setInterval(draw, 33);
