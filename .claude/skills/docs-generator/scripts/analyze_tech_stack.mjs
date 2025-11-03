#!/usr/bin/env node

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../../../..');

/**
 * Analyze technology stack from package.json
 */
export function analyzeTechStack() {
  console.log('\n' + '='.repeat(80));
  console.log('TECH STACK ANALYSIS');
  console.log('='.repeat(80));

  const packageJsonPath = resolve(projectRoot, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  const techStack = {
    meta: {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      nodeVersion: packageJson.volta?.node || packageJson.engines?.node || 'N/A',
      npmVersion: packageJson.volta?.npm || 'N/A'
    },
    categories: {
      'Build System': extractTechByCategory(allDeps, ['vite', 'rollup', 'esbuild']),
      'Frontend Framework': extractTechByCategory(allDeps, ['react', 'react-dom', 'react-router']),
      'State Management': extractTechByCategory(allDeps, ['redux', '@reduxjs/toolkit', 'react-redux', 'redux-saga']),
      'UI Library': extractTechByCategory(allDeps, ['@mantine/', 'react-icons']),
      'Web3': extractTechByCategory(allDeps, ['ethers', 'web3', '@metamask']),
      'Internationalization': extractTechByCategory(allDeps, ['i18n']),
      'Testing': extractTechByCategory(allDeps, ['vitest', '@testing-library', 'jsdom', '@vitest']),
      'TypeScript': extractTechByCategory(allDeps, ['typescript', '@types/']),
      'Code Quality': extractTechByCategory(allDeps, ['eslint', 'prettier', 'husky']),
      'Documentation': extractTechByCategory(allDeps, ['storybook', '@storybook']),
      'Utilities': extractTechByCategory(allDeps, ['axios', 'loglevel'])
    }
  };

  printTechStackSummary(techStack);

  return techStack;
}

/**
 * Extract technologies matching patterns
 */
function extractTechByCategory(deps, patterns) {
  const result = [];

  for (const [name, version] of Object.entries(deps)) {
    const matches = patterns.some(pattern => name.includes(pattern));

    if (matches) {
      result.push({
        name,
        version: version.replace(/^[\^~]/, ''),
        rawVersion: version
      });
    }
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Print tech stack summary
 */
function printTechStackSummary(techStack) {
  console.log('\n📦 Project:');
  console.log(`  Name: ${techStack.meta.name}`);
  console.log(`  Version: ${techStack.meta.version}`);
  console.log(`  Description: ${techStack.meta.description}`);
  console.log(`  Node: ${techStack.meta.nodeVersion}`);
  console.log(`  npm: ${techStack.meta.npmVersion}`);

  console.log('\n🏗️  Technology Stack:');
  for (const [category, techs] of Object.entries(techStack.categories)) {
    if (techs.length > 0) {
      console.log(`\n  ${category} (${techs.length}):`);
      for (const tech of techs) {
        console.log(`    - ${tech.name}@${tech.version}`);
      }
    }
  }
}

/**
 * Get key technologies (for executive summary)
 */
export function getKeyTechnologies(techStack) {
  const findTech = (name) => {
    for (const techs of Object.values(techStack.categories)) {
      const found = techs.find(t => t.name === name);
      if (found) return found;
    }
    return null;
  };

  return {
    buildTool: findTech('vite'),
    uiFramework: findTech('react'),
    uiLibrary: findTech('@mantine/core'),
    stateManagement: findTech('@reduxjs/toolkit'),
    router: findTech('react-router-dom'),
    web3: findTech('ethers'),
    testing: findTech('vitest'),
    i18n: findTech('i18next'),
    typescript: findTech('typescript')
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeTechStack();
}
