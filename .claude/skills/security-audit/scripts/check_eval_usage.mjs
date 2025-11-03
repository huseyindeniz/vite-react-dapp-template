#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

const IGNORES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', 'docs', 'reports']);
const EXT_RE = /\.(ts|tsx|js|jsx)$/i;
const EVAL_RE = /\beval\(/g;

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
console.log('eval() Usage Check');
console.log('================================================================================');
console.log('');
console.log('Rule: Never use eval() - it executes arbitrary code and is a major security risk');
console.log('Security risks:');
console.log('  - Code injection vulnerabilities');
console.log('  - XSS (Cross-Site Scripting) attacks');
console.log('  - Arbitrary code execution');
console.log('  - Performance issues');
console.log('');

const roots = resolveRoots();
const violations = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const relPath = path.relative(CWD, file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      if (EVAL_RE.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          snippet: line.trim().substring(0, 100),
        });
      }
    });
  }
}

if (violations.length === 0) {
  console.log('✅ No eval() usage found');
  console.log('');
  console.log('================================================================================');
  console.log('Summary: 0 violation(s)');
  console.log('================================================================================');
  process.exit(0);
}

console.log('Violations');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`❌ Found ${violations.length} eval() usage(s)`);
console.log('');

violations.forEach((v) => {
  console.log(`  File: ${v.file}:${v.line}`);
  console.log(`  Snippet: ${v.snippet}`);
  console.log('');
});

console.log('Fix:');
console.log('  - Replace eval() with safer alternatives:');
console.log('    • JSON.parse() for JSON data');
console.log('    • Function constructor (still risky, use carefully)');
console.log('    • Direct function calls');
console.log('    • Template literals');
console.log('  - If you absolutely need dynamic code, use a sandboxed environment');
console.log('');
console.log('================================================================================');
console.log(`Summary: ${violations.length} violation(s)`);
console.log('================================================================================');

process.exit(1);
