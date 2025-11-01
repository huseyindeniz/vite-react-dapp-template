#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const CWD = process.cwd();

console.log('Code Quality Check: Redux Saga Patterns');
console.log('================================================================================\n');
console.log('Scanning for inefficient saga patterns...\n');

// Find all saga files
const files = glob.sync('src/**/*{saga,Saga,sagas,Sagas}*.{ts,tsx,js,jsx}', {
  cwd: CWD,
  absolute: true,
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.test.*',
    '**/*.spec.*'
  ]
});

const multipleYieldAllFiles = [];

// Scan each saga file
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const relPath = path.relative(CWD, file);

  let yieldAllCount = 0;
  const yieldAllLines = [];

  lines.forEach((line, idx) => {
    // Match "yield all" or "yield* all"
    if (/yield\s+all\s*\(/.test(line) || /yield\*\s+all\s*\(/.test(line)) {
      yieldAllCount++;
      yieldAllLines.push(idx + 1);
    }
  });

  // Flag files with multiple yield all statements
  if (yieldAllCount > 1) {
    multipleYieldAllFiles.push({
      file: relPath,
      count: yieldAllCount,
      lines: yieldAllLines
    });
  }
}

// Output results
console.log('Saga Pattern Analysis');
console.log('--------------------------------------------------------------------------------\n');

if (multipleYieldAllFiles.length === 0) {
  console.log('✅ No inefficient saga patterns found\n');
  console.log('Great! Your sagas use optimal patterns.');
  process.exit(0);
}

console.log(`❌ Found ${multipleYieldAllFiles.length} file(s) with inefficient saga patterns\n`);

console.log('🟡 Multiple "yield all" Statements');
console.log('--------------------------------------------------------------------------------\n');
console.log('Issue: Multiple "yield all" statements in the same saga function.');
console.log('Impact: Performance overhead - effects are started sequentially instead of truly parallel.\n');

multipleYieldAllFiles.forEach(item => {
  console.log(`  ⚠️  ${item.file}`);
  console.log(`     → ${item.count} separate "yield all" statement(s) at lines: ${item.lines.join(', ')}`);
  console.log('');
});

console.log('--------------------------------------------------------------------------------');
console.log(`Summary: ${multipleYieldAllFiles.length} file(s) with inefficient patterns\n`);
console.log('Recommendation:');
console.log('  Combine multiple "yield all" into a single statement:\n');
console.log('  ❌ BAD:');
console.log('     yield all([fork(saga1), fork(saga2)]);');
console.log('     yield all([fork(saga3), fork(saga4)]);  // Waits for first to complete!\n');
console.log('  ✅ GOOD:');
console.log('     yield all([');
console.log('       fork(saga1),');
console.log('       fork(saga2),');
console.log('       fork(saga3),');
console.log('       fork(saga4)');
console.log('     ]);  // All start truly in parallel\n');
console.log('Benefits:');
console.log('  - True parallel execution');
console.log('  - Better performance');
console.log('  - Cleaner saga structure\n');

process.exit(1);
