precision highp float;
uniform sampler2D image;
uniform vec2 resolution;
uniform int mode;
uniform int kernel;
uniform int sigma;
in vec2 vUv;
out vec4 fragColor;

void main(void) {
    vec2 uv = vUv.xy;

    fragColor = texture2D(image, uv);
}