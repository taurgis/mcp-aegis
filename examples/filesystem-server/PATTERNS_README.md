# Pattern Examples for Filesystem Server

This directory contains comprehensive examples of all MCP Conductor pattern matching capabilities using the filesystem server. Each file demonstrates specific pattern types with practical examples.

## Pattern Files

### Basic Patterns
- **`patterns-basic.test.mcp.yml`** - Deep equality, type validation, field existence
- **`patterns-strings.test.mcp.yml`** - String matching: contains, startsWith, endsWith
- **`patterns-utility.test.mcp.yml`** - Count, exists, length utility patterns

### Advanced Patterns
- **`patterns-regex.test.mcp.yml`** - Regular expression patterns for complex matching
- **`patterns-arrays.test.mcp.yml`** - Array length, elements, contains patterns
- **`patterns-field-extraction.test.mcp.yml`** - Field extraction and validation
- **`patterns-partial-matching.test.mcp.yml`** - Selective field validation
- **`patterns-complex.test.mcp.yml`** - Combined patterns for real-world scenarios

## Running the Examples

```bash
# Run all pattern examples
node bin/conductor.js "examples/filesystem-server/patterns-*.test.mcp.yml" --config "examples/filesystem-server/config.json"

# Run specific pattern type
node bin/conductor.js "examples/filesystem-server/patterns-basic.test.mcp.yml" --config "examples/filesystem-server/config.json"

# Run specific string patterns
node bin/conductor.js "examples/filesystem-server/patterns-strings.test.mcp.yml" --config "examples/filesystem-server/config.json"

# Run regex patterns
node bin/conductor.js "examples/filesystem-server/patterns-regex.test.mcp.yml" --config "examples/filesystem-server/config.json"
```

## Pattern Categories Demonstrated

### 1. Basic Patterns (patterns-basic.test.mcp.yml)
- Deep equality matching (default behavior)
- Type validation (`match:type:string`, `match:type:array`, etc.)
- Field existence checking (`match:exists`)

### 2. String Patterns (patterns-strings.test.mcp.yml)
- Substring matching (`match:contains:text`)
- Prefix matching (`match:startsWith:prefix`)
- Suffix matching (`match:endsWith:suffix`)

### 3. Regular Expression Patterns (patterns-regex.test.mcp.yml)
- Number matching (`match:regex:\\d+`)
- Email validation (`match:regex:[a-zA-Z0-9._%+-]+@...`)
- URL validation (`match:regex:https?://...`)
- Date/time patterns (`match:regex:\\d{4}-\\d{2}-\\d{2}`)
- UUID patterns, phone numbers, file extensions

### 4. Array Patterns (patterns-arrays.test.mcp.yml)
- Array length validation (`match:arrayLength:N`)
- Array element validation (`match:arrayElements:`)
- Array contains checking (`match:arrayContains:value`)

### 5. Field Extraction (patterns-field-extraction.test.mcp.yml)
- Extract field values (`match:extractField: "path.to.field"`)
- Wildcard extraction (`match:extractField: "tools.*.name"`)
- Combined with other patterns for validation

### 6. Partial Matching (patterns-partial-matching.test.mcp.yml)
- Selective field validation (`match:partial:`)
- Ignore extra fields for flexible API evolution
- Nested partial matching

### 7. Utility Patterns (patterns-utility.test.mcp.yml)
- Property counting (`match:count:N`)
- Field existence (`match:exists`)
- Length validation (`match:length:N`)

### 8. Complex Combined Patterns (patterns-complex.test.mcp.yml)
- Real-world scenarios combining multiple pattern types
- Production-ready validation strategies
- Performance-oriented patterns

## Test Data Files Used

These examples use test data files from `../shared-test-data/`:
- `hello.txt` - Simple greeting text
- `numbers.txt` - Content with numbers for regex testing
- `contact.txt` - Email and phone number examples
- `links.txt` - URL examples
- `timestamp.txt` - Date and time examples
- `ids.txt` - UUID examples
- `data.json` - JSON structure examples
- `nonexistent.txt` - For error testing (doesn't exist)

## Learning Path

1. **Start with `patterns-basic.test.mcp.yml`** - Learn fundamental concepts
2. **Progress to `patterns-strings.test.mcp.yml`** - Master text matching
3. **Explore `patterns-arrays.test.mcp.yml`** - Understand collection validation
4. **Study `patterns-field-extraction.test.mcp.yml`** - Learn data extraction
5. **Master `patterns-regex.test.mcp.yml`** - Complex pattern matching
6. **Apply `patterns-partial-matching.test.mcp.yml`** - Flexible validation
7. **Combine in `patterns-complex.test.mcp.yml`** - Real-world scenarios

## Production Usage

All patterns demonstrated have been verified with production MCP servers and represent real-world testing scenarios. Use these examples as templates for testing your own MCP servers.
