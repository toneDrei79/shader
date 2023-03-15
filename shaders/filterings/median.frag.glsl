precision highp float;
uniform sampler2D image;
uniform vec2 resolution;
uniform int kernelsize;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415;
const float e = 2.7183;

void main(void) {
    vec2 uv = vUv.xy;
    
    vec2 cellSize = 1./resolution.xy;

    vec3 array[9*9];
    int idx = 0;
    for (int j=-kernelsize/2; j<kernelsize/2+kernelsize%2; j++) {
        for (int i=-kernelsize/2; i<kernelsize/2+kernelsize%2; i++) {
            array[idx++] = texture2D(image, uv + vec2(float(i)*cellSize.x, float(j)*cellSize.y)).rgb;
        }
    }
    fragColor = vec4(median(array, idx), 1.); // idx on this moment represents the actual size of thie array
}

vec3 median(vec3 array[9*9], int size) {
    array = insertionSort(array, size);
    if (size % 2 == 1) {
        return array[size/2];
    }
    else {
        return (array[size/2-1] + array[size/2]) / 2.
    }
}

float[] insertionSort(array, size) {
    return 
}