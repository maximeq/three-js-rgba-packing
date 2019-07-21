
// This file can be require in nodejs or directly included in a browser

// This contains functions and shaders examples to pack data into a texture
// and read it back.
// Taken and adapted from :
// https://stackoverflow.com/questions/18453302/how-do-you-pack-one-32bit-int-into-4-8bit-ints-in-glsl-webgl
//
// TODO : Packing functions for Uint32
//        Help : https://stackoverflow.com/questions/31276114/three-js-large-array-of-int-as-uniform

(function() {

    var RGBAPacking = function(){

        return {
            version:"1.0.0",
            encodeUInt32:function(i, rgba){
                throw "Not implemented yet.";
            },
            decodeUInt32:function(rgba){
                throw "Not implemented yet.";
            },
            // Encode Float32 values in range [0;1[, Note that 1 is excluded.
            // The closest to 1.0 value you can encode is 1-1e-7.
            encodeUnitFloat32:function(f, rgba){
                var rgba = rgba ? rgba : new Float32Array([0,0,0,0]);
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
        };
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
        module.exports = RGBAPacking();
    }else{
        window.RGBAPacking = RGBAPacking();
    }
})();



