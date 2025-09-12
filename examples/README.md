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
├── api-testing-server/         # Sophisticated API testing & monitoring server
│   ├── server.js              # Advanced server implementation
│   ├── config.json            # MCP Conductor configuration
│   ├── api-testing.test.mcp.yml # Comprehensive YAML tests (76 tests)
│   ├── api-testing-server.programmatic.test.js # Programmatic tests (39 tests)
│   └── README.md              # Detailed server documentation
├── data-patterns-server/        # Data patterns testing server
│   ├── server.js              # Server returning numeric and timestamp datasets
│   ├── server.config.json     # MCP Conductor configuration
│   ├── patterns-*.test.mcp.yml # Pattern testing suites (numeric + date)
│   └── README.md              # Pattern testing documentation
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
- **Pattern Examples**: `patterns-partial-array-elements.test.mcp.yml` - Demonstrates combining `match:partial:` with `match:arrayElements:` for validating arrays with mixed properties

### 3. API Testing & Monitoring Server (`api-testing-server/`)
- **Purpose**: Sophisticated MCP server for API testing, monitoring, and analysis
- **Tools**: 6 advanced tools (http_request, response_analyzer, endpoint_monitor, data_transformer, load_tester, webhook_simulator)  
- **Features**: Full API testing workflow, comprehensive pattern matching, webhook simulation, load testing, data transformation

### 4. Data Patterns Server (`data-patterns-server/`)
- **Purpose**: Demonstrates comprehensive pattern matching including numeric comparisons and date/timestamp validation
- **Tools**: `get_numeric_data` - returns numeric datasets, `get_timestamp_data` - returns timestamp data  
- **Features**: All 10 numeric patterns (greaterThan, lessThan, between, range, greaterThanOrEqual, lessThanOrEqual, equals, notEquals, approximately, multipleOf, divisibleBy, decimalPlaces, negation) + 7 date/timestamp patterns (dateValid, dateAfter, dateBefore, dateBetween, dateAge, dateEquals, dateFormat)
- **Tests**: Comprehensive numeric and date pattern validation with real business scenarios including currency formatting, inventory rules, and floating-point tolerance
- **Tests**: 76 YAML tests + 39 programmatic tests demonstrating all MCP Conductor capabilities
- **Highlights**: Production-ready server showcasing enterprise-grade functionality

### 5. Shared Test Data (`shared-test-data/`)
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

# Test data patterns server
npm run test:data-patterns

# Test API testing server (programmatic)
node --test examples/api-testing-server/api-testing-server.programmatic.test.js
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
4. **Learn Data Patterns**: Advanced pattern matching with numeric comparisons and date/timestamp validation
5. **Explore API Testing Server**: Sophisticated enterprise-grade server with advanced features
6. **Understand Test Data**: How to structure test data for realistic scenarios

## Key Concepts Demonstrated

- **MCP Protocol Compliance**: Proper handshake and message handling
- **Tool Schema Definition**: Input validation and parameter types
- **Error Handling**: Graceful failure and error responses
- **Test Organization**: Different approaches to organizing test suites
- **Pattern Matching**: Regex patterns, numeric comparisons, date/timestamp validation, and advanced validation
- **Configuration Management**: Server-specific configurations
- **Test Data Management**: Shared resources across test suites

Each example directory contains its own README with specific details about the server implementation and test structure.
