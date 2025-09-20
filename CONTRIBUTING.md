# Contributing to MCP Aegis

Thank you for your interest in contributing to MCP Aegis! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/mcp-aegis.git`
3. Install dependencies: `npm install`
4. Run tests: `npm test`

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with custom config
npm run dev

# Make executable for testing
chmod +x bin/aegis.js
```

## Code Style

- Use ES6+ features and modules
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Use meaningful variable and function names

## Testing

Before submitting a pull request:

1. Ensure all existing tests pass: `npm test`
2. Add tests for new functionality
3. Test with different MCP servers if possible
4. Verify CLI works correctly

## Project Structure

```
src/
├── configParser.js    # Configuration file parsing and validation
├── testParser.js      # Test file parsing and validation  
├── MCPCommunicator.js # Low-level MCP communication
├── testRunner.js      # Core test execution engine
└── reporter.js        # Test result formatting and output

bin/
└── aegis.js       # CLI entrypoint

examples/
├── aegis.config.json    # Example configuration
├── filesystem.test.mcp.yml  # Example test file
├── simple-fs-server.js      # Example MCP server
└── test-data/
    └── hello.txt           # Test data
```

## Adding Features

When adding new features:

1. Update relevant modules in `src/`
2. Add tests in `examples/` or create new test files
3. Update documentation in `README.md`
4. Consider backward compatibility

## Bug Reports

When reporting bugs, please include:

- MCP Aegis version
- Node.js version
- Operating system
- Configuration file (sanitized)
- Test file that reproduces the issue
- Full error output

## Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Add/update tests as needed
4. Update documentation if needed
5. Ensure tests pass
6. Submit pull request with clear description

## Code of Conduct

This project follows a simple code of conduct:

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions on-topic

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Open an issue with the `question` label
3. Be specific about what you're trying to achieve

Thank you for contributing to MCP Aegis!
