# MCP Conductor

> A comprehensive Node.js testing library for Model Context Protocol (MCP) servers

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP Conductor provides both **YAML-based declarative testing** and **programmatic testing** for MCP servers with advanced pattern matching capabilities, including case-insensitive matching, pattern negation, comprehensive numeric comparison patterns (with exact equality, floating-point tolerance, and precision validation), date/timestamp validation patterns, and cross-field relationship validation.

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
- 🧪 **Advanced Pattern Matching** - 30+ verified pattern types including case-insensitive matching, exact numeric equality, floating-point tolerance, decimal precision validation, modular arithmetic, comprehensive date/timestamp validation, and cross-field relationship validation
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

# 🆕 NEW: Exact numeric matching and precision validation
  - it: "should validate exact numeric values and precision"
    expect:
      response:
        result:
          productCount: "match:equals:42"        # Exact equality: 42 = 42
          categoryId: "match:notEquals:10"       # Inequality: 8 ≠ 10
          price: "match:decimalPlaces:2"         # Currency format: 24.99 (2 decimals)
          rating: "match:decimalPlaces:1"        # Rating format: 4.2 (1 decimal)
          stock: "match:multipleOf:5"            # Inventory rule: multiple of 5
          percentage: "match:divisibleBy:10"     # Business rule: divisible by 10

# 🆕 NEW: Floating point tolerance matching  
  - it: "should validate floating point with tolerance"
    expect:
      response:
        result:
          successRate: "match:approximately:95.5:0.1"  # 95.5 ± 0.1 tolerance
          loadAverage: "match:approximately:1.2:0.05"  # Performance metric ± 0.05
          temperature: "match:approximately:20:0.5"    # Sensor reading ± 0.5°C

# Date and timestamp validation
  - it: "should validate dates and timestamps"
    expect:
      response:
        result:
          createdAt: "match:dateValid"               # Valid date/timestamp
          publishDate: "match:dateAfter:2023-01-01"  # After specific date
          expireDate: "match:dateBefore:2025-01-01"  # Before specific date
          lastUpdate: "match:dateAge:1d"             # Within last day
          eventTime: "match:dateBetween:2023-01-01:2024-12-31"  # Date range
          timestamp: "match:dateFormat:iso"          # ISO 8601 format

# 🆕 NEW: Cross-field validation for field relationships
  - it: "should validate field relationships and constraints"
    expect:
      response:
        result:
          "match:crossField": "startDate < endDate"     # Event dates relationship
          "match:crossField": "minPrice <= maxPrice"    # Pricing constraints  
          "match:crossField": "currentStock > minStock" # Inventory validation
          "match:crossField": "age >= minAge"           # User validation
          "match:crossField": "amount != fee"           # Financial rules
          
  - it: "should support nested field paths in cross-field validation"
    expect:
      response:
        result:
          "match:crossField": "user.profile.age >= settings.minAge"    # Nested field comparison
          "match:crossField": "order.total > payment.amount"           # Complex object validation
          
  - it: "should validate with pattern negation"
    expect:
      response:
        result:
          value: "match:not:greaterThan:1000"    # Value should NOT be > 1000
          status: "match:not:contains:error"     # Status should NOT contain "error"
          invalidDate: "match:not:dateValid"     # Should NOT be valid date

  - it: "should validate case-insensitive patterns"
    expect:
      response:
        result:
          name: "match:containsIgnoreCase:john"    # Matches "John", "JOHN", "johnny" (case-insensitive)
          status: "match:equalsIgnoreCase:SUCCESS" # Matches "success", "Success", "SUCCESS" (case-insensitive)
          message: "match:not:containsIgnoreCase:ERROR" # Should NOT contain "error" (case-insensitive)
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

# Error reporting options
conductor "tests/*.yml" --config config.json --errors-only
conductor "tests/*.yml" --config config.json --syntax-only  
conductor "tests/*.yml" --config config.json --no-analysis
conductor "tests/*.yml" --config config.json --group-errors
conductor "tests/*.yml" --config config.json --max-errors 3

# Combine multiple options
conductor "tests/*.yml" --config config.json --verbose --timing --debug

# Programmatic tests  
node --test tests/**/*.programmatic.test.js

# Example tests (included)
npm run test:examples

# Specific example servers
npm run test:filesystem    # File operations with regex patterns
npm run test:multitool     # Multi-tool server with comprehensive patterns  
npm run test:numeric       # Numeric and date pattern matching demonstrations
```

## 🎛️ CLI Options

### Output & Debugging Options
- **`--verbose, -v`**: Display individual test results with the test suite hierarchy
- **`--debug, -d`**: Enable debug mode with detailed MCP communication logging
- **`--timing, -t`**: Show timing information for tests and operations
- **`--json, -j`**: Output results in JSON format for CI/automation systems
- **`--quiet, -q`**: Suppress non-essential output (opposite of verbose)

### Error Reporting Options
- **`--errors-only`**: Show only failed tests and their errors, hide passing tests
  - Useful for focusing on failures in large test suites
  - Provides clean output for debugging sessions
  
- **`--syntax-only`**: Show only syntax-related errors and suggestions
  - Highlights pattern syntax issues like missing `match:` prefixes
  - Recommends corrections for common syntax mistakes
  
- **`--no-analysis`**: Disable detailed validation analysis, show only basic error messages
  - Provides minimal error output without suggestions or analysis
  - Faster execution when detailed analysis isn't needed
  
- **`--group-errors`**: Group similar errors together to reduce repetition
  - Consolidates identical validation failures across multiple paths
  - Shows error frequency and affected paths in summary format
 
- **`--concise`**: Suppress per-test detailed analysis blocks (requires `--group-errors`)
  - Hides the "🔍 Detailed Validation Analysis" section for each failing test
  - Keeps high-level failure lines and the aggregated grouped error summary
  - Ideal for very large failing suites where per-test verbosity is noisy
  
- **`--max-errors <number>`**: Limit the number of validation errors shown per test (default: 5)
  - Prevents overwhelming output when tests have many validation failures
  - Shows "... and X more validation error(s)" for truncated errors

### Example Usage
```bash
# Focus on failures only
conductor "tests/*.yml" --config config.json --errors-only

# Get syntax suggestions for pattern fixes
conductor "tests/*.yml" --config config.json --syntax-only

# Minimal error output for scripting
conductor "tests/*.yml" --config config.json --no-analysis --quiet

# Group similar errors for large test suites
conductor "tests/*.yml" --config config.json --group-errors

# Concise grouped summary (no per-test analysis blocks)
conductor "tests/*.yml" --config config.json --group-errors --concise --errors-only

# Limit error details for quick overview
conductor "tests/*.yml" --config config.json --max-errors 2

# Combine error reporting options
conductor "tests/*.yml" --config config.json --errors-only --group-errors --max-errors 3
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
