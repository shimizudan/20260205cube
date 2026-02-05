import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1422);

const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.target.set(0, 0, 0);

const geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
const material = new THREE.MeshStandardMaterial({
  color: 0xffb100,
  metalness: 0.1,
  roughness: 0.35,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshStandardMaterial({ color: 0x1b2a40, roughness: 0.9 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.4;
scene.add(floor);

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(4, 6, 3);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const inputs = {
  qx: document.getElementById("qx"),
  qy: document.getElementById("qy"),
  qz: document.getElementById("qz"),
  qw: document.getElementById("qw"),
  cx: document.getElementById("cx"),
  cy: document.getElementById("cy"),
  cz: document.getElementById("cz"),
  fov: document.getElementById("fov-range"),
  near: document.getElementById("near-range"),
  far: document.getElementById("far-range"),
};

const labels = {
  qx: document.getElementById("qx-val"),
  qy: document.getElementById("qy-val"),
  qz: document.getElementById("qz-val"),
  qw: document.getElementById("qw-val"),
  cx: document.getElementById("cx-val"),
  cy: document.getElementById("cy-val"),
  cz: document.getElementById("cz-val"),
  fov: document.getElementById("fov-val"),
  near: document.getElementById("near-val"),
  far: document.getElementById("far-val"),
  qxHud: document.getElementById("q-x"),
  qyHud: document.getElementById("q-y"),
  qzHud: document.getElementById("q-z"),
  qwHud: document.getElementById("q-w"),
  cxHud: document.getElementById("c-x"),
  cyHud: document.getElementById("c-y"),
  czHud: document.getElementById("c-z"),
  fovHud: document.getElementById("fov"),
  nearHud: document.getElementById("near"),
  farHud: document.getElementById("far"),
};

function format(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function syncLabels() {
  labels.qx.textContent = format(inputs.qx.value);
  labels.qy.textContent = format(inputs.qy.value);
  labels.qz.textContent = format(inputs.qz.value);
  labels.qw.textContent = format(inputs.qw.value);
  labels.cx.textContent = format(inputs.cx.value, 1);
  labels.cy.textContent = format(inputs.cy.value, 1);
  labels.cz.textContent = format(inputs.cz.value, 1);
  labels.fov.textContent = inputs.fov.value;
  labels.near.textContent = inputs.near.value;
  labels.far.textContent = inputs.far.value;

  labels.qxHud.textContent = format(inputs.qx.value);
  labels.qyHud.textContent = format(inputs.qy.value);
  labels.qzHud.textContent = format(inputs.qz.value);
  labels.qwHud.textContent = format(inputs.qw.value);
  labels.cxHud.textContent = format(inputs.cx.value, 1);
  labels.cyHud.textContent = format(inputs.cy.value, 1);
  labels.czHud.textContent = format(inputs.cz.value, 1);
  labels.fovHud.textContent = inputs.fov.value;
  labels.nearHud.textContent = inputs.near.value;
  labels.farHud.textContent = inputs.far.value;
}

function updateQuaternion() {
  const qx = Number(inputs.qx.value);
  const qy = Number(inputs.qy.value);
  const qz = Number(inputs.qz.value);
  const qw = Number(inputs.qw.value);
  const quat = new THREE.Quaternion(qx, qy, qz, qw).normalize();
  cube.setRotationFromQuaternion(quat);
}

function updateCamera() {
  const cx = Number(inputs.cx.value);
  const cy = Number(inputs.cy.value);
  const cz = Number(inputs.cz.value);
  camera.position.set(cx, cy, cz);
  controls.update();
}

function updatePerspective() {
  let near = Number(inputs.near.value);
  let far = Number(inputs.far.value);
  if (near <= 0.01) {
    near = 0.01;
  }
  if (near >= far) {
    far = near + 1;
    inputs.far.value = far.toFixed(0);
  }
  camera.fov = Number(inputs.fov.value);
  camera.near = near;
  camera.far = far;
  camera.updateProjectionMatrix();
}

function resize() {
  const { clientWidth, clientHeight } = canvas.parentElement;
  if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
}

function tick() {
  resize();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

const normalizeButton = document.getElementById("normalize");
normalizeButton.addEventListener("click", () => {
  const qx = Number(inputs.qx.value);
  const qy = Number(inputs.qy.value);
  const qz = Number(inputs.qz.value);
  const qw = Number(inputs.qw.value);
  const quat = new THREE.Quaternion(qx, qy, qz, qw).normalize();
  inputs.qx.value = quat.x.toFixed(2);
  inputs.qy.value = quat.y.toFixed(2);
  inputs.qz.value = quat.z.toFixed(2);
  inputs.qw.value = quat.w.toFixed(2);
  syncLabels();
  updateQuaternion();
});

Object.values(inputs).forEach((input) => {
  input.addEventListener("input", () => {
    syncLabels();
    updateQuaternion();
    updateCamera();
    updatePerspective();
  });
});

syncLabels();
updateQuaternion();
updateCamera();
updatePerspective();
requestAnimationFrame(tick);
