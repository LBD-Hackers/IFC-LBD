// Sync object
module.exports = {
  verbose: true,
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "node_modules/(?!web-ifc)"
  ],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  testTimeout: 10000
};