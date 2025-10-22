#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const CWD = process.cwd();
const META_PATH = path.join(CWD,'docs','architecture','analysis','scan.meta.json');
const OUTPUT = path.join(CWD,'docs','architecture','analysis','architecture-analysis.json');

const META = JSON.parse(fs.readFileSync(META_PATH,'utf8'));

const results = {
  singletons: { count: 0, files: [] },
  storeIssues: { items: [] },
  sagaPatterns: { multipleYieldAll: [], inefficientForks: [] },
  circularDeps: { potential: [] },
  serviceInStore: { detected: false, files: [] },
};

// Singleton detection
const SINGLETON_RE = /\.getInstance\(\)/g;

for (const file of META.files) {
  const fullPath = path.join(CWD, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Detect singletons
  const singletons = content.match(SINGLETON_RE);
  if (singletons) {
    results.singletons.count += singletons.length;
    results.singletons.files.push({ file, count: singletons.length });
  }

  // Check if this is store.ts or rootSaga
  if (file.includes('store.ts') || file.includes('rootSaga')) {
    const lines = content.split(/\r?\n/);

    // Check for service initialization in store
    if (content.includes('registerProvider') || content.includes('new ') && content.includes('Provider')) {
      results.serviceInStore.detected = true;
      results.serviceInStore.files.push({
        file,
        issue: 'Service initialization found in store configuration'
      });
    }

    // Check for multiple yield all in saga
    let yieldAllCount = 0;
    lines.forEach((line, idx) => {
      if (line.includes('yield all')) {
        yieldAllCount++;
        if (yieldAllCount > 1) {
          results.sagaPatterns.multipleYieldAll.push({
            file,
            line: idx + 1,
            issue: 'Multiple yield all statements - should be combined into one'
          });
        }
      }
    });
  }
}

// Check for circular dependencies (basic heuristic)
const fileImports = {};
for (const [file, imports] of Object.entries(META.imports || {})) {
  const relativeImports = [];
  const fileContent = fs.readFileSync(path.join(CWD, file), 'utf8');
  const importLines = fileContent.match(/import.*from\s+['"]\.\/.*/g) || [];

  importLines.forEach(imp => {
    const match = imp.match(/from\s+['"]([^'"]+)['"]/);
    if (match && match[1].startsWith('.')) {
      relativeImports.push(match[1]);
    }
  });

  if (relativeImports.length > 0) {
    fileImports[file] = relativeImports;
  }
}

// Simple circular dependency check (A imports B, B imports A)
const checked = new Set();
for (const [fileA, importsA] of Object.entries(fileImports)) {
  for (const imp of importsA) {
    const resolvedPath = path.resolve(path.dirname(path.join(CWD, fileA)), imp);
    const relativeResolved = path.relative(CWD, resolvedPath);

    const possiblePaths = [
      relativeResolved + '.ts',
      relativeResolved + '.tsx',
      relativeResolved + '/index.ts',
      relativeResolved + '/index.tsx',
    ];

    for (const fileB of possiblePaths) {
      if (fileImports[fileB]) {
        const importsB = fileImports[fileB];
        const reverseResolved = path.resolve(path.dirname(path.join(CWD, fileB)), '.');
        const key = [fileA, fileB].sort().join('::');

        if (!checked.has(key)) {
          checked.add(key);
          // Check if B imports something that resolves to A
          for (const impB of importsB) {
            const resolvedB = path.resolve(path.dirname(path.join(CWD, fileB)), impB);
            const relativeB = path.relative(CWD, resolvedB);
            if (relativeB.startsWith(fileA.replace(/\.(tsx?|jsx?)$/, ''))) {
              results.circularDeps.potential.push({
                files: [fileA, fileB],
                confidence: 'low'
              });
            }
          }
        }
      }
    }
  }
}

// Sort singletons by count
results.singletons.files.sort((a, b) => b.count - a.count);

// Architecture score
const issues = {
  singletonOveruse: results.singletons.count > 5 ? 20 : results.singletons.count * 4,
  serviceInStore: results.serviceInStore.detected ? 15 : 0,
  multipleYieldAll: results.sagaPatterns.multipleYieldAll.length * 10,
  circularDeps: results.circularDeps.potential.length * 5,
};

const totalDeductions = Object.values(issues).reduce((a,b) => a+b, 0);
const architectureScore = Math.max(0, 100 - totalDeductions);

results.summary = {
  architectureScore: Math.round(architectureScore),
  issues,
  grade: architectureScore >= 90 ? 'A' : architectureScore >= 75 ? 'B' : architectureScore >= 60 ? 'C' : architectureScore >= 45 ? 'D' : 'F',
  criticalIssues: results.serviceInStore.detected ? 1 : 0,
};

fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
console.log(`analyze_architecture: Score ${results.summary.architectureScore}/100 (${results.summary.grade})`);
console.log(`  - Singleton usages: ${results.singletons.count}`);
console.log(`  - Service in store: ${results.serviceInStore.detected ? 'YES' : 'NO'}`);
console.log(`  - Multiple yield all: ${results.sagaPatterns.multipleYieldAll.length}`);
console.log(`  - Potential circular deps: ${results.circularDeps.potential.length}`);
