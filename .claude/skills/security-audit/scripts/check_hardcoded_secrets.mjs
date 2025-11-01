#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

const IGNORES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', 'docs', 'reports']);
const EXT_RE = /\.(ts|tsx|js|jsx)$/i;

// Security patterns
const API_KEY_RE = /(api[_-]?key|apikey|access[_-]?token|secret[_-]?key)\s*[=:]\s*['"]\w{20,}['"]/gi;
const PASSWORD_RE = /password\s*[=:]\s*['"]\w+['"]/gi;

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
console.log('Hardcoded Secrets Check');
console.log('================================================================================');
console.log('');
console.log('Rule: Never hardcode secrets (API keys, passwords, tokens) in source code');
console.log('Use environment variables instead: process.env.API_KEY or import.meta.env.VITE_API_KEY');
console.log('');

const roots = resolveRoots();
const violations = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const relPath = path.relative(CWD, file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      // API keys / tokens
      const apiKeyMatch = line.match(API_KEY_RE);
      if (apiKeyMatch && !line.includes('process.env') && !line.includes('import.meta.env')) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'API_KEY',
          snippet: line.trim().substring(0, 100),
        });
      }

      // Passwords
      const pwMatch = line.match(PASSWORD_RE);
      if (pwMatch && !line.includes('process.env') && !line.includes('import.meta.env')) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'PASSWORD',
          snippet: line.trim().substring(0, 100),
        });
      }
    });
  }
}

if (violations.length === 0) {
  console.log('✅ No hardcoded secrets found');
  console.log('');
  console.log('================================================================================');
  console.log('Summary: 0 violation(s)');
  console.log('================================================================================');
  process.exit(0);
}

console.log('Violations');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`❌ Found ${violations.length} hardcoded secret(s)`);
console.log('');

const byType = {
  API_KEY: violations.filter((v) => v.type === 'API_KEY'),
  PASSWORD: violations.filter((v) => v.type === 'PASSWORD'),
};

for (const [type, items] of Object.entries(byType)) {
  if (items.length === 0) continue;

  console.log(`  ${type} (${items.length} occurrence(s)):`);
  items.forEach((v) => {
    console.log(`    File: ${v.file}:${v.line}`);
    console.log(`    Snippet: ${v.snippet}`);
    console.log('');
  });
}

console.log('Fix:');
console.log('  1. Move secrets to environment variables');
console.log('  2. Use .env file for local development (never commit .env!)');
console.log('  3. Use process.env.API_KEY or import.meta.env.VITE_API_KEY');
console.log('  4. For Vite projects, prefix with VITE_ to expose to client code');
console.log('');
console.log('================================================================================');
console.log(`Summary: ${violations.length} violation(s)`);
console.log('================================================================================');

process.exit(1);
