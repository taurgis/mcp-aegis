import { analyzeNonExistentFeatures, getNonExistentFeatureAnalytics } from './src/test-engine/matchers/corrections/nonExistentFeatures.js';

// Test some non-existent patterns
console.log('=== Testing Non-Existent Patterns ===');
console.log('match:email:valid:', analyzeNonExistentFeatures('match:email:valid').length > 0 ? '✅ DETECTED' : '❌ MISSED');
console.log('match:positive:', analyzeNonExistentFeatures('match:positive:').length > 0 ? '✅ DETECTED' : '❌ MISSED');
console.log('match:alphabetic:', analyzeNonExistentFeatures('match:alphabetic:').length > 0 ? '✅ DETECTED' : '❌ MISSED');

// Test confusing patterns
console.log('\n=== Testing Confusing Patterns ===');
console.log('match:arrayHas:', analyzeNonExistentFeatures('match:arrayHas:value').length > 0 ? '✅ DETECTED' : '❌ MISSED');
console.log('match:getField:', analyzeNonExistentFeatures('match:getField:name').length > 0 ? '✅ DETECTED' : '❌ MISSED');

// Test sounds-like patterns
console.log('\n=== Testing Sounds-Like Patterns ===');
console.log('match:validate:', analyzeNonExistentFeatures('match:validate:email').length > 0 ? '✅ DETECTED' : '❌ MISSED');
console.log('match:is:', analyzeNonExistentFeatures('match:is:valid').length > 0 ? '✅ DETECTED' : '❌ MISSED');

// Test valid patterns (should not be detected)
console.log('\n=== Testing Valid Patterns (should NOT be detected) ===');
console.log('match:regex:', analyzeNonExistentFeatures('match:regex:pattern').length === 0 ? '✅ CORRECTLY IGNORED' : '❌ FALSE POSITIVE');
console.log('match:type:', analyzeNonExistentFeatures('match:type:string').length === 0 ? '✅ CORRECTLY IGNORED' : '❌ FALSE POSITIVE');

// Get analytics
console.log('\n=== Analytics ===');
const analytics = getNonExistentFeatureAnalytics();
console.log('Total non-existent features:', analytics.totalNonExistentFeatures);
console.log('Total confusing patterns:', analytics.totalConfusingPatterns);
console.log('Categories:', analytics.categories.join(', '));
console.log('Most common category:', analytics.mostCommonCategory);

// Show some examples by category
console.log('\n=== Examples by Category ===');
for (const category of analytics.categories.slice(0, 3)) {
  console.log(`\n${category.toUpperCase()}:`);
  console.log('  Count:', analytics.categoryCounts[category]);
}
