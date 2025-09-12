/**
 * Non-existent Features Detection - Identifies attempts to use features that don't exist in MCP Conductor
 * Designed to catch AI agents and users trying to use patterns that sound reasonable but aren't implemented
 */

/**
 * Map of non-existent features that users/AI might attempt to use
 */
const NON_EXISTENT_FEATURES = {
  'match:httpStatus:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'HTTP status validation is not supported in MCP Conductor',
    suggestion: 'Use numeric comparison patterns for status codes',
    alternatives: [
      'status: "match:equals:200"',
      'status: "match:between:200:299"',
      'status: "match:greaterThanOrEqual:200"',
    ],
    example: {
      incorrect: 'status: "match:httpStatus:ok"',
      correct: 'status: "match:equals:200"',
    },
  },

  'match:url:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'URL validation patterns are not supported',
    suggestion: 'Use regex patterns to validate URL structure',
    alternatives: [
      'url: "match:regex:^https?://"',
      'url: "match:startsWith:https://"',
      'url: "match:contains:api.example.com"',
    ],
    example: {
      incorrect: 'url: "match:url:valid"',
      correct: 'url: "match:regex:^https?://[\\w.-]+\\.[a-z]{2,}$"',
    },
  },

  'match:email:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Email validation patterns are not supported',
    suggestion: 'Use regex patterns to validate email structure',
    alternatives: [
      'email: "match:regex:^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$"',
      'email: "match:contains:@"',
      'email: "match:endsWith:.com"',
    ],
    example: {
      incorrect: 'email: "match:email:valid"',
      correct: 'email: "match:regex:^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$"',
    },
  },

  'match:custom:': {
    type: 'unsupported_feature',
    category: 'extension',
    message: 'Custom pattern operators are not supported',
    suggestion: 'Use available built-in patterns or combine multiple patterns',
    alternatives: [
      'Use combination of existing patterns',
      'Create multiple validation steps',
      'Use crossField patterns for complex logic',
    ],
    example: {
      incorrect: 'value: "match:custom:myValidator"',
      correct: 'value: "match:type:string"\nvalue: "match:regex:^[A-Z]"',
    },
  },

  'match:jwt:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'JWT token validation is not supported',
    suggestion: 'Use regex patterns to validate JWT structure or string patterns',
    alternatives: [
      'token: "match:regex:^[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]*$"',
      'token: "match:contains:."',
      'token: "match:split:."',
    ],
    example: {
      incorrect: 'token: "match:jwt:valid"',
      correct: 'token: "match:regex:^[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]*$"',
    },
  },

  'match:uuid:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'UUID validation patterns are not supported',
    suggestion: 'Use regex patterns to validate UUID structure',
    alternatives: [
      'id: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"',
      'id: "match:length:36"',
      'id: "match:contains:-"',
    ],
    example: {
      incorrect: 'id: "match:uuid:v4"',
      correct: 'id: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"',
    },
  },

  'match:json:': {
    type: 'unsupported_feature',
    category: 'format',
    message: 'JSON validation patterns are not supported',
    suggestion: 'Use type checking or specific field validation',
    alternatives: [
      'data: "match:type:object"',
      'data: "match:contains:{"',
      'Use nested field validation for JSON structure',
    ],
    example: {
      incorrect: 'response: "match:json:valid"',
      correct: 'response: "match:type:object"',
    },
  },

  'match:schema:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Schema validation is not supported as a pattern operator',
    suggestion: 'Use nested field validation or type checking',
    alternatives: [
      'Use nested field validation',
      'field: "match:type:string"',
      'field: "match:hasField:requiredProperty"',
    ],
    example: {
      incorrect: 'data: "match:schema:userSchema"',
      correct: 'data.name: "match:type:string"\ndata.email: "match:contains:@"',
    },
  },

  'match:format:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Format validation patterns are not supported',
    suggestion: 'Use regex patterns for format validation',
    alternatives: [
      'value: "match:regex:pattern"',
      'value: "match:length:10"',
      'value: "match:contains:specific-format"',
    ],
    example: {
      incorrect: 'date: "match:format:iso8601"',
      correct: 'date: "match:regex:^\\\\d{4}-\\\\d{2}-\\\\d{2}T\\\\d{2}:\\\\d{2}:\\\\d{2}"',
    },
  },

  'match:positive:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Positive number validation is not supported',
    suggestion: 'Use numeric comparison patterns',
    alternatives: [
      'value: "match:greaterThan:0"',
      'value: "match:greaterThanOrEqual:1"',
      'value: "match:type:number"',
    ],
    example: {
      incorrect: 'count: "match:positive"',
      correct: 'count: "match:greaterThan:0"',
    },
  },

  'match:negative:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Negative number validation is not supported',
    suggestion: 'Use numeric comparison patterns',
    alternatives: [
      'value: "match:lessThan:0"',
      'value: "match:lessThanOrEqual:-1"',
    ],
    example: {
      incorrect: 'offset: "match:negative"',
      correct: 'offset: "match:lessThan:0"',
    },
  },

  'match:integer:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Integer validation is not supported',
    suggestion: 'Use type checking and regex patterns',
    alternatives: [
      'value: "match:type:number"',
      'value: "match:regex:^-?\\\\d+$"',
      'value: "match:decimalPlaces:0"',
    ],
    example: {
      incorrect: 'id: "match:integer"',
      correct: 'id: "match:regex:^\\\\d+$"',
    },
  },

  'match:float:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Float validation is not supported',
    suggestion: 'Use type checking and decimal patterns',
    alternatives: [
      'value: "match:type:number"',
      'value: "match:regex:^-?\\\\d+\\\\.\\\\d+$"',
    ],
    example: {
      incorrect: 'price: "match:float"',
      correct: 'price: "match:type:number"',
    },
  },

  'match:even:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Even number validation is not supported',
    suggestion: 'Use modular arithmetic patterns',
    alternatives: [
      'value: "match:multipleOf:2"',
      'value: "match:divisibleBy:2"',
    ],
    example: {
      incorrect: 'page: "match:even"',
      correct: 'page: "match:multipleOf:2"',
    },
  },

  'match:odd:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Odd number validation is not supported',
    suggestion: 'Use modular arithmetic patterns with negation',
    alternatives: [
      'value: "match:not:multipleOf:2"',
      'value: "match:not:divisibleBy:2"',
    ],
    example: {
      incorrect: 'index: "match:odd"',
      correct: 'index: "match:not:multipleOf:2"',
    },
  },

  // Array/Object validation patterns that don't exist
  'match:empty:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Empty validation is not supported',
    suggestion: 'Use length or arrayLength patterns',
    alternatives: [
      'value: "match:arrayLength:0"',
      'value: "match:length:0"',
      'value: "match:count:0"',
    ],
    example: {
      incorrect: 'items: "match:empty"',
      correct: 'items: "match:arrayLength:0"',
    },
  },

  'match:notEmpty:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Not empty validation is not supported',
    suggestion: 'Use length or arrayLength patterns with negation',
    alternatives: [
      'value: "match:not:arrayLength:0"',
      'value: "match:not:length:0"',
      'value: "match:greaterThan:0"',
    ],
    example: {
      incorrect: 'items: "match:notEmpty"',
      correct: 'items: "match:not:arrayLength:0"',
    },
  },

  'match:unique:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array uniqueness validation is not supported',
    suggestion: 'Use crossField patterns or manual validation',
    alternatives: [
      'Use crossField patterns for uniqueness validation',
      'Validate specific duplicate scenarios',
      'Use arrayContains with negation',
    ],
    example: {
      incorrect: 'ids: "match:unique"',
      correct: 'Use manual validation or crossField patterns',
    },
  },

  'match:sorted:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array sorting validation is not supported',
    suggestion: 'Use crossField patterns for order validation',
    alternatives: [
      'Use crossField patterns to compare adjacent elements',
      'Validate specific ordering scenarios',
    ],
    example: {
      incorrect: 'dates: "match:sorted"',
      correct: 'Use crossField patterns for order validation',
    },
  },

  'match:hasKey:': {
    type: 'unsupported_feature',
    category: 'object',
    message: 'Key existence validation is not supported',
    suggestion: 'Use exists pattern or type checking',
    alternatives: [
      'field: "match:exists"',
      'field: "match:type:string"',
      'Use nested field validation',
    ],
    example: {
      incorrect: 'obj: "match:hasKey:name"',
      correct: 'obj.name: "match:exists"',
    },
  },

  'match:hasValue:': {
    type: 'unsupported_feature',
    category: 'object',
    message: 'Value existence validation is not supported',
    suggestion: 'Use direct value comparison or contains patterns',
    alternatives: [
      'Use direct value comparison',
      'value: "match:contains:searchTerm"',
      'value: "match:equals:expectedValue"',
    ],
    example: {
      incorrect: 'obj: "match:hasValue:John"',
      correct: 'obj: "match:contains:John"',
    },
  },

  // String validation patterns that don't exist
  'match:alphabetic:': {
    type: 'unsupported_feature',
    category: 'string',
    message: 'Alphabetic validation is not supported',
    suggestion: 'Use regex patterns for character validation',
    alternatives: [
      'value: "match:regex:^[a-zA-Z]+$"',
      'value: "match:regex:^[a-zA-Z\\\\s]+$"',
    ],
    example: {
      incorrect: 'name: "match:alphabetic"',
      correct: 'name: "match:regex:^[a-zA-Z]+$"',
    },
  },

  'match:alphanumeric:': {
    type: 'unsupported_feature',
    category: 'string',
    message: 'Alphanumeric validation is not supported',
    suggestion: 'Use regex patterns for character validation',
    alternatives: [
      'value: "match:regex:^[a-zA-Z0-9]+$"',
      'value: "match:regex:^[\\\\w]+$"',
    ],
    example: {
      incorrect: 'id: "match:alphanumeric"',
      correct: 'id: "match:regex:^[a-zA-Z0-9]+$"',
    },
  },

  'match:uppercase:': {
    type: 'unsupported_feature',
    category: 'string',
    message: 'Uppercase validation is not supported',
    suggestion: 'Use regex patterns for case validation',
    alternatives: [
      'value: "match:regex:^[A-Z]+$"',
      'value: "match:regex:^[A-Z\\\\s]+$"',
    ],
    example: {
      incorrect: 'code: "match:uppercase"',
      correct: 'code: "match:regex:^[A-Z]+$"',
    },
  },

  'match:lowercase:': {
    type: 'unsupported_feature',
    category: 'string',
    message: 'Lowercase validation is not supported',
    suggestion: 'Use regex patterns for case validation',
    alternatives: [
      'value: "match:regex:^[a-z]+$"',
      'value: "match:regex:^[a-z\\\\s]+$"',
    ],
    example: {
      incorrect: 'username: "match:lowercase"',
      correct: 'username: "match:regex:^[a-z]+$"',
    },
  },

  'match:whitespace:': {
    type: 'unsupported_feature',
    category: 'string',
    message: 'Whitespace validation is not supported',
    suggestion: 'Use regex patterns for whitespace detection',
    alternatives: [
      'value: "match:regex:^\\\\s*$"',
      'value: "match:contains: "',
      'value: "match:regex:\\\\s"',
    ],
    example: {
      incorrect: 'text: "match:whitespace"',
      correct: 'text: "match:regex:^\\\\s*$"',
    },
  },

  'match:trim:': {
    type: 'unsupported_feature',
    category: 'string',
    message: 'String trimming validation is not supported',
    suggestion: 'Use regex patterns to validate trimmed strings',
    alternatives: [
      'value: "match:regex:^\\\\S.*\\\\S$"',
      'value: "match:not:startsWith: "',
      'value: "match:not:endsWith: "',
    ],
    example: {
      incorrect: 'text: "match:trim:equals:hello"',
      correct: 'text: "match:not:startsWith: "',
    },
  },

  // Network/Protocol patterns that don't exist
  'match:ip:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'IP address validation is not supported',
    suggestion: 'Use regex patterns for IP validation',
    alternatives: [
      'ip: "match:regex:^\\\\d{1,3}\\\\.\\\\d{1,3}\\\\.\\\\d{1,3}\\\\.\\\\d{1,3}$"',
      'ip: "match:contains:."',
    ],
    example: {
      incorrect: 'address: "match:ip:v4"',
      correct: 'address: "match:regex:^\\\\d{1,3}\\\\.\\\\d{1,3}\\\\.\\\\d{1,3}\\\\.\\\\d{1,3}$"',
    },
  },

  'match:port:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'Port validation is not supported',
    suggestion: 'Use numeric range patterns',
    alternatives: [
      'port: "match:between:1:65535"',
      'port: "match:greaterThan:0"',
      'port: "match:type:number"',
    ],
    example: {
      incorrect: 'port: "match:port:valid"',
      correct: 'port: "match:between:1:65535"',
    },
  },

  'match:domain:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'Domain validation is not supported',
    suggestion: 'Use regex patterns for domain validation',
    alternatives: [
      'domain: "match:regex:^[a-zA-Z0-9.-]+\\\\.[a-z]{2,}$"',
      'domain: "match:contains:."',
    ],
    example: {
      incorrect: 'domain: "match:domain:valid"',
      correct: 'domain: "match:regex:^[a-zA-Z0-9.-]+\\\\.[a-z]{2,}$"',
    },
  },

  // File/Path patterns that don't exist
  'match:path:': {
    type: 'unsupported_feature',
    category: 'file',
    message: 'File path validation is not supported',
    suggestion: 'Use regex patterns or string patterns for path validation',
    alternatives: [
      'path: "match:regex:^(/[^/]+)+$"',
      'path: "match:startsWith:/"',
      'path: "match:contains:/"',
    ],
    example: {
      incorrect: 'path: "match:path:unix"',
      correct: 'path: "match:startsWith:/"',
    },
  },

  'match:extension:': {
    type: 'unsupported_feature',
    category: 'file',
    message: 'File extension validation is not supported',
    suggestion: 'Use endsWith or regex patterns',
    alternatives: [
      'filename: "match:endsWith:.txt"',
      'filename: "match:regex:\\\\.[a-z]+$"',
    ],
    example: {
      incorrect: 'file: "match:extension:jpg"',
      correct: 'file: "match:endsWith:.jpg"',
    },
  },

  'match:mime:': {
    type: 'unsupported_feature',
    category: 'file',
    message: 'MIME type validation is not supported',
    suggestion: 'Use string patterns for MIME type validation',
    alternatives: [
      'type: "match:startsWith:image/"',
      'type: "match:contains:text"',
      'type: "match:equals:application/json"',
    ],
    example: {
      incorrect: 'type: "match:mime:image"',
      correct: 'type: "match:startsWith:image/"',
    },
  },

  // Date/Time patterns that might be confused with existing ones
  'match:time:': {
    type: 'unsupported_feature',
    category: 'datetime',
    message: 'Time validation is not supported',
    suggestion: 'Use dateFormat patterns or regex',
    alternatives: [
      'time: "match:dateFormat:iso-time"',
      'time: "match:regex:^\\\\d{2}:\\\\d{2}:\\\\d{2}$"',
    ],
    example: {
      incorrect: 'time: "match:time:valid"',
      correct: 'time: "match:dateFormat:iso-time"',
    },
  },

  'match:timezone:': {
    type: 'unsupported_feature',
    category: 'datetime',
    message: 'Timezone validation is not supported',
    suggestion: 'Use regex patterns for timezone validation',
    alternatives: [
      'tz: "match:regex:^[A-Z]{3}$"',
      'tz: "match:contains:+"',
      'tz: "match:regex:^[+-]\\\\d{2}:\\\\d{2}$"',
    ],
    example: {
      incorrect: 'timezone: "match:timezone:valid"',
      correct: 'timezone: "match:regex:^[+-]\\\\d{2}:\\\\d{2}$"',
    },
  },

  'match:duration:': {
    type: 'unsupported_feature',
    category: 'datetime',
    message: 'Duration validation is not supported',
    suggestion: 'Use regex patterns or numeric validation',
    alternatives: [
      'duration: "match:regex:^P\\\\d+[YMWD]$"',
      'duration: "match:type:number"',
    ],
    example: {
      incorrect: 'duration: "match:duration:iso"',
      correct: 'duration: "match:regex:^P\\\\d+[YMWD]$"',
    },
  },

  // Database/Query patterns that don't exist
  'match:sql:': {
    type: 'unsupported_feature',
    category: 'database',
    message: 'SQL validation is not supported',
    suggestion: 'Use string patterns for SQL validation',
    alternatives: [
      'query: "match:startsWith:SELECT"',
      'query: "match:contains:FROM"',
      'query: "match:regex:^(SELECT|INSERT|UPDATE|DELETE)"',
    ],
    example: {
      incorrect: 'query: "match:sql:valid"',
      correct: 'query: "match:startsWith:SELECT"',
    },
  },

  // Security patterns that don't exist
  'match:hash:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'Hash validation is not supported',
    suggestion: 'Use regex patterns for hash validation',
    alternatives: [
      'hash: "match:regex:^[a-f0-9]{64}$"',
      'hash: "match:length:64"',
    ],
    example: {
      incorrect: 'hash: "match:hash:sha256"',
      correct: 'hash: "match:regex:^[a-f0-9]{64}$"',
    },
  },

  'match:base64:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'Base64 validation is not supported',
    suggestion: 'Use regex patterns for Base64 validation',
    alternatives: [
      'data: "match:regex:^[A-Za-z0-9+/]*={0,2}$"',
      'data: "match:endsWith:="',
    ],
    example: {
      incorrect: 'data: "match:base64:valid"',
      correct: 'data: "match:regex:^[A-Za-z0-9+/]*={0,2}$"',
    },
  },
};

/**
 * Patterns that might be confused with actual features
 */
const CONFUSING_PATTERNS = {
  'match:arrayHas:': {
    actual: 'match:arrayContains:',
    message: 'Use "arrayContains" instead of "arrayHas"',
  },
  'match:arrayIncludes:': {
    actual: 'match:arrayContains:',
    message: 'Use "arrayContains" instead of "arrayIncludes"',
  },
  'match:getField:': {
    actual: 'match:extractField:',
    message: 'Use "extractField" instead of "getField"',
  },
  'match:isType:': {
    actual: 'match:type:',
    message: 'Use "type" instead of "isType"',
  },
  'match:typeof:': {
    actual: 'match:type:',
    message: 'Use "type" instead of "typeof"',
  },
  'match:hasType:': {
    actual: 'match:type:',
    message: 'Use "type" instead of "hasType"',
  },
  'match:arraySize:': {
    actual: 'match:arrayLength:',
    message: 'Use "arrayLength" instead of "arraySize"',
  },
  'match:arrayCount:': {
    actual: 'match:arrayLength:',
    message: 'Use "arrayLength" instead of "arrayCount"',
  },
  'match:size:': {
    actual: 'match:length:',
    message: 'Use "length" instead of "size"',
  },
  'match:len:': {
    actual: 'match:length:',
    message: 'Use "length" instead of "len"',
  },
  'match:stringLength:': {
    actual: 'match:length:',
    message: 'Use "length" instead of "stringLength"',
  },
  'match:beginsWith:': {
    actual: 'match:startsWith:',
    message: 'Use "startsWith" instead of "beginsWith"',
  },
  'match:starts:': {
    actual: 'match:startsWith:',
    message: 'Use "startsWith" instead of "starts"',
  },
  'match:ends:': {
    actual: 'match:endsWith:',
    message: 'Use "endsWith" instead of "ends"',
  },
  'match:finishsWith:': {
    actual: 'match:endsWith:',
    message: 'Use "endsWith" instead of "finishsWith"',
  },
  'match:has:': {
    actual: 'match:contains:',
    message: 'Use "contains" instead of "has"',
  },
  'match:includes:': {
    actual: 'match:contains:',
    message: 'Use "contains" instead of "includes"',
  },
  'match:indexOf:': {
    actual: 'match:contains:',
    message: 'Use "contains" instead of "indexOf"',
  },
  'match:search:': {
    actual: 'match:contains:',
    message: 'Use "contains" instead of "search"',
  },
  'match:find:': {
    actual: 'match:contains:',
    message: 'Use "contains" instead of "find"',
  },
  'match:match:': {
    actual: 'match:regex:',
    message: 'Use "regex" instead of "match"',
  },
  'match:pattern:': {
    actual: 'match:regex:',
    message: 'Use "regex" instead of "pattern"',
  },
  'match:regexp:': {
    actual: 'match:regex:',
    message: 'Use "regex" instead of "regexp"',
  },
  'match:regularExpression:': {
    actual: 'match:regex:',
    message: 'Use "regex" instead of "regularExpression"',
  },
  'match:gt:': {
    actual: 'match:greaterThan:',
    message: 'Use "greaterThan" instead of "gt"',
  },
  'match:gte:': {
    actual: 'match:greaterThanOrEqual:',
    message: 'Use "greaterThanOrEqual" instead of "gte"',
  },
  'match:lt:': {
    actual: 'match:lessThan:',
    message: 'Use "lessThan" instead of "lt"',
  },
  'match:lte:': {
    actual: 'match:lessThanOrEqual:',
    message: 'Use "lessThanOrEqual" instead of "lte"',
  },
  'match:eq:': {
    actual: 'match:equals:',
    message: 'Use "equals" instead of "eq"',
  },
  'match:neq:': {
    actual: 'match:notEquals:',
    message: 'Use "notEquals" instead of "neq"',
  },
  'match:ne:': {
    actual: 'match:notEquals:',
    message: 'Use "notEquals" instead of "ne"',
  },
  'match:!=:': {
    actual: 'match:notEquals:',
    message: 'Use "notEquals" instead of "!="',
  },
  'match:==:': {
    actual: 'match:equals:',
    message: 'Use "equals" instead of "=="',
  },
  'match:===:': {
    actual: 'match:equals:',
    message: 'Use "equals" instead of "==="',
  },
  'match:is:': {
    actual: 'match:equals:',
    message: 'Use "equals" instead of "is"',
  },
  'match:isEqual:': {
    actual: 'match:equals:',
    message: 'Use "equals" instead of "isEqual"',
  },
  'match:equal:': {
    actual: 'match:equals:',
    message: 'Use "equals" instead of "equal"',
  },
  'match:same:': {
    actual: 'match:equals:',
    message: 'Use "equals" instead of "same"',
  },
  'match:in:': {
    actual: 'match:arrayContains:',
    message: 'Use "arrayContains" for checking if array contains value',
  },
  'match:oneOf:': {
    actual: 'match:arrayContains:',
    message: 'Use "arrayContains" for checking if value is in array',
  },
  'match:within:': {
    actual: 'match:between:',
    message: 'Use "between" for numeric range validation',
  },
  'match:inRange:': {
    actual: 'match:between:',
    message: 'Use "between" for numeric range validation',
  },
  'match:range:': {
    actual: 'match:between:',
    message: 'Use "between" for simple range or "range:" for complex ranges',
  },
  'match:near:': {
    actual: 'match:approximately:',
    message: 'Use "approximately" for near-equal numeric comparisons',
  },
  'match:close:': {
    actual: 'match:approximately:',
    message: 'Use "approximately" for close numeric comparisons',
  },
  'match:around:': {
    actual: 'match:approximately:',
    message: 'Use "approximately" for approximate numeric comparisons',
  },
  'match:about:': {
    actual: 'match:approximately:',
    message: 'Use "approximately" for approximate numeric comparisons',
  },
  'match:mod:': {
    actual: 'match:multipleOf:',
    message: 'Use "multipleOf" or "divisibleBy" for modular arithmetic',
  },
  'match:modulo:': {
    actual: 'match:multipleOf:',
    message: 'Use "multipleOf" or "divisibleBy" for modular arithmetic',
  },
  'match:%:': {
    actual: 'match:multipleOf:',
    message: 'Use "multipleOf" or "divisibleBy" for modular arithmetic',
  },
  'match:after:': {
    actual: 'match:dateAfter:',
    message: 'Use "dateAfter" for date comparisons',
  },
  'match:before:': {
    actual: 'match:dateBefore:',
    message: 'Use "dateBefore" for date comparisons',
  },
  'match:since:': {
    actual: 'match:dateAfter:',
    message: 'Use "dateAfter" for date comparisons',
  },
  'match:until:': {
    actual: 'match:dateBefore:',
    message: 'Use "dateBefore" for date comparisons',
  },
  'match:age:': {
    actual: 'match:dateAge:',
    message: 'Use "dateAge" for age-based date validation',
  },
  'match:old:': {
    actual: 'match:dateAge:',
    message: 'Use "dateAge" for age-based date validation',
  },
  'match:recent:': {
    actual: 'match:dateAge:',
    message: 'Use "dateAge" for age-based date validation',
  },
};

/**
 * Analyze a pattern to detect non-existent features
 * @param {string} pattern - The pattern to analyze
 * @returns {Array} Array of error suggestions for non-existent features
 */
export function analyzeNonExistentFeatures(pattern) {
  const suggestions = [];

  if (!pattern || typeof pattern !== 'string') {
    return suggestions;
  }

  // Check for exact non-existent feature patterns
  for (const [nonExistentPattern, details] of Object.entries(NON_EXISTENT_FEATURES)) {
    if (pattern.startsWith(nonExistentPattern)) {
      suggestions.push({
        type: 'non_existent_feature',
        category: details.category,
        original: pattern,
        message: details.message,
        suggestion: details.suggestion,
        alternatives: details.alternatives,
        example: details.example,
        severity: 'error',
      });
      break;
    }
  }

  // Check for confusing pattern variations
  for (const [confusingPattern, details] of Object.entries(CONFUSING_PATTERNS)) {
    if (pattern.startsWith(confusingPattern)) {
      suggestions.push({
        type: 'confusing_pattern',
        original: pattern,
        corrected: pattern.replace(confusingPattern, details.actual),
        message: details.message,
        suggestion: `Replace "${confusingPattern}" with "${details.actual}"`,
        severity: 'warning',
      });
      break;
    }
  }

  // Check for patterns that sound like they should exist but don't
  const soundsLikePatterns = [
    {
      regex: /^match:(validate|check|verify|test|ensure):/,
      message: 'Validation keywords are not supported as pattern operators',
      suggestion: 'Use specific validation patterns like "type:", "regex:", "contains:", etc.',
    },
    {
      regex: /^match:(is|has|can|should|must):/,
      message: 'Boolean-style operators are not supported',
      suggestion: 'Use specific patterns like "exists", "type:", "arrayContains:", etc.',
    },
    {
      regex: /^match:(get|set|put|post|delete|patch):/,
      message: 'HTTP method patterns are not supported',
      suggestion: 'Use string patterns like "equals:", "contains:", "startsWith:" to validate HTTP methods',
    },
    {
      regex: /^match:(create|read|update|delete|insert|select):/,
      message: 'CRUD operation patterns are not supported',
      suggestion: 'Use string patterns to validate operation names or types',
    },
    {
      regex: /^match:(add|remove|push|pop|shift|unshift):/,
      message: 'Array operation patterns are not supported',
      suggestion: 'Use "arrayContains:", "arrayLength:", or "type:" patterns for array validation',
    },
    {
      regex: /^match:(parse|stringify|serialize|deserialize):/,
      message: 'Data transformation patterns are not supported',
      suggestion: 'Use "type:" for checking parsed data types or validate final values directly',
    },
    {
      regex: /^match:(encode|decode|encrypt|decrypt|compress|decompress):/,
      message: 'Data encoding/encryption patterns are not supported',
      suggestion: 'Use "regex:" patterns to validate encoded/encrypted formats',
    },
    {
      regex: /^match:(load|save|import|export|download|upload):/,
      message: 'File operation patterns are not supported',
      suggestion: 'Use string patterns to validate file names, paths, or operation results',
    },
    {
      regex: /^match:(connect|disconnect|login|logout|authenticate|authorize):/,
      message: 'Authentication/connection patterns are not supported',
      suggestion: 'Use "type:", "exists", or string patterns to validate authentication results',
    },
    {
      regex: /^match:(success|failure|error|warning|info|debug):/,
      message: 'Status/log level patterns are not supported',
      suggestion: 'Use "contains:", "equals:", or "startsWith:" to validate status messages',
    },
    {
      regex: /^match:(min|max|avg|sum|count|total):/,
      message: 'Aggregation function patterns are not supported',
      suggestion: 'Use numeric comparison patterns like "greaterThan:", "between:", etc.',
    },
    {
      regex: /^match:(first|last|head|tail|top|bottom):/,
      message: 'Position-based patterns are not supported',
      suggestion: 'Use "extractField:" with array indexing or "arrayContains:" patterns',
    },
    {
      regex: /^match:(sort|order|reverse|shuffle|group|filter):/,
      message: 'Array manipulation patterns are not supported',
      suggestion: 'Use "crossField:" patterns to validate ordering or specific array content',
    },
    {
      regex: /^match:(join|split|concat|merge|combine):/,
      message: 'String/array combination patterns are not supported',
      suggestion: 'Use "contains:", "startsWith:", "endsWith:" for string validation',
    },
    {
      regex: /^match:(trim|strip|pad|truncate|substring|slice):/,
      message: 'String manipulation patterns are not supported',
      suggestion: 'Use "regex:" patterns to validate trimmed/processed strings',
    },
    {
      regex: /^match:(round|floor|ceil|abs|sqrt|pow|log):/,
      message: 'Mathematical function patterns are not supported',
      suggestion: 'Use numeric comparison patterns on the expected result values',
    },
    {
      regex: /^match:(now|today|yesterday|tomorrow|past|future):/,
      message: 'Relative date patterns are not supported',
      suggestion: 'Use "dateAfter:", "dateBefore:", "dateAge:", or "dateBetween:" with specific dates',
    },
    {
      regex: /^match:(color|rgb|hex|hsl|css|style):/,
      message: 'Color/style validation patterns are not supported',
      suggestion: 'Use "regex:" patterns to validate color codes or CSS values',
    },
    {
      regex: /^match:(http|https|ftp|smtp|tcp|udp|ws|wss):/,
      message: 'Protocol-specific patterns are not supported',
      suggestion: 'Use "startsWith:", "contains:", or "regex:" patterns for protocol validation',
    },
    {
      regex: /^match:(json|xml|yaml|csv|html|markdown):/,
      message: 'Format-specific validation patterns are not supported',
      suggestion: 'Use "type:" for objects/arrays or "regex:" for format validation',
    },
  ];

  for (const check of soundsLikePatterns) {
    if (check.regex.test(pattern)) {
      suggestions.push({
        type: 'sounds_like_feature',
        original: pattern,
        message: check.message,
        suggestion: check.suggestion,
        severity: 'error',
      });
      break;
    }
  }

  return suggestions;
}

/**
 * Get analytics about non-existent features by category
 * @returns {Object} Analytics object with category counts and totals
 */
export function getNonExistentFeatureAnalytics() {
  const categories = {};
  const confusingPatternCount = Object.keys(CONFUSING_PATTERNS).length;
  
  // Count features by category
  for (const details of Object.values(NON_EXISTENT_FEATURES)) {
    const category = details.category;
    categories[category] = (categories[category] || 0) + 1;
  }

  return {
    totalNonExistentFeatures: Object.keys(NON_EXISTENT_FEATURES).length,
    totalConfusingPatterns: confusingPatternCount,
    categoryCounts: categories,
    categories: Object.keys(categories).sort(),
    mostCommonCategory: Object.entries(categories)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null,
  };
}

/**
 * Get all non-existent patterns by category
 * @param {string} category - Optional category filter
 * @returns {Array} Array of pattern names
 */
export function getNonExistentPatternsByCategory(category = null) {
  const patterns = [];
  
  for (const [pattern, details] of Object.entries(NON_EXISTENT_FEATURES)) {
    if (!category || details.category === category) {
      patterns.push({
        pattern,
        category: details.category,
        message: details.message,
        alternatives: details.alternatives,
      });
    }
  }
  
  return patterns.sort((a, b) => a.pattern.localeCompare(b.pattern));
}
