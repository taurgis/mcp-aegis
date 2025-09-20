
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
        // Flag to track if we've had hydration issues
        let hydrationErrorDetected = false;
        
        // Add comprehensive error handling for SSG-related issues
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
          const url = args[0];
          
          // Log all manifest-related fetch requests for debugging
          if (typeof url === 'string' && url.includes('static-loader-data-manifest')) {
            console.log('🔍 Manifest fetch request:', url);
          }
          
          // Intercept manifest fetch requests with undefined
          if (typeof url === 'string' && url.includes('static-loader-data-manifest-undefined')) {
            console.warn('🚨 Intercepted undefined manifest request:', url);
            console.warn('📍 Current location:', window.location.href);
            console.warn('📁 Available manifests in dist should include proper hash');
            
            // Return empty response to prevent crash
            return Promise.resolve(new Response('{}', {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
          
          return originalFetch.apply(this, args).catch(error => {
            // Log fetch errors for debugging
            if (typeof url === 'string' && url.includes('static-loader-data-manifest')) {
              console.error('🚨 Manifest fetch failed:', url, error);
            }
            throw error;
          });
        };
        
        // Function to reload the page for client-side rendering
        const reloadForClientSideRendering = () => {
          // Check if we're in a browser environment and have sessionStorage
          if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
            console.warn('⚠️ Not in browser environment, cannot reload');
            return;
          }
          
          // Check if we've already tried reloading to prevent infinite loops
          const hasReloaded = sessionStorage.getItem('hydration-error-reload');
          
          if (!hasReloaded) {
            console.log('🔄 Hydration error detected, reloading for client-side rendering');
            sessionStorage.setItem('hydration-error-reload', 'true');
            
            // Reload the page to start fresh with client-side rendering
            window.location.reload();
          } else {
            console.warn('⚠️ Already reloaded once for hydration error, not reloading again');
            // Clear the flag after some time in case it's a different session
            setTimeout(() => {
              if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('hydration-error-reload');
              }
            }, 5000);
          }
        };
        
        // Add comprehensive error event handling
        window.addEventListener('error', (event) => {
          console.log('🚨 Global error event:', event);
          
          // Handle manifest loading issues
          if (event.message && event.message.includes('static-loader-data-manifest-undefined')) {
            console.warn('🎯 SSG manifest loading issue detected');
            console.warn('📍 Current page:', window.location.pathname);
            console.warn('🔧 Preventing default error handling');
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          
          // Handle React error #418 (hydration issues) - reload for client-side rendering
          if (event.message && event.message.includes('Minified React error #418')) {
            console.warn('🎯 React hydration error detected (Error #418)');
            console.warn('📍 Current page:', window.location.pathname);
            console.warn('� Reloading page for client-side rendering');
            console.warn('💡 This is often caused by SSG/hydration mismatches');
            
            if (!hydrationErrorDetected) {
              hydrationErrorDetected = true;
              
              // Prevent the error from propagating
              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();
              
              // Reload for client-side rendering
              reloadForClientSideRendering();
            }
            return;
          }
          
          // Handle other SSG-related errors but allow rendering to continue
          if (event.error && (
            event.error.stack?.includes('vite-react-ssg') ||
            event.error.message?.includes('loader') ||
            event.error.message?.includes('manifest') ||
            event.error.message?.includes('hydration')
          )) {
            console.warn('🎯 SSG-related error detected:', event.error);
            console.warn('🔧 Preventing crash, allowing page to continue rendering');
            event.preventDefault();
            event.stopPropagation();
            return;
          }
        });
        
        // Also handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
          console.log('🚨 Unhandled promise rejection:', event);
          
          // Handle manifest-related promise rejections
          if (event.reason && event.reason.message && 
              (event.reason.message.includes('static-loader-data-manifest-undefined') ||
               event.reason.message.includes('manifest') ||
               event.reason.message.includes('loader'))) {
            console.warn('🎯 Manifest-related promise rejection handled');
            console.warn('🔧 Preventing crash, allowing page to continue');
            event.preventDefault();
            return;
          }
          
          // Handle React hydration-related rejections
          if (event.reason && event.reason.message && 
              (event.reason.message.includes('hydration') ||
               event.reason.message.includes('418'))) {
            console.warn('🎯 React hydration promise rejection handled');
            event.preventDefault();
            return;
          }
        });
        
        // Clear the reload flag if we successfully loaded without issues
        // This happens after a short delay to ensure hydration has had time to complete
        setTimeout(() => {
          if (!hydrationErrorDetected && typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem('hydration-error-reload');
            console.log('✅ Page loaded successfully, cleared reload flag');
          }
        }, 2000);
      }
    } catch (error) {
      console.error('SSG Setup Error:', error);
    }
  },
);
