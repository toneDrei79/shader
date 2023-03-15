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
    moon: './videos/moon.mp4',
    travel: './videos/travel.mp4'
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

    stats = new Stats()
    container.appendChild(stats.dom)

    window.addEventListener('resize', onWindowResize, false)


    imageprocessing = new ImageProcessing()
    anaglyph = new Anaglyph(renderer)


    const select = {src: availables.sanfrancisco}
    video = document.createElement('video')
    video.src = select.src
    video.load()
    video.muted = true
    video.loop = true
    video.onloadeddata = videoOnLoadedData()


    let gui = new GUI({title: 'Settings'})
    gui.add(select, 'src', availables).name('video').onChange(value => {video.src = value})
    guiAnaglyph(gui)
    guiImageprocessing(gui)
    // gui.close()
}

function render() {
    renderer.render(scene, camera)
}

function animate() {
    requestAnimationFrame(animate)
    stats.update()

    imageprocessing.process(renderer)
    anaglyph.process(renderer)

    render()
}

function guiAnaglyph(gui) {
    const folder = gui.addFolder('Anaglyph')
    folder.add(anaglyph, 'mode', Anaglyph.modes).name('mode')
    // folder.close()
}

function guiImageprocessing(gui) {
    const folder = gui.addFolder('Pre-process')
    folder.add(imageprocessing, 'mode', ImageProcessing.modes).step(1).name('mode').onChange(value => {
        folder.destroy()
        if (value == ImageProcessing.modes.median && imageprocessing.kernelsize > 5) imageprocessing.kernelsize = 5
        guiImageprocessing(gui)
    })
    guiParams(folder, imageprocessing.mode)
    // folder.close()
}

function guiParams(gui, mode) {
    const folder = gui.addFolder('Parameters')
    switch (mode) {
    case ImageProcessing.modes.gaussian:
        folder.add(imageprocessing, 'kernelsize', 1, 15).step(1).name('kernel size')
        folder.add(imageprocessing, 'sigma', .1, 10.).step(.01).name('sigma')
        break
    case ImageProcessing.modes.laplacian:
        break
    case ImageProcessing.modes.sepalatablegaussian:
        folder.add(imageprocessing, 'kernelsize', 1, 15).step(1).name('kernel size')
        folder.add(imageprocessing, 'sigma', .1, 10.).step(.01).name('sigma')
        break
    case ImageProcessing.modes.median:
        folder.add(imageprocessing, 'kernelsize', 1, 5).step(1).name('kernel size')
        break
    case ImageProcessing.modes.gaussian_laplacian:
    default:
    }
    // folder.close()
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
        anaglyph.setResolution(video.videoWidth, video.videoHeight)
        anaglyph.setTexture(imageprocessing.texture)
        scene.background = anaglyph.texture
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