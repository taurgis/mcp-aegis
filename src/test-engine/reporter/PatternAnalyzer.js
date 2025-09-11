import { diff } from 'jest-diff';
import chalk from 'chalk';

/**
 * Analyzes pattern matching and provides intelligent diff display
 * Follows single responsibility principle - only concerned with pattern analysis
 */
export class PatternAnalyzer {
  constructor() {
    this.patternKeys = ['match:arrayElements', 'match:partial', 'match:extractField'];
  }

  /**
   * Display intelligent diff that handles pattern matching better
   * @param {*} expected - Expected value (may contain patterns)
   * @param {*} actual - Actual value
   */
  displayIntelligentDiff(expected, actual) {
    // Check if expected contains pattern matching objects
    if (this.containsPatterns(expected)) {
      console.log();
      console.log(chalk.cyan('    Pattern Analysis:'));
      const explanation = this.createPatternExplanation(expected, actual);
      console.log(`    ${explanation.split('\n').join('\n    ')}`);
      return;
    }

    // Standard diff for non-pattern cases
    const diffOutput = diff(expected, actual, {
      aAnnotation: 'Expected',
      bAnnotation: 'Received',
      contextLines: 2,
      expand: false,
    });

    if (diffOutput && diffOutput !== 'Compared values have no visual difference.') {
      console.log();
      console.log(chalk.gray('    Diff:'));
      console.log(`    ${diffOutput.split('\n').join('\n    ')}`);
    }
  }

  /**
   * Check if an object contains pattern matching directives
   * @param {*} obj - Object to check
   * @returns {boolean} Whether object contains patterns
   */
  containsPatterns(obj) {
    if (typeof obj === 'string' && obj.startsWith('match:')) {
      return true;
    }

    if (typeof obj === 'object' && obj !== null) {
      // Check for special pattern keys
      if (this.patternKeys.some(key => key in obj)) {
        return true;
      }

      // Recursively check nested objects
      return Object.values(obj).some(value => this.containsPatterns(value));
    }

    return false;
  }

  /**
   * Create human-readable explanation for pattern matching
   * @param {*} expected - Expected pattern
   * @param {*} actual - Actual value
   * @returns {string} Human-readable explanation
   */
  createPatternExplanation(expected, actual) {
    const explanations = [];
    this.analyzePatterns(expected, actual, '', explanations);

    if (explanations.length === 0) {
      return 'Pattern validation completed - see error message above for specific failures';
    }

    return explanations.join('\n');
  }

  /**
   * Analyze patterns recursively and build explanations
   * @param {*} expected - Expected pattern
   * @param {*} actual - Actual value
   * @param {string} path - Current path
   * @param {Array} explanations - Array to collect explanations
   */
  analyzePatterns(expected, actual, path, explanations) {
    if (typeof expected === 'string' && expected.startsWith('match:')) {
      const pattern = expected.substring(6);
      const pathStr = path ? `${path}: ` : '';

      if (pattern.startsWith('type:')) {
        const expectedType = pattern.substring(5);
        const actualType = typeof actual;
        explanations.push(`${pathStr}Type validation: expected '${expectedType}', got '${actualType}'`);
      } else if (pattern.startsWith('arrayLength:')) {
        const expectedLength = pattern.substring(12);
        const actualLength = Array.isArray(actual) ? actual.length : 'N/A';
        explanations.push(`${pathStr}Length validation: expected ${expectedLength}, got ${actualLength}`);
      } else if (pattern.startsWith('contains:')) {
        const searchTerm = pattern.substring(9);
        explanations.push(`${pathStr}Contains validation: looking for '${searchTerm}' in value`);
      } else {
        explanations.push(`${pathStr}Pattern '${pattern}' applied`);
      }
      return;
    }

    if (typeof expected === 'object' && expected !== null) {
      // Handle special pattern objects
      if ('match:arrayElements' in expected) {
        const pathStr = path ? `${path}: ` : '';
        if (Array.isArray(actual)) {
          explanations.push(`${pathStr}arrayElements pattern: Validating ${actual.length} array items`);
          const elementPattern = expected['match:arrayElements'];
          explanations.push(`${pathStr}  Each item must match: ${JSON.stringify(elementPattern, null, 2).replace(/\n/g, ' ')}`);
        } else {
          explanations.push(`${pathStr}arrayElements pattern: Expected array, got ${typeof actual}`);
        }
        return;
      }

      if ('match:partial' in expected) {
        const pathStr = path ? `${path}: ` : '';
        explanations.push(`${pathStr}partial matching: Only validating specified fields`);
        return;
      }

      if ('match:extractField' in expected) {
        const pathStr = path ? `${path}: ` : '';
        const fieldPath = expected['match:extractField'];
        explanations.push(`${pathStr}field extraction: Extracting '${fieldPath}' for validation`);
        return;
      }

      // Recursively analyze nested objects
      Object.keys(expected).forEach(key => {
        const nextPath = path ? `${path}.${key}` : key;
        if (actual && typeof actual === 'object') {
          this.analyzePatterns(expected[key], actual[key], nextPath, explanations);
        } else {
          this.analyzePatterns(expected[key], undefined, nextPath, explanations);
        }
      });
    }
  }

  /**
   * Extract pattern type from a pattern string
   * @param {string} pattern - Pattern string (e.g., "match:type:string")
   * @returns {string|null} Pattern type or null if not a pattern
   */
  extractPatternType(pattern) {
    if (typeof pattern !== 'string' || !pattern.startsWith('match:')) {
      return null;
    }

    const parts = pattern.split(':');
    return parts.length > 1 ? parts[1] : null;
  }

  /**
   * Check if a pattern is a negation pattern
   * @param {string} pattern - Pattern string
   * @returns {boolean} Whether pattern is negated
   */
  isNegationPattern(pattern) {
    return typeof pattern === 'string' && pattern.startsWith('match:not:');
  }
}
