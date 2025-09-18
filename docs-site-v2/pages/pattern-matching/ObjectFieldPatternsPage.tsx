
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import { Head } from 'vite-react-ssg';

const ObjectFieldPatternsPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Object & Field Patterns - MCP Conductor Pattern Matching</title>
                <meta name="description" content="Master advanced object and field validation patterns for MCP testing. Learn extractField, partial matching, and complex object analysis for Model Context Protocol servers." />
                <meta name="keywords" content="MCP object patterns, MCP field extraction, extractField MCP pattern, partial matching MCP, Model Context Protocol object validation, nested field MCP testing, complex object patterns" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Object & Field Patterns - Advanced MCP Validation" />
                <meta property="og:description" content="Learn advanced object and field validation patterns for MCP testing including field extraction, partial matching, and complex object analysis." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/pattern-matching/object-field" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Object & Field Patterns - Advanced MCP Validation" />
                <meta name="twitter:description" content="Learn advanced object and field validation patterns for MCP testing including field extraction, partial matching, and complex object analysis." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/pattern-matching/object-field" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>

            <H1 id="object-field-patterns">Object & Field Patterns</H1>
            <PageSubtitle>Selectively validate fields, extract nested values, and perform complex object analysis.</PageSubtitle>
            <p>These advanced patterns give you fine-grained control over validating complex objects and their properties, allowing for flexible and resilient tests. All patterns are <strong>production-verified</strong> with real MCP servers and extensive filesystem server testing.</p>

            <H2 id="match-extractField">Field Extraction Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">match:extractField:</code> to extract values from nested paths within complex responses. Essential for validating specific data points deep within JSON structures.</p>

            <H3 id="dot-notation">Dot Notation Paths</H3>
            <CodeBlock language="yaml" code={`
# Basic field extraction
result:
  match:extractField: "tools.*.name"       # Extract all tool names
  value:
    - "read_file"

# Deep nested extraction
result:
  match:extractField: "tools.*.inputSchema.type"
  value:
    - "object"

# Array index extraction  
result:
  match:extractField: "content.0.text"     # Extract text from first content item
  value: "Hello, MCP Conductor!"

# Single field extraction
result:
  match:extractField: "isError"
  value: false
`} />

            <H3 id="extraction-production-examples">Production Examples - Filesystem Server</H3>
            <p><strong>Tool Name Extraction:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
- it: "should extract and validate tool names"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"  # Extract names from all tools
        value:
          - "read_file"                     # Expected extracted value
`} />

            <p><strong>Array Contains with Extraction:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Check if specific tool exists using extraction
- it: "should extract tool names and check if read_file exists"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:extractField: "tools.*.name"
        value: "match:arrayContains:read_file"  # Check if read_file exists
`} />

            <p><strong>Deep Nested Field Extraction:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Extract nested schema information
- it: "should extract nested schema type field"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:extractField: "tools.*.inputSchema.type"
        value:
          - "object"                        # Schema type should be "object"

# ✅ Extract required fields from deep nested structure
- it: "should extract required fields from schema"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:extractField: "tools.*.inputSchema.required"
        value:
          - "match:arrayContains:path"      # Required array contains "path"
`} />

            <p><strong>Content Field Extraction:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Extract content type from tool call results
- it: "should extract content type field"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      result:
        match:extractField: "content.*.type"
        value:
          - "text"                          # Content type is "text"

# ✅ Extract text content with patterns
- it: "should extract text content with pattern validation"
  expect:
    response:
      result:
        match:extractField: "content.*.text"
        value:
          - "match:contains:Hello"          # Text contains "Hello"

# ✅ Extract specific array index
- it: "should extract text from specific content index"
  expect:
    response:
      result:
        match:extractField: "content.0.text"  # First content element text
        value: "match:regex:\\d+"              # Contains numbers
`} />

            <H3 id="bracket-notation">Bracket Notation Paths (v1.0.4+)</H3>
            <p>MCP Conductor supports both <strong>dot notation</strong> and <strong>bracket notation</strong> for field extraction. This gives you flexibility in how you specify array indices and field paths.</p>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-4">
                <p className="font-semibold">Enhanced Field Extraction Syntax</p>
                <p>Both syntaxes work interchangeably and can be mixed within the same path:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Dot Notation (traditional):</strong> <InlineCode>"tools.0.name"</InlineCode></li>
                    <li><strong>Bracket Notation:</strong> <InlineCode>"tools[0].name"</InlineCode></li>
                    <li><strong>Mixed Notation:</strong> <InlineCode>"tools[0].inputSchema.properties"</InlineCode></li>
                </ul>
            </div>

            <CodeBlock language="yaml" code={`
# Traditional dot notation (still works)
result:
  match:extractField: "tools.0.name"         # First tool name
  value: "read_file"

# Bracket notation for array indices
result:
  match:extractField: "tools[0].name"        # First tool name (same as above)
  value: "read_file"

# Extract specific high-index elements 
result:
  match:extractField: "tools[5].name"        # Sixth tool name (0-indexed)
  value: "search_docs"

# Bracket notation with wildcards
result:
  match:extractField: "tools[*].name"        # All tool names
  value:
    - "list_components"
    - "search_docs"

# Mixed bracket and dot notation
result:
  match:extractField: "tools[0].inputSchema.properties"
  value: "match:type:object"

# Complex nested bracket notation
result:
  match:extractField: "data.items[3].metadata.tags[0]"
  value: "important"

# Multi-dimensional arrays
result:  
  match:extractField: "matrix[1][0].coordinates"
  value: "match:type:object"
`} />

            <p><strong>Bracket Notation Production Examples:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Extract specific tool by index using bracket notation
- it: "should extract specific tool using bracket syntax"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:extractField: "tools[0].name"      # First tool
        value: "read_file"

# ✅ Extract nested properties with bracket notation
- it: "should extract nested properties using brackets"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      result:
        match:extractField: "content[0].type"    # First content type
        value: "text"

# ✅ Mix bracket and dot notation in same path
- it: "should support mixed bracket and dot notation"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:extractField: "tools[0].inputSchema.properties"
        value: "match:type:object"
`} />

            <H2 id="match-partial">Partial Matching Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">match:partial:</code> to validate only specific fields within objects, ignoring other fields. Makes tests resilient to API changes and reduces brittleness.</p>

            <H3 id="basic-partial">Basic Partial Matching</H3>
            <CodeBlock language="yaml" code={`
# Only validate specified fields, ignore others
result:
  match:partial:
    tools:
      - name: "read_file"                   # Must have this tool
        description: "match:contains:Reads" # Description contains "Reads"
    # Other fields in result are ignored
`} />

            <H3 id="partial-production-examples">Production Examples - Partial Matching</H3>
            <p><strong>Tool Structure Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server - partial tool validation
- it: "should validate partial response structure"  
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:partial:
          tools:
            - name: "read_file"             # Must contain this tool
              description: "match:contains:file"  # Description mentions "file"
        # Other response fields ignored
`} />

            <p><strong>Content Structure Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Partial content validation  
- it: "should validate partial content structure"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/hello.txt"
  expect:
    response:
      result:
        match:partial:
          content:
            - type: "text"                  # Must have text type
              text: "match:contains:MCP"    # Text mentions MCP
          isError: false                    # Must not be error
        # Other result fields ignored
`} />

            <p><strong>Nested Partial Matching:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Complex nested partial validation
- it: "should validate nested partial structure"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        match:partial:
          tools:
            - name: "match:type:string"
              inputSchema:
                type: "object"              # Schema must be object type
                required: "match:arrayContains:path"  # Must require path
              # Other tool fields ignored
`} />

            <H2 id="match-count">Count Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">match:count:</code> to validate the number of properties in objects or elements in arrays. Convenient shorthand for length validation.</p>

            <H3 id="basic-count">Basic Count Validation</H3>
            <CodeBlock language="yaml" code={`
result:
  users: "match:count:3"                   # Array has 3 elements
  config: "match:count:4"                  # Object has 4 properties
  tools: "match:count:1"                   # Single tool available
`} />

            <H2 id="complex-field-patterns">Complex Field Patterns</H2>
            <H3 id="multi-level-extraction">Multi-Level Field Extraction</H3>
            <CodeBlock language="yaml" code={`
# ✅ Very deep nested extraction
result:
  match:extractField: "tools.0.inputSchema.properties.path.type"
  value: "string"

# ✅ Cross-validate extracted data
result:
  match:extractField: "tools.*.name"
  value: "match:regex:read_\\\\w+"         # Tool names match pattern

# ✅ Multiple extraction patterns
result:
  match:extractField: "tools"
  value: "match:arrayLength:1"             # Extracted tools array has 1 element
`} />

            <H3 id="wildcard-patterns">Wildcard and Index Patterns</H3>
            <CodeBlock language="yaml" code={`
# Wildcard extraction (all elements)
"tools.*.name"                             # All tool names
"content.*.text"                          # All content text
"users.*.profile.email"                   # All user emails

# Index-based extraction (specific elements)  
"content.0.text"                          # First content text
"tools.1.description"                     # Second tool description
"results.0.data.items.2.value"           # Deep indexed path

# Mixed patterns
"tools.*.inputSchema.properties.*.type"  # All property types from all tools
`} />

            <H2 id="field-debugging">Debugging Field Patterns</H2>
            <H3 id="debug-field-paths">Verify Field Paths</H3>
            <CodeBlock language="bash" code={`
# Use debug mode to see actual response structure
conductor test.yml --config config.json --debug --verbose

# Output shows field extraction:
# Extracting field: "tools.*.name"
# Found paths: ["tools.0.name"]  
# Extracted values: ["read_file"]
# Expected: ["read_file"]
# ✅ Field extraction successful
`} />

            <H3 id="common-field-issues">Common Field Issues</H3>
            <CodeBlock language="yaml" code={`
# ❌ Wrong path notation
match:extractField: "tools[0].name"       # Use dot notation
match:extractField: "tools.0.name"        # ✅ Correct

# ❌ Missing wildcard for arrays  
match:extractField: "tools.name"          # Wrong for array
match:extractField: "tools.*.name"        # ✅ Correct for array

# ❌ Path doesn't exist
match:extractField: "tools.*.nonExistentField"
# ✅ Check actual response structure first

# ❌ Mixing extraction with other patterns in same object
result:
  tools: "match:arrayLength:1"
  match:extractField: "tools.*.name"      # Structure conflict!

# ✅ Use separate test cases
result:
  tools: "match:arrayLength:1"

# Separate test for extraction:
result:
  match:extractField: "tools.*.name"
  value: ["read_file"]
`} />

            <H2 id="field-anti-patterns">Field Pattern Anti-Patterns</H2>
            <H3 id="yaml-key-conflicts">YAML Key Conflicts</H3>
            <CodeBlock language="yaml" code={`
# ❌ CRITICAL - Duplicate YAML keys
result:
  match:extractField: "tools.*.name"
  match:extractField: "isError"          # Overwrites previous line!

# ❌ WRONG - Mixing field extraction with other patterns  
result:
  tools: "match:arrayLength:1"           
  match:extractField: "tools.*.name"     # Structure conflict

# ✅ CORRECT - Use separate validations
# Test 1: Array length
result:
  tools: "match:arrayLength:1"

# Test 2: Field extraction (separate test)
result:
  match:extractField: "tools.*.name"
  value: ["read_file"]
`} />

            <H3 id="partial-pattern-issues">Partial Pattern Issues</H3>
            <CodeBlock language="yaml" code={`
# ❌ WRONG - Too specific partial matching defeats the purpose
result:
  match:partial:
    tools:
      - name: "read_file"
        description: "Reads a file from the filesystem"
        inputSchema: {...complete schema...}  # Too detailed!

# ✅ CORRECT - Focus on key fields only
result:  
  match:partial:
    tools:
      - name: "read_file"                 # Key identifier
        description: "match:contains:file" # Essential property
    # Everything else ignored
`} />

            <H2 id="performance-considerations">Performance Considerations</H2>
            <p>Field patterns are optimized for complex object navigation:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Path caching:</strong> Field paths are compiled and cached per test</li>
                <li><strong>Lazy evaluation:</strong> Only extracts requested fields</li>
                <li><strong>Early termination:</strong> Stops on first path match failure</li>
                <li><strong>Memory efficient:</strong> Extracted values don't duplicate large objects</li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-900 mb-2">✅ Production Verified</h4>
                <p className="text-green-800">All object and field patterns have been extensively tested with Simple Filesystem Server (complex nested schemas, tool structures, content arrays) and production MCP servers. Field extraction handles deep nesting, wildcard arrays, and complex object hierarchies efficiently.</p>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="space-y-2 text-blue-800 list-disc pl-5">
                    <li><a href="#/pattern-matching/overview" className="text-blue-600 hover:text-blue-800 underline">Pattern Overview</a> - Complete pattern reference table</li>
                    <li><a href="#/pattern-matching/basic-patterns" className="text-blue-600 hover:text-blue-800 underline">Basic Patterns</a> - Deep equality and type validation</li>
                    <li><a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Real-world object pattern usage</li>
                </ul>
            </div>
        </>
    );
};

export default ObjectFieldPatternsPage;
