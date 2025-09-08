import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import SEOHead from '../../hooks/useSEO';

const PatternMatchingOverviewPage: React.FC = () => {
    return (
        <>
            <SEOHead 
                title="Pattern Matching Overview - MCP Conductor"
                description="Master 11+ advanced pattern matching capabilities for Model Context Protocol testing. Production-verified patterns for flexible MCP server validation with regex, arrays, objects, and field extraction."
                keywords="MCP pattern matching, Model Context Protocol patterns, MCP validation patterns, regex patterns MCP, array patterns, object field patterns, MCP test validation"
                canonical="https://conductor.rhino-inquisitor.com/#/pattern-matching/overview"
                ogTitle="MCP Conductor Pattern Matching - Advanced MCP Server Validation"
                ogDescription="Complete guide to 11+ pattern matching capabilities for Model Context Protocol testing. Production-verified patterns for flexible and powerful MCP server validation."
                ogUrl="https://conductor.rhino-inquisitor.com/#/pattern-matching/overview"
            />
            <H1 id="pattern-matching-overview">Pattern Matching Overview</H1>
            <PageSubtitle>Advanced MCP Server Validation Patterns</PageSubtitle>
            <p>MCP Conductor provides <strong>11+ verified pattern matching capabilities</strong> for flexible and powerful Model Context Protocol test validation. All patterns are <strong>production-verified</strong> with real MCP servers including Simple Filesystem Server, Multi-Tool Server, and production APIs.</p>
            
            <p>Patterns allow you to validate the structure and content of server responses without needing to match exact, brittle values. This is especially useful for dynamic data like IDs, timestamps, error messages, or arrays with varying content.</p>

            <H2 id="complete-pattern-reference">🎯 Complete Pattern Reference</H2>
            <p>All patterns use the <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">"match:type:value"</code> syntax and are <strong>production-ready</strong>:</p>

            <H3 id="pattern-table">Pattern Types</H3>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Pattern</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Syntax</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                            <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Deep Equality</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">(no prefix)</td>
                            <td className="border border-gray-300 px-4 py-2">Exact value matching</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Type Validation</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:type:string"</td>
                            <td className="border border-gray-300 px-4 py-2">Data type checking</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Contains</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:contains:text"</td>
                            <td className="border border-gray-300 px-4 py-2">Substring validation</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Starts With</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:startsWith:prefix"</td>
                            <td className="border border-gray-300 px-4 py-2">Prefix validation</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Ends With</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:endsWith:suffix"</td>
                            <td className="border border-gray-300 px-4 py-2">Suffix validation</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Regex</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:regex:pattern"</td>
                            <td className="border border-gray-300 px-4 py-2">Complex string patterns</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Array Length</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:arrayLength:N"</td>
                            <td className="border border-gray-300 px-4 py-2">Array size validation</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Array Elements</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">match:arrayElements:</td>
                            <td className="border border-gray-300 px-4 py-2">All elements match pattern</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Array Contains</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:arrayContains:value"</td>
                            <td className="border border-gray-300 px-4 py-2">Element existence check</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Field Extraction</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">match:extractField: "path"</td>
                            <td className="border border-gray-300 px-4 py-2">Extract nested values</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Partial Match</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">match:partial:</td>
                            <td className="border border-gray-300 px-4 py-2">Selective field validation</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">Exists</td>
                            <td className="border border-gray-300 px-4 py-2 font-mono text-sm">"match:exists"</td>
                            <td className="border border-gray-300 px-4 py-2">Field presence check</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">✅</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <H2 id="production-examples">🏆 Production Usage Examples</H2>
            <p>All patterns demonstrated with <strong>verified production examples</strong>:</p>

            <H3 id="filesystem-server-examples">Simple Filesystem Server</H3>
            <CodeBlock language="yaml" code={`
# ✅ Type validation - ensures response structure  
result:
  tools: "match:type:array"                # Tools field is array
  isError: "match:type:boolean"            # Error field is boolean

# ✅ Array length validation - exact count
result:
  tools: "match:arrayLength:1"             # Exactly 1 tool

# ✅ String patterns - flexible content matching
result:
  content:
    - type: "text"
      text: "match:startsWith:Hello"       # Starts with "Hello"
      
# ✅ Field extraction - nested data validation  
result:
  match:extractField: "tools.*.name"      # Extract all tool names
  value:
    - "read_file"                          # Expected tool name
`} />

            <H3 id="complex-pattern-examples">Complex Pattern Combinations</H3>
            <CodeBlock language="yaml" code={`
# ✅ Array elements validation - all elements match pattern
result:
  tools:
    match:arrayElements:
      name: "match:type:string"            # All tools have string names
      description: "match:contains:file"   # All descriptions mention "file"
      inputSchema: "match:type:object"     # All schemas are objects

# ✅ Regex patterns - advanced string validation
result:
  content:
    - type: "text"
      text: "match:regex:\\\\d+"           # Contains numbers
      
# ✅ Partial matching - selective validation
result:
  match:partial:
    tools:
      - name: "read_file"                  # Must have this tool
        description: "match:contains:Reads" # Description mentions "Reads"
  # Other fields ignored for flexibility
`} />

            <H2 id="pattern-categories">📚 Pattern Categories</H2>
            <p>Explore each category for comprehensive documentation and production-verified examples:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                        <a href="#/pattern-matching/basic-patterns" className="text-blue-600 hover:text-blue-800">Basic Patterns</a>
                    </h4>
                    <p className="text-gray-600 text-sm">Deep equality, type validation, field existence checks. Foundation patterns for basic validation.</p>
                    <ul className="text-sm text-gray-500 mt-2">
                        <li>• Deep equality matching</li>
                        <li>• Type validation (string, number, boolean, etc.)</li>
                        <li>• Existence checks</li>
                    </ul>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                        <a href="#/pattern-matching/string-patterns" className="text-blue-600 hover:text-blue-800">String Patterns</a>
                    </h4>
                    <p className="text-gray-600 text-sm">Contains, startsWith, endsWith. Essential for flexible text validation.</p>
                    <ul className="text-sm text-gray-500 mt-2">
                        <li>• Substring matching (contains)</li>
                        <li>• Prefix validation (startsWith)</li>
                        <li>• Suffix validation (endsWith)</li>
                    </ul>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                        <a href="#/pattern-matching/array-patterns" className="text-blue-600 hover:text-blue-800">Array Patterns</a>
                    </h4>
                    <p className="text-gray-600 text-sm">Array length, element structure, contains validation. Critical for list data.</p>
                    <ul className="text-sm text-gray-500 mt-2">
                        <li>• Array length validation</li>
                        <li>• Element structure matching</li>
                        <li>• Array contains validation</li>
                    </ul>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                        <a href="#/pattern-matching/regex-patterns" className="text-blue-600 hover:text-blue-800">Regex Patterns</a>
                    </h4>
                    <p className="text-gray-600 text-sm">Full regular expression support. Ultimate flexibility for complex text patterns.</p>
                    <ul className="text-sm text-gray-500 mt-2">
                        <li>• Email/URL validation</li>
                        <li>• Date/time patterns</li>
                        <li>• Custom format validation</li>
                    </ul>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg md:col-span-2">
                    <h4 className="text-lg font-semibold mb-2">
                        <a href="#/pattern-matching/object-field-patterns" className="text-blue-600 hover:text-blue-800">Object & Field Patterns</a>
                    </h4>
                    <p className="text-gray-600 text-sm">Field extraction, partial matching, nested validation. Advanced patterns for complex object structures.</p>
                    <ul className="text-sm text-gray-500 mt-2 grid grid-cols-2 gap-x-4">
                        <li>• Field extraction with dot notation</li>
                        <li>• Partial object matching</li>
                        <li>• Nested structure validation</li>
                        <li>• Wildcard array processing</li>
                    </ul>
                </div>
            </div>

            <H2 id="debugging-patterns">🔧 Debugging Pattern Issues</H2>
            <p>Use MCP Conductor's built-in debugging capabilities:</p>
            <CodeBlock language="bash" code={`
# Show detailed pattern matching results
conductor tests.yml --config config.json --verbose

# Show MCP communication and pattern evaluation
conductor tests.yml --config config.json --debug

# Complete debugging information
conductor tests.yml --config config.json --verbose --debug --timing
`} />

            <H2 id="best-practices">✨ Pattern Best Practices</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Start simple:</strong> Use deep equality first, add patterns as needed</li>
                <li><strong>Test incrementally:</strong> Add one pattern type per test case</li>
                <li><strong>Avoid brittle tests:</strong> Use patterns for dynamic data like timestamps</li>
                <li><strong>Document complex patterns:</strong> Add comments explaining regex or field paths</li>
                <li><strong>Use debug mode:</strong> Always verify actual vs expected structure</li>
                <li><strong>Separate concerns:</strong> One validation concept per test case</li>
            </ul>

            <H2 id="anti-patterns">⚠️ Common Anti-Patterns</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>❌ Duplicate YAML keys:</strong> Avoid multiple pattern keys in same object</li>
                <li><strong>❌ Over-specification:</strong> Don't match every field when partial matching suffices</li>
                <li><strong>❌ Mixed patterns:</strong> Don't combine arrayElements with direct array structure</li>
                <li><strong>❌ Wrong escaping:</strong> Remember double backslashes in YAML for regex</li>
                <li><strong>❌ Brittle exact matching:</strong> Use patterns for dynamic content</li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-900 mb-2">🎯 Production Ready</h4>
                <p className="text-green-800">All 11+ patterns have been extensively tested with:</p>
                <ul className="text-green-800 mt-2 space-y-1">
                    <li>• <strong>Simple Filesystem Server:</strong> 47 test cases covering all pattern types</li>
                    <li>• <strong>Multi-Tool Server:</strong> 20 complex validation scenarios</li>
                    <li>• <strong>Production MCP Servers:</strong> Real-world API testing and validation</li>
                    <li>• <strong>100% Test Coverage:</strong> All patterns verified with comprehensive test suites</li>
                </ul>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">🚀 Get Started</h4>
                <ul className="space-y-2 text-blue-800">
                    <li>• <a href="#/quick-start" className="text-blue-600 hover:text-blue-800 underline">Quick Start Guide</a> - Set up your first pattern-based tests</li>
                    <li>• <a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Real-world pattern usage in production</li>
                    <li>• <a href="#/yaml-testing" className="text-blue-600 hover:text-blue-800 underline">YAML Testing</a> - Complete YAML test file documentation</li>
                </ul>
            </div>
        </>
    );
};

export default PatternMatchingOverviewPage;