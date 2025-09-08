
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2 } from '../../components/Typography';

const ArrayPatternsPage: React.FC = () => {
    return (
        <>
            <H1 id="array-patterns">Array Patterns</H1>
            <PageSubtitle>Validate array length, element structure, and content.</PageSubtitle>
            <p>Array patterns are crucial for testing API endpoints that return lists of items. MCP Conductor provides flexible patterns to validate the size, structure, and contents of arrays without brittle, hardcoded expectations.</p>

            <H2 id="match-arrayLength">match:arrayLength</H2>
            <p>Validates that an array has an exact number of elements. You can also specify a range using operators like <InlineCode>&gt;</InlineCode>, <InlineCode>&gt;=</InlineCode>, <InlineCode>&lt;</InlineCode>, <InlineCode>&lt;=</InlineCode>.</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      # Must have exactly 5 tools
      tools: "match:arrayLength:5"
      
      # Must have at least 1 user
      users: "match:arrayLength:>=1"
`} />

            <H2 id="match-arrayElements">match:arrayElements</H2>
            <p>Validates that <strong>every</strong> element in an array matches a given structure. You can nest any other pattern inside <InlineCode>match:arrayElements</InlineCode>.</p>
            <CodeBlock language="yaml" code={`
# Use case: Ensure all tools have the required fields
expect:
  response:
    result:
      tools:
        match:arrayElements:
          name: "match:type:string"
          description: "match:contains:tool"
          inputSchema: "match:type:object"
`} />

            <H2 id="match-arrayContains">match:arrayContains</H2>
            <p>Checks if an array contains one or more elements that match the provided patterns. Unlike <InlineCode>arrayElements</InlineCode>, this does not require all elements to match.</p>
            <CodeBlock language="yaml" code={`
# Use case: Verify specific users exist in a list
expect:
  response:
    result:
      users:
        match:arrayContains:
          # Check for at least one admin user
          - role: "admin"
            active: true
          # Check for a specific user by ID
          - userId: "user-abc-123"
`} />
        </>
    );
};

export default ArrayPatternsPage;
