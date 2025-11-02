#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../../..');
const servicesDir = path.join(projectRoot, 'src', 'services');

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

  // ALLOWED: Interfaces from feature-level or model-level interfaces/ folders
  // Examples:
  //   @/features/{feature}/interfaces/*
  //   @/features/{feature}/models/{model}/interfaces/*
  if (restPath.includes('/interfaces/') || restPath.startsWith('interfaces/')) {
    return true;
  }

  // ALLOWED: Types from anywhere in feature
  // Examples:
  //   @/features/{feature}/types/*
  //   @/features/{feature}/models/{model}/types/*
  if (restPath.includes('/types/') || restPath.endsWith('/types') || restPath.startsWith('types/')) {
    return true;
  }

  return false; // Everything else is forbidden
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

function checkServiceBoundaries() {
  console.log('Service Boundaries Check');
  console.log('='.repeat(80));
  console.log('');
  console.log('Rule: Services can ONLY import:');
  console.log('  ✅ @/features/{feature}/interfaces/* - Feature-level interfaces');
  console.log('  ✅ @/features/{feature}/models/{model}/interfaces/* - Model-level interfaces');
  console.log('  ✅ @/features/{feature}/types/* - Feature types');
  console.log('  ✅ @/features/{feature}/models/{model}/types/* - Model types');
  console.log('  ✅ External libraries');
  console.log('');
  console.log('Services CANNOT import:');
  console.log('  ❌ @/services/* - Other services (depend on feature interfaces instead)');
  console.log('  ❌ @/pages/*');
  console.log('  ❌ @/hooks/*');
  console.log('  ❌ @/features/{feature}/models/{model}/actions.ts');
  console.log('  ❌ @/features/{feature}/models/{model}/slice.ts');
  console.log('  ❌ @/features/{feature}/models/{model}/actionEffects/*');
  console.log('  ❌ @/features/{feature}/hooks/*');
  console.log('  ❌ @/features/{feature}/components/*');
  console.log('  ❌ @/features/{feature}/config');
  console.log('');

  if (!fs.existsSync(servicesDir)) {
    console.log('⚠️  No services directory found at src/services/');
    console.log('');
    console.log('='.repeat(80));
    console.log('Summary: 0 violation(s)');
    console.log('');
    return 0;
  }

  const files = getAllFiles(servicesDir);
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
          message: 'Services cannot import other services - depend on feature interfaces instead',
        });
      } else if (importPath.startsWith('@/pages/')) {
        violations.push({
          file: relativePath,
          line: imp.line,
          import: importPath,
          content: imp.content,
          type: 'pages',
          message: 'Services cannot import pages',
        });
      } else if (importPath.startsWith('@/hooks/')) {
        violations.push({
          file: relativePath,
          line: imp.line,
          import: importPath,
          content: imp.content,
          type: 'hooks',
          message: 'Services cannot import root hooks',
        });
      } else if (importPath.startsWith('@/features/')) {
        // Check if it's an allowed feature import (interfaces or types from feature/model folders)
        if (!isAllowedFeatureImport(importPath)) {
          violations.push({
            file: relativePath,
            line: imp.line,
            import: importPath,
            content: imp.content,
            type: 'feature-internals',
            message: 'Services can only import interfaces and types from features',
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
    console.log('All services properly respect boundary rules.');
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
      console.log('     Fix: Services should only import:');
      console.log('          - Feature interfaces: @/features/{feature}/interfaces/*');
      console.log('          - Model interfaces: @/features/{feature}/models/{model}/interfaces/*');
      console.log('          - Feature types: @/features/{feature}/types/*');
      console.log('          - Model types: @/features/{feature}/models/{model}/types/*');
      console.log('          - External libraries');
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log(`Summary: ${violations.length} violation(s)`);
  console.log('');

  return violations.length > 0 ? 1 : 0;
}

const exitCode = checkServiceBoundaries();
process.exit(exitCode);
