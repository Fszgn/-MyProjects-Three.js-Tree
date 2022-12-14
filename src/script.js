import "./style.css";
import * as THREE from "three";
import { CameraHelper, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: visualViewport.width,
  height: visualViewport.height,
};

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");

//Create Tree's Body Object
let branchNumber = 5;
const mesh = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 1.2, 36, 64),
  new THREE.MeshBasicMaterial({
    color: "#3f2711",

    roughness: 1,
    metalness: 0,
  })
);
mesh.position.x = 3;
mesh.position.y = 18;

scene.add(mesh);

//Create Tree's branches Object

const createBranch = (number, branchHeight) => {
  for (let i = 0; i < number; i++) {
    let degreeRandom = 2 * Math.PI * Math.random();
    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 8, 64),
      new THREE.MeshBasicMaterial({
        color: "#3f2711",

        roughness: 1,
        metalness: 0,
      })
    );
    branch.rotation.reorder("YXZ");
    branch.rotation.x = Math.PI / 3;
    branch.rotation.y = degreeRandom;
    branch.position.set(
      4 * Math.sin(degreeRandom),
      branchHeight ? -9 + 5 * Math.random() * 5 : -9 + 3 * i,
      4 * Math.cos(degreeRandom)
    );

    for (let y = 0; y < 4; y++) {
      let degreeRandom = 2 * Math.PI * Math.random();
      const leaf = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 1, 64),
        new THREE.MeshBasicMaterial({
          color: "#3f2711",

          roughness: 1,
          metalness: 0,
        })
      );
      // Reorder rotation in order to avoid having Gimbal Lock
      leaf.rotation.reorder("YXZ");
      leaf.rotation.x = Math.PI / 3;
      leaf.rotation.y = degreeRandom;
      leaf.position.set(
        -0.4 * Math.sin(degreeRandom) + Math.sin(degreeRandom),
        Math.random() * 3,
        -0.4 * Math.cos(degreeRandom) + Math.cos(degreeRandom)
      );

      branch.add(leaf);
    }

    mesh.add(branch);
  }
};

//3D Text

const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Click on the TREE !", {
    font: font,
    size: 15,
    height: 2,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });
  const textMaterial = new THREE.MeshBasicMaterial({ color: "#000000" });
  textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.set(-60, 0, -60);
  text.rotateY(Math.PI / 4);
  scene.add(text);
});

// RAYCASTER
const raycaster = new THREE.Raycaster();
let currentIntersect = null;

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = (-event.clientY / sizes.width) * 2 + 1;
});

///---------------------

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(30, 10, 20);

scene.add(camera);

//AXES HELPER
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);
// GRID HELPER
const size = 100;
const divisions = 100;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

//Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.update();

//Handle Resizing
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Renderer
createBranch(branchNumber);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//Handle Fullscreen
// window.addEventListener("dblclick", () => {
//   const fullscreenElement =
//     document.fullscreenElement || document.webkitFullscreenElement;

//   if (!fullscreenElement) {
//     if (canvas.requestFullscreen) {
//       canvas.requestFullscreen();
//     } else if (canvas.webkitRequestFullscreen) {
//       canvas.webkitRequestFullscreen();
//     }
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     }
//   }
// });

//Handle Configuration

// Remove a Branch
const removeBranch = () => {
if (branchNumber > 0) {
  mesh.children[mesh.children.length - 1].remove();
  mesh.children[mesh.children.length - 1].geometry.dispose();
  mesh.children[mesh.children.length - 1].material.dispose();
  mesh.remove(mesh.children[mesh.children.length - 1]);
  branchNumber -= 1;

  document.getElementById(
    "branchNumber"
  ).innerHTML = `number of branches on the Tree is ${mesh.children.length}`;
}
};
const clickRemoveBranch = document.getElementById("removeBranch");

clickRemoveBranch.addEventListener("click", removeBranch)
  

//Add a Branch
const addBranch = () => {
if (branchNumber <= 15) {
  createBranch(1, "Random Height");
  branchNumber += 1;
  document.getElementById(
    "branchNumber"
  ).innerHTML = `number of branches on the Tree is ${mesh.children.length}`;
}
};
const clickAddBranch = document.getElementById("addBranch");
clickAddBranch.addEventListener("click",addBranch)
  


//Branch Number
document.getElementById(
  "branchNumber"
).innerHTML = `number of branches on the Tree is ${mesh.children.length}`;

// Handle Object Click
window.addEventListener("click", () => {
  if (currentIntersect !== null) {
    createBranch(1, "Random Height");
    control.update();
    renderer.render(scene, camera);
  }
});

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.rotation.y = elapsedTime;

  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObjects([mesh]);

  if (intersect.length) {
    currentIntersect = intersect;
  } else {
    currentIntersect = null;
  }

  control.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
