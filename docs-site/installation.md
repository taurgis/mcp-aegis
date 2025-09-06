---
title: Installation
layout: default
---

# Installation

Get MCP Conductor installed and ready for testing your MCP servers.

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher

## Global Installation

> **Note**: MCP Conductor is not yet published to npm. For now, use the [development installation](#development-installation) method.

Install MCP Conductor globally to use the `conductor` command anywhere:

```bash
npm install -g mcp-conductor
```

Verify the installation:

```bash
conductor --version
```

## Local Installation

> **Note**: MCP Conductor is not yet published to npm. For now, use the [development installation](#development-installation) method.

For project-specific testing, install as a development dependency:

```bash
npm install --save-dev mcp-conductor
```

Add a script to your `package.json`:

```json
{
  "scripts": {
    "test:mcp": "conductor '*.test.mcp.yml' --config './config.json'"
  }
}
```

Run tests with:

```bash
npm run test:mcp
```

## Development Installation

To work on MCP Conductor itself or contribute to the project:

```bash
git clone https://github.com/taurgis/mcp-conductor.git
cd mcp-conductor
npm install
npm link
```

This creates a symlink to your development version.

## Verification

Test your installation with the built-in help:

```bash
conductor --help
```

You should see output similar to:

```
Usage: conductor [options] <test-pattern>

MCP Conductor - A testing framework for Model Context Protocol servers

Arguments:
  test-pattern         glob pattern for test files (e.g., "./examples/**/*.test.mcp.yml")

Options:
  -V, --version        output the version number
  -c, --config <path>  path to conductor.config.json file (default: "./conductor.config.json")
  -h, --help           display help for command
```

## Next Steps

Now that MCP Conductor is installed:

1. [**Quick Start**]({{ '/quick-start.html' | relative_url }}) - Create your first test
2. [**Configuration**](#configuration) - Set up your MCP server configuration
3. [**Examples**]({{ '/examples.html' | relative_url }}) - See real-world usage examples

## Configuration

Create a configuration file to tell MCP Conductor how to start your MCP server:

### Basic Configuration

Create `config.json`:

```json
{
  "name": "My MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000
}
```

### Advanced Configuration

```json
{
  "name": "Production MCP Server",
  "command": "python",
  "args": ["./server.py", "--port", "8080"],
  "cwd": "./server-directory",
  "env": {
    "NODE_ENV": "test",
    "API_KEY": "test-key",
    "DEBUG": "true"
  },
  "startupTimeout": 8000,
  "readyPattern": "Server listening on port"
}
```

### Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | string | ✅ | Human-readable server name for reporting |
| `command` | string | ✅ | Executable command (node, python, etc.) |
| `args` | array | ✅ | Command arguments including server file |
| `cwd` | string | ❌ | Working directory for server execution |
| `env` | object | ❌ | Environment variables for server process |
| `startupTimeout` | number | ❌ | Max milliseconds to wait for startup (default: 5000) |
| `readyPattern` | string | ❌ | Regex pattern to match in stderr for ready signal |

## Troubleshooting

### Command Not Found

If `conductor` command is not found after global installation:

1. Check your PATH includes npm global binaries:
   ```bash
   npm config get prefix
   ```

2. Add the npm bin directory to your PATH:
   ```bash
   export PATH=$PATH:$(npm config get prefix)/bin
   ```

### Permission Issues

On Unix systems, you might need to use `sudo` for global installation:

```bash
sudo npm install -g mcp-conductor
```

Or configure npm to use a different directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### Version Conflicts

If you have multiple Node.js versions, use a version manager like `nvm`:

```bash
nvm use 18
npm install -g mcp-conductor
```

### Windows Issues

On Windows, you may need to run PowerShell as Administrator for global installation:

```powershell
npm install -g mcp-conductor
```

## Upgrading

### Global Installation

```bash
npm update -g mcp-conductor
```

### Local Installation

```bash
npm update mcp-conductor
```

Check for the latest version on [GitHub](https://github.com/taurgis/mcp-conductor).

---

**Next:** [Quick Start Guide]({{ '/quick-start.html' | relative_url }}) →
