import React from 'react';
import { H2, H3 } from '../../components/Typography';
import Section from '../Section';
import Callout from '../../components/Callout';

const AgentArchitecture: React.FC = () => {
  return (
    <Section id="ai-agent-architecture">
  <H2 id="ai-agent-architecture-heading">Architecture Overview</H2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Why this matters: A clear mental model of the MCP handshake & tool surface lets you design tests that catch orchestration failures early (before they manifest as opaque agent prompts or silent tool omissions).</p>
      <H3 id="mcp-in-ai-agent-systems">MCP in AI Agent Systems</H3>
      <p>The Model Context Protocol (MCP) standardises JSON‑RPC 2.0 over stdio so agents can safely enumerate & invoke tools. Conductor automates validation of each lifecycle phase and the structural guarantees required for reliable orchestration:</p>
      <ul className="list-disc pl-6 text-sm space-y-1 mb-4">
        <li><strong>initialize:</strong> Client declares intent & capabilities</li>
        <li><strong>initialized:</strong> Server confirms readiness / negotiated features</li>
        <li><strong>tools/list:</strong> Enumerate complete, schema‑rich tool inventory</li>
        <li><strong>tools/call:</strong> Deterministic execution producing human + structured outputs</li>
      </ul>
      <Callout type="info" title="AI Agent Integration Flow" className="mb-6">
        <p className="text-sm mb-1">AI Agent → MCP Client → MCP Server → Tools/Services</p>
        <p className="text-sm">Conductor validates startup, handshake, tool discovery, execution results & error semantics end‑to‑end.</p>
      </Callout>
      <H3 id="common-ai-agent-tools">Common AI Agent Tools</H3>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Data Retrieval:</strong> Database queries, API calls, file system access</li>
        <li><strong>Content Generation:</strong> Text processing, template rendering, document creation</li>
        <li><strong>External Services:</strong> Email, notifications, third-party API integration</li>
        <li><strong>Analysis Tools:</strong> Data processing, calculations, validations</li>
      </ul>
    </Section>
  );
};

export default AgentArchitecture;
