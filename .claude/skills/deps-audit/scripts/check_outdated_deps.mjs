#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

console.log('================================================================================');
console.log('Outdated Dependencies Check');
console.log('================================================================================');
console.log('');
console.log('Checking for outdated packages (minor version updates available)...');
console.log('');

// Read package.json
let pkgJson;
try {
  pkgJson = JSON.parse(fs.readFileSync(path.join(CWD, 'package.json'), 'utf8'));
} catch (error) {
  console.error('❌ Could not read package.json');
  process.exit(1);
}

const currentDeps = pkgJson.dependencies || {};
const currentDevDeps = pkgJson.devDependencies || {};
const totalPackages = Object.keys(currentDeps).length + Object.keys(currentDevDeps).length;

console.log(`Total packages: ${totalPackages}`);
console.log('');

// Check for outdated packages using npm-check-updates
let outdatedPackages = [];

try {
  console.log('Running npm-check-updates (this may take a moment)...');
  console.log('');

  const ncuOutput = execSync('npx --yes npm-check-updates --jsonAll --target minor', {
    cwd: CWD,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
    timeout: 60000,
  });

  const ncuData = JSON.parse(ncuOutput);
  const deps = ncuData.dependencies || {};
  const devDeps = ncuData.devDependencies || {};

  // Find packages that have updates available
  Object.keys(deps).forEach((name) => {
    if (currentDeps[name] && currentDeps[name] !== deps[name]) {
      outdatedPackages.push({
        name,
        current: currentDeps[name],
        available: deps[name],
        type: 'dependency',
      });
    }
  });

  Object.keys(devDeps).forEach((name) => {
    if (currentDevDeps[name] && currentDevDeps[name] !== devDeps[name]) {
      outdatedPackages.push({
        name,
        current: currentDevDeps[name],
        available: devDeps[name],
        type: 'devDependency',
      });
    }
  });
} catch (error) {
  console.error('❌ Error running npm-check-updates');
  console.error('   Make sure you have npm installed and network access');
  console.error('');
  console.error('   Error:', error.message);
  process.exit(1);
}

const outdatedPercentage = totalPackages > 0 ? Math.round((outdatedPackages.length / totalPackages) * 100) : 0;

if (outdatedPackages.length === 0) {
  console.log('✅ All packages are up-to-date (minor versions)');
  console.log('');
  console.log('================================================================================');
  console.log('Summary: 0 outdated package(s)');
  console.log('================================================================================');
  process.exit(0);
}

console.log('Outdated Packages');
console.log('--------------------------------------------------------------------------------');
console.log('');
console.log(`⚠️  Found ${outdatedPackages.length} outdated package(s) (${outdatedPercentage}% of total)`);
console.log('');

// Group by type
const deps = outdatedPackages.filter((p) => p.type === 'dependency');
const devDeps = outdatedPackages.filter((p) => p.type === 'devDependency');

if (deps.length > 0) {
  console.log(`  Production Dependencies (${deps.length}):`);
  deps.forEach((pkg) => {
    console.log(`    ${pkg.name}: ${pkg.current} → ${pkg.available}`);
  });
  console.log('');
}

if (devDeps.length > 0) {
  console.log(`  Dev Dependencies (${devDeps.length}):`);
  devDeps.forEach((pkg) => {
    console.log(`    ${pkg.name}: ${pkg.current} → ${pkg.available}`);
  });
  console.log('');
}

console.log('Recommendations:');
console.log('  1. Review release notes for each package before updating');
console.log('  2. Update dev dependencies first (lower risk)');
console.log('  3. Update production dependencies with caution');
console.log('  4. Run tests after updating to verify compatibility');
console.log('  5. Consider using deps-minor skill for safe automated updates');
console.log('');
console.log('Update commands:');
console.log('  # Update specific package');
console.log('  npm install package-name@latest');
console.log('');
console.log('  # Update all minor versions (use with caution)');
console.log('  npx npm-check-updates -u --target minor && npm install');
console.log('');
console.log('Impact:');
console.log('  - Outdated packages may have security vulnerabilities');
console.log('  - Missing bug fixes and performance improvements');
console.log('  - Technical debt accumulates over time');
console.log('');
console.log('================================================================================');
console.log(`Summary: ${outdatedPackages.length} outdated package(s) (${outdatedPercentage}%)`);
console.log('================================================================================');

// Exit with failure if any packages are outdated
process.exit(outdatedPackages.length > 0 ? 1 : 0);
