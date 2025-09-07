---
title: Pattern Matching Reference - Advanced MCP Testing Patterns
layout: page
description: >-
  Comprehensive pattern matching reference for MCP Conductor testing library.
  Learn 11+ advanced validation patterns including regex, partial matching,
  array validation, field extraction, and type checking for MCP servers.
keywords: >-
  MCP pattern matching, Model Context Protocol validation patterns, regex MCP testing,
  array validation MCP, partial matching MCP, field extraction MCP testing
canonical_url: "https://conductor.rhino-inquisitor.com/pattern-matching"
---

# Pattern Matching Reference
## Advanced MCP Server Validation Patterns

MCP Conductor provides 11+ advanced pattern matching capabilities for flexible and powerful Model Context Protocol test validation. All core patterns have been verified with production MCP servers.

## 🏆 Production Verified Patterns

The following patterns have been extensively tested with real-world MCP servers and are **production-ready**:

- ✅ **Deep Equality** - Exact value matching
- ✅ **Type Validation** - Data type checking (`string`, `number`, `object`, `array`, etc.)
- ✅ **Array Length** - Exact element count validation  
- ✅ **Array Elements** - Pattern matching for all array elements
- ✅ **Array Contains** - Check if array contains specific values
- ✅ **Field Extraction** - Extract and validate specific field values
- ✅ **Partial Matching** - Validate only specified object fields
- ✅ **String Contains** - Substring matching
- ✅ **Regex Matching** - Full regular expression support
- ✅ **Object Count** - Property counting
- ✅ **Field Exists** - Field presence validation

## Table of Contents
- [Pattern Types Overview](#pattern-types-overview)
- [Basic Patterns](#basic-patterns)
- [Advanced Patterns](#advanced-patterns)
- [Array Patterns](#array-patterns)
- [Field Extraction](#field-extraction)
- [Regex Patterns](#regex-patterns)
- [Pattern Examples](#pattern-examples)

## Pattern Types Overview

| Pattern Type | Syntax | Description | Status |
|-------------|--------|-------------|--------|
| **Deep Equality** | `value` | Exact match (default) | ✅ Core |
| **Type Validation** | `"match:type:string"` | Validates data type | ✅ Verified |
| **String Contains** | `"match:contains:text"` | String contains substring | ✅ Verified |
| **String Starts With** | `"match:startsWith:prefix"` | String starts with prefix | ✅ Verified |
| **String Ends With** | `"match:endsWith:suffix"` | String ends with suffix | ✅ Verified |
| **Regex Match** | `"match:regex:pattern"` | Regular expression match | ✅ Verified |
| **Array Length** | `"match:arrayLength:N"` | Array has exactly N elements | ✅ Verified |
| **Array Elements** | `"match:arrayElements:"` | All elements match pattern | ✅ Verified |
| **Array Contains** | `"match:arrayContains:value"` | Array contains specific value | ✅ Verified |
| **Field Extraction** | `"match:extractField:path"` | Extract field values | ✅ Verified |
| **Partial Match** | `"match:partial:"` | Partial object matching | ✅ Verified |
| **Object Count** | `"match:count:N"` | Count object properties | ✅ Tested |
| **Field Exists** | `"match:exists"` | Field exists validation | ✅ Tested |

**Legend:**
- ✅ **Verified**: Tested with production MCP servers
- ✅ **Core**: Fundamental pattern matching

## Basic Patterns

### Deep Equality (Default)
The simplest pattern - values must match exactly:

```yaml
result:
  status: "success"           # Must be exactly "success"
  count: 42                   # Must be exactly 42
  active: true                # Must be exactly true
  tools:
    - name: "calculator"      # Exact array structure required
      description: "Math operations"
```

### Type Validation
Validates data types without checking specific values:

```yaml
result:
  serverInfo: "match:type:object"    # Must be object
  tools: "match:type:array"          # Must be array
  count: "match:type:number"         # Must be number
  active: "match:type:boolean"       # Must be boolean
  message: "match:type:string"       # Must be string
  nullable: "match:type:null"        # Must be null
```

**Supported Types:**
- `string`, `number`, `boolean`, `object`, `array`, `null`

**Important Note for Arrays:** 
The `match:type:array` pattern correctly uses `Array.isArray()` for validation, as JavaScript arrays have `typeof array === "object"`. This ensures reliable array type detection.

**Real Example from Production Testing:**
```yaml
# Verified with Simple Filesystem Server - Basic type validation
result:
  content: "match:type:array"    # Content field must be array
  isError: "match:type:boolean"  # isError field must be boolean
  tools: "match:type:array"      # Tools field must be array
```

### String Patterns

#### Contains Substring ✅
String must contain the specified substring:

```yaml
result:
  message: "match:contains:success"           # Contains "success"
  description: "match:contains:file"          # Contains "file" 
  error: "match:contains:not found"           # Contains "not found"
```

**Real Example from Production Testing:**
```yaml
# Verified with Simple Filesystem Server
result:
  content:
    - type: "text"
      text: "match:contains:MCP"              # Content contains "MCP"

# Error message validation
result:
  content:
    - type: "text"
      text: "match:contains:not found"        # Error contains "not found"
```

#### String Prefix/Suffix Patterns ✅
String prefix and suffix matching for validation of specific start/end patterns:

```yaml
# Starts with prefix
result:
  name: "match:startsWith:get_"        # Starts with "get_" 
  url: "match:startsWith:https://"     # Starts with "https://"
  greeting: "match:startsWith:Hello"   # Starts with "Hello"
  jsonrpc: "match:startsWith:2."       # JSON-RPC version starts with "2."

# Ends with suffix
result:
  filename: "match:endsWith:.json"     # Ends with ".json"
  version: "match:endsWith:.0"         # Ends with ".0"
  message: "match:endsWith:Conductor!" # Ends with "Conductor!"
  text: "match:endsWith:Hello!"        # Text ends with "Hello!"
```

**Real Examples from Production Testing:**
```yaml
# Verified with Simple Filesystem Server - Greeting validation
result:
  content:
    - type: "text"  
      text: "match:startsWith:Hello"          # Starts with "Hello"

# JSON-RPC version validation (works on any field)
response:
  jsonrpc: "match:startsWith:2."              # Version starts with "2."
  
# File content ending validation
result:
  content:
    - type: "text"
      text: "match:endsWith:Conductor!"       # Ends with "Conductor!"
```

## Advanced Patterns

### Partial Matching
Only validates specified fields, ignoring others:

```yaml
result:
  match:partial:                       # Only check these fields
    tools:
      - name: "calculator"             # Must have calculator tool
        description: "match:contains:math"
    serverInfo:
      name: "match:type:string"        # Name must be string
    # Other fields in result are ignored
```

#### Complex Partial Matching
```yaml
result:
  match:partial:
    data:
      items:
        - id: "match:type:number"
          status: "active"
        - id: "match:type:number"
          status: "match:contains:pending"
    metadata:
      total: "match:type:number"
```

### Field Extraction
Extract specific field values for validation:

```yaml
# Extract tool names from array
result:
  match:extractField: "tools.*.name"   # Extract 'name' from all tools
  value:                               # Expected extracted values
    - "calculator"
    - "text_processor"
    - "data_validator"

# Extract nested field
result:
  match:extractField: "data.items.*.metadata.tags"
  value: "match:arrayContains:important"
```

**Field Path Syntax:**
- `"field"` - Direct field access
- `"field.subfield"` - Nested field access
- `"field.*"` - All array elements
- `"field.*.subfield"` - Nested field in all array elements

**Real Examples from Production Testing:**
```yaml
# Extract tool names from Simple Filesystem Server
result:
  match:extractField: "tools.*.name" 
  value:
    - "read_file"                     # Single tool extraction

# Extract and validate with array contains
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:read_file"  # Check if read_file exists

# Extract descriptions for pattern matching
result:
  match:extractField: "tools.*.description"
  value:
    - "match:contains:Reads"          # Description must contain "Reads"

# Extract from nested schema structures
result:
  match:extractField: "tools.*.inputSchema.type"
  value:
    - "object"                        # Schema type extraction
```

## Array Patterns

### Array Length Validation ✅
Validate exact number of array elements:

```yaml
result:
  tools: "match:arrayLength:1"         # Exactly 1 tool
  content: "match:arrayLength:1"       # Single content element
  items: "match:arrayLength:0"         # Empty array
  data: "match:arrayLength:100"        # Exactly 100 elements
```

**Real Example from Production Testing:**
```yaml
# Verified with Simple Filesystem Server
result:
  tools: "match:arrayLength:1"         # Server has exactly 1 tool
  content: "match:arrayLength:1"       # Single content response
```

### Array Elements Pattern ✅
All array elements must match the specified pattern:

```yaml
result:
  tools:
    match:arrayElements:               # All tools must have these fields
      name: "match:type:string"
      description: "match:type:string" 
      inputSchema: "match:type:object"

  content:
    match:arrayElements:               # All content elements structure
      type: "match:type:string"
      text: "match:type:string"

  numbers:
    match:arrayElements: "match:type:number"  # All elements are numbers
```

**Real Example from Production Testing:**
```yaml
# Verified with Simple Filesystem Server - all tools have name/description  
result:
  tools:
    match:arrayElements:
      name: "match:type:string"        # Tool name is string
      description: "match:type:string" # Tool description is string
      inputSchema: "match:type:object" # Schema is object

# Content structure validation
result:
  content:
    match:arrayElements:
      type: "match:type:string"        # Content type field
      text: "match:type:string"        # Content text field
```

### Array Contains Pattern ✅
Check if array contains specific values (used with field extraction):

```yaml
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:read_file"    # Array contains "read_file"

# Multiple value check
result:
  match:extractField: "categories"
  value: "match:arrayContains:filesystem"   # Categories include "filesystem"
```

## Additional Utility Patterns

### Object Property Count ✅
Count the number of properties in an object:

```yaml
# Count server info properties
result:
  match:extractField: "serverInfo"
  value: "match:count:2"           # Object has exactly 2 properties
```

### Field Existence Check ✅ 
Verify that a field exists (regardless of value):

```yaml
result:
  serverInfo:
    protocolVersion: "match:exists"  # Field must exist
    capabilities: "match:exists"     # Any non-null value accepted
```
      description: "match:type:string"
```

#### Complex Array Element Patterns
```yaml
result:
  users:
    match:arrayElements:
      id: "match:type:number"
      name: "match:type:string"
      email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
      profile:
        match:partial:
          active: true
          role: "match:contains:admin"
```

### Array Contains Value
Check if array contains specific value:

```yaml
# Simple value check
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:calculator"

# Multiple values
result:
  match:extractField: "categories.*.id"
  value:
    match:arrayContains: 
      - 1
      - 5
      - 10
```

## Regex Patterns

### Basic Regex
```yaml
result:
  text: "match:regex:Found \\d+ results"     # "Found 25 results"
  id: "match:regex:[A-Z]{2}\\d{4}"          # "AB1234"
  status: "match:regex:(success|complete)"   # "success" or "complete"
```

### Common Regex Patterns

#### Numbers
```yaml
# Any number
text: "match:regex:\\d+"

# Decimal numbers
price: "match:regex:\\d+\\.\\d{2}"          # "19.99"

# Negative numbers
temperature: "match:regex:-?\\d+"            # "-5" or "23"

# Percentage
progress: "match:regex:\\d+%"                # "75%"
```

#### Dates and Times
```yaml
# ISO dates
date: "match:regex:\\d{4}-\\d{2}-\\d{2}"    # "2024-01-15"

# ISO timestamps
timestamp: "match:regex:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"

# Time format
time: "match:regex:\\d{2}:\\d{2}(:\\d{2})?" # "14:30" or "14:30:45"
```

#### Identifiers
```yaml
# UUIDs
uuid: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

# Email addresses
email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"

# URLs
url: "match:regex:https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/[^\\s]*)?"

# Phone numbers (US)
phone: "match:regex:\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}"
```

#### File Formats
```yaml
# File paths
path: "match:regex:^(/[^/]+)+/?$"           # Unix paths

# File extensions
filename: "match:regex:\\w+\\.(js|ts|json)$"  # JavaScript files

# Version numbers
version: "match:regex:v?\\d+\\.\\d+\\.\\d+"  # "1.2.3" or "v1.2.3"
```

#### Word Boundaries & Precise Matching
```yaml
# Complete word matching
text: "match:regex:\\bError\\b"              # Matches "Error" as complete word
status: "match:regex:\\bSTATUS\\b:\\s*ACTIVE" # Matches "STATUS: ACTIVE" patterns  
monitor: "match:regex:Monitor\\s+\\b\\d+\\b"  # Matches "Monitor 123" patterns
name: "match:regex:\\b[A-Z][a-z]+\\b"        # Matches capitalized words

# Exact status matching (production example)
result: "match:regex:\\bmonitors\\b.*\\bactive\\b"  # "monitors are active"
```

**Important:** Word boundaries (`\\b`) ensure precise matching and prevent partial matches within larger words.

#### JSON Patterns
```yaml
# JSON structure
json: "match:regex:\\{.*\"status\":\\s*\"success\".*\\}"

# Array format
array: "match:regex:\\[.*\\]"

# Key-value pairs
keyvalue: "match:regex:\"\\w+\":\\s*\"[^\"]+\""
```

## Pattern Examples

### Basic Tool Validation ✅ (Simple Filesystem Server)
```yaml
- it: "should list available tools with correct structure"
  request:
    jsonrpc: "2.0"
    id: "tools-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "tools-1"
      result:
        tools: "match:arrayLength:1"           # Exactly 1 tool
    stderr: "toBeEmpty"

- it: "should validate tool structure"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"           # Tool name is string  
            description: "match:type:string"    # Tool description is string
            inputSchema: "match:type:object"    # Schema is object
```

### String Pattern Validation ✅ (Simple Filesystem Server)
```yaml
- it: "should validate string patterns in content"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:startsWith:Hello"      # Starts with "Hello"
        jsonrpc: "match:startsWith:2."          # JSON-RPC version validation

- it: "should validate error message patterns"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:not found"    # Error contains "not found"
        isError: true
```

### Field Extraction and Validation ✅ (Simple Filesystem Server)
```yaml
- it: "should extract and validate tool names"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"     # Extract all tool names
        value:
          - "read_file"                         # Expected tool name

- it: "should check if specific tool exists"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: "match:arrayContains:read_file" # Check if read_file exists
```

### Array Elements Pattern ✅ (Simple Filesystem Server) 
```yaml
- it: "should validate all content elements have correct structure"
  expect:
    response:
      result:
        content:
          match:arrayElements:
            type: "match:type:string"           # All content has type field
            text: "match:type:string"           # All content has text field
```

### Type Validation ✅ (Simple Filesystem Server)
```yaml
- it: "should validate response field types"
  expect:
    response:
      result:
        content: "match:type:array"             # Content is array
        isError: "match:type:boolean"           # isError is boolean
        tools: "match:type:array"               # tools is array
```

### API Response Validation
```yaml
- it: "should return valid API response"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:Status: (200|201|202)"
        metadata:
          match:partial:
            timestamp: "match:regex:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
            duration: "match:regex:\\d+ms"
```

### Error Response Validation
```yaml
- it: "should handle errors correctly"
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Error:"
        errorCode: "match:regex:[A-Z_]+"       # "INVALID_PARAM"
```

### Partial Matching Example ✅ (Simple Filesystem Server)
```yaml
- it: "should validate partial response structure"  
  expect:
    response:
      result:
        match:partial:                          # Only check specified fields
          tools:
            - name: "read_file"                 # Must have read_file tool
              description: "match:contains:Reads"
          # Other response fields are ignored
```

### Combined Pattern Validation ✅ (Simple Filesystem Server)
```yaml
- it: "should validate with multiple pattern types"
  expect:
    response:
      result:
        content:
          match:arrayElements:
            type: "match:type:string"           # Each element type validation
            text: "match:startsWith:Hello"      # Each element content validation  
        isError: "match:type:boolean"           # Error flag type validation
```

### Error Handling Patterns ✅ (Simple Filesystem Server)
```yaml
- it: "should validate error responses correctly"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:not found"    # Error message validation
        isError: true                           # Must be error state
```

## Pattern Debugging Tips

### 1. **Test Patterns Incrementally**
```yaml
# Start simple
text: "match:type:string"

# Add constraints gradually  
text: "match:contains:success"

# Finalize with specific pattern
text: "match:regex:Operation completed successfully in \\d+ms"
```

### 2. **Use Debug and Verbose Modes**
```bash
# Verbose output shows actual vs expected values
conductor tests.yml --config config.json --verbose

# Debug mode shows detailed MCP communication
conductor tests.yml --config config.json --debug

# Combine for maximum debugging information
conductor tests.yml --config config.json --verbose --debug --timing
```
This shows actual vs expected values for failed matches plus MCP communication details.

### 3. **Validate Regex Separately**
Test regex patterns outside MCP Conductor:
```javascript
const pattern = /Found \d+ results/;
const text = "Found 25 results in 150ms";
console.log(pattern.test(text)); // true
```

### 4. **Check Escaping**
YAML requires double backslashes for regex:
```yaml
# ❌ Wrong - single backslash
text: "match:regex:\d+"

# ✅ Correct - double backslash  
text: "match:regex:\\d+"
```

### 5. **Verify Field Paths**
Test field extraction paths:
```javascript
const data = { tools: [{ name: "calc" }, { name: "text" }] };
const path = "tools.*.name";
// Should extract: ["calc", "text"]
```

---

## ⚠️ Common Pattern Mistakes and Anti-Patterns

### **YAML Structure Errors**

#### **1. Duplicate Keys (Critical Error)**
```yaml
# ❌ WRONG - YAML doesn't allow duplicate keys
result:
  tools: "match:arrayLength:1"
  tools: ["match:contains:read_file"]  # This overwrites the first!

# ❌ WRONG - Multiple extractField keys
result:
  match:extractField: "tools.*.name"
  match:extractField: "isError"  # Duplicate key error!

# ✅ CORRECT - Use separate test cases
result:
  tools: "match:arrayLength:1"
  
# In a separate test:
result:
  tools:
    match:arrayContains: "read_file"
```

#### **2. Pattern Structure Confusion**
```yaml
# ❌ WRONG - Mixing arrayElements with direct array structure
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # This creates a structure error!

# ✅ CORRECT - Use arrayElements OR direct array, not both
result:
  content:
    match:arrayElements:
      type: "text"
      text: "match:contains:data"

# OR use direct array structure:
result:
  content:
    - type: "text"
      text: "match:contains:data"
```

#### **3. Field Extraction Mixing**
```yaml
# ❌ WRONG - Can't mix extractField with other patterns in same object
result:
  tools: "match:arrayLength:1"
  match:extractField: "tools.*.name"  # Structure conflict!

# ✅ CORRECT - Separate validations
result:
  tools: "match:arrayLength:1"

# In separate test for field extraction:
result:
  match:extractField: "tools.*.name"
  value:
    - "read_file"
```

### **Response Structure Misunderstanding**

#### **4. Array vs Object Confusion**
```yaml
# ❌ WRONG - Expecting object when response is array
result:
  content:
    match:arrayElements:
      type: "text"  # But actual response is single object!

# ✅ CORRECT - Match actual response structure
result:
  content:
    - type: "text"
      text: "match:regex:.*data.*"
```

#### **5. Partial Matching Scope**
```yaml
# ❌ WRONG - Partial matching too broad
result:
  match:partial:
    content: [...]
    isError: false
    extraField: "ignored"  # Partial ignores extra fields, but this structure is wrong

# ✅ CORRECT - Proper partial matching structure
result:
  match:partial:
    content:
      - type: "text"
    isError: false
  # Other fields in result are ignored
```

### **Pattern Logic Errors**

#### **6. Regex Escaping Issues**
```yaml
# ❌ WRONG - Insufficient escaping
text: "match:regex:\d{4}-\d{2}-\d{2}"  # Single backslash in YAML

# ❌ WRONG - Over-escaping
text: "match:regex:\\\\d{4}-\\\\d{2}-\\\\d{2}"  # Four backslashes

# ✅ CORRECT - Double backslash for YAML
text: "match:regex:\\d{4}-\\d{2}-\\d{2}"
```

#### **7. Type Validation Misuse**
```yaml
# ❌ WRONG - Type pattern on wrong data type
result:
  count: "match:type:string"  # But count is actually a number!

# ✅ CORRECT - Match actual data type
result:
  count: "match:type:number"
  name: "match:type:string"
```

### **Field Extraction Problems**

#### **8. Incorrect Field Paths**
```yaml
# ❌ WRONG - Invalid path syntax
match:extractField: "tools[0].name"  # Square brackets not supported

# ❌ WRONG - Missing wildcard for arrays
match:extractField: "tools.name"  # Expects single object, not array

# ✅ CORRECT - Proper field path syntax
match:extractField: "tools.*.name"      # All tool names
match:extractField: "tools.0.name"      # First tool name
match:extractField: "result.data.value" # Nested object path
```

#### **9. Field Extraction Value Mismatch**
```yaml
# ❌ WRONG - Extracting array but expecting single value
match:extractField: "tools.*.name"
value: "read_file"  # But extraction returns ["read_file", "other"]

# ✅ CORRECT - Match extraction result type
match:extractField: "tools.*.name"
value:
  - "read_file"
  - "other_tool"

# OR use arrayContains for partial matching
match:extractField: "tools.*.name"
value: "match:arrayContains:read_file"
```

### **Complex Pattern Combination Issues**

#### **10. Overcomplicating Simple Validations**
```yaml
# ❌ OVERCOMPLEX - Unnecessary pattern mixing
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
  match:extractField: "tools.*.name"
  value: "match:arrayContains:read_file"

# ✅ SIMPLER - Direct validation
result:
  tools:
    - name: "read_file"
      description: "match:contains:file"
```

### **Debug Strategies**

1. **Start Simple**: Begin with deep equality, then add patterns
2. **Use --debug**: Always check actual response structure
3. **Test One Pattern**: Isolate each pattern type in separate tests
4. **Validate YAML**: Use YAML linters to catch structure errors
5. **Check Documentation**: Verify pattern syntax against examples

### **Quick Fix Checklist**

- ✅ No duplicate YAML keys
- ✅ Pattern structure matches response type (array vs object)
- ✅ Double backslashes in regex patterns
- ✅ Field extraction paths use correct syntax
- ✅ Partial matching scope is appropriate
- ✅ Type validation matches actual data types
- ✅ arrayElements used only with actual arrays

---

**Next Steps:**
- [**YAML Testing Guide**]({{ '/yaml-testing.html' | relative_url }}) - Apply patterns in YAML tests
- [**Examples**]({{ '/examples.html' | relative_url }}) - Real-world pattern usage
- [**Troubleshooting**]({{ '/troubleshooting.html' | relative_url }}) - Debug pattern issues
