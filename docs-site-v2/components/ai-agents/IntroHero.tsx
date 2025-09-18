import React from 'react';
import { H1, PageSubtitle } from '../../components/Typography';
import Section from '../Section';

const IntroHero: React.FC = () => {
  return (
    <Section id="ai-agent-testing-guide" noMargin>
  <H1 id="ai-agent-testing-guide-heading">How to Test MCP Servers</H1>
      <PageSubtitle>MCP Server Testing for AI Agents and LLM Tools</PageSubtitle>
      <p>MCP Conductor is purpose‑built for validating Model Context Protocol servers that power autonomous AI agents and LLM tool execution. This page focuses on agent‑specific quality gates layered on top of the core capabilities covered in <a href="#/quick-start" className="text-blue-600 underline">Quick Start</a>, <a href="#/yaml-testing" className="text-blue-600 underline">YAML Testing</a> and <a href="#/programmatic-testing" className="text-blue-600 underline">Programmatic Testing</a>. All code blocks now reference <strong>real tools</strong> from the example servers (filesystem, multi‑tool, stateful session, API testing) unless explicitly marked <em>Conceptual</em>.</p>
    </Section>
  );
};

export default IntroHero;
