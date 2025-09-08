import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const DevelopmentPage: React.FC = () => {
    return (
        <>
            <H1 id="development-guide">Development Guide</H1>
            <PageSubtitle>Contributing to MCP Conductor</PageSubtitle>
            <p>Contributing to MCP Conductor development and extending the Model Context Protocol testing framework. Learn the architecture, setup development environment, and contribute new features.</p>

            <H2 id="development-setup">Development Setup</H2>
            <H3 id="prerequisites">Prerequisites</H3>
            <ul className="list-disc pl-6">
                <li><strong>Node.js</strong> 18+ with npm</li>
                <li><strong>Git</strong> for version control</li>
            </ul>

            <H3 id="clone-and-install">Clone and Install</H3>
            <CodeBlock language="bash" code={`
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor

# Install dependencies
npm install

# Run tests to verify setup
npm test
            `} />
            
            <H2 id="project-architecture">Project Architecture</H2>
            <p>Key directories in the project:</p>
            <CodeBlock language="bash" code={`
mcp-conductor/
├── bin/            # CLI entrypoint
├── src/            # Source code
│   ├── cli/        # CLI modules (YAML parsing, running)
│   ├── core/       # Core engine (protocol, config)
│   └── programmatic/ # Programmatic API (MCPClient)
└── test/           # Unit and integration tests
            `} />

            <H2 id="contributing-guidelines">Contributing Guidelines</H2>
            <H3 id="code-standards">Code Standards</H3>
            <ul className="list-disc pl-6">
                <li><strong>ES2020+</strong> JavaScript with async/await</li>
                <li><strong>JSDoc</strong> comments for public APIs</li>
                <li>2-space indentation, semicolons required</li>
            </ul>

            <H3 id="commit-convention">Commit Convention</H3>
            <p>Follow the conventional commits format: <InlineCode>type(scope): description</InlineCode></p>
            <CodeBlock language="bash" code={`
# Example commits
git commit -m "feat(runner): add regex pattern matching"
git commit -m "fix(client): handle connection timeout properly"
git commit -m "docs(readme): update installation instructions"
            `} />

            <H3 id="pull-request-process">Pull Request Process</H3>
            <ol className="list-decimal pl-6">
                <li><strong>Fork</strong> the repository</li>
                <li><strong>Create feature branch</strong> from <InlineCode>main</InlineCode></li>
                <li><strong>Implement changes</strong> with tests</li>
                <li><strong>Run test suite</strong>: <InlineCode>npm test</InlineCode></li>
                <li><strong>Update documentation</strong> as needed</li>
                <li><strong>Submit pull request</strong> with clear description</li>
            </ol>
        </>
    );
};

export default DevelopmentPage;