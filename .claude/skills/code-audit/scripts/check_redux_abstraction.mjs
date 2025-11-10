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

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if file is a useActions.ts file in a feature
 */
function isUseActionsFile(filePath) {
  const normalized = normalizePath(filePath);
  // Pattern: src/(core|domain)/features/*/hooks/useActions.ts
  return /src\/(core|domain)\/features\/[^/]+\/hooks\/useActions\.(ts|tsx|js|jsx)$/.test(normalized);
}

/**
 * Check if file is a feature hook file
 */
function isFeatureHookFile(filePath) {
  const normalized = normalizePath(filePath);
  // Pattern: src/(core|domain)/features/*/hooks/*.ts
  return /src\/(core|domain)\/features\/[^/]+\/hooks\/.*\.(ts|tsx|js|jsx)$/.test(normalized);
}

/**
 * Check if file is a root hook file
 */
function isRootHookFile(filePath) {
  const normalized = normalizePath(filePath);
  // Pattern: src/hooks/*.ts
  return /src\/hooks\/.*\.(ts|tsx|js|jsx)$/.test(normalized);
}

/**
 * Check if file is an actionEffect file (business logic)
 */
function isActionEffectFile(filePath) {
  const normalized = normalizePath(filePath);
  // Pattern: src/(core|domain)/features/*/models/*/actionEffects/*.ts
  return /src\/(core|domain)\/features\/[^/]+\/models\/[^/]+\/actionEffects\/.*\.(ts|tsx|js|jsx)$/.test(normalized);
}

/**
 * Check if file is a React component (should not access Redux directly)
 */
function isReactComponent(filePath) {
  const normalized = normalizePath(filePath);
  const ext = path.extname(filePath);

  // Must be .tsx or .jsx
  if (ext !== '.tsx' && ext !== '.jsx') {
    return false;
  }

  // In components/ or pages/ directories
  return /\/(components|pages)\//.test(normalized);
}

/**
 * Check if file contains useDispatch import from react-redux
 */
function hasUseDispatchImport(content) {
  // Pattern: import { ... useDispatch ... } from 'react-redux'
  const patterns = [
    /import\s*\{[^}]*useDispatch[^}]*\}\s*from\s*['"]react-redux['"]/,
    /import\s*\{\s*useDispatch\s*\}\s*from\s*['"]react-redux['"]/,
  ];

  for (const pattern of patterns) {
    if (pattern.test(content)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if file contains RootState import
 */
function hasRootStateImport(content) {
  // Pattern: import { ... RootState ... } from '...'
  const patterns = [
    /import\s*\{[^}]*RootState[^}]*\}\s*from\s*['"]/,
    /import\s*\{\s*RootState\s*\}\s*from\s*['"]/,
    /import\s+type\s*\{[^}]*RootState[^}]*\}\s*from\s*['"]/,
  ];

  for (const pattern of patterns) {
    if (pattern.test(content)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if file contains useSelector import from react-redux
 */
function hasUseSelectorImport(content) {
  // Pattern: import { ... useSelector ... } from 'react-redux'
  const patterns = [
    /import\s*\{[^}]*useSelector[^}]*\}\s*from\s*['"]react-redux['"]/,
    /import\s*\{\s*useSelector\s*\}\s*from\s*['"]react-redux['"]/,
  ];

  for (const pattern of patterns) {
    if (pattern.test(content)) {
      return true;
    }
  }

  return false;
}

/**
 * Find all import statements matching a pattern and return line numbers
 */
function findImportLines(content, importName) {
  const lines = content.split('\n');
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (importName === 'useDispatch') {
      if (/import\s*\{[^}]*useDispatch[^}]*\}\s*from\s*['"]react-redux['"]/.test(line)) {
        matches.push({ line: i + 1, content: line.trim() });
      }
    } else if (importName === 'RootState') {
      if (/import\s*(type\s*)?\{[^}]*RootState[^}]*\}\s*from\s*['"]/.test(line)) {
        matches.push({ line: i + 1, content: line.trim() });
      }
    } else if (importName === 'useSelector') {
      if (/import\s*\{[^}]*useSelector[^}]*\}\s*from\s*['"]react-redux['"]/.test(line)) {
        matches.push({ line: i + 1, content: line.trim() });
      }
    }
  }

  return matches;
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
function runReduxAbstractionCheck() {
  console.log('React Redux Abstraction Check');
  console.log('='.repeat(80));
  console.log('');

  // Scan all source files
  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} files in src/...`);
  console.log('');

  const useDispatchViolations = [];
  const rootStateViolations = [];
  const useSelectorViolations = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = normalizePath(path.relative(projectRoot, file));

    const isUseActions = isUseActionsFile(file);
    const isFeatureHook = isFeatureHookFile(file);
    const isRootHook = isRootHookFile(file);
    const isActionEffect = isActionEffectFile(file);
    const isComponent = isReactComponent(file);

    // Check 1: useDispatch should only be in useActions.ts files
    // Components and pages should NEVER use useDispatch
    if (hasUseDispatchImport(content)) {
      if (isComponent || (!isUseActions && !isFeatureHook)) {
        const matches = findImportLines(content, 'useDispatch');
        for (const match of matches) {
          useDispatchViolations.push({
            file: relativePath,
            line: match.line,
            content: match.content,
          });
        }
      }
    }

    // Check 2: RootState should never be imported in React components
    // Allowed in: feature hooks, root hooks, action effects (business logic)
    if (hasRootStateImport(content)) {
      if (isComponent && !isFeatureHook && !isRootHook && !isActionEffect) {
        const matches = findImportLines(content, 'RootState');
        for (const match of matches) {
          rootStateViolations.push({
            file: relativePath,
            line: match.line,
            content: match.content,
          });
        }
      }
    }

    // Check 3: useSelector should never be imported in React components
    // Allowed in: feature hooks, root hooks (they provide the abstraction)
    if (hasUseSelectorImport(content)) {
      if (isComponent && !isFeatureHook && !isRootHook) {
        const matches = findImportLines(content, 'useSelector');
        for (const match of matches) {
          useSelectorViolations.push({
            file: relativePath,
            line: match.line,
            content: match.content,
          });
        }
      }
    }
  }

  // Report results
  let hasViolations = false;

  // Report useDispatch Violations
  console.log('1. Direct useDispatch Usage Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (useDispatchViolations.length === 0) {
    console.log('✅ No direct useDispatch usage found!');
  } else {
    hasViolations = true;
    console.log(`❌ Found ${useDispatchViolations.length} direct useDispatch import(s)`);
    console.log('');

    for (const violation of useDispatchViolations) {
      console.log(`  ❌ ${violation.file}:${violation.line}`);
      console.log(`     ${violation.content}`);
      console.log(`     Rule: React components should never import useDispatch`);
      console.log(`     Fix: Use feature action hooks (useWalletActions, useBlogActions, etc.)`);
      console.log('');
    }
  }

  console.log('');

  // Report RootState Violations
  console.log('2. Direct RootState Import Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (rootStateViolations.length === 0) {
    console.log('✅ No direct RootState imports found!');
  } else {
    hasViolations = true;
    console.log(`❌ Found ${rootStateViolations.length} direct RootState import(s)`);
    console.log('');

    for (const violation of rootStateViolations) {
      console.log(`  ❌ ${violation.file}:${violation.line}`);
      console.log(`     ${violation.content}`);
      console.log(`     Rule: Never import RootState in components`);
      console.log(`     Fix: Use useTypedSelector from @/hooks/useTypedSelector`);
      console.log('');
    }
  }

  console.log('');

  // Report useSelector Violations
  console.log('3. Direct useSelector Usage Violations');
  console.log('-'.repeat(80));
  console.log('');

  if (useSelectorViolations.length === 0) {
    console.log('✅ No direct useSelector usage found!');
  } else {
    hasViolations = true;
    console.log(`❌ Found ${useSelectorViolations.length} direct useSelector import(s)`);
    console.log('');

    for (const violation of useSelectorViolations) {
      console.log(`  ❌ ${violation.file}:${violation.line}`);
      console.log(`     ${violation.content}`);
      console.log(`     Rule: Never use useSelector directly`);
      console.log(`     Fix: Use useTypedSelector from @/hooks/useTypedSelector`);
      console.log('');
    }
  }

  console.log('');

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('');
  console.log(`Direct useDispatch: ${useDispatchViolations.length} violation(s)`);
  console.log(`Direct RootState: ${rootStateViolations.length} violation(s)`);
  console.log(`Direct useSelector: ${useSelectorViolations.length} violation(s)`);
  console.log('');

  if (!hasViolations) {
    console.log('✅ All Redux abstraction checks passed!');
  } else {
    console.log('❌ Redux abstraction violations found.');
    console.log('');
    console.log('Rules:');
    console.log('  1. React components should never import useDispatch, useSelector, or RootState');
    console.log('  2. Components should use feature hooks (useWallet, useAuth, etc.)');
    console.log('  3. Components should use useTypedSelector for cross-feature state access');
    console.log('');
    console.log('Allowed:');
    console.log('  - (core|domain)/features/*/hooks/*.ts can use useDispatch, useSelector, RootState');
    console.log('  - src/hooks/*.ts can use useSelector, RootState');
    console.log('  - (core|domain)/features/*/models/*/actionEffects/*.ts can use RootState');
    console.log('');
    console.log('Pattern:');
    console.log('  Components → Feature Hooks → Redux');
    console.log('  (Never: Components → Redux directly)');
  }

  console.log('');

  return hasViolations ? 1 : 0;
}

// Run the check
const exitCode = runReduxAbstractionCheck();
process.exit(exitCode);
