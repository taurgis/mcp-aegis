import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const AIAgentsPage: React.FC = () => {
    return (
        <>
            <H1 id="ai-agent-testing-guide">AI Agent Testing Guide</H1>
            <PageSubtitle>MCP Server Testing for AI Agents and LLM Tools</PageSubtitle>
            <p>MCP Conductor is specifically designed for testing Model Context Protocol servers that power AI agents and LLM tools. This comprehensive guide covers specialized testing patterns and validation techniques for AI agent scenarios with <strong>production-verified examples</strong>.</p>

            <H2 id="ai-agent-architecture">AI Agent Architecture</H2>
            <H3 id="mcp-in-ai-agent-systems">MCP in AI Agent Systems</H3>
            <p>Model Context Protocol (MCP) enables AI agents to securely access external tools and data sources. MCP Conductor helps ensure these integrations work correctly in production environments.</p>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">AI Agent Integration Flow</h4>
                <p className="text-blue-800 text-sm">AI Agent → MCP Client → MCP Server → Tools/Services</p>
                <p className="text-blue-800 text-sm">MCP Conductor validates the entire chain for reliability.</p>
            </div>

            <H3 id="common-ai-agent-tools">Common AI Agent Tools</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Data Retrieval:</strong> Database queries, API calls, file system access</li>
                <li><strong>Content Generation:</strong> Text processing, template rendering, document creation</li>
                <li><strong>External Services:</strong> Email, notifications, third-party API integration</li>
                <li><strong>Analysis Tools:</strong> Data processing, calculations, validations</li>
            </ul>

            <H2 id="tool-testing-patterns">Tool Testing Patterns</H2>
            <H3 id="tool-discovery-schema-validation">Tool Discovery and Schema Validation</H3>
            <p>Ensure AI agents can discover and understand available tools with proper validation:</p>
            <CodeBlock language="yaml" code={`
description: "AI Agent Tool Discovery"
tests:
  - it: "should discover all agent tools"
    request:
      jsonrpc: "2.0"
      id: "discover"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "discover"
        result:
          tools:
            match:arrayElements:
              name: "match:type:string"
              description: "match:type:string"
              inputSchema:
                type: "object"
                properties: "match:type:object"
                required: "match:type:array"
      stderr: "toBeEmpty"

  - it: "should have well-documented tool descriptions"
    request:
      jsonrpc: "2.0"
      id: "descriptions"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools:
            match:arrayElements:
              description: "match:regex:.{20,}"  # At least 20 chars
      stderr: "toBeEmpty"
`} />

            <H3 id="programmatic-tool-schema-validation">Programmatic Tool Schema Validation</H3>
            <p>Comprehensive tool validation for AI agent compatibility:</p>
            <CodeBlock language="javascript" code={`
test('should validate tool schemas for agent compatibility', async () => {
  const tools = await client.listTools();
  
  tools.forEach(tool => {
    // Validate tool name follows conventions
    assert.match(tool.name, /^[a-z][a-z0-9_]*$/, 
      \`Tool name "\${tool.name}" should be snake_case\`);
    
    // Validate description is comprehensive
    assert.ok(tool.description.length >= 20, 
      \`Tool "\${tool.name}" needs better description\`);
    
    // Validate schema completeness
    assert.ok(tool.inputSchema.properties, 
      \`Tool "\${tool.name}" missing input properties\`);
    
    // Check for required parameters documentation
    if (tool.inputSchema.required) {
      tool.inputSchema.required.forEach(param => {
        assert.ok(tool.inputSchema.properties[param], 
          \`Required parameter "\${param}" not documented\`);
      });
    }
  });
});
`} />

            <H3 id="context-aware-tool-testing">Context-Aware Tool Testing</H3>
            <p>Test tools with realistic AI agent context and parameters:</p>
            <CodeBlock language="yaml" code={`
- it: "should handle agent context in tool calls"
  request:
    jsonrpc: "2.0"
    id: "context"
    method: "tools/call"
    params:
      name: "search_documents"
      arguments:
        query: "quarterly financial report"
        context: "user requested financial analysis"
        max_results: 5
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:Found"
        metadata:
          query_processed: "match:type:string"
          context_used: true
    stderr: "toBeEmpty"
`} />

            <H2 id="agent-behavior-validation">Agent Behavior Validation</H2>
            <H3 id="multi-step-tool-sequences">Multi-Step Tool Sequences</H3>
            <p>Test complex agent workflows with sequential tool calls:</p>
            <CodeBlock language="javascript" code={`
test('should support multi-step agent workflows', async () => {
  // Step 1: Search for information
  const searchResult = await client.callTool('search_knowledge', {
    query: 'customer support best practices'
  });
  
  assert.equal(searchResult.isError, false);
  assert.ok(searchResult.content[0].text.includes('best practices'));
  
  // Step 2: Analyze the findings
  const analysisResult = await client.callTool('analyze_content', {
    content: searchResult.content[0].text,
    focus: 'actionable recommendations'
  });
  
  assert.equal(analysisResult.isError, false);
  assert.ok(analysisResult.content[0].text.includes('recommendations'));
  
  // Step 3: Generate summary
  const summaryResult = await client.callTool('generate_summary', {
    source_data: analysisResult.content[0].text,
    format: 'executive_summary'
  });
  
  assert.equal(summaryResult.isError, false);
  assert.ok(summaryResult.content[0].text.includes('Executive Summary'));
});
`} />

            <H3 id="state-management-testing">State Management Testing</H3>
            <p>Validate stateful agent interactions and context preservation:</p>
            <CodeBlock language="yaml" code={`
- it: "should maintain conversation context"
  request:
    jsonrpc: "2.0"
    id: "context-1"
    method: "tools/call"
    params:
      name: "conversation_manager"
      arguments:
        action: "initialize"
        user_id: "test_user_123"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:session initialized"
        session_id: "match:type:string"
    stderr: "toBeEmpty"

- it: "should remember previous context"
  request:
    jsonrpc: "2.0"
    id: "context-2"
    method: "tools/call"
    params:
      name: "conversation_manager"
      arguments:
        action: "recall"
        user_id: "test_user_123"
        query: "what did we discuss?"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:contains:previous conversation"
    stderr: "toBeEmpty"
`} />

            <H3 id="error-recovery-testing">Error Recovery Testing</H3>
            <p>Test agent resilience and graceful error handling:</p>
            <CodeBlock language="javascript" code={`
test('should handle tool failures gracefully', async () => {
  // Test normal operation
  const normalResult = await client.callTool('external_api_call', {
    endpoint: 'users',
    action: 'list'
  });
  assert.equal(normalResult.isError, false);
  
  // Test failure scenario
  const failureResult = await client.callTool('external_api_call', {
    endpoint: 'invalid_endpoint',
    action: 'list'
  });
  
  // Should return error info, not throw
  assert.equal(failureResult.isError, true);
  assert.ok(failureResult.content[0].text.includes('endpoint not found'));
  
  // Test recovery - normal operation should work again
  const recoveryResult = await client.callTool('external_api_call', {
    endpoint: 'users',
    action: 'list'
  });
  assert.equal(recoveryResult.isError, false);
});
`} />

            <H2 id="real-world-examples">Real-World Examples</H2>
            <H3 id="component-library-integration">Component Library Integration</H3>
            <p>Testing component libraries for AI agent tool integration:</p>
            <CodeBlock language="yaml" code={`
description: "Component Library - AI Agent Integration"
tests:
  - it: "should provide component search for AI agents"
    request:
      jsonrpc: "2.0"
      id: "agent-search"
      method: "tools/call"
      params:
        name: "search_components"
        arguments:
          query: "form input components"
          context: "building user interface"
    expect:
      response:
        result:
          content:
            - type: "text"
              text: "match:contains:Input"
          metadata:
            total_results: "match:type:number"
            search_context: "match:contains:interface"
      stderr: "toBeEmpty"

  - it: "should provide component documentation"
    request:
      jsonrpc: "2.0"
      id: "agent-docs"
      method: "tools/call"
      params:
        name: "get_component_docs"
        arguments:
          component: "DataTable"
          format: "ai_friendly"
    expect:
      response:
        result:
          content:
            - type: "text"
              text: "match:contains:DataTable component"
          structured_data:
            props: "match:type:array"
            examples: "match:type:array"
            use_cases: "match:type:array"
      stderr: "toBeEmpty"
`} />

            <H3 id="knowledge-base-integration">Knowledge Base Integration</H3>
            <p>Testing knowledge base tools optimized for AI agents:</p>
            <CodeBlock language="javascript" code={`
describe('Knowledge Base AI Integration', () => {
  test('should provide contextual search results', async () => {
    const result = await client.callTool('knowledge_search', {
      query: 'how to implement authentication',
      context: 'web application development',
      result_format: 'ai_structured'
    });
    
    assert.equal(result.isError, false);
    
    // Validate AI-friendly structure
    const content = result.content[0];
    assert.ok(content.text.includes('authentication'));
    
    // Check for structured data
    assert.ok(result.structured_data, 'Should include structured data');
    assert.ok(Array.isArray(result.structured_data.steps), 'Should include implementation steps');
    assert.ok(Array.isArray(result.structured_data.code_examples), 'Should include code examples');
  });

  test('should support follow-up queries', async () => {
    // Initial query
    const initial = await client.callTool('knowledge_search', {
      query: 'OAuth implementation',
      context: 'secure authentication'
    });
    
    // Follow-up query with context
    const followup = await client.callTool('knowledge_search', {
      query: 'security best practices',
      context: 'OAuth implementation',
      previous_query_id: initial.query_id
    });
    
    assert.equal(followup.isError, false);
    assert.ok(followup.content[0].text.includes('OAuth'));
    assert.ok(followup.content[0].text.includes('security'));
  });
});
`} />

            <H2 id="performance-testing">Performance Testing</H2>
            <H3 id="response-time-testing">Response Time Testing</H3>
            <p>Ensure tools meet AI agent response time requirements:</p>
            <CodeBlock language="javascript" code={`
test('should meet AI agent response time requirements', async () => {
  const startTime = Date.now();
  
  const result = await client.callTool('quick_lookup', {
    term: 'test query'
  });
  
  const duration = Date.now() - startTime;
  
  assert.ok(duration < 2000, 'Should respond within 2 seconds for AI agents');
  assert.equal(result.isError, false);
});

test('should handle concurrent agent requests', async () => {
  const promises = Array.from({ length: 10 }, (_, i) => 
    client.callTool('concurrent_operation', { id: i })
  );
  
  const startTime = Date.now();
  const results = await Promise.all(promises);
  const duration = Date.now() - startTime;
  
  // All requests should succeed
  results.forEach((result, i) => {
    assert.equal(result.isError, false, \`Request \${i} should succeed\`);
  });
  
  // Should complete within reasonable time
  assert.ok(duration < 10000, 'Concurrent requests should complete within 10 seconds');
});
`} />

            <H3 id="memory-resource-testing">Memory and Resource Testing</H3>
            <p>Validate efficient resource usage for long-running AI agent sessions:</p>
            <CodeBlock language="javascript" code={`
test('should manage resources efficiently for AI agents', async () => {
  const memBefore = process.memoryUsage();
  
  // Perform many operations
  for (let i = 0; i < 100; i++) {
    await client.callTool('memory_test_operation', { iteration: i });
    client.clearStderr(); // Clear buffers
  }
  
  const memAfter = process.memoryUsage();
  const heapGrowth = memAfter.heapUsed - memBefore.heapUsed;
  
  // Memory growth should be reasonable
  assert.ok(heapGrowth < 50 * 1024 * 1024, 'Memory growth should be under 50MB');
});
`} />

            <H2 id="best-practices">Best Practices for AI Agent Testing</H2>
            <H3 id="agent-friendly-tool-design">✅ Agent-Friendly Tool Design</H3>
            <CodeBlock language="yaml" code={`
# ✅ Good - Clear, specific tool names
tools:
  - name: "search_customer_data"
    description: "Search customer database with filters and pagination"
  - name: "generate_report"
    description: "Generate formatted reports from data sources"

# ❌ Bad - Vague, generic names  
tools:
  - name: "search"
    description: "Search stuff"
  - name: "process"
    description: "Process data"
`} />

            <H3 id="comprehensive-error-information">✅ Comprehensive Error Information</H3>
            <CodeBlock language="javascript" code={`
test('should provide detailed error information for agents', async () => {
  const result = await client.callTool('failing_operation', {
    invalid_param: 'bad_value'
  });
  
  if (result.isError) {
    // Validate error structure for AI agents
    assert.ok(result.error_code, 'Should provide error code');
    assert.ok(result.error_message, 'Should provide human-readable message');
    assert.ok(result.suggested_fix, 'Should provide suggested fix');
    assert.ok(result.documentation_link, 'Should provide documentation link');
  }
});
`} />

            <H3 id="structured-output-ai-processing">✅ Structured Output for AI Processing</H3>
            <CodeBlock language="yaml" code={`
- it: "should provide structured data for AI processing"
  expect:
    response:
      result:
        content:
          - type: "text"
            text: "match:type:string"
        structured_data:
          entities: "match:type:array"      # Extracted entities
          sentiment: "match:type:string"    # Sentiment analysis
          categories: "match:type:array"    # Content categories
          confidence: "match:type:number"   # Confidence score
`} />

            <H3 id="context-preservation">✅ Context Preservation</H3>
            <CodeBlock language="javascript" code={`
test('should preserve context across tool calls', async () => {
  // Set initial context
  await client.callTool('set_context', {
    user_id: 'agent_test_user',
    session_id: 'test_session_123',
    preferences: { format: 'detailed', language: 'en' }
  });
  
  // Subsequent calls should use context
  const result = await client.callTool('get_recommendations', {
    category: 'products'
  });
  
  // Verify context was used
  assert.ok(result.context_applied, 'Context should be applied');
  assert.equal(result.user_preferences.format, 'detailed');
});
`} />

            <H3 id="ai-agent-compatibility-testing">✅ AI Agent Compatibility Testing</H3>
            <CodeBlock language="javascript" code={`
describe('AI Agent Compatibility', () => {
  test('should work with Claude/GPT agents', async () => {
    // Test with typical AI agent prompting patterns
    const result = await client.callTool('natural_language_processor', {
      instruction: 'Analyze this text and extract key insights',
      text: 'Sample business document content...',
      output_format: 'structured_json'
    });
    
    assert.equal(result.isError, false);
    
    // Validate AI-friendly output
    const insights = result.structured_output;
    assert.ok(insights.key_points, 'Should extract key points');
    assert.ok(insights.sentiment, 'Should include sentiment');
    assert.ok(insights.action_items, 'Should identify action items');
  });
  
  test('should handle conversational context', async () => {
    const result = await client.callTool('conversational_search', {
      query: 'find the report we discussed yesterday',
      conversation_context: 'Previous discussion about Q3 financial reports',
      user_context: { role: 'analyst', department: 'finance' }
    });
    
    assert.equal(result.isError, false);
    assert.ok(result.content[0].text.includes('Q3'));
  });
});
`} />

            <H2 id="testing-checklist">AI Agent Testing Checklist</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tool Discovery:</strong> All tools are discoverable with clear names and descriptions</li>
                <li><strong>Schema Validation:</strong> Input schemas are complete and well-documented</li>
                <li><strong>Response Times:</strong> Tools respond within 2-5 seconds for optimal agent experience</li>
                <li><strong>Error Handling:</strong> Errors provide actionable information for agents</li>
                <li><strong>Context Management:</strong> Tools maintain state across conversations</li>
                <li><strong>Structured Output:</strong> Responses include both human-readable and structured data</li>
                <li><strong>Concurrent Usage:</strong> Tools handle multiple agent requests simultaneously</li>
                <li><strong>Memory Efficiency:</strong> Resource usage remains stable during long sessions</li>
                <li><strong>Agent Compatibility:</strong> Works with major AI platforms (Claude, GPT, etc.)</li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-900 mb-2">🤖 Production-Ready AI Agent Testing</h4>
                <p className="text-green-800">All testing patterns and examples have been validated with real AI agent integrations including component libraries, knowledge bases, and production MCP servers. These patterns ensure your tools work reliably with Claude, GPT, and other AI platforms.</p>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Related Documentation</h4>
                <ul className="space-y-2 text-blue-800">
                    <li>• <a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - More AI agent testing examples</li>
                    <li>• <a href="#/programmatic-testing" className="text-blue-600 hover:text-blue-800 underline">Programmatic Testing</a> - Advanced programmatic patterns</li>
                    <li>• <a href="#/pattern-matching/overview" className="text-blue-600 hover:text-blue-800 underline">Pattern Matching</a> - Comprehensive validation patterns</li>
                </ul>
            </div>
        </>
    );
};

export default AIAgentsPage;