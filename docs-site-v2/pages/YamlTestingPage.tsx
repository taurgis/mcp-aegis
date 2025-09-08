import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import SEOHead from '../hooks/useSEO';

const YamlTestingPage: React.FC = () => {
    return (
        <>
            <SEOHead 
                title="YAML Testing Guide - MCP Conductor"
                description="Complete guide to declarative YAML testing for Model Context Protocol servers. Learn pattern matching, test structures, CLI options, and advanced validation techniques."
                keywords="YAML testing, MCP YAML tests, declarative testing, Model Context Protocol YAML, MCP test patterns, YAML validation, MCP CLI testing"
                canonical="https://conductor.rhino-inquisitor.com/yaml-testing"
                ogTitle="MCP Conductor YAML Testing - Declarative MCP Server Testing"
                ogDescription="Master declarative YAML testing for Model Context Protocol servers with pattern matching, advanced validation, and comprehensive CLI options."
                ogUrl="https://conductor.rhino-inquisitor.com/yaml-testing"
            />
            <H1 id="yaml-testing-guide">YAML Testing Guide</H1>
            <PageSubtitle>Declarative Model Context Protocol Testing</PageSubtitle>
            <p>MCP Conductor's YAML testing provides a powerful declarative approach to testing Model Context Protocol servers with advanced pattern matching and comprehensive validation capabilities.</p>

            <H2 id="cli-options">CLI Options</H2>
            <p>MCP Conductor provides several CLI options for debugging and different output formats:</p>
            <CodeBlock language="bash" code={`
# Basic test execution
conductor "tests/*.yml" --config config.json

# Verbose output shows test hierarchy and individual results
conductor "tests/*.yml" --config config.json --verbose

# Debug mode shows detailed MCP communication (JSON-RPC messages)
conductor "tests/*.yml" --config config.json --debug

# Timing information for performance analysis
conductor "tests/*.yml" --config config.json --timing

# JSON output for CI/automation systems
conductor "tests/*.yml" --config config.json --json

# Quiet mode suppresses non-essential output
conductor "tests/*.yml" --config config.json --quiet

# Combine multiple debugging options
conductor "tests/*.yml" --config config.json --verbose --debug --timing
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
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--config</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-c</InlineCode></td><td className="p-3 border border-gray-300">Path to configuration file (default: <InlineCode>./conductor.config.json</InlineCode>)</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--verbose</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-v</InlineCode></td><td className="p-3 border border-gray-300">Display individual test results with test suite hierarchy</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--debug</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-d</InlineCode></td><td className="p-3 border border-gray-300">Enable debug mode with detailed MCP communication logging</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--timing</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-t</InlineCode></td><td className="p-3 border border-gray-300">Show timing information for tests and operations</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--json</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-j</InlineCode></td><td className="p-3 border border-gray-300">Output results in JSON format for CI/automation</td></tr>
                        <tr><td className="p-3 border border-gray-300"><InlineCode>--quiet</InlineCode></td><td className="p-3 border border-gray-300"><InlineCode>-q</InlineCode></td><td className="p-3 border border-gray-300">Suppress non-essential output (opposite of verbose)</td></tr>
                    </tbody>
                </table>
            </div>

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

            <H2 id="test-file-structure">Test File Structure</H2>
            <p>YAML test files follow a consistent structure for MCP protocol testing:</p>
            <CodeBlock language="yaml" code={`
description: "Human-readable test suite description"
tests:
  - it: "Individual test case description"
    request:
      jsonrpc: "2.0"
      id: "unique-test-identifier"
      method: "mcp/method/name"
      params:
        # Method-specific parameters
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-test-identifier"
        result:
          # Expected response structure
      stderr: "toBeEmpty"  # Optional stderr validation
            `} />

            <H3 id="required-fields">Required Fields</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><InlineCode>description</InlineCode>: Human-readable test suite description</li>
                <li><InlineCode>tests</InlineCode>: Array of individual test cases</li>
                <li><InlineCode>it</InlineCode>: Description of what the test should validate</li>
                <li><InlineCode>request</InlineCode>: JSON-RPC request to send to the MCP server</li>
                <li><InlineCode>expect</InlineCode>: Expected response structure and values</li>
            </ul>

            <H3 id="optional-fields">Optional Fields</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><InlineCode>stderr</InlineCode>: Expected stderr output validation</li>
                <li><InlineCode>timeout</InlineCode>: Custom timeout for individual test</li>
                <li><InlineCode>skip</InlineCode>: Skip this test (useful for debugging)</li>
            </ul>
            
            <H2 id="pattern-matching-overview">Pattern Matching</H2>
            <p>MCP Conductor supports 11+ advanced pattern matching types for flexible validation. See the full <a href="#/pattern-matching">Pattern Matching Reference</a> for details.</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><InlineCode>"match:type:object"</InlineCode>: Validates data type.</li>
                <li><InlineCode>"match:contains:search"</InlineCode>: String contains substring.</li>
                <li><InlineCode>"match:regex:Found \\d+ results"</InlineCode>: Regular expression matching.</li>
                <li><InlineCode>"match:arrayLength:6"</InlineCode>: Validates exact array length.</li>
                <li><InlineCode>"match:arrayElements: ..."</InlineCode>: Validates all elements in an array against a pattern.</li>
                <li><InlineCode>"match:extractField: 'path.to.field'"</InlineCode>: Extracts and validates a specific field.</li>
                <li><InlineCode>"match:partial: ..."</InlineCode>: Validates only the specified fields in an object.</li>
            </ul>

            <H2 id="common-test-patterns">Common Test Patterns</H2>
            <H3 id="server-initialization">1. Server Initialization</H3>
            <CodeBlock language="yaml" code={`
- it: "should initialize MCP server"
  request:
    jsonrpc: "2.0"
    id: "init-1"
    method: "initialize"
    params:
      protocolVersion: "2024-11-05"
      capabilities: { tools: {} }
      clientInfo: { name: "test-client", version: "1.0.0" }
  expect:
    response:
      jsonrpc: "2.0"
      id: "init-1"
      result:
        protocolVersion: "match:regex:20\\d{2}-\\d{2}-\\d{2}"
        capabilities: "match:type:object"
        serverInfo:
          name: "match:type:string"
          version: "match:type:string"
    stderr: "toBeEmpty"
            `} />

            <H3 id="tool-discovery">2. Tool Discovery</H3>
            <CodeBlock language="yaml" code={`
- it: "should list all available tools"
  request:
    jsonrpc: "2.0"
    id: "tools-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:type:string"
            inputSchema: "match:type:object"
    stderr: "toBeEmpty"
            `} />

            <H3 id="tool-execution">3. Tool Execution</H3>
            <CodeBlock language="yaml" code={`
- it: "should execute tool successfully"
  request:
    jsonrpc: "2.0"
    id: "exec-1"
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
        content:
          - type: "text"
            text: "match:contains:42"
    stderr: "toBeEmpty"
            `} />
            
            <H3 id="error-handling">4. Error Handling</H3>
            <CodeBlock language="yaml" code={`
- it: "should handle unknown tool gracefully"
  request:
    jsonrpc: "2.0"
    id: "error-1"
    method: "tools/call"
    params:
      name: "nonexistent_tool"
      arguments: {}
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Unknown tool"
    stderr: "toBeEmpty"
            `} />

            <H3 id="data-validation">5. Data Validation</H3>
            <CodeBlock language="yaml" code={`
- it: "should validate tool schema"
  request:
    method: "tools/list"
  expect:
    response:
      result:
        tools:
          match:arrayElements:
            inputSchema:
              type: "object"
              properties: "match:type:object"
              required: "match:type:array"
            `} />

            <H2 id="best-practices">Best Practices</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Use descriptive test names</strong>: Make <InlineCode>it</InlineCode> descriptions clear and specific</li>
                <li><strong>Include initialization tests</strong>: Always test MCP handshake first</li>
                <li><strong>Test both success and error scenarios</strong>: Validate error handling</li>
                <li><strong>Use pattern matching</strong>: Avoid brittle exact matches for dynamic data</li>
                <li><strong>Validate stderr</strong>: Include <InlineCode>stderr: "toBeEmpty"</InlineCode> for clean tests</li>
                <li><strong>Group related tests</strong>: Use meaningful test suite descriptions</li>
                <li><strong>Use unique test IDs</strong>: Ensure each request has a unique <InlineCode>id</InlineCode></li>
            </ul>

            <H2 id="troubleshooting">Troubleshooting</H2>
            <H3 id="yaml-structure-issues">⚠️ YAML Structure Common Mistakes</H3>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="font-semibold text-red-800">Critical YAML Structure Guidelines</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-red-700">
                    <li><strong>No duplicate keys</strong>: YAML silently overwrites duplicate keys</li>
                    <li><strong>Consistent indentation</strong>: Use 2 spaces, no tabs</li>
                    <li><strong>Proper array syntax</strong>: Use <InlineCode>- item</InlineCode> format</li>
                    <li><strong>Quote special patterns</strong>: Always quote <InlineCode>match:*</InlineCode> patterns</li>
                    <li><strong>Escape regex backslashes</strong>: Use <InlineCode>\\d+</InlineCode> not <InlineCode>\d+</InlineCode></li>
                </ul>
            </div>

            <H3 id="pattern-debugging">Pattern Debugging</H3>
            <p><strong>Problem:</strong> Pattern did not match: expected "match:regex:..." but got "..."</p>
            <p><strong>Solutions:</strong></p>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Use --debug flag</strong>: <InlineCode>conductor test.yml --debug</InlineCode> to see actual response</li>
                <li><strong>Check regex escaping</strong>: YAML requires <InlineCode>\\d+</InlineCode> instead of <InlineCode>\d+</InlineCode></li>
                <li><strong>Validate YAML syntax</strong>: Use online YAML validators</li>
                <li><strong>Test incrementally</strong>: Start with simple patterns, add complexity</li>
            </ol>

            <H3 id="server-connection-issues">Server Connection Issues</H3>
            <p><strong>Problem:</strong> Connection timeout or server fails to start</p>
            <p><strong>Solutions:</strong></p>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Check configuration</strong>: Verify <InlineCode>command</InlineCode> and <InlineCode>args</InlineCode> are correct</li>
                <li><strong>Increase timeout</strong>: Add <InlineCode>"startupTimeout": 10000</InlineCode> to config</li>
                <li><strong>Add ready pattern</strong>: Use <InlineCode>"readyPattern": "Server listening"</InlineCode></li>
                <li><strong>Check server logs</strong>: Use <InlineCode>--debug</InlineCode> to see stderr output</li>
            </ol>
        </>
    );
};

export default YamlTestingPage;