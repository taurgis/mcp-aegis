
import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
// Import common languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-shell-session';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import { CopyIcon, CheckIcon } from './icons';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Ensure Prism highlights the code after component mounts
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map common language aliases to Prism language identifiers
  const getPrismLanguage = (lang: string): string => {
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'json': 'json',
      'yml': 'yaml',
      'yaml': 'yaml',
      'sh': 'bash',
      'shell': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'md': 'markdown',
      'markdown': 'markdown',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
    };
    return langMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  const prismLanguage = getPrismLanguage(language);

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
        <code 
          className={`language-${prismLanguage}`}
          dangerouslySetInnerHTML={{
            __html: Prism.languages[prismLanguage] 
              ? Prism.highlight(code.trim(), Prism.languages[prismLanguage], prismLanguage)
              : code.trim()
          }}
        />
      </pre>
    </div>
  );
};

export const InlineCode: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">{children}</code>
);


export default CodeBlock;
