// Sync object
module.exports = {
  verbose: true,
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "node_modules/(?!web-ifc)",
    "node_modules/(?!jsonld)"
  ],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  testTimeout: 10000,
  globals: { fetch }
};