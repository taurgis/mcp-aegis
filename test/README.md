# MCP Conductor Tests

This directory contains comprehensive unit and integration tests for the MCP Conductor library.

## Test Structure

### Unit Tests
- `configParser.test.js` - Tests configuration file parsing and validation
- `testParser.test.js` - Tests YAML test file parsing and validation  
- `reporter.test.js` - Tests output formatting and result reporting
- `MCPCommunicator.test.js` - Tests low-level MCP communication over stdio
- `testRunner.test.js` - Tests core test execution logic and integration

### Integration Tests
- `cli.test.js` - Tests the complete CLI interface and end-to-end workflows

### Test Helpers
- `helpers.js` - Shared utilities, mock classes, and test fixtures

## Running Tests

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests (End-to-End)
```bash
npm test
```

### All Tests
```bash
npm run test:all
```

## Test Coverage

The test suite covers:

✅ **Configuration Management**
- Valid/invalid JSON parsing
- Required field validation
- Type checking
- Default value assignment
- Environment variable merging

✅ **Test File Parsing**
- YAML parsing and validation
- Test structure validation
- JSON-RPC message validation
- Error handling for malformed files

✅ **MCP Communication** 
- Process spawning and lifecycle management
- JSON-RPC message framing over stdio
- Asynchronous stream handling
- Error and timeout handling
- Graceful shutdown

✅ **Test Execution**
- MCP protocol handshake
- Request/response matching
- Deep object comparison
- Regex pattern matching
- Stderr validation

✅ **Reporting & Output**
- Colored console output
- Test result counting
- Failure reporting with diffs
- Summary generation

✅ **CLI Interface**
- Argument parsing
- File discovery with glob patterns
- Exit code handling
- Error messaging

## Test Fixtures

Test fixtures are created dynamically in `./test/fixtures/` and cleaned up automatically.

## Mocking Strategy

The tests use minimal mocking, preferring integration testing with real processes where possible:

- **Real MCP servers** for integration tests (using `examples/simple-fs-server.js`)
- **Mock console output** for capturing and verifying log messages
- **Temporary files** for testing file operations
- **Child processes** for testing CLI behavior

## Performance

Test execution time is optimized by:
- Short timeouts for failure scenarios
- Parallel test execution where safe
- Cleanup of test processes
- Minimal test fixtures

## Debugging Tests

To debug failing tests:

1. Run individual test files:
   ```bash
   node --test test/configParser.test.js
   ```

2. Add console.log statements in test code
3. Check test fixtures in `./test/fixtures/` 
4. Verify MCP server behavior with manual testing

## Contributing

When adding new features:

1. Add corresponding unit tests
2. Update integration tests if needed
3. Ensure all tests pass: `npm run test:all`
4. Add test documentation for complex scenarios
