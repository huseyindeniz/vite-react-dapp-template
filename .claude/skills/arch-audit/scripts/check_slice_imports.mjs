#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../../..');
const featuresDir = path.join(projectRoot, 'src', 'features');

const ALLOWED_FILE = 'src/features/app/config/features.ts';
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function isAllowedFile(filePath) {
  const normalized = normalizePath(path.relative(projectRoot, filePath));
  return normalized === ALLOWED_FILE;
}

function extractSliceImports(content) {
  const imports = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match: @/features/{feature}/slice
    const match = line.match(/import\s+.*\s+from\s+['"](@\/features\/[^/]+\/slice)['"]/);

    if (match) {
      imports.push({
        line: i + 1,
        import: match[1],
        content: line.trim(),
      });
    }
  }

  return imports;
}

function getAllFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', 'build', 'coverage'].includes(item)) {
        getAllFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      if (validExtensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function checkSliceImports() {
  console.log('Slice Import Check (Composition Root Pattern)');
  console.log('='.repeat(80));
  console.log('');
  console.log('Rule: Feature slice.ts files MUST ONLY be imported in:');
  console.log(`      ${ALLOWED_FILE}`);
  console.log('');
  console.log('Why: Slices are registered in composition root for Redux store setup');
  console.log('');

  const files = getAllFiles(featuresDir);
  const violations = [];

  for (const file of files) {
    const relativePath = normalizePath(path.relative(projectRoot, file));

    // Skip the allowed file
    if (isAllowedFile(file)) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractSliceImports(content);

    for (const imp of imports) {
      violations.push({
        file: relativePath,
        line: imp.line,
        import: imp.import,
        content: imp.content,
      });
    }
  }

  // Report
  console.log('Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (violations.length === 0) {
    console.log('✅ No violations found!');
    console.log('');
    console.log(`All slice imports are properly isolated in ${ALLOWED_FILE}`);
  } else {
    console.log(`❌ Found ${violations.length} violation(s)`);
    console.log('');

    // Group by file
    const byFile = {};
    for (const v of violations) {
      if (!byFile[v.file]) byFile[v.file] = [];
      byFile[v.file].push(v);
    }

    for (const [file, viols] of Object.entries(byFile)) {
      console.log(`  ❌ ${file}`);
      for (const v of viols) {
        console.log(`     Line ${v.line}: ${v.import}`);
      }
      console.log(`     Fix: Remove this import. Slices are only imported in ${ALLOWED_FILE}`);
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log(`Summary: ${violations.length} violation(s)`);
  console.log('');

  return violations.length > 0 ? 1 : 0;
}

const exitCode = checkSliceImports();
process.exit(exitCode);
