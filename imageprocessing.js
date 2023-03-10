import * as THREE from 'three'
import ShaderLoader from './shaderloader.js'


export default class ImageProcessing {
    
    #material
    #plane

    #mode

    #offscreanScene
    #offscreanCamera
    #renderTarget

    #shaderLoader

    #kernel
    #sigma

    constructor() {
        this.#shaderLoader = new ShaderLoader()
        this.#mode = 0
        this.#kernel = 3
        this.#sigma = 1
        this.#initMaterial()
        this.#initOffscrean()
    }

    setTexture(texture) { // should be called in video.onLoadedVideo
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
                resolution: {value: new THREE.Vector2(1280, 720)},
                mode: {value: this.#mode},
                kernel: {value: this.#kernel},
                sigma: {value: this.#sigma}
            },
            vertexShader: this.#shaderLoader.load('./shaders/basic.vert.glsl'),
            fragmentShader: this.#shaderLoader.load('./shaders/filter.frag.glsl'),
            glslVersion: THREE.GLSL3
        })
    }

    #initOffscrean() {
        this.#offscreanScene = new THREE.Scene()
        this.#offscreanCamera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0., 1.)
    }

    get texture() {
        return this.#renderTarget.texture
    }

    get kernel() {
        return this.#kernel
    }

    get sigma() {
        return this.#sigma
    }

    set kernel(value) {
        this.#kernel = value
        this.#material.uniforms.kernel.value = this.#kernel
    }

    set sigma(value) {
        this.#sigma = value
        this.#material.uniforms.sigma.value = this.#sigma
    }

}