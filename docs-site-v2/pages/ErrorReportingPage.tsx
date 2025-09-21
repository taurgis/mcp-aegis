import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { SITE_DATES } from '../constants';

const ErrorReportingPage: React.FC = () => {
    const errorReportingStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Advanced Error Reporting - MCP Aegis",
        "description": "Comprehensive guide to MCP Aegis's advanced error reporting system. Learn to analyze test failures, debug validation errors, and optimize Model Context Protocol server testing with detailed error insights.",
        "author": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "publisher": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "datePublished": SITE_DATES.PUBLISHED,
        "dateModified": SITE_DATES.MODIFIED,
        "url": "https://aegis.rhino-inquisitor.com/error-reporting",
        "mainEntity": {
            "@type": "Guide",
            "name": "MCP Aegis Error Reporting Guide"
        }
    };

    return (
        <>
            <SEO 
                title="Advanced Error Reporting"
                description="Comprehensive guide to MCP Aegis's advanced error reporting system. Learn to analyze test failures, debug validation errors, and optimize Model Context Protocol server testing with detailed error insights."
                keywords="MCP Aegis error reporting, MCP testing errors, Model Context Protocol debugging, MCP validation errors, MCP test failures, MCP debugging guide"
                canonical="/error-reporting"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Error Reporting", url: "/error-reporting" }
            ]} />
            <StructuredData structuredData={errorReportingStructuredData} />

            <Head>
                <title>Advanced Error Reporting - MCP Aegis</title>
            </Head>
            
            <H1 id="advanced-error-reporting">Advanced Error Reporting</H1>
            <PageSubtitle>Detailed Test Failure Analysis & Debugging</PageSubtitle>
            <p>MCP Aegis provides comprehensive error reporting with detailed validation analysis, precise error locations, and actionable suggestions to help you quickly identify and fix test issues.</p>

            <H2 id="enhanced-validation-system">🔍 Enhanced Validation System</H2>
            <p>When tests fail, MCP Aegis's enhanced validation system provides:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>✅ <strong>Precise Error Locations</strong> - Exact path to the failing validation (e.g., <InlineCode>response.result.tools[0].inputSchema.required</InlineCode>)</li>
                <li>✅ <strong>Error Categorization</strong> - Structured error types for better understanding</li>
                <li>✅ <strong>Actionable Suggestions</strong> - Specific recommendations for fixing each error</li>
                <li>✅ <strong>Value Previews</strong> - Shows expected vs actual values with intelligent truncation</li>
                <li>✅ <strong>Error Grouping</strong> - Similar errors are grouped with counts for clarity</li>
                <li>✅ <strong>Top Recommendations</strong> - Prioritized suggestions based on error frequency</li>
            </ul>

            <H2 id="error-types">📊 Error Types & Categories</H2>
            <p>MCP Aegis categorizes validation errors into specific types to help you understand exactly what went wrong:</p>

            <H3 id="structural-errors">Structural Errors</H3>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <h4 className="font-semibold text-red-800">Missing Field Errors</h4>
                <p className="text-red-700">When expected fields are missing from the server response.</p>
            </div>

            <CodeBlock language="yaml" code={`
# ❌ Test expects 'name' field but server doesn't provide it
expect:
  response:
    result:
      tool:
        name: "read_file"  # Expected but missing
        description: "Reads files"
`} />

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                <h4 className="font-semibold text-orange-800">Extra Field Errors</h4>
                <p className="text-orange-700">When server returns fields not specified in expectations (only for exact matching).</p>
            </div>

            <CodeBlock language="yaml" code={`
# ❌ Server returns extra 'version' field not in expectations
# Server Response: {"name": "read_file", "version": "1.0"}
expect:
  response:
    result:
      tool:
        name: "read_file"  # Missing 'version' in expectations
`} />

            <H3 id="validation-errors">Validation Errors</H3>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
                <h4 className="font-semibold text-purple-800">Pattern Failed Errors</h4>
                <p className="text-purple-700">When pattern matching validation fails (regex, length, type, etc.).</p>
            </div>

            <CodeBlock language="yaml" code={`
# ❌ Pattern doesn't match actual value
expect:
  response:
    result:
      message: "match:startsWith:Success"  # But actual: "Error occurred"
`} />

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h4 className="font-semibold text-blue-800">Value Mismatch Errors</h4>
                <p className="text-blue-700">When exact values don't match expected values.</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <h4 className="font-semibold text-green-800">Type Mismatch Errors</h4>
                <p className="text-green-700">When data types don't match expected types.</p>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-4">
                <h4 className="font-semibold text-indigo-800">Length Mismatch Errors</h4>
                <p className="text-indigo-700">When array/string lengths don't match expectations.</p>
            </div>

            <H2 id="example-error-output">📋 Example Error Output</H2>
            <p>Here's what a typical enhanced error report looks like:</p>

            <CodeBlock language="bash" code={`
  ● should have all expected tools with proper structure ... ✗ FAIL
    At response.result.tools[0].inputSchema.required: Unexpected field 'required' (5 additional validation errors found)
    
    🔍 Detailed Validation Analysis:
    📊 Found 6 unexpected field(s).

    ➕ EXTRA FIELD
       📍 Path: response.result.tools[0].inputSchema.required
       💬 Unexpected field 'required'
       💡 Suggestion: Remove 'required' from server response or add it to expected response with value: ["url"]
       
    ➕ EXTRA FIELD
       📍 Path: response.result.tools[1].inputSchema.required
       💬 Unexpected field 'required'
       💡 Suggestion: Remove 'required' from server response or add it to expected response with value: ["responseData","analysis"]
       
    🎯 Top Recommendations:
    1. Remove 'required' from server response or add it to expected response with value: ["url"] (6 similar issues found)
`} />

            <H2 id="error-output-sections">🎯 Error Output Sections</H2>

            <H3 id="summary-line">Summary Line</H3>
            <p>The first line provides a quick overview of the primary error and indicates additional errors:</p>
            <CodeBlock language="bash" code={`
At response.result.tools[0].inputSchema.required: Unexpected field 'required' (5 additional validation errors found)
`} />

            <H3 id="detailed-analysis">Detailed Analysis</H3>
            <p>The detailed section shows error statistics and categorization:</p>
            <CodeBlock language="bash" code={`
🔍 Detailed Validation Analysis:
📊 Found 6 unexpected field(s).
`} />

            <H3 id="individual-errors">Individual Error Details</H3>
            <p>Each error includes:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Error Icon</strong> - Visual indicator of error type (➕ ➖ ❌ ⚠️ 🔢 📝)</li>
                <li><strong>Path</strong> - Exact location of the error in the response</li>
                <li><strong>Message</strong> - Clear description of what went wrong</li>
                <li><strong>Suggestion</strong> - Specific actionable recommendation</li>
                <li><strong>Values</strong> - Expected vs actual values when relevant</li>
            </ul>

            <H3 id="top-recommendations">Top Recommendations</H3>
            <p>Prioritized suggestions based on error frequency and impact:</p>
            <CodeBlock language="bash" code={`
🎯 Top Recommendations:
1. Remove 'required' from server response or add it to expected response with value: ["url"] (6 similar issues found)
2. Update expected response to match server structure (3 similar issues found)
`} />

            <H2 id="error-icons">🎨 Error Type Icons</H2>
            <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Icon</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Error Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">➖</td>
                            <td className="border border-gray-300 px-4 py-2">MISSING FIELD</td>
                            <td className="border border-gray-300 px-4 py-2">Expected field is missing from server response</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">➕</td>
                            <td className="border border-gray-300 px-4 py-2">EXTRA FIELD</td>
                            <td className="border border-gray-300 px-4 py-2">Server response has unexpected field</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">❌</td>
                            <td className="border border-gray-300 px-4 py-2">PATTERN FAILED</td>
                            <td className="border border-gray-300 px-4 py-2">Pattern matching validation failed</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">⚠️</td>
                            <td className="border border-gray-300 px-4 py-2">VALUE MISMATCH</td>
                            <td className="border border-gray-300 px-4 py-2">Expected and actual values don't match</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">🔢</td>
                            <td className="border border-gray-300 px-4 py-2">TYPE MISMATCH</td>
                            <td className="border border-gray-300 px-4 py-2">Data type doesn't match expectation</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">📝</td>
                            <td className="border border-gray-300 px-4 py-2">LENGTH MISMATCH</td>
                            <td className="border border-gray-300 px-4 py-2">Array or string length doesn't match</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <H2 id="using-error-reports">🛠️ Using Error Reports for Debugging</H2>

            <H3 id="quick-fixes">Quick Fixes</H3>
            <p>Most error reports include specific suggestions you can apply immediately:</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ For Extra Field Errors:</h4>
                <ul className="list-disc pl-6 text-green-700">
                    <li>Add the field to your expected response</li>
                    <li>Use <InlineCode>match:partial:</InlineCode> for flexible validation</li>
                    <li>Modify server to not return the field</li>
                </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">🔵 For Missing Field Errors:</h4>
                <ul className="list-disc pl-6 text-blue-700">
                    <li>Update server to include the field</li>
                    <li>Remove the field from expected response</li>
                    <li>Make the field optional in your schema</li>
                </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">🟣 For Pattern Failed Errors:</h4>
                <ul className="list-disc pl-6 text-purple-700">
                    <li>Check the pattern syntax</li>
                    <li>Verify actual server response format</li>
                    <li>Use <InlineCode>--debug</InlineCode> to see raw responses</li>
                </ul>
            </div>

            <H3 id="debugging-workflow">Debugging Workflow</H3>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Run test</strong> - Execute your test to get error report</li>
                <li><strong>Review summary</strong> - Look at the primary error and count</li>
                <li><strong>Check paths</strong> - Identify exactly where errors occur</li>
                <li><strong>Apply suggestions</strong> - Use the provided recommendations</li>
                <li><strong>Re-run test</strong> - Verify fixes worked</li>
            </ol>

            <H2 id="advanced-debugging">🔧 Advanced Debugging Techniques</H2>

            <H3 id="using-debug-mode">Using Debug Mode</H3>
            <p>Use <InlineCode>--debug</InlineCode> to see raw MCP communication:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --debug
`} />

            <H3 id="using-verbose-mode">Using Verbose Mode</H3>
            <p>Use <InlineCode>--verbose</InlineCode> for detailed test hierarchy:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --verbose
`} />

            <H3 id="combining-modes">Combining Debug Modes</H3>
            <p>Combine modes for comprehensive debugging information:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --verbose --debug --timing
`} />

            <H3 id="error-reporting-options">Error Reporting Options</H3>
            <p>Use specialized error reporting options for focused debugging:</p>
            
            <H3 id="errors-only">Show Only Failed Tests</H3>
            <p>Focus on failures by hiding passing tests:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --errors-only
`} />

            <H3 id="syntax-only">Syntax Error Analysis</H3>
            <p>Focus on pattern syntax issues and get correction suggestions:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --syntax-only
`} />

            <H3 id="no-analysis">Minimal Error Output</H3>
            <p>Get basic error messages without detailed analysis:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --no-analysis
`} />

            <H3 id="group-errors">Group Similar Errors</H3>
            <p>Group identical errors together to reduce repetition:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --group-errors
`} />

            <H3 id="limit-errors">Limit Error Count</H3>
            <p>Limit the number of validation errors shown per test:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --max-errors 3
`} />

            <H3 id="combine-error-options">Combining Error Options</H3>
            <p>Combine multiple error reporting options for focused debugging:</p>
            <CodeBlock language="bash" code={`
aegis "tests/*.test.mcp.yml" --config "config.json" --errors-only --group-errors --max-errors 2
`} />

            <H2 id="partial-matching-solution">🎯 Partial Matching for Extra Fields</H2>
            <p>One of the most common error scenarios is when servers return more fields than expected. Instead of updating all test expectations, use partial matching:</p>

            <CodeBlock language="yaml" code={`
# ❌ BEFORE: Fails when server adds extra fields
expect:
  response:
    result:
      tools:
        match:arrayElements:
          name: match:type:string
          description: match:type:string
          inputSchema:
            type: object
            properties: match:type:object
            # ❌ Server also returns 'required' field - causes failure

# ✅ AFTER: Uses partial matching to ignore extra fields
expect:
  response:
    result:
      tools:
        match:arrayElements:
          name: match:type:string
          description: match:type:string
          inputSchema:
            match:partial:  # 🎯 Only validates specified fields
              type: object
              properties: match:type:object
`} />

            <H2 id="error-prevention">🛡️ Error Prevention Best Practices</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Start simple</strong> - Begin with basic exact matching, then add patterns</li>
                <li><strong>Use partial matching</strong> - When you only care about specific fields</li>
                <li><strong>Test incrementally</strong> - Add one validation at a time</li>
                <li><strong>Validate server responses</strong> - Use <InlineCode>--debug</InlineCode> to see actual output</li>
                <li><strong>Group related tests</strong> - Separate structure validation from content validation</li>
                <li><strong>Use meaningful test names</strong> - Help identify intent when debugging</li>
                <li><strong>Check YAML syntax</strong> - Use YAML linters to catch formatting issues</li>
            </ul>

            <H2 id="common-error-patterns">❗ Common Error Patterns & Solutions</H2>

            <H3 id="schema-evolution">Schema Evolution</H3>
            <p><strong>Problem:</strong> Server adds new fields, breaking existing tests</p>
            <p><strong>Solution:</strong> Use <InlineCode>match:partial:</InlineCode> for forward compatibility</p>

            <H3 id="array-vs-object-confusion">Array vs Object Confusion</H3>
            <p><strong>Problem:</strong> Expecting array but getting single object</p>
            <p><strong>Solution:</strong> Check actual server response structure with <InlineCode>--debug</InlineCode></p>

            <H3 id="duplicate-yaml-keys">Duplicate YAML Keys</H3>
            <p><strong>Problem:</strong> YAML overwrites duplicate keys silently</p>
            <p><strong>Solution:</strong> Use YAML linters and structure patterns correctly</p>

            <CodeBlock language="yaml" code={`
# ❌ WRONG: Duplicate keys (second overwrites first)
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # Overwrites the above!

# ✅ CORRECT: Separate tests or proper structure
result:
  tools: "match:arrayLength:1"
# Test arrayLength in one test, specific tools in another
`} />

            <H2 id="getting-help">🤝 Getting Help</H2>
            <p>If error reports don't provide enough information:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Run with <InlineCode>--debug --verbose</InlineCode> for full context</li>
                <li>Check your YAML syntax with a linter</li>
                <li>Verify your server is responding as expected</li>
                <li>Compare with working examples in the MCP Aegis repository</li>
                <li>Create minimal reproduction cases for complex issues</li>
            </ul>

            <p className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <strong>💡 Pro Tip:</strong> The enhanced error reporting system is designed to make debugging as straightforward as possible. Most issues can be resolved by following the specific suggestions in the error output.
            </p>
        </>
    );
};

export default ErrorReportingPage;
