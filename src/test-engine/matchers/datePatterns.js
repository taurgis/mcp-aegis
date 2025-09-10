/**
 * Date Patterns - Handles date-related pattern matching
 * Follows single responsibility principle for date pattern operations
 */

/**
 * Parse date string to Date object
 * Supports various formats: ISO 8601, timestamp, common formats
 * @param {*} value - The value to parse as a date
 * @returns {Date|null} Parsed date or null if invalid
 */
function parseDate(value) {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    // Handle Unix timestamp (seconds or milliseconds)
    const date = new Date(value > 1e10 ? value : value * 1000);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    // Check if string is a numeric timestamp
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && /^\d+(\.\d+)?$/.test(value.trim())) {
      // Handle as timestamp (seconds or milliseconds)
      const date = new Date(numericValue > 1e10 ? numericValue : numericValue * 1000);
      return isNaN(date.getTime()) ? null : date;
    }

    // Try parsing as ISO date or other common formats
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Parse duration string to milliseconds
 * Supports: 1d, 1h, 1m, 1s, 1ms formats
 * @param {string} duration - Duration string
 * @returns {number} Duration in milliseconds
 */
function parseDuration(duration) {
  const match = duration.match(/^(\d+)(ms|s|m|h|d)$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}. Use format like '1d', '2h', '30m', '45s', '1000ms'`);
  }

  const [, value, unit] = match;
  const num = parseInt(value, 10);

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return num * multipliers[unit];
}

/**
 * Handle date after pattern matching
 * @param {string} pattern - Pattern with 'dateAfter:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDateAfterPattern(pattern, actual) {
  const afterDateStr = pattern.substring(10); // Remove 'dateAfter:' prefix
  const actualDate = parseDate(actual);
  const afterDate = parseDate(afterDateStr);

  if (!actualDate || !afterDate) {
    return false;
  }

  return actualDate > afterDate;
}

/**
 * Handle date before pattern matching
 * @param {string} pattern - Pattern with 'dateBefore:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDateBeforePattern(pattern, actual) {
  const beforeDateStr = pattern.substring(11); // Remove 'dateBefore:' prefix
  const actualDate = parseDate(actual);
  const beforeDate = parseDate(beforeDateStr);

  if (!actualDate || !beforeDate) {
    return false;
  }

  return actualDate < beforeDate;
}

/**
 * Handle date between pattern matching
 * @param {string} pattern - Pattern with 'dateBetween:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDateBetweenPattern(pattern, actual) {
  const betweenStr = pattern.substring(12); // Remove 'dateBetween:' prefix
  const [startDateStr, endDateStr] = betweenStr.split(':');

  if (!startDateStr || !endDateStr) {
    return false;
  }

  const actualDate = parseDate(actual);
  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);

  if (!actualDate || !startDate || !endDate) {
    return false;
  }

  return actualDate >= startDate && actualDate <= endDate;
}

/**
 * Handle date valid pattern matching
 * @param {string} pattern - Pattern with 'dateValid' value
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDateValidPattern(pattern, actual) {
  const date = parseDate(actual);
  return date !== null;
}

/**
 * Handle date age pattern matching
 * @param {string} pattern - Pattern with 'dateAge:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDateAgePattern(pattern, actual) {
  const durationStr = pattern.substring(8); // Remove 'dateAge:' prefix

  try {
    const maxAge = parseDuration(durationStr);
    const actualDate = parseDate(actual);

    if (!actualDate) {
      return false;
    }

    const now = new Date();
    const age = now.getTime() - actualDate.getTime();

    return age <= maxAge;
  } catch {
    return false;
  }
}

/**
 * Handle date equals pattern matching
 * @param {string} pattern - Pattern with 'dateEquals:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDateEqualsPattern(pattern, actual) {
  const expectedDateStr = pattern.substring(11); // Remove 'dateEquals:' prefix
  const actualDate = parseDate(actual);
  const expectedDate = parseDate(expectedDateStr);

  if (!actualDate || !expectedDate) {
    return false;
  }

  return actualDate.getTime() === expectedDate.getTime();
}

/**
 * Handle date format pattern matching
 * @param {string} pattern - Pattern with 'dateFormat:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDateFormatPattern(pattern, actual) {
  const formatType = pattern.substring(11); // Remove 'dateFormat:' prefix

  if (typeof actual !== 'string') {
    return false;
  }

  const formatPatterns = {
    iso: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
    'iso-date': /^\d{4}-\d{2}-\d{2}$/,
    'iso-time': /^\d{2}:\d{2}:\d{2}(\.\d{3})?$/,
    'us-date': /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    'eu-date': /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    timestamp: /^\d+$/,
  };

  const regex = formatPatterns[formatType];
  if (!regex) {
    return false;
  }

  return regex.test(actual);
}
