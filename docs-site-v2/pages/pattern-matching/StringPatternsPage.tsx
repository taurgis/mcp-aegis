
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import useSEO from '../../hooks/useSEO';

const StringPatternsPage: React.FC = () => {
    useSEO({
        title: 'String Patterns - MCP Conductor Pattern Matching',
        description: 'Master string validation patterns for MCP testing. Learn contains, startsWith, endsWith patterns for Model Context Protocol server string validation and text content testing.',
        keywords: 'MCP string patterns, MCP string validation, contains pattern MCP, startsWith MCP pattern, endsWith MCP pattern, Model Context Protocol string testing, text validation MCP',
        canonical: 'https://conductor.rhino-inquisitor.com/#/pattern-matching/string',
        ogTitle: 'MCP Conductor String Patterns - Text Validation for MCP Testing',
        ogDescription: 'Learn string validation patterns for MCP testing including contains, startsWith, and endsWith for comprehensive Model Context Protocol text validation.',
        ogUrl: 'https://conductor.rhino-inquisitor.com/pattern-matching/string'
    });

    return (
        <>
            <H1 id="string-patterns">String Patterns</H1>
            <PageSubtitle>Validate parts of a string like substrings, prefixes, and suffixes.</PageSubtitle>
            <p>String patterns are essential for testing dynamic text content, such as log messages, descriptions, or generated content where you only need to verify a key part of the string. All patterns are <strong>production-verified</strong> with real MCP servers.</p>

            <H2 id="match-contains">String Contains Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:contains:substring"</code> to check if the actual string value contains the specified substring anywhere within it. The match is case-sensitive.</p>

            <H3 id="basic-contains">Basic Contains Matching</H3>
            <CodeBlock language="yaml" code={`
# Use case: Verifying success messages
expect:
  response:
    result:
      message: "match:contains:success"        # Contains "success"
      description: "match:contains:file"       # Contains "file"
      error: "match:contains:not found"        # Contains "not found"
`} />

            <H3 id="contains-production-examples">Production Examples</H3>
            <p><strong>Filesystem Server:</strong> File content validation</p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
- it: "should match file content containing specific text"
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
            text: "match:contains:MCP"       # Must contain "MCP"
        isError: false
`} />

            <p><strong>Error Message Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Error message validation
- it: "should match error messages containing specific text"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/nonexistent.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:not found"  # Error contains "not found"
        isError: true
`} />

            <p><strong>Tool Description Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Tool description keyword matching
- it: "should match tool description containing specific keywords"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        tools:
          - name: "read_file"
            description: "match:contains:Reads"  # Description contains "Reads"
`} />

            <H2 id="match-startsWith">String Prefix Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:startsWith:prefix"</code> to check if the actual string starts with the specified prefix. Perfect for validating identifiers, URLs, or formatted strings.</p>

            <H3 id="basic-startswith">Basic Prefix Matching</H3>
            <CodeBlock language="yaml" code={`
# Use case: Resource identifiers and URLs
expect:
  response:
    result:
      name: "match:startsWith:get_"        # Starts with "get_"
      url: "match:startsWith:https://"     # Starts with "https://"
      greeting: "match:startsWith:Hello"   # Starts with "Hello"
      jsonrpc: "match:startsWith:2."       # JSON-RPC version starts with "2."
`} />

            <H3 id="startswith-production-examples">Production Examples</H3>
            <p><strong>Content Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server - Greeting validation
- it: "should match content starting with specific prefix"
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
            text: "match:startsWith:Hello"    # Must start with "Hello"
        isError: false
`} />

            <p><strong>JSON-RPC Version Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ JSON-RPC version validation (works on any field)
- it: "should validate JSON-RPC version starts with correct value"
  request:
    method: "tools/list"
  expect:
    response:
      jsonrpc: "match:startsWith:2."           # Version starts with "2."
      result:
        tools:
          - name: "read_file"
            description: "Reads a file"
`} />

            <p><strong>Tool Name Patterns:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Tool naming convention validation
expect:
  response:
    result:
      tools:
        - name: "match:startsWith:get_"      # Getter tools start with "get_"
        - name: "match:startsWith:create_"   # Creator tools start with "create_"
        - name: "match:startsWith:update_"   # Updater tools start with "update_"
`} />

            <H2 id="match-endsWith">String Suffix Pattern</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:endsWith:suffix"</code> to check if the actual string ends with the specified suffix. Ideal for file extensions, version numbers, or status indicators.</p>

            <H3 id="basic-endswith">Basic Suffix Matching</H3>
            <CodeBlock language="yaml" code={`
# Use case: File extensions and endings
expect:
  response:
    result:
      filename: "match:endsWith:.json"     # Ends with ".json"
      version: "match:endsWith:.0"         # Ends with ".0"
      message: "match:endsWith:Conductor!" # Ends with "Conductor!"
      status: "match:endsWith:complete"    # Ends with "complete"
`} />

            <H3 id="endswith-production-examples">Production Examples</H3>
            <p><strong>File Content Ending Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with Simple Filesystem Server
- it: "should match content ending with specific suffix"
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
            text: "match:endsWith:Conductor!"   # Ends with "Conductor!"
        isError: false
`} />

            <p><strong>Version Number Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ API version checking
expect:
  response:
    result:
      apiVersion: "match:endsWith:.0"      # Stable versions end with ".0"
      protocolVersion: "match:endsWith:18" # Protocol ends with specific build
`} />

            <H2 id="case-sensitivity">Case Sensitivity</H2>
            <p>All string patterns are case-sensitive. This ensures precise matching and prevents false positives:</p>
            <CodeBlock language="yaml" code={`
# Case-sensitive examples
text: "match:contains:Success"     # Matches "Success" but NOT "success"
text: "match:startsWith:HTTP"      # Matches "HTTPS" but NOT "https"
text: "match:endsWith:PDF"         # Matches ".PDF" but NOT ".pdf"

# Case-insensitive examples (NEW!)
text: "match:containsIgnoreCase:success"    # Matches "Success", "SUCCESS", "success"
text: "match:equalsIgnoreCase:OK"           # Matches "ok", "Ok", "OK"

# Use regex for case-insensitive matching (legacy approach)
text: "match:regex:(?i)success"    # Case-insensitive regex
`} />

            <H2 id="case-insensitive-patterns">Case-Insensitive Patterns</H2>
            <p>MCP Conductor provides dedicated case-insensitive string patterns for flexible string matching without the complexity of regex patterns.</p>

            <H3 id="containsignorecase-pattern">Contains Ignore Case Pattern</H3>
            <p>The <code>containsIgnoreCase:</code> pattern matches strings containing a substring, ignoring case differences:</p>
            <CodeBlock language="yaml" code={`
# Basic usage
result:
  status: "match:containsIgnoreCase:success"    # Matches "Success", "SUCCESS", "success"
  name: "match:containsIgnoreCase:john"         # Matches "John", "JOHN", "johnny"
  message: "match:containsIgnoreCase:error"     # Matches "Error", "ERROR", "error message"

# Real-world example - Error message validation
- it: "should match error messages case-insensitively"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "nonexistent.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:containsIgnoreCase:FILE"    # Matches "file", "File", "FILE"
        isError: true
`} />

            <H3 id="equalsignorecase-pattern">Equals Ignore Case Pattern</H3>
            <p>The <code>equalsIgnoreCase:</code> pattern matches strings that are exactly equal, ignoring case differences:</p>
            <CodeBlock language="yaml" code={`
# Basic usage
result:
  status: "match:equalsIgnoreCase:OK"           # Matches "ok", "Ok", "OK" but NOT "okay"
  level: "match:equalsIgnoreCase:INFO"          # Matches "info", "Info", "INFO"
  response: "match:equalsIgnoreCase:SUCCESS"    # Matches "success", "Success", "SUCCESS"

# Real-world example - Status validation
- it: "should match status values case-insensitively"
  request:
    method: "tools/call"
    params:
      name: "process_data"
  expect:
    response:
      result:
        status: "match:equalsIgnoreCase:COMPLETED"  # Matches any case variation
        level: "match:equalsIgnoreCase:INFO"        # Exact match ignoring case
`} />

            <H3 id="case-insensitive-with-arrays">Case-Insensitive Patterns with Arrays</H3>
            <p>Case-insensitive patterns work with arrays, checking each element:</p>
            <CodeBlock language="yaml" code={`
# Array element validation
result:
  tools:
    match:arrayElements:
      name: "match:containsIgnoreCase:FILE"         # Each tool name contains "file" (any case)
      description: "match:containsIgnoreCase:READ"  # Each description contains "read" (any case)

# Array contains with case-insensitive field matching
result:
  logs: "match:arrayContains:level:INFO"           # Case-sensitive field match
  # Note: arrayContains field matching is case-sensitive by design
  # Use containsIgnoreCase within individual field validation instead
`} />

            <H3 id="case-insensitive-negation">Case-Insensitive Negation</H3>
            <p>Combine case-insensitive patterns with negation for exclusion validation:</p>
            <CodeBlock language="yaml" code={`
# Negated case-insensitive patterns
result:
  message: "match:not:containsIgnoreCase:ERROR"      # Should NOT contain "error" (any case)
  status: "match:not:equalsIgnoreCase:FAILURE"       # Should NOT equal "failure" (any case)
  level: "match:not:containsIgnoreCase:CRITICAL"     # Should NOT contain "critical" (any case)

# Real-world example - Success validation
- it: "should not contain error indicators (case-insensitive)"
  request:
    method: "tools/call"
    params:
      name: "health_check"
  expect:
    response:
      result:
        message: "match:not:containsIgnoreCase:ERROR"    # No error mentions
        status: "match:not:containsIgnoreCase:FAIL"      # No failure indicators
        isError: false
`} />

            <H2 id="combining-string-patterns">Combining String Patterns</H2>
            <p>You can use multiple string patterns in the same test to validate different aspects:</p>
            <CodeBlock language="yaml" code={`
# Comprehensive string validation
expect:
  response:
    result:
      content:
        - type: "text"
          text: "match:startsWith:Hello"      # Must start with greeting
      error:
        message: "match:contains:validation"  # Error contains validation
        code: "match:endsWith:_ERROR"         # Error code ends with _ERROR
      apiVersion: "match:startsWith:v"        # Version starts with "v"
`} />

            <H2 id="common-use-cases">Common Use Cases</H2>
            <H3 id="log-message-validation">Log Message Validation</H3>
            <CodeBlock language="yaml" code={`
# Validate log entries
expect:
  response:
    result:
      logs:
        - level: "INFO"
          message: "match:contains:started"    # Log contains "started"
        - level: "ERROR" 
          message: "match:startsWith:Failed"   # Error starts with "Failed"
`} />

            <H3 id="api-response-validation">API Response Validation</H3>
            <CodeBlock language="yaml" code={`
# API endpoint response validation
expect:
  response:
    result:
      status: "match:contains:success"         # Status mentions success
      endpoint: "match:startsWith:/api/v"      # API version in URL
      timestamp: "match:endsWith:Z"            # UTC timestamp format
`} />

            <H3 id="file-system-validation">File System Validation</H3>
            <CodeBlock language="yaml" code={`
# File operations validation
expect:
  response:
    result:
      path: "match:startsWith:/"               # Absolute path
      filename: "match:endsWith:.txt"          # Text file
      content: "match:contains:data"           # Contains data
`} />

            <H2 id="debugging-string-patterns">Debugging String Patterns</H2>
            <H3 id="debug-actual-values">Check Actual Values</H3>
            <CodeBlock language="bash" code={`
# Use debug mode to see actual string values
conductor test.yml --config config.json --debug --verbose

# Output shows:
# Expected: "match:contains:MCP"
# Actual: "Hello, MCP Conductor testing!"
# ✅ Contains match found
`} />

            <H3 id="common-string-issues">Common String Issues</H3>
            <CodeBlock language="yaml" code={`
# ❌ Common mistakes
text: "match:contains:Success"    # Case mismatch - actual is "success"
text: "match:startsWith:HTTP"     # Case mismatch - actual is "https://"
text: "match:endsWith: .txt"      # Space issue - actual is ".txt"

# ✅ Correct approaches
text: "match:contains:success"    # Match exact case
text: "match:startsWith:https"    # Match actual protocol
text: "match:endsWith:.txt"       # No extra spaces
`} />

            <H3 id="incremental-testing">Incremental Testing</H3>
            <CodeBlock language="yaml" code={`
# Start simple and add complexity
# Step 1: Check if field exists
text: "match:exists"

# Step 2: Check type
text: "match:type:string"

# Step 3: Add string pattern
text: "match:contains:expected"

# Step 4: Refine to specific pattern
text: "match:startsWith:Hello world"
`} />

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-900 mb-2">✅ Production Verified</h4>
                <p className="text-green-800">All string patterns have been extensively tested with Simple Filesystem Server, Multi-Tool Server, and production MCP implementations. Case-sensitive matching ensures reliable validation.</p>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="space-y-2 text-blue-800 list-disc pl-5">
                    <li><a href="#/pattern-matching/regex-patterns" className="text-blue-600 hover:text-blue-800 underline">Regex Patterns</a> - Advanced pattern matching with regular expressions</li>
                    <li><a href="#/pattern-matching/array-patterns" className="text-blue-600 hover:text-blue-800 underline">Array Patterns</a> - Array validation and element matching</li>
                    <li><a href="#/pattern-matching/object-field-patterns" className="text-blue-600 hover:text-blue-800 underline">Object Field Patterns</a> - Field extraction and partial matching</li>
                </ul>
            </div>
        </>
    );
};

export default StringPatternsPage;
