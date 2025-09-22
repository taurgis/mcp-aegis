# MCP Aegis - YAML Testing Guide for AI Agents

**Target**: AI assistants generating declarative YAML test files for Model Context Protocol servers.

**Core Purpose**: Test MCP servers with human-readable YAML files using 35+ advanced pattern matching capabilities including string patterns, numeric comparisons, date validation, array operations, field extraction, cross-field validation, and pattern negation.

## 🆕 What's New: Pipe-Separated Parameter Format

MCP Aegis now supports a **CLI-friendly pipe-separated parameter format** alongside traditional JSON for the `aegis query` command:

```bash
# 🆕 New pipe format (recommended for CLI)
aegis query calculator 'operation:add|a:5|b:3' --config "config.json"

# Traditional JSON format (still fully supported)
aegis query calculator '{"operation": "add", "a": 5, "b": 3}' --config "config.json"
```

**Key Benefits:**
- ✅ **No shell escaping** - no more complex quote handling
- ✅ **Readable syntax** - `key:value|other:123` vs `'{"key":"value","other":123}'`
- ✅ **Type inference** - automatically converts `num:42`, `bool:true`, `nil:null`
- ✅ **Nested objects** - use dot notation: `config.host:localhost|config.port:8080`
- ✅ **Mixed formats** - combine pipe format with JSON values when needed
- ✅ **Backward compatible** - all existing JSON workflows continue to work

## Quick Setup & Usage

### 1. Required Configuration (`*.config.json`)
```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./optional/directory",
  "env": {"CUSTOM_VAR": "value"},
  "startupTimeout": 5000,
  "readyPattern": "Server ready" // optional regex in stderr, preferably don't use
}
```

### Configuration Field Details
- **`name`** (required): Human-readable server name for test reports
- **`command`** (required): Executable command (`node`, `python`, `./binary`)
- **`args`** (required): Array of arguments passed to command
- **`cwd`** (optional): Working directory for server execution  
- **`env`** (optional): Environment variables for server process
- **`startupTimeout`** (optional): Max milliseconds to wait for startup (default: 10000)
- **`readyPattern`** (optional): Regex pattern in stderr indicating server is ready

### Common Server Configurations

#### Node.js MCP Server
```json
{
  "name": "Node.js MCP Server",
  "command": "node",
  "args": ["./dist/index.js"],
  "cwd": "./server",
  "startupTimeout": 5000,
  "readyPattern": "MCP server listening"
}
```

#### Python MCP Server  
```json
{
  "name": "Python MCP Server", 
  "command": "python",
  "args": ["-m", "my_mcp_server"],
  "cwd": "./python-server",
  "env": {
    "PYTHONPATH": "./src",
    "DEBUG": "true"
  },
  "startupTimeout": 8000,
  "readyPattern": "Server ready on stdio"
}
```

#### Development Server with Hot Reload
```json
{
  "name": "Development Server",
  "command": "npm",
  "args": ["run", "dev"],
  "cwd": "./mcp-server",
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "*"
  },
  "startupTimeout": 15000,
  "readyPattern": "Watching for file changes"
}
```

### 2. Basic Test Structure (`*.test.mcp.yml`)
```yaml
description: "Test suite description"
tests:
  - it: "Test description"
    request:
      jsonrpc: "2.0"
      id: "unique-id"
      method: "tools/list|tools/call"
      params: {}  # or tool call params
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-id"
        result: {}  # expected response
      stderr: "toBeEmpty"  # optional
```

### 3. Execute Tests
```bash
aegis "tests/**/*.test.mcp.yml" --config "config.json"
aegis "tests/*.yml" --config "config.json" --verbose

# Focus on specific tests during development
aegis "tests/**/*.yml" --config "config.json" --filter "tools"
aegis "tests/**/*.yml" --config "config.json" --filter "should validate" --errors-only
```

## 🆕 Interactive Query Command with Dual Parameter Formats

The `aegis query` command now supports **two parameter formats** for easier CLI testing:

### Pipe Format (New, CLI-Friendly)
```bash
# Simple parameters
aegis query read_file 'path:test.txt' --config "config.json"
aegis query calculator 'operation:add|a:5|b:3' --config "config.json"

# Nested objects with dot notation
aegis query api_client 'config.host:localhost|config.port:8080|timeout:30' --config "config.json"

# Method syntax with pipe format
aegis query --method tools/call --params 'name:read_file|arguments.path:test.txt' --config "config.json"
```

### JSON Format (Traditional, Still Supported)
```bash
# Complex nested structures
aegis query complex_tool '{"config": {"host": "localhost"}, "data": [1,2,3]}' --config "config.json"
aegis query --method tools/call --params '{"name": "tool", "arguments": {"key": "value"}}' --config "config.json"
```

**Benefits of Pipe Format:**
- ✅ No quote escaping needed in shell
- ✅ More readable for simple parameters  
- ✅ Supports nested objects via dot notation
- ✅ Auto-infers data types (strings, numbers, booleans, null)
- ✅ Can mix with JSON values when needed

## 30+ Pattern Matching Reference

### Core Patterns
```yaml
# 1. DEEP EQUALITY (default) - Exact match
result:
  tools: [{name: "read_file", description: "Reads a file"}]

# 2. TYPE VALIDATION
result:
  tools: "match:type:array"
  count: "match:type:number"
  name: "match:type:string"

# 3. STRING PATTERNS
result:
  text: "match:contains:substring"
  name: "match:startsWith:prefix"
  file: "match:endsWith:.txt"
  pattern: "match:regex:\\d{4}-\\d{2}-\\d{2}"  # YAML: escape backslashes
  
  # String length validation
  title: "match:stringLength:10"              # Exactly 10 characters
  description: "match:stringLengthGreaterThan:5"        # More than 5 chars
  summary: "match:stringLengthLessThan:100"             # Less than 100 chars
  content: "match:stringLengthBetween:10:200"           # Between 10-200 chars
  message: "match:stringLengthGreaterThanOrEqual:1"     # At least 1 char
  note: "match:stringLengthLessThanOrEqual:50"          # At most 50 chars
  error: "match:stringEmpty"                            # Must be empty
  text: "match:stringNotEmpty"                          # Must not be empty

# 4. ARRAY PATTERNS
result:
  tools: "match:arrayLength:3"
  data: "match:arrayContains:value"
  tools: "match:arrayContains:name:read_file"  # Object field matching
  tools:
    match:arrayElements:  # All elements must match
      name: "match:type:string"
      description: "match:contains:tool"

# 5. FIELD EXTRACTION (dot notation)
result:
  match:extractField: "tools.*.name"  # Extract all tool names
  value: ["read_file", "write_file"]

# 6. NUMERIC COMPARISONS
result:
  count: "match:greaterThan:5"
  price: "match:lessThanOrEqual:100.50"
  amount: "match:greaterThanOrEqual:0"
  score: "match:between:0:100"
  range: "match:range:10:90"
  exact: "match:equals:42"
  not_equal: "match:notEquals:0"
  approximate: "match:approximately:3.14159:0.001"  # tolerance
  decimal: "match:decimalPlaces:2"  # exactly 2 decimal places
  multiple: "match:multipleOf:5"  # divisible by 5
  divisible: "match:divisibleBy:3"  # same as multipleOf

# 7. DATE/TIMESTAMP PATTERNS
result:
  createdAt: "match:dateValid"
  publishDate: "match:dateAfter:2023-01-01"
  expireDate: "match:dateBefore:2025-01-01"
  eventDate: "match:dateBetween:2023-01-01:2024-12-31"
  lastUpdate: "match:dateAge:1d"  # within last day
  fixedEvent: "match:dateEquals:2023-06-15T14:30:00.000Z"

# 8. CROSS-FIELD VALIDATION
result:
  "match:crossField": "price > minPrice"  # Field comparison
  "match:crossField": "endDate >= startDate"
  "match:crossField": "quantity <= maxQuantity"
  "match:crossField": "currentParticipants <= maxParticipants"

# 9. PATTERN NEGATION (prefix any pattern with "not:")
result:
  tools: "match:not:arrayLength:0"  # NOT empty
  text: "match:not:contains:error"  # NOT containing error
  status: "match:not:startsWith:invalid"  # NOT invalid

# 10. PARTIAL MATCHING
result:
  match:partial:  # Only check specified fields
    tools:
      - name: "read_file"
        description: "match:contains:Reads"

# 11. COMBINED PATTERNS - arrayElements + partial (POWERFUL!)
result:
  tools:
    match:arrayElements:  # Apply to ALL array elements
      match:partial:      # But only validate specified fields
        name: "match:regex:^[a-z_]+$"
        description: "match:contains:tool"
        # Ignores any other fields like inputSchema, etc.
```

### Advanced Patterns
```yaml
# NESTED EXTRACTION with wildcards
result:
  match:extractField: "tools.*.inputSchema.properties.*.type"
  value: ["string", "number", "object"]

# CASE INSENSITIVE matching
result:
  name: "match:equalsIgnoreCase:Hello World"
  text: "match:containsIgnoreCase:ERROR"

# ADVANCED NUMERIC PATTERNS
result:
  value: "match:multipleOf:5"        # Must be divisible by 5
  count: "match:divisibleBy:3"       # Same as multipleOf
  percentage: "match:range:0:100"    # Between 0 and 100 inclusive
  score: "match:between:60:90"       # Between 60 and 90 (exclusive)
  exact: "match:notEquals:0"         # Must not equal 0
  precision: "match:decimalPlaces:2" # Exactly 2 decimal places

# COMPLEX REGEX (escape backslashes in YAML)
result:
  email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
  multiline: "match:regex:[\\s\\S]*pattern[\\s\\S]*across[\\s\\S]*lines"

# BRACKET NOTATION for special keys
result:
  match:extractField: "data['special-key'].values.*"
  value: "match:arrayContains:expectedValue"

# DATE FORMAT VALIDATION
result:
  isoDate: "match:dateFormat:iso"        # ISO 8601 format
  dateOnly: "match:dateFormat:iso-date"  # YYYY-MM-DD format  
  timeOnly: "match:dateFormat:iso-time"  # HH:MM:SS format
  usDate: "match:dateFormat:us-date"     # MM/DD/YYYY format
  timestamp: "match:dateFormat:timestamp" # Unix timestamp
```

## Critical YAML Syntax Rules

### ❌ AVOID - Common Errors
```yaml
# WRONG - Duplicate YAML keys (overwrites previous)
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # OVERWRITES above line!

# WRONG - Invalid escaping in regex
result:
  text: "match:regex:\d+"  # Missing double backslash

# WRONG - Mixing patterns in same object
result:
  tools: "match:arrayLength:1"
  match:extractField: "tools.*.name"  # Can't mix in same object
```

### ✅ CORRECT - Best Practices
```yaml
# CORRECT - Separate pattern validations into different tests
- it: "should have exactly one tool"
  expect:
    response:
      result:
        tools: "match:arrayLength:1"

- it: "should extract correct tool name"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: ["read_file"]

# CORRECT - Proper regex escaping in YAML
result:
  text: "match:regex:\\d{4}-\\d{2}-\\d{2}"  # Double backslashes

# CORRECT - Array elements structure
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:contains:tool"
```

## Real-World Examples

### Tool Discovery Test
```yaml
- it: "should list available tools with correct structure"
  request:
    jsonrpc: "2.0"
    id: "list-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "list-1"
      result:
        tools:
          match:arrayElements:
            name: "match:regex:^[a-z][a-z0-9_]*$"  # snake_case
            description: "match:regex:.{10,}"      # min 10 chars
            inputSchema: "match:type:object"
```

### Tool Discovery Test (Flexible - Recommended)
```yaml
- it: "should validate tool naming and descriptions flexibly"
  request:
    jsonrpc: "2.0"
    id: "list-flexible"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "list-flexible"
      result:
        tools:
          match:arrayElements:
            match:partial:  # Only validate what matters, ignore extra fields
              name: "match:regex:^[a-z][a-z0-9_]*$"  
              description: "match:regex:.{10,}"
```

### Tool Execution Test
```yaml
- it: "should execute tool successfully"
  request:
    jsonrpc: "2.0"
    id: "exec-1" 
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "test.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "exec-1"
      result:
        content:
          - type: "text"
            text: "match:contains:expected content"
        isError: false
    stderr: "toBeEmpty"
```

### Error Handling Test
```yaml
- it: "should handle invalid file gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "nonexistent.txt"
  expect:
    response:
      jsonrpc: "2.0" 
      id: "error-1"
      result:
        content:
          - type: "text"
            text: "match:contains:not found"
        isError: true
```

## CLI Commands

```bash
# Basic testing
aegis "tests/**/*.test.mcp.yml" --config "config.json"

# Debug modes
aegis "tests/*.yml" --config "config.json" --verbose   # Test hierarchy
aegis "tests/*.yml" --config "config.json" --debug     # MCP communication
aegis "tests/*.yml" --config "config.json" --timing    # Performance metrics
aegis "tests/*.yml" --config "config.json" --json      # JSON output
aegis "tests/*.yml" --config "config.json" --quiet     # Minimal output

# Error analysis and debugging
aegis "tests/*.yml" --config "config.json" --errors-only     # Only show errors
aegis "tests/*.yml" --config "config.json" --syntax-only     # Only syntax errors
aegis "tests/*.yml" --config "config.json" --no-analysis     # Disable detailed analysis  
aegis "tests/*.yml" --config "config.json" --group-errors    # Group by type
aegis "tests/*.yml" --config "config.json" --max-errors 5    # Limit error output

# Test filtering (focus on specific tests or suites)
aegis "tests/*.yml" --config "config.json" --filter "tools"           # Filter by suite/test name
aegis "tests/*.yml" --config "config.json" --filter "should validate" # Filter by test description
aegis "tests/*.yml" --config "config.json" --filter "/tools|file/"    # Regex patterns
aegis "tests/*.yml" --config "config.json" --filter "Error.*Suite"    # Suite description patterns

# Interactive tool testing
aegis query --config "config.json"                                      # List tools
aegis query tool_name 'param1:value1|param2:value2' --config "config.json"  # Test tool (pipe format)
aegis query tool_name '{"param": "value"}' --config "config.json"      # Test tool (JSON format)

# New method syntax with pipe format (recommended)
aegis query --method tools/call --params 'name:tool_name|arguments.key:value' --config "config.json"

# Performance testing and analysis
aegis "tests/*.yml" --config "config.json" --timing          # Show response times
aegis "tests/*.yml" --config "config.json" --debug --timing  # Full performance debug

# Combined debugging options
aegis "tests/*.yml" --config "config.json" --verbose --debug --timing

# Project initialization  
aegis init                                                    # Create sample config and tests
```

## Pattern Selection Guide

- **Deep Equality**: Exact value matching (default)
- **Type Validation**: Verify data types (`match:type:`)  
- **String Patterns**: Text validation (`contains`, `startsWith`, `endsWith`, `regex`, `stringLength`, `stringEmpty`)
- **Array Patterns**: Array validation (`arrayLength`, `arrayContains`, `arrayElements`)
- **Field Extraction**: Extract nested values (`match:extractField`)
- **Numeric**: Math comparisons (`greaterThan`, `approximately`, `decimalPlaces`)
- **Date/Time**: Date validation (`dateValid`, `dateAfter`, `dateAge`)
- **Cross-Field**: Compare fields (`match:crossField`)
- **Negation**: Exclude patterns (`match:not:*`)
- **Partial**: Subset validation (`match:partial`)
- **🔥 Combined arrayElements + partial**: Validate specific fields across ALL array elements while ignoring others - extremely powerful for flexible schema validation!
- **⚡ Performance Testing**: Response time validation (`performance.maxResponseTime`) - validate SLA compliance

## Advanced Pattern Combinations

### Multi-Step Validation (Separate Tests)
```yaml
# Test 1: Basic structure validation
- it: "should return array of tools"
  expect:
    response:
      result:
        tools: "match:type:array"

# Test 2: Array length validation  
- it: "should have expected number of tools"
  expect:
    response:
      result:
        tools: "match:arrayLength:3"

# Test 3: Extract and validate specific field
- it: "should have correct tool names"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: ["read_file", "write_file", "list_files"]
```

### Comprehensive Tool Validation
```yaml
- it: "should validate complete tool structure"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:regex:^[a-z][a-z0-9_]*$"       # snake_case names
            description: "match:regex:.{10,200}"         # 10-200 chars
            inputSchema:
              type: "object"
              properties: "match:type:object"
              required: "match:type:array"
```

### Flexible Tool Validation (Best Practice)
```yaml
- it: "should validate tools with flexible schema handling"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            match:partial:  # 🔥 RECOMMENDED: Combines power with flexibility
              name: "match:regex:^[a-z][a-z0-9_]*$"     # snake_case names
              description: "match:regex:.{10,200}"       # 10-200 chars
              inputSchema:
                type: "object"
                properties: "match:type:object"
                # Don't require 'required' field - some tools may not have required params
```

### Error Response Validation
```yaml
- it: "should return structured error for invalid input"
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:regex:(Error|Failed|Invalid).*"
        metadata: "match:type:object"
```

### Performance and Timing Validation
```yaml
- it: "should complete operation within time limit"
  expect:
    response:
      result:
        match:partial:
          duration: "match:lessThan:1000"        # Under 1 second
          timestamp: "match:dateValid"           # Valid timestamp
          status: "completed"                    # Exact match
```

**Examples**: [filesystem-server/](../../examples/filesystem-server/), [multi-tool-server/](../../examples/multi-tool-server/), [api-testing-server/](../../examples/api-testing-server/)

## MCP Protocol Basics

### Standard JSON-RPC 2.0 Methods

#### Initialize Request (Required for handshake)
```yaml
request:
  jsonrpc: "2.0"
  id: "init-1"
  method: "initialize"  
  params:
    protocolVersion: "2025-06-18"
    capabilities: {"tools": {}}
    clientInfo: {"name": "MCP Aegis", "version": "1.0.0"}
```

#### Tools List Request  
```yaml
request:
  jsonrpc: "2.0"
  id: "list-1"
  method: "tools/list"
  params: {}
```

#### Tool Call Request
```yaml
request:
  jsonrpc: "2.0"
  id: "call-1"
  method: "tools/call"
  params:
    name: "tool_name"
    arguments:
      key: "value"
```

### Standard Response Structure
```yaml
expect:
  response:
    jsonrpc: "2.0"
    id: "matching-request-id"
    result:           # For successful responses
      # Response data
    # OR for errors:
    error:
      code: -32601    # Standard JSON-RPC error codes
      message: "Method not found"
  stderr: "toBeEmpty"  # Optional stderr validation
```

## Common Troubleshooting Patterns

### Error Handling Tests
```yaml
# Test tool with invalid arguments
- it: "should handle invalid arguments gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "nonexistent.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "error-1"
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:not found"

# Test with missing required parameters  
- it: "should reject missing required parameters"
  request:
    jsonrpc: "2.0"
    id: "missing-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments: {}  # Missing required 'path'
  expect:
    response:
      jsonrpc: "2.0"
      id: "missing-1"
      error:
        code: "match:type:number"
        message: "match:contains:required"
```

### Performance Testing Patterns
```yaml
# Test response time validation with timing assertions
- it: "should respond within reasonable time"
  request:
    jsonrpc: "2.0"
    id: "perf-1"  
    method: "tools/call"
    params:
      name: "large_operation"
      arguments: {"size": 1000}
  expect:
    response:
      jsonrpc: "2.0"
      id: "perf-1"
      result:
        match:partial:
          status: "completed"
          data: "match:type:object"
    performance:
      maxResponseTime: "2000ms"          # 🔥 Built-in timing assertion
    stderr: "toBeEmpty"
        # Use --timing CLI flag to see actual execution times
```

## 🚀 Performance Testing with Timing Assertions

MCP Aegis provides built-in performance testing capabilities to validate response times and ensure SLA compliance.

### Basic Performance Structure
```yaml
- it: "should meet performance requirements"
  request:
    jsonrpc: "2.0"
    id: "perf-test"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "perf-test"
      result:
        tools: "match:type:array"
    performance:
      maxResponseTime: "500ms"  # Must respond within 500ms
    stderr: "toBeEmpty"
```

### Performance Patterns by Operation Type

#### Tool Listing Performance (Metadata - Should be Fast)
```yaml
- it: "should list tools quickly"
  request:
    jsonrpc: "2.0"
    id: "list-perf-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools: "match:arrayLength:3"
    performance:
      maxResponseTime: "300ms"  # Very fast for metadata operations
    stderr: "toBeEmpty"
```

#### Simple File Operations
```yaml
- it: "should read small file quickly"
  request:
    jsonrpc: "2.0"
    id: "file-perf-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "./data/small.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:expected"
        isError: false
    performance:
      maxResponseTime: "1000ms"  # Standard file operations
    stderr: "toBeEmpty"
```

#### Complex Operations
```yaml
- it: "should handle complex processing efficiently"
  request:
    jsonrpc: "2.0"
    id: "complex-perf-1"
    method: "tools/call"
    params:
      name: "search_database"
      arguments:
        query: "complex search"
        limit: 100
  expect:
    response:
      result:
        match:partial:
          results: "match:type:array"
          count: "match:type:number"
    performance:
      maxResponseTime: "2000ms"  # More time for complex operations
    stderr: "toBeEmpty"
```

#### Error Handling Performance (Should be Fast)
```yaml
- it: "should handle errors quickly"
  request:
    jsonrpc: "2.0"
    id: "error-perf-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "./nonexistent.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:not found"
        isError: true
    performance:
      maxResponseTime: "800ms"  # Errors should be faster than successful ops
    stderr: "toBeEmpty"
```

### Timing Formats (Multiple Supported)

| Format | Description | Use Case |
|--------|-------------|----------|
| `"100ms"` | Very strict | Critical performance paths |
| `"500ms"` | Fast operations | Tool listing, metadata |
| `"1000ms"` | Standard operations | File I/O, simple processing |
| `"2000ms"` | Complex operations | Search, computation, API calls |
| `"5000ms"` | Heavy operations | Database queries, large files |
| `1500` | Numeric (ms) | Alternative format |
| `"2.5s"` | Decimal seconds | Long operations |

### SLA Validation Examples
```yaml
description: "SLA validation for production MCP server"
tests:
  # 95th percentile requirement: Tool listing under 200ms
  - it: "should meet tool listing SLA"
    request:
      jsonrpc: "2.0"
      id: "sla-list-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools: "match:type:array"
      performance:
        maxResponseTime: "200ms"  # Strict SLA requirement
      stderr: "toBeEmpty"

  # 99th percentile requirement: Tool execution under 2 seconds
  - it: "should meet tool execution SLA"
    request:
      jsonrpc: "2.0"
      id: "sla-exec-1"
      method: "tools/call"
      params:
        name: "get_user_profile"
        arguments:
          user_id: "test-user-123"
    expect:
      response:
        result:
          match:partial:
            user: "match:type:object"
            profile: "match:type:object"
      performance:
        maxResponseTime: "2000ms"  # SLA compliance
      stderr: "toBeEmpty"
```

### Performance + Pattern Matching (Powerful Combination)
```yaml
- it: "should search with good performance and validate structure"
  request:
    jsonrpc: "2.0"
    id: "complex-perf-1"
    method: "tools/call"
    params:
      name: "search_tools"
      arguments:
        category: "documentation"
  expect:
    response:
      result:
        # Full pattern validation
        tools:
          match:arrayElements:
            match:partial:
              name: "match:regex:^[a-z][a-z0-9_]*$"
              description: "match:regex:.{10,}"
        count: "match:type:number"
        # Field extraction validation
        match:extractField: "tools.*.name"
        value: "match:arrayContains:search_docs"
    performance:
      maxResponseTime: "1500ms"  # Performance requirement
    stderr: "toBeEmpty"
```

### Debugging Performance Issues
```bash
# See actual timing for each test
aegis "tests/*.yml" --config "config.json" --timing

# Combined debugging for performance analysis
aegis "tests/*.yml" --config "config.json" --debug --timing --verbose

# Focus only on performance-related errors
aegis "tests/*.yml" --config "config.json" --errors-only --timing
```

### Performance Best Practices
- **Tool Listing**: 200-500ms (metadata operations should be fast)
- **Simple File Ops**: 1000ms (reading small files, basic I/O)
- **Complex Operations**: 2000ms (search, computation, API calls)
- **Error Responses**: Often faster than successful operations (800ms)
- **Heavy Operations**: 5000ms (database queries, large file processing)

**Always use `--timing` flag** to see actual response times and adjust expectations based on your environment.

## Debugging and Troubleshooting

### Quick Debugging Workflow
1. **Start with `--debug`**: See MCP communication flow
2. **Use `--verbose`**: View test hierarchy and details  
3. **Try `aegis query`**: Test individual tools interactively
4. **Check `--syntax-only`**: Isolate YAML syntax issues
5. **Use `--errors-only`**: Focus on failures

### Test Filtering and Focus
Use the `--filter` option to focus on specific tests or test suites during development:

```bash
# Filter by suite description (case-insensitive substring match)
aegis "tests/**/*.yml" --config "config.json" --filter "Tools validation"
aegis "tests/**/*.yml" --config "config.json" --filter "file operations" 

# Filter by individual test names
aegis "tests/**/*.yml" --config "config.json" --filter "should list tools"
aegis "tests/**/*.yml" --config "config.json" --filter "should handle errors"

# Use regex patterns for advanced filtering
aegis "tests/**/*.yml" --config "config.json" --filter "/should (read|write|validate)/"
aegis "tests/**/*.yml" --config "config.json" --filter "/^Error.*Suite$/"

# Combine with other debugging options
aegis "tests/**/*.yml" --config "config.json" --filter "tools" --errors-only
aegis "tests/**/*.yml" --config "config.json" --filter "/validation/" --verbose
```

**Filter Behavior:**
- **Suite Description Match**: If the pattern matches a test suite's `description`, ALL tests from that suite are included
- **Individual Test Match**: If the pattern matches a test's `it` field, only that specific test is included
- **Case Insensitive**: String patterns are case-insensitive by default
- **Regex Support**: Patterns starting and ending with `/` are treated as regex with optional flags (e.g., `/pattern/i`)
- **Special Characters**: Non-regex patterns automatically escape special regex characters

**Common Filter Patterns:**
```bash
# Development workflows
--filter "tools"           # All tool-related tests
--filter "error"           # All error handling tests  
--filter "validation"      # All validation tests
--filter "/should (list|get|validate)/"  # Multiple test types

# Debugging specific issues
--filter "arrayLength"     # Focus on array validation
--filter "pattern"         # Focus on pattern matching
--filter "/fail/"          # Tests expected to fail
```

### Common Issues and Solutions

#### Server Won't Start
```bash
# Debug server startup issues
aegis "test.yml" --config "config.json" --debug

# Check stderr output for server errors
# Increase startupTimeout if server is slow
# Verify command/args in config are correct
```

#### Test Pattern Not Matching
```yaml
# Use --debug to see actual response structure
# Check YAML syntax (no duplicate keys!)
# Start with simple deep equality, then add patterns
# Verify field paths with match:extractField

# Example: Debug actual vs expected
- it: "debug actual response structure"
  expect:
    response:
      result: "match:type:object"  # Start simple
```

#### Regex Patterns Failing
```yaml
# YAML requires double escaping backslashes
text: "match:regex:\\d+"        # ✅ Correct  
text: "match:regex:\d+"         # ❌ Wrong

# Test regex patterns incrementally
email: "match:regex:[a-zA-Z]+"  # Start simple
email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"  # Full pattern
```

### Regex Escaping & YAML Parse Failures
**Symptoms:** `unknown escape sequence` or `bad indentation of a mapping entry` during aegis run.
**Common Causes:**
- Unescaped backslashes in `match:regex:` patterns.
- Mixing quotes and unescaped `"` inside double-quoted YAML strings.
- Overly complex grouped repetitions like `(\"filename\"...){5,}` causing readability + escape errors.

**Safe Regex Template:**
```yaml
text: "match:regex:(?:pattern)[\\s\\S]*?(?:another)"
```
**Key Tips:**
- Use `\s\S` instead of `.` when spanning multiple lines.
- Keep repetition simple; if counting occurrences becomes hard, split into two tests (presence + broad repetition).

### 3. Counting Occurrences in Large JSON Embedded as Text
When the tool returns a single large JSON array string inside a `content[0].text` field:
- You cannot parse JSON directly via patterns—treat it as text.
- Use a minimal structural regex for presence, and a separate regex for repetition.

**Example (At least 3 product models):**
```yaml
text: "match:regex:(?:product-)[\\s\\S]*(?:product-)[\\s\\S]*(?:product-)"
```
**Example (5+ filenames):**
```yaml
text: "match:regex:(?:\\"filename\\"[\\s\\S]*?\\.md){5,}"
```

### 4. Layering match:arrayElements with match:partial
**Correct Structure:**
```yaml
content:
  match:arrayElements:
    match:partial:
      type: "text"
      text: "match:contains:querystring"
```
**Incorrect:** Placing `text:` at wrong indentation level under `content:` directly.

### 5. Progressive Regex Strategy
1. Start with a trivial presence regex: `match:regex:querystring`.
2. Expand to multi-token ordering: `match:regex:[\\s\\S]*querystring[\\s\\S]*server`.
3. Only then add complex repetitions if needed.

### 6. Avoid Over-Fitting
Do NOT anchor entire gigantic JSON arrays unless strictly required. Prefer token presence + repetition rather than full structural exactness.

### 7. Performance Tightening Safely
- Begin with a generous threshold (e.g. `800ms`).
- Add a second stricter test (e.g. `600ms`) only after confirming stability locally.
- Avoid thresholds <300ms for docs or search operations in CI without strong evidence.

### 8. Negative Path Testing for Transport vs Tool Logic
To test JSON-RPC method failure (transport layer): use an invalid `method` like `tools/call_WRONG`.
To test tool argument validation: keep `method: tools/call` but pass malformed `arguments`.

### 9. When To Split Tests
Split into separate tests if you need to validate:
- Field extraction + structural regex.
- Performance + functional correctness.
- Repetition counting + semantic token presence.

#### Array Pattern Issues
```yaml
# ❌ Duplicate YAML keys (overwrites previous)
result:
  tools: "match:arrayLength:1"
  tools: ["exact_tool"]  # OVERWRITES above!

# ✅ Separate into different tests
- it: "should have one tool"
  expect:
    response:
      result:
        tools: "match:arrayLength:1"

- it: "should have specific tool"  
  expect:
    response:
      result:
        tools: [{"name": "expected_tool"}]

# ❌ Rigid arrayElements that break with schema changes
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      # If server adds new fields, this breaks!

# ✅ Flexible arrayElements with partial matching
result:
  tools:
    match:arrayElements:
      match:partial:  # 🔥 Only validate what you care about
        name: "match:type:string"
        description: "match:type:string"
        # Ignores any new fields the server might add
```

### Interactive Tool Testing
```bash
# List all available tools
aegis query --config "config.json"

# Test specific tool with arguments - Multiple formats supported:

# JSON format (traditional)
aegis query read_file '{"path": "test.txt"}' --config "config.json"

# Pipe format (new, preferred for CLI) 
aegis query read_file 'path:test.txt' --config "config.json"
aegis query calculator 'operation:add|a:5|b:3' --config "config.json"

# Complex nested parameters with pipe format
aegis query process_data 'config.host:localhost|config.port:8080|active:true' --config "config.json"

# Method syntax with both formats
aegis query --method tools/call --params '{"name": "read_file", "arguments": {"path": "test.txt"}}' --config "config.json"
aegis query --method tools/call --params 'name:read_file|arguments.path:test.txt' --config "config.json"

# Debug with verbose output
aegis query read_file 'path:test.txt|encoding:utf8' --config "config.json" --verbose

# Advanced pipe format features:
# - Mixed data types: 'text:hello|num:42|bool:true|nil:null'
# - JSON values in pipe format: 'config:{"key":"value"}|items:[1,2,3]'
# - Escaped pipes: 'message:hello\\|world|other:value'
```

### Parameter Format Guide

MCP Aegis supports two parameter formats for the `query` command:

#### 🆕 Pipe Format (Recommended for CLI)
```bash
# Basic usage: key:value separated by pipes
aegis query tool_name 'param1:value1|param2:value2' --config "config.json"

# Data type inference (automatic)
aegis query calculator 'operation:add|a:5|b:3|precise:true' --config "config.json"
# Results in: {"operation": "add", "a": 5, "b": 3, "precise": true}

# Nested objects using dot notation
aegis query server_config 'database.host:localhost|database.port:5432|cache.enabled:true' --config "config.json"
# Results in: {"database": {"host": "localhost", "port": 5432}, "cache": {"enabled": true}}

# JSON values within pipe format
aegis query complex_tool 'metadata:{"version":"1.0"}|tags:["test","demo"]|count:5' --config "config.json"

# Escaped pipes for literal pipe characters
aegis query text_processor 'message:hello\\|world|separator:|' --config "config.json"
```

#### JSON Format (Traditional)
```bash
# Still fully supported for complex nested structures
aegis query complex_tool '{"metadata": {"version": "1.0"}, "tags": ["test", "demo"]}' --config "config.json"
```

#### Format Comparison
| Feature | Pipe Format | JSON Format |
|---------|-------------|-------------|
| **CLI Friendly** | ✅ No quote escaping | ❌ Requires quote escaping |
| **Simple Parameters** | ✅ `key:value\|other:123` | ❌ `'{"key":"value","other":123}'` |
| **Nested Objects** | ✅ `obj.field:value` | ✅ `'{"obj":{"field":"value"}}'` |
| **Data Types** | ✅ Auto-inferred | ✅ Explicit |
| **Complex Structures** | ✅ Mixed JSON/pipe | ✅ Full JSON power |

### Performance Debugging
```bash
# See timing for each operation
aegis "tests/*.yml" --config "config.json" --timing

# Combined debugging for comprehensive analysis
aegis "tests/*.yml" --config "config.json" --debug --timing --verbose
```

## 🆕 Pipe Format Quick Reference

### Basic Syntax
```bash
# Simple parameters
'key:value|other:123|active:true'

# Nested objects with dot notation  
'config.host:localhost|config.port:8080|config.ssl:true'

# Mixed data types (auto-inferred)
'text:hello|count:42|enabled:true|data:null|score:3.14'

# JSON values within pipe format
'simple:value|complex:{"nested":"object"}|list:[1,2,3]'

# Escaped pipes for literal pipes
'message:hello\\|world|separator:value'
```

### Common Patterns
```bash
# File operations
aegis query read_file 'path:/tmp/test.txt|encoding:utf8' --config "config.json"

# API calls
aegis query api_request 'url:https://api.example.com|method:GET|timeout:30' --config "config.json"

# Complex configurations
aegis query service_config 'database.host:localhost|database.port:5432|cache.enabled:true|cache.ttl:300' --config "config.json"

# Method syntax with pipe format
aegis query --method tools/call --params 'name:calculator|arguments.operation:add|arguments.a:5|arguments.b:3' --config "config.json"
```

## Quick Pattern Reference

### All Available Patterns (35+)
```yaml
# STRING PATTERNS
"match:contains:substring"
"match:startsWith:prefix"  
"match:endsWith:suffix"
"match:containsIgnoreCase:TEXT"
"match:equalsIgnoreCase:value"
"match:regex:pattern"
"match:stringLength:10"
"match:stringLengthGreaterThan:5"
"match:stringLengthLessThan:100"
"match:stringLengthGreaterThanOrEqual:1"
"match:stringLengthLessThanOrEqual:50"
"match:stringLengthBetween:10:200"
"match:stringEmpty"
"match:stringNotEmpty"

# TYPE PATTERNS  
"match:type:string|number|boolean|object|array"
"match:exists"
"match:length:5"
"match:count:3"

# NUMERIC PATTERNS
"match:greaterThan:10"
"match:greaterThanOrEqual:5"
"match:lessThan:100" 
"match:lessThanOrEqual:50"
"match:between:10:90"
"match:range:0:100"
"match:equals:42"
"match:notEquals:0"
"match:approximately:3.14:0.01"
"match:multipleOf:5"
"match:divisibleBy:3"
"match:decimalPlaces:2"

# ARRAY PATTERNS
"match:arrayLength:3"
"match:arrayContains:value"
"match:arrayContains:field:value"
match:arrayElements:
  field: "match:type:string"

# DATE PATTERNS
"match:dateValid"
"match:dateAfter:2023-01-01"
"match:dateBefore:2025-01-01"
"match:dateBetween:2023-01-01:2024-12-31"
"match:dateAge:1d"
"match:dateEquals:2023-06-15T14:30:00.000Z"
"match:dateFormat:iso|iso-date|iso-time|us-date|timestamp"

# ADVANCED PATTERNS
"match:crossField": "field1 > field2"
"match:not:pattern"  # Negate any pattern
match:extractField: "path.*.field"
match:partial:       # Check subset of fields
match:arrayElements: # Validate ALL array elements
  match:partial:     # 🔥 POWERFUL COMBO: Validate specific fields in all elements
    field: "pattern"
```

### Installation & Getting Started
```bash
npm install -g mcp-aegis
aegis init                    # Create sample config and tests
aegis "tests/*.yml" --config "config.json"
```
