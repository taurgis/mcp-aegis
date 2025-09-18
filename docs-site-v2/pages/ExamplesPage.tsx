import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';

const ExamplesPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Examples - MCP Conductor</title>
                <meta name="description" content="Comprehensive real-world examples of MCP Conductor testing for Model Context Protocol servers. Includes filesystem servers, multi-tool servers, YAML testing, and programmatic JavaScript/TypeScript examples." />
                <meta name="keywords" content="MCP examples, MCP Conductor examples, Model Context Protocol examples, MCP server examples, YAML testing examples, programmatic MCP testing, filesystem server testing, multi-tool server testing" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Examples - Real-World MCP Server Testing" />
                <meta property="og:description" content="Explore comprehensive examples of Model Context Protocol server testing with MCP Conductor. Real-world scenarios with YAML and programmatic approaches." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/examples" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Examples - Real-World MCP Server Testing" />
                <meta name="twitter:description" content="Explore comprehensive examples of Model Context Protocol server testing with MCP Conductor. Real-world scenarios with YAML and programmatic approaches." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/#/examples" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>
            
            <H1 id="examples">Examples</H1>
            <PageSubtitle>Real-World MCP Server Testing Scenarios</PageSubtitle>
            <p>Comprehensive examples showing real-world usage of MCP Conductor with both YAML declarative and programmatic JavaScript/TypeScript testing approaches for Model Context Protocol servers.</p>

            <H2 id="quick-setup">Quick Setup</H2>
            <p>Before diving into examples, quickly set up MCP Conductor in your project:</p>
            <CodeBlock language="bash" code={`
# Navigate to your MCP project
cd my-mcp-project

# Initialize MCP Conductor
npx mcp-conductor init

# This creates the test structure and configuration automatically
            `} />

            <H2 id="available-examples">Available Examples</H2>
            <p>The <InlineCode>examples/</InlineCode> directory contains three complete MCP servers with comprehensive test suites:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Filesystem Server</strong> - Simple single-tool server demonstrating basic file operations</li>
                <li><strong>Multi-Tool Server</strong> - Complex server with 4 different tools showing advanced patterns</li>
                <li><strong>Numeric Server</strong> - Demonstrates numeric pattern matching with comprehensive comparisons</li>
                <li><strong>API Testing Server</strong> - Sophisticated server for API testing and monitoring</li>
            </ul>

            <H2 id="filesystem-server-example">Filesystem Server Example</H2>
            <p>Complete example demonstrating file operations testing with a single <InlineCode>read_file</InlineCode> tool.</p>
            
            <H3 id="filesystem-config">Configuration (<InlineCode>config.json</InlineCode>)</H3>
            <CodeBlock language="json" code={`
{
  "name": "Filesystem MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./examples/filesystem-server"
}
            `} />

            <H3 id="filesystem-yaml-tests">YAML Tests (<InlineCode>filesystem.test.mcp.yml</InlineCode>)</H3>
            <CodeBlock language="yaml" code={`
description: "Filesystem MCP Server Tests"
tests:
  - it: "should list file operations tool"
    request:
      jsonrpc: "2.0"
      id: "list-1"
      method: "tools/list"
    expect:
      response:
        result:
          tools:
            - name: "read_file"
              description: "match:contains:read"

  - it: "should read existing file successfully"
    request:
      jsonrpc: "2.0"
      id: "read-1"
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
              text: "Hello, MCP Conductor!"

  - it: "should handle non-existent file gracefully"
    request:
      jsonrpc: "2.0"
      id: "error-1"
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
            `} />

            <H3 id="filesystem-programmatic-tests">Programmatic Tests (<InlineCode>filesystem.test.js</InlineCode>)</H3>
            <CodeBlock language="javascript" code={`
import { createClient } from 'mcp-conductor';
import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';

describe('Filesystem MCP Server - Programmatic', () => {
  let client;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  after(async () => {
    await client?.disconnect();
  });

  beforeEach(() => {
    // CRITICAL: Clear stderr to prevent test interference
    client.clearStderr();
  });

  test('should read file content correctly', async () => {
    const result = await client.callTool('read_file', {
      path: '../shared-test-data/hello.txt'
    });

    assert.strictEqual(result.isError, undefined);
    assert.ok(result.content[0].text.includes('Hello, MCP Conductor!'));
  });

  test('should handle file read errors', async () => {
    const result = await client.callTool('read_file', {
      path: './nonexistent-file.txt'
    });

    assert.strictEqual(result.isError, true);
    assert.ok(result.content[0].text.includes('ENOENT'));
  });
});
            `} />

            <H2 id="multi-tool-server-example">Multi-Tool Server Example</H2>
            <p>Advanced example with 4 different tools demonstrating complex MCP server patterns:</p>
            <ul className="list-disc pl-6">
                <li><strong>calculator</strong> - Performs mathematical operations</li>
                <li><strong>text_processor</strong> - Text manipulation and analysis</li>
                <li><strong>data_validator</strong> - Data format validation</li>
                <li><strong>file_manager</strong> - File system operations</li>
            </ul>

            <H3 id="multi-tool-yaml-tests">YAML Tests (<InlineCode>multi-tool.test.mcp.yml</InlineCode>)</H3>
            <CodeBlock language="yaml" code={`
description: "Multi-Tool MCP Server Tests"
tests:
  - it: "should list all 4 tools"
    request:
      method: "tools/list"
    expect:
      response:
        result:
          tools: "match:arrayLength:4"
          
  - it: "should perform calculation"
    request:
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

  - it: "should process text"
    request:
      method: "tools/call"
      params:
        name: "text_processor"
        arguments:
          text: "Hello World"
          operation: "uppercase"
    expect:
      response:
        result:
          content:
            - type: "text"
              text: "match:contains:HELLO WORLD"
            `} />

            <H2 id="data-patterns-server-example">Data Patterns Server Example</H2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <p className="font-semibold">🎯 Comprehensive Pattern Matching Demonstration</p>
                <p>This example showcases all numeric comparison patterns and date/timestamp validation patterns with real datasets for comprehensive testing.</p>
            </div>
            
            <p>Complete example demonstrating comprehensive pattern matching with two main tools that return various datasets for testing numeric comparisons and date/timestamp validation:</p>
            <ul className="list-disc pl-6">
                <li><strong>API Metrics</strong> - Response times, error rates, success rates</li>
                <li><strong>Performance Data</strong> - CPU usage, memory usage, load balancing</li>
                <li><strong>E-commerce Stats</strong> - User scores, discounts, inventory</li>
                <li><strong>Validation Ranges</strong> - Temperature, ports, percentages</li>
            </ul>

            <H3 id="numeric-yaml-tests">Numeric Pattern Tests (<InlineCode>patterns-numeric.test.mcp.yml</InlineCode>)</H3>
            <CodeBlock language="yaml" code={`
description: "Numeric Pattern Matching Tests"
tests:
  - it: "should validate API performance metrics"
    request:
      jsonrpc: "2.0"
      id: "api-metrics"
      method: "tools/call"
      params:
        name: "get_numeric_data"
        arguments:
          dataset: "api"
    expect:
      response:
        result:
          response_time: "match:lessThan:500"        # < 500ms
          error_rate: "match:lessThanOrEqual:1"      # <= 1%
          success_rate: "match:greaterThanOrEqual:99" # >= 99%

  - it: "should validate performance within acceptable ranges"
    request:
      jsonrpc: "2.0"
      id: "performance"
      method: "tools/call"
      params:
        name: "get_numeric_data"
        arguments:
          dataset: "performance"
    expect:
      response:
        result:
          cpu_usage: "match:between:45:65"           # 45-65% range
          memory_usage: "match:lessThanOrEqual:512"  # <= 512MB
          load_balance: "match:between:40:60"        # 40-60% balance

  - it: "should validate scores with negation patterns"
    request:
      jsonrpc: "2.0"
      id: "ecommerce"
      method: "tools/call"
      params:
        name: "get_numeric_data"
        arguments:
          dataset: "ecommerce"
    expect:
      response:
        result:
          user_score: "match:not:lessThan:70"        # Should NOT be < 70
          discount: "match:not:greaterThan:25"       # Should NOT be > 25%
          inventory: "match:greaterThan:0"           # Must be in stock
            `} />

            <H3 id="numeric-programmatic-tests">Programmatic Numeric Testing</H3>
            <CodeBlock language="javascript" code={`
import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('Numeric Server Tests', () => {
  let client;
  
  before(async () => {
    client = await connect('./server.config.json');
  });
  
  after(async () => {
    await client?.disconnect();
  });
  
  beforeEach(() => {
    client.clearStderr(); // Prevent test interference
  });

  test('should validate API response times', async () => {
    const result = await client.callTool('get_numeric_data', { 
      dataset: 'api' 
    });
    
    assert.ok(result.response_time < 500, 'Response time should be under 500ms');
    assert.ok(result.error_rate <= 1, 'Error rate should be 1% or less');
    assert.ok(result.success_rate >= 99, 'Success rate should be 99% or higher');
  });

  test('should validate performance metrics within ranges', async () => {
    const result = await client.callTool('get_numeric_data', { 
      dataset: 'performance' 
    });
    
    // Range validation
    assert.ok(result.cpu_usage >= 45 && result.cpu_usage <= 65, 
      'CPU usage should be between 45-65%');
    assert.ok(result.memory_usage <= 512, 
      'Memory usage should not exceed 512MB');
  });
});
            `} />

            <H2 id="api-testing-server-example">API Testing & Monitoring Server</H2>
            <p>Sophisticated MCP server for API testing, monitoring, and analysis with 6 advanced tools and 76 comprehensive tests:</p>
            <ul className="list-disc pl-6">
                <li><strong>http_request</strong> - Make HTTP requests with full configuration</li>
                <li><strong>response_analyzer</strong> - Analyze HTTP responses and extract data</li>
                <li><strong>endpoint_monitor</strong> - Monitor API endpoints for availability</li>
                <li><strong>data_transformer</strong> - Transform data between formats</li>
                <li><strong>load_tester</strong> - Perform load testing on endpoints</li>
                <li><strong>webhook_simulator</strong> - Simulate webhook events</li>
            </ul>

            <H3 id="api-testing-configuration">Advanced Configuration</H3>
            <CodeBlock language="json" code={`
{
  "name": "API Testing & Monitoring Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./examples/api-testing-server",
  "startupTimeout": 8000,
  "readyPattern": "API Testing Server listening",
  "env": {
    "NODE_ENV": "test",
    "LOG_LEVEL": "info"
  }
}
            `} />

            <H3 id="api-testing-complex-tests">Complex Testing Scenarios</H3>
            <CodeBlock language="yaml" code={`
description: "API Testing Server - HTTP Operations"
tests:
  - it: "should make GET request with headers"
    request:
      method: "tools/call"
      params:
        name: "http_request"
        arguments:
          url: "https://api.example.com/users"
          method: "GET"
          headers:
            Authorization: "Bearer token123"
            Content-Type: "application/json"
    expect:
      response:
        result:
          content:
            - type: "text"
              text: "match:regex:HTTP/1\\.1 \\d{3}"

  - it: "should analyze response data"
    request:
      method: "tools/call"
      params:
        name: "response_analyzer"
        arguments:
          response_body: '{"users": [{"id": 1, "name": "John"}]}'
          content_type: "application/json"
    expect:
      response:
        result:
          content:
            - type: "text"
              text: "match:contains:Found 1 user"
            `} />

            <H2 id="pattern-examples">Pattern Examples</H2>
            <p>The examples also include dedicated pattern testing files demonstrating all 11+ pattern types:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>patterns-basic.test.mcp.yml</InlineCode> - Type validation, deep equality</li>
                <li><InlineCode>patterns-strings.test.mcp.yml</InlineCode> - Contains, startsWith, endsWith</li>
                <li><InlineCode>patterns-regex.test.mcp.yml</InlineCode> - Regular expression patterns</li>
                <li><InlineCode>patterns-arrays.test.mcp.yml</InlineCode> - Array length, elements, contains</li>
                <li><InlineCode>patterns-field-extraction.test.mcp.yml</InlineCode> - Field extraction patterns</li>
                <li><InlineCode>patterns-partial-matching.test.mcp.yml</InlineCode> - Partial object validation</li>
                <li><InlineCode>patterns-partial-array-elements.test.mcp.yml</InlineCode> - 🚀 <strong>Power Pattern:</strong> Partial + Array Elements combination</li>
                <li><InlineCode>patterns-utility.test.mcp.yml</InlineCode> - Count patterns, utility functions</li>
            </ul>

            <H2 id="running-examples">Running the Examples</H2>
            <H3 id="individual-examples">Run Individual Examples</H3>
            <CodeBlock language="bash" code={`
# Filesystem server tests
cd examples/filesystem-server
conductor filesystem.test.mcp.yml --config config.json --verbose

# Multi-tool server tests  
cd examples/multi-tool-server
conductor multi-tool.test.mcp.yml --config config.json --verbose

# Data patterns server tests (demonstrates numeric and date patterns)
cd examples/data-patterns-server
conductor patterns-numeric.test.mcp.yml --config server.config.json --verbose

# API testing server (comprehensive 76 tests)
cd examples/api-testing-server
conductor api-testing.test.mcp.yml --config config.json --verbose --timing
            `} />

            <H3 id="pattern-testing">Pattern Testing Examples</H3>
            <CodeBlock language="bash" code={`
# Test all pattern types with multi-tool server
cd examples/filesystem-server
conductor patterns-*.test.mcp.yml --config config.json

# Specific pattern categories
conductor patterns-basic.test.mcp.yml --config config.json
conductor patterns-arrays.test.mcp.yml --config config.json
conductor patterns-regex.test.mcp.yml --config config.json

# 🚀 Power Pattern: Partial + Array Elements combination
cd examples/multi-tool-server
conductor patterns-partial-array-elements.test.mcp.yml --config config.json

# Data pattern testing (numeric and date patterns)
cd examples/data-patterns-server
conductor patterns-numeric.test.mcp.yml --config server.config.json
            `} />

            <H3 id="programmatic-examples">Programmatic Testing Examples</H3>
            <CodeBlock language="bash" code={`
# Run programmatic tests with Node.js test runner
cd examples/filesystem-server
node --test filesystem-server.programmatic.test.js

cd examples/data-patterns-server
node --test numeric.programmatic.test.js

cd examples/api-testing-server  
node --test api-testing-server.programmatic.test.js
            `} />

            <H2 id="best-practices">Best Practices from Examples</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Start Simple</strong>: Begin with the filesystem server example for basic concepts</li>
                <li><strong>Use Comprehensive Configuration</strong>: Include timeout, ready patterns, and environment variables</li>
                <li><strong>Test Both Success and Error Cases</strong>: All examples include error handling tests</li>
                <li><strong>Combine YAML and Programmatic</strong>: Use YAML for declarative tests, programmatic for complex logic</li>
                <li><strong>Pattern Progression</strong>: Start with basic patterns, gradually add complexity</li>
                <li><strong>Real-world Data</strong>: Use actual API responses and realistic test data</li>
                <li><strong>Performance Testing</strong>: Include timing tests for critical operations</li>
            </ul>

            <H2 id="learning-path">Recommended Learning Path</H2>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Filesystem Server</strong> - Learn basic MCP testing concepts</li>
                <li><strong>Pattern Examples</strong> - Master all 18+ pattern matching types</li>
                <li><strong>Numeric Server</strong> - Learn numeric comparison patterns</li>
                <li><strong>Multi-Tool Server</strong> - Understand complex server patterns</li>
                <li><strong>API Testing Server</strong> - Advanced real-world scenarios</li>
                <li><strong>Programmatic Testing</strong> - Integrate with your existing test suites</li>
            </ol>
        </>
    );
};

export default ExamplesPage;