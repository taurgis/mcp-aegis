import React from 'react';
import { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2 } from '../../components/Typography';

const PatternMatchingOverviewPage: React.FC = () => {
    return (
        <>
            <H1 id="pattern-matching-overview">Pattern Matching Overview</H1>
            <PageSubtitle>Advanced MCP Server Validation Patterns</PageSubtitle>
            <p>MCP Conductor provides 11+ advanced pattern matching capabilities for flexible and powerful Model Context Protocol test validation. All core patterns have been verified with production MCP servers.</p>
            <p>Patterns allow you to validate the structure and content of server responses without needing to match exact, brittle values. This is especially useful for dynamic data like IDs, timestamps, or arrays of results.</p>

            <H2 id="production-verified-patterns">🏆 Production Verified Patterns</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li>✅ <strong>Deep Equality</strong> - Exact value matching</li>
                <li>✅ <strong>Type Validation</strong> - Data type checking (<InlineCode>string</InlineCode>, <InlineCode>number</InlineCode>, etc.)</li>
                <li>✅ <strong>String Patterns</strong> - Contains, starts with, ends with</li>
                <li>✅ <strong>Regex Matching</strong> - Full regular expression support</li>
                <li>✅ <strong>Array Patterns</strong> - Length, element structure, contains</li>
                <li>✅ <strong>Object & Field Patterns</strong> - Partial matching, field extraction, counting</li>
            </ul>

            <H2 id="pattern-syntax">Pattern Syntax</H2>
            <p>All patterns use the <InlineCode>match:type:value</InlineCode> syntax. For example, to check if a field is a string, you would use <InlineCode>"match:type:string"</InlineCode>.</p>
            
            <H2 id="explore-patterns">Explore Pattern Types</H2>
            <p>Dive deeper into each category of patterns to see detailed explanations and practical examples:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><a href="#/pattern-matching/basic"><strong>Basic Patterns</strong></a>: Learn about deep equality, type validation, and existence checks.</li>
                <li><a href="#/pattern-matching/string"><strong>String Patterns</strong></a>: Validate substrings, prefixes, and suffixes.</li>
                <li><a href="#/pattern-matching/regex"><strong>Regex Patterns</strong></a>: Unleash the full power of regular expressions for complex string validation.</li>
                <li><a href="#/pattern-matching/array"><strong>Array Patterns</strong></a>: Validate array length, structure of elements, and check for inclusion of specific values.</li>
                <li><a href="#/pattern-matching/object-field"><strong>Object & Field Patterns</strong></a>: Selectively validate fields, extract nested values, and count properties.</li>
            </ul>
        </>
    );
};

export default PatternMatchingOverviewPage;