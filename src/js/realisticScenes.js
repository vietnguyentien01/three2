import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const hdrTextureURL = new URL(
  "../img/MR_INT-003_Kitchen_Pierre.hdr",
  import.meta.url
);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-10, 10, 0);
orbit.update();

// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

const loader = new RGBELoader();
loader.load(hdrTextureURL, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 0.5,
      color: 0xfffa00,
    })
  );
  sphere.position.x = 1.5;
  scene.add(sphere);

  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 0.5,
      color: 0x00ff00,
      //   envMap: texture,
    })
  );
  sphere2.position.x = -1.5;
  scene.add(sphere2);
});

function animate() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
