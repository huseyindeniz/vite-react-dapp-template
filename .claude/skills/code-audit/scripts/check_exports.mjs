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

// Component file extensions (likely to contain React components)
const componentExtensions = ['.tsx', '.jsx'];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file is an index file
 */
function isIndexFile(filePath) {
  const basename = path.basename(filePath);
  const nameWithoutExt = basename.replace(/\.(ts|tsx|js|jsx)$/, '');
  return nameWithoutExt === 'index';
}

/**
 * Check if a file should be excluded from default export checks
 * (e.g., Storybook files require default exports)
 */
function shouldExcludeFromDefaultExportCheck(filePath) {
  const basename = path.basename(filePath);

  // Exclude Storybook files (*.stories.tsx, *.stories.jsx, etc.)
  if (basename.includes('.stories.')) {
    return true;
  }

  // Exclude type definition files (*.d.ts)
  if (basename.endsWith('.d.ts')) {
    return true;
  }

  return false;
}

/**
 * Check if a file contains default exports
 */
function hasDefaultExport(content) {
  const defaultExportPatterns = [
    /export\s+default\s+/,                    // export default ...
    /export\s*\{\s*\w+\s+as\s+default\s*\}/,  // export { Something as default }
  ];

  for (const pattern of defaultExportPatterns) {
    if (pattern.test(content)) {
      return true;
    }
  }

  return false;
}

/**
 * Find all default export statements in content and return their line numbers
 */
function findDefaultExports(content) {
  const lines = content.split('\n');
  const exports = [];

  const defaultExportPatterns = [
    { pattern: /export\s+default\s+/, type: 'export default' },
    { pattern: /export\s*\{\s*(\w+)\s+as\s+default\s*\}/, type: 'export { X as default }' },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { pattern, type } of defaultExportPatterns) {
      if (pattern.test(line)) {
        exports.push({
          line: i + 1,
          content: line.trim(),
          type,
        });
      }
    }
  }

  return exports;
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
function runExportQualityCheck() {
  console.log('React Export Quality Check');
  console.log('='.repeat(80));
  console.log('');

  // Scan all source files
  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} files in src/...`);
  console.log('');

  const indexFileViolations = [];
  const defaultExportViolations = [];

  for (const file of files) {
    const ext = path.extname(file);
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = normalizePath(path.relative(projectRoot, file));

    // Check 1: Index files
    if (isIndexFile(file)) {
      indexFileViolations.push({
        file: relativePath,
        type: 'index-file',
      });
    }

    // Check 2: Default exports (in all files, but especially component files)
    // Skip Storybook files and type definitions (they require default exports)
    if (!shouldExcludeFromDefaultExportCheck(file)) {
      const defaultExports = findDefaultExports(content);
      if (defaultExports.length > 0) {
        const isComponentFile = componentExtensions.includes(ext);

        for (const exp of defaultExports) {
          defaultExportViolations.push({
            file: relativePath,
            line: exp.line,
            content: exp.content,
            type: exp.type,
            isComponentFile,
          });
        }
      }
    }
  }

  // Report results
  let hasViolations = false;

  // Report Index File Violations
  console.log('1. Index File Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (indexFileViolations.length === 0) {
    console.log('✅ No index files found!');
  } else {
    hasViolations = true;
    console.log(`❌ Found ${indexFileViolations.length} index file(s)`);
    console.log('');

    for (const violation of indexFileViolations) {
      console.log(`  ❌ ${violation.file}`);
      console.log(`     Rule: Never use index files to export from directories`);
      console.log(`     Fix: Rename to a meaningful filename or remove`);
      console.log('');
    }
  }

  console.log('');

  // Report Default Export Violations
  console.log('2. Default Export Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (defaultExportViolations.length === 0) {
    console.log('✅ No default exports found!');
  } else {
    hasViolations = true;
    console.log(`❌ Found ${defaultExportViolations.length} default export(s)`);
    console.log('');

    // Group by file
    const violationsByFile = {};
    for (const violation of defaultExportViolations) {
      if (!violationsByFile[violation.file]) {
        violationsByFile[violation.file] = [];
      }
      violationsByFile[violation.file].push(violation);
    }

    const sortedFiles = Object.keys(violationsByFile).sort();

    for (const file of sortedFiles) {
      const violations = violationsByFile[file];
      const isComponentFile = violations[0].isComponentFile;

      console.log(`  ${isComponentFile ? '❌' : '⚠️'} ${file}${isComponentFile ? ' (Component file)' : ''}`);

      for (const violation of violations) {
        console.log(`     Line ${violation.line}: ${violation.content}`);
      }

      console.log(`     Rule: Never use default exports${isComponentFile ? ' (especially for components)' : ''}`);
      console.log(`     Fix: Use named exports instead (export const ComponentName = ...)`);
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('');
  console.log(`Index files: ${indexFileViolations.length} violation(s)`);
  console.log(`Default exports: ${defaultExportViolations.length} violation(s)`);
  console.log('');

  if (!hasViolations) {
    console.log('✅ All export quality checks passed!');
  } else {
    console.log('❌ Export quality violations found.');
    console.log('');
    console.log('Rules:');
    console.log('  1. Never use index files (index.ts, index.tsx, etc.)');
    console.log('  2. Never use default exports (especially for components)');
    console.log('  3. Always use named exports');
  }

  console.log('');

  return hasViolations ? 1 : 0;
}

// Run the check
const exitCode = runExportQualityCheck();
process.exit(exitCode);
