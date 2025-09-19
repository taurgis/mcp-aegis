import React from 'react';
import { H2, H3 } from '../../components/Typography';
import Section from '../Section';
import CodeBlock from '../../components/CodeBlock';
import CodeTabs from '../CodeTabs';

const RealWorldExamples: React.FC = () => {
  return (
    <Section id="real-world-examples">
      <H2 id="real-world-examples-heading">Real-World Examples</H2>
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
        <span>Section 4 of 7: Real-World Examples</span>
      </div>
      
      {/* Comparison table moved to dedicated component near top of page */}

      <H3 id="multi-tool-yaml">Real YAML Tests (multi-tool-server) <a className="ml-2 text-xs text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://github.com/taurgis/mcp-conductor/tree/main/examples/multi-tool-server">(view repo)</a></H3>
  <p>These are <strong>actual</strong> excerpts from <code>examples/multi-tool-server/multi-tool.test.mcp.yml</code>. They demonstrate tool discovery, success + error handling, regex pattern matching, and multi‑step validation. All tools (<code>calculator</code>, <code>text_processor</code>, <code>data_validator</code>, <code>file_manager</code>) are implemented in the example server.</p>
      <CodeTabs
        initial="YAML"
        groupId="agents-code"
        tabs={[
          {
            label: 'YAML',
            language: 'yaml',
            code: `description: "Multi-Tool Server (excerpt)"\ntests:\n  - it: "should list all available tools"\n    request:\n      jsonrpc: "2.0"\n      id: "multi-1"\n      method: "tools/list"\n      params: {}\n    expect:\n      response:\n        result:\n          tools: "match:arrayLength:4"\n          # Pattern based assertions let the suite stay stable if ordering changes\n  - it: "should perform addition correctly"\n    request:\n      jsonrpc: "2.0"\n      id: "calc-1"\n      method: "tools/call"\n      params:\n        name: "calculator"\n        arguments: { operation: "add", a: 15, b: 27 }\n    expect:\n      response:\n        result:\n          content:\n            - type: "text"\n              text: "Result: 42"\n          isError: false\n  - it: "should handle division by zero error"\n    request:\n      jsonrpc: "2.0"\n      id: "calc-3"\n      method: "tools/call"\n      params:\n        name: "calculator"\n        arguments: { operation: "divide", a: 10, b: 0 }\n    expect:\n      response:\n        result:\n          isError: true\n          content:\n            - type: "text"\n              text: "Division by zero"\n  - it: "should validate correct email address"\n    request:\n      jsonrpc: "2.0"\n      id: "valid-1"\n      method: "tools/call"\n      params:\n        name: "data_validator"\n        arguments: { type: "email", data: "test@example.com" }\n    expect:\n      response:\n        result:\n          content:\n            - type: "text"\n              text: "match:Valid email.*VALID"\n          isError: false\n  - it: "should list directory contents"\n    request:\n      jsonrpc: "2.0"\n      id: "file-3"\n      method: "tools/call"\n      params:\n        name: "file_manager"\n        arguments: { action: "list", path: "../shared-test-data" }\n    expect:\n      response:\n        result:\n          content:\n            - type: "text"\n              text: "match:Files: .*hello\\.txt.*"\n          isError: false`
          },
          {
            label: 'JavaScript',
            language: 'javascript',
            code: `// Excerpt from examples/multi-tool-server/multi-tool-server.programmatic.test.js\nimport { test, describe, before, after, beforeEach } from 'node:test';\nimport { strict as assert } from 'node:assert';\nimport { connect } from '../../src/index.js';\n\ndescribe('Multi-Tool Server Programmatic Integration', () => {\n  let client;\n  before(async () => {\n    client = await connect({\n      name: 'Multi-Tool MCP Server',\n      command: 'node',\n      args: ['./server.js'],\n      cwd: new URL('.', import.meta.url).pathname,\n      startupTimeout: 5000,\n      readyPattern: 'Multi-Tool MCP Server started'\n    });\n  });\n  after(async () => { await client?.disconnect(); });\n  beforeEach(() => client.clearStderr()); // CRITICAL: prevent buffer bleed\n\n  test('addition works', async () => {\n    const r = await client.callTool('calculator', { operation: 'add', a: 15, b: 27 });\n    assert.equal(r.isError, false);\n    assert.equal(r.content[0].text, 'Result: 42');\n  });\n\n  test('division by zero flagged', async () => {\n    const r = await client.callTool('calculator', { operation: 'divide', a: 10, b: 0 });\n    assert.equal(r.isError, true);\n    assert.match(r.content[0].text, /Division by zero/);\n  });\n\n  test('directory listing includes hello.txt', async () => {\n    const r = await client.callTool('file_manager', { action: 'list', path: '../shared-test-data' });\n    assert.equal(r.isError, false);\n    assert.match(r.content[0].text, /hello\\.txt/);\n  });\n});`
          }
        ]}
      />

  <H3 id="stateful-session">Stateful Session Example <a className="ml-2 text-xs text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://github.com/taurgis/mcp-conductor/tree/main/examples/stateful-session-server">(stateful-session-server)</a></H3>
  <p>The <code>stateful-session-server</code> demonstrates maintaining context across calls. Below excerpt shows creating and then retrieving session state. Use this pattern when validating agent memory or multi‑turn tool flows.</p>
      <CodeBlock
        language="yaml"
        code={`description: "Stateful session excerpt"\ntests:\n  - it: "creates a session value"\n    request:\n      jsonrpc: "2.0"\n      id: "s1"\n      method: "tools/call"\n      params:\n        name: "session"\n        arguments: { action: "set", key: "mode", value: "active" }\n    expect:\n      response:\n        result:\n          isError: false\n  - it: "retrieves existing value"\n    request:\n      jsonrpc: "2.0"\n      id: "s2"\n      method: "tools/call"\n      params:\n        name: "session"\n        arguments: { action: "get", key: "mode" }\n    expect:\n      response:\n        result:\n          content:\n            - type: "text"\n              text: "active"\n          isError: false`} />
    </Section>
  );
};

export default RealWorldExamples;
