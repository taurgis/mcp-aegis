# Filesystem Server Example

A simple MCP server that provides file reading capabilities.

## Files

- `server.js` - The MCP server implementation
- `config.json` - Server configuration for MCP Aegis
- `filesystem.test.mcp.yml` - Comprehensive test suite with regex patterns
- `filesystem-tools-only.test.mcp.yml` - Tests only tool definitions and schema
- `filesystem-execution-only.test.mcp.yml` - Tests only tool execution functionality
- `filesystem-performance.test.mcp.yml` - Performance testing with timing assertions
- `advanced.test.mcp.yml` - Advanced testing scenarios

## Available Tool

- **read_file**: Reads the contents of a file from the filesystem

## Running Tests

From the project root:

```bash
# Run all filesystem server tests
npm run test:filesystem

# Run only tool definition tests
npm run test:filesystem:tools

# Run only execution tests  
npm run test:filesystem:execution

# Run performance tests with timing
./bin/aegis.js "./examples/filesystem-server/filesystem-performance.test.mcp.yml" \
  --config "./examples/filesystem-server/config.json" --timing
```

## Test Data

Tests use files from `../shared-test-data/` which contains various file formats for testing:
- Text files
- JSON files
- Email lists
- Structured data files
