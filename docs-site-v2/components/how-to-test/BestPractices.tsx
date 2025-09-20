import React from 'react';
import { H2, H3 } from '../../components/Typography';
import Section from '../Section';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const BestPractices: React.FC = () => {
  return (
    <Section id="best-practices">
      <H2 id="best-practices-heading">Best Practices</H2>
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
        <span>Section 6 of 7: Best Practices</span>
      </div>
      
      <p className="text-sm text-slate-600 mb-6">Why this matters: Strong conventions shrink prompt surface area, reduce retry loops and increase agent planning confidence.</p>
  <div className="space-y-10">
        <div id="agent-friendly-tool-design">
          <H3>✅ Agent-Friendly Tool Design</H3>
          <p className="text-sm mb-3">Problem: Generic naming forces LLM guesswork. Guidance: Express domain and operation explicitly.</p>
          <CodeBlock language="yaml" code={`# ✅ Good - Clear, specific tool names\ntools:\n  - name: "search_customer_data"\n    description: "Search customer database with filters and pagination"\n  - name: "generate_report"\n    description: "Generate formatted reports from data sources"\n\n# ❌ Bad - Vague, generic names  \ntools:\n  - name: "search"\n    description: "Search stuff"\n  - name: "process"\n    description: "Process data"`} />
        </div>
        <div id="comprehensive-error-information">
          <H3>✅ Comprehensive Error Information</H3>
          <p className="text-sm mb-3">Problem: Opaque errors trigger wasteful re‑planning. Guidance: Provide structured remediation hints.</p>
          <CodeBlock language="javascript" code={`// Real error handling examples using existing multi-tool server\nimport assert from 'node:assert/strict';\n\n// 1. Logical validation failure (email format) returns isError:false but semantic INVALID marker in text\n//    Pattern: agent can parse 'INVALID' substring to branch remediation.\n test('invalid email returns semantic failure marker', async () => {\n  const result = await client.callTool('data_validator', { type: 'email', data: 'not-an-email' });\n  assert.equal(result.isError, false); // Validation tool encodes failure in content, not isError\n  const txt = result.content[0].text;\n  assert.match(txt, /Invalid email/i);\n  assert.match(txt, /INVALID/);\n});\n\n// 2. Unsupported calculator operation triggers hard error (isError:true) with explanatory text\n test('unsupported calculator operation surfaces hard error', async () => {\n  const result = await client.callTool('calculator', { operation: 'power', a: 2, b: 3 });\n  assert.equal(result.isError, true);\n  assert.match(result.content[0].text, /Unsupported operation: power/);\n});\n\n// 3. Unknown tool demonstrates top-level routing error\n test('unknown tool produces Unknown tool message', async () => {\n  const result = await client.callTool('totally_missing_tool', {});\n  assert.equal(result.isError, true);\n  assert.match(result.content[0].text, /Unknown tool/);\n});`} />
        </div>
        <div id="structured-output-ai-processing">
          <H3>✅ Structured Output for AI Processing</H3>
          <p className="text-sm mb-3">Problem: Free‑form text requires extra parsing. Guidance: Pair human text with machine‑friendly <code>structured_data</code>. The <code>text_processor</code> tool in the <code>multi-tool-server</code> now emits actionable metrics (<code>chars</code>, <code>words</code>, <code>lines</code>, lengths) alongside the human readable string.</p>
          <CodeBlock language="yaml" code={`- it: "should analyze text with structured metrics"\n  request:\n    jsonrpc: "2.0"\n    id: "text-analyze"\n    method: "tools/call"\n    params:\n      name: "text_processor"\n      arguments: { action: "analyze", text: "Hello MCP Aegis" }\n  expect:\n    response:\n      result:\n        match:partial:\n          content:\n            - type: "text"\n              text: "match:Characters: \\d+, Words: \\d+, Lines: 1"\n          structured_data:\n            action: "analyze"\n            chars: "match:type:number"\n            words: "match:type:number"\n            lines: "match:type:number"\n          isError: false"`} />
        </div>
        <div id="context-preservation">
          <H3>✅ Context Preservation</H3>
          <p className="text-sm mb-3">Problem: Lost conversational state increases token spend. Guidance: Persist session + lightweight preference objects.</p>
          <CodeBlock language="javascript" code={`// Rewritten using real stateful tool: session_store\n// Demonstrates preserving conversational context via explicit session state.\nimport assert from 'node:assert/strict';\n\ntest('should preserve context across tool calls (session_store)', async () => {\n  // Initialize session\n  const init = await client.callTool('session_store', { action: 'init', session_id: 'ctx-1' });\n  assert.equal(init.isError, false);\n\n  // Store preference keys (simulating context)\n  await client.callTool('session_store', { action: 'set', session_id: 'ctx-1', key: 'preferences', value: 'format=detailed;lang=en' });\n\n  // Append incremental conversational artifact\n  await client.callTool('session_store', { action: 'append', session_id: 'ctx-1', key: 'history', value: 'User asked about charts.' });\n  await client.callTool('session_store', { action: 'append', session_id: 'ctx-1', key: 'history', value: 'Requested drill-down.' });\n\n  // Retrieve combined context\n  const history = await client.callTool('session_store', { action: 'get', session_id: 'ctx-1', key: 'history' });\n  assert.equal(history.isError, false);\n  const text = history.content[0].text;\n  assert.ok(text.includes('charts') && text.includes('drill-down'));\n});`} />
        </div>
        <div id="ai-agent-compatibility-testing">
          <H3>✅ AI Agent Compatibility Testing</H3>
          <p className="text-sm mb-3">Problem: Cross‑test buffer leakage causes nondeterministic flakes. Guidance: Enforce hygiene + validate multi‑platform suitability.</p>
      <Callout type="warning" title="Critical Buffer Hygiene" className="my-6">
        <p className="text-sm mb-2">Always clear buffers between tests to avoid flaky cross‑pollination of stderr or stdout partial frames:</p>
        <CodeBlock language="javascript" code={`before(async () => client = await connect('./aegis.config.json'));\nafter(async () => client && await client.disconnect());\nbeforeEach(() => client.clearAllBuffers());`} />
        <p className="text-xs mt-2">Missing this step is the most common source of nondeterministic failures (mismatched ids, unexpected stderr assertions).</p>
      </Callout>
          <CodeBlock language="javascript" code={`import assert from 'node:assert/strict';\n\ndescribe('AI Agent Compatibility (real tools)', () => {\n  test('text analysis provides machine-usable metrics', async () => {\n    const result = await client.callTool('text_processor', { action: 'analyze', text: 'Line one.\nLine two.' });\n    assert.equal(result.isError, false);\n    const text = result.content[0].text;\n    assert.ok(/Characters:/i.test(text) && /Words:/i.test(text));\n  });\n\n  test('session-based contextual accumulation', async () => {\n    await client.callTool('session_store', { action: 'init', session_id: 'compat-1' });\n    await client.callTool('session_store', { action: 'append', session_id: 'compat-1', key: 'history', value: 'Discussed Q3 report.' });\n    await client.callTool('session_store', { action: 'append', session_id: 'compat-1', key: 'history', value: ' Focus on revenue.' });\n    const combined = await client.callTool('session_store', { action: 'get', session_id: 'compat-1', key: 'history' });\n    assert.equal(combined.isError, false);\n    assert.ok(combined.content[0].text.includes('Q3') && combined.content[0].text.includes('revenue'));\n  });\n});`} />
        </div>
      </div>
    </Section>
  );
};

export default BestPractices;
