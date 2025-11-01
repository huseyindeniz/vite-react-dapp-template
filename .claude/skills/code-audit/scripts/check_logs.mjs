#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const CWD = process.cwd();
const DEBUG_LOG_RE = /log\.debug\(/g;
const CONSOLE_RE = /console\.(log|warn|error|info|debug)\(/g;

console.log('Code Quality Check: Console & Debug Logs');
console.log('================================================================================\n');
console.log('Scanning for console.log and log.debug statements...\n');

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

const debugLogs = [];
const consoleLogs = [];

// Scan each file
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(CWD, file);

  // Count debug logs
  const debugMatches = content.match(DEBUG_LOG_RE);
  if (debugMatches) {
    debugLogs.push({
      file: relPath,
      count: debugMatches.length
    });
  }

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
debugLogs.sort((a, b) => b.count - a.count);
consoleLogs.sort((a, b) => b.count - a.count);

const totalDebugLogs = debugLogs.reduce((sum, f) => sum + f.count, 0);
const totalConsoleLogs = consoleLogs.reduce((sum, f) => sum + f.count, 0);
const totalLogs = totalDebugLogs + totalConsoleLogs;

// Output results
console.log('Production Logging Issues');
console.log('--------------------------------------------------------------------------------\n');

if (totalLogs === 0) {
  console.log('✅ No console.log or log.debug statements found in production code\n');
  console.log('Great! Your codebase uses proper logging practices.');
  process.exit(0);
}

console.log(`❌ Found ${totalLogs} logging statement(s) in production code\n`);
console.log('Summary:');
console.log(`  - log.debug():     ${totalDebugLogs} in ${debugLogs.length} file(s)`);
console.log(`  - console.log():   ${totalConsoleLogs} in ${consoleLogs.length} file(s)`);
console.log('');

// Show console.log violations (higher severity)
if (consoleLogs.length > 0) {
  console.log('🔴 Critical: console.log() Usage (Should Not Be in Production)');
  console.log('--------------------------------------------------------------------------------\n');
  consoleLogs.slice(0, 10).forEach(item => {
    console.log(`  ❌ ${item.file}`);
    console.log(`     → ${item.count} console.log() statement(s)`);
    console.log('');
  });
  if (consoleLogs.length > 10) {
    console.log(`  ...and ${consoleLogs.length - 10} more file(s) with console.log()\n`);
  }
}

// Show debug logs (medium severity)
if (debugLogs.length > 0) {
  console.log('🟡 Warning: log.debug() Usage (Performance & Security Risk)');
  console.log('--------------------------------------------------------------------------------\n');
  debugLogs.slice(0, 10).forEach(item => {
    console.log(`  ⚠️  ${item.file}`);
    console.log(`     → ${item.count} log.debug() statement(s)`);
    console.log('');
  });
  if (debugLogs.length > 10) {
    console.log(`  ...and ${debugLogs.length - 10} more file(s) with log.debug()\n`);
  }
}

console.log('--------------------------------------------------------------------------------');
console.log(`Summary: ${totalLogs} logging statement(s) found\n`);
console.log('Issues:');
console.log('  - console.log() exposes information in browser console');
console.log('  - log.debug() may leak sensitive data if not filtered');
console.log('  - Performance overhead in production builds');
console.log('');
console.log('Recommendation:');
console.log('  1. Remove console.log() statements (use proper logger)');
console.log('  2. Configure log level filtering for production');
console.log('  3. Use environment-based conditional logging');
console.log('  4. Consider using a proper logging library with levels\n');

process.exit(1);
