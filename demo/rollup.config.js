import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/app.js',
  output: [
    {
      format: 'esm',
      file: 'src/bundle.js',
      sourcemap: true
    }
  ],
  plugins: [
    serve({
      open: true,
      contentBase: 'src',
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    globals(),
    builtins(),
    json()
  ]
};
