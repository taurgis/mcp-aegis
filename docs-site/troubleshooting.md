---
title: Troubleshooting
layout: default
---

# Troubleshooting

Common issues and solutions when using MCP Conductor for testing MCP servers.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Connection Problems](#connection-problems)
- [Test Failures](#test-failures)
- [Pattern Matching Issues](#pattern-matching-issues)
- [Performance Issues](#performance-issues)
- [Debugging Tips](#debugging-tips)

## Installation Issues

### NPM Package Not Found
**Problem**: `npm: package 'mcp-conductor' not found`

**Solution**: 
Make sure you have the latest npm and try installing again:

```bash
# Update npm
npm install -g npm@latest

# Install MCP Conductor
npm install -g mcp-conductor
```

### Global vs Local Installation
**Problem**: Command not found after installation

**Solution**: 
```bash
# For development usage (after cloning repository)
cd mcp-conductor
node bin/conductor.js --help

# Create an alias for convenience
alias conductor="node /path/to/mcp-conductor/bin/conductor.js"
```

### Permission Errors
**Problem**: Permission denied during installation

**Solution**:
```bash
# For development setup (recommended approach)
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor
npm install  # No sudo needed for local development

# Set up proper Node.js permissions if needed
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## Connection Problems

### Server Fails to Start
**Problem**: `Failed to start server: Error: spawn ENOENT`

**Diagnosis**: The command specified in config is not found or executable.

**Solution**:
```json
{
  "name": "My Server",
  "command": "/full/path/to/node",  // Use absolute path
  "args": ["./server.js"]
}
```

**Check executable path**:
```bash
which node
which python3
```

### Connection Timeout
**Problem**: `Connection timeout after 5000ms`

**Diagnosis**: Server takes too long to start or ready pattern not matching.

**Solutions**:

1. **Increase timeout**:
```json
{
  "name": "Slow Server",
  "command": "python",
  "args": ["./slow_server.py"],
  "startupTimeout": 30000  // 30 seconds (default is 5000ms)
}
```

2. **Add ready pattern**:
```json
{
  "name": "Server with Pattern",
  "command": "node",
  "args": ["./server.js"],
  "readyPattern": "Server listening on port \\d+"
}
```

3. **Debug server startup**:
```bash
# Test server manually
node ./server.js

# Check output with MCP Conductor (no --verbose flag available)
node bin/conductor.js test.yml --config config.json
```

### Handshake Failures
**Problem**: `MCP handshake failed: Unexpected response`

**Diagnosis**: Server doesn't implement MCP protocol correctly.

**Solution**: Verify server implements required MCP methods:

```javascript
// Server must handle these methods:
// - initialize
// - initialized (notification)  
// - tools/list
// - tools/call

function handleMessage(message) {
  if (message.method === 'initialize') {
    sendResponse(message.id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name: "my-server", version: "1.0.0" }
    });
  }
  // ... other methods
}
```

### Working Directory Issues
**Problem**: Server can't find files or resources

**Solution**: Set correct working directory:

```json
{
  "name": "Server with CWD",
  "command": "node",
  "args": ["./src/server.js"],
  "cwd": "/absolute/path/to/project"
}
```

## Test Failures

### Pattern Not Matching
**Problem**: `Pattern did not match: expected "match:regex:..." but got "..."`

**Diagnosis**: Pattern doesn't match actual response format.

**Solutions**:

1. **Check actual response**:
```bash
# MCP Conductor shows detailed output by default
node bin/conductor.js test.yml --config config.json
```

2. **Test regex separately**:
```javascript
const pattern = /Result: \d+/;
const text = "Result: 42 items found";
console.log(pattern.test(text)); // Should be true
```

3. **Fix common escaping issues**:
```yaml
# ❌ Wrong - single backslash
text: "match:regex:\d+"

# ✅ Correct - double backslash in YAML
text: "match:regex:\\d+"

# ✅ Correct - escaped special characters  
text: "match:regex:\\$\\d+\\.\\d+"  # For $15.99
```

### JSON-RPC Format Errors
**Problem**: `Invalid JSON-RPC format`

**Solution**: Verify correct JSON-RPC 2.0 structure:

```yaml
request:
  jsonrpc: "2.0"           # Must be exactly "2.0"
  id: "unique-id"          # Must be unique per test  
  method: "tools/call"     # Must be valid MCP method
  params:                  # Parameters object
    name: "tool_name"
    arguments: {}
```

### Stderr Validation Failures
**Problem**: `Expected empty stderr but got: "Warning: ..."`

**Solutions**:

1. **Accept expected stderr**:
```yaml
stderr: "match:contains:Warning"
```

2. **Update server to suppress warnings**:
```json
{
  "env": {
    "NODE_ENV": "test",
    "SUPPRESS_WARNINGS": "true"
  }
}
```

3. **Clear stderr before test**:
```javascript
client.clearStderr();
await client.callTool('tool', {});
const stderr = client.getStderr();
```

### Array Length Mismatches
**Problem**: `Expected array length 5 but got 7`

**Solution**: Check actual array content and update expectation:

```bash
# Debug actual response  
node bin/conductor.js debug.test.yml --config config.json

# Update test
tools: "match:arrayLength:7"  # Use correct count
```

## Pattern Matching Issues

### Field Extraction Problems
**Problem**: Field extraction returns empty array or wrong data

**Diagnosis**: JSON path is incorrect or data structure changed.

**Solutions**:

1. **Verify JSON path**:
```javascript
const data = {
  tools: [
    { name: "tool1", type: "utility" },
    { name: "tool2", type: "processor" }
  ]
};

// Correct paths:
// "tools.*.name" → ["tool1", "tool2"]  
// "tools.*.type" → ["utility", "processor"]
```

2. **Debug extraction**:
```yaml
# Test with simpler extraction first
match:extractField: "tools"
value: "match:type:array"

# Then add complexity  
match:extractField: "tools.*.name"
value: "match:arrayContains:expected_tool"
```

### Regex Compilation Errors
**Problem**: `Invalid regular expression: Unterminated group`

**Solution**: Fix regex syntax:

```yaml
# ❌ Wrong - unescaped parentheses
text: "match:regex:Hello (world)"

# ✅ Correct - escaped parentheses
text: "match:regex:Hello \\(world\\)"

# ❌ Wrong - unescaped backslash
text: "match:regex:C:\Users\file"

# ✅ Correct - escaped backslashes
text: "match:regex:C:\\\\Users\\\\file"
```

### Type Validation Issues
**Problem**: `Expected type 'number' but got 'string'`

**Solution**: Check actual data types:

```javascript
// Debug actual types
console.log('Value:', value, 'Type:', typeof value);

// Update expectation if needed
count: "match:type:string"  # If API returns string numbers
```

### Array Type Detection Issues
**Problem**: `match:type:array` pattern fails even when value is an array

**Common Cause**: JavaScript arrays have `typeof array === "object"`, which can cause confusion.

**Solution**: MCP Conductor correctly uses `Array.isArray()` for array detection:

```yaml
# ✅ This works correctly
result:
  tools: "match:type:array"         # Uses Array.isArray() internally
  metadata: "match:type:object"     # Uses typeof === "object"
```

**Debugging Tips**:
```javascript
// Test array detection manually
const value = [1, 2, 3];
console.log('typeof:', typeof value);        // "object"  
console.log('Array.isArray():', Array.isArray(value)); // true

// MCP Conductor handles this correctly for you
```

### Regex Pattern Detection Issues
**Problem**: Regex patterns with word boundaries (`\b`) not being recognized as regex

**Common Cause**: Regex detection logic may not recognize all regex metacharacters.

**Solution**: MCP Conductor now properly detects regex patterns with word boundaries:

```yaml
# ✅ These are correctly detected as regex patterns
text: "match:regex:\\bSTATUS\\b"          # Word boundary patterns
text: "match:regex:Monitor\\s+\\b\\d+\\b" # Complex word boundary patterns
text: "match:regex:\\b[A-Z][a-z]+\\b"     # Capitalized word patterns
```

**Note**: Always prefix with `match:regex:` to ensure proper pattern recognition.

## Performance Issues

### Slow Test Execution
**Problem**: Tests take too long to complete

**Solutions**:

1. **Optimize server startup**:
```json
{
  "startupTimeout": 5000,    // Default is 5000ms, reduce if possible
  "readyPattern": "Ready"    // Add pattern to detect ready state
}
```

2. **Use connection pooling**:
```javascript
// Reuse client for multiple tests (Node.js test runner)
import { describe, test, before, after } from 'node:test';

describe('Test Suite', () => {
  let client;
  
  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });
  
  after(async () => {
    await client.disconnect();
  });
  
  // Tests use same client instance
});
```

3. **Parallel test execution**:
```bash
# Run tests in parallel with Node.js test runner
node --test --test-concurrency=4 test/*.js

# Or run specific programmatic tests
npm run test:programmatic
```

### Memory Issues
**Problem**: Tests consume too much memory or leak

**Solutions**:

1. **Proper cleanup**:
```javascript
// Using Node.js test runner
import { afterEach } from 'node:test';

afterEach(async () => {
  if (client && client.connected) {
    client.clearStderr(); // Clear buffers
    await client.disconnect();
  }
});
```

2. **Limit concurrent connections**:
```javascript
// Avoid too many concurrent clients
const MAX_CLIENTS = 3;
const semaphore = new Semaphore(MAX_CLIENTS);
```

### Network Timeouts
**Problem**: Tool calls timeout in programmatic tests

**Solution**: Increase timeouts or optimize server:

```javascript
// Using Node.js test runner timeout
import { test } from 'node:test';

test('slow operation', { timeout: 30000 }, async () => {
  // ...test code - 30 second timeout
});

// Or optimize server response time
```

## Debugging Tips

### Enable Verbose Output
```bash
# YAML testing - MCP Conductor shows detailed output by default
node bin/conductor.js tests.yml --config config.json

# Shows actual vs expected values for failures
```

### Inspect Raw Responses
```javascript
// Programmatic testing
const result = await client.sendMessage({
  jsonrpc: "2.0",
  id: "debug-1", 
  method: "tools/call",
  params: { name: "my_tool", arguments: {} }
});

console.log('Raw response:', JSON.stringify(result, null, 2));
```

### Debug Server Directly
```bash
# Test server manually
echo '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}' | node server.js

# Check server logs
node server.js 2>server.log &
# Run tests then check server.log
```

### Use Debug Configuration
```json
{
  "name": "Debug Server",
  "command": "node",
  "args": ["--inspect", "./server.js"],  // Enable debugger
  "env": {
    "DEBUG": "*",                         // Enable debug output
    "NODE_ENV": "development"
  },
  "startupTimeout": 30000                 // Longer timeout for debugging
}
```

### Test Individual Components

1. **Test configuration loading**:
```javascript
import { createClient } from 'mcp-conductor';

try {
  const client = await createClient('./config.json');
  console.log('Config loaded:', client.config);
} catch (error) {
  console.error('Config error:', error.message);
}
```

2. **Test server startup**:
```javascript
const client = await createClient('./config.json');
try {
  await client.connect();
  console.log('Connected successfully');
} catch (error) {
  console.error('Connection failed:', error.message);
}
```

3. **Test tool discovery**:
```javascript
const tools = await client.listTools();
console.log('Available tools:', tools.map(t => t.name));
```

### Common Debug Commands

```bash
# Check file permissions
ls -la server.js

# Verify executable
which node

# Test regex patterns
node -e "console.log(/\\d+/.test('123'))"

# Validate JSON
cat config.json | json_pp

# Check port usage
lsof -i :8080

# Monitor server process
ps aux | grep server.js
```

### Environment Debugging

```bash
# Check Node.js version
node --version

# Check Python version  
python3 --version

# Check environment variables
env | grep NODE

# Check PATH
echo $PATH
```

## Getting Help

### Enable Debug Logs
Set `DEBUG=mcp-conductor:*` environment variable for detailed logs:

```bash
DEBUG=mcp-conductor:* conductor test.yml --config config.json
```

### Create Minimal Reproduction
When reporting issues, create minimal reproduction:

1. **Minimal server**:
```javascript
#!/usr/bin/env node
const server = { name: "minimal", version: "1.0.0" };
process.stdin.on('data', (data) => {
  const message = JSON.parse(data.toString());
  console.log(JSON.stringify({
    jsonrpc: "2.0",
    id: message.id,
    result: { tools: [] }
  }));
});
```

2. **Minimal config**:
```json
{
  "name": "Minimal Server",
  "command": "node",
  "args": ["./minimal-server.js"]
}
```

3. **Minimal test**:
```yaml
description: "Minimal reproduction"
tests:
  - it: "should work"
    request:
      jsonrpc: "2.0"
      id: "1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "1"
        result:
          tools: []
```

### Report Issues
Include the following information:

- MCP Conductor version: `node bin/conductor.js --version`
- Node.js version: `node --version`  
- Operating system
- Full error message
- Minimal reproduction case
- Configuration file (sanitized)

---

**Need More Help?**
- [**Examples**]({{ '/examples.html' | relative_url }}) - Working examples and patterns
- [**API Reference**]({{ '/api-reference.html' | relative_url }}) - Complete API documentation  
- [**GitHub Issues**](https://github.com/taurgis/mcp-conductor/issues) - Report bugs and request features
