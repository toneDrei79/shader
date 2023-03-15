import * as THREE from 'three'
import ShaderLoader from './shaderloader.js'


export default class ImageProcessing {

    #mode
    #kernelsize
    #sigma
    
    #material
    #plane

    #offscreanScene
    #offscreanCamera
    #renderTarget

    #shaderLoader
    #shaders = []

    static modes = {
        gaussian: 0,
        laplacian: 1,
        separatedgaussian: 2,
        median: 3,
        log: 4
    }

    constructor() {
        this.#mode = ImageProcessing.modes.gaussian
        this.#kernelsize = 1
        this.#sigma = 1.

        this.#shaderLoader = new ShaderLoader()
        this.#initShaders()
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
        this.#material.uniforms.resolution.value = new THREE.Vector2(width, height)
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
                image: {value: null}, // will be set after loading video via setTexture()
                resolution: {value: null}, // will be set after loading video via setResolution()
                kernelsize: {value: this.#kernelsize},
                sigma: {value: this.#sigma}
            },
            vertexShader: this.#shaderLoader.load('./shaders/basic.vert.glsl'),
            fragmentShader: this.#shaders[this.#mode],
            glslVersion: THREE.GLSL3
        })
    }

    #initOffscrean() {
        this.#offscreanScene = new THREE.Scene()
        this.#offscreanCamera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, 0., 1.)
    }

    #initShaders() {
        this.#shaders[0] = this.#shaderLoader.load('./shaders/filterings/gaussian.frag.glsl')
        this.#shaders[1] = this.#shaderLoader.load('./shaders/filterings/laplacian.frag.glsl')
        this.#shaders[2] = this.#shaderLoader.load('./shaders/filterings/separatedgaussian.frag.glsl')
        this.#shaders[3] = this.#shaderLoader.load('./shaders/filterings/median.frag.glsl')
        this.#shaders[4] = this.#shaderLoader.load('./shaders/filterings/log.frag.glsl')
    }

    get texture() {
        return this.#renderTarget.texture
    }

    get mode() {
        return this.#mode
    }

    get kernelsize() {
        return this.#kernelsize
    }

    get sigma() {
        return this.#sigma
    }

    set mode(value) {
        this.#mode = value
        this.#material.fragmentShader = this.#shaders[this.#mode]
        this.#material.needsUpdate = true
    }

    set kernelsize(value) {
        this.#kernelsize = value
        this.#material.uniforms.kernelsize.value = this.#kernelsize
    }

    set sigma(value) {
        this.#sigma = value
        this.#material.uniforms.sigma.value = this.#sigma
    }

}