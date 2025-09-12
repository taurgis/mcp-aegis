# MCP Conductor - AI Agent Instructions

## 🎯 What is MCP Conductor?

**MCP Conductor** is a Node.js testing framework designed specifically for **Model Context Protocol (MCP) servers**. It's the definitive tool for validating MCP server implementations through both declarative YAML testing and programmatic JavaScript/TypeScript APIs.

*Note: These instructions were verified against the codebase on September 12, 2025.*

### 🚀 Core Mission
**Ensure MCP server reliability** through comprehensive testing of JSON-RPC 2.0 communication, tool discovery, execution validation, and response format compliance.

### 🛠️ Key Capabilities
- **✅ YAML-based Testing**: Declarative test files with 29+ pattern matching types
- **✅ Programmatic API**: Promise-based JavaScript/TypeScript client for complex testing
- **✅ MCP Protocol Compliance**: Full JSON-RPC 2.0 over stdio implementation
- **✅ Pattern Matching**: Regex, type validation, array operations, field extraction, date/time validation
- **✅ Rich Reporting**: Colored output, diffs, timing, debug logging, JSON export
- **✅ CI/CD Ready**: Command-line interface with comprehensive error reporting

## 🎭 Agent Persona
You are a **senior Node.js developer** specializing in **Model Context Protocol (MCP) systems** and **testing frameworks**. You demand the highest standards of code quality, maintainability, and performance. You understand MCP protocol intricacies and can debug complex testing scenarios.

## 🏗️ Architecture Overview

MCP Conductor follows **modular single-responsibility principles** with clean separation of concerns:

```
mcp-conductor/
├── bin/conductor.js                 # 🎯 CLI entry point
├── src/
│   ├── cli/                        # 🖥️  Command-line interface system
│   │   ├── commands/               # Command handlers (test, init, query)
│   │   └── interface/              # CLI components (options, output)
│   ├── core/                       # ⚙️  Core engine (8 modules)
│   │   ├── MCPCommunicator.js      # Main MCP communication coordinator
│   │   ├── MessageHandler.js       # JSON-RPC message processing
│   │   ├── ProcessManager.js       # Child process lifecycle
│   │   ├── StreamBuffer.js         # Stdio stream management
│   │   ├── ConfigLoader.js         # Configuration loading
│   │   ├── ConfigValidator.js      # Configuration validation
│   │   ├── configParser.js         # Configuration parsing
│   │   └── version.js              # Version management
│   ├── test-engine/                # 🧪 Test execution engine
│   │   ├── runner.js               # Test orchestration (110 lines)
│   │   ├── executor.js             # Individual test execution (290 lines)
│   │   ├── parser.js               # YAML test parsing
│   │   ├── reporter.js             # Rich test reporting
│   │   └── matchers/               # 🎯 Advanced pattern matching subsystem
│   │       ├── patterns.js         # Main pattern coordinator (132 lines)
│   │       ├── equality.js         # Deep equality comparison (288 lines)
│   │       ├── fields.js           # Field extraction (117 lines)
│   │       ├── stringPatterns.js   # String pattern handlers
│   │       ├── arrayPatterns.js    # Array pattern handlers
│   │       ├── typePatterns.js     # Type validation patterns
│   │       ├── numericPatterns.js  # Numeric validation patterns
│   │       ├── datePatterns.js     # Date/time validation patterns
│   │       ├── crossFieldPatterns.js # Cross-field validation
│   │       ├── patternUtils.js     # Pattern utilities
│   │       ├── validation.js       # Pattern validation
│   │       ├── syntaxAnalyzer.js   # Syntax analysis
│   │       ├── analyzers/          # Pattern analyzers
│   │       ├── corrections/        # Error corrections
│   │       ├── utils/              # Utility functions
│   │       └── validators/         # Validation modules
│   ├── protocol/                   # 🔌 MCP protocol implementation
│   │   └── handshake.js           # MCP handshake logic (51 lines)
│   └── programmatic/               # 📊 Programmatic testing API
│       └── MCPClient.js           # Promise-based client for JS/TS
├── test/                           # 🧪 1200+ unit tests (100% passing)
├── examples/                       # 📋 Demo servers + integration tests
│   ├── filesystem-server/          # Basic file operations
│   ├── multi-tool-server/          # Complex scenarios
│   ├── api-testing-server/         # API testing patterns
│   └── data-patterns-server/       # Advanced pattern validation
└── temp-testing/                   # 🛠️  Development workspace
```

### 🔧 Key Architecture Principles

#### **1. Modular Design (SRP Compliance)**
- **Each module has ONE responsibility** (90-228 lines max)
- **Clean interfaces** with explicit imports/exports
- **No circular dependencies**
- **Handler mapping patterns** instead of if-else chains

#### **2. Two Testing Approaches**
```javascript
// 📝 YAML Approach - Declarative testing
description: "Tool validation tests"
tests:
  - it: "should list available tools"
    request: {jsonrpc: "2.0", id: "1", method: "tools/list"}
    expect: {response: {result: {tools: "match:arrayLength:3"}}}

// 💻 Programmatic Approach - JavaScript/TypeScript integration  
const client = await connect('./config.json');
const tools = await client.listTools();
assert.ok(Array.isArray(tools) && tools.length > 0);
```

#### **3. Advanced Pattern Matching System**
The **`src/test-engine/matchers/`** directory contains a sophisticated pattern matching system:

- **Main Coordinator** (`patterns.js`): Orchestrates all pattern types through specialized handlers
- **Core Matchers**: `equality.js`, `fields.js` for deep comparison and field extraction
- **Specialized Handlers**: Dedicated modules for each pattern category:
  - `stringPatterns.js`: Contains, startsWith, endsWith, regex, case-insensitive matching
  - `arrayPatterns.js`: Array length, array contains (with object field support)
  - `typePatterns.js`: Type validation, exists, count patterns
  - `numericPatterns.js`: Numeric comparisons, ranges, approximations, decimals
  - `datePatterns.js`: Date validation, comparisons, age calculations, format checking
  - `crossFieldPatterns.js`: Cross-field validation and relationships
- **Analysis & Correction**: `analyzers/`, `corrections/`, `validators/` for advanced pattern analysis
- **Utilities**: `patternUtils.js`, `validation.js`, `syntaxAnalyzer.js` for supporting functionality

This modular design supports 50+ pattern types with extensible architecture for new patterns.

## 🎯 Primary Use Cases
1. **Server Startup** → Launch MCP server via stdio
2. **Initialize** → Send MCP handshake request  
3. **Initialized** → Complete handshake protocol
4. **Tool Operations** → Execute `tools/list` and `tools/call`
5. **Graceful Shutdown** → Clean process termination

### **1. MCP Server Development**
- Validate tool implementations during development
- Ensure JSON-RPC 2.0 compliance
- Test error handling and edge cases
- Verify response format consistency

### **2. CI/CD Integration**
```bash
# Automated testing in CI pipelines
conductor "tests/**/*.test.mcp.yml" --config "config.json" --json
conductor "tests/**/*.test.mcp.yml" --config "config.json" --errors-only
```

### **3. Production Validation**
- Validate MCP servers before deployment
- Monitor tool availability and functionality
- Regression testing across versions
- Performance and reliability testing

### **4. Framework Integration**
```javascript
// Jest/Mocha/Node.js test runner integration
describe('MCP Server Tests', () => {
  let client;
  before(async () => client = await connect('./config.json'));
  beforeEach(() => client.clearAllBuffers()); // 🚨 CRITICAL
  after(async () => await client?.disconnect());
});
```

## 💻 Programmatic Testing API

**MCPClient**: Promise-based JavaScript/TypeScript integration for Jest, Mocha, Node.js test runner.

### **Core API Methods**
```javascript
// 🚀 Quick Start
const client = await connect('./config.json');     // Create + auto-connect

// 🔧 Lifecycle Management
await client.connect();                    // Start server + MCP handshake
await client.disconnect();                 // Graceful shutdown

// 🛠️ Tool Operations
const tools = await client.listTools();   // Get available tools
const result = await client.callTool(name, args); // Execute tool
const response = await client.sendMessage(jsonRpcMessage); // Raw JSON-RPC

// 🧹 Buffer Management (CRITICAL!)
client.clearStderr();                      // Clear stderr buffer
client.clearAllBuffers();                 // Clear all buffers (recommended)
const stderr = client.getStderr();        // Get stderr output
```

### **🚨 Critical: Preventing Test Interference**
**MOST COMMON ISSUE**: Buffer leaking between tests causes flaky failures. **Always include `beforeEach()` with buffer clearing:**

```javascript
describe('MCP Tests', () => {
  let client;
  before(async () => client = await connect('./config.json'));
  after(async () => await client?.disconnect());
  
  // 🚨 REQUIRED - Prevents buffer leaking between tests
  beforeEach(() => {
    client.clearAllBuffers(); // RECOMMENDED - Full protection
    // OR minimum: client.clearStderr(); // Basic protection
  });
  
  test('should validate tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools) && tools.length > 0);
  });
});
```

**Why this matters**: Buffer bleeding from previous tests causes unexpected assertion failures. Sources:
- **Stderr buffer**: Error messages and debug output
- **Stdout buffer**: Partial JSON messages 
- **Ready state**: Server readiness flags
- **Pending reads**: Lingering message handlers

### **When to Use Each Approach**
| Approach | Best For | Strengths |
|----------|----------|-----------|
| **🔧 Programmatic** | Complex validation, dynamic tests, existing test suites, performance testing | Full JavaScript power, conditional logic, loops |
| **📝 YAML** | Simple request/response validation, pattern matching, CI/CD, non-developer testing | Declarative, readable, no coding required |

## ⚙️ Configuration Files

### **Structure** (`*.config.json`)
```json
{
  "name": "Server Display Name",             // Human-readable name
  "command": "node|python|executable",       // Executable command
  "args": ["./server.js", "--option"],       // Command arguments
  "cwd": "./optional/working/directory",     // Working directory (optional)
  "env": {"CUSTOM_VAR": "value"},            // Environment variables (optional)
  "startupTimeout": 5000,                    // Startup timeout in ms (default: 10000)
  "readyPattern": "Server ready|regex"       // Ready signal pattern (optional)
}
```

### **Example Configurations**

#### **Simple Server**
```json
{
  "name": "Filesystem Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./examples/filesystem-server",
  "startupTimeout": 5000,
  "readyPattern": "Simple Filesystem Server started"
}
```

#### **Complex Server with Environment**
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

## 📝 YAML Test Files

### **Structure** (`*.test.mcp.yml`)
```yaml
description: "Human-readable test suite description"
tests:
  - it: "Test case description"
    request:
      jsonrpc: "2.0"
      id: "unique-test-id"
      method: "tools/list|tools/call|initialize"
      params: {key: "value"}
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-test-id"
        result: {} # Expected response structure
      stderr: "toBeEmpty|match:pattern"
```

### **🎯 Pattern Matching Types (50+ Patterns)**

#### **1. Deep Equality (Default)**
```yaml
result:
  tools:
    - name: "read_file"
      description: "Exact match required"
```

#### **2. Basic Patterns**
```yaml
# String patterns
text: "match:contains:MCP"              # Contains substring
text: "match:startsWith:Hello"          # Starts with prefix  
text: "match:endsWith:Conductor!"       # Ends with suffix

# Type validation
tools: "match:type:array"               # Must be array
count: "match:type:number"              # Must be number
config: "match:type:object"             # Must be object

# Array length
tools: "match:arrayLength:3"            # Exactly 3 elements
```

#### **3. Array Patterns**
```yaml
# Array elements validation (ALL elements must match)
tools:
  match:arrayElements:
    name: "match:type:string"           # All tools have string names
    description: "match:regex:.{10,}"   # All descriptions 10+ chars
    inputSchema: "match:type:object"    # All have object schemas

# Array contains (enhanced with object field matching)
tools: "match:arrayContains:name:read_file"              # Contains tool named "read_file"
tools: "match:arrayContains:inputSchema.type:object"     # Contains tool with object schema
```

#### **4. Field Extraction**
```yaml
# Extract values from nested objects
result:
  match:extractField: "tools.*.name"   # Extract all tool names
  value:                                # Expected extracted values
    - "list_components"
    - "get_component_docs" 
    - "search_docs"
```

#### **5. Partial Matching**
```yaml
# Only validate specified fields
result:
  match:partial:
    tools:
      - name: "search_docs"             # Must contain this tool
        description: "match:contains:search"
```

#### **6. Advanced Regex Patterns**
```yaml
text: "match:\\d+ files found"                    # Numbers: "5 files found"
text: "match:[a-zA-Z0-9._%+-]+@[^\\s]+"          # Email validation
text: "match:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}" # ISO timestamps
text: "match:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" # UUIDs
```

#### **7. Pattern Negation** (`match:not:`)
```yaml
# Negate any pattern with "not:" prefix
tools: "match:not:arrayLength:0"        # Array should NOT be empty
name: "match:not:startsWith:invalid_"   # Name should NOT start with "invalid_"
text: "match:not:contains:error"        # Text should NOT contain "error"
```

#### **8. Date/Time Validation**
```yaml
createdAt: "match:dateValid"                        # Valid date/timestamp
publishDate: "match:dateAfter:2023-01-01"          # After specific date
expireDate: "match:dateBefore:2025-01-01"          # Before specific date
eventDate: "match:dateBetween:2023-01-01:2024-12-31" # Date range
lastUpdate: "match:dateAge:1d"                     # Within last day
```

### **🚨 Critical Anti-Patterns (Common Errors)**
```yaml
# ❌ FATAL - Duplicate YAML keys (overwrites previous)
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # OVERWRITES previous line!

# ❌ WRONG - Mixing patterns in same object
result:
  tools: "match:arrayLength:1"
  match:extractField: "tools.*.name"  # Can't mix in same object

# ❌ WRONG - Array vs Object structure mismatch
result:
  content:
    match:arrayElements:  # But response is single object, not array!
      type: "text"

# ✅ CORRECT - Separate tests for different validations
- it: "should have correct array length"
  expect:
    response:
      result:
        tools: "match:arrayLength:1"

- it: "should extract tool names correctly"  
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: ["read_file"]
```

### **📋 JSON-RPC 2.0 Message Examples**

#### **Tools List Request**
```yaml
request:
  jsonrpc: "2.0"
  id: "tools-1" 
  method: "tools/list"
  params: {}
```

#### **Tool Call Request**
```yaml
request:
  jsonrpc: "2.0"
  id: "call-1"
  method: "tools/call"
  params:
    name: "read_file"
    arguments:
      path: "test.txt"
```

#### **Response Validation**
```yaml
expect:
  response:
    jsonrpc: "2.0"
    id: "call-1"
    result:
      content:
        - type: "text"
          text: "File contents here"
      isError: false
  stderr: "toBeEmpty"
```

## 🧪 Testing Strategy & Development

### **Test Suite Overview (1300+ Tests - 100% Passing)**

| Test Category | Count | Purpose |
|---------------|-------|---------|
| **Unit Tests** | 1205 | Core functionality validation |
| **Programmatic Tests** | 101 | JavaScript/TypeScript API |
| **Integration Tests** | Variable | Real MCP server scenarios |

### **Key Test Categories**
- **Core Engine**: Communication, message handling, process management, stream buffering
- **Pattern Matching**: All 50+ pattern types with comprehensive edge case coverage
- **CLI Interface**: Command parsing, options, output formatting
- **Configuration**: Loading, validation, parsing of config files
- **API Testing**: Programmatic client functionality and lifecycle management

### **Example Servers (Development & Testing)**
- **🗂️ Filesystem Server**: Single `read_file` tool - demonstrates basic MCP structure
- **🔧 Multi-Tool Server**: Calculator, text processor, validator, file manager - real-world scenarios  
- **🌐 API Testing Server**: Complex validation patterns and error handling
- **📊 Data Patterns Server**: Advanced pattern matching demonstrations

### **🎯 Test Execution Commands**

#### **NPM Scripts (Organized Test Suites)**
```bash
# Complete test suites
npm run test:all           # All 1300+ tests (unit + integration + programmatic)
npm run test:unit          # Unit tests only (1205 tests)
npm run test:examples      # Integration tests (filesystem + multitool + api + data-patterns)
npm run test:programmatic  # Programmatic API tests (101 tests)

# Focused testing
npm run test:filesystem    # Filesystem server validation
npm run test:multitool     # Multi-tool server scenarios
npm run test:unit:patterns # Pattern matching validation
npm run test:unit:core     # Core engine tests
```

#### **Node.js Test Runner (Individual Files)**
```bash
# ✅ CORRECT - Use for individual files & patterns
node --test test/core/MCPCommunicator.test.js
node --test test/**/*.test.js
node --test --experimental-test-coverage test/patterns/*.test.js

# ❌ WRONG - Don't use npm test with individual files
npm test test/core/configParser.test.js  # Runs full suite instead!
```

### **🏗️ Development Standards**

#### **Code Quality Requirements**
- **✅ Modern ES2020+**: async/await, destructuring, modules
- **✅ Comprehensive Error Handling**: try/catch, proper propagation
- **✅ Input Validation**: All inputs validated and sanitized
- **✅ Performance**: Non-blocking I/O, efficient algorithms
- **✅ Security**: No eval(), secure defaults, proper sanitization
- **✅ Testing**: 100% coverage, edge cases, integration scenarios

#### **Architecture Principles**
- **✅ Single Responsibility**: Each module has ONE clear purpose (50-300 lines)
- **✅ Modular Design**: Clean imports/exports, no circular dependencies
- **✅ Handler Patterns**: Mapping patterns instead of if-else chains
- **✅ Pure Functions**: Stateless functions with clear inputs/outputs
- **✅ Descriptive Naming**: Function names clearly describe purpose

#### **Required Dependencies**
- **Commander.js**: CLI argument parsing with option inheritance
- **js-yaml**: YAML parsing with validation
- **chalk**: Colored terminal output
- **jest-diff**: Rich diff visualization
- **glob**: File pattern matching
- **child_process**: MCP stdio communication

#### **❌ Anti-Patterns to Avoid**
- Magic numbers/strings without constants
- Commented-out code in production
- Unnecessary dependencies or bloat
- Global state unless absolutely necessary
- Silent failures or catch-all error swallowing
- Blocking I/O operations
- Creating unnecessary analysis files that waste context space

### **📊 Performance & Security**
- **Memory Management**: Proper cleanup of child processes and streams
- **Timeout Management**: Configurable timeouts for server operations
- **Process Isolation**: Child processes run in controlled environments
- **Resource Cleanup**: Graceful shutdown and resource deallocation
- **Input Sanitization**: All user inputs validated and sanitized
- **Secure Defaults**: Conservative timeout and resource limits

## 🚀 Quick Reference & Commands

### **Essential CLI Commands**
```bash
# Basic testing
conductor "tests/**/*.test.mcp.yml" --config "config.json"

# Interactive tool debugging (query command)
conductor query --config "config.json"                    # List all tools
conductor query tool_name '{"param": "value"}' --config "config.json"

# Enhanced debugging options
conductor "tests/**/*.test.mcp.yml" --config "config.json" --verbose --debug --timing
conductor "tests/**/*.test.mcp.yml" --config "config.json" --errors-only --group-errors

# CI/CD automation
conductor "tests/**/*.test.mcp.yml" --config "config.json" --json --quiet
```

### **Testing Commands**
```bash
# ✅ Complete test suites (use npm run)
npm run test:all           # All 1300+ tests
npm run test:unit          # Unit tests (1205)
npm run test:examples      # Integration tests (varies)
npm run test:programmatic  # Programmatic API (101)

# ✅ Individual files (use node --test)
node --test test/core/MCPCommunicator.test.js
node --test --experimental-test-coverage test/**/*.test.js

# ❌ NEVER do this
npm test test/core/configParser.test.js  # Runs full suite, ignores file!
```

### **Common YAML Test Patterns**
```yaml
# Basic structure
description: "Test suite description"
tests:
  - it: "Test description"
    request: {jsonrpc: "2.0", id: "1", method: "tools/list", params: {}}
    expect: {response: {jsonrpc: "2.0", id: "1", result: {tools: "match:arrayLength:3"}}}

# Essential patterns
tools: "match:arrayLength:3"              # Array length validation
text: "match:contains:MCP"                # String contains
text: "match:regex:\\d+ files"            # Regex matching
tools: "match:arrayContains:name:read_file" # Array contains object field
tools: "match:not:arrayLength:0"          # Pattern negation

# Field extraction
result:
  match:extractField: "tools.*.name"
  value: ["tool1", "tool2", "tool3"]

# Array elements validation
tools:
  match:arrayElements:
    name: "match:type:string"
    description: "match:type:string"
```

### **Programmatic API Essentials**
```javascript
// Basic setup
const client = await connect('./config.json');

// CRITICAL: Always prevent test interference
beforeEach(() => client.clearAllBuffers());

// Core operations
const tools = await client.listTools();
const result = await client.callTool('tool_name', {args});
await client.disconnect();
```

### **Configuration Template**
```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./server-directory",
  "startupTimeout": 5000,
  "readyPattern": "Server ready"
}
```

### **Terminal Command Limitations**
- ❌ `timeout` and `gtimeout` not available on this system
- ✅ Use MCP Conductor's built-in `startupTimeout` configuration
- ✅ Use Node.js `child_process` timeout options for programmatic testing

---

**This comprehensive guide ensures consistent, high-quality development practices for MCP Conductor and related MCP server testing scenarios.**
