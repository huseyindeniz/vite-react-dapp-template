#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

// Valid file extensions to scan (TypeScript files)
const validExtensions = ['.ts', '.tsx'];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file should be excluded from any usage checks
 */
function shouldExcludeFile(filePath) {
  const basename = path.basename(filePath);
  const normalizedPath = normalizePath(path.relative(projectRoot, filePath));

  // Exclude type definition files (*.d.ts) - these might legitimately use 'any' for external typings
  if (basename.endsWith('.d.ts')) {
    return true;
  }

  // Exclude test files - they might use 'any' for mocks
  if (basename.includes('.test.') || basename.includes('.spec.')) {
    return true;
  }

  // Exclude specific files that legitimately need 'any' for library compatibility
  const excludedFiles = [
    'src/services/ethersV6/types/common.ts', // Ethers.js type utilities
  ];

  if (excludedFiles.includes(normalizedPath)) {
    return true;
  }

  return false;
}

/**
 * Find all 'any' type usages in content and return their details
 */
function findAnyUsages(content) {
  const lines = content.split('\n');
  const usages = [];

  // Patterns to detect 'any' type usage
  const anyPatterns = [
    { pattern: /:\s*any\b/, type: ': any (type annotation)' },
    { pattern: /<any>/gi, type: '<any> (generic type)' },
    { pattern: /\bas\s+any\b/, type: 'as any (type assertion)' },
    { pattern: /Array<any>/gi, type: 'Array<any>' },
    { pattern: /any\[\]/, type: 'any[] (array)' },
    { pattern: /Record<any,/gi, type: 'Record<any, ...>' },
    { pattern: /Record<\w+,\s*any>/gi, type: 'Record<..., any>' },
    { pattern: /Promise<any>/gi, type: 'Promise<any>' },
    { pattern: /\bany\s*,/, type: 'any (in type parameters)' },
    { pattern: /,\s*any\b/, type: 'any (in type parameters)' },
    { pattern: /\(\s*\.\.\.\w+:\s*any\[\]\s*\)/, type: '(...args: any[])' },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip comments
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      continue;
    }

    for (const { pattern, type } of anyPatterns) {
      if (pattern.test(line)) {
        // Get the match for better context
        const match = line.match(pattern);
        if (match) {
          usages.push({
            line: i + 1,
            content: line.trim(),
            type,
            match: match[0],
          });
        }
      }
    }
  }

  return usages;
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
function runAnyUsageCheck() {
  console.log('React TypeScript "any" Usage Check');
  console.log('='.repeat(80));
  console.log('');

  // Scan all source files
  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} TypeScript files in src/...`);
  console.log('');

  const violations = [];

  for (const file of files) {
    // Skip excluded files
    if (shouldExcludeFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = normalizePath(path.relative(projectRoot, file));

    const anyUsages = findAnyUsages(content);
    if (anyUsages.length > 0) {
      for (const usage of anyUsages) {
        violations.push({
          file: relativePath,
          line: usage.line,
          content: usage.content,
          type: usage.type,
          match: usage.match,
        });
      }
    }
  }

  // Report results
  console.log('TypeScript "any" Type Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (violations.length === 0) {
    console.log('✅ No "any" type usage found! Excellent type safety!');
  } else {
    console.log(`❌ Found ${violations.length} usage(s) of "any" type`);
    console.log('');

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

      console.log(`  ❌ ${file} (${fileViolations.length} violation(s))`);

      for (const violation of fileViolations) {
        console.log(`     Line ${violation.line}: ${violation.content}`);
        console.log(`     Type: ${violation.type}`);
      }

      console.log(`     Rule: Never use "any" type - it defeats TypeScript's type safety`);
      console.log(`     Fix: Use proper types, generics, or "unknown" for truly dynamic types`);
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('');
  console.log(`"any" type usages: ${violations.length} violation(s)`);
  console.log('');

  if (violations.length === 0) {
    console.log('✅ All "any" type checks passed!');
  } else {
    console.log('❌ "any" type violations found.');
    console.log('');
    console.log('Why this matters:');
    console.log('  - "any" disables TypeScript type checking');
    console.log('  - Leads to runtime errors that could be caught at compile time');
    console.log('  - Makes refactoring dangerous and error-prone');
    console.log('  - Reduces code maintainability and documentation');
    console.log('');
    console.log('Better alternatives:');
    console.log('  - Use specific types: string, number, MyInterface, etc.');
    console.log('  - Use generics: <T> for reusable type-safe code');
    console.log('  - Use "unknown" for truly dynamic types (forces type checking)');
    console.log('  - Use union types: string | number | null');
    console.log('  - Use conditional types for complex scenarios');
  }

  console.log('');

  return violations.length > 0 ? 1 : 0;
}

// Run the check
const exitCode = runAnyUsageCheck();
process.exit(exitCode);
