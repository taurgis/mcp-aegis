# Server Tests That Fail - MCP Conductor Demonstration

This folder contains comprehensive failing tests that demonstrate MCP Conductor's error detection capabilities across all pattern matching types. These tests are designed to **intentionally fail** to showcase the framework's validation and error reporting.

## 🎯 Quick Start

### Run All Failing Tests
Use the provided test runner to run all failing tests at once:

```bash
# From the project root
node examples/server-tests-that-fail/run-failing-tests.mjs

# From this directory  
node run-failing-tests.mjs
```

This will run all 12 test suites (155+ individual tests) and verify that MCP Conductor properly detects all the validation failures.

### Run Individual Test Files

These tests serve as:
- **Validation examples** - Show how MCP Conductor detects various types of validation failures
- **Error documentation** - Demonstrate clear error messages and diff output
- **Pattern reference** - Cover all 50+ pattern matching types with failing scenarios
- **Quality assurance** - Ensure the testing framework properly catches incorrect responses

## 📁 Test Categories

### Core Pattern Types
- **`failing-type-patterns.test.mcp.yml`** - Type validation failures (string, number, object, array, boolean, null) - Uses **filesystem server**
- **`failing-string-patterns.test.mcp.yml`** - String pattern failures (contains, startsWith, endsWith, regex) - Uses **filesystem server**
- **`failing-array-patterns.test.mcp.yml`** - Array pattern failures (length, contains, elements) - Uses **filesystem server**
- **`failing-numeric-patterns.test.mcp.yml`** - Numeric pattern failures (comparisons, ranges, approximation) - Uses **data-patterns server**
- **`failing-date-patterns.test.mcp.yml`** - Date pattern failures (validation, comparisons, age, format) - Uses **data-patterns server**

### Advanced Patterns
- **`failing-field-extraction.test.mcp.yml`** - Field extraction failures (extractField patterns) - Uses **filesystem server**
- **`failing-partial-matching.test.mcp.yml`** - Partial matching failures - Uses **filesystem server**
- **`failing-negation-patterns.test.mcp.yml`** - Pattern negation failures (match:not:) - Uses **both servers**
- **`failing-cross-field.test.mcp.yml`** - Cross-field validation failures - Uses **data-patterns server**
- **`failing-complex-combinations.test.mcp.yml`** - Complex multi-pattern combination failures - Uses **both servers**

### Error Response Patterns
- **`failing-error-responses.test.mcp.yml`** - Tests that should handle error responses but expect success - Uses **filesystem server**
- **`failing-stderr-patterns.test.mcp.yml`** - stderr validation failures - Uses **filesystem server**

## 🚀 Usage

### Running Individual Test Categories

**Filesystem Server Tests** (basic patterns):
```bash
# Run specific failing test category
node bin/conductor.js "examples/server-tests-that-fail/failing-type-patterns.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json"

# Run with enhanced error output
node bin/conductor.js "examples/server-tests-that-fail/failing-string-patterns.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --errors-only --group-errors

# Array and extraction patterns
node bin/conductor.js "examples/server-tests-that-fail/failing-array-patterns.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --errors-only

# Partial matching and negation failures
node bin/conductor.js "examples/server-tests-that-fail/failing-partial-matching.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --errors-only
node bin/conductor.js "examples/server-tests-that-fail/failing-negation-patterns.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --errors-only

# Error response and stderr failures  
node bin/conductor.js "examples/server-tests-that-fail/failing-error-responses.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --errors-only
node bin/conductor.js "examples/server-tests-that-fail/failing-stderr-patterns.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --errors-only
```

**Data Patterns Server Tests** (advanced patterns):
```bash
# Numeric pattern failures
node bin/conductor.js "examples/server-tests-that-fail/failing-numeric-patterns.test.mcp.yml" --config "examples/server-tests-that-fail/data-patterns-server.config.json" --errors-only

# Date pattern failures  
node bin/conductor.js "examples/server-tests-that-fail/failing-date-patterns.test.mcp.yml" --config "examples/server-tests-that-fail/data-patterns-server.config.json" --errors-only

# Cross-field validation failures
node bin/conductor.js "examples/server-tests-that-fail/failing-cross-field.test.mcp.yml" --config "examples/server-tests-that-fail/data-patterns-server.config.json" --errors-only
```

**Complex Combinations**:
```bash
# Complex multi-pattern failures (uses filesystem server)
node bin/conductor.js "examples/server-tests-that-fail/failing-complex-combinations.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --errors-only

# Run all failing tests to see comprehensive error detection
node bin/conductor.js "examples/server-tests-that-fail/failing-*.test.mcp.yml" --config "examples/server-tests-that-fail/filesystem-server.config.json" --quiet
```

### Expected Output
All tests in this folder should **FAIL** with detailed error messages showing:
- Expected vs. actual value differences
- Pattern matching failures
- Clear explanations of why validations failed
- Colored diff output for easy debugging

## ⚠️ Important Notes

1. **These tests are designed to fail** - A successful run means error detection is working
2. **Use existing servers** - Tests use the filesystem server and data-patterns server for realistic scenarios
3. **Error message validation** - Focus on the quality and clarity of error messages
4. **Pattern coverage** - Each test file covers specific pattern types comprehensively

## 🎓 Learning Objectives

By examining these failing tests, developers will understand:
- How to write robust test validations
- What types of errors MCP Conductor can detect
- How to interpret error messages and diffs
- Best practices for pattern matching
- Common validation pitfalls to avoid

---

**Remember**: Success in this folder means failure! These tests validate that MCP Conductor properly detects and reports validation errors.
