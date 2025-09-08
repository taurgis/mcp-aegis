
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import useSEO from '../../hooks/useSEO';

const RegexPatternsPage: React.FC = () => {
    useSEO({
        title: 'Regex Patterns - MCP Conductor Pattern Matching',
        description: 'Master regular expression patterns for complex MCP testing validation. Learn regex patterns for UUIDs, timestamps, emails, and complex string validation in Model Context Protocol testing.',
        keywords: 'MCP regex patterns, MCP regular expressions, Model Context Protocol regex validation, regex MCP testing, complex string patterns MCP, MCP pattern matching regex',
        canonical: 'https://conductor.rhino-inquisitor.com/#/pattern-matching/regex',
        ogTitle: 'MCP Conductor Regex Patterns - Complex String Validation',
        ogDescription: 'Master regular expression patterns for complex MCP testing. Validate UUIDs, timestamps, emails, and structured data in Model Context Protocol servers.',
        ogUrl: 'https://conductor.rhino-inquisitor.com/pattern-matching/regex'
    });

    return (
        <>
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

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h4>
                <ul className="space-y-2 text-blue-800">
                    <li>• <a href="#/pattern-matching/object-field-patterns" className="text-blue-600 hover:text-blue-800 underline">Object Field Patterns</a> - Field extraction and partial matching</li>
                    <li>• <a href="#/pattern-matching/string-patterns" className="text-blue-600 hover:text-blue-800 underline">String Patterns</a> - Contains, startsWith, endsWith patterns</li>
                    <li>• <a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Real-world regex usage in production</li>
                </ul>
            </div>
        </>
    );
};

export default RegexPatternsPage;
