
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
