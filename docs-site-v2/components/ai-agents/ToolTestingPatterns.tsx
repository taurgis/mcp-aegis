import React from 'react';
import { H2, H3 } from '../../components/Typography';
import AgentQuickStart from '../../components/AgentQuickStart';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';
import CodeTabs from '../CodeTabs';
import Section from '../Section';
import ApproachComparison from './ApproachComparison';
import ToolStandards from './ToolStandards';


const ToolTestingPatterns: React.FC = () => {
  return (
    <Section id="tool-testing-patterns">
  <H2 id="tool-testing-patterns-heading">Tool Testing Patterns</H2>
  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Why this matters: High‑signal tests catch schema drift, brittle naming, or non‑deterministic outputs before agents hallucinate tool capabilities or retry loops degrade performance. (<span className="italic">Note:</span> Description length ≥20 chars is a production recommendation—demo tools like <code>read_file</code> are shorter.)</p>
      <ApproachComparison />
      <AgentQuickStart />
      <div className="mt-4 text-sm text-slate-600">
        <p>See full real-world examples in <a href="https://github.com/taurgis/mcp-conductor/tree/main/examples/filesystem-server" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">examples/filesystem-server</a> – e.g. <code>filesystem-execution-only.test.mcp.yml</code>.</p>
      </div>

  <ToolStandards />
      <Callout type="info" compact className="mb-4">
        <p className="text-xs leading-relaxed">
          <strong>Format Legend:</strong> YAML tests excel at broad request/response validation with powerful pattern operators. Programmatic (JavaScript) tests shine for complex branching, loops, performance timing, and multi‑step orchestration. 
        </p>
      </Callout>

      <CodeTabs
        initial="YAML"
        groupId="agents-code"
        tabs={[
          {
            label: 'YAML',
            language: 'yaml',
            code: `description: "AI Agent Tool Discovery"\ntests:\n  - it: "should discover all agent tools"\n    request:\n      jsonrpc: "2.0"\n      id: "discover"\n      method: "tools/list"\n      params: {}\n    expect:\n      response:\n        jsonrpc: "2.0"\n        id: "discover"\n        result:\n          tools:\n            match:arrayElements:\n              name: "match:type:string"\n              description: "match:type:string"\n              inputSchema:\n                type: "object"\n                properties: "match:type:object"\n                required: "match:type:array"\n      stderr: "toBeEmpty"\n\n  - it: "should have well-documented tool descriptions"\n    request:\n      jsonrpc: "2.0"\n      id: "descriptions"\n      method: "tools/list"\n      params: {}\n    expect:\n      response:\n        result:\n          tools:\n            match:arrayElements:\n              description: "match:regex:.{20,}"  # At least 20 chars\n      stderr: "toBeEmpty"`
          },
          {
            label: 'JavaScript',
            language: 'javascript',
            code: `test('should validate tool schemas for agent compatibility', async () => {\n  const tools = await client.listTools();\n  \n  tools.forEach(tool => {\n    // Validate tool name follows conventions\n    assert.match(tool.name, /^[a-z][a-z0-9_]*$/, \n      \`Tool name "\${tool.name}" should be snake_case\`);\n    \n    // Validate description is comprehensive\n    assert.ok(tool.description.length >= 20, \n      \`Tool "\${tool.name}" needs better description\`);\n    \n    // Validate schema completeness\n    assert.ok(tool.inputSchema.properties, \n      \`Tool "\${tool.name}" missing input properties\`);\n    \n    // Check for required parameters documentation\n    if (tool.inputSchema.required) {\n      tool.inputSchema.required.forEach(param => {\n        assert.ok(tool.inputSchema.properties[param], \n          \`Required parameter "\${param}" not documented\`);\n      });\n    }\n  });\n});`
          }
        ]}
      />

  <H3 id="programmatic-tool-schema-validation">Programmatic Tool Schema Validation</H3>
      <p>Comprehensive tool validation for AI agent compatibility (run with the Node.js test runner / Jest / Mocha). Prefer <code>connect()</code> helper unless you need delayed start.</p>

  <H3 id="context-aware-tool-testing">Context-Aware Tool Testing</H3>
      <p>Use real example tools to validate authentic behavior paths and prevent “works in mock, fails in prod” regressions. Provided tool sets include:</p>
      <ul className="list-disc pl-6 mb-4 text-sm">
        <li><code>read_file</code> (filesystem server)</li>
  <li><code>calculator</code>, <code>text_processor</code> (multi‑tool server)</li>
  <li><code>data_validator</code>, <code>file_manager</code> (multi‑tool server)</li>
      </ul>
  <p className="text-sm mb-2">The snippet below exercises <code>text_processor</code> (analyze action) validating textual metrics an agent may leverage for follow‑up reasoning.</p>
      <CodeTabs
        initial="YAML"
        groupId="agents-code"
        tabs={[
          {
            label: 'YAML',
            language: 'yaml',
            code: `- it: "should return analysis metrics for text_processor"\n  request:\n    jsonrpc: "2.0"\n    id: "tp-analyze-1"\n    method: "tools/call"\n    params:\n      name: "text_processor"\n      arguments:\n        action: "analyze"\n        text: "Alpha line\\nBeta line"\n  expect:\n    response:\n      result:\n        isError: false\n        content:\n          - type: "text"\n            text: "match:contains:Characters:"\n    stderr: "toBeEmpty"`
          },
          {
            label: 'JavaScript',
            language: 'javascript',
            code: `test('text_processor analyze returns metrics', async () => {\n  const result = await client.callTool('text_processor', { action: 'analyze', text: 'Alpha line\\nBeta line' });\n  assert.equal(result.isError, false);\n  const text = result.content[0].text;\n  assert.ok(/Characters:/i.test(text) && /Words:/i.test(text));\n});`
          }
        ]}
      />
    </Section>
  );
};

export default ToolTestingPatterns;
