// // import { nodeResolve } from '@rollup/plugin-node-resolve';
// import json from '@rollup/plugin-json';
// import { babel } from '@rollup/plugin-babel';
// import resolve from '@rollup/plugin-node-resolve';
// import copy from 'rollup-plugin-copy';
// import commonjs from '@rollup/plugin-commonjs';
// import multiInput from 'rollup-plugin-multi-input'; // Necessary when having a separate entry point for CLI tool
// import shebang from 'rollup-plugin-preserve-shebang'; // Allows the '#!/usr/bin/env node' in the entry file
// import dts from "rollup-plugin-dts"; // Datatypes

// const extensions = ['.js', '.ts' ];

// export default {
//   // input: './src/index.ts',
//   input: ['src/index.ts', 'src/cli-index.ts'],
//   output: {
//     dir: 'dist',
//     format: 'cjs'
//   },
//   plugins: [
//     resolve({ extensions }),
//     // commonjs(),
//     json(),
//     // babel({
//     //   exclude: "node_modules/(?!web-ifc)"
//     // }),
//     copy({
//       targets: [
//         // { src: 'src/bin', dest: 'dist/' },
//         { src: 'node_modules/web-ifc/web-ifc.wasm', dest: 'dist/' },
//         { src: 'node_modules/web-ifc/web-ifc-mt.wasm', dest: 'dist/' }
//       ]
//     }),
//     shebang(),
//     multiInput(),
//     dts()
//   ]
// };

import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';

const extensions = ['.js', '.ts' ];

export default  {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/bundles/bundle.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.umd.js',
      format: 'umd',
      name: 'ifc-lbd',
      sourcemap: true
    },
    {
      file: 'lib/bundles/bundle.umd.min.js',
      format: 'umd',
      name: 'ifc-lbd',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({ babelHelpers: 'bundled', include: ['src/**/*.ts'], extensions, exclude: './node_modules/**'})
  ]
}