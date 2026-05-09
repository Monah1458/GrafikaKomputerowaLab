import * as THREE from 'three';

import { OrbitControls } from
'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


camera.position.set(0, 8, 18);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = 0.05;

controls.minDistance = 8;

controls.maxDistance = 40;

controls.target.set(0, 2, 0);

const light = new THREE.DirectionalLight(0xffffff, 1);

light.position.set(10, 20, 10);

scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const baseGeometry = new THREE.BoxGeometry(18, 1, 8);

const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x5c2e00
});

const base = new THREE.Mesh(baseGeometry, baseMaterial);

base.position.y = -1;

scene.add(base);


for (let i = 0; i < 3; i++) {

    const pegGeometry = new THREE.CylinderGeometry(0.15, 0.15, 6);

    const pegMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });

    const peg = new THREE.Mesh(pegGeometry, pegMaterial);

    peg.position.set((i - 1) * 6, 2, 0);

    scene.add(peg);
}

const diskCount = 6;

const towers = [[], [], []];

for (let i = 0; i < diskCount; i++) {

    const radius = 2 - i * 0.3;

    const geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        0.5,
        32
    );

    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${i * 60}, 100%, 50%)`)
    });

    const disk = new THREE.Mesh(geometry, material);

    disk.position.set(
        -6,
        0.3 + i * 0.6,
        0
    );

    scene.add(disk);

    towers[0].push(disk);
}

const moves = [];

function hanoi(n, from, to, aux) {

    if (n === 1) {

        moves.push([from, to]);
        return;
    }

    hanoi(n - 1, from, aux, to);

    moves.push([from, to]);

    hanoi(n - 1, aux, to, from);
}

hanoi(diskCount, 0, 2, 1);


let currentMove = 0;

let activeAnimation = null;

function animateMove() {
 
    if (activeAnimation) {

        const a = activeAnimation;      
        const disk = a.disk;
    
        if (a.phase === 'up') {

            disk.position.y += 0.08;

            if (disk.position.y >= 5) {
                a.phase = 'horizontal';
            }
        }
      
        else if (a.phase === 'horizontal') {

            const dx = a.targetX - disk.position.x;

            if (Math.abs(dx) > 0.05) {

                disk.position.x += Math.sign(dx) * 0.08;

            } else {

                disk.position.x = a.targetX;

                a.phase = 'down';
            }
        }

        else if (a.phase === 'down') {

            disk.position.y -= 0.08;

            if (disk.position.y <= a.targetY) {

                disk.position.y = a.targetY;

                towers[a.to].push(disk);

                activeAnimation = null;
                currentMove++;
            }
        }

        return;
    }
   
    if (currentMove >= moves.length)
        return;

    const [from, to] = moves[currentMove];
    const disk = towers[from].pop();

    activeAnimation = {
        disk,
        from,
        to,
        targetX: (to - 1) * 6,
        targetY: 0.3 + towers[to].length * 0.6,
        phase: 'up'
    };
}

function render() {

    requestAnimationFrame(render);

    animateMove();

        controls.update();

    renderer.render(scene, camera);
}

render();


window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});