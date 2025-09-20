# Multi-Tool Server Example

A comprehensive MCP server that demonstrates multiple tools with different capabilities.

## Files

- `server.js` - The MCP server implementation with 4 tools
- `config.json` - Server configuration for MCP Aegis  
- `multi-tool.test.mcp.yml` - Comprehensive test suite for all tools

## Available Tools

- **calculator**: Performs mathematical operations (add, subtract, multiply, divide)
- **text_processor**: Processes and analyzes text (analyze, reverse, uppercase, count_words)
- **data_validator**: Validates various data formats (email, url, json, uuid)
- **file_manager**: Manages files and directories (list, create, delete, exists)

## Running Tests

From the project root:

```bash
# Run multi-tool server tests
npm run test:multitool
```

## Features Demonstrated

- Multiple tool implementations in one server
- Complex parameter validation
- Error handling and edge cases
- Real-world tool functionality
- Comprehensive test coverage
