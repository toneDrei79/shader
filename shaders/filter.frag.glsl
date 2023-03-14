precision highp float;
uniform sampler2D image;
uniform vec2 resolution;
uniform int mode;
uniform int kernelsize;
uniform float sigma;

uniform bool issecondstep;
uniform bool aaa;
uniform sampler2D processedimgae;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415;
const float e = 2.7183;

void main(void) {
    vec2 uv = vUv.xy;
    
    vec2 cellSize = 1./resolution.xy;
    vec4 textureValue = vec4(0.);

    if (mode == 0) { // gaussian
        float filterSum = 0.;
        for (int j=-kernelsize/2; j<kernelsize/2+kernelsize%2; j++) {
            for (int i=-kernelsize/2; i<kernelsize/2+kernelsize%2; i++) {
                float gaussianValue = 1./(2.*PI*pow(sigma,2.)) * pow(e,-float(i*i+j*j)/(2.*pow(sigma,2.))); // take probability value from gaussian curve
                textureValue += gaussianValue * texture2D(image, uv + vec2(float(i)*cellSize.x, float(j)*cellSize.y));
                filterSum += gaussianValue;
            }
        }
        textureValue /= filterSum;
    }
    else if (mode == 1) { // laplacian
        for (int j=-1; j<=1; j++) {
            for (int i=-1; i<=1; i++) {
                float laplacianValue = (i==0 && j==0)? 8. : -1.; // laplacian filter with 8 neighbours
                textureValue += laplacianValue * texture2D(image, uv + vec2(float(i)*cellSize.x, float(j)*cellSize.y));
            }
        }
    }
    else if (mode == 3) { // median

    }
    else if (mode == 4) { // gaussian + laplacian

    }
    
    fragColor = textureValue;
}