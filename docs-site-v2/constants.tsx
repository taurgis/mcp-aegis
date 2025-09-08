import { NavGroup } from './types';

export const NAVIGATION_LINKS: NavGroup[] = [
  {
    title: 'GETTING STARTED',
    items: [
      { label: 'Introduction', path: '/' },
      { label: 'Why Test MCP Servers?', path: '/why-test-mcp' },
      { label: 'Installation', path: '/installation' },
      { label: 'Quick Start', path: '/quick-start' },
    ],
  },
  {
    title: 'GUIDES',
    items: [
      { label: 'YAML Testing', path: '/yaml-testing' },
      { label: 'Programmatic Testing', path: '/programmatic-testing' },
      { label: 'Examples', path: '/examples' },
      { label: 'AI Agent Testing', path: '/ai-agents' },
    ],
  },
  {
    title: 'PATTERN MATCHING',
    items: [
        { label: 'Overview', path: '/pattern-matching/overview' },
        { label: 'Basic Patterns', path: '/pattern-matching/basic' },
        { label: 'String Patterns', path: '/pattern-matching/string' },
        { label: 'Regex Patterns', path: '/pattern-matching/regex' },
        { label: 'Array Patterns', path: '/pattern-matching/array' },
        { label: 'Object & Field Patterns', path: '/pattern-matching/object-field' },
    ]
  },
  {
    title: 'API',
    items: [
      { label: 'API Reference', path: '/api-reference' },
      { label: 'Troubleshooting', path: '/troubleshooting' },
    ],
  },
  {
    title: 'CONTRIBUTING',
    items: [
      { label: 'Development Guide', path: '/development' },
    ]
  }
];