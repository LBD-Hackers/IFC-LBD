import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    typescript(/*{ plugin options }*/),
    // json(),
    babel({
      exclude: "node_modules/(?!web-ifc)"
    })
  ]
};