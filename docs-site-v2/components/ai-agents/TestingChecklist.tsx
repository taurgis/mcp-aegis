import React from 'react';
import { H2 } from '../../components/Typography';
import Section from '../Section';
import Callout from '../../components/Callout';

const TestingChecklist: React.FC = () => {
  return (
    <Section id="testing-checklist">
  <H2 id="testing-checklist-heading">AI Agent Testing Checklist</H2>
      <ul className="list-disc pl-6 space-y-2">
  <li><strong>Tool Discovery:</strong> All tools discoverable with snake_case names & (production) ≥20 char descriptions (demo tools may be shorter)</li>
        <li><strong>Schema Validation:</strong> Input schemas are complete and well-documented</li>
        <li><strong>Handshake:</strong> Successful initialize + initialized sequence prior to tool usage</li>
        <li><strong>Response Times:</strong> Tools respond within 2–5 seconds (or documented SLA) <span className="text-xs text-slate-500">(See <a className="underline" href="#/performance-testing">Performance Testing</a>)</span></li>
        <li><strong>Error Handling:</strong> Errors provide actionable information for agents</li>
        <li><strong>Context Management:</strong> Tools maintain state across conversations</li>
        <li><strong>Structured Output:</strong> Responses include both human-readable and structured data</li>
        <li><strong>Concurrent Usage:</strong> Tools handle multiple agent requests simultaneously</li>
        <li><strong>Memory Efficiency:</strong> Resource usage remains stable during long sessions</li>
        <li><strong>Agent Compatibility:</strong> Works with major AI platforms (Claude, GPT, etc.)</li>
        <li><strong>Buffer Hygiene:</strong> Buffers cleared between tests (<code>clearAllBuffers()</code>)</li>
      </ul>
      <Callout type="success" title="Production-Ready AI Agent Testing" className="mt-8">
        <p>All testing patterns and examples have been validated with real AI agent integrations (component libraries, knowledge bases, data enrichment services) and the example MCP servers included in this repository. These patterns ensure reliability with Claude, GPT and future MCP‑compatible platforms.</p>
      </Callout>
      <Callout type="info" title="Related Documentation" className="mt-6">
        <ul className="space-y-2 list-disc pl-5">
          <li><a href="#/examples" className="text-blue-600 hover:text-blue-800 underline">Examples</a> - Additional end‑to‑end scenarios</li>
          <li><a href="#/programmatic-testing" className="text-blue-600 hover:text-blue-800 underline">Programmatic Testing</a> - Advanced programmatic patterns</li>
          <li><a href="#/pattern-matching/overview" className="text-blue-600 hover:text-blue-800 underline">Pattern Matching</a> - Comprehensive validation patterns</li>
          <li><a href="#/performance-testing" className="text-blue-600 hover:text-blue-800 underline">Performance Testing</a> - Latency & resource validation</li>
        </ul>
      </Callout>
    </Section>
  );
};

export default TestingChecklist;
