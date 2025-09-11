/**
 * Regex corrections - handles regex-related syntax errors
 * Follows single responsibility principle - only concerned with regex corrections
 * Enhanced to catch more syntax-related errors and provide meaningful feedback
 */

/**
 * Regex escaping and quoting corrections
 */
export const REGEX_CORRECTIONS = {
  // Double escaping issues (most common regex mistake)
  'match:\\\\\\\\d+': 'match:\\d+',
  'match:\\\\\\\\w+': 'match:\\w+',
  'match:\\\\\\\\s+': 'match:\\s+',
  'match:\\\\\\\\D+': 'match:\\D+',
  'match:\\\\\\\\W+': 'match:\\W+',
  'match:\\\\\\\\S+': 'match:\\S+',
  'match:\\\\\\\\b': 'match:\\b',
  'match:\\\\\\\\t': 'match:\\t',
  'match:\\\\\\\\n': 'match:\\n',
  'match:\\\\\\\\r': 'match:\\r',

  // Single extra backslash
  'match:\\\\d+': 'match:\\d+',
  'match:\\\\w+': 'match:\\w+',
  'match:\\\\s+': 'match:\\s+',
  'match:\\\\D+': 'match:\\D+',
  'match:\\\\W+': 'match:\\W+',
  'match:\\\\S+': 'match:\\S+',

  // Wrong quotes in regex (YAML anti-pattern)
  'match:"regex:': 'match:regex:',
  "match:'regex:": 'match:regex:',
  '"match:regex:': 'match:regex:',
  "'match:regex:": 'match:regex:',

  // Quoted regex patterns (critical YAML error)
  '"match:regex:\\d+"': 'match:regex:\\d+',
  "'match:regex:\\d+'": 'match:regex:\\d+',
  '"match:regex:\\w+"': 'match:regex:\\w+',
  "'match:regex:\\w+'": 'match:regex:\\w+',
  '"match:regex:[0-9]+"': 'match:regex:[0-9]+',
  '"match:regex:[a-zA-Z]+"': 'match:regex:[a-zA-Z]+',

  // Common regex alias corrections
  'match:regexp:': 'match:regex:',
  'match:reg:': 'match:regex:',
  'match:pattern:': 'match:regex:',
  'match:regularExpression:': 'match:regex:',
  'match:re:': 'match:regex:',

  // Character class escaping errors
  'match:regex:[\\\\d]': 'match:regex:[\\d]',
  'match:regex:[\\\\w]': 'match:regex:[\\w]',
  'match:regex:[\\\\s]': 'match:regex:[\\s]',

  // Common regex mistakes from documentation examples
  'match:regex:^[a-z][a-z0-9_]*': 'match:regex:^[a-z][a-z0-9_]*$',
  'match:regex:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z': 'match:regex:\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}',

  // Multiline regex corrections (from documentation anti-patterns)
  'match:regex:.*.': 'match:regex:[\\s\\S]*',
  'match:regex:.*\\n.*': 'match:regex:[\\s\\S]*',
  'match:regex:.*$': 'match:regex:[\\s\\S]*',

  // URL regex corrections
  'match:regex:http://': 'match:regex:https?://',
  'match:regex:www\\.': 'match:regex:(?:www\\.)?',

  // Common programming language regex patterns that don't work in JavaScript
  'match:regex:\\\\A': 'match:regex:^',        // Perl/Ruby start of string
  'match:regex:\\\\Z': 'match:regex:$',        // Perl/Ruby end of string
  'match:regex:\\\\z': 'match:regex:$',        // Perl/Ruby end of string (strict)
  'match:regex:\\\\G': 'match:regex:^',        // Perl continuing from last match

  // POSIX character classes to JavaScript equivalents
  'match:regex:[[:digit:]]': 'match:regex:[0-9]',
  'match:regex:[[:alpha:]]': 'match:regex:[a-zA-Z]',
  'match:regex:[[:alnum:]]': 'match:regex:[a-zA-Z0-9]',
  'match:regex:[[:space:]]': 'match:regex:[\\s]',
  'match:regex:[[:upper:]]': 'match:regex:[A-Z]',
  'match:regex:[[:lower:]]': 'match:regex:[a-z]',

  // Common escaping mistakes with special characters
  'match:regex:\\.': 'match:regex:\\.',
  'match:regex:\\?': 'match:regex:\\?',
  'match:regex:\\+': 'match:regex:\\+',
  'match:regex:\\*': 'match:regex:\\*',
  'match:regex:\\(': 'match:regex:\\(',
  'match:regex:\\)': 'match:regex:\\)',
  'match:regex:\\[': 'match:regex:\\[',
  'match:regex:\\]': 'match:regex:\\]',
  'match:regex:\\{': 'match:regex:\\{',
  'match:regex:\\}': 'match:regex:\\}',
  'match:regex:\\|': 'match:regex:\\|',
  'match:regex:\\^': 'match:regex:\\^',
  'match:regex:\\$': 'match:regex:\\$',

  // Common duplications and typos in documentation patterns
  'match:regex:\\d\\d+': 'match:regex:\\d+',      // Redundant \d\d+ should be \d+
  'match:regex:\\w\\w+': 'match:regex:\\w+',      // Redundant \w\w+ should be \w+
  'match:regex:[0-9][0-9]+': 'match:regex:[0-9]+', // Redundant character class duplication

  // Wrong delimiter usage in ranges (should use - not :)
  'match:regex:[0:9]': 'match:regex:[0-9]',
  'match:regex:[a:z]': 'match:regex:[a-z]',
  'match:regex:[A:Z]': 'match:regex:[A-Z]',

  // Email pattern corrections (from documentation)
  'match:regex:.*@.*': 'match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
  'match:regex:\\w+@\\w+': 'match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',

  // UUID pattern corrections (from documentation)
  'match:regex:[0-9a-f-]+': 'match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
  'match:regex:[a-f0-9-]+': 'match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',

  // Version pattern corrections (from documentation)
  'match:regex:\\d+\\.\\d+': 'match:regex:v?\\d+\\.\\d+\\.\\d+',
  'match:regex:v\\d+': 'match:regex:v?\\d+\\.\\d+\\.\\d+',

  // Common negation pattern mistakes
  'match:regex:^(?!.*error)': 'match:not:contains:error',  // Use built-in negation instead
  'match:regex:^(?!.*invalid)': 'match:not:contains:invalid',

  // Case sensitivity mistakes (JavaScript regex is case-sensitive by default)
  'match:regex:/pattern/i': 'match:regex:(?i)pattern',    // Wrong flag syntax
  'match:regex:Pattern': 'match:regex:[Pp]attern',        // Manual case handling

  // Word boundary corrections
  'match:regex:^word$': 'match:regex:\\bword\\b',         // Word boundaries better than anchors for word matching

  // Quantifier corrections
  'match:regex:\\d{1,}': 'match:regex:\\d+',             // {1,} is the same as +
  'match:regex:\\w{0,}': 'match:regex:\\w*',             // {0,} is the same as *
  'match:regex:a{1}': 'match:regex:a',                   // {1} is redundant

  // Common range mistakes
  'match:regex:[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}': 'match:regex:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)', // IP address validation
};

/**
 * Analyze regex-related pattern errors
 * @param {string} pattern - Pattern to analyze
 * @returns {Array} Array of regex correction suggestions
 */
export function analyzeRegexErrors(pattern) {
  const suggestions = [];

  if (!pattern || typeof pattern !== 'string') {
    return suggestions;
  }

  // Check for incorrect regex escaping (double escaping)
  if (pattern.includes('\\\\') && (pattern.includes('regex:') || pattern.includes('regexp:'))) {
    const corrected = pattern.replace(/\\\\/g, '\\');
    suggestions.push({
      type: 'double_escape',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Avoid double-escaping in regex patterns. Use \\d+ not \\\\d+',
      severity: 'error',
    });
  }

  // Check for quoted regex patterns (critical YAML error)
  if ((pattern.startsWith('"match:regex:') && pattern.endsWith('"')) ||
      (pattern.startsWith("'match:regex:") && pattern.endsWith("'"))) {
    const corrected = pattern.slice(1, -1); // Remove quotes
    suggestions.push({
      type: 'quoted_regex',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Regex patterns should not be quoted in YAML. Remove quotes around the pattern.',
      severity: 'error',
    });
  }

  // Check for missing match: prefix on regex-like patterns
  if (!pattern.includes('match:') && (pattern.includes('regex:') || pattern.includes('regexp:'))) {
    const corrected = `match:${pattern}`;
    suggestions.push({
      type: 'missing_match_prefix',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Regex patterns must start with "match:" prefix',
      severity: 'error',
    });
  }

  // Check for wrong regex alias usage
  if (pattern.includes('regexp:')) {
    const corrected = pattern.replace('regexp:', 'regex:');
    suggestions.push({
      type: 'regex_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "regex:" instead of "regexp:" for consistency',
      severity: 'warning',
    });
  }

  // Check for other regex aliases
  if (pattern.includes('pattern:') || pattern.includes('regularExpression:') || pattern.includes('reg:')) {
    const corrected = pattern.replace(/(pattern:|regularExpression:|reg:)/, 'regex:');
    suggestions.push({
      type: 'regex_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "regex:" instead of aliases like "pattern:", "regularExpression:", or "reg:"',
      severity: 'warning',
    });
  }

  // Check for POSIX character classes (not supported in JavaScript)
  if (pattern.includes('[[:') && pattern.includes(':]]')) {
    const posixClasses = {
      '[[:digit:]]': '[0-9]',
      '[[:alpha:]]': '[a-zA-Z]',
      '[[:alnum:]]': '[a-zA-Z0-9]',
      '[[:space:]]': '[\\s]',
      '[[:upper:]]': '[A-Z]',
      '[[:lower:]]': '[a-z]',
    };

    let corrected = pattern;
    for (const [posix, js] of Object.entries(posixClasses)) {
      if (pattern.includes(posix)) {
        corrected = corrected.replace(posix, js);
        suggestions.push({
          type: 'posix_character_class',
          original: pattern,
          corrected,
          pattern: corrected,
          message: `POSIX character classes like ${posix} are not supported in JavaScript. Use ${js} instead.`,
          severity: 'error',
        });
        break;
      }
    }
  }

  // Check for common regex mistakes
  if (pattern.includes('regex:') || pattern.includes('regexp:')) {
    const regexPart = pattern.split(/regex:|regexp:/)[1];

    if (regexPart) {
      // Check for unescaped forward slashes
      if (regexPart.includes('/') && !regexPart.includes('\\/')) {
        const corrected = pattern.replace(/\//g, '\\/');
        suggestions.push({
          type: 'unescaped_slash',
          original: pattern,
          corrected,
          pattern: corrected,
          message: 'Forward slashes in regex should be escaped: \\/ instead of /',
          severity: 'warning',
        });
      }

      // Check for multiline patterns using wrong syntax
      if (regexPart.includes('.*') && (regexPart.includes('\\n') || regexPart.includes('\n'))) {
        const corrected = pattern.replace(/\.\*/g, '[\\s\\S]*');
        suggestions.push({
          type: 'multiline_regex',
          original: pattern,
          corrected,
          pattern: corrected,
          message: 'Use [\\s\\S]* instead of .* for multiline matching. The . character does not match newlines by default.',
          severity: 'warning',
        });
      }

      // Check for redundant quantifiers
      if (regexPart.includes('\\d{1,}')) {
        const corrected = pattern.replace('\\d{1,}', '\\d+');
        suggestions.push({
          type: 'redundant_quantifier',
          original: pattern,
          corrected,
          pattern: corrected,
          message: 'Use \\d+ instead of \\d{1,} - they are equivalent',
          severity: 'info',
        });
      }

      if (regexPart.includes('\\w{0,}')) {
        const corrected = pattern.replace('\\w{0,}', '\\w*');
        suggestions.push({
          type: 'redundant_quantifier',
          original: pattern,
          corrected,
          pattern: corrected,
          message: 'Use \\w* instead of \\w{0,} - they are equivalent',
          severity: 'info',
        });
      }

      // Check for missing anchors in what looks like exact matches
      if (!regexPart.includes('^') && !regexPart.includes('$') &&
          regexPart.length < 30 && !regexPart.includes('*') &&
          !regexPart.includes('+') && !regexPart.includes('?') &&
          !regexPart.includes('|') && !regexPart.includes('[') &&
          !regexPart.includes('(')) {
        const corrected = pattern.replace(/(regex:|regexp:)(.*)/, '$1^$2$');
        suggestions.push({
          type: 'missing_anchors',
          original: pattern,
          corrected,
          pattern: corrected,
          message: 'Consider adding anchors (^ and $) for exact regex matches',
          severity: 'info',
        });
      }

      // Check for wrong delimiter usage in character ranges
      if (regexPart.includes('[0:9]') || regexPart.includes('[a:z]') || regexPart.includes('[A:Z]')) {
        let corrected = pattern;
        corrected = corrected.replace('[0:9]', '[0-9]');
        corrected = corrected.replace('[a:z]', '[a-z]');
        corrected = corrected.replace('[A:Z]', '[A-Z]');
        suggestions.push({
          type: 'wrong_range_delimiter',
          original: pattern,
          corrected,
          pattern: corrected,
          message: 'Use hyphen (-) not colon (:) in character ranges: [0-9] not [0:9]',
          severity: 'error',
        });
      }

      // Check for common character class mistakes
      if (regexPart.includes('[0-9]') && !regexPart.includes('[0-9]+') && !regexPart.includes('[0-9]*') && !regexPart.includes('[0-9]?')) {
        suggestions.push({
          type: 'character_class_quantifier',
          original: pattern,
          corrected: pattern.replace('[0-9]', '[0-9]+'),
          pattern: pattern.replace('[0-9]', '[0-9]+'),
          message: 'Consider adding quantifier: [0-9]+ instead of [0-9] for multiple digits',
          severity: 'info',
        });
      }

      // Check for basic email patterns that could be improved
      if (regexPart.includes('@') && regexPart.length < 50 && !regexPart.includes('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')) {
        const emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
        suggestions.push({
          type: 'email_pattern',
          original: pattern,
          corrected: `match:regex:${emailPattern}`,
          pattern: `match:regex:${emailPattern}`,
          message: 'Consider using a more robust email regex pattern for better validation',
          severity: 'info',
        });
      }

      // Check for UUID pattern improvements
      if ((regexPart.includes('uuid') || regexPart.includes('UUID') || regexPart.includes('[0-9a-f-]')) &&
          !regexPart.includes('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')) {
        const uuidPattern = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
        suggestions.push({
          type: 'uuid_pattern',
          original: pattern,
          corrected: `match:regex:${uuidPattern}`,
          pattern: `match:regex:${uuidPattern}`,
          message: 'Use standard UUID regex pattern for proper UUID validation',
          severity: 'info',
        });
      }

      // Check for timestamp pattern improvements
      if (regexPart.includes('T') && regexPart.includes(':') && regexPart.includes('-') &&
          !regexPart.includes('\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}')) {
        const timestampPattern = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}';
        suggestions.push({
          type: 'timestamp_pattern',
          original: pattern,
          corrected: `match:regex:${timestampPattern}`,
          pattern: `match:regex:${timestampPattern}`,
          message: 'Use standard ISO timestamp regex pattern',
          severity: 'info',
        });
      }

      // Check for version pattern improvements
      if ((regexPart.includes('\\d+\\.\\d+') || regexPart.includes('v\\d+')) &&
          !regexPart.includes('v?\\d+\\.\\d+\\.\\d+')) {
        const versionPattern = 'v?\\d+\\.\\d+\\.\\d+';
        suggestions.push({
          type: 'version_pattern',
          original: pattern,
          corrected: `match:regex:${versionPattern}`,
          pattern: `match:regex:${versionPattern}`,
          message: 'Consider using semantic version pattern: v?\\d+\\.\\d+\\.\\d+',
          severity: 'info',
        });
      }

      // Check for empty or invalid regex
      if (regexPart.trim().length === 0) {
        suggestions.push({
          type: 'empty_regex',
          original: pattern,
          corrected: 'match:regex:.+',
          pattern: 'match:regex:.+',
          message: 'Empty regex pattern. Use .+ to match any non-empty string',
          severity: 'error',
        });
      }

      // Check for unbalanced brackets/parentheses
      const openBrackets = (regexPart.match(/\[/g) || []).length;
      const closeBrackets = (regexPart.match(/\]/g) || []).length;
      const openParens = (regexPart.match(/\(/g) || []).length;
      const closeParens = (regexPart.match(/\)/g) || []).length;

      if (openBrackets !== closeBrackets) {
        suggestions.push({
          type: 'unbalanced_brackets',
          original: pattern,
          corrected: pattern,
          pattern,
          message: 'Unbalanced square brackets in regex pattern. Check for missing [ or ]',
          severity: 'error',
        });
      }

      if (openParens !== closeParens) {
        suggestions.push({
          type: 'unbalanced_parens',
          original: pattern,
          corrected: pattern,
          pattern,
          message: 'Unbalanced parentheses in regex pattern. Check for missing ( or )',
          severity: 'error',
        });
      }

      // Check for JavaScript regex flags in wrong format
      if (regexPart.includes('/i') || regexPart.includes('/g') || regexPart.includes('/m')) {
        suggestions.push({
          type: 'wrong_flag_syntax',
          original: pattern,
          corrected: pattern.replace(/\/[igm]+/, ''),
          pattern: pattern.replace(/\/[igm]+/, ''),
          message: 'JavaScript regex flags (/i, /g, /m) are not supported in this format. Use appropriate pattern alternatives.',
          severity: 'error',
        });
      }

      // Check for negation patterns that could use built-in negation
      if (regexPart.includes('^(?!.*') && regexPart.includes(')')) {
        const negatedTerm = regexPart.match(/\^\\?\(?\\?!\\.\\?\*(.+?)\\?\)/);
        if (negatedTerm && negatedTerm[1]) {
          suggestions.push({
            type: 'complex_negation',
            original: pattern,
            corrected: `match:not:contains:${negatedTerm[1]}`,
            pattern: `match:not:contains:${negatedTerm[1]}`,
            message: `Use built-in negation pattern "match:not:contains:${negatedTerm[1]}" instead of complex regex`,
            severity: 'info',
          });
        }
      }

      // Check for redundant character class constructions
      if (regexPart.includes('\\d\\d+') || regexPart.includes('\\w\\w+')) {
        let corrected = pattern;
        corrected = corrected.replace('\\d\\d+', '\\d+');
        corrected = corrected.replace('\\w\\w+', '\\w+');
        suggestions.push({
          type: 'redundant_character_class',
          original: pattern,
          corrected,
          pattern: corrected,
          message: 'Redundant character class usage: \\d+ is simpler than \\d\\d+',
          severity: 'info',
        });
      }
    }
  }

  return suggestions;
}
