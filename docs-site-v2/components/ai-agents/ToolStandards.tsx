import React from 'react';
import { H3 } from '../../components/Typography';
import Callout from '../../components/Callout';

/**
 * Centralised tool discovery & schema standards referenced across sections
 * to avoid repeating the same descriptive paragraph & criteria.
 */
const ToolStandards: React.FC = () => (
  <div id="tool-standards" className="mb-6">
    <H3 id="tool-discovery-schema-validation">Tool Discovery & Schema Standards</H3>
  <p className="mb-3">Each production tool SHOULD provide: <em>stable snake_case name</em>, <em>descriptive ≥20 char description</em> (example sandbox tools like <code>read_file</code> are intentionally shorter), and a JSON Schema with <code>type: object</code>, <code>properties</code> (each with <code>type</code>), and (when applicable) a <code>required</code> array. These guarantees let AI agents enumerate capabilities, generate valid arguments and explain failures.</p>
    <ul className="list-disc pl-6 text-sm space-y-1 mb-4">
      <li><strong>Naming:</strong> <code>^[a-z][a-z0-9_]*$</code> (no camelCase / spaces)</li>
  <li><strong>Description Length:</strong> ≥ 20 chars (production target) – shorten only in minimal demo servers</li>
      <li><strong>Schema Completeness:</strong> All parameters documented under <code>properties</code></li>
      <li><strong>Required Integrity:</strong> Every field listed in <code>required</code> exists in <code>properties</code></li>
      <li><strong>Deterministic Output Shape:</strong> Consistent <code>content[]</code> object structure (avoid shape drift)</li>
    </ul>
    <Callout type="info" compact>
      <p className="text-xs leading-relaxed"><strong>Tip:</strong> Enforce these constraints with a single YAML test using <code>match:arrayElements:</code> & regex patterns—then rely on programmatic tests only for advanced conditional logic.</p>
    </Callout>
  </div>
);

export default ToolStandards;
