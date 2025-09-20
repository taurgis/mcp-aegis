
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { TocItem } from '../types';

interface OnThisPageProps {
  items: TocItem[];
}

const OnThisPage: React.FC<OnThisPageProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set client flag after hydration to prevent SSR mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset active ID when location changes
  useEffect(() => {
    setActiveId('');
  }, [location.pathname]);

  // Function to find and observe elements with retry logic
  const setupObserver = useCallback((itemsToObserve: TocItem[], retryCount = 0) => {
    if (items.length === 0 || !isClient) {
      setActiveId('');
      return;
    }

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.id);
        
        if (visibleHeadings.length > 0) {
          // Set the first visible heading as active
          setActiveId(visibleHeadings[0]);
        }
      },
      {
        rootMargin: '-20px 0px -80% 0px',
        threshold: 0
      }
    );

    let observedCount = 0;
    let elementsFound = 0;

    // Try to observe all headings
    itemsToObserve.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
        observedCount++;
        elementsFound++;
      }
    });

    // If we didn't find all elements and haven't retried too many times, retry
    if (elementsFound < itemsToObserve.length && retryCount < 5) {
      // Clean up current observer since we'll retry
      observer.disconnect();
      
      // Retry with exponential backoff
      const delay = Math.min(100 * Math.pow(2, retryCount), 1000);
      retryTimeoutRef.current = setTimeout(() => {
        setupObserver(itemsToObserve, retryCount + 1);
      }, delay);
      return;
    }

    // Store observer reference for cleanup
    observerRef.current = observer;

    // If we found some elements but not all, set up a mutation observer
    // to watch for the missing elements being added to the DOM
    if (elementsFound > 0 && elementsFound < itemsToObserve.length) {
      const missingItems = itemsToObserve.filter(item => !document.getElementById(item.id));
      
      if (missingItems.length > 0) {
        const mutationObserver = new MutationObserver((mutations) => {
          let shouldCheck = false;
          mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              shouldCheck = true;
            }
          });
          
          if (shouldCheck) {
            const nowFoundItems = missingItems.filter(item => document.getElementById(item.id));
            if (nowFoundItems.length > 0) {
              // Some missing elements were found, restart the observer
              mutationObserver.disconnect();
              setupObserver(itemsToObserve, 0);
            }
          }
        });
        
        // Observe the main content area for new elements
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mutationObserver.observe(mainContent, {
            childList: true,
            subtree: true
          });
          
          // Clean up mutation observer after a reasonable timeout
          setTimeout(() => {
            mutationObserver.disconnect();
          }, 5000);
        }
      }
    }
  }, [items, isClient]);

  useEffect(() => {
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Add a small delay to ensure DOM is ready, especially on SSG first load
    const setupTimeout = setTimeout(() => {
      setupObserver(items);
    }, isClient ? 50 : 200); // Longer delay on first client-side load

    return () => {
      clearTimeout(setupTimeout);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items, location.pathname, setupObserver]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pt-12">
      <h2 className="text-sm font-bold text-slate-800 mb-4">On this page</h2>
      <div className="max-h-96 overflow-y-auto">
        <ul className="space-y-2 text-sm">
          {items.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block transition-colors ${
                  activeId === item.id
                    ? 'text-blue-600 font-medium border-l-2 border-blue-600 pl-2 -ml-2'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OnThisPage;
