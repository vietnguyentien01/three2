import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import * as CANNON from "cannon-es";

const rederer = new THREE.WebGLRenderer({ antialias: true });

rederer.setSize(window.innerWidth, window.innerHeight);

rederer.shadowMap.enabled = true;

document.body.appendChild(rederer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, rederer.domElement);

camera.position.set(0, 2, 12);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);
directionalLight.castShadow = true;

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });

const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
scene.add(planeMesh);
planeMesh.receiveShadow = true;

const planePhysMat = new CANNON.Material();
const planeBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.001)),
  material: planePhysMat,
});
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(planeBody);

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

const meshes = [];
const bodies = [];

window.addEventListener("click", function (e) {
  const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    metalness: 0,
    roughness: 0,
  });

  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  //   sphereMesh.position.copy(intersectionPoint);
  sphereMesh.castShadow = true;

  const spherePhysMat = new CANNON.Material();
  const sphereBody = new CANNON.Body({
    mass: 0.3,
    shape: new CANNON.Sphere(0.125),
    position: new CANNON.Vec3(
      intersectionPoint.x,
      intersectionPoint.y,
      intersectionPoint.z
    ),
    material: spherePhysMat,
  });
  world.addBody(sphereBody);

  const planeSphereContactMat = new CANNON.ContactMaterial(
    planePhysMat,
    spherePhysMat,
    { restitution: 0.6 }
  );

  world.addContactMaterial(planeSphereContactMat);

  meshes.push(sphereMesh);
  bodies.push(sphereBody);
});

const timeStep = 1 / 60;

function animate() {
  world.step(timeStep);

  planeMesh.position.copy(planeBody.position);
  planeMesh.quaternion.copy(planeBody.quaternion);

  for (let i = 0; i < meshes.length; i++) {
    meshes[i].position.copy(bodies[i].position);
    meshes[i].quaternion.copy(bodies[i].quaternion);
  }

  rederer.render(scene, camera);
}

rederer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  rederer.setSize(window.innerWidth, window.innerHeight);
});
