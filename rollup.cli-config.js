import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import shebang from 'rollup-plugin-preserve-shebang'; // Allows the '#!/usr/bin/env node' in the entry file
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const extensions = ['.js', '.ts' ];

export default  {
  input: 'src/cli-index.ts',
  output: [
    {
      file: 'lib/cli-tool/index.js',
      format: 'cjs'
    }
  ],
  plugins: [
    peerDepsExternal(),
    json(),
    resolve({ extensions }),
    commonjs(),
    shebang(),
    babel({
      babelHelpers: "runtime",
      include: ['src/**/*.ts'], 
      extensions, 
      exclude: "node_modules/(?!web-ifc)",
      "plugins": [["@babel/plugin-transform-runtime", {
          "regenerator": true
        }]
      ]
    }),
    copy({
      targets: [
        // { src: 'src/bin', dest: 'dist/' },
        { src: 'node_modules/web-ifc/web-ifc.wasm', dest: 'lib/cli-tool' },
        { src: 'node_modules/web-ifc/web-ifc-mt.wasm', dest: 'lib/cli-tool' }
      ]
    }),
  ],
  onwarn: function(warning) {
    // Skip certain warnings

    // should intercept ... but doesn't in some rollup versions
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }

    // console.warn everything else
    console.warn( warning.message );
}
}