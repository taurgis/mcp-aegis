import React from 'react';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const AIAgentsPage: React.FC = () => {
    return (
        <>
            <H1 id="ai-agent-testing-guide">AI Agent Testing Guide</H1>
            <PageSubtitle>MCP Server Testing for AI Agents and LLM Tools</PageSubtitle>
            <p>MCP Conductor is specifically designed for testing Model Context Protocol servers that power AI agents and LLM tools. This comprehensive guide covers specialized testing patterns and validation techniques for AI agent scenarios.</p>

            <H2 id="tool-testing-patterns">Tool Testing Patterns</H2>
            <H3 id="tool-discovery-schema-validation">Tool Discovery and Schema Validation</H3>
            <p>Ensure agents can discover and understand available tools:</p>
            <CodeBlock language="yaml" code={`
description: "AI Agent Tool Discovery"
tests:
  - it: "should discover all agent tools"
    request:
      method: "tools/list"
    expect:
      response:
        result:
          tools:
            match:arrayElements:
              name: "match:type:string"
              description: "match:type:string"
              inputSchema:
                type: "object"
                properties: "match:type:object"

  - it: "should have well-documented tool descriptions"
    request:
      method: "tools/list"
    expect:
      response:
        result:
          tools:
            match:arrayElements:
              description: "match:regex:.{20,}"  # At least 20 chars
            `} />

            <H2 id="agent-behavior-validation">Agent Behavior Validation</H2>
            <H3 id="multi-step-tool-sequences">Multi-Step Tool Sequences</H3>
            <p>Test complex agent workflows programmatically:</p>
            <CodeBlock language="javascript" code={`
test('should support multi-step agent workflows', async () => {
  // Step 1: Search for information
  const searchResult = await client.callTool('search_knowledge', {
    query: 'customer support best practices'
  });
  assert.ok(searchResult.content[0].text.includes('best practices'));
  
  // Step 2: Analyze the findings
  const analysisResult = await client.callTool('analyze_content', {
    content: searchResult.content[0].text,
    focus: 'actionable recommendations'
  });
  assert.ok(analysisResult.content[0].text.includes('recommendations'));
  
  // Step 3: Generate summary
  const summaryResult = await client.callTool('generate_summary', {
    source_data: analysisResult.content[0].text,
    format: 'executive_summary'
  });
  assert.ok(summaryResult.content[0].text.includes('Executive Summary'));
});
            `} />
        </>
    );
};

export default AIAgentsPage;