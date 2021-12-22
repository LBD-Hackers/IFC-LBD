import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import multiInput from 'rollup-plugin-multi-input'; // Necessary when having a separate entry point for CLI tool
import shebang from 'rollup-plugin-preserve-shebang'; // Allows the '#!/usr/bin/env node' in the entry file
import dts from "rollup-plugin-dts"; // Datatypes

export default {
  // input: './src/index.ts',
  input: ['src/index.ts', 'src/cli-index.ts'],
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(/*{ plugin options }*/),
    json(),
    babel({
      exclude: "node_modules/(?!web-ifc)"
    }),
    copy({
      targets: [
        // { src: 'src/bin', dest: 'dist/' },
        { src: 'node_modules/web-ifc/web-ifc.wasm', dest: 'dist/' },
        { src: 'node_modules/web-ifc/web-ifc-mt.wasm', dest: 'dist/' }
      ]
    }),
    shebang(),
    multiInput(),
    dts()
  ]
};