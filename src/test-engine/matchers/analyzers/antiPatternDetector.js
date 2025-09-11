/**
 * Anti-pattern detector - detects common YAML pattern anti-patterns
 * Follows single responsibility principle - only concerned with anti-pattern detection
 */

/**
 * Detect common YAML pattern anti-patterns and provide guidance
 * @param {Object} testStructure - The parsed test structure
 * @returns {Array} Array of anti-pattern warnings
 */
export function detectAntiPatterns(testStructure) {
  const warnings = [];

  if (!testStructure || !testStructure.expect) {
    return warnings;
  }

  const yamlString = JSON.stringify(testStructure);

  // Check for arrayElements vs arrayElement
  if (yamlString.includes('arrayElement:') && !yamlString.includes('arrayElements:')) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found "arrayElement:" - did you mean "arrayElements:"? The pattern name should be plural.',
      fix: 'Change "match:arrayElement:" to "match:arrayElements:"',
    });
  }

  // Check for comma-separated ranges
  if (yamlString.includes('between:') && yamlString.includes(',')) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found comma in "between:" pattern - use colon as delimiter',
      fix: 'Change "match:between:10,100" to "match:between:10:100"',
    });
  }

  // Check for missing match: prefix on likely patterns
  const expectStr = JSON.stringify(testStructure.expect);
  const likelyPatterns = expectStr.match(/"(arrayLength:|contains:|type:|startsWith:|endsWith:)[^"]*"/g);
  if (likelyPatterns) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found pattern without "match:" prefix',
      fix: 'Add "match:" prefix to pattern strings, e.g., "match:arrayLength:5"',
    });
  }

  // Check for quoted regex patterns
  if (yamlString.includes('"match:regex:') || yamlString.includes('\'match:regex:')) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found quoted regex pattern - regex patterns should not be quoted',
      fix: 'Remove quotes around regex patterns: use match:regex:\\d+ not "match:regex:\\d+"',
    });
  }

  // Check for capitalized type names
  if (yamlString.includes('type:String') || yamlString.includes('type:Number') ||
      yamlString.includes('type:Boolean') || yamlString.includes('type:Array') ||
      yamlString.includes('type:Object')) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found capitalized type names - type names should be lowercase',
      fix: 'Use lowercase type names: "string", "number", "boolean", "array", "object"',
    });
  }

  // Check for double-escaped regex patterns
  if (yamlString.includes('\\\\\\\\d') || yamlString.includes('\\\\\\\\w') || yamlString.includes('\\\\\\\\s')) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found double-escaped regex patterns',
      fix: 'Use single escaping in regex: \\d+ not \\\\d+',
    });
  }

  // Check for common misspellings
  if (yamlString.includes('lenght:') || yamlString.includes('aproximately:') ||
      yamlString.includes('startWith:') || yamlString.includes('endWith:')) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found common pattern name misspellings',
      fix: 'Check spelling: "length", "approximately", "startsWith", "endsWith"',
    });
  }

  // Check for wrong operators
  if (yamlString.includes('match:=') || yamlString.includes('match:==') ||
      yamlString.includes('match:!=') || yamlString.includes('match:>') ||
      yamlString.includes('match:<')) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found programming operator symbols in patterns',
      fix: 'Use pattern names: "equals:", "notEquals:", "greaterThan:", "lessThan:"',
    });
  }

  // Check for missing colon after pattern names
  const patternNamesWithoutColon = yamlString.match(/"match:(arrayLength|contains|type|startsWith|endsWith|regex)"/g);
  if (patternNamesWithoutColon) {
    warnings.push({
      type: 'anti_pattern',
      message: 'Found pattern names without colons',
      fix: 'Add colon after pattern name: "match:arrayLength:" not "match:arrayLength"',
    });
  }

  // Check for improper arrayContains usage
  if (yamlString.includes('arrayContains:') && yamlString.split('arrayContains:').length > 1) {
    const arrayContainsParts = yamlString.split('arrayContains:');
    for (let i = 1; i < arrayContainsParts.length; i++) {
      const part = arrayContainsParts[i].split('"')[0];
      if (part && part.split(':').length === 1 && part.trim().length === 0) {
        warnings.push({
          type: 'anti_pattern',
          message: 'Found arrayContains without value specification',
          fix: 'Specify value for arrayContains: "match:arrayContains:expectedValue" or "match:arrayContains:field:value"',
        });
        break;
      }
    }
  }

  // Check for extractField without proper dot notation
  if (yamlString.includes('extractField:')) {
    const extractFieldPattern = yamlString.match(/"extractField:([^"]+)"/g);
    if (extractFieldPattern) {
      for (const pattern of extractFieldPattern) {
        const fieldPath = pattern.split('extractField:')[1].replace('"', '');
        if (fieldPath && !fieldPath.includes('.') && !fieldPath.includes('*')) {
          warnings.push({
            type: 'anti_pattern',
            message: 'Found extractField without proper dot notation path',
            fix: 'Use dot notation: "match:extractField:tools.*.name" or "match:extractField:result.items.0.id"',
          });
          break;
        }
      }
    }
  }

  // Check for mixing exact and pattern matching in same object
  const expectObject = testStructure.expect;
  if (expectObject && expectObject.response && expectObject.response.result) {
    const result = expectObject.response.result;
    const keys = Object.keys(result);

    // Check if same key appears with both pattern and exact value
    for (const key of keys) {
      if (typeof result[key] === 'string' && result[key].startsWith('match:')) {
        // This key uses pattern matching - check if any other keys conflict
        if (keys.filter(k => k === key).length > 1) {
          warnings.push({
            type: 'anti_pattern',
            message: `Found duplicate key "${key}" mixing pattern and exact matching`,
            fix: 'Use separate test cases for pattern matching and exact value matching',
          });
        }
      }
    }
  }

  return warnings;
}
