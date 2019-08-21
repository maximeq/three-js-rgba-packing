
var THREE = require("three-full");

// This file can be require in nodejs or directly included in a browser

// This contains functions and shaders examples to pack data into a texture
// and read it back.
// Taken and adapted from :
// https://stackoverflow.com/questions/18453302/how-do-you-pack-one-32bit-int-into-4-8bit-ints-in-glsl-webgl
//

var RGBAPacking = {
    encodeUInt32:function(i, rgba){
        rgba = rgba || new Float32Array(4);
        rgba[0] = (Math.trunc(i) % 256) / 255.;
        rgba[1] = (Math.trunc(i / 256) % 256) / 255.;
        rgba[2] = (Math.trunc(i / 256 / 256) % 256) / 255.;
        rgba[3] = (Math.trunc(i / 256 / 256 / 256) % 256) / 255.;

        return rgba;
    },
    decodeUInt32:function(rgba){
        return Math.round(rgba[0] * 255) +
               Math.round(rgba[1] * 255) * 256 +
               Math.round(rgba[2] * 255) * 256 * 256 +
               Math.round(rgba[3] * 255) * 256 * 256 * 256;
    },
    encodeUInt16: function (i, rg) {
        rg = rg || new Float32Array(2);
        rg[0] = (Math.trunc(i) % 256) / 255.;
        rg[1] = (Math.trunc(i / 256) % 256) / 255.;
        return rg;
    },
    decodeUInt16: function (rg) {
        return Math.round(rg[0] * 255) + Math.round(rg[1] * 255) * 256;
    },
    // Encode Float32 values in range [0;1[, Note that 1 is excluded.
    // The closest to 1.0 value you can encode is 1-1e-7.
    // When needed, a workaround consist in saving values in [0;0.5], which looses only 1 bit precision
    encodeUnitFloat32:function(f, rgba){
        rgba = rgba ? rgba : new Float32Array([0,0,0,0]);
        rgba[0] = f*1.0;
        rgba[1] = f*255.0;
        rgba[2] = f*65025.0;
        rgba[3] = f*16581375.0;

        for(var i=0; i<4; ++i){
            rgba[i] -= Math.floor(rgba[i]);
        }
        rgba[0] -= rgba[1]/255;
        rgba[1] -= rgba[2]/255;
        rgba[2] -= rgba[3]/255;

        return rgba;
    },
    decodeUnitFloat32:function(rgba){
        return rgba[0] + rgba[1]/255.0 + rgba[2]/65025.0 + rgba[3]/16581375.0;
    },
    // Following functions can be used directly in shaders
    glslEncodeUnitFloat32:[
        "vec4 encodeUnitFloat32 (float f) {",
        "    vec4 rgba = vec4(1.,255.,65025.,16581375.) * f;",
        "    rgba = fract(rgba);",
        "    rgba -= rgba.yzww * vec2(1./255., 0.).xxxy;",
        "    return rgba;",
        "}"
    ].join("\n"),
    glslDecodeUnitFloat32:[
        "float decodeUnitFloat32 (vec4 rgba) {",
        "    return dot(rgba, vec4(1.,1./255.,1./65025.,1./16581375.));",
        "}"
    ].join("\n"),

    // TODO : for some reason, this approach gives imprecise results past 24 bits (past Oxffffff), find out why
    glslEncodeUInt32: [
        "vec4 encodeUInt32(int value) {",
        "   vec4 encodeFactors = 1.0 / 256. / vec4(1., 256., 65536., 16777216.);",
        "   vec4 rgba = fract(float(value) * encodeFactors);",
        "   rgba.yzw -= rgba.xyz / 256.;",
        "   return rgba * 256. / 255.;",
        "}"
    ].join('\n'),
    glslDecodeUInt32: [
        "int decodeUInt32(vec4 value) {",
        "   ivec4 decodeFactors = ivec4(1, 256, 65536, 16777216);",
        "   ivec4 v = ivec4(255. * value);",
        "   return decodeFactors.x * v.x + decodeFactors.y * v.y + decodeFactors.z * v.z  + decodeFactors.w * v.w;",
        "}"
    ].join('\n'),

    glslEncodeUInt16: [
        "vec2 encodeUInt16(int value) {",
        "    vec2 encodeVec = vec2(1.0 / 256., 1.0 / 65536.);" +
        "    vec2 result = fract(float(value) * encodeVec);",
        "    result.y -= result.x / 256.;",
        "    return 256. * result / 255.;",
        "}"
    ].join('\n'),
    glslDecodeUInt16: [
        "int decodeUInt16(vec2 value) {",
        "   vec2 decodeVec = vec2(255., 256. * 255.);",
        "   return int(dot(value, decodeVec));",
        "}"
    ].join('\n'),
};

THREE.RGBAPacking = RGBAPacking;

module.exports = RGBAPacking;



