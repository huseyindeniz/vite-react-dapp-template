#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

// Valid file extensions to scan (React files only)
const validExtensions = ['.tsx', '.jsx'];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file should be excluded from React key checks
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

  return false;
}

/**
 * Find React key anti-patterns in content
 */
function findKeyViolations(content, filePath) {
  const lines = content.split('\n');
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comments
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      continue;
    }

    // Pattern 1: Array index as key - key={index} or key={i} or key={idx}
    // This matches common index variable names
    const indexAsKeyPattern = /key=\{(index|i|idx|key)\}/;
    if (indexAsKeyPattern.test(line)) {
      violations.push({
        line: i + 1,
        content: line.trim(),
        type: 'Array index as key',
        severity: 'high',
      });
      continue; // Skip to next line to avoid double-counting
    }

    // Pattern 2: .map() without key prop
    // Look for .map( followed by JSX element without key prop
    if (line.includes('.map(')) {
      // Read from .map() line until we hit the closing > of the JSX tag
      let block = '';
      for (let j = i; j < lines.length; j++) {
        block += lines[j];
        // Stop at first > which closes the JSX opening tag
        if (block.includes('>')) {
          break;
        }
      }

      // Check if there's a JSX component in this block
      const hasJSX = /<[A-Z]|<(div|span|li|tr|td|p|button|input|select|option|a|img)/i.test(block);
      // Check if key prop exists in this block
      const hasKey = /key=/.test(block);

      if (hasJSX && !hasKey) {
        violations.push({
          line: i + 1,
          content: line.trim(),
          type: 'Missing key in .map()',
          severity: 'high',
        });
      }
    }
  }

  return violations;
}

/**
 * Get all React files in a directory recursively
 */
function getReactFiles(dir) {
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
        results = results.concat(getReactFiles(filePath));
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
function checkReactKeys() {
  console.log('React Key Patterns Check');
  console.log('='.repeat(80));
  console.log('');

  const files = getReactFiles(srcDir);
  console.log(`Scanning ${files.length} React files in src/...`);
  console.log('');

  const violations = [];

  for (const file of files) {
    if (shouldExcludeFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const fileViolations = findKeyViolations(content, file);

    if (fileViolations.length > 0) {
      violations.push({
        file,
        violations: fileViolations,
      });
    }
  }

  if (violations.length === 0) {
    console.log('✅ No React key violations found!\n');
    console.log('='.repeat(80));
    console.log('Summary');
    console.log('='.repeat(80));
    console.log('');
    console.log('Files with key violations: 0');
    console.log('Index as key violations: 0');
    console.log('Missing key violations: 0');
    console.log('');
    console.log('✅ All React key checks passed!');
    return true;
  }

  console.log('React Key Violations');
  console.log('-'.repeat(80));
  console.log('');

  let indexAsKeyCount = 0;
  let missingKeyCount = 0;

  for (const { file, violations: fileViolations } of violations) {
    const relativePath = normalizePath(path.relative(projectRoot, file));
    console.log(`  ❌ ${relativePath} (${fileViolations.length} violation(s))`);

    for (const { line, content, type, severity } of fileViolations) {
      console.log(`     Line ${line}: ${content}`);
      console.log(`     Type: ${type} (${severity} severity)`);

      if (type === 'Array index as key') {
        indexAsKeyCount++;
      } else if (type === 'Missing key in .map()') {
        missingKeyCount++;
      }
    }

    console.log('');
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Files with key violations: ${violations.length}`);
  console.log(`Index as key violations: ${indexAsKeyCount}`);
  console.log(`Missing key violations: ${missingKeyCount}`);
  console.log('');
  console.log('❌ React key violations found.');
  console.log('');
  console.log('Why this matters:');
  console.log('  - Using array index as key causes bugs when list order changes');
  console.log('  - Missing keys cause React warnings and unpredictable re-renders');
  console.log('  - Keys must be stable, unique identifiers for each item');
  console.log('  - Performance issues and UI bugs from incorrect reconciliation');
  console.log('');
  console.log('The Rule:');
  console.log('  - ❌ items.map((item, index) => <Item key={index} />)');
  console.log('  - ❌ items.map(item => <Item />)  // missing key');
  console.log('  - ✅ items.map(item => <Item key={item.id} />)');
  console.log('  - ✅ Use stable unique identifier from data');

  return false;
}

// Run the check
const passed = checkReactKeys();
process.exit(passed ? 0 : 1);
