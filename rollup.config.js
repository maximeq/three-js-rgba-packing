// import of our plugins
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: './src/RGBAPacking.js',
    output: {
        file: './dist/browser/three-js-rgba-packing.js',
        format: 'cjs'
    },
    external: ['three-full'],
    plugins: [
        commonjs(), // require
        resolve(), // modules from node_modules
    ]
};
