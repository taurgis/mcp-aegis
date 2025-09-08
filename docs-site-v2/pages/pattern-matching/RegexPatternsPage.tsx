
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2 } from '../../components/Typography';

const RegexPatternsPage: React.FC = () => {
    return (
        <>
            <H1 id="regex-patterns">Regex Patterns</H1>
            <PageSubtitle>Unleash the full power of regular expressions for complex string validation.</PageSubtitle>
            <p>For the most complex string validation scenarios, MCP Conductor provides full support for regular expressions, allowing you to match intricate patterns in server responses.</p>

            <H2 id="match-regex">match:regex</H2>
            <p>Use the <InlineCode>"match:regex:&lt;pattern&gt;"</InlineCode> syntax to validate a string against a regular expression. This is perfect for validating formats like UUIDs, timestamps, or structured error messages.</p>
            <CodeBlock language="yaml" code={`
# Use case: Validate a UUID format
expect:
  response:
    result:
      # Matches a standard UUID
      requestId: "match:regex:^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
`} />
            <p className="!my-4 p-4 border-l-4 border-orange-400 bg-orange-50">
                <strong>Important:</strong> When writing regular expressions in YAML, backslashes (<InlineCode>\\</InlineCode>) often need to be escaped. For example, to match a digit (<InlineCode>\\d</InlineCode>), you must write it as <InlineCode>"\\\\d"</InlineCode> in your YAML file.
            </p>
            <CodeBlock language="yaml" code={`
# Use case: Validate an error message with a number
expect:
  response:
    result:
      # Note the double backslash for \\d+
      errorMessage: "match:regex:Found \\\\d+ items"
# This will match "Found 25 items"
`} />
        </>
    );
};

export default RegexPatternsPage;
