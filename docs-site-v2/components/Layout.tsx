
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import OnThisPage from './OnThisPage';
import { TocItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const location = useLocation();

  // Scroll restoration - scroll to top on route change or to specific element if hash is present
  useEffect(() => {
    const scrollToTarget = () => {
      if (location.hash) {
        // If there's a hash fragment, try to scroll to that element
        const targetId = location.hash.substring(1); // Remove the # symbol
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Use multiple attempts with increasing delays to ensure DOM is ready
          const attemptScroll = (attempt = 0) => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            } else if (attempt < 5) {
              // Retry up to 5 times with increasing delay
              setTimeout(() => attemptScroll(attempt + 1), (attempt + 1) * 100);
            }
          };
          
          // Initial attempt with small delay
          setTimeout(() => attemptScroll(), 100);
        } else {
          // Element not found immediately, try again after content loads
          setTimeout(() => {
            const retryElement = document.getElementById(targetId);
            if (retryElement) {
              retryElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            }
          }, 500);
        }
      } else {
        // No hash, scroll to top
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    };

    scrollToTarget();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    // Use a small timeout to ensure the DOM has been updated with new content
    const timeoutId = setTimeout(() => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        const headings = mainContent.querySelectorAll('h2');
        const newToc: TocItem[] = Array.from(headings).map(heading => ({
          id: heading.id,
          label: heading.textContent || '',
          level: 2,
        }));
        setToc(newToc);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // Changed dependency to location.pathname

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex min-h-screen">
        <div className="fixed top-0 left-0 h-full w-64 hidden lg:block bg-slate-50 border-r border-slate-200">
            <Sidebar />
        </div>
        <div className="lg:pl-64 flex-1">
            <div className="flex">
                <main id="main-content" className="flex-1 max-w-4xl mx-auto p-6 lg:p-12">
                    <div className="prose prose-slate max-w-none">
                        {children}
                    </div>
                </main>
                <aside className="hidden xl:block w-64 flex-shrink-0">
                    <div className="fixed top-0 right-0 h-full w-64 p-8">
                       <OnThisPage items={toc} />
                    </div>
                </aside>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
