#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
const CWD = process.cwd();
const META_PATH = path.join(CWD,'docs','architecture','analysis','scan.meta.json');
const OUTPUT = path.join(CWD,'docs','architecture','analysis','dependencies-analysis.json');

const META = JSON.parse(fs.readFileSync(META_PATH,'utf8'));

const results = {
  outdated: { count: 0, packages: [] },
  totalDeps: 0,
  totalDevDeps: 0,
  duplicates: [],
  unusedDeps: { potential: [] },
};

// Get package.json
const pkg = META.package || {};
results.totalDeps = (pkg.deps || []).length;
results.totalDevDeps = (pkg.devDeps || []).length;

// Check for outdated packages (using npm-check-updates)
try {
  const ncuOutput = execSync('npx --yes npm-check-updates --jsonAll --target minor', {
    cwd: CWD,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
    timeout: 30000,
  });

  const ncuData = JSON.parse(ncuOutput);
  const deps = ncuData.dependencies || {};
  const devDeps = ncuData.devDependencies || {};

  // Count outdated packages (those that have updates available)
  // NCU returns current versions, we need to compare with what's in package.json
  const pkgJson = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf8'));
  const currentDeps = pkgJson.dependencies || {};
  const currentDevDeps = pkgJson.devDependencies || {};

  Object.keys(deps).forEach(name => {
    if (currentDeps[name] && currentDeps[name] !== deps[name]) {
      results.outdated.count++;
      results.outdated.packages.push({
        name,
        current: currentDeps[name],
        available: deps[name],
        type: 'dependency'
      });
    }
  });

  Object.keys(devDeps).forEach(name => {
    if (currentDevDeps[name] && currentDevDeps[name] !== devDeps[name]) {
      results.outdated.count++;
      results.outdated.packages.push({
        name,
        current: currentDevDeps[name],
        available: devDeps[name],
        type: 'devDependency'
      });
    }
  });

} catch (error) {
  console.log('  - npm-check-updates not available, skipping outdated check');
  results.outdated.error = 'Could not check for outdated packages';
}

// Check for unused dependencies (heuristic: not in imports)
const allImportedModules = new Set();
for (const [file, imports] of Object.entries(META.imports || {})) {
  imports.forEach(imp => {
    // Extract base package name (handle scoped packages)
    const basePkg = imp.startsWith('@')
      ? imp.split('/').slice(0, 2).join('/')
      : imp.split('/')[0];
    allImportedModules.add(basePkg);
  });
}

const allDeps = [...(pkg.deps || []), ...(pkg.devDeps || [])];
for (const dep of allDeps) {
  if (!allImportedModules.has(dep)) {
    // Special exceptions: build tools, CLI tools, config packages
    const exceptions = ['husky', 'prettier', 'eslint', 'vite', 'vitest', 'storybook', 'typescript', 'postcss'];
    const isException = exceptions.some(ex => dep.includes(ex));

    if (!isException) {
      results.unusedDeps.potential.push({
        name: dep,
        note: 'Not found in import statements (may be indirect dependency or build tool)'
      });
    }
  }
}

// Dependency health score
const outdatedRatio = results.totalDeps > 0 ? results.outdated.count / (results.totalDeps + results.totalDevDeps) : 0;
const unusedRatio = results.totalDeps > 0 ? results.unusedDeps.potential.length / (results.totalDeps + results.totalDevDeps) : 0;

const deductions = {
  outdated: Math.min(outdatedRatio * 100, 30),
  unused: Math.min(unusedRatio * 50, 20),
};

const dependencyScore = Math.max(0, 100 - Object.values(deductions).reduce((a,b) => a+b, 0));

results.summary = {
  totalPackages: results.totalDeps + results.totalDevDeps,
  dependencies: results.totalDeps,
  devDependencies: results.totalDevDeps,
  outdated: results.outdated.count,
  potentiallyUnused: results.unusedDeps.potential.length,
  dependencyScore: Math.round(dependencyScore),
  grade: dependencyScore >= 90 ? 'A' : dependencyScore >= 75 ? 'B' : dependencyScore >= 60 ? 'C' : dependencyScore >= 45 ? 'D' : 'F',
  outdatedPercentage: `${Math.round(outdatedRatio * 100)}%`,
};

fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
console.log(`analyze_dependencies: Score ${results.summary.dependencyScore}/100 (${results.summary.grade})`);
console.log(`  - Total packages: ${results.summary.totalPackages}`);
console.log(`  - Outdated: ${results.outdated.count} (${results.summary.outdatedPercentage})`);
console.log(`  - Potentially unused: ${results.unusedDeps.potential.length}`);
