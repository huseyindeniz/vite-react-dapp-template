#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

const IGNORES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', 'docs', 'reports']);
const EXT_RE = /\.(ts|tsx|js|jsx|mjs|cjs)$/i;
const IMPORT_RE = /^\s*import\s+.*?from\s+['"]([^'"]+)['"]/;
const REQUIRE_RE = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/;

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function* walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const rel = path.relative(CWD, p);
    const st = fs.lstatSync(p);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) {
      const base = path.basename(p);
      if (IGNORES.has(base)) continue;
      if (rel.startsWith('reports')) continue;
      yield* walk(p);
    } else {
      if (EXT_RE.test(name)) yield p;
    }
  }
}

function resolveRoots() {
  const roots = [];
  if (exists(path.join(CWD, 'src'))) roots.push(path.join(CWD, 'src'));
  if (exists(path.join(CWD, 'apps'))) {
    for (const d of fs.readdirSync(path.join(CWD, 'apps'))) {
      const s = path.join(CWD, 'apps', d, 'src');
      if (exists(s)) roots.push(s);
    }
  }
  if (exists(path.join(CWD, 'packages'))) {
    for (const d of fs.readdirSync(path.join(CWD, 'packages'))) {
      const s = path.join(CWD, 'packages', d, 'src');
      if (exists(s)) roots.push(s);
    }
  }
  return roots.length ? roots : [CWD];
}

function extractModuleName(spec) {
  // Only track bare module ids (not relative paths)
  if (spec.startsWith('.') || spec.startsWith('/')) return null;

  // Extract base package name (handle scoped packages)
  const basePkg = spec.startsWith('@')
    ? spec.split('/').slice(0, 2).join('/')
    : spec.split('/')[0];

  return basePkg;
}

function scanFileForImports(filePath) {
  const modules = new Set();
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    // Check import statements
    const importMatch = line.match(IMPORT_RE);
    if (importMatch) {
      const mod = extractModuleName(importMatch[1]);
      if (mod) modules.add(mod);
    }

    // Check require statements (for .cjs files and some configs)
    const requireMatch = line.match(REQUIRE_RE);
    if (requireMatch) {
      const mod = extractModuleName(requireMatch[1]);
      if (mod) modules.add(mod);
    }
  }

  return modules;
}

console.log('================================================================================');
console.log('Unused Dependencies Check');
console.log('================================================================================');
console.log('');
console.log('Analyzing dependencies with enhanced detection...');
console.log('');

// Read package.json
let pkgJson;
try {
  pkgJson = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf8'));
} catch (error) {
  console.error('❌ Could not read package.json');
  process.exit(1);
}

const prodDeps = Object.keys(pkgJson.dependencies || {});
const devDeps = Object.keys(pkgJson.devDependencies || {});
const allDeps = [...prodDeps, ...devDeps];

console.log(`Total dependencies: ${allDeps.length}`);
console.log('  Production: ' + prodDeps.length);
console.log('  Dev: ' + devDeps.length);
console.log('');

// Track all imported modules
const importedModules = new Set();

// 1. Scan source files
console.log('Scanning source files...');
const roots = resolveRoots();
for (const root of roots) {
  for (const file of walk(root)) {
    const modules = scanFileForImports(file);
    modules.forEach(mod => importedModules.add(mod));
  }
}

// 2. Scan config files in project root
console.log('Scanning config files...');
const configFiles = [
  'vite.config.ts',
  'vite.config.js',
  'vitest.config.ts',
  'vitest.config.js',
  'eslint.config.js',
  'eslint.config.mjs',
  '.eslintrc.js',
  '.eslintrc.cjs',
  'prettier.config.js',
  '.prettierrc.js',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  '.storybook/main.ts',
  '.storybook/main.js',
  'scripts/*.js',
  'scripts/*.mjs',
  'scripts/*.cjs',
];

for (const pattern of configFiles) {
  if (pattern.includes('*')) {
    // Handle glob patterns
    const dir = path.join(CWD, path.dirname(pattern));
    if (exists(dir)) {
      const files = fs.readdirSync(dir);
      const ext = pattern.split('*')[1];
      for (const file of files) {
        if (file.endsWith(ext)) {
          const modules = scanFileForImports(path.join(dir, file));
          modules.forEach(mod => importedModules.add(mod));
        }
      }
    }
  } else {
    const configPath = path.join(CWD, pattern);
    if (exists(configPath)) {
      const modules = scanFileForImports(configPath);
      modules.forEach(mod => importedModules.add(mod));
    }
  }
}

// 3. Parse package.json scripts for CLI tool usage
console.log('Scanning package.json scripts...');
const scripts = pkgJson.scripts || {};
for (const [name, script] of Object.entries(scripts)) {
  // Extract CLI commands from scripts
  const commands = script.split(/[&|;]/).map(s => s.trim());
  for (const cmd of commands) {
    const parts = cmd.split(/\s+/);
    const binary = parts[0];

    // Check if this binary matches any dependency
    for (const dep of allDeps) {
      // Direct match (e.g., "vite" matches "vite" dependency)
      if (binary === dep || binary === dep.split('/').pop()) {
        importedModules.add(dep);
      }
      // npx usage (e.g., "npx vitest" matches "vitest" dependency)
      if (binary === 'npx' && parts[1]) {
        const npxCmd = parts[1];
        if (npxCmd === dep || npxCmd === dep.split('/').pop()) {
          importedModules.add(dep);
        }
      }
    }
  }
}

// 4. Auto-include @types/* packages that have corresponding dependencies
console.log('Checking @types/* packages...');
const installedPackages = new Set([...prodDeps, ...devDeps, ...importedModules]);
for (const dep of allDeps) {
  if (dep.startsWith('@types/')) {
    const typedPackage = dep.replace('@types/', '');

    // Check if the typed package is installed or imported
    if (installedPackages.has(typedPackage) ||
        installedPackages.has(`@${typedPackage}`) ||
        Array.from(installedPackages).some(pkg => pkg.includes(typedPackage))) {
      importedModules.add(dep);
    }
  }
}

// 5. Build tool and infrastructure exceptions
const exceptions = [
  // Build tools
  'vite',
  'vitest',
  'typescript',
  'esbuild',
  'rollup',
  'webpack',
  'parcel',

  // Linters/Formatters
  'eslint',
  'prettier',
  'stylelint',

  // Test infrastructure
  'jest',
  'vitest',
  '@vitest/coverage-v8',
  'jsdom',
  'happy-dom',
  '@testing-library/jest-dom',
  'identity-obj-proxy', // CSS module mock for tests

  // Storybook
  'storybook',
  '@chromatic-com/storybook',

  // Utilities
  'husky',
  'lint-staged',
  'postcss',
  'ts-node',
  'nodemon',
  'concurrently',
  'rimraf',
  'cross-env',
  'dotenv',
  'semver', // Used in scripts

  // Parser tools
  'i18next-parser', // Used in extract script

  // Type-only packages
  '@types/node',
];

console.log(`Modules found in code: ${importedModules.size}`);
console.log('');

// Find actually unused dependencies
const unusedDeps = [];

for (const dep of allDeps) {
  if (!importedModules.has(dep)) {
    // Check if it's an exception
    const isException = exceptions.some((ex) => dep === ex || dep.includes(ex));

    if (!isException) {
      const isDevDep = devDeps.includes(dep);
      unusedDeps.push({
        name: dep,
        type: isDevDep ? 'devDependency' : 'dependency',
      });
    }
  }
}

const unusedPercentage = allDeps.length > 0 ? Math.round((unusedDeps.length / allDeps.length) * 100) : 0;

if (unusedDeps.length === 0) {
  console.log('✅ No unused dependencies detected');
  console.log('');
  console.log('Analysis included:');
  console.log('  ✓ Source code imports');
  console.log('  ✓ Config file dependencies (vite, vitest, eslint, etc.)');
  console.log('  ✓ package.json script commands');
  console.log('  ✓ @types/* packages matched to installed packages');
  console.log('  ✓ Test infrastructure (jsdom, testing-library, etc.)');
  console.log('  ✓ Build tool plugins and presets');
  console.log('');
  console.log('================================================================================');
  console.log('Summary: 0 unused dependencies');
  console.log('================================================================================');
  process.exit(0);
}

console.log('Potentially Unused Dependencies');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`⚠️  Found ${unusedDeps.length} potentially unused dependenc${unusedDeps.length === 1 ? 'y' : 'ies'} (${unusedPercentage}%)`);
console.log('');

// Group by type
const deps = unusedDeps.filter((d) => d.type === 'dependency');
const devDepsList = unusedDeps.filter((d) => d.type === 'devDependency');

if (deps.length > 0) {
  console.log(`  Production Dependencies (${deps.length}):`);
  deps.forEach((d) => {
    console.log(`    ${d.name}`);
  });
  console.log('');
}

if (devDepsList.length > 0) {
  console.log(`  Dev Dependencies (${devDepsList.length}):`);
  devDepsList.forEach((d) => {
    console.log(`    ${d.name}`);
  });
  console.log('');
}

console.log('Verification steps:');
console.log('  1. Search codebase:');
console.log('     grep -r "package-name" .');
console.log('');
console.log('  2. Check if it\'s a peer dependency or transitive dependency');
console.log('');
console.log('  3. If truly unused, remove with:');
console.log('     npm uninstall package-name');
console.log('');
console.log('Note: This check now includes:');
console.log('  • Source code imports');
console.log('  • Config file analysis (vite, vitest, eslint, etc.)');
console.log('  • package.json scripts parsing');
console.log('  • @types/* automatic matching');
console.log('  • Test infrastructure detection');
console.log('');
console.log('================================================================================');
console.log(`Summary: ${unusedDeps.length} potentially unused dependencies`);
console.log('================================================================================');

// Only fail if significant percentage is unused
process.exit(unusedPercentage > 10 ? 1 : 0);
