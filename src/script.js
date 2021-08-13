
import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
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

const controls = new OrbitControls(camera, canvas)
controls.enabled = true

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = (sizes.width / sizes.height)
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('mousemove', (event) => {
    modelGroup.rotation.y = -((event.clientX / window.innerWidth) - 0.5)
    modelGroup.rotation.x = -((event.clientY / window.innerHeight) - 0.5)
})

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


const clock = new THREE.Clock()

const tick = () => {
    const getElapsedTime = clock.getElapsedTime()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()

