import React from 'react';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';

const InstallationPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Installation Guide - MCP Conductor</title>
                <meta name="description" content="Complete installation guide for MCP Conductor. Get the Node.js testing library for Model Context Protocol servers installed with npm, global installation, and troubleshooting tips." />
                <meta name="keywords" content="MCP Conductor installation, install MCP testing library, npm install MCP Conductor, Node.js MCP testing setup, Model Context Protocol installation" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Installation - Get Started with MCP Testing" />
                <meta property="og:description" content="Step-by-step installation guide for MCP Conductor. Install the complete Node.js testing library for Model Context Protocol servers in minutes." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/#/installation" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Installation - Get Started with MCP Testing" />
                <meta name="twitter:description" content="Step-by-step installation guide for MCP Conductor. Install the complete Node.js testing library for Model Context Protocol servers in minutes." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/#/installation" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>
            <H1 id="installation-guide">Installation Guide</H1>
            <PageSubtitle>Get MCP Conductor Running in Minutes</PageSubtitle>
            <p>Get MCP Conductor installed and ready for testing your Model Context Protocol servers with this comprehensive installation guide.</p>
            
            <H2 id="prerequisites">Prerequisites</H2>
            <ul className="list-disc pl-6">
                <li><strong>Node.js</strong>: Version 18 or higher</li>
                <li><strong>npm</strong>: Version 8 or higher</li>
            </ul>

            <H2 id="global-installation">Global Installation</H2>
            <p>Install MCP Conductor globally to use the <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor</code> or <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">mcp-conductor</code> command anywhere:</p>
            <CodeBlock language="bash" code="npm install -g mcp-conductor" />
            <p>Verify the installation:</p>
            <CodeBlock language="bash" code={`
conductor --version
# or
mcp-conductor --version
            `} />
            
            <H2 id="quick-project-setup">Quick Project Setup</H2>
            <p>The fastest way to get started in an existing Node.js project:</p>
            <CodeBlock language="bash" code={`
# Navigate to your MCP project directory
cd my-mcp-project

# Initialize MCP Conductor (creates config and test structure)
npx mcp-conductor init
            `} />
            <p>This command will:</p>
            <ul className="list-disc pl-6">
                <li>Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor.config.json</code> based on your <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">package.json</code></li>
                <li>Create test directory structure (<code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">test/mcp/</code> or <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">tests/mcp/</code> based on existing project layout)</li>
                <li>Copy the AI agent guide (<code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">AGENTS.md</code>) to your test directory</li>
                <li>Install <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">mcp-conductor</code> as a dev dependency in your project</li>
            </ul>

            <H2 id="local-installation">Local Installation (Manual)</H2>
            <p>The <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">init</code> command automatically installs MCP Conductor as a dev dependency, but you can also do this manually:</p>
            <CodeBlock language="bash" code="npm install --save-dev mcp-conductor" />

            <H2 id="configuration">Configuration</H2>
            <p>Create a configuration file to tell MCP Conductor how to start your MCP server:</p>
      <div className="my-6 p-5 rounded-lg border border-slate-200 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-900 tracking-wide mb-2">DEFAULTS SUMMARY</h3>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li><strong>cwd</strong>: Current working directory at invocation time</li>
          <li><strong>env</strong>: Inherits process environment + any overrides in <code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded">config.env</code></li>
          <li><strong>startupTimeout</strong>: <code>5000</code> ms (runtime default - server must print readiness / complete handshake before this)</li>
          <li><strong>readyPattern</strong>: <em>null</em> (not required; if provided, stderr is scanned for regex match before proceeding)</li>
          <li><strong>protocolVersion (handshake)</strong>: <code>2025-06-18</code> (automatically used by the built-in handshake the runner performs before YAML tests. If you manually send an <code>initialize</code> request in a test file, you must include a valid <code>protocolVersion</code> yourself.)</li>
          <li><strong>Buffers</strong>: stderr/stdout captured; clear via <code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded">client.clearAllBuffers()</code> in programmatic tests</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">These defaults come from <code>ConfigLoader</code> and handshake logic. Override any field in <code>conductor.config.json</code>.</p>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
          <p className="text-xs text-amber-800"><strong>Note:</strong> The <code>init</code> command generates configs with <code>startupTimeout: 10000</code> for better reliability during initial setup, while the runtime default is <code>5000</code> ms if no config value is specified.</p>
        </div>
      </div>
            <H3 id="basic-configuration">Basic Configuration</H3>
            <p>Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor.config.json</code>:</p>
            <CodeBlock language="json" code={`
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000
}
            `} />

            <H3 id="advanced-configuration">Advanced Configuration</H3>
            <CodeBlock language="json" code={`
{
  "name": "Advanced MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./server-directory",
  "startupTimeout": 10000,
  "readyPattern": "Server listening on port \\\\d+",
  "env": {
    "NODE_ENV": "test",
    "LOG_LEVEL": "debug"
  }
}
            `} />

            <H3 id="configuration-fields">Configuration Fields</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>name</strong>: Human-readable server name</li>
                <li><strong>command</strong>: Executable command (e.g., "node", "python", "/usr/bin/node")</li>
                <li><strong>args</strong>: Array of command arguments</li>
                <li><strong>cwd</strong>: Working directory for the server (optional)</li>
                <li><strong>startupTimeout</strong>: Milliseconds to wait for server startup (runtime default: 5000ms, init generates: 10000ms)</li>
                <li><strong>readyPattern</strong>: Regex pattern to detect when server is ready (optional)</li>
                <li><strong>env</strong>: Environment variables for the server process (optional)</li>
            </ul>

            <H2 id="verification">Verification</H2>
            <p>Verify your installation works correctly:</p>
            
            <H3 id="verify-package">1. Verify Package Availability</H3>
            <p>First, confirm the package is available and check the latest version:</p>
            <CodeBlock language="bash" code={`
# Check if package exists and get version info
npm view mcp-conductor version
# Should output: "1.0.16" (or latest version)

# Get detailed package information
npm view mcp-conductor
            `} />
            
            <H3 id="test-cli">2. Test CLI Installation</H3>
            <CodeBlock language="bash" code={`
# Check version
conductor --version
# or
mcp-conductor --version

# Show help
conductor --help
            `} />

            <H3 id="test-with-example">3. Test with Example Server</H3>
            <p>Create a simple test server to verify everything works:</p>
            <CodeBlock language="javascript" code={`
#!/usr/bin/env node
// test-server.js

const serverInfo = { name: "test-server", version: "1.0.0" };
const tools = [
  {
    name: "echo",
    description: "Echo back the input",
    inputSchema: { 
      type: "object", 
      properties: { message: { type: "string" } }, 
      required: ["message"] 
    }
  }
];

process.stdin.on('data', (data) => {
  const message = JSON.parse(data.toString());
  if (message.method === 'initialize') {
    sendResponse(message.id, { 
      protocolVersion: "2025-06-18", 
      capabilities: { tools: {} }, 
      serverInfo 
    });
  } else if (message.method === 'tools/list') {
    sendResponse(message.id, { tools });
  } else if (message.method === 'tools/call' && message.params.name === 'echo') {
    sendResponse(message.id, { 
      content: [{ type: "text", text: \`Echo: \${message.params.arguments.message}\` }] 
    });
  }
});

function sendResponse(id, result) {
  console.log(JSON.stringify({ jsonrpc: "2.0", id, result }));
}

setTimeout(() => console.error("Test server ready"), 100);
            `} />

            <p>Create test configuration and YAML test:</p>
            <CodeBlock language="json" code={`
// test-config.json
{
  "name": "Test Server",
  "command": "node",
  "args": ["./test-server.js"],
  "readyPattern": "Test server ready"
}
            `} />

            <CodeBlock language="yaml" code={`
# test.yml
description: "Installation verification test"
tests:
  - it: "should echo message"
    request:
      method: "tools/call"
      params:
        name: "echo"
        arguments:
          message: "Hello, MCP Conductor!"
    expect:
      response:
        result:
          content:
            - type: "text"
              text: "match:contains:Hello, MCP Conductor!"
            `} />

            <p>Run the test:</p>
            <CodeBlock language="bash" code={`
# Make server executable
chmod +x test-server.js

# Run test
conductor test.yml --config test-config.json --verbose
            `} />

            <p>Expected successful output:</p>
            <CodeBlock language="bash" code={`
📋 Loaded configuration for: Test Server
🧪 Found 1 test suite(s)
ℹ️  Starting MCP server...
ℹ️  Server started successfully
ℹ️  Performing MCP handshake...
ℹ️  Handshake completed successfully

📋 Installation verification test
   test.yml
   
  ● should echo message ... ✓ PASS

🎉 All tests passed! (1/1)
   Total time: 45ms
            `} />

            <H2 id="troubleshooting">Troubleshooting</H2>
            <H3 id="common-installation-issues">Common Installation Issues</H3>
            
            <H3 id="npm-package-not-found">1. NPM Package Not Found</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">npm: package 'mcp-conductor' not found</code></p>
            <p><strong>Solution:</strong></p>
            <CodeBlock language="bash" code={`
# Update npm
npm install -g npm@latest

# Try installing again
npm install -g mcp-conductor
            `} />

            <H3 id="permission-errors">2. Permission Errors</H3>
            <p><strong>Problem:</strong> Permission denied during installation</p>
            <p><strong>Solutions:</strong></p>
            <CodeBlock language="bash" code={`
# Option 1: Use npx (no global install needed)
npx mcp-conductor --help

# Option 2: Fix npm permissions (recommended)
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
npm install -g mcp-conductor

# Option 3: Use local installation
npm install --save-dev mcp-conductor
npx mcp-conductor --help
            `} />

            <H3 id="command-not-found">3. Command Not Found</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor: command not found</code></p>
            <p><strong>Solutions:</strong></p>
            <CodeBlock language="bash" code={`
# Check if installed globally
npm list -g mcp-conductor

# Check PATH includes npm global bin
echo $PATH

# Use full command name
mcp-conductor --help

# Or use npx
npx mcp-conductor --help
            `} />

            <H3 id="node-version-issues">4. Node Version Issues</H3>
            <p><strong>Problem:</strong> Compatibility errors with older Node.js versions</p>
            <p><strong>Solution:</strong></p>
            <CodeBlock language="bash" code={`
# Check Node.js version
node --version

# Update to Node.js 18+
# Using nvm:
nvm install 18
nvm use 18

# Or download from nodejs.org
            `} />

            <H2 id="development-setup">Development Setup</H2>
            <p>For development or if you want to use the latest features:</p>
            <CodeBlock language="bash" code={`
# Clone the repository
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Use development version
node bin/conductor.js --help

# Create alias for convenience
alias conductor="node /path/to/mcp-conductor/bin/conductor.js"
            `} />

            <H2 id="next-steps">Next Steps</H2>
            <p>Once installed successfully:</p>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Initialize in your project:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">npx mcp-conductor init</code></li>
                <li><strong>Follow the Quick Start:</strong> <a href="#/quick-start" className="text-blue-600 hover:text-blue-800">Quick Start Guide</a></li>
                <li><strong>Explore examples:</strong> <a href="#/examples" className="text-blue-600 hover:text-blue-800">Examples</a> directory</li>
                <li><strong>Learn patterns:</strong> <a href="#/pattern-matching" className="text-blue-600 hover:text-blue-800">Pattern Matching</a> reference</li>
            </ol>
        </>
    );
};

export default InstallationPage;