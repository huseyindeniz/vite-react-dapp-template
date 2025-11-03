#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

console.log('================================================================================');
console.log('Test Coverage Check');
console.log('================================================================================');
console.log('');

// Check if coverage script exists in package.json
let pkgJson;
try {
  pkgJson = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf8'));
} catch (error) {
  console.error('❌ Could not read package.json');
  process.exit(1);
}

const scripts = pkgJson.scripts || {};
if (!scripts.coverage) {
  console.error('❌ No "coverage" script found in package.json');
  console.log('');
  console.log('Add a coverage script to package.json:');
  console.log('  "scripts": {');
  console.log('    "coverage": "vitest run --coverage"');
  console.log('  }');
  console.log('');
  process.exit(1);
}

console.log('Running test coverage (this may take a moment)...');
console.log('');

// Run coverage command
let coverageOutput;
try {
  coverageOutput = execSync('npm run coverage', {
    cwd: CWD,
    encoding: 'utf8',
    stdio: 'pipe',
  });
} catch (error) {
  // Even if tests fail, vitest often still produces coverage output
  coverageOutput = error.stdout || '';

  if (!coverageOutput) {
    console.error('❌ Failed to run coverage command');
    console.error('');
    console.error(error.message);
    process.exit(1);
  }
}

// Parse vitest coverage output
// Vitest outputs a summary table like:
// % Coverage report from v8
// -----------------|---------|----------|---------|---------|-------------------
// File             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
// -----------------|---------|----------|---------|---------|-------------------
// All files        |   45.32 |    38.12 |   42.15 |   45.32 |
// ...

const lines = coverageOutput.split('\n');

let allFilesLine = null;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('All files')) {
    allFilesLine = line;
    break;
  }
}

if (!allFilesLine) {
  console.error('❌ Could not parse coverage output');
  console.log('');
  console.log('Coverage command output:');
  console.log(coverageOutput);
  console.log('');
  process.exit(1);
}

// Parse the "All files" line to extract percentages
// Format: All files        |   45.32 |    38.12 |   42.15 |   45.32 |
const parts = allFilesLine.split('|').map(s => s.trim());

if (parts.length < 5) {
  console.error('❌ Could not parse coverage percentages');
  console.log('');
  console.log('All files line:', allFilesLine);
  console.log('');
  process.exit(1);
}

const statements = parseFloat(parts[1]) || 0;
const branches = parseFloat(parts[2]) || 0;
const functions = parseFloat(parts[3]) || 0;
const linesCov = parseFloat(parts[4]) || 0;

// Calculate average coverage
const avgCoverage = Math.round((statements + branches + functions + linesCov) / 4);

console.log('Coverage Summary');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`Statements:  ${statements.toFixed(2)}%`);
console.log(`Branches:    ${branches.toFixed(2)}%`);
console.log(`Functions:   ${functions.toFixed(2)}%`);
console.log(`Lines:       ${linesCov.toFixed(2)}%`);
console.log('');
console.log(`Average:     ${avgCoverage}%`);
console.log('');

// Check against minimum threshold
const MINIMUM_COVERAGE = 60; // 60% is reasonable baseline

if (avgCoverage >= MINIMUM_COVERAGE) {
  console.log(`✅ Test coverage is ${avgCoverage}% (>= ${MINIMUM_COVERAGE}% threshold)`);
  console.log('');
  console.log('================================================================================');
  console.log(`Summary: Coverage at ${avgCoverage}%`);
  console.log('================================================================================');
  process.exit(0);
}

console.log(`⚠️  Test coverage is ${avgCoverage}% (< ${MINIMUM_COVERAGE}% threshold)`);
console.log('');

// Show detailed coverage report section if available
const reportStartIdx = lines.findIndex(l => l.includes('File') && l.includes('% Stmts'));
const reportEndIdx = lines.findIndex((l, i) => i > reportStartIdx && l.includes('----') && lines[i + 1]?.trim() === '');

if (reportStartIdx !== -1 && reportEndIdx !== -1) {
  console.log('Coverage by File:');
  console.log('--------------------------------------------------------------------------------');
  console.log('');

  // Show top 10 worst covered files
  const reportLines = lines.slice(reportStartIdx + 2, reportEndIdx); // Skip header and separator
  const fileEntries = reportLines
    .filter(l => l.includes('|'))
    .map(l => {
      const parts = l.split('|').map(s => s.trim());
      if (parts.length >= 5) {
        return {
          file: parts[0],
          stmts: parseFloat(parts[1]) || 0,
          branches: parseFloat(parts[2]) || 0,
          funcs: parseFloat(parts[3]) || 0,
          lines: parseFloat(parts[4]) || 0,
        };
      }
      return null;
    })
    .filter(Boolean)
    .filter(entry => entry.file !== 'All files'); // Exclude summary line

  // Sort by average coverage (ascending - worst first)
  fileEntries.sort((a, b) => {
    const avgA = (a.stmts + a.branches + a.funcs + a.lines) / 4;
    const avgB = (b.stmts + b.branches + b.funcs + b.lines) / 4;
    return avgA - avgB;
  });

  // Show top 10 worst covered files
  const worstFiles = fileEntries.slice(0, 10);
  console.log('  Lowest coverage files (top 10):');
  console.log('');
  worstFiles.forEach(entry => {
    const avg = Math.round((entry.stmts + entry.branches + entry.funcs + entry.lines) / 4);
    console.log(`    ${avg}% - ${entry.file}`);
  });
  console.log('');
}

console.log('Recommendations:');
console.log('  1. Add .test.ts(x) files for business logic and utilities');
console.log('  2. Focus on critical paths first (authentication, state management, etc.)');
console.log('  3. Aim for at least 60% coverage baseline');
console.log('  4. Run "npm run coverage" to see detailed coverage report');
console.log('');
console.log('================================================================================');
console.log(`Summary: Coverage at ${avgCoverage}% (target: ${MINIMUM_COVERAGE}%)`);
console.log('================================================================================');

process.exit(1);
