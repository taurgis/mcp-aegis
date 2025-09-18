import React from 'react';
import { H3 } from '../../components/Typography';
import Section from '../Section';

// Reusable comparison table for YAML vs Programmatic approaches
const ApproachComparison: React.FC = () => {
  return (
    <Section id="approach-comparison" className="mt-6">
      <H3 id="approach-comparison-heading">YAML vs Programmatic Approaches</H3>
      <div className="overflow-x-auto my-4 text-sm">
        <table className="w-full border border-slate-300 text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-3 py-2">Aspect</th>
              <th className="border border-slate-300 px-3 py-2">YAML Tests</th>
              <th className="border border-slate-300 px-3 py-2">Programmatic Tests</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 px-3 py-2">Ideal Use</td>
              <td className="border border-slate-300 px-3 py-2">Declarative request/response validation & pattern matching</td>
              <td className="border border-slate-300 px-3 py-2">Conditional logic, loops, multi-step workflows</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="border border-slate-300 px-3 py-2">Strength</td>
              <td className="border border-slate-300 px-3 py-2">Readable, non-code, rich patterns (50+)</td>
              <td className="border border-slate-300 px-3 py-2">Full JS power, dynamic assertions</td>
            </tr>
            <tr>
              <td className="border border-slate-300 px-3 py-2">Performance Assertions</td>
              <td className="border border-slate-300 px-3 py-2">Built-in <code>performance.maxResponseTime</code></td>
              <td className="border border-slate-300 px-3 py-2">Custom timing logic (e.g. <code>Date.now()</code>)</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="border border-slate-300 px-3 py-2">Best For Agents</td>
              <td className="border border-slate-300 px-3 py-2">Protocol conformance & schema coverage</td>
              <td className="border border-slate-300 px-3 py-2">Workflow orchestration & stateful scenarios</td>
            </tr>
            <tr>
              <td className="border border-slate-300 px-3 py-2">Buffer Hygiene</td>
              <td className="border border-slate-300 px-3 py-2">Automatic per test case</td>
              <td className="border border-slate-300 px-3 py-2"><code>{`beforeEach(() => client.clearAllBuffers())`}</code> required</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-slate-600">Mix both styles: YAML for broad coverage + targeted programmatic tests for complex flows.</p>
      </div>
    </Section>
  );
};

export default ApproachComparison;
