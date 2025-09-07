---
title: Development Guide - Contributing to MCP Conductor
layout: default
description: >-
  Development guide for contributing to MCP Conductor Model Context Protocol
  testing library. Learn project architecture, setup development environment,
  contribute features, and extend the testing framework.
keywords: >-
  MCP Conductor development, Model Context Protocol development, contributing to
  MCP Conductor, MCP testing framework development, open source MCP testing
canonical_url: "https://conductor.rhino-inquisitor.com/development"
---

# Development Guide
## Contributing to MCP Conductor

Contributing to MCP Conductor development and extending the Model Context Protocol testing framework. Learn the architecture, setup development environment, and contribute new features.

## Table of Contents
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Contributing Guidelines](#contributing-guidelines)
- [Adding Features](#adding-features)
- [Testing](#testing)
- [Release Process](#release-process)

## Development Setup

### Prerequisites
- **Node.js** 18+ with npm
- **Git** for version control
- **Node.js Built-in Test Runner** (no additional test framework needed)

### Clone and Install
```bash
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor

# Install dependencies
npm install

# Run tests to verify setup
npm test
```

### Project Structure
```
mcp-conductor/
├── bin/
│   └── conductor.js              # CLI entrypoint
├── src/
│   ├── cli/                      # CLI modules
│   │   ├── testParser.js         # YAML test parsing
│   │   ├── testRunner.js         # Test execution engine
│   │   └── reporter.js           # Output formatting
│   ├── core/                     # Core engine modules
│   │   ├── configParser.js       # Configuration validation
│   │   └── MCPCommunicator.js    # MCP protocol communication
│   ├── programmatic/             # Programmatic API
│   │   └── MCPClient.js          # Client for JavaScript/TypeScript
│   └── index.js                  # Main exports
├── test/                         # Unit tests
├── examples/                     # Example servers and tests
└── docs-site/                    # Documentation website
```

## Project Architecture

### Core Modules

#### **CLI Entry Point** (`bin/conductor.js`)
- Commander.js-based CLI interface
- Argument parsing and validation
- Test file discovery via glob patterns
- Exit code management

```javascript
// Key responsibilities:
// - Parse CLI arguments
// - Load configuration files
// - Discover test files via glob patterns
// - Orchestrate test execution
// - Manage exit codes
```

#### **Configuration Parser** (`src/core/configParser.js`)
- JSON configuration validation
- Environment variable merging
- Default value assignment

```javascript
// Schema validation for:
// - Required fields: name, command, args
// - Optional fields: cwd, env, startupTimeout, readyPattern
// - Type validation and sanitization
```

#### **Test Parser** (`src/cli/testParser.js`)
- YAML test file parsing
- JSON-RPC 2.0 validation
- Test structure validation

```javascript
// Validates:
// - YAML syntax and structure
// - JSON-RPC message format
// - Required test fields
// - Pattern matching syntax
```

#### **MCP Communicator** (`src/core/MCPCommunicator.js`)
- Low-level stdio communication
- Process lifecycle management
- Stream handling and message framing

```javascript
// Key features:
// - Child process spawning and management
// - JSON-RPC message framing over stdio
// - Stderr capture and buffering
// - Graceful shutdown handling
```

#### **Test Engine** (`src/test-engine/runner.js`, `executor.js`, `matchers/`)
- Core test execution engine
- Modular pattern matching system
- MCP protocol handshake

```javascript
// 11+ pattern matching types:
// - Deep equality, type validation
// - String patterns (contains, regex)
// - Array patterns (length, elements, contains)
// - Field extraction and partial matching
```

#### **Reporter** (`src/test-engine/reporter.js`)
- Rich output formatting
- Colored terminal output
- Test result aggregation

```javascript
// Features:
// - Chalk for colored output
// - Jest-diff for rich diffs
// - Summary statistics
// - Pass/fail indicators
```

### Programmatic API

#### **MCPClient** (`src/programmatic/MCPClient.js`)
- Promise-based API for JavaScript/TypeScript
- Lifecycle management
- Error handling

```javascript
// Core methods:
// - connect() / disconnect()
// - listTools() / callTool()
// - sendMessage() for raw JSON-RPC
// - getStderr() / clearStderr()
```

## Contributing Guidelines

### Code Standards
- **ES2020+** JavaScript with async/await
- **JSDoc** comments for public APIs
- **2-space indentation**
- **Semicolons required**
- **Strict error handling**

### Commit Convention
```bash
# Format: type(scope): description
git commit -m "feat(runner): add regex pattern matching"
git commit -m "fix(client): handle connection timeout properly"
git commit -m "docs(readme): update installation instructions"
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes  
- `docs`: Documentation changes
- `test`: Test additions/changes
- `refactor`: Code refactoring
- `chore`: Build/tooling changes

### Pull Request Process
1. **Fork** the repository
2. **Create feature branch** from `main`
3. **Implement changes** with tests
4. **Run test suite**: `npm test`
5. **Update documentation** as needed
6. **Submit pull request** with clear description

### Code Review Checklist
- [ ] Tests pass: `npm test`
- [ ] New features have tests
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Error handling implemented
- [ ] Performance considerations addressed

## Adding Features

### Adding New Pattern Matchers

1. **Extend Pattern Recognition** in `src/test-engine/matchers/patterns.js`:

```javascript
// Add new pattern type
function matchPattern(pattern, actual) {
  if (pattern.startsWith('custom_pattern:')) {
    return matchCustomPattern(actual, pattern.substring(15));
  }
  // ... existing patterns
}

function matchCustomPattern(actual, value) {
  // Implement custom pattern logic
  return { matches: boolean, reason: string };
}
```

2. **Add Tests** in `test/testRunner.test.js`:

```javascript
describe('Custom Pattern Matching', () => {
  test('should match custom pattern', async () => {
    const testCase = {
      request: { /* JSON-RPC request */ },
      expect: {
        response: {
          result: {
            data: "match:custom_pattern:expected_value"
          }
        }
      }
    };
    
    // Test implementation
  });
});
```

3. **Update Documentation**:
   - Add to `docs-site/pattern-matching.md`
   - Include examples in `docs-site/examples.md`

### Adding CLI Options

1. **Extend Commander.js** in `bin/conductor.js`:

```javascript
program
  .option('--new-option <value>', 'Description of new option')
  .action((testFiles, options) => {
    if (options.newOption) {
      // Handle new option
    }
  });
```

2. **Add Option Handling**:

```javascript
// Pass option to core modules
const runnerOptions = {
  verbose: options.verbose,
  newOption: options.newOption
};
```

### Adding Programmatic API Methods

1. **Extend MCPClient** in `src/programmatic/MCPClient.js`:

```javascript
class MCPClient {
  async newMethod(parameter) {
    if (!this.connected) {
      throw new Error('Client not connected');
    }
    
    try {
      const response = await this.sendMessage({
        jsonrpc: "2.0",
        id: this.generateId(),
        method: "new/method",
        params: { parameter }
      });
      
      return response.result;
    } catch (error) {
      throw new Error(`Failed to execute new method: ${error.message}`);
    }
  }
}
```

2. **Add TypeScript Types**:

```typescript
// In index.d.ts
export interface MCPClient {
  newMethod(parameter: string): Promise<any>;
}
```

## Testing

### Test Structure
```
test/
├── configParser.test.js    # Configuration validation tests
├── testParser.test.js      # YAML parsing tests  
├── MCPCommunicator.test.js # Protocol communication tests
├── testRunner.test.js      # Test execution tests
├── reporter.test.js        # Output formatting tests
├── cli.test.js            # CLI integration tests
└── fixtures/              # Test data and mock servers
```

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run example server tests
npm run test:examples

# Run programmatic API tests
npm run test:programmatic
```

### Writing Tests

#### **Unit Tests**
```javascript
import { describe, test } from 'node:test';
import assert from 'node:assert';
import { loadConfig } from '../src/core/configParser.js';

describe('Configuration Parser', () => {
  test('should validate required fields', async () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['./server.js']
    };
    
    const result = await loadConfig('./test-config.json');
    assert.ok(result.name);
    assert.ok(result.command);
    assert.ok(Array.isArray(result.args));
  });
  
  test('should reject invalid configuration', async () => {
    await assert.rejects(
      async () => await loadConfig('./invalid-config.json'),
      /Missing required configuration fields/
    );
  });
});
```

#### **Integration Tests**
```javascript
import { describe, test } from 'node:test';
import assert from 'node:assert';
import { runTests } from '../src/test-engine/runner.js';

describe('Integration Tests', () => {
  test('should run complete test suite', async () => {
    const config = { /* valid config */ };
    const testSuite = { /* valid test suite */ };
    
    const results = await runTests(config, testSuite);
    
    assert.ok(results.totalTests > 0);
    assert.equal(results.passedTests, results.totalTests);
  });
});
```

### Mock Servers for Testing

Create mock MCP servers in `test/fixtures/`:

```javascript
// test/fixtures/mock-server.js
#!/usr/bin/env node

const responses = {
  'tools/list': { tools: [{ name: 'mock_tool', description: 'Mock tool' }] },
  'tools/call': { content: [{ type: 'text', text: 'Mock response' }] }
};

process.stdin.on('data', (data) => {
  const message = JSON.parse(data.toString());
  const response = {
    jsonrpc: "2.0",
    id: message.id,
    result: responses[message.method] || { error: 'Unknown method' }
  };
  console.log(JSON.stringify(response));
});
```

## Release Process

### Versioning
Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Steps

1. **Update Version**:
```bash
# For patch release
npm version patch

# For minor release  
npm version minor

# For major release
npm version major
```

2. **Update Changelog**:
```markdown
## [1.2.3] - 2024-01-15

### Added
- New pattern matching type: `arrayContains`
- Support for custom timeout configurations

### Fixed
- Handle edge case in regex pattern escaping
- Improve error messages for connection failures

### Changed
- Improved performance for large test suites
```

3. **Run Full Test Suite**:
```bash
npm run test:all
npm run test:integration
```

4. **Build and Publish**:
```bash
npm run build
npm publish
```

5. **Create GitHub Release**:
- Tag the commit
- Write release notes
- Attach any artifacts

### Pre-release Testing
```bash
# Test installation
npm pack
npm install -g mcp-conductor-*.tgz

# Verify CLI works
conductor --help
conductor examples/filesystem.test.mcp.yml --config examples/config.json --verbose --debug

# Test programmatic API
node -e "
const { createClient } = require('mcp-conductor');
console.log('API imports successfully');
"
```

## Development Best Practices

### ✅ **Error Handling**
```javascript
// ✅ Good - Comprehensive error handling
async function connectToServer(config) {
  try {
    const server = await startServer(config);
    return server;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Command not found: ${config.command}`);
    } else if (error.code === 'EACCES') {
      throw new Error(`Permission denied: ${config.command}`);
    } else {
      throw new Error(`Failed to start server: ${error.message}`);
    }
  }
}

// ❌ Bad - Generic error handling
async function connectToServer(config) {
  try {
    return await startServer(config);
  } catch (error) {
    throw error; // Not helpful for debugging
  }
}
```

### ✅ **Input Validation**
```javascript
// ✅ Good - Validate all inputs
function validatePattern(pattern) {
  if (typeof pattern !== 'string') {
    throw new Error('Pattern must be string');
  }
  
  if (pattern.startsWith('match:regex:')) {
    const regex = pattern.slice(12);
    try {
      new RegExp(regex);
    } catch (error) {
      throw new Error(`Invalid regex pattern: ${regex}`);
    }
  }
  
  return true;
}

// ❌ Bad - No validation
function validatePattern(pattern) {
  return true;
}
```

### ✅ **Performance Considerations**
```javascript
// ✅ Good - Efficient pattern matching
const patternCache = new Map();

function compileRegex(pattern) {
  if (!patternCache.has(pattern)) {
    patternCache.set(pattern, new RegExp(pattern));
  }
  return patternCache.get(pattern);
}

// ❌ Bad - Recompiling regex every time
function matchRegex(text, pattern) {
  return new RegExp(pattern).test(text);
}
```

---

**Ready to Contribute?**
1. Check [**GitHub Issues**](https://github.com/taurgis/mcp-conductor/issues) for open tasks
2. Read the [**Contributing Guidelines**](#contributing-guidelines)
3. Set up your [**Development Environment**](#development-setup)
4. Start with a small feature or bug fix
5. Submit your first pull request!

**Questions?** Open a [**GitHub Discussion**](https://github.com/taurgis/mcp-conductor/discussions) or create an issue.
