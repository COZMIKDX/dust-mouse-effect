let particle_x = 5;
let particle_y = 5;
let particle_1 = [
  0,1,0,1,1,
  1,0,1,0,1,
  0,1,0,1,0
]

class BitmapArrayDraw {
  constructor(pixelScale = 1, pixelSpacing = 0) {
    this.pixelScale = pixelScale;
    this.pixelSpacing = pixelSpacing;
    this.spacingOffset = pixelSpacing * 2 + 1;
  }
  
  bmpDraw(bitmap, width, height) {
    let newBitmap = []
    
    for (let row = 0; row < width; row++){
      for (let column = 0; column < height; column++){
        let point = [row, column]; 
        let k = row + column * height;
        if (bitmap[k] == 1) {
          let newPoint = point.map((entry) => {
              if (entry == 0) {
                return this.pixelSpacing;
              } else {
                return entry * this.spacingOffset + this.pixelSpacing;
              }
            });
          
          let newX = newPoint[0] - (this.pixelScale / 2);
          let newY = newPoint[1] - (this.pixelScale / 2);
          let pixelData = {
            x: newX,
            y: newY,
            width: this.pixelScale,
            height: this.pixelScale,
          }
          newBitmap.push(pixelData);
          // draw(newX, newY, this.pixelScale, this.pixelScale);
          // ctx.fillRect(newPoint[0] - (pixelScale / 2), newPoint[1] - (pixelScale / 2), pixelScale, pixelScale);
        }
      }
    }
    
    return newBitmap;
  }
}


var dotList = [];

class particle {
  constructor(x, y, bitmap, width, height, pixelScale, pixelSpacing) {
    this.x = x;
    this.y = y;
    this.pixels = []; 
    this.particleDiv;
    
    // Create particle data on construction.
    //this.createParticle(x,y);
    this.bmpConverter = new BitmapArrayDraw(pixelScale, pixelSpacing);
    this.createParticleFromBitmap(x, y, bitmap, width, height);
    
    this.createPixel = this.createPixel.bind(this);
    this.createPixel2 = this.createPixel2.bind(this);
  }
  
  createParticle (x, y) {
    //this.pixels.push(this.createPixel(x, y - 2));
    //this.pixels.push(this.createPixel(x, y + 2));
   // this.pixels.push(this.createPixel(x - 2, y));
    //this.pixels.push(this.createPixel(x + 2, y));
    let pixels = []
    pixels.push(this.createPixel(2, 0));
    pixels.push(this.createPixel(0, 2));
    pixels.push(this.createPixel(4, 2));
    pixels.push(this.createPixel(2, 4));
    
    this.particleDiv = document.createElement('div');
    this.particleDiv.className = 'dust-div';
    this.x = x - 2;
    this.y = y + 2;
    this.particleDiv.style.left = this.x + 'px';
    this.particleDiv.style.top = this.y + 'px';
    for (const pixel of pixels) {
      this.particleDiv.appendChild(pixel);  
    }
    document.body.appendChild(this.particleDiv);
  }
  
  createParticleFromBitmap(x, y, bitmap, width, height) {
    this.particleDiv = document.createElement('div');
    this.particleDiv.className = 'dust-div';
    this.x = x;
    this.y = y;
    this.particleDiv.style.left = this.x + 'px';
    this.particleDiv.style.top = this.y + 'px';
    
    let coordinateData = this.bmpConverter.bmpDraw(bitmap, width, height);
    console.log(coordinateData);
    for (const point of coordinateData) {
      let newPixel = this.createPixel2(point.x, point.y, point.width, point.height);
      this.particleDiv.appendChild(newPixel);
    }
    document.body.appendChild(this.particleDiv);
  }
  
  createPixel(x, y) {
    let pixel = document.createElement('div');
    pixel.className = 'dust-pixel';
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    return pixel
  }
  
  createPixel2(x, y, width, height) {
    let pixel = document.createElement('div');
    pixel.className = 'dust-pixel2';
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    pixel.style.width = width + 'px';
    pixel.style.height = height + 'px';
    return pixel
  }
  
  moveX(x) {
    this.elem.style.left = x + 'px';
  }
  
  moveY(y) {
    this.y = this.y + y;
    //// this.elem.style.top = this.y + 'px';
    //for (const pixel of this.pixels) {1
    //  pixel.style.top = this.y + 'px';
    //}
    
    this.particleDiv.style.top = this.y + 'px';
  }
  
  deleteParticle() {
    this.pixels = [];
    this.particleDiv.remove(); // Removes child elements too.
  }
}




addEventListener('mousemove', (e) => {
  /*let newParticle = new particle(e.x, e.y);
  dotList.push(newParticle);
  if (dotList.length > 20) {
    let removedDot = dotList.shift();
    removedDot.deleteParticle();
  }*/
  
  let newParticle = new particle(e.x, e.y, particle_1, particle_x, particle_y, 8,4);
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

// animate();

setInterval(draw, 33);
