import React from 'react';
import CodeBlock from './CodeBlock';

/**
 * AgentQuickStart provides a compact dual example (YAML + programmatic)
 * for quickly validating an MCP server for AI agent usage.
 */
const AgentQuickStart: React.FC = () => {
  return (
    <div className="my-8 border border-slate-200 rounded-md overflow-hidden">
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 font-semibold text-slate-800 text-sm tracking-wide">
        Minimal Agent Test Template
      </div>
      <div className="p-4 grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="font-semibold text-slate-800 mb-2 text-sm uppercase">YAML (Discovery + Call)</h4>
          <CodeBlock language="yaml" code={`description: \"Agent sanity tests\"\ntests:\n  - it: \"lists tools\"\n    request: { jsonrpc: '2.0', id: 't1', method: 'tools/list', params: {} }\n    expect:\n      response:\n        result:\n          tools: 'match:not:arrayLength:0'\n      stderr: 'toBeEmpty'\n\n  - it: \"executes a tool\"\n    request:\n      jsonrpc: '2.0'\n      id: 't2'\n      method: 'tools/call'\n      params:\n        name: 'read_file'\n        arguments: { path: './data/hello.txt' }\n    expect:\n      response:\n        result:\n          content:\n            - type: 'text'\n              text: 'match:contains:Hello'\n          isError: false\n      stderr: 'toBeEmpty'`} />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 mb-2 text-sm uppercase">Programmatic (Node test runner)</h4>
          <CodeBlock language="javascript" code={`import { connect } from 'mcp-conductor';\nimport assert from 'node:assert/strict';\n\nlet client;\nbefore(async () => client = await connect('./conductor.config.json'));\nafter(async () => client && await client.disconnect());\nbeforeEach(() => client.clearAllBuffers()); // critical\n\ntest('lists tools', async () => {\n  const tools = await client.listTools();\n  assert.ok(Array.isArray(tools) && tools.length > 0);\n});\n\ntest('executes tool', async () => {\n  const r = await client.callTool('read_file', { path: './data/hello.txt' });\n  assert.equal(r.isError, false);\n  assert.ok(r.content[0].text.includes('Hello'));\n});`} />
        </div>
      </div>
      <div className="px-4 py-2 bg-slate-50 text-xs text-slate-600 flex flex-wrap gap-4">
        <span>Includes buffer hygiene</span>
        <span>Production naming conventions</span>
        <span>Pattern usage</span>
      </div>
    </div>
  );
};

export default AgentQuickStart;
