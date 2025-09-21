import React from 'react';
import { Head } from 'vite-react-ssg';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { SITE_DATES } from '../constants';

const TestErrorPage: React.FC = () => {
  const testErrorStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Error Boundary Test - MCP Aegis",
    "description": "Test page for ErrorBoundary component functionality in MCP Aegis documentation site. Intentionally triggers errors to verify error handling capabilities.",
    "url": "https://aegis.rhino-inquisitor.com/test-error",
    "datePublished": SITE_DATES.PUBLISHED,
    "dateModified": SITE_DATES.MODIFIED,
    "mainEntity": {
      "@type": "Thing",
      "name": "ErrorBoundary Test Tool"
    }
  };

  // Intentionally throw an error for testing the ErrorBoundary
  const throwError = () => {
    throw new Error('This is a test error to verify the ErrorBoundary component is working correctly. This error includes detailed information about the component that failed: TestErrorPage.');
  };

  return (
    <>
      <SEO 
        title="Error Boundary Test"
        description="Test page for ErrorBoundary component functionality in MCP Aegis documentation site. Intentionally triggers errors to verify error handling capabilities."
        keywords="error boundary test, error handling, React error boundary, MCP Aegis testing"
        canonical="/test-error"
        robots="noindex, nofollow"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Error Test", url: "/test-error" }
      ]} />
      <StructuredData structuredData={testErrorStructuredData} />

      <Head>
        <title>Error Boundary Test - MCP Aegis</title>
      </Head>

      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Error Boundary Test</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Warning: This page contains test error functionality
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>This page is designed to test the ErrorBoundary component. When you click the button below, it will intentionally throw an error to demonstrate the error handling capabilities.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Test ErrorBoundary Component</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to trigger an intentional error. This will demonstrate how the ErrorBoundary component catches and displays errors with full debugging information.
          </p>
          
          <button
            onClick={throwError}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Trigger Test Error
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Expected Behavior</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>The error will be caught by the ErrorBoundary component</li>
            <li>A detailed error screen will be displayed with full error information</li>
            <li>The error details will include stack trace and component information</li>
            <li>You'll have options to reload the page, try again, or copy error details</li>
            <li>Error information will be stored in sessionStorage for debugging</li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Alternative Test</h3>
          <p className="text-gray-700 mb-3">
            You can also test the ErrorBoundary by opening the browser's developer tools and running:
          </p>
          <code className="bg-gray-800 text-green-400 p-2 rounded block font-mono text-sm">
            throw new Error('Manual test error');
          </code>
        </div>
      </div>
    </div>
    </>
  );
};

export default TestErrorPage;