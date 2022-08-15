import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";

const dogURL = new URL("../assets/doggo2.glb", import.meta.url);

const rederer = new THREE.WebGLRenderer();

rederer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(rederer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

rederer.setClearColor(0xa3a3a3);

const orbit = new OrbitControls(camera, rederer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const gird = new THREE.GridHelper(30, 30);
scene.add(gird);

const assetLoader = new GLTFLoader();

let mixer;

assetLoader.load(
  dogURL.href,
  function (glft) {
    const model = glft.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = glft.animations;
    // const clip = THREE.AnimationClip.findByName(clips, "HeadAction");
    // const action = mixer.clipAction(clip);
    // action.play();
    clips.forEach(function (clip) {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

const clock = new THREE.Clock();
function animate() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }

  rederer.render(scene, camera);
}

rederer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  rederer.setSize(window.innerWidth, window.innerHeight);
});
