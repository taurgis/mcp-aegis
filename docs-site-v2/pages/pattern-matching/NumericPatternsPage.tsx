import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import { Head } from 'vite-react-ssg';
import SEO from '../../components/SEO';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import StructuredData from '../../components/StructuredData';
import { SITE_DATES } from '../../constants';

const NumericPatternsPage: React.FC = () => {
    const numericPatternsStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Numeric Patterns - Pattern Matching - MCP Aegis",
        "description": "Comprehensive numeric validation patterns for MCP testing. Learn number comparisons, ranges, approximations, and decimal precision for Model Context Protocol servers.",
        "author": {
            "@type": "Person",
            "name": "Thomas Theunen"
        },
        "publisher": {
            "@type": "Person", 
            "name": "Thomas Theunen"
        },
        "datePublished": SITE_DATES.PUBLISHED,
        "dateModified": SITE_DATES.MODIFIED,
        "url": "https://aegis.rhino-inquisitor.com/pattern-matching/numeric/",
        "mainEntity": {
            "@type": "Guide",
            "name": "MCP Aegis Numeric Patterns Guide"
        }
    };


    return (
        <>
            <SEO 
                title="Numeric Patterns - Pattern Matching"
                description="Comprehensive numeric validation patterns for MCP testing. Learn number comparisons, ranges, approximations, and decimal precision for Model Context Protocol servers."
                keywords="MCP numeric patterns, number validation MCP, range validation, approximation patterns MCP, decimal precision validation, numeric comparison MCP"
                canonical="/pattern-matching/numeric/"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Pattern Matching", url: "/pattern-matching/" },
                { name: "Numeric Patterns", url: "/pattern-matching/numeric/" }
            ]} />
            <StructuredData structuredData={numericPatternsStructuredData} />

            <Head>
                <title>Numeric Patterns - MCP Aegis Pattern Matching</title>
            </Head>

            <H1 id="numeric-patterns">Numeric Patterns</H1>
            <PageSubtitle>Advanced numeric comparison and validation patterns.</PageSubtitle>
            <p>MCP Aegis provides comprehensive numeric comparison patterns for validating numeric values, counts, scores, measurements, and calculations returned by MCP servers. These patterns support both integer and floating-point numbers.</p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>All numeric patterns automatically parse string values to numbers. If the value cannot be parsed as a number, the pattern will return <strong>false</strong>.</p>
                        </div>
                    </div>
                </div>
            </div>

            <H2 id="comparison-patterns">Comparison Patterns</H2>

            <H3 id="greater-than">Greater Than</H3>
            <p>Use <InlineCode>"match:greaterThan:N"</InlineCode> to validate that a numeric value is greater than the specified threshold.</p>
            <CodeBlock language="yaml" code={`
# Validate that a count is greater than expected minimum
expect:
  response:
    result:
      count: "match:greaterThan:10"        # Must be > 10
      score: "match:greaterThan:95.5"      # Must be > 95.5
      percentage: "match:greaterThan:0"     # Must be positive
`} />

            <H3 id="greater-than-or-equal">Greater Than or Equal</H3>
            <p>Use <InlineCode>"match:greaterThanOrEqual:N"</InlineCode> to validate that a numeric value is greater than or equal to the threshold.</p>
            <CodeBlock language="yaml" code={`
# Validate minimum values (inclusive)
expect:
  response:
    result:
      rating: "match:greaterThanOrEqual:1"    # Must be >= 1
      progress: "match:greaterThanOrEqual:0"   # Must be >= 0 (non-negative)
      temperature: "match:greaterThanOrEqual:-273.15"  # Above absolute zero
`} />

            <H3 id="less-than">Less Than</H3>
            <p>Use <InlineCode>"match:lessThan:N"</InlineCode> to validate that a numeric value is less than the specified threshold.</p>
            <CodeBlock language="yaml" code={`
# Validate maximum limits
expect:
  response:
    result:
      errorRate: "match:lessThan:0.01"      # Must be < 1%
      responseTime: "match:lessThan:1000"   # Must be < 1000ms
      usage: "match:lessThan:100"           # Must be < 100%
`} />

            <H3 id="less-than-or-equal">Less Than or Equal</H3>
            <p>Use <InlineCode>"match:lessThanOrEqual:N"</InlineCode> to validate that a numeric value is less than or equal to the threshold.</p>
            <CodeBlock language="yaml" code={`
# Validate maximum values (inclusive)
expect:
  response:
    result:
      percentage: "match:lessThanOrEqual:100"  # Must be <= 100%
      priority: "match:lessThanOrEqual:10"     # Must be <= 10
      fileSize: "match:lessThanOrEqual:1024"   # Must be <= 1KB
`} />

            <H2 id="range-patterns">Range Patterns</H2>

            <H3 id="between">Between (Inclusive Range)</H3>
            <p>Use <InlineCode>"match:between:MIN:MAX"</InlineCode> to validate that a numeric value falls within a specific range (inclusive).</p>
            <CodeBlock language="yaml" code={`
# Validate values within acceptable ranges
expect:
  response:
    result:
      httpStatus: "match:between:200:299"     # Success status codes (200-299)
      temperature: "match:between:-10:40"     # Temperature range (-10°C to 40°C)
      rating: "match:between:1:5"             # Rating scale (1 to 5 stars)
      percentage: "match:between:0:100"       # Percentage (0% to 100%)
`} />

            <H3 id="range-alias">Range (Alias for Between)</H3>
            <p>Use <InlineCode>"match:range:MIN:MAX"</InlineCode> as an alias for between. Both patterns work identically.</p>
            <CodeBlock language="yaml" code={`
# Same functionality as between, different syntax preference
expect:
  response:
    result:
      score: "match:range:0:100"           # Score range (0 to 100)
      port: "match:range:1024:65535"       # Valid port range
      latitude: "match:range:-90:90"       # Valid latitude range
`} />

            <H2 id="production-examples">Production Examples</H2>
            <p>Here are real-world examples adapted from MCP Aegis's test suite:</p>

            <H3 id="api-response-validation">API Response Validation</H3>
            <CodeBlock language="yaml" code={`
# Validate API response contains numeric data within expected ranges
- it: "should validate API response metrics are within acceptable ranges"
  request:
    jsonrpc: "2.0"
    id: "api-metrics"
    method: "tools/call"
    params:
      name: "get_api_metrics"
      arguments: {}
  expect:
    response:
      jsonrpc: "2.0"
      id: "api-metrics"
      result:
        responseTime: "match:lessThan:500"        # Must be < 500ms
        successRate: "match:greaterThan:99"       # Must be > 99%
        errorCount: "match:lessThanOrEqual:10"    # Must be <= 10 errors
        uptime: "match:between:99:100"            # 99-100% uptime
        requestCount: "match:greaterThanOrEqual:0" # Non-negative
        averageLatency: "match:range:0:1000"      # 0-1000ms range
`} />

            <H3 id="file-system-validation">File System Validation</H3>
            <CodeBlock language="yaml" code={`
# Example from filesystem server testing numeric file properties
- it: "should validate file statistics are within reasonable bounds"
  request:
    jsonrpc: "2.0"
    id: "file-stats"
    method: "tools/call"
    params:
      name: "get_file_stats"
      arguments:
        path: "./large-file.txt"
  expect:
    response:
      jsonrpc: "2.0"
      id: "file-stats"
      result:
        sizeBytes: "match:greaterThan:0"          # File must have content
        maxSizeBytes: "match:lessThan:10485760"   # Must be < 10MB
        lineCount: "match:between:1:1000"        # Reasonable line count
        modifiedTimestamp: "match:greaterThan:0"  # Valid timestamp
`} />

            <H3 id="calculation-validation">Mathematical Calculation Validation</H3>
            <CodeBlock language="yaml" code={`
# Example from multi-tool server calculator testing
- it: "should validate calculation results are mathematically correct"
  request:
    jsonrpc: "2.0"
    id: "calc-validation"
    method: "tools/call"
    params:
      name: "calculator"
      arguments:
        operation: "divide"
        a: 100
        b: 3
  expect:
    response:
      jsonrpc: "2.0"
      id: "calc-validation"
      result:
        result: "match:between:33:34"             # 100/3 ≈ 33.33
        precision: "match:greaterThan:2"          # At least 2 decimal places
        isExact: "match:type:boolean"             # Type validation
        # Combining numeric with other patterns:
        formatted: "match:contains:33.33"         # String representation
`} />

            <H2 id="combining-with-negation">Combining with Pattern Negation</H2>
            <p>All numeric patterns work with pattern negation using <InlineCode>"match:not:"</InlineCode>:</p>
            <CodeBlock language="yaml" code={`
expect:
  response:
    result:
      errorRate: "match:not:greaterThan:5"      # NOT > 5 (i.e., <= 5)
      status: "match:not:between:400:599"       # NOT 4xx-5xx (i.e., success)
      timeout: "match:not:lessThan:1000"        # NOT < 1000 (i.e., >= 1000)
      score: "match:not:range:0:50"             # NOT 0-50 (i.e., > 50)
`} />

            <H2 id="error-handling">Error Handling</H2>
            <p>Numeric patterns handle edge cases gracefully:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Non-numeric strings</strong>: Return <InlineCode>false</InlineCode></li>
                <li><strong>Null/undefined values</strong>: Return <InlineCode>false</InlineCode></li>
                <li><strong>Invalid range syntax</strong>: Return <InlineCode>false</InlineCode></li>
                <li><strong>String numbers</strong>: Automatically parsed (e.g., <InlineCode>"42"</InlineCode> becomes <InlineCode>42</InlineCode>)</li>
            </ul>

            <CodeBlock language="yaml" code={`
# These will all evaluate to false:
invalidValue: "match:greaterThan:10"        # When actual is "abc"
nullValue: "match:between:1:10"             # When actual is null
malformedRange: "match:between:invalid"     # Invalid range format
`} />

            <H2 id="use-cases">Common Use Cases</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Performance Testing</strong>: Response times, throughput, memory usage</li>
                <li><strong>API Validation</strong>: HTTP status codes, pagination counts, rate limits</li>
                <li><strong>Data Quality</strong>: Score ranges, percentages, measurement bounds</li>
                <li><strong>Business Logic</strong>: Price ranges, quantity limits, rating scales</li>
                <li><strong>System Metrics</strong>: CPU usage, disk space, error rates</li>
                <li><strong>Mathematical Operations</strong>: Calculation results, statistical measures</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Best Practice</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>Combine numeric patterns with other pattern types for comprehensive validation. For example, use type validation first, then numeric ranges for robust testing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NumericPatternsPage;
