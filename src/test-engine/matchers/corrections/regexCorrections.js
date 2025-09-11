/**
 * Regex corrections - handles regex-related syntax errors
 * Follows single responsibility principle - only concerned with regex corrections
 */

/**
 * Regex escaping and quoting corrections
 */
export const REGEX_CORRECTIONS = {
  // Regex escaping issues
  'match:\\\\d+': 'match:\\d+',
  'match:\\\\w+': 'match:\\w+',
  'match:\\\\s+': 'match:\\s+',
  'match:\\\\D+': 'match:\\D+',
  'match:\\\\W+': 'match:\\W+',
  'match:\\\\S+': 'match:\\S+',

  // Wrong quotes in regex
  'match:"regex:': 'match:regex:',
  "match:'regex:": 'match:regex:',
  '"match:regex:': 'match:regex:',
  "'match:regex:": 'match:regex:',
};

/**
 * Analyze regex-related pattern errors
 * @param {string} pattern - Pattern to analyze
 * @returns {Array} Array of regex correction suggestions
 */
export function analyzeRegexErrors(pattern) {
  const suggestions = [];

  // Check for incorrect regex escaping
  if (pattern.includes('\\\\') && pattern.includes('regex:')) {
    const corrected = pattern.replace(/\\\\/g, '\\');
    suggestions.push({
      type: 'double_escape',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Avoid double-escaping in regex patterns. Use \\d+ not \\\\d+',
    });
  }

  // Check for common regex mistakes
  if (pattern.includes('regex:')) {
    // Check for unescaped forward slashes
    if (pattern.includes('/') && !pattern.includes('\\/')) {
      const corrected = pattern.replace(/\//g, '\\/');
      suggestions.push({
        type: 'unescaped_slash',
        original: pattern,
        corrected,
        pattern: corrected,
        message: 'Forward slashes in regex should be escaped: \\/ instead of /',
      });
    }

    // Check for missing anchors in what looks like exact matches
    const regexPart = pattern.split('regex:')[1];
    if (regexPart && !regexPart.includes('^') && !regexPart.includes('$') &&
        regexPart.length < 20 && !regexPart.includes('*') && !regexPart.includes('+')) {
      suggestions.push({
        type: 'missing_anchors',
        original: pattern,
        corrected: pattern.replace(/regex:(.*)/, 'regex:^$1$'),
        pattern: pattern.replace(/regex:(.*)/, 'regex:^$1$'),
        message: 'Consider adding anchors (^ and $) for exact regex matches',
      });
    }
  }

  return suggestions;
}
