#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

// Define aliased directories
const ALIASED_DIRS = {
  features: { path: path.join(srcDir, 'features'), alias: '@/features' },
  services: { path: path.join(srcDir, 'services'), alias: '@/services' },
  pages: { path: path.join(srcDir, 'pages'), alias: '@/pages' },
  hooks: { path: path.join(srcDir, 'hooks'), alias: '@/hooks' },
};

// Valid file extensions to scan
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// Regex patterns for import detection
const importPatterns = [
  /import\s+.*\s+from\s+['"]([^'"]+)['"]/g,  // import ... from '...'
  /import\s*\(\s*(?:\/\*[\s\S]*?\*\/\s*)?['"]([^'"]+)['"]/g,  // import('...') with optional webpack comments
  /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,    // require('...')
];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
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
 * Extract all import paths from file content
 */
function extractImports(content) {
  const imports = [];

  for (const pattern of importPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      imports.push({
        fullMatch: match[0],
        importPath: match[1],
        index: match.index,
      });
    }
  }

  return imports;
}

/**
 * Get line number from character index
 */
function getLineNumber(content, index) {
  const beforeIndex = content.substring(0, index);
  return beforeIndex.split('\n').length;
}

/**
 * Determine which aliased directory a file belongs to
 * Returns { type, name } or null
 */
function getAliasedLocation(filePath) {
  const normalized = normalizePath(filePath);

  for (const [type, { path: dirPath }] of Object.entries(ALIASED_DIRS)) {
    const normalizedDirPath = normalizePath(dirPath);
    if (normalized.startsWith(normalizedDirPath + '/')) {
      // For features, extract the specific feature name
      if (type === 'features') {
        const relative = normalized.substring(normalizedDirPath.length + 1);
        const featureName = relative.split('/')[0];
        return { type, name: featureName, fullType: `features/${featureName}` };
      }

      // For other aliases, extract the specific item name
      const relative = normalized.substring(normalizedDirPath.length + 1);
      const itemName = relative.split('/')[0];
      return { type, name: itemName, fullType: `${type}/${itemName}` };
    }
  }

  return null;
}

/**
 * Determine which aliased directory a resolved path points to
 * Returns { type, name } or null
 */
function getTargetAliasedLocation(resolvedPath) {
  const normalized = normalizePath(resolvedPath);

  for (const [type, { path: dirPath }] of Object.entries(ALIASED_DIRS)) {
    const normalizedDirPath = normalizePath(dirPath);
    if (normalized.startsWith(normalizedDirPath)) {
      // For features, extract the specific feature name
      if (type === 'features') {
        const relative = normalized.substring(normalizedDirPath.length + 1);
        const featureName = relative.split('/')[0];
        return { type, name: featureName, alias: '@/features' };
      }

      // For other aliases, extract the specific item name
      const relative = normalized.substring(normalizedDirPath.length + 1);
      const itemName = relative.split('/')[0];
      return { type, name: itemName, alias: ALIASED_DIRS[type].alias };
    }
  }

  return null;
}

/**
 * Convert resolved path to suggested absolute import
 */
function suggestAbsoluteImport(resolvedPath) {
  const normalized = normalizePath(resolvedPath);

  for (const [type, { path: dirPath, alias }] of Object.entries(ALIASED_DIRS)) {
    const normalizedDirPath = normalizePath(dirPath);
    if (normalized.startsWith(normalizedDirPath)) {
      const relative = normalized.substring(normalizedDirPath.length + 1);
      // Remove file extension for the suggestion
      const withoutExt = relative.replace(/\.(ts|tsx|js|jsx)$/, '');
      return `${alias}/${withoutExt}`;
    }
  }

  return null;
}

/**
 * Determine violation type
 */
function getViolationType(sourceLocation, targetLocation) {
  if (!sourceLocation && targetLocation) {
    return `Any → ${targetLocation.type}`;
  }

  if (sourceLocation && targetLocation) {
    // Same-directory imports are allowed (internal to feature/page/service/hook)
    if (sourceLocation.type === targetLocation.type &&
        sourceLocation.name === targetLocation.name) {
      return null; // Allowed (internal import)
    }

    // Cross-feature
    if (sourceLocation.type === 'features' && targetLocation.type === 'features') {
      return `Feature → Feature (cross-feature: ${sourceLocation.name} → ${targetLocation.name})`;
    }

    // Cross-page
    if (sourceLocation.type === 'pages' && targetLocation.type === 'pages') {
      return `Page → Page (cross-page: ${sourceLocation.name} → ${targetLocation.name})`;
    }

    // Cross-service
    if (sourceLocation.type === 'services' && targetLocation.type === 'services') {
      return `Service → Service (cross-service: ${sourceLocation.name} → ${targetLocation.name})`;
    }

    // Cross-hook
    if (sourceLocation.type === 'hooks' && targetLocation.type === 'hooks') {
      return `Hook → Hook (cross-hook: ${sourceLocation.name} → ${targetLocation.name})`;
    }

    return `${sourceLocation.type} → ${targetLocation.type}`;
  }

  return 'Unknown violation';
}

/**
 * Analyze a single file for violations
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports = extractImports(content);
  const violations = [];

  const sourceLocation = getAliasedLocation(filePath);

  for (const imp of imports) {
    // Only check relative imports
    if (!imp.importPath.startsWith('.')) {
      continue;
    }

    // Resolve the import path
    const fileDir = path.dirname(filePath);
    const resolvedPath = path.resolve(fileDir, imp.importPath);

    // Check if it points to an aliased directory
    const targetLocation = getTargetAliasedLocation(resolvedPath);

    if (targetLocation) {
      // Determine if this is a violation
      const violationType = getViolationType(sourceLocation, targetLocation);

      if (violationType) {
        const lineNumber = getLineNumber(content, imp.index);
        const suggestedFix = suggestAbsoluteImport(resolvedPath);

        violations.push({
          file: filePath,
          line: lineNumber,
          importStatement: imp.fullMatch,
          importPath: imp.importPath,
          sourceLocation,
          targetLocation,
          violationType,
          suggestedFix,
        });
      }
    }
  }

  return violations;
}

/**
 * Main analysis function
 */
function runQualityCheck() {
  console.log('React Quality Check');
  console.log('='.repeat(80));
  console.log('');

  // Scan all source files
  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} files in src/...`);
  console.log('');

  const allViolations = [];
  const violationsBySource = {};

  for (const file of files) {
    const violations = analyzeFile(file);
    if (violations.length > 0) {
      allViolations.push(...violations);

      for (const violation of violations) {
        const sourceKey = violation.sourceLocation
          ? violation.sourceLocation.fullType
          : 'unknown';

        if (!violationsBySource[sourceKey]) {
          violationsBySource[sourceKey] = [];
        }
        violationsBySource[sourceKey].push(violation);
      }
    }
  }

  // Report results
  console.log('Path Alias Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (allViolations.length === 0) {
    console.log('✅ No violations found! All imports to aliased directories use absolute paths.');
    console.log('');
    return 0;
  }

  console.log(`❌ Found ${allViolations.length} violation(s)`);
  console.log('');

  // Group by source
  const sortedSources = Object.keys(violationsBySource).sort();

  for (const sourceKey of sortedSources) {
    const violations = violationsBySource[sourceKey];
    console.log(`FROM: ${sourceKey}`);
    console.log('');

    for (const violation of violations) {
      const relativePath = normalizePath(path.relative(projectRoot, violation.file));
      console.log(`  ❌ ${relativePath}:${violation.line}`);
      console.log(`     ${violation.importStatement}`);
      console.log(`     → Violates: ${violation.violationType}`);
      if (violation.suggestedFix) {
        console.log(`     Fix: import ... from '${violation.suggestedFix}'`);
      }
      console.log('');
    }
  }

  console.log('-'.repeat(80));
  console.log(`Summary: ${allViolations.length} violation(s) found`);
  console.log('');
  console.log('Rule: All imports to aliased directories (@/features, @/services, @/pages, @/hooks)');
  console.log('      must use absolute path aliases.');
  console.log('Exception: Internal imports within the same feature/page/service/hook are allowed.');
  console.log('');

  return allViolations.length > 0 ? 1 : 0;
}

// Run the check
const exitCode = runQualityCheck();
process.exit(exitCode);
