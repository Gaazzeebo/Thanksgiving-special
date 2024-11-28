// Canvas Setup
const canvas = document.getElementById('leavesCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Leaf Particles
const leafCount = 70;
const leaves = [];
const leafImages = [];

// Load Leaf Images
const leafImageSources = [
  'assets/leaves/leaf1.png',
  'assets/leaves/leaf2.png',
  'assets/leaves/leaf3.png',
];

leafImageSources.forEach((src) => {
  const img = new Image();
  img.src = src;
  leafImages.push(img);
});

class Leaf {
  constructor() {
    this.reset();
  }

  reset() {
    this.image = leafImages[Math.floor(Math.random() * leafImages.length)];
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.size = 20 + Math.random() * 40;
    this.speed = 1 + Math.random() * 3;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = 0.01 + Math.random() * 0.04;
    this.swing = Math.random() * 100;
    this.swingSpeed = 0.02 + Math.random() * 0.04;
  }

  update() {
    this.y += this.speed;
    this.x += Math.sin(this.y * this.swingSpeed) * this.swing * 0.005;
    this.angle += this.spin;

    // Interaction with pointer
    const dx = this.x - pointerX;
    const dy = this.y - pointerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      this.x += dx / distance * 5;
      this.y += dy / distance * 5;
    }

    if (this.y > height) {
      this.reset();
      this.y = -this.size;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = 0.8;
    ctx.drawImage(
      this.image,
      -this.size / 2,
      -this.size / 2,
      this.size,
      this.size
    );
    ctx.restore();
  }
}

// Pointer Interaction
let pointerX = width / 2;
let pointerY = height / 2;

// Mouse Interaction for Desktop
window.addEventListener('mousemove', function (e) {
  pointerX = e.clientX;
  pointerY = e.clientY;
});

// Touch Interaction for Mobile
window.addEventListener('touchmove', function (e) {
  if (e.touches.length > 0) {
    pointerX = e.touches[0].clientX;
    pointerY = e.touches[0].clientY;
  }
}, { passive: false });

// Initialize Leaves After Images Load
Promise.all(leafImages.map(img => new Promise((resolve) => {
  img.onload = resolve;
}))).then(() => {
  for (let i = 0; i < leafCount; i++) {
    leaves.push(new Leaf());
  }
  animate();
});

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, width, height);
  leaves.forEach((leaf) => {
    leaf.update();
    leaf.draw();
  });
  requestAnimationFrame(animate);
}
