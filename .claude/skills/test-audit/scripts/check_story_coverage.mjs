#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

const IGNORES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', 'docs', 'reports']);
const EXT_RE = /\.(ts|tsx|js|jsx)$/i;
const STORY_RE = /\.stories\.(ts|tsx|js|jsx)$/;
const COMPONENT_RE = /src\/.*(components?|ui)\/.*(tsx|jsx)$/i;

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
console.log('Storybook Coverage Check');
console.log('================================================================================');
console.log('');
console.log('Analyzing Storybook story files for UI components...');
console.log('');

const roots = resolveRoots();
const storyFiles = [];
const componentFiles = [];

// Collect all files
for (const root of roots) {
  for (const file of walk(root)) {
    const relPath = path.relative(CWD, file);

    if (STORY_RE.test(relPath)) {
      storyFiles.push(relPath);
    } else if (COMPONENT_RE.test(relPath)) {
      componentFiles.push(relPath);
    }
  }
}

// Find components without stories
const storyCovered = new Set();

storyFiles.forEach((f) => {
  const base = f.replace(/\.stories\.(ts|tsx|js|jsx)$/, '');
  storyCovered.add(base);
});

const componentFilesWithoutStories = [];
for (const file of componentFiles) {
  const base = file.replace(/\.(ts|tsx|js|jsx)$/, '');
  if (!storyCovered.has(base)) {
    componentFilesWithoutStories.push(file);
  }
}

// Calculate metrics
const totalComponents = componentFiles.length;
const storyCoverage = totalComponents > 0 ? Math.round((storyFiles.length / totalComponents) * 100) : 0;

console.log('Story Coverage Summary');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`Total components:         ${totalComponents}`);
console.log(`Story files:              ${storyFiles.length}`);
console.log(`Components without stories: ${componentFilesWithoutStories.length}`);
console.log(`Story coverage:           ~${storyCoverage}%`);
console.log('');

// Determine if this is acceptable
const MINIMUM_STORY_COVERAGE = 40; // 40% is reasonable for Storybook

if (storyCoverage >= MINIMUM_STORY_COVERAGE) {
  console.log(`✅ Story coverage is ${storyCoverage}% (>= ${MINIMUM_STORY_COVERAGE}% threshold)`);
  console.log('');
  console.log('================================================================================');
  console.log(`Summary: Story coverage at ${storyCoverage}%`);
  console.log('================================================================================');
  process.exit(0);
}

console.log(`⚠️  Story coverage is ${storyCoverage}% (< ${MINIMUM_STORY_COVERAGE}% threshold)`);
console.log('');

// Show sample of components without stories (limit to 20)
if (componentFilesWithoutStories.length > 0) {
  console.log('Sample Components Without Stories (first 20):');
  console.log('--------------------------------------------------------------------------------');
  console.log('');

  componentFilesWithoutStories.slice(0, 20).forEach((file) => {
    console.log(`  ${file}`);
  });

  if (componentFilesWithoutStories.length > 20) {
    console.log('');
    console.log(`  ... and ${componentFilesWithoutStories.length - 20} more`);
  }

  console.log('');
}

console.log('Recommendations:');
console.log('  1. Add .stories.ts(x) files for reusable UI components');
console.log('  2. Document component props, variants, and states');
console.log('  3. Use Storybook for visual regression testing');
console.log('  4. Focus on design system components first (buttons, inputs, etc.)');
console.log('');
console.log('Benefits of Storybook:');
console.log('  - Component documentation');
console.log('  - Visual testing and debugging');
console.log('  - Isolated component development');
console.log('  - Design system showcase');
console.log('');
console.log('================================================================================');
console.log(`Summary: Story coverage at ${storyCoverage}% (target: ${MINIMUM_STORY_COVERAGE}%)`);
console.log('================================================================================');

process.exit(1);
