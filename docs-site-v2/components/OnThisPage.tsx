
import React from 'react';
import { TocItem } from '../types';

interface OnThisPageProps {
  items: TocItem[];
}

const OnThisPage: React.FC<OnThisPageProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pt-12">
      <h2 className="text-sm font-bold text-slate-800 mb-4">On this page</h2>
      <ul className="space-y-2 text-sm">
        {items.map(item => (
          <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
            <a
              href={`#${item.id}`}
              className="text-slate-500 hover:text-slate-800 transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnThisPage;
