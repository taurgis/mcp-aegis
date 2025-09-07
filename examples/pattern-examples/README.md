# Pattern Examples

This directory contains comprehensive examples demonstrating all 11+ pattern matching capabilities in MCP Conductor. Each pattern type is showcased in separate files for easy learning and reference.

## Pattern Categories

### 1. Basic Patterns
- **`basic-patterns.test.mcp.yml`** - Deep equality, type validation, exists checking
- **`string-patterns.test.mcp.yml`** - Contains, startsWith, endsWith patterns

### 2. Array Patterns  
- **`array-patterns.test.mcp.yml`** - Array length, arrayElements, arrayContains patterns
- **`field-extraction.test.mcp.yml`** - Field extraction and validation patterns

### 3. Advanced Patterns
- **`regex-patterns.test.mcp.yml`** - Regular expression patterns with common use cases
- **`partial-matching.test.mcp.yml`** - Partial object matching for flexible validation
- **`complex-patterns.test.mcp.yml`** - Combined patterns for real-world scenarios

### 4. Specialized Patterns
- **`validation-patterns.test.mcp.yml`** - Data validation, error handling, edge cases
- **`utility-patterns.test.mcp.yml`** - Count patterns, utility functions

## Pattern Reference

| Pattern Type | File | Description |
|-------------|------|-------------|
| **Deep Equality** | basic-patterns.test.mcp.yml | Exact value matching |
| **Type Validation** | basic-patterns.test.mcp.yml | Data type checking |
| **String Contains** | string-patterns.test.mcp.yml | Substring matching |
| **String Starts With** | string-patterns.test.mcp.yml | Prefix matching |
| **String Ends With** | string-patterns.test.mcp.yml | Suffix matching |
| **Regex Match** | regex-patterns.test.mcp.yml | Regular expressions |
| **Array Length** | array-patterns.test.mcp.yml | Element count validation |
| **Array Elements** | array-patterns.test.mcp.yml | Pattern for all elements |
| **Array Contains** | array-patterns.test.mcp.yml | Value existence in array |
| **Field Extraction** | field-extraction.test.mcp.yml | Extract field values |
| **Partial Match** | partial-matching.test.mcp.yml | Selective field validation |
| **Object Count** | utility-patterns.test.mcp.yml | Property counting |
| **Field Exists** | basic-patterns.test.mcp.yml | Field presence validation |

## Using These Examples

### Running Individual Pattern Tests
```bash
# Test basic patterns
conductor "examples/pattern-examples/basic-patterns.test.mcp.yml" --config "examples/multi-tool-server/config.json"

# Test string patterns  
conductor "examples/pattern-examples/string-patterns.test.mcp.yml" --config "examples/multi-tool-server/config.json"

# Test all pattern examples
conductor "examples/pattern-examples/*.test.mcp.yml" --config "examples/multi-tool-server/config.json"
```

### Learning Path
1. Start with **basic-patterns.test.mcp.yml** for fundamentals
2. Progress to **string-patterns.test.mcp.yml** for text validation
3. Master **array-patterns.test.mcp.yml** for collection handling
4. Learn **field-extraction.test.mcp.yml** for data extraction
5. Explore **regex-patterns.test.mcp.yml** for complex matching
6. Apply **partial-matching.test.mcp.yml** for flexible validation
7. Combine concepts in **complex-patterns.test.mcp.yml**

## Configuration

These examples use the multi-tool server configuration which provides:
- **Calculator tool** - For numeric validation examples
- **Text processor tool** - For string pattern examples  
- **Data validator tool** - For validation pattern examples
- **File manager tool** - For file operation examples

All pattern examples are designed to work with the multi-tool server in `examples/multi-tool-server/`.

## Production Verification

All patterns demonstrated in these examples have been verified with production MCP servers, ensuring they work reliably in real-world scenarios.
