import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';
import Callout from '../components/Callout';
import TableOfContents from '../components/TableOfContents';

const TestingFundamentalsPage: React.FC = () => {
    const tocItems = [
        { id: 'core-concepts', title: 'Core Testing Concepts', level: 2 },
        { id: 'yaml-vs-programmatic', title: 'YAML vs Programmatic Testing', level: 2 },
        { id: 'common-patterns', title: 'Common Testing Patterns', level: 2 },
        { id: 'validation-strategies', title: 'Validation Strategies', level: 2 },
        { id: 'troubleshooting-basics', title: 'Troubleshooting Basics', level: 2 },
        { id: 'testing-workflow', title: 'Testing Workflow', level: 2 },
        { id: 'next-learning-steps', title: 'Next Learning Steps', level: 2 },
    ];

    return (
        <>
            <Head>
                <title>Testing Fundamentals - MCP Conductor</title>
                <meta name="description" content="Essential MCP testing concepts, patterns, and strategies. Bridge from basic Quick Start to advanced AI agent testing with comprehensive validation approaches." />
                <meta name="keywords" content="MCP testing fundamentals, Model Context Protocol testing, YAML testing, programmatic testing, validation patterns, testing strategies" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor • Testing Fundamentals" />
                <meta property="og:description" content="Master core MCP testing concepts: YAML vs programmatic approaches, validation patterns, and debugging strategies." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/testing-fundamentals" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor • Testing Fundamentals" />
                <meta name="twitter:description" content="Master core MCP testing concepts: YAML vs programmatic approaches, validation patterns, and debugging strategies." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/testing-fundamentals" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>
            
            <H1 id="testing-fundamentals">Testing Fundamentals</H1>
            <PageSubtitle>Master Core MCP Testing Concepts and Strategies</PageSubtitle>
            
            <Callout type="info" title="Learning Path Context" className="mb-6">
                <p className="text-sm mb-2">
                    This page bridges the gap between the <Link to="/quick-start" className="text-blue-600 hover:text-blue-800 underline">Quick Start</Link> tutorial 
                    and advanced testing approaches like <Link to="/how-to-test" className="text-blue-600 hover:text-blue-800 underline">How to Test MCP Servers</Link>.
                </p>
                <p className="text-sm">
                    <strong>Prerequisites:</strong> Complete the Quick Start guide and have a working MCP server.
                    <br />
                    <strong>What you'll learn:</strong> Core testing concepts, approach selection, and validation strategies.
                </p>
            </Callout>
            
            <TableOfContents items={tocItems} className="mb-8" />
            
            <H2 id="core-concepts">Core Testing Concepts</H2>
            <p>MCP testing validates the complete lifecycle of Model Context Protocol communication. Understanding these core concepts helps you choose the right testing approach and build comprehensive test suites.</p>
            
            <H3 id="mcp-lifecycle">MCP Server Lifecycle</H3>
            <p>Every MCP server interaction follows this pattern:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                <ol className="space-y-3 list-decimal pl-6">
                    <li><strong>Server Startup:</strong> Process spawned via command + arguments</li>
                    <li><strong>Handshake:</strong> <code>initialize</code> → <code>initialized</code> sequence</li>
                    <li><strong>Tool Operations:</strong> <code>tools/list</code> and <code>tools/call</code> methods</li>
                    <li><strong>Graceful Shutdown:</strong> Process termination and cleanup</li>
                </ol>
            </div>
            
            <H3 id="validation-levels">Validation Levels</H3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Protocol Level</h4>
                    <p className="text-sm text-blue-700">JSON-RPC 2.0 format, handshake sequence, method availability</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Schema Level</h4>
                    <p className="text-sm text-green-700">Tool definitions, input schemas, response structures</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Semantic Level</h4>
                    <p className="text-sm text-purple-700">Business logic, data validation, error handling</p>
                </div>
            </div>
            
            <H2 id="yaml-vs-programmatic">YAML vs Programmatic Testing</H2>
            <p>MCP Conductor offers two complementary approaches. Choose based on your testing needs and team preferences.</p>
            
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <H3 id="yaml-approach">YAML Approach</H3>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <h4 className="font-semibold text-emerald-800 mb-2">✅ Best For:</h4>
                        <ul className="text-sm text-emerald-700 space-y-1 list-disc pl-5">
                            <li>Declarative request/response validation</li>
                            <li>Pattern-based assertions (regex, arrays, types)</li>
                            <li>CI/CD integration and automated testing</li>
                            <li>Non-developer team members</li>
                            <li>Documentation-as-tests</li>
                        </ul>
                    </div>
                    <CodeBlock language="yaml" code={`description: "Tool validation example"
tests:
  - it: "should have well-documented tools"
    request:
      jsonrpc: "2.0"
      id: "validate-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools:
            match:arrayElements:
              name: "match:type:string"
              description: "match:regex:.{20,}"
              inputSchema: "match:type:object"`} />
                </div>
                
                <div className="space-y-4">
                    <H3 id="programmatic-approach">Programmatic Approach</H3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">✅ Best For:</h4>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                            <li>Complex conditional logic</li>
                            <li>Dynamic test generation</li>
                            <li>Performance measurements</li>
                            <li>Integration with existing test suites</li>
                            <li>Advanced error handling scenarios</li>
                        </ul>
                    </div>
                    <CodeBlock language="javascript" code={`import { connect } from 'mcp-conductor';

test('comprehensive tool validation', async () => {
  const client = await connect('./config.json');
  
  const tools = await client.listTools();
  
  // Dynamic validation based on tool types
  tools.forEach(tool => {
    assert.ok(tool.description.length >= 20);
    
    if (tool.name.includes('file')) {
      assert.ok(tool.inputSchema.properties.path);
    }
  });
  
  await client.disconnect();
});`} />
                </div>
            </div>
            
            <Callout type="tip" title="Hybrid Approach Recommended" className="mb-8">
                <p className="text-sm">
                    Most production projects benefit from both approaches: YAML for standard validation patterns 
                    and programmatic tests for complex scenarios. Start with YAML, add programmatic tests as complexity grows.
                </p>
            </Callout>
            
            <H2 id="common-patterns">Common Testing Patterns</H2>
            <p>These patterns form the foundation of most MCP test suites. Master these before moving to advanced scenarios.</p>
            
            <H3 id="essential-validations">Essential Validations</H3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-2">1. Tool Discovery Validation</h4>
                    <CodeBlock language="yaml" code={`- it: "should discover all tools"
  request: { jsonrpc: "2.0", id: "1", method: "tools/list", params: {} }
  expect:
    response:
      result:
        tools: "match:arrayLength:3"  # Expect exactly 3 tools
    stderr: "toBeEmpty"`} />
                </div>
                
                <div>
                    <h4 className="font-semibold mb-2">2. Schema Completeness</h4>
                    <CodeBlock language="yaml" code={`- it: "should have complete schemas"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:type:string"
            inputSchema:
              type: "object"
              properties: "match:type:object"`} />
                </div>
                
                <div>
                    <h4 className="font-semibold mb-2">3. Successful Execution</h4>
                    <CodeBlock language="yaml" code={`- it: "should execute tool successfully"
  request:
    method: "tools/call"
    params: { name: "read_file", arguments: { path: "test.txt" } }
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:type:string"
        isError: false`} />
                </div>
                
                <div>
                    <h4 className="font-semibold mb-2">4. Error Handling</h4>
                    <CodeBlock language="yaml" code={`- it: "should handle invalid input"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params: { name: "read_file", arguments: { path: "/invalid/path" } }
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:not found"`} />
                </div>
            </div>
            
            <H2 id="validation-strategies">Validation Strategies</H2>
            <p>Choose the right validation strategy based on your confidence level and testing goals.</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">🎯 Exact Matching</h3>
                    <p className="text-sm text-gray-600">Use when you know the exact expected output</p>
                    <CodeBlock language="yaml" code={`result:
  content:
    - type: "text"
      text: "File read successfully"
  isError: false`} />
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">🔍 Pattern Matching</h3>
                    <p className="text-sm text-gray-600">Use when output varies but follows patterns</p>
                    <CodeBlock language="yaml" code={`result:
  content:
    - type: "text"
      text: "match:regex:File .+ read"
  isError: false`} />
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">📋 Partial Validation</h3>
                    <p className="text-sm text-gray-600">Validate only critical fields</p>
                    <CodeBlock language="yaml" code={`result:
  match:partial:
    isError: false
    content:
      - type: "text"`} />
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">🚫 Negative Testing</h3>
                    <p className="text-sm text-gray-600">Ensure certain conditions don't occur</p>
                    <CodeBlock language="yaml" code={`result:
  isError: "match:not:equals:true"
  content: "match:not:arrayLength:0"`} />
                </div>
            </div>
            
            <H2 id="troubleshooting-basics">Troubleshooting Basics</H2>
            <p>Common issues and debugging strategies for MCP testing.</p>
            
            <H3 id="debugging-workflow">Debugging Workflow</H3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <ol className="space-y-3 list-decimal pl-6">
                    <li><strong>Use Query Command:</strong> Test tools interactively before writing tests</li>
                    <li><strong>Enable Debug Mode:</strong> Add <code>--debug</code> flag to see MCP communication</li>
                    <li><strong>Check Verbose Output:</strong> Use <code>--verbose</code> for detailed comparisons</li>
                    <li><strong>Isolate Issues:</strong> Test one tool at a time</li>
                    <li><strong>Verify Configuration:</strong> Ensure config paths and commands are correct</li>
                </ol>
            </div>
            
            <H3 id="common-issues">Common Issues & Solutions</H3>
            <div className="space-y-4">
                <details className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer font-medium bg-gray-50 rounded-t-lg">
                        🔴 Server Won't Start
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-sm mb-2"><strong>Symptoms:</strong> Timeout errors, "server not ready"</p>
                        <p className="text-sm mb-2"><strong>Solutions:</strong></p>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                            <li>Check file permissions: <code>chmod +x server.js</code></li>
                            <li>Verify command path in config</li>
                            <li>Increase <code>startupTimeout</code></li>
                            <li>Check <code>readyPattern</code> matches server output</li>
                        </ul>
                    </div>
                </details>
                
                <details className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer font-medium bg-gray-50 rounded-t-lg">
                        🟡 Pattern Matching Fails
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-sm mb-2"><strong>Symptoms:</strong> Expected vs actual mismatches</p>
                        <p className="text-sm mb-2"><strong>Solutions:</strong></p>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                            <li>Use <code>--verbose</code> to see exact differences</li>
                            <li>Start with simpler patterns and build complexity</li>
                            <li>Check for extra whitespace or formatting</li>
                            <li>Use <code>match:contains</code> for partial matches</li>
                        </ul>
                    </div>
                </details>
                
                <details className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer font-medium bg-gray-50 rounded-t-lg">
                        🟣 Tests Pass Individually but Fail Together
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-sm mb-2"><strong>Symptoms:</strong> Buffer bleed, flaky test results</p>
                        <p className="text-sm mb-2"><strong>Solutions:</strong></p>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                            <li>Use <code>client.clearAllBuffers()</code> between tests</li>
                            <li>Ensure proper test isolation</li>
                            <li>Check for state sharing between tests</li>
                            <li>Add delays if server needs time between calls</li>
                        </ul>
                    </div>
                </details>
            </div>
            
            <H2 id="testing-workflow">Testing Workflow</H2>
            <p>A proven workflow for building comprehensive MCP test suites.</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-800 mb-4">🔄 Recommended Development Cycle</h3>
                <ol className="space-y-3 list-decimal pl-6 text-blue-800">
                    <li><strong>Interactive Testing:</strong> Use <code>conductor query</code> to explore your server</li>
                    <li><strong>Basic YAML Tests:</strong> Start with tool discovery and simple calls</li>
                    <li><strong>Pattern Refinement:</strong> Add validation patterns as you understand the output</li>
                    <li><strong>Error Scenarios:</strong> Test edge cases and error conditions</li>
                    <li><strong>Programmatic Tests:</strong> Add complex scenarios as needed</li>
                    <li><strong>CI Integration:</strong> Automate tests in your deployment pipeline</li>
                </ol>
            </div>
            
            <CodeBlock language="bash" code={`# Example development workflow

# 1. Explore your server interactively
conductor query --config config.json --method tools/list
conductor query read_file '{"path": "test.txt"}' --config config.json

# 2. Create basic YAML test
# Write basic-tools.test.mcp.yml with tool discovery

# 3. Run and refine
conductor basic-tools.test.mcp.yml --config config.json --verbose

# 4. Add error testing
# Create error-scenarios.test.mcp.yml

# 5. Integrate programmatic tests
# Create complex-scenarios.programmatic.test.js

# 6. Automate in CI
conductor "test/**/*.test.mcp.yml" --config config.json --json`} />
            
            <H2 id="next-learning-steps">Next Learning Steps</H2>
            <p>Now that you understand testing fundamentals, choose your path based on your goals:</p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">🎯 Deep Dive into Patterns</h3>
                    <p className="text-sm text-blue-700 mb-4">Master advanced validation techniques</p>
                    <div className="space-y-2">
                        <Link to="/pattern-matching/basic" className="block text-blue-600 hover:text-blue-800 underline text-sm">Basic Patterns</Link>
                        <Link to="/pattern-matching/array" className="block text-blue-600 hover:text-blue-800 underline text-sm">Array Patterns</Link>
                        <Link to="/pattern-matching/regex" className="block text-blue-600 hover:text-blue-800 underline text-sm">Regex Patterns</Link>
                    </div>
                </div>
                
                <div className="p-6 border border-green-200 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">🤖 AI Agent Testing</h3>
                    <p className="text-sm text-green-700 mb-4">Enterprise-grade testing for AI agents</p>
                    <div className="space-y-2">
                        <Link to="/ai-agent-testing" className="block text-green-600 hover:text-green-800 underline text-sm">AI Agent Testing Guide</Link>
                        <Link to="/performance-testing" className="block text-green-600 hover:text-green-800 underline text-sm">Performance Testing</Link>
                        <Link to="/examples" className="block text-green-600 hover:text-green-800 underline text-sm">Real-World Examples</Link>
                    </div>
                </div>
            </div>
            
            <Callout type="success" title="You're Ready!" className="mt-8">
                <p className="text-sm">
                    You now have a solid foundation in MCP testing concepts. You understand when to use YAML vs programmatic approaches, 
                    core validation patterns, and debugging strategies. Choose your next step based on your specific testing needs.
                </p>
            </Callout>
        </>
    );
};

export default TestingFundamentalsPage;