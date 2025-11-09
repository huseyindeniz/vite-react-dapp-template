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

// The ONLY files allowed to import services
const ALLOWED_SERVICE_IMPORT_FILES = [
  'src/config/services.ts', // Root services file (if exists)
];

// Pattern for feature-specific service files: src/config/{feature}/services.ts
const ALLOWED_SERVICE_IMPORT_PATTERN = /^src\/config\/[^/]+\/services\.ts$/;

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if file is allowed to import services
 */
function isAllowedToImportServices(filePath) {
  const normalized = normalizePath(path.relative(projectRoot, filePath));

  // Check exact matches
  if (ALLOWED_SERVICE_IMPORT_FILES.includes(normalized)) {
    return true;
  }

  // Check pattern match for src/config/{feature}/services.ts
  if (ALLOWED_SERVICE_IMPORT_PATTERN.test(normalized)) {
    return true;
  }

  return false;
}

/**
 * Extract service imports from file content
 */
function findServiceImports(content) {
  const lines = content.split('\n');
  const serviceImports = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match import statements with @/services/*
    const importMatch = line.match(/import\s+.*\s+from\s+['"](@\/services\/[^'"]+)['"]/);
    if (importMatch) {
      serviceImports.push({
        line: i + 1,
        content: line.trim(),
        import: importMatch[1],
      });
    }
  }

  return serviceImports;
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
function runServiceImportCheck() {
  console.log('Service Import Check (Dependency Injection Pattern)');
  console.log('='.repeat(80));
  console.log('');

  // Scan all source files
  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} files in src/...`);
  console.log('');

  const violations = [];

  for (const file of files) {
    const relativePath = normalizePath(path.relative(projectRoot, file));

    // Skip the allowed file
    if (isAllowedToImportServices(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const serviceImports = findServiceImports(content);

    if (serviceImports.length > 0) {
      for (const imp of serviceImports) {
        violations.push({
          file: relativePath,
          line: imp.line,
          content: imp.content,
          import: imp.import,
        });
      }
    }
  }

  // Report results
  console.log('Service Import Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (violations.length === 0) {
    console.log('✅ No service import violations found!');
    console.log('');
    console.log('All service imports are properly isolated in composition root:');
    console.log('  - src/config/services.ts (root, if exists)');
    console.log('  - src/config/{feature}/services.ts (feature-specific)');
  } else {
    console.log(`❌ Found ${violations.length} service import violation(s)`);
    console.log('');

    // Group by file
    const violationsByFile = {};
    for (const violation of violations) {
      if (!violationsByFile[violation.file]) {
        violationsByFile[violation.file] = [];
      }
      violationsByFile[violation.file].push(violation);
    }

    const sortedFiles = Object.keys(violationsByFile).sort();

    for (const file of sortedFiles) {
      const fileViolations = violationsByFile[file];

      console.log(`  ❌ ${file} (${fileViolations.length} violation(s))`);

      for (const violation of fileViolations) {
        console.log(`     Line ${violation.line}: ${violation.content}`);
        console.log(`     Import: ${violation.import}`);
      }

      console.log(`     Rule: Services must ONLY be imported in composition root (src/config/*/services.ts)`);
      console.log(`     Fix: Use dependency injection - receive service through interface`);
      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('');
  console.log(`Service import violations: ${violations.length}`);
  console.log('');

  if (violations.length === 0) {
    console.log('✅ All service import checks passed!');
  } else {
    console.log('❌ Service import violations found.');
    console.log('');
    console.log('Dependency Injection Pattern:');
    console.log('  - Services are ONLY imported in composition root:');
    console.log('    - src/config/services.ts (root, if exists)');
    console.log('    - src/config/{feature}/services.ts (feature-specific)');
    console.log('  - Features receive services through interfaces (IFeatureApi)');
    console.log('  - This allows easy service swapping and testing');
    console.log('');
    console.log('Why this matters:');
    console.log('  - Features don\'t depend on concrete service implementations');
    console.log('  - Easy to swap implementations (EthersV5 → EthersV6)');
    console.log('  - Easy to test (mock interfaces)');
    console.log('  - Clear separation of concerns');
  }

  console.log('');

  return violations.length > 0 ? 1 : 0;
}

// Run the check
const exitCode = runServiceImportCheck();
process.exit(exitCode);
