precision highp float;
uniform sampler2D image;
uniform int mode;
in vec2 vUv;
out vec4 fragColor;

void main(void) {
    vec2 uv = vUv.xy;

    fragColor = vec4(texture2D(image, uv));
}