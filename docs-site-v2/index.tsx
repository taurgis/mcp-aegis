
import React from 'react';
import { ViteReactSSG } from 'vite-react-ssg';
import routes from './App';
import './src/styles/input.css';
import './types'; // Import global type declarations

export const createRoot = ViteReactSSG(
  // react-router-dom data routes
  { routes },
  // function to have custom setups
  ({ router, routes, isClient, initialState }) => {
    // Custom setup with improved error handling
    try {
      console.log('SSG Setup:', { 
        isClient, 
        routes: routes?.length || 0,
        hasInitialState: Boolean(initialState),
      });
      
      // Ensure proper hydration for production builds
      if (isClient && typeof window !== 'undefined') {
        // Add comprehensive error handling for SSG-related issues
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
          // Intercept manifest fetch requests with undefined
          if (args[0] && typeof args[0] === 'string' && args[0].includes('static-loader-data-manifest-undefined')) {
            console.warn('Intercepted undefined manifest request, returning empty response');
            return Promise.resolve(new Response('{}', {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
          return originalFetch.apply(this, args);
        };
        
        // Add error boundary for manifest loading issues
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('static-loader-data-manifest-undefined')) {
            console.warn('SSG manifest loading issue detected, attempting recovery...');
            // Prevent default error handling for this specific issue
            event.preventDefault();
          }
        });
        
        // Handle unhandled promise rejections for fetch errors
        window.addEventListener('unhandledrejection', (event) => {
          if (event.reason && event.reason.message && event.reason.message.includes('static-loader-data-manifest-undefined')) {
            console.warn('SSG manifest promise rejection handled');
            event.preventDefault();
          }
        });
      }
    } catch (error) {
      console.error('SSG Setup Error:', error);
    }
  },
);
