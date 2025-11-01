#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

const IGNORES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', 'docs', 'reports']);
const EXT_RE = /\.(ts|tsx|js|jsx)$/i;
const DANGEROUS_HTML_RE = /dangerouslySetInnerHTML|innerHTML\s*=/gi;

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
console.log('Dangerous HTML Patterns Check');
console.log('================================================================================');
console.log('');
console.log('Rule: Avoid dangerouslySetInnerHTML and innerHTML - they can cause XSS attacks');
console.log('Security risks:');
console.log('  - XSS (Cross-Site Scripting) vulnerabilities');
console.log('  - Malicious script injection');
console.log('  - DOM-based attacks');
console.log('');

const roots = resolveRoots();
const violations = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const relPath = path.relative(CWD, file);
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      if (DANGEROUS_HTML_RE.test(line)) {
        const isDangerouslySetInnerHTML = /dangerouslySetInnerHTML/.test(line);
        const isInnerHTML = /innerHTML\s*=/.test(line);

        violations.push({
          file: relPath,
          line: idx + 1,
          type: isDangerouslySetInnerHTML ? 'dangerouslySetInnerHTML' : 'innerHTML',
          snippet: line.trim().substring(0, 100),
        });
      }
    });
  }
}

if (violations.length === 0) {
  console.log('✅ No dangerous HTML patterns found');
  console.log('');
  console.log('================================================================================');
  console.log('Summary: 0 violation(s)');
  console.log('================================================================================');
  process.exit(0);
}

console.log('Violations');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`❌ Found ${violations.length} dangerous HTML pattern(s)`);
console.log('');

const byType = {
  dangerouslySetInnerHTML: violations.filter((v) => v.type === 'dangerouslySetInnerHTML'),
  innerHTML: violations.filter((v) => v.type === 'innerHTML'),
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
console.log('  - Use React\'s built-in rendering (safest):');
console.log('    • {content} for text');
console.log('    • JSX for structured content');
console.log('  - If you must render HTML:');
console.log('    • Sanitize with DOMPurify library first');
console.log('    • Use dangerouslySetInnerHTML only with sanitized content');
console.log('    • Never trust user input');
console.log('');
console.log('Example:');
console.log('  import DOMPurify from \'dompurify\';');
console.log('  const clean = DOMPurify.sanitize(dirtyHTML);');
console.log('  <div dangerouslySetInnerHTML={{ __html: clean }} />');
console.log('');
console.log('================================================================================');
console.log(`Summary: ${violations.length} violation(s)`);
console.log('================================================================================');

process.exit(1);
