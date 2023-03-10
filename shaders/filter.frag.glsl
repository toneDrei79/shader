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

    vec2 cellSize = 1./resolution.xy;
    vec4 textureValue = vec4(0,0,0,0);
    for (int j=-kernel; j<=kernel; j++) {
        for (int i=-kernel ;i<=kernel; i++) {
            textureValue += texture2D(image, uv + vec2(float(i)*cellSize.x, float(j)*cellSize.y));
        }
    }
    textureValue /= pow(float(kernel*2+1), 2.);
    fragColor = textureValue;
}