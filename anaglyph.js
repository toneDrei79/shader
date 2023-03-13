import * as THREE from 'three'
import ShaderLoader from './shaderloader.js'


export default class Anaglyph {

    #material
    #mode

    #shaderLoader

    static modes = {
        right: 0,
        true: 1,
        gray: 2,
        color: 3,
        halfcolor: 4,
        optimized: 5
    }

    constructor() {
        this.#shaderLoader = new ShaderLoader()
        this.#mode = Anaglyph.modes.right
        this.#initMaterial()
    }

    setTexture(texture) { // the texture should be already processed by ImageProcessing.process
        this.#material.uniforms.image.value = texture
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

    get material() {
        return this.#material
    }

    get mode() {
        return this.#mode
    }

    set mode(value) {
        this.#mode = value
        this.#material.uniforms.mode.value = this.#mode   
    }

}