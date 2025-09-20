import React from 'react';
import { Head } from 'vite-react-ssg';
// Section components
import IntroHero from '../components/how-to-test/IntroHero';
import TOCSection from '../components/how-to-test/TOCSection';
import AgentArchitecture from '../components/how-to-test/AgentArchitecture';
import ToolTestingPatterns from '../components/how-to-test/ToolTestingPatterns';
import AgentBehaviorValidation from '../components/how-to-test/AgentBehaviorValidation';
import RealWorldExamples from '../components/how-to-test/RealWorldExamples';
import PerformanceTesting from '../components/how-to-test/PerformanceTesting';
import BestPractices from '../components/how-to-test/BestPractices';
import TestingChecklist from '../components/how-to-test/TestingChecklist';
import NextSteps from '../components/how-to-test/NextSteps';

// Ordered list of sections (easy to reorder / add / remove)
const SECTIONS: React.ComponentType[] = [
  IntroHero,
  TOCSection,
  AgentArchitecture,
  ToolTestingPatterns,
  AgentBehaviorValidation,
  RealWorldExamples,
  PerformanceTesting,
  BestPractices,
  TestingChecklist,
  NextSteps
];

const HowToTest: React.FC = () => {
  return (
    <>
      <Head>
        <title>How to Test MCP Servers - MCP Aegis</title>
        <meta name="description" content="Comprehensive guide for testing Model Context Protocol (MCP) servers. Learn YAML testing, programmatic validation, pattern matching, and advanced testing strategies for MCP server development." />
        <meta name="keywords" content="MCP testing, Model Context Protocol, server testing, YAML tests, programmatic testing, tool validation, pattern matching, MCP aegis" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="MCP Aegis • How to Test MCP Servers" />
        <meta property="og:description" content="Learn how to test Model Context Protocol servers with YAML and programmatic approaches, pattern matching, and comprehensive validation strategies." />
        <meta property="og:url" content="https://aegis.rhino-inquisitor.com/how-to-test" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MCP Aegis • How to Test MCP Servers" />
        <meta name="twitter:description" content="Learn how to test Model Context Protocol servers with YAML and programmatic approaches, pattern matching, and comprehensive validation strategies." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://aegis.rhino-inquisitor.com/how-to-test" />
        
        {/* Character encoding */}
        <meta charSet="utf-8" />
      </Head>
      
      {SECTIONS.map((Section, i) => (
        <Section key={Section.displayName || Section.name || i} />
      ))}
    </>
  );
};

export default HowToTest;
