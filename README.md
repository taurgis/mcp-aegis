# MCP Conductor

> A comprehensive Node.js testing library for Model Context Protocol (MCP) servers

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP Conductor provides both **YAML-based declarative testing** and **programmatic testing** for MCP servers with advanced pattern matching capabilities, including pattern negation and comprehensive numeric comparison patterns.

## 📖 Documentation

**📚 [Complete Documentation](https://conductor.rhino-inquisitor.com/)**

- [🚀 Installation](https://conductor.rhino-inquisitor.com/installation.html)
- [⚡ Quick Start Guide](https://conductor.rhino-inquisitor.com/quick-start.html)
- [📝 YAML Testing](https://conductor.rhino-inquisitor.com/yaml-testing.html)
- [💻 Programmatic Testing](https://conductor.rhino-inquisitor.com/programmatic-testing.html)
- [🔍 Pattern Matching](https://conductor.rhino-inquisitor.com/pattern-matching.html)
- [🏗️ Examples](https://conductor.rhino-inquisitor.com/examples.html)
- [🛠️ API Reference](https://conductor.rhino-inquisitor.com/api-reference.html)
- [🔧 Troubleshooting](https://conductor.rhino-inquisitor.com/troubleshooting.html)

## ⚡ Quick Start

```bash
# Install globally
npm install -g mcp-conductor

# Initialize in your MCP project
npx mcp-conductor init

# The init command creates:
# - conductor.config.json (configured from package.json)
# - test/mcp/ or tests/mcp/ directory (based on existing project structure)
# - AGENTS.md (AI agent guide) in the test directory
# - Installs mcp-conductor as a dev dependency

# Customize your config (optional)
# Edit conductor.config.json to match your server setup

# Write your first test
cat > tests/mcp/my-server.test.mcp.yml << 'EOF'  # or test/mcp/ depending on your project
description: "Basic test"
tests:
  - it: "should list tools"
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
          tools: "match:type:array"
EOF

# Run tests (after init, you can use npx or npm script)
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"  # Matches both test/ and tests/

# Or add to package.json scripts:
# "scripts": { "test:mcp": "mcp-conductor \"./test*/mcp/**/*.test.mcp.yml\"" }
# Then run: npm run test:mcp
```

### Manual Setup (Alternative)

```bash
# Create config manually
echo '{"name":"My Server","command":"node","args":["./server.js"]}' > conductor.config.json

# Write test
cat > test.yml << 'EOF'
description: "Basic test"
tests:
  - it: "should list tools"
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
          tools: "match:type:array"
EOF

# Run test
conductor test.yml --config conductor.config.json
```

## ✨ Key Features

- 🎯 **Declarative YAML Testing** - Simple, readable test definitions
- 💻 **Programmatic API** - JavaScript/TypeScript integration with any test framework
- 🔄 **Automatic MCP Protocol** - Handles handshakes and JSON-RPC messaging
- 🧪 **Advanced Pattern Matching** - 18+ verified pattern types including numeric comparisons and robust validation
- 📊 **Rich Reporting** - Detailed diffs and colored output
- 🛡️ **Robust Communication** - Reliable stdio transport handling

## 📖 Documentation

**📚 [Complete Documentation](https://conductor.rhino-inquisitor.com/)**

- [🚀 Installation](https://conductor.rhino-inquisitor.com/installation.html)
- [⚡ Quick Start Guide](https://conductor.rhino-inquisitor.com/quick-start.html)
- [📝 YAML Testing](https://conductor.rhino-inquisitor.com/yaml-testing.html)
- [💻 Programmatic Testing](https://conductor.rhino-inquisitor.com/programmatic-testing.html)
- [🔍 Pattern Matching](https://conductor.rhino-inquisitor.com/pattern-matching.html)
- [🏗️ Examples](https://conductor.rhino-inquisitor.com/examples.html)
- [🛠️ API Reference](https://conductor.rhino-inquisitor.com/api-reference.html)
- [🔧 Troubleshooting](https://conductor.rhino-inquisitor.com/troubleshooting.html)

## 🚀 Testing Approaches

### YAML Declarative Testing
```yaml
description: "Calculator tests"
tests:
  - it: "should add numbers"
    request:
      jsonrpc: "2.0"
      id: "calc-1"
      method: "tools/call"
      params:
        name: "calculator"
        arguments: { a: 15, b: 27 }
    expect:
      response:
        jsonrpc: "2.0"
        id: "calc-1"
        result:
          content:
            - type: "text"
              text: "match:Result: \\d+"
```

### Advanced Pattern Matching Examples
```yaml
# Numeric comparisons
tests:
  - it: "should validate numeric ranges"
    expect:
      response:
        result:
          score: "match:greaterThan:85"          # Score > 85
          count: "match:between:10:100"          # Count between 10-100
          percentage: "match:lessThanOrEqual:95" # Percentage <= 95
          
  - it: "should validate with pattern negation"
    expect:
      response:
        result:
          value: "match:not:greaterThan:1000"    # Value should NOT be > 1000
          status: "match:not:contains:error"     # Status should NOT contain "error"
```

### Programmatic Testing
```javascript
import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('MCP Server Tests', () => {
  let client;
  
  before(async () => { 
    client = await connect('./conductor.config.json'); 
  });
  
  after(async () => { 
    await client?.disconnect(); 
  });
  
  beforeEach(() => {
    // CRITICAL: Prevents stderr leaking between tests
    client.clearStderr();
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools));
    assert.ok(tools.length > 0);
    
    // Verify tool structure
    tools.forEach(tool => {
      assert.ok(tool.name, 'Tool should have name');
      assert.ok(tool.description, 'Tool should have description');
      assert.ok(tool.inputSchema, 'Tool should have input schema');
    });
  });

  test('should execute calculator tool', async () => {
    const result = await client.callTool('calculator', { 
      operation: 'add', a: 15, b: 27 
    });
  
    assert.equal(result.isError, false);
    assert.equal(result.content[0].type, 'text');
    assert.equal(result.content[0].text, 'Result: 42');
  });

  test('should handle tool errors gracefully', async () => {
    try {
      await client.callTool('nonexistent_tool', {});
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.message.includes('Failed to call tool'));
    }
  });
});
```

## 🏃‍♂️ Running Tests

```bash
# YAML tests with various options
conductor "tests/**/*.test.mcp.yml" --config config.json

# Verbose output with test hierarchy
conductor "tests/*.yml" --config config.json --verbose

# Debug mode with detailed MCP communication
conductor "tests/*.yml" --config config.json --debug

# Timing information for performance analysis
conductor "tests/*.yml" --config config.json --timing

# JSON output for CI/automation systems  
conductor "tests/*.yml" --config config.json --json

# Quiet mode (minimal output)
conductor "tests/*.yml" --config config.json --quiet

# Combine multiple options
conductor "tests/*.yml" --config config.json --verbose --timing --debug

# Programmatic tests  
node --test tests/**/*.programmatic.test.js

# Example tests (included)
npm run test:examples

# Specific example servers
npm run test:filesystem    # File operations with regex patterns
npm run test:multitool     # Multi-tool server with comprehensive patterns  
npm run test:numeric       # Numeric pattern matching demonstrations
```

## 🤝 Contributing

Contributions welcome! See our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Development setup
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor
npm install

# Run all tests
npm test
```

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**📚 [View Complete Documentation](https://conductor.rhino-inquisitor.com/)** | **🐛 [Report Issues](https://github.com/taurgis/mcp-conductor/issues)** | **⭐ [Star on GitHub](https://github.com/taurgis/mcp-conductor)**
