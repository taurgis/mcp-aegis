---
title: Quick Start
layout: default
---

# Quick Start

Get up and running with MCP Conductor in 5 minutes.

## Method 1: Quick Setup (Recommended)

The fastest way to get started in an existing Node.js project:

```bash
# Navigate to your MCP project directory
cd my-mcp-project

# Initialize MCP Conductor
npx mcp-conductor init
```

This creates:
- `conductor.config.json` (auto-configured from your `package.json`)
- Test directory structure (`test/mcp/` or `tests/mcp/`)
- `AGENTS.md` guide for AI development
- Installs `mcp-conductor` as a dev dependency

Skip to [Step 3](#step-3-write-your-first-test) if using this method.

## Method 2: Manual Setup

### Step 1: Install MCP Conductor

Install MCP Conductor globally:

```bash
npm install -g mcp-conductor
```

### Step 2: Create a Simple MCP Server

Let's create a basic MCP server for testing:

**server.js**
```javascript
#!/usr/bin/env node

const server = {
  name: "demo-server",
  version: "1.0.0"
};

const tools = [
  {
    name: "hello",
    description: "Says hello to someone",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of person to greet"
        }
      },
      required: ["name"]
    }
  }
];

// Handle JSON-RPC messages
process.stdin.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    try {
      const message = JSON.parse(line);
      handleMessage(message);
    } catch (e) {
      // Ignore invalid JSON
    }
  }
});

function handleMessage(message) {
  if (message.method === 'initialize') {
    sendResponse(message.id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: server
    });
  } else if (message.method === 'tools/list') {
    sendResponse(message.id, { tools });
  } else if (message.method === 'tools/call') {
    const { name, arguments: args } = message.params;
    
    if (name === 'hello') {
      sendResponse(message.id, {
        content: [
          {
            type: "text",
            text: `Hello, ${args.name}! 👋`
          }
        ]
      });
    } else {
      sendError(message.id, -32601, "Method not found");
    }
  }
}

function sendResponse(id, result) {
  console.log(JSON.stringify({
    jsonrpc: "2.0",
    id,
    result
  }));
}

function sendError(id, code, message) {
  console.log(JSON.stringify({
    jsonrpc: "2.0", 
    id,
    error: { code, message }
  }));
}

// Send initialized notification after a brief delay
setTimeout(() => {
  console.error("Server ready"); // This goes to stderr
}, 100);
```

Make it executable:

```bash
chmod +x server.js
```

## Step 3: Create Configuration (Manual Setup Only)

If you used the `init` command, this step is already done! The configuration is auto-generated from your `package.json`.

For manual setup, create:

**conductor.config.json**
```json
{
  "name": "Demo MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000,
  "readyPattern": "Server ready"
}
```

## Step 3: Write Your First Test

**demo.test.mcp.yml**
```yaml
description: "Demo MCP Server Tests"
tests:
  - it: "should initialize successfully"
    request:
      jsonrpc: "2.0"
      id: "init-test"
      method: "initialize"
      params:
        protocolVersion: "2025-06-18"
        capabilities: { tools: {} }
        clientInfo: { name: "test-client", version: "1.0.0" }
    expect:
      response:
        jsonrpc: "2.0"
        id: "init-test"
        result:
          protocolVersion: "2025-06-18"
          capabilities: "match:type:object"
          serverInfo:
            name: "demo-server"
            version: "1.0.0"
    stderr: "toBeEmpty"

  - it: "should list available tools"
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
            - name: "hello"
              description: "match:contains:hello"
              inputSchema:
                type: "object"
                properties: "match:type:object"
                required: ["name"]
    stderr: "toBeEmpty"

  - it: "should execute hello tool"
    request:
      jsonrpc: "2.0"
      id: "hello-test"
      method: "tools/call"
      params:
        name: "hello"
        arguments:
          name: "World"
    expect:
      response:
        jsonrpc: "2.0"
        id: "hello-test"
        result:
          content:
            - type: "text"
              text: "match:contains:Hello, World"
    stderr: "toBeEmpty"

  - it: "should handle invalid tool"
    request:
      jsonrpc: "2.0" 
      id: "error-test"
      method: "tools/call"
      params:
        name: "nonexistent"
        arguments: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-test"
        error:
          code: -32601
          message: "Method not found"
    stderr: "toBeEmpty"
```

## Step 4: Run Your Tests

### For Quick Setup (Method 1):
```bash
# After init, you can use npx:
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"  # Matches both test/ and tests/

# Or add to package.json scripts:
# "scripts": { "test:mcp": "mcp-conductor \"./test*/mcp/**/*.test.mcp.yml\"" }
# Then run:
npm run test:mcp

# Specific directory examples:
# npx mcp-conductor "test/mcp/**/*.test.mcp.yml"     # for test/mcp/
# npx mcp-conductor "tests/mcp/**/*.test.mcp.yml"   # for tests/mcp/
```

### For Manual Setup (Method 2):
```bash
# Basic test execution
conductor demo.test.mcp.yml --config conductor.config.json

# With verbose output for detailed results
conductor demo.test.mcp.yml --config conductor.config.json --verbose

# With debug mode for MCP communication details  
conductor demo.test.mcp.yml --config conductor.config.json --debug

# With timing information for performance analysis
conductor demo.test.mcp.yml --config conductor.config.json --timing

# Combine options for maximum debugging
conductor demo.test.mcp.yml --config conductor.config.json --verbose --debug --timing
```

You should see output like:

```
📋 Loaded configuration for: Demo MCP Server
🧪 Found 1 test suite(s)
ℹ️  Starting MCP server...
ℹ️  Server started successfully
ℹ️  Performing MCP handshake...
ℹ️  Handshake completed successfully

📋 Test suite for the Simple Filesystem Server
   demo.test.mcp.yml

  ● should initialize successfully ... ✓ PASS
  ● should list available tools ... ✓ PASS  
  ● should execute hello tool ... ✓ PASS
  ● should handle invalid tool ... ✓ PASS

ℹ️  Shutting down server...
ℹ️  Server shut down successfully

📊 Test Results:
   ✓ 4 passed
   📈 Total: 4

🎉 All tests passed!
```

## Understanding the Test Structure

### 1. **Test File Structure**
```yaml
description: "Human-readable test suite name"
tests:
  - it: "Individual test description"
    request: { /* JSON-RPC request */ }
    expect: { /* Expected response and stderr */ }
```

### 2. **Pattern Matching**
MCP Conductor supports powerful pattern matching:

- `"match:type:object"` - Validates data type
- `"match:contains:hello"` - String contains substring
- `"match:regex:Hello.*World"` - Regular expression matching

### 3. **Stderr Validation**
- `"toBeEmpty"` - Expects no stderr output
- `"match:Warning.*deprecated"` - Expects specific stderr pattern

## Next Steps

Now that you have a working test:

### 🎯 **YAML Testing**
Learn about advanced YAML testing features:
- [**Pattern Matching**]({{ '/pattern-matching.html' | relative_url }}) - 11+ verified pattern types
- [**YAML Testing Guide**]({{ '/yaml-testing.html' | relative_url }}) - Complete YAML reference

### 💻 **Programmatic Testing**
For complex scenarios, use the JavaScript API:

```javascript
import { createClient } from 'mcp-conductor';

const client = await createClient('./conductor.config.json');
await client.connect();

const tools = await client.listTools();
console.log('Available tools:', tools.map(t => t.name));

await client.disconnect();
```

[**Programmatic Testing Guide**]({{ '/programmatic-testing.html' | relative_url }}) →

### 🏗️ **Real Examples**
Check out complete examples:
- [**Examples**]({{ '/examples.html' | relative_url }}) - Production-ready test suites
- [**Best Practices**]({{ '/examples.html' | relative_url }}#best-practices) - Testing patterns and conventions

## Common Patterns

### Testing Tool Schemas
```yaml
expect:
  response:
    result:
      tools:
        - name: "my_tool"
          inputSchema:
            type: "object"
            properties: "match:type:object"
            required: "match:type:array"
```

### Error Handling
```yaml
expect:
  response:
    error:
      code: -32602
      message: "match:contains:Invalid params"
```

### Complex Responses
```yaml
expect:
  response:
    result:
      content:
        - type: "text"
          text: "match:regex:Found \\d+ results"
```

---

**Congratulations!** 🎉 You've successfully created and run your first MCP Conductor test suite.

**Next:** [YAML Testing Guide]({{ '/yaml-testing.html' | relative_url }}) →
