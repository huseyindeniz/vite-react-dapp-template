#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const CWD = process.cwd();
const META_PATH = path.join(CWD,'docs','architecture','analysis','scan.meta.json');
const OUTPUT = path.join(CWD,'docs','architecture','analysis','code-quality.json');

// Read scan metadata
const META = JSON.parse(fs.readFileSync(META_PATH,'utf8'));

// Patterns to detect
const TYPE_IGNORE_RE = /@ts-ignore|@ts-nocheck/g;
const ESLINT_DISABLE_RE = /eslint-disable/g;
const ANY_TYPE_RE = /:\s*any\b/g;
const TODO_RE = /\b(TODO|FIXME|HACK|XXX|BUG)\b/gi;
const DEBUG_LOG_RE = /log\.debug\(/g;
const CONSOLE_RE = /console\.(log|warn|error|info|debug)\(/g;
const DEEP_IMPORT_RE = /from\s+['"](\.\.\/){4,}/g;
const EXPORT_ALL_RE = /export\s+\*\s+from/g;

const results = {
  typeIgnores: { count: 0, files: [] },
  eslintDisables: { count: 0, files: [] },
  anyType: { count: 0, files: [] },
  todos: { count: 0, items: [] },
  debugLogs: { count: 0, files: [] },
  consoleLogs: { count: 0, files: [] },
  deepImports: { count: 0, files: [] },
  exportAll: { count: 0, files: [] },
};

// Analyze each file
for (const file of META.files) {
  const fullPath = path.join(CWD, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  // Type ignores
  const typeIgnores = content.match(TYPE_IGNORE_RE);
  if (typeIgnores) {
    results.typeIgnores.count += typeIgnores.length;
    results.typeIgnores.files.push({ file, count: typeIgnores.length });
  }

  // ESLint disables
  const eslintDisables = content.match(ESLINT_DISABLE_RE);
  if (eslintDisables) {
    results.eslintDisables.count += eslintDisables.length;
    results.eslintDisables.files.push({ file, count: eslintDisables.length });
  }

  // Any type usage
  const anyTypes = content.match(ANY_TYPE_RE);
  if (anyTypes) {
    results.anyType.count += anyTypes.length;
    results.anyType.files.push({ file, count: anyTypes.length });
  }

  // TODOs with line numbers
  lines.forEach((line, idx) => {
    const match = line.match(TODO_RE);
    if (match) {
      results.todos.count++;
      results.todos.items.push({
        file,
        line: idx + 1,
        type: match[0].toUpperCase(),
        text: line.trim()
      });
    }
  });

  // Debug logs
  const debugLogs = content.match(DEBUG_LOG_RE);
  if (debugLogs) {
    results.debugLogs.count += debugLogs.length;
    results.debugLogs.files.push({ file, count: debugLogs.length });
  }

  // Console logs
  const consoleLogs = content.match(CONSOLE_RE);
  if (consoleLogs) {
    results.consoleLogs.count += consoleLogs.length;
    results.consoleLogs.files.push({ file, count: consoleLogs.length });
  }

  // Deep imports
  const deepImports = content.match(DEEP_IMPORT_RE);
  if (deepImports) {
    results.deepImports.count += deepImports.length;
    results.deepImports.files.push({ file, count: deepImports.length });
  }

  // Export all
  const exportAll = content.match(EXPORT_ALL_RE);
  if (exportAll) {
    results.exportAll.count += exportAll.length;
    results.exportAll.files.push({ file, count: exportAll.length });
  }
}

// Sort files by count (highest first)
Object.keys(results).forEach(key => {
  if (results[key].files) {
    results[key].files.sort((a, b) => b.count - a.count);
  }
});

// Calculate quality score (100 = perfect)
const totalFiles = META.counts.files;
const deductions = {
  typeIgnores: Math.min(results.typeIgnores.count, 20),
  eslintDisables: Math.min(results.eslintDisables.files.length, 15),
  anyType: Math.min(results.anyType.count, 15),
  todos: Math.min(results.todos.count / 2, 10),
  debugLogs: Math.min(results.debugLogs.count / 10, 10),
  consoleLogs: results.consoleLogs.count * 2,
  deepImports: results.deepImports.count * 5,
  exportAll: results.exportAll.count * 10,
};

const totalDeductions = Object.values(deductions).reduce((a,b) => a+b, 0);
const qualityScore = Math.max(0, Math.min(100, 100 - totalDeductions));

results.summary = {
  totalFiles,
  qualityScore: Math.round(qualityScore),
  deductions,
  grade: qualityScore >= 90 ? 'A' : qualityScore >= 75 ? 'B' : qualityScore >= 60 ? 'C' : qualityScore >= 45 ? 'D' : 'F'
};

fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
console.log(`analyze_code_quality: Score ${results.summary.qualityScore}/100 (${results.summary.grade})`);
console.log(`  - Type ignores: ${results.typeIgnores.count}`);
console.log(`  - ESLint disables: ${results.eslintDisables.count}`);
console.log(`  - TODO comments: ${results.todos.count}`);
console.log(`  - Debug logs: ${results.debugLogs.count}`);
console.log(`  - Export all violations: ${results.exportAll.count}`);
