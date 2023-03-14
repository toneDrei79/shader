import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import ShaderLoader from './shaderloader.js'


export default class Anaglyph {

    #mode

    #material
    #plane

    #offscreanScene
    #offscreanCamera
    #renderTarget

    #controls

    #shaderLoader

    static modes = {
        right: 0,
        true: 1,
        gray: 2,
        color: 3,
        halfcolor: 4,
        optimized: 5
    }

    constructor(renderer) {
        this.#shaderLoader = new ShaderLoader()
        this.#mode = Anaglyph.modes.right
        this.#initMaterial()
        this.#initOffscrean()
        this.#initOrbitControls(renderer)
    }

    setTexture(texture) { // the texture should be already processed by ImageProcessing.process
        this.#material.uniforms.image.value = texture
    }

    setResolution(width, height) {
        this.#renderTarget = new THREE.WebGLRenderTarget(width, height, {
            type: THREE.FloatType,
            magFilter: THREE.NearestFilter,
            minFilter: THREE.NearestFilter
        })
    }

    process(renderer) {
        if (this.#plane) {
            this.#offscreanScene.remove(this.#plane)
            this.#plane.geometry.dispose()
        }
        this.#plane = new THREE.Mesh(new THREE.PlaneGeometry(1,1), this.#material)
        this.#offscreanScene.add(this.#plane)

        if (this.#renderTarget) {
            renderer.setRenderTarget(this.#renderTarget)
            renderer.clear()
            renderer.render(this.#offscreanScene, this.#offscreanCamera)
            renderer.setRenderTarget(null)
        }
    }

    #initMaterial() {
        this.#material = new THREE.ShaderMaterial({
            uniforms: {
                image: {value: null},
                mode: {value: this.#mode}
            },
            vertexShader: this.#shaderLoader.load('./shaders/basic.vert.glsl'),
            fragmentShader: this.#shaderLoader.load('./shaders/anaglyph.frag.glsl'),
            // fragmentShader: this.#shaderLoader.load('./shaders/basic.frag.glsl'),
            glslVersion: THREE.GLSL3
        })
    }

    #initOffscrean() {
        this.#offscreanScene = new THREE.Scene()
        this.#offscreanCamera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0., 1.)
    }

    #initOrbitControls(renderer) {
        this.#controls = new OrbitControls(this.#offscreanCamera, renderer.domElement)
        this.#controls.maxZoom = 10.
        this.#controls.minZoom = 1.
        this.#controls.enableRotate = false
        this.#controls.enablePan = true
        this.#controls.update()
    }

    get texture() {
        return this.#renderTarget.texture
    }

    get mode() {
        return this.#mode
    }

    set mode(value) {
        this.#mode = value
        this.#material.uniforms.mode.value = this.#mode   
    }

}