import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import { GLTFLoader } from "three/examples/jsm/loaders/gltfloader";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const fileUrl = new URL("../assets/Donkey.gltf", import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, innerHeight);

document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xfffccc);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-10, 10, 20);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

// let mixer;
let stag;
let clips;
const assetsLoader = new GLTFLoader();
assetsLoader.load(
  fileUrl.href,
  function (gilt) {
    const model = gilt.scene;
    model.scale.set(0.3, 0.3, 0.3);
    // scene.add(model);
    stag = model;
    clips = gilt.animations;
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    visible: false,
  })
);
planeMesh.rotateX(-Math.PI / 2);
scene.add(planeMesh);
planeMesh.name = "ground";

const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    transparent: true,
  })
);
highlightMesh.rotateX(-Math.PI / 2);
scene.add(highlightMesh);
highlightMesh.position.set(0.5, 0, 0.5);

const mousePosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener("mousemove", function (e) {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mousePosition, camera);
  intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach(function (intersect) {
    if (intersect.object.name === "ground") {
      const highlightPos = new THREE.Vector3()
        .copy(intersect.point)
        .floor()
        .addScalar(0.5);
      highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);

      const objectExit = objects.find(function (object) {
        return (
          object.position.x === highlightMesh.position.x && object.position.z
        );
      });

      if (!objectExit) {
        highlightMesh.material.color.setHex(0xbbbcca);
      } else {
        highlightMesh.material.color.setHex(0xff0000);
      }
    }
  });
});

const objects = [];
const mixers = [];

window.addEventListener("mousedown", function () {
  const objectExit = objects.find(function (object) {
    return (
      object.position.x === highlightMesh.position.x &&
      object.position.z === highlightMesh.position.z
    );
  });

  if (!objectExit) {
    intersects.forEach(function (intersect) {
      if (intersect.object.name === "ground") {
        const stagClone = SkeletonUtils.clone(stag);
        stagClone.position.copy(highlightMesh.position);
        scene.add(stagClone);
        objects.push(stagClone);
        highlightMesh.material.color.setHex(0xff0000);

        const mixer = new THREE.AnimationMixer(stagClone);
        const clip = THREE.AnimationClip.findByName(clips, "Idle_2");
        const action = mixer.clipAction(clip);
        action.play();
        mixers.push(mixer);
      }
    });
  }

  console.log(scene.children.length);
});

const clock = new THREE.Clock();
function animate(time) {
  highlightMesh.material.opacity = 1 + Math.sin(time / 120);
  //   if (mixer) {
  //     mixer.update(clock.getDelta());
  //   }
  const delta = clock.getDelta();
  mixers.forEach(function (mixer) {
    mixer.update(delta);
  });
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
