
import React, { useState, useEffect } from 'react';
import { TocItem } from '../types';

interface OnThisPageProps {
  items: TocItem[];
}

const OnThisPage: React.FC<OnThisPageProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) return;

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

    // Observe all headings
    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

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
