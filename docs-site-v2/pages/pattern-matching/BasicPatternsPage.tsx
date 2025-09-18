
import { Link } from 'react-router-dom';
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import { Head } from 'vite-react-ssg';

const BasicPatternsPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Basic Patterns - MCP Conductor Pattern Matching</title>
                <meta name="description" content="Master fundamental validation patterns for MCP testing. Learn deep equality, type validation, and existence patterns for Model Context Protocol server testing." />
                <meta name="keywords" content="MCP basic patterns, MCP type validation, deep equality MCP testing, Model Context Protocol basic patterns, MCP existence patterns, fundamental MCP validation" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Basic Patterns - Fundamental MCP Validation" />
                <meta property="og:description" content="Learn fundamental validation patterns for MCP testing including deep equality, type checking, and existence validation for Model Context Protocol servers." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/pattern-matching/basic" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Basic Patterns - Fundamental MCP Validation" />
                <meta name="twitter:description" content="Learn fundamental validation patterns for MCP testing including deep equality, type checking, and existence validation for Model Context Protocol servers." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/pattern-matching/basic" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>
            
            <H1 id="basic-patterns">Basic Patterns</H1>
            <PageSubtitle>Fundamental validation for equality, types, and existence.</PageSubtitle>
            <p>These are the foundational patterns in MCP Conductor, covering the most common validation needs. They form the building blocks for more complex assertions. All patterns have been <strong>production-verified</strong> with real MCP servers.</p>

            <H2 id="deep-equality">Deep Equality (Default)</H2>
            <p>If you do not specify a pattern, MCP Conductor performs a deep equality check by default. This means every field and value in your expectation must exactly match the server's response.</p>
            
            <H3 id="exact-value-matching">Exact Value Matching</H3>
            <CodeBlock language="yaml" code={`
# This expectation requires an exact match
expect:
  response:
    result:
      content:
        - type: "text"
          text: "Hello, MCP Conductor!"  # Must match exactly
      isError: false  # Must be exactly false
      status: "success"  # Must be exactly "success"
      count: 42  # Must be exactly 42
`} />

            <H3 id="nested-structure-matching">Nested Structure Matching</H3>
            <CodeBlock language="yaml" code={`
# Nested objects and arrays must match exactly
expect:
  response:
    result:
      tools:
        - name: "read_file"
          description: "Reads a file"
          inputSchema:
            type: "object"
            properties:
              path:
                type: "string"
            required:
              - "path"
`} />

            <p><strong>Production Example:</strong> Filesystem Server file reading with exact content matching:</p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
- it: "should match exact file content with deep equality"
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
          - type: "text"
            text: "Hello, MCP Conductor!"  # Exact match required
        isError: false  # Exact boolean match
`} />

            <p><strong>Use Cases:</strong> Static responses, configuration data, known file contents, status codes.</p>

            <H2 id="type-validation">Type Validation</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:type:&lt;type&gt;"</code> to validate a field's data type without checking its specific value. This is ideal for dynamic values like IDs, timestamps, or calculated numbers.</p>

            <H3 id="supported-types">Supported Types</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">string</code> - Text values</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">number</code> - Integer and decimal numbers</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">boolean</code> - true or false values</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">object</code> - Objects and null values</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">array</code> - Array values (uses Array.isArray())</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">null</code> - Null values specifically</li>
            </ul>

            <H3 id="basic-type-validation">Basic Type Validation</H3>
            <CodeBlock language="yaml" code={`
expect:
  response:
    id: "match:type:string"      # Any string is valid
    result:
      timestamp: "match:type:number"   # Any number is valid
      isActive: "match:type:boolean"   # Must be true or false
      data: "match:type:object"        # Must be an object
      items: "match:type:array"        # Must be an array
      nullable: "match:type:null"      # Must be null
`} />

            <H3 id="array-type-detection">Important: Array Type Detection</H3>
            <p>The <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">match:type:array</code> pattern correctly uses <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Array.isArray()</code> for validation, as JavaScript arrays have <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">typeof array === "object"</code>. This ensures reliable array type detection.</p>
            <CodeBlock language="yaml" code={`
# ✅ This works correctly - MCP Conductor handles array detection properly
result:
  tools: "match:type:array"          # Uses Array.isArray() internally
  metadata: "match:type:object"      # Uses typeof === "object"
`} />

            <p><strong>Production Examples:</strong> Filesystem Server response structure validation:</p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
- it: "should validate response field types"
  expect:
    response:
      result:
        content: "match:type:array"     # Content must be array
        isError: "match:type:boolean"   # isError must be boolean

# ✅ Tools list structure validation
- it: "should validate tools list structure types"
  expect:
    response:
      result:
        tools: "match:type:array"       # Tools list is array
`} />

            <p><strong>Use Cases:</strong> Dynamic responses, API validation, schema verification, data structure checks.</p>

            <H2 id="length-validation">Length Validation</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:length:N"</code> to validate the exact length of strings or arrays. This is a generic pattern that works with any length-based data.</p>

            <H3 id="string-length-validation">String Length Validation</H3>
            <CodeBlock language="yaml" code={`
expect:
  response:
    jsonrpc: "2.0"
    id: "test-1"
    result:
      content:
        - type: "text"
          text: "match:length:21"      # Text must have exactly 21 characters
      toolName: "match:length:9"      # "read_file" has 9 characters
      status: "match:length:7"        # "success" has 7 characters
`} />

            <H3 id="array-length-validation">Array Length Validation</H3>
            <CodeBlock language="yaml" code={`
expect:
  response:
    jsonrpc: "2.0"
    id: "test-2"
    result:
      content: "match:length:1"       # Content array has exactly 1 element
      tools: "match:length:3"         # Tools array has exactly 3 elements
      items: "match:length:0"         # Empty array validation
`} />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">💡 Pattern Comparison</h4>
                <p className="text-blue-800 mb-2">
                    <strong>Generic <InlineCode>length:</InlineCode> vs Specific <InlineCode>arrayLength:</InlineCode>:</strong>
                </p>
                <ul className="text-blue-800 space-y-1">
                    <li>• <InlineCode>match:length:N</InlineCode> - Works with both strings and arrays</li>
                    <li>• <InlineCode>match:arrayLength:N</InlineCode> - Only works with arrays (more specific)</li>
                    <li>• Use <InlineCode>length:</InlineCode> when you want flexibility</li>
                    <li>• Use <InlineCode>arrayLength:</InlineCode> for explicit array validation</li>
                </ul>
            </div>

            <H3 id="length-pattern-examples">Real-World Examples</H3>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
expect:
  response:
    jsonrpc: "2.0"
    id: "read-test"
    result:
      content:
        - type: "text"
          text: "match:length:21"      # "Hello, MCP Conductor!" = 21 chars
      isError: false
`} />

            <p><strong>Use Cases:</strong> Input validation, content size checks, array counting, string format validation, pagination limits.</p>

            <H2 id="field-existence">Field Existence</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:exists"</code> to assert that a field is present in the response, regardless of its value (including null or undefined values).</p>

            <H3 id="basic-existence-check">Basic Existence Check</H3>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      # Ensure fields exist, value doesn't matter
      optionalData: "match:exists"
      metadata: "match:exists"
      serverInfo: "match:exists"
`} />

            <H3 id="existence-with-boolean-values">Existence with Boolean Values</H3>
            <p>You can also use explicit boolean values with <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:exists:true"</code> and <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:exists:false"</code>:</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      # Field must be present
      requiredField: "match:exists:true"
      
      # Field must NOT be present
      deprecatedField: "match:exists:false"
`} />

            <H3 id="nested-existence-checks">Nested Existence Checks</H3>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      serverInfo:
        name: "match:exists"           # Name field must exist
        version: "match:exists"        # Version field must exist
        protocolVersion: "match:exists" # Protocol version must exist
        capabilities: "match:exists"    # Capabilities must exist
`} />

            <p><strong>Production Example:</strong> MCP handshake response validation:</p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with MCP Protocol Implementation
- it: "should validate handshake response has required fields"
  expect:
    response:
      result:
        protocolVersion: "match:exists"  # Must be present
        capabilities: "match:exists"     # Must be present  
        serverInfo: "match:exists"       # Must be present
`} />

            <p><strong>Use Cases:</strong> Optional fields, API compatibility checks, schema validation, feature detection.</p>

            <H2 id="combining-basic-patterns">Combining Basic Patterns</H2>
            <p>You can combine basic patterns within the same test to create comprehensive validation:</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    jsonrpc: "2.0"                    # Exact match
    id: "match:type:string"           # Any string
    result:
      content: "match:type:array"     # Must be array
      isError: "match:type:boolean"   # Must be boolean
      metadata: "match:exists"        # Must exist
      serverInfo:
        name: "match:type:string"     # Nested type validation
        version: "match:type:string"
`} />

            <H2 id="debugging-basic-patterns">Debugging Basic Patterns</H2>
            <H3 id="common-type-issues">Common Type Issues</H3>
            <CodeBlock language="bash" code={`
# Use debug mode to see actual vs expected types
conductor test.yml --config config.json --debug --verbose
`} />

            <H3 id="type-mismatch-debugging">Type Mismatch Debugging</H3>
            <CodeBlock language="yaml" code={`
# ❌ Wrong - expecting string but API returns number
result:
  count: "match:type:string"  # But count is actually a number!

# ✅ Correct - match actual data type
result:
  count: "match:type:number"
  name: "match:type:string"
`} />

            <H3 id="existence-debugging">Existence Debugging</H3>
            <CodeBlock language="yaml" code={`
# Start with existence checks, then add type validation
result:
  serverInfo: "match:exists"        # First: does it exist?
  
# Then validate type
result:
  serverInfo: "match:type:object"   # Second: is it an object?
  
# Finally validate structure
result:
  serverInfo:
    name: "match:type:string"       # Third: validate contents
`} />

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-900 mb-2">✅ Production Verified</h4>
                <p className="text-green-800">All basic patterns have been extensively tested with real-world MCP servers including Simple Filesystem Server, Multi-Tool Server, and production API servers.</p>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="space-y-2 text-blue-800 list-disc pl-5">
                    <li><Link to="/pattern-matching/string-patterns" className="text-blue-600 hover:text-blue-800 underline">String Patterns</Link> - Advanced string validation</li>
                    <li><Link to="/pattern-matching/array-patterns" className="text-blue-600 hover:text-blue-800 underline">Array Patterns</Link> - Array length and element validation</li>
                    <li><Link to="/pattern-matching/regex-patterns" className="text-blue-600 hover:text-blue-800 underline">Regex Patterns</Link> - Regular expression matching</li>
                </ul>
            </div>
        </>
    );
};

export default BasicPatternsPage;
