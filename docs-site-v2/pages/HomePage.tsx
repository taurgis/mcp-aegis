import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import SEOHead from '../hooks/useSEO';

const HomePage: React.FC = () => {
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
import { connect } from 'mcp-conductor';

let client;
before(async () => { client = await connect('./conductor.config.json'); });
after(async () => { await client.disconnect(); });

test('should list available tools', async () => {
  const tools = await client.listTools();
  assert.ok(Array.isArray(tools), 'Should return array of tools');
});
`;
    
    return (
        <>
            <SEOHead 
                title="MCP Conductor – Test Framework for Model Context Protocol Servers"
                description="Dual-approach (YAML + JS) test framework for MCP servers: 1300+ tests, 50+ pattern types (regex, partial, extraction, cross-field, date/time, numeric), full JSON-RPC + MCP handshake automation, rich diffs, CI-ready."
                keywords="MCP, Model Context Protocol, testing, Node.js, MCP server, protocol testing, YAML testing, JSON-RPC, stdio, API testing, developer tools, test automation, MCP validation, MCP testing framework, pattern matching"
                canonical="https://conductor.rhino-inquisitor.com/"
            />
            <H1 id="mcp-conductor">MCP Conductor</H1>
            <PageSubtitle>Declarative + Programmatic Testing for MCP Servers</PageSubtitle>

            <div className="hero-section bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ship Reliable Model Context Protocol Servers Faster</h2>
                <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                    Declarative YAML or full JavaScript API. 50+ powerful pattern matchers. Automated MCP handshake & JSON-RPC validation. Rich diffs & CI-ready reporting—all battle‑tested across 1300+ real tests and production servers.
                </p>
                <div className="flex items-center justify-center gap-2 mb-6" aria-label="Project status badges">
                    <img src="https://img.shields.io/npm/v/mcp-conductor.svg" alt="npm version badge" />
                    <img src="https://img.shields.io/github/stars/taurgis/mcp-conductor.svg" alt="GitHub stars badge" />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="#/installation"
                        className="no-underline inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-[0.97] transition-all"
                    >
                        Install Now
                    </a>
                    <a
                        href="#/quick-start"
                        className="no-underline inline-flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 active:scale-[0.97] transition-all"
                    >
                        View Quick Start
                    </a>
                    <a
                        href="#/pattern-matching/overview"
                        className="no-underline inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.97] transition-all"
                    >
                        Explore Patterns
                    </a>
                </div>
            </div>

            <H2 id="quick-start">🚀 Quick Start</H2>
            <p>Install globally or locally, initialize, then write your first test.</p>
            <CodeBlock language="bash" code={`
# Option 1: Global install (CLI anywhere)
npm install -g mcp-conductor

# Option 2: Local dev dependency (recommended for projects)
npm install --save-dev mcp-conductor

# Initialize in your MCP project (creates config + test scaffolding)
cd my-mcp-project
npx mcp-conductor init

# Generated:
# - conductor.config.json (derived from package.json)
# - test/mcp/ or tests/mcp/ structure
# - AGENTS.md (AI assistant integration guide)
`} />

            <p>Create your first test:</p>
            <H3 id="yaml-testing">YAML Testing (<InlineCode>test/mcp/my-server.test.mcp.yml</InlineCode>):</H3>
            <CodeBlock language="yaml" code={yamlTestCode} />
            
            <H3 id="programmatic-testing">Programmatic Testing (<InlineCode>test/mcp/my-server.test.js</InlineCode>):</H3>
            <CodeBlock language="javascript" code={jsTestCode} />
            
            <p>Run the tests:</p>
            <CodeBlock language="bash" code={`
# Run YAML tests
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"

# With verbose output and debugging
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml" --verbose --debug

# Run programmatic tests
node --test "test*/mcp/*.test.js"
`} />

            <H2 id="documentation">📖 Documentation</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                <div className="doc-card p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">
                        <a href="#/installation" className="text-blue-600 hover:text-blue-800 hover:underline">🚀 Installation</a>
                    </h3>
                    <p className="text-sm text-gray-600">Get MCP Conductor installed and configured</p>
                </div>
                
                <div className="doc-card p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">
                        <a href="#/quick-start" className="text-blue-600 hover:text-blue-800 hover:underline">⚡ Quick Start</a>
                    </h3>
                    <p className="text-sm text-gray-600">Your first MCP Conductor test in 5 minutes</p>
                </div>
                
                <div className="doc-card p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">
                        <a href="#/yaml-testing" className="text-blue-600 hover:text-blue-800 hover:underline">📝 YAML Testing</a>
                    </h3>
                    <p className="text-sm text-gray-600">Declarative testing with powerful pattern matching</p>
                </div>
                
                <div className="doc-card p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">
                        <a href="#/programmatic-testing" className="text-blue-600 hover:text-blue-800 hover:underline">💻 Programmatic Testing</a>
                    </h3>
                    <p className="text-sm text-gray-600">JavaScript/TypeScript API for advanced scenarios</p>
                </div>
                
                <div className="doc-card p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">
                        <a href="#/pattern-matching/overview" className="text-blue-600 hover:text-blue-800 hover:underline">🔍 Pattern Matching</a>
                    </h3>
                    <p className="text-sm text-gray-600">11+ verified pattern types for flexible validation</p>
                </div>
                
                <div className="doc-card p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">
                        <a href="#/examples" className="text-blue-600 hover:text-blue-800 hover:underline">🏗️ Examples</a>
                    </h3>
                    <p className="text-sm text-gray-600">Real-world examples and best practices</p>
                </div>
            </div>

            <H2 id="key-features">✨ Core Capability Pillars</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🎯 Dual Test Approaches</h3>
                    <p className="text-gray-600">Declarative YAML for clarity or programmatic JS/TS for dynamic logic—use either or combine both.</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🔄 Protocol Automation</h3>
                    <p className="text-gray-600">MCP handshake + JSON-RPC messaging lifecycle handled for you—focus entirely on assertions.</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🧪 Powerful Pattern System</h3>
                    <p className="text-gray-600">50+ matcher types: regex, partial, extraction, cross-field, numeric, date/time, array introspection, negation, and more.</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">📊 Insightful Reporting</h3>
                    <p className="text-gray-600">Readable colored diffs, structured errors, timing data, and CI-friendly exit semantics.</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">⚙️ Extensible API</h3>
                    <p className="text-gray-600">Lightweight JS/TS client for custom flows, performance probes, or framework integration.</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🔧 Ecosystem Friendly</h3>
                    <p className="text-gray-600">Works seamlessly with Node.js test runner, Jest, Mocha—drop-in workflows.</p>
                </div>
            </div>

            <H2 id="why-mcp-conductor">Why Choose MCP Conductor?</H2>
            <p className="text-lg font-semibold text-gray-800 mb-4">Battle‑tested across production MCP ecosystems—trusted for reliability, clarity, and depth of validation.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Complete Protocol Coverage:</strong> Automated MCP handshake + JSON-RPC 2.0 validation
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Dual Testing Modes:</strong> Declarative YAML and programmatic JS/TS in one toolkit
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Advanced Pattern Matching:</strong> 50+ matcher types (regex, extraction, cross-field, date/time, numeric, negation)
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Production Proven:</strong> 1300+ total tests (unit, integration, API) with comprehensive coverage
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Developer Friendly:</strong> Rich reporting, colored output, detailed diffs, and CI/CD integration
                        </div>
                    </li>
                </ul>
            </div>

            <H2 id="production-verified">🏆 Production Verified</H2>
            <p>MCP Conductor has been extensively tested with real-world MCP servers:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="verification-card p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">Simple Filesystem Server</h4>
                    <p className="text-sm text-blue-800">Extensive coverage across file operations, regex, extraction, and string validation scenarios</p>
                </div>
                
                <div className="verification-card p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">Multi-Tool Server</h4>
                    <p className="text-sm text-blue-800">Calculator, text processing, validation, file management, and error surfaces</p>
                </div>
                
                <div className="verification-card p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">API & Data Pattern Servers</h4>
                    <p className="text-sm text-blue-800">Complex validation scenarios, numeric/date logic, nested extraction, performance validation</p>
                </div>
            </div>

            <H2 id="ai-agent-support">🤖 AI Agent Support</H2>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <p className="mb-4">MCP Conductor includes specialized documentation for AI coding assistants:</p>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <span className="text-purple-600 mr-3">🔍</span>
                        <div>
                            <strong>Pattern recognition</strong> for MCP project detection
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-purple-600 mr-3">🤖</span>
                        <div>
                            <strong>Automatic test generation</strong> guidelines
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-purple-600 mr-3">📋</span>
                        <div>
                            <strong>Best practices</strong> for AI-generated test suites
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-purple-600 mr-3">🔗</span>
                        <div>
                            <strong>Integration patterns</strong> with development workflows
                        </div>
                    </li>
                </ul>
                <p className="mt-4">
                    <a href="#/ai-agent-support" className="text-purple-600 hover:text-purple-800 underline font-medium">View AI Agent Support Guide</a>
                </p>
            </div>

            <H2 id="testing-approaches">🧪 Testing Approaches</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="approach-card p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-blue-600">📝 YAML Testing</h3>
                    <p className="text-gray-600 mb-4">Perfect for declarative testing with powerful pattern matching:</p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                        <li>Simple request/response validation</li>
                        <li>Pattern matching (regex, contains, etc.)</li>
                        <li>CI/CD friendly</li>
                        <li>Non-developer accessible</li>
                    </ul>
                </div>
                
                <div className="approach-card p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-green-600">💻 Programmatic Testing</h3>
                    <p className="text-gray-600 mb-4">For complex validation and dynamic testing scenarios:</p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                        <li>Complex validation logic</li>
                        <li>Dynamic test generation</li>
                        <li>Framework integration (Jest, Mocha)</li>
                        <li>Performance testing</li>
                    </ul>
                </div>
            </div>

            <H2 id="getting-started-section">🚀 Get Started in Minutes</H2>
            <div className="get-started-section bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Install • Configure • Validate</h3>
                <p className="text-gray-600 mb-6">From first install to production-grade validation in a single workflow.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="#/installation"
                        className="no-underline inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-[0.97] transition-all"
                    >
                        Installation Guide
                    </a>
                    <a
                        href="#/quick-start"
                        className="no-underline inline-flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 active:scale-[0.97] transition-all"
                    >
                        Quick Start Tutorial
                    </a>
                    <a
                        href="#/pattern-matching/overview"
                        className="no-underline inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.97] transition-all"
                    >
                        Pattern Matching Deep Dive
                    </a>
                </div>
            </div>

            <H2 id="comprehensive-testing-stats">📊 Validation Footprint</H2>
            <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">1300+</div>
                    <div className="text-sm text-gray-600">Automated Tests</div>
                </div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Test Coverage</div>
                </div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">50+</div>
                    <div className="text-sm text-gray-600">Matcher Types</div>
                </div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">4</div>
                    <div className="text-sm text-gray-600">Example Servers</div>
                </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-2">🎯 Unified MCP Validation Toolkit</h4>
                <p className="text-gray-700">From handshake negotiation to deep semantic response validation, MCP Conductor unifies declarative and programmatic strategies—delivering precision feedback, scalable pattern coverage, and production‑grade reliability signals.</p>
            </div>
        </>
    );
};

export default HomePage;