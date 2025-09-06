# Programmatic Testing Guide

MCP Conductor provides a programmatic API for writing tests against MCP servers using any JavaScript testing framework. This allows you to write tests using familiar testing syntax while maintaining all the powerful MCP testing capabilities.

## Installation

```bash
npm install mcp-conductor
# No additional testing framework required - works with Node.js built-in test runner
# Or use with your preferred framework: Jest, Mocha, Vitest, etc.
```

## Basic Usage

### With Node.js Built-in Test Runner

```javascript
import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('My MCP Server Tests', () => {
  let client;

  before(async () => {
    // Connect using a config file
    client = await connect('./server-config.json');
    
    // Or connect using an inline config object
    client = await connect({
      name: 'My Test Server',
      command: 'node',
      args: ['./my-server.js']
    });
  });

  after(async () => {
    await client.disconnect();
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    assert.equal(tools.length, 2);
    assert.equal(tools[0].name, 'my_tool');
  });

  test('should call a tool successfully', async () => {
    const result = await client.callTool('my_tool', { 
      param: 'value' 
    });
    
    assert.equal(result.content[0].text, 'Expected output');
    assert.equal(result.isError, false);
  });
});
```

### With Jest

```javascript
import { connect } from 'mcp-conductor';

describe('My MCP Server Tests', () => {
  let client;

  beforeAll(async () => {
    client = await connect('./server-config.json');
  });

  afterAll(async () => {
    await client.disconnect();
  });

  it('should call a tool successfully', async () => {
    const result = await client.callTool('my_tool', { param: 'value' });
    expect(result.content[0].text).toBe('Expected output');
    expect(result.isError).toBe(false);
  });
});
```

### With Mocha

```javascript
import { connect } from 'mcp-conductor';
import { expect } from 'chai';

describe('My MCP Server Tests', () => {
  let client;

  before(async () => {
    client = await connect('./server-config.json');
  });

  after(async () => {
    await client.disconnect();
  });

  it('should call a tool successfully', async () => {
    const result = await client.callTool('my_tool', { param: 'value' });
    expect(result.content[0].text).to.equal('Expected output');
    expect(result.isError).to.be.false;
  });
});
```

## API Reference

### `connect(serverConfig)`

Connects to an MCP server and returns a ready-to-use client.

**Parameters:**
- `serverConfig` (string | object): Path to config file or configuration object

**Returns:** `Promise<MCPClient>`

**Example:**
```javascript
// Using config file
const client = await connect('./config.json');

// Using inline config
const client = await connect({
  name: 'Calculator Server',
  command: 'node',
  args: ['./calculator-server.js'],
  cwd: './servers',
  env: { DEBUG: 'true' },
  startupTimeout: 5000
});
```

### `createClient(serverConfig)`

Creates an MCP client without connecting (useful for manual connection control).

**Parameters:**
- `serverConfig` (string | object): Path to config file or configuration object

**Returns:** `Promise<MCPClient>`

## MCPClient Methods

### `connect()`

Connects to the MCP server and performs the handshake protocol.

**Returns:** `Promise<void>`

### `disconnect()`

Disconnects from the MCP server and cleans up resources.

**Returns:** `Promise<void>`

### `listTools()`

Lists all available tools from the server.

**Returns:** `Promise<Array<Tool>>` where Tool has:
- `name` (string): Tool name
- `description` (string): Tool description  
- `inputSchema` (object): JSON Schema for tool parameters

**Example:**
```javascript
const tools = await client.listTools();
console.log(tools[0]);
// {
//   name: 'calculator',
//   description: 'Performs mathematical operations',
//   inputSchema: {
//     type: 'object',
//     properties: { operation: { type: 'string' } },
//     required: ['operation']
//   }
// }
```

### `callTool(toolName, arguments)`

Calls a specific tool with the provided arguments.

**Parameters:**
- `toolName` (string): Name of the tool to call
- `arguments` (object): Arguments to pass to the tool

**Returns:** `Promise<ToolResult>` where ToolResult has:
- `content` (Array): Array of content objects (usually text)
- `isError` (boolean): Whether the tool execution resulted in an error

**Example:**
```javascript
const result = await client.callTool('calculator', {
  operation: 'add',
  a: 10,
  b: 5
});

expect(result).toMatchObject({
  content: [{
    type: 'text',
    text: 'Result: 15'
  }],
  isError: false
});
```

### `sendMessage(message)`

Sends a raw JSON-RPC message to the server (for advanced use cases).

**Parameters:**
- `message` (object): JSON-RPC 2.0 message

**Returns:** `Promise<object>` - Raw server response

**Example:**
```javascript
const response = await client.sendMessage({
  jsonrpc: '2.0',
  id: 'custom-1',
  method: 'tools/call',
  params: {
    name: 'my_tool',
    arguments: { key: 'value' }
  }
});
```

### `getStderr()`

Gets the current stderr buffer content from the server.

**Returns:** `string` - Current stderr content

### `clearStderr()`

Clears the stderr buffer (useful for test isolation).

### `isConnected()`

Checks if the client is connected and ready.

**Returns:** `boolean`

## Configuration

You can use the same configuration format as YAML tests:

### Configuration File (`server.config.json`)
```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./server-directory",
  "env": {
    "NODE_ENV": "test",
    "DEBUG": "true"
  },
  "startupTimeout": 5000,
  "readyPattern": "Server ready"
}
```

### Inline Configuration
```javascript
const client = await connect({
  name: 'Python Server',
  command: 'python',
  args: ['server.py', '--port', '8080'],
  startupTimeout: 10000
});
```

## Testing Patterns

### Test Structure
```javascript
describe('MCP Server Integration', () => {
  let client;

  beforeAll(async () => {
    client = await connect('./config.json');
  });

  afterAll(async () => {
    await client.disconnect();
  });

  beforeEach(() => {
    client.clearStderr(); // Isolate stderr between tests
  });

  // Your tests here...
});
```

### Regex Pattern Matching
```javascript
it('should match patterns in output', async () => {
  const result = await client.callTool('validator', {
    email: 'test@example.com'
  });

  // Use Jest's built-in regex matching
  expect(result.content[0].text).toMatch(/Valid email.*CONFIRMED/);
  expect(result.content[0].text).toMatch(/\d{4}-\d{2}-\d{2}/); // Date pattern
});
```

### Error Handling
```javascript
it('should handle tool errors gracefully', async () => {
  const result = await client.callTool('calculator', {
    operation: 'divide',
    a: 10,
    b: 0
  });

  expect(result.isError).toBe(true);
  expect(result.content[0].text).toMatch(/division by zero/i);
});

it('should throw for unknown tools', async () => {
  await expect(client.callTool('unknown_tool', {}))
    .rejects
    .toThrow(/Failed to call tool.*unknown_tool/);
});
```

### Stderr Validation
```javascript
it('should have clean stderr for successful operations', async () => {
  await client.callTool('my_tool', { input: 'valid' });
  expect(client.getStderr()).toBe('');
});

it('should capture stderr for problematic operations', async () => {
  await client.callTool('debug_tool', { verbose: true });
  expect(client.getStderr()).toMatch(/debug information/i);
});
```

### Multiple Tool Interactions
```javascript
it('should support chaining tool calls', async () => {
  // Step 1: Get data
  const data = await client.callTool('data_fetcher', { id: 123 });
  
  // Step 2: Process the data
  const processed = await client.callTool('data_processor', {
    input: data.content[0].text
  });

  expect(processed.content[0].text).toMatch(/Processed:/);
});
```

## Advanced Usage

### Custom Matchers

You can create custom Jest matchers for MCP-specific assertions:

```javascript
expect.extend({
  toHaveSuccessfulToolResult(received) {
    const pass = received.isError === false && 
                 received.content && 
                 received.content.length > 0;
    
    return {
      message: () => `Expected tool result to be successful`,
      pass
    };
  }
});

// Usage
expect(result).toHaveSuccessfulToolResult();
```

### Server State Testing
```javascript
it('should maintain state across multiple calls', async () => {
  // Initialize state
  await client.callTool('session_manager', { action: 'init', id: 'test-123' });
  
  // Verify state
  const result = await client.callTool('session_manager', { action: 'get', id: 'test-123' });
  expect(result.content[0].text).toMatch(/Session.*active/);
});
```

### Performance Testing
```javascript
it('should handle concurrent requests', async () => {
  const promises = Array.from({ length: 10 }, (_, i) => 
    client.callTool('calculator', { operation: 'add', a: i, b: 1 })
  );
  
  const results = await Promise.all(promises);
  
  results.forEach((result, i) => {
    expect(result.content[0].text).toBe(`Result: ${i + 1}`);
  });
});
```

## Comparison with YAML Tests

| Feature | YAML Tests | Jest Tests |
|---------|------------|------------|
| **Syntax** | Declarative YAML | JavaScript/Jest |
| **Pattern Matching** | `match:regex` | `expect().toMatch(/regex/)` |
| **Error Handling** | `isError: true` | `try/catch` + `toThrow()` |
| **Setup/Teardown** | Per file | `beforeAll/afterAll/beforeEach` |
| **Assertions** | Deep equality | Full Jest matcher library |
| **Debugging** | Limited | Full debugger support |
| **IDE Support** | Basic | Full IntelliSense/autocomplete |
| **Extensibility** | Fixed format | Custom matchers, helpers |

## Migration from YAML

To migrate existing YAML tests to Jest:

### YAML Test
```yaml
- it: "should calculate sum correctly"
  request:
    jsonrpc: "2.0"
    id: "calc-1"
    method: "tools/call"
    params:
      name: "calculator"
      arguments:
        operation: "add"
        a: 10
        b: 5
  expect:
    response:
      jsonrpc: "2.0"  
      id: "calc-1"
      result:
        content:
          - type: "text"
            text: "Result: 15"
        isError: false
```

### Equivalent Jest Test
```javascript
it('should calculate sum correctly', async () => {
  const result = await client.callTool('calculator', {
    operation: 'add',
    a: 10,
    b: 5
  });

  expect(result).toMatchObject({
    content: [{
      type: 'text',
      text: 'Result: 15'
    }],
    isError: false
  });
});
```

## Best Practices

1. **Always disconnect**: Use `afterAll` to clean up connections
2. **Isolate tests**: Use `beforeEach` to clear stderr and reset state
3. **Use descriptive test names**: Follow Jest conventions
4. **Group related tests**: Use `describe` blocks for organization
5. **Test both success and failure cases**: Cover error scenarios
6. **Use pattern matching**: Leverage Jest's flexible matching capabilities
7. **Mock external dependencies**: If your MCP server depends on external services

## Running Tests

```bash
# Run Jest tests
npx jest

# Run specific test file
npx jest filesystem-server.jest.test.js

# Run with coverage
npx jest --coverage

# Run in watch mode
npx jest --watch
```

## Troubleshooting

### Connection Issues
- Ensure the server config path is correct
- Check that the server starts successfully in isolation
- Verify timeout settings are adequate for your server

### Test Failures
- Use `console.log(client.getStderr())` to inspect stderr
- Add debug logging to your MCP server
- Check that tool names and parameters match expectations

### Performance Issues
- Adjust `startupTimeout` for slower servers
- Consider running tests in sequence if concurrent tests fail
- Use `beforeAll` instead of `beforeEach` for expensive setup
