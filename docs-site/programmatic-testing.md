---
title: Programmatic Testing
layout: default
---

# Programmatic Testing API

MCP Conductor provides a powerful JavaScript/TypeScript API for programmatic testing, enabling integration with existing test suites and complex validation scenarios.

## Quick Start

Initialize MCP Conductor in your project first:

```bash
npx mcp-conductor init
```

This sets up the configuration and test structure. Your programmatic tests can then reference the generated `conductor.config.json`:

```javascript
import { createClient } from 'mcp-conductor';

const client = await createClient('./conductor.config.json');
await client.connect();
// ... your tests
```

## Table of Contents
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Testing Frameworks](#testing-frameworks)
- [Advanced Patterns](#advanced-patterns)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Getting Started

### Installation
```bash
npm install mcp-conductor --save-dev
```

### Basic Usage
```javascript
import { createClient } from 'mcp-conductor';

// Create and connect client (using config from init command)
const client = await createClient('./conductor.config.json');
await client.connect();

// List available tools
const tools = await client.listTools();
console.log('Available tools:', tools.map(t => t.name));

// Execute a tool
const result = await client.callTool('my_tool', { param: 'value' });
console.log('Result:', result.content[0].text);

// Clean up
await client.disconnect();
```

## API Reference

### Main Entry Points

#### **`createClient(configPath)`**
Creates a new MCPClient instance without connecting.

```javascript
import { createClient } from 'mcp-conductor';

const client = await createClient('./config.json');
// or
const client = await createClient(configObject);
```

#### **`connect(configPath)`** 
Creates and automatically connects a client.

```javascript
import { connect } from 'mcp-conductor';

const client = await connect('./config.json');
// Client is ready to use immediately
```

### MCPClient Class

#### **Properties**
- **`connected`**: `boolean` - Connection status
- **`config`**: `object` - Configuration used for connection  
- **`handshakeCompleted`**: `boolean` - MCP handshake status

#### **Core Methods**

##### **`async connect()`**
Start MCP server and perform handshake.

```javascript
const client = await createClient('./config.json');
await client.connect();

console.log('Connected:', client.connected);
console.log('Handshake:', client.handshakeCompleted);
```

##### **`async disconnect()`**
Gracefully shutdown server connection.

```javascript
await client.disconnect();
```

##### **`async listTools()`**
Retrieve available tools from server.

```javascript
const tools = await client.listTools();

tools.forEach(tool => {
  console.log(`Tool: ${tool.name}`);
  console.log(`Description: ${tool.description}`);
  console.log(`Schema:`, tool.inputSchema);
});
```

##### **`async callTool(name, arguments)`**
Execute a specific tool with arguments.

```javascript
const result = await client.callTool('calculator', {
  operation: 'add',
  a: 15,
  b: 27
});

console.log('Content:', result.content);
console.log('Error:', result.isError);
```

##### **`async sendMessage(jsonRpcMessage)`**
Send raw JSON-RPC message to server.

```javascript
const response = await client.sendMessage({
  jsonrpc: "2.0",
  id: "custom-1",
  method: "tools/list",
  params: {}
});
```

#### **Utility Methods**

##### **`getStderr()`**
Retrieve current stderr buffer content.

```javascript
client.clearStderr();
await client.callTool('my_tool', {});
const stderr = client.getStderr();

if (stderr.trim()) {
  console.warn('Stderr output:', stderr);
}
```

##### **`clearStderr()`** 
Clear stderr buffer.

```javascript
client.clearStderr();
// Stderr buffer is now empty
```

##### **`isConnected()`**
Check if client is connected and handshake is completed.

```javascript
const isReady = client.isConnected();
console.log('Client ready:', isReady);

// Equivalent to checking both conditions
const manualCheck = client.connected && client.handshakeCompleted;
assert.equal(isReady, manualCheck);
```

## Testing Frameworks

### Node.js Test Runner

MCP Conductor integrates seamlessly with Node.js built-in test runner:

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
    
    // Validate tool structure
    tools.forEach(tool => {
      assert.ok(tool.name, 'Tool should have name');
      assert.ok(tool.description, 'Tool should have description');
      assert.ok(tool.inputSchema, 'Tool should have input schema');
    });
  });

  test('should execute tool successfully', async () => {
    const result = await client.callTool('calculator', {
      operation: 'add',
      a: 10,
      b: 5
    });

    assert.ok(result.content, 'Should return content');
    assert.equal(result.content[0].type, 'text', 'Should return text content');
    assert.ok(result.content[0].text.includes('15'), 'Should contain result');
    assert.equal(result.isError, false, 'Should not be error');
  });

  test('should handle stderr validation', async () => {
    client.clearStderr();
    await client.callTool('my_tool', {});
    const stderr = client.getStderr();
    assert.equal(stderr.trim(), '', 'Should have no stderr output');
  });
});
```

**Run tests:**
```bash
node --test tests/mcp.test.js
```

### Jest Integration

Perfect integration with Jest testing framework:

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

  beforeEach(() => {
    client.clearStderr();
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
    expect(myTool.inputSchema.type).toBe('object');
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
      ]),
      isError: false
    });
  });

  it('should produce no stderr output', async () => {
    await client.callTool('quiet_tool', {});
    expect(client.getStderr().trim()).toBe('');
  });
});
```

### Mocha Integration

Works great with Mocha and Chai:

```javascript
import { expect } from 'chai';
import { createClient } from 'mcp-conductor';

describe('MCP Server', function() {
  let client;

  this.timeout(10000); // MCP servers may need time to start

  before(async function() {
    client = await createClient('./config.json');
    await client.connect();
  });

  after(async function() {
    if (client) {
      await client.disconnect();
    }
  });

  it('should have expected tools', async function() {
    const tools = await client.listTools();
    
    expect(tools).to.be.an('array');
    expect(tools).to.have.lengthOf.at.least(1);
    
    const toolNames = tools.map(t => t.name);
    expect(toolNames).to.include('expected_tool');
  });

  it('should execute tool and return valid response', async function() {
    const result = await client.callTool('my_tool', { input: 'test' });
    
    expect(result).to.have.property('content');
    expect(result.content).to.be.an('array');
    expect(result.content[0]).to.have.property('type', 'text');
    expect(result).to.have.property('isError', false);
  });
});
```

## Advanced Patterns

### Tool Response Validation

```javascript
test('should validate complex tool response', async () => {
  const result = await client.callTool('list_items');
  
  // Extract item names from response
  const text = result.content[0].text;
  const itemPattern = /- \*\*(\w+)\*\* \(item\)/g;
  const items = [];
  let match;
  
  while ((match = itemPattern.exec(text)) !== null) {
    items.push(match[1]);
  }

  // Validate count and sorting
  assert.equal(items.length, 25, 'Should have 25 items');
  
  const sorted = [...items].sort();
  assert.deepEqual(items, sorted, 'Items should be alphabetically sorted');
  
  // Validate specific items
  const expectedItems = ['DataProcessor', 'FileHandler', 'TextAnalyzer'];
  for (const expected of expectedItems) {
    assert.ok(items.includes(expected), `Should include ${expected}`);
  }
});
```

### Dynamic Test Generation

```javascript
describe('Generated Tool Tests', () => {
  let client;
  let tools;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
    tools = await client.listTools();
  });

  after(async () => {
    await client?.disconnect();
  });

  // Dynamically generate tests for each tool
  tools?.forEach(tool => {
    it(`should execute ${tool.name} successfully`, async () => {
      // Generate basic test arguments based on schema
      const args = generateTestArgs(tool.inputSchema);
      
      const result = await client.callTool(tool.name, args);
      
      assert.ok(result.content, `${tool.name} should return content`);
      assert.ok(!result.isError, `${tool.name} should not error with valid args`);
    });
  });
});

function generateTestArgs(schema) {
  const args = {};
  
  if (schema?.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.type === 'string') {
        args[key] = 'test-value';
      } else if (prop.type === 'number') {
        args[key] = 42;
      } else if (prop.type === 'boolean') {
        args[key] = true;
      }
    }
  }
  
  return args;
}
```

### Performance Testing

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
    assert.equal(result.isError, false);
  });
});
```

### Stateful Testing

```javascript
describe('Stateful Operations', () => {
  test('should maintain state across calls', async () => {
    // Initialize state
    await client.callTool('initialize_state', { value: 'initial' });
    
    // Modify state
    const result1 = await client.callTool('modify_state', { action: 'increment' });
    assert.ok(result1.content[0].text.includes('1'));
    
    // Verify state persistence
    const result2 = await client.callTool('get_state', {});
    assert.ok(result2.content[0].text.includes('1'));
    
    // Reset state
    await client.callTool('reset_state', {});
    const result3 = await client.callTool('get_state', {});
    assert.ok(result3.content[0].text.includes('0'));
  });
});
```

## Error Handling

### Connection Errors

```javascript
test('should handle connection failures gracefully', async () => {
  const client = await createClient('./invalid-config.json');
  
  try {
    await client.connect();
    assert.fail('Should have thrown connection error');
  } catch (error) {
    assert.ok(error.message.includes('Failed to start server'));
    assert.equal(client.connected, false);
  }
});
```

### Tool Execution Errors

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

test('should handle tool errors in response', async () => {
  const result = await client.callTool('error_tool', { cause_error: true });
  
  assert.equal(result.isError, true);
  assert.ok(result.content[0].text.includes('Expected error message'));
});
```

### Recovery Testing

```javascript
test('should reconnect after server failure', async () => {
  // Simulate server failure scenario
  await client.disconnect();
  assert.equal(client.connected, false);
  
  // Reconnect
  await client.connect();
  assert.equal(client.connected, true);
  assert.equal(client.handshakeCompleted, true);
  
  // Verify functionality restored
  const tools = await client.listTools();
  assert.ok(Array.isArray(tools));
});
```

## Best Practices

### ✅ **Connection Management**

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
  
  // Tests here...
});

// ❌ WRONG - No cleanup (resource leak)
test('bad example', async () => {
  const client = await connect('./config.json');
  await client.callTool('tool', {});
  // Missing disconnect - server process remains running
});
```

### ✅ **Error Handling**

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
  } finally {
    // Cleanup if needed
  }
});

// ❌ WRONG - Unhandled exceptions
test('bad error handling', async () => {
  await client.callTool('unknown_tool', {}); // May throw unhandled exception
});
```

### ✅ **Assertion Strategies**

```javascript
// ✅ CORRECT - Specific, meaningful assertions
test('comprehensive validation', async () => {
  const result = await client.callTool('validate_data', { input: 'test' });
  
  // Validate response structure
  assert.ok(result, 'Should return result object');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(result.content[0].type, 'text', 'Content type should be text');
  assert.ok(result.content[0].text.length > 0, 'Should have non-empty text');
  assert.equal(result.isError, false, 'Should not indicate error state');
  
  // Validate stderr
  const stderr = client.getStderr();
  assert.equal(stderr.trim(), '', 'Should produce no stderr');
});

// ❌ WRONG - Vague assertions
test('weak validation', async () => {
  const result = await client.callTool('some_tool', {});
  assert.ok(result); // Too generic, doesn't validate structure
});
```

### ✅ **Test Organization**

```javascript
// ✅ CORRECT - Well organized test suite
describe('User Management Tools', () => {
  describe('Authentication', () => {
    test('should authenticate valid user');
    test('should reject invalid credentials');
  });
  
  describe('User Operations', () => {
    test('should create user');
    test('should list users');
    test('should update user');
  });
  
  describe('Error Handling', () => {
    test('should handle missing user ID');
    test('should validate user data');
  });
});

// ❌ WRONG - Flat, unorganized structure
describe('Tests', () => {
  test('test1');
  test('test2');
  test('test3'); // Hard to understand what each test covers
});
```

### ✅ **Configuration Management**

```javascript
// ✅ CORRECT - Environment-specific configs
const configPath = process.env.NODE_ENV === 'test' 
  ? './test-config.json'
  : './config.json';

const client = await createClient(configPath);

// ✅ CORRECT - Config validation
test('should validate config before connecting', async () => {
  const config = {
    name: 'Test Server',
    command: 'node',
    args: ['./server.js']
  };
  
  const client = await createClient(config);
  assert.ok(client.config.name);
  assert.ok(client.config.command);
  assert.ok(Array.isArray(client.config.args));
});
```

---

## When to Use Programmatic vs YAML Testing

### **Use Programmatic Testing For:**
- **Complex Validation Logic**: Custom validation beyond pattern matching
- **Dynamic Test Generation**: Creating tests based on server responses
- **Integration Testing**: Incorporating MCP testing into existing test suites
- **Advanced Error Scenarios**: Testing complex failure modes and recovery
- **Performance Testing**: Load testing, concurrent execution, timeout validation
- **Stateful Testing**: Tests requiring multiple sequential operations

### **Use YAML Testing For:**
- **Declarative Scenarios**: Simple request/response validation
- **Pattern Matching**: Leveraging 11+ built-in pattern types
- **Quick Validation**: Rapid test creation without code
- **Documentation**: Self-documenting test scenarios
- **CI/CD Integration**: Command-line execution in pipelines
- **Non-Developer Testing**: Accessible to QA engineers

---

**Next Steps:**
- [**Examples**]({{ '/examples.html' | relative_url }}) - Real-world programmatic test suites
- [**API Reference**]({{ '/api-reference.html' | relative_url }}) - Complete API documentation
- [**YAML Testing**]({{ '/yaml-testing.html' | relative_url }}) - Declarative testing approach
