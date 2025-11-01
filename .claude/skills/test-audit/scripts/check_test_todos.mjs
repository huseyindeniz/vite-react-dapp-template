#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

const IGNORES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', 'docs', 'reports']);
const EXT_RE = /\.(ts|tsx|js|jsx)$/i;
const TEST_RE = /\.(test|spec)\.(ts|tsx|js|jsx)$/;
const TODO_RE = /\/\/\s*(TODO|FIXME|HACK)/i;

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
console.log('Test TODOs Check');
console.log('================================================================================');
console.log('');
console.log('Rule: Test files should not contain TODO/FIXME/HACK comments');
console.log('Incomplete tests indicate gaps in test coverage');
console.log('');

const roots = resolveRoots();
const todos = [];

// Collect TODOs from test files
for (const root of roots) {
  for (const file of walk(root)) {
    const relPath = path.relative(CWD, file);

    // Only check test files
    if (!TEST_RE.test(relPath)) continue;

    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const match = line.match(TODO_RE);
      if (match) {
        const type = match[1].toUpperCase();
        todos.push({
          file: relPath,
          line: idx + 1,
          type,
          text: line.trim(),
        });
      }
    });
  }
}

if (todos.length === 0) {
  console.log('✅ No TODOs found in test files');
  console.log('');
  console.log('================================================================================');
  console.log('Summary: 0 TODO(s)');
  console.log('================================================================================');
  process.exit(0);
}

console.log('TODOs in Test Files');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`⚠️  Found ${todos.length} TODO(s) in test files`);
console.log('');

// Group by type
const byType = {
  FIXME: todos.filter((t) => t.type === 'FIXME'),
  HACK: todos.filter((t) => t.type === 'HACK'),
  TODO: todos.filter((t) => t.type === 'TODO'),
};

for (const [type, items] of Object.entries(byType)) {
  if (items.length === 0) continue;

  console.log(`  ${type} (${items.length} occurrence(s)):`);
  items.forEach((t) => {
    console.log(`    File: ${t.file}:${t.line}`);
    console.log(`    Text: ${t.text}`);
    console.log('');
  });
}

console.log('Impact:');
console.log('  - TODO in tests = incomplete test coverage');
console.log('  - FIXME in tests = known failing or flaky tests');
console.log('  - HACK in tests = technical debt in test infrastructure');
console.log('');
console.log('Recommendations:');
console.log('  1. Complete TODOs before merging to main branch');
console.log('  2. Fix FIXMEs - they indicate broken or flaky tests');
console.log('  3. Refactor HACKs - technical debt compounds over time');
console.log('  4. If test is truly skipped, use test.skip() instead of TODO');
console.log('');
console.log('================================================================================');
console.log(`Summary: ${todos.length} TODO(s) in test files`);
console.log('================================================================================');

process.exit(1);
