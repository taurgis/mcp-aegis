import { parseOptions, getOutputConfig } from './src/cli/interface/options.js';

// Test case 1: Check the exact behavior
const rawOptions = {
  verbose: 'true',
  debug: 1,
  timing: 'yes',
  json: {},
};

const result = parseOptions(rawOptions);
console.log('parseOptions result:', result);

// Test case 2: Check getOutputConfig with undefined values
const options = {
  verbose: undefined,
  debug: undefined,
  timing: undefined,
  json: undefined,
  quiet: undefined,
};

const outputConfig = getOutputConfig(options);
console.log('getOutputConfig result:', outputConfig);

// Test case 3: Check specific assertions
console.log('verbose === true?', result.verbose === true);
console.log('showDetails === false?', outputConfig.showDetails === false);
