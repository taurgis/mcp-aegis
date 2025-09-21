import React from 'react';
import { Link } from 'react-router-dom';
import { H1, PageSubtitle } from '../../components/Typography';
import Section from '../Section';
import Callout from '../../components/Callout';

const IntroHero: React.FC = () => {
  return (
    <Section id="how-to-test-mcp-servers" noMargin>
      <H1 id="how-to-test-mcp-servers-heading">How to Test MCP Servers</H1>
      <PageSubtitle>Comprehensive Guide to Testing Model Context Protocol Servers</PageSubtitle>
      
      <Callout type="info" title="Prerequisites & Learning Path" className="mb-6">
        <p className="text-sm mb-3">
          This guide assumes you've completed the <Link to="/quick-start/" className="text-blue-600 hover:text-blue-800 underline">Quick Start</Link> 
          and understand basic MCP testing concepts. If you're new to MCP Aegis, start there first.
        </p>
        <p className="text-sm">
          <strong>Focus here:</strong> Advanced testing patterns, YAML and programmatic approaches, production validation strategies, and comprehensive server testing.
        </p>
      </Callout>
      
      <p>MCP Aegis provides comprehensive testing capabilities for Model Context Protocol servers. This guide covers advanced testing strategies including YAML declarative testing, programmatic validation, pattern matching, performance testing, and production-ready validation workflows. All examples reference <strong>real tools</strong> from the included example servers (filesystem, multi‑tool, stateful session, API testing) and demonstrate patterns used in production MCP deployments.</p>
    </Section>
  );
};

export default IntroHero;
