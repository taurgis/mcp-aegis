import React from 'react';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const InstallationPage: React.FC = () => {
    return (
        <>
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
            <H3 id="basic-configuration">Basic Configuration</H3>
            <p>Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">config.json</code>:</p>
            <CodeBlock language="json" code={`
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000
}
            `} />
        </>
    );
};

export default InstallationPage;