import React, { useEffect, useId, useState } from 'react';
// Minimal classnames combiner (avoids external dependency)
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}
import CodeBlock from './CodeBlock';

export interface CodeTabsTab {
  id?: string;
  label: string;
  language: string;
  code: string;
}

interface CodeTabsProps {
  tabs: CodeTabsTab[];
  initial?: string; // id or label
  groupId?: string; // optional grouping for future persistence
  className?: string;
  dense?: boolean;
}

// Lightweight accessible tabs for switching between code variants (e.g., YAML / JavaScript)
const STORAGE_KEY = 'mcp-conductor.codetabs.selection';

// Simple in-memory event hub to broadcast tab changes across mounted groups (no external deps)
type Listener = (group: string, label: string) => void;
const listeners = new Set<Listener>();
function broadcast(group: string, label: string) {
  listeners.forEach(l => l(group, label));
}

const CodeTabs: React.FC<CodeTabsProps> = ({ tabs, initial, groupId, className, dense }) => {
  const autoId = useId();
  const normalized = tabs.map((t, idx) => ({ ...t, id: t.id || `${autoId}-${idx}` }));
  const initialIndex = Math.max(0, normalized.findIndex(t => t.id === initial || t.label === initial));
  const [activeIndex, setActiveIndex] = useState(() => {
    if (groupId && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, string>;
          const remembered = parsed[groupId];
          const idx = normalized.findIndex(t => t.label === remembered || t.id === remembered);
          if (idx >= 0) return idx;
        }
      } catch {}
    }
    return initialIndex >= 0 ? initialIndex : 0;
  });

  const active = normalized[activeIndex];

  // Persist & broadcast when selection changes
  useEffect(() => {
    if (!groupId) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: Record<string, string> = raw ? JSON.parse(raw) : {};
      parsed[groupId] = active.label; // store by label for readability
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      broadcast(groupId, active.label);
    } catch {}
  }, [groupId, active.label]);

  // Listen for external updates (other instances switching)
  useEffect(() => {
    if (!groupId) return;
    const handler: Listener = (group, label) => {
      if (group !== groupId) return;
      setActiveIndex(prev => {
        const idx = normalized.findIndex(t => t.label === label || t.id === label);
        return idx >= 0 ? idx : prev;
      });
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, [groupId, normalized.map(t => t.label).join('|')]);

  return (
    <div className={cx('code-tabs border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden', className)}>
      <div role="tablist" aria-label="Code example format" className={cx('flex gap-1 px-2 pt-2 flex-wrap', dense && 'pt-1 pb-1')}>
        {normalized.map((tab, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`${tab.id}-tab`}
              aria-selected={selected}
              aria-controls={`${tab.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(i)}
              className={cx(
                'text-xs font-medium px-3 py-1.5 rounded-md transition-colors',
                selected
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${active.id}-panel`}
        aria-labelledby={`${active.id}-tab`}
        className={cx('mt-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900')}
      >
        <CodeBlock language={active.language} code={active.code} />
      </div>
    </div>
  );
};

export default CodeTabs;
