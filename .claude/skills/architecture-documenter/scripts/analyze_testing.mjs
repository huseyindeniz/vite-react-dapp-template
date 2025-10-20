#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const CWD = process.cwd();
const META_PATH = path.join(CWD,'docs','architecture','analysis','scan.meta.json');
const OUTPUT = path.join(CWD,'docs','architecture','analysis','testing-analysis.json');

const META = JSON.parse(fs.readFileSync(META_PATH,'utf8'));

const results = {
  testFiles: { count: 0, files: [] },
  storyFiles: { count: 0, files: [] },
  sourceFiles: { count: 0 },
  untested: { files: [] },
  testTodos: { count: 0, items: [] },
};

const TEST_RE = /\.(test|spec)\.(ts|tsx|js|jsx)$/;
const STORY_RE = /\.stories\.(ts|tsx|js|jsx)$/;

// Categorize files
for (const file of META.files) {
  if (TEST_RE.test(file)) {
    results.testFiles.count++;
    results.testFiles.files.push(file);

    // Check for TODOs in test files
    const fullPath = path.join(CWD, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      if (/\/\/\s*TODO/.test(line)) {
        results.testTodos.count++;
        results.testTodos.items.push({
          file,
          line: idx + 1,
          text: line.trim()
        });
      }
    });
  } else if (STORY_RE.test(file)) {
    results.storyFiles.count++;
    results.storyFiles.files.push(file);
  } else {
    results.sourceFiles.count++;
  }
}

// Find untested source files (heuristic: has corresponding .test or .stories file?)
const testedPaths = new Set();
results.testFiles.files.forEach(f => {
  const base = f.replace(/\.(test|spec)\.(ts|tsx|js|jsx)$/, '');
  testedPaths.add(base);
});
results.storyFiles.files.forEach(f => {
  const base = f.replace(/\.stories\.(ts|tsx|js|jsx)$/, '');
  testedPaths.add(base);
});

for (const file of META.files) {
  if (!TEST_RE.test(file) && !STORY_RE.test(file)) {
    const base = file.replace(/\.(ts|tsx|js|jsx)$/, '');
    if (!testedPaths.has(base)) {
      results.untested.files.push(file);
    }
  }
}

// Coverage estimation (simple heuristic)
const testableFiles = results.sourceFiles.count;
const testedFiles = testedPaths.size;
const coverageEstimate = testableFiles > 0 ? Math.round((testedFiles / testableFiles) * 100) : 0;

// Testing score
const testRatio = testableFiles > 0 ? results.testFiles.count / testableFiles : 0;
const storyRatio = testableFiles > 0 ? results.storyFiles.count / testableFiles : 0;

// Score formula: 50% test ratio + 25% story ratio + 25% coverage estimate
// Note: TODOs are tracked separately as warnings, not deducted from score
const testingScore = Math.max(0, Math.min(100,
  (testRatio * 50) + (storyRatio * 25) + (coverageEstimate * 0.25)
));

results.summary = {
  totalSourceFiles: testableFiles,
  testFiles: results.testFiles.count,
  storyFiles: results.storyFiles.count,
  testedFiles,
  untestedFiles: results.untested.files.length,
  coverageEstimate: `~${coverageEstimate}%`,
  testTodos: results.testTodos.count,
  testingScore: Math.round(testingScore),
  grade: testingScore >= 90 ? 'A' : testingScore >= 75 ? 'B' : testingScore >= 60 ? 'C' : testingScore >= 45 ? 'D' : 'F',
  testRatio: `${results.testFiles.count}/${testableFiles} (${Math.round(testRatio * 100)}%)`,
  storyRatio: `${results.storyFiles.count}/${testableFiles} (${Math.round(storyRatio * 100)}%)`,
};

fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
console.log(`analyze_testing: Score ${results.summary.testingScore}/100 (${results.summary.grade})`);
console.log(`  - Test files: ${results.testFiles.count}/${testableFiles} (${Math.round(testRatio * 100)}%)`);
console.log(`  - Story files: ${results.storyFiles.count}/${testableFiles} (${Math.round(storyRatio * 100)}%)`);
console.log(`  - Coverage estimate: ~${coverageEstimate}%`);
console.log(`  - Test TODOs: ${results.testTodos.count}`);
