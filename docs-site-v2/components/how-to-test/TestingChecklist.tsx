import React from 'react';
import { H2, H3 } from '../../components/Typography';
import Section from '../Section';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';

const TestingChecklist: React.FC = () => {
  return (
    <Section id="testing-checklist">
      <H2 id="testing-checklist-heading">MCP Server Testing Checklist</H2>
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
        <span>Section 7 of 7: Testing Checklist</span>
      </div>
      
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Tool Discovery:</strong> All tools discoverable with snake_case names & (production) ≥20 char descriptions (demo tools may be shorter)</li>
        <li><strong>Schema Validation:</strong> Input schemas are complete and well-documented</li>
        <li><strong>Handshake:</strong> Successful initialize + initialized sequence prior to tool usage</li>
        <li><strong>Response Times:</strong> Tools respond within 2–5 seconds (or documented SLA) <span className="text-xs text-slate-500">(See <a className="underline" href="#/performance-testing">Performance Testing</a>)</span></li>
        <li><strong>Error Handling:</strong> Errors provide actionable information for agents</li>
        <li><strong>Context Management:</strong> Tools maintain state across conversations</li>
        <li><strong>Structured Output:</strong> Responses include both human-readable and structured data</li>
        <li><strong>Concurrent Usage:</strong> Tools handle multiple agent requests simultaneously</li>
        <li><strong>Memory Efficiency:</strong> Resource usage remains stable during long sessions</li>
        <li><strong>Agent Compatibility:</strong> Works with major AI platforms (Claude, GPT, etc.)</li>
        <li><strong>Buffer Hygiene:</strong> Buffers cleared between tests (<code>clearAllBuffers()</code>)</li>
      </ul>
      
      <H3 id="debugging-scenarios">Common Debugging Scenarios</H3>
      <p className="mb-4">Real-world problems and their solutions when testing MCP servers:</p>
      
      <div className="space-y-6">
        <details className="border border-gray-200 rounded-lg">
          <summary className="p-4 cursor-pointer font-medium bg-red-50 hover:bg-red-100 rounded-t-lg border-b border-red-200">
            🚨 Scenario: Agent Can't Discover Tools
          </summary>
          <div className="p-4 space-y-3">
            <p className="text-sm"><strong>Symptoms:</strong> Agent says "no tools available" or tries to call non-existent tools</p>
            <p className="text-sm"><strong>Root Causes:</strong></p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>MCP handshake failed silently</li>
              <li>tools/list returns empty array</li>
              <li>Server crashes after handshake but before tool discovery</li>
            </ul>
            <p className="text-sm font-medium">Debugging Commands:</p>
            <CodeBlock language="bash" code={`# Test handshake + tool discovery manually
conductor query --config config.json --debug
# Should show: handshake → tools/list → tool array

# Check for server crashes
conductor query --config config.json --verbose
# Look for process exit codes or stderr output`} />
          </div>
        </details>
        
        <details className="border border-gray-200 rounded-lg">
          <summary className="p-4 cursor-pointer font-medium bg-yellow-50 hover:bg-yellow-100 rounded-t-lg border-b border-yellow-200">
            ⚠️ Scenario: Tool Calls Return Empty Results
          </summary>
          <div className="p-4 space-y-3">
            <p className="text-sm"><strong>Symptoms:</strong> Tools execute but return empty or malformed content</p>
            <p className="text-sm"><strong>Root Causes:</strong></p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Tool logic errors not caught in basic tests</li>
              <li>Invalid argument mapping from agent requests</li>
              <li>Async operations not properly awaited</li>
            </ul>
            <p className="text-sm font-medium">Debugging Test:</p>
            <CodeBlock language="yaml" code={`- it: "debug tool output structure"
  request:
    method: "tools/call"
    params: { name: "your_tool", arguments: { test_input: "debug" } }
  expect:
    response:
      result:
        content: "match:not:arrayLength:0"  # Not empty
        isError: false
  stderr: "match:not:contains:error"`} />
          </div>
        </details>
        
        <details className="border border-gray-200 rounded-lg">
          <summary className="p-4 cursor-pointer font-medium bg-purple-50 hover:bg-purple-100 rounded-t-lg border-b border-purple-200">
            🔄 Scenario: Flaky Tests in CI/CD
          </summary>
          <div className="p-4 space-y-3">
            <p className="text-sm"><strong>Symptoms:</strong> Tests pass locally but fail in CI, or pass/fail randomly</p>
            <p className="text-sm"><strong>Root Causes:</strong></p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Buffer bleeding between test cases</li>
              <li>Race conditions in server startup</li>
              <li>Environment differences (file paths, permissions)</li>
            </ul>
            <p className="text-sm font-medium">Solution Pattern:</p>
            <CodeBlock language="javascript" code={`// In programmatic tests, always clear buffers
beforeEach(() => {
  client.clearAllBuffers(); // CRITICAL for stability
});

// For YAML tests, use unique IDs and proper timeouts
tests:
  - it: "isolated test with unique ID"
    request:
      id: "unique-test-1-{{timestamp}}"  # Prevent ID conflicts`} />
          </div>
        </details>
        
        <details className="border border-gray-200 rounded-lg">
          <summary className="p-4 cursor-pointer font-medium bg-blue-50 hover:bg-blue-100 rounded-t-lg border-b border-blue-200">
            📊 Scenario: Performance Degradation Over Time
          </summary>
          <div className="p-4 space-y-3">
            <p className="text-sm"><strong>Symptoms:</strong> First few tool calls fast, then progressively slower</p>
            <p className="text-sm"><strong>Root Causes:</strong></p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Memory leaks in server implementation</li>
              <li>Unclosed resources (files, connections)</li>
              <li>Event listener accumulation</li>
            </ul>
            <p className="text-sm font-medium">Performance Test Pattern:</p>
            <CodeBlock language="javascript" code={`test('performance stability over multiple calls', async () => {
  const times = [];
  
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await client.callTool('your_tool', { iteration: i });
    times.push(Date.now() - start);
  }
  
  // Response time should not degrade significantly
  const avg = times.reduce((a, b) => a + b) / times.length;
  const maxTime = Math.max(...times);
  assert.ok(maxTime < avg * 2, 'Performance degraded significantly');
});`} />
          </div>
        </details>
      </div>
      
      <Callout type="success" title="Production-Ready MCP Server Testing" className="mt-8">
        <p>All testing patterns and examples have been validated with real integrations (component libraries, knowledge bases, data enrichment services, AI agents) and the example MCP servers included in this repository. These patterns ensure reliability with Claude, GPT and future MCP‑compatible platforms.</p>
      </Callout>
      
      <Callout type="info" title="Related Documentation" className="mt-6">
        <ul className="space-y-2 list-disc pl-5">
          <li><a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Additional end‑to‑end scenarios</li>
          <li><a href="#/programmatic-testing" className="text-blue-600 hover:text-blue-800 underline">Programmatic Testing</a> - Advanced programmatic patterns</li>
          <li><a href="#/pattern-matching/overview" className="text-blue-600 hover:text-blue-800 underline">Pattern Matching</a> - Comprehensive validation patterns</li>
          <li><a href="#/performance-testing" className="text-blue-600 hover:text-blue-800 underline">Performance Testing</a> - Latency & resource validation</li>
        </ul>
      </Callout>
    </Section>
  );
};

export default TestingChecklist;
