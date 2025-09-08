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

  # Tool execution with real-world example
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
# Contains substring
result:
  content:
    - type: "text"
      text: "match:contains:MCP"       # Must contain "MCP"

# Starts with / Ends with
result:
  content:
    - type: "text" 
      text: "match:startsWith:Hello"   # Must start with "Hello"
  jsonrpc: "match:startsWith:2."       # JSON-RPC version validation

# Error message validation
result:
  content:
    - type: "text"
      text: "match:contains:not found" # Error contains "not found"
  isError: true
```

#### 4. Array Patterns
```yaml
# Array length validation
result:
  tools: "match:arrayLength:1"         # Exactly 1 tool

# Array elements - all elements match pattern
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      inputSchema: "match:type:object"

# Array content validation  
result:
  content:
    match:arrayElements:
      type: "match:type:string"
      text: "match:type:string"
```

#### 5. Field Extraction
```yaml
# Extract specific fields for validation using dot notation
result:
  match:extractField: "tools.*.name"   # Extract all tool names
  value:
    - "read_file"                       # Expected tool name

# Extract specific array element using bracket notation (NEW!)
result:
  match:extractField: "tools[5].name"  # Extract 6th tool's name
  value: "search_docs"                  # Expected value

# Extract nested fields with bracket notation
result:
  match:extractField: "tools[0].inputSchema.type"
  value: "object"

# Mixed bracket and dot notation
result:
  match:extractField: "content[0].text" # First content element text
  value: "match:contains:MCP"

# Bracket notation with wildcards
result:
  match:extractField: "tools[*].name"  # Extract all tool names
  value:
    - "list_components"
    - "search_docs"

# Or check if specific tool exists
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:read_file" # Check if read_file exists
```

##### **Field Extraction Syntax Guide**

MCP Conductor supports both **dot notation** and **bracket notation** for field extraction:

```yaml
# DOT NOTATION (traditional)
match:extractField: "tools.0.name"         # First tool name
match:extractField: "tools.*.name"         # All tool names (wildcard)
match:extractField: "content.0.text"       # First content text

# BRACKET NOTATION (new - v1.0.4+)
match:extractField: "tools[0].name"        # First tool name  
match:extractField: "tools[*].name"        # All tool names (wildcard)
match:extractField: "content[0].text"      # First content text
match:extractField: "tools[5].name"        # Sixth tool name (zero-indexed)

# MIXED NOTATION (both syntaxes work together)
match:extractField: "tools[0].inputSchema.properties"
match:extractField: "response.tools[*].name"
match:extractField: "data.items[3].metadata.tags[0]"

# COMPLEX NESTED EXTRACTION
match:extractField: "levels[1].items[0].value"  # Multi-level arrays
match:extractField: "matrix[2][1].coordinates"   # 2D arrays
```

#### 6. Partial Matching
```yaml
# Only validate specified fields, ignore others
result:
  match:partial:
    tools:
      - name: "read_file"              # Must have this tool
        description: "match:contains:Reads"
    # Other response fields are ignored
```

#### 7. Regex Patterns (escape backslashes!)

**Basic Patterns:**
```yaml
result:
  content:
    - text: "match:\\d+ files found"                    # Numbers
    - text: "match:Status: (success|error)"             # Alternatives  
    - text: "match:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"  # Email
    - text: "match:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"  # UUID
```

**⚠️ CRITICAL: Minimum Length Patterns for Multiline Content**

When validating substantial content (like hook lists, documentation, or API responses), use these patterns:

```yaml
# ✅ CORRECT: For multiline content with minimum length
result:
  content:
    - text: "match:[\\s\\S]{1000,}"      # At least 1000 chars (multiline-safe)
    - text: "match:[\\s\\S]{500,}"       # At least 500 chars (any content)

# ❌ WRONG: Standard dot notation fails on multiline content
result:
  content:
    - text: "match:.{1000,}"             # FAILS: dot doesn't match newlines!
```

**Why This Matters:**
- **`.{1000,}`** - Matches 1000+ non-newline characters (fails on multiline responses)
- **`[\\s\\S]{1000,}`** - Matches 1000+ ANY characters including newlines (multiline-safe)
- **Use Case**: Validate hook lists, documentation, substantial API responses

**Common Minimum Length Patterns:**
```yaml
# Content validation patterns
text: "match:[\\s\\S]{1000,}"           # Substantial content (1000+ chars)
text: "match:[\\s\\S]{500,}"            # Moderate content (500+ chars) 
text: "match:[\\s\\S]{100,}"            # Basic content (100+ chars)

# Hook list validation (real-world example)
result:
  content:
    - type: "text"
      text: "match:[\\s\\S]{1000,}"     # Ensure comprehensive hook list
```

**Advanced Regex Patterns:**
```yaml
# Timestamps and dates
text: "match:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"  # ISO timestamp
text: "match:\\d{4}/\\d{2}/\\d{2}"                        # Date format

# Technical patterns
text: "match:https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/[^\\s]*)?"  # URLs
text: "match:\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b"     # IP addresses
text: "match:v\\d+\\.\\d+\\.\\d+"                         # Version numbers

# JSON structure validation
text: "match:\\{.*\"status\":\\s*\"success\".*\\}"       # JSON with status
text: "match:\\[.*\\{.*\"name\".*\\}.*\\]"               # Array of objects

# Word boundaries and exact matches
text: "match:\\bError\\b"                                 # Exact word "Error"
text: "match:^Success$"                                   # Exact line "Success"
```

### Testing Best Practices for AI Agents
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

---

## 🚨 Critical Pattern Development Guidelines

### **YAML Structure Anti-Patterns (Learned from Real Development)**

AI agents frequently make these pattern matching mistakes. **Always avoid:**

#### **1. Duplicate YAML Keys (Fatal Error)**
```yaml
# ❌ CRITICAL ERROR - YAML doesn't allow duplicate keys
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # This OVERWRITES the previous line!
  match:extractField: "tools.*.name"
  match:extractField: "isError"  # Another fatal duplicate!

# ✅ CORRECT - Use separate test cases for different validations
result:
  tools: "match:arrayLength:1"

# Create separate test for field extraction:
result:
  match:extractField: "tools.*.name" 
  value:
    - "read_file"
```

#### **2. Pattern Structure Confusion**
```yaml
# ❌ WRONG - Mixing arrayElements with direct array structure
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # Structure conflict!

# ✅ CORRECT - Choose one pattern approach
result:
  content:
    match:arrayElements:
      type: "text"
      text: "match:contains:data"
```

#### **3. Response Structure Assumptions**
```yaml
# ❌ WRONG - Assuming array when response is object
result:
  content:
    match:arrayElements:  # But actual response is single object!
      type: "text"

# ✅ CORRECT - Use --debug to check actual response structure first
result:
  content:
    - type: "text"
      text: "match:regex:.*data.*"
```

### **Pattern Development Best Practices**

1. **Always start with --debug**: Check actual MCP response structure before writing patterns
2. **One pattern type per test**: Don't mix multiple complex patterns in single validation
3. **Test incrementally**: Start with deep equality, then add pattern complexity
4. **Validate YAML syntax**: Use YAML linters before testing (`yamllint file.yml`)
5. **Separate complex validations**: Multiple simple tests > one complex test
6. **Check field paths**: Verify dot notation paths (`tools.*.name`) are correct
7. **Match actual structure**: Don't assume arrays vs objects without verification

### **Quick Pattern Creation Workflow**

1. **Run with --debug**: `conductor test.yml --config config.json --debug`
2. **Copy actual response**: Use the exact response structure shown in debug
3. **Start with exact match**: Replace values with patterns incrementally  
4. **Validate YAML**: Ensure no duplicate keys or structure conflicts
5. **Test single pattern**: Verify each pattern works before combining

---

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

# Field extraction (dot notation - traditional)
match:extractField: "tools.*.name"
value: "match:arrayContains:search"

# Field extraction (bracket notation - NEW!)
match:extractField: "tools[5].name"   # Extract 6th element
value: "search_docs"

match:extractField: "tools[*].name"   # Wildcard in brackets
value: ["tool1", "tool2"]

match:extractField: "content[0].text" # First array element
value: "match:contains:MCP"

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
