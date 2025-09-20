import React from 'react';
import { H2, H3 } from '../../components/Typography';
import Section from '../Section';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';
import CodeTabs from '../CodeTabs';

const AgentBehaviorValidation: React.FC = () => {
  return (
    <Section id="agent-behavior-validation">
      <H2 id="agent-behavior-validation-heading">Agent Behavior Validation</H2>
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
        <span>Section 3 of 7: Agent Behavior Validation</span>
      </div>
      
      <H3 id="multi-step-tool-sequences">Multi-Step Tool Sequences</H3>
  <p>Demonstrate orchestration using <strong>existing</strong> example tools. We combine <code>read_file</code> (filesystem), <code>text_processor</code> (multi‑tool) and <code>calculator</code> (multi‑tool). Adjust sequencing to mirror your production chain.</p>
  <CodeBlock language="javascript" code={`test('multi-step workflow with real example tools', async () => {\n  // Step 1: Read baseline file (assumes this file is present in working dir)\n  const fileResult = await client.callTool('read_file', { path: './README.md' });\n  assert.equal(fileResult.isError, false);\n  const baseText = fileResult.content[0].text;\n\n  // Step 2: Analyze text\n  const analysis = await client.callTool('text_processor', { action: 'analyze', text: baseText.slice(0, 120) });\n  assert.equal(analysis.isError, false);\n\n  // Step 3: Derive simple numeric metric with calculator (length * 2)\n  const calc = await client.callTool('calculator', { operation: 'multiply', a: baseText.length, b: 2 });\n  assert.equal(calc.isError, false);\n});`} />

  <H3 id="state-management-real">State Management Testing</H3>
  <p>The repository includes a real stateful example server: <code>examples/stateful-session-server</code>. It exposes a <code>session_store</code> tool supporting <code>init</code>, <code>set</code>, <code>append</code>, <code>get</code>, <code>clear</code>. Below is a focused YAML excerpt (full file: <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://github.com/taurgis/mcp-aegis/blob/main/examples/stateful-session-server/session-state.test.mcp.yml">session-state.test.mcp.yml</a>).</p>
      <CodeTabs
        initial="YAML"
        groupId="agents-code"
        tabs={[
          {
            label: 'YAML',
            language: 'yaml',
            code: `- it: "initializes a session"\n    request:\n      jsonrpc: "2.0"\n      id: "sess-init"\n      method: "tools/call"\n      params:\n        name: "session_store"\n        arguments:\n          action: "init"\n          session_id: "demo-1"\n    expect:\n      response:\n        result:\n          isError: false\n          content:\n            - type: "text"\n              text: "match:contains:initialized"\n      stderr: "toBeEmpty"\n\n  - it: "sets and appends values"\n    request:\n      jsonrpc: "2.0"\n      id: "sess-set"\n      method: "tools/call"\n      params:\n        name: "session_store"\n        arguments:\n          action: "set"\n          session_id: "demo-1"\n          key: "notes"\n          value: "alpha"\n    expect:\n      response:\n        result:\n          isError: false\n      stderr: "toBeEmpty"\n\n  - it: "appends value"\n    request:\n      jsonrpc: "2.0"\n      id: "sess-append"\n      method: "tools/call"\n      params:\n        name: "session_store"\n        arguments:\n          action: "append"\n          session_id: "demo-1"\n          key: "notes"\n          value: "-beta"\n    expect:\n      response:\n        result:\n          isError: false\n      stderr: "toBeEmpty"\n\n  - it: "retrieves combined value"\n    request:\n      jsonrpc: "2.0"\n      id: "sess-get"\n      method: "tools/call"\n      params:\n        name: "session_store"\n        arguments:\n          action: "get"\n          session_id: "demo-1"\n          key: "notes"\n    expect:\n      response:\n        result:\n          isError: false\n          content:\n            - type: "text"\n              text: "match:contains:alpha-beta"\n      stderr: "toBeEmpty"`
          },
          {
            label: 'JavaScript',
            language: 'javascript',
            code: `test('session lifecycle (init -> append -> get)', async () => {\n  // init\n  const init = await client.callTool('session_store', { action: 'init', session_id: 'demo-1' });\n  assert.equal(init.isError, false);\n\n  // append two values (tool concatenates)\n  await client.callTool('session_store', { action: 'append', session_id: 'demo-1', key: 'notes', value: 'alpha' });\n  await client.callTool('session_store', { action: 'append', session_id: 'demo-1', key: 'notes', value: 'beta' });\n\n  // retrieve combined value\n  const get = await client.callTool('session_store', { action: 'get', session_id: 'demo-1', key: 'notes' });\n  assert.equal(get.isError, false);\n  const text = (get.content[0]?.text || '').toLowerCase();\n  assert.ok(text.includes('alpha') && text.includes('beta'), 'should contain both appended fragments');\n});`
          }
        ]}
      />
      <Callout type="note" compact className="mt-4">Programmatic test available: <a className="underline" target="_blank" rel="noopener noreferrer" href="https://github.com/taurgis/mcp-aegis/blob/main/examples/stateful-session-server/session-store.programmatic.test.js">session-store.programmatic.test.js</a></Callout>
      
      <H3 id="error-recovery-testing">Error Recovery Testing</H3>
      <p>Use a real tool path that produces a <code>result.isError: true</code> without being a transport failure. In the multi‑tool server the <code>calculator</code> tool dividing by zero throws an internal error that is surfaced as a logical tool error (caught and wrapped) — perfect for exercising retry / remediation logic.</p>
      <CodeTabs
        initial="YAML"
        groupId="agents-code"
        tabs={[
          {
            label: 'YAML',
            language: 'yaml',
            code: `- it: "successful calculation"\n    request:\n      jsonrpc: "2.0"\n      id: "calc-ok"\n      method: "tools/call"\n      params:\n        name: "calculator"\n        arguments:\n          operation: "add"\n          a: 2\n          b: 3\n    expect:\n      response:\n        result:\n          isError: false\n          content:\n            - type: "text"\n              text: "match:contains:Result:"\n      stderr: "toBeEmpty"\n\n  - it: "division by zero yields logical tool error"\n    request:\n      jsonrpc: "2.0"\n      id: "calc-err"\n      method: "tools/call"\n      params:\n        name: "calculator"\n        arguments:\n          operation: "divide"\n          a: 10\n          b: 0\n    expect:\n      response:\n        result:\n          isError: true\n          content:\n            - type: "text"\n              text: "match:contains:Division by zero"\n      stderr: "toBeEmpty"`
          },
          {
            label: 'JavaScript',
            language: 'javascript',
            code: `test('graceful logical error handling (calculator divide by zero)', async () => {\n  // Success path\n  const ok = await client.callTool('calculator', { operation: 'add', a: 2, b: 3 });\n  assert.equal(ok.isError, false);\n\n  // Logical (tool-level) error path - division by zero\n  const bad = await client.callTool('calculator', { operation: 'divide', a: 10, b: 0 });\n  assert.equal(bad.isError, true);\n  assert.ok(/division by zero/i.test(bad.content[0].text));\n});`
          }
        ]}
      />
    </Section>
  );
};

export default AgentBehaviorValidation;
