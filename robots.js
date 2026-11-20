import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const up = new THREE.Vector3(0, 1, 0);

function buildRobot(kind, color) {
  const robot = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: '#e2e5de', roughness: .55, metalness: .18 });
  const accent = new THREE.MeshStandardMaterial({ color, roughness: .48, metalness: .22 });
  const metal = new THREE.MeshStandardMaterial({ color: '#b9c4ca', roughness: .32, metalness: .65 });
  const graphite = new THREE.MeshStandardMaterial({ color: '#303a3d', roughness: .65, metalness: .22 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#202626', roughness: .94, metalness: 0 });
  const lens = new THREE.MeshStandardMaterial({ color: '#153e55', roughness: .12, metalness: .6 });
  function shape(geometry, position, rotation = [0, 0, 0]) {
    const object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    object.receiveShadow = true;
    object.position.set(...position);
    object.rotation.set(...rotation);
    robot.add(object);
    return object;
  }
  const box = (size, position, rotation) => shape(new THREE.BoxGeometry(...size), position, rotation);
  const cylinder = (radius, height, position, rotation) =>
    shape(new THREE.CylinderGeometry(radius, radius, height, 32), position, rotation);
  function beam(start, end, width, depth = width) {
    const a = new THREE.Vector3(...start);
    const b = new THREE.Vector3(...end);
    const bar = box([width, a.distanceTo(b), depth], a.clone().add(b).multiplyScalar(.5).toArray());
    bar.quaternion.setFromUnitVectors(up, b.sub(a).normalize());
    return bar;
  }
  function line(points) {
    for (let i = 1; i < points.length; i++) {
      const start = new THREE.Vector3(...points[i - 1]);
      const end = new THREE.Vector3(...points[i]);
      const pipe = cylinder(.009, start.distanceTo(end), start.clone().add(end).multiplyScalar(.5).toArray());
      pipe.material = graphite;
      pipe.quaternion.setFromUnitVectors(up, end.sub(start).normalize());
    }
  }

  // Shared mobile chassis, four wheels, and nested mast stages.
  box([1.35, .32, 1.05], [0, .49, 0]);
  box([1.12, .18, .84], [0, .74, 0]).material = accent;
  box([.91, .19, .70], [0, .32, 0]).material = graphite;
  for (const x of [-.53, .53]) {
    for (const z of [-.61, .61]) {
      cylinder(.28, .20, [x, .28, z], [Math.PI / 2, 0, 0]).material = rubber;
      cylinder(.13, .215, [x, .28, z], [Math.PI / 2, 0, 0]).material = metal;
      for (let spoke = 0; spoke < 6; spoke++) {
        const a = spoke * Math.PI / 3;
        line([[x, .28, z + Math.sign(z) * .115],
          [x + Math.sin(a) * .24, .28 + Math.cos(a) * .24, z + Math.sign(z) * .115]]);
      }
    }
  }
  box([.52, .13, .52], [0, .91, 0]).material = graphite;
  box([.32, 1.23, .32], [0, 1.51, 0]).material = metal;
  box([.24, 1.13, .24], [0, 2.22, 0]).material = metal;
  box([.16, 1.02, .16], [0, 2.91, 0]).material = metal;
  for (const y of [1.05, 2.08, 2.74, 3.38]) box([y < 2.1 ? .39 : .29, .07, y < 2.1 ? .39 : .29], [0, y, 0]).material = graphite;
  for (const x of [-.13, .13]) beam([x, .95, -.2], [x, 2.06, -.2], .025).material = graphite;
  beam([-.48, .82, .25], [-.15, 1.38, .13], .055);
  beam([.48, .82, .25], [.15, 1.38, .13], .055);
  for (let i = 0; i < 5; i++) box([.26, .015, .02], [.35, .44 + i * .04, .535]).material = graphite;

  if (kind === 'drywall') {
    cylinder(.23, .18, [0, 3.48, 0]).material = graphite;
    cylinder(.17, .30, [0, 3.62, 0], [Math.PI / 2, 0, 0]).material = graphite;
    beam([0, 3.62, 0], [.7, 4.14, 0], .23, .25).material = accent;
    cylinder(.17, .29, [.7, 4.14, 0], [Math.PI / 2, 0, 0]).material = graphite;
    beam([.7, 4.14, 0], [1.26, 3.66, 0], .16, .19).material = accent;
    cylinder(.115, .23, [1.26, 3.66, 0], [Math.PI / 2, 0, 0]).material = graphite;
    beam([1.26, 3.66, 0], [1.48, 3.66, 0], .10);
    box([.09, .56, .64], [1.56, 3.66, 0]).material = metal;
    box([.12, .10, .40], [1.48, 3.66, 0]);
    // A visible service line follows the mast and arm.
    line([[-.22,.9,-.12],[-.22,3.43,-.12],[0,3.73,-.17],[.7,4.25,-.17],[1.26,3.77,-.17],[1.5,3.77,-.17]]);
    box([.35, .52, .46], [-.37, 1.08, -.12]);
  } else {
    box([.62, .10, .42], [0, 3.47, 0]);
    beam([-.25,3.51,0],[-.25,3.82,0],.055);
    beam([.25,3.51,0],[.25,3.82,0],.055);
    box([.42, .27, .32], [0, 3.76, 0]).material = graphite;
    cylinder(.12, .18, [0,3.76,.24], [Math.PI / 2,0,0]).material = graphite;
    cylinder(.085,.015,[0,3.76,.338],[Math.PI / 2,0,0]).material = lens;
    cylinder(.23,.20,[0,4.05,0]).material = graphite;
    cylinder(.25,.035,[0,3.95,0]).material = accent;
    cylinder(.25,.035,[0,4.15,0]).material = accent;
    box([.22, .10, .18], [.39, .87, .14]);
  }
  return robot;
}

function createView(host) {
  const pair = host.dataset.robot === 'pair';
  const dark = host.dataset.theme === 'dark';
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  scene.add(new THREE.HemisphereLight('#f4f7ff', '#a4ad96', 2.5));
  const keyLight = new THREE.DirectionalLight('#fff5e5', 3.5);
  keyLight.position.set(4, 7, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  Object.assign(keyLight.shadow.camera, { left: -5, right: 5, top: 6, bottom: -5, near: .5, far: 20 });
  keyLight.shadow.normalBias = .025;
  keyLight.shadow.bias = -.0002;
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight('#dceeff', 2);
  rimLight.position.set(-4, 4, -3);
  scene.add(rimLight);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: .14 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -.025;
  ground.receiveShadow = true;
  scene.add(ground);
  host.append(renderer.domElement);
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
  const robots = [];
  if (pair) {
    const drywall = buildRobot('drywall', '#d9e791');
    const qc = buildRobot('qc', '#8bc9df');
    drywall.position.x = -1.95;
    qc.position.x = 1.75;
    robots.push(drywall, qc);
  } else {
    robots.push(buildRobot(host.dataset.robot, host.dataset.robot === 'drywall' ? '#627541' : '#467f94'));
  }
  robots.forEach(robot => scene.add(robot));
  const grid = new THREE.GridHelper(pair ? 12 : 8, pair ? 24 : 16, dark ? '#4c584c' : '#ccd3c6', dark ? '#39443b' : '#e3e7df');
  grid.material.transparent = true;
  grid.material.opacity = dark ? .38 : .35;
  grid.position.y = -.02;
  scene.add(grid);
  const target = new THREE.Vector3(pair ? .2 : (host.dataset.robot === 'drywall' ? .4 : 0), 2.05, 0);
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = !reducedMotion.matches;
  controls.minPolarAngle = Math.PI * .25;
  controls.maxPolarAngle = Math.PI * .55;
  controls.enabled = !pair;
  // Let a one-finger gesture scroll the mobile page; mouse drag still orbits.
  controls.touches.ONE = null;
  controls.touches.TWO = THREE.TOUCH.ROTATE;
  canvas.style.touchAction = 'pan-y';
  let visible = false;
  let dragging = false;
  let time = 0;
  let previousTime = 0;
  function home() {
    const aspect = host.clientWidth / host.clientHeight;
    // Fit both height and width, including the arm, at narrow breakpoints.
    const distance = pair ? Math.max(10.5, 12.2 / aspect) : Math.max(9.2, 5.8 / aspect);
    camera.position.set(target.x + (pair ? .7 : 3.0), target.y + distance * .14, distance);
    controls.target.copy(target);
    camera.lookAt(target);
    controls.update();
    time = 0;
    robots.forEach((robot, i) => { robot.rotation.y = pair ? (i ? -.45 : -.32) : -.25; });
    renderer.render(scene, camera);
  }
  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    home();
  }
  controls.addEventListener('start', () => { dragging = true; });
  controls.addEventListener('end', () => { dragging = false; });
  reducedMotion.addEventListener('change', event => {
    controls.enableDamping = !event.matches;
    controls.update();
  });
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
  observer.observe(host);
  new ResizeObserver(resize).observe(host);
  resize();
  renderer.setAnimationLoop(timestamp => {
    const delta = Math.min((timestamp - previousTime) / 1000, .05);
    previousTime = timestamp;
    if (!visible || document.hidden) return;
    if (!reducedMotion.matches && !dragging) {
      time = (time + delta * .2) % (Math.PI * 2);
      robots.forEach((robot, i) => { robot.rotation.y = (pair ? (i ? -.45 : -.32) : -.25) + time; });
    }
    if (!reducedMotion.matches || dragging) controls.update();
    renderer.render(scene, camera);
  });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    host.querySelector('.render-fallback').hidden = false;
    renderer.setAnimationLoop(null);
  });
  host.dataset.ready = 'true';
}

document.querySelectorAll('.robot-view').forEach(host => {
  try {
    createView(host);
  } catch (error) {
    host.querySelector('.render-fallback').hidden = false;
    console.warn('Robot preview unavailable:', error);
  }
});
