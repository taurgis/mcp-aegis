import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';
import Section from '../components/Section';

const YamlTestingPage: React.FC = () => {
    const navigate = useNavigate();
    
    const goTo = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <Head>
                <title>YAML Testing Guide - MCP Aegis</title>
                <meta name="description" content="Complete guide to declarative YAML testing for Model Context Protocol servers. Learn pattern matching, test structures, CLI options, and advanced validation techniques." />
                <meta name="keywords" content="YAML testing, MCP YAML tests, declarative testing, Model Context Protocol YAML, MCP test patterns, YAML validation, MCP CLI testing" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Aegis YAML Testing - Declarative MCP Server Testing" />
                <meta property="og:description" content="Master declarative YAML testing for Model Context Protocol servers with pattern matching, advanced validation, and comprehensive CLI options." />
                <meta property="og:url" content="https://aegis.rhino-inquisitor.com/yaml-testing" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Aegis YAML Testing - Declarative MCP Server Testing" />
                <meta name="twitter:description" content="Master declarative YAML testing for Model Context Protocol servers with pattern matching, advanced validation, and comprehensive CLI options." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://aegis.rhino-inquisitor.com/yaml-testing" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>

            <H1 id="yaml-testing-guide">📝 YAML Testing Guide</H1>
            <PageSubtitle>Declarative Model Context Protocol Testing</PageSubtitle>

            {/* HERO SECTION */}
            <section className="hero-section bg-gradient-to-br from-green-50 to-blue-100 rounded-lg p-8 text-center mb-12" aria-labelledby="hero-heading">
                <h2 id="hero-heading" className="text-2xl font-bold text-gray-800 mb-4">Human-Readable Testing with YAML</h2>
                <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                    Write declarative tests using simple YAML files with <strong>50+ powerful pattern matching types</strong>. 
                    Perfect for manual test creation, CI/CD integration, and comprehensive MCP server validation.
                </p>
                <div className="flex items-center justify-center gap-2 mb-6" aria-label="YAML testing features">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">50+ Patterns</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Declarative</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">No Coding Required</span>
                </div>
                <nav aria-label="Primary calls to action" className="flex flex-wrap justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => document.getElementById('quick-start')?.scrollIntoView({ behavior: 'smooth' })}
                        className="no-underline inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-[0.97] transition-all"
                    >Quick Start</button>
                    <button
                        type="button"
                        onClick={() => goTo('/pattern-matching/overview')}
                        className="no-underline inline-flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 active:scale-[0.97] transition-all"
                    >Pattern Matching Reference</button>
                    <button
                        type="button"
                        onClick={() => goTo('/examples')}
                        className="no-underline inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 active:scale-[0.97] transition-all"
                    >View Examples</button>
                </nav>
            </section>

            <Section id="quick-start">
                <H2 id="yaml-quick-start">🚀 Quick Start: Your First YAML Test</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Learn by example! Create your first YAML test in under 2 minutes with this step-by-step guide.
                </p>
                
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Prerequisites</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">✅ MCP Aegis installed</p>
                            <p className="text-sm text-gray-600">✅ Working MCP server</p>
                            <p className="text-sm text-gray-600">✅ Configuration file (<InlineCode>aegis.config.json</InlineCode>)</p>
                        </div>
                        <div className="text-xs text-gray-500">
                            <p>Need help? See <Link to="/quick-start" className="text-blue-600 hover:text-blue-800 underline">Quick Start Guide</Link> for installation.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-gray-800 mb-3">📝 Step 1: Create Your First Test File</h4>
                        <p className="text-sm text-gray-600 mb-3">Create <InlineCode>first.test.mcp.yml</InlineCode> with this simple test:</p>
                        <CodeBlock language="yaml" code={`description: "My first MCP YAML test"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "test-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result:
          tools: "match:arrayLength:1"  # Expect exactly 1 tool
      stderr: "toBeEmpty"
`} />
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-gray-800 mb-3">🏃 Step 2: Run Your Test</h4>
                        <CodeBlock language="bash" code="aegis first.test.mcp.yml --config aegis.config.json" />
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                            <p className="text-green-800">✅ Expected output: <strong>1 passed</strong></p>
                        </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-gray-800 mb-3">🔍 Step 3: Add Tool Execution Test</h4>
                        <p className="text-sm text-gray-600 mb-3">Extend your test to actually call a tool:</p>
                        <CodeBlock language="yaml" code={`  - it: "should execute read_file tool successfully"
    request:
      jsonrpc: "2.0"
      id: "test-2"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "../shared-test-data/hello.txt"  # Use existing test file
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-2"
        result:
          content:
            - type: "text"
              text: "match:type:string"  # Expect string content
          isError: false
      stderr: "toBeEmpty"
`} />
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-gray-800 mb-3">🎯 Step 4: Use Pattern Matching</h4>
                        <p className="text-sm text-gray-600 mb-3">Make your tests more flexible with pattern matching:</p>
                        <CodeBlock language="yaml" code={`  - it: "should validate tool structure"
    request:
      jsonrpc: "2.0"
      id: "test-3"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools:
            match:arrayElements:
              name: "match:type:string"
              description: "match:regex:.{10,}"  # At least 10 chars
              inputSchema: "match:type:object"
`} />
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                            <p className="text-blue-800">💡 This validates that ALL tools have proper structure!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
                    <button
                        type="button"
                        onClick={() => goTo('/pattern-matching/overview')}
                        className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <div className="text-2xl mb-2">🎯</div>
                        <div className="font-semibold text-blue-800">Learn Patterns</div>
                        <div className="text-xs text-gray-600">50+ pattern types</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo('/examples')}
                        className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        <div className="text-2xl mb-2">📚</div>
                        <div className="font-semibold text-green-800">See Examples</div>
                        <div className="text-xs text-gray-600">Real-world tests</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => document.getElementById('cli-options')?.scrollIntoView({ behavior: 'smooth' })}
                        className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                        <div className="text-2xl mb-2">⚙️</div>
                        <div className="font-semibold text-purple-800">CLI Options</div>
                        <div className="text-xs text-gray-600">Debug & format</div>
                    </button>
                </div>
            </Section>

            <H2 id="cli-options">CLI Options</H2>
            <p>MCP Aegis provides several CLI options for debugging and different output formats:</p>
            <CodeBlock language="bash" code={`
# Basic test execution
aegis "tests/*.yml" --config config.json

# Verbose output shows test hierarchy and individual results
aegis "tests/*.yml" --config config.json --verbose

# Debug mode shows detailed MCP communication (JSON-RPC messages)
aegis "tests/*.yml" --config config.json --debug

# Timing information for performance analysis
aegis "tests/*.yml" --config config.json --timing

# JSON output for CI/automation systems
aegis "tests/*.yml" --config config.json --json

# Quiet mode suppresses non-essential output
aegis "tests/*.yml" --config config.json --quiet

# Combine multiple debugging options
aegis "tests/*.yml" --config config.json --verbose --debug --timing
            `} />

            <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3 border border-gray-300">Option</th>
                            <th className="text-left p-3 border border-gray-300">Short</th>
                            <th className="text-left p-3 border border-gray-300">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--config</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-c</InlineCode></td><td className="p-3 border border-gray-300">Path to configuration file (default: <InlineCode>./aegis.config.json</InlineCode>)</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--verbose</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-v</InlineCode></td><td className="p-3 border border-gray-300">Display individual test results with test suite hierarchy</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--debug</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-d</InlineCode></td><td className="p-3 border border-gray-300">Enable debug mode with detailed MCP communication logging</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--timing</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-t</InlineCode></td><td className="p-3 border border-gray-300">Show timing information for tests and operations</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--json</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-j</InlineCode></td><td className="p-3 border border-gray-300">Output results in JSON format for CI/automation</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--quiet</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-q</InlineCode></td><td className="p-3 border border-gray-300">Suppress non-essential output (opposite of verbose)</td></tr>
                    </tbody>
                </table>
            </div>
            <H3 id="advanced-cli-options">Advanced & Error-Focused Flags</H3>
            <p>Use these flags to focus on failures, control analysis depth, and manage output volume:</p>
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border border-gray-300">Option</th>
                    <th className="text-left p-2 border border-gray-300">Description</th>
                    <th className="text-left p-2 border border-gray-300">Notes / Interactions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-300"><InlineCode>--errors-only</InlineCode></td>
                    <td className="p-2 border border-gray-300">Show only failing tests (hides passes)</td>
                    <td className="p-2 border border-gray-300">Incompatible with <InlineCode>--verbose</InlineCode></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300"><InlineCode>--group-errors</InlineCode></td>
                    <td className="p-2 border border-gray-300">Group identical failures to reduce repetition</td>
                    <td className="p-2 border border-gray-300">Great with <InlineCode>--errors-only</InlineCode> for large suites</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300"><InlineCode>--syntax-only</InlineCode></td>
                    <td className="p-2 border border-gray-300">Only perform pattern/YAML syntax analysis (no execution)</td>
                    <td className="p-2 border border-gray-300">Mutually exclusive with <InlineCode>--no-analysis</InlineCode></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300"><InlineCode>--no-analysis</InlineCode></td>
                    <td className="p-2 border border-gray-300">Disable deep pattern diagnostics (faster, minimal errors)</td>
                    <td className="p-2 border border-gray-300">Mutually exclusive with <InlineCode>--syntax-only</InlineCode></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300"><InlineCode>--max-errors &lt;n&gt;</InlineCode></td>
                    <td className="p-2 border border-gray-300">Limit number of reported errors (default 5)</td>
                    <td className="p-2 border border-gray-300">Use higher during triage: <InlineCode>--max-errors 20</InlineCode></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300"><InlineCode>--concise</InlineCode></td>
                    <td className="p-2 border border-gray-300">Compact output (suppresses extra spacing & headers)</td>
                    <td className="p-2 border border-gray-300">Pairs well with <InlineCode>--errors-only</InlineCode></td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300"><InlineCode>--json</InlineCode></td>
                    <td className="p-2 border border-gray-300">Structured machine-readable output</td>
                    <td className="p-2 border border-gray-300">Disables verbose output for cleanliness</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <H3 id="json-grouping">JSON Output & Grouping</H3>
            <p>The <InlineCode>--json</InlineCode> flag emits a structured object suitable for CI parsing. When combined with <InlineCode>--group-errors</InlineCode>, the JSON includes an <InlineCode>errorGroups</InlineCode> array that consolidates repeated failures:</p>
            <CodeBlock language="json" code={`{
  "summary": {"passed": 18, "failed": 3, "durationMs": 742},
  "tests": [
    {"id": "tools-1", "status": "passed"},
    {"id": "exec-1", "status": "failed", "errorGroupId": 1}
  ],
  "errorGroups": [
    {
      "id": 1,
      "count": 3,
      "message": "Pattern mismatch: tools[0].name",
      "firstTestId": "exec-1"
    }
  ]
}`} />
            <p><strong>Tip:</strong> Use <InlineCode>--errors-only --group-errors --json --max-errors 50</InlineCode> for high-signal CI logs on large suites.</p>

            <H3 id="output-examples">Output Examples</H3>
            <p><strong>Verbose Output (<InlineCode>--verbose</InlineCode>):</strong></p>
            <CodeBlock language="bash" code={`
📋 Test Results Hierarchy:

📁 Calculator Tests (15ms)
   tests/calculator.test.mcp.yml

  ✓ should perform addition (2ms)
  ✓ should handle division
  ✗ should validate input (1ms)
            `} />

            <p><strong>Debug Output (<InlineCode>--debug</InlineCode>):</strong></p>
            <CodeBlock language="bash" code={`
📡 [MCP SEND] → tools/call
    {
      "jsonrpc": "2.0",
      "id": "calc-1",
      "method": "tools/call",
      "params": {
        "name": "calculator",
        "arguments": { "a": 15, "b": 27 }
      }
    }
📡 [MCP RECV] ← response
    {
      "jsonrpc": "2.0",
      "id": "calc-1", 
      "result": {
        "content": [{"type": "text", "text": "Result: 42"}]
      }
    }
            `} />

            <Section id="test-file-structure">
                <H2 id="file-structure">📁 Test File Structure</H2>
                <p className="mb-6 text-lg text-gray-700">
                    YAML test files follow a consistent, predictable structure that makes them easy to read and maintain.
                </p>
                
                <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Basic Structure</h3>
                    <CodeBlock language="yaml" code={`description: "Human-readable test suite description"
tests:
  - it: "Individual test case description"
    request:
      jsonrpc: "2.0"
      id: "unique-test-identifier"
      method: "tools/list|tools/call|initialize"
      params:
        # Method-specific parameters
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-test-identifier"
        result:
          # Expected response structure
      stderr: "toBeEmpty"  # Optional stderr validation`} />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <h4 className="font-semibold text-green-800 mb-3">✅ Required Fields</h4>
                        <ul className="space-y-2 text-sm">
                            <li><strong><InlineCode>description</InlineCode>:</strong> Test suite description</li>
                            <li><strong><InlineCode>tests</InlineCode>:</strong> Array of test cases</li>
                            <li><strong><InlineCode>it</InlineCode>:</strong> What the test validates</li>
                            <li><strong><InlineCode>request</InlineCode>:</strong> JSON-RPC request to send</li>
                            <li><strong><InlineCode>expect</InlineCode>:</strong> Expected response structure</li>
                        </ul>
                    </div>

                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <h4 className="font-semibold text-blue-800 mb-3">🔧 Optional Fields</h4>
                        <ul className="space-y-2 text-sm">
                            <li><strong><InlineCode>stderr</InlineCode>:</strong> Expected stderr output</li>
                            <li><strong><InlineCode>timeout</InlineCode>:</strong> Custom timeout (ms)</li>
                            <li><strong><InlineCode>skip</InlineCode>:</strong> Skip test (debugging)</li>
                            <li><strong><InlineCode>only</InlineCode>:</strong> Run only this test</li>
                        </ul>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Use unique IDs for each test to avoid conflicts</li>
                        <li>• Include <InlineCode>stderr: "toBeEmpty"</InlineCode> for clean tests</li>
                        <li>• Group related tests in the same file</li>
                        <li>• Use descriptive test names that explain the expected behavior</li>
                    </ul>
                </div>

                <H3 id="naming-conventions">📝 Naming Conventions</H3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-gray-800 mb-2">File Names</h4>
                        <CodeBlock language="text" code={`✅ Good:
filesystem.test.mcp.yml
multi-tool.test.mcp.yml
api-testing.test.mcp.yml

❌ Avoid:
test.yml
mytest.yaml
server_test.yml`} />
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-gray-800 mb-2">Test IDs</h4>
                        <CodeBlock language="text" code={`✅ Good:
"list-1", "exec-1", "error-1"
"calc-add", "calc-div"
"fs-read", "fs-write"

❌ Avoid:
"1", "test", "t1"
"abc", "xyz"`} />
                    </div>
                </div>
            </Section>
            
            <Section id="pattern-matching-overview">
                <H2 id="pattern-matching">🎯 Pattern Matching Power</H2>
                <p className="mb-6 text-lg text-gray-700">
                    YAML testing becomes powerful through pattern matching - flexible validation that adapts to dynamic server responses.
                </p>
                
                <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Why Pattern Matching?</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-red-800 mb-2">❌ Brittle Testing</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>• Exact text matching breaks on version changes</p>
                                <p>• Hard-coded array lengths fail with updates</p>
                                <p>• Server timestamps cause test flakiness</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-800 mb-2">✅ Flexible Validation</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>• <InlineCode>"match:contains:success"</InlineCode> - partial text</p>
                                <p>• <InlineCode>"match:arrayLength:3"</InlineCode> - exact counts</p>
                                <p>• <InlineCode>"match:regex:\\d{4}-\\d{2}-\\d{2}"</InlineCode> - date formats</p>
                            </div>
                        </div>
                    </div>
                </div>

                <H3 id="essential-patterns">Essential Patterns</H3>
                <p className="mb-4 text-gray-700">Master these 6 patterns to handle 90% of your testing needs:</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-blue-800 mb-2">🔢 Array Validation</h4>
                        <CodeBlock language="yaml" code={`# Exact length
tools: "match:arrayLength:3"

# All elements have structure
tools:
  match:arrayElements:
    name: "match:type:string"
    description: "match:regex:.{10,}"

# Contains specific item
toolNames: "match:arrayContains:read_file"`} />
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-green-800 mb-2">📝 String Validation</h4>
                        <CodeBlock language="yaml" code={`# Contains text
message: "match:contains:success"

# Starts/ends with
filename: "match:startsWith:data_"
extension: "match:endsWith:.json"

# Pattern matching
version: "match:regex:v\\d+\\.\\d+\\.\\d+"`} />
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-purple-800 mb-2">🎯 Field Extraction</h4>
                        <CodeBlock language="yaml" code={`# Extract all tool names
result:
  match:extractField: "tools.*.name"
  value:
    - "calculator"
    - "text_processor"

# Extract with validation
match:extractField: "content.*.type"
value: "match:arrayContains:text"`} />
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-orange-800 mb-2">📋 Partial Matching</h4>
                        <CodeBlock language="yaml" code={`# Only validate specific fields
result:
  match:partial:
    tools:
      - name: "read_file"
        description: "match:contains:file"
    # Ignores other response fields`} />
                    </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                        <strong>💡 Pro Tip:</strong> See the complete <Link to="/pattern-matching/overview" className="underline">Pattern Matching Reference</Link> 
                        {' '}for all 50+ patterns including numeric, date, cross-field, and negation patterns.
                    </p>
                </div>
            </Section>

            <Section id="common-test-patterns">
                <H2 id="common-patterns">📋 Common Test Patterns</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Ready-to-use test patterns based on real-world MCP server implementations from our 
                    <Link to="/examples" className="text-blue-600 hover:text-blue-800 underline"> examples directory</Link>.
                </p>

                <div className="space-y-8">
                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <H3 id="tool-discovery">🔍 1. Tool Discovery</H3>
                        <p className="text-sm text-gray-600 mb-4">Validate that your server exposes tools correctly with proper schemas.</p>
                        <CodeBlock language="yaml" code={`description: "Tool discovery validation"
tests:
  - it: "should list available tools with proper structure"
    request:
      jsonrpc: "2.0"
      id: "list-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "list-1"
        result:
          tools:
            match:arrayElements:
              name: "match:regex:^[a-z][a-z0-9_]*$"    # snake_case validation
              description: "match:regex:.{10,}"         # Min 10 chars
              inputSchema:
                type: "object"
                properties: "match:type:object"
                required: "match:type:array"
      stderr: "toBeEmpty"`} />
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                            <p className="text-blue-800">✨ <strong>Real Example:</strong> From <code>examples/filesystem-server/filesystem.test.mcp.yml</code></p>
                        </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <H3 id="tool-execution">⚡ 2. Tool Execution</H3>
                        <p className="text-sm text-gray-600 mb-4">Test actual tool functionality with flexible response validation.</p>
                        <CodeBlock language="yaml" code={`  - it: "should execute read_file tool successfully"
    request:
      jsonrpc: "2.0"
      id: "exec-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "../shared-test-data/hello.txt"
    expect:
      response:
        jsonrpc: "2.0"
        id: "exec-1"
        result:
          content:
            - type: "text"
              text: "Hello, MCP Aegis!"      # Exact match for demo
          isError: false
      stderr: "toBeEmpty"`} />
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                            <p className="text-green-800">🎯 <strong>Flexible Version:</strong> Use <code>"match:contains:Hello"</code> for partial text matching</p>
                        </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <H3 id="error-handling">❌ 3. Error Handling</H3>
                        <p className="text-sm text-gray-600 mb-4">Ensure your server handles invalid inputs gracefully.</p>
                        <CodeBlock language="yaml" code={`  - it: "should handle non-existent file gracefully"
    request:
      jsonrpc: "2.0"
      id: "error-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "nonexistent.txt"
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-1"
        result:
          content:
            - type: "text"
              text: "match:contains:not found"   # Flexible error message
          isError: true
      stderr: "toBeEmpty"`} />
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <H3 id="multi-tool-validation">🛠️ 4. Multi-Tool Validation</H3>
                        <p className="text-sm text-gray-600 mb-4">Test complex servers with multiple tools efficiently.</p>
                        <CodeBlock language="yaml" code={`  - it: "should have exactly 4 tools with proper naming"
    request:
      jsonrpc: "2.0"
      id: "multi-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools: "match:arrayLength:4"          # Exact count
        
  - it: "should extract all tool names correctly"
    request:
      jsonrpc: "2.0"
      id: "multi-2"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          match:extractField: "tools.*.name"    # Extract all names
          value:
            - "calculator"
            - "text_processor"
            - "data_validator"
            - "file_manager"`} />
                        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded text-sm">
                            <p className="text-purple-800">🚀 <strong>Real Example:</strong> From <code>examples/multi-tool-server/multi-tool.test.mcp.yml</code></p>
                        </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg bg-white">
                        <H3 id="advanced-validation">🎯 5. Advanced Response Validation</H3>
                        <p className="text-sm text-gray-600 mb-4">Use partial matching and complex patterns for sophisticated validation.</p>
                        <CodeBlock language="yaml" code={`  - it: "should validate calculator response structure"
    request:
      jsonrpc: "2.0"
      id: "calc-1"
      method: "tools/call"
      params:
        name: "calculator"
        arguments:
          operation: "add"
          a: 15
          b: 27
    expect:
      response:
        result:
          match:partial:                        # Only validate these fields
            content:
              - type: "text"
                text: "match:regex:Result: \\d+"  # "Result: 42"
            isError: false
      stderr: "toBeEmpty"`} />
                    </div>
                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 text-center">
                        <div className="text-2xl mb-2">📚</div>
                        <h4 className="font-semibold text-blue-800 mb-2">More Examples</h4>
                        <p className="text-sm text-gray-600 mb-3">See complete test suites in action</p>
                        <button
                            type="button"
                            onClick={() => goTo('/examples')}
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >View Examples →</button>
                    </div>
                    <div className="p-4 border border-green-200 rounded-lg bg-green-50 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h4 className="font-semibold text-green-800 mb-2">Pattern Guide</h4>
                        <p className="text-sm text-gray-600 mb-3">Master all 50+ pattern types</p>
                        <button
                            type="button"
                            onClick={() => goTo('/pattern-matching/overview')}
                            className="text-green-600 hover:text-green-800 underline text-sm"
                        >Learn Patterns →</button>
                    </div>
                    <div className="p-4 border border-purple-200 rounded-lg bg-purple-50 text-center">
                        <div className="text-2xl mb-2">🤖</div>
                        <h4 className="font-semibold text-purple-800 mb-2">AI Support</h4>
                        <p className="text-sm text-gray-600 mb-3">Get AI assistance for test generation</p>
                        <button
                            type="button"
                            onClick={() => goTo('/ai-agent-support')}
                            className="text-purple-600 hover:text-purple-800 underline text-sm"
                        >AI Agents →</button>
                    </div>
                </div>
            </Section>

            <Section id="best-practices">
                <H2 id="best-practices">🎯 Best Practices</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Follow these proven practices to write maintainable, reliable YAML tests.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-green-200 rounded-lg bg-green-50">
                        <h3 className="font-semibold text-green-800 mb-4">✅ Do This</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <div>
                                    <strong>Use descriptive test names:</strong><br />
                                    <InlineCode>"should list 3 available tools"</InlineCode>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <div>
                                    <strong>Include initialization tests:</strong><br />
                                    Test MCP handshake before tools
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <div>
                                    <strong>Test both success and error scenarios:</strong><br />
                                    Validate error handling paths
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">✓</span>
                                <div>
                                    <strong>Use pattern matching:</strong><br />
                                    Avoid brittle exact matches
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                        <h3 className="font-semibold text-red-800 mb-4">❌ Avoid This</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">✗</span>
                                <div>
                                    <strong>Hard-coded exact text:</strong><br />
                                    <InlineCode>"Error: File not found at /tmp/xyz"</InlineCode>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">✗</span>
                                <div>
                                    <strong>Non-unique test IDs:</strong><br />
                                    Multiple tests with <InlineCode>id: "test-1"</InlineCode>
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">✗</span>
                                <div>
                                    <strong>Missing error validation:</strong><br />
                                    Not testing invalid inputs
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">✗</span>
                                <div>
                                    <strong>Duplicate YAML keys:</strong><br />
                                    YAML silently overwrites duplicates
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <H3 id="test-organization">📂 Test Organization</H3>
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                    <CodeBlock language="text" code={`project/
├── test/mcp/yaml/
│   ├── basic-functionality.test.mcp.yml    # Core features
│   ├── error-handling.test.mcp.yml         # Error scenarios  
│   ├── performance.test.mcp.yml            # Performance tests
│   └── edge-cases.test.mcp.yml             # Boundary conditions
└── aegis.config.json                   # Server configuration`} />
                </div>

                <H3 id="pattern-selection">🎯 Pattern Selection Guide</H3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-3 border border-gray-300">Use Case</th>
                                <th className="text-left p-3 border border-gray-300">Pattern</th>
                                <th className="text-left p-3 border border-gray-300">Example</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td className="p-3 border border-gray-300">Tool count validation</td><td className="p-3 border border-gray-300"><InlineCode>arrayLength</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>"match:arrayLength:3"</InlineCode></td></tr>
                            <tr><td className="p-3 border border-gray-300">Success messages</td><td className="p-3 border border-gray-300"><InlineCode>contains</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>"match:contains:success"</InlineCode></td></tr>
                            <tr><td className="p-3 border border-gray-300">Version strings</td><td className="p-3 border border-gray-300"><InlineCode>regex</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>"match:regex:v\\d+\\.\\d+"</InlineCode></td></tr>
                            <tr><td className="p-3 border border-gray-300">Tool name extraction</td><td className="p-3 border border-gray-300"><InlineCode>extractField</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>"tools.*.name"</InlineCode></td></tr>
                            <tr><td className="p-3 border border-gray-300">Schema validation</td><td className="p-3 border border-gray-300"><InlineCode>arrayElements</InlineCode></td><td className="p-3 border border-gray-300">Validate all tool structures</td></tr>
                        </tbody>
                    </table>
                </div>
            </Section>

            <Section id="troubleshooting">
                <H2 id="troubleshooting">🛠️ Troubleshooting Guide</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Quick solutions to common YAML testing issues and debugging techniques.
                </p>

                <div className="space-y-6">
                    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                        <H3 id="yaml-structure-issues">⚠️ YAML Structure Issues</H3>
                        <div className="mb-4">
                            <h4 className="font-semibold text-red-800 mb-2">Common Mistakes</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong className="text-red-700">❌ Duplicate Keys</strong>
                                    <CodeBlock language="yaml" code={`result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # OVERWRITES previous!`} />
                                </div>
                                <div>
                                    <strong className="text-green-700">✅ Solution</strong>
                                    <CodeBlock language="yaml" code={`# Separate tests for different validations
- it: "should have correct array length"
  expect:
    response:
      result:
        tools: "match:arrayLength:1"`} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <h4 className="font-semibold text-red-800 mb-2">Critical Guidelines</h4>
                            <ul className="text-sm space-y-1">
                                <li>• <strong>Consistent indentation:</strong> Use 2 spaces, no tabs</li>
                                <li>• <strong>Quote patterns:</strong> Always quote <InlineCode>match:*</InlineCode> patterns</li>
                                <li>• <strong>Escape regex:</strong> Use <InlineCode>\\d+</InlineCode> not <InlineCode>\d+</InlineCode></li>
                                <li>• <strong>Unique keys:</strong> No duplicate keys in same object</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-6 border border-orange-200 rounded-lg bg-orange-50">
                        <H3 id="pattern-debugging">🔍 Pattern Debugging</H3>
                        <div className="mb-4">
                            <h4 className="font-semibold text-orange-800 mb-2">Problem: Pattern Mismatch</h4>
                            <p className="text-sm text-orange-700 mb-2">
                                <strong>Error:</strong> Pattern did not match: expected "match:regex:..." but got "..."
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="font-semibold text-orange-800 mb-2">🔧 Debug Steps</h5>
                                <ol className="text-sm space-y-2">
                                    <li><strong>1. Use --debug flag:</strong><br />
                                        <InlineCode>aegis test.yml --debug</InlineCode></li>
                                    <li><strong>2. Check actual response:</strong><br />
                                        Look at the JSON-RPC output</li>
                                    <li><strong>3. Validate YAML syntax:</strong><br />
                                        Use online YAML validators</li>
                                    <li><strong>4. Test incrementally:</strong><br />
                                        Start simple, add complexity</li>
                                </ol>
                            </div>
                            <div>
                                <h5 className="font-semibold text-orange-800 mb-2">🎯 Quick Fixes</h5>
                                <div className="text-sm space-y-2">
                                    <div>
                                        <strong>Regex escaping:</strong><br />
                                        <InlineCode>"match:regex:\\\\d+"</InlineCode> ← Double escape
                                    </div>
                                    <div>
                                        <strong>String contains:</strong><br />
                                        Use <InlineCode>"match:contains:text"</InlineCode> for partial matches
                                    </div>
                                    <div>
                                        <strong>Array validation:</strong><br />
                                        Check array vs object mismatch
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
                        <H3 id="server-connection-issues">🔌 Server Connection Issues</H3>
                        <div className="mb-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Problem: Connection Timeout</h4>
                            <p className="text-sm text-blue-700 mb-2">
                                <strong>Error:</strong> Server failed to start or connection timeout
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="font-semibold text-blue-800 mb-2">🔧 Solutions</h5>
                                <ol className="text-sm space-y-2">
                                    <li><strong>1. Check configuration:</strong><br />
                                        Verify <InlineCode>command</InlineCode> and <InlineCode>args</InlineCode></li>
                                    <li><strong>2. Increase timeout:</strong><br />
                                        Add <InlineCode>"startupTimeout": 10000</InlineCode></li>
                                    <li><strong>3. Add ready pattern:</strong><br />
                                        Use <InlineCode>"readyPattern": "Server ready"</InlineCode></li>
                                    <li><strong>4. Check server logs:</strong><br />
                                        Use <InlineCode>--debug</InlineCode> to see stderr</li>
                                </ol>
                            </div>
                            <div>
                                <h5 className="font-semibold text-blue-800 mb-2">📝 Config Example</h5>
                                <CodeBlock language="json" code={`{
  "name": "My Server",
  "command": "node",
  "args": ["server.js"],
  "startupTimeout": 10000,
  "readyPattern": "Server listening"
}`} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border border-purple-200 rounded-lg bg-purple-50">
                        <H3 id="common-anti-patterns">🚨 Common Anti-Patterns</H3>
                        <div className="grid md:grid-cols-1 gap-4">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-purple-300 text-sm">
                                    <thead className="bg-purple-100">
                                        <tr>
                                            <th className="text-left p-3 border border-purple-300">Anti-Pattern</th>
                                            <th className="text-left p-3 border border-purple-300">Problem</th>
                                            <th className="text-left p-3 border border-purple-300">Solution</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-3 border border-purple-300">Exact text matching</td>
                                            <td className="p-3 border border-purple-300">Breaks on updates</td>
                                            <td className="p-3 border border-purple-300">Use <InlineCode>match:contains</InlineCode></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-purple-300">Missing stderr validation</td>
                                            <td className="p-3 border border-purple-300">Ignores errors</td>
                                            <td className="p-3 border border-purple-300">Add <InlineCode>stderr: "toBeEmpty"</InlineCode></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-purple-300">Non-unique test IDs</td>
                                            <td className="p-3 border border-purple-300">Conflicts</td>
                                            <td className="p-3 border border-purple-300">Use descriptive unique IDs</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-purple-300">Complex nested patterns</td>
                                            <td className="p-3 border border-purple-300">Hard to debug</td>
                                            <td className="p-3 border border-purple-300">Split into separate tests</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Need More Help?</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <button
                            type="button"
                            onClick={() => goTo('/pattern-matching/overview')}
                            className="p-4 border border-indigo-200 rounded-lg bg-white hover:bg-indigo-50 transition-colors text-center"
                        >
                            <div className="text-2xl mb-2">📖</div>
                            <div className="font-semibold text-indigo-800">Pattern Guide</div>
                            <div className="text-xs text-gray-600">Complete pattern reference</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo('/examples')}
                            className="p-4 border border-green-200 rounded-lg bg-white hover:bg-green-50 transition-colors text-center"
                        >
                            <div className="text-2xl mb-2">💡</div>
                            <div className="font-semibold text-green-800">Examples</div>
                            <div className="text-xs text-gray-600">Working test suites</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo('/troubleshooting')}
                            className="p-4 border border-purple-200 rounded-lg bg-white hover:bg-purple-50 transition-colors text-center"
                        >
                            <div className="text-2xl mb-2">🛠️</div>
                            <div className="font-semibold text-purple-800">Advanced Debug</div>
                            <div className="text-xs text-gray-600">Detailed troubleshooting</div>
                        </button>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default YamlTestingPage;