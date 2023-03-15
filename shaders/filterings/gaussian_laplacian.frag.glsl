precision highp float;
uniform sampler2D image;
uniform vec2 resolution;
uniform int kernelsize;
uniform float sigma;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415;
const float e = 2.7183;

void main(void) {
    vec2 uv = vUv.xy;
    
    vec2 cellSize = 1./resolution.xy;

    float filterSum = 0.;
    vec4 processedImage[3*3];
    for (int i=0; i<3*3; i++) {
        processedImage[i] = vec4(0.);
    }

    // for each 3*3 pixels
    for (int jj=0; jj<3; jj++) {
        for (int ii=0; ii<3; ii++) {
            // gaussian filterings
            for (int j=-kernelsize/2+jj-1; j<kernelsize/2+kernelsize%2+jj-1; j++) {
                for (int i=-kernelsize/2+ii-1; i<kernelsize/2+kernelsize%2+ii-1; i++) {
                    float gaussianValue = 1./(2.*PI*pow(sigma,2.)) * pow(e,-float(i*i+j*j)/(2.*pow(sigma,2.))); // take probability value from gaussian curve
                    processedImage[jj*3+ii] += gaussianValue * texture2D(image, uv + vec2(float(i)*cellSize.x, float(j)*cellSize.y));
                    filterSum += gaussianValue;
                }
            }
            processedImage[jj*3+ii] /= filterSum;
        }
    }

    vec4 textureValue = vec4(0.);
    // laplacian filtering
    for (int j=0; j<3; j++) {
        for (int i=0; i<3; i++) {
            float laplacianValue = (i==1 && j==1)? 8. : -1.; // laplacian filter with 8 neighbours
            textureValue += laplacianValue * processedImage[j*3+i];
        }
    }

    fragColor = textureValue;
}