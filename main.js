import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import GUI from 'three/addons/libs/lil-gui.module.min.js'
import Stats from 'three/addons/libs/stats.module.js'
import ShaderLoader from './shaderloader.js'

let shaderLoader = new ShaderLoader()
let vertShader = shaderLoader.load('./shaders/basic.vert.glsl')
let fragShader = shaderLoader.load('./shaders/anaglyph.frag.glsl')
// let fragShader = shaderLoader.load('./shaders/right.frag.glsl')

let camera, scene, renderer
let video, videoTexture
let stats
let gui

init()
animate()


async function init() {
    const container = document.createElement('div')
    document.body.appendChild(container)

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000)
    renderer.shadowMap.enabled = false
    renderer.autoClear = false
    container.appendChild(renderer.domElement)

    scene = new THREE.Scene()

    const aspect = window.innerWidth / window.innerHeight
    camera = new THREE.OrthographicCamera(-aspect/2, aspect/2, 1/2, -1/2, .01, 10)
    camera.position.z = .5

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.maxDistance = 1
    controls.minDistance = .1
    controls.enableRotate = false
    controls.enablePan = true
    controls.update()

    stats = new Stats()
    container.appendChild(stats.dom)

    window.addEventListener('resize', onWindowResize, false)


    gui = new GUI({title: 'Settings'})
    gui.close()

    
    video = document.createElement('video')
    // video.src = "./videos/moon.mp4"
    video.src = "./videos/sanfrancisco.mp4"
    video.load()
    video.muted = true
    video.loop = true
    video.onloadeddata = videoOnLoadedData()
}

function render() {
    renderer.render(scene, camera)
}

function animate() {
    requestAnimationFrame(animate)

    stats.update()

    render()
}

function videoOnLoadedData() {
    return function() {
        videoTexture = new THREE.VideoTexture(video)
        videoTexture.minFilter = THREE.NearestFilter
        videoTexture.magFilter = THREE.NearestFilter
        videoTexture.generateMipmaps = false
        videoTexture.format = THREE.RGBAFormat


        let shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                sizeDiv2: { type: "i", value: 10 },
                colorScaleR: { type: "f", value: 1.0 },
                colorScaleG: { type: "f", value: 1.0 },
                colorScaleB: { type: "f", value: 1.0 },
                invert: { type: "b", value: false },
                // image: { type: "t", value: videoTexture },
                image: { type: "t", value: null }, // will be set after video loading
                resolution: {
                    type: "2f",
                    // value: new THREE.Vector2(video.videoWidth, video.videoHeight),
                    value: null // will be set after video loading
                },
                type: {type: 'i', value: 0}
            },
            vertexShader: vertShader,
            fragmentShader: fragShader,
        })
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), shaderMaterial)
        scene.add(plane)
    
        shaderMaterial.uniforms.image.value = videoTexture
        shaderMaterial.uniforms.resolution.value = new THREE.Vector2(video.videoWidth, video.videoHeight)

        video.play()

        const conf = {
            type: 0
        }
        gui.add(conf, 'type', [0, 1, 2, 3, 4]).name('type').onChange(value => {
            shaderMaterial.uniforms.type.value = value
        })
    }
}

function onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    
    // camera.aspect = aspect
    camera.left = -aspect/2
    camera.right = aspect/2
    camera.top = 1/2
    camera.bottom = -1/2
    camera.updateProjectionMatrix()

    orbitCamera.aspect = aspect
    orbitCamera.updateProjectionMatrix()

    renderer.setSize(width, height)
    render()
}