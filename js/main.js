const fish = document.getElementById('character');
const layerFar = document.querySelector('.layer-far');
const layerSand = document.querySelector('.layer-sand');
const layerMid = document.querySelector('.layer-mid');

let mouseX = 0;
let mouseY = 0;
let fishX = 0;
let fishY = 0;

const ease = 0.06; 

// Track mouse position relative to center of screen
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  // 1. Calculate Pufferfish Movement (Smooth Follow)
  let dx = mouseX - fishX;
  let dy = mouseY - fishY;

  fishX += dx * ease;
  fishY += dy * ease;

  // Apply fish transform (centered on mouse)
  fish.style.transform = `translate(${fishX - 75}px, ${fishY - 75}px)`;

  // 2. Calculate Parallax Movement
  // We calculate how far the mouse is from the center of the screen
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const relX = mouseX - centerX;
  const relY = mouseY - centerY;

  // Movement strength: Higher number = moves LESS (feels further away)
  const farX = relX / 60;
  const farY = relY / 60;

  const sandX = relX / 40;
  const sandY = relY / 40;

  const midX = relX / 20;
  const midY = relY / 20;

  // Apply the transforms to the background layers
  layerFar.style.transform = `translate(${farX}px, ${farY}px)`;
  layerSand.style.transform = `translate(${sandX}px, ${sandY}px)`;
  layerMid.style.transform = `translate(${midX}px, ${midY}px)`;
  
  requestAnimationFrame(animate);
}

// Error handling for the fish image
fish.onerror = () => {
    console.error("The browser cannot find the pufferfish image. Check your 'img' folder.");
};

animate();