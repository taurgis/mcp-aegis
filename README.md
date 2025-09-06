# MCP Conductor

> A comprehensive Node.js testing ## Documentation

**📚 [Complete Documentation](https://conductor.rhino-inquisitor.com/)**

- [🚀 Installation](https://conductor.rhino-inquisitor.com/installation.html)
- [⚡ Quick Start Guide](https://conductor.rhino-inquisitor.com/quick-start.html)
- [📝 YAML Testing](https://conductor.rhino-inquisitor.com/yaml-testing.html)
- [💻 Programmatic Testing](https://conductor.rhino-inquisitor.com/programmatic-testing.html)
- [🔍 Pattern Matching](https://conductor.rhino-inquisitor.com/pattern-matching.html)
- [🏗️ Examples](https://conductor.rhino-inquisitor.com/examples.html)
- [🛠️ API Reference](https://conductor.rhino-inquisitor.com/api-reference.html)
- [🔧 Troubleshooting](https://conductor.rhino-inquisitor.com/troubleshooting.html)Model Context Protocol (MCP) servers

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP Conductor provides both **YAML-based declarative testing** and **programmatic testing** for MCP servers with advanced pattern matching capabilities.

## ⚡ Quick Start

```bash
# Clone and install (development)
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor
npm install

# Create config
echo '{"name":"My Server","command":"node","args":["./server.js"]}' > config.json

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
node bin/conductor.js test.yml --config config.json
```

## ✨ Key Features

- 🎯 **Declarative YAML Testing** - Simple, readable test definitions
- 💻 **Programmatic API** - JavaScript/TypeScript integration with any test framework
- 🔄 **Automatic MCP Protocol** - Handles handshakes and JSON-RPC messaging
- 🧪 **Advanced Pattern Matching** - 11+ pattern types for flexible validation
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

### Programmatic Testing
```javascript
import { test, before, after } from 'node:test';
import { connect } from 'mcp-conductor';

let client;
before(async () => { client = await connect('./config.json'); });
after(async () => { await client.disconnect(); });

test('calculator adds correctly', async () => {
  const result = await client.callTool('calculator', { a: 15, b: 27 });
  assert.equal(result.content[0].text, 'Result: 42');
});
```

## 🏃‍♂️ Running Tests

```bash
# YAML tests
node bin/conductor.js "tests/**/*.test.mcp.yml" --config config.json

# Programmatic tests  
node --test tests/**/*.programmatic.test.js

# Example tests (included)
npm run test:examples
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
