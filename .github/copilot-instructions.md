# MCP Conductor - Copilot Instructions

## Project Overview

**MCP Conductor** is a comprehensive Node.js testing library specifically designed for Model Context Protocol (MCP) servers. It provides declarative YAML-based testing with robust MCP protocol compliance, 25+ verified pattern matching capabilities (including partial matching, array validation, field extraction, type checking, numeric comparisons, date/timestamp validation, and pattern negation), and rich reporting capabilities.

## Core Persona
You are a senior Node.js developer specializing in Model Context Protocol (MCP) systems and testing frameworks. You are highly critical, detail-oriented, and demand the highest standards of code quality, maintainability, and performance.

## Project Architecture

### 📁 Directory Structure
```
mcp-conductor/
├── bin/conductor.js                 # CLI entrypoint
├── src/                            # Core library modules
│   ├── cli/                        # CLI interface system
│   │   ├── commands/               # Command handlers (init.js, test.js)
│   │   ├── interface/              # CLI components (options.js, output.js)
│   │   └── index.js               # CLI module exports
│   ├── test-engine/                # Test execution engine
│   │   ├── runner.js, executor.js, parser.js, reporter.js
│   │   └── matchers/               # Pattern matching subsystem
│   │       ├── patterns.js, equality.js, fields.js
│   ├── protocol/                   # MCP protocol components
│   │   └── handshake.js           # MCP handshake logic
│   ├── core/                       # Core engine modules (7 modules) 
│   │   ├── configParser.js, MCPCommunicator.js
│   │   ├── ConfigLoader.js, ConfigValidator.js
│   │   └── MessageHandler.js, ProcessManager.js, StreamBuffer.js
│   ├── programmatic/MCPClient.js   # Programmatic testing API
│   └── index.js                    # Main API exports
├── test/                           # 14 unit test files + fixtures/
├── examples/                       # 3 demo servers + shared-test-data/
├── docs-site-v2/                   # React-based documentation site
├── temp-testing/                   # Development workspace
└── .github/, .eslintignore, eslint.config.js, package.json, etc.
```

### 🏗️ Core Architecture Components

#### 1. **CLI Entrypoint** (`bin/conductor.js`)
- **Purpose**: Command-line interface with Commander.js integration
- **Responsibilities**: Argument parsing, config loading, test discovery, orchestration
- **Key Features**: Glob pattern support, exit code management, error handling
- **Usage**: `conductor "tests/**/*.test.mcp.yml" --config "config.json"` (after npm install -g)
- **CLI Options**: `--verbose`, `--debug`, `--timing`, `--json`, `--quiet` for enhanced debugging and output control

#### 2. **Configuration System** (`src/core/configParser.js`, `ConfigLoader.js`, `ConfigValidator.js`)
- **Purpose**: Comprehensive configuration management and validation
- **Architecture**: Modular design with separate loading, validation, and parsing components
- **Schema**: See [Configuration Files](#configuration-files) section for detailed structure

#### 3. **Test Engine** (`src/test-engine/parser.js`)
- **Purpose**: YAML test file parsing and validation
- **Features**: Glob pattern support, JSON-RPC 2.0 validation, schema compliance
- **Structure**: Validates test suites with `description`, `tests[]` arrays
- **Validation**: Ensures proper JSON-RPC message structure and MCP compliance

#### 4. **MCP Communication System** (`src/core/MCPCommunicator.js`, `MessageHandler.js`, `ProcessManager.js`, `StreamBuffer.js`)
- **Purpose**: Comprehensive low-level communication infrastructure
- **Protocol**: JSON-RPC 2.0 over stdio transport
- **Features**: Modular message handling, process lifecycle management, stream buffering
- **Components**:
  - **MCPCommunicator**: Main coordination and high-level interface
  - **MessageHandler**: JSON-RPC message validation and processing
  - **ProcessManager**: Child process lifecycle and monitoring
  - **StreamBuffer**: Stdio stream management and buffering
- **Lifecycle**: Server startup, handshake, communication, graceful shutdown
- **Error Handling**: Timeout management, stderr capture, process monitoring

#### 5. **Test Execution Engine** (`src/test-engine/`) 
- **Purpose**: Modular test execution engine following single responsibility principles  
- **Architecture**: Clean separation of concerns across focused modules:

##### **5a. Test Runner Orchestrator** (`src/test-engine/runner.js`) - 90 lines
- **Single Responsibility**: Test suite orchestration and server lifecycle management
- **Functions**: `runTests()`, server startup/shutdown, handshake coordination
- **Features**: Clean separation of concerns, error handling, graceful cleanup

##### **5b. Pattern Matcher** (`src/test-engine/matchers/patterns.js`) - 118 lines  
- **Single Responsibility**: Pattern matching logic for YAML test assertions
- **Functions**: `matchPattern()` with specialized handlers for each pattern type
- **Patterns**: regex, length, contains, startsWith, endsWith, arrayContains, type checking, etc.
- **Architecture**: Handler mapping pattern for easy extension

##### **5c. Equality Matcher** (`src/test-engine/matchers/equality.js`) - 228 lines
- **Single Responsibility**: Deep equality comparison with pattern support
- **Functions**: `deepEqual()`, `deepEqualPartial()`, object/array comparison
- **Features**: Special pattern objects, partial matching, array element matching
- **Integration**: Uses pattern matcher and field extractor for complex validations

##### **5d. Field Extractor** (`src/test-engine/matchers/fields.js`) - 58 lines
- **Single Responsibility**: Extract fields from nested objects using dot notation
- **Functions**: `extractFieldFromObject()`, wildcard array handling
- **Features**: Supports `tools.*.name`, numeric indices, deep object traversal

##### **5e. MCP Handshake Handler** (`src/protocol/handshake.js`) - 61 lines
- **Single Responsibility**: MCP protocol handshake operations
- **Functions**: `performMCPHandshake()`, initialize/initialized message handling
- **Protocol**: Clean MCP 2025-06-18 protocol implementation, error validation

##### **5f. Test Executor** (`src/test-engine/executor.js`) - 99 lines  
- **Single Responsibility**: Individual test execution and validation
- **Functions**: `executeTest()`, structured response/stderr validation
- **Features**: Clean validation result objects, comprehensive error reporting

#### 6. **Reporter** (`src/test-engine/reporter.js`)
- **Purpose**: Rich test result formatting and colored output with advanced debugging capabilities
- **Features**: Colored output, detailed diffs, summary statistics, timing tracking, debug logging, MCP communication logging, JSON output, performance metrics, quiet mode support
- **Output**: Pass/fail indicators, diff visualization, execution summaries, verbose test hierarchies, debug MCP communication, performance timings
- **Integration**: Works with jest-diff for rich comparison visualization, coordinates with test execution for comprehensive metrics
- **CLI Integration**: Supports `--verbose`, `--debug`, `--timing`, `--json`, and `--quiet` modes for different output requirements

#### 7. **CLI Interface System** (`src/cli/`)
- **Purpose**: Clean command-line interface with organized structure
- **Architecture**: Organized into logical subsystems:
  - **Commands** (`src/cli/commands/`): Command handlers (init.js, test.js, query.js)
  - **Interface** (`src/cli/interface/`): CLI components (options.js, output.js)
- **Features**: Argument parsing, validation, help system, error handling, proper option inheritance

#### 8. **Programmatic Testing API** (`src/programmatic/MCPClient.js`)
- **Purpose**: Node.js test runner friendly MCP client for JavaScript/TypeScript test integration
- **Features**: Promise-based API, lifecycle management, automatic handshake handling
- **Integration**: Works with Node.js test runner, Jest, Mocha, or any testing framework
- **Methods**: `connect()`, `disconnect()`, `listTools()`, `callTool()`, `sendMessage()`
- **Error Handling**: Proper exception propagation, stderr capture, timeout management
- **Lifecycle**: Automated server startup, MCP handshake, graceful shutdown

## Modular Architecture Principles

**Design Philosophy**: MCP Conductor follows SRP (Single Responsibility), KISS, and Dependency Inversion principles.

### **Module Responsibilities**
- **runner.js**: Main orchestrator (90 lines)
- **matchers/patterns.js**: Pattern matching (118 lines) 
- **matchers/equality.js**: Deep equality comparison (228 lines)
- **matchers/fields.js**: Object field extraction (58 lines)
- **protocol/handshake.js**: MCP protocol handshake (61 lines)
- **executor.js**: Individual test execution (99 lines)

### **Pattern Handler Architecture**
```javascript
const patternHandlers = {
  'regex:': handleRegexPattern, 'length:': handleLengthPattern,
  'arrayLength:': handleArrayLengthPattern, 'contains:': handleContainsPattern,
  'startsWith:': handleStartsWithPattern, 'endsWith:': handleEndsWithPattern,
  'arrayContains:': handleArrayContainsPattern, 'type:': handleTypePattern,
  'exists': handleExistsPattern, 'count:': handleCountPattern
};
```

**Refactoring**: 447-line monolithic file → 6 focused modules, 212/212 tests passing.

## Programmatic Testing

**MCPClient API**: Promise-based JavaScript/TypeScript integration for Jest, Mocha, Node.js test runner.

### **Core API** (`src/programmatic/MCPClient.js`)
```javascript
// Main entry points
const client = await createClient('./config.json');     // Create (not connected)
const connectedClient = await connect('./config.json'); // Create + auto-connect

// Core methods
await client.connect();                    // Start server + MCP handshake
await client.disconnect();                 // Graceful shutdown
const tools = await client.listTools();   // Get available tools
const result = await client.callTool(name, args); // Execute tool
const response = await client.sendMessage(jsonRpcMessage); // Raw message
client.getStderr(); client.clearStderr(); // Stderr management
```

### **Usage Patterns**
```javascript
// Node.js Test Runner
describe('MCP Tests', () => {
  let client;
  before(async () => { client = await connect('./config.json'); });
  after(async () => { await client?.disconnect(); });
  
  // CRITICAL: Always include beforeEach with buffer clearing to prevent test interference
  beforeEach(() => {
    client.clearAllBuffers(); // RECOMMENDED - Prevents all buffer leaking (stderr, stdout, state)
    // OR minimum: client.clearStderr(); // Prevents only stderr leaking
  });
  
  test('should validate tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools));
    assert.ok(tools.length > 0);
  });
});

// Error handling
try {
  await client.callTool('nonexistent_tool', {});
} catch (error) {
  assert.ok(error.message.includes('Failed to call tool'));
}
```

### **Critical: Preventing Test Interference**
**🚨 MOST COMMON ISSUE**: Buffer leaking between tests causes flaky test failures. Always include `beforeEach()` with buffer clearing:

```javascript
beforeEach(() => {
  client.clearStderr(); // REQUIRED - Prevents stderr leaking between tests
  // OR for comprehensive protection:
  client.clearAllBuffers(); // RECOMMENDED - Prevents all buffer leaking (stderr, stdout, state)
});
```

**Why this matters**: When one test generates output (stderr, partial stdout messages) and doesn't clear it, subsequent tests see the output from previous tests, causing unexpected assertion failures. This is the #1 cause of flaky programmatic tests.

**Buffer Bleeding Sources**:
- **Stderr buffer**: Error messages and debug output
- **Stdout buffer**: Partial JSON messages from previous requests  
- **Ready state**: Server readiness flag not reset
- **Pending reads**: Lingering message handlers

**Best Practice**: Use `client.clearAllBuffers()` instead of just `clearStderr()` for comprehensive protection.

### **When to Use Each Approach**
- **Programmatic**: Complex validation, dynamic tests, existing test suites, performance testing
- **YAML**: Simple request/response validation, pattern matching, CI/CD, non-developer testing

## Configuration Files

### Structure (`*.config.json`)
```json
{
  "name": "Server Display Name",
  "command": "node|python|executable",
  "args": ["./server.js", "--option"],
  "cwd": "./optional/working/directory",
  "env": {
    "CUSTOM_VAR": "value"
  },
  "startupTimeout": 5000,
  "readyPattern": "Server ready|Optional regex pattern"
}
```

### Configuration Fields
- **`name`** (required): Human-readable server name for reporting
- **`command`** (required): Executable command (node, python, etc.)
- **`args`** (required): Array of command arguments
- **`cwd`** (optional): Working directory for server execution
- **`env`** (optional): Environment variables for server process
- **`startupTimeout`** (optional): Max milliseconds to wait for server startup (default: 10000)
- **`readyPattern`** (optional): Regex pattern to match in stderr for server ready signal

### Example Configurations

#### Simple Server
```json
{
  "name": "Simple Filesystem Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./examples/filesystem-server",
  "startupTimeout": 5000,
  "readyPattern": "Simple Filesystem Server started"
}
```

#### Complex Server with Environment
```json
{
  "name": "Production API Server",
  "command": "python",
  "args": ["./api_server.py", "--port", "8080"],
  "cwd": "./server",
  "env": {
    "API_KEY": "test-key",
    "DEBUG": "true",
    "DATABASE_URL": "sqlite:///test.db"
  },
  "startupTimeout": 10000,
  "readyPattern": "Server listening on port"
}
```

## Test Files

### Structure (`*.test.mcp.yml`)
```yaml
description: "Human-readable test suite description"
tests:
  - it: "Test case description"
    request:
      jsonrpc: "2.0"
      id: "unique-test-id"
      method: "mcp/method/name"
      params:
        key: "value"
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-test-id"
        result:
          # Expected response structure
      stderr: "toBeEmpty|match:pattern"
```

### Enhanced YAML Structure Rules

#### **Pattern Syntax Guidelines**
1. **Basic Patterns**: Use `"match:type:string"` format for simple patterns
2. **Nested Patterns**: Use `match:extractField:` with separate `value:` sections
3. **Array Patterns**: Use `match:arrayElements:` followed by element structure
4. **Partial Matching**: Use `match:partial:` with nested expected structure

#### **Key Structure Rules**
- **No Duplicate Keys**: Avoid multiple `tools:` keys in same object
- **Proper Nesting**: Use `match:extractField: "path"` then `value:` for extracted data
- **Consistent IDs**: Each test must have unique `id` in request/response
- **Array Elements**: Use nested structure under `match:arrayElements:`

#### **🚨 CRITICAL Anti-Patterns (Learned from Complex Pattern Development)**
```yaml
# ❌ FATAL - Duplicate YAML keys (most common error)
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # OVERWRITES previous line!
  match:extractField: "tools.*.name"
  match:extractField: "isError"  # Another duplicate!

# ❌ WRONG - Mixing pattern structures
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # Structure conflict!

# ❌ WRONG - Field extraction mixing
result:
  tools: "match:arrayLength:1"
  match:extractField: "tools.*.name"  # Can't mix in same object

# ❌ WRONG - Array vs Object confusion
result:
  content:
    match:arrayElements:  # But response is single object, not array!
      type: "text"

# ✅ CORRECT - Proper pattern separation
result:
  tools: "match:arrayLength:1"

# In separate test for field extraction:
result:
  match:extractField: "tools.*.name"
  value:
    - "read_file"

# ✅ CORRECT - Match actual response structure
result:
  content:
    - type: "text"
      text: "match:contains:MCP"

# ✅ CORRECT - Array elements pattern
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      inputSchema: "match:type:object"

# ✅ CORRECT - String patterns
result:
  content:
    - type: "text"
      text: "match:startsWith:Hello"    # Starts with pattern
  jsonrpc: "match:startsWith:2."        # JSON-RPC version validation
```

#### **Pattern Development Best Practices (From Real Experience)**
1. **Start with --debug**: Always check actual response structure first
2. **One pattern per test**: Avoid mixing multiple pattern types in single validation
3. **Test incrementally**: Begin with deep equality, then add patterns
4. **Validate YAML syntax**: Use YAML linters before testing patterns
5. **Separate complex validations**: Use multiple test cases instead of one complex test
6. **Check field extraction paths**: Verify dot notation paths are correct
7. **Match response structure**: Don't assume arrays vs objects - check actual responses

### Test Case Components

#### **Request Structure** (JSON-RPC 2.0)
```yaml
request:
  jsonrpc: "2.0"                    # Always "2.0"
  id: "unique-identifier"           # Unique per test
  method: "tools/list|tools/call|initialize"
  params:                           # Method-specific parameters
    name: "tool_name"               # For tools/call
    arguments:                      # Tool arguments
      key: "value"
```

*For detailed JSON message examples, see [MCP Protocol Implementation](#mcp-protocol-implementation) section.*

#### **Response Expectations**
```yaml
expect:
  response:
    jsonrpc: "2.0"
    id: "matching-request-id"
    result:                         # For successful responses
      # Expected response data
    error:                          # For error responses
      code: -32601
      message: "Method not found"
  stderr: "toBeEmpty"              # Optional stderr validation
```

### Pattern Matching

#### **Deep Equality** (Default)
```yaml
result:
  tools:
    - name: "read_file"
      description: "Exact match required"
```

#### **Regex Patterns** (`match:` prefix)
```yaml
result:
  content:
    - type: "text"
      text: "match:\\d+ files found"    # Matches "5 files found"
```

#### **Complex Patterns**
```yaml
# Numbers
text: "match:\\d+"                      # Any number
text: "match:Temperature: \\d+°[CF]"    # Temperature format

# Email validation
text: "match:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"

# JSON structure
text: "match:\\{.*\"status\":\\s*\"success\".*\\}"

# Multiple alternatives
text: "match:(success|completed|finished)"

# Word boundaries
text: "match:\\bError\\b"

# Timestamps
text: "match:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"

# UUIDs
text: "match:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

# URLs
text: "match:https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/[^\\s]*)?"
```

#### **Stderr Validation**
```yaml
stderr: "toBeEmpty"                     # Expects no stderr output
stderr: "match:Warning.*deprecated"     # Expects specific stderr pattern
```

### Enhanced Pattern Matching

#### **Array Length Validation**
```yaml
result:
  tools: "match:arrayLength:6"          # Expects exactly 6 array elements
```

#### **Array Elements Pattern**
```yaml
result:
  tools:
    match:arrayElements:                 # All elements must match this pattern
      name: "match:type:string"
      description: "match:type:string"
      inputSchema: "match:type:object"

# Advanced key structure validation
result:
  tools:
    match:arrayElements:
      name: "match:regex:^[a-z][a-z0-9_]*$"      # snake_case validation
      description: "match:regex:.{20,}"           # Min 20 characters
      inputSchema:
        type: "match:type:string"                 # Nested structure validation
        properties: "match:type:object"
        required: "match:type:array"

# Mixed exact and pattern matching
result:
  tools:
    match:arrayElements:
      name: "read_file"                    # Exact name match
      description: "match:startsWith:Reads" # Pattern-based validation  
      inputSchema: "match:type:object"     # Type validation
```

**Key Validation Notes:**
- **All Keys Required**: Every array element must have ALL specified keys
- **Pattern Flexibility**: Each key can use any supported pattern (regex, type, contains, etc.)
- **Nested Validation**: Supports deep object structure validation
- **Extra Keys Allowed**: Elements can have additional keys not specified
- **Failure on Missing**: Test fails if any element lacks any specified key

#### **Array Contains Pattern (Enhanced!)**
```yaml
# Simple value matching (original behavior)
result:
  data: "match:arrayContains:search_docs"      # Array contains string value
  counts: "match:arrayContains:42"             # Array contains number (with type conversion)

# 🆕 Object field matching (NEW FEATURE!)
result:
  tools: "match:arrayContains:name:get_sfcc_class_info"        # Array contains object where obj.name === "get_sfcc_class_info"
  tools: "match:arrayContains:description:Search for SFCC"     # Array contains object where obj.description === "Search for SFCC"
  metadata: "match:arrayContains:version:1.0"                  # Array contains object where obj.version === "1.0"

# 🆕 Dot notation for nested fields (NEW FEATURE!)
result:
  tools: "match:arrayContains:inputSchema.type:object"         # Array contains object where obj.inputSchema.type === "object"
  tools: "match:arrayContains:metadata.author.name:John Doe"   # Array contains object where obj.metadata.author.name === "John Doe"
  tools: "match:arrayContains:config.settings.debug:true"     # Deep nested field access

# With field extraction (original pattern)  
result:
  match:extractField: "tools.*.name"    # Extract field values first
  value: "match:arrayContains:search_docs"  # Check if array contains value

# Combined with negation
result:
  tools: "match:not:arrayContains:name:deprecated_tool"        # Should NOT contain object with this name
  tools: "match:not:arrayContains:status:disabled"             # No object should have disabled status
  tools: "match:not:arrayContains:metadata.version:0.1"        # Should NOT contain objects with version 0.1
```

#### **Field Extraction Pattern**
```yaml
result:
  match:extractField: "tools.*.name"    # Extract name field from all tools
  value:                                 # Expected extracted values
    - "list_components"
    - "get_component_docs"
    - "search_docs"
```

#### **Partial Matching Pattern**
```yaml
result:
  match:partial:                         # Only check specified fields
    tools:
      - name: "search_docs"              # Must contain tool with this name
        description: "match:contains:search"
```

#### **Type Validation Pattern**
```yaml
result:
  serverInfo: "match:type:object"        # Validate data type
  tools: "match:type:array"
  count: "match:type:number"
```

#### **String Contains Pattern**
```yaml
result:
  description: "match:contains:search"   # String must contain "search"
  name: "match:startsWith:get_"          # String must start with "get_"
  version: "match:endsWith:.0"           # String must end with ".0"
```

#### **Pattern Negation with `match:not:`**
```yaml
result:
  # Negate any pattern by prefixing with "not:"
  tools: "match:not:arrayLength:0"              # Tools array should NOT be empty
  name: "match:not:startsWith:invalid_"         # Name should NOT start with "invalid_"
  text: "match:not:contains:error"              # Text should NOT contain "error"
  data: "match:not:type:string"                 # Data should NOT be a string

# Works with field extraction
result:
  match:extractField: "tools.*.name"
  value: "match:not:arrayContains:get_latest_error"  # Array should NOT contain this value

# Works with complex patterns
result:
  tools:
    match:arrayElements:
      name: "match:not:regex:^invalid_"         # No tool name should start with "invalid_"
      description: "match:not:contains:deprecated"  # No description should contain "deprecated"
```

#### **Date and Timestamp Patterns**
```yaml
result:
  # Date validity checking
  createdAt: "match:dateValid"                  # Valid date/timestamp
  invalidDate: "match:not:dateValid"            # Should NOT be valid date

  # Date comparisons
  publishDate: "match:dateAfter:2023-01-01"     # After specific date
  expireDate: "match:dateBefore:2025-01-01"     # Before specific date
  eventDate: "match:dateBetween:2023-01-01:2024-12-31"  # Date range
  
  # Age-based validation
  lastUpdate: "match:dateAge:1d"                # Within last day
  recentFile: "match:dateAge:2h"                # Within last 2 hours
  weeklyReport: "match:dateAge:7d"              # Within last week
  
  # Exact date matching
  fixedEvent: "match:dateEquals:2023-06-15T14:30:00.000Z"
  timestamp: "match:dateEquals:1687686600000"   # Unix timestamp
  
  # Format validation
  isoDate: "match:dateFormat:iso"               # ISO 8601 format
  dateOnly: "match:dateFormat:iso-date"         # YYYY-MM-DD format
  timeOnly: "match:dateFormat:iso-time"         # HH:MM:SS format
  usDate: "match:dateFormat:us-date"            # MM/DD/YYYY format
  timestampNum: "match:dateFormat:timestamp"    # Unix timestamp string

# Supported duration units for dateAge:
# - ms (milliseconds), s (seconds), m (minutes), h (hours), d (days)
# Examples: "1000ms", "30s", "5m", "2h", "7d"

# Date input formats supported:
# - ISO 8601 strings: "2023-06-15T14:30:00.000Z"
# - Date-only strings: "2023-06-15" 
# - Unix timestamps (numbers): 1687686600000
# - Unix timestamps (strings): "1687686600000"
# - Common date formats: "6/15/2023", "June 15, 2023"
```

### Example Test Cases

#### **Tool Listing Test**
```yaml
- it: "should list available tools"
  request: {jsonrpc: "2.0", id: "list-1", method: "tools/list", params: {}}
  expect:
    response:
      jsonrpc: "2.0"
      id: "list-1"
      result:
        tools: "match:arrayLength:1"  # Validate array length
        # OR use deep equality:
        # tools: [{name: "read_file", description: "Reads a file"}]
```

#### **Tool Execution Test**
```yaml
- it: "should execute read_file tool"
  request:
    jsonrpc: "2.0"
    id: "calc-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "calc-1"
      result:
        content:
          - type: "text"
            text: "Hello, MCP Conductor!"  # Exact match
        isError: false
    stderr: "toBeEmpty"
```

#### **Pattern Matching Examples**
```yaml
# Type validation
result:
  tools: "match:type:array"
  content: "match:type:array"
  isError: "match:type:boolean"

# String patterns  
text: "match:contains:MCP"              # Contains substring
text: "match:startsWith:Hello"          # Starts with prefix
text: "match:endsWith:Conductor!"       # Ends with suffix
jsonrpc: "match:startsWith:2."          # JSON-RPC version validation

# Array patterns
tools: "match:arrayLength:1"            # Exact count
content: "match:arrayLength:1"          # Single content element

# Array elements validation
tools:
  match:arrayElements:                  # All elements match pattern
    name: "match:type:string"
    description: "match:type:string"
    inputSchema: "match:type:object"

# Advanced key structure validation (comprehensive schema validation)
tools:
  match:arrayElements:
    name: "match:regex:^[a-z][a-z0-9_]*$"      # snake_case validation
    description: "match:regex:.{10,}"           # Min 10 characters
    inputSchema:
      type: "match:type:string"                 # Nested validation
      properties: "match:type:object"
      required: "match:type:array"

# Field extraction and validation
match:extractField: "tools.*.name"     # Extract tool names
value:
  - "read_file"                         # Expected extracted values

# Or with array contains
match:extractField: "tools.*.name"
value: "match:arrayContains:read_file"  # Check if read_file exists

# Partial matching
match:partial:                          # Only check specified fields
  tools:
    - name: "read_file"
      description: "match:contains:Reads"

# Error handling patterns
result:
  isError: true
  content:
    - type: "text"
      text: "match:contains:not found"  # Error message validation

# Regex patterns for complex validation
text: "match:\\d+ files found"              # Numbers
text: "match:[a-zA-Z0-9._%+-]+@[^\\s]+"    # Email
text: "match:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}" # ISO timestamp

# Pattern negation with not: prefix
tools: "match:not:arrayLength:0"            # Array should NOT be empty
text: "match:not:contains:error"             # Text should NOT contain "error"  
name: "match:not:startsWith:invalid_"        # Name should NOT start with "invalid_"
data: "match:not:type:string"                # Data should NOT be a string
match:extractField: "tools.*.name"
value: "match:not:arrayContains:deprecated_tool"  # Array should NOT contain this tool

# Date and timestamp patterns
createdAt: "match:dateValid"                 # Valid date/timestamp
publishDate: "match:dateAfter:2023-01-01"    # After specific date
expireDate: "match:dateBefore:2025-01-01"    # Before specific date
eventDate: "match:dateBetween:2023-01-01:2024-12-31"  # Date range
lastUpdate: "match:dateAge:1d"               # Within last day
fixedEvent: "match:dateEquals:2023-06-15T14:30:00.000Z"  # Exact match
isoDate: "match:dateFormat:iso"              # ISO 8601 format
invalidDate: "match:not:dateValid"           # Should NOT be valid date
```

## MCP Protocol Implementation

### Protocol Flow
1. **Server Startup**: Launch MCP server process via stdio
2. **Initialize Request**: Send MCP initialization handshake
3. **Initialized Notification**: Complete handshake protocol
4. **Tool Operations**: Execute `tools/list` and `tools/call` methods
5. **Graceful Shutdown**: Terminate server process

### JSON-RPC 2.0 Messages

#### Initialize Request
```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {"tools": {}},
    "clientInfo": {"name": "MCP Conductor", "version": "1.0.0"}
  }
}
```

#### Tools List Request
```json
{
  "jsonrpc": "2.0",
  "id": "tools-1",
  "method": "tools/list",
  "params": {}
}
```

#### Tool Call Request
```json
{
  "jsonrpc": "2.0",
  "id": "call-1",
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {"key": "value"}
  }
}
```

## Testing Strategy

### Unit Tests (171 tests - 100% passing)
- **configParser.test.js**: Configuration validation and loading
- **testParser.test.js**: YAML parsing and validation
- **MCPCommunicator.test.js**: Protocol communication and lifecycle
- **testRunner.test.js**: Test execution and pattern matching (includes modular components)
- **reporter.test.js**: Output formatting and reporting
- **cli.test.js**: CLI integration and argument parsing
- **index.test.js**: Main API tests
- **MCPClient.test.js**: Programmatic client tests
- **ConfigLoader.test.js**: Configuration loader tests
- **ConfigValidator.test.js**: Configuration validation tests
- **MessageHandler.test.js**: Message handling tests
- **ProcessManager.test.js**: Process management tests
- **StreamBuffer.test.js**: Stream buffering tests
- **stringPatterns.test.js**: String pattern matching tests

### Integration Tests (47 tests - 100% passing)
- **Filesystem Server** (27 tests): File operations, regex patterns, string patterns
- **Multi-Tool Server** (20 tests): Calculator, text processing, validation, file management
- **API Testing Server**: API testing demonstration and validation patterns

### Programmatic Testing (62 tests - 100% passing)
- **MCPClient API**: Promise-based JavaScript/TypeScript integration
- **Framework Integration**: Works with Node.js test runner, Jest, Mocha
- **Test Patterns**: Connection management, tool validation, error handling, performance testing
- **Lifecycle Management**: Automated server startup, MCP handshake, graceful shutdown
- **Advanced Scenarios**: Complex validation logic, dynamic test generation, stateful testing

### Test Execution

#### **Node.js Built-in Test Runner** (`node --test`)

**🚨 CRITICAL**: Always use `node --test` for individual files or patterns, NEVER `npm test` with single files as `npm test` runs the complete test suite (`npm run test:all`).

#### **Available NPM Test Commands** (from package.json)
```bash
# COMPLETE TEST SUITES (use npm run for these)
npm run test               # Runs npm run test:all (complete suite)
npm run test:all           # Complete test suite (unit + examples + patterns + programmatic)
npm run test:unit          # All unit tests (171 tests)
npm run test:examples      # All example server tests (filesystem + multitool + api-testing + data-patterns)
npm run test:programmatic  # All programmatic tests (62 tests)

# UNIT TEST CATEGORIES (use npm run for organized testing)
npm run test:unit:core     # Core engine tests
npm run test:unit:patterns # Pattern matching tests  
npm run test:unit:cli      # CLI interface tests
npm run test:unit:engine   # Test engine tests
npm run test:unit:performance # Performance tests
npm run test:unit:api      # API tests

# INTEGRATION TESTS (use npm run for MCP server testing)
npm run test:filesystem    # Filesystem server tests (27 tests)
npm run test:multitool     # Multi-tool server tests (20 tests)  
npm run test:api-testing   # API testing server tests
npm run test:data-patterns # Data patterns server tests

# SPECIALIZED TESTS (use npm run for focused testing)
npm run test:filesystem:tools      # Filesystem tools only
npm run test:filesystem:execution  # Filesystem execution only
npm run test:filesystem:patterns   # Filesystem pattern tests
npm run test:programmatic:filesystem    # Filesystem programmatic tests
npm run test:programmatic:multitool     # Multi-tool programmatic tests
npm run test:programmatic:data-patterns # Data patterns programmatic tests
npm run test:programmatic:api-testing   # API testing programmatic tests
```

#### **Node.js Test Runner Direct Usage** (`node --test`)

**Use `node --test` for**:
- Individual test files
- Custom glob patterns 
- Development and debugging
- Coverage reporting
- Focused testing

```bash
# INDIVIDUAL FILES (✅ CORRECT - use node --test)
node --test test/core/configParser.test.js
node --test examples/filesystem-server/filesystem.programmatic.test.js
node --test test/patterns/equality.test.js

# GLOB PATTERNS (✅ CORRECT - use node --test)  
node --test test/**/*.test.js                    # All unit tests
node --test test/core/*.test.js                  # Core tests only
node --test examples/**/*.programmatic.test.js   # All programmatic tests
node --test test/patterns/*.test.js              # Pattern tests only

# COVERAGE REPORTING (✅ RECOMMENDED)
node --test --experimental-test-coverage test/**/*.test.js
node --test --experimental-test-coverage examples/**/*.programmatic.test.js
node --test --experimental-test-coverage test/core/configParser.test.js

# VERBOSE OUTPUT (✅ DEBUGGING)
node --test --verbose test/core/configParser.test.js
node --test --verbose examples/filesystem-server/filesystem.programmatic.test.js

# COMBINED OPTIONS (✅ COMPREHENSIVE)
node --test --experimental-test-coverage --verbose test/**/*.test.js
```

#### **Coverage Reporting with `--experimental-test-coverage`**

**Coverage Features**:
- **Line Coverage**: Shows which lines of code were executed
- **Function Coverage**: Shows which functions were called
- **Branch Coverage**: Shows which code branches were taken
- **Statement Coverage**: Shows which statements were executed

```bash
# UNIT TEST COVERAGE
node --test --experimental-test-coverage test/**/*.test.js

# PROGRAMMATIC TEST COVERAGE  
node --test --experimental-test-coverage examples/**/*.programmatic.test.js

# SPECIFIC MODULE COVERAGE
node --test --experimental-test-coverage test/core/configParser.test.js
node --test --experimental-test-coverage test/patterns/equality.test.js

# COMBINED WITH VERBOSE OUTPUT
node --test --experimental-test-coverage --verbose test/core/*.test.js

# COVERAGE FOR SPECIFIC FUNCTIONALITY
node --test --experimental-test-coverage test/patterns/*.test.js     # Pattern matching coverage
node --test --experimental-test-coverage test/engine/*.test.js       # Test engine coverage
```

#### **Common Testing Patterns**

```bash
# DEVELOPMENT WORKFLOW (✅ RECOMMENDED)
node --test test/core/configParser.test.js                          # Test single file
node --test --experimental-test-coverage test/core/*.test.js         # Test category with coverage
npm run test:unit:core                                               # Use npm script for organized testing

# DEBUGGING WORKFLOW (✅ DEBUGGING)
node --test --verbose test/patterns/equality.test.js                 # Verbose single file
node --test --experimental-test-coverage --verbose test/patterns/*.test.js  # Coverage + verbose

# COMPREHENSIVE TESTING (✅ COMPLETE VALIDATION)
npm run test:all                                                     # Complete test suite
node --test --experimental-test-coverage test/**/*.test.js           # Unit test coverage
node --test --experimental-test-coverage examples/**/*.programmatic.test.js  # Programmatic test coverage

# FOCUSED DEVELOPMENT (✅ TARGETED TESTING)
node --test test/core/MCPCommunicator.test.js                       # Test MCP communication
node --test test/patterns/fields.test.js                            # Test field extraction
node --test examples/filesystem-server/filesystem.programmatic.test.js  # Test programmatic API
```

#### **❌ Anti-Patterns (AVOID THESE)**
```bash
# WRONG - Don't use npm test with specific files
npm test test/core/configParser.test.js              # ❌ Runs complete test suite instead!
npm test examples/filesystem.programmatic.test.js    # ❌ Ignores file, runs all tests!

# WRONG - Don't mix npm scripts with individual files  
npm run test:unit test/core/configParser.test.js     # ❌ npm scripts don't accept file arguments
npm run test:all examples/filesystem.test.js         # ❌ npm scripts ignore additional arguments

# WRONG - Don't use npm test for coverage
npm test --experimental-test-coverage                # ❌ npm test doesn't support coverage flags
```

#### **✅ Best Practices Summary**
1. **Individual Files**: Use `node --test path/to/file.test.js`
2. **Organized Testing**: Use `npm run test:category` for logical groupings
3. **Coverage Reporting**: Use `node --test --experimental-test-coverage` for coverage
4. **Complete Testing**: Use `npm run test:all` for full suite validation
5. **Debugging**: Use `node --test --verbose` for detailed output
6. **Never**: Use `npm test` with individual file arguments

## Development Standards

### Code Quality Expectations
- **Modern ES2020+ JavaScript**: Use async/await, destructuring, modules
- **Strict Error Handling**: Comprehensive try/catch, proper error propagation
- **Input Validation**: Validate all inputs, sanitize data, prevent injection
- **Performance**: Efficient algorithms, minimal dependencies, non-blocking I/O
- **Security**: No eval(), proper input sanitization, secure defaults
- **Testing**: 100% test coverage, edge cases, integration scenarios
- **Documentation**: Clear JSDoc comments, comprehensive README files

### Anti-Patterns to Avoid
- ❌ Magic numbers/strings without constants
- ❌ Commented-out code in production
- ❌ Unnecessary dependencies or bloat
- ❌ Global state unless absolutely necessary
- ❌ Silent failures or catch-all error swallowing
- ❌ Blocking I/O operations
- ❌ Prototype pollution vulnerabilities
- ❌ Creating unnecessary "summary documents" or analysis files that waste context space

### Required Practices
- ✅ Use Commander.js for CLI argument parsing with proper option inheritance (avoid manual parsing)
- ✅ Use js-yaml for YAML parsing with validation
- ✅ Use chalk for colored terminal output
- ✅ Use jest-diff for rich diff visualization
- ✅ Use glob for file pattern matching
- ✅ Use child_process stdio for MCP communication
- ✅ Implement proper async/await patterns
- ✅ Include comprehensive error handling
- ✅ Write descriptive test cases
- ✅ Document all public APIs

### Modular Architecture Requirements
- ✅ **Single Responsibility**: Each module should have one clear purpose
- ✅ **Small Focused Files**: Keep modules under 250 lines when possible
- ✅ **Clear Dependencies**: Use explicit imports/exports, avoid circular dependencies  
- ✅ **Handler Patterns**: Use mapping patterns instead of long if-else chains
- ✅ **Backward Compatibility**: Re-export functions when refactoring for existing tests
- ✅ **Pure Functions**: Prefer stateless functions with clear inputs/outputs
- ✅ **Early Returns**: Use early returns to reduce nesting and improve readability
- ✅ **Descriptive Names**: Function names should clearly describe their purpose
- ✅ **Module Documentation**: Each module should have clear responsibility documentation

## Example MCP Servers

### Simple Filesystem Server
- **Single Tool**: `read_file`
- **Purpose**: File reading with error handling
- **Tests**: Basic operations + comprehensive regex patterns
- **Use Case**: Demonstrates fundamental MCP server structure

### Multi-Tool Server
- **Four Tools**: `calculator`, `text_processor`, `data_validator`, `file_manager`
- **Purpose**: Comprehensive testing scenarios
- **Tests**: Mathematical operations, text analysis, validation, file operations
- **Use Case**: Real-world multi-tool server implementation

### API Testing Server
- **Multiple Tools**: API testing and validation tools
- **Purpose**: API testing demonstration and validation patterns
- **Tests**: API response validation, error handling, pattern matching
- **Use Case**: Demonstrates complex API testing scenarios

## Performance Considerations
- **Async Operations**: All I/O operations use async/await
- **Memory Management**: Proper cleanup of child processes and streams
- **Error Boundaries**: Isolated error handling per test case
- **Timeout Management**: Configurable timeouts for server operations
- **Resource Cleanup**: Graceful shutdown and resource deallocation

## Security Considerations
- **Input Sanitization**: All user inputs are validated and sanitized
- **Process Isolation**: Child processes run in controlled environments
- **No Code Execution**: No eval() or dynamic code execution
- **Secure Defaults**: Conservative timeout and resource limits
- **Error Information**: Careful error message exposure

### Real-World Testing Success

MCP Conductor has been successfully tested with production MCP servers, demonstrating real-world applicability with 100% passing test suites using both YAML and programmatic approaches. Key validations include tool discovery, response format consistency, error handling, and comprehensive pattern matching across all 12+ pattern types.

#### **Production Example**
```javascript
// Production-tested programmatic validation
const result = await client.callTool('list_tools');
const tools = result.tools;

// Validate tool structure and count
assert.ok(Array.isArray(tools), 'Tools should be array');
assert.ok(tools.length > 0, 'Should have tools available');

// Validate each tool has required properties
tools.forEach(tool => {
  assert.ok(tool.name, 'Tool should have name');
  assert.ok(tool.description, 'Tool should have description');
  assert.ok(tool.inputSchema, 'Tool should have input schema');
});
```

This validates the framework's production readiness and demonstrates successful testing of complex, real-world MCP servers.

---

## Quick Reference

### Common Commands
```bash
# Test specific server with various options
conductor "./tests/my-test.yml" --config "./my-config.json"

# Test with glob patterns
conductor "./tests/**/*.test.mcp.yml" --config "./config.json"

# Interactive tool debugging (NEW query command)
conductor query --config "./config.json"                           # List all tools
conductor query tool_name '{"param": "value"}' --config "./config.json"  # Test specific tool

# Verbose output with test hierarchy
conductor "./tests/**/*.test.mcp.yml" --config "./config.json" --verbose

# Debug mode with detailed MCP communication
conductor "./tests/**/*.test.mcp.yml" --config "./config.json" --debug

# Performance analysis with timing information
conductor "./tests/**/*.test.mcp.yml" --config "./config.json" --timing

# JSON output for CI/automation systems
conductor "./tests/**/*.test.mcp.yml" --config "./config.json" --json

# Quiet mode for scripting (minimal output)
conductor "./tests/**/*.test.mcp.yml" --config "./config.json" --quiet

# Combine multiple debugging options
conductor "./tests/**/*.test.mcp.yml" --config "./config.json" --verbose --debug --timing

# Test examples (from project root)
npm run test:examples
```

### Node.js Test Runner Commands
```bash
# Individual file testing (✅ USE node --test)
node --test test/core/configParser.test.js
node --test examples/filesystem-server/filesystem.programmatic.test.js

# Pattern-based testing  
node --test test/**/*.test.js                    # All unit tests
node --test test/core/*.test.js                  # Core tests only
node --test examples/**/*.programmatic.test.js   # All programmatic tests

# Coverage reporting (✅ RECOMMENDED)
node --test --experimental-test-coverage test/**/*.test.js
node --test --experimental-test-coverage examples/**/*.programmatic.test.js
node --test --experimental-test-coverage test/core/configParser.test.js

# Verbose debugging
node --test --verbose test/patterns/equality.test.js
node --test --experimental-test-coverage --verbose test/patterns/*.test.js

# Organized test suites (✅ USE npm run for these)
npm run test:all                    # Complete test suite (171+62+47 tests)
npm run test:unit                   # Unit tests only (171 tests)  
npm run test:programmatic           # Programmatic API tests (62 tests)
npm run test:examples               # Integration tests (47 tests)

# ❌ NEVER DO THIS (npm test ignores file arguments and runs complete suite)
npm test test/core/configParser.test.js              # ❌ WRONG - runs all tests!
npm test examples/filesystem.programmatic.test.js    # ❌ WRONG - ignores file!
```

### Terminal Command Limitations

**Important**: The `timeout` and `gtimeout` commands are not available on this system. When working with MCP Conductor testing or any command execution scenarios, use built-in timeouts and process management instead of relying on external timeout utilities.

- ❌ `timeout 30s command` - Not available
- ❌ `gtimeout 30s command` - Not available  
- ✅ Use MCP Conductor's built-in `startupTimeout` configuration
- ✅ Use Node.js `child_process` timeout options for programmatic testing
- ✅ Use process management and signal handling for timeout control

### Common Patterns
```yaml
# Basic test structure
description: "Test suite name"
tests:
  - it: "Test description"
    request: {jsonrpc: "2.0", id: "1", method: "tools/list", params: {}}
    expect: {response: {jsonrpc: "2.0", id: "1", result: {}}}

# Regex matching
text: "match:\\d+ items found"

# Error expectations  
result: {isError: true, content: [{type: "text", text: "Error message"}]}
```

This comprehensive guide ensures consistent, high-quality development practices for MCP Conductor and related MCP server testing scenarios.
