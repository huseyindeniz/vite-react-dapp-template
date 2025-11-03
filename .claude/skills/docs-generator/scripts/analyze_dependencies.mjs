#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../../../..');

/**
 * Analyze project dependencies from package.json
 */
export function analyzeDependencies() {
  console.log('\n' + '='.repeat(80));
  console.log('DEPENDENCY ANALYSIS');
  console.log('='.repeat(80));

  const packageJsonPath = resolve(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const analysis = {
    production: analyzeDependencyGroup(packageJson.dependencies || {}, 'production'),
    development: analyzeDependencyGroup(packageJson.devDependencies || {}, 'development'),
    summary: {
      totalProduction: Object.keys(packageJson.dependencies || {}).length,
      totalDevelopment: Object.keys(packageJson.devDependencies || {}).length,
      categories: categorizeAllDependencies(packageJson)
    }
  };

  printAnalysisSummary(analysis);

  return analysis;
}

/**
 * Analyze a group of dependencies
 */
function analyzeDependencyGroup(deps, type) {
  const results = {};

  for (const [name, version] of Object.entries(deps)) {
    results[name] = {
      current: version,
      latest: getLatestVersion(name),
      status: 'unknown',
      category: categorizeDependency(name)
    };

    // Determine status
    const current = version.replace(/^[\^~]/, '');
    if (results[name].latest === 'N/A') {
      results[name].status = 'unknown';
    } else if (results[name].latest === current) {
      results[name].status = 'up-to-date';
    } else {
      results[name].status = 'outdated';
    }
  }

  return results;
}

/**
 * Get latest version from npm (with caching)
 */
const versionCache = {};
function getLatestVersion(packageName) {
  if (versionCache[packageName]) {
    return versionCache[packageName];
  }

  try {
    const result = execSync(`npm view ${packageName} version`, {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    versionCache[packageName] = result;
    return result;
  } catch (error) {
    versionCache[packageName] = 'N/A';
    return 'N/A';
  }
}

/**
 * Categorize a single dependency by name
 */
function categorizeDependency(name) {
  // React ecosystem
  if (name.includes('react') || name.includes('redux')) return 'react-ecosystem';

  // UI frameworks
  if (name.includes('mantine') || name.includes('chakra') || name.includes('emotion')) return 'ui-framework';

  // Web3
  if (name.includes('ethers') || name.includes('web3') || name.includes('metamask')) return 'web3';

  // i18n
  if (name.includes('i18n')) return 'i18n';

  // Build tools
  if (name.includes('vite') || name.includes('rollup') || name.includes('esbuild')) return 'build-tools';

  // Testing
  if (name.includes('test') || name.includes('vitest') || name.includes('jest') || name.includes('storybook')) return 'testing';

  // TypeScript
  if (name.includes('typescript') || name.includes('@types/')) return 'typescript';

  // Linting/Formatting
  if (name.includes('eslint') || name.includes('prettier')) return 'code-quality';

  // Router
  if (name.includes('router')) return 'routing';

  return 'utilities';
}

/**
 * Categorize all dependencies into groups
 */
function categorizeAllDependencies(packageJson) {
  const categories = {};

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  for (const [name, version] of Object.entries(allDeps)) {
    const category = categorizeDependency(name);

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push({
      name,
      version: version.replace(/^[\^~]/, ''),
      current: version
    });
  }

  // Sort categories by count
  return Object.fromEntries(
    Object.entries(categories).sort((a, b) => b[1].length - a[1].length)
  );
}

/**
 * Print analysis summary
 */
function printAnalysisSummary(analysis) {
  console.log('\n📊 Dependency Summary:');
  console.log(`  Production: ${analysis.summary.totalProduction}`);
  console.log(`  Development: ${analysis.summary.totalDevelopment}`);
  console.log(`  Total: ${analysis.summary.totalProduction + analysis.summary.totalDevelopment}`);

  console.log('\n📦 Categories:');
  for (const [category, deps] of Object.entries(analysis.summary.categories)) {
    console.log(`  ${category}: ${deps.length} packages`);
  }

  // Count outdated packages
  const outdatedProd = Object.values(analysis.production)
    .filter(d => d.status === 'outdated').length;
  const outdatedDev = Object.values(analysis.development)
    .filter(d => d.status === 'outdated').length;

  if (outdatedProd + outdatedDev > 0) {
    console.log('\n⚠️  Outdated Packages:');
    console.log(`  Production: ${outdatedProd}`);
    console.log(`  Development: ${outdatedDev}`);
  } else {
    console.log('\n✅ All packages are up-to-date!');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeDependencies();
}
