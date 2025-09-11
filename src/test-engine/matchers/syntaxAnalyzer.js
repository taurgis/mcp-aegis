/**
 * Syntax Analyzer - Detects and provides corrections for common YAML pattern syntax errors
 * Follows single responsibility principle - only concerned with syntax error detection and correction
 */

/**
 * Common syntax error patterns and their corrections
 */
const SYNTAX_CORRECTIONS = {
  // Pattern naming errors
  'match:arrayElement:': 'match:arrayElements:',
  'match:arrayElement': 'match:arrayElements',
  'arrayElement:': 'arrayElements:',
  'arrayElement': 'arrayElements',
  'match:extractFields:': 'match:extractField:',
  'match:extractFields': 'match:extractField',
  'extractFields:': 'extractField:',
  'extractFields': 'extractField',

  // Pattern delimiter errors
  'match:between:': {
    pattern: /^between:(\d+),(\d+)$/,
    correction: (match, p1, p2) => `between:${p1}:${p2}`,
    message: 'Use colon (:) instead of comma (,) as delimiter',
  },
  'match:range:': {
    pattern: /^range:(\d+),(\d+)$/,
    correction: (match, p1, p2) => `range:${p1}:${p2}`,
    message: 'Use colon (:) instead of comma (,) as delimiter',
  },
  'match:dateBetween:': {
    pattern: /^dateBetween:([^,]+),([^,]+)$/,
    correction: (match, p1, p2) => `dateBetween:${p1}:${p2}`,
    message: 'Use colon (:) instead of comma (,) as delimiter',
  },

  // Missing match: prefix
  'arrayLength:': 'match:arrayLength:',
  'arrayContains:': 'match:arrayContains:',
  'contains:': 'match:contains:',
  'startsWith:': 'match:startsWith:',
  'endsWith:': 'match:endsWith:',
  'type:': 'match:type:',
  'regex:': 'match:regex:',
  'length:': 'match:length:',
  'between:': 'match:between:',
  'range:': 'match:range:',
  'greaterThan:': 'match:greaterThan:',
  'lessThan:': 'match:lessThan:',
  'equals:': 'match:equals:',
  'notEquals:': 'match:notEquals:',
  'approximately:': 'match:approximately:',
  'multipleOf:': 'match:multipleOf:',
  'dateAfter:': 'match:dateAfter:',
  'dateBefore:': 'match:dateBefore:',
  'dateValid': 'match:dateValid',
  'dateAge:': 'match:dateAge:',
  'dateEquals:': 'match:dateEquals:',
  'dateFormat:': 'match:dateFormat:',

  // Wrong quotes in regex
  'match:"regex:': 'match:regex:',
  "match:'regex:": 'match:regex:',

  // Type case errors
  'match:type:String': 'match:type:string',
  'match:type:Number': 'match:type:number',
  'match:type:Boolean': 'match:type:boolean',
  'match:type:Object': 'match:type:object',
  'match:type:Array': 'match:type:array',
  'match:type:Function': 'match:type:function',
  'match:type:Undefined': 'match:type:undefined',
  'match:type:Null': 'match:type:null',

  // Regex escaping issues
  'match:\\\\d+': 'match:\\d+',
  'match:\\\\w+': 'match:\\w+',
  'match:\\\\s+': 'match:\\s+',

  // Boolean string confusion
  'match:type:"boolean"': 'match:type:boolean',
  "match:type:'boolean'": 'match:type:boolean',
  'match:type:"string"': 'match:type:string',
  "match:type:'string'": 'match:type:string',
  'match:type:"number"': 'match:type:number',
  "match:type:'number'": 'match:type:number',
  'match:type:"object"': 'match:type:object',
  "match:type:'object'": 'match:type:object',
  'match:type:"array"': 'match:type:array',
  "match:type:'array'": 'match:type:array',
};

/**
 * Special pattern structure errors that need context-aware suggestions
 * Note: Reserved for future extensibility
 */

/**
 * Analyze pattern for syntax errors and suggest corrections
 * @param {string} pattern - The pattern string to analyze
 * @param {Object} context - Additional context (yamlStructure, actualValue, etc.)
 * @returns {Object} Analysis result with suggestions
 */
export function analyzeSyntaxErrors(pattern, context = {}) {
  const suggestions = [];

  if (typeof pattern !== 'string') {
    return { hasSyntaxErrors: false, suggestions: [] };
  }

  // First check for direct string replacements (most specific matches first)
  let foundDirectReplacement = false;

  // Check for most specific errors first - use exact matches where possible
  const exactMatches = [
    'match:arrayElement:', 'match:arrayElement',
    'arrayElement:', 'arrayElement',
    'match:extractFields:', 'match:extractFields',
    'extractFields:', 'extractFields',
  ];

  // Check exact matches first
  for (const errorPattern of exactMatches) {
    if (pattern === errorPattern && SYNTAX_CORRECTIONS[errorPattern]) {
      const correction = SYNTAX_CORRECTIONS[errorPattern];
      if (typeof correction === 'string') {
        suggestions.push({
          type: 'direct_replacement',
          original: errorPattern,
          corrected: correction,
          pattern: correction,
          message: `Replace "${errorPattern}" with "${correction}"`,
        });
        foundDirectReplacement = true;
        break;
      }
    }
  }

  // If no exact match, check for patterns that need regex handling
  if (!foundDirectReplacement) {
    for (const [_errorPattern, correction] of Object.entries(SYNTAX_CORRECTIONS)) {
      if (typeof correction === 'object' && correction.pattern) {
        // Handle regex-based corrections
        const patternWithoutMatch = pattern.replace(/^match:/, '');
        const match = patternWithoutMatch.match(correction.pattern);
        if (match) {
          const correctedPattern = correction.correction(...match);
          suggestions.push({
            type: 'regex_replacement',
            original: pattern,
            corrected: `match:${correctedPattern}`,
            pattern: `match:${correctedPattern}`,
            message: correction.message,
          });
          foundDirectReplacement = true;
          break;
        }
      }
    }
  }

  // If still no replacement, check for partial matches for missing prefixes
  if (!foundDirectReplacement) {
    for (const [errorPattern, correction] of Object.entries(SYNTAX_CORRECTIONS)) {
      if (typeof correction === 'string') {
        // For patterns that should start with match:, only flag if they don't have the prefix
        if (errorPattern.endsWith(':') && pattern.startsWith('match:')) {
          continue; // This pattern already has match: prefix, skip this correction
        }

        // Check if pattern contains the error pattern (for missing prefix cases)
        if (pattern.includes(errorPattern) && !pattern.startsWith('match:')) {
          suggestions.push({
            type: 'direct_replacement',
            original: errorPattern,
            corrected: correction,
            pattern: pattern.replace(errorPattern, correction),
            message: `Replace "${errorPattern}" with "${correction}"`,
          });
          foundDirectReplacement = true;
          break;
        }
      }
    }
  }

  // Only check for pattern-specific errors if no direct replacement was found
  if (!foundDirectReplacement) {
    const patternSpecificErrors = analyzePatternSpecificErrors(pattern);
    suggestions.push(...patternSpecificErrors);
  }

  // Check for structure errors if context is provided
  if (context.yamlContext) {
    const structureErrors = analyzeStructureErrors(context.yamlContext);
    suggestions.push(...structureErrors);
  }

  return {
    hasSyntaxErrors: suggestions.length > 0,
    suggestions,
  };
}

/**
 * Analyze pattern-specific common errors
 * @param {string} pattern - The pattern to analyze
 * @returns {Array} Array of suggestions
 */
function analyzePatternSpecificErrors(pattern) {
  const suggestions = [];

  // Check for missing match: prefix
  if (!pattern.startsWith('match:') && isLikelyPattern(pattern)) {
    suggestions.push({
      type: 'missing_prefix',
      original: pattern,
      corrected: `match:${pattern}`,
      pattern: `match:${pattern}`,
      message: 'Pattern strings should start with "match:" prefix',
    });
  }

  // Check for wrong delimiter in numeric ranges
  if (pattern.includes(',') && (pattern.includes('between:') || pattern.includes('range:') || pattern.includes('dateBetween:'))) {
    const corrected = pattern.replace(/,/g, ':');
    suggestions.push({
      type: 'wrong_delimiter',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use colon (:) instead of comma (,) to separate range values',
    });
  }

  // Check for quoted boolean/string types
  if (pattern.includes('type:') && (pattern.includes('"') || pattern.includes("'"))) {
    const corrected = pattern.replace(/["']/g, '');
    suggestions.push({
      type: 'quoted_type',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Type patterns should not be quoted. Use match:type:string not match:type:"string"',
    });
  }

  // Check for incorrect regex escaping
  if (pattern.includes('\\\\') && pattern.includes('regex:')) {
    const corrected = pattern.replace(/\\\\/g, '\\');
    suggestions.push({
      type: 'double_escape',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Avoid double-escaping in regex patterns. Use \\d+ not \\\\d+',
    });
  }

  // Check for capitalized type names
  if (pattern.includes('type:') && /type:[A-Z]/.test(pattern)) {
    const corrected = pattern.replace(/type:([A-Z]\w*)/g, (match, type) => `type:${type.toLowerCase()}`);
    suggestions.push({
      type: 'capitalized_type',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Type names should be lowercase. Use "string" not "String"',
    });
  }

  return suggestions;
}

/**
 * Check if a string looks like a pattern that should have match: prefix
 * @param {string} str - String to check
 * @returns {boolean} Whether it looks like a pattern
 */
function isLikelyPattern(str) {
  const patternIndicators = [
    'arrayLength:', 'arrayContains:', 'contains:', 'startsWith:', 'endsWith:',
    'type:', 'regex:', 'length:', 'between:', 'range:', 'greaterThan:', 'lessThan:',
    'equals:', 'notEquals:', 'approximately:', 'multipleOf:', 'dateAfter:',
    'dateBefore:', 'dateValid', 'dateAge:', 'dateEquals:', 'dateFormat:',
  ];

  return patternIndicators.some(indicator => str.includes(indicator));
}

/**
 * Analyze YAML structure for common errors
 * @param {Object} yamlContext - Context about YAML structure
 * @returns {Array} Array of structure error suggestions
 */
function analyzeStructureErrors(yamlContext) {
  const suggestions = [];

  // Check for extractField without value
  if (yamlContext.hasExtractField && !yamlContext.hasValue) {
    suggestions.push({
      type: 'structure_error',
      original: 'match:extractField without value',
      corrected: 'match:extractField with value key',
      message: 'When using "match:extractField", you must also include a "value:" key with the expected extracted values',
      example: `
  match:extractField: "tools.*.name"
  value:
    - "expected_tool_name"`,
    });
  }

  // Check for duplicate keys
  if (yamlContext.hasDuplicateKeys) {
    suggestions.push({
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
    });
  }

  return suggestions;
}

/**
 * Generate enhanced error message with syntax corrections
 * @param {string} originalError - Original error message
 * @param {string} pattern - The pattern that failed
 * @param {*} actualValue - The actual value
 * @param {Object} context - Additional context
 * @returns {Object} Enhanced error with syntax suggestions
 */
export function enhanceErrorWithSyntaxSuggestions(originalError, pattern, actualValue, context = {}) {
  const syntaxAnalysis = analyzeSyntaxErrors(pattern, context);

  if (!syntaxAnalysis.hasSyntaxErrors) {
    return {
      message: originalError,
      suggestions: [],
    };
  }

  const syntaxSuggestions = syntaxAnalysis.suggestions.map(suggestion => {
    let message = `🔧 Syntax Fix: ${suggestion.message}`;
    if (suggestion.corrected !== suggestion.original) {
      message += `\n   Change: "${suggestion.original}" → "${suggestion.corrected}"`;
    }
    if (suggestion.example) {
      message += `\n   Example: ${suggestion.example}`;
    }
    return message;
  });

  return {
    message: originalError,
    syntaxSuggestions,
    hasSyntaxErrors: true,
  };
}

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

  // Check for arrayElements vs arrayElement
  const yamlString = JSON.stringify(testStructure);
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

  return warnings;
}
