
import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3

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

// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

const circleGroup = new THREE.Group()

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
    color: '#D3D3D3',
    transparent: true,
    depthTest: false
})
const otherParticlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
    color: '#7e7e7e',
    transparent: true,
    depthTest: false
})
const circleMaker = (r,width, count, moveable, material) => {
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
        let randomS = Math.random() * 2 * Math.PI
        let radius = r + (Math.random() * width)
        for (let j = 0; j < 3; j++) {
            if (j == 0) {
                positions[(3*i + j)] = (radius * Math.sin(randomS))
            }
            if (j == 1) {
                positions[(3*i + j)] = (radius * Math.cos(randomS))
            }
            if (j == 2) {
                positions[(3*i + j)] = 0
            }
        }
    } 
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particles = new THREE.Points(particleGeometry, material)
    if (moveable) {
        circleGroup.add(particles)
        scene.add(circleGroup)
    }
    else {
        scene.add(particles)
    }
}


const makerOfTheCircleMaker = (moveable, material) => {
    let radiusCounter = 0.05;
    let particleCounter = 300
    for (let i = 0; i < 30; i++) {
        circleMaker(radiusCounter, 0.01, particleCounter, moveable, material)
        radiusCounter += 0.05
        particleCounter += 100
    }
}
makerOfTheCircleMaker(true, otherParticlesMaterial)
makerOfTheCircleMaker(false, particlesMaterial)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) - 0.5
    const y = (-event.clientY / window.innerHeight) + 0.5
    
    circleGroup.position.x = x 
    circleGroup.position.y = y 
})

const clock = new THREE.Clock()

const tick = () => {
    const getElapsedTime = clock.getElapsedTime()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()

