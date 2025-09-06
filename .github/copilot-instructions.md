# MCP Conductor - Copilot Instructions

## Project Overview

**MCP Conductor** is a comprehensive Node.js testing library specifically designed for Model Context Protocol (MCP) servers. It provides declarative YAML-based testing with robust MCP protocol compliance, 11+ verified pattern matching capabilities (including partial matching, array validation, field extraction, type checking), and rich reporting capabilities.

## Core Persona
You are a senior Node.js developer specializing in Model Context Protocol (MCP) systems and testing frameworks. You are highly critical, detail-oriented, and demand the highest standards of code quality, maintainability, and performance.

## Project Architecture

### 📁 Directory Structure
```
mcp-conductor/
├── bin/
│   └── conductor.js                 # CLI entrypoint
├── src/                            # Core library modules
│   ├── cli/                        # CLI-specific modules
│   │   ├── reporter.js             # Rich output formatting & reporting
│   │   ├── testParser.js           # YAML test file parsing
│   │   ├── testRunner.js           # Main test execution orchestrator (refactored)
│   │   ├── patternMatcher.js       # Pattern matching logic for YAML tests
│   │   ├── equalityMatcher.js      # Deep equality comparison with pattern support
│   │   ├── fieldExtractor.js       # Object field extraction using dot notation
│   │   ├── mcpHandshake.js         # MCP protocol handshake operations
│   │   └── testExecutor.js         # Individual test execution
│   ├── core/                       # Core engine modules
│   │   ├── configParser.js         # Configuration validation & loading
│   │   └── MCPCommunicator.js      # Low-level MCP protocol communication
│   ├── programmatic/               # Programmatic testing API
│   │   └── MCPClient.js            # Node.js test runner friendly MCP client
│   └── index.js                    # Main programmatic API exports
├── test/                           # Comprehensive unit test suite
│   ├── configParser.test.js        # Config parser tests
│   ├── testParser.test.js          # YAML parser tests
│   ├── MCPCommunicator.test.js     # Protocol communication tests
│   ├── testRunner.test.js          # Test execution tests
│   ├── reporter.test.js            # Reporter functionality tests
│   ├── cli.test.js                 # CLI integration tests
│   ├── index.test.js               # Main API tests
│   ├── MCPClient.test.js           # Programmatic client tests
│   └── helpers.js                  # Test utilities
├── examples/                       # Working examples & demo servers
│   ├── filesystem-server/          # Single-tool file reading server
│   │   ├── server.js               # MCP filesystem server implementation
│   │   ├── config.json             # Server configuration
│   │   ├── filesystem.test.mcp.yml # Main YAML tests
│   │   ├── advanced.test.mcp.yml   # Advanced pattern tests
│   │   ├── filesystem-tools-only.test.mcp.yml    # Tools-only tests
│   │   ├── filesystem-execution-only.test.mcp.yml # Execution-only tests
│   │   ├── filesystem-server.programmatic.test.js # Programmatic tests
│   │   └── README.md               # Example documentation
│   ├── multi-tool-server/          # Multi-tool comprehensive server
│   │   ├── server.js               # Multi-tool MCP server
│   │   ├── config.json             # Server configuration
│   │   ├── multi-tool.test.mcp.yml # YAML tests
│   │   ├── multi-tool-server.programmatic.test.js # Programmatic tests
│   │   └── README.md               # Example documentation
│   ├── shared-test-data/           # Test data files for validation
│   │   ├── hello.txt               # Sample text file
│   │   ├── numbers.txt             # Number patterns
│   │   ├── emails.txt              # Email validation data
│   │   ├── log-entries.txt         # Log format examples
│   │   ├── status.txt              # Status messages
│   │   ├── identifiers.txt         # UUID/identifier patterns
│   │   ├── api-response.json       # JSON response samples
│   │   ├── complex-api.json        # Complex nested JSON
│   │   └── README.md               # Test data documentation
│   ├── simple-test.js              # Basic programmatic example
│   └── README.md                   # Examples overview
├── docs-site/                      # GitHub Pages documentation site
│   ├── _config.yml                 # Jekyll configuration
│   ├── index.md                    # Landing page
│   ├── installation.md             # Installation guide
│   ├── quick-start.md              # Getting started guide
│   ├── yaml-testing.md             # YAML testing documentation
│   ├── programmatic-testing.md     # Programmatic API documentation
│   ├── pattern-matching.md         # Pattern matching reference
│   ├── api-reference.md            # Complete API reference
│   ├── examples.md                 # Examples and best practices
│   ├── troubleshooting.md          # Common issues and solutions
│   ├── development.md              # Contributing guide
│   ├── ai-agents.md                # AI agent integration guide
│   └── Gemfile                     # Jekyll dependencies
├── temp-testing/                   # Development testing workspace
├── .github/                        # GitHub configuration
│   └── copilot-instructions.md     # This file - AI agent guidance
├── AGENTS.md                       # AI agent integration guide
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT license
├── README.md                       # Minimal overview (references docs-site)
└── package.json                    # Node.js project configuration
```

### 🏗️ Core Architecture Components

#### 1. **CLI Entrypoint** (`bin/conductor.js`)
- **Purpose**: Command-line interface with Commander.js integration
- **Responsibilities**: Argument parsing, config loading, test discovery, orchestration
- **Key Features**: Glob pattern support, exit code management, error handling
- **Usage**: `conductor "tests/**/*.test.mcp.yml" --config "config.json"` (after npm install -g)

#### 2. **Configuration Parser** (`src/core/configParser.js`)
- **Purpose**: JSON configuration validation and loading
- **Schema**: Validates MCP server connection details
- **Features**: Default value assignment, environment variable merging, comprehensive validation
- **Required Fields**: `name`, `command`, `args`
- **Optional Fields**: `cwd`, `env`, `startupTimeout`, `readyPattern`

#### 3. **Test Parser** (`src/cli/testParser.js`)
- **Purpose**: YAML test file parsing and validation
- **Features**: Glob pattern support, JSON-RPC 2.0 validation, schema compliance
- **Structure**: Validates test suites with `description`, `tests[]` arrays
- **Validation**: Ensures proper JSON-RPC message structure and MCP compliance

#### 4. **MCP Communicator** (`src/core/MCPCommunicator.js`)
- **Purpose**: Low-level stdio communication with MCP servers
- **Protocol**: JSON-RPC 2.0 over stdio transport
- **Features**: Async stream handling, message framing, buffer management
- **Lifecycle**: Server startup, handshake, communication, graceful shutdown
- **Error Handling**: Timeout management, stderr capture, process monitoring

#### 5. **Test Runner Suite** (`src/cli/testRunner.js` + supporting modules)
- **Purpose**: Modular test execution engine following single responsibility principles
- **Architecture**: Refactored from monolithic 447-line file into 6 focused modules:

##### **5a. Test Runner Orchestrator** (`src/cli/testRunner.js`) - 90 lines
- **Single Responsibility**: Test suite orchestration and server lifecycle management
- **Functions**: `runTests()`, server startup/shutdown, handshake coordination
- **Features**: Clean separation of concerns, error handling, graceful cleanup

##### **5b. Pattern Matcher** (`src/cli/patternMatcher.js`) - 118 lines  
- **Single Responsibility**: Pattern matching logic for YAML test assertions
- **Functions**: `matchPattern()` with specialized handlers for each pattern type
- **Patterns**: regex, length, contains, startsWith, endsWith, arrayContains, type checking, etc.
- **Architecture**: Handler mapping pattern for easy extension

##### **5c. Equality Matcher** (`src/cli/equalityMatcher.js`) - 228 lines
- **Single Responsibility**: Deep equality comparison with pattern support
- **Functions**: `deepEqual()`, `deepEqualPartial()`, object/array comparison
- **Features**: Special pattern objects, partial matching, array element matching
- **Integration**: Uses pattern matcher and field extractor for complex validations

##### **5d. Field Extractor** (`src/cli/fieldExtractor.js`) - 58 lines
- **Single Responsibility**: Extract fields from nested objects using dot notation
- **Functions**: `extractFieldFromObject()`, wildcard array handling
- **Features**: Supports `tools.*.name`, numeric indices, deep object traversal

##### **5e. MCP Handshake Handler** (`src/cli/mcpHandshake.js`) - 61 lines
- **Single Responsibility**: MCP protocol handshake operations
- **Functions**: `performMCPHandshake()`, initialize/initialized message handling
- **Protocol**: Clean MCP 2025-06-18 protocol implementation, error validation

##### **5f. Test Executor** (`src/cli/testExecutor.js`) - 99 lines  
- **Single Responsibility**: Individual test execution and validation
- **Functions**: `executeTest()`, structured response/stderr validation
- **Features**: Clean validation result objects, comprehensive error reporting

#### 6. **Reporter** (`src/cli/reporter.js`)
- **Purpose**: Rich test result formatting and colored output
- **Features**: Colored output, detailed diffs, summary statistics
- **Output**: Pass/fail indicators, diff visualization, execution summaries
- **Integration**: Works with jest-diff for rich comparison visualization

#### 7. **Programmatic Testing API** (`src/programmatic/MCPClient.js`)
- **Purpose**: Node.js test runner friendly MCP client for JavaScript/TypeScript test integration
- **Features**: Promise-based API, lifecycle management, automatic handshake handling
- **Integration**: Works with Node.js test runner, Jest, Mocha, or any testing framework
- **Methods**: `connect()`, `disconnect()`, `listTools()`, `callTool()`, `sendMessage()`
- **Error Handling**: Proper exception propagation, stderr capture, timeout management
- **Lifecycle**: Automated server startup, MCP handshake, graceful shutdown

## Modular Architecture Principles

### **Design Philosophy**
The MCP Conductor test runner follows strict architectural principles to ensure maintainability, testability, and readability:

#### **Single Responsibility Principle (SRP)**
Each module has a single, well-defined responsibility:
- **patternMatcher.js**: Only handles pattern matching logic
- **equalityMatcher.js**: Only handles deep equality comparison
- **fieldExtractor.js**: Only handles object field extraction
- **mcpHandshake.js**: Only handles MCP protocol handshake
- **testExecutor.js**: Only handles individual test execution
- **testRunner.js**: Only orchestrates the overall test flow

#### **KISS (Keep It Simple, Stupid)**
- Functions are focused and do one thing well
- Clear function names that describe their purpose
- Minimal nesting and early returns for readability
- Handler mapping patterns instead of long if-else chains

#### **Dependency Inversion**
- Modules import only what they need
- Clear dependency hierarchy prevents circular dependencies
- High-level modules don't depend on low-level details

#### **Modular Benefits**
- **Maintainability**: Changes to one module don't affect others
- **Testability**: Each module can be unit tested independently
- **Readability**: Smaller, focused files are easier to understand
- **Extensibility**: New patterns or functionality can be added without modifying existing code

### **Module Dependencies**
```
testRunner.js (Main Orchestrator)
├── patternMatcher.js (Pattern Matching Logic)  
├── equalityMatcher.js (Deep Comparison Logic)
│   ├── imports: patternMatcher.js
│   └── imports: fieldExtractor.js
├── fieldExtractor.js (Object Field Extraction)
├── mcpHandshake.js (MCP Protocol Handshake)
└── testExecutor.js (Individual Test Execution)
    ├── imports: equalityMatcher.js
    └── imports: patternMatcher.js
```

### **Pattern Handler Architecture**
The pattern matching system uses a clean handler mapping approach:

```javascript
// Pattern handlers are organized by type
const patternHandlers = {
  'regex:': handleRegexPattern,
  'length:': handleLengthPattern,
  'arrayLength:': handleArrayLengthPattern,
  'contains:': handleContainsPattern,
  'startsWith:': handleStartsWithPattern,
  'endsWith:': handleEndsWithPattern,
  'arrayContains:': handleArrayContainsPattern,
  'type:': handleTypePattern,
  'exists': handleExistsPattern,
  'count:': handleCountPattern
};

// Easy to extend with new pattern types
// No modification of existing code required
```

### **Refactoring Results**
- **Before**: Single 447-line monolithic file
- **After**: 6 focused modules, largest is 228 lines
- **Test Coverage**: 212/212 tests passing (100%)
- **Backward Compatibility**: All existing APIs preserved via re-exports

## Programmatic Testing

MCP Conductor provides both YAML-based declarative testing and programmatic testing through a JavaScript/TypeScript API. The programmatic approach enables integration with existing test suites and provides more flexibility for complex test scenarios.

### API Structure

#### **Main Entry Point** (`src/index.js`)
```javascript
import { createClient, connect, MCPClient } from 'mcp-conductor';

// Create client instance (not connected)
const client = await createClient('./config.json');

// Create and auto-connect client 
const connectedClient = await connect('./config.json');

// Direct client instantiation
const directClient = new MCPClient(configObject);
```

#### **MCPClient Class** (`src/programmatic/MCPClient.js`)

##### **Core Methods**
- **`async connect()`**: Start server and perform MCP handshake
- **`async disconnect()`**: Gracefully shutdown server connection  
- **`async listTools()`**: Retrieve available tools from server
- **`async callTool(name, arguments)`**: Execute specific tool with arguments
- **`async sendMessage(jsonRpcMessage)`**: Send raw JSON-RPC message
- **`getStderr()`**: Retrieve current stderr buffer content
- **`clearStderr()`**: Clear stderr buffer

##### **Properties**
- **`connected`**: Boolean indicating connection status
- **`config`**: Configuration object used for connection
- **`handshakeCompleted`**: Boolean indicating MCP handshake status

### Programmatic Test Patterns

#### **Node.js Test Runner Integration**
```javascript
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { createClient } from 'mcp-conductor';

describe('MCP Server Tests', () => {
  let client;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  after(async () => {
    if (client && client.connected) {
      await client.disconnect();
    }
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools), 'Tools should be an array');
    assert.ok(tools.length > 0, 'Should have at least one tool');
  });

  test('should execute tool successfully', async () => {
    const result = await client.callTool('my_tool', { param: 'value' });
    assert.ok(result.content, 'Should return content');
    assert.equal(result.content[0].type, 'text', 'Should return text content');
  });

  test('should handle stderr validation', async () => {
    client.clearStderr();
    await client.callTool('my_tool', {});
    const stderr = client.getStderr();
    assert.equal(stderr.trim(), '', 'Should have no stderr output');
  });
});
```

#### **Jest Integration**
```javascript
import { createClient } from 'mcp-conductor';

describe('MCP Server Integration', () => {
  let client;

  beforeAll(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  afterAll(async () => {
    await client?.disconnect();
  });

  it('should connect successfully', () => {
    expect(client.connected).toBe(true);
    expect(client.handshakeCompleted).toBe(true);
  });

  it('should validate tool schema', async () => {
    const tools = await client.listTools();
    const myTool = tools.find(t => t.name === 'my_tool');
    
    expect(myTool).toBeDefined();
    expect(myTool.description).toMatch(/meaningful description/);
    expect(myTool.inputSchema).toHaveProperty('properties');
  });

  it('should handle tool execution with complex validation', async () => {
    const result = await client.callTool('complex_tool', {
      param1: 'test',
      param2: { nested: 'value' }
    });

    expect(result).toMatchObject({
      content: expect.arrayContaining([
        expect.objectContaining({
          type: 'text',
          text: expect.stringMatching(/expected pattern/)
        })
      ])
    });
  });
});
```

### Advanced Programmatic Patterns

#### **Tool Response Validation**
```javascript
test('should validate complex tool response', async () => {
  const result = await client.callTool('list_components');
  
  // Extract component names from response
  const text = result.content[0].text;
  const componentPattern = /- \*\*(\w+)\*\* \(component\)/g;
  const components = [];
  let match;
  
  while ((match = componentPattern.exec(text)) !== null) {
    components.push(match[1]);
  }

  // Validate count and sorting
  assert.equal(components.length, 129, 'Should have 129 components');
  
  const sorted = [...components].sort();
  assert.deepEqual(components, sorted, 'Components should be alphabetically sorted');
  
  // Validate specific components
  const expectedComponents = ['Button', 'DataTable', 'Modal'];
  for (const expected of expectedComponents) {
    assert.ok(components.includes(expected), `Should include ${expected}`);
  }
});
```

#### **Error Handling and Recovery**
```javascript
test('should handle server errors gracefully', async () => {
  try {
    await client.callTool('nonexistent_tool', {});
    assert.fail('Should have thrown an error');
  } catch (error) {
    assert.ok(error.message.includes('Failed to call tool'));
    assert.ok(client.connected, 'Client should remain connected after error');
  }
});

test('should reconnect after server failure', async () => {
  // Simulate server failure scenario
  await client.disconnect();
  assert.equal(client.connected, false);
  
  // Reconnect
  await client.connect();
  assert.equal(client.connected, true);
  
  // Verify functionality restored
  const tools = await client.listTools();
  assert.ok(Array.isArray(tools));
});
```

#### **Performance and Timeout Testing**
```javascript
test('should complete tool execution within timeout', async () => {
  const startTime = Date.now();
  
  await client.callTool('slow_operation', {});
  
  const duration = Date.now() - startTime;
  assert.ok(duration < 5000, 'Should complete within 5 seconds');
});

test('should handle concurrent tool calls', async () => {
  const promises = Array.from({ length: 5 }, (_, i) => 
    client.callTool('concurrent_tool', { id: i })
  );
  
  const results = await Promise.all(promises);
  
  assert.equal(results.length, 5);
  results.forEach((result, index) => {
    assert.ok(result.content[0].text.includes(`id: ${index}`));
  });
});
```

### Programmatic vs YAML Testing

#### **When to Use Programmatic Testing**
- **Complex Validation Logic**: When you need custom validation beyond pattern matching
- **Dynamic Test Generation**: Creating tests based on server responses or external data
- **Integration Testing**: Incorporating MCP testing into existing test suites
- **Advanced Error Scenarios**: Testing complex failure modes and recovery
- **Performance Testing**: Load testing, concurrent execution, timeout validation
- **Stateful Testing**: Tests that require multiple sequential operations

#### **When to Use YAML Testing**
- **Declarative Scenarios**: Simple request/response validation
- **Pattern Matching**: Leveraging 11+ verified pattern types
- **Quick Validation**: Rapid test creation without code
- **Documentation**: Self-documenting test scenarios
- **CI/CD Integration**: Command-line execution in automated pipelines
- **Non-Developer Testing**: Accessible to QA engineers and analysts

### Best Practices for Programmatic Testing

#### **Connection Management**
```javascript
// ✅ CORRECT - Proper lifecycle management
describe('Test Suite', () => {
  let client;

  beforeEach(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  afterEach(async () => {
    await client?.disconnect();
  });
});

// ❌ WRONG - No cleanup
test('bad example', async () => {
  const client = await connect('./config.json');
  // Missing disconnect - resource leak
});
```

#### **Error Handling**
```javascript
// ✅ CORRECT - Comprehensive error handling
test('should handle tool errors', async () => {
  try {
    const result = await client.callTool('error_tool', {});
    if (result.isError) {
      assert.ok(result.content[0].text.includes('Expected error'));
    }
  } catch (error) {
    assert.ok(error.message.includes('Expected pattern'));
  }
});

// ❌ WRONG - Unhandled exceptions
test('bad error handling', async () => {
  await client.callTool('unknown_tool', {}); // May throw unhandled exception
});
```

#### **Assertion Strategies**
```javascript
// ✅ CORRECT - Specific, meaningful assertions
test('comprehensive validation', async () => {
  const result = await client.callTool('validate_data', { input: 'test' });
  
  assert.ok(result, 'Should return result object');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(result.content[0].type, 'text', 'Content type should be text');
  assert.ok(result.content[0].text.length > 0, 'Should have non-empty text');
  assert.ok(!result.isError, 'Should not indicate error state');
  
  // Validate stderr
  const stderr = client.getStderr();
  assert.equal(stderr.trim(), '', 'Should produce no stderr');
});

// ❌ WRONG - Vague assertions
test('weak validation', async () => {
  const result = await client.callTool('some_tool', {});
  assert.ok(result); // Too generic
});
```

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

#### **Common Mistakes to Avoid**
```yaml
# ❌ WRONG - Duplicate keys
result:
  tools: "match:arrayElements"
  tools:  # This creates a duplicate key error
    - name: "string"

# ✅ CORRECT - Proper nesting
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
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

#### **Enhanced Pattern Examples**

##### **Array Length Validation**
```yaml
- it: "should have exactly 6 tools"
  request:
    jsonrpc: "2.0"
    id: "length-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "length-1"
      result:
        tools: "match:arrayLength:6"
    stderr: "toBeEmpty"
```

##### **Array Elements Pattern**
```yaml
- it: "should have all tools with names and descriptions"
  request:
    jsonrpc: "2.0"
    id: "elements-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "elements-1"
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:type:string"
    stderr: "toBeEmpty"
```

##### **Field Extraction with Array Contains**
```yaml
- it: "should contain specific tool names"
  request:
    jsonrpc: "2.0"
    id: "extract-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "extract-1"
      result:
        match:extractField: "tools.*.name"
        value: "match:arrayContains:list_components"
    stderr: "toBeEmpty"
```

##### **Partial Matching**
```yaml
- it: "should have search tool with correct properties"
  request:
    jsonrpc: "2.0"
    id: "partial-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "partial-1"
      result:
        match:partial:
          tools:
            - name: "search_docs"
              description: "match:contains:search"
    stderr: "toBeEmpty"
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

### Unit Tests (103 tests - 100% passing)
- **configParser.test.js**: Configuration validation and loading
- **testParser.test.js**: YAML parsing and validation
- **MCPCommunicator.test.js**: Protocol communication and lifecycle
- **testRunner.test.js**: Test execution and pattern matching (includes modular components)
- **reporter.test.js**: Output formatting and reporting
- **cli.test.js**: CLI integration and argument parsing

### Integration Tests (47 tests - 100% passing)
- **Filesystem Server** (27 tests): File operations, regex patterns, string patterns
- **Multi-Tool Server** (20 tests): Calculator, text processing, validation, file management

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

## Real-World Testing Success

### Production Server Validation
MCP Conductor has been successfully tested with production MCP servers, demonstrating real-world applicability:

#### **Production Server Testing**
- **Server Types**: Successfully tested against multiple real-world MCP servers
- **Testing Coverage**: Comprehensive test suites with both YAML and programmatic approaches
- **Success Rate**: 100% passing across both testing methodologies
- **Complex Scenarios**: Advanced pattern matching and validation capabilities verified

#### **Key Validations**
- **Tool Discovery**: Verified server tool listing and metadata validation
- **Format Consistency**: Validated response formatting patterns across servers
- **Response Handling**: Tested varying response formats and structures
- **Error Scenarios**: Confirmed proper error handling and edge cases
- **Pattern Matching**: Real-world validation of all 11+ pattern types

#### **Pattern Matching in Production**
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

#### **YAML Pattern Success**
```yaml
# Production-tested YAML validation
- it: "should list tools with proper structure"
  request:
    jsonrpc: "2.0"
    id: "tools-test"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0" 
      id: "tools-test"
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:type:string"
            inputSchema: "match:type:object"
```

This validates the framework's production readiness and demonstrates successful testing of complex, real-world MCP servers.

---

## Documentation Architecture

### GitHub Pages Documentation Site
MCP Conductor includes a comprehensive documentation site hosted at `https://conductor.rhino-inquisitor.com/`:

#### **Documentation Structure** (`docs-site/`)
- **`index.md`**: Landing page with overview and quick start
- **`installation.md`**: Installation and setup instructions
- **`quick-start.md`**: 5-minute getting started guide
- **`yaml-testing.md`**: Complete YAML testing documentation
- **`programmatic-testing.md`**: JavaScript/TypeScript API documentation
- **`pattern-matching.md`**: 11+ pattern types reference
- **`api-reference.md`**: Complete API documentation
- **`examples.md`**: Working examples and best practices
- **`troubleshooting.md`**: Common issues and solutions
- **`development.md`**: Contributing guidelines
- **`ai-agents.md`**: AI coding assistant integration guide

#### **Jekyll Configuration**
- **Theme**: GitHub Pages default theme with custom CSS
- **Navigation**: Automatic relative URL generation
- **Styling**: Professional responsive design with grid layouts
- **Features**: Syntax highlighting, responsive design, modern UX

#### **Repository Documentation Strategy**
- **Repository README**: Minimal overview with links to documentation site
- **Documentation Site**: Comprehensive, authoritative documentation
- **Single Source of Truth**: All detailed docs live in docs-site/
- **Easy Maintenance**: Centralized documentation reduces duplication

---

## Quick Reference

### Common Commands
```bash
# Test specific server
conductor "./tests/my-test.yml" --config "./my-config.json"

# Test with glob patterns
conductor "./tests/**/*.test.mcp.yml" --config "./config.json"

# Test examples (from project root)
npm run test:examples
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
