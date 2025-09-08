const fs = require('fs');

// Copy the exact functions from generate-search-index.js
function extractTextFromJSX(content) {
  const textContent = [];

  // Remove JSX tags but keep the text content
  const cleanContent = content
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // Remove import statements
    .replace(/^import\s+.*$/gm, '')
    // Remove className and other JSX attributes
    .replace(/className=["'`][^"'`]*["'`]/g, '')
    .replace(/\w+={[^}]*}/g, '');

  // Extract text between JSX tags
  const textRegex = />([^<]+)</g;
  let match;
  while ((match = textRegex.exec(cleanContent)) !== null) {
    const text = match[1].trim();
    // Filter out empty strings, JSX expressions, and very short text
    if (text &&
        !text.startsWith('{') &&
        !text.includes('className') &&
        !text.includes('src=') &&
        text.length > 3 &&
        !/^[{\s}]*$/.test(text)) {
      textContent.push(text);
    }
  }

  return textContent.join(' ').replace(/\s+/g, ' ').trim();
}

function processReactFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const routePath = '/pattern-matching/regex';
  const pageTitle = 'Regex Patterns';
  const results = [];
  
  const jsxComponentPattern = /<H([123])[^>]*id=["']([^"']+)["'][^>]*>([^<]+)<\/H[123]>/gi;
  const sections = [];
  let match;

  console.log('Processing file:', filePath);

  // First, extract JSX component headings (H1, H2, H3)
  while ((match = jsxComponentPattern.exec(content)) !== null) {
    const heading = match[3].trim();
    const headingId = match[2];
    const level = parseInt(match[1]);

    console.log(`Found heading: "${heading}" with ID: "${headingId}"`);

    if (heading && heading.length > 1) {
      sections.push({
        heading,
        headingId,
        level,
        position: match.index,
      });
    }
  }

  console.log('Total sections found:', sections.length);

  // Create search entries for each section
  sections.forEach((section, index) => {
    const nextSection = sections[index + 1];
    const sectionStart = section.position;
    const sectionEnd = nextSection ? nextSection.position : content.length;
    
    const sectionContent = content.substring(sectionStart, sectionEnd);
    const textContent = extractTextFromJSX(sectionContent);
    
    console.log(`\nProcessing section ${index}: "${section.heading}"`);
    console.log('  headingId:', JSON.stringify(section.headingId), '(type:', typeof section.headingId, ')');
    console.log('  textContent length:', textContent.trim().length);
    
    if (textContent.trim().length > 10) {
      const entry = {
        path: routePath,
        pageTitle,
        heading: section.heading,
        headingId: section.headingId || null,
        content: textContent.substring(0, 100) // Shorter for debugging
      };
      
      console.log('  Final entry headingId:', JSON.stringify(entry.headingId));
      console.log('  Entry object:', JSON.stringify(entry, null, 2));
      results.push(entry);
    } else {
      console.log('  Skipped - insufficient content');
    }
  });
  
  return results;
}

// Test with the actual file
const results = processReactFile('pages/pattern-matching/RegexPatternsPage.tsx');
console.log('\n=== FINAL RESULTS ===');
console.log('Total entries:', results.length);
console.log('\nFirst 3 entries:');
results.slice(0, 3).forEach((result, i) => {
  console.log(`${i + 1}. "${result.heading}" -> headingId: ${JSON.stringify(result.headingId)}`);
});

// Test JSON serialization
console.log('\n=== JSON SERIALIZATION TEST ===');
const jsonString = JSON.stringify(results.slice(0, 2), null, 2);
console.log('Serialized JSON:');
console.log(jsonString);

const parsed = JSON.parse(jsonString);
console.log('\nParsed back headingIds:');
parsed.forEach((item, i) => {
  console.log(`${i + 1}. ${item.heading} -> ${JSON.stringify(item.headingId)}`);
});
