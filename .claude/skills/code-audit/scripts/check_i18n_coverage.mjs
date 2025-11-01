#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

// Only scan React component files
const componentExtensions = ['.tsx', '.jsx'];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if file should be excluded from i18n checks
 */
function shouldExcludeFile(filePath) {
  const normalized = normalizePath(filePath);

  // Exclude test files
  if (normalized.includes('.test.') || normalized.includes('.spec.')) {
    return true;
  }

  // Exclude Storybook files
  if (normalized.includes('.stories.')) {
    return true;
  }

  // Exclude type definition files
  if (normalized.endsWith('.d.ts')) {
    return true;
  }

  return false;
}

/**
 * Check if a string looks like user-facing text that needs translation
 */
function looksLikeUserText(text) {
  // Remove whitespace
  const trimmed = text.trim();

  // Empty or very short
  if (trimmed.length < 2) {
    return false;
  }

  // Single character (likely not user text)
  if (trimmed.length === 1) {
    return false;
  }

  // Numbers only
  if (/^\d+$/.test(trimmed)) {
    return false;
  }

  // Boolean values
  if (trimmed === 'true' || trimmed === 'false') {
    return false;
  }

  // null, undefined
  if (trimmed === 'null' || trimmed === 'undefined') {
    return false;
  }

  // URLs
  if (/^https?:\/\//.test(trimmed)) {
    return false;
  }

  // Paths
  if (/^[/.@]/.test(trimmed) || trimmed.includes('/')) {
    return false;
  }

  // CSS class names (single words with hyphens/underscores)
  if (/^[a-z][a-z0-9_-]*$/i.test(trimmed) && !trimmed.includes(' ')) {
    return false;
  }

  // Variable names (camelCase, snake_case, UPPER_CASE)
  if (/^[a-z_$][a-z0-9_$]*$/i.test(trimmed) && !trimmed.includes(' ')) {
    return false;
  }

  // Data attributes, IDs
  if (/^(data-|aria-|id|name|type|role|key)/.test(trimmed)) {
    return false;
  }

  // Looks like a sentence or phrase with spaces or punctuation
  // This is likely user-facing text
  if (/[A-Z]/.test(trimmed) && (trimmed.includes(' ') || /[.!?]/.test(trimmed))) {
    return true;
  }

  // Multi-word text
  if (trimmed.split(/\s+/).length >= 2) {
    return true;
  }

  // Has uppercase letters and special chars (likely a message)
  if (/[A-Z]/.test(trimmed) && /[^a-z0-9]/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Find JSX text content (text between tags)
 * Example: <div>Hello world</div> -> "Hello world"
 */
function findJSXTextContent(content) {
  const violations = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Pattern: >text< (JSX text content)
    // Exclude: >{t('...')}, >{variable}, >{expression}
    const jsxTextPattern = />([^<>{]+)</g;

    let match;
    while ((match = jsxTextPattern.exec(line)) !== null) {
      const text = match[1];

      // Skip if it's inside t() function
      const beforeText = line.substring(0, match.index);
      if (/t\s*\(\s*['"`]$/.test(beforeText)) {
        continue;
      }

      // Skip if it's a variable/expression (would be in {})
      if (beforeText.endsWith('{') || line.substring(match.index + match[0].length).startsWith('}')) {
        continue;
      }

      // Check if it looks like user-facing text
      if (looksLikeUserText(text)) {
        violations.push({
          line: lineNumber,
          text: text.trim(),
          context: line.trim(),
          type: 'JSX text content',
        });
      }
    }
  }

  return violations;
}

/**
 * Find string literals that look like user-facing text
 * But not in certain contexts (imports, className, etc.)
 */
function findStringLiterals(content) {
  const violations = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Skip import statements
    if (line.trim().startsWith('import ')) {
      continue;
    }

    // Skip export statements
    if (line.trim().startsWith('export ')) {
      continue;
    }

    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      continue;
    }

    // Skip log statements (not user-facing)
    if (/\blog\.(debug|info|warn|error|trace)\s*\(/.test(line)) {
      continue;
    }

    // Skip console statements
    if (/\bconsole\.(log|debug|info|warn|error)\s*\(/.test(line)) {
      continue;
    }

    // Find string literals
    const stringPattern = /(['"`])([^'"`\n]+)\1/g;

    let match;
    while ((match = stringPattern.exec(line)) !== null) {
      const quote = match[1];
      const text = match[2];

      // Skip template literal variables ${...}
      if (text.includes('${')) {
        continue;
      }

      // Skip if already wrapped in t()
      const beforeString = line.substring(0, match.index);
      if (/t\s*\(\s*$/.test(beforeString)) {
        continue;
      }

      // Skip common non-translatable prop names and attributes
      if (/\b(className|id|name|key|type|role|href|src|alt|data-|aria-|style|variant|size|color|placeholder|rel|target|border|bg)\s*[:=]\s*['"`]$/.test(beforeString)) {
        continue;
      }

      // Skip regex patterns (contains special regex chars)
      if (/[\\()[\]{}|^$*+?]/.test(text)) {
        continue;
      }

      // Skip CSS values (calc, colors, etc.)
      if (/^(calc\(|rgba?|hsla?|#|var\()/.test(text)) {
        continue;
      }

      // Skip CSS values (colors, sizes, borders, etc.)
      if (/^(rgba?|hsla?|#|var\(|[0-9]+px|[0-9]+%|[0-9]+em|[0-9]+rem|[0-9]+vh|[0-9]+vw|solid|dashed|dotted|none|auto|inherit|initial|unset)/.test(text)) {
        continue;
      }

      // Skip if it's a prop key or object key
      if (/\b\w+\s*:\s*['"`]$/.test(beforeString)) {
        continue;
      }

      // Check if it looks like user-facing text
      if (looksLikeUserText(text)) {
        violations.push({
          line: lineNumber,
          text: text,
          context: line.trim(),
          type: 'String literal',
        });
      }
    }
  }

  return violations;
}

/**
 * Recursively get all component files in a directory
 */
function getComponentFiles(dir, files = []) {
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
        getComponentFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (componentExtensions.includes(ext) && !shouldExcludeFile(fullPath)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Main analysis function
 */
function runI18nCoverageCheck() {
  console.log('React i18n Coverage Check');
  console.log('='.repeat(80));
  console.log('');

  // Scan all component files
  const files = getComponentFiles(srcDir);
  console.log(`Scanning ${files.length} component files in src/...`);
  console.log('');

  const allViolations = [];
  const violationsByFile = {};

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = normalizePath(path.relative(projectRoot, file));

    // Find JSX text content
    const jsxViolations = findJSXTextContent(content);

    // Find string literals
    const stringViolations = findStringLiterals(content);

    const violations = [...jsxViolations, ...stringViolations];

    if (violations.length > 0) {
      violationsByFile[relativePath] = violations;
      allViolations.push(...violations);
    }
  }

  // Report results
  console.log('Raw Text Violations (Missing t() Wrapper)');
  console.log('-'.repeat(80));
  console.log('');

  if (allViolations.length === 0) {
    console.log('✅ No raw text found! All user-facing text is wrapped in t().');
    console.log('');
    return 0;
  }

  console.log(`❌ Found ${allViolations.length} raw text occurrence(s) in ${Object.keys(violationsByFile).length} file(s)`);
  console.log('');

  // Sort files
  const sortedFiles = Object.keys(violationsByFile).sort();

  for (const file of sortedFiles) {
    const violations = violationsByFile[file];
    console.log(`  File: ${file}`);
    console.log('');

    for (const violation of violations) {
      console.log(`    ❌ Line ${violation.line} (${violation.type})`);
      console.log(`       Text: "${violation.text}"`);
      console.log(`       Context: ${violation.context}`);
      console.log(`       Fix: Wrap in t() -> {t('${violation.text}')}`);
      console.log('');
    }
  }

  console.log('-'.repeat(80));
  console.log(`Summary: ${allViolations.length} raw text occurrence(s) found`);
  console.log('');
  console.log('Rule: All user-facing text must be wrapped in t() for internationalization.');
  console.log('');
  console.log('Examples:');
  console.log('  ❌ <Button>Click me</Button>');
  console.log('  ✅ <Button>{t(\'Click me\')}</Button>');
  console.log('');
  console.log('  ❌ const message = "Hello world";');
  console.log('  ✅ const message = t(\'Hello world\');');
  console.log('');

  return allViolations.length > 0 ? 1 : 0;
}

// Run the check
const exitCode = runI18nCoverageCheck();
process.exit(exitCode);
