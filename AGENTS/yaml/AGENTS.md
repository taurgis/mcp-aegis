# MCP Conductor - YAML Testing Guide for AI Agents

**Target Audience**: AI coding assistants generating declarative YAML test files for Model Context Protocol servers.

## Over# ✅ CORRECT - Use [\s\S]* for multiline matching
result:
  content:
    - text: "match:regex:[\s\S]*\(component[\s\S]*\(hook"  # Matches across newlines
```

### 🆕 13. Pattern Negation with `match:not:`

**NEW**: Negate ANY pattern by prefixing with `not:`! Perfect for testing that values do NOT match specific criteria.

```yaml
# Basic negation patterns
result:
  tools: "match:not:arrayLength:0"              # Tools array should NOT be empty
  name: "match:not:startsWith:invalid_"         # Name should NOT start with "invalid_"
  text: "match:not:contains:error"              # Text should NOT contain "error"
  data: "match:not:type:string"                 # Data should NOT be a string
  message: "match:not:endsWith:failed"          # Message should NOT end with "failed"
  pattern: "match:not:regex:^ERROR:"            # Should NOT match regex pattern

# Works with field extraction
result:
  match:extractField: "tools.*.name"
  value: "match:not:arrayContains:get_latest_error"  # Array should NOT contain this value

# Works with array elements  
result:
  tools:
    match:arrayElements:
      name: "match:not:startsWith:invalid_"     # No tool name should start with "invalid_"
      description: "match:not:contains:deprecated"  # No description should contain "deprecated"
```

**Supported Negation Patterns:**
- `match:not:contains:text` - String should NOT contain text
- `match:not:startsWith:prefix` - String should NOT start with prefix  
- `match:not:endsWith:suffix` - String should NOT end with suffix
- `match:not:type:string` - Should NOT be specified type
- `match:not:arrayLength:N` - Array should NOT have N elements
- `match:not:arrayContains:value` - Array should NOT contain value
- `match:not:regex:pattern` - Should NOT match regex
- `match:not:crossField:field1 op field2` - Field comparison should NOT be true
- `match:not:exists` - Field should NOT exist
- `match:not:count:N` - Should NOT have N properties

**Common Use Cases:**
- ✅ **Error Prevention**: Ensure responses don't contain error messages
- ✅ **Security Validation**: Verify sensitive data is not exposed  
- ✅ **Tool Filtering**: Confirm deprecated/invalid tools are not present
- ✅ **Quality Assurance**: Check that unwanted patterns are absent
- ✅ **Regression Testing**: Ensure known problems don't reappear

**Negation Examples:**
```yaml
# Security and error prevention
result:
  response: "match:not:contains:error"                    # No error messages
  data: "match:not:contains:sensitive"                    # No sensitive data
  tools: "match:not:arrayContains:name:deprecated_tool"   # No deprecated tools

# Business rule validation
result:
  "match:not:crossField": "currentStock > maxStock"      # Prevent overstocking
  "match:not:crossField": "price < minPrice"             # Prevent underpricing
  "match:not:crossField": "age < minAge"                 # Age restrictions

# System limits and constraints
result:
  usage: "match:not:crossField": "current >= limit"      # Resource limits
  connections: "match:not:arrayLength:0"                 # Must have connections
  status: "match:not:startsWith:invalid"                 # Valid status only

# Data integrity checks
result:
  dates: "match:not:crossField": "endDate < startDate"   # Valid date ranges
  permissions: "match:not:crossField": "used > granted"  # Permission boundaries
  inventory: "match:not:crossField": "reserved > total"  # Stock validation
```

**YAML Testing** provides declarative, human-readable test files for MCP servers with advanced pattern matching. Perfect for protocol compliance, basic tool testing, and maintainable test suites without requiring programming knowledge.

### 📚 Key Resources
- **[YAML Testing Documentation](https://conductor.rhino-inquisitor.com/yaml-testing.html)** - Complete guide
- **[Pattern Matching Reference](https://conductor.rhino-inquisitor.com/pattern-matching.html)** - All 32+ pattern types
- **[Examples Directory](../../examples/)** - Real-world YAML test files

## Quick Setup

### 1. Configuration First (Always Required)
Create `conductor.config.json`:

```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000,
  "env": {
    "NODE_ENV": "test"
  }
}
```

### 2. Basic YAML Test Structure
File naming convention: `*.test.mcp.yml`

```yaml
description: "Test suite for [SERVER_NAME]"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tools-1"
        result:
          tools: "match:type:array"
      stderr: "toBeEmpty"

  - it: "should execute [TOOL_NAME] successfully"
    request:
      jsonrpc: "2.0"
      id: "call-1"
      method: "tools/call"
      params:
        name: "[TOOL_NAME]"
        arguments:
          param: "value"
    expect:
      response:
        jsonrpc: "2.0"
        id: "call-1"
        result:
          content:
            - type: "text"
              text: "match:contains:expected"
          isError: false
      stderr: "toBeEmpty"
```

### 3. Execute Tests
```bash
# Basic execution
conductor "tests/**/*.test.mcp.yml" --config "conductor.config.json"

# With debugging options
conductor "tests/*.yml" --config "config.json" --verbose --debug
```

## Essential YAML Patterns

### 1. Deep Equality (Default)
```yaml
result:
  tools:
    - name: "read_file"
      description: "Reads a file"
      inputSchema:
        type: "object"
```

### 2. Type Validation
```yaml
result:
  tools: "match:type:array"
  count: "match:type:number"
  serverInfo: "match:type:object"
  active: "match:type:boolean"
```

### 3. String Patterns
```yaml
# Contains substring (case-sensitive)
result:
  content:
    - type: "text"
      text: "match:contains:MCP"

# Contains substring (case-insensitive) - NEW!
result:
  content:
    - type: "text"
      text: "match:containsIgnoreCase:mcp"  # Matches "MCP", "mcp", "Mcp"

# Starts with / Ends with
result:
  name: "match:startsWith:get_"
  version: "match:endsWith:.0"
  jsonrpc: "match:startsWith:2."    # JSON-RPC version validation

# Exact string matching (case-insensitive) - NEW!
result:
  status: "match:equalsIgnoreCase:SUCCESS"  # Matches "success", "Success", "SUCCESS"
  
# Case-insensitive patterns with negation - NEW!
result:
  message: "match:not:containsIgnoreCase:ERROR"     # Should NOT contain "error" (case-insensitive)
  status: "match:not:equalsIgnoreCase:FAILURE"      # Should NOT equal "failure" (case-insensitive)
```

### 4. Array Patterns
```yaml
# Array length validation
result:
  tools: "match:arrayLength:4"

# Array elements - all must match pattern
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      inputSchema: "match:type:object"

# Advanced key structure validation
result:
  tools:
    match:arrayElements:
      name: "match:regex:^[a-z][a-z0-9_]*$"      # snake_case validation
      description: "match:regex:.{10,}"           # Min 10 characters
      inputSchema:
        type: "match:type:string"                 # Nested structure validation
        properties: "match:type:object"
        required: "match:type:array"

# Mixed exact and pattern matching
result:
  tools:
    match:arrayElements:
      name: "read_file"                    # Exact name match
      description: "match:contains:file"   # Must contain "file"
      inputSchema: "match:type:object"     # Type validation

# **Key Validation Notes:**
# - Every array element MUST have ALL specified keys
# - Each key can use any supported pattern (regex, type, contains, etc.)  
# - Supports nested object structure validation
# - Extra keys in elements are allowed
# - Test fails if ANY element is missing ANY specified key
```

### 4.1. Array Contains Patterns (NEW Enhanced!)
```yaml
# Simple value matching (original behavior)
result:
  tools: "match:arrayContains:read_file"        # Array contains string "read_file"
  counts: "match:arrayContains:42"              # Array contains number 42 (with type conversion)

# 🆕 Object field matching (NEW FEATURE!)
result:
  tools: "match:arrayContains:name:get_sfcc_class_info"        # Array contains object where obj.name === "get_sfcc_class_info"
  tools: "match:arrayContains:description:Search for SFCC"     # Array contains object where obj.description === "Search for SFCC"  
  tools: "match:arrayContains:version:1.0"                     # Array contains object where obj.version === "1.0"

# Works with any field name
result:
  metadata: "match:arrayContains:id:123"                       # obj.id === "123"  
  categories: "match:arrayContains:type:component"             # obj.type === "component"
  users: "match:arrayContains:role:admin"                      # obj.role === "admin"

# Combined with negation
result:
  tools: "match:not:arrayContains:name:deprecated_tool"        # Should NOT contain tool with this name
  tools: "match:not:arrayContains:status:disabled"             # No tool should have disabled status
```

**arrayContains Pattern Syntax:**
- `arrayContains:value` - Simple value matching (strings, numbers with type conversion)
- `arrayContains:field:value` - Object field matching (checks if any object in array has `obj.field === value`)

**Real-world MCP Use Cases:**
```yaml
# Validate specific tools are available
result:
  tools: "match:arrayContains:name:get_sfcc_class_info"

# Ensure no deprecated tools are present  
result:
  tools: "match:not:arrayContains:status:deprecated"

# Check for tools with specific capabilities
result:  
  tools: "match:arrayContains:category:documentation"
```

### 5. Field Extraction (Advanced)
```yaml
# Extract tool names using dot notation
result:
  match:extractField: "tools.*.name"
  value:
    - "read_file"
    - "calculator"

# Extract using bracket notation (NEW!)
result:
  match:extractField: "tools[0].name"    # First tool name
  value: "read_file"

# Check if array contains value
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:search_docs"
```

### 6. Regex Patterns (Escape Backslashes!)
```yaml
# Basic patterns
result:
  content:
    - text: "match:\\d+ files found"              # Numbers
    - text: "match:Status: (success|error)"       # Alternatives

# For substantial content (multiline-safe)
result:
  content:
    - text: "match:[\\s\\S]{1000,}"               # Min 1000 chars, any content
    - text: "match:[\\s\\S]{500,}"                # Min 500 chars
```

#### 🚨 CRITICAL: Multiline Regex Patterns
**JavaScript regex does NOT support inline flags like `(?s)` or `(?m)`**

```yaml
# ❌ WRONG - These JavaScript-incompatible patterns will FAIL
result:
  content:
    - text: "match:regex:(?s)(?=.*pattern1)(?=.*pattern2)"    # (?s) flag invalid
    - text: "match:regex:(?m)^Start.*End$"                    # (?m) flag invalid

# ✅ CORRECT - Use [\s\S]* for multiline matching
result:
  content:
    - text: "match:regex:[\\s\\S]*\\(component[\\s\\S]*\\(hook"  # Matches across newlines
    - text: "match:regex:[\\s\\S]*pattern1[\\s\\S]*pattern2"     # General multiline pattern

# ✅ CORRECT - Alternative approaches for complex patterns
result:
  content:
    - text: "match:contains:pattern1"             # Simple substring
    - text: "match:regex:pattern1.*pattern2"      # Single line patterns
```

**Why `[\s\S]*` works:**
- `\s` matches whitespace characters (including newlines)
- `\S` matches non-whitespace characters  
- `[\s\S]` matches ANY character (whitespace OR non-whitespace)
- `[\s\S]*` matches any sequence of characters including newlines

**Common multiline scenarios:**
```yaml
# Matching content with patterns on different lines
result:
  content:
    - text: "match:regex:[\\s\\S]*Found \\d+ results[\\s\\S]*component[\\s\\S]*hook"

# Matching substantial content that spans multiple lines
result:
  content:
    - text: "match:regex:[\\s\\S]{100,}"         # At least 100 chars, any content
```

### 7. Numeric Comparison Patterns (🆕 ENHANCED!)

**Comprehensive numeric validation** for testing numeric responses, scores, counts, percentages, ranges, and precision requirements:

```yaml
# Basic numeric comparisons
result:
  score: "match:greaterThan:85"          # Score must be > 85
  count: "match:lessThan:100"            # Count must be < 100 
  percentage: "match:greaterThanOrEqual:95"  # Percentage must be >= 95
  rating: "match:lessThanOrEqual:5"      # Rating must be <= 5

# Range validations
result:
  temperature: "match:between:20:30"     # Temperature between 20-30 (inclusive)
  port: "match:range:8000:9000"         # Port in range 8000-9000 (inclusive)

# 🆕 NEW: Exact numeric matching and inequality
result:
  productCount: "match:equals:42"        # Exact equality: 42 = 42
  categoryId: "match:notEquals:10"       # Inequality: should not equal 10
  userId: "match:equals:12345"           # Exact ID matching
  errorCode: "match:notEquals:500"       # Should not be error code 500

# 🆕 NEW: Floating point tolerance matching
result:
  successRate: "match:approximately:95.5:0.1"  # 95.5 ± 0.1 tolerance
  loadAverage: "match:approximately:1.2:0.05"  # Performance metric ± 0.05
  temperature: "match:approximately:20:0.5"    # Sensor reading ± 0.5°C
  pi_value: "match:approximately:3.14159:0.001" # Mathematical precision

# 🆕 NEW: Modular arithmetic validation  
result:
  productCount: "match:multipleOf:6"     # Must be multiple of 6 (inventory rules)
  stock: "match:divisibleBy:5"           # Must be divisible by 5 (packaging)
  percentage: "match:multipleOf:10"      # Must be multiple of 10 (rating scale)
  batchSize: "match:divisibleBy:12"      # Must be divisible by 12 (business rule)

# 🆕 NEW: Decimal precision validation
result:
  price: "match:decimalPlaces:2"         # Currency format: 24.99 (2 decimals)
  rating: "match:decimalPlaces:1"        # Rating format: 4.2 (1 decimal)
  percentage: "match:decimalPlaces:0"    # Whole number: 95 (0 decimals)
  weight: "match:decimalPlaces:3"        # Precise weight: 1.234 (3 decimals)

# With pattern negation
result:
  value: "match:not:greaterThan:1000"    # Value should NOT be > 1000
  error_count: "match:not:greaterThan:0" # Should have no errors (0 or negative)
  score: "match:not:between:0:50"        # Score should NOT be in failing range
  stock: "match:not:equals:0"            # Should NOT be out of stock
  loadAverage: "match:not:approximately:0:0.1"  # Should NOT be approximately 0

# Real-world business scenarios
result:
  api_response_time: "match:lessThan:500"        # Response time < 500ms
  success_rate: "match:greaterThanOrEqual:99"    # Success rate >= 99%
  price: "match:decimalPlaces:2"                 # Valid currency format
  stock: "match:multipleOf:5"                    # Inventory packaging rules
  version: "match:approximately:2.0:0.1"         # Version tolerance
```

**Available Numeric Patterns:**
- `greaterThan:N` - Value must be > N
- `lessThan:N` - Value must be < N  
- `greaterThanOrEqual:N` - Value must be >= N
- `lessThanOrEqual:N` - Value must be <= N
- `between:MIN:MAX` - Value must be between MIN and MAX (inclusive)
- `range:MIN:MAX` - Alias for between (inclusive range)
- **🆕 NEW**: `equals:N` - Exact numeric equality (N = N)
- **🆕 NEW**: `notEquals:N` - Numeric inequality (N ≠ N)
- **🆕 NEW**: `approximately:VALUE:TOLERANCE` - Floating point tolerance matching (VALUE ± TOLERANCE)
- **🆕 NEW**: `multipleOf:N` - Must be multiple of N (modular arithmetic)
- **🆕 NEW**: `divisibleBy:N` - Must be divisible by N (alias for multipleOf)
- **🆕 NEW**: `decimalPlaces:N` - Must have exactly N decimal places

**Pattern Negation Support:**
- All numeric patterns support `match:not:` prefix
- Perfect for validating values should NOT exceed limits
- Useful for error count validation, performance thresholds, business rule validation

**Real-world MCP Use Cases:**
```yaml
# Financial and currency validation
result:
  price: "match:decimalPlaces:2"                # Currency: $24.99
  discount: "match:between:5:25"                # Valid discount range  
  total: "match:approximately:100.00:0.01"      # Exact monetary calculation

# Performance testing
result:
  execution_time: "match:lessThan:1000"         # Under 1 second
  memory_usage: "match:lessThanOrEqual:512"     # Within memory limit
  cpu_usage: "match:between:0:80"               # Reasonable CPU usage
  load_average: "match:approximately:1.0:0.2"   # System load tolerance

# Business logic validation  
result:
  user_score: "match:greaterThanOrEqual:70"     # Passing score
  inventory: "match:multipleOf:12"              # Packaging requirements
  product_id: "match:equals:12345"              # Exact ID matching
  category_count: "match:notEquals:0"           # Must have categories

# Quality and precision validation
result:
  accuracy: "match:approximately:99.5:0.1"      # Precision requirement
  rating: "match:decimalPlaces:1"               # Rating format: 4.2
  temperature: "match:approximately:20.5:0.5"   # Sensor tolerance
  batch_size: "match:divisibleBy:6"             # Manufacturing rules
```

### 8. Date and Timestamp Patterns (🆕 NEW!)

**NEW**: Comprehensive date/timestamp validation patterns for temporal data validation in MCP servers! Perfect for validating creation times, expiration dates, activity timestamps, and file system dates.

```yaml
# Date validity checking
result:
  createdAt: "match:dateValid"                  # Must be valid date/timestamp
  updatedAt: "match:dateValid"                  # Supports ISO, Unix timestamp, common formats
  invalidDate: "match:not:dateValid"            # Should NOT be valid date (null, invalid string)

# Date comparisons - supports multiple formats
result:
  publishDate: "match:dateAfter:2023-01-01"     # After specific date
  expireDate: "match:dateBefore:2025-12-31"     # Before specific date
  eventDate: "match:dateBetween:2023-01-01:2024-12-31"  # Within date range
  
  # Works with Unix timestamps  
  lastLogin: "match:dateAfter:1687686600000"    # After timestamp
  sessionEnd: "match:dateBefore:1735689599999"  # Before timestamp

# Age-based validation (how recent/old)
result:
  lastUpdate: "match:dateAge:1d"                # Within last day
  recentActivity: "match:dateAge:2h"            # Within last 2 hours
  minuteCheck: "match:dateAge:30m"              # Within last 30 minutes
  quickCheck: "match:dateAge:45s"               # Within last 45 seconds
  oldBackup: "match:not:dateAge:7d"             # NOT within last week (older)

# Exact date matching (cross-format compatible)
result:
  fixedEvent: "match:dateEquals:2023-06-15T14:30:00.000Z"
  timestampMatch: "match:dateEquals:1687686600000"
  dateStringMatch: "match:dateEquals:2023-06-15"

# Format validation (string format checking)
result:
  isoTimestamp: "match:dateFormat:iso"          # "2023-06-15T14:30:00.000Z"
  dateOnly: "match:dateFormat:iso-date"         # "2023-06-15"
  timeOnly: "match:dateFormat:iso-time"         # "14:30:00.000"
  usFormat: "match:dateFormat:us-date"          # "6/15/2023"
  timestampStr: "match:dateFormat:timestamp"    # "1687686600000"

# Real-world MCP examples
result:
  # API response validation
  user_created: "match:dateAfter:2020-01-01"    # After service launch
  last_seen: "match:dateAge:30d"                # Active within 30 days
  token_expires: "match:dateAfter:2024-12-31"   # Valid token
  
  # File system operations
  file_modified: "match:dateAge:1d"             # Recently modified
  backup_date: "match:not:dateAge:1d"           # Old backup (not recent)
  log_timestamp: "match:dateFormat:iso"         # Proper log format
  
  # Event scheduling
  meeting_time: "match:dateBetween:2024-01-01:2024-12-31"  # This year
  deadline: "match:dateAfter:2024-06-01"        # Future deadline
```

**Available Date Patterns:**
- `dateValid` - Valid date/timestamp (any recognizable format)
- `dateAfter:DATE` - Date after specified date
- `dateBefore:DATE` - Date before specified date  
- `dateBetween:START:END` - Date within range (inclusive)
- `dateAge:DURATION` - Date within age limit (1d, 2h, 30m, 45s, 1000ms)
- `dateEquals:DATE` - Exact date match (cross-format compatible)
- `dateFormat:FORMAT` - Validate string format (iso, iso-date, iso-time, us-date, timestamp)

**Supported Date Input Formats:**
- **ISO 8601**: `2023-06-15T14:30:00.000Z`, `2023-06-15`
- **Unix Timestamps**: `1687686600000` (number or string, seconds or milliseconds)
- **Common Formats**: `6/15/2023`, `June 15, 2023`, `15/6/2023`

**Duration Units for dateAge:**
- `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours), `d` (days)
- Examples: `"1000ms"`, `"30s"`, `"5m"`, `"2h"`, `"7d"`

**Pattern Negation Support:**
- All date patterns support `match:not:` prefix
- Perfect for validating dates should NOT be in certain ranges
- Useful for expired token detection, old file filtering

### 9. Cross-Field Validation (🆕 NEW!)

**NEW**: Validate relationships between fields in the same object! Perfect for business logic validation, temporal constraints, and data consistency checks.

```yaml
# Basic field comparisons (same level)
result:
  "match:crossField": "startDate < endDate"           # Date comparison
  "match:crossField": "minPrice <= maxPrice"          # Numeric comparison  
  "match:crossField": "currentStock > minStock"       # Greater than validation
  "match:crossField": "retailPrice = originalPrice"   # Equality check
  "match:crossField": "retries != maxRetries"         # Not equal validation

# Supported operators: < > <= >= = !=
result:
  "match:crossField": "discountPrice < originalPrice"  # Less than
  "match:crossField": "age >= minAge"                  # Greater than or equal
  "match:crossField": "accountBalance <= creditLimit"  # Less than or equal
  "match:crossField": "lastLogin > createdDate"        # Greater than (dates)

# Nested field paths using dot notation
result:
  "match:crossField": "event.startTime < event.endTime"              # Nested objects
  "match:crossField": "pricing.discount <= pricing.maxDiscount"      # Business rules
  "match:crossField": "user.age >= config.minimumAge"               # Configuration checks
  "match:crossField": "stats.memory.used <= stats.memory.allocated" # Deep nesting

# Real-world business validation examples
result:
  # Event management
  "match:crossField": "registrationStart < registrationEnd"
  "match:crossField": "minParticipants <= currentParticipants"
  "match:crossField": "currentParticipants <= maxParticipants"
  
  # Financial constraints
  "match:crossField": "transaction.amount <= account.balance"
  "match:crossField": "account.credit.used < account.credit.limit"
  "match:crossField": "creditScore >= minCreditScore"
  "match:crossField": "debtToIncomeRatio <= maxDebtToIncomeRatio"
  
  # Inventory management  
  "match:crossField": "stock.current >= stock.reserved"
  "match:crossField": "availableStock <= currentStock"
  "match:crossField": "nextDelivery > lastRestocked"
  "match:crossField": "inventory.total.units <= warehouse.capacity.maxUnits"
  
  # User permissions and access
  "match:crossField": "user.level >= access.required"
  "match:crossField": "user.role.priority >= resource.access.minPriority"
  "match:crossField": "user.profile.maxConnections <= config.system.connectionLimit"
  
  # Complex business rules
  "match:crossField": "order.items.total.price <= customer.account.creditLimit"
  "match:crossField": "order.shipping.estimatedDelivery > order.processing.completedDate"

# Negated cross-field validation
result:
  "match:not:crossField": "currentStock > maxStock"        # Should NOT exceed capacity
  "match:not:crossField": "event.startTime < event.endTime" # Should NOT have invalid time order
  "match:not:crossField": "used >= limit"                   # Should NOT exceed limits

# Combined with other patterns
result:
  "match:crossField": "metrics.performance.score >= metrics.baseline.minimum"
  status: "match:contains:active"
  dataPoints: "match:arrayLength:5"
  lastUpdated: "match:dateValid"
  owner: "match:type:string"
```

**Supported Data Types:**
- **Dates**: ISO strings (`2023-01-01T10:00:00Z`) and Unix timestamps
- **Numbers**: Integers and floating-point values (automatic type conversion)
- **Strings**: Lexicographical comparison for text fields

**Common Use Cases:**
- ✅ **Temporal Validation**: Event start/end times, validity periods
- ✅ **Business Rules**: Pricing constraints, discount limits, resource quotas
- ✅ **Data Integrity**: Ensuring consistent relationships between related fields
- ✅ **Range Validation**: Min/max values, thresholds, capacity limits

### 🆕 9a. Nested Cross-Field Validation

**NEW**: Use crossField patterns within nested object structures! This powerful feature allows you to validate field relationships inside nested objects, perfect for complex business rule validation and data integrity checks.

```yaml
# Nested crossField within pricing object structure
result:
  pricing:
    wholesale: "match:type:object"
    retail: "match:type:object"
    "match:crossField": "wholesale.price < retail.price"
  product: "match:type:object"

# Multiple nested crossField patterns in separate objects
result:
  match:partial:
    stock:
      current: "match:type:number"
      reserved: "match:type:number"
      minimum: "match:type:number"
      "match:crossField": "current >= reserved"
    warehouse:
      capacity:
        maxUnits: "match:type:number"
        currentUnits: "match:type:number"
        "match:crossField": "currentUnits < maxUnits"

# Nested event validation with multiple crossField patterns
result:
  event:
    name: "match:type:string"
    "match:crossField": "startTime < endTime"
    registration:
      "match:crossField": "start < end"
  status: "match:contains:active"

# Financial account validation with credit limits
result:
  match:partial:
    account:
      balance: "match:type:number"
      credit:
        used: "match:type:number"
        limit: "match:type:number"
        "match:crossField": "used <= limit"
    transaction:
      amount: "match:type:number"

# Deep nesting validation (4+ levels)
result:
  "match:crossField": "level1.level2.level3.level4.value > level1.level2.threshold"
  "match:crossField": "company.division.team.member.clearanceLevel >= project.security.requirements.minClearance"

# Negated nested crossField patterns
result:
  registration:
    id: "REG-789"
    capacity:
      "match:not:crossField": "current >= maximum"
      maximum: 100
      current: 85
      waitlist: 10
    status: "open"

# Field names with special characters (hyphens, underscores)
result:
  "match:crossField": "user-data.max-count > current-usage.active-count"
  "match:crossField": "config_settings.timeout_ms > retry_delay_ms"

# Mixed data types with automatic type conversion
result:
  "match:crossField": "config.performance.timeout > config.performance.retryDelay"  # String numbers
  "match:crossField": "schedule.meeting.startTime < schedule.meeting.endTime"       # Date strings

# Complex business rules across nested structures
result:
  "match:crossField": "order.items.total.price <= customer.account.creditLimit"
  "match:crossField": "order.shipping.estimatedDelivery > order.processing.completedDate"
  "match:crossField": "user.profile.maxConnections <= config.system.connectionLimit"
```

**Key Features:**
- ✅ **Nested Validation**: Validate relationships within specific object structures
- ✅ **Partial Match Compatible**: Works seamlessly with `match:partial` patterns
- ✅ **Multiple Patterns**: Use multiple nested crossField patterns in the same response
- ✅ **Negation Support**: Use `match:not:crossField` for negative validation
- ✅ **Dot Notation**: Access fields using standard dot notation within nested scope

**Real-world Examples:**
```yaml
# Event Management System
event:
  "match:crossField": "startDate < endDate"                    # Event timeframe
  "match:crossField": "registrationStart < registrationEnd"    # Registration period
  "match:crossField": "minParticipants <= currentParticipants" # Minimum attendance
  "match:crossField": "currentParticipants <= maxParticipants" # Capacity limits

# E-commerce Pricing Validation
pricing:
  "match:crossField": "discountPrice < originalPrice"          # Valid discount
  "match:crossField": "discountPrice >= minPrice"              # Above minimum
  "match:crossField": "wholesalePrice < retailPrice"           # Wholesale markup
  "match:crossField": "pricing.discount <= pricing.maxDiscount" # Discount limits

# Financial Transaction Processing
account:
  balances:
    "match:crossField": "available <= current"                 # Available funds
    current: 1000.00
    available: 950.00
    pending: 50.00
  credit:
    "match:crossField": "used <= limit"                        # Credit utilization
    used: 750.00
    limit: 2000.00

# User Account Management
user:
  "match:crossField": "age >= minAge"                          # Age verification
  "match:crossField": "lastLoginDate > accountCreatedDate"     # Login validation
  "match:crossField": "accountBalance <= creditLimit"          # Credit check
  profile:
    "match:crossField": "maxConnections <= config.system.connectionLimit" # System limits

# Inventory and Supply Chain
inventory:
  stock:
    "match:not:crossField": "current > maxCapacity"            # Prevent overstocking
    "match:crossField": "current >= reserved"                  # Reserved stock
    "match:crossField": "current > minimum"                    # Above minimum
    current: 250
    maxCapacity: 1000
    reserved: 25
    minimum: 50
  delivery:
    "match:crossField": "nextDelivery > lastRestocked"         # Delivery schedule

# Resource Usage and Performance
stats:
  "match:crossField": "used < limit"                           # Resource limits
  "match:crossField": "memory.used <= memory.allocated"        # Memory usage
  memory:
    used: 750
    allocated: 1024
    limit: 2048

# Complex Business Rules
order:
  "match:crossField": "items.total.price <= customer.account.creditLimit" # Payment validation
  "match:crossField": "shipping.estimatedDelivery > processing.completedDate" # Logistics
  items:
    total:
      price: 199.99
  shipping:
    estimatedDelivery: "2024-01-20T10:00:00Z"
  processing:
    completedDate: "2024-01-15T14:30:00Z"
```

**Best Practices:**
- ✅ **Production Ready**: Fully tested feature ready for production use
- ✅ **Clear Naming**: Use descriptive field names for better validation clarity
- ✅ **Combine with Types**: Use with `match:type` patterns for complete validation
- ✅ **Error Testing**: Test both positive and negative scenarios
- ✅ **YAML Structure**: Ensure proper YAML nesting and avoid duplicate keys

### 10. Partial Matching
```yaml
result:
  match:partial:
    tools:
      - name: "expected_tool"
        description: "match:contains:search"
    # Other fields ignored
```

### 11. Error Validation
```yaml
# Clean execution
stderr: "toBeEmpty"

# Error scenarios
result:
  isError: true
  content:
    - type: "text"
      text: "match:contains:not found"

# Stderr pattern matching
stderr: "match:contains:Warning"
```

### 11. Performance Testing with Timing Assertions
**NEW**: Add performance requirements to test cases! Perfect for ensuring MCP servers meet response time requirements and performance SLAs.

```yaml
# Basic performance assertion
- it: "should list tools within reasonable time"
  request:
    jsonrpc: "2.0"
    id: "perf-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "perf-1"
      result:
        tools: "match:type:array"
    performance:
      maxResponseTime: "500ms"  # Must respond within 500ms
    stderr: "toBeEmpty"

# Tool execution performance
- it: "should execute tool quickly"
  request:
    jsonrpc: "2.0"
    id: "perf-call-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "./data/small-file.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "perf-call-1"
      result:
        content:
          - type: "text"
            text: "match:type:string"
        isError: false
    performance:
      maxResponseTime: "1000ms"  # File operations within 1 second
    stderr: "toBeEmpty"

# Strict performance requirements
- it: "should handle initialization very quickly"
  request:
    jsonrpc: "2.0"
    id: "perf-init-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools: "match:arrayLength:1"
    performance:
      maxResponseTime: "200ms"  # Very strict requirement
    stderr: "toBeEmpty"

# Performance with pattern matching
- it: "should process complex data efficiently"
  request:
    jsonrpc: "2.0"
    id: "perf-complex-1"
    method: "tools/call"
    params:
      name: "search_docs"
      arguments:
        query: "performance testing"
  expect:
    response:
      result:
        match:partial:
          results: "match:type:array"
          count: "match:type:number"
    performance:
      maxResponseTime: "2000ms"  # Complex operations
    stderr: "toBeEmpty"
```

**Performance Assertion Format:**
- Use `ms` suffix for milliseconds: `"500ms"`, `"1000ms"`, `"2500ms"`
- Combine with any response validation pattern
- Works with all existing pattern matching features
- Test fails if response time exceeds the specified limit

**Common Performance Patterns:**
```yaml
# Tool listing (should be very fast)
performance:
  maxResponseTime: "300ms"

# Simple tool execution  
performance:
  maxResponseTime: "1000ms"

# Complex operations (file I/O, API calls)
performance:
  maxResponseTime: "2000ms"

# Database operations
performance:
  maxResponseTime: "3000ms"

# Very strict SLA requirements
performance:
  maxResponseTime: "100ms"
```

**Performance Testing Use Cases:**
- ✅ **SLA Validation**: Ensure servers meet performance requirements
- ✅ **Regression Detection**: Catch performance regressions in CI/CD
- ✅ **Load Testing**: Validate response times under different conditions
- ✅ **Quality Gates**: Block deployments if performance degrades
- ✅ **Monitoring**: Continuous performance validation in production

**View Performance Results:**
```bash
# See actual response times with --timing flag
conductor "tests/*.yml" --config config.json --timing

# Performance results show in output:
# ● should list tools within reasonable time ... ✓ PASS (23ms)
# ● should execute tool quickly ... ✓ PASS (156ms)
```

## CLI Options for Development

### Debug and Development Options
```bash
# Verbose - shows test hierarchy and results
conductor "tests/*.yml" --config config.json --verbose

# Debug - shows JSON-RPC communication  
conductor "tests/*.yml" --config config.json --debug

# Timing - performance analysis
conductor "tests/*.yml" --config config.json --timing

# Combined debugging
conductor "tests/*.yml" --config config.json --verbose --debug --timing
```

### Production and CI Options
```bash
# JSON output for automation
conductor "tests/*.yml" --config config.json --json

# Quiet mode (exit codes only)
conductor "tests/*.yml" --config config.json --quiet
```

### Error Reporting and Debugging Options
```bash
# Show only failed tests, hide passing tests
conductor "tests/*.yml" --config config.json --errors-only

# Focus on syntax errors and pattern suggestions
conductor "tests/*.yml" --config config.json --syntax-only

# Minimal error output without detailed analysis
conductor "tests/*.yml" --config config.json --no-analysis

# Group similar errors together to reduce repetition
conductor "tests/*.yml" --config config.json --group-errors

# Limit number of validation errors shown per test
conductor "tests/*.yml" --config config.json --max-errors 3

# Combine error reporting options for focused debugging
conductor "tests/*.yml" --config config.json --errors-only --group-errors --max-errors 2
```

### Interactive Tool Debugging with Query Command
**New Feature**: Test individual tools directly without creating YAML files:

```bash
# List all available tools from your server
conductor query --config conductor.config.json

# Test a specific tool with no arguments
conductor query [tool-name] --config conductor.config.json

# Test a tool with JSON arguments
conductor query [tool-name] '{"param": "value"}' --config conductor.config.json

# Get JSON output for scripting
conductor query [tool-name] '{"param": "value"}' --config conductor.config.json --json

# Quiet mode for scripts
conductor query [tool-name] --config conductor.config.json --quiet
```

**Query Command Benefits for AI Agents**:
- **Rapid Development**: Test tools immediately during development
- **Server Validation**: Verify server responses before writing comprehensive tests  
- **Tool Discovery**: Explore available tools and their parameters
- **Debugging**: Inspect exact responses and stderr output
- **Integration**: Use in development workflows and CI pipelines

**Example debugging workflow**:
```bash
# 1. Discover available tools
conductor query --config config.json

# 2. Test basic functionality  
conductor query read_file '{"path": "test.txt"}' --config config.json

# 3. Test error conditions
conductor query read_file '{"path": "nonexistent.txt"}' --config config.json

# 4. Create comprehensive YAML tests based on results
```

## 🚨 Critical YAML Anti-Patterns

### 1. Duplicate YAML Keys (Fatal Error)
```yaml
# ❌ FATAL - Duplicate keys overwrite each other
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]              # OVERWRITES previous line!
  match:extractField: "tools.*.name"
  match:extractField: "isError"     # Another duplicate!

# ✅ CORRECT - Separate validations into different tests
result:
  tools: "match:arrayLength:1"

# In separate test:
result:
  match:extractField: "tools.*.name"
  value:
    - "read_file"
```

### 2. Pattern Structure Confusion
```yaml
# ❌ WRONG - Mixing arrayElements with direct array
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # Structure conflict!

# ✅ CORRECT - Choose one approach
result:
  content:
    match:arrayElements:
      type: "text"
      text: "match:contains:data"
```

### 3. Response Structure Assumptions
```yaml
# ❌ WRONG - Assuming array when response is object  
result:
  content:
    match:arrayElements:  # But response is single object!
      type: "text"

# ✅ CORRECT - Match actual response structure
result:
  content:
    - type: "text"
      text: "match:contains:data"
```

## Pattern Development Workflow

### 1. Start with Debug Mode
```bash
conductor test.yml --config config.json --debug
```
This shows the actual JSON-RPC responses from your server.

### 2. Use Actual Response Structure
Copy the exact response structure from debug output, then replace values with patterns:

```yaml
# Start with exact match
result:
  tools:
    - name: "read_file"
      description: "Reads a file"

# Then add patterns incrementally  
result:
  tools:
    - name: "match:type:string"
      description: "match:contains:file"
```

### 3. Test Incrementally
- Begin with deep equality
- Add one pattern at a time
- Validate YAML syntax with linters
- Run tests after each change

## Real-World Examples

### Protocol Compliance Test
```yaml
- it: "should complete MCP handshake and list tools"
  request:
    jsonrpc: "2.0"
    id: "init-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "init-1"
      result:
        tools: "match:type:array"
    stderr: "toBeEmpty"
```

### Tool Execution with Validation
```yaml
- it: "should read file and return content"
  request:
    jsonrpc: "2.0"
    id: "read-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "read-1"
      result:
        content:
          - type: "text"
            text: "Hello, MCP Conductor!"
        isError: false
    stderr: "toBeEmpty"
```

### Error Handling Test
```yaml
- it: "should handle non-existent file gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "/non/existent/file.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "error-1"
      result:
        content:
          - type: "text"
            text: "match:contains:not found"
        isError: true
    stderr: "toBeEmpty"
```

### Advanced Pattern Example
```yaml
- it: "should have well-documented tools with proper schemas"
  request:
    jsonrpc: "2.0"
    id: "validation"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:regex:^[a-z][a-z0-9_]*$"      # snake_case validation
            description: "match:regex:.{20,}"           # Min 20 characters
            inputSchema:
              type: "match:type:string"
              properties: "match:type:object"
```

## Test Categories for AI Generation

### 1. Protocol Tests (Always Include)
- MCP handshake completion
- Tools list retrieval
- Unknown method handling

### 2. Tool Execution Tests (Per Tool)
- Valid parameter execution
- Missing required parameters
- Invalid parameter types
- Business logic validation

### 3. Error Handling Tests (Always Include)
- Unknown tool calls
- Malformed requests
- Server error responses

### 4. Edge Cases
- Boundary conditions
- Large payload handling
- Timeout scenarios

## Best Practices for AI Agents

### Configuration Detection
```javascript
// Detect from package.json
"command": detectRuntime(packageJson.engines),  // node, python, etc.
"args": [serverFile, ...requiredArgs],
"startupTimeout": estimateStartupTime(complexity)  // 5000ms default
```

### Pattern Selection Strategy
1. **Simple tools**: Use deep equality for predictable responses
2. **Dynamic content**: Use `match:contains:` for variable text
3. **Arrays**: Use `match:arrayLength:` for count validation
4. **Complex validation**: Use field extraction for specific checks
5. **Large responses**: Use regex with minimum length patterns

### Test Structure Template
```yaml
description: "Comprehensive test suite for {{SERVER_NAME}}"
tests:
  # Protocol compliance
  - it: "should list available tools"
    # ... tools/list test
  
  # Per-tool tests
  {{#each tools}}
  - it: "should execute {{name}} with valid parameters"
    # ... tools/call test with success case
  
  - it: "should handle {{name}} errors gracefully"
    # ... tools/call test with error case
  {{/each}}
  
  # Error scenarios
  - it: "should handle unknown tool calls"
    # ... unknown tool test
```

## Integration with Build Systems

### NPM Scripts
```json
{
  "scripts": {
    "test:mcp": "conductor 'tests/**/*.test.mcp.yml' --config './conductor.config.json'",
    "test:mcp:ci": "npm run test:mcp -- --json --quiet",
    "test:mcp:debug": "npm run test:mcp -- --verbose --debug --timing"
  }
}
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Test MCP Server
  run: |
    npm install -g mcp-conductor
    conductor "tests/**/*.test.mcp.yml" --config "config.json" --json > test-results.json
```

---

**Key Success Factors for YAML Testing:**
1. Always create configuration file first
2. Use debug mode to understand actual responses
3. Start with exact matches, then add patterns
4. Avoid duplicate YAML keys
5. Match actual response structure
6. Test incrementally
7. Include protocol, tool execution, and error tests
8. Use appropriate patterns for content type (static vs dynamic)
