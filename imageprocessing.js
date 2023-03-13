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

    static modes = {
        gaussian: 0,
        laplacian: 1,
    }

    constructor() {
        this.#shaderLoader = new ShaderLoader()
        this.#mode = ImageProcessing.modes.gaussian
        this.#kernelsize = 3
        this.#sigma = 1.
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
                // mode: {value: this.#mode},
                kernelsize: {value: this.#kernelsize},
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

    get kernelsize() {
        return this.#kernelsize
    }

    get sigma() {
        return this.#sigma
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