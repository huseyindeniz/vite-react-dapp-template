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
 * Check if a file should be excluded from magic number checks
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

  // Exclude config files (often have magic numbers)
  if (normalizedPath.includes('/config/')) {
    return true;
  }

  return false;
}

/**
 * Find magic numbers in content
 * Focus on setTimeout/setInterval with large millisecond values
 */
function findMagicNumbers(content, filePath) {
  const lines = content.split('\n');
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comments
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      continue;
    }

    // Pattern 1: setTimeout/setInterval with large numbers (>1000ms = 1 second)
    // Match: setTimeout(..., 5000) or setInterval(..., 3600000)
    const timeoutPattern = /(setTimeout|setInterval)\s*\([^,]+,\s*(\d{4,})\s*\)/;
    const timeoutMatch = line.match(timeoutPattern);
    if (timeoutMatch) {
      const milliseconds = parseInt(timeoutMatch[2]);
      // Only flag if >= 1000ms (1 second or more)
      if (milliseconds >= 1000) {
        violations.push({
          line: i + 1,
          content: line.trim(),
          type: `Magic number in ${timeoutMatch[1]}`,
          value: milliseconds,
          suggestion: formatTimeConstant(milliseconds),
          severity: 'medium',
        });
      }
    }

    // Pattern 2: Large numbers in retry/delay logic
    // Match: delay(5000), wait(3000), retry.*1000, etc.
    const delayPattern = /(delay|wait|retry|pause|sleep)\s*\(?\s*(\d{4,})\s*\)?/i;
    const delayMatch = line.match(delayPattern);
    if (delayMatch && !timeoutMatch) { // Don't double-count
      const value = parseInt(delayMatch[2]);
      if (value >= 1000) {
        violations.push({
          line: i + 1,
          content: line.trim(),
          type: `Magic number in ${delayMatch[1]}`,
          value: value,
          suggestion: formatTimeConstant(value),
          severity: 'low',
        });
      }
    }
  }

  return violations;
}

/**
 * Format milliseconds into a suggested constant name
 */
function formatTimeConstant(ms) {
  const seconds = ms / 1000;
  const minutes = ms / 60000;
  const hours = ms / 3600000;

  if (hours >= 1 && hours === Math.floor(hours)) {
    return `${hours}_HOUR${hours > 1 ? 'S' : ''}_MS`;
  } else if (minutes >= 1 && minutes === Math.floor(minutes)) {
    return `${minutes}_MINUTE${minutes > 1 ? 'S' : ''}_MS`;
  } else if (seconds >= 1 && seconds === Math.floor(seconds)) {
    return `${seconds}_SECOND${seconds > 1 ? 'S' : ''}_MS`;
  } else {
    return `${ms}_MS`;
  }
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
 * Main check function
 */
function checkMagicNumbers() {
  console.log('Magic Numbers Check (No Magic Numbers in Code)');
  console.log('='.repeat(80));
  console.log('');

  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} source files in src/...`);
  console.log('');

  const violations = [];

  for (const file of files) {
    if (shouldExcludeFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const fileViolations = findMagicNumbers(content, file);

    if (fileViolations.length > 0) {
      violations.push({
        file,
        violations: fileViolations,
      });
    }
  }

  if (violations.length === 0) {
    console.log('✅ No magic numbers found!\n');
    console.log('='.repeat(80));
    console.log('Summary');
    console.log('='.repeat(80));
    console.log('');
    console.log('Files with magic numbers: 0');
    console.log('Total violations: 0');
    console.log('');
    console.log('✅ All magic number checks passed!');
    return true;
  }

  console.log('Magic Number Violations');
  console.log('-'.repeat(80));
  console.log('');

  let totalViolations = 0;

  for (const { file, violations: fileViolations } of violations) {
    const relativePath = normalizePath(path.relative(projectRoot, file));
    console.log(`  ❌ ${relativePath} (${fileViolations.length} violation(s))`);

    for (const { line, content, type, value, suggestion, severity } of fileViolations) {
      console.log(`     Line ${line}: ${content}`);
      console.log(`     Type: ${type} (${severity} severity)`);
      console.log(`     Magic number: ${value}ms`);
      console.log(`     Suggestion: const ${suggestion} = ${value};`);
      totalViolations++;
    }

    console.log('');
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Files with magic numbers: ${violations.length}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log('');
  console.log('❌ Magic number violations found.');
  console.log('');
  console.log('Why this matters:');
  console.log('  - Magic numbers make code harder to understand');
  console.log('  - Difficult to maintain and update values');
  console.log('  - No semantic meaning without context');
  console.log('  - Named constants improve readability');
  console.log('');
  console.log('The Rule:');
  console.log('  - ❌ setTimeout(callback, 3600000)');
  console.log('  - ✅ const ONE_HOUR_MS = 3600000;');
  console.log('  - ✅ setTimeout(callback, ONE_HOUR_MS);');
  console.log('');
  console.log('Note: Focus is on time-related values (setTimeout, setInterval, delays)');
  console.log('      Config files are exempted');

  return false;
}

// Run the check
const passed = checkMagicNumbers();
process.exit(passed ? 0 : 1);
