precision highp float;
const int kernelSizeDiv2 = 2;
uniform sampler2D image;
uniform int sizeDiv2;
uniform vec2 resolution;
uniform float colorScaleR;
uniform float colorScaleG;
uniform float colorScaleB;
uniform bool invert;

varying vec2 vUv;
void main(void) {
    vec2 uv = vUv.xy;
    
    vec3 right = texture2D(image, vec2(uv.x/2.+.5, uv.y)).rgb;
    gl_FragColor = vec4(right, 1.);
}