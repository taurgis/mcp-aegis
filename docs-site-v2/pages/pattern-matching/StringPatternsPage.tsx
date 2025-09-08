
import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2 } from '../../components/Typography';

const StringPatternsPage: React.FC = () => {
    return (
        <>
            <H1 id="string-patterns">String Patterns</H1>
            <PageSubtitle>Validate parts of a string like substrings, prefixes, and suffixes.</PageSubtitle>
            <p>String patterns are essential for testing dynamic text content, such as log messages, descriptions, or generated content where you only need to verify a key part of the string.</p>

            <H2 id="match-contains">match:contains</H2>
            <p>Checks if the actual string value contains the specified substring. The match is case-sensitive.</p>
            <CodeBlock language="yaml" code={`
# Use case: Verifying a success message
expect:
  response:
    result:
      message: "match:contains:successfully updated"
# This will match "Item successfully updated."
# This will NOT match "Item Successfully updated." (case-sensitive)
`} />

            <H2 id="match-startsWith">match:startsWith</H2>
            <p>Checks if the actual string starts with the specified prefix. The match is case-sensitive.</p>
            <CodeBlock language="yaml" code={`
# Use case: Validating a resource identifier
expect:
  response:
    result:
      resourceId: "match:startsWith:user-"
# This will match "user-12345"
# This will NOT match "usr-12345"
`} />

            <H2 id="match-endsWith">match:endsWith</H2>
            <p>Checks if the actual string ends with the specified suffix. The match is case-sensitive.</p>
            <CodeBlock language="yaml" code={`
# Use case: Checking a file extension in a URL
expect:
  response:
    result:
      fileUrl: "match:endsWith:.pdf"
# This will match "https://example.com/document.pdf"
# This will NOT match "https://example.com/document.PDF"
`} />
        </>
    );
};

export default StringPatternsPage;
