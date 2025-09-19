#!/usr/bin/env node

/**
 * Quick script to fix hash-based navigation links in TSX files
 * Converts href="#/path" to proper React Router Links
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TSX files in pages directory
const files = glob.sync('/Users/thomastheunen/Documents/Projects/mcp-conductor/docs-site-v2/pages/**/*.tsx');

console.log(`Found ${files.length} files to process`);

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Check if file needs Link import
  const needsLinkImport = content.includes('href="#/') && !content.includes('import { Link }') && !content.includes('from \'react-router-dom\'');

  if (needsLinkImport) {
    // Add Link import
    if (content.includes('from \'react-router-dom\'')) {
      // Already has router import, add Link to it
      content = content.replace(
        /import\s*\{\s*([^}]+)\s*\}\s*from\s*'react-router-dom'/,
        (match, imports) => {
          if (!imports.includes('Link')) {
            return `import { ${imports.trim()}, Link } from 'react-router-dom'`;
          }
          return match;
        },
      );
    } else {
      // Add new import after React import
      content = content.replace(
        /import React[^;]*;/,
        '$&\nimport { Link } from \'react-router-dom\';',
      );
    }
    changed = true;
  }

  // Replace href="#/path" with Link components
  const originalContent = content;
  content = content.replace(
    /<a\s+([^>]*?)href="#\/([^"]+)"([^>]*?)>(.*?)<\/a>/g,
    (match, beforeHref, path, afterHref, children) => {
      // Extract className and other attributes
      const className = beforeHref.match(/className="([^"]+)"/)?.[1] || afterHref.match(/className="([^"]+)"/)?.[1] || '';
      const cleanAttrs = (`${beforeHref  } ${  afterHref}`)
        .replace(/href="#\/[^"]+"/g, '')
        .replace(/className="[^"]+"/g, '')
        .trim();

      return `<Link to="/${path}"${className ? ` className="${className}"` : ''}${cleanAttrs ? ` ${cleanAttrs}` : ''}>${children}</Link>`;
    },
  );

  if (content !== originalContent) {
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  }
});

console.log('Done!');
