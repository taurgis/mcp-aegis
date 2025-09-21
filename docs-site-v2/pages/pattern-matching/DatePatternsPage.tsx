import React from 'react';
import CodeBlock, { InlineCode } from '../../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../../components/Typography';
import { Head } from 'vite-react-ssg';
import SEO from '../../components/SEO';
import BreadcrumbSchema from '../../components/BreadcrumbSchema';
import StructuredData from '../../components/StructuredData';
import { SITE_DATES } from '../../constants';

const DatePatternsPage: React.FC = () => {
    const datePatternsStructuredData = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Date Patterns - Pattern Matching - MCP Aegis",
        "description": "Comprehensive date and time validation patterns for MCP testing. Learn date validation, comparisons, age calculations, and format checking for Model Context Protocol servers.",
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
        "url": "https://aegis.rhino-inquisitor.com/pattern-matching/date/",
        "mainEntity": {
            "@type": "Guide",
            "name": "MCP Aegis Date Patterns Guide"
        }
    };


    return (
        <>
            <SEO 
                title="Date Patterns - Pattern Matching"
                description="Comprehensive date and time validation patterns for MCP testing. Learn date validation, comparisons, age calculations, and format checking for Model Context Protocol servers."
                keywords="MCP date patterns, date validation MCP, time validation, date comparison MCP, age calculation patterns, date format validation MCP"
                canonical="/pattern-matching/date/"
                ogType="article"
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "/" },
                { name: "Pattern Matching", url: "/pattern-matching/" },
                { name: "Date Patterns", url: "/pattern-matching/date/" }
            ]} />
            <StructuredData structuredData={datePatternsStructuredData} />

            <Head>
                <title>Date Patterns - MCP Aegis Pattern Matching</title>
            </Head>

            <H1 id="date-patterns">Date Patterns</H1>
            <PageSubtitle>Comprehensive date and timestamp validation patterns.</PageSubtitle>
            <p>MCP Aegis provides sophisticated date and timestamp pattern matching capabilities for validating temporal data in your MCP server responses. These patterns support various date formats, time ranges, age validation, and format checking.</p>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Flexible Date Input Formats</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>Date patterns automatically handle multiple input formats including ISO 8601 strings, Unix timestamps (numbers or strings), and common date formats like "6/15/2023" or "June 15, 2023".</p>
                        </div>
                    </div>
                </div>
            </div>

            <H2 id="date-validation">Date Validation</H2>
            <p>Use <InlineCode>dateValid</InlineCode> to verify that a value represents a valid date or timestamp.</p>

            <CodeBlock language="yaml" code={`
# Basic date validation
expect:
  response:
    result:
      createdAt: "match:dateValid"        # Must be a valid date/timestamp
      updatedAt: "match:dateValid"        # Supports various formats
      publishDate: "match:dateValid"      # ISO, timestamp, or date string
      
      # Negation - should NOT be valid dates
      invalidDate: "match:not:dateValid"  # Should be invalid
      nullDate: "match:not:dateValid"     # null values are invalid
`} />

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Supported Date Formats</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>ISO 8601:</strong> "2023-06-15T14:30:00.000Z", "2023-06-15"</li>
                                <li><strong>Unix Timestamps:</strong> 1687686600000 (number or string)</li>
                                <li><strong>Common Formats:</strong> "6/15/2023", "June 15, 2023"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <H2 id="date-comparisons">Date Comparisons</H2>
            <p>Compare dates against specific points in time using temporal comparison patterns.</p>

            <H3 id="date-after">Date After</H3>
            <CodeBlock language="yaml" code={`
# Validate dates are after a specific point
expect:
  response:
    result:
      createdAt: "match:dateAfter:2023-01-01"     # After Jan 1, 2023
      publishDate: "match:dateAfter:2023-06-15T14:30:00.000Z"  # After specific timestamp
      lastLogin: "match:dateAfter:1687686600000"   # After Unix timestamp
      
      # Can use with any supported date format
      eventTime: "match:dateAfter:6/1/2023"       # After June 1st, 2023
`} />

            <H3 id="date-before">Date Before</H3>
            <CodeBlock language="yaml" code={`
# Validate dates are before a specific point
expect:
  response:
    result:
      expireDate: "match:dateBefore:2025-01-01"   # Before Jan 1, 2025
      deadline: "match:dateBefore:2024-12-31T23:59:59.999Z"
      archiveDate: "match:dateBefore:1735689599999"  # Before Unix timestamp
`} />

            <H3 id="date-between">Date Between</H3>
            <CodeBlock language="yaml" code={`
# Validate dates fall within a range
expect:
  response:
    result:
      eventDate: "match:dateBetween:2023-01-01:2024-12-31"
      validPeriod: "match:dateBetween:2023-06-01T00:00:00Z:2023-06-30T23:59:59Z"
      campaignDates: "match:dateBetween:1687686600000:1719309999000"
      
      # Mix different date formats (both boundaries and value can use any format)
      promotionEnd: "match:dateBetween:6/1/2023:6/30/2023"
`} />

            <H2 id="date-age">Date Age Validation</H2>
            <p>Validate how recent or old dates are using the <InlineCode>dateAge</InlineCode> pattern with duration units.</p>

            <CodeBlock language="yaml" code={`
# Validate dates are within specific age limits
expect:
  response:
    result:
      # Recent timestamps
      currentActivity: "match:dateAge:1d"     # Within last day
      hourlyUpdate: "match:dateAge:2h"        # Within last 2 hours
      minuteCheck: "match:dateAge:30m"        # Within last 30 minutes
      secondCheck: "match:dateAge:45s"        # Within last 45 seconds
      millisCheck: "match:dateAge:1000ms"     # Within last 1000ms
      
      # Weekly/monthly validations
      weeklyReport: "match:dateAge:7d"        # Within last week
      monthlyBackup: "match:dateAge:30d"      # Within last 30 days
      
      # Negation - should NOT be recent
      oldArchive: "match:not:dateAge:1d"      # NOT within last day (older)
`} />

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Duration Units</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p><strong>Supported units:</strong> ms (milliseconds), s (seconds), m (minutes), h (hours), d (days)</p>
                            <p><strong>Examples:</strong> "1000ms", "30s", "5m", "2h", "7d"</p>
                        </div>
                    </div>
                </div>
            </div>

            <H2 id="exact-date-matching">Exact Date Matching</H2>
            <p>Match exact date and timestamp values using <InlineCode>dateEquals</InlineCode>.</p>

            <CodeBlock language="yaml" code={`
# Exact date matching
expect:
  response:
    result:
      # Fixed dates and timestamps
      fixedEvent: "match:dateEquals:2023-06-15T14:30:00.000Z"
      unixTimestamp: "match:dateEquals:1687686600000"
      dateString: "match:dateEquals:2023-06-15"
      
      # Can match across different formats
      # (both the expected and actual values are parsed before comparison)
      eventDate: "match:dateEquals:6/15/2023"     # Matches "2023-06-15"
      timestampStr: "match:dateEquals:1687686600" # Matches 1687686600000
`} />

            <H2 id="date-format-validation">Date Format Validation</H2>
            <p>Validate that date strings conform to specific formats using <InlineCode>dateFormat</InlineCode>.</p>

            <CodeBlock language="yaml" code={`
# Format-specific validation
expect:
  response:
    result:
      # ISO 8601 formats
      fullIso: "match:dateFormat:iso"         # "2023-06-15T14:30:00.000Z"
      dateOnly: "match:dateFormat:iso-date"   # "2023-06-15"
      timeOnly: "match:dateFormat:iso-time"   # "14:30:00.000"
      
      # Regional formats
      usFormat: "match:dateFormat:us-date"    # "6/15/2023" or "06/15/2023"
      euFormat: "match:dateFormat:eu-date"    # "15/6/2023" or "15/06/2023"
      
      # Numeric timestamps
      timestampStr: "match:dateFormat:timestamp"  # "1687686600000"
      
      # Negation - should NOT match format
      notIso: "match:not:dateFormat:iso"      # Should not be ISO format
`} />

            <H2 id="real-world-examples">Real-World Examples</H2>
            <p>Practical examples from production MCP server testing.</p>

            <CodeBlock language="yaml" code={`
# API response with mixed date formats
- it: "should validate API timestamps and dates"
  request:
    jsonrpc: "2.0"
    id: "api-dates"
    method: "tools/call"
    params:
      name: "get_user_activity"
      arguments:
        userId: "12345"
  expect:
    response:
      jsonrpc: "2.0"
      id: "api-dates"
      result:
        # Recent activity should be within reasonable time
        lastSeen: "match:dateAge:1d"
        lastLogin: "match:dateAge:30d"
        
        # Registration should be after service launch
        registeredAt: "match:dateAfter:2020-01-01"
        
        # Account shouldn't expire too soon
        expiresAt: "match:dateAfter:2024-12-31"
        
        # Validate specific date formats
        created: "match:dateFormat:iso"
        lastUpdate: "match:dateValid"
        
        # Ensure no invalid dates
        suspendedAt: "match:not:dateValid"  # Should be null/invalid

# File system timestamps
- it: "should validate file timestamps"
  request:
    jsonrpc: "2.0"
    id: "file-info"
    method: "tools/call"
    params:
      name: "get_file_info"
      arguments:
        path: "/data/logs/app.log"
  expect:
    response:
      result:
        # File should be recently modified
        lastModified: "match:dateAge:1d"
        
        # Creation time should be valid
        createdAt: "match:dateValid"
        
        # Access time should be recent
        lastAccessed: "match:dateAge:1h"
        
        # Backup timestamp should be older than 1 day
        lastBackup: "match:not:dateAge:1d"

# Event scheduling validation
- it: "should validate event scheduling"
  request:
    jsonrpc: "2.0"
    id: "schedule"
    method: "tools/call"
    params:
      name: "schedule_event"
      arguments:
        title: "Team Meeting"
        startTime: "2024-01-15T10:00:00Z"
  expect:
    response:
      result:
        # Event should be scheduled for future
        scheduledFor: "match:dateAfter:2023-12-31"
        
        # Should be within reasonable future range
        scheduledFor: "match:dateBefore:2025-12-31"
        
        # Combined: should be in 2024
        scheduledFor: "match:dateBetween:2024-01-01:2024-12-31"
        
        # Created timestamp should be very recent
        createdAt: "match:dateAge:1m"
        
        # Should have proper ISO format
        scheduledFor: "match:dateFormat:iso"
`} />

            <H2 id="best-practices">Best Practices</H2>
            <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Do</h4>
                    <ul className="text-green-700 space-y-1 text-sm">
                        <li>Use <InlineCode>dateValid</InlineCode> first to ensure you have valid dates</li>
                        <li>Use <InlineCode>dateAge</InlineCode> for testing recent timestamps</li>
                        <li>Use <InlineCode>dateFormat</InlineCode> when format consistency is important</li>
                        <li>Combine patterns with negation for comprehensive validation</li>
                        <li>Use reasonable time ranges for <InlineCode>dateAge</InlineCode> patterns</li>
                    </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Don't</h4>
                    <ul className="text-red-700 space-y-1 text-sm">
                        <li>Don't use very short age durations (like "1ms") in CI environments</li>
                        <li>Don't forget timezone considerations with exact date matching</li>
                        <li>Don't use <InlineCode>dateEquals</InlineCode> for dynamic timestamps</li>
                        <li>Don't assume all date strings will parse correctly</li>
                        <li>Don't use <InlineCode>dateAge</InlineCode> for fixed historical dates</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DatePatternsPage;
