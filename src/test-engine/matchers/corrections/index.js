/**
 * Corrections index - exports all correction modules
 * Centralized access point for all syntax corrections
 * Optimized structure to eliminate duplications and improve maintainability
 */

import {
  PATTERN_NAMING_CORRECTIONS,
  PATTERN_NAMING_REGEX_CORRECTIONS,
  isLikelyPattern,
  isPatternNameOnly,
} from './syntax/patternNaming.js';
import { TYPE_CORRECTIONS, analyzeTypeErrors } from './syntax/typeCorrections.js';
import {
  OPERATOR_CORRECTIONS,
  analyzeOperatorErrors,
} from './syntax/operatorCorrections.js';
import { REGEX_CORRECTIONS, analyzeRegexErrors } from './syntax/regexCorrections.js';
import { analyzeNonExistentFeatures } from './features/index.js';

/**
 * Combined syntax corrections from all modules
 */
export const SYNTAX_CORRECTIONS = {
  ...PATTERN_NAMING_CORRECTIONS,
  ...TYPE_CORRECTIONS,
  ...OPERATOR_CORRECTIONS,
  ...REGEX_CORRECTIONS,
  ...PATTERN_NAMING_REGEX_CORRECTIONS,
};

/**
 * Pattern-specific error analyzers
 */
export const PATTERN_ANALYZERS = {
  analyzeTypeErrors,
  analyzeOperatorErrors,
  analyzeRegexErrors,
  analyzeNonExistentFeatures,
};

/**
 * Feature analysis
 */
export { analyzeNonExistentFeatures };

/**
 * Utility functions
 */
export {
  isLikelyPattern,
  isPatternNameOnly,
};
