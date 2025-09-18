import React from 'react';
import { Link } from 'react-router-dom';
import { H1, H2, H3, PageSubtitle } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { Head } from 'vite-react-ssg';
import Section from '../components/Section';

// A focused AI Agent Support guide consolidating the AGENTS/ documentation for the public docs site.
// This page is intentionally concise but actionable, pointing deep-divers to the repo's AGENTS guides.

const AIAgentSupportPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>AI Agent Support – MCP Conductor</title>
        <meta name="description" content="How AI coding assistants and autonomous agents can detect MCP projects, scaffold tests, generate YAML + programmatic suites, and follow best practices using MCP Conductor." />
        <meta name="keywords" content="MCP, AI agents, test generation, YAML tests, programmatic tests, Model Context Protocol, automated testing" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="AI Agent Support – MCP Conductor" />
        <meta property="og:description" content="How AI coding assistants and autonomous agents can detect MCP projects, scaffold tests, generate YAML + programmatic suites, and follow best practices using MCP Conductor." />
        <meta property="og:url" content="https://conductor.rhino-inquisitor.com/ai-agent-support" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Agent Support – MCP Conductor" />
        <meta name="twitter:description" content="How AI coding assistants and autonomous agents can detect MCP projects, scaffold tests, generate YAML + programmatic suites, and follow best practices using MCP Conductor." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://conductor.rhino-inquisitor.com/ai-agent-support" />
        
        {/* Character encoding */}
        <meta charSet="utf-8" />
      </Head>

      <Section id="ai-agent-support-intro" noMargin>
        <H1>🤖 AI Agent Support</H1>
        <PageSubtitle>Authoring High-Quality MCP Server Tests with AI</PageSubtitle>
        <p>
          MCP Conductor ships with <strong>agent-facing documentation</strong> (see <InlineCode>AGENTS/</InlineCode> in the repository) to help AI coding assistants reliably
          generate <strong>declarative YAML</strong> tests and <strong>programmatic JS/TS</strong> tests for Model Context Protocol servers. This page summarizes
          the conventions, heuristics, and scaffolding patterns those agents should follow.
        </p>
      </Section>

      <Section id="detection">
        <H2>🔍 Project Detection Heuristics</H2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Presence of <InlineCode>conductor.config.json</InlineCode> or <InlineCode>*.config.json</InlineCode> with MCP command + args.</li>
          <li>Existing <InlineCode>.test.mcp.yml</InlineCode> files under <InlineCode>test/</InlineCode> or <InlineCode>tests/</InlineCode>.</li>
          <li>Usage of JSON-RPC messages with <InlineCode>tools/list</InlineCode> or <InlineCode>tools/call</InlineCode>.</li>
          <li>Programmatic tests importing <InlineCode>connect</InlineCode> from <InlineCode>mcp-conductor</InlineCode>.</li>
          <li>Repository contains <InlineCode>AGENTS/</InlineCode> directory (YAML + node guides).</li>
        </ul>
      </Section>

      <Section id="scaffolding">
          <H2>📁 Generated Structure (init)</H2>
          <p><InlineCode>npx mcp-conductor init</InlineCode> creates (or augments) this layout. Agents should NOT invent alternative folder names:</p>
          <CodeBlock language="bash" code={`conductor.config.json
  test/mcp/
    AGENTS.md                # Overview (copied from repo)
    yaml/                    # YAML tests
      AGENTS.md              # YAML-focused agent guide
      example.test.mcp.yml   # (agent may create)
    node/                    # Programmatic tests
      AGENTS.md              # Node-focused agent guide
      example.programmatic.test.js
  `} />
          <p className="mt-2 text-sm text-gray-600">If a <InlineCode>tests/</InlineCode> directory exists instead, the same <InlineCode>mcp/</InlineCode> sub-structure is used there. Always detect both <InlineCode>test/</InlineCode> and <InlineCode>tests/</InlineCode>.</p>
      </Section>

      {/* Simplified: deep YAML authoring guidance removed; defer to existing YAML Testing docs */}

      {/* Simplified: deep programmatic authoring guidance removed; focus on activation steps below */}

      <Section id="activation-steps">
        <H2>⚡ Fast Activation (For Agents)</H2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>If missing, run <InlineCode>npx mcp-conductor init</InlineCode>.</li>
          <li>Update <InlineCode>conductor.config.json</InlineCode> with the real server entrypoint (adjust <InlineCode>args</InlineCode>).</li>
          <li>Create a minimal YAML test in <InlineCode>test/mcp/yaml/</InlineCode> (baseline example below).</li>
          <li>Add a programmatic smoke test in <InlineCode>test/mcp/node/</InlineCode> (optional for advanced flows).</li>
          <li>Add npm scripts (see below) for repeatability.</li>
          <li>Iterate: expand YAML using pattern matchers; move complex multi-step logic to programmatic tests.</li>
        </ol>
        <div className="mt-6">
          <H3>Baseline YAML Example</H3>
          <CodeBlock
            language="yaml"
            code={`# test/mcp/yaml/tools-list.test.mcp.yml
description: "Baseline tools list"
tests:
  - it: "lists available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tools-1"
        result:
          tools: "match:not:arrayLength:0"
      stderr: "toBeEmpty"
`}
          />
        </div>
      </Section>

      <Section id="scripts">
        <H2>📜 Suggested package.json Scripts</H2>
        <CodeBlock
          language="json"
          code={`{
  "scripts": {
    "test:mcp:yaml": "mcp-conductor 'test*/mcp/yaml/**/*.test.mcp.yml' --config ./conductor.config.json",
    "test:mcp:node": "node --test 'test*/mcp/node/**/*.programmatic.test.js'",
    "test:mcp:all": "npm run test:mcp:yaml && npm run test:mcp:node",
    "debug:mcp:tools": "mcp-conductor query --config ./conductor.config.json",
    "debug:mcp:call": "mcp-conductor query --config ./conductor.config.json --method tools/call --params '{\\"name\\":\\"REPLACE_ME\\",\\"arguments\\":{}}'"
  }
}`}
        />
      </Section>

      <Section id="prompts">
        <H2>🧠 Minimal Prompt Starters</H2>
        <H3>YAML Test Generation</H3>
        <CodeBlock
          language="markdown"
          code={`Generate a single MCP Conductor YAML test file that:\n- Uses tools/list\n- Asserts the tools array is not empty using match:not:arrayLength:0\n- Does not duplicate YAML keys or mix extraction with structure assertions.`}
        />
        <H3>Programmatic Smoke Test</H3>
        <CodeBlock
          language="markdown"
          code={`Create a Node.js test (node:test) that:\n- Connects using connect('./conductor.config.json')\n- Clears buffers in beforeEach (client.clearAllBuffers())\n- Asserts tools/list returns a non-empty array\n- Disconnects after tests.`}
        />
      </Section>

      <Section id="anti-patterns">
        <H2>🚫 Anti-Patterns</H2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Adding tests outside <InlineCode>test*/mcp/</InlineCode> (breaks conventions)</li>
          <li>Hard-coding entire tool arrays instead of pattern matchers</li>
          <li>Omitting <InlineCode>client.clearAllBuffers()</InlineCode> in programmatic suites</li>
          <li>Mixing extraction + structure assertions in a single YAML response object</li>
          <li>Regenerating duplicate test files instead of updating existing ones</li>
        </ul>
      </Section>

      <Section id="workflow">
        <H2>🔄 Agent Workflow Summary</H2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Detect: look for <InlineCode>conductor.config.json</InlineCode> or MCP patterns.</li>
          <li>Init (if needed): <InlineCode>npx mcp-conductor init</InlineCode>.</li>
          <li>Baseline YAML: tools/list + one tool call.</li>
          <li>Add smoke programmatic test (optional for complex flows).</li>
          <li>Refine failing assertions using pattern matchers only.</li>
          <li>Stop when coverage includes handshake, discovery, at least one tool execution.</li>
        </ol>
      </Section>

      <Section id="resources">
        <H2>📚 Where to Dive Deeper</H2>
        <ul className="list-disc pl-6 space-y-2">
          <li><Link className="text-blue-600 underline" to="/yaml-testing">YAML Testing Docs</Link></li>
          <li><Link className="text-blue-600 underline" to="/programmatic-testing">Programmatic API</Link></li>
          <li><Link className="text-blue-600 underline" to="/pattern-matching/overview">Pattern Matching Reference</Link></li>
          <li><InlineCode>test/mcp/AGENTS.md</InlineCode> / <InlineCode>yaml/AGENTS.md</InlineCode> / <InlineCode>node/AGENTS.md</InlineCode> after init</li>
        </ul>
      </Section>

      <Section id="conclusion">
        <H2>✅ Summary</H2>
        <p>
          AI assistants should favor <strong>clear, pattern-driven YAML tests</strong> for protocol + structure validation and
          <strong>programmatic tests</strong> for multi-step, stateful, or performance-sensitive scenarios. Always ensure buffers are cleared,
          avoid over-specification, and lean on the mature matcher ecosystem instead of brittle static snapshots.
        </p>
      </Section>
    </>
  );
};

export default AIAgentSupportPage;
