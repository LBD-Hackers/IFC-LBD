import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const extensions = ['.js', '.ts' ];
const globalVarNames = {
  'web-ifc/web-ifc-api': 'WebIFC',
  'web-ifc': 'webIfc',
  'jsonld': 'jsonld',
  'n3': 'N3',
  '@comunica/actor-init-sparql-rdfjs': 'comunica'
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/bundles/bundle.esm.js',
        format: 'esm',
        sourcemap: true,
        globals: globalVarNames
      },
      {
        file: 'lib/bundles/bundle.esm.min.js',
        format: 'esm',
        plugins: [terser()],
        sourcemap: true,
        globals: globalVarNames
      },
      {
        file: 'lib/bundles/bundle.umd.js',
        format: 'umd',
        name: 'ifc-lbd',
        sourcemap: true,
        globals: globalVarNames
      },
      {
        file: 'lib/bundles/bundle.umd.min.js',
        format: 'umd',
        name: 'ifc-lbd',
        plugins: [terser()],
        sourcemap: true,
        globals: globalVarNames
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ extensions }),
      commonjs(),
      builtins(),
      globals(),
      babel({
        babelHelpers: "runtime",
        include: ['src/**/*.ts'], 
        extensions, 
        exclude: "node_modules/(?!web-ifc)",
        "plugins": [["@babel/plugin-transform-runtime", {
            "regenerator": true
          }]
        ]
      })
    ]
  },
  {
    // Add type declarations
    input: './lib/types/src/index.d.ts',
    output: [
      { file: 'lib/bundles/bundle.esm.d.ts', format: 'es' },
      { file: 'lib/bundles/bundle.esm.min.d.ts', format: 'es' },
      { file: 'lib/bundles/bundle.umd.d.ts', format: 'es' },
      { file: 'lib/bundles/bundle.umd.min.d.ts', format: 'es' }
    ],
    plugins: [dts()],
  }
]