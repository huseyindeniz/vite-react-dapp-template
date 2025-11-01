#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const CWD = process.cwd();
const TODO_RE = /\b(TODO|FIXME|HACK|XXX|BUG)\b/gi;

console.log('Code Quality Check: TODO Comments');
console.log('================================================================================\n');
console.log('Scanning for TODO/FIXME/HACK comments (technical debt tracking)...\n');

// Find all source files
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  cwd: CWD,
  absolute: true,
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**']
});

const results = {
  todos: [],
  fixmes: [],
  hacks: [],
  others: []
};

let totalCount = 0;

// Scan each file
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const relPath = path.relative(CWD, file);

  lines.forEach((line, idx) => {
    const match = line.match(TODO_RE);
    if (match) {
      const type = match[0].toUpperCase();
      const item = {
        file: relPath,
        line: idx + 1,
        type,
        text: line.trim()
      };

      totalCount++;

      switch (type) {
        case 'TODO':
          results.todos.push(item);
          break;
        case 'FIXME':
          results.fixmes.push(item);
          break;
        case 'HACK':
          results.hacks.push(item);
          break;
        default:
          results.others.push(item);
      }
    }
  });
}

// Output results
console.log('Technical Debt Markers');
console.log('--------------------------------------------------------------------------------\n');

if (totalCount === 0) {
  console.log('✅ No TODO/FIXME/HACK comments found\n');
  console.log('Great! Your codebase has no marked technical debt.');
  process.exit(0);
}

console.log(`❌ Found ${totalCount} technical debt marker(s)\n`);

// Summary by type
console.log('By Type:');
console.log(`  - TODO:  ${results.todos.length} (planned features/improvements)`);
console.log(`  - FIXME: ${results.fixmes.length} (bugs to fix)`);
console.log(`  - HACK:  ${results.hacks.length} (temporary workarounds)`);
console.log(`  - Other: ${results.others.length} (XXX, BUG, etc.)`);
console.log('');

// Show critical items first (FIXME, HACK)
if (results.fixmes.length > 0) {
  console.log('🔴 Critical: FIXME Comments (Bugs)');
  console.log('--------------------------------------------------------------------------------\n');
  results.fixmes.slice(0, 10).forEach(item => {
    console.log(`  ${item.file}:${item.line}`);
    console.log(`  → ${item.text}`);
    console.log('');
  });
  if (results.fixmes.length > 10) {
    console.log(`  ...and ${results.fixmes.length - 10} more FIXME(s)\n`);
  }
}

if (results.hacks.length > 0) {
  console.log('🟠 Warning: HACK Comments (Workarounds)');
  console.log('--------------------------------------------------------------------------------\n');
  results.hacks.slice(0, 10).forEach(item => {
    console.log(`  ${item.file}:${item.line}`);
    console.log(`  → ${item.text}`);
    console.log('');
  });
  if (results.hacks.length > 10) {
    console.log(`  ...and ${results.hacks.length - 10} more HACK(s)\n`);
  }
}

if (results.todos.length > 0) {
  console.log('🔵 Info: TODO Comments (Planned Work)');
  console.log('--------------------------------------------------------------------------------\n');
  results.todos.slice(0, 10).forEach(item => {
    console.log(`  ${item.file}:${item.line}`);
    console.log(`  → ${item.text}`);
    console.log('');
  });
  if (results.todos.length > 10) {
    console.log(`  ...and ${results.todos.length - 10} more TODO(s)\n`);
  }
}

console.log('--------------------------------------------------------------------------------');
console.log(`Summary: ${totalCount} technical debt marker(s) found\n`);
console.log('Recommendation:');
console.log('  1. Create GitHub issues for FIXME and HACK items');
console.log('  2. Convert TODO comments to tracked work items');
console.log('  3. Remove comments after completing the work\n');

process.exit(1);
