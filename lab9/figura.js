let scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enablePan = false;

controls.minDistance = 5;
controls.maxDistance = 20;

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 10, 7);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const material = new THREE.MeshPhysicalMaterial({
  color: 0xd8d8d8,    
  roughness: 0.2,     
});


const bishop = new THREE.Group();


const baseBottom = new THREE.Mesh(
  new THREE.CylinderGeometry(1.1, 1.2, 0.3, 64),
  material
);

const baseTop = new THREE.Mesh(
  new THREE.CylinderGeometry(0.9, 1.0, 0.25, 64),
  material
);

baseTop.position.y = 0.22;


const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.45, 0.75, 3.5, 64),
  material
);

body.position.y = 2;

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(0.42, 0.40, 20, 100),
  material
);

ring.rotation.x = Math.PI / 2;
ring.position.y = 3.0;


const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.65, 64, 64),
  material
);

head.position.y = 4.2;


const topBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.18, 32, 32),
  material
);

topBall.position.y = head.position.y+0.75; 




bishop.add(baseBottom);
bishop.add(baseTop);
bishop.add(body);
bishop.add(ring);
bishop.add(head);
bishop.add(topBall);

bishop.position.y = -3;

scene.add(bishop);


function animate() {
  requestAnimationFrame(animate);
  controls.update();

  //bishop.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();