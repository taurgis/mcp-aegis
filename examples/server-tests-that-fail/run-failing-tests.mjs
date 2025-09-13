#!/usr/bin/env node

/**
 * Test Runner for Failing Tests - MCP Conductor
 *
 * This script runs all failing tests to demonstrate MCP Conductor's
 * comprehensive error detection and reporting capabilities.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

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
];

async function runTest(testSuite) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Running: ${testSuite.name} (${testSuite.server} server)`);
    console.log(`📁 File: ${testSuite.file}`);

    const args = [
      'bin/conductor.js',
      testSuite.file,
      '--config', testSuite.config,
      '--errors-only',
      '--quiet',
    ];

    const child = spawn('node', args, {
      cwd: projectRoot,
      stdio: 'pipe',
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      const lines = output.split('\n');
      const resultLine = lines.find(line => line.includes('✗') && line.includes('failed'));
      const totalTests = resultLine ? resultLine.match(/(\d+) failed/)?.[1] : '?';

      if (code === 1) {
        console.log(`✅ PASSED (${totalTests} tests failed as expected)`);
      } else {
        console.log(`❌ UNEXPECTED RESULT (exit code: ${code})`);
        if (errorOutput) {
          console.log(`Error output: ${errorOutput.substring(0, 200)}...`);
        }
      }

      resolve({ testSuite, exitCode: code, totalTests });
    });
  });
}

async function runAllTests() {
  console.log('🎯 MCP Conductor - Comprehensive Failing Tests Runner');
  console.log('====================================================');
  console.log('This script demonstrates MCP Conductor\'s error detection capabilities');
  console.log('by running tests that are designed to fail. Success = All tests fail!\n');

  const results = [];
  let totalFailingTests = 0;

  for (const testSuite of testSuites) {
    const result = await runTest(testSuite);
    results.push(result);
    if (result.totalTests && !isNaN(parseInt(result.totalTests))) {
      totalFailingTests += parseInt(result.totalTests);
    }
  }

  console.log('\n📊 SUMMARY RESULTS');
  console.log('==================');
  console.log(`🧪 Test Suites Run: ${testSuites.length}`);
  console.log(`❌ Total Failing Tests: ${totalFailingTests}`);
  console.log(`✅ Expected Behavior: ALL tests should fail`);

  const successfulSuites = results.filter(r => r.exitCode === 1).length;
  const unexpectedSuites = results.filter(r => r.exitCode !== 1).length;

  console.log(`\n🎯 Suite Results:`);
  console.log(`   ✅ Suites that failed as expected: ${successfulSuites}/${testSuites.length}`);
  if (unexpectedSuites > 0) {
    console.log(`   ❌ Suites with unexpected results: ${unexpectedSuites}`);
  }

  console.log('\n🎓 Key Learnings:');
  console.log('• MCP Conductor detects 50+ types of validation failures');
  console.log('• Detailed error messages help identify exact issues');
  console.log('• Pattern matching covers all data types and structures');
  console.log('• Error reporting includes suggestions and corrections');

  if (successfulSuites === testSuites.length) {
    console.log('\n🎉 SUCCESS! All failing tests behaved as expected.');
    console.log('   This demonstrates MCP Conductor\'s robust error detection.');
  } else {
    console.log('\n⚠️  Some test suites had unexpected results.');
    console.log('   Check individual suite outputs above for details.');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}
