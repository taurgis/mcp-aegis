import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import SEOHead from '../hooks/useSEO';

const PerformanceTestingPage: React.FC = () => {
    return (
        <>
            <SEOHead 
                title="Performance Testing Guide - MCP Conductor"
                description="Learn how to add performance assertions to YAML test files for Model Context Protocol servers. Set response time limits and validate SLA requirements."
                keywords="MCP performance testing, YAML performance assertions, response time validation, MCP SLA testing, performance requirements, timing assertions"
                canonical="https://conductor.rhino-inquisitor.com/#/performance-testing"
                ogTitle="MCP Conductor Performance Testing - Response Time Validation"
                ogDescription="Add performance requirements to MCP server tests with timing assertions, SLA validation, and response time monitoring."
                ogUrl="https://conductor.rhino-inquisitor.com/#/performance-testing"
            />
            <H1 id="performance-testing-guide">Performance Testing Guide</H1>
            <PageSubtitle>Response Time Validation for MCP Servers</PageSubtitle>
            <p>MCP Conductor supports performance testing with timing assertions, allowing you to validate that your Model Context Protocol servers meet specific response time requirements and SLA standards.</p>

            <H2 id="basic-performance-assertions">Basic Performance Assertions</H2>
            <p>Add performance requirements to any test case using the <InlineCode>performance</InlineCode> section with <InlineCode>maxResponseTime</InlineCode>:</p>

            <CodeBlock language="yaml" code={`
- it: "should list tools within reasonable time"
  request:
    jsonrpc: "2.0"
    id: "perf-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "perf-1"
      result:
        tools: "match:type:array"
    performance:
      maxResponseTime: "500ms"  # Must respond within 500ms
    stderr: "toBeEmpty"
            `} />

            <H2 id="performance-patterns">Common Performance Patterns</H2>
            <p>Different operations have different expected performance characteristics:</p>

            <H3 id="tool-listing-performance">Tool Listing Performance</H3>
            <p>Tool listing should be very fast as it's a metadata operation:</p>
            <CodeBlock language="yaml" code={`
- it: "should list tools quickly"
  request:
    jsonrpc: "2.0"
    id: "list-perf-1"
    method: "tools/list"
    params: {}
  expect:
    response:
      result:
        tools: "match:arrayLength:3"
    performance:
      maxResponseTime: "300ms"  # Very fast for metadata
    stderr: "toBeEmpty"
            `} />

            <H3 id="tool-execution-performance">Tool Execution Performance</H3>
            <p>Tool execution times depend on the complexity of the operation:</p>
            <CodeBlock language="yaml" code={`
# Simple file operations
- it: "should read small file quickly"
  request:
    jsonrpc: "2.0"
    id: "read-perf-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "./data/hello.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:startsWith:Hello"
        isError: false
    performance:
      maxResponseTime: "1000ms"  # Simple operations
    stderr: "toBeEmpty"

# Complex operations  
- it: "should handle complex search efficiently"
  request:
    jsonrpc: "2.0"
    id: "search-perf-1"
    method: "tools/call"
    params:
      name: "search_database"
      arguments:
        query: "performance testing"
        limit: 100
  expect:
    response:
      result:
        match:partial:
          results: "match:type:array"
          count: "match:type:number"
    performance:
      maxResponseTime: "2000ms"  # More time for complex ops
    stderr: "toBeEmpty"
            `} />

            <H3 id="error-handling-performance">Error Handling Performance</H3>
            <p>Error responses should often be faster than successful operations:</p>
            <CodeBlock language="yaml" code={`
- it: "should handle errors quickly"
  request:
    jsonrpc: "2.0"
    id: "error-perf-1"
    method: "tools/call"
    params:
      name: "read_file"
      arguments:
        path: "./nonexistent.txt"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:not found"
        isError: true
    performance:
      maxResponseTime: "800ms"  # Errors should be fast
    stderr: "toBeEmpty"
            `} />

            <H2 id="performance-timing-formats">Timing Format</H2>
            <p>Performance assertions use milliseconds with the <InlineCode>ms</InlineCode> suffix:</p>
            
            <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Format</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Use Case</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>"100ms"</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Very strict requirement</td>
                            <td className="border border-gray-300 px-4 py-2">Critical performance paths</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>"500ms"</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Fast operations</td>
                            <td className="border border-gray-300 px-4 py-2">Tool listing, metadata</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>"1000ms"</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Standard operations</td>
                            <td className="border border-gray-300 px-4 py-2">File I/O, simple processing</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>"2000ms"</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Complex operations</td>
                            <td className="border border-gray-300 px-4 py-2">Search, computation, API calls</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>"5000ms"</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Heavy operations</td>
                            <td className="border border-gray-300 px-4 py-2">Database queries, large files</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <H2 id="viewing-performance-results">Viewing Performance Results</H2>
            <p>Use the <InlineCode>--timing</InlineCode> flag to see actual response times:</p>
            <CodeBlock language="bash" code={`
# Run tests with timing information
conductor "tests/*.yml" --config config.json --timing

# Example output with performance measurements:
# ● should list tools within reasonable time ... ✓ PASS (23ms)
# ● should read small file quickly ... ✓ PASS (156ms) 
# ● should handle errors quickly ... ✓ PASS (45ms)
            `} />

            <H2 id="performance-with-patterns">Combining Performance with Pattern Matching</H2>
            <p>Performance assertions work seamlessly with all pattern matching features:</p>
            <CodeBlock language="yaml" code={`
- it: "should search with good performance and validate structure"
  request:
    jsonrpc: "2.0"
    id: "complex-perf-1"
    method: "tools/call"
    params:
      name: "search_tools"
      arguments:
        category: "documentation"
  expect:
    response:
      result:
        # Complex pattern matching
        tools:
          match:arrayElements:
            name: "match:type:string"
            description: "match:regex:.{20,}"
            category: "documentation"
        count: "match:type:number"
        # Field extraction validation
        match:extractField: "tools.*.name"
        value: "match:arrayContains:search_docs"
    performance:
      maxResponseTime: "1500ms"  # Performance requirement
    stderr: "toBeEmpty"
            `} />

            <H2 id="sla-validation">SLA Validation Examples</H2>
            <p>Use performance testing to validate service level agreements:</p>
            <CodeBlock language="yaml" code={`
description: "SLA validation for production MCP server"
tests:
  # 95th percentile requirement: Tool listing under 200ms
  - it: "should meet tool listing SLA"
    request:
      jsonrpc: "2.0"
      id: "sla-list-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools: "match:type:array"
      performance:
        maxResponseTime: "200ms"
      stderr: "toBeEmpty"

  # 99th percentile requirement: Tool execution under 2 seconds  
  - it: "should meet tool execution SLA"
    request:
      jsonrpc: "2.0"
      id: "sla-exec-1"
      method: "tools/call"
      params:
        name: "get_user_profile"
        arguments:
          user_id: "test-user-123"
    expect:
      response:
        result:
          match:partial:
            user: "match:type:object"
            profile: "match:type:object"
      performance:
        maxResponseTime: "2000ms"
      stderr: "toBeEmpty"
            `} />

            <H2 id="performance-best-practices">Best Practices</H2>
            
            <H3 id="realistic-timeouts">Set Realistic Timeouts</H3>
            <ul className="list-disc ml-6 space-y-2">
                <li><strong>Tool Listing</strong>: 200-500ms (metadata operations should be fast)</li>
                <li><strong>Simple Operations</strong>: 500-1000ms (file reads, basic processing)</li>
                <li><strong>Complex Operations</strong>: 1000-2000ms (searches, computations)</li>
                <li><strong>Heavy Operations</strong>: 2000-5000ms (database queries, large files)</li>
                <li><strong>Network Operations</strong>: Consider network latency and add appropriate margins</li>
            </ul>

            <H3 id="performance-testing-strategy">Performance Testing Strategy</H3>
            <ul className="list-disc ml-6 space-y-2">
                <li><strong>Baseline Tests</strong>: Create performance tests for core functionality</li>
                <li><strong>Regression Prevention</strong>: Run performance tests in CI/CD pipelines</li>
                <li><strong>Load Conditions</strong>: Test under different load conditions</li>
                <li><strong>Error Scenarios</strong>: Validate that errors are handled quickly</li>
                <li><strong>Consistency</strong>: Test the same operations multiple times for consistency</li>
            </ul>

            <H3 id="ci-cd-integration">CI/CD Integration</H3>
            <p>Performance tests integrate seamlessly with continuous integration:</p>
            <CodeBlock language="bash" code={`
# GitHub Actions example
name: MCP Server Performance Tests
on: [push, pull_request]
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g mcp-conductor
      - run: conductor "tests/performance/*.yml" --config config.json --json
            `} />

            <H2 id="troubleshooting-performance">Troubleshooting Performance Issues</H2>
            
            <H3 id="performance-failures">When Performance Tests Fail</H3>
            <ul className="list-disc ml-6 space-y-2">
                <li><strong>Check Actual Times</strong>: Use <InlineCode>--timing</InlineCode> to see real response times</li>
                <li><strong>Environment Factors</strong>: Consider system load, network conditions</li>
                <li><strong>Adjust Expectations</strong>: Timeouts may need adjustment based on hardware</li>
                <li><strong>Profile Code</strong>: Use server-side profiling to identify bottlenecks</li>
                <li><strong>Test Consistency</strong>: Run multiple times to check for variability</li>
            </ul>

            <H3 id="debugging-slow-operations">Debugging Slow Operations</H3>
            <CodeBlock language="bash" code={`
# Run with debug and timing to see detailed communication
conductor "tests/performance.yml" --config config.json --debug --timing

# Use verbose output to understand test execution
conductor "tests/performance.yml" --config config.json --verbose --timing
            `} />

            <H2 id="examples">Complete Examples</H2>
            <p>Here's a comprehensive performance test file:</p>
            <CodeBlock language="yaml" code={`
description: "Performance tests for filesystem server"
tests:
  - it: "should list tools within reasonable time"
    request:
      jsonrpc: "2.0"
      id: "perf-list-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools: "match:type:array"
      performance:
        maxResponseTime: "500ms"
      stderr: "toBeEmpty"

  - it: "should read small file quickly"
    request:
      jsonrpc: "2.0"
      id: "perf-read-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "./data/hello.txt"
    expect:
      response:
        result:
          content:
            - type: "text"
              text: "Hello, MCP Conductor!"
          isError: false
      performance:
        maxResponseTime: "1000ms"
      stderr: "toBeEmpty"

  - it: "should handle errors quickly"
    request:
      jsonrpc: "2.0"
      id: "perf-error-1"
      method: "tools/call"
      params:
        name: "read_file"
        arguments:
          path: "./nonexistent.txt"
    expect:
      response:
        result:
          isError: true
          content:
            - type: "text"
              text: "match:contains:ENOENT"
      performance:
        maxResponseTime: "800ms"
      stderr: "toBeEmpty"
            `} />

            <p className="mt-6">
                For more examples, see the <InlineCode>filesystem-performance.test.mcp.yml</InlineCode> file in the examples directory.
            </p>
        </>
    );
};

export default PerformanceTestingPage;
