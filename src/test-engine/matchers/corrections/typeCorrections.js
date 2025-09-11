/**
 * Type corrections - handles type-related syntax errors
 * Follows single responsibility principle - only concerned with type corrections
 */

/**
 * Type case error corrections
 */
export const TYPE_CORRECTIONS = {
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
};

/**
 * Analyze type-related pattern errors
 * @param {string} pattern - Pattern to analyze
 * @returns {Array} Array of type correction suggestions
 */
export function analyzeTypeErrors(pattern) {
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

  return suggestions;
}
