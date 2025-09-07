---
layout: default
title: MCP Conductor - Comprehensive Model Context Protocol Testing Library
description: >-
  Professional Node.js testing framework for Model Context Protocol (MCP) servers.
  Features YAML declarative testing, programmatic JavaScript/TypeScript APIs, 
  advanced pattern matching, and 100% MCP protocol compliance validation.
keywords: >-
  Model Context Protocol testing, MCP server validation, Node.js testing library,
  JSON-RPC testing, stdio protocol testing, AI agent testing, LLM tool validation
canonical_url: "https://conductor.rhino-inquisitor.com/"
image: /assets/images/mcp-conductor-social-card.png
---

# MCP Conductor
## The Complete Model Context Protocol Testing Solution

<div class="hero-section">
  <h2>Comprehensive testing for Model Context Protocol servers</h2>
  <p class="lead">A powerful Node.js testing library that provides both YAML-based declarative testing and programmatic testing for MCP servers with advanced pattern matching capabilities and 100% protocol compliance validation.</p>
  
  <div class="hero-badges">
    <a href="https://www.npmjs.com/package/mcp-conductor" aria-label="npm package"><img src="https://img.shields.io/npm/v/mcp-conductor.svg" alt="npm version"></a>
    <a href="https://github.com/taurgis/mcp-conductor" aria-label="GitHub repository"><img src="https://img.shields.io/github/stars/taurgis/mcp-conductor.svg" alt="GitHub stars"></a>

  </div>
</div>

## 🚀 Quick Start

Get up and running with MCP Conductor in minutes:

```bash
# Install globally
npm install -g mcp-conductor

# Initialize in your MCP project
cd my-mcp-project
npx mcp-conductor init

# This creates:
# - conductor.config.json (auto-configured from package.json)
# - test/mcp/ or tests/mcp/ directory structure  
# - AGENTS.md guide for AI development
```

Create your first test:

**YAML Testing** (`test/mcp/my-server.test.mcp.yml`):
```yaml
description: "Basic MCP server tests"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "test-1" 
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result:
          tools: "match:type:array"
```

**Programmatic Testing** (`test/mcp/my-server.test.js`):
```javascript
import { test, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

let client;
before(async () => { client = await connect('./conductor.config.json'); });
after(async () => { await client.disconnect(); });

test('should list available tools', async () => {
  const tools = await client.listTools();
  assert.ok(Array.isArray(tools), 'Should return array of tools');
});
```

Run the tests:

```bash
# Run YAML tests
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"

# With verbose output and debugging
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml" --verbose --debug

# Run programmatic tests
node --test "test*/mcp/*.test.js"
```

## 📖 Documentation

<div class="docs-grid">
  <div class="doc-card">
    <h3><a href="{{ '/installation.html' | relative_url }}">🚀 Installation</a></h3>
    <p>Get MCP Conductor installed and configured</p>
  </div>
  
  <div class="doc-card">
    <h3><a href="{{ '/quick-start.html' | relative_url }}">⚡ Quick Start</a></h3>
    <p>Your first MCP Conductor test in 5 minutes</p>
  </div>
  
  <div class="doc-card">
    <h3><a href="{{ '/yaml-testing.html' | relative_url }}">📝 YAML Testing</a></h3>
    <p>Declarative testing with powerful pattern matching</p>
  </div>
  
  <div class="doc-card">
    <h3><a href="{{ '/programmatic-testing.html' | relative_url }}">💻 Programmatic Testing</a></h3>
    <p>JavaScript/TypeScript API for advanced scenarios</p>
  </div>
  
  <div class="doc-card">
    <h3><a href="{{ '/pattern-matching.html' | relative_url }}">🔍 Pattern Matching</a></h3>
    <p>11+ verified pattern types for flexible validation</p>
  </div>
  
  <div class="doc-card">
    <h3><a href="{{ '/examples.html' | relative_url }}">🏗️ Examples</a></h3>
    <p>Real-world examples and best practices</p>
  </div>
</div>

## ✨ Key Features

<div class="features-grid">
  <div class="feature">
    <h3>🎯 Declarative Testing</h3>
    <p>Write tests in simple YAML files with intuitive syntax</p>
  </div>
  
  <div class="feature">
    <h3>🔄 Automatic Protocol Handling</h3>
    <p>Handles MCP initialization handshake and JSON-RPC messaging</p>
  </div>
  
  <div class="feature">
    <h3>🧪 Advanced Pattern Matching</h3>
    <p>11+ verified pattern types including regex, partial matching, and field extraction</p>
  </div>
  
  <div class="feature">
    <h3>📊 Rich Reporting</h3>
    <p>Color-coded output with detailed diffs for test failures</p>
  </div>
  
  <div class="feature">
    <h3>🛠️ Programmatic API</h3>
    <p>JavaScript/TypeScript API for complex testing scenarios</p>
  </div>
  
  <div class="feature">
    <h3>🔧 Framework Integration</h3>
    <p>Works with Node.js test runner, Jest, Mocha, and more</p>
  </div>
</div>

##  Why Choose MCP Conductor?

**The industry standard for MCP testing** - battle-tested with production servers and trusted by developers building AI agents and protocol-compliant applications.

- **Complete Protocol Coverage**: Full MCP 2025-06-18 compliance with JSON-RPC 2.0 validation
- **Dual Testing Approaches**: Both YAML declarative and programmatic JavaScript/TypeScript APIs
- **Advanced Pattern Matching**: 11+ verified pattern types for flexible validation
- **Production Ready**: 280+ test cases, 100% test coverage, successfully tested with real MCP servers
- **Developer Friendly**: Rich reporting, colored output, detailed diffs, and CI/CD integration

## 🤖 AI Agent Support

MCP Conductor includes specialized documentation for AI coding assistants:

- **Pattern recognition** for MCP project detection
- **Automatic test generation** guidelines
- **Best practices** for AI-generated test suites
- **Integration patterns** with development workflows

[View AI Agent Guide]({{ '/ai-agents.html' | relative_url }})

---

<div class="get-started-section">
  <h2>Ready to get started?</h2>
  <p><a href="{{ '/installation.html' | relative_url }}" class="btn-primary">Install MCP Conductor</a> or <a href="{{ '/quick-start.html' | relative_url }}" class="btn-secondary">Try the Quick Start</a></p>
</div>

<style>
.hero-section {
  text-align: center;
  margin: 2rem 0;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.hero-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.2rem;
  color: #6c757d;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature {
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
}

.feature h3 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.doc-card {
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #f8f9fa;
}

.doc-card h3 {
  margin-bottom: 0.5rem;
}

.doc-card h3 a {
  text-decoration: none;
  color: #0066cc;
}

.doc-card h3 a:hover {
  text-decoration: underline;
}

.get-started-section {
  text-align: center;
  margin: 3rem 0;
  padding: 2rem;
  background: #e3f2fd;
  border-radius: 8px;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-primary:hover, .btn-secondary:hover {
  opacity: 0.9;
  text-decoration: none;
}
</style>
