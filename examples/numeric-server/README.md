# Numeric Server Example

This example demonstrates **numeric pattern matching and date/timestamp validation** capabilities in MCP Conductor. It includes a custom MCP server that returns numeric data and timestamp information with comprehensive test cases showcasing all numeric comparison patterns and date validation patterns.

## Overview

The Numeric Server provides real numeric data and timestamp information for testing MCP Conductor's advanced pattern matching features, including:

**Numeric Patterns:**
- **Greater Than**: `match:greaterThan:1000`
- **Less Than**: `match:lessThan:10`
- **Between/Range**: `match:between:10:100` or `match:range:0:100`
- **Greater Than or Equal**: `match:greaterThanOrEqual:100`
- **Less Than or Equal**: `match:lessThanOrEqual:100`
- **Pattern Negation**: `match:not:greaterThan:500`

**Date/Timestamp Patterns:**
- **Date Validation**: `match:dateValid`
- **Date Comparisons**: `match:dateAfter:2023-01-01`, `match:dateBefore:2025-01-01`
- **Date Ranges**: `match:dateBetween:2023-01-01:2024-12-31`
- **Age Validation**: `match:dateAge:1d` (within last day)
- **Format Validation**: `match:dateFormat:iso`
- **Exact Matching**: `match:dateEquals:2023-06-15T14:30:00.000Z`

## Files

- `server.js` - Custom MCP server that returns numeric datasets and timestamp data
- `server.config.json` - MCP Conductor configuration for the server
- `patterns-numeric.test.mcp.yml` - Comprehensive test cases demonstrating numeric patterns
- `patterns-date.test.mcp.yml` - Comprehensive test cases demonstrating date/timestamp patterns

## Server Features

The server provides a `get_numeric_data` tool with multiple datasets:

### API Dataset
```json
{
  "requestCount": 1250,
  "errorCount": 3,
  "averageResponseTime": 142,
  "uptime": 99.8,
  "activeUsers": 847,
  "version": 2.1
}
```

### Performance Dataset
```json
{
  "cpuUsage": 67,
  "memoryUsage": 82,
  "diskUsage": 45,
  "responseTime": 89,
  "throughput": 1500,
  "loadAverage": 1.2
}
```

### E-commerce Dataset
```json
{
  "productCount": 42,
  "price": 24.99,
  "rating": 4.2,
  "stock": 15,
  "discountPercent": 12,
  "categoryId": 8
}
```

### Validation Dataset
```json
{
  "score": 87,
  "attempts": 2,
  "successRate": 95.5,
  "version": 2.1,
  "priority": 5,
  "retries": 1
}
```

## Running Tests

```bash
# Run the numeric pattern tests
npm run test:numeric

# Or run manually
node bin/conductor.js "examples/numeric-server/patterns-numeric.test.mcp.yml" --config "examples/numeric-server/server.config.json"

# Run with verbose output
node bin/conductor.js "examples/numeric-server/patterns-numeric.test.mcp.yml" --config "examples/numeric-server/server.config.json" --verbose
```

## Test Examples

### Basic Numeric Comparisons
```yaml
result:
  requestCount: "match:greaterThan:1000"     # 1250 > 1000 ✓
  errorCount: "match:lessThan:10"            # 3 < 10 ✓
  uptime: "match:between:90:100"             # 99.8 in range ✓
```

### Range Validation
```yaml
result:
  price: "match:range:20:30"                 # 24.99 in range ✓ 
  rating: "match:between:4:5"                # 4.2 in range ✓
  discountPercent: "match:lessThanOrEqual:15" # 12 <= 15 ✓
```

### Pattern Negation
```yaml
result:
  errorCount: "match:not:greaterThan:10"     # NOT(3 > 10) = NOT(false) = true ✓
  uptime: "match:not:lessThan:90"            # NOT(99.8 < 90) = NOT(false) = true ✓
```

## Use Cases

This example is perfect for:

- **API Response Validation**: Ensure numeric fields meet expected thresholds
- **Performance Testing**: Validate response times, throughput, and resource usage
- **E-commerce Testing**: Check prices, ratings, stock levels, and percentages
- **Quality Assurance**: Verify scores, success rates, and retry counts
- **Range Validation**: Ensure values fall within acceptable bounds

## Integration

The numeric patterns work seamlessly with all other MCP Conductor features:

- **Type Validation**: Combine with `match:type:number`
- **Partial Matching**: Use within `match:partial:` blocks
- **Field Extraction**: Apply to extracted fields with `match:extractField:`
- **Array Validation**: Use in `match:arrayElements:` patterns

This example demonstrates the power and flexibility of MCP Conductor's pattern matching system for real-world numeric validation scenarios.
