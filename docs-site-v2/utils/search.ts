
import { GENERATED_SEARCH_INDEX, SearchableItem } from '../src/generated-search-index';

export interface SearchResult {
  path: string;
  pageTitle: string;
  heading: string;
  headingId?: string;
  snippet: string;
  // FIX: Add optional score property to be used for ranking search results.
  score?: number;
}

// Fallback search index (manually maintained for development/emergency use)
const FALLBACK_SEARCH_INDEX: SearchableItem[] = [
  // HomePage
  { path: '/', pageTitle: 'Introduction', heading: 'MCP Conductor', content: 'The Complete Model Context Protocol Testing Solution. A powerful Node.js testing library that provides both YAML-based declarative testing and programmatic testing for MCP servers.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Quick Start', content: 'Get up and running with MCP Conductor in minutes. Install globally, then initialize in your MCP project.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Key Features', content: 'Declarative Testing, Automatic Protocol Handling, Advanced Pattern Matching, Rich Reporting, Programmatic API, Framework Integration.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Why Choose MCP Conductor?', content: 'The industry standard for MCP testing. Complete Protocol Coverage, Dual Testing Approaches, Production Ready, Developer Friendly.' },

  // InstallationPage
  { path: '/installation', pageTitle: 'Installation', heading: 'Installation Guide', content: 'Get MCP Conductor Running in Minutes. This guide covers global and local installation.' },
  { path: '/installation', pageTitle: 'Installation', heading: 'Prerequisites', content: 'Node.js Version 18 or higher, npm Version 8 or higher.' },
  { path: '/installation', pageTitle: 'Installation', heading: 'Quick Project Setup', content: 'The fastest way to get started is with `npx mcp-conductor init` in your project directory.' },

  // QuickStartPage
  { path: '/quick-start', pageTitle: 'Quick Start', heading: 'Quick Start Guide', content: 'MCP Testing in 5 Minutes. This guide covers both a recommended quick setup and a manual setup.' },
  { path: '/quick-start', pageTitle: 'Quick Start', heading: 'Create a Simple MCP Server', content: 'A basic MCP server example in JavaScript to test against.' },
  { path: '/quick-start', pageTitle: 'Quick Start', heading: 'Write Your First Test', content: 'Example of a demo.test.mcp.yml file to test tool listing and execution.' },

  // YamlTestingPage
  { path: '/yaml-testing', pageTitle: 'YAML Testing', heading: 'YAML Testing Guide', content: 'Declarative Model Context Protocol Testing using simple YAML files.' },
  { path: '/yaml-testing', pageTitle: 'YAML Testing', heading: 'CLI Options', content: 'Run tests with flags like --verbose, --debug, --timing, --json for different outputs.' },
  { path: '/yaml-testing', pageTitle: 'YAML Testing', heading: 'Test File Structure', content: 'YAML files have a `description` and a list of `tests`. Each test has an `it`, `request`, and `expect` block.' },

  // ProgrammaticTestingPage
  { path: '/programmatic-testing', pageTitle: 'Programmatic Testing', heading: 'Programmatic Testing API', content: 'Use the JavaScript/TypeScript API for complex validation and integration with test frameworks like Jest or Mocha.' },
  { path: '/programmatic-testing', pageTitle: 'Programmatic Testing', heading: 'Getting Started', content: 'Use `createClient` or `connect` from `mcp-conductor` to start a testing session.' },
  { path: '/programmatic-testing', pageTitle: 'Programmatic Testing', heading: 'MCPClient Class', content: 'Core methods include connect, disconnect, listTools, and callTool.' },

  // Pattern Matching Pages
  { path: '/pattern-matching/overview', pageTitle: 'Pattern Matching', heading: 'Overview', content: 'Advanced MCP Server Validation Patterns. Patterns allow validation without needing to match exact, brittle values.' },
  { path: '/pattern-matching/basic', pageTitle: 'Basic Patterns', heading: 'Deep Equality', content: 'If you dont specify a pattern, MCP Conductor performs a deep equality check.' },
  { path: '/pattern-matching/basic', pageTitle: 'Basic Patterns', heading: 'Type Validation', content: 'Use `match:type:string` to check the data type but not the specific value.' },
  { path: '/pattern-matching/string', pageTitle: 'String Patterns', heading: 'match:contains', content: 'Checks if the actual string contains the specified substring.' },
  { path: '/pattern-matching/array', pageTitle: 'Array Patterns', heading: 'match:arrayLength', content: 'Validates that an array has an exact number of elements.' },
];

// Use generated index if available, otherwise fall back to manual index
const getSearchIndex = (): SearchableItem[] => {
  try {
    // Check if the generated index has meaningful content
    if (GENERATED_SEARCH_INDEX.length > 1 || 
        (GENERATED_SEARCH_INDEX.length === 1 && 
         GENERATED_SEARCH_INDEX[0].content !== 'The Complete Model Context Protocol Testing Solution.')) {
      return GENERATED_SEARCH_INDEX;
    }
  } catch (error) {
    console.warn('Failed to load generated search index, using fallback:', error);
  }
  
  return FALLBACK_SEARCH_INDEX;
};

// Manually populated search index from all documentation pages
const SEARCH_INDEX: SearchableItem[] = [
  // HomePage
  { path: '/', pageTitle: 'Introduction', heading: 'MCP Conductor', content: 'The Complete Model Context Protocol Testing Solution. A powerful Node.js testing library that provides both YAML-based declarative testing and programmatic testing for MCP servers.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Quick Start', content: 'Get up and running with MCP Conductor in minutes. Install globally, then initialize in your MCP project.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Key Features', content: 'Declarative Testing, Automatic Protocol Handling, Advanced Pattern Matching, Rich Reporting, Programmatic API, Framework Integration.' },
  { path: '/', pageTitle: 'Introduction', heading: 'Why Choose MCP Conductor?', content: 'The industry standard for MCP testing. Complete Protocol Coverage, Dual Testing Approaches, Production Ready, Developer Friendly.' },

  // InstallationPage
  { path: '/installation', pageTitle: 'Installation', heading: 'Installation Guide', content: 'Get MCP Conductor Running in Minutes. This guide covers global and local installation.' },
  { path: '/installation', pageTitle: 'Installation', heading: 'Prerequisites', content: 'Node.js Version 18 or higher, npm Version 8 or higher.' },
  { path: '/installation', pageTitle: 'Installation', heading: 'Quick Project Setup', content: 'The fastest way to get started is with `npx mcp-conductor init` in your project directory.' },

  // QuickStartPage
  { path: '/quick-start', pageTitle: 'Quick Start', heading: 'Quick Start Guide', content: 'MCP Testing in 5 Minutes. This guide covers both a recommended quick setup and a manual setup.' },
  { path: '/quick-start', pageTitle: 'Quick Start', heading: 'Create a Simple MCP Server', content: 'A basic MCP server example in JavaScript to test against.' },
  { path: '/quick-start', pageTitle: 'Quick Start', heading: 'Write Your First Test', content: 'Example of a demo.test.mcp.yml file to test tool listing and execution.' },

  // YamlTestingPage
  { path: '/yaml-testing', pageTitle: 'YAML Testing', heading: 'YAML Testing Guide', content: 'Declarative Model Context Protocol Testing using simple YAML files.' },
  { path: '/yaml-testing', pageTitle: 'YAML Testing', heading: 'CLI Options', content: 'Run tests with flags like --verbose, --debug, --timing, --json for different outputs.' },
  { path: '/yaml-testing', pageTitle: 'YAML Testing', heading: 'Test File Structure', content: 'YAML files have a `description` and a list of `tests`. Each test has an `it`, `request`, and `expect` block.' },

  // ProgrammaticTestingPage
  { path: '/programmatic-testing', pageTitle: 'Programmatic Testing', heading: 'Programmatic Testing API', content: 'Use the JavaScript/TypeScript API for complex validation and integration with test frameworks like Jest or Mocha.' },
  { path: '/programmatic-testing', pageTitle: 'Programmatic Testing', heading: 'Getting Started', content: 'Use `createClient` or `connect` from `mcp-conductor` to start a testing session.' },
  { path: '/programmatic-testing', pageTitle: 'Programmatic Testing', heading: 'MCPClient Class', content: 'Core methods include connect, disconnect, listTools, and callTool.' },

  // ExamplesPage
  { path: '/examples', pageTitle: 'Examples', heading: 'Filesystem Server Example', content: 'A complete example demonstrating file operation testing using both YAML and programmatic approaches.' },
  { path: '/examples', pageTitle: 'Examples', heading: 'Multi-Tool Server', content: 'Comprehensive server with multiple tools demonstrating various testing scenarios.' },

  // AIAgentsPage
  { path: '/ai-agents', pageTitle: 'AI Agent Testing', heading: 'AI Agent Testing Guide', content: 'Specialized testing patterns for servers that power AI agents and LLM tools.' },
  { path: '/ai-agents', pageTitle: 'AI Agent Testing', heading: 'Tool Testing Patterns', content: 'How to validate tool discovery and schema for AI agents.' },
  { path: '/ai-agents', pageTitle: 'AI Agent Testing', heading: 'Agent Behavior Validation', content: 'Testing multi-step tool sequences and complex agent workflows.' },

  // ApiReferencePage
  { path: '/api-reference', pageTitle: 'API Reference', heading: 'CLI Commands', content: 'Reference for the `init` command and test execution flags.' },
  { path: '/api-reference', pageTitle: 'API Reference', heading: 'Main Entry Points (Programmatic)', content: 'Documentation for `createClient` and `connect` functions.' },
  { path: '/api-reference', pageTitle: 'API Reference', heading: 'MCPClient Class', content: 'Details on the properties and methods of the programmatic client.' },

  // TroubleshootingPage
  { path: '/troubleshooting', pageTitle: 'Troubleshooting', heading: 'Connection Problems', content: 'Solutions for when the server fails to start or times out.' },
  { path: '/troubleshooting', pageTitle: 'Troubleshooting', heading: 'Test Failures', content: 'How to debug pattern matching failures and JSON-RPC format errors.' },
  { path: '/troubleshooting', pageTitle: 'Troubleshooting', heading: 'Debugging Tips', content: 'Use --verbose and --debug flags for more insight into test failures.' },

  // DevelopmentPage
  { path: '/development', pageTitle: 'Development Guide', heading: 'Contributing to MCP Conductor', content: 'Learn the project architecture, development setup, and contribution guidelines.' },
  { path: '/development', pageTitle: 'Development Guide', heading: 'Project Architecture', content: 'Overview of the `bin`, `src`, and `test` directories.' },
  { path: '/development', pageTitle: 'Development Guide', heading: 'Commit Convention', content: 'Follow the conventional commits format: type(scope): description.' },

  // Pattern Matching Pages
  { path: '/pattern-matching/overview', pageTitle: 'Pattern Matching', heading: 'Overview', content: 'Advanced MCP Server Validation Patterns. Patterns allow validation without needing to match exact, brittle values.' },
  { path: '/pattern-matching/basic', pageTitle: 'Basic Patterns', heading: 'Deep Equality', content: 'If you dont specify a pattern, MCP Conductor performs a deep equality check.' },
  { path: '/pattern-matching/basic', pageTitle: 'Basic Patterns', heading: 'Type Validation', content: 'Use `match:type:string` to check the data type but not the specific value.' },
  { path: '/pattern-matching/basic', pageTitle: 'Basic Patterns', heading: 'Field Existence', content: 'Use `match:exists` to ensure a field is present in the response.' },
  { path: '/pattern-matching/string', pageTitle: 'String Patterns', heading: 'match:contains', content: 'Checks if the actual string contains the specified substring.' },
  { path: '/pattern-matching/string', pageTitle: 'String Patterns', heading: 'match:startsWith', content: 'Checks if the actual string starts with the specified prefix.' },
  { path: '/pattern-matching/string', pageTitle: 'String Patterns', heading: 'match:endsWith', content: 'Checks if the actual string ends with the specified suffix.' },
  { path: '/pattern-matching/regex', pageTitle: 'Regex Patterns', heading: 'Regular Expression Patterns', content: 'For complex string validation, use `match:regex:your_pattern`. Remember to escape backslashes in YAML.' },
  { path: '/pattern-matching/array', pageTitle: 'Array Patterns', heading: 'match:arrayLength', content: 'Validates that an array has an exact number of elements.' },
  { path: '/pattern-matching/array', pageTitle: 'Array Patterns', heading: 'match:arrayElements', content: 'Validates that every element in an array matches a given structure.' },
  { path: '/pattern-matching/array', pageTitle: 'Array Patterns', heading: 'match:arrayContains', content: 'Checks if an array contains a specific value.' },
  { path: '/pattern-matching/object-field', pageTitle: 'Object & Field Patterns', heading: 'match:partial', content: 'Validates only the fields you specify within an object, ignoring any other fields.' },
  { path: '/pattern-matching/object-field', pageTitle: 'Object & Field Patterns', heading: 'match:extractField', content: 'Extracts a value from a nested path within the response for validation. Use * as a wildcard.' },
  { path: '/pattern-matching/object-field', pageTitle: 'Object & Field Patterns', heading: 'match:count', content: 'A utility pattern that counts the number of properties in an object or elements in an array.' },
];

const createSnippet = (text: string, query: string): string => {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);
    
    if (index === -1) {
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);

    let snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
};

export function searchDocs(query: string): SearchResult[] {
  if (!query) return [];
  
  const queryLower = query.toLowerCase();
  const searchIndex = getSearchIndex();
  const results: SearchResult[] = [];

  searchIndex.forEach(item => {
    const contentLower = item.content.toLowerCase();
    const headingLower = item.heading.toLowerCase();
    const titleLower = item.pageTitle.toLowerCase();

    let score = 0;
    if (titleLower.includes(queryLower)) score += 5;
    if (headingLower.includes(queryLower)) score += 3;
    if (contentLower.includes(queryLower)) score += 1;

    if (score > 0) {
      results.push({
        path: item.path,
        pageTitle: item.pageTitle,
        heading: item.heading,
        headingId: item.headingId,
        snippet: createSnippet(item.content, query),
        score: score,
      });
    }
  });

  // Remove duplicates by path and heading, keeping the one with the highest score
  const uniqueResults = Array.from(
      // FIX: Ensure correct typing for the Map in the reduce operation and safely compare scores using nullish coalescing.
      results.reduce((map, item) => {
          const key = `${item.path}-${item.heading}`;
          if (!map.has(key) || (map.get(key)?.score ?? 0) < (item.score ?? 0)) {
              map.set(key, item);
          }
          return map;
      }, new Map<string, SearchResult>()).values()
  );

  // FIX: Safely handle potentially undefined scores in the sort function.
  return uniqueResults
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 10);
}
