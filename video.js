import * as THREE from 'three'


export default class Video {

    #availables
    #select
    #video
    #texture
    #isReady

    constructor() {
        this.#availables = {
            sanfrancisco: './video/sanfrancisco.mp4',
            moon: './video/sanfrancisco.mp4'
        }
        this.#select = this.#availables.sanfrancisco
        this.#video = document.createElement('video')
        this.#isReady = false
        this.#loadVideo()
    }

    #loadVideo() {
        this.#video.src = this.#select
        this.#video.load()
        this.#video.muted = true
        this.#video.loop = true
        this.#video.onloadeddata = this.#videoOnLoadedData()
    }

    #videoOnLoadedData() {
        return function() {
            this.#texture = new THREE.VideoTexture(this.#video)
            this.#texture.minFilter = THREE.NearestFilter
            this.#texture.magFilter = THREE.NearestFilter
            this.#texture.generateMipmaps = false
            this.#texture.format = THREE.RGBAFormat
            this.#video.play()

            this.#isReady = true
        }
    }

    get texture() {
        return this.#texture
    }

    get isReady() {
        return this.#isReady
    }

}