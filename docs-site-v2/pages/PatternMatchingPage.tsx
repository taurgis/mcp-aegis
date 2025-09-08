
import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const PatternMatchingPage: React.FC = () => {
    useSEO({
        title: 'Pattern Matching Reference - MCP Conductor',
        description: 'Complete reference for 11+ advanced pattern matching capabilities in MCP Conductor. Production-verified patterns for flexible Model Context Protocol server validation.',
        keywords: 'MCP pattern matching reference, MCP Conductor patterns, Model Context Protocol pattern matching, MCP validation patterns, production verified MCP patterns',
        canonical: 'https://conductor.rhino-inquisitor.com/#/pattern-matching/overview',
        ogTitle: 'MCP Conductor Pattern Matching Reference - Advanced MCP Validation',
        ogDescription: 'Complete reference for advanced pattern matching in MCP Conductor. 11+ production-verified patterns for flexible Model Context Protocol validation.',
        ogUrl: 'https://conductor.rhino-inquisitor.com/pattern-matching/overview'
    });

    return (
        <>
            <H1 id="pattern-matching-reference">Pattern Matching Reference</H1>
            <PageSubtitle>Advanced MCP Server Validation Patterns</PageSubtitle>
            <p>MCP Conductor provides 11+ advanced pattern matching capabilities for flexible and powerful Model Context Protocol test validation. All core patterns have been verified with production MCP servers.</p>

            <H2 id="production-verified-patterns">🏆 Production Verified Patterns</H2>
            <p>The following patterns have been extensively tested with real-world MCP servers and are <strong>production-ready</strong>:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>✅ <strong>Deep Equality</strong> - Exact value matching</li>
                <li>✅ <strong>Type Validation</strong> - Data type checking (<InlineCode>string</InlineCode>, <InlineCode>number</InlineCode>, <InlineCode>object</InlineCode>, <InlineCode>array</InlineCode>, etc.)</li>
                <li>✅ <strong>Array Length</strong> - Exact element count validation  </li>
                <li>✅ <strong>Array Elements</strong> - Pattern matching for all array elements</li>
                <li>✅ <strong>Array Contains</strong> - Check if array contains specific values</li>
                <li>✅ <strong>Field Extraction</strong> - Extract and validate specific field values</li>
                <li>✅ <strong>Partial Matching</strong> - Validate only specified object fields</li>
                <li>✅ <strong>String Contains</strong> - Substring matching</li>
                <li>✅ <strong>String Starts With</strong> - Prefix matching</li>
                <li>✅ <strong>String Ends With</strong> - Suffix matching</li>
                <li>✅ <strong>Regex Matching</strong> - Full regular expression support</li>
                <li>✅ <strong>Object Count</strong> - Property counting</li>
                <li>✅ <strong>Field Exists</strong> - Field presence validation</li>
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
