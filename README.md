# MCP Conductor

A Node.js testing library for Model Context Protocol (MCP) servers that communicate over stdio transport.

## Overview

MCP Conductor provides a declarative, file-based testing framework for MCP servers. It handles the complexities of stdio communication, JSON-RPC message framing, and MCP protocol handshakes, allowing you to focus on testing your server's business logic.

## Features

- 🎯 **Declarative Testing**: Define tests in simple YAML files
- 🔄 **Automatic Protocol Handling**: Manages MCP initialization handshake automatically
- 📊 **Rich Reporting**: Color-coded output with detailed diffs for failures
- 🛡️ **Robust Communication**: Handles async stdio streams reliably
- 🧪 **Comprehensive Assertions**: Test responses, stderr output, and more
- 📁 **Test Discovery**: Supports glob patterns for finding test files

## Installation

```bash
npm install -g mcp-conductor
```

Or install locally in your project:

```bash
npm install --save-dev mcp-conductor
```

## Quick Start

1. **Create a configuration file** (`conductor.config.json`):

```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./my-server.js"],
  "startupTimeout": 5000
}
```

2. **Create a test file** (`my-server.test.mcp.yml`):

```yaml
description: "Test suite for My MCP Server"
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
          tools:
            - name: "my_tool"
              description: "My tool description"
      stderr: "toBeEmpty"
```

3. **Run the tests**:

```bash
conductor "**/*.test.mcp.yml" --config conductor.config.json
```

## Configuration

The `conductor.config.json` file defines how to start your MCP server:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Human-readable name for the server |
| `command` | string | Yes | Executable to run (e.g., "node", "python") |
| `args` | string[] | Yes | Arguments to pass to the command |
| `cwd` | string | No | Working directory (defaults to config file location) |
| `env` | object | No | Environment variables to set |
| `startupTimeout` | number | No | Startup timeout in ms (default: 5000) |
| `readyPattern` | string | No | Regex to match in stderr before starting tests |

### Example with Environment Variables

```json
{
  "name": "API Server",
  "command": "node",
  "args": ["./server.js"],
  "env": {
    "API_KEY": "test-key",
    "DEBUG": "true"
  },
  "readyPattern": "Server listening"
}
```

## Test Files

Test files use YAML format with `.test.mcp.yml` extension:

```yaml
description: "Test suite description"
tests:
  - it: "test description"
    request:
      jsonrpc: "2.0"
      id: "unique-id"
      method: "method_name"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-id"
        result: {}
      stderr: "toBeEmpty"
```

### Request Structure

Each test's `request` must be a valid JSON-RPC 2.0 message:

- `jsonrpc`: Must be "2.0"
- `id`: Unique identifier for the request
- `method`: MCP method to call (e.g., "tools/list", "tools/call")
- `params`: Parameters for the method (optional)

### Expectations

The `expect` object can contain:

#### Response Assertions

```yaml
expect:
  response:
    jsonrpc: "2.0"
    id: "test-1"
    result:
      # Expected response structure
```

#### Stderr Assertions

```yaml
expect:
  stderr: "toBeEmpty"  # Expect no stderr output
  # OR
  stderr: "match:pattern"  # Regex match
  # OR  
  stderr: "exact string"  # Exact match
```

### Pattern Matching

Use `match:` prefix for regex patterns:

```yaml
expect:
  response:
    result:
      content:
        - text: "match:File not found|ENOENT"
```

## Common MCP Methods

### tools/list

Lists all tools provided by the server:

```yaml
- it: "should list tools"
  request:
    jsonrpc: "2.0"
    id: "list-tools"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "list-tools"
      result:
        tools:
          - name: "tool_name"
            description: "Tool description"
```

### tools/call

Calls a specific tool:

```yaml
- it: "should call tool successfully"
  request:
    jsonrpc: "2.0"
    id: "call-tool"
    method: "tools/call"
    params:
      name: "tool_name"
      arguments:
        param1: "value1"
  expect:
    response:
      jsonrpc: "2.0"
      id: "call-tool"
      result:
        content:
          - type: "text"
            text: "Tool output"
```

## CLI Usage

```bash
conductor <test-pattern> [options]
```

### Arguments

- `<test-pattern>`: Glob pattern for test files (e.g., `"**/*.test.mcp.yml"`)

### Options

- `-c, --config <path>`: Path to configuration file (default: `./conductor.config.json`)

### Examples

```bash
# Run all tests in current directory
conductor "*.test.mcp.yml"

# Run tests in specific directory
conductor "tests/**/*.test.mcp.yml" --config config/test.config.json

# Run single test file
conductor "my-feature.test.mcp.yml"
```

## Example Project Structure

```
my-mcp-project/
├── conductor.config.json
├── package.json
├── src/
│   └── server.js
├── tests/
│   ├── basic.test.mcp.yml
│   ├── tools.test.mcp.yml
│   └── errors.test.mcp.yml
└── examples/
    └── test-data/
        └── sample.txt
```

## CI/CD Integration

MCP Conductor exits with code 0 on success and non-zero on failure, making it ideal for CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run MCP Tests
  run: |
    npm install -g mcp-conductor
    conductor "tests/**/*.test.mcp.yml"
```

```json
{
  "scripts": {
    "test": "conductor 'tests/**/*.test.mcp.yml'",
    "test:watch": "nodemon --ext yml,js --exec 'npm test'"
  }
}
```

## Error Handling

MCP Conductor provides detailed error reporting:

- **Configuration errors**: Missing required fields, invalid JSON
- **Server startup errors**: Process spawn failures, timeouts
- **Protocol errors**: Invalid JSON-RPC, handshake failures
- **Test failures**: Response mismatches with rich diffs

## Advanced Features

### Regex Pattern Matching

Use regex patterns in expectations:

```yaml
expect:
  response:
    result:
      message: "match:^Success: \\d+ items processed$"
```

### Environment Variable Support

Pass environment variables to your server:

```json
{
  "command": "node",
  "args": ["server.js"],
  "env": {
    "NODE_ENV": "test",
    "API_TOKEN": "${TEST_API_TOKEN}"
  }
}
```

### Server Ready Detection

Wait for server ready signal:

```json
{
  "command": "python",
  "args": ["server.py"],
  "readyPattern": "Server ready on port \\d+"
}
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development & Testing

MCP Conductor includes comprehensive unit and integration tests:

```bash
# Run unit tests
npm run test:unit

# Run integration tests (end-to-end)
npm test  

# Run all tests
npm run test:all
```

The test suite covers:
- ✅ Configuration parsing and validation
- ✅ Test file parsing and YAML validation
- ✅ MCP protocol communication over stdio
- ✅ Test execution and assertion matching
- ✅ CLI interface and error handling
- ✅ Reporter output and formatting

See [test/README.md](test/README.md) for detailed testing documentation.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP specification
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official TypeScript SDK
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) - Official Python SDK
