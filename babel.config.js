const sharedPresets = ['@babel/typescript'];
const shared = {
  ignore: ['src/**/*.spec.ts'],
  presets: sharedPresets,
  exclude: "node_modules/(?!web-ifc)",
  plugins: [["@babel/plugin-transform-runtime", {
    "regenerator": true
  }]
]
}

module.exports = {
  // for tests
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript'
  ],
  env: {
    esmUnbundled: shared,
    // ESM for web
    esmBundled: {
      ...shared,
      presets: [['@babel/env', {
        targets: "> 0.25%, not dead"
      }], ...sharedPresets],
    },
    // CJS for node
    cjs: {
      ...shared,
      presets: [['@babel/env', {
        modules: 'commonjs'
      }], ...sharedPresets]
    }
  }
}