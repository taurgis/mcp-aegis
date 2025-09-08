import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const TroubleshootingPage: React.FC = () => {
    return (
        <>
            <H1 id="troubleshooting-guide">Troubleshooting Guide</H1>
            <PageSubtitle>MCP Conductor Issues & Solutions</PageSubtitle>
            <p>Common issues and comprehensive solutions when using MCP Conductor for testing Model Context Protocol servers, with debugging tips and best practices.</p>

            <H2 id="connection-problems">Connection Problems</H2>
            <H3 id="server-fails-to-start">Server Fails to Start</H3>
            <p><strong>Problem:</strong> <InlineCode>Failed to start server: Error: spawn ENOENT</InlineCode></p>
            <p><strong>Diagnosis:</strong> The command specified in config is not found or executable.</p>
            <p><strong>Solution:</strong> Ensure the <InlineCode>command</InlineCode> in your <InlineCode>conductor.config.json</InlineCode> is correct and in your system's PATH, or use an absolute path.</p>
            <CodeBlock language="json" code={`
{
  "command": "/full/path/to/node",
  "args": ["./server.js"]
}
            `} />

            <H3 id="connection-timeout">Connection Timeout</H3>
            <p><strong>Problem:</strong> <InlineCode>Connection timeout after 5000ms</InlineCode></p>
            <p><strong>Diagnosis:</strong> Server takes too long to start or the ready pattern is not matching.</p>
            <p><strong>Solutions:</strong></p>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Increase timeout:</strong> Add <InlineCode>"startupTimeout": 10000</InlineCode> to your config.</li>
                <li><strong>Add ready pattern:</strong> Add a <InlineCode>"readyPattern": "Server listening on port \\d+"</InlineCode> to your config that matches a line logged to stderr by your server on startup.</li>
            </ol>

            <H2 id="test-failures">Test Failures</H2>
            <H3 id="pattern-not-matching">Pattern Not Matching</H3>
            <p><strong>Problem:</strong> <InlineCode>Pattern did not match: expected "match:regex:..." but got "..."</InlineCode></p>
            <p><strong>Diagnosis:</strong> The pattern doesn't match the actual response format.</p>
            <p><strong>Solutions:</strong></p>
            <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Check actual response:</strong> Run with <InlineCode>--verbose --debug</InlineCode> flags to see the exact response received from the server.</li>
                <li><strong>Fix common escaping issues:</strong> YAML requires backslashes in regex to be escaped. Use <InlineCode>\\d+</InlineCode> instead of <InlineCode>\d+</InlineCode>.</li>
            </ol>

            <H2 id="debugging-tips">Debugging Tips</H2>
            <p>Always use the <InlineCode>--verbose</InlineCode> and <InlineCode>--debug</InlineCode> flags for more insight.</p>
            <CodeBlock language="bash" code={`
# Shows detailed diffs and raw server communication
conductor test.yml --config config.json --verbose --debug
            `} />
        </>
    );
};

export default TroubleshootingPage;