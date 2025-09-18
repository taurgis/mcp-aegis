import React from 'react';
import { InlineCode } from './CodeBlock';

// Reusable callout component for documentation pages.
// Variants align with semantic intent; colors use Tailwind + dark mode support.
// Keep footprint minimal; no external icon lib to avoid extra bundle weight.

export type CalloutType = 'info' | 'warning' | 'success' | 'note' | 'danger' | 'tip';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean; // reduces vertical padding when true
}

const typeStyles: Record<CalloutType, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-300 text-amber-900',
  success: 'bg-green-50 border-green-200 text-green-800',
  note: 'bg-slate-50 border-slate-200 text-slate-700',
  danger: 'bg-rose-50 border-rose-200 text-rose-800',
  tip: 'bg-indigo-50 border-indigo-200 text-indigo-800'
};

const typeLabel: Partial<Record<CalloutType, string>> = {
  info: 'Info',
  warning: 'Warning',
  success: 'Success',
  note: 'Note',
  danger: 'Important',
  tip: 'Tip'
};

const glyph: Partial<Record<CalloutType, string>> = {
  info: 'ℹ️',
  warning: '⚠️',
  success: '✅',
  note: '📝',
  danger: '❗',
  tip: '💡'
};

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children,
  className = '',
  compact = false
}) => {
  const base = compact ? 'py-2 px-3' : 'p-4';
  const role = type === 'danger' || type === 'warning' ? 'alert' : 'note';
  return (
    <div
      className={`rounded-md border text-sm ${base} ${typeStyles[type]} ${className}`}
      role={role as any}
      aria-label={title || typeLabel[type]}
    >
      {(title || glyph[type]) && (
        <div className="flex items-start gap-2 mb-1">
          <span className="select-none leading-none text-base" aria-hidden="true">{glyph[type]}</span>
          <h4 className="m-0 font-semibold text-sm">{title || typeLabel[type]}</h4>
        </div>
      )}
      <div className="prose prose-sm max-w-none">
        {children}
      </div>
    </div>
  );
};

export default Callout;