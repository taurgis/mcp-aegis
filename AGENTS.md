# MCP Conductor - AI Agent Guide

**Target Audience**: AI coding assistants, automated testing agents, and AI-powered development tools

## Overview

**MCP Conductor** is a comprehensive Node.js testing library for Model Context Protocol (MCP) servers. It provides both **declarative YAML-based testing** and **programmatic JavaScript/TypeScript testing** with 11+ verified pattern matching capabilities.

### 📚 Documentation Resources
- **[Complete Documentation](https://conductor.rhino-inquisitor.com/)** - Full guide and reference
- **[Installation](https://conductor.rhino-inquisitor.com/installation.html)** | **[Quick Start](https://conductor.rhino-inquisitor.com/quick-start.html)**
- **[YAML Testing](https://conductor.rhino-inquisitor.com/yaml-testing.html)** | **[Programmatic Testing](https://conductor.rhino-inquisitor.com/programmatic-testing.html)**
- **[Pattern Matching](https://conductor.rhino-inquisitor.com/pattern-matching.html)** | **[Examples](https://conductor.rhino-inquisitor.com/examples.html)**

### MCP Architecture for AI Agents
```
AI Agent → MCP Client → MCP Server → Tools/Services
    ↓
MCP Conductor → Test Validation → Quality Assurance
```

**Common Tool Categories**: Data retrieval, content generation, external services, analysis tools, component libraries, knowledge bases

### Core AI Agent Use Cases
1. **Generate comprehensive test suites** for MCP servers (YAML + programmatic)
2. **Validate MCP protocol compliance** with automatic handshake handling
3. **Create maintainable, human-readable test files** with 11+ pattern matching types
4. **Test multi-step agent workflows** and state management
5. **Validate performance** for real-time AI interactions

## Installation & Setup

### Quick Installation
```bash
# Install globally
npm install -g mcp-conductor

# Or use locally  
npm install --save-dev mcp-conductor

# Initialize in project (recommended)
npx mcp-conductor init
```

### Manual Configuration
Always create configuration file first (`conductor.config.json`):

```json
{
  "name": "My MCP Server",
  "command": "node", 
  "args": ["./server.js"],
  "startupTimeout": 5000,
  "env": {
    "NODE_ENV": "test"
  }
}
```

**Configuration Rules**:
- `command`: Detect from package.json (node, python, etc.)
- `args`: Include server file and required arguments
- `startupTimeout`: Use 5000ms default, increase for complex servers
- `env`: Add test-specific environment variables
- `readyPattern`: Optional regex for server ready signal

### CLI Commands & Options

#### Basic Usage
```bash
# Run YAML tests
conductor "tests/**/*.test.mcp.yml" --config "conductor.config.json"

# Or use npx
npx mcp-conductor "tests/**/*.test.mcp.yml" --config "conductor.config.json"

# Run programmatic tests
node --test "tests/**/*.programmatic.test.js"
```

#### CLI Options Reference

| Option | Purpose | Output | Use Case |
|--------|---------|---------|----------|
| `--verbose` | Development & debugging | Test hierarchy, results, timing | Test development, manual debugging |
| `--debug` | Protocol analysis | JSON-RPC messages, handshakes | Communication issues, protocol problems |
| `--timing` | Performance analysis | Server startup, test durations | Performance optimization, timeout issues |
| `--json` | CI/automation | Structured JSON results | CI integration, automated reporting |
| `--quiet` | Script integration | Exit codes only | Automated scripts, background testing |

#### Combined Options
```bash
# Comprehensive debugging
conductor "tests/*.yml" --config "config.json" --verbose --debug --timing

# CI with metrics
conductor "tests/*.yml" --config "config.json" --json --timing
```

## Testing Approaches

### YAML Declarative Testing
```yaml
description: "Comprehensive test suite for [SERVER_NAME]"
tests:
  # Protocol compliance (always include)
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tools-1"
        result:
          tools: "match:type:array"
      stderr: "toBeEmpty"

  # Tool execution
  - it: "should execute [TOOL_NAME] successfully"
    request:
      jsonrpc: "2.0"
      id: "call-1"
      method: "tools/call"
      params:
        name: "[TOOL_NAME]"
        arguments:
          param1: "value1"
    expect:
      response:
        jsonrpc: "2.0"
        id: "call-1"
        result:
          content:
            - type: "text"
              text: "match:contains:expected"
          isError: false
      stderr: "toBeEmpty"
```

### Programmatic Testing
```javascript
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('[SERVER_NAME] Tests', () => {
  let client;

  before(async () => {
    client = await connect('./conductor.config.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools), 'Tools should be array');
    assert.ok(tools.length > 0, 'Should have at least one tool');
  });

  test('should execute tool successfully', async () => {
    const result = await client.callTool('[TOOL_NAME]', { param: 'value' });
    assert.ok(result.content, 'Should return content');
    assert.equal(result.isError, false, 'Should not be error');
  });
});
```

## Pattern Matching System

MCP Conductor provides **11+ verified pattern matching types** for comprehensive validation:

### Core Pattern Types

#### 1. Deep Equality (default)
```yaml
result:
  tools:
    - name: "exact_match"
      description: "Must match exactly"
```

#### 2. Type Validation
```yaml
result:
  tools: "match:type:array"
  count: "match:type:number"
  serverInfo: "match:type:object"
  message: "match:type:string"
  active: "match:type:boolean"
```

#### 3. String Patterns
```yaml
result:
  description: "match:contains:search"     # Contains substring
  name: "match:startsWith:get_"            # Starts with prefix
  version: "match:endsWith:.0"             # Ends with suffix
```

#### 4. Regex Patterns (escape backslashes!)
```yaml
result:
  content:
    - text: "match:\\d+ files found"                    # Numbers
    - text: "match:Status: (success|error)"             # Alternatives
    - text: "match:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"  # Email
    - text: "match:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"  # UUID
```

#### 5. Array Patterns
```yaml
result:
  tools: "match:arrayLength:6"             # Exactly 6 elements
  tools:
    match:arrayElements:                   # All elements must match pattern
      name: "match:type:string"
      description: "match:type:string"
  match:extractField: "tools.*.name"      # Extract field values  
  value: "match:arrayContains:search_docs" # Check if array contains value
```

#### 6. Field Extraction & Validation
```yaml
result:
  match:extractField: "tools.*.name"      # Extract all tool names
  value:                                   # Expected extracted values
    - "list_components"
    - "get_component_docs"
    - "search_docs"
```

#### 7. Partial Matching
```yaml
result:
  match:partial:                           # Only validate specified fields
    tools:
      - name: "search_docs"
        description: "match:contains:search"
```

#### 8. Error & Output Validation
```yaml
stderr: "toBeEmpty"                        # No stderr output expected
stderr: "match:contains:Warning"           # Specific stderr pattern
```

### Advanced Pattern Examples

#### Tool Discovery & Validation
```yaml
- it: "should have well-documented tools"
  request:
    jsonrpc: "2.0"
    id: "validation"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:regex:^[a-z][a-z0-9_]*$"      # snake_case names
            description: "match:regex:.{20,}"           # Min 20 characters

- it: "should contain expected tools"
  request:
    jsonrpc: "2.0"
    id: "discovery"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: "match:arrayContains:search_docs"       # Must contain this tool
```

## AI Agent Testing Patterns

### Multi-Step Agent Workflows
Test complex agent workflows requiring sequential tool calls:

```javascript
describe('Multi-Step Agent Workflows', () => {
  test('should support agent decision chains', async () => {
    // Step 1: Search for information
    const searchResult = await client.callTool('search_knowledge', {
      query: 'customer support best practices'
    });
    assert.equal(searchResult.isError, false);
    
    // Step 2: Analyze findings
    const analysisResult = await client.callTool('analyze_content', {
      content: searchResult.content[0].text,
      focus: 'actionable recommendations'
    });
    assert.equal(analysisResult.isError, false);
    
    // Step 3: Generate summary
    const summaryResult = await client.callTool('generate_summary', {
      source_data: analysisResult.content[0].text,
      format: 'executive_summary'
    });
    assert.equal(summaryResult.isError, false);
    assert.ok(summaryResult.content[0].text.includes('Executive Summary'));
  });
});
```

### State Management & Context
```yaml
- it: "should maintain conversation context"
  request:
    jsonrpc: "2.0"
    id: "context-1"
    method: "tools/call"
    params:
      name: "conversation_manager"
      arguments:
        action: "initialize"
        user_id: "test_user_123"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:session initialized"
        session_id: "match:type:string"

- it: "should recall previous context"
  request:
    jsonrpc: "2.0"
    id: "context-2" 
    method: "tools/call"
    params:
      name: "conversation_manager"
      arguments:
        action: "recall"
        user_id: "test_user_123"
```

### Error Recovery Testing
```javascript
test('should handle failures gracefully', async () => {
  // Test normal operation
  const normalResult = await client.callTool('external_api_call', {
    endpoint: 'users',
    action: 'list'
  });
  assert.equal(normalResult.isError, false);
  
  // Test failure scenario - should not throw
  const failureResult = await client.callTool('external_api_call', {
    endpoint: 'invalid_endpoint',
    action: 'list'
  });
  assert.equal(failureResult.isError, true);
  assert.ok(failureResult.content[0].text.includes('not found'));
  
  // Test recovery - should work again
  const recoveryResult = await client.callTool('external_api_call', {
    endpoint: 'users',
    action: 'list'
  });
  assert.equal(recoveryResult.isError, false);
});
```

### Performance Testing for AI Agents
```javascript
test('should meet AI response time requirements', async () => {
  const startTime = Date.now();
  const result = await client.callTool('quick_lookup', { term: 'test query' });
  const duration = Date.now() - startTime;
  
  assert.ok(duration < 2000, 'Should respond within 2 seconds');
  assert.equal(result.isError, false);
});

test('should handle concurrent requests', async () => {
  const promises = Array.from({ length: 10 }, (_, i) => 
    client.callTool('concurrent_operation', { id: i })
  );
  
  const results = await Promise.all(promises);
  results.forEach((result, i) => {
    assert.equal(result.isError, false, `Request ${i} should succeed`);
  });
});
```

## AI Agent Test Generation Workflow

### 1. Server Analysis & Detection
Identify MCP projects by:
- JSON-RPC 2.0 over stdio communication
- Methods: `"tools/list"`, `"tools/call"`, `"initialize"`
- MCP protocol version `"2025-06-18"`
- Server startup via child_process stdio

### 2. Test Categories to Generate

#### Category 1: Protocol Tests (Always Include)
```yaml
- it: "should complete MCP handshake"
- it: "should list available tools" 
- it: "should handle unknown methods"
```

#### Category 2: Tool Tests (Per Tool)
- Valid parameter combinations
- Missing required parameters
- Invalid parameter types
- Business logic validation

#### Category 3: Error Tests (Always Include)  
- Unknown tool calls
- Malformed JSON-RPC requests
- Server error responses

### 3. Pattern Selection Algorithm

## Integration Examples

### Real-World Tool Testing

#### Component Library Tools
```yaml
- it: "should search components for AI agents"
  request:
    jsonrpc: "2.0"
    id: "search-1"
    method: "tools/call"
    params:
      name: "search_components"
      arguments:
        query: "form input components"
        context: "building user interface"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:Input"
        metadata:
          total_results: "match:type:number"
```

#### Knowledge Base Tools
```javascript
test('should provide contextual search', async () => {
  const result = await client.callTool('knowledge_search', {
    query: 'authentication implementation',
    context: 'web application development',
    result_format: 'ai_structured'
  });
  
  assert.equal(result.isError, false);
  assert.ok(result.structured_data.steps, 'Should include implementation steps');
});
```

### AI Agent Integrations

#### GitHub Copilot
```markdown
# .github/copilot-instructions.md
When working with MCP servers:
1. Generate conductor.config.json first
2. Create both YAML and programmatic tests  
3. Use 11+ verified pattern matching types
4. Follow JSON-RPC 2.0 compliance
5. Reference: https://conductor.rhino-inquisitor.com/
```

#### Cursor Integration
```json
// .cursorrules
{
  "mcp_testing": {
    "framework": "mcp-conductor", 
    "approach": "dual (YAML + programmatic)",
    "patterns": "11+ verified types",
    "docs": "https://conductor.rhino-inquisitor.com/"
  }
}
```

### NPM Scripts Integration
```json
{
  "scripts": {
    "test:mcp": "conductor 'tests/**/*.test.mcp.yml' --config './conductor.config.json'",
    "test:mcp:verbose": "npm run test:mcp -- --verbose",
    "test:mcp:debug": "npm run test:mcp -- --debug",
    "test:all": "npm test && npm run test:mcp"
  }
}
```

## Quick Reference

### Essential Commands
```bash
# Install & initialize
npm install -g mcp-conductor
npx mcp-conductor init

# Run tests
conductor "tests/**/*.yml" --config "conductor.config.json"
node --test "tests/**/*.programmatic.test.js"

# CLI options
--verbose    # Development & debugging
--debug      # Protocol analysis  
--timing     # Performance analysis
--json       # CI/automation
--quiet      # Script integration
```

### Configuration Template
```json
{
  "name": "{{SERVER_NAME}}",
  "command": "{{RUNTIME}}",
  "args": ["{{SERVER_FILE}}"],
  "startupTimeout": 5000,
  "env": {"NODE_ENV": "test"}
}
```

### Common Patterns Reference
```yaml
# Type validation
tools: "match:type:array"
count: "match:type:number"

# String patterns  
text: "match:contains:search"
text: "match:startsWith:get_"
text: "match:\\d+ files"              # Escape backslashes!

# Array patterns
tools: "match:arrayLength:5"
match:extractField: "tools.*.name"
value: "match:arrayContains:search"

# Partial matching
match:partial:
  tools:
    - name: "expected_tool"

# Clean execution
stderr: "toBeEmpty"
```

### Test Categories
1. **Protocol Tests** - MCP handshake, tools/list
2. **Tool Tests** - Per-tool execution with valid/invalid params
3. **Error Tests** - Unknown tools, malformed requests
4. **Edge Cases** - Boundary conditions, missing params

---

**Key Success Factors for AI Agents:**
1. Always create configuration first
2. Use both YAML and programmatic approaches  
3. Leverage 11+ verified pattern types
4. Include comprehensive error handling
5. Follow JSON-RPC 2.0 structure exactly
6. Use proper resource cleanup patterns
7. Test protocol compliance, tool execution, and error scenarios
