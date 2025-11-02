#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const CWD = process.cwd();
const CONSOLE_RE = /console\.(log|warn|error|info|debug)\(/g;

console.log('Code Quality Check: Console Usage');
console.log('================================================================================\n');
console.log('Scanning for console.* statements (console.log, console.error, etc.)...\n');
console.log('Note: log.debug() from loglevel is OK - it\'s disabled in production.\n');

// Find all source files (exclude test and story files)
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  cwd: CWD,
  absolute: true,
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.stories.*'
  ]
});

const consoleLogs = [];

// Scan each file
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(CWD, file);

  // Count console logs
  const consoleMatches = content.match(CONSOLE_RE);
  if (consoleMatches) {
    consoleLogs.push({
      file: relPath,
      count: consoleMatches.length
    });
  }
}

// Sort by count (highest first)
consoleLogs.sort((a, b) => b.count - a.count);

const totalConsoleLogs = consoleLogs.reduce((sum, f) => sum + f.count, 0);

// Output results
console.log('Console Usage Violations');
console.log('--------------------------------------------------------------------------------\n');

if (totalConsoleLogs === 0) {
  console.log('✅ No console.* statements found in production code\n');
  console.log('Great! Your codebase uses proper logging practices.');
  console.log('(Using log.debug() from loglevel is perfectly fine)');
  process.exit(0);
}

console.log(`❌ Found ${totalConsoleLogs} console.* statement(s) in production code\n`);

// Show console violations
console.log('🔴 Critical: console.* Usage (Forbidden in This Project)');
console.log('--------------------------------------------------------------------------------\n');
consoleLogs.forEach(item => {
  console.log(`  ❌ ${item.file}`);
  console.log(`     → ${item.count} console.* statement(s)`);
  console.log('');
});

console.log('--------------------------------------------------------------------------------');
console.log(`Summary: ${totalConsoleLogs} console.* statement(s) found\n`);
console.log('Issues:');
console.log('  - console.* statements are FORBIDDEN in this project');
console.log('  - They expose information in browser console without filtering');
console.log('  - No control over log levels in production');
console.log('');
console.log('Recommendation:');
console.log('  1. Replace ALL console.* with log.* from loglevel');
console.log('  2. Use log.debug() for debug messages (auto-disabled in prod)');
console.log('  3. Use log.info(), log.warn(), log.error() for other levels');
console.log('  4. loglevel is already configured in this project\n');

process.exit(1);
