const fish = document.getElementById('character');
const layers = [
  { el: document.querySelector('.layer-far'), speed: -0.10 },
  { el: document.querySelector('.layer-sand'), speed: -0.25 },
  { el: document.querySelector('.layer-mid'), speed: -0.55 }
];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let fishX = window.innerWidth / 2;
let fishY = window.innerHeight / 2;

const delay = 0.04;
const buffer = 20;
const puffDuration = 3000;

let currentFishWidth = 75;
window.addEventListener('mousedown', () => {

  fish.src = "./img/PufferfishPuffy.png";
  currentFishWidth = 150;
  fish.style.width = currentFishWidth + "px";

  setTimeout(() => {
    fish.src = "./img/PufferfishSlim.png";
    currentFishWidth = 75;
    fish.style.width = currentFishWidth + "px";
  }, puffDuration);
});

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  fishX += (mouseX - fishX) * delay;
  fishY += (mouseY - fishY) * delay;

  const minX = (currentFishWidth / 2) - buffer;
  const maxX = window.innerWidth - (currentFishWidth / 2) + buffer;
  const minY = (currentFishWidth / 2) - buffer;
  const maxY = window.innerHeight - (currentFishWidth / 2) + buffer;

  if (fishX < minX) fishX = minX;
  if (fishX > maxX) fishX = maxX;
  if (fishY < minY) fishY = minY;
  if (fishY > maxY) fishY = maxY;

  
  const renderX = Math.round(fishX - (currentFishWidth / 2));
  const renderY = Math.round(fishY - (currentFishWidth / 2));
  
  fish.style.transform = `translate3d(${renderX}px, ${renderY}px, 0)`;

  layers.forEach(layer => {
    const bgX = Math.round(fishX * layer.speed);
    layer.el.style.transform = `translate3d(${bgX}px, 0, 0)`;
  });

  requestAnimationFrame(animate);
}

animate();