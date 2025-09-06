# MCP Conductor Examples

This directory contains example MCP servers and their test suites, demonstrating how to use MCP Conductor for testing MCP servers.

## Structure

```
examples/
├── filesystem-server/          # Simple single-tool MCP server
│   ├── server.js              # Server implementation
│   ├── config.json            # MCP Conductor configuration
│   ├── *.test.mcp.yml         # Test files (comprehensive + focused)
│   └── README.md              # Server-specific documentation
├── multi-tool-server/          # Complex multi-tool MCP server
│   ├── server.js              # Server implementation
│   ├── config.json            # MCP Conductor configuration
│   ├── multi-tool.test.mcp.yml # Comprehensive test suite
│   └── README.md              # Server-specific documentation
├── shared-test-data/           # Common test data files
│   ├── *.txt, *.json          # Various test data formats
│   └── README.md              # Test data documentation
└── README.md                  # This file
```

## Available Examples

### 1. Filesystem Server (`filesystem-server/`)
- **Purpose**: Demonstrates basic MCP server with single tool
- **Tool**: `read_file` - reads file contents
- **Tests**: 4 test files showing different testing approaches:
  - `filesystem.test.mcp.yml` - Comprehensive test with regex patterns
  - `filesystem-tools-only.test.mcp.yml` - Tests only tool definitions
  - `filesystem-execution-only.test.mcp.yml` - Tests only tool execution
  - `advanced.test.mcp.yml` - Advanced testing scenarios

### 2. Multi-Tool Server (`multi-tool-server/`)
- **Purpose**: Demonstrates complex MCP server with multiple tools
- **Tools**: 4 different tools (calculator, text processor, validator, file manager)
- **Tests**: Comprehensive test suite covering all tools and error scenarios

### 3. Shared Test Data (`shared-test-data/`)
- **Purpose**: Common test files used by multiple servers
- **Contents**: Various file formats for realistic testing scenarios

## Running Tests

### Individual Server Tests
```bash
# Test filesystem server (all tests)
npm run test:filesystem

# Test only tool definitions
npm run test:filesystem:tools

# Test only tool execution
npm run test:filesystem:execution

# Test multi-tool server
npm run test:multitool
```

### Combined Tests
```bash
# Test all example servers
npm run test:examples

# Test everything (unit tests + examples)
npm run test:all
```

## Learning Path

1. **Start with Filesystem Server**: Simple single-tool example
2. **Explore Test Approaches**: See different testing strategies (tools-only vs execution-only)
3. **Study Multi-Tool Server**: Complex server with multiple tools
4. **Understand Test Data**: How to structure test data for realistic scenarios

## Key Concepts Demonstrated

- **MCP Protocol Compliance**: Proper handshake and message handling
- **Tool Schema Definition**: Input validation and parameter types
- **Error Handling**: Graceful failure and error responses
- **Test Organization**: Different approaches to organizing test suites
- **Regex Pattern Matching**: Flexible response validation
- **Configuration Management**: Server-specific configurations
- **Test Data Management**: Shared resources across test suites

Each example directory contains its own README with specific details about the server implementation and test structure.
