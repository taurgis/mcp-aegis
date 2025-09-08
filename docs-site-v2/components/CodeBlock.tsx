
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-slate-50 not-prose">
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};

export const InlineCode: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">{children}</code>
);


export default CodeBlock;
