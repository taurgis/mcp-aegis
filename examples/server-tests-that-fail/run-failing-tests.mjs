#!/usr/bin/env node

/**
 * Test Runner for Failing Tests - MCP Aegis
 *
 * This script runs all failing tests to demonstrate MCP Aegis's
 * comprehensive error detection and reporting capabilities.
 */

import { spawn } from 'child_process';
import process from 'process';
const DEBUG = process.env.FAILING_SUITES_DEBUG === '1' || process.env.FAILING_SUITES_DEBUG === 'true';
function dlog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function runAegis(args, { collect = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', args, { stdio: collect ? ['ignore', 'pipe', 'pipe'] : 'inherit' });
    let stdout = '';
    let stderr = '';
    if (collect) {
      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });
    }
    child.on('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
    child.on('error', reject);
  });
}

// Test configurations
const testSuites = [
  // Filesystem Server Tests
  {
    name: 'Type Pattern Failures',
    file: 'examples/server-tests-that-fail/failing-type-patterns.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'String Pattern Failures',
    file: 'examples/server-tests-that-fail/failing-string-patterns.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'Array Pattern Failures',
    file: 'examples/server-tests-that-fail/failing-array-patterns.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'Missing match: Prefix Failures',
    file: 'examples/server-tests-that-fail/failing-match.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'Field Extraction Failures',
    file: 'examples/server-tests-that-fail/failing-field-extraction.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'Partial Matching Failures',
    file: 'examples/server-tests-that-fail/failing-partial-matching.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'Negation Pattern Failures',
    file: 'examples/server-tests-that-fail/failing-negation-patterns.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'Error Response Failures',
    file: 'examples/server-tests-that-fail/failing-error-responses.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  {
    name: 'stderr Pattern Failures',
    file: 'examples/server-tests-that-fail/failing-stderr-patterns.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },

  // Data Patterns Server Tests
  {
    name: 'Numeric Pattern Failures',
    file: 'examples/server-tests-that-fail/failing-numeric-patterns.test.mcp.yml',
    config: 'examples/server-tests-that-fail/data-patterns-server.config.json',
    server: 'data-patterns',
  },
  {
    name: 'Date Pattern Failures',
    file: 'examples/server-tests-that-fail/failing-date-patterns.test.mcp.yml',
    config: 'examples/server-tests-that-fail/data-patterns-server.config.json',
    server: 'data-patterns',
  },
  {
    name: 'Cross-Field Validation Failures',
    file: 'examples/server-tests-that-fail/failing-cross-field.test.mcp.yml',
    config: 'examples/server-tests-that-fail/data-patterns-server.config.json',
    server: 'data-patterns',
  },

  // Complex Combinations (filesystem server)
  {
    name: 'Complex Pattern Combination Failures',
    file: 'examples/server-tests-that-fail/failing-complex-combinations.test.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
  // Structural field presence only (no patterns)
  {
    name: 'Structural Field Matching Failures',
    file: 'examples/server-tests-that-fail/failing-field-matching.tst.mcp.yml',
    config: 'examples/server-tests-that-fail/filesystem-server.config.json',
    server: 'filesystem',
  },
];

async function runTest(testSuite) {
  console.log(`\n🧪 Running: ${testSuite.name} (${testSuite.server} server)`);
  console.log(`📁 File: ${testSuite.file}`);

  // Single JSON run for reliable counts
  const args = [
    'bin/aegis.js',
    testSuite.file,
    '--config', testSuite.config,
    '--json',
    '--quiet',
  ];
  dlog('Running aegis with args:', args.join(' '));
  const { code, stdout: rawJson, stderr } = await runAegis(args, { collect: true });
  dlog('Exit code:', code, 'stdout length:', rawJson.length, 'stderr length:', stderr.length);
  if (DEBUG) {
    dlog('STDOUT PREVIEW:', rawJson.slice(0, 250));
    if (stderr.length) {
      dlog('STDERR PREVIEW:', stderr.slice(0, 250));
    }
  }
  let passed = 0; let failed = 0; let total = 0; let parseError = null;
  // Fast summary extraction from beginning of JSON (handles truncated JSON output)
  function extractSummary(src) {
    const summaryIdx = src.indexOf('"summary"');
    if (summaryIdx === -1) {
      return null;
    }
    const braceStart = src.indexOf('{', summaryIdx);
    if (braceStart === -1) {
      return null;
    }
    let depth = 0;
    for (let i = braceStart; i < src.length; i += 1) {
      const ch = src[i];
      if (ch === '{') {
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
      }
      if (depth === 0) {
        const objText = src.slice(braceStart, i + 1);
        try {
          const obj = JSON.parse(objText);
          return obj;
        } catch {
          dlog('Summary JSON parse failed snippet', objText.slice(0, 120));
          return null;
        }
      }
      if (i - braceStart > 1200) {
        break; // Safety guard (summary should be tiny)
      }
    }
    return null;
  }
  const headPortion = rawJson.slice(0, 2000); // Only need the first couple KB
  const summaryObj = extractSummary(headPortion);
  if (summaryObj) {
    passed = Number(summaryObj.passed) || 0;
    failed = Number(summaryObj.failed) || 0;
    total = Number(summaryObj.total) || (passed + failed);
    dlog('Extracted summary counts', { passed, failed, total });
  } else {
    parseError = 'Summary extraction failed';
    dlog('Summary extraction failed; raw head preview', headPortion.slice(0, 300));
  }
  dlog('Counts computed', { passed, failed, total, parseError });

  const unexpectedPasses = passed > 0;
  if (code === 1 && !unexpectedPasses) {
    if (failed === 0) {
      console.log('❌ UNEXPECTED (no failures detected, expected all to fail)');
    } else {
      console.log(`✅ EXPECTED FAILURES (0 passed / ${failed} failed)`);
    }
  } else if (code === 1 && unexpectedPasses) {
    console.log(`⚠️  PARTIAL (${passed} passed / ${failed} failed — passes unexpected)`);
  } else {
    console.log(`❌ UNEXPECTED RESULT (exit code: ${code})`);
    if (parseError) {
      console.log(`   JSON parse issue: ${parseError}`);
    }
  }
  return {
    suite: testSuite.name,
    file: testSuite.file,
    exitCode: code,
    passed,
    failed,
    total,
    unexpectedPasses,
    parseError,
  };
}

async function runAllTests() {
  console.log('🎯 MCP Aegis - Comprehensive Failing Tests Runner');
  console.log('====================================================');
  console.log('This script demonstrates MCP Aegis\'s error detection capabilities');
  console.log('by running tests that are designed to fail. Success = All tests fail!\n');

  const results = [];
  let totalFailingTests = 0;

  for (const testSuite of testSuites) {
    const result = await runTest(testSuite);
    results.push(result);
    totalFailingTests += result.failed;
  }

  console.log('\n📊 SUMMARY RESULTS');
  console.log('==================');
  console.log(`🧪 Test Suites Run: ${testSuites.length}`);
  console.log(`❌ Total Failing Tests: ${totalFailingTests}`);
  console.log('✅ Expected Behavior: ALL tests should fail (0 passed in each suite)');

  const successfulSuites = results.filter(r => r.exitCode === 1 && !r.unexpectedPasses).length;
  const partialSuites = results.filter(r => r.exitCode === 1 && r.unexpectedPasses).length;
  const unexpectedSuites = results.filter(r => r.exitCode !== 1).length;

  console.log('\n🎯 Suite Results:');
  console.log(`   ✅ Suites that failed as expected: ${successfulSuites}/${testSuites.length}`);
  if (partialSuites > 0) {
    console.log(`   ⚠️  Suites with unexpected passing tests: ${partialSuites}`);
  }
  if (unexpectedSuites > 0) {
    console.log(`   ❌ Suites with unexpected exit codes: ${unexpectedSuites}`);
  }

  console.log('\n🎓 Key Learnings:');
  console.log('• MCP Aegis detects 50+ types of validation failures');
  console.log('• Detailed error messages help identify exact issues');
  console.log('• Pattern matching covers all data types and structures');
  console.log('• Error reporting includes suggestions and corrections');

  if (successfulSuites === testSuites.length) {
    console.log('\n🎉 SUCCESS! All failing tests behaved as expected.');
    console.log('   This demonstrates MCP Aegis\'s robust error detection.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some test suites had unexpected results (passes or exit codes).');
    console.log('   Check individual suite outputs above for details.');
    // Exit with non-zero if any suite had unexpected passes or exit code not 1
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}
