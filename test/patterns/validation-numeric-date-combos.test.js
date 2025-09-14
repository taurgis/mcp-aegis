import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import { validateWithDetailedAnalysis } from '../../src/test-engine/matchers/validation.js';

describe('Validation numeric/date success & failure combos', () => {
  test('between success and failure pair', () => {
    const expectedFail = { v: 'match:between:10:20' };
    const actualFail = { v: 25 }; // outside
    const resFail = validateWithDetailedAnalysis(expectedFail, actualFail);
    assert.equal(resFail.passed, false);
    assert.ok(resFail.errors.some(e => e.patternType === 'between'));

    const expectedPass = { v: 'match:between:10:20' };
    const actualPass = { v: 15 };
    const resPass = validateWithDetailedAnalysis(expectedPass, actualPass);
    assert.equal(resPass.passed, true);
  });

  test('range success and failure pair', () => {
    const expectedFail = { v: 'match:range:5:8' };
    const actualFail = { v: 4 }; // below
    const resFail = validateWithDetailedAnalysis(expectedFail, actualFail);
    assert.equal(resFail.passed, false);
    assert.ok(resFail.errors.some(e => e.patternType === 'range'));

    const actualPass = { v: 6 };
    const resPass = validateWithDetailedAnalysis(expectedFail, actualPass);
    assert.equal(resPass.passed, true);
  });

  test('greaterThan / greaterThanOrEqual success & fail', () => {
    const gtExp = { v: 'match:greaterThan:10' };
    assert.equal(validateWithDetailedAnalysis(gtExp, { v: 5 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(gtExp, { v: 11 }).passed, true);

    const gteExp = { v: 'match:greaterThanOrEqual:10' };
    assert.equal(validateWithDetailedAnalysis(gteExp, { v: 9 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(gteExp, { v: 10 }).passed, true);
  });

  test('lessThan / lessThanOrEqual success & fail', () => {
    const ltExp = { v: 'match:lessThan:10' };
    assert.equal(validateWithDetailedAnalysis(ltExp, { v: 12 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(ltExp, { v: 2 }).passed, true);

    const lteExp = { v: 'match:lessThanOrEqual:10' };
    assert.equal(validateWithDetailedAnalysis(lteExp, { v: 12 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(lteExp, { v: 10 }).passed, true);
  });

  test('equals / notEquals success & fail', () => {
    const eqExp = { v: 'match:equals:42' };
    assert.equal(validateWithDetailedAnalysis(eqExp, { v: 41 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(eqExp, { v: 42 }).passed, true);

    const neExp = { v: 'match:notEquals:0' };
    assert.equal(validateWithDetailedAnalysis(neExp, { v: 0 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(neExp, { v: 1 }).passed, true);
  });

  test('approximately success & fail', () => {
    const approxExp = { v: 'match:approximately:100:5' };
    assert.equal(validateWithDetailedAnalysis(approxExp, { v: 108 }).passed, false); // diff 8
    assert.equal(validateWithDetailedAnalysis(approxExp, { v: 103 }).passed, true); // diff 3
  });

  test('multipleOf / divisibleBy success & fail', () => {
    const multExp = { v: 'match:multipleOf:5' };
    assert.equal(validateWithDetailedAnalysis(multExp, { v: 7 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(multExp, { v: 20 }).passed, true);

    const divExp = { v: 'match:divisibleBy:4' };
    assert.equal(validateWithDetailedAnalysis(divExp, { v: 10 }).passed, false);
    assert.equal(validateWithDetailedAnalysis(divExp, { v: 12 }).passed, true);
  });

  test('decimalPlaces success & fail', () => {
    const dpExp = { v: 'match:decimalPlaces:2' };
    assert.equal(validateWithDetailedAnalysis(dpExp, { v: 3 }).passed, false); // 0 places
    assert.equal(validateWithDetailedAnalysis(dpExp, { v: 3.14 }).passed, true); // 2 places
  });

  test('dateAfter / dateBefore success & fail', () => {
    const afterExp = { d: 'match:dateAfter:2024-01-01' };
    assert.equal(validateWithDetailedAnalysis(afterExp, { d: '2023-12-31' }).passed, false);
    assert.equal(validateWithDetailedAnalysis(afterExp, { d: '2024-06-01' }).passed, true);

    const beforeExp = { d: 'match:dateBefore:2025-01-01' };
    assert.equal(validateWithDetailedAnalysis(beforeExp, { d: '2025-06-01' }).passed, false);
    assert.equal(validateWithDetailedAnalysis(beforeExp, { d: '2024-12-31' }).passed, true);
  });

  test('dateBetween success & fail', () => {
    const betweenExp = { d: 'match:dateBetween:2024-01-01:2024-12-31' };
    assert.equal(validateWithDetailedAnalysis(betweenExp, { d: '2023-12-31' }).passed, false);
    assert.equal(validateWithDetailedAnalysis(betweenExp, { d: '2024-06-01' }).passed, true);
  });

  test('dateEquals success & fail', () => {
    const eqExp = { d: 'match:dateEquals:2024-05-05' };
    assert.equal(validateWithDetailedAnalysis(eqExp, { d: '2024-05-06' }).passed, false);
    assert.equal(validateWithDetailedAnalysis(eqExp, { d: '2024-05-05' }).passed, true);
  });

  test('dateFormat iso success & fail', () => {
    const formatExp = { d: 'match:dateFormat:iso' };
    assert.equal(validateWithDetailedAnalysis(formatExp, { d: 'not-a-date' }).passed, false);
    assert.equal(validateWithDetailedAnalysis(formatExp, { d: new Date().toISOString() }).passed, true);
  });
});
