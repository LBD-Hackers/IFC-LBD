import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs';

const globalVarNames = {
  'queue-microtask': 'queueMicrotask'
}
const extensions = ['.js', '.ts' ];

export default {
  input: 'src/app.js',
  output: [
    {
      format: 'esm',
      file: 'src/bundle.js'
    }
  ],
  plugins: [
    serve({
      open: true,
      contentBase: 'src',
    }),
    resolve({ 
      browser: true
    }),
    commonjs()
  ]
};