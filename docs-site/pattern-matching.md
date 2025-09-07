---
title: Pattern Matching Reference - Advanced MCP Testing Patterns
layout: default
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
# Verified with API Testing Server - monitors array validation
result:
  metadata:
    activeMonitors: "match:type:array"  # Validates array type correctly
```

### String Patterns

#### Contains Substring ✅
String must contain the specified substring:

```yaml
result:
  message: "match:contains:success"           # Contains "success"
  description: "match:contains:file system"  # Contains "file system"
  error: "match:contains:not found"          # Contains "not found"
```

**Real Example from Production Testing:**
```yaml
# Verified with FastForward BM Library MCP Server
result:
  content:
    - type: "text"
      text: "match:contains:Found 129 components"
```

#### String Prefix/Suffix Patterns ✅
String prefix and suffix matching for validation of specific start/end patterns:

```yaml
# Starts with prefix
result:
  name: "match:startsWith:get_"        # Starts with "get_" 
  url: "match:startsWith:https://"     # Starts with "https://"
  greeting: "match:startsWith:Hello"   # Starts with "Hello"
  logLevel: "match:startsWith:Error:"  # Starts with "Error:"

# Ends with suffix
result:
  filename: "match:endsWith:.json"     # Ends with ".json"
  version: "match:endsWith:.0"         # Ends with ".0"
  message: "match:endsWith:Conductor!" # Ends with "Conductor!"
  timestamp: "match:endsWith:T14:30:00" # Ends with timestamp
```

**Real Examples from Production Testing:**
```yaml
# File extension validation
result:
  filename: "match:endsWith:.txt"

# API endpoint validation
result:
  endpoint: "match:startsWith:/api/v1/"

# Log level validation  
result:
  logEntry: "match:startsWith:WARNING:"
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
# Extract tool names from FastForward BM Library
result:
  match:extractField: "tools.*.name" 
  value:
    - "list_components"
    - "list_hooks" 
    - "get_component_docs"
    - "search_docs"

# Extract single field for validation
result:
  match:extractField: "tools.5.description"
  value: "match:contains:functionality"
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

## Array Patterns

### Array Length Validation
```yaml
result:
  tools: "match:arrayLength:6"         # Exactly 6 elements
  items: "match:arrayLength:0"         # Empty array
  data: "match:arrayLength:100"        # Exactly 100 elements
```

### Array Elements Pattern ✅
All array elements must match the specified pattern:

```yaml
result:
  tools:
    match:arrayElements:               # All tools must have these fields
      name: "match:type:string"
      description: "match:type:string"
      inputSchema:
        type: "object"
        properties: "match:type:object"

  numbers:
    match:arrayElements: "match:type:number"  # All elements are numbers
```

**Real Example from Production Testing:**
```yaml
# Verified with FastForward BM Library - all tools have name/description  
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
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

### String Pattern Validation  
```yaml
- it: "should validate string prefixes and suffixes"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:startsWith:Processing"  # Must start with "Processing"
        
        logEntry: "match:startsWith:Error:"      # Log level validation
        filename: "match:endsWith:.txt"          # File extension check
        greeting: "match:endsWith:Conductor!"    # Specific suffix
```

### Tool Validation
```yaml
- it: "should validate tool structure"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:regex:[a-z_]+"        # Snake case names
            description: "match:type:string"
            inputSchema:
              type: "object"
              properties: "match:type:object"
              required: "match:type:array"
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

### Component Listing Validation
```yaml
- it: "should list components in correct format"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:- \\*\\*\\w+\\*\\* \\(component\\)"
        match:extractField: "content.0.text"
        value: "match:regex:129 components found"
```

### Complex Data Structure
```yaml
- it: "should validate complex nested data"
  expect:
    response:
      result:
        data:
          users:
            match:arrayElements:
              id: "match:type:number"
              profile:
                name: "match:type:string"
                email: "match:regex:[^@]+@[^@]+\\.[^@]+"
                settings:
                  match:partial:
                    notifications: "match:type:boolean"
                    theme: "match:regex:(light|dark)"
          pagination:
            match:partial:
              page: "match:type:number"
              total: "match:type:number"
              hasNext: "match:type:boolean"
```

### Performance Validation
```yaml
- it: "should complete within acceptable time"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:Completed in \\d+ms"
        timing:
          duration: "match:regex:[0-9]+(\\.[0-9]+)?ms"
          status: "match:regex:(fast|normal|slow)"
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

**Next Steps:**
- [**YAML Testing Guide**]({{ '/yaml-testing.html' | relative_url }}) - Apply patterns in YAML tests
- [**Examples**]({{ '/examples.html' | relative_url }}) - Real-world pattern usage
- [**Troubleshooting**]({{ '/troubleshooting.html' | relative_url }}) - Debug pattern issues
