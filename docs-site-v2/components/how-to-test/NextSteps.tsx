import React from 'react';
import { Link } from 'react-router-dom';
import { H2 } from '../../components/Typography';
import Section from '../Section';
import Callout from '../../components/Callout';

const NextSteps: React.FC = () => {
  return (
    <Section id="next-steps">
      <H2 id="next-steps-heading">What's Next?</H2>
      <p className="mb-6">Now that you understand AI agent testing patterns, here are recommended next steps to deepen your MCP testing expertise:</p>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">🎯 Expand Your Testing Skills</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/pattern-matching/overview" className="text-blue-600 hover:text-blue-800 font-medium">Advanced Pattern Matching</Link>
              <p className="text-sm text-gray-600">Master all 50+ pattern types for comprehensive validation</p>
            </li>
            <li>
              <Link to="/performance-testing" className="text-blue-600 hover:text-blue-800 font-medium">Performance Testing</Link>
              <p className="text-sm text-gray-600">Load testing, latency monitoring, and resource validation</p>
            </li>
            <li>
              <Link to="/troubleshooting" className="text-blue-600 hover:text-blue-800 font-medium">Troubleshooting Guide</Link>
              <p className="text-sm text-gray-600">Debug complex testing scenarios and solve common issues</p>
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">🚀 Production Deployment</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/examples" className="text-blue-600 hover:text-blue-800 font-medium">Real-World Examples</Link>
              <p className="text-sm text-gray-600">Study complete example servers and their test suites</p>
            </li>
            <li>
              <Link to="/error-reporting" className="text-blue-600 hover:text-blue-800 font-medium">Error Reporting</Link>
              <p className="text-sm text-gray-600">CI/CD integration and automated test reporting</p>
            </li>
            <li>
              <Link to="/api-reference" className="text-blue-600 hover:text-blue-800 font-medium">API Reference</Link>
              <p className="text-sm text-gray-600">Complete programmatic API documentation</p>
            </li>
          </ul>
        </div>
      </div>
      
      <Callout type="success" title="Ready for Production?" className="mb-6">
        <p className="text-sm mb-3">
          You now have the knowledge to build robust test suites for AI agent MCP servers. 
          The patterns and examples shown here are production-tested with real AI agent integrations.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/examples" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Explore Complete Examples →
          </Link>
          <Link 
            to="/troubleshooting" 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Troubleshooting Guide
          </Link>
        </div>
      </Callout>

      <Callout type="info" title="Contributing & Community" className="mt-6">
        <p className="text-sm mb-3">
          Found a testing pattern that could help others? Consider contributing to the MCP Aegis project:
        </p>
        <ul className="text-sm space-y-1 list-disc pl-5">
          <li><a href="https://github.com/taurgis/mcp-aegis" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">GitHub Repository</a> - Submit issues, PRs, and example servers</li>
          <li><Link to="/development" className="text-blue-600 hover:text-blue-800 underline">Development Guide</Link> - Contribute to MCP Aegis development</li>
          <li><Link to="/ai-agent-support" className="text-blue-600 hover:text-blue-800 underline">AI Agent Support</Link> - Integration guides for specific AI platforms</li>
        </ul>
      </Callout>
    </Section>
  );
};

export default NextSteps;