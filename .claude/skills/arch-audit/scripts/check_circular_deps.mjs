#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const CWD = process.cwd();

console.log('Architecture Check: Circular Dependencies');
console.log('================================================================================\n');
console.log('Scanning for potential circular dependencies...\n');

// Find all source files
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  cwd: CWD,
  absolute: false,
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.stories.*'
  ]
});

const IMPORT_RE = /^\s*import\s+.*?from\s+['"]([^'"]+)['"]/gm;
const fileImports = {};

// Build import graph
for (const file of files) {
  const fullPath = path.join(CWD, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const imports = [];
  let match;

  // Extract all imports
  while ((match = IMPORT_RE.exec(content)) !== null) {
    const importPath = match[1];

    // Only track relative imports (potential circular deps)
    if (importPath.startsWith('.')) {
      imports.push(importPath);
    }
  }

  if (imports.length > 0) {
    fileImports[file] = imports;
  }
}

// Helper to resolve relative import to file path
function resolveImport(fromFile, importPath) {
  const fromDir = path.dirname(path.join(CWD, fromFile));
  const resolved = path.resolve(fromDir, importPath);
  const relative = path.relative(CWD, resolved);

  // Try different extensions
  const candidates = [
    relative + '.ts',
    relative + '.tsx',
    relative + '.js',
    relative + '.jsx',
    path.join(relative, 'index.ts'),
    path.join(relative, 'index.tsx'),
    path.join(relative, 'index.js'),
    path.join(relative, 'index.jsx')
  ];

  for (const candidate of candidates) {
    if (files.includes(candidate)) {
      return candidate;
    }
  }

  return null;
}

// Detect circular dependencies (simple: A imports B, B imports A)
const circularDeps = [];
const checked = new Set();

for (const [fileA, imports] of Object.entries(fileImports)) {
  for (const importPath of imports) {
    const fileB = resolveImport(fileA, importPath);

    if (!fileB || !fileImports[fileB]) continue;

    // Create unique key for this pair
    const key = [fileA, fileB].sort().join('::');
    if (checked.has(key)) continue;
    checked.add(key);

    // Check if B imports A (creating a cycle)
    for (const importPathB of fileImports[fileB]) {
      const fileC = resolveImport(fileB, importPathB);

      if (fileC === fileA) {
        circularDeps.push({
          files: [fileA, fileB],
          type: 'direct'
        });
      }
    }
  }
}

// Detect deeper circular dependencies (A -> B -> C -> A)
// This is a simplified heuristic check
function detectDeeperCycles() {
  const deepCycles = [];

  function dfs(start, current, path, visited) {
    if (path.includes(current) && current !== start) {
      return; // Not a cycle back to start
    }

    if (current === start && path.length > 2) {
      // Found a cycle back to start
      deepCycles.push({
        files: [...path],
        type: 'deep'
      });
      return;
    }

    if (visited.has(current) || path.length > 10) {
      return; // Limit depth to avoid infinite loops
    }

    visited.add(current);
    path.push(current);

    const imports = fileImports[current] || [];
    for (const importPath of imports) {
      const next = resolveImport(current, importPath);
      if (next) {
        dfs(start, next, [...path], new Set(visited));
      }
    }
  }

  // Only check a sample to avoid performance issues
  const sampleFiles = Object.keys(fileImports).slice(0, 50);
  for (const file of sampleFiles) {
    dfs(file, file, [], new Set());
  }

  return deepCycles;
}

const deepCycles = detectDeeperCycles();
const allCycles = [...circularDeps, ...deepCycles];

// Remove duplicates
const uniqueCycles = [];
const seenCycles = new Set();

for (const cycle of allCycles) {
  const key = cycle.files.slice().sort().join('::');
  if (!seenCycles.has(key)) {
    seenCycles.add(key);
    uniqueCycles.push(cycle);
  }
}

// Output results
console.log('Circular Dependency Analysis');
console.log('--------------------------------------------------------------------------------\n');

if (uniqueCycles.length === 0) {
  console.log('✅ No circular dependencies detected\n');
  console.log('Great! Your module dependencies form a proper DAG (Directed Acyclic Graph).');
  process.exit(0);
}

console.log(`⚠️  Found ${uniqueCycles.length} potential circular dependenc${uniqueCycles.length === 1 ? 'y' : 'ies'}\n`);

// Show direct cycles first
const directCycles = uniqueCycles.filter(c => c.type === 'direct');
if (directCycles.length > 0) {
  console.log('🔴 Direct Circular Dependencies (A ↔ B)');
  console.log('--------------------------------------------------------------------------------\n');

  directCycles.slice(0, 10).forEach((cycle, idx) => {
    console.log(`  ${idx + 1}. Cycle detected:`);
    console.log(`     ${cycle.files[0]}`);
    console.log(`       ↓ imports`);
    console.log(`     ${cycle.files[1]}`);
    console.log(`       ↓ imports`);
    console.log(`     ${cycle.files[0]} (circular!)`);
    console.log('');
  });

  if (directCycles.length > 10) {
    console.log(`  ...and ${directCycles.length - 10} more direct cycle(s)\n`);
  }
}

// Show deeper cycles
const deeperCycles = uniqueCycles.filter(c => c.type === 'deep');
if (deeperCycles.length > 0) {
  console.log('🟡 Deep Circular Dependencies (A → B → C → A)');
  console.log('--------------------------------------------------------------------------------\n');
  console.log('Note: This is a heuristic check, may include false positives.\n');

  deeperCycles.slice(0, 5).forEach((cycle, idx) => {
    console.log(`  ${idx + 1}. Cycle chain:`);
    cycle.files.forEach((file, i) => {
      console.log(`     ${i + 1}. ${file}`);
      if (i < cycle.files.length - 1) {
        console.log(`        ↓ imports`);
      }
    });
    console.log(`        ↓ imports`);
    console.log(`     ${cycle.files[0]} (circular!)`);
    console.log('');
  });

  if (deeperCycles.length > 5) {
    console.log(`  ...and ${deeperCycles.length - 5} more deep cycle(s)\n`);
  }
}

console.log('--------------------------------------------------------------------------------');
console.log(`Summary: ${uniqueCycles.length} circular dependenc${uniqueCycles.length === 1 ? 'y' : 'ies'} detected\n`);
console.log('Impact:');
console.log('  - Harder to understand module relationships');
console.log('  - Difficult to test modules in isolation');
console.log('  - May cause bundling issues');
console.log('  - Indicates design problems');
console.log('');
console.log('Recommendation:');
console.log('  1. Extract shared code into a separate module');
console.log('  2. Use dependency inversion (interfaces)');
console.log('  3. Refactor to create proper layer hierarchy');
console.log('  4. Consider using events/callbacks to break cycles\n');

process.exit(1);
