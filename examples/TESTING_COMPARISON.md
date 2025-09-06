# Testing Approaches Comparison

This directory demonstrates both YAML-based declarative testing and programmatic testing for the same MCP server functionality.

## Files Overview

- **`filesystem.test.mcp.yml`** - Original YAML-based tests
- **`filesystem-server.programmatic.test.js`** - Programmatic equivalent tests
- **`multi-tool.test.mcp.yml`** - YAML tests for multi-tool server
- **`multi-tool-server.programmatic.test.js`** - Programmatic equivalent tests

## Side-by-Side Comparison

### YAML Approach (Declarative)

```yaml
description: "Test suite for filesystem server"
tests:
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
```

### Programmatic Approach (JavaScript)

```javascript
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('Filesystem Server Programmatic Integration', () => {
  let client;

  before(async () => {
    client = await connect('./config.json');
  });

  after(async () => {
    await client.disconnect();
  });

  test('should read existing file successfully', async () => {
    const result = await client.callTool('read_file', {
      path: '../shared-test-data/hello.txt'
    });

    assert.deepStrictEqual(result, {
      content: [{
        type: 'text',
        text: 'Hello, MCP Conductor!'
      }],
      isError: false
    });
    
    assert.equal(client.getStderr(), '');
  });
});
```

## Running the Tests

### YAML Tests
```bash
# From repository root
npm run test:filesystem
npm run test:multitool
```

### Programmatic Tests  
```bash
# Run with Node.js built-in test runner
npm run test:programmatic:filesystem
npm run test:programmatic:multitool

# Or run all programmatic tests
npm run test:programmatic
```

## Key Differences

| Aspect | YAML Tests | Programmatic Tests |
|--------|------------|-------------------|
| **Learning Curve** | Minimal - just YAML syntax | Requires JavaScript/testing framework knowledge |
| **Test Setup** | Simple per-file configuration | Flexible before/after hooks |
| **Assertions** | Basic equality + regex matching | Full assertion library ecosystem |
| **Debugging** | Limited to console output | Full debugger, breakpoints, step-through |
| **IDE Support** | Basic YAML highlighting | Full IntelliSense, autocomplete, refactoring |
| **Custom Logic** | Limited to predefined patterns | Full JavaScript/TypeScript capabilities |
| **Test Organization** | File-level grouping only | Nested describe blocks, test suites |
| **Pattern Matching** | `match:regex` syntax | `assert.match(/regex/)` and more |
| **Error Handling** | Declarative expectations | try/catch, async/await, custom assertions |
| **Extensibility** | Fixed schema | Custom helpers, utilities, plugins |
| **CI Integration** | Built-in CLI tool | Native testing framework features |
| **Performance** | Optimized for MCP testing | Framework's parallel execution, caching |
| **Framework Support** | CLI only | Node.js test runner, Jest, Mocha, Vitest, etc. |

## When to Use Which Approach

### Use YAML Tests When:
- ✅ Writing straightforward request/response tests
- ✅ Team prefers declarative configuration
- ✅ Testing basic MCP protocol compliance
- ✅ Quick setup and minimal maintenance needed
- ✅ Non-developers need to write/modify tests

### Use Programmatic Tests When:  
- ✅ Need complex test logic or calculations
- ✅ Want rich assertion capabilities
- ✅ Testing business logic beyond basic protocol
- ✅ Team is already using a JavaScript testing framework
- ✅ Need debugging capabilities and IDE support
- ✅ Want to integrate with existing test suites
- ✅ Need custom utilities or test helpers
- ✅ Testing stateful interactions or sequences
- ✅ Prefer JavaScript/TypeScript over YAML

## Mixed Approach

You can use both approaches in the same project:

```json
{
  "scripts": {
    "test:protocol": "conductor '**/*.test.mcp.yml'",
    "test:logic": "node --test **/*.programmatic.test.js",
    "test:all": "npm run test:protocol && npm run test:logic"
  }
}
```

This allows you to:
- Use YAML for basic protocol compliance tests
- Use programmatic tests for complex business logic tests
- Get the benefits of both approaches

## Framework Examples

### Node.js Built-in Test Runner
```javascript
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';

test('should work correctly', async () => {
  const result = await client.callTool('my_tool', {});
  assert.equal(result.isError, false);
});
```

### Jest
```javascript
describe('My Tests', () => {
  it('should work correctly', async () => {
    const result = await client.callTool('my_tool', {});
    expect(result.isError).toBe(false);
  });
});
```

### Mocha + Chai
```javascript
import { expect } from 'chai';

describe('My Tests', () => {
  it('should work correctly', async () => {
    const result = await client.callTool('my_tool', {});
    expect(result.isError).to.be.false;
  });
});
```

### Vitest
```javascript
import { describe, it, expect } from 'vitest';

describe('My Tests', () => {
  it('should work correctly', async () => {
    const result = await client.callTool('my_tool', {});
    expect(result.isError).toBe(false);
  });
});
```
