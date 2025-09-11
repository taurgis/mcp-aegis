
import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const PatternMatchingPage: React.FC = () => {
    useSEO({
        title: 'Pattern Matching Reference - MCP Conductor',
        description: 'Complete reference for 30+ advanced pattern matching capabilities in MCP Conductor. Production-verified patterns for flexible Model Context Protocol server validation including exact numeric equality, floating-point tolerance, decimal precision validation, comprehensive date/timestamp validation, and cross-field relationship validation.',
        keywords: 'MCP pattern matching reference, MCP Conductor patterns, Model Context Protocol pattern matching, MCP validation patterns, production verified MCP patterns',
        canonical: 'https://conductor.rhino-inquisitor.com/#/pattern-matching/overview',
        ogTitle: 'MCP Conductor Pattern Matching Reference - Advanced MCP Validation',
        ogDescription: 'Complete reference for advanced pattern matching in MCP Conductor. 30+ production-verified patterns for flexible Model Context Protocol validation including exact numeric equality, floating-point tolerance, decimal precision validation, comprehensive date/timestamp validation, and cross-field relationship validation.',
        ogUrl: 'https://conductor.rhino-inquisitor.com/pattern-matching/overview'
    });

    return (
        <>
            <H1 id="pattern-matching-reference">Pattern Matching Reference</H1>
            <PageSubtitle>Advanced MCP Server Validation Patterns</PageSubtitle>
            <p>MCP Conductor provides 30+ advanced pattern matching capabilities for flexible and powerful Model Context Protocol test validation. All core patterns have been verified with production MCP servers.</p>

            <H2 id="production-verified-patterns">🏆 Production Verified Patterns</H2>
            <p>The following patterns have been extensively tested with real-world MCP servers and are <strong>production-ready</strong>:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>✅ <strong>Deep Equality</strong> - Exact value matching</li>
                <li>✅ <strong>Type Validation</strong> - Data type checking (<InlineCode>string</InlineCode>, <InlineCode>number</InlineCode>, <InlineCode>object</InlineCode>, <InlineCode>array</InlineCode>, etc.)</li>
                <li>✅ <strong>Array Length</strong> - Exact element count validation  </li>
                <li>✅ <strong>Array Elements</strong> - Pattern matching for all array elements</li>
                <li>✅ <strong>Array Contains</strong> - Check if array contains specific values (with field support)</li>
                <li>✅ <strong>Field Extraction</strong> - Extract and validate specific field values</li>
                <li>✅ <strong>Partial Matching</strong> - Validate only specified object fields</li>
                <li>✅ <strong>String Contains</strong> - Substring matching</li>
                <li>✅ <strong>String Starts With</strong> - Prefix matching</li>
                <li>✅ <strong>String Ends With</strong> - Suffix matching</li>
                <li>✅ <strong>Regex Matching</strong> - Full regular expression support</li>
                <li>✅ <strong>Object Count</strong> - Property counting</li>
                <li>✅ <strong>Field Exists</strong> - Field presence validation</li>
                <li>🆕 <strong>Numeric Comparisons</strong> - Greater than, less than, between, range, exact equality, floating-point tolerance, modular arithmetic validations</li>
                <li>🆕 <strong>Date/Timestamp Validation</strong> - Date validity, age checking, format validation, temporal comparisons</li>
                <li>🆕 <strong>Cross-Field Validation</strong> - Validate relationships between fields in the same object</li>
                <li>🆕 <strong>Case-Insensitive Matching</strong> - Contains and equals ignoring case</li>
                <li>🆕 <strong>Pattern Negation</strong> - Negate any pattern with <InlineCode>match:not:</InlineCode></li>
            </ul>

            <H2 id="pattern-types-overview">Pattern Types Overview</H2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3 border border-gray-300 font-semibold w-1/5">Pattern Type</th>
                            <th className="text-left p-3 border border-gray-300 font-semibold w-1/4">Syntax</th>
                            <th className="text-left p-3 border border-gray-300 font-semibold w-2/5">Description</th>
                            <th className="text-left p-3 border border-gray-300 font-semibold w-1/8">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Deep Equality</strong></td><td className="p-3 border border-gray-300"><InlineCode>value</InlineCode></td><td className="p-3 border border-gray-300">Exact match (default)</td><td className="p-3 border border-gray-300">✅ Core</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Type Validation</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:type:TYPE"</InlineCode></td><td className="p-3 border border-gray-300">Validates data type</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>String Contains</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:contains:..."</InlineCode></td><td className="p-3 border border-gray-300">String contains substring</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>String Starts With</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:startsWith:..."</InlineCode></td><td className="p-3 border border-gray-300">String starts with prefix</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>String Ends With</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:endsWith:..."</InlineCode></td><td className="p-3 border border-gray-300">String ends with suffix</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Regex Match</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:regex:..."</InlineCode></td><td className="p-3 border border-gray-300">Regular expression match</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Array Length</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:arrayLength:N"</InlineCode></td><td className="p-3 border border-gray-300">Array has exactly N elements</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Array Elements</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:arrayElements:"</InlineCode></td><td className="p-3 border border-gray-300">All elements match pattern</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Array Contains</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:arrayContains:..."</InlineCode></td><td className="p-3 border border-gray-300">Array contains specific value</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Field Extraction</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:extractField:..."</InlineCode></td><td className="p-3 border border-gray-300">Extract field values (supports dot & bracket notation)</td><td className="p-3 border border-gray-300">✅ Enhanced</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Partial Match</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:partial:"</InlineCode></td><td className="p-3 border border-gray-300">Partial object matching</td><td className="p-3 border border-gray-300">✅ Verified</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Object Count</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:count:N"</InlineCode></td><td className="p-3 border border-gray-300">Count object properties</td><td className="p-3 border border-gray-300">✅ Tested</td></tr>
                        <tr className="border-b"><td className="p-3 border border-gray-300"><strong>Field Exists</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:exists"</InlineCode></td><td className="p-3 border border-gray-300">Field exists validation</td><td className="p-3 border border-gray-300">✅ Tested</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Greater Than</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:greaterThan:N"</InlineCode></td><td className="p-3 border border-gray-300">Value &gt; N</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Less Than</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:lessThan:N"</InlineCode></td><td className="p-3 border border-gray-300">Value &lt; N</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Greater/Equal</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:greaterThanOrEqual:N"</InlineCode></td><td className="p-3 border border-gray-300">Value &gt;= N</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Less/Equal</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:lessThanOrEqual:N"</InlineCode></td><td className="p-3 border border-gray-300">Value &lt;= N</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Between</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:between:MIN:MAX"</InlineCode></td><td className="p-3 border border-gray-300">MIN &lt;= Value &lt;= MAX</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Range</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:range:MIN:MAX"</InlineCode></td><td className="p-3 border border-gray-300">Alias for between</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Equals</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:equals:N"</InlineCode></td><td className="p-3 border border-gray-300">Exact numeric equality</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Not Equals</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:notEquals:N"</InlineCode></td><td className="p-3 border border-gray-300">Numeric inequality</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Approximately</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:approximately:VAL:TOL"</InlineCode></td><td className="p-3 border border-gray-300">Floating-point tolerance (VAL ± TOL)</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Multiple Of</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:multipleOf:N"</InlineCode></td><td className="p-3 border border-gray-300">Must be multiple of N</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Divisible By</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:divisibleBy:N"</InlineCode></td><td className="p-3 border border-gray-300">Must be divisible by N</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-blue-50"><td className="p-3 border border-gray-300"><strong>Decimal Places</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:decimalPlaces:N"</InlineCode></td><td className="p-3 border border-gray-300">Must have exactly N decimal places</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-purple-50"><td className="p-3 border border-gray-300"><strong>Date Valid</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:dateValid"</InlineCode></td><td className="p-3 border border-gray-300">Valid date/timestamp</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-purple-50"><td className="p-3 border border-gray-300"><strong>Date After</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:dateAfter:DATE"</InlineCode></td><td className="p-3 border border-gray-300">Date after specified date</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-purple-50"><td className="p-3 border border-gray-300"><strong>Date Before</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:dateBefore:DATE"</InlineCode></td><td className="p-3 border border-gray-300">Date before specified date</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-purple-50"><td className="p-3 border border-gray-300"><strong>Date Between</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:dateBetween:START:END"</InlineCode></td><td className="p-3 border border-gray-300">Date within range</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-purple-50"><td className="p-3 border border-gray-300"><strong>Date Age</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:dateAge:DURATION"</InlineCode></td><td className="p-3 border border-gray-300">Date within age limit (1d, 2h, 30m)</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-purple-50"><td className="p-3 border border-gray-300"><strong>Date Equals</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:dateEquals:DATE"</InlineCode></td><td className="p-3 border border-gray-300">Exact date match</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-purple-50"><td className="p-3 border border-gray-300"><strong>Date Format</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:dateFormat:FORMAT"</InlineCode></td><td className="p-3 border border-gray-300">Validate date format (iso, iso-date, us-date, etc.)</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-yellow-50"><td className="p-3 border border-gray-300"><strong>Cross-Field</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:crossField:CONDITION"</InlineCode></td><td className="p-3 border border-gray-300">Validate relationships between fields (&lt;, &gt;, &lt;=, &gt;=, =, !=)</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-green-50"><td className="p-3 border border-gray-300"><strong>Case-Insensitive Contains</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:containsIgnoreCase:..."</InlineCode></td><td className="p-3 border border-gray-300">String contains substring (case-insensitive)</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-green-50"><td className="p-3 border border-gray-300"><strong>Case-Insensitive Equals</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:equalsIgnoreCase:..."</InlineCode></td><td className="p-3 border border-gray-300">String equals value (case-insensitive)</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                        <tr className="border-b bg-green-50"><td className="p-3 border border-gray-300"><strong>Pattern Negation</strong></td><td className="p-3 border border-gray-300"><InlineCode>"match:not:PATTERN"</InlineCode></td><td className="p-3 border border-gray-300">Negate any pattern (NEW!)</td><td className="p-3 border border-gray-300">🆕 NEW</td></tr>
                    </tbody>
                </table>
            </div>
            <p className="mt-4"><strong>Legend:</strong></p>
            <ul className="list-disc pl-6">
                <li>✅ <strong>Verified</strong>: Tested with production MCP servers</li>
                <li>✅ <strong>Core</strong>: Fundamental pattern matching</li>
            </ul>

            <H2 id="basic-patterns">Basic Patterns</H2>
            <H3 id="deep-equality">Deep Equality (Default)</H3>
            <p>The simplest pattern - values must match exactly:</p>
            <CodeBlock language="yaml" code={`
result:
  status: "success"           # Must be exactly "success"
  count: 42                   # Must be exactly 42
  active: true                # Must be exactly true
  tools:
    - name: "calculator"      # Exact array structure required
      description: "Math operations"
            `} />

            <H3 id="type-validation">Type Validation</H3>
            <p>Validates data types without checking specific values:</p>
            <CodeBlock language="yaml" code={`
result:
  serverInfo: "match:type:object"    # Must be object
  tools: "match:type:array"          # Must be array
  count: "match:type:number"         # Must be number
  active: "match:type:boolean"       # Must be boolean
  message: "match:type:string"       # Must be string
  nullable: "match:type:null"        # Must be null
            `} />
            <p><strong>Supported Types:</strong> <InlineCode>string</InlineCode>, <InlineCode>number</InlineCode>, <InlineCode>boolean</InlineCode>, <InlineCode>object</InlineCode>, <InlineCode>array</InlineCode>, <InlineCode>null</InlineCode></p>
            <p><strong>Important Note for Arrays:</strong> The <InlineCode>match:type:array</InlineCode> pattern correctly uses <InlineCode>Array.isArray()</InlineCode> for validation, as JavaScript arrays have <InlineCode>typeof array === "object"</InlineCode>. This ensures reliable array type detection.</p>

            <H3 id="numeric-patterns">🆕 Numeric Comparison Patterns</H3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <p className="font-semibold">🎯 NEW: Comprehensive Numeric Validation</p>
                <p>MCP Conductor now supports 6 numeric comparison patterns for testing numeric responses, scores, counts, percentages, and ranges.</p>
            </div>
            
            <p>Perfect for validating numeric data from MCP servers including API response times, success rates, user scores, inventory counts, and performance metrics:</p>
            
            <CodeBlock language="yaml" code={`
result:
  # Basic comparisons
  score: "match:greaterThan:85"          # Score must be > 85
  count: "match:lessThan:100"            # Count must be < 100 
  percentage: "match:greaterThanOrEqual:95"  # Percentage must be >= 95
  rating: "match:lessThanOrEqual:5"      # Rating must be <= 5

  # Range validations
  temperature: "match:between:20:30"     # Temperature between 20-30 (inclusive)
  port: "match:range:8000:9000"         # Port in range 8000-9000 (inclusive)

  # With pattern negation
  value: "match:not:greaterThan:1000"    # Value should NOT be > 1000
  error_count: "match:not:greaterThan:0" # Should have no errors (0 or negative)
  score: "match:not:between:0:50"        # Score should NOT be in failing range

  # Real-world examples
  api_response_time: "match:lessThan:500"        # Response time < 500ms
  success_rate: "match:greaterThanOrEqual:99"    # Success rate >= 99%
  error_rate: "match:lessThanOrEqual:1"          # Error rate <= 1%
  load_balance: "match:between:40:60"            # Load between 40-60%
            `} />
            
            <p><strong>Available Numeric Patterns:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>greaterThan:N</InlineCode> - Value must be &gt; N</li>
                <li><InlineCode>lessThan:N</InlineCode> - Value must be &lt; N</li>
                <li><InlineCode>greaterThanOrEqual:N</InlineCode> - Value must be &gt;= N</li>
                <li><InlineCode>lessThanOrEqual:N</InlineCode> - Value must be &lt;= N</li>
                <li><InlineCode>between:MIN:MAX</InlineCode> - Value must be between MIN and MAX (inclusive)</li>
                <li><InlineCode>range:MIN:MAX</InlineCode> - Alias for between (inclusive range)</li>
            </ul>

            <p><strong>Common Use Cases:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Performance Testing:</strong> Response times, memory usage, CPU utilization</li>
                <li><strong>Business Logic:</strong> User scores, discount ranges, inventory levels</li>
                <li><strong>Quality Metrics:</strong> Error rates, uptime percentages, accuracy scores</li>
                <li><strong>Range Validation:</strong> Valid input ranges, configuration limits</li>
            </ul>

            <H3 id="pattern-negation">🆕 Pattern Negation with <InlineCode>match:not:</InlineCode></H3>
            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
                <p className="font-semibold">🎉 NEW: Universal Pattern Negation</p>
                <p>Negate ANY existing pattern by prefixing with <InlineCode>not:</InlineCode>. Perfect for testing that values do NOT match specific criteria!</p>
            </div>
            
            <p>The <InlineCode>match:not:</InlineCode> prefix works with ALL existing pattern types to verify values do NOT match specific criteria:</p>
            
            <CodeBlock language="yaml" code={`
result:
  # Basic negation patterns
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
            `} />

            <p><strong>Supported Negation Patterns:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>match:not:contains:text</InlineCode> - String should NOT contain text</li>
                <li><InlineCode>match:not:startsWith:prefix</InlineCode> - String should NOT start with prefix</li>
                <li><InlineCode>match:not:endsWith:suffix</InlineCode> - String should NOT end with suffix</li>
                <li><InlineCode>match:not:type:string</InlineCode> - Should NOT be specified type</li>
                <li><InlineCode>match:not:arrayLength:N</InlineCode> - Array should NOT have N elements</li>
                <li><InlineCode>match:not:arrayContains:value</InlineCode> - Array should NOT contain value</li>
                <li><InlineCode>match:not:regex:pattern</InlineCode> - Should NOT match regex</li>
                <li><InlineCode>match:not:exists</InlineCode> - Field should NOT exist</li>
                <li><InlineCode>match:not:count:N</InlineCode> - Should NOT have N properties</li>
            </ul>

            <h4 id="negation-use-cases" className="mt-6 mb-2 text-lg font-bold tracking-tight text-slate-900">Common Use Cases for Pattern Negation</h4>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Error Prevention</strong>: Ensure responses don't contain error messages</li>
                <li><strong>Security Validation</strong>: Verify sensitive data is not exposed</li>
                <li><strong>Tool Filtering</strong>: Confirm deprecated/invalid tools are not present</li>
                <li><strong>Quality Assurance</strong>: Check that unwanted patterns are absent</li>
                <li><strong>Regression Testing</strong>: Ensure known problems don't reappear</li>
            </ul>

            <H2 id="detailed-pattern-guides">Detailed Pattern Guides</H2>
            <p>For comprehensive examples and usage patterns, visit our detailed guides:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="border border-gray-300 rounded-lg p-4">
                    <h4 className="font-semibold mb-2"><a href="#/pattern-matching/basic" className="text-blue-600 hover:text-blue-800">Basic Patterns</a></h4>
                    <p className="text-sm text-gray-600">Deep equality, type validation, and existence checks with production examples.</p>
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                    <h4 className="font-semibold mb-2"><a href="#/pattern-matching/string" className="text-blue-600 hover:text-blue-800">String Patterns</a></h4>
                    <p className="text-sm text-gray-600">Contains, starts with, ends with patterns for flexible text validation.</p>
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                    <h4 className="font-semibold mb-2"><a href="#/pattern-matching/regex" className="text-blue-600 hover:text-blue-800">Regex Patterns</a></h4>
                    <p className="text-sm text-gray-600">Full regular expression support including multiline-safe minimum length validation for substantial content.</p>
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                    <h4 className="font-semibold mb-2"><a href="#/pattern-matching/array" className="text-blue-600 hover:text-blue-800">Array Patterns</a></h4>
                    <p className="text-sm text-gray-600">Length validation, element patterns, and contains checks.</p>
                </div>
                <div className="border border-gray-300 rounded-lg p-4">
                    <h4 className="font-semibold mb-2"><a href="#/pattern-matching/object-field" className="text-blue-600 hover:text-blue-800">Object & Field Patterns</a></h4>
                    <p className="text-sm text-gray-600">Partial matching, field extraction, and property counting.</p>
                </div>
                <div className="border border-blue-300 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold mb-2 text-blue-800">🆕 Numeric Patterns</h4>
                    <p className="text-sm text-blue-700">NEW: Greater than, less than, between, range patterns for numeric validation!</p>
                </div>
                <div className="border border-purple-300 rounded-lg p-4 bg-purple-50">
                    <h4 className="font-semibold mb-2 text-purple-800">🆕 Date Patterns</h4>
                    <p className="text-sm text-purple-700">NEW: Date validation, age checking, format validation, and temporal comparisons!</p>
                </div>
                <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                    <h4 className="font-semibold mb-2 text-green-800">🆕 Pattern Negation</h4>
                    <p className="text-sm text-green-700">NEW: Negate any pattern with <InlineCode>match:not:</InlineCode> for advanced validation!</p>
                </div>
            </div>

            <H2 id="pattern-examples">Quick Examples</H2>
            <H3 id="array-validation">Array Validation</H3>
            <CodeBlock language="yaml" code={`
result:
  # Exactly 1 tool
  tools: "match:arrayLength:1"
  
  # All tools must have these fields
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
      
  # Array contains specific value
  toolNames: "match:arrayContains:calculator"
            `} />
            
            <H3 id="field-extraction">Field Extraction</H3>
            <CodeBlock language="yaml" code={`
# Extract tool names from array (dot notation)
result:
  match:extractField: "tools.*.name"   # Extract 'name' from all tools
  value:
    - "calculator"
    - "text_processor"

# NEW: Extract specific element by index (bracket notation)
result:
  match:extractField: "tools[5].name"  # Extract 6th tool name (0-indexed)  
  value: "search_docs"

# NEW: Mixed bracket and dot notation
result:
  match:extractField: "tools[0].inputSchema.properties"
  value: "match:type:object"
    - "calculator"
    - "text_processor"
            `} />

            <H3 id="string-patterns">String Patterns</H3>
            <CodeBlock language="yaml" code={`
result:
  message: "match:contains:success"     # Contains substring
  filename: "match:startsWith:data_"    # Starts with prefix
  extension: "match:endsWith:.json"     # Ends with suffix
  version: "match:regex:v\\d+\\.\\d+\\.\\d+"  # Semantic version pattern
            `} />

            <H3 id="partial-matching">Partial Matching</H3>
            <CodeBlock language="yaml" code={`
# Only validate specified fields, ignore others
result:
  match:partial:
    status: "success"
    tools: "match:type:array"
  # Other fields in result are ignored
            `} />

            <H3 id="date-pattern-examples">🆕 Date Pattern Examples</H3>
            <CodeBlock language="yaml" code={`
result:
  # Date validity checking
  createdAt: "match:dateValid"                  # Must be valid date
  invalidDate: "match:not:dateValid"            # Must be invalid
  
  # Date comparisons
  publishDate: "match:dateAfter:2023-01-01"     # After Jan 1, 2023
  expireDate: "match:dateBefore:2025-12-31"     # Before Dec 31, 2025
  eventDate: "match:dateBetween:2023-01-01:2024-12-31"  # Within 2023-2024
  
  # Age validation (recent timestamps)
  lastUpdate: "match:dateAge:1d"                # Within last day
  recentActivity: "match:dateAge:2h"            # Within last 2 hours
  oldBackup: "match:not:dateAge:7d"             # NOT within last week
  
  # Format validation
  isoTimestamp: "match:dateFormat:iso"          # ISO 8601 format
  dateString: "match:dateFormat:iso-date"       # YYYY-MM-DD format
  usDate: "match:dateFormat:us-date"            # MM/DD/YYYY format
            `} />

            <H3 id="cross-field-validation-examples">🆕 Cross-Field Validation Examples</H3>
            <CodeBlock language="yaml" code={`
result:
  # Basic field comparisons  
  match:crossField: "startDate < endDate"      # Date comparison
  match:crossField: "minPrice <= maxPrice"     # Numeric comparison
  match:crossField: "priority > threshold"     # Greater than validation
  
  # Supported operators: < > <= >= = !=
  match:crossField: "created = updated"        # Equality check
  match:crossField: "retries != maxRetries"    # Not equal validation
  match:crossField: "current >= minimum"       # Greater than or equal
  
  # Nested field paths using dot notation
  match:crossField: "event.startTime < event.endTime"              # Nested objects
  match:crossField: "pricing.discount <= pricing.maxDiscount"      # Business rules  
  match:crossField: "user.age >= config.minimumAge"               # Configuration checks
  match:crossField: "stats.used < stats.limit"                    # Resource limits
  
  # Common validation scenarios
  match:crossField: "registration.start < registration.end"        # Event scheduling
  match:crossField: "transaction.amount <= account.balance"        # Financial constraints
  match:crossField: "stock.current >= stock.reserved"             # Inventory management
  match:crossField: "user.level >= access.required"               # User permissions
  match:crossField: "validity.from <= validity.to"                # Date ranges
            `} />

            <H3 id="pattern-negation-examples">🆕 Pattern Negation Examples</H3>
            <CodeBlock language="yaml" code={`
result:
  # Ensure tools array is not empty
  tools: "match:not:arrayLength:0"
  
  # Ensure no tool names start with "invalid_"  
  match:extractField: "tools.*.name"
  value: "match:not:arrayContains:invalid_tool"
  
  # Ensure error messages are not present
  message: "match:not:contains:error"
  status: "match:not:startsWith:ERROR:"
  
  # Ensure data is not a string (should be object/array)
  data: "match:not:type:string"
            `} />

            <H2 id="pattern-development-tips">Pattern Development Tips</H2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="font-semibold">🚨 Critical Pattern Development Guidelines</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li><strong>Always start with --debug</strong>: Check actual MCP response structure before writing patterns</li>
                    <li><strong>One pattern type per test</strong>: Don't mix multiple complex patterns in single validation</li>
                    <li><strong>Test incrementally</strong>: Start with deep equality, then add pattern complexity</li>
                    <li><strong>Validate YAML syntax</strong>: Use YAML linters before testing patterns</li>
                    <li><strong>Separate complex validations</strong>: Multiple simple tests &gt; one complex test</li>
                    <li><strong>Check field paths</strong>: Verify dot notation paths are correct</li>
                    <li><strong>Match actual structure</strong>: Don't assume arrays vs objects without verification</li>
                </ol>
            </div>

            <H2 id="common-patterns">Common MCP Testing Patterns</H2>
            <H3 id="tool-discovery">Tool Discovery Validation</H3>
            <CodeBlock language="yaml" code={`
- it: "should list all available tools"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:regex:[\\\\s\\\\S]{10,}"  # At least 10 chars (multiline-safe)
            inputSchema: "match:type:object"
            `} />

            <H3 id="error-handling">Error Response Validation</H3>
            <CodeBlock language="yaml" code={`
- it: "should handle invalid tool gracefully"
  request:
    method: "tools/call"
    params:
      name: "nonexistent_tool"
      arguments: {}
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Unknown tool"
            `} />

            <H2 id="pattern-pages">Pattern Documentation Pages</H2>
            <p>Each pattern category has its own dedicated page with comprehensive examples and real-world usage:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">🔧 <a href="#/pattern-matching/basic" className="text-blue-600 hover:text-blue-800">Basic Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Fundamental validation patterns for everyday testing.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Deep equality matching</li>
                        <li>• Type validation</li>
                        <li>• Field existence checking</li>
                        <li>• Object property counting</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">📝 <a href="#/pattern-matching/string" className="text-blue-600 hover:text-blue-800">String Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Text validation for messages, content, and identifiers.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Contains substring matching</li>
                        <li>• Prefix and suffix validation</li>
                        <li>• Case-sensitive text checking</li>
                        <li>• Content validation</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">🔍 <a href="#/pattern-matching/regex" className="text-blue-600 hover:text-blue-800">Regex Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Complex pattern matching with regular expressions.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Email and URL validation</li>
                        <li>• Timestamp and UUID matching</li>
                        <li>• Complex format validation</li>
                        <li>• Custom pattern creation</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">🔢 <a href="#/pattern-matching/numeric" className="text-blue-600 hover:text-blue-800">Numeric Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Mathematical comparisons and range validation.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Greater/less than comparisons</li>
                        <li>• Range and between validation</li>
                        <li>• Performance metric testing</li>
                        <li>• Score and count validation</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">� <a href="#/pattern-matching/date" className="text-blue-600 hover:text-blue-800">Date Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Temporal validation and date/time comparisons.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Date validity checking</li>
                        <li>• Age and recency validation</li>
                        <li>• Format validation (ISO, US, etc.)</li>
                        <li>• Date range comparisons</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">�📋 <a href="#/pattern-matching/array" className="text-blue-600 hover:text-blue-800">Array Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Collection validation and element testing.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Array length validation</li>
                        <li>• Element pattern matching</li>
                        <li>• Contains value checking</li>
                        <li>• Field-based array searching</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">🏗️ <a href="#/pattern-matching/object-field" className="text-blue-600 hover:text-blue-800">Object & Field Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Complex object validation and field extraction.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Field extraction with dot notation</li>
                        <li>• Partial object matching</li>
                        <li>• Nested structure validation</li>
                        <li>• Dynamic field testing</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">🔗 <a href="#/pattern-matching/cross-field" className="text-blue-600 hover:text-blue-800">Cross-Field Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Validate relationships between fields in the same object.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Field-to-field comparisons (&lt;, &gt;, =, !=)</li>
                        <li>• Business rule validation</li>
                        <li>• Nested object relationships</li>
                        <li>• Data consistency checking</li>
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-2">⚡ <a href="#/pattern-matching/advanced" className="text-blue-600 hover:text-blue-800">Advanced Patterns</a></h3>
                    <p className="text-sm text-slate-600 mb-2">Sophisticated techniques and pattern combinations.</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Pattern negation (not: prefix)</li>
                        <li>• Case-insensitive matching</li>
                        <li>• Complex pattern combinations</li>
                        <li>• Utility and meta patterns</li>
                    </ul>
                </div>
            </div>

            <H2 id="best-practices">Best Practices</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Use --verbose --debug flags</strong> when developing patterns to see actual vs expected</li>
                <li><strong>Start simple</strong>: Begin with <InlineCode>match:type</InlineCode> patterns before complex regex</li>
                <li><strong>Test edge cases</strong>: Empty arrays, null values, missing fields</li>
                <li><strong>Document patterns</strong>: Add comments explaining complex regex patterns</li>
                <li><strong>Validate incrementally</strong>: Test each pattern addition separately</li>
                <li><strong>Use field extraction</strong> for complex nested validations</li>
                <li><strong>Prefer multiple simple patterns</strong> over one complex pattern</li>
            </ul>
        </>
    );
};

export default PatternMatchingPage;
