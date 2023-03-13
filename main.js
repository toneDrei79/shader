import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import GUI from 'three/addons/libs/lil-gui.module.min.js'
import Stats from 'three/addons/libs/stats.module.js'
import Anaglyph from './anaglyph.js'
import ImageProcessing from './imageprocessing.js'


let camera, scene, renderer
let imageprocessing, anaglyph
let video, videoTexture
let stats
let availables = {
    sanfrancisco: './videos/sanfrancisco.mp4',
    moon: './videos/moon.mp4'
}

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
    controls.maxZoom = 10.
    controls.minZoom = 1.
    controls.enableRotate = false
    controls.enablePan = true
    controls.update()

    stats = new Stats()
    container.appendChild(stats.dom)

    window.addEventListener('resize', onWindowResize, false)


    imageprocessing = new ImageProcessing()
    anaglyph = new Anaglyph()
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), anaglyph.material)
    scene.add(plane)


    const select = {src: availables.sanfrancisco}
    video = document.createElement('video')
    video.src = select.src
    video.load()
    video.muted = true
    video.loop = true
    video.onloadeddata = videoOnLoadedData()


    let gui = new GUI({title: 'Settings'})
    gui.add(select, 'src', availables).name('video').onChange(value => {video.src = value})
    guiImageprocessing(gui)
    guiAnaglyph(gui)
    gui.close()
}

function render() {
    renderer.render(scene, camera)
}

function animate() {
    requestAnimationFrame(animate)
    stats.update()

    imageprocessing.process(renderer)

    render()
}

function guiImageprocessing(gui) {
    const folder = gui.addFolder('Pre-process')
    folder.add(imageprocessing, 'kernelsize', 1, 15).step(1).name('kernel size')
    folder.add(imageprocessing, 'sigma', .1, 5.).step(.01).name('sigma')
    folder.close()
}

function guiAnaglyph(gui) {
    const folder = gui.addFolder('Anaglyph')
    folder.add(anaglyph, 'mode', Anaglyph.modes).name('mode')
    folder.close()
}

function videoOnLoadedData() {
    return function() {
        videoTexture = new THREE.VideoTexture(video)
        videoTexture.minFilter = THREE.NearestFilter
        videoTexture.magFilter = THREE.NearestFilter
        videoTexture.generateMipmaps = false
        videoTexture.format = THREE.RGBAFormat

        imageprocessing.setResolution(video.videoWidth, video.videoHeight)
        imageprocessing.setTexture(videoTexture)
        anaglyph.setTexture(imageprocessing.texture)
        video.play()
    }
}

function onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    
    camera.left = -aspect/2
    camera.right = aspect/2
    camera.top = 1/2
    camera.bottom = -1/2
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    render()
}