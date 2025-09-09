
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import useSEO from '../../hooks/useSEO';

const ArrayPatternsPage: React.FC = () => {
    useSEO({
        title: 'Array Patterns - MCP Conductor Pattern Matching',
        description: 'Master array validation patterns for MCP testing. Learn arrayLength, arrayElements, enhanced arrayContains with field matching and dot notation for Model Context Protocol server array validation.',
        keywords: 'MCP array patterns, MCP array validation, arrayLength pattern MCP, arrayElements MCP pattern, arrayContains MCP, arrayContains field matching, dot notation MCP, Model Context Protocol array testing, list validation MCP, nested field validation',
        canonical: 'https://conductor.rhino-inquisitor.com/#/pattern-matching/array',
        ogTitle: 'MCP Conductor Array Patterns - List & Array Validation',
        ogDescription: 'Learn array validation patterns for MCP testing including length, elements, and contains patterns for comprehensive Model Context Protocol array validation.',
        ogUrl: 'https://conductor.rhino-inquisitor.com/pattern-matching/array'
    });

    return (
        <>
            <H1 id="array-patterns">Array Patterns</H1>
            <PageSubtitle>Comprehensive array validation for MCP testing.</PageSubtitle>
            
            <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Quick Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <strong>Length:</strong> <InlineCode>"match:arrayLength:N"</InlineCode>
                        <p className="text-gray-600">Validate exact array size</p>
                    </div>
                    <div>
                        <strong>Elements:</strong> <InlineCode>match:arrayElements:</InlineCode>
                        <p className="text-gray-600">Validate all element structure</p>
                    </div>
                    <div>
                        <strong>Contains:</strong> <InlineCode>"match:arrayContains:value"</InlineCode>
                        <p className="text-gray-600">Check if array contains value</p>
                    </div>
                </div>
            </div>

            <p>Array patterns are essential for testing API endpoints that return lists. All patterns are <strong>production-verified</strong> with real MCP servers and handle edge cases gracefully.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p className="font-semibold text-blue-900">💡 Pro Tip</p>
                <p className="text-blue-800">Start with <code>arrayLength</code> to validate size, then use <code>arrayElements</code> for structure, and <code>arrayContains</code> for specific content checks.</p>
            </div>

            <H2 id="match-arrayLength">1. Array Length Validation</H2>
            <p>Validate that an array has exactly N elements. Essential for ensuring expected data counts without hardcoding specific values.</p>

            <CodeBlock language="yaml" code={`
# Basic length validation
result:
  tools: "match:arrayLength:1"         # Exactly 1 tool
  content: "match:arrayLength:0"       # Empty array
  items: "match:arrayLength:100"       # Large datasets

# ✅ Production example - Simple Filesystem Server
- it: "should have exactly one tool"
  request: { method: "tools/list" }
  expect:
    response:
      result:
        tools: "match:arrayLength:1"
`} />

            <H2 id="match-arrayElements">2. Array Elements Validation</H2>
            <p>Validate that <strong>every</strong> element in an array matches a specific structure. Perfect for ensuring consistency across all array items.</p>

            <H3 id="basic-elements">Basic Structure Validation</H3>
            <CodeBlock language="yaml" code={`
# Validate all elements have required keys and types
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string" 
      inputSchema: "match:type:object"

# ✅ Production example
- it: "should validate all tools have required structure"
  request: { method: "tools/list" }
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:type:string"
            inputSchema: "match:type:object"
`} />

            <H3 id="advanced-key-validation">Advanced Key Validation</H3>
            <p>The <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">match:arrayElements:</code> pattern can validate complex key structures with pattern matching, ensuring both key presence and content validation.</p>

            <CodeBlock language="yaml" code={`
# Advanced pattern-based key validation
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
`} />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-blue-800 mb-2">Key Validation Notes:</h4>
                <ul className="mt-2 space-y-1 text-blue-700">
                    <li><strong>All Keys Required:</strong> Every array element must have ALL specified keys</li>
                    <li><strong>Pattern Flexibility:</strong> Each key can use any supported pattern (regex, type, contains, etc.)</li>
                    <li><strong>Nested Validation:</strong> Supports deep object structure validation</li>
                    <li><strong>Extra Keys Allowed:</strong> Elements can have additional keys not specified</li>
                    <li><strong>Failure on Missing:</strong> Test fails if any element lacks any specified key</li>
                </ul>
            </div>

            <H2 id="match-arrayContains">3. Array Contains Validation</H2>
            <p>Check if an array contains specific values. Enhanced with field matching for direct object validation.</p>

            <H3 id="basic-contains">Basic Contains</H3>
            <CodeBlock language="yaml" code={`
# Traditional approach with field extraction
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:read_file"    # Check extracted names

# 🆕 Enhanced: Direct field matching (v1.0.11+)
result:
  tools: "match:arrayContains:name:read_file"          # Find by field value
  tools: "match:arrayContains:inputSchema.type:object" # Nested field access
`} />

            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
                <p className="font-semibold text-green-800">🆕 Enhanced Field Matching</p>
                <div className="text-green-700 text-sm mt-2 space-y-1">
                    <p><strong>Field syntax:</strong> <InlineCode>"match:arrayContains:fieldName:value"</InlineCode></p>
                    <p><strong>Dot notation:</strong> <InlineCode>"match:arrayContains:nested.field:value"</InlineCode></p>
                    <p><strong>With negation:</strong> <InlineCode>"match:not:arrayContains:field:value"</InlineCode></p>
                </div>
            </div>

            <H3 id="production-examples">Production Examples</H3>
            <CodeBlock language="yaml" code={`
# ✅ Enhanced field matching - Simple Filesystem Server
- it: "should find tool by name"
  request: { method: "tools/list" }
  expect:
    response:
      result:
        tools: "match:arrayContains:name:read_file"

# ✅ Traditional approach with field extraction  
- it: "should validate tool names exist"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: "match:arrayContains:read_file"

# ✅ Complex nested validation
- it: "should validate nested schema properties"
  expect:
    response:
      result:
        tools: "match:arrayContains:inputSchema.type:object"
`} />

            <H2 id="troubleshooting">Troubleshooting & Common Issues</H2>
            
            <H3 id="debug-tips">Debug Tips</H3>
            <CodeBlock language="bash" code={`
# Use debug mode to see actual vs expected structure
conductor test.yml --config config.json --debug --verbose
`} />

            <H3 id="common-mistakes">Common Mistakes</H3>
            <CodeBlock language="yaml" code={`
# ❌ Wrong: Mixing patterns in same object
result:
  tools: "match:arrayLength:1"
  tools:  # Duplicate key error!
    match:arrayElements: {...}

# ✅ Correct: Use separate tests
# Test 1: Length
result:
  tools: "match:arrayLength:1"

# Test 2: Structure (separate test case)  
result:
  tools:
    match:arrayElements:
      name: "match:type:string"

# ❌ Wrong: Array vs object confusion
result:
  content:
    match:arrayElements: {...}  # But response is single object!

# ✅ Correct: Match actual structure
result:
  content:
    - type: "text"
      text: "match:contains:data"
`} />

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="font-semibold text-yellow-800">💡 Best Practices</p>
                <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                    <li>Start with length validation, then add structure checks</li>
                    <li>Use enhanced field matching for simpler syntax</li>
                    <li>Separate complex validations into multiple test cases</li>
                    <li>Always check actual response structure with --debug first</li>
                </ul>
            </div>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-900 mb-2">✅ Production Verified</h4>
                <p className="text-green-800">All array patterns including enhanced arrayContains field matching have been extensively tested with Simple Filesystem Server, Multi-Tool Server, and production MCP servers. The enhanced arrayContains handles complex nested objects, deep field traversal, and large arrays efficiently while maintaining full backward compatibility with existing tests.</p>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="space-y-2 text-blue-800 list-disc pl-5">
                    <li><a href="#/pattern-matching/object-field-patterns" className="text-blue-600 hover:text-blue-800 underline">Object Field Patterns</a> - Field extraction and partial matching</li>
                    <li><a href="#/pattern-matching/regex-patterns" className="text-blue-600 hover:text-blue-800 underline">Regex Patterns</a> - Advanced pattern matching</li>
                    <li><a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Real-world array pattern usage</li>
                </ul>
            </div>
        </>
    );
};

export default ArrayPatternsPage;
