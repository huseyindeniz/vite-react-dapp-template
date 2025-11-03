#!/usr/bin/env node

import path from 'path';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { analyzeArchitecture } from './analyze_architecture.mjs';
import { analyzeDependencies } from './analyze_dependencies.mjs';
import { analyzeTechStack, getKeyTechnologies } from './analyze_tech_stack.mjs';
import { ensureDocsOutputDir, writeFile } from './utils/fileUtils.mjs';
import { renderTemplate } from './utils/renderTemplate.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../../../..');
const templatesDir = resolve(__dirname, '../templates');

/**
 * Generate executive-style documentation using templates
 */
export function generateExecutiveDocs() {
  console.log('\n' + '='.repeat(80));
  console.log('GENERATING EXECUTIVE DOCUMENTATION');
  console.log('='.repeat(80));

  const outputDir = ensureDocsOutputDir();

  // Collect all data
  console.log('\n📊 Collecting data...');
  const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf-8'));
  const architecture = analyzeArchitecture();
  const dependencies = analyzeDependencies();
  const techStack = analyzeTechStack();

  // Prepare template data
  const templateData = prepareTemplateData(packageJson, architecture, dependencies, techStack);

  const docs = [];

  // 1. Generate Architecture Report
  console.log('\n📝 Generating Architecture Report...');
  const archReportPath = path.join(outputDir, 'ARCHITECTURE.md');
  const archTemplate = path.join(templatesDir, 'architecture-report.template.md');
  const archContent = renderTemplate(archTemplate, templateData.architecture);
  writeFile(archReportPath, archContent);
  docs.push({ name: 'Architecture Report', path: archReportPath });

  // 2. Generate Tech Stack Analysis
  console.log('📝 Generating Tech Stack Analysis...');
  const techStackPath = path.join(outputDir, 'TECH_STACK.md');
  const techTemplate = path.join(templatesDir, 'tech-stack.template.md');
  const techContent = renderTemplate(techTemplate, templateData.techStack);
  writeFile(techStackPath, techContent);
  docs.push({ name: 'Tech Stack', path: techStackPath });

  // 3. Generate Dependencies Analysis
  console.log('📝 Generating Dependencies Analysis...');
  const depsPath = path.join(outputDir, 'DEPENDENCIES.md');
  const depsTemplate = path.join(templatesDir, 'dependencies.template.md');
  const depsContent = renderTemplate(depsTemplate, templateData.dependencies);
  writeFile(depsPath, depsContent);
  docs.push({ name: 'Dependencies', path: depsPath });

  console.log('\n' + '='.repeat(80));
  console.log('EXECUTIVE DOCUMENTATION GENERATED');
  console.log('='.repeat(80));

  console.log(`\n✅ Generated ${docs.length} documents:`);
  docs.forEach(d => console.log(`  - ${d.name}: ${path.basename(d.path)}`));

  return docs;
}

/**
 * Prepare data for templates
 */
function prepareTemplateData(packageJson, architecture, dependencies, techStack) {
  const keyTech = getKeyTechnologies(techStack);
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    architecture: prepareArchitectureData(packageJson, architecture, keyTech, generatedDate),
    techStack: prepareTechStackData(packageJson, techStack, dependencies, generatedDate),
    dependencies: prepareDependenciesData(packageJson, dependencies, generatedDate)
  };
}

/**
 * Prepare architecture report data
 */
function prepareArchitectureData(packageJson, architecture, keyTech, generatedDate) {
  const violations = architecture.violations || [];
  const recommendations = architecture.recommendations || [];

  return {
    projectName: packageJson.name || 'Vite React dApp Template',
    version: packageJson.version || '0.0.0',
    generatedDate,
    walletSupport: 'MetaMask, Core, Coinbase, Rabby',
    chainSupport: 'Ethereum, Polygon, Avalanche, BSC (+ testnets)',
    buildTool: keyTech.buildTool?.name || 'vite',
    buildVersion: keyTech.buildTool?.version || 'N/A',
    uiFramework: keyTech.uiFramework?.name || 'react',
    uiVersion: keyTech.uiFramework?.version || 'N/A',
    uiLibrary: keyTech.uiLibrary?.name || '@mantine/core',
    uiLibVersion: keyTech.uiLibrary?.version || 'N/A',
    stateManagement: 'Redux Toolkit + Redux Saga',
    stateVersion: keyTech.stateManagement?.version || 'N/A',
    router: keyTech.router?.name || 'react-router-dom',
    routerVersion: keyTech.router?.version || 'N/A',
    web3Library: keyTech.web3?.name || 'ethers',
    web3Version: keyTech.web3?.version || 'N/A',
    testFramework: keyTech.testing?.name || 'vitest',
    testVersion: keyTech.testing?.version || 'N/A',
    i18n: keyTech.i18n?.name || 'i18next',
    i18nVersion: keyTech.i18n?.version || 'N/A',
    typescript: keyTech.typescript?.name || 'typescript',
    tsVersion: keyTech.typescript?.version || 'N/A',
    totalFeatures: architecture.features.core.length + architecture.features.domain.length,
    coreCount: architecture.features.core.length,
    domainCount: architecture.features.domain.length,
    coreFeatures: architecture.features.core.map((name, idx) => ({
      index: idx + 1,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      slug: name,
      purpose: getFeaturePurpose(name, 'core'),
      components: 'N/A',
      responsibilities: getFeatureResponsibilities(name, 'core')
    })),
    domainFeatures: architecture.features.domain.map((name, idx) => ({
      index: idx + 1,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      slug: name,
      purpose: getFeaturePurpose(name, 'domain'),
      models: getFeatureModels(name, architecture),
      architecture: 'Model-based architecture',
      components: 'N/A'
    })),
    patternAdoption: {
      featureModel: `${architecture.patterns.featureModel || 0}/${architecture.features.domain.length}`,
      dependencyInjection: `${architecture.patterns.dependencyInjection || 0}/${architecture.features.domain.length}`,
      hookAbstraction: `${architecture.patterns.hookAbstraction || 0}/${architecture.features.domain.length}`
    },
    violationCount: violations.length,
    overallAdoption: calculateOverallAdoption(architecture),
    violations: violations.map(v => ({
      type: v.type,
      severity: v.severity,
      message: v.message,
      count: v.count || 1
    })),
    recommendations: recommendations.map((r, idx) => ({
      index: idx + 1,
      priority: r.priority || 'MEDIUM',
      message: r.message || r
    }))
  };
}

/**
 * Prepare tech stack data
 */
function prepareTechStackData(packageJson, techStack, dependencies, generatedDate) {
  const keyTech = getKeyTechnologies(techStack);

  return {
    version: packageJson.version || '0.0.0',
    generatedDate,
    viteVersion: keyTech.buildTool?.version || 'N/A',
    tsVersion: keyTech.typescript?.version || 'N/A',
    nodeVersion: techStack.meta.nodeVersion,
    npmVersion: techStack.meta.npmVersion,
    reactVersion: keyTech.uiFramework?.version || 'N/A',
    reactDomVersion: keyTech.uiFramework?.version || 'N/A',
    routerVersion: keyTech.router?.version || 'N/A',
    reduxVersion: keyTech.stateManagement?.version || 'N/A',
    reactReduxVersion: 'N/A', // Could extract from dependencies
    sagaVersion: 'N/A',
    mantineVersion: keyTech.uiLibrary?.version || 'N/A',
    iconsVersion: 'N/A',
    ethersVersion: keyTech.web3?.version || 'N/A',
    jazziconVersion: 'N/A',
    i18nVersion: keyTech.i18n?.version || 'N/A',
    reactI18nVersion: 'N/A',
    detectorVersion: 'N/A',
    parserVersion: 'N/A',
    vitestVersion: keyTech.testing?.version || 'N/A',
    rtlVersion: 'N/A',
    jestDomVersion: 'N/A',
    userEventVersion: 'N/A',
    jsdomVersion: 'N/A',
    coverageVersion: 'N/A',
    eslintVersion: 'N/A',
    prettierVersion: 'N/A',
    huskyVersion: 'N/A',
    tsEslintVersion: 'N/A',
    storybookVersion: 'N/A',
    categories: Object.entries(techStack.categories).map(([name, packages]) => ({
      categoryName: name,
      packages: packages.map(p => ({
        name: p.name,
        version: p.version,
        purpose: '' // Could add descriptions
      }))
    })),
    prodTotal: dependencies.summary.totalProduction,
    devTotal: dependencies.summary.totalDevelopment,
    prodUpToDate: countByStatus(dependencies.production, 'up-to-date'),
    prodOutdated: countByStatus(dependencies.production, 'outdated'),
    devUpToDate: countByStatus(dependencies.development, 'up-to-date'),
    devOutdated: countByStatus(dependencies.development, 'outdated'),
    hasOutdated: countByStatus(dependencies.production, 'outdated') + countByStatus(dependencies.development, 'outdated') > 0,
    outdatedProd: getOutdatedPackages(dependencies.production),
    outdatedDev: getOutdatedPackages(dependencies.development)
  };
}

/**
 * Prepare dependencies data
 */
function prepareDependenciesData(packageJson, dependencies, generatedDate) {
  const prodCount = dependencies.summary.totalProduction;
  const devCount = dependencies.summary.totalDevelopment;
  const totalDeps = prodCount + devCount;

  const upToDateProd = countByStatus(dependencies.production, 'up-to-date');
  const upToDateDev = countByStatus(dependencies.development, 'up-to-date');
  const upToDateCount = upToDateProd + upToDateDev;

  const outdatedProd = countByStatus(dependencies.production, 'outdated');
  const outdatedDev = countByStatus(dependencies.development, 'outdated');
  const outdatedCount = outdatedProd + outdatedDev;

  const unknownProd = countByStatus(dependencies.production, 'unknown');
  const unknownDev = countByStatus(dependencies.development, 'unknown');
  const unknownCount = unknownProd + unknownDev;

  return {
    version: packageJson.version || '0.0.0',
    generatedDate,
    totalDeps,
    prodCount,
    devCount,
    upToDateCount,
    outdatedCount,
    unknownCount,
    reactEcosystem: getDependenciesByCategory(dependencies, 'react-ecosystem'),
    stateManagement: getDependenciesByCategory(dependencies, 'react-ecosystem', ['redux']),
    uiFramework: getDependenciesByCategory(dependencies, 'ui-framework'),
    web3: getDependenciesByCategory(dependencies, 'web3'),
    i18n: getDependenciesByCategory(dependencies, 'i18n'),
    utilities: getDependenciesByCategory(dependencies, 'utilities'),
    buildTools: getDependenciesByCategory(dependencies, 'build-tools'),
    typescript: getDependenciesByCategory(dependencies, 'typescript'),
    testing: getDependenciesByCategory(dependencies, 'testing'),
    codeQuality: getDependenciesByCategory(dependencies, 'code-quality'),
    documentation: getDependenciesByCategory(dependencies, 'testing', ['storybook']),
    reactStatus: getStatusEmoji(upToDateProd, outdatedProd),
    stateStatus: getStatusEmoji(upToDateProd, outdatedProd),
    uiStatus: getStatusEmoji(upToDateProd, outdatedProd),
    web3Status: getStatusEmoji(upToDateProd, outdatedProd),
    i18nStatus: getStatusEmoji(upToDateProd, outdatedProd),
    utilitiesStatus: getStatusEmoji(upToDateProd, outdatedProd),
    buildToolsStatus: getStatusEmoji(upToDateDev, outdatedDev),
    typescriptStatus: getStatusEmoji(upToDateDev, outdatedDev),
    testingStatus: getStatusEmoji(upToDateDev, outdatedDev),
    codeQualityStatus: getStatusEmoji(upToDateDev, outdatedDev),
    documentationStatus: getStatusEmoji(upToDateDev, outdatedDev),
    categories: Object.entries(dependencies.summary.categories).map(([name, packages]) => ({
      categoryName: name,
      count: packages.length,
      packages: packages.map(p => ({
        name: p.name,
        current: p.version,
        latest: 'N/A', // Would need to look up
        status: 'unknown',
        statusIcon: '❓'
      }))
    })),
    hasOutdated: outdatedCount > 0,
    outdatedProd: getOutdatedPackages(dependencies.production),
    outdatedDev: getOutdatedPackages(dependencies.development),
    highPriorityUpdates: [],
    mediumPriorityUpdates: [],
    lowPriorityUpdates: [],
    vulnerabilities: []
  };
}

// Helper functions

function getFeaturePurpose(name, type) {
  const purposes = {
    app: 'Application bootstrap and provider composition',
    auth: 'Authentication infrastructure and utilities',
    wallet: 'Web3 wallet integration',
    oauth: 'OAuth authentication provider',
    'blog-demo': 'Blog demonstration feature',
    chat: 'Chat functionality',
    i18n: 'Internationalization infrastructure',
    router: 'Routing infrastructure and utilities',
    'slice-manager': 'Redux slice lifecycle management',
    ui: 'Mantine theme and design system'
  };
  return purposes[name] || 'Feature implementation';
}

function getFeatureResponsibilities(name, type) {
  const responsibilities = {
    app: 'Provider orchestration, global configuration',
    auth: 'Authentication state and utilities',
    i18n: 'Multi-language support, translation management',
    router: 'Route configuration, lazy loading',
    'slice-manager': 'Dynamic slice registration and cleanup',
    ui: 'Theme configuration, reusable components'
  };
  return responsibilities[name] || 'Feature-specific logic';
}

function getFeatureModels(name, architecture) {
  // Would need to extract from actual analysis
  const models = {
    wallet: 'Provider, Network, Account',
    oauth: 'Session',
    'blog-demo': 'Post, Author'
  };
  return models[name] || 'N/A';
}

function calculateOverallAdoption(architecture) {
  const total = architecture.features.domain.length * 3; // 3 patterns
  const adopted = (architecture.patterns.featureModel || 0) +
                  (architecture.patterns.dependencyInjection || 0) +
                  (architecture.patterns.hookAbstraction || 0);
  return total > 0 ? Math.round((adopted / total) * 100) : 0;
}

function countByStatus(deps, status) {
  return Object.values(deps).filter(d => d.status === status).length;
}

function getOutdatedPackages(deps) {
  return Object.entries(deps)
    .filter(([_, d]) => d.status === 'outdated')
    .map(([name, d]) => ({
      name,
      current: d.current,
      latest: d.latest,
      category: d.category
    }));
}

function getDependenciesByCategory(dependencies, category, filter = null) {
  const allDeps = { ...dependencies.production, ...dependencies.development };
  return Object.entries(allDeps)
    .filter(([name, d]) => {
      if (filter) {
        return filter.some(f => name.includes(f));
      }
      return d.category === category;
    })
    .map(([name, d]) => ({
      name,
      current: d.current,
      latest: d.latest,
      latestVersion: d.latest !== 'N/A' ? d.latest : null,
      status: d.status
    }));
}

function getStatusEmoji(upToDate, outdated) {
  if (outdated === 0) return '✅ Excellent';
  if (outdated <= 2) return '✅ Good';
  if (outdated <= 5) return '⚠️ Needs attention';
  return '❌ Outdated';
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateExecutiveDocs();
}
