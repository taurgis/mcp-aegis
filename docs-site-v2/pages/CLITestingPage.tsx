import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';
import Section from '../components/Section';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { SITE_DATES } from '../constants';

const CLITestingPage: React.FC = () => {
    const navigate = useNavigate();
    
    const goTo = (path: string) => {
        navigate(path);
    };

    const cliTestingStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "CLI Testing & Query Command - MCP Aegis",
        "description": "Master the MCP Aegis query command for interactive testing. Learn pipe-separated parameters, JSON formats, method syntax, and real-time MCP server debugging techniques.",
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
        "url": "https://aegis.rhino-inquisitor.com/cli-testing/",
        "mainEntity": {
            "@type": "Guide",
            "name": "MCP Aegis CLI Testing Guide"
        }
    };

    const pipeBasicCode = `# Basic pipe format
aegis query calculator 'operation:add|a:5|b:3' --config config.json

# Nested objects with dot notation
aegis query api_client 'config.host:localhost|config.port:8080|timeout:30' --config config.json

# Mixed data types (auto-inferred)
aegis query tool 'text:hello|count:42|active:true|data:null' --config config.json`;

    const jsonFormatCode = `# Traditional JSON format
aegis query calculator '{"operation": "add", "a": 5, "b": 3}' --config config.json

# Complex nested structures
aegis query complex_tool '{"config": {"host": "localhost"}, "data": [1,2,3]}' --config config.json`;

    const methodSyntaxCode = `# Method syntax with pipe format
aegis query --method tools/call --params 'name:read_file|arguments.path:/tmp/test.txt' --config config.json

# Method syntax with JSON format
aegis query --method tools/call --params '{"name": "read_file", "arguments": {"path": "/tmp/test.txt"}}' --config config.json

# List all available tools
aegis query --method tools/list --config config.json`;

    const advancedPipeCode = `# JSON values within pipe format
aegis query complex_tool 'metadata:{"version":"1.0"}|tags:["test","demo"]|count:5' --config config.json

# Escaped pipes for literal pipe characters  
aegis query text_processor 'message:hello\\|world|separator:value' --config config.json

# Complex nested configuration
aegis query service 'database.host:localhost|database.port:5432|cache.enabled:true|cache.ttl:300' --config config.json`;

    const debuggingCode = `# Basic tool testing
aegis query read_file 'path:test.txt' --config config.json

# Debug with verbose output
aegis query read_file 'path:test.txt' --config config.json --verbose

# JSON output for automation
aegis query calculator 'operation:add|a:5|b:3' --config config.json --json`;

    const helpExampleCode = `$ aegis query --help

Usage: aegis query [options] [tool-name] [tool-args]

Query an MCP server tool directly for debugging

Parameter formats supported:
  • JSON format: '{"key": "value", "num": 42}'
  • Pipe format: 'key:value|num:42|nested.field:test'

Examples:
  aegis query read_file '{"path": "/tmp/file.txt"}'
  aegis query read_file 'path:/tmp/file.txt|encoding:utf8'
  aegis query --method tools/call --params 'name:read_file|arguments.path:/tmp/file.txt'`;

    return (
        <>
            <SEO 
                title="CLI Testing & Query Command"
                description="Master the MCP Aegis query command for interactive testing. Learn pipe-separated parameters, JSON formats, method syntax, and real-time MCP server debugging techniques."
                keywords="MCP CLI testing, aegis query command, pipe-separated parameters, MCP debugging, Model Context Protocol CLI, interactive testing, MCP command line"
                canonical="/cli-testing/"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "CLI Testing", url: "/cli-testing/" }
            ]} />
            <StructuredData structuredData={cliTestingStructuredData} />

            <H1 id="cli-testing-guide">⚡ CLI Testing & Query Command</H1>
            <PageSubtitle>Interactive Model Context Protocol Testing</PageSubtitle>

            {/* HERO SECTION */}
            <section className="hero-section bg-gradient-to-br from-purple-50 to-blue-100 rounded-lg p-8 text-center mb-12" aria-labelledby="hero-heading">
                <h2 id="hero-heading" className="text-2xl font-bold text-gray-800 mb-4">Real-Time MCP Server Testing</h2>
                <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                    Test MCP servers interactively with the <InlineCode>aegis query</InlineCode> command. 
                    Features <strong>dual parameter formats</strong> for maximum CLI usability and comprehensive debugging capabilities.
                </p>
                <div className="flex items-center justify-center gap-2 mb-6" aria-label="CLI testing features">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Pipe Format</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">JSON Support</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Real-time Testing</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Auto Type Inference</span>
                </div>
                <nav aria-label="Primary calls to action" className="flex flex-wrap justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => document.getElementById('quick-examples')?.scrollIntoView({ behavior: 'smooth' })}
                        className="no-underline inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 active:scale-[0.97] transition-all"
                    >Quick Examples</button>
                    <button
                        type="button"
                        onClick={() => document.getElementById('pipe-format')?.scrollIntoView({ behavior: 'smooth' })}
                        className="no-underline inline-flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 active:scale-[0.97] transition-all"
                    >Pipe Format Guide</button>
                    <button
                        type="button"
                        onClick={() => goTo('/examples')}
                        className="no-underline inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 active:scale-[0.97] transition-all"
                    >View Examples</button>
                </nav>
            </section>

            <Section id="quick-examples">
                <H2 id="cli-quick-examples">🚀 Quick Examples</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Get started immediately with these common CLI testing patterns. The query command supports multiple formats for maximum flexibility.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">🆕 Pipe Format (Recommended)</h3>
                        <CodeBlock language="bash" code={pipeBasicCode} />
                        <p className="mt-3 text-sm text-gray-600">✅ CLI-friendly, no quote escaping needed</p>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 JSON Format (Traditional)</h3>
                        <CodeBlock language="bash" code={jsonFormatCode} />
                        <p className="mt-3 text-sm text-gray-600">✅ Full JSON power for complex structures</p>
                    </div>
                </div>

                <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Method Syntax</h3>
                    <CodeBlock language="bash" code={methodSyntaxCode} />
                    <p className="mt-3 text-sm text-gray-600">Use <InlineCode>--method</InlineCode> for direct JSON-RPC method calls</p>
                </div>
            </Section>

            <Section id="pipe-format">
                <H2 id="pipe-format-guide">🔧 Pipe Format Guide</H2>
                <p className="mb-6 text-lg text-gray-700">
                    The pipe-separated parameter format provides a CLI-friendly alternative to JSON with automatic type inference and nested object support.
                </p>

                <div className="mb-8">
                    <H3 id="basic-syntax">Basic Syntax</H3>
                    <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-center mb-4">
                            <code className="text-lg font-mono bg-white px-4 py-2 rounded border">key:value|other:123|nested.field:test</code>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <span className="font-semibold text-purple-600">key:value</span>
                                <p className="text-gray-600 mt-1">Basic parameter</p>
                            </div>
                            <div className="text-center">
                                <span className="font-semibold text-blue-600">|</span>
                                <p className="text-gray-600 mt-1">Separator</p>
                            </div>
                            <div className="text-center">
                                <span className="font-semibold text-green-600">nested.field</span>
                                <p className="text-gray-600 mt-1">Dot notation</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <H3 id="type-inference">Automatic Type Inference</H3>
                    <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Input</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Interpreted As</th>
                                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">JavaScript Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-3"><InlineCode>text:hello</InlineCode></td>
                                    <td className="border border-gray-300 px-4 py-3">"hello"</td>
                                    <td className="border border-gray-300 px-4 py-3">string</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3"><InlineCode>count:42</InlineCode></td>
                                    <td className="border border-gray-300 px-4 py-3">42</td>
                                    <td className="border border-gray-300 px-4 py-3">number</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-3"><InlineCode>active:true</InlineCode></td>
                                    <td className="border border-gray-300 px-4 py-3">true</td>
                                    <td className="border border-gray-300 px-4 py-3">boolean</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-3"><InlineCode>data:null</InlineCode></td>
                                    <td className="border border-gray-300 px-4 py-3">null</td>
                                    <td className="border border-gray-300 px-4 py-3">null</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-3"><InlineCode>score:3.14</InlineCode></td>
                                    <td className="border border-gray-300 px-4 py-3">3.14</td>
                                    <td className="border border-gray-300 px-4 py-3">number</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-8">
                    <H3 id="advanced-features">Advanced Features</H3>
                    <CodeBlock language="bash" code={advancedPipeCode} />
                    <div className="mt-4 grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">JSON Values</h4>
                            <p className="text-sm text-blue-700">Embed JSON objects and arrays within pipe format</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Escaped Pipes</h4>
                            <p className="text-sm text-green-700">Use <InlineCode>\\|</InlineCode> for literal pipe characters</p>
                        </div>
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h4 className="font-semibold text-purple-800 mb-2">Nested Objects</h4>
                            <p className="text-sm text-purple-700">Create nested structures with dot notation</p>
                        </div>
                    </div>
                </div>
            </Section>

            <Section id="format-comparison">
                <H2 id="format-comparison-table">📊 Format Comparison</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Choose the right format for your use case. Both formats are fully supported and can be mixed as needed.
                </p>

                <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Feature</th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Pipe Format</th>
                                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">JSON Format</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-3 font-medium">CLI Friendly</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Excellent</span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">⚠️ Quote Escaping</span>
                                </td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3 font-medium">Simple Parameters</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Very Easy</span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">⚠️ Verbose</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-3 font-medium">Nested Objects</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Dot Notation</span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Native</span>
                                </td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3 font-medium">Data Types</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Auto-Inferred</span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Explicit</span>
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-3 font-medium">Complex Structures</td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Mixed JSON/Pipe</span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-sm">✅ Full JSON Power</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Section>

            <Section id="debugging-commands">
                <H2 id="debugging-guide">🐛 Debugging & Testing Commands</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Use these commands for comprehensive MCP server testing and debugging.
                </p>

                <div className="mb-8">
                    <H3 id="basic-testing">Basic Testing Commands</H3>
                    <CodeBlock language="bash" code={debuggingCode} />
                </div>

                <div className="mb-8">
                    <H3 id="command-line-options">Command Line Options</H3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-3">Debug Options</h4>
                            <ul className="space-y-2 text-sm text-blue-700">
                                <li><InlineCode>--verbose</InlineCode> - Show detailed execution information</li>
                                <li><InlineCode>--debug</InlineCode> - Enable MCP communication logging</li>
                                <li><InlineCode>--timing</InlineCode> - Display operation timing information</li>
                                <li><InlineCode>--json</InlineCode> - Output results in JSON format</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-3">Output Options</h4>
                            <ul className="space-y-2 text-sm text-green-700">
                                <li><InlineCode>--quiet</InlineCode> - Suppress non-essential output</li>
                                <li><InlineCode>--config path</InlineCode> - Specify config file path</li>
                                <li><InlineCode>--method method</InlineCode> - Call specific JSON-RPC method</li>
                                <li><InlineCode>--params params</InlineCode> - Method parameters</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <H3 id="help-command">Help & Documentation</H3>
                    <CodeBlock language="bash" code={helpExampleCode} />
                    <p className="mt-4 text-sm text-gray-600">
                        Run <InlineCode>aegis query --help</InlineCode> anytime to see the latest command syntax and examples.
                    </p>
                </div>
            </Section>

            <Section id="common-patterns">
                <H2 id="common-use-patterns">🎯 Common Usage Patterns</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Learn these common patterns to become productive quickly with the query command.
                </p>

                <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Server Discovery</h3>
                        <CodeBlock language="bash" code={`# List all available tools
aegis query --config config.json

# Get detailed tool information
aegis query --method tools/list --config config.json --verbose`} />
                        <p className="mt-3 text-sm text-gray-600">Start here to understand what tools your MCP server provides.</p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Quick Tool Testing</h3>
                        <CodeBlock language="bash" code={`# Test file operations
aegis query read_file 'path:test.txt' --config config.json

# Test calculator with multiple parameters
aegis query calculator 'operation:multiply|a:7|b:6' --config config.json

# Test API calls with complex config
aegis query api_request 'url:https://api.example.com|method:GET|headers.Authorization:Bearer token123' --config config.json`} />
                        <p className="mt-3 text-sm text-gray-600">Rapidly test tools during development with minimal typing.</p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">🧪 Error Testing</h3>
                        <CodeBlock language="bash" code={`# Test error handling
aegis query read_file 'path:nonexistent.txt' --config config.json

# Test validation with invalid parameters
aegis query calculator 'operation:divide|a:10|b:0' --config config.json

# Test authentication failures
aegis query api_request 'url:https://api.example.com|headers.Authorization:invalid' --config config.json`} />
                        <p className="mt-3 text-sm text-gray-600">Verify your error handling works correctly.</p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">🤖 Automation Integration</h3>
                        <CodeBlock language="bash" code={`# JSON output for scripts
aegis query status_check --config config.json --json

# Combine with jq for processing
aegis query get_metrics --config config.json --json | jq '.result.data'

# Use in CI/CD pipelines
aegis query health_check 'timeout:30' --config config.json --quiet`} />
                        <p className="mt-3 text-sm text-gray-600">Integrate with scripts and automation workflows.</p>
                    </div>
                </div>
            </Section>

            <Section id="best-practices">
                <H2 id="cli-best-practices">💡 Best Practices</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Follow these guidelines for effective CLI testing and debugging.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-green-800">✅ Do</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span>Use pipe format for simple parameters to avoid quote escaping</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span>Start with <InlineCode>aegis query --config config.json</InlineCode> to list available tools</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span>Use <InlineCode>--verbose</InlineCode> to understand what's happening</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span>Test error scenarios to verify proper error handling</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 font-bold">•</span>
                                <span>Use dot notation for nested configuration: <InlineCode>config.host:localhost</InlineCode></span>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-red-800">❌ Don't</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">•</span>
                                <span>Don't use JSON format for simple parameters when pipe format is cleaner</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">•</span>
                                <span>Don't forget to escape pipes in values: use <InlineCode>\\|</InlineCode></span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">•</span>
                                <span>Don't assume all servers implement all standard methods</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">•</span>
                                <span>Don't skip testing with real data and edge cases</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 font-bold">•</span>
                                <span>Don't rely solely on CLI testing - combine with automated tests</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Section>

            <Section id="next-steps">
                <H2 id="cli-next-steps">🚀 Next Steps</H2>
                <p className="mb-6 text-lg text-gray-700">
                    Now that you understand CLI testing, explore these related topics to build comprehensive testing strategies.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <Link
                        to="/yaml-testing/"
                        className="block p-6 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-lg hover:shadow-md transition-all group"
                    >
                        <h3 className="text-lg font-semibold text-green-800 mb-3 group-hover:text-green-900">📝 YAML Testing</h3>
                        <p className="text-sm text-green-700 mb-4">Create declarative test suites with YAML files for automated testing and CI/CD integration.</p>
                        <span className="text-sm font-medium text-green-600 group-hover:text-green-700">Learn YAML Testing →</span>
                    </Link>

                    <Link
                        to="/programmatic-testing/"
                        className="block p-6 bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 rounded-lg hover:shadow-md transition-all group"
                    >
                        <h3 className="text-lg font-semibold text-blue-800 mb-3 group-hover:text-blue-900">💻 Programmatic Testing</h3>
                        <p className="text-sm text-blue-700 mb-4">Build advanced test suites with JavaScript/TypeScript for complex testing scenarios.</p>
                        <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">Learn Programmatic Testing →</span>
                    </Link>

                    <Link
                        to="/examples/"
                        className="block p-6 bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-lg hover:shadow-md transition-all group"
                    >
                        <h3 className="text-lg font-semibold text-purple-800 mb-3 group-hover:text-purple-900">🎯 Examples</h3>
                        <p className="text-sm text-purple-700 mb-4">Explore real-world examples and working MCP servers with complete test suites.</p>
                        <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">View Examples →</span>
                    </Link>
                </div>
            </Section>
        </>
    );
};

export default CLITestingPage;