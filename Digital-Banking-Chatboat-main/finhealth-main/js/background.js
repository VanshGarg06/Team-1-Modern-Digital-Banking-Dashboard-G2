const bg = document.createElement("canvas");
bg.id = "bg-canvas";
document.body.appendChild(bg);

const ctx = bg.getContext("2d");
let w, h;
let particles = [];

function resize() {
  w = bg.width = window.innerWidth;
  h = bg.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = Math.random() * 0.4 - 0.2;
    this.vy = Math.random() * 0.4 - 0.2;
    this.size = Math.random() * 2;
  }
  move(mx, my) {
    this.x += this.vx + mx * 0.0003;
    this.y += this.vy + my * 0.0003;
    if (this.x < 0) this.x = w;
    if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h;
    if (this.y > h) this.y = 0;
  }
  draw() {
    ctx.fillStyle = "#00ff9c";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

for (let i = 0; i < 200; i++) particles.push(new Particle());

let mx = 0, my = 0;
document.addEventListener("mousemove", e => {
  mx = e.clientX - w / 2;
  my = e.clientY - h / 2;
});

function animate() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.move(mx, my);
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();
