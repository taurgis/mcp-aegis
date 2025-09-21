import React from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import Layout from './components/Layout';
import TopLevelErrorBoundary from './components/TopLevelErrorBoundary';
import HomePage from './pages/HomePage';
import WhyTestMCPPage from './pages/WhyTestMCPPage';
import InstallationPage from './pages/InstallationPage';
import QuickStartPage from './pages/QuickStartPage';
import YamlTestingPage from './pages/YamlTestingPage';
import ProgrammaticTestingPage from './pages/ProgrammaticTestingPage';
import PerformanceTestingPage from './pages/PerformanceTestingPage';
import ExamplesPage from './pages/ExamplesPage';
import HowToTest from './pages/HowToTest';
import TestingFundamentalsPage from './pages/TestingFundamentalsPage';
import ApiReferencePage from './pages/ApiReferencePage';
import TroubleshootingPage from './pages/TroubleshootingPage';
import ErrorReportingPage from './pages/ErrorReportingPage';
import DevelopmentPage from './pages/DevelopmentPage';
import AIAgentSupportPage from './pages/AIAgentSupportPage';
import TestErrorPage from './pages/TestErrorPage';

// Pattern Matching Pages
import PatternMatchingPage from './pages/PatternMatchingPage';
import BasicPatternsPage from './pages/pattern-matching/BasicPatternsPage';
import StringPatternsPage from './pages/pattern-matching/StringPatternsPage';
import RegexPatternsPage from './pages/pattern-matching/RegexPatternsPage';
import NumericPatternsPage from './pages/pattern-matching/NumericPatternsPage';
import ArrayPatternsPage from './pages/pattern-matching/ArrayPatternsPage';
import ObjectFieldPatternsPage from './pages/pattern-matching/ObjectFieldPatternsPage';
import CrossFieldPatternsPage from './pages/pattern-matching/CrossFieldPatternsPage';
import AdvancedPatternsPage from './pages/pattern-matching/AdvancedPatternsPage';
import DatePatternsPage from './pages/pattern-matching/DatePatternsPage';

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: (
      <TopLevelErrorBoundary>
        <Layout />
      </TopLevelErrorBoundary>
    ),
    entry: 'components/Layout.tsx',
    children: [
      {
        index: true,
        Component: () => <HomePage />,
        entry: 'pages/HomePage.tsx',
      },
      {
        path: 'why-test-mcp/',
        Component: () => <WhyTestMCPPage />,
        entry: 'pages/WhyTestMCPPage.tsx',
      },
      {
        path: 'installation/',
        Component: () => <InstallationPage />,
        entry: 'pages/InstallationPage.tsx',
      },
      {
        path: 'quick-start/',
        Component: () => <QuickStartPage />,
        entry: 'pages/QuickStartPage.tsx',
      },
      {
        path: 'yaml-testing/',
        Component: () => <YamlTestingPage />,
        entry: 'pages/YamlTestingPage.tsx',
      },
      {
        path: 'programmatic-testing/',
        Component: () => <ProgrammaticTestingPage />,
        entry: 'pages/ProgrammaticTestingPage.tsx',
      },
      {
        path: 'performance-testing/',
        Component: () => <PerformanceTestingPage />,
        entry: 'pages/PerformanceTestingPage.tsx',
      },
      {
        path: 'testing-fundamentals/',
        Component: () => <TestingFundamentalsPage />,
        entry: 'pages/TestingFundamentalsPage.tsx',
      },
      {
        path: 'pattern-matching/',
        Component: () => <PatternMatchingPage />,
        entry: 'pages/PatternMatchingPage.tsx',
      },
      {
        path: 'pattern-matching/overview/',
        Component: () => <PatternMatchingPage />,
        entry: 'pages/PatternMatchingPage.tsx',
      },
      {
        path: 'pattern-matching/basic/',
        Component: () => <BasicPatternsPage />,
        entry: 'pages/pattern-matching/BasicPatternsPage.tsx',
      },
      {
        path: 'pattern-matching/string/',
        Component: () => <StringPatternsPage />,
        entry: 'pages/pattern-matching/StringPatternsPage.tsx',
      },
      {
        path: 'pattern-matching/regex/',
        Component: () => <RegexPatternsPage />,
        entry: 'pages/pattern-matching/RegexPatternsPage.tsx',
      },
      {
        path: 'pattern-matching/numeric/',
        Component: () => <NumericPatternsPage />,
        entry: 'pages/pattern-matching/NumericPatternsPage.tsx',
      },
      {
        path: 'pattern-matching/date/',
        Component: () => <DatePatternsPage />,
        entry: 'pages/pattern-matching/DatePatternsPage.tsx',
      },
      {
        path: 'pattern-matching/array/',
        Component: () => <ArrayPatternsPage />,
        entry: 'pages/pattern-matching/ArrayPatternsPage.tsx',
      },
      {
        path: 'pattern-matching/object-field/',
        Component: () => <ObjectFieldPatternsPage />,
        entry: 'pages/pattern-matching/ObjectFieldPatternsPage.tsx',
      },
      {
        path: 'pattern-matching/cross-field/',
        Component: () => <CrossFieldPatternsPage />,
        entry: 'pages/pattern-matching/CrossFieldPatternsPage.tsx',
      },
      {
        path: 'pattern-matching/advanced/',
        Component: () => <AdvancedPatternsPage />,
        entry: 'pages/pattern-matching/AdvancedPatternsPage.tsx',
      },
      {
        path: 'examples/',
        Component: () => <ExamplesPage />,
        entry: 'pages/ExamplesPage.tsx',
      },
      {
        path: 'how-to-test/',
        Component: () => <HowToTest />,
        entry: 'pages/HowToTest.tsx',
      },
      {
        path: 'ai-agent-support/',
        Component: () => <AIAgentSupportPage />,
        entry: 'pages/AIAgentSupportPage.tsx',
      },
      {
        path: 'api-reference/',
        Component: () => <ApiReferencePage />,
        entry: 'pages/ApiReferencePage.tsx',
      },
      {
        path: 'troubleshooting/',
        Component: () => <TroubleshootingPage />,
        entry: 'pages/TroubleshootingPage.tsx',
      },
      {
        path: 'error-reporting/',
        Component: () => <ErrorReportingPage />,
        entry: 'pages/ErrorReportingPage.tsx',
      },
      {
        path: 'development/',
        Component: () => <DevelopmentPage />,
        entry: 'pages/DevelopmentPage.tsx',
      },
      {
        path: 'test-error/',
        Component: () => <TestErrorPage />,
        entry: 'pages/TestErrorPage.tsx',
      },
    ],
  },
];

export default routes;