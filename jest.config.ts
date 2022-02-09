import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
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
export default config;