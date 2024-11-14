// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Load the 3D model from specified path
const loader = new THREE.GLTFLoader();
loader.load(
  "../models/BlackjackTable/scene.gltf", // Path to your Blackjack table model
  function (gltf) {
    scene.add(gltf.scene); // Add model to the scene
  },
  undefined,
  function (error) {
    console.error("An error occurred loading the model:", error);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
