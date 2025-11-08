#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../../..');
const pagesDir = path.join(projectRoot, 'src', 'pages');

const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function extractImports(content) {
  const imports = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/);
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

function isAllowedFeatureImport(importPath) {
  // Pattern: @/features/{feature}/...
  const match = importPath.match(/^@\/features\/([^/]+)\/(.+)$/);

  if (!match) return true; // Not a feature import, allow it

  const [, feature, restPath] = match;

  // ALLOWED: components, hooks, hocs (anywhere in the path)
  // Examples:
  //   @/features/{feature}/components/Button
  //   @/features/components/PageMeta/PageMeta (components core feature)
  //   @/features/{feature}/hooks/useAuth
  //   @/features/{feature}/hocs/withAuth

  // Special case: Core features that ARE the thing (components, layout)
  if (feature === 'components' || feature === 'layout') return true;

  if (restPath.includes('/components/') || restPath.startsWith('components/')) return true;
  if (restPath.includes('/hooks/') || restPath.startsWith('hooks/')) return true;
  if (restPath.includes('/hocs/') || restPath.startsWith('hocs/')) return true;

  // ALLOWED: Config files
  // Examples:
  //   @/features/{feature}/config
  //   @/features/{feature}/config.ts
  if (restPath === 'config' || restPath.startsWith('config.') || restPath.startsWith('config/')) {
    return true;
  }

  // Everything else is FORBIDDEN
  return false;
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

function checkPagesBoundaries() {
  console.log('Pages Boundaries Check');
  console.log('='.repeat(80));
  console.log('');
  console.log('Rule: Pages can ONLY import:');
  console.log('  ✅ @/features/{feature}/components/* - Feature components');
  console.log('  ✅ @/features/{feature}/hooks/* - Feature hooks');
  console.log('  ✅ @/features/{feature}/hocs/* - Feature HOCs');
  console.log('  ✅ @/features/{feature}/config - Feature configuration');
  console.log('  ✅ @/hooks/* - Root hooks');
  console.log('  ✅ External libraries (React, etc.)');
  console.log('');
  console.log('Pages CANNOT import:');
  console.log('  ❌ @/services/*');
  console.log('  ❌ @/features/{feature}/models/*');
  console.log('  ❌ @/features/{feature}/types/*');
  console.log('  ❌ @/features/{feature}/slice.ts');
  console.log('  ❌ @/features/{feature}/sagas.ts');
  console.log('  ❌ @/features/{feature}/I{Feature}Api.ts');
  console.log('  ❌ @/features/{feature}/routes');
  console.log('');

  if (!fs.existsSync(pagesDir)) {
    console.log('⚠️  No pages directory found at src/pages/');
    console.log('');
    console.log('='.repeat(80));
    console.log('Summary: 0 violation(s)');
    console.log('');
    return 0;
  }

  const files = getAllFiles(pagesDir);
  const violations = [];

  for (const file of files) {
    const relativePath = normalizePath(path.relative(projectRoot, file));
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content);

    for (const imp of imports) {
      const importPath = imp.import;

      // Check forbidden imports
      if (importPath.startsWith('@/services/')) {
        violations.push({
          file: relativePath,
          line: imp.line,
          import: importPath,
          content: imp.content,
          type: 'services',
          message: 'Pages cannot import services',
        });
      } else if (importPath.startsWith('@/features/')) {
        // Check if it's an allowed feature import (components, hooks, hocs only)
        if (!isAllowedFeatureImport(importPath)) {
          violations.push({
            file: relativePath,
            line: imp.line,
            import: importPath,
            content: imp.content,
            type: 'feature-forbidden',
            message: 'Pages can only import components, hooks, and hocs from features',
          });
        }
      }
    }
  }

  // Report
  console.log('Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (violations.length === 0) {
    console.log('✅ No violations found!');
    console.log('');
    console.log('All pages properly respect boundary rules.');
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
        console.log(`     Issue: ${v.message}`);
      }
      console.log('     Fix: Pages should only import:');
      console.log('          - Feature components: @/features/{feature}/components/*');
      console.log('          - Feature hooks: @/features/{feature}/hooks/*');
      console.log('          - Feature HOCs: @/features/{feature}/hocs/*');
      console.log('          - Feature config: @/features/{feature}/config');
      console.log('          - Root hooks: @/hooks/*');
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log(`Summary: ${violations.length} violation(s)`);
  console.log('');

  return violations.length > 0 ? 1 : 0;
}

const exitCode = checkPagesBoundaries();
process.exit(exitCode);
