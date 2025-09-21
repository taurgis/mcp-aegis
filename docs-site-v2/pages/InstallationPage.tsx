import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { SITE_DATES } from '../constants';

const InstallationPage: React.FC = () => {
    const installationStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Installation Guide - MCP Aegis",
        "description": "Complete installation guide for MCP Aegis. Get the Node.js testing library for Model Context Protocol servers installed with npm, global installation, and troubleshooting tips.",
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
        "url": "https://aegis.rhino-inquisitor.com/installation/",
        "mainEntity": {
            "@type": "Guide",
            "name": "MCP Aegis Installation Guide"
        }
    };

    return (
        <>
            <SEO 
                title="Installation Guide"
                description="Complete installation guide for MCP Aegis. Get the Node.js testing library for Model Context Protocol servers installed with npm, global installation, and troubleshooting tips."
                keywords="MCP Aegis installation, install MCP testing library, npm install MCP Aegis, Node.js MCP testing setup, Model Context Protocol installation"
                canonical="/installation/"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Installation", url: "/installation/" }
            ]} />
            <StructuredData structuredData={installationStructuredData} />

            <H1 id="installation-guide">Installation Guide</H1>
            <PageSubtitle>Multiple Ways to Get Started with MCP Aegis</PageSubtitle>
            <p>Choose the installation method that best fits your workflow. Most users should start with the <strong>Recommended Setup</strong> for the fastest experience.</p>
            
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Choose Your Installation Method</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white border border-green-300 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">🚀 First Time / Trying Out</h4>
                        <p className="text-sm text-gray-600 mb-3">No installation needed - jump to Recommended Setup</p>
                        <Link to="#recommended-setup" className="text-green-600 hover:text-green-800 font-medium">
                            → Recommended Setup
                        </Link>
                    </div>
                    <div className="p-4 bg-white border border-blue-300 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">🔧 Regular CLI Usage</h4>
                        <p className="text-sm text-gray-600 mb-3">System-wide access to aegis command</p>
                        <Link to="#global-installation" className="text-blue-600 hover:text-blue-800 font-medium">
                            → Global Installation
                        </Link>
                    </div>
                    <div className="p-4 bg-white border border-gray-300 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">📦 Project Dependency</h4>
                        <p className="text-sm text-gray-600 mb-3">Include in your project's dependencies</p>
                        <Link to="#local-installation" className="text-gray-600 hover:text-gray-800 font-medium">
                            → Local Installation
                        </Link>
                    </div>
                </div>
            </div>

            <H2 id="prerequisites">Prerequisites</H2>
            <div className="flex items-start space-x-3 mb-6">
                <div>
                    <p><strong>Node.js 18+</strong> and <strong>npm 8+</strong></p>
                    <p className="text-sm text-gray-600 mt-1">Check with: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">node --version && npm --version</code></p>
                </div>
            </div>

            <H2 id="recommended-setup">🚀 Recommended Setup (Fastest)</H2>
            <p>This is the same approach shown in our <Link to="/quick-start/" className="text-blue-600 hover:text-blue-800">Quick Start Guide</Link>. Perfect for first-time users and trying out MCP Aegis:</p>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                <CodeBlock language="bash" code={`
# Navigate to your MCP project directory
cd my-mcp-project

# Initialize MCP Aegis (auto-installs + creates structure)
npx mcp-aegis init
                `} />
                <div className="mt-4 p-3 bg-white border border-blue-300 rounded">
                    <p className="text-sm text-blue-800">
                        <strong>This command:</strong> Installs mcp-aegis as dev dependency, creates aegis.config.json, 
                        sets up test directories, and includes AI agent guides. No separate installation step needed!
                    </p>
                </div>
            </div>

            <H2 id="global-installation">🔧 Global Installation</H2>
            <p>Install globally for system-wide access to the <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">aegis</code> command:</p>
            <CodeBlock language="bash" code="npm install -g mcp-aegis" />
            
            <H3 id="verify-global">Verify Global Installation</H3>
            <CodeBlock language="bash" code={`
aegis --version

# Test with help command
aegis --help
            `} />
            
            <H2 id="local-installation">📦 Local Installation</H2>
            <p>Install as a project dependency (the <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">init</code> command does this automatically, but you can also do it manually):</p>
            <CodeBlock language="bash" code={`
npm install --save-dev mcp-aegis

npx mcp-aegis --help
            `} />

            <H2 id="quick-verification">✅ Quick Verification</H2>
            <p>Verify your installation works with a simple version check:</p>
            <CodeBlock language="bash" code={`
# If installed globally
aegis --version

# If using npx or local install
npx mcp-aegis --version

# Should output something like: 1.0.16
            `} />
            
            <H2 id="next-steps">🎯 Next Steps</H2>
            <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="p-5 rounded-lg border border-blue-200 bg-blue-50">
                    <h3 className="font-semibold mb-2 text-blue-800">New to MCP Aegis?</h3>
                    <p className="text-sm text-blue-700 mb-3">Follow our step-by-step guide to create your first test</p>
                    <Link to="/quick-start/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        Start with Quick Start Guide →
                    </Link>
                </div>
                <div className="p-5 rounded-lg border border-gray-200 bg-white">
                    <h3 className="font-semibold mb-2">Ready to Deep Dive?</h3>
                    <p className="text-sm text-gray-700 mb-3">Explore advanced features and configuration options</p>
                    <Link to="/pattern-matching/overview/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        Explore Pattern Matching →
                    </Link>
                </div>
            </div>

            <details className="mt-8 mb-6">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    🔧 Advanced Configuration Reference
                </summary>
                <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-white">
                    <p className="mb-4 text-gray-700">If you need custom configuration beyond what <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">init</code> provides:</p>
                    
                    <H3 id="basic-config-reference">Basic Configuration</H3>
                    <p>Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">aegis.config.json</code>:</p>
                    <CodeBlock language="json" code={`
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000
}
                    `} />

                    <H3 id="advanced-config-reference">Advanced Configuration</H3>
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

                    <div className="my-6 p-5 rounded-lg border border-slate-200 bg-slate-50">
                        <h4 className="text-sm font-semibold text-slate-900 tracking-wide mb-2">CONFIGURATION DEFAULTS</h4>
                        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                            <li><strong>cwd</strong>: Current working directory at invocation time</li>
                            <li><strong>env</strong>: Inherits process environment + any overrides in <code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded">config.env</code></li>
                            <li><strong>startupTimeout</strong>: <code>5000</code> ms (runtime default) / <code>10000</code> ms (init generates)</li>
                            <li><strong>readyPattern</strong>: <em>null</em> (optional regex to scan stderr for readiness)</li>
                            <li><strong>protocolVersion</strong>: <code>2025-06-18</code> (automatic MCP handshake version)</li>
                        </ul>
                    </div>

                    <H3 id="config-fields-reference">Configuration Fields</H3>
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                        <li><strong>name</strong>: Human-readable server name</li>
                        <li><strong>command</strong>: Executable command (e.g., "node", "python", "/usr/bin/node")</li>
                        <li><strong>args</strong>: Array of command arguments</li>
                        <li><strong>cwd</strong>: Working directory for the server (optional)</li>
                        <li><strong>startupTimeout</strong>: Milliseconds to wait for server startup</li>
                        <li><strong>readyPattern</strong>: Regex pattern to detect when server is ready (optional)</li>
                        <li><strong>env</strong>: Environment variables for the server process (optional)</li>
                    </ul>
                    
                    <p className="mt-4 text-sm text-gray-600">
                        <strong>Note:</strong> For detailed configuration options, see our 
                        <Link to="/how-to-test/" className="text-blue-600 hover:text-blue-800 ml-1">Configuration Guide</Link>.
                    </p>
                </div>
            </details>

            <details className="mt-8 mb-6">
                <summary className="cursor-pointer font-semibold text-gray-800 hover:text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    🛠️ Troubleshooting Common Issues
                </summary>
                <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-white">
                    <H3 id="npm-package-not-found">NPM Package Not Found</H3>
                    <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">npm: package 'mcp-aegis' not found</code></p>
                    <p><strong>Solution:</strong></p>
                    <CodeBlock language="bash" code={`
# Update npm and try again
npm install -g npm@latest
npm install -g mcp-aegis
                    `} />

                    <H3 id="permission-errors">Permission Errors</H3>
                    <p><strong>Problem:</strong> Permission denied during installation</p>
                    <p><strong>Solutions:</strong></p>
                    <CodeBlock language="bash" code={`
# Option 1: Use npx (no global install needed)
npx mcp-aegis --help

# Option 2: Fix npm permissions (recommended)
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
npm install -g mcp-aegis

# Option 3: Use local installation
npm install --save-dev mcp-aegis
npx mcp-aegis --help
                    `} />

                    <H3 id="command-not-found">Command Not Found</H3>
                    <p><strong>Problem:</strong> <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">aegis: command not found</code></p>
                    <p><strong>Solutions:</strong></p>
                    <CodeBlock language="bash" code={`
# Check if installed globally
npm list -g mcp-aegis

# Check PATH includes npm global bin
echo $PATH

# Use full command name or npx
mcp-aegis --help
npx mcp-aegis --help
                    `} />

                    <H3 id="node-version-issues">Node Version Issues</H3>
                    <p><strong>Problem:</strong> Compatibility errors with older Node.js versions</p>
                    <p><strong>Solution:</strong></p>
                    <CodeBlock language="bash" code={`
# Check Node.js version (needs 18+)
node --version

# Update to Node.js 18+ using nvm:
nvm install 18
nvm use 18

# Or download from nodejs.org
                    `} />

                    <H3 id="development-setup">Development/Latest Features</H3>
                    <p>For development or to use the latest unreleased features:</p>
                    <CodeBlock language="bash" code={`
# Clone the repository
git clone https://github.com/taurgis/mcp-aegis.git
cd mcp-aegis

# Install dependencies and test
npm install
npm test

# Use development version
node bin/aegis.js --help
                    `} />
                </div>
            </details>
        </>
    );
};

export default InstallationPage;