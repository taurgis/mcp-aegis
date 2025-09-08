# MCP Conductor - Copilot Instructions

## Project Overview

**MCP Conductor** is a comprehensive Node.js testing library specifically designed for Model Context Protocol (MCP) servers. It provides declarative YAML-based testing with robust MCP protocol compliance, 11+ verified pattern matching capabilities (including partial matching, array validation, field extraction, type checking), and rich reporting capabilities.

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
├── docs-site/                      # Jekyll documentation site
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
  - **Commands** (`src/cli/commands/`): Command handlers (init.js, test.js)
  - **Interface** (`src/cli/interface/`): CLI components (options.js, output.js)
- **Features**: Argument parsing, validation, help system, error handling

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
```

#### **Array Contains Pattern**
```yaml
result:
  match:extractField: "tools.*.name"    # Extract field values first
  value: "match:arrayContains:search_docs"  # Check if array contains value
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
```bash
# Run all unit tests
npm run test:unit

# Run filesystem server tests
npm run test:filesystem

# Run multi-tool server tests  
npm run test:multitool

# Run complete test suite
npm run test:all

# Run programmatic tests
node --test examples/filesystem.programmatic.test.js
node --test examples/multi-tool.programmatic.test.js
```

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
- ✅ Use Commander.js for CLI argument parsing
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

MCP Conductor has been successfully tested with production MCP servers, demonstrating real-world applicability with 100% passing test suites using both YAML and programmatic approaches. Key validations include tool discovery, response format consistency, error handling, and comprehensive pattern matching across all 11+ pattern types.

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
