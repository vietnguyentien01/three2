import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";

const rederer = new THREE.WebGLRenderer();

rederer.shadowMap.enabled = true;

rederer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(rederer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);

const orbit = new OrbitControls(camera, rederer.domElement);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

camera.position.set(10, 10, 10);
orbit.update();

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener("mousemove", function (e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

window.addEventListener("click", function (e) {
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    metalness: 0,
    roughness: 0,
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  sphereMesh.position.copy(intersectionPoint);
});

function animate() {
  rederer.render(scene, camera);
}

rederer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  rederer.setSize(window.innerWidth, window.innerHeight);
});
