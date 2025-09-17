/**
 * Type corrections - handles type-related syntax errors
 * Focuses solely on type corrections and capitalization issues
 */

// Removed unused getExamplesForType import (lint no-unused-vars)

/**
 * Type case error corrections
 */
export const TYPE_CORRECTIONS = {
  // Type case errors (JavaScript capitalized types)
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

  // Common type aliases and programming language variants
  'match:type:str': 'match:type:string',
  'match:type:int': 'match:type:number',
  'match:type:integer': 'match:type:number',
  'match:type:long': 'match:type:number',
  'match:type:float': 'match:type:number',
  'match:type:double': 'match:type:number',
  'match:type:decimal': 'match:type:number',
  'match:type:bool': 'match:type:boolean',
  'match:type:obj': 'match:type:object',
  'match:type:dict': 'match:type:object',
  'match:type:map': 'match:type:object',
  'match:type:hash': 'match:type:object',
  'match:type:list': 'match:type:array',
  'match:type:arr': 'match:type:array',
  'match:type:vector': 'match:type:array',
  'match:type:collection': 'match:type:array',

  // Boolean string confusion (quoted types)
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

  // Type with quoted values (remove quotes and add proper prefix)
  'match:"String"': 'match:type:string',
  'match:"Number"': 'match:type:number',
  'match:"Boolean"': 'match:type:boolean',
  'match:"Object"': 'match:type:object',
  'match:"Array"': 'match:type:array',
  'match:"string"': 'match:type:string',
  'match:"number"': 'match:type:number',
  'match:"boolean"': 'match:type:boolean',
  'match:"object"': 'match:type:object',
  'match:"array"': 'match:type:array',

  // Capitalized types without quotes (missing type: prefix)
  'match:Number:': 'match:type:number',
  'match:String:': 'match:type:string',
  'match:Boolean:': 'match:type:boolean',
  'match:Object:': 'match:type:object',
  'match:Array:': 'match:type:array',

  // Missing match: prefix entirely
  'type:string': 'match:type:string',
  'type:number': 'match:type:number',
  'type:boolean': 'match:type:boolean',
  'type:object': 'match:type:object',
  'type:array': 'match:type:array',
  'type:function': 'match:type:function',
  'type:undefined': 'match:type:undefined',
  'type:null': 'match:type:null',

  // Wrong pattern format entirely (using typeof patterns)
  'typeof:string': 'match:type:string',
  'typeof:number': 'match:type:number',
  'typeof:boolean': 'match:type:boolean',
  'typeof:object': 'match:type:object',
  'typeof:function': 'match:type:function',
  'typeof:undefined': 'match:type:undefined',

  // instanceof confusion (all become object in JSON)
  'match:instanceof:Array': 'match:type:array',
  'match:instanceof:Object': 'match:type:object',
  'match:instanceof:Date': 'match:type:object',
  'match:instanceof:RegExp': 'match:type:object',
  'match:instanceof:Error': 'match:type:object',

  // TypeScript/Flow type syntax confusion
  'match:type:any': 'match:exists',              // 'any' usually means "exists"
  'match:type:void': 'match:type:undefined',     // void becomes undefined
  'match:type:never': 'match:not:exists',        // never means doesn't exist

  // Common validation library patterns
  'match:isString': 'match:type:string',
  'match:isNumber': 'match:type:number',
  'match:isBoolean': 'match:type:boolean',
  'match:isObject': 'match:type:object',
  'match:isArray': 'match:type:array',
  'match:isFunction': 'match:type:function',
  'match:isDefined': 'match:exists',
  'match:isUndefined': 'match:type:undefined',
  'match:isNull': 'match:type:null',

  // Common misspellings
  'match:type:strig': 'match:type:string',       // common typo
  'match:type:stirng': 'match:type:string',      // common typo
  'match:type:numbr': 'match:type:number',       // common typo
  'match:type:bolean': 'match:type:boolean',     // common typo
  'match:type:booleean': 'match:type:boolean',   // common typo
  'match:type:objct': 'match:type:object',       // common typo
  'match:type:aray': 'match:type:array',         // common typo
  'match:type:arry': 'match:type:array',         // common typo

  // Python type hints confusion
  'match:type:List': 'match:type:array',
  'match:type:Dict': 'match:type:object',
  'match:type:Tuple': 'match:type:array',
  'match:type:Set': 'match:type:array',

  // Java type confusion
  'match:type:ArrayList': 'match:type:array',
  'match:type:HashMap': 'match:type:object',
  'match:type:Integer': 'match:type:number',
  'match:type:Double': 'match:type:number',

  // C# type confusion
  'match:type:List<>': 'match:type:array',
  'match:type:Dictionary': 'match:type:object',
  'match:type:Int32': 'match:type:number',
  'match:type:Int64': 'match:type:number',

  // SQL type confusion (all become string or number in JSON)
  'match:type:varchar': 'match:type:string',
  'match:type:text': 'match:type:string',
  'match:type:char': 'match:type:string',
  'match:type:nvarchar': 'match:type:string',
  'match:type:datetime': 'match:type:string',    // Usually serialized as string
  'match:type:timestamp': 'match:type:string',   // Usually serialized as string
  'match:type:bigint': 'match:type:number',
};

/**
 * Analyze type-related pattern errors
 * @param {string} pattern - Pattern to analyze
 * @returns {Array} Array of type correction suggestions
 */
export function analyzeTypeErrors(pattern) {
  // Handle null, undefined, and non-string inputs gracefully
  if (!pattern || typeof pattern !== 'string') {
    return [];
  }

  const suggestions = [];

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

  // Check for missing match: prefix
  if (/^type:(string|number|boolean|object|array|function|undefined|null)/.test(pattern)) {
    const corrected = `match:${pattern}`;
    suggestions.push({
      type: 'missing_match_prefix',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Type patterns must start with "match:". Use "match:type:string" not "type:string"',
    });
  }

  // Check for typeof usage instead of type
  if (pattern.includes('typeof:')) {
    const corrected = pattern.replace('typeof:', 'match:type:');
    suggestions.push({
      type: 'typeof_confusion',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:type:" instead of "typeof:". This is not JavaScript typeof operator',
    });
  }

  // Check for instanceof usage
  if (pattern.includes('instanceof:')) {
    let corrected = pattern;
    if (pattern.includes('instanceof:Array')) {
      corrected = pattern.replace('instanceof:Array', 'type:array');
    } else {
      corrected = pattern.replace(/instanceof:(\w+)/, 'type:object');  // Most objects become object in JSON
    }
    if (!corrected.startsWith('match:')) {
      corrected = `match:${corrected}`;
    }

    suggestions.push({
      type: 'instanceof_confusion',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:type:" instead of "instanceof:". JSON serialization converts most objects to type "object"',
    });
  }

  // Check for common validation library patterns (isString, isNumber, etc.)
  if (/^(match:)?is[A-Z]\w*$/.test(pattern)) {
    let typeName = pattern.replace(/^(match:)?is/, '').toLowerCase();
    if (typeName === 'defined') {
      typeName = 'exists';
    }
    const corrected = typeName === 'exists' ? 'match:exists' : `match:type:${typeName}`;

    suggestions.push({
      type: 'validation_library_pattern',
      original: pattern,
      corrected,
      pattern: corrected,
      message: `Use "${corrected}" instead of validation library style "${pattern}"`,
    });
  }

  // Check for programming language specific types
  const languageTypeMap = {
    'List': 'array', 'Dict': 'object', 'Tuple': 'array', 'Set': 'array',        // Python
    'ArrayList': 'array', 'HashMap': 'object', 'Integer': 'number',              // Java
    'varchar': 'string', 'text': 'string', 'char': 'string',                    // SQL
    'datetime': 'string', 'timestamp': 'string', 'bigint': 'number',             // SQL
  };

  for (const [langType, jsType] of Object.entries(languageTypeMap)) {
    if (pattern.includes(`type:${langType}`)) {
      const corrected = pattern.replace(`type:${langType}`, `type:${jsType}`);
      suggestions.push({
        type: 'language_specific_type',
        original: pattern,
        corrected,
        pattern: corrected,
        message: `In JSON/JavaScript context, "${langType}" becomes "${jsType}". Use "${corrected}"`,
      });
    }
  }

  // Check for common misspellings
  const misspellings = {
    'strig': 'string', 'stirng': 'string', 'numbr': 'number',
    'bolean': 'boolean', 'booleean': 'boolean', 'objct': 'object',
    'aray': 'array', 'arry': 'array',
  };

  for (const [misspelled, correct] of Object.entries(misspellings)) {
    if (pattern.includes(`type:${misspelled}`)) {
      const corrected = pattern.replace(`type:${misspelled}`, `type:${correct}`);
      suggestions.push({
        type: 'spelling_error',
        original: pattern,
        corrected,
        pattern: corrected,
        message: `Spelling error: "${misspelled}" should be "${correct}"`,
      });
    }
  }

  // Check for TypeScript/Flow specific types
  if (pattern.includes('type:any')) {
    suggestions.push({
      type: 'typescript_any',
      original: pattern,
      corrected: 'match:exists',
      pattern: 'match:exists',
      message: 'TypeScript "any" type usually means "exists" in testing. Use "match:exists"',
    });
  }

  if (pattern.includes('type:void')) {
    suggestions.push({
      type: 'typescript_void',
      original: pattern,
      corrected: 'match:type:undefined',
      pattern: 'match:type:undefined',
      message: 'TypeScript "void" becomes "undefined" in JSON. Use "match:type:undefined"',
    });
  }

  if (pattern.includes('type:never')) {
    suggestions.push({
      type: 'typescript_never',
      original: pattern,
      corrected: 'match:not:exists',
      pattern: 'match:not:exists',
      message: 'TypeScript "never" means value should not exist. Use "match:not:exists"',
    });
  }

  // Provide helpful context about JSON serialization
  if (pattern.includes('type:Date') || pattern.includes('type:RegExp') || pattern.includes('type:Error')) {
    const objType = pattern.match(/type:(\w+)/)?.[1];
    suggestions.push({
      type: 'json_serialization_info',
      original: pattern,
      corrected: pattern.replace(`type:${objType}`, 'type:object'),
      pattern: pattern.replace(`type:${objType}`, 'type:object'),
      message: `${objType} objects become "object" type in JSON serialization. Most complex objects should use "match:type:object"`,
    });
  }

  return suggestions;
}
