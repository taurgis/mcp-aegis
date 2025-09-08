
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';

const BasicPatternsPage: React.FC = () => {
    return (
        <>
            <H1 id="basic-patterns">Basic Patterns</H1>
            <PageSubtitle>Fundamental validation for equality, types, and existence.</PageSubtitle>
            <p>These are the foundational patterns in MCP Conductor, covering the most common validation needs. They form the building blocks for more complex assertions.</p>

            <H2 id="deep-equality">Deep Equality (Default)</H2>
            <p>If you do not specify a pattern, MCP Conductor performs a deep equality check by default. This means every field and value in your expectation must exactly match the server's response.</p>
            <CodeBlock language="yaml" code={`
# This expectation requires an exact match
expect:
  response:
    result:
      tool:
        name: "calculator"
        version: "1.0"
`} />
            <p>This is useful for static or predictable responses but can be too rigid for dynamic data.</p>

            <H2 id="type-validation">Type Validation</H2>
            <p>Use <InlineCode>"match:type:&lt;type&gt;"</InlineCode> to validate a field's data type without checking its specific value. This is ideal for dynamic values like IDs, timestamps, or calculated numbers.</p>
            <p>Supported types are: <InlineCode>string</InlineCode>, <InlineCode>number</InlineCode>, <InlineCode>boolean</InlineCode>, <InlineCode>object</InlineCode>, <InlineCode>array</InlineCode>, and <InlineCode>null</InlineCode>.</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    id: "match:type:string"  # Any string is valid
    result:
      timestamp: "match:type:number" # Any number is valid
      isActive: "match:type:boolean" # Must be true or false
      data: "match:type:object" # Must be an object
      items: "match:type:array" # Must be an array
`} />

            <H2 id="field-existence">Field Existence</H2>
            <p>Use <InlineCode>"match:exists"</InlineCode> to assert that a field is present in the response, regardless of its value (including <InlineCode>null</InlineCode> or <InlineCode>undefined</InlineCode>). You can also use <InlineCode>"match:exists:true"</InlineCode> for clarity.</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      # Ensure 'optionalData' field exists, value doesn't matter
      optionalData: "match:exists"
`} />
            <p>To assert that a field is NOT present, use <InlineCode>"match:exists:false"</InlineCode>.</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      # Ensure 'deprecatedField' is not part of the response
      deprecatedField: "match:exists:false"
`} />
        </>
    );
};

export default BasicPatternsPage;
