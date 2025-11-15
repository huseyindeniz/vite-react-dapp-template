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
 * Check if a file should be excluded from dangerouslySetInnerHTML checks
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
 * Find dangerouslySetInnerHTML usage in content
 */
function findDangerousHTML(content, filePath) {
  const lines = content.split('\n');
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comments
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*')) {
      continue;
    }

    // Check for dangerouslySetInnerHTML
    if (line.includes('dangerouslySetInnerHTML')) {
      violations.push({
        line: i + 1,
        content: line.trim(),
      });
    }
  }

  return violations;
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
function checkDangerousHTML() {
  console.log('Dangerous HTML Check (No dangerouslySetInnerHTML)');
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
    const fileViolations = findDangerousHTML(content, file);

    if (fileViolations.length > 0) {
      violations.push({
        file,
        violations: fileViolations,
      });
    }
  }

  if (violations.length === 0) {
    console.log('✅ No dangerouslySetInnerHTML usage found!\n');
    console.log('='.repeat(80));
    console.log('Summary');
    console.log('='.repeat(80));
    console.log('');
    console.log('Files with dangerouslySetInnerHTML: 0');
    console.log('Total violations: 0');
    console.log('');
    console.log('✅ All security checks passed!');
    return true;
  }

  console.log('Dangerous HTML Violations');
  console.log('-'.repeat(80));
  console.log('');
  console.log(`❌ Found ${violations.length} file(s) with dangerouslySetInnerHTML usage\n`);

  let totalViolations = 0;

  for (const { file, violations: fileViolations } of violations) {
    const relativePath = normalizePath(path.relative(projectRoot, file));
    console.log(`  ❌ ${relativePath} (${fileViolations.length} usage(s))`);

    for (const { line, content } of fileViolations) {
      console.log(`     Line ${line}: ${content}`);
      totalViolations++;
    }

    console.log(`     Rule: Never use dangerouslySetInnerHTML`);
    console.log(`     Why: Opens XSS vulnerabilities, bypasses React's automatic escaping`);
    console.log(`     Fix: Use React's default rendering (which auto-escapes) or sanitize with DOMPurify`);
    console.log('');
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Files with dangerouslySetInnerHTML: ${violations.length}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log('');
  console.log('❌ Security violations found.');
  console.log('');
  console.log('Why this matters:');
  console.log('  - dangerouslySetInnerHTML bypasses React\'s built-in XSS protection');
  console.log('  - Allows arbitrary HTML injection, leading to XSS attacks');
  console.log('  - User-controlled content can execute malicious scripts');
  console.log('  - Critical security vulnerability');
  console.log('');
  console.log('The Rule:');
  console.log('  - ❌ <div dangerouslySetInnerHTML={{ __html: content }} />');
  console.log('  - ✅ <div>{content}</div> (React auto-escapes)');
  console.log('  - ✅ Use DOMPurify.sanitize() if HTML rendering is absolutely required');

  return false;
}

// Run the check
const passed = checkDangerousHTML();
process.exit(passed ? 0 : 1);
