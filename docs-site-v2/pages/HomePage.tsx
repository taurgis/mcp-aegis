import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

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
            <H1 id="mcp-conductor">MCP Conductor</H1>
            <PageSubtitle>The Complete Model Context Protocol Testing Solution</PageSubtitle>
            
            <div className="hero-section bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Comprehensive testing for Model Context Protocol servers</h2>
                <p className="text-lg text-gray-600 mb-6">A powerful Node.js testing library that provides both YAML-based declarative testing and programmatic testing for MCP servers with advanced pattern matching capabilities and 100% protocol compliance validation.</p>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                    <img src="https://img.shields.io/npm/v/mcp-conductor.svg" alt="npm version" />
                    <img src="https://img.shields.io/github/stars/taurgis/mcp-conductor.svg" alt="GitHub stars" />
                </div>
            </div>

            <H2 id="quick-start">🚀 Quick Start</H2>
            <p>Get up and running with MCP Conductor in minutes:</p>
            <CodeBlock language="bash" code={`
# Install globally
npm install -g mcp-conductor

# Initialize in your MCP project
cd my-mcp-project
npx mcp-conductor init

# This creates:
# - conductor.config.json (auto-configured from package.json)
# - test/mcp/ or tests/mcp/ directory structure  
# - AGENTS.md guide for AI development
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

            <H2 id="key-features">✨ Key Features</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🎯 Declarative Testing</h3>
                    <p className="text-gray-600">Write tests in simple YAML files with intuitive syntax</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🔄 Automatic Protocol Handling</h3>
                    <p className="text-gray-600">Handles MCP initialization handshake and JSON-RPC messaging</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🧪 Advanced Pattern Matching</h3>
                    <p className="text-gray-600">11+ verified pattern types including regex, partial matching, and field extraction</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">📊 Rich Reporting</h3>
                    <p className="text-gray-600">Color-coded output with detailed diffs for test failures</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🛠️ Programmatic API</h3>
                    <p className="text-gray-600">JavaScript/TypeScript API for complex testing scenarios</p>
                </div>
                
                <div className="feature p-6 border border-gray-200 rounded-lg bg-white">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">🔧 Framework Integration</h3>
                    <p className="text-gray-600">Works with Node.js test runner, Jest, Mocha, and more</p>
                </div>
            </div>

            <H2 id="why-mcp-conductor">Why Choose MCP Conductor?</H2>
            <p className="text-lg font-semibold text-gray-800 mb-4">The industry standard for MCP testing - battle-tested with production servers and trusted by developers building AI agents and protocol-compliant applications.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Complete Protocol Coverage:</strong> Full MCP 2025-06-18 compliance with JSON-RPC 2.0 validation
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Dual Testing Approaches:</strong> Both YAML declarative and programmatic JavaScript/TypeScript APIs
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Advanced Pattern Matching:</strong> 11+ verified pattern types for flexible validation
                        </div>
                    </li>
                    <li className="flex items-start">
                        <span className="text-green-600 mr-2">✅</span>
                        <div>
                            <strong>Production Ready:</strong> 280+ test cases, 100% test coverage, successfully tested with real MCP servers
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
                    <p className="text-sm text-blue-800">47 test cases covering file operations, regex patterns, and string validation</p>
                </div>
                
                <div className="verification-card p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">Multi-Tool Server</h4>
                    <p className="text-sm text-blue-800">20 test cases with calculator, text processing, validation, and file management tools</p>
                </div>
                
                <div className="verification-card p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-semibold text-blue-900 mb-2">Production APIs</h4>
                    <p className="text-sm text-blue-800">Real-world MCP servers with complex validation scenarios and performance requirements</p>
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
                    <a href="#/ai-agents" className="text-purple-600 hover:text-purple-800 underline font-medium">View AI Agent Guide</a>
                </p>
            </div>

            <H2 id="testing-approaches">🧪 Testing Approaches</H2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="approach-card p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-blue-600">📝 YAML Testing</h3>
                    <p className="text-gray-600 mb-4">Perfect for declarative testing with powerful pattern matching:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Simple request/response validation</li>
                        <li>• Pattern matching (regex, contains, etc.)</li>
                        <li>• CI/CD friendly</li>
                        <li>• Non-developer accessible</li>
                    </ul>
                </div>
                
                <div className="approach-card p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-green-600">💻 Programmatic Testing</h3>
                    <p className="text-gray-600 mb-4">For complex validation and dynamic testing scenarios:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Complex validation logic</li>
                        <li>• Dynamic test generation</li>
                        <li>• Framework integration (Jest, Mocha)</li>
                        <li>• Performance testing</li>
                    </ul>
                </div>
            </div>

            <H2 id="getting-started-section">🚀 Ready to Get Started?</H2>
            <div className="get-started-section bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to get started?</h3>
                <p className="text-gray-600 mb-6">Join developers worldwide who trust MCP Conductor for their Model Context Protocol testing needs.</p>
                <div className="space-x-4">
                    <a href="#/installation" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Install MCP Conductor
                    </a>
                    <a href="#/quick-start" className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                        Try the Quick Start
                    </a>
                </div>
            </div>

            <H2 id="comprehensive-testing-stats">📊 Testing Statistics</H2>
            <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">280+</div>
                    <div className="text-sm text-gray-600">Test Cases</div>
                </div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Test Coverage</div>
                </div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">11+</div>
                    <div className="text-sm text-gray-600">Pattern Types</div>
                </div>
                <div className="stat-card text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Example Servers</div>
                </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-2">🎯 The Complete MCP Testing Solution</h4>
                <p className="text-gray-700">MCP Conductor is the most comprehensive testing framework for Model Context Protocol servers. With dual testing approaches, advanced pattern matching, and production-verified examples, it's everything you need to ensure your MCP servers work reliably in production environments.</p>
            </div>
        </>
    );
};

export default HomePage;