import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const ExamplesPage: React.FC = () => {
    return (
        <>
            <H1 id="examples">Examples</H1>
            <PageSubtitle>Real-World MCP Server Testing Scenarios</PageSubtitle>
            <p>Comprehensive examples showing real-world usage of MCP Conductor with both YAML declarative and programmatic JavaScript/TypeScript testing approaches for Model Context Protocol servers.</p>

            <H2 id="filesystem-server-example">Filesystem Server Example</H2>
            <p>Complete example demonstrating file operations testing.</p>
            <H3 id="config">Configuration (<InlineCode>config.json</InlineCode>)</H3>
            <CodeBlock language="json" code={`
{
  "name": "Filesystem MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./examples/filesystem-server"
}
            `} />

            <H3 id="yaml-tests">YAML Tests (<InlineCode>filesystem.test.mcp.yml</InlineCode>)</H3>
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
            <H3 id="programmatic-tests">Programmatic Tests (<InlineCode>filesystem.test.js</InlineCode>)</H3>
            <CodeBlock language="javascript" code={`
import { createClient } from 'mcp-conductor';
import { test, describe, before, after } from 'node:test';
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
        </>
    );
};

export default ExamplesPage;