import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import { Head } from 'vite-react-ssg';

const CrossFieldPatternsPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Cross-Field Patterns - MCP Conductor Pattern Matching</title>
                <meta name="description" content="Validate relationships between fields in the same object with cross-field patterns. Learn field-to-field comparisons, business rule validation, and nested object relationships for Model Context Protocol servers." />
                <meta name="keywords" content="MCP cross-field validation, field relationships MCP, cross field patterns, Model Context Protocol field comparison, business rules validation MCP, nested object validation" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Cross-Field Patterns - Field Relationship Validation" />
                <meta property="og:description" content="Learn cross-field validation patterns for MCP testing including field relationships, business rule validation, and complex object comparisons." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/pattern-matching/cross-field" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Cross-Field Patterns - Field Relationship Validation" />
                <meta name="twitter:description" content="Learn cross-field validation patterns for MCP testing including field relationships, business rule validation, and complex object comparisons." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/pattern-matching/cross-field" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>

            <H1 id="cross-field-patterns">Cross-Field Patterns</H1>
            <PageSubtitle>Validate relationships and comparisons between fields in the same object.</PageSubtitle>
            <p>Cross-field patterns enable sophisticated validation of field-to-field relationships within the same response object. Perfect for business rule validation, data consistency checks, and ensuring logical relationships between related data points.</p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Cross-Field Pattern Syntax</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Use <InlineCode>"match:crossField": "field1 operator field2"</InlineCode> to compare fields within the same object. Supports <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code>, <code>=</code>, and <code>!=</code> operators.</p>
                        </div>
                    </div>
                </div>
            </div>

            <H2 id="basic-cross-field-validation">Basic Cross-Field Validation</H2>
            <p>Cross-field patterns validate relationships between fields at the root level of your response object. These patterns are essential for ensuring data consistency and business rule compliance.</p>

            <H3 id="numeric-comparisons">Numeric Comparisons</H3>
            <CodeBlock language="yaml" code={`
# Basic numeric field comparisons
expect:
  response:
    result:
      # Price validation
      "match:crossField": "discountPrice < originalPrice"
      
      # Quantity validation  
      "match:crossField": "currentStock >= minStock"
      
      # Capacity validation
      "match:crossField": "currentParticipants <= maxParticipants"
      
      # Range validation
      "match:crossField": "minPrice <= maxPrice"
`} />

            <H3 id="date-time-comparisons">Date & Time Comparisons</H3>
            <CodeBlock language="yaml" code={`
# Date field relationships
expect:
  response:
    result:
      # Event timing
      "match:crossField": "startDate < endDate"
      
      # Registration periods
      "match:crossField": "registrationStart < registrationEnd"
      
      # Account history
      "match:crossField": "lastLoginDate > accountCreatedDate"
      
      # Delivery scheduling
      "match:crossField": "nextDelivery > lastRestocked"
`} />

            <H3 id="equality-inequality">Equality & Inequality</H3>
            <CodeBlock language="yaml" code={`
# Field equality and inequality checks
expect:
  response:
    result:
      # Equality validation
      "match:crossField": "retailPrice = originalPrice"
      
      # Inequality validation  
      "match:crossField": "discountPrice != originalPrice"
      
      # Threshold validation
      "match:crossField": "age >= minAge"
      
      # Limit validation
      "match:crossField": "accountBalance <= creditLimit"
`} />

            <H2 id="business-rule-validation">Business Rule Validation Examples</H2>
            <p>Real-world examples demonstrating how cross-field patterns validate complex business logic and data relationships.</p>

            <H3 id="event-management">Event Management</H3>
            <CodeBlock language="yaml" code={`
# Event timing and capacity validation
- it: "should validate event business rules"
  request:
    jsonrpc: "2.0"
    id: "event-validation"
    method: "tools/call"
    params:
      name: "get_event_data"
      arguments:
        eventId: "conference-2024"
  expect:
    response:
      jsonrpc: "2.0"
      id: "event-validation"
      result:
        # Event must end after it starts
        "match:crossField": "startDate < endDate"
        
        # Registration must close before event starts
        "match:crossField": "registrationEnd < startDate"
        
        # Current participants within limits
        "match:crossField": "currentParticipants <= maxParticipants"
        
        # Minimum viable participant count
        "match:crossField": "minParticipants <= currentParticipants"
`} />

            <H3 id="financial-validation">Financial Validation</H3>
            <CodeBlock language="yaml" code={`
# Financial business rules and constraints
- it: "should validate financial transaction rules"
  request:
    jsonrpc: "2.0" 
    id: "financial-check"
    method: "tools/call"
    params:
      name: "get_transaction_data"
      arguments:
        accountId: "acc-12345"
  expect:
    response:
      jsonrpc: "2.0"
      id: "financial-check"
      result:
        # Transaction amount within limits
        "match:crossField": "amount >= minAmount"
        
        # Credit requirements
        "match:crossField": "creditScore >= minCreditScore"
        
        # Debt-to-income ratio compliance
        "match:crossField": "debtToIncomeRatio <= maxDebtToIncomeRatio"
        
        # Net amount calculation
        "match:crossField": "netAmount < amount"
`} />

            <H3 id="inventory-management">Inventory Management</H3>
            <CodeBlock language="yaml" code={`
# Inventory and stock management validation
- it: "should validate inventory business rules"
  request:
    jsonrpc: "2.0"
    id: "inventory-check"
    method: "tools/call"
    params:
      name: "get_inventory_status"
      arguments:
        productId: "prod-789"
  expect:
    response:
      jsonrpc: "2.0"
      id: "inventory-check"
      result:
        # Stock level validation
        "match:crossField": "currentStock > minStock"
        
        # Available stock calculation
        "match:crossField": "availableStock <= currentStock"
        
        # Delivery scheduling
        "match:crossField": "nextDelivery > lastRestocked"
        
        # Warehouse capacity
        "match:crossField": "currentStock <= maxCapacity"
`} />

            <H2 id="nested-object-validation">Nested Object Validation</H2>
            <p>Cross-field patterns support <strong>dot notation</strong> for validating relationships between fields in nested objects, enabling complex structural validation.</p>

            <H3 id="nested-syntax">Nested Field Syntax</H3>
            <p>Use dot notation to access nested fields: <InlineCode>object.field</InlineCode>, <InlineCode>parent.child.grandchild</InlineCode></p>
            <CodeBlock language="yaml" code={`
# Nested object field comparisons
expect:
  response:
    result:
      # Event object validation
      "match:crossField": "event.startTime < event.endTime"
      
      # Pricing object validation
      "match:crossField": "pricing.discount <= pricing.maxDiscount"
      
      # User configuration validation
      "match:crossField": "user.age >= config.minimumAge"
      
      # Deep nested validation
      "match:crossField": "user.profile.maxConnections <= config.system.connectionLimit"
`} />

            <H3 id="complex-nested-examples">Complex Nested Examples</H3>
            <CodeBlock language="yaml" code={`
# Advanced nested object validation
- it: "should validate complex nested object relationships"
  request:
    jsonrpc: "2.0"
    id: "nested-validation"
    method: "tools/call"
    params:
      name: "get_complex_data"
  expect:
    response:
      jsonrpc: "2.0"
      id: "nested-validation"
      result:
        # Multi-level pricing validation
        "match:crossField": "pricing.wholesale.price < pricing.retail.price"
        
        # Resource usage validation
        "match:crossField": "stats.memory.used <= stats.memory.allocated"
        
        # Permission hierarchy validation
        "match:crossField": "user.level >= access.required"
        
        # Deep organizational structure
        "match:crossField": "company.division.team.member.clearanceLevel >= project.security.requirements.minClearance"
`} />

            <H3 id="financial-nested">Financial Nested Validation</H3>
            <CodeBlock language="yaml" code={`
# Complex financial object validation
- it: "should validate nested financial structures"
  expect:
    response:
      result:
        # Account balance validation
        "match:crossField": "transaction.amount <= account.balance"
        
        # Credit limit validation
        "match:crossField": "account.credit.used < account.credit.limit"
        
        # Order processing validation
        "match:crossField": "order.items.total.price <= customer.account.creditLimit"
        
        # Shipping timeline validation
        "match:crossField": "order.shipping.estimatedDelivery > order.processing.completedDate"
`} />

            <H2 id="mixed-data-types">Mixed Data Types</H2>
            <p>Cross-field patterns automatically handle type conversion for common scenarios, enabling flexible validation across different data types.</p>

            <H3 id="string-number-conversion">String-Number Conversion</H3>
            <CodeBlock language="yaml" code={`
# Automatic type conversion for numeric strings
expect:
  response:
    result:
      # String numbers compared as numbers
      "match:crossField": "config.performance.timeout > config.performance.retryDelay"
      
      # Mixed string/number comparison
      timeout: "5000"      # String
      maxTimeout: 10000    # Number
      "match:crossField": "timeout < maxTimeout"    # Converts "5000" to 5000
`} />

            <H3 id="date-string-handling">Date String Handling</H3>
            <CodeBlock language="yaml" code={`
# Date string comparisons
expect:
  response:
    result:
      # ISO date string comparison
      "match:crossField": "schedule.meeting.startTime < schedule.meeting.endTime"
      
      # Date strings with time zones
      startDate: "2024-03-15T09:00:00Z"
      endDate: "2024-03-15T17:00:00Z"
      "match:crossField": "startDate < endDate"
`} />

            <H2 id="special-field-names">Special Field Names</H2>
            <p>Cross-field patterns support field names with hyphens, underscores, and other special characters common in API responses.</p>

            <CodeBlock language="yaml" code={`
# Field names with special characters
expect:
  response:
    result:
      # Hyphenated field names
      "match:crossField": "user-data.max-count > current-usage.active-count"
      
      # Underscore field names
      "match:crossField": "max_concurrent_users >= current_active_sessions"
      
      # Mixed naming conventions
      "match:crossField": "apiResponse.max-timeout > currentRequest.retry_delay"
`} />

            <H2 id="combining-patterns">Combining with Other Patterns</H2>
            <p>Cross-field patterns work seamlessly with other MCP Conductor patterns for comprehensive validation scenarios.</p>

            <CodeBlock language="yaml" code={`
# Combine cross-field with other patterns
expect:
  response:
    result:
      # Cross-field validation
      "match:crossField": "metrics.performance.score >= metrics.baseline.minimum"
      
      # Combined with other pattern types
      status: "match:contains:active"           # String pattern
      dataPoints: "match:arrayLength:5"         # Array pattern
      lastUpdated: "match:dateValid"            # Date pattern
      errorRate: "match:between:0:5"            # Numeric pattern
      
      # Type validation alongside cross-field
      score: "match:type:number"
      baseline: "match:type:object"
`} />

            <H2 id="common-use-cases">Common Use Cases</H2>

            <H3 id="validation-scenarios">Validation Scenarios</H3>
            <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Time Range Validation:</strong> Ensure start times are before end times</li>
                <li><strong>Capacity Management:</strong> Validate current usage against limits</li>
                <li><strong>Financial Compliance:</strong> Check transaction amounts against account balances</li>
                <li><strong>Pricing Logic:</strong> Ensure discounted prices are less than original prices</li>
                <li><strong>Permission Hierarchies:</strong> Validate user levels meet access requirements</li>
                <li><strong>Resource Allocation:</strong> Check allocated resources don't exceed available capacity</li>
                <li><strong>Data Consistency:</strong> Ensure related fields maintain logical relationships</li>
                <li><strong>Business Rules:</strong> Validate complex multi-field business constraints</li>
            </ul>

            <H3 id="best-practices">Best Practices</H3>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-6">
                <h4 className="font-semibold text-gray-800 mb-2">Cross-Field Pattern Guidelines</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li><strong>Field Names:</strong> Use exact field names as they appear in the response</li>
                    <li><strong>Operators:</strong> Supported operators are <InlineCode>&lt;</InlineCode>, <InlineCode>&lt;=</InlineCode>, <InlineCode>&gt;</InlineCode>, <InlineCode>&gt;=</InlineCode>, <InlineCode>=</InlineCode>, <InlineCode>!=</InlineCode></li>
                    <li><strong>Data Types:</strong> Automatic conversion for strings containing numbers and dates</li>
                    <li><strong>Nested Fields:</strong> Use dot notation for accessing nested object properties</li>
                    <li><strong>Error Handling:</strong> Missing fields will cause validation failure with clear error messages</li>
                    <li><strong>Combination:</strong> Combine with other patterns for comprehensive validation</li>
                </ul>
            </div>

            <H2 id="troubleshooting">Troubleshooting</H2>

            <H3 id="common-errors">Common Errors</H3>
            <CodeBlock language="text" code={`
# Field not found error
Error: Field 'nonexistentField' not found in object for cross-field comparison

# Type conversion error  
Error: Cannot compare field 'description' (string) with field 'count' (number)

# Invalid operator error
Error: Invalid operator '~=' in cross-field pattern. Supported: <, <=, >, >=, =, !=

# Nested field access error
Error: Cannot access nested field 'user.profile.age' - intermediate object 'profile' is null
`} />

            <H3 id="debugging-tips">Debugging Tips</H3>
            <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Use <InlineCode>--debug</InlineCode> flag to see the actual values being compared</li>
                <li>Verify field names match exactly (case-sensitive)</li>
                <li>Check that both fields exist in the response object</li>
                <li>Ensure nested field paths are valid (no null intermediate objects)</li>
                <li>Confirm data types are compatible for comparison</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Production Ready</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>Cross-field patterns are extensively tested and production-ready for validating complex business rules and data relationships in MCP server responses.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrossFieldPatternsPage;
