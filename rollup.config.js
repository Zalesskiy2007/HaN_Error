// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
//import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
    input: './client/main.tsx',
    output: {
        dir: 'out',
        format: 'iife',
        name: 'XXX',
        sourcemap: 'inline'
    },
    plugins: [
        typescript(),
        nodeResolve({
            browser: true
        }),
        commonjs(),
        replace({
            'process.env.NODE_ENV': '"development"'
        })
    ]
};
