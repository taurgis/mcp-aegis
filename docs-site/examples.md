---
title: Examples - Real-World MCP Server Testing Scenarios
layout: page
description: >-
  Comprehensive examples of MCP Conductor testing with real-world Model Context
  Protocol servers. Includes YAML declarative tests, programmatic JavaScript/TypeScript
  examples, and complete testing scenarios for different MCP server types.
keywords: >-
  MCP Conductor examples, Model Context Protocol testing examples, MCP server
  testing scenarios, YAML MCP test examples, programmatic MCP testing examples
canonical_url: "https://conductor.rhino-inquisitor.com/examples"
---

# Examples
## Real-World MCP Server Testing Scenarios

Comprehensive examples showing real-world usage of MCP Conductor with both YAML declarative and programmatic JavaScript/TypeScript testing approaches for Model Context Protocol servers.

## Quick Setup

Before diving into examples, quickly set up MCP Conductor in your project:

```bash
# Navigate to your MCP project
cd my-mcp-project

# Initialize MCP Conductor
npx mcp-conductor init

# This creates the test structure and configuration automatically
```

## Table of Contents
- [Quick Examples](#quick-examples)
- [Filesystem Server](#filesystem-server)
- [Multi-Tool Server](#multi-tool-server)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Quick Examples

### Basic Tool Testing
```yaml
description: "Basic MCP Server Tool Tests"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "list-tools"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "list-tools"
        result:
          tools: "match:type:array"
      stderr: "toBeEmpty"

  - it: "should execute tool successfully"
    request:
      jsonrpc: "2.0"
      id: "call-tool"
      method: "tools/call"
      params:
        name: "hello"
        arguments: { name: "World" }
    expect:
      response:
        jsonrpc: "2.0"
        id: "call-tool"
        result:
          content:
            - type: "text"
              text: "match:contains:Hello, MCP"
          isError: false
      stderr: "toBeEmpty"
```

### Basic Programmatic Testing
```javascript
import { createClient } from 'mcp-conductor';
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';

describe('Basic MCP Tests', () => {
  let client;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  after(async () => {
    await client?.disconnect();
  });

  test('should connect and list tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools));
    assert.ok(tools.length > 0);
  });

  test('should execute tool', async () => {
    const result = await client.callTool('hello', { name: 'Test' });
    assert.ok(result.content[0].text.includes('Hello, MCP'));
  });
});
```

## Filesystem Server

Complete example demonstrating file operations testing.

### Configuration
**config.json**
```json
{
  "name": "Filesystem MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./examples/filesystem-server",
  "startupTimeout": 5000
}
```

### YAML Tests
**filesystem.test.mcp.yml**
```yaml
description: "Filesystem MCP Server Tests"
tests:
  # Tool discovery
  - it: "should list file operations tool"
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
            - name: "read_file"
              description: "match:contains:read"
              inputSchema:
                type: "object"
                properties:
                  path:
                    type: "string"
                    description: "match:contains:file path"
                required: ["path"]
      stderr: "toBeEmpty"

  # Successful file read
  - it: "should read existing file successfully"
    request:
      jsonrpc: "2.0"
      id: "read-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "../shared-test-data/hello.txt"
    expect:
      response:
        jsonrpc: "2.0"
        id: "read-1"
        result:
          content:
            - type: "text"
              text: "Hello, MCP Conductor!"
          isError: false
      stderr: "toBeEmpty"

  # Error handling
  - it: "should handle non-existent file gracefully"
    request:
      jsonrpc: "2.0"
      id: "error-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "./nonexistent.txt"
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-1"
        result:
          isError: true
          content:
            - type: "text"
              text: "match:contains:ENOENT"
      stderr: "toBeEmpty"

  # Pattern validation
  - it: "should validate file content patterns"
    request:
      jsonrpc: "2.0"
      id: "pattern-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "../shared-test-data/numbers.txt"
    expect:
      response:
        jsonrpc: "2.0"
        id: "pattern-1"
        result:
          content:
            - type: "text"
              text: "match:regex:\\d+\\.\\d+"  # Decimal numbers
          isError: false
      stderr: "toBeEmpty"

  # Email validation
  - it: "should read and validate email format"
    request:
      jsonrpc: "2.0"
      id: "email-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "../shared-test-data/emails.txt"
    expect:
      response:
        jsonrpc: "2.0"
        id: "email-1"
        result:
          content:
            - type: "text"
              text: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
          isError: false
      stderr: "toBeEmpty"
```

### Programmatic Tests
**filesystem-server.programmatic.test.js**
```javascript
import { createClient } from 'mcp-conductor';
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';

describe('Filesystem MCP Server - Programmatic', () => {
  let client;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  after(async () => {
    await client?.disconnect();
  });

  test('should have read_file tool available', async () => {
    const tools = await client.listTools();
    const readFileTool = tools.find(tool => tool.name === 'read_file');
    
    assert.ok(readFileTool, 'Should have read_file tool');
    assert.ok(readFileTool.description.includes('read'), 'Should describe reading');
    assert.equal(readFileTool.inputSchema.type, 'object');
    assert.ok(readFileTool.inputSchema.required.includes('path'));
  });

  test('should read file content correctly', async () => {
    const result = await client.callTool('read_file', {
      path: '../shared-test-data/hello.txt'
    });

    assert.equal(result.isError, false);
    assert.ok(Array.isArray(result.content));
    assert.equal(result.content[0].type, 'text');
    assert.ok(result.content[0].text.includes('Hello, MCP Conductor!'));
    
    // Verify no stderr output
    const stderr = client.getStderr();
    assert.equal(stderr.trim(), '');
  });

  test('should handle file read errors', async () => {
    const result = await client.callTool('read_file', {
      path: './nonexistent-file.txt'
    });

    assert.equal(result.isError, true);
    assert.ok(result.content[0].text.includes('ENOENT'));
  });

  test('should validate file content with patterns', async () => {
    const result = await client.callTool('read_file', {
      path: '../shared-test-data/numbers.txt'
    });

    // Extract numbers using regex
    const numberPattern = /\d+/g;
    const matches = result.content[0].text.match(numberPattern);
    
    assert.ok(matches, 'Should find numbers');
    assert.ok(matches.length > 0, 'Should have at least one number');
  });

  test('should handle concurrent file reads', async () => {
    const files = [
      '../shared-test-data/hello.txt',
      '../shared-test-data/numbers.txt',
      '../shared-test-data/emails.txt'
    ];

    const promises = files.map(file => 
      client.callTool('read_file', { path: file })
    );

    const results = await Promise.all(promises);
    
    assert.equal(results.length, 3);
    results.forEach((result, index) => {
      assert.equal(result.isError, false, `File ${files[index]} should read successfully`);
      assert.ok(result.content[0].text.length > 0, `File ${files[index]} should have content`);
    });
  });
});
```

## Multi-Tool Server

Comprehensive server with multiple tools demonstrating various testing scenarios.

### Configuration
**config.json**
```json
{
  "name": "Multi-Tool MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": ".",
  "env": {},
  "startupTimeout": 5000,
  "readyPattern": "Multi-Tool MCP Server started"
}
```

### YAML Tests
**multi-tool.test.mcp.yml**
```yaml
description: "Multi-Tool MCP Server Tests"
tests:
  # Tool discovery with count validation
  - it: "should have exactly 4 tools available"
    request:
      jsonrpc: "2.0"
      id: "count-tools"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "count-tools"
        result:
          tools: "match:arrayLength:4"
      stderr: "toBeEmpty"

  # Tool name extraction and validation
  - it: "should have expected tool names"
    request:
      jsonrpc: "2.0"
      id: "tool-names"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tool-names"
        result:
          match:extractField: "tools.*.name"
          value: "match:arrayContains:calculator"
      stderr: "toBeEmpty"

  # Calculator tool tests
  - it: "should perform addition correctly"
    request:
      jsonrpc: "2.0"
      id: "calc-add"
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
        id: "calc-add"
        result:
          content:
            - type: "text"
              text: "match:regex:Result: 42"
          isError: false
      stderr: "toBeEmpty"

  # Text processor with complex patterns
  - it: "should analyze text and return statistics"
    request:
      jsonrpc: "2.0"
      id: "text-stats"
      method: "tools/call"
      params:
        name: "text_processor"
        arguments:
          text: "Hello world! This is a test."
          operation: "analyze"
    expect:
      response:
        jsonrpc: "2.0"
        id: "text-stats"
        result:
          content:
            - type: "text"
              text: "match:regex:Words: \\d+, Characters: \\d+"
          isError: false
      stderr: "toBeEmpty"

  # Data validator with email validation
  - it: "should validate email addresses"
    request:
      jsonrpc: "2.0"
      id: "validate-email"
      method: "tools/call"
      params:
        name: "data_validator"
        arguments:
          type: "email"
          data: "test@example.com"
    expect:
      response:
        jsonrpc: "2.0"
        id: "validate-email"
        result:
          content:
            - type: "text"
              text: "match:contains:Valid email"
          isError: false
      stderr: "toBeEmpty"

  # File manager operations
  - it: "should check if file exists"
    request:
      jsonrpc: "2.0"
      id: "list-dir"
      method: "tools/call"
      params:
        name: "file_manager"
        arguments:
          action: "exists"
          path: "../shared-test-data/hello.txt"
    expect:
      response:
        jsonrpc: "2.0"
        id: "list-dir"
        result:
          content:
            - type: "text"
              text: "File exists: true"
          isError: false
      stderr: "toBeEmpty"

  # Error handling tests
  - it: "should handle invalid calculator operation"
    request:
      jsonrpc: "2.0"
      id: "calc-error"
      method: "tools/call"
      params:
        name: "calculator"
        arguments:
          operation: "invalid"
          a: 10
          b: 5
    expect:
      response:
        jsonrpc: "2.0"
        id: "calc-error"
        result:
          isError: true
          content:
            - type: "text"
              text: "match:contains:Invalid operation"
      stderr: "toBeEmpty"

  # Comprehensive tool validation
  - it: "should have all tools with proper schemas"
    request:
      jsonrpc: "2.0"
      id: "validate-schemas"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "validate-schemas"
        result:
          tools:
            match:arrayElements:
              name: "match:type:string"
              description: "match:type:string"
              inputSchema:
                type: "object"
                properties: "match:type:object"
                required: "match:type:array"
      stderr: "toBeEmpty"
```

### Programmatic Tests
**multi-tool.programmatic.test.js**
```javascript
import { createClient } from 'mcp-conductor';
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';

describe('Multi-Tool MCP Server - Programmatic', () => {
  let client;
  let tools;

  before(async () => {
    client = await createClient('./multi-tool.config.json');
    await client.connect();
    tools = await client.listTools();
  });

  after(async () => {
    await client?.disconnect();
  });

  test('should have exactly 4 tools', async () => {
    assert.equal(tools.length, 4, 'Should have exactly 4 tools');
    
    const expectedTools = ['calculator', 'text_processor', 'data_validator', 'file_manager'];
    const actualTools = tools.map(t => t.name).sort();
    
    assert.deepEqual(actualTools.sort(), expectedTools.sort());
  });

  test('should validate all tool schemas', async () => {
    tools.forEach(tool => {
      assert.ok(tool.name, `Tool should have name: ${JSON.stringify(tool)}`);
      assert.ok(tool.description, `Tool ${tool.name} should have description`);
      assert.ok(tool.inputSchema, `Tool ${tool.name} should have inputSchema`);
      assert.equal(tool.inputSchema.type, 'object', `Tool ${tool.name} should have object schema`);
      assert.ok(tool.inputSchema.properties, `Tool ${tool.name} should have properties`);
      assert.ok(Array.isArray(tool.inputSchema.required), `Tool ${tool.name} should have required array`);
    });
  });

  // Dynamic test generation for each tool
  describe('Individual Tool Tests', () => {
    const testCases = {
      calculator: { operation: 'add', a: 10, b: 5 },
      text_processor: { text: 'Hello world', operation: 'analyze' },
      data_validator: { type: 'email', data: 'test@example.com' },
      file_manager: { operation: 'list', path: './test-data' }
    };

    Object.entries(testCases).forEach(([toolName, args]) => {
      test(`should execute ${toolName} successfully`, async () => {
        const result = await client.callTool(toolName, args);
        
        assert.equal(result.isError, false, `${toolName} should not return error`);
        assert.ok(Array.isArray(result.content), `${toolName} should return content array`);
        assert.equal(result.content[0].type, 'text', `${toolName} should return text content`);
        assert.ok(result.content[0].text.length > 0, `${toolName} should return non-empty text`);
      });
    });
  });

  test('should perform mathematical operations correctly', async () => {
    const operations = [
      { operation: 'add', a: 15, b: 27, expected: 42 },
      { operation: 'subtract', a: 50, b: 8, expected: 42 },
      { operation: 'multiply', a: 6, b: 7, expected: 42 },
      { operation: 'divide', a: 84, b: 2, expected: 42 }
    ];

    for (const op of operations) {
      const result = await client.callTool('calculator', {
        operation: op.operation,
        a: op.a,
        b: op.b
      });

      assert.equal(result.isError, false, `${op.operation} should not error`);
      assert.ok(result.content[0].text.includes(op.expected.toString()), 
        `${op.operation} should return ${op.expected}`);
    }
  });

  test('should validate different data types', async () => {
    const validations = [
      { type: 'email', data: 'valid@example.com', shouldPass: true },
      { type: 'email', data: 'invalid-email', shouldPass: false },
      { type: 'url', data: 'https://example.com', shouldPass: true },
      { type: 'url', data: 'not-a-url', shouldPass: false }
    ];

    for (const validation of validations) {
      const result = await client.callTool('data_validator', {
        type: validation.type,
        data: validation.data
      });

      if (validation.shouldPass) {
        assert.ok(result.content[0].text.includes('Valid'), 
          `${validation.data} should be valid ${validation.type}`);
      } else {
        assert.ok(result.content[0].text.includes('Invalid'), 
          `${validation.data} should be invalid ${validation.type}`);
      }
    }
  });

  test('should handle concurrent tool execution', async () => {
    const promises = [
      client.callTool('calculator', { operation: 'add', a: 1, b: 1 }),
      client.callTool('text_processor', { text: 'test', operation: 'analyze' }),
      client.callTool('data_validator', { type: 'email', data: 'test@example.com' })
    ];

    const results = await Promise.all(promises);
    
    assert.equal(results.length, 3);
    results.forEach((result, index) => {
      assert.equal(result.isError, false, `Concurrent call ${index} should succeed`);
      assert.ok(result.content[0].text.length > 0, `Concurrent call ${index} should return content`);
    });
  });

  test('should maintain performance standards', async () => {
    const startTime = Date.now();
    
    // Execute multiple operations
    await client.callTool('calculator', { operation: 'add', a: 100, b: 200 });
    await client.callTool('text_processor', { text: 'Performance test text', operation: 'analyze' });
    
    const duration = Date.now() - startTime;
    assert.ok(duration < 1000, 'Operations should complete within 1 second');
  });
});
```

## Best Practices
```

## Best Practices

### ✅ **Test Organization**

#### **Group Related Tests**
```yaml
description: "User Management API Tests"
tests:
  # Authentication
  - it: "should authenticate with valid credentials"
  - it: "should reject invalid credentials"
  - it: "should handle expired tokens"
  
  # User Operations
  - it: "should create new user"
  - it: "should update user profile"
  - it: "should delete user"
  
  # Error Handling
  - it: "should handle missing parameters"
  - it: "should validate input data"
```

#### **Use Descriptive Names**
```yaml
# ✅ Good - Specific and clear
- it: "should return 129 components in alphabetical order"
- it: "should handle file not found errors gracefully"
- it: "should validate email format correctly"

# ❌ Bad - Vague and unclear
- it: "should work correctly"
- it: "test tool functionality"
- it: "error handling"
```

### ✅ **Pattern Selection**

```yaml
# ✅ Good - Appropriate patterns
result:
  tools: "match:arrayLength:6"              # Specific count
  version: "match:regex:v\\d+\\.\\d+\\.\\d+" # Version format
  status: "match:contains:success"          # Partial match

# ❌ Bad - Too generic
result:
  tools: "match:type:array"                 # Doesn't validate count
  version: "match:type:string"              # Doesn't validate format
  status: "match:type:string"               # Doesn't validate content
```

### ✅ **Error Testing**

```yaml
# Test both success and failure cases
- it: "should process valid data successfully"
  request:
    # ... valid request
  expect:
    response:
      result:
        isError: false
        content: "match:type:array"

- it: "should handle invalid data gracefully"
  request:
    # ... invalid request  
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Invalid"
```

### ✅ **Programmatic Best Practices**

```javascript
// ✅ Proper resource management
describe('MCP Tests', () => {
  let client;
  
  beforeEach(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });
  
  afterEach(async () => {
    await client?.disconnect();
  });
});

// ✅ Comprehensive validation
test('should validate response thoroughly', async () => {
  const result = await client.callTool('my_tool', args);
  
  // Structure validation
  assert.ok(result.content, 'Should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(result.content[0].type, 'text', 'Should be text content');
  
  // Content validation
  assert.ok(result.content[0].text.length > 0, 'Should have text content');
  assert.equal(result.isError, false, 'Should not be error');
  
  // Side effects validation
  const stderr = client.getStderr();
  assert.equal(stderr.trim(), '', 'Should produce no stderr');
});
```

## Common Patterns

### Tool Discovery
```yaml
- it: "should have expected tools available"
  request:
    jsonrpc: "2.0"
    id: "discover"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:type:string"
            inputSchema:
              type: "object"
              properties: "match:type:object"
              required: "match:type:array"
```

### Data Validation
```yaml
- it: "should validate response format"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:Status: (success|completed|finished)"
        metadata:
          timestamp: "match:regex:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
          duration: "match:regex:\\d+ms"
```

### Error Handling
```yaml
- it: "should handle errors appropriately"
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Error:"
        errorCode: "match:regex:[A-Z_]+"
```

---

**Next Steps:**
- [**API Reference**]({{ '/api-reference.html' | relative_url }}) - Complete API documentation
- [**Troubleshooting**]({{ '/troubleshooting.html' | relative_url }}) - Debug common issues
- [**Development**]({{ '/development.html' | relative_url }}) - Contribute to MCP Conductor
