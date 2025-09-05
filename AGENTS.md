# MCP Conductor - AI Agent Guide

**Target Audience**: AI coding assistants, automated testing agents, and AI-powered development tools

## Quick Context

**MCP Conductor** is a Node.js testing library for Model Context Protocol (MCP) servers. It enables declarative YAML-based testing with automatic protocol handling, making it ideal for AI agents to generate comprehensive test suites for MCP projects.

## Core Purpose for AI Agents

When working with MCP projects, you should use MCP Conductor to:
1. **Generate comprehensive test suites** for MCP servers
2. **Validate MCP protocol compliance** automatically
3. **Create declarative test files** that are human-readable and maintainable
4. **Automate testing workflows** in development environments

## Essential Patterns for AI Agents

### 1. Project Detection
Identify MCP projects by looking for:
```javascript
// MCP server indicators
- JSON-RPC 2.0 over stdio communication
- Methods: "tools/list", "tools/call", "initialize"
- Protocol handshake patterns
- Server startup via child_process stdio
```

### 2. Configuration Generation
Always create `conductor.config.json` first:

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
- `command`: Detect from package.json scripts or main file
- `args`: Include server file and any required arguments
- `startupTimeout`: Use 5000ms default, increase for complex servers
- `env`: Add test-specific environment variables

### 3. Test File Generation Strategy

#### Template Structure
```yaml
description: "Comprehensive test suite for [SERVER_NAME]"
tests:
  # 1. Protocol compliance tests (always include)
  - it: "should complete MCP handshake"
    request:
      jsonrpc: "2.0"
      id: "init-1"
      method: "initialize"
      params:
        protocolVersion: "2025-06-18"
        capabilities: {"tools": {}}
        clientInfo: {"name": "MCP Conductor", "version": "1.0.0"}
    expect:
      response:
        jsonrpc: "2.0"
        id: "init-1"
        result:
          protocolVersion: "2025-06-18"
          serverInfo:
            name: "match:.+"
            version: "match:.+"

  # 2. Tool discovery (always include)
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
          tools: "match:.*"  # Flexible tool list matching

  # 3. Tool-specific tests (generate based on server analysis)
  # 4. Error handling tests (always include)
  # 5. Edge case tests (generate based on tool parameters)
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
