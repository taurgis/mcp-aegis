
import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';

const PatternMatchingPage: React.FC = () => {
    return (
        <>
            <h1 id="pattern-matching-reference">Pattern Matching Reference</h1>
            <p className="text-xl text-slate-600">Advanced MCP Server Validation Patterns</p>
            <p>MCP Conductor provides 11+ advanced pattern matching capabilities for flexible and powerful Model Context Protocol test validation. All core patterns have been verified with production MCP servers.</p>

            <h2 id="production-verified-patterns">🏆 Production Verified Patterns</h2>
            <ul className="list-disc pl-6">
                <li>✅ <strong>Deep Equality</strong> - Exact value matching</li>
                <li>✅ <strong>Type Validation</strong> - Data type checking (<InlineCode>string</InlineCode>, <InlineCode>number</InlineCode>, etc.)</li>
                <li>✅ <strong>Array Length</strong> - Exact element count validation</li>
                <li>✅ <strong>Array Elements</strong> - Pattern matching for all array elements</li>
                <li>✅ <strong>String Contains</strong> - Substring matching</li>
                <li>✅ <strong>Regex Matching</strong> - Full regular expression support</li>
            </ul>

            <h2 id="pattern-types-overview">Pattern Types Overview</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Pattern Type</th>
                            <th className="text-left p-2">Syntax</th>
                            <th className="text-left p-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b"><td className="p-2"><strong>Type Validation</strong></td><td className="p-2"><InlineCode>"match:type:string"</InlineCode></td><td className="p-2">Validates data type</td></tr>
                        <tr className="border-b"><td className="p-2"><strong>String Contains</strong></td><td className="p-2"><InlineCode>"match:contains:text"</InlineCode></td><td className="p-2">String contains substring</td></tr>
                        <tr className="border-b"><td className="p-2"><strong>Regex Match</strong></td><td className="p-2"><InlineCode>"match:regex:pattern"</InlineCode></td><td className="p-2">Regular expression match</td></tr>
                        <tr className="border-b"><td className="p-2"><strong>Array Length</strong></td><td className="p-2"><InlineCode>"match:arrayLength:N"</InlineCode></td><td className="p-2">Array has exactly N elements</td></tr>
                        <tr className="border-b"><td className="p-2"><strong>Array Elements</strong></td><td className="p-2"><InlineCode>"match:arrayElements:"</InlineCode></td><td className="p-2">All elements match a pattern</td></tr>
                        <tr className="border-b"><td className="p-2"><strong>Field Extraction</strong></td><td className="p-2"><InlineCode>"match:extractField:path"</InlineCode></td><td className="p-2">Extract and validate field values</td></tr>
                        <tr className="border-b"><td className="p-2"><strong>Partial Match</strong></td><td className="p-2"><InlineCode>"match:partial:"</InlineCode></td><td className="p-2">Partial object matching</td></tr>
                    </tbody>
                </table>
            </div>

            <h2 id="pattern-examples">Pattern Examples</h2>
            <h3 id="type-validation">Type Validation</h3>
            <CodeBlock language="yaml" code={`
result:
  serverInfo: "match:type:object"
  tools: "match:type:array"
  count: "match:type:number"
  active: "match:type:boolean"
            `} />
            <h3 id="array-validation">Array Validation</h3>
            <CodeBlock language="yaml" code={`
result:
  # Exactly 1 tool
  tools: "match:arrayLength:1"
  
  # All tools must have these fields
  tools:
    match:arrayElements:
      name: "match:type:string"
      description: "match:type:string"
            `} />
            <h3 id="field-extraction">Field Extraction</h3>
            <CodeBlock language="yaml" code={`
# Extract tool names from array
result:
  match:extractField: "tools.*.name"   # Extract 'name' from all tools
  value:
    - "calculator"
    - "text_processor"
            `} />
        </>
    );
};

export default PatternMatchingPage;
