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

// Minimum occurrences to flag as duplicate magic string
const MIN_OCCURRENCES = 2;

// JavaScript/Web platform literals - these are NOT magic strings
// These are language/platform constants that will never change
const JS_PLATFORM_LITERALS = [
  '/',           // Root path (web standard)
  'undefined',   // typeof result (JS standard)
];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file should be excluded from magic string checks
 */
function shouldExcludeFile(filePath) {
  const basename = path.basename(filePath);
  const normalizedPath = normalizePath(path.relative(projectRoot, filePath));

  // Exclude test files
  if (basename.includes('.test.') || basename.includes('.spec.')) {
    return true;
  }

  // Exclude Storybook files
  if (basename.includes('.stories.')) {
    return true;
  }

  // Exclude test-utils directory
  if (normalizedPath.startsWith('src/test-utils/')) {
    return true;
  }

  // Exclude type definition files
  if (basename.endsWith('.d.ts')) {
    return true;
  }

  return false;
}

/**
 * Extract string literals from comparisons in a line
 * Returns array of { value, line, content }
 */
function extractComparisonStrings(line, lineNumber) {
  const results = [];
  const trimmedLine = line.trim();

  // Skip comments and imports
  if (
    trimmedLine.startsWith('//') ||
    trimmedLine.startsWith('*') ||
    trimmedLine.startsWith('/*') ||
    trimmedLine.startsWith('import ')
  ) {
    return results;
  }

  // Pattern: string comparisons - status === "success", type !== "admin"
  const stringComparisonPattern = /(!==|===)\s*["']([^"']+)["']/g;
  let match;
  while ((match = stringComparisonPattern.exec(line)) !== null) {
    results.push({
      value: match[2],
      line: lineNumber,
      content: trimmedLine,
      context: 'comparison',
    });
  }

  return results;
}

/**
 * Extract hardcoded URLs from HTTP calls
 * Returns array of { value, line, content }
 */
function extractHttpUrls(line, lineNumber) {
  const results = [];
  const trimmedLine = line.trim();

  // Skip comments and imports
  if (
    trimmedLine.startsWith('//') ||
    trimmedLine.startsWith('*') ||
    trimmedLine.startsWith('/*') ||
    trimmedLine.startsWith('import ')
  ) {
    return results;
  }

  // Pattern: fetch("url"), axios.get("url"), etc.
  const httpCallPattern = /(fetch|axios|api|http)(?:\.(get|post|put|delete|patch))?\s*\(\s*["']([^"']+)["']/g;
  let match;
  while ((match = httpCallPattern.exec(line)) !== null) {
    results.push({
      value: match[3],
      line: lineNumber,
      content: trimmedLine,
      context: 'http-call',
    });
  }

  return results;
}

/**
 * Get all source files in a directory recursively
 */
function getSourceFiles(dir) {
  let results = [];

  try {
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Skip node_modules
        if (file === 'node_modules') {
          continue;
        }
        results = results.concat(getSourceFiles(filePath));
      } else {
        const ext = path.extname(file);
        if (validExtensions.includes(ext)) {
          results.push(filePath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return results;
}

/**
 * Main check function - Duplicate String Detection approach
 * Finds strings used in multiple files (potential magic strings)
 */
function checkMagicStrings() {
  console.log('Magic Strings Check (Duplicate String Detection)');
  console.log('='.repeat(80));
  console.log('');

  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} source files in src/...`);
  console.log('');

  // Map to track string occurrences: string -> [{ file, line, content, context }]
  const stringOccurrences = new Map();

  // Collect all string literals from all files
  for (const file of files) {
    if (shouldExcludeFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    const relativePath = normalizePath(path.relative(projectRoot, file));

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Extract comparison strings
      const comparisonStrings = extractComparisonStrings(line, lineNumber);
      for (const item of comparisonStrings) {
        const key = item.value;
        if (!stringOccurrences.has(key)) {
          stringOccurrences.set(key, []);
        }
        stringOccurrences.get(key).push({
          file: relativePath,
          line: item.line,
          content: item.content,
          context: item.context,
        });
      }

      // Extract HTTP URLs
      const httpUrls = extractHttpUrls(line, lineNumber);
      for (const item of httpUrls) {
        const key = item.value;
        if (!stringOccurrences.has(key)) {
          stringOccurrences.set(key, []);
        }
        stringOccurrences.get(key).push({
          file: relativePath,
          line: item.line,
          content: item.content,
          context: item.context,
        });
      }
    }
  }

  // Filter to only strings that appear in multiple files
  const duplicates = [];
  for (const [stringValue, occurrences] of stringOccurrences) {
    // Skip JavaScript/Web platform literals
    if (JS_PLATFORM_LITERALS.includes(stringValue)) {
      continue;
    }

    // Get unique files
    const uniqueFiles = new Set(occurrences.map(o => o.file));
    if (uniqueFiles.size >= MIN_OCCURRENCES) {
      duplicates.push({
        value: stringValue,
        occurrences,
        fileCount: uniqueFiles.size,
      });
    }
  }

  // Sort by file count (most duplicated first)
  duplicates.sort((a, b) => b.fileCount - a.fileCount);

  if (duplicates.length === 0) {
    console.log('✅ No duplicate magic strings found!\n');
    console.log('='.repeat(80));
    console.log('Summary');
    console.log('='.repeat(80));
    console.log('');
    console.log('Duplicate strings found: 0');
    console.log('');
    console.log('✅ All magic string checks passed!');
    return true;
  }

  console.log('Duplicate Magic Strings Found');
  console.log('-'.repeat(80));
  console.log('');
  console.log(`Strings appearing in ${MIN_OCCURRENCES}+ files should be extracted to constants/enums.`);
  console.log('');

  let totalViolations = 0;

  for (const { value, occurrences, fileCount } of duplicates) {
    console.log(`  ❌ "${value}" (found in ${fileCount} files)`);

    for (const { file, line, content } of occurrences) {
      console.log(`     ${file}:${line}`);
      console.log(`       ${content}`);
    }

    console.log(`     Suggestion: Extract to enum/constant`);
    console.log('');
    totalViolations++;
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Duplicate strings: ${duplicates.length}`);
  console.log(`Total occurrences: ${duplicates.reduce((sum, d) => sum + d.occurrences.length, 0)}`);
  console.log('');
  console.log('❌ Duplicate magic strings found.');
  console.log('');
  console.log('Why this matters:');
  console.log('  - Same string in multiple files = typo risk');
  console.log('  - No type safety or autocomplete');
  console.log('  - Refactoring requires finding all occurrences');
  console.log('  - Extract to enum/constant for safety');
  console.log('');
  console.log('The Rule:');
  console.log('  - ❌ status === "success" (in multiple files)');
  console.log('  - ✅ enum Status { SUCCESS = "success" }');
  console.log('  - ✅ status === Status.SUCCESS');
  console.log('');
  console.log('  - ❌ fetch("/api/users") (in multiple files)');
  console.log('  - ✅ const API_USERS = "/api/users";');
  console.log('  - ✅ fetch(API_USERS)');

  return false;
}

// Run the check
const passed = checkMagicStrings();
process.exit(passed ? 0 : 1);
