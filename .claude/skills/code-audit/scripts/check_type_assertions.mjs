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
 * Check if a file should be excluded from type assertion checks
 */
function shouldExcludeFile(filePath) {
  const basename = path.basename(filePath);
  const normalizedPath = normalizePath(path.relative(projectRoot, filePath));

  // Exclude type definition files (*.d.ts)
  if (basename.endsWith('.d.ts')) {
    return true;
  }

  // Exclude test files
  if (basename.includes('.test.') || basename.includes('.spec.')) {
    return true;
  }

  // Exclude Storybook files
  if (basename.includes('.stories.')) {
    return true;
  }

  return false;
}

/**
 * Find all type assertion usages in content and return their details
 */
function findTypeAssertions(content) {
  const lines = content.split('\n');
  const usages = [];

  // Patterns to detect type assertions
  const assertionPatterns = [
    {
      pattern: /\bas\s+const\b/g,
      type: 'as const (const assertion)',
      description: 'Use proper types, interfaces, or enums instead'
    },
    {
      pattern: /\bsatisfies\s+/g,
      type: 'satisfies (type assertion)',
      description: 'Use proper type annotations with interfaces or types instead'
    },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip comments
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      continue;
    }

    for (const { pattern, type, description } of assertionPatterns) {
      // Reset regex state
      pattern.lastIndex = 0;

      if (pattern.test(line)) {
        // Reset again to get the match
        pattern.lastIndex = 0;
        const match = line.match(pattern);

        if (match) {
          usages.push({
            line: i + 1,
            content: line.trim(),
            type,
            description,
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
function runTypeAssertionCheck() {
  console.log('TypeScript Type Assertion Check (as const, satisfies)');
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

    const assertionUsages = findTypeAssertions(content);
    if (assertionUsages.length > 0) {
      for (const usage of assertionUsages) {
        violations.push({
          file: relativePath,
          line: usage.line,
          content: usage.content,
          type: usage.type,
          description: usage.description,
          match: usage.match,
        });
      }
    }
  }

  // Report results
  console.log('Type Assertion Violations (as const, satisfies)');
  console.log('-'.repeat(80));
  console.log('');

  if (violations.length === 0) {
    console.log('✅ No type assertion usage found! Excellent type definitions!');
  } else {
    console.log(`❌ Found ${violations.length} type assertion usage(s)`);
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
        console.log(`     Fix: ${violation.description}`);
      }

      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('');
  console.log(`Type assertion usages: ${violations.length} violation(s)`);
  console.log('');

  if (violations.length === 0) {
    console.log('✅ All type assertion checks passed!');
  } else {
    console.log('❌ Type assertion violations found.');
    console.log('');
    console.log('Why this matters:');
    console.log('  - "as const" and "satisfies" are type assertion shortcuts');
    console.log('  - They make code less explicit and harder to understand');
    console.log('  - Proper types/interfaces/enums are self-documenting');
    console.log('  - Reduces code maintainability and type reusability');
    console.log('  - Makes refactoring more difficult');
    console.log('');
    console.log('Better alternatives:');
    console.log('  - Use "interface" for object shapes');
    console.log('  - Use "type" for unions, intersections, and aliases');
    console.log('  - Use "enum" for constant sets of values');
    console.log('  - Use "const" with explicit type annotations');
    console.log('  - Define proper TypeScript types that are reusable');
    console.log('');
    console.log('Examples:');
    console.log('  ❌ BAD:  const colors = ["red", "blue"] as const');
    console.log('  ✅ GOOD: type Color = "red" | "blue"; const colors: Color[] = ["red", "blue"]');
    console.log('');
    console.log('  ❌ BAD:  const config = { ... } satisfies Config');
    console.log('  ✅ GOOD: const config: Config = { ... }');
  }

  console.log('');

  return violations.length > 0 ? 1 : 0;
}

// Run the check
const exitCode = runTypeAssertionCheck();
process.exit(exitCode);
