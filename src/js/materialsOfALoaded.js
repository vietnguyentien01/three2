import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import * as dat from "dat.gui";

const fileUrl = new URL("../assets/Donkey.gltf", import.meta.url);

const rederer = new THREE.WebGLRenderer();

rederer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(rederer.domElement);

rederer.setClearColor(0xffffff);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, rederer.domElement);

camera.position.set(-10, 30, 30);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);

const grid = new THREE.GridHelper(30);
scene.add(grid);

const gui = new dat.GUI();

const options = {
  Main: 0x2f3130,
  "Main light": 0x7c7c7c,
  "Main dark": 0x0a0a0a,
  Hooves: 0x0f0b0d,
  Hair: 0x0a0a0a,
  Muzzle: 0x0b0804,
  "Eye dark": 0x020202,
  "Eye white": 0xbebebe,
};

const assetLoader = new GLTFLoader();
assetLoader.load(
  fileUrl.href,
  function (gilt) {
    const model = gilt.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    // console.log(model.getObjectByName("Cube_1"));
    model.position.set(0, 0, 0);
    gui.addColor(options, "Main").onChange(function (e) {
      model.getObjectByName("Cube").material.color.setHex(e);
    });
    gui.addColor(options, "Main light").onChange(function (e) {
      model.getObjectByName("Cube_1").material.color.setHex(e);
    });
    gui.addColor(options, "Main dark").onChange(function (e) {
      model.getObjectByName("Cube_2").material.color.setHex(e);
    });
    gui.addColor(options, "Hooves").onChange(function (e) {
      model.getObjectByName("Cube_3").material.color.setHex(e);
    });
    gui.addColor(options, "Hair").onChange(function (e) {
      model.getObjectByName("Cube_4").material.color.setHex(e);
    });
    gui.addColor(options, "Muzzle").onChange(function (e) {
      model.getObjectByName("Cube_5").material.color.setHex(e);
    });
    gui.addColor(options, "Eye dark").onChange(function (e) {
      model.getObjectByName("Cube_6").material.color.setHex(e);
    });
    gui.addColor(options, "Eye white").onChange(function (e) {
      model.getObjectByName("Cube_7").material.color.setHex(e);
    });
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

function animate() {
  rederer.render(scene, camera);
}

rederer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  rederer.setSize(window.innerWidth, innerHeight);
});
