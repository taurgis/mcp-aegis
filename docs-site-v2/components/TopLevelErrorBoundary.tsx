import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class TopLevelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Top-Level ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if this is a React hydration error (#418) - these are often recoverable
    const isHydrationError = error.message?.includes('418') || 
                            error.message?.includes('hydration') ||
                            error.message?.includes('Minified React error #418');
    
    if (isHydrationError) {
      console.warn('🎯 Hydration error detected in ErrorBoundary');
      console.warn('💡 Attempting automatic recovery...');
      
      // For hydration errors, try to recover after a short delay
      setTimeout(() => {
        console.log('🔄 Attempting ErrorBoundary recovery for hydration issue');
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null
        });
      }, 100);
    }
    
    this.setState({ error, errorInfo });

    // Store comprehensive error details for debugging
    if (typeof window !== 'undefined') {
      try {
        const errorDetails = {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack
          },
          errorInfo,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          pathname: window.location.pathname,
          isManifestError: error.message?.includes('static-loader-data-manifest-undefined') || error.stack?.includes('static-loader-data-manifest-undefined'),
          isSSGError: error.stack?.includes('vite-react-ssg') || error.stack?.includes('SSG'),
          isHydrationError,
        };

        sessionStorage.setItem('topLevelError', JSON.stringify(errorDetails, null, 2));
        console.group('🚨 Top-Level Error Details');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Full Details:', errorDetails);
        console.groupEnd();
      } catch (e) {
        console.warn('Failed to store error in sessionStorage:', e);
      }
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const isManifestError = this.state.error.message?.includes('static-loader-data-manifest-undefined') || 
                             this.state.error.stack?.includes('static-loader-data-manifest-undefined');
      
      const isSSGError = this.state.error.stack?.includes('vite-react-ssg') || 
                        this.state.error.stack?.includes('SSG');

      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🚨</span>
              </div>
              <h1 className="text-2xl font-bold text-red-900 mb-2">
                {isManifestError ? 'SSG Manifest Loading Error' : 'Application Error'}
              </h1>
              <p className="text-red-700">
                {isManifestError 
                  ? 'A known issue with Static Site Generation manifest loading has occurred'
                  : 'An unexpected error occurred in the application'
                }
              </p>
            </div>

            {/* Error Type Indicators */}
            <div className="mb-6 space-y-2">
              {isManifestError && (
                <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
                  <p className="text-orange-800 text-sm">
                    <strong>🎯 Detected Issue:</strong> static-loader-data-manifest-undefined.json (Known SSG bug)
                  </p>
                </div>
              )}
              {isSSGError && (
                <div className="p-3 bg-purple-100 border border-purple-300 rounded-lg">
                  <p className="text-purple-800 text-sm">
                    <strong>⚙️ SSG Related:</strong> This error originated from the Static Site Generation system
                  </p>
                </div>
              )}
            </div>

            {/* Current Page Info */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">📍 Current Context</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Page:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Unknown'}</p>
                <p><strong>Time:</strong> {new Date().toISOString()}</p>
                <p><strong>Error Type:</strong> {this.state.error.name}</p>
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">📋 Error Message</h3>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-mono text-red-800 break-words">
                  {this.state.error.message}
                </p>
              </div>
            </div>

            {/* Detailed Error Info (Expandable) */}
            <details className="mb-6">
              <summary className="cursor-pointer text-gray-700 font-medium hover:text-gray-900">
                🔍 Technical Details (Click to expand)
              </summary>
              <div className="mt-3 space-y-3">
                {this.state.error.stack && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Stack Trace:</h4>
                    <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">React Component Stack:</h4>
                    <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🔃 Reload Page
              </button>
              <a
                href="/"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-block"
              >
                🏠 Go Home
              </a>
            </div>

            {/* Additional Help */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">💡 What to try:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Clear your browser cache and cookies</li>
                <li>Try refreshing the page</li>
                <li>Navigate to a different page and come back</li>
                <li>Try accessing the site in an incognito/private window</li>
                {isManifestError && <li>This is a known issue affecting specific pages that is being fixed</li>}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TopLevelErrorBoundary;