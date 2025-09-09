import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import { matchPattern } from '../src/test-engine/matchers/patterns.js';

describe('Not Pattern Matching', () => {
  test('should negate arrayContains pattern', () => {
    const array = ['apple', 'banana', 'cherry'];
    
    // Normal arrayContains should work
    assert.equal(matchPattern('arrayContains:apple', array), true);
    assert.equal(matchPattern('arrayContains:grape', array), false);
    
    // not:arrayContains should be negated
    assert.equal(matchPattern('not:arrayContains:apple', array), false);
    assert.equal(matchPattern('not:arrayContains:grape', array), true);
  });

  test('should negate contains pattern', () => {
    const text = 'Hello, World!';
    
    // Normal contains should work
    assert.equal(matchPattern('contains:Hello', text), true);
    assert.equal(matchPattern('contains:Goodbye', text), false);
    
    // not:contains should be negated
    assert.equal(matchPattern('not:contains:Hello', text), false);
    assert.equal(matchPattern('not:contains:Goodbye', text), true);
  });

  test('should negate startsWith pattern', () => {
    const text = 'Hello, World!';
    
    // Normal startsWith should work
    assert.equal(matchPattern('startsWith:Hello', text), true);
    assert.equal(matchPattern('startsWith:World', text), false);
    
    // not:startsWith should be negated
    assert.equal(matchPattern('not:startsWith:Hello', text), false);
    assert.equal(matchPattern('not:startsWith:World', text), true);
  });

  test('should negate endsWith pattern', () => {
    const text = 'Hello, World!';
    
    // Normal endsWith should work
    assert.equal(matchPattern('endsWith:!', text), true);
    assert.equal(matchPattern('endsWith:?', text), false);
    
    // not:endsWith should be negated
    assert.equal(matchPattern('not:endsWith:!', text), false);
    assert.equal(matchPattern('not:endsWith:?', text), true);
  });

  test('should negate type pattern', () => {
    const number = 42;
    const string = 'hello';
    
    // Normal type should work
    assert.equal(matchPattern('type:number', number), true);
    assert.equal(matchPattern('type:string', number), false);
    
    // not:type should be negated
    assert.equal(matchPattern('not:type:number', number), false);
    assert.equal(matchPattern('not:type:string', number), true);
    assert.equal(matchPattern('not:type:number', string), true);
    assert.equal(matchPattern('not:type:string', string), false);
  });

  test('should negate arrayLength pattern', () => {
    const array = [1, 2, 3];
    
    // Normal arrayLength should work
    assert.equal(matchPattern('arrayLength:3', array), true);
    assert.equal(matchPattern('arrayLength:5', array), false);
    
    // not:arrayLength should be negated
    assert.equal(matchPattern('not:arrayLength:3', array), false);
    assert.equal(matchPattern('not:arrayLength:5', array), true);
  });

  test('should negate length pattern', () => {
    const string = 'hello';
    const array = [1, 2, 3];
    
    // Normal length should work
    assert.equal(matchPattern('length:5', string), true);
    assert.equal(matchPattern('length:3', array), true);
    assert.equal(matchPattern('length:10', string), false);
    
    // not:length should be negated
    assert.equal(matchPattern('not:length:5', string), false);
    assert.equal(matchPattern('not:length:3', array), false);
    assert.equal(matchPattern('not:length:10', string), true);
  });

  test('should negate regex pattern', () => {
    const text = 'Hello123World';
    
    // Normal regex should work
    assert.equal(matchPattern('regex:\\d+', text), true);
    assert.equal(matchPattern('regex:^[A-Z]', text), true);
    assert.equal(matchPattern('regex:xyz', text), false);
    
    // not:regex should be negated
    assert.equal(matchPattern('not:regex:\\d+', text), false);
    assert.equal(matchPattern('not:regex:^[A-Z]', text), false);
    assert.equal(matchPattern('not:regex:xyz', text), true);
  });

  test('should negate exists pattern', () => {
    const value = 'something';
    const nullValue = null;
    const undefinedValue = undefined;
    
    // Normal exists should work
    assert.equal(matchPattern('exists', value), true);
    assert.equal(matchPattern('exists', nullValue), false);
    assert.equal(matchPattern('exists', undefinedValue), false);
    
    // not:exists should be negated
    assert.equal(matchPattern('not:exists', value), false);
    assert.equal(matchPattern('not:exists', nullValue), true);
    assert.equal(matchPattern('not:exists', undefinedValue), true);
  });

  test('should negate count pattern', () => {
    const array = [1, 2, 3];
    const object = { a: 1, b: 2 };
    
    // Normal count should work
    assert.equal(matchPattern('count:3', array), true);
    assert.equal(matchPattern('count:2', object), true);
    assert.equal(matchPattern('count:5', array), false);
    
    // not:count should be negated
    assert.equal(matchPattern('not:count:3', array), false);
    assert.equal(matchPattern('not:count:2', object), false);
    assert.equal(matchPattern('not:count:5', array), true);
  });

  test('should handle edge cases correctly', () => {
    // Empty arrays
    const emptyArray = [];
    assert.equal(matchPattern('not:arrayContains:anything', emptyArray), true);
    assert.equal(matchPattern('not:arrayLength:0', emptyArray), false);
    
    // Empty strings
    const emptyString = '';
    assert.equal(matchPattern('not:contains:anything', emptyString), true);
    assert.equal(matchPattern('not:length:0', emptyString), false);
  });
});
