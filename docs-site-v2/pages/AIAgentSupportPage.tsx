import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { H1, H2, H3, PageSubtitle } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { Head } from 'vite-react-ssg';
import Section from '../components/Section';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { SITE_DATES } from '../constants';

const AIAgentSupportPage: React.FC = () => {
  const navigate = useNavigate();
  
  const goTo = (path: string) => {
    navigate(path);
  };

  const aiAgentSupportStructuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "AI Agent Support - MCP Aegis",
    "description": "Complete guide for AI coding assistants and autonomous agents to detect MCP projects, scaffold comprehensive tests, generate YAML and programmatic test suites, and follow MCP testing best practices using MCP Aegis.",
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
    "url": "https://aegis.rhino-inquisitor.com/ai-agent-support/",
    "mainEntity": {
      "@type": "Guide",
      "name": "AI Agent Support Guide for MCP Testing"
    }
  };

  return (
    <>
      <SEO 
        title="AI Agent Support"
        description="Complete guide for AI coding assistants and autonomous agents to detect MCP projects, scaffold comprehensive tests, generate YAML and programmatic test suites, and follow MCP testing best practices using MCP Aegis."
        keywords="MCP AI agent support, AI coding assistants, autonomous agents, test generation, YAML test scaffolding, programmatic test generation, Model Context Protocol AI tools, automated MCP testing"
        canonical="/ai-agent-support/"
        ogType="article"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "AI Agent Support", url: "/ai-agent-support/" }
      ]} />
      <StructuredData structuredData={aiAgentSupportStructuredData} />

      <H1 id="ai-agent-support">🤖 AI Agent Support</H1>
      <PageSubtitle>Enabling AI Assistants to Generate High-Quality MCP Server Tests</PageSubtitle>

      {/* HERO SECTION */}
      <section className="hero-section bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg p-8 text-center mb-12" aria-labelledby="hero-heading">
        <h2 id="hero-heading" className="text-2xl font-bold text-gray-800 mb-4">AI Agents → Generate MCP Tests</h2>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          MCP Aegis ships with <strong>dedicated AGENTS.md guides</strong> and <strong>proven prompt templates</strong> to help AI coding assistants 
          automatically generate high-quality MCP server tests using established patterns and conventions.
        </p>
        <div className="flex items-center justify-center gap-2 mb-6" aria-label="AI agent resources">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">AGENTS.md Guides</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Prompt Templates</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Auto-scaffolding</span>
        </div>
        <nav aria-label="Primary calls to action" className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => document.getElementById('agents-guides')?.scrollIntoView({ behavior: 'smooth' })}
            className="no-underline inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 active:scale-[0.97] transition-all"
          >View AGENTS.md Guides</button>
          <button
            type="button"
            onClick={() => document.getElementById('prompt-templates')?.scrollIntoView({ behavior: 'smooth' })}
            className="no-underline inline-flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 active:scale-[0.97] transition-all"
          >Get Prompt Templates</button>
          <button
            type="button"
            onClick={() => goTo('/quick-start')}
            className="no-underline inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 active:scale-[0.97] transition-all"
          >Quick Start</button>
        </nav>
      </section>

      <Section id="agents-guides">
        <H2 id="agents-guide-system">📚 AGENTS.md Guide System</H2>
        <p className="mb-6 text-lg text-gray-700">
          MCP Aegis provides <strong>dedicated AI agent guides</strong> copied directly into your project during initialization. 
          These guides contain comprehensive instructions, examples, and best practices tailored for AI assistants.
        </p>
        
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <h3 id="specialized-guides" className="text-lg font-semibold text-gray-800 mb-4">🎯 Three Specialized Guides</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-blue-300 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">� Main AGENTS.md</h4>
              <p className="text-sm text-gray-600 mb-3">Overview guide with decision matrix</p>
              <div className="text-xs text-gray-500">
                <div>📍 <InlineCode>test/mcp/AGENTS.md</InlineCode></div>
                <div>🎯 High-level guidance & approach selection</div>
              </div>
            </div>
            <div className="p-4 bg-white border border-green-300 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">📝 YAML AGENTS.md</h4>
              <p className="text-sm text-gray-600 mb-3">Declarative testing patterns</p>
              <div className="text-xs text-gray-500">
                <div>📍 <InlineCode>test/mcp/yaml/AGENTS.md</InlineCode></div>
                <div>🎯 50+ patterns, examples, anti-patterns</div>
              </div>
            </div>
            <div className="p-4 bg-white border border-indigo-300 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">💻 Node AGENTS.md</h4>
              <p className="text-sm text-gray-600 mb-3">Programmatic testing API</p>
              <div className="text-xs text-gray-500">
                <div>📍 <InlineCode>test/mcp/node/AGENTS.md</InlineCode></div>
                <div>🎯 Jest/Mocha integration, complex flows</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-6">
          <h4 id="auto-installation" className="font-semibold text-gray-800 mb-2">🚀 Auto-Installation</h4>
          <p className="text-sm text-gray-600 mb-2">The guides are automatically copied to your project during initialization:</p>
          <CodeBlock language="bash" code="npx mcp-aegis init" />
          <p className="text-xs text-gray-500 mt-2">
            This copies the latest AGENTS.md files from the repository's <InlineCode>AGENTS/</InlineCode> directory 
            into your project's test structure for offline reference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 id="whats-inside-agents" className="font-semibold text-gray-800 mb-3">📖 What's Inside AGENTS.md</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Project detection heuristics</li>
              <li>✅ Configuration templates</li>
              <li>✅ Pattern matching examples</li>
              <li>✅ Common anti-patterns to avoid</li>
              <li>✅ Workflow best practices</li>
              <li>✅ Error handling guidance</li>
            </ul>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 id="target-audience" className="font-semibold text-gray-800 mb-3">🎯 Target Audience</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🤖 AI coding assistants (Copilot, Cursor, etc.)</li>
              <li>🔧 Autonomous testing agents</li>
              <li>⚡ Code generation tools</li>
              <li>🧠 LLM-powered development workflows</li>
              <li>🛠️ Custom automation scripts</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="detection">
        <H2 id="detection-guide">🔍 Quick Detection Guide</H2>
        <p className="mb-4 text-gray-700">AI agents should look for these patterns to identify MCP Aegis projects:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 id="file-indicators" className="font-semibold text-gray-800 mb-2">🗂️ File Indicators</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><InlineCode>aegis.config.json</InlineCode> or <InlineCode>*.config.json</InlineCode></li>
              <li><InlineCode>.test.mcp.yml</InlineCode> files in test directories</li>
              <li><InlineCode>AGENTS/</InlineCode> directory with AI guides</li>
            </ul>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 id="code-patterns" className="font-semibold text-gray-800 mb-2">⚙️ Code Patterns</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>JSON-RPC with <InlineCode>tools/list</InlineCode> or <InlineCode>tools/call</InlineCode></li>
              <li>Imports from <InlineCode>mcp-aegis</InlineCode></li>
              <li>MCP protocol handshake sequences</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="workflow-summary">
        <H2 id="workflow-summary-header">🔄 AI Agent Workflow Summary</H2>
        <p className="mb-4 text-gray-700">Follow this workflow with the AGENTS.md guides as your primary reference:</p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 className="font-semibold text-gray-800">🔍 Detect MCP patterns → Run <InlineCode>npx mcp-aegis init</InlineCode></h4>
              <p className="text-sm text-gray-600">Copies AGENTS.md guides into your project</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 className="font-semibold text-gray-800">📖 Read <InlineCode>test/mcp/AGENTS.md</InlineCode> for overview</h4>
              <p className="text-sm text-gray-600">Understand approach selection and conventions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 className="font-semibold text-gray-800">📝 Reference <InlineCode>test/mcp/yaml/AGENTS.md</InlineCode> or <InlineCode>test/mcp/node/AGENTS.md</InlineCode></h4>
              <p className="text-sm text-gray-600">Follow specific guide for your chosen testing approach</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 className="font-semibold text-gray-800">🧪 Generate tests using patterns from guides</h4>
              <p className="text-sm text-gray-600">Apply examples, patterns, and anti-patterns from AGENTS.md</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
            <div>
              <h4 className="font-semibold text-gray-800">✅ Validate with npm scripts → Stop when coverage complete</h4>
              <p className="text-sm text-gray-600">Handshake + discovery + at least one tool execution</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="advanced-patterns">
        <H2 id="advanced-patterns-header">🎯 Advanced Pattern Matching</H2>
        <p className="mb-4 text-gray-700">Leverage MCP Aegis's 50+ pattern types for precise validation:</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 id="common-patterns" className="font-semibold text-gray-800 mb-3">📊 Common Patterns</h4>
            <div className="space-y-2 text-sm">
              <div><InlineCode>"match:arrayLength:3"</InlineCode> - Exact length</div>
              <div><InlineCode>"match:contains:MCP"</InlineCode> - String contains</div>
              <div><InlineCode>"match:type:array"</InlineCode> - Type validation</div>
              <div><InlineCode>"match:not:arrayLength:0"</InlineCode> - Pattern negation</div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 id="advanced-patterns-examples" className="font-semibold text-gray-800 mb-3">🔧 Advanced Patterns</h4>
            <div className="space-y-2 text-sm">
              <div><InlineCode>"match:arrayContains:name:read_file"</InlineCode> - Object field matching</div>
              <div><InlineCode>"match:regex:\\d+ files"</InlineCode> - Regex validation</div>
              <div><InlineCode>"match:extractField:tools.*.name"</InlineCode> - Field extraction</div>
              <div><InlineCode>"match:dateAfter:2023-01-01"</InlineCode> - Date comparisons</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> Use <Link to="/pattern-matching/overview/" className="text-blue-600 hover:text-blue-800 underline">Pattern Matching Guide</Link> for complete reference with examples and edge cases.
          </p>
        </div>
      </Section>

      <Section id="prompt-templates">
        <H2 id="prompt-templates-header">🧠 Ready-to-Use Prompt Templates</H2>
        <p className="mb-6 text-gray-700">
          Use these battle-tested prompts to generate consistent, high-quality MCP tests. Each template is designed 
          to work with the AGENTS.md guides and established conventions.
        </p>
        
        <div className="space-y-6">
          {/* Project Detection Prompt */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
              <h3 id="project-detection-prompt" className="text-lg font-semibold text-purple-800">🔍 MCP Project Detection</h3>
              <p className="text-sm text-purple-600 mt-1">Identify and initialize MCP Aegis projects</p>
            </div>
            <div className="p-4">
              <CodeBlock
                language="markdown"
                code={`You are an AI assistant helping to set up MCP (Model Context Protocol) testing for a project.

**TASK**: Analyze this project and determine if it's an MCP server that needs MCP Aegis testing setup.

**DETECTION CHECKLIST**:
□ Look for aegis.config.json or *.config.json files with MCP server configuration
□ Search for .test.mcp.yml files in test/ or tests/ directories
□ Check for JSON-RPC code patterns with "tools/list" or "tools/call" methods
□ Find imports from 'mcp-aegis' package in existing code
□ Look for AGENTS/ directory in the repository root

**IF MCP PATTERNS FOUND**:
1. Run initialization: \`npx mcp-aegis init\`
2. Verify the created structure:
   - test/mcp/AGENTS.md (main overview guide)
   - test/mcp/yaml/AGENTS.md (YAML testing patterns)
   - test/mcp/node/AGENTS.md (programmatic API guide)
3. Update aegis.config.json with actual server details:
   - Correct command/args for server startup
   - Proper working directory if needed
   - Environment variables if required

**OUTPUT**: 
- Report detection results with specific evidence found
- List next steps based on findings
- If MCP patterns found, proceed with configuration setup
- If no patterns found, explain this is not an MCP project`}
              />
            </div>
          </div>

          {/* YAML Test Generation Prompt */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
              <h3 id="yaml-test-generation-prompt" className="text-lg font-semibold text-green-800">📝 YAML Test Generation</h3>
              <p className="text-sm text-green-600 mt-1">Generate declarative YAML tests with proper patterns</p>
            </div>
            <div className="p-4">
              <CodeBlock
                language="markdown"
                code={`You are an expert at generating MCP Aegis YAML test files. Create a comprehensive test file that validates an MCP server.

**REQUIREMENTS**:
1. **File Location**: Save as test/mcp/yaml/[server-name]-validation.test.mcp.yml
2. **Structure**: Use proper YAML format with description and tests array
3. **Coverage**: Include both tools/list and tools/call validation

**YAML TEMPLATE**:
\`\`\`yaml
description: "Comprehensive MCP server validation tests"
tests:
  # Test 1: Validate server lists available tools
  - it: "should successfully list all available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-list-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tools-list-1"
        result:
          tools: "match:not:arrayLength:0"  # Ensure tools array is not empty
      stderr: "toBeEmpty"  # No errors in stderr

  # Test 2: Validate specific tool execution
  - it: "should execute [TOOL_NAME] tool successfully"
    request:
      jsonrpc: "2.0"
      id: "tool-call-1"
      method: "tools/call"
      params:
        name: "[TOOL_NAME]"  # Replace with actual tool name
        arguments:
          # Add tool-specific arguments here
    expect:
      response:
        jsonrpc: "2.0"
        id: "tool-call-1"
        result:
          content: "match:type:array"  # Validate content structure
          isError: false
      stderr: "toBeEmpty"
\`\`\`

**CRITICAL PATTERNS TO USE**:
- "match:not:arrayLength:0" for non-empty arrays
- "match:type:array" for array validation
- "match:contains:text" for string content validation
- "toBeEmpty" for stderr validation

**AVOID THESE ANTI-PATTERNS**:
❌ Duplicate YAML keys (overwrites previous values)
❌ Hard-coding entire response objects
❌ Missing stderr validation
❌ Mixing pattern types in same object

**CUSTOMIZATION**: Replace [TOOL_NAME] and arguments with actual values from the server's tools/list response.`}
              />
            </div>
          </div>

          {/* Programmatic Test Generation Prompt */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
              <h3 id="programmatic-test-generation-prompt" className="text-lg font-semibold text-blue-800">💻 Programmatic Test Generation</h3>
              <p className="text-sm text-blue-600 mt-1">Create Node.js tests with proper lifecycle management</p>
            </div>
            <div className="p-4">
              <CodeBlock
                language="markdown"
                code={`You are an expert at creating Node.js test files for MCP servers using the MCP Aegis programmatic API.

**TASK**: Create a comprehensive programmatic test file that validates MCP server functionality.

**FILE TEMPLATE**:
\`\`\`javascript
import { test, before, after, beforeEach, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('MCP Server Integration Tests', () => {
  let client;

  // Setup: Connect to MCP server once
  before(async () => {
    client = await connect('./aegis.config.json');
    console.log('✅ Connected to MCP server');
  });

  // CRITICAL: Clear buffers between tests to prevent interference
  beforeEach(() => {
    client.clearAllBuffers();
  });

  // Cleanup: Disconnect after all tests
  after(async () => {
    if (client) {
      await client.disconnect();
      console.log('✅ Disconnected from MCP server');
    }
  });

  test('should successfully list available tools', async () => {
    const tools = await client.listTools();
    
    // Validate tools array structure
    assert.ok(Array.isArray(tools), 'Tools should be an array');
    assert.ok(tools.length > 0, 'Should have at least one tool available');
    
    // Validate each tool has required properties
    tools.forEach(tool => {
      assert.ok(typeof tool.name === 'string', 'Tool should have a name');
      assert.ok(typeof tool.description === 'string', 'Tool should have a description');
      assert.ok(typeof tool.inputSchema === 'object', 'Tool should have input schema');
    });
    
    console.log(\`✅ Found \${tools.length} tools: \${tools.map(t => t.name).join(', ')}\`);
  });

  test('should execute [TOOL_NAME] tool successfully', async () => {
    const result = await client.callTool('[TOOL_NAME]', {
      // Add tool-specific arguments here
    });
    
    // Validate response structure
    assert.ok(Array.isArray(result.content), 'Result content should be an array');
    assert.strictEqual(result.isError, false, 'Tool execution should not have errors');
    
    // Add tool-specific validations here
    console.log('✅ Tool executed successfully');
  });

  test('should handle invalid tool calls gracefully', async () => {
    try {
      await client.callTool('nonexistent_tool', {});
      assert.fail('Should have thrown an error for invalid tool');
    } catch (error) {
      assert.ok(error.message.includes('tool'), 'Error should mention tool issue');
      console.log('✅ Invalid tool call handled correctly');
    }
  });
});
\`\`\`

**CRITICAL REQUIREMENTS**:
1. **File Location**: Save as test/mcp/node/[server-name]-integration.programmatic.test.js
2. **Buffer Management**: ALWAYS include \`beforeEach(() => client.clearAllBuffers());\`
3. **Lifecycle**: Proper before/after hooks for connection management
4. **Error Handling**: Test both success and failure scenarios

**CUSTOMIZATION STEPS**:
1. Replace [TOOL_NAME] with actual tool names from your server
2. Add appropriate arguments for each tool test
3. Include tool-specific validation logic
4. Test edge cases and error conditions

**RUN COMMAND**: \`node --test test/mcp/node/**/*.programmatic.test.js\``}
              />
            </div>
          </div>

          {/* Configuration Setup Prompt */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-indigo-50 px-4 py-3 border-b border-gray-200">
              <h3 id="configuration-setup-prompt" className="text-lg font-semibold text-indigo-800">⚙️ Configuration Setup</h3>
              <p className="text-sm text-indigo-600 mt-1">Create proper aegis.config.json</p>
            </div>
            <div className="p-4">
              <CodeBlock
                language="markdown"
                code={`You are setting up MCP Aegis configuration for an MCP server project.

**TASK**: Create or update aegis.config.json with proper MCP server configuration.

**CONFIGURATION TEMPLATE**:
\`\`\`json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "cwd": "./",
  "startupTimeout": 5000,
  "env": {
    "NODE_ENV": "test"
  }
}
\`\`\`

**FIELD EXPLANATIONS**:

**Required Fields**:
- \`name\`: Human-readable server name for test reports
- \`command\`: Executable command (node, python, ./binary, etc.)
- \`args\`: Array of arguments passed to the command

**Optional Fields**:
- \`cwd\`: Working directory for server execution (default: "./")
- \`env\`: Environment variables as key-value object
- \`startupTimeout\`: Max milliseconds to wait for startup (default: 10000)
- \`readyPattern\`: Regex pattern in stderr indicating server ready (avoid if possible)

**COMMON CONFIGURATIONS**:

**Node.js Server**:
\`\`\`json
{
  "name": "Node MCP Server",
  "command": "node",
  "args": ["./src/server.js", "--port", "3000"],
  "cwd": "./",
  "startupTimeout": 8000
}
\`\`\`

**Python Server**:
\`\`\`json
{
  "name": "Python MCP Server", 
  "command": "python",
  "args": ["./server.py", "--debug"],
  "cwd": "./server",
  "env": {
    "PYTHONPATH": "./src",
    "DEBUG": "true"
  },
  "startupTimeout": 10000
}
\`\`\`

**Binary/Executable**:
\`\`\`json
{
  "name": "Go MCP Server",
  "command": "./bin/mcp-server",
  "args": ["--config", "config.json"],
  "cwd": "./",
  "startupTimeout": 3000
}
\`\`\`

**VALIDATION STEPS**:
1. Save configuration as \`aegis.config.json\` in project root
2. Test configuration: \`aegis query --config ./aegis.config.json\`
3. Verify server starts and responds to tools/list
4. Adjust timeout/args as needed based on server behavior

**TROUBLESHOOTING**:
- If server takes long to start, increase \`startupTimeout\`
- If server needs specific working directory, set \`cwd\`
- If server requires environment variables, add them to \`env\`
- Avoid \`readyPattern\` unless server doesn't follow MCP stdio protocol`}
              />
            </div>
          </div>

          {/* Package.json Scripts Prompt */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-yellow-50 px-4 py-3 border-b border-gray-200">
              <h3 id="npm-scripts-setup-prompt" className="text-lg font-semibold text-yellow-800">📜 npm Scripts Setup</h3>
              <p className="text-sm text-yellow-600 mt-1">Add convenient testing commands</p>
            </div>
            <div className="p-4">
              <CodeBlock
                language="markdown"
                code={`You are setting up convenient npm scripts for MCP testing in a project's package.json.

**TASK**: Add comprehensive npm scripts to package.json for MCP Aegis testing workflow.

**RECOMMENDED SCRIPTS**:
\`\`\`json
{
  "scripts": {
    // Core Testing Scripts
    "test:mcp:yaml": "mcp-aegis 'test*/mcp/yaml/**/*.test.mcp.yml' --config ./aegis.config.json",
    "test:mcp:node": "node --test 'test*/mcp/node/**/*.programmatic.test.js'",
    "test:mcp:all": "npm run test:mcp:yaml && npm run test:mcp:node",
    
    // Debugging & Development Scripts  
    "debug:mcp": "mcp-aegis query --config ./aegis.config.json",
    "debug:mcp:verbose": "mcp-aegis query --config ./aegis.config.json --verbose --debug",
    "debug:mcp:tools": "mcp-aegis query --config ./aegis.config.json --method tools/list",
    
    // CI/CD Scripts
    "test:mcp:ci": "mcp-aegis 'test*/mcp/yaml/**/*.test.mcp.yml' --config ./aegis.config.json --json --quiet",
    "test:mcp:errors": "mcp-aegis 'test*/mcp/yaml/**/*.test.mcp.yml' --config ./aegis.config.json --errors-only",
    
    // Development Helpers
    "mcp:init": "npx mcp-aegis init",
    "mcp:validate": "mcp-aegis 'test*/mcp/yaml/**/*.test.mcp.yml' --config ./aegis.config.json --dry-run"
  }
}
\`\`\`

**SCRIPT EXPLANATIONS**:

**Core Testing**:
- \`test:mcp:yaml\`: Run all YAML-based MCP tests
- \`test:mcp:node\`: Run all programmatic Node.js tests  
- \`test:mcp:all\`: Run complete MCP test suite

**Interactive Debugging**:
- \`debug:mcp\`: Interactive tool exploration
- \`debug:mcp:verbose\`: Detailed debug output with timing
- \`debug:mcp:tools\`: Quick tools/list validation

**CI/CD Integration**:
- \`test:mcp:ci\`: JSON output for CI systems
- \`test:mcp:errors\`: Focus on error reporting

**Development Helpers**:
- \`mcp:init\`: Initialize MCP testing structure
- \`mcp:validate\`: Dry-run validation without execution

**USAGE EXAMPLES**:

**Development Workflow**:
\`\`\`bash
# Run all tests during development
npm run test:mcp:all

# Debug specific tool interactively
npm run debug:mcp

# Quick validation
npm run test:mcp:yaml
\`\`\`

**CI/CD Pipeline**:
\`\`\`bash
# In GitHub Actions / CI
npm run test:mcp:ci

# Error-focused output
npm run test:mcp:errors
\`\`\`

**Tool-Specific Testing**:
\`\`\`bash
# Call specific tool for testing
mcp-aegis query read_file '{"path": "test.txt"}' --config ./aegis.config.json

# Using npm script with method syntax
npx mcp-aegis query --config ./aegis.config.json --method tools/call --params '{"name":"read_file","arguments":{"path":"test.txt"}}'
\`\`\`

**INTEGRATION**: Add these scripts to the existing package.json "scripts" section, merging with any existing test scripts.`}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="anti-patterns">
        <H2 id="anti-patterns-header">🚫 Critical Anti-Patterns</H2>
        <p className="mb-4 text-gray-700">Avoid these common mistakes that cause test failures:</p>
        
        <div className="grid gap-4">
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 id="yaml-structure-issues" className="font-semibold text-red-800 mb-2">❌ YAML Structure Issues</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>Duplicate YAML keys (overwrites previous values)</li>
              <li>Mixing pattern types in same object</li>
              <li>Hard-coding entire arrays instead of using pattern matchers</li>
            </ul>
          </div>
          <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
            <h4 id="programmatic-issues" className="font-semibold text-orange-800 mb-2">⚠️ Programmatic Issues</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>Missing <InlineCode>client.clearAllBuffers()</InlineCode> in beforeEach</li>
              <li>Not properly disconnecting clients after tests</li>
              <li>Ignoring stderr buffer in validation</li>
            </ul>
          </div>
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <h4 id="project-structure-issues" className="font-semibold text-yellow-800 mb-2">⚠️ Project Structure Issues</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>Creating tests outside <InlineCode>test*/mcp/</InlineCode> conventions</li>
              <li>Inventing alternative folder structures</li>
              <li>Regenerating duplicate files instead of updating existing</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="additional-resources">
        <H2 id="additional-resources-header">📚 Additional Resources</H2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <h4 id="primary-resources" className="font-semibold text-purple-800 mb-3">🎯 Primary Resources (Start Here)</h4>
            <ul className="space-y-2 text-sm">
              <li><strong><InlineCode>test/mcp/AGENTS.md</InlineCode></strong> - Main overview guide</li>
              <li><strong><InlineCode>test/mcp/yaml/AGENTS.md</InlineCode></strong> - YAML testing guide</li>
              <li><strong><InlineCode>test/mcp/node/AGENTS.md</InlineCode></strong> - Programmatic guide</li>
            </ul>
            <p className="text-xs text-purple-600 mt-3">
              ⚡ Generated locally by <InlineCode>npx mcp-aegis init</InlineCode>
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 id="online-documentation" className="font-semibold text-gray-800 mb-3">📖 Online Documentation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-blue-600 hover:text-blue-800 underline" to="/yaml-testing/">YAML Testing Guide</Link></li>
              <li><Link className="text-blue-600 hover:text-blue-800 underline" to="/programmatic-testing/">Programmatic API Reference</Link></li>
              <li><Link className="text-blue-600 hover:text-blue-800 underline" to="/pattern-matching/overview/">Pattern Matching Reference</Link></li>
              <li><Link className="text-blue-600 hover:text-blue-800 underline" to="/quick-start/">Quick Start Guide</Link></li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="success-criteria">
        <H2 id="success-criteria-header">✅ Success Criteria for AI Agents</H2>
        <p className="mb-6 text-gray-700">
          Your AI agent implementation is successful when it generates tests following the <strong>AGENTS.md guides</strong> and produces these outcomes:
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 id="core-test-coverage" className="font-semibold text-green-800 mb-2">🎯 Core Test Coverage</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✅ MCP handshake validation</li>
              <li>✅ Tools discovery (tools/list)</li>
              <li>✅ At least one tool execution</li>
              <li>✅ Error handling and stderr validation</li>
            </ul>
          </div>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 id="quality-indicators" className="font-semibold text-blue-800 mb-2">📊 Quality Indicators</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Follows AGENTS.md conventions exactly</li>
              <li>✅ Uses pattern matching vs hard-coding</li>
              <li>✅ Proper npm scripts included</li>
              <li>✅ Clear, maintainable test descriptions</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border border-purple-200 rounded-lg bg-purple-50 mb-6">
          <h4 id="ai-agent-best-practices" className="font-semibold text-purple-800 mb-2">🧠 AI Agent Best Practices</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>📖 Always reference the copied <strong>AGENTS.md</strong> files as primary documentation</li>
            <li>🎯 Use the provided <strong>prompt templates</strong> as starting points</li>
            <li>🔄 Follow the <strong>5-step workflow</strong> for consistent results</li>
            <li>⚠️ Avoid the documented <strong>anti-patterns</strong> to prevent common failures</li>
            <li>✅ Validate generated tests run successfully before completion</li>
          </ul>
        </div>
        
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-center">
          <h3 id="ready-to-generate" className="text-lg font-semibold text-gray-800 mb-2">🎉 Ready to Generate MCP Tests?</h3>
          <p className="text-gray-700 mb-4">
            Use the <strong>AGENTS.md guides</strong> and <strong>prompt templates</strong> above to generate 
            consistent, high-quality MCP server tests.
          </p>
          <button
            type="button"
            onClick={() => goTo('/quick-start')}
            className="no-underline inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:scale-[0.97] transition-all"
          >Get Started Now →</button>
        </div>
      </Section>
    </>
  );
};

export default AIAgentSupportPage;
