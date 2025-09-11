/**
 * Cross-Field Patterns - Validates relationships between fields in the same object
 * Single responsibility: Handle field-to-field comparison validations
 */

/**
 * Handle cross-field validation pattern
 * @param {string} pattern - The pattern string (e.g., "crossField:startDate < endDate")
 * @param {*} actual - The actual object containing the fields to compare
 * @returns {boolean} Whether the cross-field condition is satisfied
 */
export function handleCrossFieldPattern(pattern, actual) {
  // Extract the condition from the pattern
  const conditionMatch = pattern.match(/^crossField:(.+)$/);
  if (!conditionMatch) {
    return false;
  }

  const condition = conditionMatch[1].trim();

  // Parse and evaluate the condition
  return evaluateCrossFieldCondition(condition, actual);
}

/**
 * Evaluate a cross-field condition against an object
 * @param {string} condition - The condition string (e.g., "startDate < endDate")
 * @param {*} actual - The object containing the fields
 * @returns {boolean} Whether the condition is satisfied
 */
function evaluateCrossFieldCondition(condition, actual) {
  if (!actual || typeof actual !== 'object') {
    return false;
  }

  // Parse the condition - support various operators
  const operators = ['<=', '>=', '!=', '==', '<', '>', '='];
  let operator = null;
  let leftField = null;
  let rightField = null;

  // Find the operator in the condition
  for (const op of operators) {
    if (condition.includes(op)) {
      operator = op;
      const parts = condition.split(op).map(part => part.trim());
      if (parts.length === 2) {
        leftField = parts[0];
        rightField = parts[1];
        break;
      }
    }
  }

  if (!operator || !leftField || !rightField) {
    return false;
  }

  // Extract field values from the object
  const leftValue = getFieldValue(actual, leftField);
  const rightValue = getFieldValue(actual, rightField);

  // Both values must exist
  if (leftValue === undefined || rightValue === undefined) {
    return false;
  }

  // Perform the comparison based on the operator
  return performComparison(leftValue, rightValue, operator);
}

/**
 * Get a field value from an object, supporting dot notation
 * @param {*} obj - The object to extract from
 * @param {string} fieldPath - The field path (supports dot notation like "user.profile.age")
 * @returns {*} The field value or undefined if not found
 */
function getFieldValue(obj, fieldPath) {
  const parts = fieldPath.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Perform comparison between two values
 * @param {*} leftValue - Left side value
 * @param {*} rightValue - Right side value
 * @param {string} operator - Comparison operator
 * @returns {boolean} Comparison result
 */
function performComparison(leftValue, rightValue, operator) {
  // Convert to comparable values if they're strings that look like dates or numbers
  const left = parseComparableValue(leftValue);
  const right = parseComparableValue(rightValue);

  switch (operator) {
    case '<':
      return left < right;
    case '>':
      return left > right;
    case '<=':
      return left <= right;
    case '>=':
      return left >= right;
    case '=':
    case '==':
      return left === right;
    case '!=':
      return left !== right;
    default:
      return false;
  }
}

/**
 * Parse a value to make it comparable (handle dates, numbers, strings)
 * @param {*} value - The value to parse
 * @returns {*} Comparable value
 */
function parseComparableValue(value) {
  // If it's already a number or date, return as-is
  if (typeof value === 'number' || value instanceof Date) {
    return value;
  }

  // If it's a string, try to parse as date or number
  if (typeof value === 'string') {
    // First, try parsing as number if it looks like a pure number
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && isFinite(numValue) && String(numValue) === value.trim()) {
      return numValue;
    }

    // Try parsing as ISO date only if it looks like a proper date string
    // This prevents strings like "5" or "3000" from being parsed as dates
    if (isDateLikeString(value)) {
      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return dateValue;
      }
    }
  }

  // Return original value for string comparison
  return value;
}

/**
 * Check if a string looks like a date string
 * @param {string} str - The string to check
 * @returns {boolean} Whether the string looks like a date
 */
function isDateLikeString(str) {
  // Check for common date patterns:
  // - ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  // - Common date formats with separators
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T/, // ISO 8601 with time
    /^\d{1,2}\/\d{1,2}\/\d{4}/, // MM/DD/YYYY or M/D/YYYY
    /^\d{1,2}-\d{1,2}-\d{4}/, // MM-DD-YYYY or M-D-YYYY
  ];

  return datePatterns.some(pattern => pattern.test(str.trim()));
}
