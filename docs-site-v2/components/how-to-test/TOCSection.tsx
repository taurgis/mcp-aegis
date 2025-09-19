import React from 'react';
import Section from '../Section';
import TableOfContents from '../../components/TableOfContents';

const TOCSection: React.FC = () => {
  const tocItems = [
    { id: 'ai-agent-architecture-heading', title: 'Architecture Overview', level: 2 },
    { id: 'mcp-in-ai-agent-systems', title: 'MCP in AI Agent Systems', level: 3 },
    { id: 'common-ai-agent-tools', title: 'Common AI Agent Tools', level: 3 },
    { id: 'tool-testing-patterns-heading', title: 'Tool Testing Patterns', level: 2 },
    { id: 'programmatic-tool-schema-validation', title: 'Schema Validation', level: 3 },
    { id: 'context-aware-tool-testing', title: 'Context-Aware Testing', level: 3 },
    { id: 'ai-agent-behavior-validation-heading', title: 'Agent Behavior Validation', level: 2 },
    { id: 'real-world-examples-heading', title: 'Real-World Examples', level: 2 },
    { id: 'multi-tool-yaml', title: 'Multi-Tool Server Examples', level: 3 },
    { id: 'stateful-session', title: 'Stateful Session Testing', level: 3 },
    { id: 'performance-testing-heading', title: 'Performance Testing', level: 2 },
    { id: 'best-practices-heading', title: 'Best Practices', level: 2 },
    { id: 'testing-checklist-heading', title: 'Testing Checklist', level: 2 },
  ];

  return (
    <Section id="table-of-contents">
      <TableOfContents 
        items={tocItems} 
        title="Guide Contents"
        className="mb-8"
      />
    </Section>
  );
};

export default TOCSection;