#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

const COMPOSITION_ROOT = 'src/config/';
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function isCompositionRoot(filePath) {
  const normalized = normalizePath(filePath);
  return normalized.includes(COMPOSITION_ROOT);
}

function extractServiceImports(content) {
  const imports = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/import\s+.*\s+from\s+['"](@\/services\/[^'"]+)['"]/);
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

function checkServiceImports() {
  console.log('Service Import Check (Dependency Injection)');
  console.log('='.repeat(80));
  console.log('');
  console.log('Rule: Services MUST ONLY be imported in src/config/');
  console.log('Why: Enforce dependency injection pattern');
  console.log('');

  const files = getAllFiles(srcDir);
  const violations = [];

  for (const file of files) {
    const relativePath = normalizePath(path.relative(projectRoot, file));

    // Skip composition root
    if (isCompositionRoot(file)) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractServiceImports(content);

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
    console.log('All service imports are properly isolated in composition root.');
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
      console.log('     Fix: Move service instantiation to src/config/services.ts');
      console.log('          Use dependency injection - features receive services through interfaces');
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log(`Summary: ${violations.length} violation(s)`);
  console.log('');

  return violations.length > 0 ? 1 : 0;
}

const exitCode = checkServiceImports();
process.exit(exitCode);
