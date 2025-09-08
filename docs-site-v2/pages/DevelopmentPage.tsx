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
            <p>Key directories and modules in the project:</p>
            <CodeBlock language="bash" code={`
mcp-conductor/
├── bin/                    # CLI entrypoint
│   └── conductor.js
├── src/                    # Source code
│   ├── cli/               # CLI modules
│   │   ├── commands/      # CLI commands (init, run)
│   │   └── output.js      # Output formatting
│   ├── core/              # Core engine
│   │   ├── configParser.js        # Configuration loading
│   │   ├── MCPCommunicator.js     # MCP protocol communication
│   │   └── ConfigValidator.js     # Config validation
│   ├── programmatic/      # Programmatic API
│   │   └── MCPClient.js   # Main client class
│   ├── protocol/          # MCP protocol handlers
│   └── test-engine/       # Testing engine
│       ├── runner.js      # Test execution
│       ├── executor.js    # Individual test execution
│       └── matchers/      # Pattern matching system
├── test/                  # Unit and integration tests
└── examples/              # Example servers and tests
            `} />

            <H3 id="core-modules">Core Modules</H3>
            <H3 id="mcp-communicator">MCP Communicator (<InlineCode>src/core/MCPCommunicator.js</InlineCode>)</H3>
            <p>Low-level stdio communication with MCP servers:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Child process spawning and management</li>
                <li>JSON-RPC message framing over stdio</li>
                <li>Stderr capture and buffering</li>
                <li>Graceful shutdown handling</li>
            </ul>

            <H3 id="test-engine">Test Engine (<InlineCode>src/test-engine/</InlineCode>)</H3>
            <p>Core test execution engine with modular pattern matching:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>runner.js</strong>: Orchestrates test execution</li>
                <li><strong>executor.js</strong>: Executes individual test cases</li>
                <li><strong>matchers/</strong>: 11+ pattern matching types</li>
                <li><strong>protocol</strong>: MCP handshake and protocol handling</li>
            </ul>

            <H3 id="programmatic-api">Programmatic API (<InlineCode>src/programmatic/MCPClient.js</InlineCode>)</H3>
            <p>JavaScript/TypeScript API for integration with test frameworks:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>High-level MCP operations</li>
                <li>Promise-based async API</li>
                <li>Error handling and validation</li>
                <li>Framework-agnostic design</li>
            </ul>

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

            <H2 id="adding-features">Adding Features</H2>
            <H3 id="adding-pattern-matchers">Adding New Pattern Matchers</H3>
            <p>Extend the pattern matching system in <InlineCode>src/test-engine/matchers/patterns.js</InlineCode>:</p>
            <CodeBlock language="javascript" code={`
// Add new pattern type
function matchPattern(pattern, actual) {
  if (pattern.startsWith('custom_pattern:')) {
    return matchCustomPattern(actual, pattern.substring(15));
  }
  // ... existing patterns
}

function matchCustomPattern(actual, value) {
  // Implement custom pattern logic
  return { matches: boolean, reason: string };
}
            `} />

            <p>Add tests in <InlineCode>test/testRunner.test.js</InlineCode>:</p>
            <CodeBlock language="javascript" code={`
describe('Custom Pattern Matching', () => {
  test('should match custom pattern', async () => {
    const testCase = {
      request: { /* JSON-RPC request */ },
      expect: {
        response: {
          result: {
            data: "match:custom_pattern:expected_value"
          }
        }
      }
    };
    
    // Test implementation
  });
});
            `} />

            <H3 id="adding-cli-options">Adding CLI Options</H3>
            <p>Add new options in <InlineCode>src/cli/commander.js</InlineCode>:</p>
            <CodeBlock language="javascript" code={`
program
  .option('--new-option <value>', 'Description of new option')
  .action(async (testPattern, options) => {
    if (options.newOption) {
      // Handle new option logic
    }
  });
            `} />

            <H3 id="adding-api-methods">Adding Programmatic API Methods</H3>
            <p>Extend <InlineCode>MCPClient</InlineCode> in <InlineCode>src/programmatic/MCPClient.js</InlineCode>:</p>
            <CodeBlock language="javascript" code={`
async newMethod(parameters) {
  this.validateConnection();
  
  const response = await this.sendMessage({
    jsonrpc: "2.0",
    id: \`new-method-\${Date.now()}\`,
    method: "new/method",
    params: parameters
  });
  
  return response.result;
}
            `} />

            <H2 id="testing">Testing</H2>
            <H3 id="test-structure">Test Structure</H3>
            <CodeBlock language="bash" code={`
test/
├── configParser.test.js       # Configuration validation tests
├── testParser.test.js         # YAML parsing tests  
├── MCPCommunicator.test.js    # Protocol communication tests
├── testRunner.test.js         # Test execution tests
├── reporter.test.js           # Output formatting tests
├── cli.test.js               # CLI integration tests
└── fixtures/                 # Test data and mock servers
    ├── runner/               # Test runner fixtures
    ├── servers/             # Mock MCP servers
    └── yaml/                # YAML test files
            `} />

            <H3 id="running-tests">Running Tests</H3>
            <CodeBlock language="bash" code={`
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run example server tests
npm run test:examples

# Run programmatic API tests
npm run test:programmatic

# Run with coverage
npm run test:coverage
            `} />

            <H3 id="writing-tests">Writing Tests</H3>
            <H3 id="unit-tests">Unit Tests</H3>
            <CodeBlock language="javascript" code={`
import { describe, test } from 'node:test';
import assert from 'node:assert';
import { loadConfig } from '../src/core/configParser.js';

describe('Configuration Parser', () => {
  test('should validate required fields', async () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['./server.js']
    };
    
    const result = await loadConfig('./test-config.json');
    assert.ok(result.name);
    assert.ok(result.command);
    assert.ok(Array.isArray(result.args));
  });
  
  test('should reject invalid configuration', async () => {
    await assert.rejects(
      async () => await loadConfig('./invalid-config.json'),
      /Missing required configuration fields/
    );
  });
});
            `} />

            <H3 id="integration-tests">Integration Tests</H3>
            <CodeBlock language="javascript" code={`
import { describe, test } from 'node:test';
import assert from 'node:assert';
import { runTests } from '../src/test-engine/runner.js';

describe('Integration Tests', () => {
  test('should run complete test suite', async () => {
    const config = { /* valid config */ };
    const testSuite = { /* valid test suite */ };
    
    const results = await runTests(config, testSuite);
    
    assert.ok(results.totalTests > 0);
    assert.equal(results.passedTests, results.totalTests);
  });
});
            `} />

            <H3 id="mock-servers">Mock Servers for Testing</H3>
            <p>Create mock MCP servers in <InlineCode>test/fixtures/</InlineCode>:</p>
            <CodeBlock language="javascript" code={`
// test/fixtures/mock-server.js
#!/usr/bin/env node

const responses = {
  'tools/list': { tools: [{ name: 'mock_tool', description: 'Mock tool' }] },
  'tools/call': { content: [{ type: 'text', text: 'Mock response' }] }
};

process.stdin.on('data', (data) => {
  const message = JSON.parse(data.toString());
  const response = {
    jsonrpc: "2.0",
    id: message.id,
    result: responses[message.method] || { error: 'Unknown method' }
  };
  console.log(JSON.stringify(response));
});
            `} />

            <H2 id="release-process">Release Process</H2>
            <H3 id="version-update">1. Update Version</H3>
            <CodeBlock language="bash" code={`
# For patch release
npm version patch

# For minor release  
npm version minor

# For major release
npm version major
            `} />

            <H3 id="update-changelog">2. Update Changelog</H3>
            <CodeBlock language="markdown" code={`
## [1.2.3] - 2024-01-15

### Added
- New pattern matching type: \`arrayContains\`
- Support for custom timeout configurations

### Fixed
- Handle edge case in regex pattern escaping
- Improve error messages for connection failures

### Changed
- Improved performance for large test suites
            `} />

            <H3 id="test-suite">3. Run Full Test Suite</H3>
            <CodeBlock language="bash" code={`
npm run test:all
npm run test:integration
npm run test:examples
            `} />

            <H3 id="pre-release-testing">4. Pre-release Testing</H3>
            <CodeBlock language="bash" code={`
# Test installation
npm pack
npm install -g mcp-conductor-*.tgz

# Verify CLI works
conductor --help
conductor examples/filesystem.test.mcp.yml --config examples/config.json --verbose --debug

# Test programmatic API
node -e "
const { createClient } = require('mcp-conductor');
console.log('API imports successfully');
"
            `} />

            <H3 id="build-publish">5. Build and Publish</H3>
            <CodeBlock language="bash" code={`
npm run build
npm publish

# Create GitHub Release
git tag v1.2.3
git push origin v1.2.3
            `} />

            <H2 id="development-best-practices">Development Best Practices</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Test-Driven Development</strong>: Write tests before implementing features</li>
                <li><strong>Small, Focused Commits</strong>: Make atomic commits with clear messages</li>
                <li><strong>Documentation Updates</strong>: Keep docs in sync with code changes</li>
                <li><strong>Performance Monitoring</strong>: Benchmark critical paths</li>
                <li><strong>Error Handling</strong>: Provide clear, actionable error messages</li>
                <li><strong>Backward Compatibility</strong>: Maintain API stability</li>
                <li><strong>Security Reviews</strong>: Validate input and sanitize output</li>
                <li><strong>Code Reviews</strong>: All changes require review</li>
            </ul>
        </>
    );
};

export default DevelopmentPage;