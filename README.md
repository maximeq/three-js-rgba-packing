three-js-rgba-packing
================

[![License][license-badge]][license-badge-url]

**Examples work with Three r0.96.0 !!!**

## RGBA Packing ##

Functions to pack and unpack native float and integer types in RGBA textures, and read them in shaders.
Main functions in Javascript and GLSL.
Comes with an HTML test page using THREE.JS, to be easily included in your THREE.JS code.

### Unit Float32 to RGBA Packing ###

For now this code only provides functions for float32 in range [0;1[
1.0 is excluded from the range. The maximum number that can be stored is something like 1.0 - 1.e-7.

### Full range Float32 to RGBA Packing ###

No functinons for now. The easier way is probably to use Unit Float32 and map it to a minValue,maxValue range.

### Uint32 to RGBA Packing ###

Todo.


