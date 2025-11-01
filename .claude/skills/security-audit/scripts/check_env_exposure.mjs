#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

const IGNORES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', 'docs', 'reports']);
const EXT_RE = /\.(ts|tsx|js|jsx)$/i;
const ENV_EXPOSE_RE = /import\.meta\.env\.(\w+)/g;

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

console.log('================================================================================');
console.log('Environment Variable Exposure Check');
console.log('================================================================================');
console.log('');
console.log('Rule: Only expose environment variables prefixed with VITE_ to client code');
console.log('Safe environment variables:');
console.log('  - import.meta.env.VITE_* (explicitly safe for client)');
console.log('  - import.meta.env.MODE (Vite built-in)');
console.log('  - import.meta.env.DEV (Vite built-in)');
console.log('  - import.meta.env.PROD (Vite built-in)');
console.log('');
console.log('Unsafe: Any non-VITE_ prefixed custom variables in client code');
console.log('');

const roots = resolveRoots();
const violations = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const relPath = path.relative(CWD, file);

    // Skip vite.config files - they're server-side
    if (relPath.includes('vite.config')) continue;
    if (relPath.includes('.env')) continue;

    const content = fs.readFileSync(file, 'utf8');
    const matches = Array.from(content.matchAll(ENV_EXPOSE_RE));

    matches.forEach((match) => {
      const varName = match[1];
      const fullMatch = match[0];

      // Safe built-in variables
      const safeVars = ['MODE', 'DEV', 'PROD', 'BASE_URL', 'SSR'];
      if (safeVars.includes(varName)) return;

      // Safe VITE_ prefixed variables
      if (varName.startsWith('VITE_')) return;

      // This is potentially unsafe exposure
      const lines = content.split(/\r?\n/);
      const lineIdx = lines.findIndex((line) => line.includes(fullMatch));

      violations.push({
        file: relPath,
        line: lineIdx + 1,
        varName: fullMatch,
        snippet: lines[lineIdx]?.trim().substring(0, 100) || fullMatch,
      });
    });
  }
}

if (violations.length === 0) {
  console.log('✅ No unsafe environment variable exposure found');
  console.log('');
  console.log('================================================================================');
  console.log('Summary: 0 violation(s)');
  console.log('================================================================================');
  process.exit(0);
}

console.log('Violations');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`❌ Found ${violations.length} unsafe environment variable exposure(s)`);
console.log('');

violations.forEach((v) => {
  console.log(`  File: ${v.file}:${v.line}`);
  console.log(`  Variable: ${v.varName}`);
  console.log(`  Snippet: ${v.snippet}`);
  console.log('');
});

console.log('Fix:');
console.log('  1. Rename environment variables to start with VITE_ prefix');
console.log('     Example: API_SECRET → VITE_API_KEY (if safe to expose)');
console.log('');
console.log('  2. If the variable contains secrets, DO NOT expose to client:');
console.log('     - Keep it server-side only');
console.log('     - Use server-side API endpoints instead');
console.log('     - Never expose API secrets, database credentials, etc.');
console.log('');
console.log('  3. Update your .env file:');
console.log('     VITE_API_URL=https://api.example.com  ✅ Safe (public URL)');
console.log('     API_SECRET=abc123                      ❌ Never expose');
console.log('');
console.log('================================================================================');
console.log(`Summary: ${violations.length} violation(s)`);
console.log('================================================================================');

process.exit(1);
