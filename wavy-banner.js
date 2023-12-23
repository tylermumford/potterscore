// Copyright (c) 2023 by Shaw (https://codepen.io/shshaw/pen/JbrQrW)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Modified by tylermumford

class WavyBanner extends HTMLElement {
  constructor() {
    super()
    console.log("I'm a wavy banner using " + this.src, this)

    this.mesh = undefined;
    this.cloth = undefined;
    this.spacingX = 5;
    this.spacingY = 5;
    this.accuracy = 1;

    this.opts = {
      image: 'http://localhost:8080/banner-single-ravenclaw.png',
      gravity: 200,
      friction: 0.99,
      bounce: 0.3,
      pointsX: 20,
      pointsY: 22,
      renderCloth: true,
      pinCorners: true,
    };

    this.createElements()
    this.loadTexture()
    this.update()
  }

  get src() { return this.attributes.src.value }
  get width() { return this.attributes.width.value }
  get height() { return this.attributes.height.value }

  createElements(params) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.appendChild(this.canvas)
    this.ctx.strokeStyle = '#555'

    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, { transparent: true });

    this.insertBefore(this.renderer.view, this.canvas);
    this.renderer.render(this.stage);

    this.canvas.width = this.renderer.width;
    this.canvas.height = this.renderer.height;
  }

  loadTexture() {
    console.log('loading texture', this.opts.image);
  
    let texture = new PIXI.Texture.fromImage(this.opts.image);
    if (!texture.requiresUpdate) { texture.update(); }
  
    texture.on('error', function () { console.error('AGH!'); });
  
    texture.on('update', () => {
      console.log('texture loaded in class');
  
      if (this.mesh) { this.stage.removeChild(this.mesh); }
  
      this.mesh = new PIXI.mesh.Plane(texture, this.opts.pointsX, this.opts.pointsY);
      this.mesh.width = this.width;
      this.mesh.height = this.height;
  
      this.spacingX = this.mesh.width / (this.opts.pointsX - 1);
      this.spacingY = this.mesh.height / (this.opts.pointsY - 1);
  
      this.cloth = new Cloth(this.opts.pointsX - 1, this.opts.pointsY - 1, !this.opts.pinCorners, {
        canvas: this.canvas,
        spacingX: this.spacingX,
        spacingY: this.spacingY,
        accuracy: this.accuracy,
        ctx: this.ctx,
        opts: this.opts,
        mesh: this.mesh,
      });
  
      this.stage.addChild(this.mesh);
    });
  }

  update() {
    requestAnimationFrame(() => this.update());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.cloth) { this.cloth.update(0.016) }
    this.renderer.render(this.stage);
  }
}

customElements.define('wavy-banner', WavyBanner)

// All this dead code should be removed
// when wavy-banner is fully self-contained

// let mesh;
// let cloth;
// let spacingX = 5;
// let spacingY = 5;
// let accuracy = 1;

// let opts = {
//   image: 'http://localhost:8080/banner-single-ravenclaw.png',
//   gravity: 200,
//   friction: 0.99,
//   bounce: 0.3,
//   pointsX: 20,
//   pointsY: 22,
//   renderCloth: true,
//   pinCorners: true,
// };


// let gui = new dat.GUI();
// // gui.closed = window.innerWidth < 600;
// gui.closed = true;
// let renderCloth = gui.add(opts, 'renderCloth');

// let gravity = gui.add(opts, 'gravity', 0, 1000).step(20);
// let friction = gui.add(opts, 'friction', 0.5, 1).step(0.005);
// let bounce = gui.add(opts, 'bounce', 0, 2).step(0.1);


// let pin = gui.add(opts, 'pinCorners');
// pin.onChange(loadTexture);

// let canvas = document.createElement('canvas');
// let ctx = canvas.getContext('2d');
// document.body.appendChild(canvas);

// ctx.strokeStyle = '#555';

/*////////////////////////////////////////*/

// let stage = new PIXI.Container();
// let renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });

// document.body.insertBefore(renderer.view, canvas);
// renderer.render(stage);

// canvas.width = renderer.width;
// canvas.height = renderer.height;


/*////////////////////////////////////////*/

// function loadTexture() {

//   console.log('loading texture', opts.image);

//   document.body.className = 'loading';

//   let texture = new PIXI.Texture.fromImage(opts.image);
//   if (!texture.requiresUpdate) { texture.update(); }

//   texture.on('error', function () { console.error('AGH!'); });

//   texture.on('update', function () {
//     document.body.className = '';

//     console.log('texture loaded');

//     if (mesh) { stage.removeChild(mesh); }

//     mesh = new PIXI.mesh.Plane(this, opts.pointsX, opts.pointsY);
//     mesh.width = this.width;
//     mesh.height = this.height;

//     spacingX = mesh.width / (opts.pointsX - 1);
//     spacingY = mesh.height / (opts.pointsY - 1);

//     cloth = new Cloth(opts.pointsX - 1, opts.pointsY - 1, !opts.pinCorners);

//     stage.addChild(mesh);
//   });
// }

// loadTexture(opts.image);

// ; (function update() {
//   requestAnimationFrame(update);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   if (cloth) { cloth.update(0.016) }
//   renderer.render(stage);
// })(0)

/*////////////////////////////////////////*/

class Point {
  constructor(x, y, { canvas, ctx, spacingX, opts }) {
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.vx = 0
    this.vy = 0
    this.pinX = null
    this.pinY = null

    this.constraints = []

    this.canvas = canvas
    this.ctx = ctx
    this.spacingX = spacingX
    this.opts = opts
  }

  update(delta) {
    if (this.pinX && this.pinY) return this

    this.addForce(0, this.opts.gravity)

    let nx = this.x + (this.x - this.px) * this.opts.friction + this.vx * delta
    let ny = this.y + (this.y - this.py) * this.opts.friction + this.vy * delta

    this.px = this.x
    this.py = this.y

    this.x = nx
    this.y = ny

    this.vy = this.vx = 0

    if (this.x >= this.canvas.width) {
      this.px = this.canvas.width + (this.canvas.width - this.px) * this.opts.bounce
      this.x = this.canvas.width
    } else if (this.x <= 0) {
      this.px *= -1 * this.opts.bounce
      this.x = 0
    }

    if (this.y >= this.canvas.height) {
      this.py = this.canvas.height + (this.canvas.height - this.py) * this.opts.bounce
      this.y = this.canvas.height
    } else if (this.y <= 0) {
      this.py *= -1 * this.opts.bounce
      this.y = 0
    }

    return this
  }

  draw() {
    let i = this.constraints.length
    while (i--) this.constraints[i].draw()
  }

  resolve() {
    if (this.pinX && this.pinY) {
      this.x = this.pinX
      this.y = this.pinY
      return
    }

    this.constraints.forEach((constraint) => constraint.resolve())
  }

  attach(point) {
    this.constraints.push(new Constraint(this, point, undefined, { ctx: this.ctx, spacingX: this.spacingX }))
  }

  free(constraint) {
    this.constraints.splice(this.constraints.indexOf(constraint), 1)
  }

  addForce(x, y) {
    this.vx += x
    this.vy += y
  }

  pin(pinx, piny) {
    this.pinX = pinx
    this.pinY = piny
  }

  unpin() {
    this.pinX = null;
    this.pinY = null;
  }
}

/*////////////////////////////////////////*/

class Constraint {
  constructor(p1, p2, length, { ctx, spacingX }) {
    this.p1 = p1
    this.p2 = p2
    this.length = length || spacingX

    this.ctx = ctx
  }

  resolve() {
    let dx = this.p1.x - this.p2.x
    let dy = this.p1.y - this.p2.y
    let dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < this.length) return

    let diff = (this.length - dist) / dist

    //if (dist > tearDist) this.p1.free(this)

    let mul = diff * 0.5 * (1 - this.length / dist)

    let px = dx * mul
    let py = dy * mul

    !this.p1.pinX && (this.p1.x += px)
    !this.p1.pinY && (this.p1.y += py)
    !this.p2.pinX && (this.p2.x -= px)
    !this.p2.pinY && (this.p2.y -= py)

    return this
  }

  draw() {
    this.ctx.moveTo(this.p1.x, this.p1.y)
    this.ctx.lineTo(this.p2.x, this.p2.y)
  }
}

/*////////////////////////////////////////*/

let count = 0;

class Cloth {
  constructor(clothX, clothY, free, { canvas, spacingX, spacingY, accuracy, ctx, opts, mesh }) {
    this.points = []
    this.accuracy = accuracy;
    this.ctx = ctx;
    this.opts = opts;
    this.mesh = mesh;

    let startX = canvas.width / 2 - clothX * spacingX / 2;
    let startY = canvas.height * 0.2;

    for (let y = 0; y <= clothY; y++) {
      for (let x = 0; x <= clothX; x++) {
        let point = new Point(
          startX + x * spacingX - (spacingX * Math.sin(y)),
          y * spacingY + startY + (y !== 0 ? 5 * Math.cos(x) : 0),
          { canvas, ctx, spacingX, opts }
        )
        !free && y === 0 && point.pin(point.x, point.y)
        x !== 0 && point.attach(this.points[this.points.length - 1])
        y !== 0 && point.attach(this.points[x + (y - 1) * (clothX + 1)])

        this.points.push(point)
      }
    }

  }

  update(delta) {
    let i = this.accuracy

    while (i--) {
      this.points.forEach((point) => {
        point.resolve()
      })
    }

    this.ctx.beginPath();

    this.points.forEach((point, i) => {
      point.update(delta * delta)

      if (this.opts.renderCloth) { point.draw(); }

      if (this.mesh) {
        i *= 2;
        this.mesh.vertices[i] = point.x;
        this.mesh.vertices[i + 1] = point.y;
      }
    });

    this.ctx.stroke()
  }
}
