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
const leafCount = 50;
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

    // Interaction with mouse
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      this.x += dx / distance * 5;
      this.y += dy / distance * 5;
    }

    if (this.y > height) {
      this.reset();
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

// Mouse Interaction
let mouseX = width / 2;
let mouseY = height / 2;

window.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

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

// Button Events
document.getElementById('exploreButton').addEventListener('click', () => {
  window.open('https://www.gaazzeebo.com', '_blank');
});

// Music Control
const music = document.getElementById('backgroundMusic');
const musicControl = document.getElementById('musicControl');
let musicPlaying = false;

musicControl.addEventListener('click', () => {
  if (musicPlaying) {
    music.pause();
    musicControl.textContent = 'Play Music';
  } else {
    music.play();
    musicControl.textContent = 'Pause Music';
  }
  musicPlaying = !musicPlaying;
});

// Countdown Timer
function updateCountdown() {
  const countdownElement = document.getElementById('countdown');
  const thanksgivingDate = new Date('November 28, 2024 00:00:00'); // Update the date accordingly
  const now = new Date();
  const diff = thanksgivingDate - now;

  if (diff <= 0) {
    countdownElement.textContent = "Happy Thanksgiving!";
    clearInterval(countdownInterval);
  } else {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdownElement.textContent = `Time until Thanksgiving: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Social Sharing
document.getElementById('shareFacebook').addEventListener('click', () => {
  const url = encodeURIComponent(window.location.href);
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(facebookShareUrl, '_blank');
});

document.getElementById('shareTwitter').addEventListener('click', () => {
  const text = encodeURIComponent('Check out this amazing Thanksgiving greeting from Gaazzeebo!');
  const url = encodeURIComponent(window.location.href);
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  window.open(twitterShareUrl, '_blank');
});
