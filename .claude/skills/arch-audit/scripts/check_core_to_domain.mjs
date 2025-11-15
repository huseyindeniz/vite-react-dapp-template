#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../../..');
const coreFeaturesDir = path.join(projectRoot, 'src', 'core', 'features');
const domainFeaturesDir = path.join(projectRoot, 'src', 'domain', 'features');

const COMPOSITION_ROOT = 'src/config/';
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function isCoreFeatureImport(importPath) {
  // Check if import is from core features: @/core/features/*
  return importPath.startsWith('@/core/features/');
}

function isDomainFeatureImport(importPath) {
  // Check if import is from domain features: @/domain/features/*
  return importPath.startsWith('@/domain/features/');
}

function isCompositionRoot(filePath) {
  const normalized = normalizePath(filePath);
  return normalized.includes(COMPOSITION_ROOT);
}

function extractFeatureImports(content) {
  const imports = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Match both @/core/features/* and @/domain/features/*
    const importMatch = line.match(/import\s+.*\s+from\s+['"](@\/(core|domain)\/features\/[^'"]+)['"]/);
    if (importMatch) {
      imports.push(importMatch[1]); // Full path like @/core/features/xxx or @/domain/features/xxx
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

function checkCoreToDomain() {
  console.log('Core → Domain Dependency Check');
  console.log('='.repeat(80));
  console.log('');
  console.log('Rule: Core features (infrastructure) MUST NOT depend on domain features');
  console.log('Exception: src/config/ (composition root) can import anything');
  console.log('');

  const violations = [];

  // Check all core features
  if (!fs.existsSync(coreFeaturesDir)) {
    console.log('⚠️  Core features directory not found: src/core/features/');
    console.log('');
    return 0;
  }

  const coreFeatures = fs.readdirSync(coreFeaturesDir).filter(item => {
    const itemPath = path.join(coreFeaturesDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  for (const coreFeature of coreFeatures) {
    const featureDir = path.join(coreFeaturesDir, coreFeature);
    const files = getAllFiles(featureDir);

    for (const file of files) {
      const relativePath = normalizePath(path.relative(projectRoot, file));

      // Skip composition root
      if (isCompositionRoot(file)) continue;

      const content = fs.readFileSync(file, 'utf-8');
      const imports = extractFeatureImports(content);

      for (const importPath of imports) {
        // Check if core feature imports domain feature
        if (isDomainFeatureImport(importPath)) {
          violations.push({
            coreFeature,
            domainFeatureImport: importPath,
            file: relativePath,
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
    console.log('All core features properly avoid domain feature dependencies.');
  } else {
    console.log(`❌ Found ${violations.length} violation(s)`);
    console.log('');

    // Group by core feature
    const byCore = {};
    for (const v of violations) {
      if (!byCore[v.coreFeature]) byCore[v.coreFeature] = [];
      byCore[v.coreFeature].push(v);
    }

    for (const [coreFeature, viols] of Object.entries(byCore)) {
      console.log(`  ❌ ${coreFeature} (core) → domain features:`);

      const uniqueImports = [...new Set(viols.map(v => v.domainFeatureImport))];
      for (const importPath of uniqueImports) {
        const files = viols.filter(v => v.domainFeatureImport === importPath).map(v => v.file);
        console.log(`     → ${importPath}`);
        for (const file of files) {
          console.log(`        File: ${file}`);
        }
      }
      console.log('');
    }

    console.log('Fix: Move these dependencies to src/config/');
  }

  console.log('');
  console.log('='.repeat(80));
  console.log(`Summary: ${violations.length} violation(s)`);
  console.log('');

  return violations.length > 0 ? 1 : 0;
}

const exitCode = checkCoreToDomain();
process.exit(exitCode);
