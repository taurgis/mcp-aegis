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

  // Plural/singular confusion
  'match:contain:': 'match:contains:',             // Fix missing 's'
  'match:startWith:': 'match:startsWith:',         // Fix missing 's'
  'match:endWith:': 'match:endsWith:',             // Fix missing 's'

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
  'arrayElements:': 'match:arrayElements:',
  'contains:': 'match:contains:',
  'startsWith:': 'match:startsWith:',
  'endsWith:': 'match:endsWith:',
  'type:': 'match:type:',
  'regex:': 'match:regex:',
  'regexp:': 'match:regex:',               // Common regex alias
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
  'exists': 'match:exists',
  'extractField:': 'match:extractField:',
  'partial:': 'match:partial:',
  'not:': 'match:not:',

  // Wrong quotes in regex
  'match:"regex:': 'match:regex:',
  "match:'regex:": 'match:regex:',
  '"match:regex:': 'match:regex:',
  "'match:regex:": 'match:regex:',

  // Type case errors
  'match:type:String': 'match:type:string',
  'match:type:Number': 'match:type:number',
  'match:type:Boolean': 'match:type:boolean',
  'match:type:Object': 'match:type:object',
  'match:type:Array': 'match:type:array',
  'match:type:Function': 'match:type:function',
  'match:type:Undefined': 'match:type:undefined',
  'match:type:Null': 'match:type:null',
  'match:type:Date': 'match:type:object',       // Date is actually object in JSON
  'match:type:Symbol': 'match:type:string',     // Symbol becomes string in JSON

  // Common type aliases and mistakes
  'match:type:str': 'match:type:string',
  'match:type:int': 'match:type:number',
  'match:type:integer': 'match:type:number',
  'match:type:float': 'match:type:number',
  'match:type:double': 'match:type:number',
  'match:type:bool': 'match:type:boolean',
  'match:type:obj': 'match:type:object',
  'match:type:dict': 'match:type:object',
  'match:type:list': 'match:type:array',
  'match:type:arr': 'match:type:array',

  // Regex escaping issues
  'match:\\\\d+': 'match:\\d+',
  'match:\\\\w+': 'match:\\w+',
  'match:\\\\s+': 'match:\\s+',
  'match:\\\\D+': 'match:\\D+',
  'match:\\\\W+': 'match:\\W+',
  'match:\\\\S+': 'match:\\S+',

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

  // Wrong operators or symbols
  'match:eq:': 'match:equals:',
  'match:ne:': 'match:notEquals:',
  'match:gt:': 'match:greaterThan:',
  'match:lt:': 'match:lessThan:',
  'match:gte:': 'match:greaterThanOrEqual:',
  'match:lte:': 'match:lessThanOrEqual:',
  'match:==:': 'match:equals:',
  'match:!=:': 'match:notEquals:',
  'match:>:': 'match:greaterThan:',
  'match:<:': 'match:lessThan:',
  'match:>=:': 'match:greaterThanOrEqual:',
  'match:<=:': 'match:lessThanOrEqual:',

  // Operator symbols with values (pattern matching)
  'match:>5': 'match:greaterThan:5',
  'match:<10': 'match:lessThan:10',
  'match:>=0': 'match:greaterThanOrEqual:0',
  'match:<=100': 'match:lessThanOrEqual:100',
  'match:=value': 'match:equals:value',
  'match:==value': 'match:equals:value',
  'match:!=value': 'match:notEquals:value',

  // Type with quoted values (remove quotes)
  'match:"String"': 'match:type:string',
  'match:"Number"': 'match:type:number',
  'match:"Boolean"': 'match:type:boolean',
  'match:"Object"': 'match:type:object',
  'match:"Array"': 'match:type:array',

  // Capitalized types without quotes
  'match:Number:': 'match:type:number',
  'match:String:': 'match:type:string',
  'match:Boolean:': 'match:type:boolean',
  'match:Object:': 'match:type:object',
  'match:Array:': 'match:type:array',

  // Common misspellings
  'match:aproximate:': 'match:approximately:',
  'match:multiple:': 'match:multipleOf:',
  'match:divisible:': 'match:multipleOf:',

  // Misspelling with regex patterns
  'match:lenght:': {
    pattern: /^lenght:(\d+)$/,
    correction: (match, num) => `length:${num}`,
    message: 'Misspelling: use "length" instead of "lenght"',
  },
  'match:aproximately:': {
    pattern: /^aproximately:(.+)$/,
    correction: (match, value) => `approximately:${value}`,
    message: 'Misspelling: use "approximately" instead of "aproximately"',
  },

  // Wrong pattern structures
  'match:arrayContains:name:': {
    pattern: /^arrayContains:([^:]+):(.*)$/,
    correction: (match, field, value) => `arrayContains:${field}:${value}`,
    message: 'Use format "match:arrayContains:fieldName:expectedValue" for object field matching',
  },
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

  // First, check for pattern-specific errors (more detailed analysis)
  const patternSpecificErrors = analyzePatternSpecificErrors(pattern);
  suggestions.push(...patternSpecificErrors);

  // Then check for direct string replacements in SYNTAX_CORRECTIONS
  let foundDirectReplacement = false;

  // Check all syntax corrections
  for (const [errorPattern, correction] of Object.entries(SYNTAX_CORRECTIONS)) {
    if (typeof correction === 'string') {
      // Exact match replacements
      if (pattern === errorPattern) {
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
      // For patterns that should start with match:, check if they don't have the prefix
      if (errorPattern.endsWith(':') && pattern.startsWith('match:')) {
        continue; // This pattern already has match: prefix, skip this correction
      }
      // Check if pattern contains the error pattern (for missing prefix cases)
      if (pattern.includes(errorPattern) && !pattern.startsWith('match:') && !foundDirectReplacement) {
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

  // Check for regex-based corrections if no direct replacement found
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

  // Check for common pattern naming errors (missing 's' in plural forms)
  if (pattern.includes('match:contain:')) {
    const corrected = pattern.replace('match:contain:', 'match:contains:');
    suggestions.push({
      type: 'pattern_name_error',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:contains:" instead of "match:contain:"',
    });
  }

  if (pattern.includes('match:startWith:')) {
    const corrected = pattern.replace('match:startWith:', 'match:startsWith:');
    suggestions.push({
      type: 'pattern_name_error',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:startsWith:" instead of "match:startWith:"',
    });
  }

  if (pattern.includes('match:endWith:')) {
    const corrected = pattern.replace('match:endWith:', 'match:endsWith:');
    suggestions.push({
      type: 'pattern_name_error',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:endsWith:" instead of "match:endWith:"',
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

  // Check for missing colon after pattern names
  if (pattern.startsWith('match:') && !pattern.includes(':', 6) && isPatternNameOnly(pattern)) {
    const corrected = `${pattern}:`;
    suggestions.push({
      type: 'missing_colon',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Pattern should end with colon (:) when used without a value',
    });
  }

  // Check for common regex mistakes
  if (pattern.includes('regex:')) {
    // Check for unescaped forward slashes
    if (pattern.includes('/') && !pattern.includes('\\/')) {
      const corrected = pattern.replace(/\//g, '\\/');
      suggestions.push({
        type: 'unescaped_slash',
        original: pattern,
        corrected,
        pattern: corrected,
        message: 'Forward slashes in regex should be escaped: \\/ instead of /',
      });
    }

    // Check for missing anchors in what looks like exact matches
    const regexPart = pattern.split('regex:')[1];
    if (regexPart && !regexPart.includes('^') && !regexPart.includes('$') &&
        regexPart.length < 20 && !regexPart.includes('*') && !regexPart.includes('+')) {
      suggestions.push({
        type: 'missing_anchors',
        original: pattern,
        corrected: pattern.replace(/regex:(.*)/, 'regex:^$1$'),
        pattern: pattern.replace(/regex:(.*)/, 'regex:^$1$'),
        message: 'Consider adding anchors (^ and $) for exact regex matches',
      });
    }
  }

  // Check for arrayContains with missing field specification
  if (pattern.includes('arrayContains:') && pattern.split(':').length === 2) {
    suggestions.push({
      type: 'incomplete_pattern',
      original: pattern,
      corrected: `${pattern}fieldName:expectedValue`,
      pattern: `${pattern}fieldName:expectedValue`,
      message: 'arrayContains needs either a simple value or fieldName:expectedValue format',
      example: 'Use "match:arrayContains:myValue" or "match:arrayContains:name:expectedName"',
    });
  }

  // Check for extractField without proper path format
  if (pattern.includes('extractField:')) {
    const fieldPath = pattern.split('extractField:')[1];
    if (fieldPath && !fieldPath.includes('.') && !fieldPath.includes('*')) {
      suggestions.push({
        type: 'invalid_field_path',
        original: pattern,
        corrected: `${pattern.split(':')[0]}:extractField:${fieldPath}.*`,
        pattern: `${pattern.split(':')[0]}:extractField:${fieldPath}.*`,
        message: 'extractField requires dot notation path like "tools.*.name" or "result.items.0.id"',
        example: 'Use "match:extractField:tools.*.name" to extract all tool names',
      });
    }
  }

  // Check for common operator mistakes
  if (pattern.includes('=') && !pattern.includes('equals:') && !pattern.includes('notEquals:')) {
    const corrected = pattern.replace(/=+/g, '').replace(/match:/, 'match:equals:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:equals:value" instead of "match:=value" or similar',
    });
  }

  // Check for operator symbols
  if (pattern.includes('match:>') && !pattern.includes('greaterThan:')) {
    const corrected = pattern.replace('match:>', 'match:greaterThan:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:greaterThan:" instead of "match:>"',
    });
  }

  if (pattern.includes('match:<') && !pattern.includes('lessThan:')) {
    const corrected = pattern.replace('match:<', 'match:lessThan:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:lessThan:" instead of "match:<"',
    });
  }

  if (pattern.includes('match:!=') && !pattern.includes('notEquals:')) {
    const corrected = pattern.replace('match:!=', 'match:notEquals:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:notEquals:" instead of "match:!="',
    });
  }

  if (pattern.includes('match:==') && !pattern.includes('equals:')) {
    const corrected = pattern.replace('match:==', 'match:equals:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:equals:" instead of "match:=="',
    });
  }

  // Check for common operator aliases
  if (pattern.includes('match:eq:') && !pattern.includes('equals:')) {
    const corrected = pattern.replace('match:eq:', 'match:equals:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:equals:" instead of "match:eq:"',
    });
  }

  if (pattern.includes('match:ne:') && !pattern.includes('notEquals:')) {
    const corrected = pattern.replace('match:ne:', 'match:notEquals:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:notEquals:" instead of "match:ne:"',
    });
  }

  if (pattern.includes('match:gt:') && !pattern.includes('greaterThan:')) {
    const corrected = pattern.replace('match:gt:', 'match:greaterThan:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:greaterThan:" instead of "match:gt:"',
    });
  }

  if (pattern.includes('match:lt:') && !pattern.includes('lessThan:')) {
    const corrected = pattern.replace('match:lt:', 'match:lessThan:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:lessThan:" instead of "match:lt:"',
    });
  }

  // Check for length patterns without numbers
  if (pattern.includes('length:') && pattern.split('length:')[1] &&
      isNaN(Number(pattern.split('length:')[1].split(':')[0]))) {
    suggestions.push({
      type: 'invalid_length',
      original: pattern,
      corrected: `${pattern.split('length:')[0]}length:0`,
      pattern: `${pattern.split('length:')[0]}length:0`,
      message: 'Length pattern requires a number: "match:length:5"',
    });
  }

  // Check for date patterns with invalid formats
  if (pattern.includes('dateAfter:') || pattern.includes('dateBefore:') || pattern.includes('dateEquals:')) {
    const datePart = pattern.split(/date(?:After|Before|Equals):/)[1];
    if (datePart && !isValidDateFormat(datePart.split(':')[0])) {
      suggestions.push({
        type: 'invalid_date_format',
        original: pattern,
        corrected: pattern.replace(datePart.split(':')[0], '2023-01-01'),
        pattern: pattern.replace(datePart.split(':')[0], '2023-01-01'),
        message: 'Use ISO date format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS',
        example: 'Use "match:dateAfter:2023-01-01" or "match:dateAfter:2023-01-01T10:00:00"',
      });
    }
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
    'arrayLength:', 'arrayContains:', 'arrayElements:', 'contains:', 'startsWith:', 'endsWith:',
    'type:', 'regex:', 'regexp:', 'length:', 'between:', 'range:', 'greaterThan:', 'lessThan:',
    'equals:', 'notEquals:', 'approximately:', 'multipleOf:', 'dateAfter:', 'dateBefore:',
    'dateValid', 'dateAge:', 'dateEquals:', 'dateFormat:', 'exists', 'extractField:', 'partial:',
    'not:', 'contain:', 'startWith:', 'endWith:', 'eq:', 'ne:', 'gt:', 'lt:', 'gte:', 'lte:',
  ];

  return patternIndicators.some(indicator => str.includes(indicator));
}

/**
 * Check if a pattern is just a pattern name without a value
 * @param {string} pattern - Pattern to check
 * @returns {boolean} Whether it's just a pattern name
 */
function isPatternNameOnly(pattern) {
  const patternNames = [
    'match:arrayLength', 'match:arrayContains', 'match:contains',
    'match:startsWith', 'match:endsWith', 'match:type', 'match:regex', 'match:length',
    'match:between', 'match:range', 'match:greaterThan', 'match:lessThan', 'match:equals',
    'match:notEquals', 'match:approximately', 'match:multipleOf', 'match:dateAfter',
    'match:dateBefore', 'match:dateAge', 'match:dateEquals', 'match:dateFormat',
    'match:extractField', 'match:partial', 'match:not',
  ];

  // Note: 'match:arrayElements' and 'match:exists' can be used without colons
  // when they are pattern object keys, so we don't include them here
  return patternNames.some(name => pattern === name);
}

/**
 * Check if a string is a valid date format
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} Whether it's a valid date format
 */
function isValidDateFormat(dateStr) {
  if (!dateStr) {
    return false;
  }

  // Check for common valid formats
  const dateFormats = [
    /^\d{4}-\d{2}-\d{2}$/,                           // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,        // YYYY-MM-DDTHH:MM:SS
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, // YYYY-MM-DDTHH:MM:SS.sssZ
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,       // YYYY-MM-DDTHH:MM:SSZ
    /^\d+$/,                                         // Unix timestamp
  ];

  const isValidFormat = dateFormats.some(format => format.test(dateStr));
  if (!isValidFormat) {
    return false;
  }

  // Try to parse the date to see if it's actually valid
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
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

  // Check for partial matching without match:partial:
  if (yamlContext.hasPartialMatching && !yamlContext.hasPartialPattern) {
    suggestions.push({
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
    });
  }

  // Check for arrayElements without proper structure
  if (yamlContext.hasArrayElements && !yamlContext.hasProperArrayElementsStructure) {
    suggestions.push({
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
    });
  }

  // Check for mixing patterns and exact values in same object
  if (yamlContext.hasMixedPatterns) {
    suggestions.push({
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
    });
  }

  // Check for incorrect YAML nesting for patterns
  if (yamlContext.hasIncorrectNesting) {
    suggestions.push({
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
    });
  }

  // Check for stderr validation errors
  if (yamlContext.hasInvalidStderrPattern) {
    suggestions.push({
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
  if (yamlString.includes('"match:regex:') || yamlString.includes("'match:regex:")) {
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
