# Data Patterns Server Example

This example demonstrates **comprehensive pattern matching capabilities** in MCP Aegis, including numeric patterns, date/timestamp validation, and other advanced pattern types. It includes a custom MCP server that returns both numeric data and timestamp information with comprehensive test cases showcasing all pattern matching features.

## Overview

The Data Patterns Server provides comprehensive data for testing MCP Aegis's advanced pattern matching features, including:

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
- `server.config.json` - MCP Aegis configuration for the server
- `patterns-numeric.test.mcp.yml` - Comprehensive test cases demonstrating numeric patterns
- `patterns-date.test.mcp.yml` - Comprehensive test cases demonstrating date/timestamp patterns

## Server Features

The server provides two main tools for comprehensive pattern testing:

### `get_numeric_data` Tool

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

### `get_timestamp_data` Tool

Provides timestamp and date data in various formats for testing date patterns:

#### ISO Format Dataset
```json
{
  "createdAt": "2025-09-10T10:30:00.000Z",
  "updatedAt": "2025-09-10T08:30:00.000Z", 
  "publishDate": "2023-05-15T14:30:00.000Z",
  "expireDate": "2024-12-31T23:59:59.999Z",
  "validDate": "2023-01-01T12:00:00Z"
}
```

#### Timestamp Format Dataset
```json
{
  "createdAt": 1725962200000,
  "updatedAt": 1725955000000,
  "publishTimestamp": 1684159800000,
  "expireTimestamp": 1735689599999,
  "validTimestamp": 1672574400000
}
```

#### Mixed Format Dataset
```json
{
  "isoDate": "2025-09-10T10:30:00.000Z",
  "timestamp": 1725875800000,
  "dateString": "2023-06-15",
  "timeString": "14:30:00", 
  "usFormat": "12/25/2023",
  "invalidDate": "not-a-date",
  "emptyDate": "",
  "nullDate": null
}
```

## Running Tests

```bash
# Run the data patterns tests
npm run test:data-patterns

# Or run manually
node bin/aegis.js "examples/data-patterns-server/patterns-numeric.test.mcp.yml" --config "examples/data-patterns-server/server.config.json"

# Run with verbose output
node bin/aegis.js "examples/data-patterns-server/patterns-numeric.test.mcp.yml" --config "examples/data-patterns-server/server.config.json" --verbose

# Run date pattern tests
node bin/aegis.js "examples/data-patterns-server/patterns-date.test.mcp.yml" --config "examples/data-patterns-server/server.config.json"
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

### Date and Timestamp Validation
```yaml
result:
  createdAt: "match:dateValid"               # Valid ISO date ✓
  publishDate: "match:dateAfter:2023-01-01"  # After 2023 ✓ 
  expireDate: "match:dateBefore:2025-01-01"  # Before 2025 ✓
  validDate: "match:dateFormat:iso"          # ISO format ✓
  invalidDate: "match:not:dateValid"         # Should be invalid ✓
```

## Use Cases

This example is perfect for:

- **API Response Validation**: Ensure numeric fields meet expected thresholds
- **Performance Testing**: Validate response times, throughput, and resource usage
- **E-commerce Testing**: Check prices, ratings, stock levels, and percentages
- **Quality Assurance**: Verify scores, success rates, and retry counts
- **Range Validation**: Ensure values fall within acceptable bounds
- **Date/Time Validation**: Verify timestamps, date formats, and time-based logic
- **Pattern Testing**: Comprehensive testing of all MCP Aegis pattern types
- **Data Type Validation**: Test mixed data types and format validation

## Integration

The numeric patterns work seamlessly with all other MCP Aegis features:

- **Type Validation**: Combine with `match:type:number`
- **Partial Matching**: Use within `match:partial:` blocks
- **Field Extraction**: Apply to extracted fields with `match:extractField:`
- **Array Validation**: Use in `match:arrayElements:` patterns

This example demonstrates the power and flexibility of MCP Aegis's pattern matching system for real-world numeric validation scenarios.
