#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

// Valid file extensions to scan
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file should be excluded from suppression checks
 */
function shouldExcludeFile(filePath) {
  const basename = path.basename(filePath);
  const normalizedPath = normalizePath(path.relative(projectRoot, filePath));

  // Exclude test files - they might have legitimate suppressions for test utilities
  if (basename.includes('.test.') || basename.includes('.spec.')) {
    return true;
  }

  // Exclude specific files that legitimately need suppressions
  const excludedFiles = [
    'src/services/ethersV6/types/common.ts', // Ethers.js type utilities
  ];

  if (excludedFiles.includes(normalizedPath)) {
    return true;
  }

  return false;
}

/**
 * Find all suppression comments in content and return their details
 */
function findSuppressions(content) {
  const lines = content.split('\n');
  const suppressions = [];

  // Patterns to detect suppression comments
  const suppressionPatterns = [
    // ESLint suppressions
    { pattern: /\/\/\s*eslint-disable-next-line/, type: 'eslint-disable-next-line', severity: 'high' },
    { pattern: /\/\/\s*eslint-disable\b/, type: 'eslint-disable', severity: 'critical' },
    { pattern: /\/\*\s*eslint-disable/, type: '/* eslint-disable */', severity: 'critical' },

    // TypeScript suppressions
    { pattern: /\/\/\s*@ts-ignore\b/, type: '@ts-ignore', severity: 'critical' },
    { pattern: /\/\/\s*@ts-expect-error\b/, type: '@ts-expect-error', severity: 'high' },
    { pattern: /\/\/\s*@ts-nocheck\b/, type: '@ts-nocheck', severity: 'critical' },
    { pattern: /\/\/\s*@ts-check\b/, type: '@ts-check', severity: 'low' }, // This one is actually good, but track it

    // Prettier suppressions
    { pattern: /\/\/\s*prettier-ignore/, type: 'prettier-ignore', severity: 'medium' },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const { pattern, type, severity } of suppressionPatterns) {
      if (pattern.test(line)) {
        suppressions.push({
          line: i + 1,
          content: line.trim(),
          type,
          severity,
        });
      }
    }
  }

  return suppressions;
}

/**
 * Recursively get all source files in a directory
 */
function getSourceFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build, test-utils, etc.
      if (!['node_modules', 'dist', 'build', 'coverage', '.git', '.claude', 'test-utils'].includes(item)) {
        getSourceFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (validExtensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Main analysis function
 */
function runSuppressionCheck() {
  console.log('React Linter/TypeScript Suppression Check');
  console.log('='.repeat(80));
  console.log('');

  // Scan all source files
  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} files in src/...`);
  console.log('');

  const violations = [];

  for (const file of files) {
    // Skip excluded files
    if (shouldExcludeFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = normalizePath(path.relative(projectRoot, file));

    const suppressions = findSuppressions(content);
    if (suppressions.length > 0) {
      for (const suppression of suppressions) {
        violations.push({
          file: relativePath,
          line: suppression.line,
          content: suppression.content,
          type: suppression.type,
          severity: suppression.severity,
        });
      }
    }
  }

  // Report results
  console.log('Linter/TypeScript Suppression Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (violations.length === 0) {
    console.log('✅ No suppression comments found! Excellent code quality!');
  } else {
    console.log(`❌ Found ${violations.length} suppression comment(s)`);
    console.log('');

    // Group by severity
    const bySeverity = {
      critical: violations.filter(v => v.severity === 'critical'),
      high: violations.filter(v => v.severity === 'high'),
      medium: violations.filter(v => v.severity === 'medium'),
      low: violations.filter(v => v.severity === 'low'),
    };

    // Report critical violations
    if (bySeverity.critical.length > 0) {
      console.log(`🚨 CRITICAL VIOLATIONS (${bySeverity.critical.length})`);
      console.log('-'.repeat(80));
      reportViolations(bySeverity.critical);
    }

    // Report high violations
    if (bySeverity.high.length > 0) {
      console.log(`⚠️  HIGH SEVERITY VIOLATIONS (${bySeverity.high.length})`);
      console.log('-'.repeat(80));
      reportViolations(bySeverity.high);
    }

    // Report medium violations
    if (bySeverity.medium.length > 0) {
      console.log(`⚡ MEDIUM SEVERITY VIOLATIONS (${bySeverity.medium.length})`);
      console.log('-'.repeat(80));
      reportViolations(bySeverity.medium);
    }

    // Report low violations (informational)
    if (bySeverity.low.length > 0) {
      console.log(`ℹ️  INFORMATIONAL (${bySeverity.low.length})`);
      console.log('-'.repeat(80));
      reportViolations(bySeverity.low);
    }
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('');
  console.log(`Total suppressions: ${violations.length}`);
  console.log(`  Critical: ${violations.filter(v => v.severity === 'critical').length}`);
  console.log(`  High: ${violations.filter(v => v.severity === 'high').length}`);
  console.log(`  Medium: ${violations.filter(v => v.severity === 'medium').length}`);
  console.log(`  Low: ${violations.filter(v => v.severity === 'low').length}`);
  console.log('');

  if (violations.length === 0) {
    console.log('✅ All suppression checks passed!');
  } else {
    console.log('❌ Suppression violations found.');
    console.log('');
    console.log('Why this matters:');
    console.log('  - Suppressions hide real problems in the code');
    console.log('  - @ts-ignore and eslint-disable mask type errors and code quality issues');
    console.log('  - They accumulate technical debt');
    console.log('  - Make code harder to maintain and refactor');
    console.log('');
    console.log('Better approach:');
    console.log('  - Fix the underlying issue instead of suppressing it');
    console.log('  - If truly necessary, use @ts-expect-error with a comment explaining why');
    console.log('  - @ts-expect-error is better than @ts-ignore (fails if error is fixed)');
    console.log('  - Document WHY the suppression is needed');
  }

  console.log('');

  return violations.length > 0 ? 1 : 0;
}

/**
 * Report violations grouped by file
 */
function reportViolations(violations) {
  // Group by file
  const violationsByFile = {};
  for (const violation of violations) {
    if (!violationsByFile[violation.file]) {
      violationsByFile[violation.file] = [];
    }
    violationsByFile[violation.file].push(violation);
  }

  const sortedFiles = Object.keys(violationsByFile).sort();

  for (const file of sortedFiles) {
    const fileViolations = violationsByFile[file];

    console.log(`  ❌ ${file} (${fileViolations.length} suppression(s))`);

    for (const violation of fileViolations) {
      console.log(`     Line ${violation.line}: ${violation.content}`);
      console.log(`     Type: ${violation.type}`);
    }

    console.log(`     Rule: Never suppress linter or TypeScript errors`);
    console.log(`     Fix: Address the underlying issue instead of suppressing it`);
    console.log('');
  }
}

// Run the check
const exitCode = runSuppressionCheck();
process.exit(exitCode);
