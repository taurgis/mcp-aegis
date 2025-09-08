import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const TroubleshootingPage: React.FC = () => {
    useSEO({
        title: 'Troubleshooting Guide - MCP Conductor',
        description: 'Comprehensive troubleshooting guide for MCP Conductor. Solutions to common issues, debugging tips, and best practices for Model Context Protocol server testing problems.',
        keywords: 'MCP Conductor troubleshooting, MCP testing problems, Model Context Protocol debugging, MCP server issues, MCP testing errors, MCP Conductor support',
        canonical: 'https://conductor.rhino-inquisitor.com/#/troubleshooting',
        ogTitle: 'MCP Conductor Troubleshooting - Solutions & Debug Guide',
        ogDescription: 'Complete troubleshooting guide for MCP Conductor. Fix common issues, debug problems, and optimize Model Context Protocol server testing.',
        ogUrl: 'https://conductor.rhino-inquisitor.com/troubleshooting'
    });

    return (
        <>
            <H1 id="troubleshooting-guide">Troubleshooting Guide</H1>
            <PageSubtitle>MCP Conductor Issues & Solutions</PageSubtitle>
            <p>Common issues and comprehensive solutions when using MCP Conductor for testing Model Context Protocol servers, with debugging tips and best practices.</p>

            <H2 id="installation-issues">Installation Issues</H2>
            <H3 id="npm-package-not-found">NPM Package Not Found</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">npm: package 'mcp-conductor' not found</code></p>
            <p><strong>Solution:</strong> Make sure you have the latest npm and try installing again:</p>
            <CodeBlock language="bash" code={`
# Update npm
npm install -g npm@latest

# Install MCP Conductor
npm install -g mcp-conductor
            `} />

            <H3 id="global-vs-local">Global vs Local Installation</H3>
            <p><strong>Problem:</strong> Command not found after installation</p>
            <p><strong>Solution:</strong></p>
            <CodeBlock language="bash" code={`
# For development usage (after cloning repository)
cd mcp-conductor
node bin/conductor.js --help

# Create an alias for convenience
alias conductor="node /path/to/mcp-conductor/bin/conductor.js"
            `} />

            <H3 id="permission-errors">Permission Errors</H3>
            <p><strong>Problem:</strong> Permission denied during installation</p>
            <p><strong>Solution:</strong></p>
            <CodeBlock language="bash" code={`
# For development setup (recommended approach)
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor
npm install  # No sudo needed for local development

# Set up proper Node.js permissions if needed
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
            `} />

            <H2 id="connection-problems">Connection Problems</H2>
            <H3 id="server-fails-to-start">Server Fails to Start</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Failed to start server: Error: spawn ENOENT</code></p>
            <p><strong>Diagnosis:</strong> The command specified in config is not found or executable.</p>
            <p><strong>Solution:</strong></p>
            <CodeBlock language="json" code={`
{
  "name": "My Server",
  "command": "/full/path/to/node",  // Use absolute path
  "args": ["./server.js"]
}
            `} />
            <p>Check executable path:</p>
            <CodeBlock language="bash" code={`
which node
which python3
            `} />

            <H3 id="connection-timeout">Connection Timeout</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Connection timeout after 5000ms</code></p>
            <p><strong>Diagnosis:</strong> Server takes too long to start or ready pattern not matching.</p>
            <p><strong>Solutions:</strong></p>
            <p><strong>1. Increase timeout:</strong></p>
            <CodeBlock language="json" code={`
{
  "name": "Slow Server",
  "command": "python",
  "args": ["./slow_server.py"],
  "startupTimeout": 30000  // 30 seconds (default is 5000ms)
}
            `} />
            <p><strong>2. Add ready pattern:</strong></p>
            <CodeBlock language="json" code={`
{
  "name": "Server with Pattern",
  "command": "node",
  "args": ["./server.js"],
  "readyPattern": "Server listening on port \\\\d+"
}
            `} />
            <p><strong>3. Debug server startup:</strong></p>
            <CodeBlock language="bash" code={`
# Test server manually
node ./server.js

# Debug with MCP Conductor
conductor test.yml --config config.json --debug

# Verbose output with timing
conductor test.yml --config config.json --verbose --timing

# Minimal output for scripts
conductor test.yml --config config.json --quiet
            `} />

            <H3 id="handshake-failures">Handshake Failures</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">MCP handshake failed: Unexpected response</code></p>
            <p><strong>Diagnosis:</strong> Server doesn't implement MCP protocol correctly.</p>
            <p><strong>Solution:</strong> Verify server implements required MCP methods:</p>
            <CodeBlock language="javascript" code={`
// Server must handle these methods:
// - initialize
// - initialized (notification)  
// - tools/list
// - tools/call

function handleMessage(message) {
  if (message.method === 'initialize') {
    sendResponse(message.id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name: "my-server", version: "1.0.0" }
    });
  }
  // ... other methods
}
            `} />

            <H3 id="working-directory-issues">Working Directory Issues</H3>
            <p><strong>Problem:</strong> Server can't find files or resources</p>
            <p><strong>Solution:</strong> Set correct working directory:</p>
            <CodeBlock language="json" code={`
{
  "name": "Server with CWD",
  "command": "node",
  "args": ["./src/server.js"],
  "cwd": "/absolute/path/to/project"
}
            `} />

            <H2 id="test-failures">Test Failures</H2>
            <H3 id="pattern-not-matching">Pattern Not Matching</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Pattern did not match: expected "match:regex:..." but got "..."</code></p>
            <p><strong>Diagnosis:</strong> Pattern doesn't match actual response format.</p>
            <p><strong>Solutions:</strong></p>
            <p><strong>1. Check actual response:</strong></p>
            <CodeBlock language="bash" code={`
# MCP Conductor shows detailed output with debug mode
conductor test.yml --config config.json --debug --verbose
            `} />
            <p><strong>2. Test regex separately:</strong></p>
            <CodeBlock language="javascript" code={`
const pattern = /Result: \\d+/;
const text = "Result: 42 items found";
console.log(pattern.test(text)); // Should be true
            `} />
            <p><strong>3. Fix common escaping issues:</strong></p>
            <CodeBlock language="yaml" code={`
# ❌ Wrong - single backslash
text: "match:regex:\\d+"

# ✅ Correct - double backslash in YAML
text: "match:regex:\\\\d+"

# ✅ Correct - escaped special characters  
text: "match:regex:\\\\$\\\\d+\\\\.\\\\d+"  # For $15.99
            `} />

            <H3 id="json-rpc-format-errors">JSON-RPC Format Errors</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Invalid JSON-RPC format</code></p>
            <p><strong>Solution:</strong> Verify correct JSON-RPC 2.0 structure:</p>
            <CodeBlock language="yaml" code={`
request:
  jsonrpc: "2.0"           # Must be exactly "2.0"
  id: "unique-id"          # Must be unique per test  
  method: "tools/call"     # Must be valid MCP method
  params:                  # Parameters object
    name: "tool_name"
    arguments: {}
            `} />

            <H3 id="stderr-validation-failures">Stderr Validation Failures</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">Expected empty stderr but got: "Warning: ..."</code></p>
            <p><strong>Solutions:</strong></p>
            <p><strong>1. Accept expected stderr:</strong></p>
            <CodeBlock language="yaml" code={`
stderr: "match:contains:Warning"
            `} />
            <p><strong>2. Update server to suppress warnings:</strong></p>
            <CodeBlock language="json" code={`
{
  "env": {
    "NODE_ENV": "test",
    "SUPPRESS_WARNINGS": "true"
  }
}
            `} />
            <p><strong>3. Clear stderr before test:</strong></p>
            <CodeBlock language="javascript" code={`
client.clearStderr();
await client.callTool('tool', {});
const stderr = client.getStderr();
            `} />

            <H2 id="pattern-matching-issues">Pattern Matching Issues</H2>
            <H3 id="yaml-structure-errors">YAML Structure Errors (Most Common)</H3>
            <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">duplicated mapping key</code> Error</p>
            <p><strong>Symptoms:</strong> YAML parser fails with duplicate key errors</p>
            <p><strong>Root Cause:</strong> YAML fundamentally cannot have duplicate keys in the same object</p>
            <p><strong>Solution:</strong> Restructure tests to avoid duplicates:</p>
            <CodeBlock language="yaml" code={`
# ❌ CRITICAL ERROR - Duplicate keys
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # This overwrites the previous line!
  match:extractField: "tools.*.name" 
  match:extractField: "isError"  # Another duplicate!

# ✅ CORRECT - Separate tests for different validations
# Test 1: Array length
result:
  tools: "match:arrayLength:1"

# Test 2: Field extraction (separate test case)
result:
  match:extractField: "tools.*.name"
  value:
    - "read_file"

# Test 3: Error flag (separate test case)  
result:
  match:extractField: "isError"
  value: false
            `} />

            <H3 id="pattern-structure-conflicts">Pattern Structure Conflicts</H3>
            <p><strong>Symptoms:</strong> Unexpected validation behavior or structure errors</p>
            <p><strong>Solution:</strong> Don't mix pattern types inappropriately:</p>
            <CodeBlock language="yaml" code={`
# ❌ WRONG - Can't mix arrayElements with direct array
result:
  content:
    match:arrayElements:
      type: "text"
    - type: "text"  # This creates a structure conflict!

# ✅ CORRECT - Use one approach consistently
result:
  content:
    match:arrayElements:
      type: "text"
      text: "match:contains:data"

# OR use direct array structure:
result:
  content:
    - type: "text" 
      text: "match:contains:data"
            `} />

            <H3 id="field-extraction-problems">Field Extraction Problems</H3>
            <p><strong>Problem:</strong> Field extraction returns empty array or wrong data</p>
            <p><strong>Diagnosis:</strong> JSON path is incorrect or data structure changed.</p>
            <p><strong>Solutions:</strong></p>
            <p><strong>1. Verify JSON path:</strong></p>
            <CodeBlock language="javascript" code={`
const data = {
  tools: [
    { name: "tool1", type: "utility" },
    { name: "tool2", type: "processor" }
  ]
};

// Correct paths:
// "tools.*.name" → ["tool1", "tool2"]  
// "tools.*.type" → ["utility", "processor"]
            `} />
            <p><strong>2. Debug extraction:</strong></p>
            <CodeBlock language="yaml" code={`
# Test with simpler extraction first
match:extractField: "tools"
value: "match:type:array"

# Then add complexity  
match:extractField: "tools.*.name"
value: "match:arrayContains:expected_tool"
            `} />

            <H2 id="performance-issues">Performance Issues</H2>
            <H3 id="slow-test-execution">Slow Test Execution</H3>
            <p><strong>Problem:</strong> Tests take too long to complete</p>
            <p><strong>Solutions:</strong></p>
            <p><strong>1. Optimize server startup:</strong></p>
            <CodeBlock language="json" code={`
{
  "startupTimeout": 5000,    // Default is 5000ms, reduce if possible
  "readyPattern": "Ready"    // Add pattern to detect ready state
}
            `} />
            <p><strong>2. Use connection pooling:</strong></p>
            <CodeBlock language="javascript" code={`
// Reuse client for multiple tests (Node.js test runner)
import { describe, test, before, after } from 'node:test';

describe('Test Suite', () => {
  let client;
  
  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });
  
  after(async () => {
    await client.disconnect();
  });
  
  // Tests use same client instance
});
            `} />

            <H2 id="debugging-tips">Debugging Tips</H2>
            <H3 id="enable-verbose-output">Enable Verbose Output</H3>
            <CodeBlock language="bash" code={`
# YAML testing with detailed debugging output
conductor tests.yml --config config.json --debug --verbose

# Shows actual vs expected values for failures with MCP communication details
            `} />

            <H3 id="inspect-raw-responses">Inspect Raw Responses</H3>
            <CodeBlock language="javascript" code={`
// Programmatic testing
const result = await client.sendMessage({
  jsonrpc: "2.0",
  id: "debug-1", 
  method: "tools/call",
  params: { name: "my_tool", arguments: {} }
});

console.log('Raw response:', JSON.stringify(result, null, 2));
            `} />

            <H3 id="debug-server-directly">Debug Server Directly</H3>
            <CodeBlock language="bash" code={`
# Test server manually
echo '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}' | node server.js

# Check server logs
node server.js 2>server.log &
# Run tests then check server.log
            `} />

            <H3 id="use-debug-configuration">Use Debug Configuration</H3>
            <CodeBlock language="json" code={`
{
  "name": "Debug Server",
  "command": "node",
  "args": ["--inspect", "./server.js"],  // Enable debugger
  "env": {
    "DEBUG": "*",                         // Enable debug output
    "NODE_ENV": "development"
  },
  "startupTimeout": 30000                 // Longer timeout for debugging
}
            `} />

            <H2 id="getting-help">Getting Help</H2>
            <H3 id="create-minimal-reproduction">Create Minimal Reproduction</H3>
            <p>When reporting issues, create minimal reproduction:</p>
            <p><strong>1. Minimal server:</strong></p>
            <CodeBlock language="javascript" code={`
#!/usr/bin/env node
const server = { name: "minimal", version: "1.0.0" };
process.stdin.on('data', (data) => {
  const message = JSON.parse(data.toString());
  console.log(JSON.stringify({
    jsonrpc: "2.0",
    id: message.id,
    result: { tools: [] }
  }));
});
            `} />
            <p><strong>2. Minimal config:</strong></p>
            <CodeBlock language="json" code={`
{
  "name": "Minimal Server",
  "command": "node",
  "args": ["./minimal-server.js"]
}
            `} />
            <p><strong>3. Minimal test:</strong></p>
            <CodeBlock language="yaml" code={`
description: "Minimal reproduction"
tests:
  - it: "should work"
    request:
      jsonrpc: "2.0"
      id: "1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "1"
        result:
          tools: []
            `} />

            <H3 id="report-issues">Report Issues</H3>
            <p>Include the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>MCP Conductor version: <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">node bin/conductor.js --version</code></li>
                <li>Node.js version: <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">node --version</code></li>
                <li>Operating system</li>
                <li>Full error message</li>
                <li>Minimal reproduction case</li>
                <li>Configuration file (sanitized)</li>
            </ul>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Need More Help?</h4>
                <ul className="space-y-2 text-blue-800 list-disc pl-5">
                    <li><a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Working examples and patterns</li>
                    <li><a href="#/api-reference" className="text-blue-600 hover:text-blue-800 underline">API Reference</a> - Complete API documentation</li>
                    <li><a href="https://github.com/taurgis/mcp-conductor/issues" className="text-blue-600 hover:text-blue-800 underline">GitHub Issues</a> - Report bugs and request features</li>
                </ul>
            </div>
        </>
    );
};

export default TroubleshootingPage;