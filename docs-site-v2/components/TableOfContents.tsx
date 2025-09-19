import React from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  title?: string;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  items, 
  title = "Contents",
  className = "" 
}) => {
  const scrollTo = (id: string) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update hash without adding duplicate history entries
      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  return (
    <nav className={`bg-slate-50 border border-slate-200 rounded-lg p-6 ${className}`} aria-labelledby="toc-title">
      <h3 id="toc-title" className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        📋 {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={`${item.level === 2 ? 'ml-0' : 'ml-4'}`}>
            <button
              type="button"
              onClick={() => scrollTo(item.id)}
              className={`text-left w-full hover:text-blue-600 transition-colors ${
                item.level === 2 
                  ? 'text-slate-800 font-medium' 
                  : 'text-slate-600 text-sm'
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;