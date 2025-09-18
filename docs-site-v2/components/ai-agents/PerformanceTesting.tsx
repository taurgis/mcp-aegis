import React from 'react';
import { H2, H3 } from '../../components/Typography';
import Section from '../Section';
import CodeBlock from '../../components/CodeBlock';
import CodeTabs from '../CodeTabs';

const PerformanceTesting: React.FC = () => {
  return (
    <Section id="performance-testing">
  <H2 id="performance-testing-heading">Performance & Resource Testing</H2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Why this matters: Latency & memory regressions silently degrade agent reasoning quality (timeouts, truncated context, tool avoidance). Early detection prevents brittle compensating prompt logic.</p>
      <H3 id="response-time-testing">Response Time Testing <a className="ml-2 text-xs text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://github.com/taurgis/mcp-conductor/tree/main/examples/filesystem-server">(filesystem-server)</a></H3>
  <p>Ensure tools meet AI agent response time requirements. Use coarse time assertions to prevent flakiness—only enforce strict budgets for latency‑sensitive operations.</p>
      <CodeTabs
        initial="YAML"
        groupId="agents-code"
        tabs={[
          {
            label: 'YAML',
            language: 'yaml',
            code: `description: "Performance - Response Time"\ntests:\n  - it: "file read responds within 2s"\n    request:\n      jsonrpc: "2.0"\n      id: "perf-read"\n      method: "tools/call"\n      params:\n        name: "read_file"\n        arguments:\n          path: "./README.md"\n    expect:\n      performance:\n        maxResponseTime: "2000ms"\n      response:\n        result:\n          isError: false\n      stderr: "toBeEmpty"\n\n  - it: "text analysis completes under 3s"\n    request:\n      jsonrpc: "2.0"\n      id: "perf-text"\n      method: "tools/call"\n      params:\n        name: "text_processor"\n        arguments:\n          action: "analyze"\n          text: "Short performance sample"\n    expect:\n      performance:\n        maxResponseTime: "3000ms"\n      response:\n        result:\n          isError: false\n      stderr: "toBeEmpty"`
          },
          {
            label: 'JavaScript',
            language: 'javascript',
            code: `test('read_file responds within 2 seconds', async () => {\n  const t0 = Date.now();\n  const result = await client.callTool('read_file', { path: './README.md' });\n  const dt = Date.now() - t0;\n  assert.equal(result.isError, false);\n  assert.ok(dt < 2000, 'Expected file read under 2s');\n});\n\ntest('parallel calculator operations complete within 5 seconds', async () => {\n  const ops = Array.from({ length: 12 }, (_, i) => client.callTool('calculator', { operation: 'add', a: i, b: i + 1 }));\n  const t0 = Date.now();\n  const results = await Promise.all(ops);\n  const dt = Date.now() - t0;\n  results.forEach(r => assert.equal(r.isError, false));\n  assert.ok(dt < 5000, 'Batch should finish within 5s');\n});`
          }
        ]}
      />

  <H3 id="memory-resource-testing">Memory and Resource Testing <a className="ml-2 text-xs text-blue-600 underline" target="_blank" rel="noopener noreferrer" href="https://github.com/taurgis/mcp-conductor/tree/main/examples/multi-tool-server">(multi-tool-server)</a></H3>
      <p>Validate efficient resource usage for long-running AI agent sessions. Consider adding a control (baseline) measurement for comparison.</p>
  <CodeBlock language="javascript" code={`// Real memory efficiency test (shipping in examples/multi-tool-server)\n// Notes:\n//  * Uses lightweight 'calculator' tool for repeatable calls\n//  * Periodically clears stderr to avoid buffer accumulation\n//  * Optional GC hints if Node started with --expose-gc\n//  * Adjust ITERATIONS / LIMIT_MB via env for CI tuning\nimport assert from 'node:assert/strict';\n\nconst ITERATIONS = parseInt(process.env.MEM_TEST_ITER || '120', 10);\nconst LIMIT_MB = parseInt(process.env.MEM_TEST_LIMIT_MB || '50', 10);\n\ntest('should manage resources efficiently for AI agents', async () => {\n  if ((globalThis).gc) { (globalThis).gc(); } // pre-sample GC if available\n  const memBefore = process.memoryUsage();\n  for (let i = 0; i < ITERATIONS; i++) {\n    const res = await client.callTool('calculator', { operation: 'add', a: i, b: i + 1 });\n    assert.equal(res.isError, false);\n    if (i % 10 === 0) {\n      client.clearStderr();\n      await new Promise(r => setTimeout(r, 0)); // yield for GC / event loop\n    }\n  }\n  if ((globalThis).gc) { (globalThis).gc(); } // post-loop GC if available\n  const memAfter = process.memoryUsage();\n  const heapGrowthBytes = memAfter.heapUsed - memBefore.heapUsed;\n  const heapGrowthMB = heapGrowthBytes / (1024 * 1024);\n  assert.ok(heapGrowthMB < LIMIT_MB, \`Memory growth should be under \${LIMIT_MB}MB (actual \${heapGrowthMB.toFixed(2)}MB)\`);\n});`} />
    </Section>
  );
};

export default PerformanceTesting;
