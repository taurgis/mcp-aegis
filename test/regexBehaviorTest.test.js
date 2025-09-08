import { strict as assert } from 'assert';
import { test, describe } from 'node:test';

describe('JavaScript Regex Behavior Investigation', () => {
  test('should understand how JavaScript regex.test() works', () => {
    // This demonstrates the issue
    const text150 = 'A'.repeat(150);

    // Without anchors - matches anywhere in the string
    const regex1 = new RegExp('.{50,100}');
    const result1 = regex1.test(text150);
    console.log(`Pattern .{50,100} matches 150 chars: ${result1}`); // true - because first 50-100 chars match

    // With anchors - must match entire string
    const regex2 = new RegExp('^.{50,100}$');
    const result2 = regex2.test(text150);
    console.log(`Pattern ^.{50,100}$ matches 150 chars: ${result2}`); // false - entire string doesn't match

    // For minimum length, no end anchor needed
    const regex3 = new RegExp('^.{1000,}$');
    const result3a = regex3.test('A'.repeat(1000));
    const result3b = regex3.test('A'.repeat(999));
    console.log(`Pattern ^.{1000,}$ matches 1000 chars: ${result3a}`); // true
    console.log(`Pattern ^.{1000,}$ matches 999 chars: ${result3b}`);   // false

    // The simple pattern without anchors
    const regex4 = new RegExp('.{1000,}');
    const result4a = regex4.test('A'.repeat(1000));
    const result4b = regex4.test('A'.repeat(999));
    console.log(`Pattern .{1000,} matches 1000 chars: ${result4a}`); // true
    console.log(`Pattern .{1000,} matches 999 chars: ${result4b}`);   // false

    assert.ok(true); // Just to make the test pass
  });

  test('should handle multiline strings correctly', () => {
    const multilineText = `Line 1
Line 2
Line 3`.repeat(100); // Make it long

    console.log(`Multiline text length: ${multilineText.length}`);

    // By default, . doesn't match newlines
    const regex1 = new RegExp('.{100,}');
    const result1 = regex1.test(multilineText);
    console.log(`Pattern .{100,} matches multiline: ${result1}`);

    // Use [\s\S] to match any character including newlines
    const regex2 = new RegExp('[\\s\\S]{100,}');
    const result2 = regex2.test(multilineText);
    console.log(`Pattern [\\s\\S]{100,} matches multiline: ${result2}`);

    assert.ok(true);
  });
});
