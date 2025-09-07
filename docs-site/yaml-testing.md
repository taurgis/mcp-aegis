---
title: YAML Testing Guide - Declarative MCP Server Testing
layout: default
description: >-
  Complete guide to YAML-based declarative testing for Model Context Protocol
  servers using MCP Conductor. Learn pattern matching, validation techniques,
  and advanced testing scenarios with real examples.
keywords: >-
  YAML MCP testing, declarative MCP tests, Model Context Protocol YAML,
  MCP pattern matching, JSON-RPC YAML testing, MCP server validation YAML
canonical_url: "https://conductor.rhino-inquisitor.com/yaml-testing"
---

# YAML Testing Guide
## Declarative Model Context Protocol Testing

MCP Conductor's YAML testing provides a powerful declarative approach to testing Model Context Protocol servers with advanced pattern matching and comprehensive validation capabilities.

## Quick Start

Initialize MCP Conductor in your project to get started:

```bash
npx mcp-conductor init
```

This creates the proper directory structure and configuration. Your YAML test files should be placed in:
- `test/mcp/*.test.mcp.yml` or 
- `tests/mcp/*.test.mcp.yml` (depending on your project structure)

Run tests with:
```bash
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"
```

## CLI Options

MCP Conductor provides several CLI options for debugging and different output formats:

```bash
# Basic test execution
conductor "tests/*.yml" --config config.json

# Verbose output shows test hierarchy and individual results
conductor "tests/*.yml" --config config.json --verbose

# Debug mode shows detailed MCP communication (JSON-RPC messages)
conductor "tests/*.yml" --config config.json --debug

# Timing information for performance analysis
conductor "tests/*.yml" --config config.json --timing

# JSON output for CI/automation systems
conductor "tests/*.yml" --config config.json --json

# Quiet mode suppresses non-essential output
conductor "tests/*.yml" --config config.json --quiet

# Combine multiple options for maximum debugging information
conductor "tests/*.yml" --config config.json --verbose --debug --timing
```

### Option Details

| Option | Short | Description |
|--------|-------|-------------|
| `--config` | `-c` | Path to configuration file (default: `./conductor.config.json`) |
| `--verbose` | `-v` | Display individual test results with test suite hierarchy |
| `--debug` | `-d` | Enable debug mode with detailed MCP communication logging |
| `--timing` | `-t` | Show timing information for tests and operations |
| `--json` | `-j` | Output results in JSON format for CI/automation |
| `--quiet` | `-q` | Suppress non-essential output (opposite of verbose) |

### Output Examples

**Verbose Output (`--verbose`):**
```
📋 Test Results Hierarchy:

📁 Calculator Tests (15ms)
   tests/calculator.test.mcp.yml

  ✓ should perform addition (2ms)
  ✓ should handle division
  ✗ should validate input (1ms)
```

**Debug Output (`--debug`):**
```
📡 [MCP SEND] → tools/call
    {
      "jsonrpc": "2.0",
      "id": "calc-1",
      "method": "tools/call",
      "params": {
        "name": "calculator",
        "arguments": { "a": 15, "b": 27 }
      }
    }
📡 [MCP RECV] ← response
    {
      "jsonrpc": "2.0",
      "id": "calc-1", 
      "result": {
        "content": [{"type": "text", "text": "Result: 42"}]
      }
    }
```

**JSON Output (`--json`):**
```json
{
  "summary": {
    "passed": 15,
    "failed": 2,
    "total": 17,
    "success": false,
    "duration": 156
  },
  "suites": [
    {
      "description": "Calculator Tests",
      "file": "tests/calculator.test.mcp.yml",
      "tests": [
        {
          "name": "should perform addition",
          "status": "passed",
          "duration": 12
        }
      ]
    }
  ]
}
```

## Table of Contents
- [CLI Options](#cli-options)
- [Test File Structure](#test-file-structure)
- [Pattern Matching](#pattern-matching)
- [Advanced Patterns](#advanced-patterns)
- [Common Test Patterns](#common-test-patterns)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Test File Structure

YAML test files follow a consistent structure for MCP protocol testing:

```yaml
description: "Human-readable test suite description"
tests:
  - it: "Individual test case description"
    request:
      jsonrpc: "2.0"
      id: "unique-test-identifier"
      method: "mcp/method/name"
      params:
        # Method-specific parameters
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-test-identifier"
        result:
          # Expected response structure
      stderr: "toBeEmpty"  # Optional stderr validation
```

### Required Components

#### **Request Structure (JSON-RPC 2.0)**
- **`jsonrpc`**: Always `"2.0"`
- **`id`**: Unique identifier for each test
- **`method`**: MCP method name (`initialize`, `tools/list`, `tools/call`)
- **`params`**: Method-specific parameters

#### **Response Expectations**
- **`response`**: Expected JSON-RPC response
- **`stderr`**: Optional stderr output validation

## Pattern Matching

MCP Conductor supports 11+ advanced pattern matching types for flexible validation:

### 1. **Deep Equality (Default)**
```yaml
result:
  tools:
    - name: "read_file"
      description: "Reads file content"  # Exact match required
```

### 2. **Type Validation**
```yaml
result:
  serverInfo: "match:type:object"
  tools: "match:type:array"
  count: "match:type:number"
  active: "match:type:boolean"
  message: "match:type:string"
```

### 3. **String Patterns**
```yaml
result:
  description: "match:contains:search"     # Contains substring ✅
```

### 4. **Regular Expressions**
```yaml
result:
  content:
    - type: "text"
      text: "match:regex:Found \\d+ results"  # Explicit regex syntax
      # OR: shorthand syntax (defaults to regex)
      text: "match:Found \\d+ results"       # Shorthand regex syntax
```

**Pattern Syntax Note**: 
- **Explicit**: `"match:regex:pattern"` - Clear regex specification
- **Shorthand**: `"match:pattern"` - Defaults to regex matching (backward compatible)

Common regex patterns:
```yaml
# Numbers
text: "match:regex:\\d+"
# Email addresses  
text: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
# UUIDs
text: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
# Timestamps
text: "match:regex:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
# URLs
text: "match:regex:https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
```

### 5. **Array Validation**
```yaml
# Array length validation
result:
  tools: "match:arrayLength:6"           # Exactly 6 elements

# All elements match pattern
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"

# Array contains specific value
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:search_docs"
```

### 6. **Field Extraction**
```yaml
# Extract specific field values (verified with production servers)
result:
  match:extractField: "tools.*.name"    # Extract 'name' from all tools
  value:
    - "calculator"
    - "text_processor" 
    - "data_validator"

# Extract single field with pattern matching
result:
  match:extractField: "tools.0.description"
  value: "match:contains:mathematical"
```

### 7. **Partial Matching**
```yaml
# Only validate specified fields
result:
  match:partial:
    tools:
      - name: "search_docs"
        description: "match:contains:search"
    serverInfo:
      name: "match:type:string"
```

## Advanced Patterns

### Complex Validation Scenarios

#### **Multi-Level Field Extraction**
```yaml
result:
  match:extractField: "data.items.*.metadata.tags"
  value: "match:arrayContains:important"
```

#### **Conditional Pattern Matching**
```yaml
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      inputSchema:
        match:partial:
          type: "object"
          properties: "match:type:object"
```

#### **Nested Array Validation**
```yaml
result:
  categories:
    match:arrayElements:
      name: "match:type:string"
      items:
        match:arrayElements:
          id: "match:type:number"
          title: "match:contains:component"
```

### Stderr Validation

```yaml
# No stderr output expected
stderr: "toBeEmpty"

# Expect specific stderr pattern
stderr: "match:regex:Warning.*deprecated"

# Expect stderr to contain substring
stderr: "match:contains:Server ready"
```

## Common Test Patterns

### 1. **Server Initialization**
```yaml
- it: "should initialize MCP server"
  request:
    jsonrpc: "2.0"
    id: "init-1"
    method: "initialize"
    params:
      protocolVersion: "2024-11-05"
      capabilities: { tools: {} }
      clientInfo: { name: "test-client", version: "1.0.0" }
  expect:
    response:
      jsonrpc: "2.0"
      id: "init-1"
      result:
        protocolVersion: "match:regex:20\\d{2}-\\d{2}-\\d{2}"
        capabilities: "match:type:object"
        serverInfo:
          name: "match:type:string"
          version: "match:type:string"
    stderr: "toBeEmpty"
```

### 2. **Tool Discovery**
```yaml
- it: "should list all available tools"
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
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:type:string"
            inputSchema:
              type: "object"
              properties: "match:type:object"
    stderr: "toBeEmpty"
```

### 3. **Tool Execution**
```yaml
- it: "should execute tool successfully"
  request:
    jsonrpc: "2.0"
    id: "exec-1"
    method: "tools/call"
    params:
      name: "calculator"
      arguments:
        operation: "add"
        a: 15
        b: 27
  expect:
    response:
      jsonrpc: "2.0"
      id: "exec-1"
      result:
        content:
          - type: "text"
            text: "match:regex:Result: \\d+"
        isError: false
    stderr: "toBeEmpty"
```

### 4. **Error Handling**
```yaml
- it: "should handle unknown tool gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "nonexistent_tool"
      arguments: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "error-1"
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Unknown tool"
    stderr: "toBeEmpty"
```

### 5. **Data Validation**
```yaml
- it: "should validate component count and format"
  request:
    jsonrpc: "2.0"
    id: "validate-1"
    method: "tools/call"
    params:
      name: "data_processor"
      arguments: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "validate-1"
      result:
        content:
          - type: "text"
            text: "match:regex:- \\*\\*\\w+\\*\\* \\(item\\)"
        match:extractField: "content.0.text"
        value: "match:regex:\\d+ items processed"
    stderr: "toBeEmpty"
```

## Best Practices

### ✅ **DO: Structure Your Tests**

#### **Organize by Functionality**
```yaml
description: "User Management API Tests"
tests:
  # Authentication tests
  - it: "should authenticate user"
  - it: "should reject invalid credentials"
  
  # User operations tests  
  - it: "should create new user"
  - it: "should list users"
  - it: "should update user profile"
  
  # Error handling tests
  - it: "should handle missing user ID"
  - it: "should validate user data"
```

#### **Use Descriptive Test Names**
```yaml
# ✅ Good - Clear and specific
- it: "should return correct number of items in sorted order"
- it: "should handle file read errors gracefully"
- it: "should validate email format correctly"

# ❌ Bad - Vague and unclear
- it: "should work"
- it: "test components"
- it: "error test"
```

### ✅ **DO: Use Appropriate Patterns**

```yaml
# ✅ Good - Specific pattern for validation
result:
  tools: "match:arrayLength:6"
  serverInfo: "match:type:object"
  version: "match:regex:\\d+\\.\\d+\\.\\d+"

# ❌ Bad - Too generic or incorrect
result:
  tools: "match:type:array"  # Doesn't validate count
  version: "match:type:string"  # Doesn't validate format
```

### ✅ **DO: Validate Both Success and Failure**

```yaml
# Test successful operation
- it: "should execute tool successfully"
  request:
    # ... valid request
  expect:
    response:
      result:
        isError: false
        content: "match:type:array"

# Test error conditions
- it: "should handle invalid parameters"
  request:
    # ... invalid request
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Invalid parameter"
```

### ❌ **DON'T: Common Mistakes**

#### **Avoid Duplicate Keys**
```yaml
# ❌ Wrong - Duplicate 'tools' key
result:
  tools: "match:arrayElements"
  tools:  # This overwrites the previous key
    - name: "string"

# ✅ Correct - Proper nesting
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
```

#### **Don't Use Overly Broad Patterns**
```yaml
# ❌ Too broad - matches anything
text: "match:regex:.*"

# ✅ Specific - validates expected format
text: "match:regex:Found \\d+ results in \\d+ms"
```

#### **Don't Ignore Error States**
```yaml
# ❌ Incomplete - doesn't validate error handling
- it: "should process data"
  # Only tests success case

# ✅ Complete - tests both success and failure
- it: "should process valid data"
  # ... success case
- it: "should reject invalid data" 
  # ... error case
```

## Troubleshooting

### Common Issues and Solutions

#### **Pattern Not Matching**

**Problem**: Test fails with "Pattern did not match"
```yaml
# Failing test
text: "match:regex:Result: \\d"
# Actual response: "Result: 42 items"
```

**Solution**: Update pattern to match actual format
```yaml
# Fixed pattern
text: "match:regex:Result: \\d+ items"
```

#### **Array Length Mismatch**

**Problem**: Expected array length doesn't match
```yaml
# Expected 5 but got 7
tools: "match:arrayLength:5"
```

**Solution**: Check actual response and update expectation
```bash
# Debug by examining actual response
conductor debug.test.mcp.yml --verbose
```

#### **Field Extraction Issues**

**Problem**: Field extraction returns empty or wrong data
```yaml
# Not finding the right path
match:extractField: "data.items.name"
```

**Solution**: Use correct JSON path notation
```yaml
# Correct path for array elements
match:extractField: "data.items.*.name"
```

#### **Regex Escaping**

**Problem**: Regex not matching due to escaping issues
```yaml
# Common escaping mistakes
text: "match:regex:\d+"        # Missing double backslash
text: "match:regex:Hello (.*)" # Parentheses not escaped
```

**Solution**: Proper regex escaping in YAML
```yaml
text: "match:regex:\\d+"           # Numbers
text: "match:regex:Hello \\(.*\\)" # Escaped parentheses  
text: "match:regex:\\$\\d+\\.\\d+" # Dollar amounts: $15.99
```

### Debugging Tests

#### **Enable Debugging and Verbose Output**
```bash
# Verbose output with test hierarchy
conductor tests.yml --config config.json --verbose

# Debug mode with detailed MCP communication
conductor tests.yml --config config.json --debug

# Performance analysis with timing
conductor tests.yml --config config.json --timing

# JSON output for automation/CI
conductor tests.yml --config config.json --json

# Minimal output for scripts
conductor tests.yml --config config.json --quiet

# Combine multiple debugging options
conductor tests.yml --config config.json --verbose --debug --timing
```

#### **Check Server Logs**
```bash
# Server stderr will be shown in test output
# Look for startup messages and errors
```

#### **Validate JSON Structure**
```bash
# Test your server manually
echo '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}' | node server.js
```

---

**Next Steps:**
- [**Pattern Matching Reference**]({{ '/pattern-matching.html' | relative_url }}) - Complete pattern guide
- [**Programmatic Testing**]({{ '/programmatic-testing.html' | relative_url }}) - JavaScript/TypeScript API
- [**Examples**]({{ '/examples.html' | relative_url }}) - Real-world test suites
