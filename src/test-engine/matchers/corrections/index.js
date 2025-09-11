/**
 * Corrections index - exports all correction modules
 * Centralized access point for all syntax corrections
 */

import {
  PATTERN_NAMING_CORRECTIONS,
  PATTERN_NAMING_REGEX_CORRECTIONS,
  isLikelyPattern,
  isPatternNameOnly,
} from './patternNaming.js';
import { TYPE_CORRECTIONS, analyzeTypeErrors } from './typeCorrections.js';
import {
  OPERATOR_CORRECTIONS,
  OPERATOR_DELIMITER_CORRECTIONS,
  analyzeOperatorErrors,
} from './operatorCorrections.js';
import { REGEX_CORRECTIONS, analyzeRegexErrors } from './regexCorrections.js';

/**
 * Combined syntax corrections from all modules
 */
export const SYNTAX_CORRECTIONS = {
  ...PATTERN_NAMING_CORRECTIONS,
  ...TYPE_CORRECTIONS,
  ...OPERATOR_CORRECTIONS,
  ...REGEX_CORRECTIONS,
  ...PATTERN_NAMING_REGEX_CORRECTIONS,
  ...OPERATOR_DELIMITER_CORRECTIONS,
};

/**
 * Pattern-specific error analyzers
 */
export const PATTERN_ANALYZERS = {
  analyzeTypeErrors,
  analyzeOperatorErrors,
  analyzeRegexErrors,
};

/**
 * Utility functions
 */
export {
  isLikelyPattern,
  isPatternNameOnly,
};
