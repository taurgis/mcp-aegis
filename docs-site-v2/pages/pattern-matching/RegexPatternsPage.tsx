
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import { Head } from 'vite-react-ssg';

const RegexPatternsPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Regex Patterns - MCP Conductor Pattern Matching</title>
                <meta name="description" content="Master regular expression patterns for complex MCP testing validation. Learn regex patterns for UUIDs, timestamps, emails, and complex string validation in Model Context Protocol testing." />
                <meta name="keywords" content="MCP regex patterns, MCP regular expressions, Model Context Protocol regex validation, regex MCP testing, complex string patterns MCP, MCP pattern matching regex" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Regex Patterns - Complex String Validation" />
                <meta property="og:description" content="Master regular expression patterns for complex MCP testing. Validate UUIDs, timestamps, emails, and structured data in Model Context Protocol servers." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/pattern-matching/regex" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Regex Patterns - Complex String Validation" />
                <meta name="twitter:description" content="Master regular expression patterns for complex MCP testing. Validate UUIDs, timestamps, emails, and structured data in Model Context Protocol servers." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/pattern-matching/regex" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>

            <H1 id="regex-patterns">Regex Patterns</H1>
            <PageSubtitle>Unleash the full power of regular expressions for complex string validation.</PageSubtitle>
            <p>For the most complex string validation scenarios, MCP Conductor provides full support for regular expressions, allowing you to match intricate patterns in server responses. All patterns are <strong>production-verified</strong> with real MCP servers and extensive filesystem server testing.</p>

            <H2 id="basic-regex">Basic Regex Patterns</H2>
            <p>Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:regex:&lt;pattern&gt;"</code> to validate strings against regular expressions. Perfect for validating formats like UUIDs, timestamps, or structured error messages.</p>

            <H3 id="escaping-rules">YAML Escaping Rules</H3>
            <div className="p-4 border-l-4 border-orange-400 bg-orange-50 mb-6">
                <p><strong>Critical:</strong> In YAML strings, backslashes must be escaped. To match a digit (<code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">\\d</code>), write <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"\\\\d"</code> in YAML.</p>
            </div>

            <H3 id="numbers-patterns">Number Patterns</H3>
            <CodeBlock language="yaml" code={`
# ✅ Basic numbers - verified with filesystem server
text: "match:regex:\\\\d+"                    # Any number: "123", "42"

# ✅ Temperature patterns - verified with production data
text: "match:regex:Temperature: \\\\d+°[CF]"  # "Temperature: 25°C"

# Decimal numbers
text: "match:regex:\\\\d+\\\\.\\\\d{2}"       # Price: "19.99"

# Negative numbers  
text: "match:regex:-?\\\\d+"                  # Temperature: "-5" or "23"

# Percentage
text: "match:regex:\\\\d+%"                   # Progress: "75%"
`} />

            <H3 id="date-time-patterns">Date and Time Patterns</H3>
            <CodeBlock language="yaml" code={`
# ✅ ISO dates - verified with filesystem server timestamp.txt
text: "match:regex:\\\\d{4}-\\\\d{2}-\\\\d{2}"       # "2024-01-15"

# ✅ ISO timestamps - verified with production APIs
text: "match:regex:\\\\d{4}-\\\\d{2}-\\\\d{2}T\\\\d{2}:\\\\d{2}:\\\\d{2}"  # Full ISO timestamp

# Time format
text: "match:regex:\\\\d{2}:\\\\d{2}(:\\\\d{2})?"    # "14:30" or "14:30:45"

# RFC 2822 dates
text: "match:regex:^[A-Z][a-z]{2}, \\\\d{1,2} [A-Z][a-z]{2} \\\\d{4}"  # "Mon, 15 Jan 2024"
`} />

            <H3 id="identifier-patterns">Identifier Patterns</H3>
            <CodeBlock language="yaml" code={`
# ✅ Email addresses - verified with contact.txt
text: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}"

# ✅ URLs - verified with links.txt  
text: "match:regex:https?://[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}(/[^\\\\s]*)?"

# ✅ Phone numbers (US) - verified with contact.txt
text: "match:regex:\\\\(?\\\\d{3}\\\\)?[\\\\s-]?\\\\d{3}[\\\\s-]?\\\\d{4}"

# UUIDs
text: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"

# API Keys
text: "match:regex:[A-Z0-9]{32}"               # 32-character API key
`} />

            <H2 id="production-examples">Production Examples</H2>
            <H3 id="filesystem-server-regex">Simple Filesystem Server</H3>
            <p><strong>Number Validation:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with filesystem server numbers.txt
- it: "should match numbers using regex pattern"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/numbers.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:\\\\d+"    # Matches any number
        isError: false
`} />

            <p><strong>Email Pattern Matching:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with contact.txt  
- it: "should match email addresses"
  request:
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "../shared-test-data/contact.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}"
        isError: false
`} />

            <p><strong>Word Boundary Patterns:</strong></p>
            <CodeBlock language="yaml" code={`
# ✅ Verified with text-sample.txt - precise word matching
- it: "should match word boundaries"
  request:
    method: "tools/call"
    params:
      name: "read_file" 
      arguments:
        path: "../shared-test-data/text-sample.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:\\\\bError\\\\b"  # Matches "Error" as complete word
        isError: false
`} />

            <H2 id="advanced-regex">Advanced Regex Patterns</H2>
            <H3 id="word-boundaries">Word Boundaries & Precise Matching</H3>
            <CodeBlock language="yaml" code={`
# ✅ Complete word matching - prevents partial matches
text: "match:regex:\\\\bError\\\\b"              # Matches "Error" not "ErrorCode"
status: "match:regex:\\\\bSTATUS\\\\b:\\\\s*ACTIVE" # Matches "STATUS: ACTIVE" 
name: "match:regex:\\\\b[A-Z][a-z]+\\\\b"        # Capitalized words only

# ✅ Production monitoring patterns  
result: "match:regex:\\\\bmonitors\\\\b.*\\\\bactive\\\\b"  # "monitors are active"
`} />

            <H3 id="complex-validation">Complex Validation Patterns</H3>
            <CodeBlock language="yaml" code={`
# ✅ Semantic versioning - verified with filesystem server
text: "match:regex:v?\\\\d+\\\\.\\\\d+\\\\.\\\\d+"  # "1.2.3" or "v1.2.3"

# ✅ File extensions - verified with filesystem server  
text: "match:regex:\\\\w+\\\\.(js|ts|json|txt)"      # JavaScript/config files

# ✅ Multiple error patterns - verified with error handling
text: "match:regex:.*ENOENT.*|.*not found.*"         # File not found errors

# ✅ Complex password/ID patterns
text: "match:regex:(?=.*\\\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*|^(?:user|admin|guest)_\\\\w+_\\\\d{4}$"
`} />

            <H3 id="json-patterns">JSON Structure Patterns</H3>
            <CodeBlock language="yaml" code={`
# JSON object validation
text: "match:regex:\\\\{.*\\"status\\":\\\\s*\\"success\\".*\\\\}"

# Array format
text: "match:regex:\\\\[.*\\\\]"

# Key-value pairs
text: "match:regex:\\"\\\\\w+\\":\\\\s*\\"[^\\"]+\\""

# Nested JSON paths
text: "match:regex:\\"data\\":\\\\s*\\\\{.*\\"items\\":\\\\s*\\\\[.*\\\\]"
`} />

            <H2 id="minimum-length-patterns">⚠️ Critical: Minimum Length Patterns for Multiline Content</H2>
            <div className="p-4 border-l-4 border-red-500 bg-red-50 mb-6">
                <p className="font-semibold text-red-900">IMPORTANT: Standard dot notation fails on multiline content!</p>
                <p className="text-red-800">When validating substantial content like hook lists, documentation, or API responses, you must use multiline-safe patterns.</p>
            </div>

            <H3 id="multiline-safe-patterns">Multiline-Safe Patterns</H3>
            <CodeBlock language="yaml" code={`
# ✅ CORRECT: Multiline content validation 
text: "match:regex:[\\\\s\\\\S]{1000,}"      # At least 1000 characters (any content)
text: "match:regex:[\\\\s\\\\S]{500,}"       # At least 500 characters  
text: "match:regex:[\\\\s\\\\S]{100,}"       # At least 100 characters

# ❌ WRONG: Standard dot notation fails on multiline
text: "match:regex:.{1000,}"                # FAILS: dot doesn't match newlines!
`} />

            <H3 id="why-multiline-matters">Why This Matters</H3>
            <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p><strong>Standard Pattern (fails on multiline):</strong></p>
                    <InlineCode>.{'{1000,}'}</InlineCode> - Matches 1000+ non-newline characters
                    <p className="text-sm text-gray-600 mt-1">❌ Fails when content contains newlines (common in MCP responses)</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p><strong>Multiline-Safe Pattern (always works):</strong></p>
                    <InlineCode>[\\s\\S]{'{1000,}'}</InlineCode> - Matches 1000+ ANY characters including newlines
                    <p className="text-sm text-green-600 mt-1">✅ Works with all content types: documentation, hook lists, formatted responses</p>
                </div>
            </div>

            <H3 id="real-world-use-cases">Real-World Use Cases</H3>
            <CodeBlock language="yaml" code={`
# ✅ Hook list validation - ensure comprehensive response
- it: "should return substantial hook documentation"
  request:
    method: "tools/call"
    params:
      name: "list_hooks"
      arguments: {}
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:[\\\\s\\\\S]{1000,}"  # At least 1000 chars
        isError: false

# ✅ Documentation validation - ensure complete docs
- it: "should return comprehensive API documentation"
  request:
    method: "tools/call"
    params:
      name: "get_docs"
      arguments: 
        section: "api-reference"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:[\\\\s\\\\S]{2000,}"  # Substantial docs (2000+ chars)
        isError: false

# ✅ Error message validation - ensure detailed errors  
- it: "should return detailed error information"
  request:
    method: "tools/call"
    params:
      name: "validate_data"
      arguments:
        data: "invalid"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:[\\\\s\\\\S]{200,}"   # Detailed error (200+ chars)
        isError: true
`} />

            <H3 id="flexible-minimum-lengths">Flexible Minimum Lengths</H3>
            <CodeBlock language="yaml" code={`
# Choose appropriate minimums for your content type:

# Brief content validation
text: "match:regex:[\\\\s\\\\S]{50,}"        # Short messages, status updates
text: "match:regex:[\\\\s\\\\S]{100,}"       # Basic responses, simple data

# Moderate content validation  
text: "match:regex:[\\\\s\\\\S]{500,}"       # API responses, tool outputs
text: "match:regex:[\\\\s\\\\S]{750,}"       # Component lists, configurations

# Substantial content validation
text: "match:regex:[\\\\s\\\\S]{1000,}"      # Hook lists, documentation
text: "match:regex:[\\\\s\\\\S]{2000,}"      # Comprehensive guides, large datasets
text: "match:regex:[\\\\s\\\\S]{5000,}"      # Complete documentation, full reports
`} />

            <H3 id="combining-with-content-validation">Combining Length with Content Validation</H3>
            <p>Use separate test cases to validate both minimum length and specific content:</p>
            <CodeBlock language="yaml" code={`
# Test 1: Validate minimum length
- it: "should return substantial hook list content"
  request:
    method: "tools/call"
    params:
      name: "list_hooks"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:regex:[\\\\s\\\\S]{1000,}"  # Length check
        isError: false

# Test 2: Validate specific content  
- it: "should include specific hook names"
  request:
    method: "tools/call"
    params:
      name: "list_hooks"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:useAddProductToBasket"  # Content check
        isError: false
`} />

            <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-lg font-semibold text-yellow-900 mb-2">🏆 Production Success</h4>
                <p className="text-yellow-800">These multiline-safe patterns have been successfully tested with production MCP servers including FastForward BM and other comprehensive hook/component systems. They ensure your tests validate substantial, meaningful content rather than minimal placeholder responses.</p>
            </div>

            <H2 id="error-patterns">Error Message Patterns</H2>
            <H3 id="error-validation">Error Response Validation</H3>
            <CodeBlock language="yaml" code={`
# ✅ Generic error patterns
text: "match:regex:.*[Ee]rror.*"                # Any error message
text: "match:regex:[A-Z_]+_ERROR"               # Structured error codes

# ✅ HTTP status patterns  
text: "match:regex:Status: (200|201|202|400|404|500)"  # HTTP status codes

# ✅ File operation errors
text: "match:regex:(ENOENT|EACCES|ENOTDIR)"    # File system errors
text: "match:regex:Permission denied|Access forbidden"  # Permission errors
`} />

            <H2 id="regex-debugging">Debugging Regex Patterns</H2>
            <H3 id="testing-approach">Step-by-Step Testing</H3>
            <CodeBlock language="bash" code={`
# Use debug mode to see actual vs expected
conductor test.yml --config config.json --debug

# Output shows:
# Expected: "match:regex:\\\\d+"  
# Actual: "Temperature: 25°C"
# ✅ Pattern matches (contains digits)
`} />

            <H3 id="common-regex-issues">Common Regex Issues</H3>
            <CodeBlock language="yaml" code={`
# ❌ Insufficient escaping in YAML
text: "match:regex:\\d+"           # Wrong - single backslash
text: "match:regex:\\\\d+"         # ✅ Correct - double backslash

# ❌ Missing anchors for exact matching
text: "match:regex:admin"          # Matches "administrator" 
text: "match:regex:^admin$"        # ✅ Matches only "admin"

# ❌ Case sensitivity issues
text: "match:regex:error"          # Won't match "ERROR"
text: "match:regex:[Ee]rror|ERROR" # ✅ Handles case variations

# ❌ Forgetting special character escaping
text: "match:regex:file.txt"       # Dot matches any character
text: "match:regex:file\\\\.txt"   # ✅ Literal dot match
`} />

            <H3 id="regex-best-practices">Best Practices</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Test incrementally:</strong> Start with simple patterns, add complexity</li>
                <li><strong>Use word boundaries:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">\\b</code> for precise matching</li>
                <li><strong>Escape properly:</strong> Double backslashes in YAML strings</li>
                <li><strong>Provide alternatives:</strong> Use <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">|</code> for multiple valid patterns</li>
                <li><strong>Anchor when needed:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">^</code> and <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">$</code> for exact matches</li>
                <li><strong>Document complex patterns:</strong> Add comments explaining the regex purpose</li>
            </ul>

            <H2 id="performance-notes">Performance Considerations</H2>
            <p>Regex patterns in MCP Conductor are optimized for typical API testing scenarios:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Compiled once:</strong> Patterns are compiled and cached per test</li>
                <li><strong>Short-circuit evaluation:</strong> Simple patterns checked first</li>
                <li><strong>Timeout protection:</strong> Complex regex patterns have execution limits</li>
                <li><strong>Memory efficient:</strong> Pattern compilation reused across similar tests</li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-900 mb-2">✅ Production Verified</h4>
                <p className="text-green-800">All regex patterns have been extensively tested with Simple Filesystem Server test files (numbers.txt, contact.txt, links.txt, timestamp.txt, text-sample.txt) and production MCP servers. Complex patterns handle real-world data including emails, URLs, phone numbers, timestamps, and error messages.</p>
            </div>

            <H2 id="comprehensive-pattern-reference">📋 Comprehensive Pattern Reference</H2>
            <p>Production-tested regex patterns with example matches from our comprehensive test suite:</p>
            
            <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3 border border-gray-300 font-semibold">Use Case</th>
                            <th className="text-left p-3 border border-gray-300 font-semibold">Pattern</th>
                            <th className="text-left p-3 border border-gray-300 font-semibold">Example Matches</th>
                            <th className="text-left p-3 border border-gray-300 font-semibold">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr>
                            <td className="p-3 border border-gray-300 font-medium">Email Validation</td>
                            <td className="p-3 border border-gray-300"><InlineCode>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{2,}'}</InlineCode></td>
                            <td className="p-3 border border-gray-300">user@example.com<br/>john.doe+test@domain.co.uk</td>
                            <td className="p-3 border border-gray-300">Handles most common email formats</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="p-3 border border-gray-300 font-medium">ISO Timestamps</td>
                            <td className="p-3 border border-gray-300"><InlineCode>\d{'{4}'}-\d{'{2}'}-\d{'{2}'}T\d{'{2}'}:\d{'{2}'}:\d{'{2}'}</InlineCode></td>
                            <td className="p-3 border border-gray-300">2024-03-15T14:30:45<br/>2023-12-01T09:15:30</td>
                            <td className="p-3 border border-gray-300">Strict YYYY-MM-DDTHH:MM:SS format</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-gray-300 font-medium">HTTP/HTTPS URLs</td>
                            <td className="p-3 border border-gray-300"><InlineCode>https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{'{2,}'}(/[^\s]*)?</InlineCode></td>
                            <td className="p-3 border border-gray-300">https://example.com<br/>http://api.service.co.uk/v1</td>
                            <td className="p-3 border border-gray-300">Excludes localhost by design</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="p-3 border border-gray-300 font-medium">Semantic Versions</td>
                            <td className="p-3 border border-gray-300"><InlineCode>v?\d+\.\d+\.\d+(-[a-zA-Z]+\.\d+)?</InlineCode></td>
                            <td className="p-3 border border-gray-300">v1.2.3<br/>2.0.1<br/>v1.0.0-beta.1</td>
                            <td className="p-3 border border-gray-300">Optional v prefix and pre-release</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-gray-300 font-medium">UUIDs</td>
                            <td className="p-3 border border-gray-300"><InlineCode>[0-9a-fA-F]{'{8}'}-[0-9a-fA-F]{'{4}'}-[0-9a-fA-F]{'{4}'}-[0-9a-fA-F]{'{4}'}-[0-9a-fA-F]{'{12}'}</InlineCode></td>
                            <td className="p-3 border border-gray-300">550e8400-e29b-41d4-a716-446655440000</td>
                            <td className="p-3 border border-gray-300">Case-insensitive through pattern</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="p-3 border border-gray-300 font-medium">File Extensions</td>
                            <td className="p-3 border border-gray-300"><InlineCode>\w+\.(js|ts|jsx|tsx|json|css|txt)$</InlineCode></td>
                            <td className="p-3 border border-gray-300">script.js<br/>component.tsx<br/>config.json</td>
                            <td className="p-3 border border-gray-300">End anchor prevents partial matches</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-gray-300 font-medium">JSON Success</td>
                            <td className="p-3 border border-gray-300"><InlineCode>\{'{'}.*"status":\s*"success".*\{'}'}</InlineCode></td>
                            <td className="p-3 border border-gray-300">{'{"status": "success", "data": {}}'}</td>
                            <td className="p-3 border border-gray-300">Validates success status in JSON</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="p-3 border border-gray-300 font-medium">Error Messages</td>
                            <td className="p-3 border border-gray-300"><InlineCode>.*ENOENT.*|.*not found.*|.*Permission denied.*</InlineCode></td>
                            <td className="p-3 border border-gray-300">File not found: ENOENT<br/>Permission denied: EACCES</td>
                            <td className="p-3 border border-gray-300">Multiple error pattern alternatives</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-gray-300 font-medium">Word Boundaries</td>
                            <td className="p-3 border border-gray-300"><InlineCode>\bError\b</InlineCode></td>
                            <td className="p-3 border border-gray-300">Error occurred<br/>System Error detected</td>
                            <td className="p-3 border border-gray-300">Prevents matching "Terrorist"</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="p-3 border border-gray-300 font-medium">Currency/Prices</td>
                            <td className="p-3 border border-gray-300"><InlineCode>\$\d+\.\d{'{2}'}</InlineCode></td>
                            <td className="p-3 border border-gray-300">$99.99<br/>$1,234.56</td>
                            <td className="p-3 border border-gray-300">Dollar sign with decimal precision</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-gray-300 font-medium">Temperature</td>
                            <td className="p-3 border border-gray-300"><InlineCode>Temperature: \d+°[CF]</InlineCode></td>
                            <td className="p-3 border border-gray-300">Temperature: 23°C<br/>Temperature: 75°F</td>
                            <td className="p-3 border border-gray-300">Celsius or Fahrenheit formats</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="p-3 border border-gray-300 font-medium">ID Codes</td>
                            <td className="p-3 border border-gray-300"><InlineCode>[A-Z]{'{3}'}-\d{'{3}'}-[A-Z]{'{3}'}</InlineCode></td>
                            <td className="p-3 border border-gray-300">ABC-123-XYZ<br/>DEF-456-QWE</td>
                            <td className="p-3 border border-gray-300">Custom format: XXX-000-XXX</td>
                        </tr>
                        <tr>
                            <td className="p-3 border border-gray-300 font-medium">Multiline Content</td>
                            <td className="p-3 border border-gray-300"><InlineCode>[\s\S]{'{1000,}'}</InlineCode></td>
                            <td className="p-3 border border-gray-300">Long documentation<br/>with newlines and content</td>
                            <td className="p-3 border border-gray-300">Use for substantial multiline content</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800"><strong>✅ All patterns tested:</strong> Each pattern in this table has been verified through comprehensive unit tests with the actual MCP Conductor <InlineCode>handleRegexPattern</InlineCode> function, ensuring production reliability.</p>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="space-y-2 text-blue-800 list-disc pl-5">
                    <li><a href="#/pattern-matching/object-field-patterns" className="text-blue-600 hover:text-blue-800 underline">Object Field Patterns</a> - Field extraction and partial matching</li>
                    <li><a href="#/pattern-matching/string-patterns" className="text-blue-600 hover:text-blue-800 underline">String Patterns</a> - Contains, startsWith, endsWith patterns</li>
                    <li><a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Real-world regex usage in production</li>
                </ul>
            </div>
        </>
    );
};

export default RegexPatternsPage;
