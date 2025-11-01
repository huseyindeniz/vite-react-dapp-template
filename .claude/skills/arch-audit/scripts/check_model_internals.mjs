#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../../..');
const featuresDir = path.join(projectRoot, 'src', 'features');

const COMPOSITION_ROOT = 'src/features/app/config/';
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function isCompositionRoot(filePath) {
  const normalized = normalizePath(filePath);
  return normalized.includes(COMPOSITION_ROOT);
}

function getFeatureFromFile(filePath) {
  const normalized = normalizePath(filePath);
  const match = normalized.match(/src\/features\/([^/]+)/);
  return match ? match[1] : null;
}

function isModelInternalImport(importPath) {
  // Pattern: @/features/{feature}/models/{model}/{file}
  const match = importPath.match(/@\/features\/([^/]+)\/models\/([^/]+)\/(.+)/);

  if (!match) return null;

  const [, feature, model, restPath] = match;

  // ALLOWED: types/ directory
  if (restPath.startsWith('types/') || restPath === 'types') {
    return null;
  }

  // FORBIDDEN: actions, slice, actionEffects, IModelApi, etc.
  return {
    feature,
    model,
    path: restPath,
  };
}

function extractModelInternalImports(content) {
  const imports = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/import\s+.*\s+from\s+['"](@\/features\/[^'"]+)['"]/);

    if (match) {
      const importPath = match[1];
      const modelInternal = isModelInternalImport(importPath);

      if (modelInternal) {
        imports.push({
          line: i + 1,
          import: importPath,
          feature: modelInternal.feature,
          model: modelInternal.model,
          path: modelInternal.path,
          content: line.trim(),
        });
      }
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

function checkModelInternals() {
  console.log('Model Internals Encapsulation Check');
  console.log('='.repeat(80));
  console.log('');
  console.log('Rule: Features MUST NOT import model internals from other features');
  console.log('');
  console.log('Allowed cross-feature imports:');
  console.log('  ✅ @/features/{feature}/models/{model}/types/*  - Model types');
  console.log('  ✅ @/features/{feature}/hooks/*                 - Feature hooks');
  console.log('  ✅ @/features/{feature}/components/*            - Components');
  console.log('  ✅ @/features/{feature}/hocs/*                  - HOCs');
  console.log('');
  console.log('Forbidden cross-feature imports:');
  console.log('  ❌ @/features/{feature}/models/{model}/actions.ts');
  console.log('  ❌ @/features/{feature}/models/{model}/slice.ts');
  console.log('  ❌ @/features/{feature}/models/{model}/actionEffects/*');
  console.log('  ❌ @/features/{feature}/models/{model}/IModelApi.ts');
  console.log('');
  console.log('Exception: src/features/app/config/ can import anything');
  console.log('');

  const files = getAllFiles(featuresDir);
  const violations = [];

  for (const file of files) {
    const relativePath = normalizePath(path.relative(projectRoot, file));

    // Skip composition root
    if (isCompositionRoot(file)) continue;

    const currentFeature = getFeatureFromFile(file);
    if (!currentFeature) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractModelInternalImports(content);

    for (const imp of imports) {
      // Only violation if importing from ANOTHER feature
      if (imp.feature !== currentFeature) {
        violations.push({
          file: relativePath,
          currentFeature,
          line: imp.line,
          import: imp.import,
          targetFeature: imp.feature,
          targetModel: imp.model,
          targetPath: imp.path,
          content: imp.content,
        });
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
    console.log('All features properly encapsulate their model internals.');
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
        console.log(`     Importing: ${v.targetFeature}/${v.targetModel}/${v.targetPath}`);
      }
      console.log('     Fix: Use feature hooks instead:');
      console.log(`          import { use${capitalize(viols[0].targetFeature)}Actions } from '@/features/${viols[0].targetFeature}/hooks/'`);
      console.log('          OR import types only:');
      console.log(`          import { Type } from '@/features/${viols[0].targetFeature}/models/${viols[0].targetModel}/types/'`);
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log(`Summary: ${violations.length} violation(s)`);
  console.log('');

  return violations.length > 0 ? 1 : 0;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const exitCode = checkModelInternals();
process.exit(exitCode);
