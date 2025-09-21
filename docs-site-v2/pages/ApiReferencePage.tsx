import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { SITE_DATES } from '../constants';

const ApiReferencePage: React.FC = () => {
    const apiReferenceStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "API Reference - MCP Aegis",
        "description": "Complete API reference for MCP Aegis CLI commands and programmatic JavaScript/TypeScript API. Comprehensive documentation for Model Context Protocol testing methods, options, and advanced configuration.",
        "author": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "publisher": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "datePublished": SITE_DATES.PUBLISHED,
        "dateModified": SITE_DATES.MODIFIED,
        "url": "https://aegis.rhino-inquisitor.com/api-reference",
        "mainEntity": {
            "@type": "Guide",
            "name": "MCP Aegis API Reference"
        }
    };

    return (
        <>
            <SEO 
                title="API Reference"
                description="Complete API reference for MCP Aegis CLI commands and programmatic JavaScript/TypeScript API. Comprehensive documentation for Model Context Protocol testing methods, options, and advanced configuration."
                keywords="MCP Aegis API reference, MCP API documentation, MCP CLI reference, Model Context Protocol API, MCP testing API, JavaScript MCP API, TypeScript MCP API, CLI commands"
                canonical="/api-reference"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "API Reference", url: "/api-reference" }
            ]} />
            <StructuredData structuredData={apiReferenceStructuredData} />

            <H1 id="api-reference">API Reference</H1>
            <PageSubtitle>Complete MCP Aegis Documentation</PageSubtitle>
            <p>Comprehensive reference for MCP Aegis's CLI commands and programmatic JavaScript/TypeScript testing API for Model Context Protocol servers.</p>

            <H2 id="cli-commands">CLI Commands</H2>
            <H3 id="init-command"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">init</code> Command</H3>
            <p>Initialize MCP Aegis in a Node.js project.</p>
            <CodeBlock language="bash" code="npx mcp-aegis init" />
            <p><strong>What it does:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Creates <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">aegis.config.json</code> based on your <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">package.json</code></li>
                <li>Creates test directory structure (<code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">test/mcp/</code> or <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">tests/mcp/</code>)</li>
                <li>Copies <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">AGENTS.md</code> guide to test directory</li>
                <li>Handles existing directories gracefully</li>
            </ul>

            <p><strong>Directory Selection Logic:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Uses <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">tests/mcp/</code> if <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">tests/</code> directory exists</li>
                <li>Uses <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">test/mcp/</code> if <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">test/</code> directory exists (and no <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">tests/</code>)</li>
                <li>Prefers <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">tests/</code> over <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">test/</code> when both exist</li>
                <li>Creates <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">test/mcp/</code> by default when neither exists</li>
            </ul>

            <H3 id="query-command"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">query</code> Command</H3>
            <p>Query MCP server tools directly for debugging without writing test files.</p>
            <CodeBlock language="bash" code={`
# List all available tools
aegis query --config aegis.config.json

# Call a specific tool with no arguments  
aegis query [tool-name] --config aegis.config.json

# Call a tool with arguments (JSON string)
aegis query [tool-name] [tool-args] --config aegis.config.json
            `} />

            <p><strong>Arguments:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">[tool-name]</code> (optional) - Name of the tool to call. Omit to list all available tools</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">[tool-args]</code> (optional) - JSON string of tool arguments (e.g., <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">{'{"path": "/tmp/file.txt"}'}</code>)</li>
            </ul>

            <p><strong>Options:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--config, -c &lt;path&gt;</code> - Path to aegis.config.json file (default: <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">./aegis.config.json</code>)</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--json, -j</code> - Output results in JSON format</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--quiet, -q</code> - Suppress non-essential output</li>
            </ul>

            <p><strong>Example Usage:</strong></p>
            <CodeBlock language="bash" code={`
# List all tools
aegis query

# Call read_file tool with arguments
aegis query read_file '{"path": "../shared-test-data/hello.txt"}'

# Call calculator tool with JSON arguments
aegis query calculator '{"operation": "add", "a": 5, "b": 3}'

# Get JSON output for scripting
aegis query hello '{"name": "World"}' --json

# Use custom config file
aegis query --config ./my-config.json
            `} />

            <p><strong>Use Cases:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Quick testing of tools without writing YAML test files</li>
                <li>Server validation during development</li>
                <li>Tool discovery and exploration</li>
                <li>Debugging tool responses and error conditions</li>
                <li>Integration with development workflows</li>
            </ul>

            <H3 id="test-execution">Test Execution</H3>
            <p>Run YAML-based tests:</p>
            <CodeBlock language="bash" code={`
# Using specific pattern
aegis "test/mcp/*.test.mcp.yml" --config aegis.config.json

# Using npx (works with both test/ and tests/)
npx mcp-aegis "test*/mcp/**/*.test.mcp.yml"

# With custom config
npx mcp-aegis "test*.yml" --config "./custom-config.json"
            `} />

            <p><strong>CLI Options:</strong></p>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Option</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--config, -c &lt;path&gt;</code></td>
                            <td className="border border-gray-300 px-4 py-2">Path to configuration file (default: <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">./aegis.config.json</code>)</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--verbose, -v</code></td>
                            <td className="border border-gray-300 px-4 py-2">Display individual test results with test suite hierarchy</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--debug, -d</code></td>
                            <td className="border border-gray-300 px-4 py-2">Enable debug mode with detailed MCP communication logging</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--timing, -t</code></td>
                            <td className="border border-gray-300 px-4 py-2">Show timing information for tests and operations</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--json, -j</code></td>
                            <td className="border border-gray-300 px-4 py-2">Output results in JSON format for CI/automation</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">--quiet, -q</code></td>
                            <td className="border border-gray-300 px-4 py-2">Suppress non-essential output (opposite of verbose)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p><strong>Example Usage:</strong></p>
            <CodeBlock language="bash" code={`
# Basic usage
aegis "tests/*.yml" --config config.json

# Verbose output with test hierarchy
aegis "tests/*.yml" --config config.json --verbose

# Debug mode with MCP communication details
aegis "tests/*.yml" --config config.json --debug

# Performance analysis with timing
aegis "tests/*.yml" --config config.json --timing

# CI-friendly JSON output
aegis "tests/*.yml" --config config.json --json

# Minimal output for scripts
aegis "tests/*.yml" --config config.json --quiet

# Combine multiple options
aegis "tests/*.yml" --config config.json --verbose --timing --debug
            `} />

            <H2 id="installation">Installation</H2>
            <H3 id="npm">NPM</H3>
            <CodeBlock language="bash" code="npm install mcp-aegis --save-dev" />
            <H3 id="yarn">Yarn</H3>
            <CodeBlock language="bash" code="yarn add -D mcp-aegis" />
            <H3 id="pnpm">pnpm</H3>
            <CodeBlock language="bash" code="pnpm add -D mcp-aegis" />

            <H2 id="main-entry-points">Main Entry Points</H2>
            <H3 id="createClient"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">createClient(config)</code></H3>
            <p>Creates a new MCPClient instance without connecting.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">config</code> (string | object): Configuration file path or configuration object</li>
            </ul>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Promise&lt;MCPClient&gt;</code></p>
            <CodeBlock language="javascript" code={`
import { createClient } from 'mcp-aegis';

// From configuration file (generated by init command)
const client = await createClient('./aegis.config.json');

// From configuration object
const client = await createClient({
  name: 'Test Server',
  command: 'node',
  args: ['./server.js']
});
            `} />
            
            <H3 id="connect"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">connect(config)</code></H3>
            <p>Creates and automatically connects a client.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">config</code> (string | object): Configuration file path or configuration object</li>
            </ul>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Promise&lt;MCPClient&gt;</code></p>
            <CodeBlock language="javascript" code={`
import { connect } from 'mcp-aegis';

// Using config from init command
const client = await connect('./aegis.config.json');
// Client is immediately ready for use
            `} />

            <H3 id="mcpclient-constructor">MCPClient Class</H3>
            <p>Direct class constructor for advanced usage.</p>
            <CodeBlock language="javascript" code={`
import { MCPClient } from 'mcp-aegis';

const config = { /* config object */ };
const client = new MCPClient(config);
await client.connect();
            `} />

            <H2 id="mcpclient-class">MCPClient Class</H2>
            <H3 id="properties">Properties</H3>
            <H3 id="connected"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">connected: boolean</code></H3>
            <p>Indicates whether the client is connected to the MCP server.</p>
            <CodeBlock language="javascript" code="console.log('Connected:', client.connected);" />

            <H3 id="config-property"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">config: object</code></H3>
            <p>The configuration object used for the connection.</p>
            <CodeBlock language="javascript" code={`
console.log('Server name:', client.config.name);
console.log('Command:', client.config.command);
console.log('Arguments:', client.config.args);
            `} />

            <H3 id="handshake-completed"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">handshakeCompleted: boolean</code></H3>
            <p>Indicates whether the MCP handshake has been completed successfully.</p>
            <CodeBlock language="javascript" code={`
if (client.handshakeCompleted) {
  console.log('Ready to execute tools');
}
            `} />

            <H3 id="core-methods">Core Methods</H3>
            <H3 id="async-connect"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">async connect()</code></H3>
            <p>Starts the MCP server process and performs the MCP handshake.</p>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Promise&lt;void&gt;</code></p>
            <p><strong>Throws:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Error</code> if server fails to start</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Error</code> if handshake fails</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Error</code> if connection timeout is reached</li>
            </ul>
            <CodeBlock language="javascript" code={`
try {
  await client.connect();
  console.log('Server connected and ready');
} catch (error) {
  console.error('Connection failed:', error.message);
}
            `} />

            <H3 id="async-disconnect"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">async disconnect()</code></H3>
            <p>Gracefully shuts down the server connection.</p>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Promise&lt;void&gt;</code></p>
            <CodeBlock language="javascript" code={`
await client.disconnect();
console.log('Server disconnected');
            `} />

            <H3 id="async-listTools"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">async listTools()</code></H3>
            <p>Retrieves the list of available tools from the MCP server.</p>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Promise&lt;Tool[]&gt;</code></p>
            <p><strong>Tool Interface:</strong></p>
            <CodeBlock language="typescript" code={`
interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}
            `} />
            <CodeBlock language="javascript" code={`
const tools = await client.listTools();

tools.forEach(tool => {
  console.log(\`Tool: \${tool.name}\`);
  console.log(\`Description: \${tool.description}\`);
  console.log(\`Required params: \${tool.inputSchema.required?.join(', ')}\`);
});
            `} />

            <H3 id="async-callTool"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">async callTool(name, arguments)</code></H3>
            <p>Executes a specific tool with the provided arguments.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">name</code> (string): Name of the tool to execute</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">arguments</code> (object): Arguments to pass to the tool</li>
            </ul>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Promise&lt;ToolResult&gt;</code></p>
            <p><strong>ToolResult Interface:</strong></p>
            <CodeBlock language="typescript" code={`
interface ToolResult {
  content: Array<{
    type: string;
    text: string;
    [key: string]: any;
  }>;
  isError?: boolean;
  [key: string]: any;
}
            `} />
            <p><strong>Throws:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Error</code> if tool execution fails</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Error</code> if tool is not found</li>
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Error</code> if arguments are invalid</li>
            </ul>
            <CodeBlock language="javascript" code={`
try {
  const result = await client.callTool('calculator', {
    operation: 'add',
    a: 15,
    b: 27
  });

  console.log('Result:', result.content[0].text);
  console.log('Error status:', result.isError);
} catch (error) {
  console.error('Tool execution failed:', error.message);
}
            `} />

            <H3 id="async-sendMessage"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">async sendMessage(message)</code></H3>
            <p>Sends a raw JSON-RPC message to the MCP server.</p>
            <p><strong>Parameters:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
                <li><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">message</code> (object): JSON-RPC 2.0 message object</li>
            </ul>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Promise&lt;object&gt;</code></p>
            <p><strong>Message Format:</strong></p>
            <CodeBlock language="typescript" code={`
interface JSONRPCMessage {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: object;
}
            `} />
            <CodeBlock language="javascript" code={`
const response = await client.sendMessage({
  jsonrpc: "2.0",
  id: "custom-1",
  method: "tools/list",
  params: {}
});

console.log('Raw response:', response);
            `} />

            <H3 id="utility-methods">Utility Methods</H3>
            <H3 id="getStderr"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">getStderr()</code></H3>
            <p>Returns the current contents of the stderr buffer.</p>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">string</code></p>
            <CodeBlock language="javascript" code={`
const stderr = client.getStderr();
if (stderr.trim()) {
  console.warn('Server stderr:', stderr);
}
            `} />

            <H3 id="clearStderr"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">clearStderr()</code></H3>
            <p>Clears the stderr buffer.</p>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">void</code></p>
            <CodeBlock language="javascript" code={`
client.clearStderr();
// Stderr buffer is now empty
            `} />

            <H3 id="isConnected"><code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">isConnected()</code></H3>
            <p>Checks if the client is connected and the MCP handshake has been completed.</p>
            <p><strong>Returns:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">boolean</code></p>
            <CodeBlock language="javascript" code={`
if (client.isConnected()) {
  console.log('Client is ready to execute tools');
} else {
  console.log('Client is not ready - call connect() first');
}
            `} />

            <H2 id="configuration">Configuration</H2>
            <H3 id="configuration-schema">Configuration Object Schema</H3>
            <CodeBlock language="typescript" code={`
interface MCPConfig {
  name: string;                    // Display name for the server
  command: string;                 // Executable command
  args: string[];                  // Command arguments
  cwd?: string;                    // Working directory (optional)
  env?: Record<string, string>;    // Environment variables (optional)
  startupTimeout?: number;         // Startup timeout in ms (default: 5000)
  readyPattern?: string;           // Regex pattern for server ready signal (optional)
}
            `} />

            <H3 id="basic-configuration">Basic Configuration</H3>
            <CodeBlock language="json" code={`
{
  "name": "Simple Server",
  "command": "node",
  "args": ["./server.js"]
}
            `} />

            <H3 id="advanced-configuration-example">Advanced Configuration</H3>
            <CodeBlock language="json" code={`
{
  "name": "Production API Server",
  "command": "python",
  "args": ["./api_server.py", "--port", "8080"],
  "cwd": "./server",
  "env": {
    "API_KEY": "test-key",
    "DEBUG": "true",
    "DATABASE_URL": "sqlite:///test.db"
  },
  "startupTimeout": 15000,
  "readyPattern": "Server listening on port \\\\d+"
}
            `} />

            <H2 id="error-handling">Error Handling</H2>
            <H3 id="connection-errors">Connection Errors</H3>
            <p>Thrown when server fails to start or connect:</p>
            <CodeBlock language="javascript" code={`
try {
  await client.connect();
} catch (error) {
  if (error.message.includes('Failed to start server')) {
    console.error('Server startup failed:', error.message);
  } else if (error.message.includes('Connection timeout')) {
    console.error('Server took too long to start:', error.message);
  } else if (error.message.includes('Handshake failed')) {
    console.error('MCP handshake failed:', error.message);
  }
}
            `} />

            <H3 id="tool-execution-errors">Tool Execution Errors</H3>
            <p>Thrown when tool calls fail:</p>
            <CodeBlock language="javascript" code={`
try {
  const result = await client.callTool('unknown_tool', {});
} catch (error) {
  if (error.message.includes('Failed to call tool')) {
    console.error('Tool execution failed:', error.message);
  } else if (error.message.includes('Tool not found')) {
    console.error('Unknown tool:', error.message);
  }
}
            `} />

            <H2 id="typescript-support">TypeScript Support</H2>
            <p>MCP Aegis includes full TypeScript type definitions.</p>
            <H3 id="type-definitions">Type Definitions</H3>
            <CodeBlock language="typescript" code={`
// Main exports
export declare function createClient(config: string | MCPConfig): Promise<MCPClient>;
export declare function connect(config: string | MCPConfig): Promise<MCPClient>;
export declare class MCPClient {
  constructor(config: MCPConfig);
  
  readonly connected: boolean;
  readonly config: MCPConfig;
  readonly handshakeCompleted: boolean;
  
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  listTools(): Promise<Tool[]>;
  callTool(name: string, arguments: Record<string, any>): Promise<ToolResult>;
  sendMessage(message: JSONRPCMessage): Promise<any>;
  getStderr(): string;
  clearStderr(): void;
  isConnected(): boolean;
}
            `} />

            <H3 id="typescript-usage-examples">TypeScript Usage Examples</H3>
            <CodeBlock language="typescript" code={`
import { createClient, MCPClient, Tool, ToolResult, MCPConfig } from 'mcp-aegis';

// Typed configuration
const config: MCPConfig = {
  name: 'My Server',
  command: 'node',
  args: ['./server.js'],
  startupTimeout: 5000
};

// Typed client
const client: MCPClient = await createClient(config);
await client.connect();

// Typed tool listing
const tools: Tool[] = await client.listTools();
tools.forEach((tool: Tool) => {
  console.log(\`\${tool.name}: \${tool.description}\`);
});

// Typed tool execution
const result: ToolResult = await client.callTool('calculator', {
  operation: 'add',
  a: 10,
  b: 5
});

console.log('Result:', result.content[0].text);
console.log('Is error:', result.isError);

await client.disconnect();
            `} />

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Related Documentation</h4>
                <ul className="space-y-2 text-blue-800 list-disc pl-5">
                    <li><Link to="/programmatic-testing" className="text-blue-600 hover:text-blue-800 underline">Programmatic Testing</Link> - Complete testing guide</li>
                    <li><Link to="/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</Link> - Real-world usage examples</li>
                    <li><Link to="/troubleshooting" className="text-blue-600 hover:text-blue-800 underline">Troubleshooting</Link> - Debug common issues</li>
                </ul>
            </div>
        </>
    );
};

export default ApiReferencePage;