import React from 'react';
import useSEO from '../hooks/useSEO';
// Section components
import IntroHero from '../components/ai-agents/IntroHero';
import AgentArchitecture from '../components/ai-agents/AgentArchitecture';
import ToolTestingPatterns from '../components/ai-agents/ToolTestingPatterns';
import AgentBehaviorValidation from '../components/ai-agents/AgentBehaviorValidation';
import RealWorldExamples from '../components/ai-agents/RealWorldExamples';
import PerformanceTesting from '../components/ai-agents/PerformanceTesting';
import BestPractices from '../components/ai-agents/BestPractices';
import TestingChecklist from '../components/ai-agents/TestingChecklist';

// Ordered list of sections (easy to reorder / add / remove)
const SECTIONS: React.ComponentType[] = [
  IntroHero,
  AgentArchitecture,
  ToolTestingPatterns,
  AgentBehaviorValidation,
  RealWorldExamples,
  PerformanceTesting,
  BestPractices,
  TestingChecklist
];

const HowToTest: React.FC = () => {
  useSEO({
    title: 'How to Test MCP Servers - MCP Conductor',
    description: 'Authoritative guide for testing Model Context Protocol (MCP) servers powering AI agents & LLM toolchains. Covers handshake, tool discovery, schema validation, pattern matching, performance & reliability.',
    keywords: 'AI agent testing, MCP testing, LLM tool validation, Model Context Protocol, tool discovery, schema validation, pattern matching, performance testing',
    canonical: 'https://conductor.rhino-inquisitor.com/#/how-to-test',
    ogTitle: 'MCP Conductor • MCP Server Testing Guide',
    ogDescription: 'Production‑proven strategies for MCP server validation: handshake flows, tool discovery, pattern matching, performance, resilience.',
    ogUrl: 'https://conductor.rhino-inquisitor.com/#/how-to-test'
  });

  return (
    <>
      {SECTIONS.map((Section, i) => (
        <Section key={Section.displayName || Section.name || i} />
      ))}
    </>
  );
};

export default HowToTest;
