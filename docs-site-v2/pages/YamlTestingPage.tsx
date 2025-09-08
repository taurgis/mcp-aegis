import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const YamlTestingPage: React.FC = () => {
    return (
        <>
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
            <H3 id="tool-discovery">Tool Discovery</H3>
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
            `} />
            
            <H3 id="error-handling">Error Handling</H3>
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
            `} />
        </>
    );
};

export default YamlTestingPage;