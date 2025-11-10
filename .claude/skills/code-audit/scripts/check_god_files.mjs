#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

// Valid file extensions to scan (TypeScript files)
const validExtensions = ['.ts', '.tsx'];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file should be excluded from god file checks
 */
function shouldExcludeFile(filePath) {
  const basename = path.basename(filePath);
  const normalizedPath = normalizePath(path.relative(projectRoot, filePath));

  // Exclude test files
  if (basename.includes('.test.') || basename.includes('.spec.')) {
    return true;
  }

  // Exclude type definition files
  if (basename.endsWith('.d.ts')) {
    return true;
  }

  // Exclude Storybook files
  if (basename.includes('.stories.')) {
    return true;
  }

  // Exclude specific files that legitimately need multiple entities
  const excludedFiles = [
    'src/services/ethersV6/types/common.ts', // Ethers.js type utilities
    'src/services/oauth/providers/google/types.ts', // Google OAuth external library types
    'src/domain/layout/components/Breadcrumb/Breadcrumb.tsx', // React component with props interfaces
  ];

  if (excludedFiles.includes(normalizedPath)) {
    return true;
  }

  return false;
}

/**
 * Find all entities (interfaces, types, classes, enums) in content
 */
function findEntities(content) {
  const lines = content.split('\n');
  const entities = [];

  // Patterns to detect exported entities
  const entityPatterns = [
    { pattern: /^export\s+interface\s+(\w+)/, type: 'interface' },
    { pattern: /^export\s+type\s+(\w+)\s*=/, type: 'type' },
    { pattern: /^export\s+class\s+(\w+)/, type: 'class' },
    { pattern: /^export\s+enum\s+(\w+)/, type: 'enum' },
    { pattern: /^export\s+const\s+enum\s+(\w+)/, type: 'const enum' },
    { pattern: /^export\s+abstract\s+class\s+(\w+)/, type: 'abstract class' },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip comments
    if (line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) {
      continue;
    }

    for (const { pattern, type } of entityPatterns) {
      const match = line.match(pattern);
      if (match) {
        const name = match[1];
        entities.push({
          line: i + 1,
          name,
          type,
          content: line,
        });
      }
    }
  }

  return entities;
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
function runGodFileCheck() {
  console.log('React "God File" Check (1 Entity Per File Rule)');
  console.log('='.repeat(80));
  console.log('');

  // Scan all source files
  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} TypeScript files in src/...`);
  console.log('');

  const violations = [];

  for (const file of files) {
    // Skip excluded files
    if (shouldExcludeFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = normalizePath(path.relative(projectRoot, file));

    const entities = findEntities(content);

    // Violation: more than 1 entity in a file
    if (entities.length > 1) {
      violations.push({
        file: relativePath,
        count: entities.length,
        entities,
      });
    }
  }

  // Report results
  console.log('"God File" Violations (Multiple Entities Per File)');
  console.log('-'.repeat(80));
  console.log('');

  if (violations.length === 0) {
    console.log('✅ No god files found! Each file contains exactly one entity!');
  } else {
    console.log(`❌ Found ${violations.length} file(s) with multiple entities`);
    console.log('');

    // Sort by number of entities (worst offenders first)
    violations.sort((a, b) => b.count - a.count);

    for (const violation of violations) {
      console.log(`  ❌ ${violation.file} (${violation.count} entities)`);

      for (const entity of violation.entities) {
        console.log(`     Line ${entity.line}: ${entity.type} ${entity.name}`);
      }

      console.log(`     Rule: 1 entity per file - NO god files!`);
      console.log(`     Fix: Split into separate files:`);

      for (const entity of violation.entities) {
        const dir = path.dirname(violation.file);
        const suggestedPath = `${dir}/${entity.name}.ts`;
        console.log(`       - ${suggestedPath}`);
      }

      console.log('');
    }
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('');
  console.log(`Files with multiple entities: ${violations.length}`);

  const totalExtraEntities = violations.reduce((sum, v) => sum + (v.count - 1), 0);
  console.log(`Total entities that should be in separate files: ${totalExtraEntities}`);
  console.log('');

  if (violations.length === 0) {
    console.log('✅ All god file checks passed!');
  } else {
    console.log('❌ God file violations found.');
    console.log('');
    console.log('Why this matters:');
    console.log('  - God files become hard to navigate and understand');
    console.log('  - Makes it difficult to find specific entities');
    console.log('  - Encourages poor code organization');
    console.log('  - Violates Single Responsibility Principle');
    console.log('  - Makes imports less clear and specific');
    console.log('  - Harder to reuse individual entities');
    console.log('');
    console.log('The Rule:');
    console.log('  - 1 entity per file');
    console.log('  - File name should match entity name (e.g., UserService.ts for UserService class)');
    console.log('  - Each file has a clear, focused purpose');
    console.log('  - Easy to find and understand');
  }

  console.log('');

  return violations.length > 0 ? 1 : 0;
}

// Run the check
const exitCode = runGodFileCheck();
process.exit(exitCode);
