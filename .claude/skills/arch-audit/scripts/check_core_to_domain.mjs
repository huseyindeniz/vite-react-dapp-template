#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../../..');
const featuresDir = path.join(projectRoot, 'src', 'features');

const CORE_FEATURES = ['app', 'auth', 'i18n', 'router', 'slice-manager', 'ui'];
const COMPOSITION_ROOT = 'src/config/';
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function isCoreFeature(featureName) {
  return CORE_FEATURES.includes(featureName);
}

function isCompositionRoot(filePath) {
  const normalized = normalizePath(filePath);
  return normalized.includes(COMPOSITION_ROOT);
}

function extractFeatureImports(content) {
  const imports = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const importMatch = line.match(/import\s+.*\s+from\s+['"]@\/features\/([^/'"]+)/);
    if (importMatch) {
      imports.push(importMatch[1]);
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

  // Check each core feature
  for (const coreFeature of CORE_FEATURES) {
    const featureDir = path.join(featuresDir, coreFeature);
    if (!fs.existsSync(featureDir)) continue;

    const files = getAllFiles(featureDir);

    for (const file of files) {
      const relativePath = normalizePath(path.relative(projectRoot, file));

      // Skip composition root
      if (isCompositionRoot(file)) continue;

      const content = fs.readFileSync(file, 'utf-8');
      const imports = extractFeatureImports(content);

      for (const importedFeature of imports) {
        // Check if core feature imports domain feature
        if (!isCoreFeature(importedFeature) && importedFeature !== coreFeature) {
          violations.push({
            coreFeature,
            domainFeature: importedFeature,
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

      const uniqueDomains = [...new Set(viols.map(v => v.domainFeature))];
      for (const domain of uniqueDomains) {
        const files = viols.filter(v => v.domainFeature === domain).map(v => v.file);
        console.log(`     → ${domain} (domain)`);
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
