
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2 } from '../../components/Typography';

const ObjectFieldPatternsPage: React.FC = () => {
    return (
        <>
            <H1 id="object-field-patterns">Object & Field Patterns</H1>
            <PageSubtitle>Selectively validate fields, extract nested values, and count properties.</PageSubtitle>
            <p>These advanced patterns give you fine-grained control over validating complex objects and their properties, allowing for flexible and resilient tests.</p>

            <H2 id="match-partial">match:partial</H2>
            <p>Validates only the fields you specify within an object, ignoring any other fields that the server might return. This is extremely useful for testing large objects where you only care about a few key properties, making your tests less brittle to API changes.</p>
            <CodeBlock language="yaml" code={`
# Actual server response: { "id": 1, "name": "test", "status": "active", "timestamp": 12345 }
expect:
  response:
    result:
      match:partial:
        # We only care about name and status, other fields are ignored
        name: "test"
        status: "active"
`} />

            <H2 id="match-extractField">match:extractField</H2>
            <p>Extracts a value from a nested path within the response for validation. This is powerful for validating specific data points deep within a complex JSON structure. Use <InlineCode>*</InlineCode> as a wildcard for all elements in an array.</p>
            <CodeBlock language="yaml" code={`
# Extracts all tool names from an array of tool objects and validates them
expect:
  response:
    result:
      match:extractField: "tools.*.name"
      value:
        - "calculator"
        - "file_reader"
        - "web_search"
`} />

            <H2 id="match-count">match:count</H2>
            <p>A utility pattern that counts the number of properties in an object or elements in an array and validates the count. It is a convenient shorthand for <InlineCode>match:arrayLength</InlineCode> for arrays.</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      # Asserts the 'users' array has 3 elements
      users: "match:count:3"

      # Asserts the 'config' object has 4 top-level properties
      config: "match:count:4"
`} />
        </>
    );
};

export default ObjectFieldPatternsPage;
