precision highp float;
const int kernelSizeDiv2 = 2;
uniform sampler2D image;
uniform int sizeDiv2;
uniform vec2 resolution;
uniform float colorScaleR;
uniform float colorScaleG;
uniform float colorScaleB;
uniform bool invert;
uniform int type;

varying vec2 vUv;
void main(void) {
    vec2 uv = vUv.xy;

    mat3 leftmat = mat3(
        0., 0., 0.,
        0., 0., 0.,
        0., 0., 0.
    );
    mat3 rightmat = mat3(
        0., 0., 0.,
        0., 0., 0.,
        0., 0., 0.
    );

    if (type == 0) {
        leftmat = mat3(
            .299, .587, .114,
            .000, .000, .000,
            .000, .000, .000
        );
        rightmat = mat3(
            .000, .000, .000,
            .000, .000, .000,
            .299, .587, .114
        );
    }
    else if (type == 1) {
        leftmat = mat3(
            .299, .587, .114,
            .000, .000, .000,
            .000, .000, .000
        );
        rightmat = mat3(
            .000, .000, .000,
            .299, .587, .114,
            .299, .587, .114
        );
    }
    else if (type == 2) {
        leftmat = mat3(
            1., 0., 0.,
            0., 0., 0.,
            0., 0., 0.
        );
        rightmat = mat3(
            0., 0., 0.,
            0., 1., 0.,
            0., 0., 1.
        );
    }
    else if (type == 3) {
        leftmat = mat3(
            .299, .587, .114,
            .000, .000, .000,
            .000, .000, .000
        );
        rightmat = mat3(
            0., 0., 0.,
            0., 1., 0.,
            0., 0., 1.
        );
    }
    else if (type == 4) {
        leftmat = mat3(
            .0, .7, .3,
            0., 0., 0.,
            0., 0., 0.
        );
        rightmat = mat3(
            0., 0., 0.,
            0., 1., 0.,
            0., 0., 1.
        );
    }

    vec3 left = texture2D(image, vec2(uv.x/2., 1.-uv.y)).rgb;
    vec3 right = texture2D(image, vec2(uv.x/2.+.5, 1.-uv.y)).rgb;
    gl_FragColor = vec4(left*leftmat+right*rightmat, 1.);
}