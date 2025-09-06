# MCP Conductor - AI Agent Guide

**Target Audience**: AI coding assistants, automated testing agents, and AI-powered development tools

## Quick Context

**MCP Conductor** is a comprehensive Node.js testing library for Model Context Protocol (MCP) servers. It provides both **declarative YAML-based testing** and **programmatic JavaScript/TypeScript testing** with 11+ verified pattern matching capabilities, making it ideal for AI agents to generate comprehensive test suites for MCP projects.

## 📚 Complete Documentation

**[View Full Documentation Site](https://conductor.rhino-inquisitor.com/)**

- **[Installation Guide](https://conductor.rhino-inquisitor.com/installation.html)** - Setup and configuration
- **[YAML Testing](https://conductor.rhino-inquisitor.com/yaml-testing.html)** - Declarative test files
- **[Programmatic Testing](https://conductor.rhino-inquisitor.com/programmatic-testing.html)** - JavaScript/TypeScript API
- **[Pattern Matching](https://conductor.rhino-inquisitor.com/pattern-matching.html)** - 11+ pattern types reference
- **[Examples](https://conductor.rhino-inquisitor.com/examples.html)** - Working examples and best practices
- **[AI Agent Guide](https://conductor.rhino-inquisitor.com/ai-agents.html)** - Detailed AI integration guide

## Core Purpose for AI Agents

When working with MCP projects, you should use MCP Conductor to:
1. **Generate comprehensive test suites** for MCP servers (both YAML and programmatic)
2. **Validate MCP protocol compliance** automatically with proper handshake handling
3. **Create maintainable test files** that are human-readable and well-structured
4. **Support dual testing approaches** - declarative YAML and programmatic JavaScript/TypeScript
5. **Automate testing workflows** in development environments with 11+ pattern matching types

## Installation for AI Agents

```bash
# Clone repository (not yet published to npm)
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor
npm install

# Use in projects
node bin/conductor.js "tests/**/*.test.mcp.yml" --config "config.json"

# Programmatic testing
node --test "tests/**/*.programmatic.test.js"
```

## Essential Patterns for AI Agents

### 1. Project Detection
Identify MCP projects by looking for:
```javascript
// MCP server indicators
- JSON-RPC 2.0 over stdio communication
- Methods: "tools/list", "tools/call", "initialize"
- Protocol handshake patterns with protocolVersion: "2025-06-18"
- Server startup via child_process stdio
- MCP SDK imports (TypeScript/Python)
```

### 2. Configuration Generation
Always create configuration file first (`config.json` or `conductor.config.json`):

```json
{
  "name": "AI Generated Server Config",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000,
  "env": {
    "NODE_ENV": "test"
  }
}
```

**Configuration Rules for AI Agents**:
- `name`: Use descriptive server name based on project
- `command`: Detect from package.json scripts or main file (node, python, etc.)
- `args`: Include server file and any required arguments
- `startupTimeout`: Use 5000ms default (matches actual implementation), increase for complex servers
- `env`: Add test-specific environment variables
- `readyPattern`: Optional regex to match stderr for server ready signal

### 3. Dual Testing Approach

#### YAML Declarative Testing
```yaml
description: "Comprehensive test suite for [SERVER_NAME]"
tests:
  # 1. Protocol compliance tests (always include)
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

  # 2. Tool execution tests
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
              text: "match:Expected.*pattern"
          isError: false
      stderr: "toBeEmpty"
```

#### Programmatic Testing
```javascript
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('[SERVER_NAME] Tests', () => {
  let client;

  before(async () => {
    client = await connect('./config.json');
  });

  after(async () => {
    await client.disconnect();
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
### 4. Pattern Matching System

MCP Conductor provides **11+ verified pattern matching types** for comprehensive validation:

#### Core Pattern Types
```yaml
# 1. Deep Equality (default)
result:
  tools:
    - name: "exact_match"
      description: "Must match exactly"

# 2. Type Validation
result:
  tools: "match:type:array"
  count: "match:type:number"
  serverInfo: "match:type:object"

# 3. Regex Patterns
result:
  content:
    - text: "match:\\d+ files found"        # Number patterns
    - text: "match:Status: (success|error)" # Alternatives
    - text: "match:[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"  # Email validation

# 4. String Contains/Starts/Ends
result:
  description: "match:contains:search"     # Contains substring
  name: "match:startsWith:get_"            # Starts with prefix
  version: "match:endsWith:.0"             # Ends with suffix

# 5. Array Length Validation
result:
  tools: "match:arrayLength:6"             # Exactly 6 elements

# 6. Array Elements Pattern
result:
  tools:
    match:arrayElements:                   # All elements must match
      name: "match:type:string"
      description: "match:type:string"

# 7. Array Contains Check
result:
  match:extractField: "tools.*.name"      # Extract field values
  value: "match:arrayContains:search_docs" # Check if array contains value

# 8. Field Extraction
result:
  match:extractField: "tools.*.name"      # Extract all tool names
  value:                                   # Expected extracted values
    - "list_components"
    - "get_component_docs"

# 9. Partial Matching
result:
  match:partial:                           # Only check specified fields
    tools:
      - name: "search_docs"
        description: "match:contains:search"

# 10. Stderr Validation
stderr: "toBeEmpty"                        # No stderr output
stderr: "match:Warning.*deprecated"       # Specific stderr pattern

# 11. Complex Nested Patterns
result:
  match:extractField: "response.data.items.*.id"
  value: "match:arrayContains:12345"
```

## AI Agent Decision Tree

### Step 1: Analyze MCP Server Code
```python
def analyze_mcp_server(server_code):
    """Extract testable elements from MCP server"""
    return {
        'tools': extract_tool_definitions(server_code),
        'error_handlers': find_error_scenarios(server_code),
        'input_validation': detect_parameter_types(server_code),
        'business_logic': identify_core_functions(server_code)
    }
```

### Step 2: Generate Test Categories
```yaml
# Category 1: Protocol Tests (Always Generate)
description: "Protocol compliance tests"
tests:
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

# Category 2: Tool Discovery Tests
  - it: "should have expected tools available"
    request:
      jsonrpc: "2.0"
      id: "discovery-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "discovery-1"
        result:
          match:extractField: "tools.*.name"
          value: "match:arrayContains:[EXPECTED_TOOL_NAME]"
      stderr: "toBeEmpty"

# Category 3: Tool Execution Tests (Generate per tool)
  - it: "should execute [TOOL_NAME] with valid parameters"
    request:
      jsonrpc: "2.0"
      id: "exec-1"
      method: "tools/call"
      params:
        name: "[TOOL_NAME]"
        arguments:
          # Generate based on tool schema
    expect:
      response:
        jsonrpc: "2.0"
        id: "exec-1"
        result:
          content:
            - type: "text"
              text: "match:type:string"
          isError: false
      stderr: "toBeEmpty"

# Category 4: Error Handling Tests
  - it: "should handle invalid tool gracefully"
    request:
      jsonrpc: "2.0"
      id: "error-1"
      method: "tools/call"
      params:
        name: "nonexistent_tool"
        arguments: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-1"
        result:
          isError: true
          content:
            - type: "text"
              text: "match:contains:Unknown tool"

# Category 5: Edge Case Tests (Generate based on parameters)
  - it: "should validate required parameters"
    request:
      jsonrpc: "2.0"
      id: "validation-1"
      method: "tools/call"
      params:
        name: "[TOOL_NAME]"
        arguments: {}  # Missing required params
    expect:
      response:
        jsonrpc: "2.0"
        id: "validation-1"
        result:
          isError: true
          content:
            - type: "text"
### Step 3: Examples Structure

MCP Conductor includes working examples to guide AI generation:

#### Filesystem Server Example (`examples/filesystem-server/`)
```javascript
// Simple single-tool server
tools: [{
  name: "read_file",
  description: "Read file contents",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string" }
    },
    required: ["path"]
  }
}]
```

**Test Coverage Examples**:
- `filesystem.test.mcp.yml`: Comprehensive 16 tests with pattern matching
- `filesystem-tools-only.test.mcp.yml`: Tools-only testing (3 tests)
- `filesystem-execution-only.test.mcp.yml`: Execution-only testing (8 tests)
- `advanced.test.mcp.yml`: Advanced pattern matching (5 tests)
- `filesystem-server.programmatic.test.js`: Node.js test runner integration

#### Multi-Tool Server Example (`examples/multi-tool-server/`)
```javascript
// Complex multi-tool server
tools: [
  { name: "calculator", description: "Math operations" },
  { name: "text_processor", description: "Text analysis" },
  { name: "data_validator", description: "Data validation" },
  { name: "file_manager", description: "File operations" }
]
```

**Test Coverage Examples**:
- `multi-tool.test.mcp.yml`: Comprehensive 20 tests across all tools
- `multi-tool-server.programmatic.test.js`: Advanced programmatic testing

#### Shared Test Data (`examples/shared-test-data/`)
```
- hello.txt               # Simple text file
- numbers.txt             # Number patterns for regex
- emails.txt              # Email validation data
- log-entries.txt         # Log format examples
- status.txt              # Status messages
- identifiers.txt         # UUID/ID patterns
- api-response.json       # JSON response samples
### Step 4: Testing Command Generation

AI agents should generate complete testing workflows:

#### YAML Testing Commands
```bash
# Basic testing
node bin/conductor.js "./server.test.mcp.yml" --config "./config.json"

# Pattern testing with multiple files
node bin/conductor.js "./tests/**/*.test.mcp.yml" --config "./config.json"

# Example server testing
node bin/conductor.js "./examples/filesystem-server/filesystem.test.mcp.yml" --config "./examples/filesystem-server/config.json"
```

#### Programmatic Testing Commands
```bash
# Node.js built-in test runner (recommended)
node --test server.programmatic.test.js

# Alternative test runners
npm test                # If configured in package.json
npx jest server.test.js # Jest integration
npx mocha server.test.js # Mocha integration
```

### Step 5: Quality Checklist for AI Agents

#### Configuration Validation
- [ ] Valid JSON structure with required fields (`name`, `command`, `args`)
- [ ] Appropriate `startupTimeout` (5000ms default)
- [ ] Correct command detection (node, python, etc.)
- [ ] Environment variables for test isolation

#### Test Structure Validation
- [ ] Valid YAML syntax with proper indentation
- [ ] Unique test IDs across all test cases
- [ ] JSON-RPC 2.0 compliance (`jsonrpc: "2.0"`)
- [ ] MCP protocol version (`2025-06-18`) where applicable
- [ ] Proper `expect` structure with `response` and optional `stderr`

#### Pattern Matching Validation
- [ ] Use verified pattern types from 11+ available patterns
- [ ] Escape regex patterns properly (`\\d+` not `\d+`)
- [ ] Use `match:type:array` for arrays, `match:type:object` for objects
- [ ] Include `stderr: "toBeEmpty"` for clean execution validation
- [ ] Use `match:contains:`, `match:startsWith:`, `match:endsWith:` for string matching

#### Test Coverage Validation
- [ ] Protocol compliance tests (tools/list)
- [ ] Tool discovery tests (verify expected tools exist)
- [ ] Tool execution tests (one per tool minimum)
- [ ] Error handling tests (invalid tools/parameters)
- [ ] Edge case tests (missing parameters, boundary conditions)

#### Integration Validation
- [ ] Both YAML and programmatic test examples
- [ ] Proper client lifecycle management (connect/disconnect)
- [ ] Error handling with try/catch blocks
- [ ] Meaningful assertions with descriptive messages
## Common AI Pitfalls and Solutions

### 1. Configuration Issues

#### ❌ Wrong: Missing Required Fields
```json
{
  "name": "My Server"
  // Missing command and args
}
```

#### ✅ Correct: Complete Configuration
```json
{
  "name": "My Server", 
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000
}
```

### 2. YAML Structure Issues

#### ❌ Wrong: Invalid JSON-RPC Structure
```yaml
tests:
  - it: "test case"
    request:
      method: "tools/list"  # Missing jsonrpc and id
    expect:
      tools: []             # Wrong nesting
```

#### ✅ Correct: Proper JSON-RPC Structure
```yaml
tests:
  - it: "test case"
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
      stderr: "toBeEmpty"
```

### 3. Pattern Matching Issues

#### ❌ Wrong: Incorrect Regex Escaping
```yaml
text: "match:\d+ files"     # Missing double backslash
text: "match:type:string"   # Wrong pattern type usage
```

#### ✅ Correct: Proper Pattern Syntax
```yaml
text: "match:\\d+ files"    # Properly escaped regex
text: "match:type:string"   # Correct for type validation
content:
  - text: "match:contains:expected"  # Correct for string matching
```

### 4. Programmatic Testing Issues

#### ❌ Wrong: Missing Lifecycle Management
```javascript
test('bad example', async () => {
  const client = await connect('./config.json');
  // Missing disconnect - resource leak
  const result = await client.callTool('tool', {});
});
```

#### ✅ Correct: Proper Lifecycle Management
```javascript
describe('Test Suite', () => {
  let client;

  before(async () => {
    client = await connect('./config.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  test('proper test', async () => {
    const result = await client.callTool('tool', {});
    assert.ok(result.content);
  });
});
```

### 5. Test ID Management

#### ❌ Wrong: Duplicate or Missing IDs
```yaml
tests:
  - it: "test 1"
    request:
      id: "test-1"
    expect:
      response:
        id: "different-id"  # ID mismatch
  - it: "test 2"
    request:
      id: "test-1"          # Duplicate ID
```

#### ✅ Correct: Unique, Matching IDs
```yaml
tests:
  - it: "test 1"
    request:
      id: "tools-list-1"
    expect:
      response:
        id: "tools-list-1"  # Matching ID
  - it: "test 2"
    request:
      id: "tools-call-1"    # Unique ID
    expect:
      response:
## AI Agent Integration Examples

### Working with Popular AI Coding Assistants

#### GitHub Copilot Integration
```markdown
# In your project's .github/copilot-instructions.md
When working with MCP servers, always:
1. Generate configuration file first using mcp-conductor patterns
2. Create both YAML and programmatic tests
3. Use verified pattern matching (11+ types available)
4. Follow MCP protocol JSON-RPC 2.0 compliance
5. Include stderr validation and proper error handling

Refer to: https://conductor.rhino-inquisitor.com/
```

#### Cursor Integration
```json
// In your .cursorrules file
{
  "mcp_testing": {
    "approach": "dual",
    "yaml_testing": "declarative with pattern matching",
    "programmatic_testing": "Node.js test runner integration",
    "documentation": "https://conductor.rhino-inquisitor.com/",
    "patterns": "11+ verified types including partial matching and field extraction"
  }
}
```

#### Claude/ChatGPT Integration
```
System prompt addition:
When generating MCP server tests, use mcp-conductor framework with:
- Configuration-first approach (config.json required)
- Dual testing methodology (YAML + programmatic)
- 11+ verified pattern matching types
- JSON-RPC 2.0 compliance
- Protocol version 2025-06-18
- Complete documentation at https://conductor.rhino-inquisitor.com/
```

### Advanced AI Agent Workflows

#### 1. Server Analysis Workflow
```python
def generate_mcp_tests(server_path):
    """Complete AI workflow for MCP server testing"""
    
    # Step 1: Analyze server code
    server_analysis = analyze_server_code(server_path)
    
    # Step 2: Generate configuration
    config = generate_config(server_analysis)
    
    # Step 3: Generate YAML tests
    yaml_tests = generate_yaml_tests(server_analysis)
    
    # Step 4: Generate programmatic tests
    programmatic_tests = generate_programmatic_tests(server_analysis)
    
    # Step 5: Generate execution commands
    commands = generate_test_commands(config, yaml_tests, programmatic_tests)
    
    return {
        'config': config,
        'yaml_tests': yaml_tests,
        'programmatic_tests': programmatic_tests,
        'commands': commands
    }
```

#### 2. Pattern Selection Algorithm
```python
def select_optimal_patterns(tool_response_schema):
    """AI algorithm for selecting best pattern matching approach"""
    
    patterns = []
    
    if tool_response_schema.get('type') == 'array':
        patterns.append('match:type:array')
        if tool_response_schema.get('items'):
            patterns.append('match:arrayElements:')
    
    if tool_response_schema.get('properties'):
        patterns.append('match:partial:')
        for prop, schema in tool_response_schema['properties'].items():
            if schema.get('pattern'):
                patterns.append(f'match:{schema["pattern"]}')
            if schema.get('enum'):
                patterns.append(f'match:({"|".join(schema["enum"])})')
    
    return patterns
```

#### 3. Test Generation Templates
```yaml
# Template for AI agents to customize
description: "Generated tests for {{SERVER_NAME}}"
tests:
  # Protocol compliance (always include)
  - it: "should complete MCP handshake and list tools"
    request:
      jsonrpc: "2.0"
      id: "protocol-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "protocol-1"
        result:
          tools: "match:type:array"
      stderr: "toBeEmpty"

  # Dynamic tool tests (generate per tool)
  {{#each tools}}
  - it: "should execute {{name}} tool successfully"
    request:
      jsonrpc: "2.0"
      id: "{{name}}-1"
      method: "tools/call"
      params:
        name: "{{name}}"
        arguments:
          {{#each parameters}}
          {{name}}: {{example_value}}
          {{/each}}
    expect:
      response:
        jsonrpc: "2.0"
        id: "{{name}}-1"
        result:
          content:
            - type: "text"
              text: "{{expected_pattern}}"
          isError: false
      stderr: "toBeEmpty"
  {{/each}}

  # Error handling (customize per server)
  - it: "should handle invalid tool gracefully"
    request:
      jsonrpc: "2.0"
      id: "error-1"
      method: "tools/call"
      params:
        name: "nonexistent_tool"
        arguments: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-1"
        result:
          isError: true
          content:
            - type: "text"
## Quick Reference for AI Agents

### Essential Commands
```bash
# Install mcp-conductor (development)
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor
npm install

# Run YAML tests
node bin/conductor.js "./tests/**/*.test.mcp.yml" --config "./config.json"

# Run programmatic tests  
node --test server.programmatic.test.js

# Test examples
npm run test:examples
```

### Configuration Template
```json
{
  "name": "{{SERVER_NAME}}",
  "command": "{{RUNTIME}}",
  "args": ["{{SERVER_FILE}}", "{{ARGS}}"],
  "startupTimeout": 5000,
  "env": {
    "NODE_ENV": "test"
  }
}
```

### YAML Test Template
```yaml
description: "Tests for {{SERVER_NAME}}"
tests:
  - it: "should list tools"
    request: {jsonrpc: "2.0", id: "1", method: "tools/list", params: {}}
    expect: {response: {jsonrpc: "2.0", id: "1", result: {tools: "match:type:array"}}, stderr: "toBeEmpty"}
  
  - it: "should execute {{TOOL_NAME}}"
    request: {jsonrpc: "2.0", id: "2", method: "tools/call", params: {name: "{{TOOL_NAME}}", arguments: {}}}
    expect: {response: {jsonrpc: "2.0", id: "2", result: {content: [{type: "text", text: "match:type:string"}], isError: false}}, stderr: "toBeEmpty"}
```

### Programmatic Test Template
```javascript
import { test, describe, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('{{SERVER_NAME}}', () => {
  let client;
  before(async () => { client = await connect('./config.json'); });
  after(async () => { await client?.disconnect(); });
  
  test('should list tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools));
  });
  
  test('should execute {{TOOL_NAME}}', async () => {
    const result = await client.callTool('{{TOOL_NAME}}', {});
    assert.equal(result.isError, false);
  });
});
```

### Pattern Matching Quick Reference
```yaml
# Most Common Patterns for AI Agents
tools: "match:type:array"                    # Array type validation
name: "match:type:string"                    # String type validation
text: "match:contains:expected"              # String contains
text: "match:\\d+"                          # Numbers (escape backslash!)
stderr: "toBeEmpty"                         # No errors expected
tools: "match:arrayLength:5"                # Exact array length
match:extractField: "tools.*.name"          # Extract field values
match:partial: {key: "value"}               # Partial object matching
```

### Resources for AI Agents
- **Documentation**: https://conductor.rhino-inquisitor.com/
- **Installation**: https://conductor.rhino-inquisitor.com/installation.html
- **Pattern Matching**: https://conductor.rhino-inquisitor.com/pattern-matching.html
- **Programmatic API**: https://conductor.rhino-inquisitor.com/programmatic-testing.html
- **Examples**: https://conductor.rhino-inquisitor.com/examples.html
- **AI Integration**: https://conductor.rhino-inquisitor.com/ai-agents.html

**Key Success Factors**:
1. Always create configuration first
2. Use both YAML and programmatic approaches
3. Leverage 11+ verified pattern types
4. Include protocol compliance tests
5. Add comprehensive error handling
6. Follow JSON-RPC 2.0 structure exactly
7. Use proper resource cleanup patterns
- MCP handshake validation
- Tool discovery
- Invalid method handling

# Category 2: Tool Tests (Generate per tool)
- Valid parameter combinations
- Missing required parameters  
- Invalid parameter types
- Boundary value testing

# Category 3: Error Tests (Always Generate)
- Unknown tool calls
- Malformed requests
- Server error responses

# Category 4: Business Logic Tests (Context-Specific)
- Domain-specific scenarios
- Data validation patterns
- Output format verification
```

### Step 3: Pattern Matching Rules

#### Use Deep Equality for Exact Matches
```yaml
result:
  tools:
    - name: "calculator"
      description: "Performs mathematical operations"
```

#### Use Regex for Flexible Matching
```yaml
# Numbers and calculations
text: "match:Result: \\d+"
text: "match:Temperature: -?\\d+\\.?\\d*°[CF]"

# Text patterns  
text: "match:[A-Z][a-z]+ (found|detected|processed)"
text: "match:File .+ (created|updated|deleted)"

# Error messages
text: "match:(Error|Failed|Invalid): .+"
text: "match:Tool '[^']+' not found"

# JSON responses
text: "match:\\{.*\"status\":\\s*\"(success|error)\".*\\}"

# UUIDs and IDs
text: "match:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

# URLs and paths
text: "match:https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
text: "match:(/[^/\\s]+)+/?$"

# Timestamps
text: "match:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
```

## Tool-Specific Test Patterns

### File Operations Tools
```yaml
- it: "should read existing file"
  request:
    jsonrpc: "2.0"
    id: "file-read-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "./test-data/sample.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "file-read-1"
      result:
        content:
          - type: "text"
            text: "match:.+"
        isError: false

- it: "should handle file not found"
  request:
    jsonrpc: "2.0"
    id: "file-error-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "./nonexistent.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "file-error-1"
      result:
        isError: true
        content:
          - type: "text"
            text: "match:(File not found|ENOENT|No such file)"
```

### API/HTTP Tools
```yaml
- it: "should make successful API request"
  request:
    jsonrpc: "2.0"
    id: "api-1"
    method: "tools/call"
    params:
      name: "http_request"
      arguments:
        url: "https://jsonplaceholder.typicode.com/posts/1"
        method: "GET"
  expect:
    response:
      jsonrpc: "2.0"
      id: "api-1"
      result:
        content:
          - type: "text"
            text: "match:\\{.*\"userId\":\\s*\\d+.*\\}"
        isError: false
```

### Database Tools  
```yaml
- it: "should execute valid query"
  request:
    jsonrpc: "2.0"
    id: "db-1"
    method: "tools/call"
    params:
      name: "database_query"
      arguments:
        query: "SELECT COUNT(*) FROM users"
  expect:
    response:
      jsonrpc: "2.0"
      id: "db-1"
      result:
        content:
          - type: "text"
            text: "match:Count: \\d+"
        isError: false
```

### Calculation Tools
```yaml
- it: "should perform arithmetic operations"
  request:
    jsonrpc: "2.0"
    id: "calc-1"
    method: "tools/call"
    params:
      name: "calculator"
      arguments:
        operation: "add"
        a: 15
        b: 27
  expect:
    response:
      jsonrpc: "2.0"
      id: "calc-1"
      result:
        content:
          - type: "text"
            text: "Result: 42"
        isError: false
```

## Advanced AI Agent Strategies

### 1. Dynamic Test Generation
```python
def generate_parameter_tests(tool_schema):
    """Generate tests for all parameter combinations"""
    tests = []
    
    # Valid combinations
    for combo in valid_parameter_combinations(tool_schema):
        tests.append(create_valid_test(combo))
    
    # Invalid combinations (missing required)
    for missing in required_parameters(tool_schema):
        tests.append(create_missing_param_test(missing))
    
    # Type validation
    for param in tool_schema['parameters']:
        tests.append(create_type_validation_test(param))
    
    return tests
```

### 2. Error Scenario Generation
```python
def generate_error_tests():
    """Generate comprehensive error handling tests"""
    return [
        unknown_tool_test(),
        invalid_json_test(), 
        missing_required_params_test(),
        invalid_param_types_test(),
        server_error_simulation_test()
    ]
```

### 3. Regression Test Patterns
```yaml
# Template for regression tests
- it: "should handle regression case [ISSUE_ID]"
  request:
    jsonrpc: "2.0"
    id: "regression-[ISSUE_ID]"
    method: "tools/call"
    params:
      name: "[TOOL_NAME]"
      arguments:
        # Specific parameters that caused the original issue
  expect:
    response:
      jsonrpc: "2.0"  
      id: "regression-[ISSUE_ID]"
      result:
        # Expected behavior after fix
```

## AI Agent Workflow

### Complete Test Suite Generation Process

1. **Analyze Server Code**
   - Extract tool definitions and schemas
   - Identify error handling patterns
   - Detect business logic requirements

2. **Generate Configuration**
   - Create `conductor.config.json` with appropriate settings
   - Set environment variables and startup parameters

3. **Create Base Test Structure**
   - Protocol compliance tests (handshake, tool listing)
   - Error handling tests (unknown methods, invalid params)

4. **Generate Tool-Specific Tests**
   - Valid parameter combinations
   - Boundary value testing
   - Error scenario coverage

5. **Add Business Logic Tests**
   - Domain-specific test cases
   - Integration scenarios
   - Performance considerations

6. **Create Test Data**
   - Generate supporting test files if needed
   - Create realistic test scenarios

### Example AI Agent Output
```yaml
description: "AI-generated comprehensive test suite for FileProcessor MCP Server"
tests:
  # Protocol tests
  - it: "should complete MCP initialization"
  - it: "should list all available tools"
  
  # Tool tests per discovered tool
  - it: "should read text file successfully"
  - it: "should validate JSON file format"
  - it: "should process CSV data"
  
  # Error tests
  - it: "should handle file not found gracefully"
  - it: "should reject invalid file paths"
  - it: "should handle permission denied errors"
  
  # Edge cases
  - it: "should handle empty files"
  - it: "should process large files efficiently"
  - it: "should handle binary files appropriately"
```

## Testing Best Practices for AI Agents

### 1. Always Include Core Tests
- MCP handshake validation
- Tool discovery
- Unknown tool error handling

### 2. Generate Comprehensive Parameter Tests
- All required parameter combinations
- Optional parameter variations
- Invalid type and format testing

### 3. Use Realistic Test Data
- Create supporting files in `test-data/` directory
- Use realistic data formats and sizes
- Test with both valid and invalid data

### 4. Implement Proper Error Testing
- Network failures, file system errors
- Invalid JSON, malformed requests
- Server-specific error conditions

### 5. Consider Performance Scenarios
- Large input handling
- Concurrent request simulation
- Timeout and resource limit testing

## Integration with Development Workflows

### NPM Scripts Integration
```json
{
  "scripts": {
    "test:mcp": "conductor 'tests/**/*.test.mcp.yml'",
    "test:mcp:watch": "nodemon --ext yml,js --exec 'npm run test:mcp'",
    "test:generate": "ai-agent generate-mcp-tests",
    "test:all": "npm run test && npm run test:mcp"
  }
}
```

### CI/CD Integration
```yaml
# GitHub Actions
- name: Generate and Run MCP Tests  
  run: |
    npm install -g mcp-conductor
    ai-agent generate-mcp-tests
    conductor 'tests/**/*.test.mcp.yml'
```

## Common Pitfalls for AI Agents

### ❌ Avoid These Mistakes
1. **Missing Protocol Tests**: Always include MCP handshake tests
2. **Hardcoded Values**: Use regex patterns for dynamic content
3. **Incomplete Error Testing**: Test all error scenarios
4. **Invalid JSON-RPC**: Ensure proper message structure
5. **Missing Test Data**: Create supporting files when needed

### ✅ Best Practices
1. **Flexible Matching**: Use regex patterns for dynamic responses
2. **Comprehensive Coverage**: Test success and error paths
3. **Realistic Scenarios**: Use real-world test data
4. **Clear Descriptions**: Write descriptive test names
5. **Maintainable Structure**: Organize tests logically

---

## Quick Reference for AI Agents

### Standard Test Template
```yaml
description: "Test suite for [SERVER_NAME]"
tests:
  - it: "should [ACTION] [EXPECTED_RESULT]"
    request:
      jsonrpc: "2.0"
      id: "[UNIQUE_ID]"
      method: "[METHOD_NAME]"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "[UNIQUE_ID]"
        result: {}
      stderr: "toBeEmpty"
```

### Common Methods
- `tools/list` - Get available tools
- `tools/call` - Execute specific tool
- `initialize` - MCP handshake

### Useful Regex Patterns
- Numbers: `\\d+`, `-?\\d+\\.?\\d*`
- Text: `[A-Za-z ]+`, `.+`
- Errors: `(Error|Failed|Invalid): .+`
- JSON: `\\{.*"key":\\s*"value".*\\}`
- Files: `/[^/\\s]+(?:/[^/\\s]+)*/?$`

Use this guide to efficiently generate comprehensive, maintainable test suites for any MCP server project.
