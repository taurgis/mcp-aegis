# MCP Conductor - Copilot Instructions

## Project Overview

**MCP Conductor** is a comprehensive Node.js testing library specifically designed for Model Context Protocol (MCP) servers. It provides declarative YAML-based testing with robust MCP protocol compliance, advanced pattern matching, and rich reporting capabilities.

## Core Persona
You are a senior Node.js developer specializing in Model Context Protocol (MCP) systems and testing frameworks. You are highly critical, detail-oriented, and demand the highest standards of code quality, maintainability, and performance.

## Project Architecture

### 📁 Directory Structure
```
mcp-conductor/
├── bin/
│   └── conductor.js                 # CLI entrypoint
├── src/                            # Core library modules
│   ├── configParser.js            # Configuration validation & loading
│   ├── testParser.js               # YAML test file parsing
│   ├── MCPCommunicator.js          # Low-level MCP protocol communication
│   ├── testRunner.js               # Core test execution engine
│   └── reporter.js                 # Rich output formatting & reporting
├── test/                           # Comprehensive unit test suite
│   ├── configParser.test.js        # Config parser tests
│   ├── testParser.test.js          # YAML parser tests
│   ├── MCPCommunicator.test.js     # Protocol communication tests
│   ├── testRunner.test.js          # Test execution tests
│   ├── reporter.test.js            # Reporter functionality tests
│   └── cli.test.js                 # CLI integration tests
├── examples/                       # Working examples & demo servers
│   ├── simple-fs-server.js         # Single-tool file reading server
│   ├── multi-tool-server.js        # Multi-tool comprehensive server
│   ├── conductor.config.json       # Filesystem server config
│   ├── multi-tool.config.json      # Multi-tool server config
│   ├── filesystem.test.mcp.yml     # Filesystem & regex tests
│   ├── advanced.test.mcp.yml       # Advanced testing scenarios
│   ├── multi-tool.test.mcp.yml     # Multi-tool comprehensive tests
│   └── test-data/                  # Test data files for validation
└── docs/                          # Documentation
    ├── README.md
    ├── EXAMPLES.md
    ├── CONTRIBUTING.md
    └── PROJECT_SUMMARY.md
```

### 🏗️ Core Architecture Components

#### 1. **CLI Entrypoint** (`bin/conductor.js`)
- **Purpose**: Command-line interface with Commander.js integration
- **Responsibilities**: Argument parsing, config loading, test discovery, orchestration
- **Key Features**: Glob pattern support, exit code management, error handling
- **Usage**: `conductor "tests/**/*.test.mcp.yml" --config "config.json"`

#### 2. **Configuration Parser** (`src/configParser.js`)
- **Purpose**: JSON configuration validation and loading
- **Schema**: Validates MCP server connection details
- **Features**: Default value assignment, environment variable merging, comprehensive validation
- **Required Fields**: `name`, `command`, `args`
- **Optional Fields**: `cwd`, `env`, `startupTimeout`, `readyPattern`

#### 3. **Test Parser** (`src/testParser.js`)
- **Purpose**: YAML test file parsing and validation
- **Features**: Glob pattern support, JSON-RPC 2.0 validation, schema compliance
- **Structure**: Validates test suites with `description`, `tests[]` arrays
- **Validation**: Ensures proper JSON-RPC message structure and MCP compliance

#### 4. **MCP Communicator** (`src/MCPCommunicator.js`)
- **Purpose**: Low-level stdio communication with MCP servers
- **Protocol**: JSON-RPC 2.0 over stdio transport
- **Features**: Async stream handling, message framing, buffer management
- **Lifecycle**: Server startup, handshake, communication, graceful shutdown
- **Error Handling**: Timeout management, stderr capture, process monitoring

#### 5. **Test Runner** (`src/testRunner.js`)
- **Purpose**: Core test execution engine with MCP protocol handling
- **Features**: Automated handshake, assertion matching, deep equality comparison
- **Pattern Matching**: Supports `match:regex` syntax for flexible validation
- **Protocol**: Full MCP handshake (`initialize` → `initialized` → tool operations)
- **Assertions**: Deep object comparison, regex patterns, stderr validation

#### 6. **Reporter** (`src/reporter.js`)
- **Purpose**: Rich test result formatting and colored output
- **Features**: Colored output, detailed diffs, summary statistics
- **Output**: Pass/fail indicators, diff visualization, execution summaries
- **Integration**: Works with jest-diff for rich comparison visualization

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
  "name": "Simple FS Server",
  "command": "node",
  "args": ["./simple-server.js"],
  "startupTimeout": 3000
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

### Example Test Cases

#### **Tool Listing Test**
```yaml
- it: "should list available tools"
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
          - name: "calculator"
            description: "Performs math operations"
            inputSchema:
              type: "object"
              properties:
                operation:
                  type: "string"
                  enum: ["add", "subtract", "multiply", "divide"]
              required: ["operation"]
```

#### **Tool Execution Test**
```yaml
- it: "should execute calculator tool"
  request:
    jsonrpc: "2.0"
    id: "calc-1"
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
      id: "calc-1"
      result:
        content:
          - type: "text"
            text: "Result: 42"
        isError: false
    stderr: "toBeEmpty"
```

#### **Error Handling Test**
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
            text: "match:Unknown tool.*nonexistent_tool"
```

#### **Regex Pattern Test**
```yaml
- it: "should validate email format"
  request:
    jsonrpc: "2.0"
    id: "regex-1"
    method: "tools/call"
    params:
      name: "data_validator"
      arguments:
        type: "email"
        data: "test@example.com"
  expect:
    response:
      jsonrpc: "2.0"
      id: "regex-1"
      result:
        content:
          - type: "text"
            text: "match:Valid email.*VALID"
        isError: false
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

### Unit Tests (87 tests - 100% passing)
- **configParser.test.js**: Configuration validation and loading
- **testParser.test.js**: YAML parsing and validation
- **MCPCommunicator.test.js**: Protocol communication and lifecycle
- **testRunner.test.js**: Test execution and pattern matching
- **reporter.test.js**: Output formatting and reporting
- **cli.test.js**: CLI integration and argument parsing

### Integration Tests (38 tests - 100% passing)
- **Filesystem Server** (18 tests): File operations, regex patterns
- **Multi-Tool Server** (20 tests): Calculator, text processing, validation, file management

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

---

## Quick Reference

### Common Commands
```bash
# Test specific server
conductor "./tests/my-test.yml" --config "./my-config.json"

# Test with glob patterns
conductor "./tests/**/*.test.mcp.yml" --config "./config.json"

# Run with verbose output
conductor "./tests/*.yml" --config "./config.json" --verbose
```

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
