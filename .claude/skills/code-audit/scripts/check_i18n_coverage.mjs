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
 * Files/patterns to exclude from i18n checks
 * Each entry can be a string (exact match) or regex pattern
 */
const EXCLUSIONS = {
  // Test and development files
  patterns: [
    /\.test\./,           // Test files
    /\.spec\./,           // Spec files
    /\.stories\./,        // Storybook files
    /\.d\.ts$/,           // Type definitions
  ],

  // Infrastructure files (not user-facing)
  files: [
    'src/main.tsx',                                    // App entry point (runs before i18n)
  ],

  // Debug/developer tools (not user-facing)
  paths: [
    'features/slice-manager/components/SliceDebugPanel', // Redux slice debug panel
    'features/i18n/components/LangMenu/LangModal',       // Language selection modal (i18n infrastructure)
    'features/ui/mantine/components/ErrorFallback',      // Error boundary fallback (infrastructure)
    'pages/Home/components/Environment',                 // Environment variables display (developer tool)
  ],

  // OAuth callback handlers (redirect handlers, not user-facing UI)
  oauth: [
    'features/oauth/pages/GithubCallback',
    'features/oauth/pages/GoogleCallback',
    'features/oauth/routes',                           // Callback route definitions
  ],
};

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

  // Check pattern exclusions
  for (const pattern of EXCLUSIONS.patterns) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  // Check exact file exclusions
  for (const file of EXCLUSIONS.files) {
    if (normalized.endsWith(normalizePath(file))) {
      return true;
    }
  }

  // Check path exclusions
  for (const pathSegment of EXCLUSIONS.paths) {
    if (normalized.includes(normalizePath(pathSegment))) {
      return true;
    }
  }

  // Check OAuth exclusions
  for (const oauthPath of EXCLUSIONS.oauth) {
    if (normalized.includes(normalizePath(oauthPath))) {
      return true;
    }
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
 * Find string literals in text-related JSX props that need translation
 * ONLY checks specific user-facing props (whitelist approach)
 */
function findStringLiterals(content) {
  const violations = [];
  const lines = content.split('\n');

  // Text-related JSX props that should be translated (WHITELIST)
  const textProps = [
    'title',
    'label',
    'description',
    'placeholder',
    'aria-label',
    'error',
    'message',
    'text',
    'caption',
    'alt',
  ];

  // Build pattern: (title|label|description|...)\s*=\s*['"`]
  const propPattern = new RegExp(`\\b(${textProps.join('|')})\\s*=\\s*(['"\`])([^'"\`\\n]+)\\2`, 'g');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Skip import/export statements
    if (line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
      continue;
    }

    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      continue;
    }

    // Find text props with string values
    let match;
    while ((match = propPattern.exec(line)) !== null) {
      const propName = match[1];
      const quote = match[2];
      const text = match[3];

      // Check if it's wrapped in t() - look for pattern: prop={t('...')}
      const beforeProp = line.substring(0, match.index);
      const afterValue = line.substring(match.index + match[0].length);

      // Skip if it's already in {t(...)} pattern
      if (/\{t\s*\(\s*$/.test(beforeProp)) {
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
