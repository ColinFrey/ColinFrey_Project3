const fish = document.getElementById('character');

let mouseX = 0;
let mouseY = 0;
let fishX = 0;
let fishY = 0;

const ease = 0.06; 

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {

  let dx = mouseX - fishX;
  let dy = mouseY - fishY;

  fishX += dx * ease;
  fishY += dy * ease;


  fish.style.transform = `translate(${fishX - 75}px, ${fishY - 75}px)`;
  
  requestAnimationFrame(animate);
}

fish.onerror = () => {
    console.error("The browser cannot find the image. Check if 'img/PufferfishSlim.jpeg' exists.");
};

animate();