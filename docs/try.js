// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load custom Blackjack table model
const loader = new THREE.GLTFLoader();
loader.load(
  "../models/BlackjackTable/scene.gltf", // Assuming your model is in GLTF format
  (gltf) => {
    const blackjackTable = gltf.scene;
    blackjackTable.position.set(0, -1, 0); // Adjust as needed
    blackjackTable.scale.set(1, 1, 1); // Adjust scale if necessary
    scene.add(blackjackTable);
  },
  undefined,
  (error) => {
    console.error("An error happened while loading the model:", error);
  }
);

// Initial camera position and alternate camera position
const defaultPosition = { x: 0, y: 5, z: 10 };
const altPosition = { x: 5, y: 8, z: 2 };
let isDefaultView = true;

// Set up lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// Smooth camera transition function
function smoothTransition(targetPosition) {
  new TWEEN.Tween(camera.position)
    .to(targetPosition, 1000) // Transition time in ms
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => camera.lookAt(0, 0, 0))
    .start();
}

// Toggle camera view on Enter key press
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    isDefaultView = !isDefaultView;
    const targetPosition = isDefaultView ? defaultPosition : altPosition;
    smoothTransition(targetPosition);
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update(); // Update Tween animations
  renderer.render(scene, camera);
}

animate();
