import * as THREE from "https://cdn.skypack.dev/three@0.135.0"
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js"

let container
let camera
let renderer
let scene
let rocket
let x = 0 //out of bordes -16, 16
let y = 0 //out of bordes -5, 16
let z = 0 //out of bordes -50, 16

function init() {
    try{
        container = document.querySelector(".scene")

        //Create scene
        scene = new THREE.Scene()

        const fov = 35
        const aspect = container.clientWidth / container.clientHeight
        const near = 0.1
        const far = 1000

        //Camera setup
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(0, 5, 30)

        const ambient = new THREE.AmbientLight(0x404040, 2)
        scene.add(ambient)

        const light = new THREE.DirectionalLight(0xffffff, 2)
        light.position.set(50, 50, 100)
        scene.add(light)
        //Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(1/20, 1/20)
        renderer.setPixelRatio(window.devicePixelRatio)

        container.appendChild(renderer.domElement)

    } catch (err) {
        console.error(err)
    }
}

function getRocket() {
    try{
        //Load Model
        let loader = new GLTFLoader()
        loader.load("./rocket/scene.gltf", (gltf) => {
            //
            rocket = gltf.scene.children[0]
            rocket.scale.set(0.05,0.05,0.05)
            scene.add(gltf.scene)
            animate()
        })
    } catch (err) {
        console.error(err)
    }
}

function animate() {
    try{
        requestAnimationFrame(animate)
        rocket.rotation.y += 0.005
        rocket.rotation.z += 0.005
        rocket.rotation.z += 0.005
        renderer.render(scene, camera)
        rocket.position.set(x, y, z)
        x += 0.05
        y += 0.05
        z += 0.1
        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()

        renderer.setSize(container.clientWidth, container.clientHeight)
    } catch (err) {
        console.error(err)
    }
}

export{
    init,
    getRocket,

    container,
    camera,
    renderer,
    scene,
    rocket,
    x, y, z

}



