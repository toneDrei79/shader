precision highp float;
uniform sampler2D image;
uniform int mode;
in vec2 vUv;
out vec4 fragColor;

void main(void) {
    vec2 uv = vUv.xy;

    if (mode == 0) { // right
        vec3 right = texture2D(image, vec2(uv.x/2.+.5, uv.y)).rgb;
        fragColor = vec4(right, 1.);
        return;
    }
    
    mat3 leftmat = mat3(0.);
    mat3 rightmat = mat3(0.);
    if (mode == 1) { // true
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
    else if (mode == 2) { // gray
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
    else if (mode == 3) { // color
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
    else if (mode == 4) { // halfcolor
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
    else if (mode == 5) { // optimized
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

    vec3 left = texture2D(image, vec2(uv.x/2., uv.y)).rgb;
    vec3 right = texture2D(image, vec2(uv.x/2.+.5, uv.y)).rgb;
    fragColor = vec4(left*leftmat+right*rightmat, 1.);
}