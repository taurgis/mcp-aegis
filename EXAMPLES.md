# MCP Conductor

## Example: Testing a Weather MCP Server

This example demonstrates how to test a weather service MCP server.

### Configuration (weather.config.json)

```json
{
  "name": "Weather Service",
  "command": "python",
  "args": ["weather_server.py"],
  "env": {
    "API_KEY": "demo-key"
  },
  "readyPattern": "Weather server ready"
}
```

### Test File (weather.test.mcp.yml)

```yaml
description: "Weather service MCP server tests"
tests:
  - it: "should list weather tools"
    request:
      jsonrpc: "2.0"
      id: "weather-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "weather-1"
        result:
          tools:
            - name: "get_weather"
              description: "Gets current weather for a location"
            - name: "get_forecast"
              description: "Gets weather forecast for a location"

  - it: "should get weather for valid location"
    request:
      jsonrpc: "2.0"
      id: "weather-2"  
      method: "tools/call"
      params:
        name: "get_weather"
        arguments:
          location: "New York"
    expect:
      response:
        jsonrpc: "2.0"
        id: "weather-2"
        result:
          content:
            - type: "text"
              text: "match:Temperature: \\d+°[CF]"

  - it: "should handle invalid location"
    request:
      jsonrpc: "2.0"
      id: "weather-3"
      method: "tools/call"
      params:
        name: "get_weather"
        arguments:
          location: "InvalidLocation123"
    expect:
      response:
        jsonrpc: "2.0"
        id: "weather-3"
        error:
          code: -32602
          message: "match:.*not found.*"
```

### Running the Tests

```bash
conductor "weather.test.mcp.yml" --config "weather.config.json"
```

## Example: Database Connection Testing

### Configuration (db.config.json)

```json
{
  "name": "Database MCP Server",
  "command": "node",
  "args": ["db-server.js"],
  "env": {
    "DB_URL": "sqlite://test.db"
  },
  "startupTimeout": 10000,
  "readyPattern": "Database connected"
}
```

### Test File (db.test.mcp.yml)

```yaml
description: "Database operations test suite"
tests:
  - it: "should connect to database and list tables"
    request:
      jsonrpc: "2.0"
      id: "db-1"
      method: "tools/call"
      params:
        name: "list_tables"
        arguments: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "db-1"
        result:
          content:
            - type: "text"
              text: "match:.*users.*products.*"
      stderr: "toBeEmpty"

  - it: "should execute valid query"
    request:
      jsonrpc: "2.0"
      id: "db-2"
      method: "tools/call"
      params:
        name: "execute_query"
        arguments:
          query: "SELECT COUNT(*) FROM users"
    expect:
      response:
        jsonrpc: "2.0"
        id: "db-2"
        result:
          content:
            - type: "text"
              text: "match:\\d+ rows"
```

## Advanced Pattern Matching

### Regex Examples

```yaml
# Match numbers
text: "match:\\d+"

# Match email addresses  
text: "match:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"

# Match JSON structure
text: "match:\\{.*\"status\":\\s*\"success\".*\\}"

# Match multiple possibilities
text: "match:(success|completed|finished)"

# Match with word boundaries
text: "match:\\berror\\b"
```

### Complex Response Validation

```yaml
expect:
  response:
    jsonrpc: "2.0"
    id: "test-1"
    result:
      items:
        - id: "match:\\d+"
          name: "match:.+"
          timestamp: "match:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"
      total: "match:\\d+"
      has_more: true
```

## CI/CD Examples

### GitHub Actions

```yaml
name: MCP Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install MCP Conductor
        run: npm install -g mcp-conductor
      - name: Run MCP Tests
        run: conductor "tests/**/*.test.mcp.yml"
        env:
          API_KEY: ${{ secrets.TEST_API_KEY }}
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm install -g mcp-conductor'
            }
        }
        stage('Test') {
            steps {
                sh 'conductor "tests/**/*.test.mcp.yml" --config test.config.json'
            }
        }
    }
    post {
        always {
            echo 'MCP tests completed'
        }
    }
}
```
