import React from 'react';
import { useNavigate } from 'react-router-dom';
import { H1, PageSubtitle, H2 } from '../components/Typography';
import { Head } from 'vite-react-ssg';
import CodeTabs from '../components/CodeTabs';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

const WhyTestMCPPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Head>
        <title>Why Test MCP Servers? - MCP Aegis</title>
        <meta name="description" content="Learn why testing Model Context Protocol servers is essential for reliability, protocol compliance, and production readiness. Discover MCP testing benefits and best practices." />
        <meta name="keywords" content="why test MCP servers, Model Context Protocol testing benefits, MCP server reliability, MCP protocol compliance, MCP testing importance, MCP server quality" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Why Test MCP Servers? Essential Guide to Model Context Protocol Testing" />
        <meta property="og:description" content="Understand the critical importance of testing Model Context Protocol servers for reliability, compliance, and production readiness with MCP Aegis." />
        <meta property="og:url" content="https://aegis.rhino-inquisitor.com/why-test-mcp" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Why Test MCP Servers? Essential Guide to Model Context Protocol Testing" />
        <meta name="twitter:description" content="Understand the critical importance of testing Model Context Protocol servers for reliability, compliance, and production readiness with MCP Aegis." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://aegis.rhino-inquisitor.com/why-test-mcp" />
        
        {/* Character encoding */}
        <meta charSet="utf-8" />
      </Head>
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        <div className="border-b pb-6 space-y-2">
          <H1 id="why-test-mcp-servers">Why Test MCP Servers?</H1>
          <PageSubtitle>
            Move beyond "it runs locally"—prove protocol correctness, stability and AI agent compatibility before production.
          </PageSubtitle>
        </div>

        {/* TL;DR */}
        <section className="space-y-4" aria-labelledby="tldr">
            <H2 id="tldr">TL;DR</H2>
            <div className="bg-gradient-to-r from-indigo-500/90 to-purple-600/90 text-white rounded-lg p-5 shadow-sm">
              <p className="leading-relaxed text-sm md:text-base">
                Unit tests tell you a function produces the right value. <strong>MCP protocol tests</strong> tell you an AI agent
                can actually discover your tools, call them with real arguments, receive well‑formed JSON-RPC responses,
                and recover gracefully from errors—all via stdio under timing and buffering realities. <span className="underline font-medium">That last mile is where most production failures hide.</span>
              </p>
            </div>
        </section>

        {/* Problem framing */}
        <section className="space-y-6" aria-labelledby="the-gap">
          <H2 id="the-gap">The Hidden Gap: "My Code Works" ≠ "My Server Integrates"</H2>
          <p className="text-gray-700 leading-relaxed">
            Traditional test suites rarely execute a <em>full</em> MCP lifecycle: process spawn → handshake → tools/list → tools/call → error handling → shutdown. Yet these steps are exactly what AI orchestration layers exercise. Minor deviations—an incorrect <InlineCode>id</InlineCode>, late newline flush, mismatched <InlineCode>jsonrpc</InlineCode> field, or tool schema drift—can silently break agent workflows even though unit tests pass.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <h3 id="without-protocol-tests" className="font-semibold text-red-800 mb-2">Without Protocol Tests</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-red-800">
                <li>Undetected handshake sequencing mistakes</li>
                <li>Incorrect or unstable tool metadata</li>
                <li>Partial / concatenated stdout JSON frames</li>
                <li>Leaked stderr noise confusing agents</li>
                <li>Silent result vs error shape mismatches</li>
                <li>Unbounded startup latency & race conditions</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h3 id="with-mcp-aegis" className="font-semibold text-green-900 mb-2">With MCP Aegis</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-green-800">
                <li>Deterministic startup & readiness validation</li>
                <li>Spec-conform JSON-RPC framing enforced</li>
                <li>Tool contracts & argument expectations locked</li>
                <li>Pattern matching for structural drift</li>
                <li>Immediate visibility into stderr regressions</li>
                <li>Confidence to ship + reproducible failures</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="space-y-6" aria-labelledby="comparison">
          <H2 id="comparison">Unit Tests vs MCP Protocol Tests</H2>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="p-5 bg-white">
                <h3 id="classic-unit-tests" className="font-semibold mb-2">🧪 Classic Unit / Service Tests</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                  <li>In-process function calls</li>
                  <li>Mocked IO, no real stdio framing</li>
                  <li>Happy-path parameter shapes assumed</li>
                  <li>No handshake sequencing</li>
                  <li>Cannot detect output buffering defects</li>
                  <li>Limited schema drift detection</li>
                </ul>
              </div>
              <div className="p-5 bg-slate-50">
                <h3 id="aegis-protocol-tests" className="font-semibold mb-2">🔗 MCP Aegis Protocol Tests</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                  <li>Real child process + stdio channels</li>
                  <li>Full JSON-RPC 2.0 message validation</li>
                  <li>Handshake + tool discovery flows</li>
                  <li>Structured result / error pattern rules</li>
                  <li>Timing + startup timeout enforcement</li>
                  <li>50+ pattern types (arrays, dates, cross-fields)</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-800 text-sm font-medium">
              You need both layers. Protocol tests cover integration risk—the dominant cause of production incidents for MCP servers.
            </div>
          </div>
        </section>

        {/* Real world bug example */}
        <section className="space-y-5" aria-labelledby="real-bug">
          <H2 id="real-bug">Example: A Real Failure Caught</H2>
          <p className="text-gray-700 text-sm leading-relaxed">
            A server appended an ANSI color code to a JSON-RPC response when <InlineCode>DEBUG=1</InlineCode>. Unit tests (calling internal functions) passed. Protocol tests failed immediately with a diff highlighting the unexpected escape sequence. The regression never shipped.
          </p>
          <CodeBlock language="json" code={`// Diff excerpt (simplified)\n- \"result\": {\"tools\":[{\"name\":\"read_file\"}]}\n+ \"\\u001b[36mresult\\u001b[39m\": {\"tools\":[{\"name\":\"read_file\"}]}\n`} />
        </section>

        {/* Quick Example */}
        <section className="space-y-6" aria-labelledby="quick-example">
          <H2 id="quick-example">Quick Example: Same Intent, Two Styles</H2>
          <p className="text-gray-700 text-sm leading-relaxed">
            The YAML form is concise + declarative. The programmatic form gives you loops, conditionals and custom assertions. Both share the same underlying engine & pattern matchers.
          </p>
          <CodeTabs
            groupId="why-example"
            tabs={[
              {
                label: 'YAML Test',
                language: 'yaml',
                code: `description: "Tool list validation"\ntests:\n  - it: "should expose at least 2 tools"\n    request:\n      jsonrpc: "2.0"\n      id: "list-1"\n      method: "tools/list"\n      params: {}\n    expect:\n      response:\n        jsonrpc: "2.0"\n        id: "list-1"\n        result:\n          tools: "match:not:arrayLength:0"\n      stderr: "toBeEmpty"`
              },
              {
                label: 'JS Test',
                language: 'javascript',
                code: `import assert from 'node:assert/strict';\nimport { connect } from 'mcp-aegis';\n\ndescribe('tools', () => {\n  let client;\n  before(async () => client = await connect('./config.json'));\n  beforeEach(() => client.clearAllBuffers()); // critical!\n  after(async () => client.disconnect());\n\n  it('lists tools', async () => {\n    const tools = await client.listTools();\n    assert.ok(Array.isArray(tools) && tools.length >= 2, 'expected >=2 tools');\n  });\n});`
              }
            ]}
          />
        </section>

        {/* Benefits (Redesigned) */}
        <section className="space-y-8" aria-labelledby="benefits">
          <div className="space-y-3">
            <H2 id="benefits">Key Benefits (Why Teams Adopt It)</H2>
            <p className="text-sm text-slate-600 max-w-2xl">
              What consistently moves teams from ad-hoc scripts to adopting Aegis as a required CI gate.
            </p>
          </div>
          <ul
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none m-0 p-0"
            role="list"
          >
            {[
              { title: 'Protocol Confidence', body: 'Enforces JSON-RPC + MCP handshake correctness automatically.', icon: '🧩', accent: 'from-indigo-500 to-indigo-600' },
              { title: 'Contract Stability', body: 'Pattern matchers surface subtle schema drift early.', icon: '🛡️', accent: 'from-purple-500 to-purple-600' },
              { title: 'Faster Debugging', body: 'Rich diffs + stderr capture pinpoint regressions instantly.', icon: '⚡', accent: 'from-amber-500 to-amber-600' },
              { title: 'Living Documentation', body: 'Tests double as executable examples for consumers.', icon: '📘', accent: 'from-sky-500 to-sky-600' },
              { title: 'Lower On-Call Risk', body: 'Integration bugs shift left—fewer production incidents.', icon: '🧯', accent: 'from-rose-500 to-rose-600' },
              { title: 'CI Friendly', body: 'Deterministic, fast (seconds), zero external services.', icon: '🔁', accent: 'from-emerald-500 to-emerald-600' }
            ].map(card => (
              <li
                key={card.title}
                className="relative rounded-xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm hover:shadow-md transition-shadow overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
              >
                {/* Accent bar */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`} aria-hidden="true" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xl leading-none select-none relative top-[5px]" aria-hidden="true">{card.icon}</div>
                    <h3 id={`benefit-${card.title.toLowerCase().replace(/\s+/g, '-')}`} className="font-semibold text-slate-900 text-sm tracking-tight">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug pr-1">
                    {card.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Misconceptions (concise) */}
        <section className="space-y-5" aria-labelledby="myths">
          <H2 id="myths">Common Myths</H2>
          <div className="space-y-3">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800"><strong>“Unit tests are enough.”</strong> They assert logic, not protocol framing, buffering, or discovery semantics.</p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800"><strong>“This only tests the framework.”</strong> Failures almost always arise from your tool metadata, error shapes, timing, or response assembly—not the harness.</p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-800"><strong>“Too slow.”</strong> Suites commonly finish in &lt; 3s for dozens of cases (pure stdio, no network).</p>
            </div>
          </div>
        </section>

        {/* Strategy */}
        <section className="space-y-6" aria-labelledby="strategy">
          <H2 id="strategy">Recommended Layering Strategy</H2>
          <div className="bg-blue-50 rounded-lg p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded border-l-4 border-green-600">
                <h3 id="strategy-unit" className="font-semibold mb-1">🔬 Unit</h3>
                <p>Pure logic & data transforms.</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-blue-600">
                <h3 id="strategy-protocol" className="font-semibold mb-1">🔗 Protocol</h3>
                <p>Spawn server; validate tool discovery, calls, errors.</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-purple-600">
                <h3 id="strategy-production" className="font-semibold mb-1">🚀 Production</h3>
                <p>Occasional smoke tests with actual AI agents.</p>
              </div>
            </div>
            <p className="text-xs text-blue-900">Optimize feedback loop: dozens of protocol tests (seconds) every PR; heavier agent-level smoke tests nightly / pre-release.</p>
          </div>
        </section>

        {/* Call To Action (Simplified) */}
        <section className="space-y-4" aria-labelledby="cta">
          <H2 id="cta">Ready to Close The Integration Gap?</H2>
          <p className="text-gray-700 text-sm leading-relaxed max-w-prose">Start with a single protocol test and build confidence as you expand. Your future staging self will thank you.</p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate('/quick-start')}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >Quick Start</button>
            <button
              type="button"
              onClick={() => navigate('/examples')}
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 active:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition"
            >Examples</button>
            <button
              type="button"
              onClick={() => navigate('/pattern-matching/overview')}
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition"
            >Matchers</button>
          </div>
          <div className="text-xs text-gray-500">MCP Aegis augments—never replaces—your existing unit tests.</div>
        </section>
      </div>
    </>
  );
};

export default WhyTestMCPPage;
