import React from 'react';

interface ErrorDisplayProps {
  error: Error;
  errorInfo?: any;
  onReload: () => void;
  onClearError: () => void;
  onCopyError: () => void;
}

function ErrorDisplay({ error, errorInfo, onReload, onClearError, onCopyError }: ErrorDisplayProps) {
  // Check if this is the specific manifest error we're tracking
  const isManifestError = error?.message?.includes('static-loader-data-manifest-undefined') || 
                         error?.stack?.includes('static-loader-data-manifest-undefined') ||
                         (typeof window !== 'undefined' && window.location.pathname.includes('/yaml-testing')) ||
                         (typeof window !== 'undefined' && window.location.pathname.includes('/how-to-test'));

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-semibold text-red-800">
              {isManifestError ? '🚨 SSG Manifest Loading Error' : 'Application Error'}
            </h1>
            <p className="text-red-600">
              {isManifestError 
                ? 'SSG manifest file could not be loaded (static-loader-data-manifest-undefined.json)'
                : 'Something went wrong while rendering this page.'
              }
            </p>
          </div>
        </div>

        {isManifestError && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-medium text-orange-900 mb-2">🔍 Known Issue Details</h3>
            <p className="text-orange-800 text-sm mb-3">
              This is a known issue affecting specific pages (YAML Testing and How To Test) where the SSG (Static Site Generation) 
              tries to load a manifest file with "undefined" in the filename instead of the proper hash.
            </p>
            <div className="text-sm text-orange-700 space-y-1">
              <p><strong>Current Page:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Unknown'}</p>
              <p><strong>Expected:</strong> static-loader-data-manifest-[hash].json</p>
              <p><strong>Actual Request:</strong> static-loader-data-manifest-undefined.json</p>
              <p><strong>Status:</strong> Being investigated and fixed</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Error Details</h2>
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <p className="text-sm font-mono text-red-600 mb-2">
              <strong>Error:</strong> {error?.name || 'Unknown Error'}
            </p>
            <p className="text-sm font-mono text-red-600 mb-4">
              <strong>Message:</strong> {error?.message || 'No error message available'}
            </p>
            
            {error?.stack && (
              <details className="mb-4">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                  Stack Trace (click to expand)
                </summary>
                <pre className="mt-2 text-xs font-mono text-gray-600 bg-white p-3 rounded border overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}

            {errorInfo?.componentStack && (
              <details>
                <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                  Component Stack (click to expand)
                </summary>
                <pre className="mt-2 text-xs font-mono text-gray-600 bg-white p-3 rounded border overflow-auto max-h-40">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onReload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Reload Page
          </button>
          
          <button
            onClick={onClearError}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={onCopyError}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Copy Error Details
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">For Developers</h3>
          <p className="text-sm text-blue-700">
            Error details have been logged to the console and stored in sessionStorage. 
            Check the browser's developer tools for additional information.
          </p>
          {typeof window !== 'undefined' && (
            <p className="text-xs text-blue-600 mt-1">
              URL: {window.location.href}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple JavaScript-style error boundary
function createErrorBoundary() {
  // @ts-ignore - Skip TypeScript checks for this legacy component
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
      
      this.setState({ error, errorInfo });

      // Store error details for debugging
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('lastError', JSON.stringify({
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack
            },
            errorInfo,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          }, null, 2));
        } catch (e) {
          console.warn('Failed to store error in sessionStorage:', e);
        }
      }
    }

    handleReload = () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    };

    handleClearError = () => {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleCopyError = () => {
      const { error, errorInfo } = this.state;
      if (error) {
        const errorDetails = {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          },
          errorInfo,
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
          url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        };

        if (typeof window !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
            .then(() => alert('Error details copied to clipboard!'))
            .catch(() => {
              const textarea = document.createElement('textarea');
              textarea.value = JSON.stringify(errorDetails, null, 2);
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
              alert('Error details copied to clipboard!');
            });
        }
      }
    };

    render() {
      if (this.state.hasError) {
        if (this.props.fallback) {
          const FallbackComponent = this.props.fallback;
          return React.createElement(FallbackComponent, { 
            error: this.state.error, 
            errorInfo: this.state.errorInfo 
          });
        }

        return React.createElement(ErrorDisplay, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          onReload: this.handleReload,
          onClearError: this.handleClearError,
          onCopyError: this.handleCopyError
        });
      }

      return this.props.children;
    }
  };
}

const ErrorBoundary = createErrorBoundary();

export default ErrorBoundary;