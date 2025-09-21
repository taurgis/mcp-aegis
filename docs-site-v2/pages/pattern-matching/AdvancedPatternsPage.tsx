import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import { Head } from 'vite-react-ssg';
import SEO from '../../components/SEO';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import StructuredData from '../../components/StructuredData';
import { SITE_DATES } from '../../constants';

const AdvancedPatternsPage: React.FC = () => {
    const advancedPatternsStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Advanced Patterns - Pattern Matching - MCP Aegis",
        "description": "Master advanced MCP validation patterns including partial matching, nested field extraction, and complex cross-field validation for Model Context Protocol server testing.",
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
        "url": "https://aegis.rhino-inquisitor.com/pattern-matching/advanced/",
        "mainEntity": {
            "@type": "Guide",
            "name": "MCP Aegis Advanced Patterns Guide"
        }
    };


    return (
        <>
            <SEO 
                title="Advanced Patterns - Pattern Matching"
                description="Master advanced MCP validation patterns including partial matching, nested field extraction, and complex cross-field validation for Model Context Protocol server testing."
                keywords="MCP advanced patterns, partial matching MCP, nested field extraction, cross-field validation MCP, complex MCP patterns, advanced MCP testing"
                canonical="/pattern-matching/advanced/"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Pattern Matching", url: "/pattern-matching/" },
                { name: "Advanced Patterns", url: "/pattern-matching/advanced/" }
            ]} />
            <StructuredData structuredData={advancedPatternsStructuredData} />

            <Head>
                <title>Advanced Patterns - MCP Aegis Pattern Matching</title>
            </Head>

            <H1 id="advanced-patterns">Advanced Patterns</H1>
            <PageSubtitle>Complex pattern matching techniques and combinations.</PageSubtitle>
            <p>MCP Aegis's advanced patterns provide sophisticated validation capabilities including pattern negation, case-insensitive matching, and complex pattern combinations. These patterns enable flexible and powerful test assertions for complex MCP server behaviors.</p>

            <H2 id="pattern-negation">Pattern Negation</H2>
            <p>Pattern negation allows you to invert any pattern using the <InlineCode>"match:not:"</InlineCode> prefix. This is incredibly powerful for testing what should <strong>not</strong> happen in your MCP server responses.</p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">How Pattern Negation Works</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Pattern negation works with <strong>any</strong> existing pattern. Simply prefix the pattern with <InlineCode>not:</InlineCode> to invert its result.</p>
                        </div>
                    </div>
                </div>
            </div>

            <H3 id="basic-negation-examples">Basic Negation Examples</H3>
            <CodeBlock language="yaml" code={`
# Test that values are NOT certain things
expect:
  response:
    result:
      # String negations
      status: "match:not:contains:error"        # Should NOT contain "error"
      message: "match:not:startsWith:FAIL"      # Should NOT start with "FAIL"
      output: "match:not:endsWith:.tmp"         # Should NOT end with ".tmp"
      
      # Type negations  
      data: "match:not:type:string"             # Should NOT be a string
      result: "match:not:type:null"             # Should NOT be null
      
      # Array negations
      tools: "match:not:arrayLength:0"          # Array should NOT be empty
      items: "match:not:arrayContains:deleted"  # Should NOT contain "deleted"
      
      # Numeric negations
      errorRate: "match:not:greaterThan:5"      # Should NOT be > 5 (i.e., <= 5)
      score: "match:not:between:0:50"           # Should NOT be 0-50 (i.e., > 50)
`} />

            <H3 id="complex-negation-patterns">Complex Negation Patterns</H3>
            <CodeBlock language="yaml" code={`
# Advanced negation with field extraction and array patterns
expect:
  response:
    result:
      # Field extraction with negation
      tools:
        match:extractField: "*.name"
        value: "match:not:arrayContains:deprecated_tool"  # No deprecated tools
      
      # Array elements with negation
      tools:
        match:arrayElements:
          name: "match:not:startsWith:invalid_"     # No invalid tool names
          status: "match:not:contains:disabled"     # No disabled tools
          description: "match:not:type:null"        # All must have descriptions
      
      # Partial matching with negation
      config:
        match:partial:
          debug: "match:not:type:boolean"           # Debug should not be boolean
          logLevel: "match:not:contains:TRACE"      # Should not contain TRACE
`} />

            <H3 id="negation-production-examples">Production Negation Examples</H3>
            <CodeBlock language="yaml" code={`
# Real-world examples from MCP Aegis test suite
- it: "should ensure API response contains no error indicators"
  request:
    jsonrpc: "2.0"
    id: "error-check"
    method: "tools/call"
    params:
      name: "process_data"
      arguments:
        input: "valid-data.json"
  expect:
    response:
      jsonrpc: "2.0"
      id: "error-check"
      result:
        status: "match:not:contains:error"          # No error in status
        warnings: "match:not:arrayLength:0"         # Should have warnings array but not necessarily empty
        output: "match:not:type:null"               # Output should exist
        processingTime: "match:not:greaterThan:5000" # Should not take > 5 seconds
      stderr: "match:not:contains:Exception"        # No exceptions in stderr
`} />

            <H2 id="case-insensitive-patterns">Case-Insensitive Patterns</H2>
            <p>Case-insensitive patterns allow flexible string matching regardless of capitalization, perfect for handling user input, API responses with varying case, or cross-platform compatibility.</p>

            <H3 id="case-insensitive-contains">Case-Insensitive Contains</H3>
            <p>Use <InlineCode>"match:containsIgnoreCase:TEXT"</InlineCode> to check if a string contains a substring, ignoring case differences.</p>
            <CodeBlock language="yaml" code={`
# Match regardless of case
expect:
  response:
    result:
      message: "match:containsIgnoreCase:success"   # Matches "Success", "SUCCESS", "success"
      status: "match:containsIgnoreCase:ok"         # Matches "OK", "Ok", "ok"  
      type: "match:containsIgnoreCase:json"         # Matches "JSON", "Json", "json"
      
      # Works with error messages too
      errorDetails: "match:containsIgnoreCase:not found"  # Matches various case combinations
`} />

            <H3 id="case-insensitive-equals">Case-Insensitive Equals</H3>
            <p>Use <InlineCode>"match:equalsIgnoreCase:TEXT"</InlineCode> for exact string matching while ignoring case.</p>
            <CodeBlock language="yaml" code={`
# Exact match ignoring case
expect:
  response:
    result:
      protocol: "match:equalsIgnoreCase:http"       # Matches "HTTP", "Http", "http"
      method: "match:equalsIgnoreCase:get"          # Matches "GET", "Get", "get"
      contentType: "match:equalsIgnoreCase:application/json"  # Case-insensitive MIME type
      
      # Boolean-like strings
      enabled: "match:equalsIgnoreCase:true"        # Matches "True", "TRUE", "true"
`} />

            <H3 id="case-insensitive-with-arrays">Case-Insensitive with Arrays</H3>
            <CodeBlock language="yaml" code={`
# Case-insensitive matching works with arrays too
expect:
  response:
    result:
      # Search within array elements
      tags: "match:containsIgnoreCase:important"    # Finds "IMPORTANT", "Important", etc.
      
      # Use with field extraction
      tools:
        match:extractField: "*.category"
        value: "match:containsIgnoreCase:utility"   # Case-insensitive category search
`} />

            <H3 id="case-insensitive-production-examples">Case-Insensitive Production Examples</H3>
            <CodeBlock language="yaml" code={`
# Example handling API responses with inconsistent casing
- it: "should handle API responses with varying case formats"
  request:
    jsonrpc: "2.0"
    id: "case-test"
    method: "tools/call"
    params:
      name: "fetch_api_data"
      arguments:
        endpoint: "https://api.example.com/status"
  expect:
    response:
      jsonrpc: "2.0"
      id: "case-test"
      result:
        # Handle different API response case formats
        status: "match:equalsIgnoreCase:active"      # "ACTIVE", "Active", "active"
        protocol: "match:containsIgnoreCase:https"    # Various HTTPS representations
        responseType: "match:containsIgnoreCase:json" # "JSON", "Json", "application/json"
        
        # Case-insensitive error detection
        errorMessage: "match:not:containsIgnoreCase:failed"  # No failure indicators
        warningLevel: "match:not:equalsIgnoreCase:critical"  # Not critical warnings
`} />

            <H2 id="utility-patterns">Utility Patterns</H2>
            <p>Additional utility patterns for specialized validation scenarios.</p>

            <H3 id="field-existence">Field Existence</H3>
            <p>Use <InlineCode>"match:exists"</InlineCode> to validate that a field exists (not null or undefined).</p>
            <CodeBlock language="yaml" code={`
# Validate field presence
expect:
  response:
    result:
      timestamp: "match:exists"           # Field must exist (not null/undefined)
      metadata: "match:exists"            # Object must exist
      optional: "match:exists"            # Even optional fields can be validated for existence
      
      # Combine with negation for optional fields
      debugInfo: "match:not:exists"       # Field should NOT exist in production
`} />

            <H3 id="object-property-counting">Object Property Counting</H3>
            <p>Use <InlineCode>"match:count:N"</InlineCode> to validate the number of properties in an object.</p>
            <CodeBlock language="yaml" code={`
# Validate object structure by property count
expect:
  response:
    result:
      metadata: "match:count:3"           # Object must have exactly 3 properties
      config: "match:count:5"             # Configuration object has 5 settings
      
      # Use with negation for flexible bounds
      optionalData: "match:not:count:0"   # Object should not be empty
`} />

            <H2 id="pattern-combinations">Pattern Combinations</H2>
            <p>Advanced techniques for combining multiple patterns in sophisticated test scenarios.</p>

            <H3 id="multi-level-validation">Multi-Level Validation</H3>
            <CodeBlock language="yaml" code={`
# Complex validation combining multiple pattern types
- it: "should validate complex API response with multiple patterns"
  request:
    jsonrpc: "2.0"
    id: "complex"
    method: "tools/call"
    params:
      name: "get_user_data"
      arguments:
        userId: "12345"
  expect:
    response:
      jsonrpc: "2.0"
      id: "complex"
      result:
        # Type validation first
        users: "match:type:array"
        
        # Then array-specific validation
        users: "match:not:arrayLength:0"            # Not empty
        
        # Field extraction with negation and case-insensitive matching
        users:
          match:extractField: "*.status"
          value: "match:not:containsIgnoreCase:inactive"  # No inactive users
        
        # Array elements with multiple pattern types  
        users:
          match:arrayElements:
            id: "match:type:string"                   # Type validation
            name: "match:not:contains:null"           # No null names
            email: "match:containsIgnoreCase:@"       # Valid email indicator
            createdAt: "match:greaterThan:0"          # Valid timestamp
            score: "match:between:0:100"              # Valid score range
            active: "match:equalsIgnoreCase:true"     # Active users only
            
        # Overall response validation
        totalCount: "match:greaterThanOrEqual:1"      # At least one user
        hasMore: "match:type:boolean"                 # Pagination indicator
        nextCursor: "match:not:type:null"             # Cursor should exist
`} />

            <H3 id="conditional-patterns">Conditional Pattern Strategies</H3>
            <CodeBlock language="yaml" code={`
# Strategy: Use separate tests for different scenarios rather than complex conditionals
- it: "should validate successful response format"
  request:
    # ... success case request
  expect:
    response:
      result:
        success: "match:equalsIgnoreCase:true"
        data: "match:type:object"
        error: "match:not:exists"                    # Error should not exist
        
- it: "should validate error response format"  
  request:
    # ... error case request  
  expect:
    response:
      result:
        success: "match:equalsIgnoreCase:false"
        data: "match:not:exists"                     # Data should not exist
        error: "match:type:object"
        error:
          code: "match:type:number"
          message: "match:type:string"
          details: "match:not:containsIgnoreCase:internal" # No internal error details
`} />

            <H2 id="best-practices">Best Practices for Advanced Patterns</H2>

            <H3 id="negation-best-practices">Pattern Negation Best Practices</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Be Specific</strong>: Use specific negations rather than broad ones</li>
                <li><strong>Test Both Sides</strong>: Create both positive and negative test cases</li>
                <li><strong>Clear Intent</strong>: Make test descriptions clear about what you're testing NOT to happen</li>
                <li><strong>Avoid Double Negatives</strong>: Don't negate negated patterns unnecessarily</li>
            </ul>

            <H3 id="case-insensitive-best-practices">Case-Insensitive Best Practices</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>API Consistency</strong>: Use case-insensitive patterns for external APIs</li>
                <li><strong>User Input</strong>: Always use case-insensitive for user-generated content</li>
                <li><strong>Configuration Values</strong>: Use for configuration that might vary in case</li>
                <li><strong>Cross-Platform</strong>: Essential for file paths and system responses</li>
            </ul>

            <H3 id="combination-best-practices">Pattern Combination Best Practices</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Layer Validation</strong>: Start with type validation, then specific patterns</li>
                <li><strong>Separate Concerns</strong>: Use multiple test cases rather than one complex test</li>
                <li><strong>Readable Tests</strong>: Keep individual pattern applications simple and clear</li>
                <li><strong>Performance</strong>: Consider the cost of complex pattern combinations</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Performance Consideration</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>Complex pattern combinations can be computationally expensive. For performance-critical tests, consider using simpler patterns or breaking complex validations into multiple focused test cases.</p>
                        </div>
                    </div>
                </div>
            </div>

            <H2 id="common-use-cases">Common Use Cases</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Security Testing</strong>: Ensure sensitive data doesn't appear in responses</li>
                <li><strong>Cross-Platform Compatibility</strong>: Handle varying case formats across systems</li>
                <li><strong>Error Detection</strong>: Validate absence of error indicators</li>
                <li><strong>API Contract Testing</strong>: Ensure responses don't contain deprecated fields</li>
                <li><strong>Data Quality</strong>: Validate data doesn't contain invalid or null values</li>
                <li><strong>Internationalization</strong>: Handle text in multiple languages and cases</li>
            </ul>
        </>
    );
};

export default AdvancedPatternsPage;
