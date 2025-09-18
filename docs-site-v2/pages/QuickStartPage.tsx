import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';

const QuickStartPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Quick Start Guide - MCP Conductor</title>
                <meta name="description" content="Get up and running with MCP Conductor in 5 minutes. Step-by-step guide to start testing Model Context Protocol servers with YAML and programmatic approaches." />
                <meta name="keywords" content="MCP quick start, MCP Conductor tutorial, Model Context Protocol testing guide, MCP setup, YAML testing setup, programmatic testing setup" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Quick Start - Test MCP Servers in 5 Minutes" />
                <meta property="og:description" content="Complete quick start guide for MCP Conductor. Learn to test Model Context Protocol servers with YAML and programmatic approaches in just 5 minutes." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/quick-start" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Quick Start - Test MCP Servers in 5 Minutes" />
                <meta name="twitter:description" content="Complete quick start guide for MCP Conductor. Learn to test Model Context Protocol servers with YAML and programmatic approaches in just 5 minutes." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/quick-start" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>
            <H1 id="quick-start-guide">Quick Start Guide</H1>
            <PageSubtitle>MCP Testing in 5 Minutes</PageSubtitle>
            <p className="text-lg text-gray-700 mb-8">Get up and running with MCP Conductor Model Context Protocol testing in 5 minutes with this step-by-step guide.</p>
            
            {/* Quick Navigation */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Choose Your Path</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-blue-300 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">⚡ Quick Setup (Recommended)</h4>
                        <p className="text-sm text-gray-600 mb-3">Automatic setup with one command</p>
                        <Link to="/quick-start#method-1-quick-setup" className="no-underline inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                            Jump to Quick Setup →
                        </Link>
                    </div>
                    <div className="p-4 bg-white border border-gray-300 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">🔧 Manual Setup</h4>
                        <p className="text-sm text-gray-600 mb-3">Step-by-step custom configuration</p>
                        <Link to="/quick-start#method-2-manual-setup" className="no-underline inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                            Jump to Manual Setup →
                        </Link>
                    </div>
                </div>
            </div>
            
            <H2 id="method-1-quick-setup">⚡ Method 1: Quick Setup (Recommended)</H2>
            
            <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                    <div className="mt-8 flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">Navigate and Initialize</h3>
                        <CodeBlock language="bash" code={`
# Navigate to your MCP project directory
cd my-mcp-project

# Initialize MCP Conductor (automatically installs as dev dependency)
npx mcp-conductor init
                        `} />
                        <p className="mt-2 text-sm text-gray-600">This creates: <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor.config.json</code>, a test directory structure, and installs the package.</p>
                    </div>
                </div>
            </div>
            
            <div className="my-6 p-4 border border-slate-300 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  📁 Project Structure After Init
                  <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">Auto-generated</span>
              </h4>
              <CodeBlock language="text" code={`
project/
├── conductor.config.json    # ← Server configuration  
├── package.json            # ← Updated with mcp-conductor dev dependency
├── test/                   # ← Uses 'test/' if exists, otherwise creates 'tests/'
│   └── mcp/
│       ├── AGENTS.md       # ← AI assistant guide
│       ├── yaml/           # ← YAML test files (.test.mcp.yml)
│       │   └── AGENTS.md   # ← YAML-specific guidance
│       └── node/           # ← Programmatic tests (.programmatic.test.js)
│           └── AGENTS.md   # ← Node.js-specific guidance
└── server.js              # ← Your MCP server (update conductor.config.json if different)
              `} />
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2">💡</span>
                      The init command detects existing 'test/' or 'tests/' directories and uses whichever exists, or creates 'test/' by default. 
                      <strong className="ml-1">Skip to Step 3</strong> if using this method.
                  </p>
              </div>
            </div>
            
            <div className="my-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    ✅ Quick Setup Complete!
                </h4>
                <p className="text-sm text-green-700 mb-3">Your project is now ready for MCP testing. You can either:</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/quick-start#step-3-write-test" className="no-underline inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Continue to Write Tests →
                    </Link>
                    <Link to="/quick-start#method-2-manual-setup" className="no-underline inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Or Learn Manual Setup
                    </Link>
                </div>
            </div>
            
            <H2 id="method-2-manual-setup">🔧 Method 2: Manual Setup</H2>
          
            <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                    <div className="mt-8 flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div className="flex-1">
                        <H3 id="step-1-install">Install MCP Conductor</H3>
                        <p className="text-gray-600 mb-4">You can install MCP Conductor globally for system-wide access or locally in your project:</p>
                        <CodeBlock language="bash" code={`
# Option A: Global installation (recommended for CLI usage)
npm install -g mcp-conductor

# Option B: Local installation (if you prefer local dependencies)
npm install --save-dev mcp-conductor
# Then use: npx mcp-conductor instead of just conductor
                        `} />
                    </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                    <div className="mt-8 flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div className="flex-1">
                        <H3 id="step-2-server">Create a Simple MCP Server</H3>
                        <p className="text-gray-600 mb-4">Create a basic MCP server for testing (<code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">server.js</code>):</p>
                        <CodeBlock language="javascript" code={`
#!/usr/bin/env node

const serverInfo = { name: "demo-server", version: "1.0.0" };
const tools = [
  {
    name: "hello",
    description: "Says hello with a friendly greeting",
    inputSchema: { 
      type: "object", 
      properties: { 
        name: { type: "string", description: "Name to greet" } 
      }, 
      required: ["name"] 
    }
  }
];

let initialized = false;

process.stdin.on('data', (data) => {
  try {
    const message = JSON.parse(data.toString().trim());
    
    if (message.method === 'initialize') {
      sendResponse(message.id, { 
        protocolVersion: "2025-06-18", 
        capabilities: { tools: {} }, 
        serverInfo 
      });
    } else if (message.method === 'initialized') {
      initialized = true;
      // Notifications don't get responses
    } else if (message.method === 'tools/list') {
      if (!initialized) {
        sendError(message.id, -32002, "Server not initialized");
        return;
      }
      sendResponse(message.id, { tools });
    } else if (message.method === 'tools/call' && message.params?.name === 'hello') {
      if (!initialized) {
        sendError(message.id, -32002, "Server not initialized");
        return;
      }
      const name = message.params.arguments?.name;
      if (!name) {
        sendResponse(message.id, { 
          isError: true, 
          content: [{ type: "text", text: "Missing required parameter: name" }] 
        });
        return;
      }
      sendResponse(message.id, { 
        content: [{ type: "text", text: \`Hello, \${name}! 👋 Welcome to MCP!\` }],
        isError: false
      });
    } else {
      sendError(message.id, -32601, "Method not found");
    }
  } catch (error) {
    sendError(null, -32700, "Parse error");
  }
});

function sendResponse(id, result) {
  console.log(JSON.stringify({ jsonrpc: "2.0", id, result }));
}

function sendError(id, code, message) {
  console.log(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }));
}

// Signal server is ready
setTimeout(() => console.error("Server ready"), 100);
                        `} />
                    </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                    <div className="mt-8 flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div className="flex-1">
                        <H3 id="step-3-config">Create Configuration (Manual Setup Only)</H3>
                        <p className="text-gray-600 mb-4">Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor.config.json</code>:</p>
            
                        <div className="my-4 p-4 border border-blue-300 bg-blue-50 rounded-md">
                          <h4 className="font-semibold text-blue-800 mb-1">📝 Config File Naming</h4>
                          <p className="text-sm text-blue-800">
                            <strong>Standard:</strong> Use <code>conductor.config.json</code> (default, auto-detected)<br/>
                            <strong>Custom:</strong> Use any name like <code>server.config.json</code> or <code>config.json</code> and specify with <code>--config</code> flag<br/>
                            <strong>Examples:</strong> You'll see both patterns in the repository - the examples use short names like <code>config.json</code> for brevity, but <code>conductor.config.json</code> is recommended for clarity in real projects.
                          </p>
                        </div>
            
                        <CodeBlock language="json" code={`
{
  "name": "Demo MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000,
  "readyPattern": "Server ready"
}
                        `} />
                    </div>
                </div>
            </div>

            <H2 id="step-3-write-test">📝 Step 3: Write Your First Test</H2>
            <div className="mb-4">
                <p className="text-gray-600">Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">demo.test.mcp.yml</code>:</p>
            </div>
            
            <div className="grid gap-4 mb-6">
                <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      💡 Working Example Available
                      <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-1 rounded">Verified</span>
                  </h4>
                  <p className="text-sm text-green-800">You can find this complete working example in <a href="https://github.com/taurgis/mcp-conductor/tree/main/examples/demo-server" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline font-medium"><code>examples/demo-server/</code></a> in the MCP Conductor repository. All the code below has been tested and verified to work.</p>
                </div>
                
                <div className="p-4 border border-blue-300 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      🚀 Beginner Approach (Recommended)
                      <span className="ml-2 text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded">Auto-handshake</span>
                  </h4>
                  <p className="text-sm text-blue-800">Let MCP Conductor handle the handshake automatically. MCP Conductor will send the <code>initialize</code> request and <code>initialized</code> notification before your first test runs. This approach ensures your tools work correctly without needing to understand the handshake protocol details. This covers 90% of use cases.</p>
                </div>
            </div>
            
            <CodeBlock language="yaml" code={`
description: "Demo MCP Server Tests"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-test"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tools-test"
        result:
          tools:
            - name: "hello"
              description: "match:contains:hello"
              inputSchema:
                type: "object"
                properties: "match:type:object"
                required: ["name"]
      stderr: "toBeEmpty"

  - it: "should execute hello tool"
    request:
      jsonrpc: "2.0"
      id: "hello-test"
      method: "tools/call"
      params:
        name: "hello"
        arguments:
          name: "World"
    expect:
      response:
        jsonrpc: "2.0"
        id: "hello-test"
        result:
          content:
            - type: "text"
              text: "match:contains:Hello, World"
          isError: false
      stderr: "toBeEmpty"

  - it: "should handle invalid tool"
    request:
      jsonrpc: "2.0" 
      id: "error-test"
      method: "tools/call"
      params:
        name: "nonexistent"
        arguments: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-test"
        error:
          code: -32601
          message: "Method not found"
      stderr: "toBeEmpty"
            `} />
            
            <div className="my-4 p-4 border border-amber-300 bg-amber-50 rounded-md">
              <h4 className="font-semibold text-amber-800 mb-1">⚙️ Advanced: Manual Handshake Testing</h4>
              <p className="text-sm text-amber-800 mb-2">Include an <code>initialize</code> test if you want to verify handshake behavior or test specific protocol versions. This runs as an additional test alongside MCP Conductor's automatic handshake.</p>
              <CodeBlock language="yaml" code={`
# Add this as the FIRST test if you want manual control:
- it: "should initialize successfully"
  request:
    jsonrpc: "2.0"
    id: "init-test" 
    method: "initialize"
    params:
      protocolVersion: "2025-06-18"
      capabilities: { tools: {} }
      clientInfo: { name: "test-client", version: "1.0.0" }
  expect:
    response:
      jsonrpc: "2.0"
      id: "init-test"
      result:
        protocolVersion: "match:regex:20\\\\d{2}-\\\\d{2}-\\\\d{2}"
        capabilities: "match:type:object"
        serverInfo:
          name: "demo-server"
          version: "1.0.0"
  stderr: "toBeEmpty"
              `} />
              <p className="text-xs text-amber-700">📝 Note: Both automatic handshake (for setup) and manual initialize test (for validation) will occur, giving you the best of both worlds - working tools plus handshake verification.</p>
            </div>
            <div className="my-8 p-4 border border-amber-300 bg-amber-50 rounded-md">
              <h4 className="font-semibold text-amber-800 mb-1">Error Handling Models</h4>
              <p className="text-sm text-amber-800">Two patterns exist for representing failures:</p>
              <ul className="list-disc pl-5 text-sm text-amber-800 space-y-1 mt-2">
                <li><strong>JSON-RPC transport / protocol error</strong>: Use the top-level <code>error</code> object (method not found, invalid request).</li>
                <li><strong>Tool-level logical failure</strong>: Return a normal <code>result</code> with <code>isError: true</code> and explanatory <code>content</code>.</li>
              </ul>
              <p className="text-xs text-amber-700 mt-2">Pick one per response; do not mix both for the same request.</p>
            </div>
            
            <H2 id="step-4-run-tests">Step 4: Run Your Tests</H2>
            <H3 id="for-quick-setup">For Quick Setup (Method 1):</H3>
            <CodeBlock language="bash" code={`
# Universal pattern that works for both test/ and tests/ directories:
npx mcp-conductor "test*/mcp/yaml/**/*.test.mcp.yml"

# Or add to package.json scripts for convenience:
# "scripts": { 
#   "test:mcp:yaml": "mcp-conductor \\"test*/mcp/yaml/**/*.test.mcp.yml\\"",
#   "test:mcp:node": "node --test \\"test*/mcp/node/**/*.programmatic.test.js\\""
# }
# Then run:
npm run test:mcp:yaml

# Specific directory examples (if you know your structure):
# npx mcp-conductor "test/mcp/yaml/**/*.test.mcp.yml"     # if test/ directory
# npx mcp-conductor "tests/mcp/yaml/**/*.test.mcp.yml"   # if tests/ directory
            `} />
            
            <H3 id="for-manual-setup">For Manual Setup (Method 2):</H3>
            <CodeBlock language="bash" code={`
# If installed globally, use 'conductor':
conductor demo.test.mcp.yml --config conductor.config.json

# If installed locally, use 'npx mcp-conductor':
npx mcp-conductor demo.test.mcp.yml --config conductor.config.json

# With verbose output for detailed results
conductor demo.test.mcp.yml --config conductor.config.json --verbose

# With debug mode for MCP communication details  
conductor demo.test.mcp.yml --config conductor.config.json --debug

# With timing information for performance analysis
conductor demo.test.mcp.yml --config conductor.config.json --timing

# Combine options for maximum debugging
conductor demo.test.mcp.yml --config conductor.config.json --verbose --debug --timing

# Error reporting options for focused debugging
conductor demo.test.mcp.yml --config conductor.config.json --errors-only
conductor demo.test.mcp.yml --config conductor.config.json --syntax-only
conductor demo.test.mcp.yml --config conductor.config.json --group-errors
conductor demo.test.mcp.yml --config conductor.config.json --max-errors 3
            `} />

            <H2 id="understanding-output">📊 Understanding the Test Output</H2>
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    ✅ Success Output Example
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">All tests passed</span>
                </h4>
                <p className="text-sm text-gray-600 mb-3">When your tests run successfully, you should see output like this:</p>
            </div>
            <CodeBlock language="bash" code={`
📋 Loaded configuration for: Demo MCP Server
🧪 Found 1 test suite(s)
ℹ️  Starting MCP server...
ℹ️  Server started successfully
ℹ️  Performing MCP handshake...
ℹ️  Handshake completed successfully

📋 Demo MCP Server Tests
   demo.test.mcp.yml

  ● should initialize successfully ... ✓ PASS
  ● should list available tools ... ✓ PASS
  ● should execute hello tool ... ✓ PASS
  ● should handle invalid tool ... ✓ PASS
ℹ️  Shutting down server...
ℹ️  Server shut down successfully

📊 Test Results:
   ✓ 4 passed
   📈 Total: 4

🎉 All tests passed!
            `} />

            <H2 id="understanding-test-structure">🏗️ Understanding the Test Structure</H2>
            <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">📋 YAML Test Anatomy</h4>
                <p className="text-sm text-indigo-700">Each MCP Conductor YAML test follows this structure:</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-2">📝 description</h5>
                    <p className="text-sm text-gray-600">Human-readable test suite description</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-2">🧪 tests</h5>
                    <p className="text-sm text-gray-600">Array of individual test cases</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-2">✅ it</h5>
                    <p className="text-sm text-gray-600">Description of what the test should do</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-2">📤 request</h5>
                    <p className="text-sm text-gray-600">JSON-RPC request to send to server</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-2">📥 expect</h5>
                    <p className="text-sm text-gray-600">Expected response structure</p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-2">📢 stderr</h5>
                    <p className="text-sm text-gray-600">Expected stderr output (optional)</p>
                </div>
            </div>

            <H2 id="next-steps">Next Steps</H2>
            <p>Now that you have a basic test running, explore these advanced features:</p>
            
            <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">🎯 Essential Next Steps</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/pattern-matching" className="text-blue-600 hover:text-blue-800 font-medium">Pattern Matching Overview</Link>
                            <p className="text-sm text-gray-600">Master 50+ pattern types for flexible validation - the core power of MCP Conductor</p>
                        </li>
                        <li>
                            <Link to="/pattern-matching/basic" className="text-blue-600 hover:text-blue-800 font-medium">Basic Patterns</Link>
                            <p className="text-sm text-gray-600">String matching, type validation, length checks, and negation patterns</p>
                        </li>
                        <li>
                            <Link to="/pattern-matching/array" className="text-blue-600 hover:text-blue-800 font-medium">Array Patterns</Link>
                            <p className="text-sm text-gray-600">Array length, elements validation, and enhanced contains matching</p>
                        </li>
                    </ul>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">🚀 Advanced Features</h3>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/yaml-testing" className="text-blue-600 hover:text-blue-800 font-medium">YAML Testing Guide</Link>
                            <p className="text-sm text-gray-600">Advanced YAML testing patterns and best practices</p>
                        </li>
                        <li>
                            <Link to="/programmatic-testing" className="text-blue-600 hover:text-blue-800 font-medium">Programmatic Testing</Link>
                            <p className="text-sm text-gray-600">Use the JavaScript/TypeScript API for dynamic testing</p>
                        </li>
                        <li>
                            <Link to="/examples" className="text-blue-600 hover:text-blue-800 font-medium">Examples</Link>
                            <p className="text-sm text-gray-600">Real-world testing scenarios and reference implementations</p>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="my-6 p-4 border border-indigo-300 bg-indigo-50 rounded-md">
                <h4 className="font-semibold text-indigo-800 mb-2">🎯 Recommended Learning Path</h4>
                <ol className="list-decimal pl-5 text-sm text-indigo-800 space-y-1">
                    <li>Start with <Link to="/pattern-matching/basic" className="underline">Basic Patterns</Link> to understand core validation concepts</li>
                    <li>Explore <Link to="/pattern-matching/array" className="underline">Array Patterns</Link> for validating tool lists and response arrays</li>
                    <li>Learn <Link to="/troubleshooting#query-command-debugging" className="underline">Query Command</Link> for interactive debugging</li>
                    <li>Graduate to <Link to="/programmatic-testing" className="underline">Programmatic Testing</Link> for complex scenarios</li>
                </ol>
            </div>

            <H2 id="debugging-with-query">Quick Debugging with Query Command</H2>
            <p>Use the <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">query</code> command to test tools directly without writing test files:</p>
            <CodeBlock language="bash" code={`
# List all available tools from your server (if globally installed)
conductor query --config conductor.config.json

# If locally installed, use npx:
npx mcp-conductor query --config conductor.config.json

# Test the hello tool with arguments
conductor query hello '{"name": "World"}' --config conductor.config.json

# Using the method-based approach (newer interface)
conductor query --config conductor.config.json --method tools/list
conductor query --config conductor.config.json --method tools/call --params '{"name": "hello", "arguments": {"name": "World"}}'

# Get JSON output (useful for scripting)
conductor query hello '{"name": "World"}' --config conductor.config.json --json

# If using custom config file names (e.g., examples use config.json):
conductor query --config examples/demo-server/config.json --method tools/list
            `} />
            <p>This is perfect for:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Verifying your server is working before writing tests</li>
                <li>Exploring what tools your server provides</li>
                <li>Testing tool arguments and responses quickly</li>
                <li>Debugging issues during development</li>
                <li>Learning MCP responses before writing pattern matching assertions</li>
            </ul>

            <H2 id="troubleshooting">🚨 Common Quick Start Issues</H2>
            
            <div className="grid gap-6 my-6">
                <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
                    <H3 id="server-wont-start" className="text-red-800 mb-4 flex items-center">
                        🔴 Server Won't Start
                        <span className="ml-2 text-xs bg-red-200 text-red-700 px-2 py-1 rounded">Common Issue</span>
                    </H3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <strong className="text-red-800">Make server executable:</strong> 
                                <code className="ml-2 text-sm font-mono bg-red-100 text-red-800 rounded-md px-1 py-0.5">chmod +x server.js</code>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <strong className="text-red-800">Check shebang line:</strong> 
                                <span className="ml-2 text-sm text-red-700">Ensure server starts with <code className="text-sm font-mono bg-red-100 text-red-800 rounded-md px-1 py-0.5">#!/usr/bin/env node</code></span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <strong className="text-red-800">Verify config:</strong> 
                                <span className="ml-2 text-sm text-red-700">Ensure <code className="text-sm font-mono bg-red-100 text-red-800 rounded-md px-1 py-0.5">conductor.config.json</code> command/args match your setup</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <div>
                                <strong className="text-red-800">Increase timeout:</strong> 
                                <span className="ml-2 text-sm text-red-700">If server takes time to start, try <code className="text-sm font-mono bg-red-100 text-red-800 rounded-md px-1 py-0.5">"startupTimeout": 10000</code></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border border-orange-200 bg-orange-50 rounded-lg">
                    <H3 id="tests-fail-immediately" className="text-orange-800 mb-4 flex items-center">
                        🟠 Tests Fail Immediately
                        <span className="ml-2 text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded">Setup Issue</span>
                    </H3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <strong className="text-orange-800">Check ready pattern:</strong> 
                                <span className="ml-2 text-sm text-orange-700">If using <code className="text-sm font-mono bg-orange-100 text-orange-800 rounded-md px-1 py-0.5">readyPattern</code>, ensure your server outputs it to stderr</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <strong className="text-orange-800">Verify handshake:</strong> 
                                <span className="ml-2 text-sm text-orange-700">Ensure your server responds to <code className="text-sm font-mono bg-orange-100 text-orange-800 rounded-md px-1 py-0.5">initialize</code> method</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <strong className="text-orange-800">Debug mode:</strong> 
                                <span className="ml-2 text-sm text-orange-700">Add <code className="text-sm font-mono bg-orange-100 text-orange-800 rounded-md px-1 py-0.5">--debug</code> flag to see MCP communication</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <H3 id="permission-issues" className="text-yellow-800 mb-4 flex items-center">
                        🟡 Permission Issues
                        <span className="ml-2 text-xs bg-yellow-200 text-yellow-700 px-2 py-1 rounded">System Config</span>
                    </H3>
                    <CodeBlock language="bash" code={`
# Make server executable
chmod +x server.js

# If using npm scripts, ensure proper escaping:
"test:mcp": "mcp-conductor \\"test*/mcp/yaml/**/*.test.mcp.yml\\""
                    `} />
                </div>

                <div className="p-6 border border-purple-200 bg-purple-50 rounded-lg">
                    <H3 id="pattern-matching-issues" className="text-purple-800 mb-4 flex items-center">
                        🟣 Pattern Matching Issues
                        <span className="ml-2 text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">Syntax Help</span>
                    </H3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <strong className="text-purple-800">Escape backslashes:</strong> 
                                <span className="ml-2 text-sm text-purple-700">Use <code className="text-sm font-mono bg-purple-100 text-purple-800 rounded-md px-1 py-0.5">\\\\d+</code> instead of <code className="text-sm font-mono bg-purple-100 text-purple-800 rounded-md px-1 py-0.5">\\d+</code> in YAML regex patterns</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <strong className="text-purple-800">Check exact vs partial matching:</strong> 
                                <span className="ml-2 text-sm text-purple-700">Use <code className="text-sm font-mono bg-purple-100 text-purple-800 rounded-md px-1 py-0.5">match:contains:text</code> for partial matches</span>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <strong className="text-purple-800">Use verbose mode:</strong> 
                                <span className="ml-2 text-sm text-purple-700">Add <code className="text-sm font-mono bg-purple-100 text-purple-800 rounded-md px-1 py-0.5">--verbose</code> to see detailed comparison output</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <H2 id="common-patterns">Common Patterns</H2>
            <p>Here are some useful patterns you'll use frequently:</p>
            
            <H3 id="pattern-matching-basics">Pattern Matching Basics</H3>
            <CodeBlock language="yaml" code={`
# Type validation
result: "match:type:object"
tools: "match:type:array"
count: "match:type:number"

# String patterns
message: "match:contains:success"
filename: "match:startsWith:data_"
extension: "match:endsWith:.json"

# Array patterns
tools: "match:arrayLength:3"        # Exactly 3 elements
# To assert presence of a specific tool name (use in a separate assertion, not together):
# tools: "match:arrayContains:name:hello"

# Negation & extraction examples
tools: "match:not:arrayLength:0"    # Array must NOT be empty
match:extractField: "tools.*.name"  # (Use in separate test: extract all tool names)
            `} />

            <H3 id="error-handling-patterns">Error Handling</H3>
            <CodeBlock language="yaml" code={`
- it: "should handle errors gracefully"
  request:
    method: "tools/call"
    params:
      name: "invalid_tool"
      arguments: {}
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Unknown tool"

# Alternative: JSON-RPC error response (for protocol-level errors)
- it: "should return JSON-RPC error for invalid method"
  request:
    method: "invalid/method"
    params: {}
  expect:
    response:
      error:
        code: -32601
        message: "Method not found"
            `} />
        </>
    );
};

export default QuickStartPage;