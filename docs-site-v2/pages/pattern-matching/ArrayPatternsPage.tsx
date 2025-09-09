
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
            <PageSubtitle>Validate array length, element structure, and content.</PageSubtitle>
            <p>Array patterns are crucial for testing API endpoints that return lists of items. MCP Conductor provides flexible patterns to validate the size, structure, and contents of arrays without brittle, hardcoded expectations. All patterns are <strong>production-verified</strong> with real MCP servers.</p>

            <H2 id="match-arrayLength">Array Length Validation</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:arrayLength:N"</code> to validate that an array has exactly N elements. Essential for ensuring expected data counts.</p>

            <H3 id="basic-array-length">Basic Array Length</H3>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      tools: "match:arrayLength:1"         # Exactly 1 tool
      content: "match:arrayLength:1"       # Single content element
      items: "match:arrayLength:0"         # Empty array
      data: "match:arrayLength:100"        # Exactly 100 elements
`} />

            <H3 id="array-length-production-examples">Production Examples</H3>
            <p><strong>Simple Filesystem Server:</strong> Tool count validation</p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
- it: "should validate tools array has exactly one element"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        tools: "match:arrayLength:1"  # Exactly 1 tool
`} />

            <p><strong>Content Response Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Content array length validation
- it: "should validate content array has single element"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      result:
        content: "match:arrayLength:1"  # Single content element
        isError: false
`} />

            <H2 id="match-arrayElements">Array Elements Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">match:arrayElements:</code> to validate that <strong>every</strong> element in an array matches a given structure. This ensures consistency across all array items.</p>

            <H3 id="basic-array-elements">Basic Element Structure</H3>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      tools:
        match:arrayElements:
          name: "match:type:string"
          description: "match:type:string" 
          inputSchema: "match:type:object"

      content:
        match:arrayElements:
          type: "match:type:string"
          text: "match:type:string"

      numbers:
        match:arrayElements: "match:type:number"  # All elements are numbers
`} />

            <H3 id="array-elements-production-examples">Production Examples</H3>
            <p><strong>Tool Structure Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server - all tools have name/description  
- it: "should validate all tools have required structure"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"        # Tool name is string
            description: "match:type:string" # Tool description is string
            inputSchema: "match:type:object" # Schema is object
`} />

            <p><strong>Content Structure Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Content structure validation
- it: "should validate all content elements have type and text"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      result:
        content:
          match:arrayElements:
            type: "match:type:string"        # Content type field
            text: "match:type:string"        # Content text field
        isError: false
`} />

            <p><strong>Schema Properties Structure:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Schema validation
- it: "should validate schema properties array structure"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        tools:
          - name: "read_file"
            description: "match:type:string"
            inputSchema:
              type: "object"
              properties: "match:type:object"
              required:
                match:arrayElements: "match:type:string"  # All required fields are strings
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

            <H2 id="match-arrayContains">Array Contains Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">match:arrayContains:</code> to check if an array contains specific values. Enhanced with field matching and dot notation support for advanced object validation.</p>

            <H3 id="basic-array-contains">Basic Array Contains</H3>
            <CodeBlock language="yaml" code={`
# Used with field extraction to check specific values
result:
  match:extractField: "tools.*.name"
  value: "match:arrayContains:read_file"    # Array contains "read_file"

# Multiple value check
result:
  match:extractField: "categories"
  value: "match:arrayContains:filesystem"   # Categories include "filesystem"
`} />

            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
                <p className="font-semibold">🆕 Enhanced Array Contains (v1.0.11+)</p>
                <p>New field matching and dot notation support for direct object validation in arrays:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Field matching:</strong> <InlineCode>"match:arrayContains:name:read_file"</InlineCode></li>
                    <li><strong>Dot notation:</strong> <InlineCode>"match:arrayContains:inputSchema.type:object"</InlineCode></li>
                    <li><strong>Deep nesting:</strong> <InlineCode>"match:arrayContains:metadata.author.name:John"</InlineCode></li>
                </ul>
            </div>

            <H3 id="enhanced-array-contains">Enhanced Array Contains - Field Matching</H3>
            <p><strong>NEW!</strong> Directly validate objects within arrays by their field values, eliminating the need for field extraction in many cases.</p>
            <CodeBlock language="yaml" code={`
# 🆕 Direct field matching - no extractField needed!
result:
  tools: "match:arrayContains:name:read_file"        # Find tool with name "read_file"
  tools: "match:arrayContains:description:Reads"     # Find tool with description containing "Reads"
  
# 🆕 Dot notation for nested fields
result:
  tools: "match:arrayContains:inputSchema.type:object"         # Nested field access
  tools: "match:arrayContains:metadata.version:1.0"            # Deep nested access
  tools: "match:arrayContains:config.settings.debug:true"     # Triple-level nesting

# 🆕 Works with negation
result:
  tools: "match:not:arrayContains:name:deprecated_tool"       # Should NOT contain
  tools: "match:not:arrayContains:status:disabled"            # No disabled tools
`} />

            <H3 id="field-matching-examples">Field Matching Production Examples</H3>
            <p><strong>Tool Validation (Enhanced):</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Enhanced arrayContains with field matching
- it: "should find tool by name using enhanced arrayContains"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        tools: "match:arrayContains:name:read_file"     # Direct field matching!

- it: "should validate nested schema properties with dot notation"
  expect:
    response:
      result:
        tools: "match:arrayContains:inputSchema.type:object"  # Nested field access
`} />

            <p><strong>Complex Object Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Advanced field matching scenarios
- it: "should validate complex nested objects"
  expect:
    response:
      result:
        # Find user with specific nested property
        users: "match:arrayContains:profile.settings.theme:dark"
        
        # Validate API endpoint configurations
        endpoints: "match:arrayContains:config.auth.type:bearer"
        
        # Check metadata fields
        resources: "match:arrayContains:metadata.author.email:admin@example.com"
`} />

            <H3 id="traditional-vs-enhanced">Traditional vs Enhanced Array Contains</H3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-blue-900 mb-2">When to Use Each Approach</h4>
                <div className="space-y-3 text-blue-800">
                    <div>
                        <strong>Enhanced Field Matching (Recommended):</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Direct object validation: <InlineCode>"match:arrayContains:name:value"</InlineCode></li>
                            <li>Nested field access: <InlineCode>"match:arrayContains:nested.field:value"</InlineCode></li>
                            <li>Simpler syntax, more readable tests</li>
                            <li>Better performance for simple field checks</li>
                        </ul>
                    </div>
                    <div>
                        <strong>Traditional Field Extraction:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Complex field manipulation needed</li>
                            <li>Multiple validation steps on extracted data</li>
                            <li>When you need the extracted values for other tests</li>
                        </ul>
                    </div>
                </div>
            </div>

            <H3 id="array-contains-production-examples">Production Examples</H3>
            <p><strong>Tool Name Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
- it: "should validate tools contain read_file tool by name"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: "match:arrayContains:read_file"  # Check if read_file exists
`} />

            <p><strong>Multiple Tool Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Multi-tool server validation
- it: "should contain specific tools"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value:
          - "match:arrayContains:calculator"
          - "match:arrayContains:text_processor"
          - "match:arrayContains:data_validator"
`} />

            <H2 id="complex-array-patterns">Complex Array Patterns</H2>
            <H3 id="nested-array-elements">Nested Array Element Patterns</H3>
            <CodeBlock language="yaml" code={`
result:
  users:
    match:arrayElements:
      id: "match:type:number"
      name: "match:type:string"
      email: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}"
      profile:
        match:partial:
          active: true
          role: "match:contains:admin"
`} />

            <H3 id="mixed-array-validation">Mixed Array Validation</H3>
            <CodeBlock language="yaml" code={`
# Combine length and element validation
result:
  tools: "match:arrayLength:3"              # Exactly 3 tools
  
# In separate test case for element structure:
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:contains:tool"
      version: "match:regex:v\\\\d+\\\\.\\\\d+\\\\.\\\\d+"
`} />

            <H2 id="array-debugging">Debugging Array Patterns</H2>
            <H3 id="debug-array-structure">Check Array Structure</H3>
            <CodeBlock language="bash" code={`
# Use debug mode to see actual array structure
conductor test.yml --config config.json --debug --verbose

# Output shows:
# Expected: "match:arrayLength:1"
# Actual: [{"name": "read_file", "description": "Reads a file"}]
# ✅ Array length matches (1 element)
`} />

            <H3 id="common-array-issues">Common Array Issues</H3>
            <CodeBlock language="yaml" code={`
# ❌ Wrong array length expectation
tools: "match:arrayLength:5"  # But server only has 1 tool

# ❌ Expecting object when response is array
result:
  content:
    match:arrayElements:
      type: "text"  # But actual response is single object, not array!

# ❌ Using old arrayContains syntax when enhanced version is available
result:
  match:extractField: "tools.*.name"         # Unnecessary extraction
  value: "match:arrayContains:read_file"     # Can be simplified!

# ❌ Incorrect field path in dot notation
tools: "match:arrayContains:nonexistent.field:value"  # Field doesn't exist

# ✅ Correct approaches
tools: "match:arrayLength:1"                           # Match actual count
tools: "match:arrayContains:name:read_file"            # Enhanced field matching
tools: "match:arrayContains:inputSchema.type:object"   # Dot notation for nested fields
result:
  content:
    - type: "text"                       # Match actual structure
      text: "match:regex:.*data.*"
result:
  match:extractField: "tools.*.name"    # Extract then check contains
  value: "match:arrayContains:read_file"
`} />

            <H3 id="incremental-array-testing">Incremental Array Testing</H3>
            <CodeBlock language="yaml" code={`
# Step 1: Check if field exists and is array
tools: "match:type:array"

# Step 2: Check array length
tools: "match:arrayLength:1"

# Step 3: Check element structure
tools:
  match:arrayElements:
    name: "match:type:string"

# Step 4: Add specific content validation
tools:
  match:arrayElements:
    name: "match:type:string"
    description: "match:contains:expected"
`} />

            <H2 id="array-anti-patterns">Common Array Anti-Patterns</H2>
            <H3 id="structure-conflicts">Structure Conflicts</H3>
            <CodeBlock language="yaml" code={`
# ❌ WRONG - Can't mix arrayElements with direct array structure
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # This creates a structure conflict!

# ✅ CORRECT - Use one approach consistently
result:
  content:
    match:arrayElements:
      type: "text"
      text: "match:contains:data"

# OR use direct array structure:
result:
  content:
    - type: "text" 
      text: "match:contains:data"
`} />

            <H3 id="length-vs-elements">Length vs Elements Mixing</H3>
            <CodeBlock language="yaml" code={`
# ❌ WRONG - Can't mix length and elements in same validation
result:
  tools: "match:arrayLength:1"
  tools:  # Duplicate key error!
    match:arrayElements:
      name: "match:type:string"

# ✅ CORRECT - Use separate test cases
# Test 1: Array length
result:
  tools: "match:arrayLength:1"

# Test 2: Element structure (separate test)
result:
  tools:
    match:arrayElements:
      name: "match:type:string"
`} />

            <H2 id="performance-considerations">Performance Considerations</H2>
            <p>Array patterns are optimized for performance and handle complex scenarios efficiently:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Early termination:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">arrayLength</code> checks size immediately</li>
                <li><strong>Streaming validation:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">arrayElements</code> validates elements as processed</li>
                <li><strong>Enhanced searching:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">arrayContains</code> with field matching uses optimized algorithms</li>
                <li><strong>Dot notation caching:</strong> Field paths are compiled and cached for repeated access</li>
                <li><strong>Type conversion optimization:</strong> Mixed data types handled efficiently</li>
                <li><strong>Memory efficient:</strong> Direct field matching avoids creating intermediate arrays</li>
            </ul>

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
