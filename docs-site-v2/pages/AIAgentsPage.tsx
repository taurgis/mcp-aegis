import React from 'react';
import { Head } from 'vite-react-ssg';
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

const AIAgentsPage: React.FC = () => {
  return (
        <>
            <Head>
                <title>How to Test MCP Servers - MCP Conductor</title>
                <meta name="description" content="Authoritative guide for testing Model Context Protocol (MCP) servers powering AI agents & LLM toolchains. Covers handshake, tool discovery, schema validation, pattern matching, performance & reliability." />
                <meta name="keywords" content="AI agent testing, MCP testing, LLM tool validation, Model Context Protocol, tool discovery, schema validation, pattern matching, performance testing" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor • AI Agent & LLM Tool Testing" />
                <meta property="og:description" content="Production‑proven strategies for MCP server validation: handshake flows, tool discovery, pattern matching, performance, resilience." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/#/how-to-test" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor • AI Agent & LLM Tool Testing" />
                <meta name="twitter:description" content="Production‑proven strategies for MCP server validation: handshake flows, tool discovery, pattern matching, performance, resilience." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/#/how-to-test" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>

            {SECTIONS.map((Section, i) => (
              <Section key={Section.displayName || Section.name || i} />
            ))}
    </>
  );
};

export default AIAgentsPage;