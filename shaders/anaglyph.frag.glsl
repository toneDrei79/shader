precision highp float;
uniform sampler2D image;
uniform int type;

varying vec2 vUv;
void main(void) {
    vec2 uv = vUv.xy;

    mat3 leftmat = mat3(0.);
    mat3 rightmat = mat3(0.);

    switch (type) {
    case 0:
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
        break;
    case 1:
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
        break;
    case 2:
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
        break;
    case 3:
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
        break;
    case 4:
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
        break;
    default:
    }

    vec3 left = texture2D(image, vec2(uv.x/2., uv.y)).rgb;
    vec3 right = texture2D(image, vec2(uv.x/2.+.5, uv.y)).rgb;
    gl_FragColor = vec4(left*leftmat+right*rightmat, 1.);
}