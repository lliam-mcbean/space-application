
import './style.css'
import * as THREE from 'three'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


const canvas = document.querySelector('canvas.webgl')

const PI = Math.PI

const scene = new THREE.Scene()

// Instantiate a loader
const loader = new GLTFLoader();
const modelGroup = new THREE.Group()

loader.load(

	'X-WING.glb',
	function ( gltf ) {
        modelGroup.add(gltf.scene)
		modelGroup.position.y = -2
		scene.add(modelGroup);
	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},

	function ( error ) {

		console.log( 'An error happened' );

	}
);

// SKYBOX TEXTURES
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
  'hdr.png',
  () => {
	const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
	rt.fromEquirectangularTexture(renderer, texture);
	scene.background = rt.texture;
  });

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 8
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
scene.add(directionalLight)

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = (sizes.width / sizes.height)
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})



const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// PARTICLES
const particleGeometry = new THREE.BufferGeometry()
const particleGeometry2 = new THREE.BufferGeometry()
const particleGeometry3 = new THREE.BufferGeometry()

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: '#1dcdfe',
    transparent: true,
    depthTest: false
})
const particlesMaterial2 = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: '#21d0b2',
    transparent: true,

    depthTest: false
})
const particlesMaterial3 = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: '#34f5c5',
    transparent: true,
    depthTest: false
})

const count = 5000
const radius = 10

const positions = new Float32Array(count * 3)
const positions2 = new Float32Array(count * 3)
const positions3 = new Float32Array(count * 3)

for(let i = 0; i < (count); i++) {
    let randomS = Math.random() * 2 * Math.PI
    let randomT = Math.random() * Math.PI
    for(let j = 0; j < 3; j++) {
        if(j === 0) {
            positions[(3*i + j)] = radius * Math.sin(randomS) * Math.cos(randomT)
        }
        if(j === 1) {
            positions[(3*i + j)] = radius * Math.sin(randomS) * Math.sin(randomT)
        }
        if(j === 2) {
            positions[(3*i + j)] = radius * Math.cos(randomS)
        }
    }
}
for(let i = 0; i < (count); i++) {
    let randomS = Math.random() * 2 * Math.PI
    let randomT = Math.random() * Math.PI
    for(let j = 0; j < 3; j++) {
        if(j === 0) {
            positions2[(3*i + j)] = radius * 2 * Math.sin(randomS) * Math.cos(randomT)
        }
        if(j === 1) {
            positions2[(3*i + j)] = radius * 2 * Math.sin(randomS) * Math.sin(randomT)
        }
        if(j === 2) {
            positions2[(3*i + j)] = radius * 2 * Math.cos(randomS)
        }
    }
}
for(let i = 0; i < (count); i++) {
    let randomS = Math.random() * 2 * Math.PI
    let randomT = Math.random() * Math.PI
    for(let j = 0; j < 3; j++) {
        if(j === 0) {
            positions3[(3*i + j)] = radius * 0.5 * Math.sin(randomS) * Math.cos(randomT)
        }
        if(j === 1) {
            positions3[(3*i + j)] = radius * 0.5 * Math.sin(randomS) * Math.sin(randomT)
        }
        if(j === 2) {
            positions3[(3*i + j)] = radius * 0.5 * Math.cos(randomS)
        }
    }
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3))
particleGeometry3.setAttribute('position', new THREE.BufferAttribute(positions3, 3))
const particles = new THREE.Points(particleGeometry, particlesMaterial)
const particles2 = new THREE.Points(particleGeometry2, particlesMaterial2)
const particles3 = new THREE.Points(particleGeometry3, particlesMaterial3)
scene.add(particles3)
scene.add(particles2)
scene.add(particles)

// CONTROLS
let controls = new FlyControls( camera, renderer.domElement );

controls.dragToLook = true;
controls.movementSpeed = 10;
controls.rollSpeed = 1;

let direction = new THREE.Vector3()
camera.getWorldDirection(direction)


const clock = new THREE.Clock()

const tick = () => {
    const getElapsedTime = clock.getElapsedTime()

	controls.update(getElapsedTime / 1000)

	camera.getWorldDirection(direction)
	modelGroup.position.x = camera.position.x + (direction.x * 8)
	modelGroup.position.y = camera.position.y + (direction.y * 8)
	modelGroup.position.z = camera.position.z + (direction.z * 8)

	modelGroup.rotation.x = camera.rotation.x
	modelGroup.rotation.y = camera.rotation.y
	modelGroup.rotation.z = camera.rotation.z

	console.log(direction)

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()

