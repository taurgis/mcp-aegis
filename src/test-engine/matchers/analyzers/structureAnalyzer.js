/**
 * Structure analyzer - analyzes YAML structure errors
 * Follows single responsibility principle - only concerned with YAML structure validation
 */

import { createSuggestion } from '../utils/formatters.js';

/**
 * Analyze YAML structure for common errors
 * @param {Object} yamlContext - Context about YAML structure
 * @returns {Array} Array of structure error suggestions
 */
export function analyzeStructureErrors(yamlContext) {
  const suggestions = [];

  // Check for extractField without value
  if (yamlContext.hasExtractField && !yamlContext.hasValue) {
    suggestions.push(createSuggestion({
      type: 'structure_error',
      original: 'match:extractField without value',
      corrected: 'match:extractField with value key',
      message: 'When using "match:extractField", you must also include a "value:" key with the expected extracted values',
      example: `
  match:extractField: "tools.*.name"
  value:
    - "expected_tool_name"`,
    }));
  }

  // Check for duplicate keys
  if (yamlContext.hasDuplicateKeys) {
    suggestions.push(createSuggestion({
      type: 'structure_error',
      original: 'Duplicate YAML keys',
      corrected: 'Unique YAML keys',
      message: 'Remove duplicate YAML keys. Each key can only appear once in the same object level',
      example: `
# ❌ WRONG - Duplicate keys
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # This overwrites the previous line!

# ✅ CORRECT - Separate tests
- it: "should have correct array length"
  expect:
    result:
      tools: "match:arrayLength:1"
      
- it: "should contain expected tools"
  expect:
    result:
      tools: ["read_file"]`,
    }));
  }

  // Check for partial matching without match:partial:
  if (yamlContext.hasPartialMatching && !yamlContext.hasPartialPattern) {
    suggestions.push(createSuggestion({
      type: 'structure_error',
      original: 'Incomplete object matching',
      corrected: 'Use match:partial: for partial matching',
      message: 'For partial object matching, wrap the expected structure with "match:partial:"',
      example: `
# ❌ WRONG - This expects exact match
result:
  tools:
    - name: "read_file"

# ✅ CORRECT - This allows partial matching
result:
  match:partial:
    tools:
      - name: "read_file"`,
    }));
  }

  // Check for arrayElements without proper structure
  if (yamlContext.hasArrayElements && !yamlContext.hasProperArrayElementsStructure) {
    suggestions.push(createSuggestion({
      type: 'structure_error',
      original: 'Incorrect arrayElements structure',
      corrected: 'Proper arrayElements pattern',
      message: '"match:arrayElements:" should be followed by an object defining the expected structure for each array element',
      example: `
# ❌ WRONG
tools: "match:arrayElements:name:description"

# ✅ CORRECT
tools:
  match:arrayElements:
    name: "match:type:string"
    description: "match:type:string"`,
    }));
  }

  // Check for mixing patterns and exact values in same object
  if (yamlContext.hasMixedPatterns) {
    suggestions.push(createSuggestion({
      type: 'structure_error',
      original: 'Mixed patterns and exact values',
      corrected: 'Separate pattern and exact validations',
      message: 'Avoid mixing pattern matching and exact value matching in the same test. Use separate test cases.',
      example: `
# ❌ WRONG - Mixing patterns and exact values
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # This causes conflicts

# ✅ CORRECT - Separate tests
- it: "should have correct array length"
  expect:
    result:
      tools: "match:arrayLength:1"
      
- it: "should contain expected tools"  
  expect:
    result:
      tools: ["read_file"]`,
    }));
  }

  // Check for incorrect YAML nesting for patterns
  if (yamlContext.hasIncorrectNesting) {
    suggestions.push(createSuggestion({
      type: 'structure_error',
      original: 'Incorrect YAML nesting',
      corrected: 'Proper YAML structure',
      message: 'Pattern objects should be properly nested. Each pattern should be a separate key-value pair.',
      example: `
# ❌ WRONG - Improper nesting
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # This conflicts with the above

# ✅ CORRECT - Proper nesting
result:
  content:
    match:arrayElements:
      type: "text"
      
# OR for exact matching:
result:
  content:
    - type: "text"
      text: "expected content"`,
    }));
  }

  // Check for stderr validation errors
  if (yamlContext.hasInvalidStderrPattern) {
    suggestions.push(createSuggestion({
      type: 'structure_error',
      original: 'Invalid stderr pattern',
      corrected: 'Valid stderr validation',
      message: 'stderr validation should use "toBeEmpty" or "match:" patterns',
      example: `
# ✅ CORRECT stderr validation
expect:
  response:
    # ... response validation
  stderr: "toBeEmpty"

# OR with pattern matching
expect:
  response:
    # ... response validation  
  stderr: "match:contains:Warning"`,
    }));
  }

  return suggestions;
}
