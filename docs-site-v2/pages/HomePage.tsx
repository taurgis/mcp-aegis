import React from 'react';
import { useNavigate } from 'react-router-dom';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    
    const scrollTo = (id: string) => {
        if (typeof window === 'undefined') return;
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Update hash without adding duplicate history entries
            if (window.location.hash !== `#${id}`) {
                history.replaceState(null, '', `#${id}`);
            }
        }
    };
    
    // Navigate using React Router
    const goTo = (path: string) => {
        navigate(path);
    };

    const yamlTestCode = `
description: "Basic MCP server tests"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "test-1" 
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result:
          tools: "match:type:array"
`;

    const jsTestCode = `
import { test, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

let client;
before(async () => { client = await connect('./aegis.config.json'); });
after(async () => { await client.disconnect(); });

test('should list available tools', async () => {
  const tools = await client.listTools();
  assert.ok(Array.isArray(tools), 'Should return array of tools');
});
`;

    const quickInstall = `# 1. Init (performs install + creates config + test dir + AI agent guide)
npx mcp-aegis init

# 2. Write a YAML test (test*/mcp/yaml/server.test.mcp.yml)
description: "List tools"
tests:
  - it: "lists tools"
    request: { jsonrpc: "2.0", id: "1", method: "tools/list", params: {} }
    expect:
      response:
        id: "1"
        result:
          tools: "match:not:arrayLength:0"  # Not empty

# 3. Run tests
npx mcp-aegis "test*/mcp/yaml/**/*.test.mcp.yml" --verbose`;

    return (
        <>
            <Head>
                <title>MCP Aegis – Test Framework for Model Context Protocol Servers</title>
                <meta name="description" content="Dual-approach (YAML + JS) test framework for MCP servers: 1300+ tests, 50+ pattern families (regex, partial, extraction, cross-field, date/time, numeric), JSON-RPC + MCP handshake automation, rich diffs, CI-ready." />
                <meta name="keywords" content="MCP, Model Context Protocol, testing, Node.js, MCP server, protocol testing, YAML testing, JSON-RPC, stdio, API testing, developer tools, test automation, MCP validation, MCP testing framework, pattern matching" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Aegis – Test Framework for Model Context Protocol Servers" />
                <meta property="og:description" content="Dual-approach (YAML + JS) test framework for MCP servers: 1300+ tests, 50+ pattern families (regex, partial, extraction, cross-field, date/time, numeric), JSON-RPC + MCP handshake automation, rich diffs, CI-ready." />
                <meta property="og:url" content="https://aegis.rhino-inquisitor.com/" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Aegis – Test Framework for Model Context Protocol Servers" />
                <meta name="twitter:description" content="Dual-approach (YAML + JS) test framework for MCP servers: 1300+ tests, 50+ pattern families (regex, partial, extraction, cross-field, date/time, numeric), JSON-RPC + MCP handshake automation, rich diffs, CI-ready." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://aegis.rhino-inquisitor.com/" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>
            <H1 id="mcp-aegis">MCP Aegis</H1>
            <PageSubtitle>Unified Declarative + Programmatic Testing for Model Context Protocol Servers</PageSubtitle>

            {/* HERO */}
            <section className="hero-section bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center mb-12" aria-labelledby="hero-heading">
                <h2 id="hero-heading" className="text-2xl font-bold text-gray-800 mb-4">Ship Reliable MCP Servers Faster</h2>
                <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                    Write high-signal tests in YAML or JavaScript. 50+ matcher types. Automated MCP handshake & JSON-RPC lifecycle. Rich diffs. CI optimized. Battle‑tested with 1300+ internal tests and multiple reference servers.
                </p>
                <div className="flex items-center justify-center gap-2 mb-6" aria-label="Project status badges">
                    <img src="https://img.shields.io/npm/v/mcp-aegis.svg" alt="npm version" />
                    <img src="https://img.shields.io/github/stars/taurgis/mcp-aegis.svg" alt="GitHub stars" />
                </div>
                <nav aria-label="Primary calls to action" className="flex flex-wrap justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => scrollTo('quick-start-60s')}
                        className="no-underline inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-[0.97] transition-all"
                    >Start in 60s</button>
                    <button
                        type="button"
                        onClick={() => scrollTo('why-mcp-aegis')}
                        className="no-underline inline-flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 active:scale-[0.97] transition-all"
                    >Why This Tool?</button>
                    <button
                        type="button"
                        onClick={() => goTo('/pattern-matching/overview')}
                        className="no-underline inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 active:scale-[0.97] transition-all"
                    >Explore Matchers</button>
                </nav>
            </section>

            {/* DEVELOPER PAIN POINTS */}
            <H2 id="pain-points">😫 Before Aegis</H2>
            <ul className="grid md:grid-cols-2 gap-4 my-6 text-sm list-none">
                <li className="p-4 rounded border border-red-200 bg-red-50"><strong>Fragile scripts:</strong> Ad‑hoc JSON-RPC curl scripts & manual stderr watching.</li>
                <li className="p-4 rounded border border-red-200 bg-red-50"><strong>Hidden regressions:</strong> Silent protocol breakage until runtime.</li>
                <li className="p-4 rounded border border-red-200 bg-red-50"><strong>Slow iteration:</strong> Rewriting assertions across similar flows.</li>
                <li className="p-4 rounded border border-red-200 bg-red-50"><strong>Limited validation:</strong> Basic equality—no structural or semantic checks.</li>
                <li className="p-4 rounded border border-red-200 bg-red-50"><strong>Flaky buffers:</strong> Leaking stderr/stdout across tests causes noise.</li>
                <li className="p-4 rounded border border-red-200 bg-red-50"><strong>No shared language:</strong> Hard for AI agents & humans to collaborate.</li>
            </ul>

            {/* 60 SECOND QUICK START */}
            <H2 id="quick-start-60s">🚀 60‑Second Quick Start</H2>
            <p className="mb-4 text-gray-700">Init handles dependency installation automatically—then author your first assertion. Works with <InlineCode>test/</InlineCode> or <InlineCode>tests/</InlineCode>.</p>
            <CodeBlock language="bash" code={quickInstall} />

            <details className="mt-4 mb-10">
                <summary className="cursor-pointer font-medium text-sm text-gray-700">Show dual approach examples (YAML + JS)</summary>
                <div className="mt-4">
                    <H3 id="yaml-testing">YAML Test Example</H3>
                    <CodeBlock language="yaml" code={yamlTestCode} />
                    <H3 id="programmatic-testing">Programmatic Test Example</H3>
                    <CodeBlock language="javascript" code={jsTestCode} />
                </div>
            </details>

            {/* WHEN TO USE */}
            <H2 id="when-to-use">🧭 When To Use vs Alternatives</H2>
            <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-5 rounded-lg border border-gray-200 bg-white">
                    <h3 className="font-semibold mb-2">Use MCP Aegis When…</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                        <li>You need protocol + semantic validation</li>
                        <li>Pattern-rich assertions (regex, numeric, dates, cross-field)</li>
                        <li>Mix of declarative + dynamic flows</li>
                        <li>Stable CI signals + grouped errors</li>
                        <li>AI agent-friendly test artifacts</li>
                    </ul>
                </div>
                <div className="p-5 rounded-lg border border-gray-200 bg-white">
                    <h3 className="font-semibold mb-2">Consider Other Tools If…</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                        <li>You only need raw HTTP (no MCP/stdio)</li>
                        <li>One-off manual inspection</li>
                        <li>No pattern semantics—just equality</li>
                        <li>You're already fully covered by a custom harness</li>
                    </ul>
                </div>
            </div>

            {/* FEATURE GRID */}
            <H2 id="core-capabilities">✨ Core Capability Pillars</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🎯 Dual Test Modes</h3>
                    <p className="text-gray-600">Declarative YAML + programmatic JS/TS—compose both as your suite matures.</p>
                </div>
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🔄 Protocol Automation</h3>
                    <p className="text-gray-600">MCP handshake + JSON-RPC framing handled—focus on expressing intent.</p>
                </div>
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🧪 50+ Matcher Types</h3>
                    <p className="text-gray-600">Regex, partial/contains, extraction, array introspection, numeric, date/time, cross-field, length, negation.</p>
                </div>
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">📊 Insightful Reporting</h3>
                    <p className="text-gray-600">Colored diffs, grouped errors, syntax analysis, timing, JSON export for CI.</p>
                </div>
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">⚙️ Extensible Client</h3>
                    <p className="text-gray-600">Promise-based API for perf probes, dynamic suites, or integration tests.</p>
                </div>
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🛡️ Stability Focus</h3>
                    <p className="text-gray-600">Buffer isolation helpers prevent stderr/stdout bleed & flaky cascades.</p>
                </div>
            </div>

            {/* WHY SECTION */}
            <H2 id="why-mcp-aegis">Why MCP Aegis?</H2>
            <p className="text-lg font-semibold text-gray-800 mb-4">Purpose-built for MCP: high‑fidelity validation with minimal ceremony.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-10">
                <ul className="space-y-3">
                    <li className="flex items-start"><span className="text-green-600 mr-2">✅</span><div><strong>End-to-end lifecycle:</strong> Spawn → Handshake → Tools → Shutdown.</div></li>
                    <li className="flex items-start"><span className="text-green-600 mr-2">✅</span><div><strong>Matcher depth:</strong> 50+ strategies—structure, semantics & relationships.</div></li>
                    <li className="flex items-start"><span className="text-green-600 mr-2">✅</span><div><strong>Fast feedback:</strong> Rich diffs + grouped validation errors reduce iteration time.</div></li>
                    <li className="flex items-start"><span className="text-green-600 mr-2">✅</span><div><strong>Battle-tested:</strong> 1300+ internal tests + multiple reference servers.</div></li>
                    <li className="flex items-start"><span className="text-green-600 mr-2">✅</span><div><strong>Agent aware:</strong> Ships AI assistant oriented docs (AGENTS.md).</div></li>
                </ul>
            </div>

            {/* MATCHER REFERENCE PREVIEW */}
            <H2 id="pattern-matching">🔍 Pattern Matching Preview</H2>
            <p className="text-gray-700 mb-4">Examples of expressive assertions (full catalog in docs):</p>
            <CodeBlock language="yaml" code={`result:
  tools: "match:arrayLengthGreaterThan:2"
  updatedAt: "match:dateAge:1h"
  score: "match:approximately:95.5:0.1"
  user:
    name: "match:containsIgnoreCase:alice"
    id: "match:regex:[a-f0-9-]{36}"
  metrics:
    match:crossField: "min <= current <= max"`} />

            {/* VALIDATION FOOTPRINT */}
            <H2 id="validation-footprint">📊 Validation Footprint</H2>
            <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg"><div className="text-3xl font-bold text-blue-600">1300+</div><div className="text-sm text-gray-600">Automated Tests</div></div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg"><div className="text-3xl font-bold text-green-600">100%</div><div className="text-sm text-gray-600">Test Coverage</div></div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg"><div className="text-3xl font-bold text-purple-600">50+</div><div className="text-sm text-gray-600">Matcher Types</div></div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg"><div className="text-3xl font-bold text-orange-600">5</div><div className="text-sm text-gray-600">Reference Servers</div></div>
            </div>

                        {/* FINAL CTA (Redesigned) */}
                        <section
                            aria-labelledby="cta-final"
                            className="mt-20 relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-sm"
                        >
                            {/* Decorative gradient halo */}
                            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-indigo-400/30 via-fuchsia-400/20 to-transparent rounded-full blur-3xl" />
                            <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 via-cyan-400/10 to-transparent rounded-full blur-3xl" />
                            <div className="relative p-8 lg:p-10">
                                <div className="space-y-8">
                                    {/* Main content */}
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <h3 id="cta-final" className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                                                Ready to Close The Integration Gap?
                                            </h3>
                                            <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-prose">
                                                Go from “it runs locally” to <em>provable</em> protocol correctness in minutes. Start with a single YAML test, add pattern depth as contracts solidify, then graduate to programmatic suites for dynamic flows & performance probes.
                                            </p>
                                        </div>
                                       
                                        <div className="space-y-4" aria-labelledby="quick-steps-heading">
                                            <h4 id="quick-steps-heading" className="text-sm font-semibold tracking-wide uppercase text-slate-600">3-Step Quick Start</h4>
                                            <ol className="list-decimal pl-6 text-sm space-y-3 text-slate-700">
                                                <li className="leading-relaxed">
                                                    <code className="px-2 py-1 rounded bg-slate-900 text-green-400 text-sm font-medium">npx mcp-aegis init</code>
                                                </li>
                                                <li className="leading-relaxed">
                                                    Create <code className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-sm">test*/mcp/yaml/first.test.mcp.yml</code>
                                                </li>
                                                <li className="leading-relaxed">
                                                    Run <code className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-sm break-all">npx mcp-aegis "test*/mcp/yaml/**/*.test.mcp.yml"</code>
                                                </li>
                                            </ol>
                                        </div>
                                        <div className="flex flex-wrap gap-4 pt-2" aria-label="Primary actions">
                                            <button
                                                type="button"
                                                onClick={() => scrollTo('quick-start-60s')}
                                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                            >Get Started</button>
                                            <button
                                                type="button"
                                                onClick={() => goTo('/pattern-matching/overview')}
                                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition"
                                            >Explore Matchers</button>
                                            <button
                                                type="button"
                                                onClick={() => goTo('/ai-agent-testing')}
                                                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/60 backdrop-blur hover:bg-white px-6 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                                            >AI Agent Testing</button>
                                        </div>
                                    </div>
                                    {/* YAML code block below */}
                                    <div className="space-y-4 bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-inner">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-semibold tracking-wide text-slate-300">First YAML Test</p>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 font-medium">Executable Spec</span>
                                        </div>
                                        <pre className="text-[11px] leading-relaxed whitespace-pre overflow-x-auto custom-scrollbar"><code>{`description: "List tools"
tests:
    - it: "lists tools"
        request:
            jsonrpc: "2.0"
            id: "1"
            method: "tools/list"
            params: {}
        expect:
            response:
                id: "1"
                result:
                    tools: "match:not:arrayLength:0"
            stderr: "toBeEmpty"`}</code></pre>
                                        <div className="border-t border-slate-700 pt-3">
                                            <p className="text-[11px] text-slate-400 leading-snug">
                                                Add depth incrementally: array element validation, cross-field rules, extraction patterns & more—same file, stronger guarantees.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
        </>
    );
};

export default HomePage;