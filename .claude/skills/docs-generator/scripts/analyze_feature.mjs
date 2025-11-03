#!/usr/bin/env node

import path from 'path';
import {
  featureExists,
  getFeaturePath,
  isCoreFeature,
  isDomainFeature,
  getFeatureModels,
  getFeatureStructure,
  getTypeScriptFiles,
  readFile,
  generateDirectoryTree
} from './utils/fileUtils.mjs';
import {
  parseImports,
  parseExports,
  parseInterfaces,
  parseTypeAliases,
  parseActions,
  parseSlice,
  parseHooks,
  parseComponents,
  parseSagaPatterns,
  countLinesOfCode
} from './utils/astUtils.mjs';

/**
 * Analyze a single feature
 */
export function analyzeFeature(featureName) {
  if (!featureExists(featureName)) {
    console.error(`❌ Feature "${featureName}" not found`);
    process.exit(1);
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`Analyzing Feature: ${featureName}`);
  console.log('='.repeat(80));

  const featurePath = getFeaturePath(featureName);
  const isCore = isCoreFeature(featureName);
  const isDomain = isDomainFeature(featureName);

  const analysis = {
    name: featureName,
    path: featurePath,
    category: isCore ? 'core' : 'domain',
    models: [],
    structure: {},
    interfaces: [],
    types: [],
    hooks: [],
    components: [],
    slices: [],
    sagas: null,
    actions: [],
    statistics: {
      totalFiles: 0,
      totalLines: 0,
      modelsCount: 0,
      interfacesCount: 0,
      hooksCount: 0,
      componentsCount: 0
    },
    patterns: {
      hasModels: false,
      hasHooks: false,
      hasComponents: false,
      hasSlice: false,
      hasSagas: false,
      hasInterfaces: false,
      usesComposition: false
    },
    exceptions: []
  };

  // Analyze feature structure
  console.log('\n📁 Analyzing structure...');
  analysis.structure = getFeatureStructure(featureName);

  if (analysis.structure) {
    analysis.statistics.totalFiles = analysis.structure.files.length;
  }

  // Analyze models (for domain features)
  if (isDomain) {
    console.log('\n🏗️  Analyzing models...');
    const models = getFeatureModels(featureName);

    if (models.length > 0) {
      analysis.patterns.hasModels = true;
      analysis.statistics.modelsCount = models.length;

      for (const modelName of models) {
        const modelAnalysis = analyzeModel(featureName, modelName);
        analysis.models.push(modelAnalysis);
      }
    } else {
      // Exception: Domain feature without models directory
      analysis.exceptions.push({
        type: 'no-models',
        message: 'Domain feature without models/ directory (architectural violation)'
      });
    }
  } else {
    console.log('\n📦 Core feature (no models expected)');
  }

  // Analyze root interfaces
  console.log('\n🔌 Analyzing interfaces...');
  const rootInterfacePath = path.join(featurePath, `I${capitalize(featureName)}Api.ts`);
  const interfaceExists = readFile(rootInterfacePath);

  if (interfaceExists) {
    analysis.patterns.hasInterfaces = true;
    const interfaces = parseInterfaces(rootInterfacePath);
    analysis.interfaces.push(...interfaces);
    analysis.statistics.interfacesCount = interfaces.length;
  }

  // Analyze root slice
  console.log('\n🔵 Analyzing slice...');
  const slicePath = path.join(featurePath, 'slice.ts');
  const sliceExists = readFile(slicePath);

  if (sliceExists) {
    analysis.patterns.hasSlice = true;
    const slice = parseSlice(slicePath);
    if (slice) {
      analysis.slices.push(slice);
    }
  }

  // Analyze sagas
  console.log('\n⚡ Analyzing sagas...');
  const sagasPath = path.join(featurePath, 'sagas.ts');
  const sagasExists = readFile(sagasPath);

  if (sagasExists) {
    analysis.patterns.hasSagas = true;
    const sagaPatterns = parseSagaPatterns(sagasPath);
    if (sagaPatterns) {
      analysis.sagas = sagaPatterns;
    }
  }

  // Analyze hooks
  console.log('\n🪝 Analyzing hooks...');
  const hooksPath = path.join(featurePath, 'hooks');
  const hooksFiles = getTypeScriptFiles(hooksPath, true);

  if (hooksFiles.length > 0) {
    analysis.patterns.hasHooks = true;

    for (const hookFile of hooksFiles) {
      const hooks = parseHooks(hookFile);
      analysis.hooks.push(...hooks.map(h => ({
        ...h,
        file: path.relative(featurePath, hookFile)
      })));
    }

    analysis.statistics.hooksCount = analysis.hooks.length;
  }

  // Analyze components
  console.log('\n🧩 Analyzing components...');
  const componentsPath = path.join(featurePath, 'components');
  const componentFiles = getTypeScriptFiles(componentsPath, true);

  if (componentFiles.length > 0) {
    analysis.patterns.hasComponents = true;

    for (const componentFile of componentFiles) {
      const components = parseComponents(componentFile);
      analysis.components.push(...components.map(c => ({
        ...c,
        file: path.relative(featurePath, componentFile)
      })));
    }

    analysis.statistics.componentsCount = analysis.components.length;
  }

  // Calculate total lines of code
  console.log('\n📊 Calculating statistics...');
  const allFiles = getTypeScriptFiles(featurePath, true);
  let totalLines = 0;

  for (const file of allFiles) {
    totalLines += countLinesOfCode(file);
  }

  analysis.statistics.totalLines = totalLines;

  // Detect composition patterns
  if (isDomain && analysis.patterns.hasSlice && analysis.patterns.hasModels) {
    const sliceContent = readFile(slicePath);
    if (sliceContent && sliceContent.includes('combineReducers')) {
      analysis.patterns.usesComposition = true;
    }
  }

  // Detect architectural exceptions
  console.log('\n🔍 Detecting exceptions...');
  detectExceptions(analysis);

  // Print summary
  printSummary(analysis);

  return analysis;
}

/**
 * Analyze a single model within a feature
 */
function analyzeModel(featureName, modelName) {
  console.log(`  📂 Analyzing model: ${modelName}`);

  const featurePath = getFeaturePath(featureName);
  const modelPath = path.join(featurePath, 'models', modelName);

  const modelAnalysis = {
    name: modelName,
    path: modelPath,
    interface: null,
    actions: [],
    slice: null,
    actionEffects: [],
    types: [],
    hasInterface: false,
    hasActions: false,
    hasSlice: false,
    hasActionEffects: false,
    hasTypes: false
  };

  // Check for interface
  const interfacePath = path.join(modelPath, `I${capitalize(modelName)}Api.ts`);
  const interfaceExists = readFile(interfacePath);

  if (interfaceExists) {
    modelAnalysis.hasInterface = true;
    const interfaces = parseInterfaces(interfacePath);
    if (interfaces.length > 0) {
      modelAnalysis.interface = interfaces[0];
    }
  }

  // Check for actions
  const actionsPath = path.join(modelPath, 'actions.ts');
  const actionsExist = readFile(actionsPath);

  if (actionsExist) {
    modelAnalysis.hasActions = true;
    modelAnalysis.actions = parseActions(actionsPath);
  }

  // Check for slice
  const slicePath = path.join(modelPath, 'slice.ts');
  const sliceExists = readFile(slicePath);

  if (sliceExists) {
    modelAnalysis.hasSlice = true;
    modelAnalysis.slice = parseSlice(slicePath);
  }

  // Check for actionEffects
  const actionEffectsPath = path.join(modelPath, 'actionEffects');
  const actionEffectsFiles = getTypeScriptFiles(actionEffectsPath, true);

  if (actionEffectsFiles.length > 0) {
    modelAnalysis.hasActionEffects = true;
    modelAnalysis.actionEffects = actionEffectsFiles.map(f => path.basename(f));
  }

  // Check for types
  const typesPath = path.join(modelPath, 'types');
  const typesFiles = getTypeScriptFiles(typesPath, true);

  if (typesFiles.length > 0) {
    modelAnalysis.hasTypes = true;
    modelAnalysis.types = typesFiles.map(f => path.basename(f));
  }

  return modelAnalysis;
}

/**
 * Detect architectural exceptions and outliers
 */
function detectExceptions(analysis) {
  // Core feature expectations
  if (analysis.category === 'core') {
    if (analysis.patterns.hasModels) {
      analysis.exceptions.push({
        type: 'unexpected-models',
        message: 'Core feature has models/ directory (unusual, core features typically have specialized structure)'
      });
    }
  }

  // Domain feature expectations
  if (analysis.category === 'domain') {
    if (!analysis.patterns.hasModels) {
      analysis.exceptions.push({
        type: 'missing-models',
        severity: 'error',
        message: 'Domain feature missing models/ directory (architectural violation)'
      });
    }

    if (!analysis.patterns.hasHooks) {
      analysis.exceptions.push({
        type: 'missing-hooks',
        severity: 'warning',
        message: 'Domain feature missing hooks/ directory (components may be using Redux directly)'
      });
    }

    if (!analysis.patterns.hasSlice) {
      analysis.exceptions.push({
        type: 'missing-slice',
        severity: 'error',
        message: 'Domain feature missing slice.ts (state management incomplete)'
      });
    }

    if (!analysis.patterns.hasSagas) {
      analysis.exceptions.push({
        type: 'missing-sagas',
        severity: 'warning',
        message: 'Domain feature missing sagas.ts (no async business logic)'
      });
    }
  }

  // Check for single-model features
  if (analysis.models.length === 1) {
    analysis.exceptions.push({
        type: 'single-model',
        severity: 'info',
        message: 'Feature has only one model (still follows proper directory structure)'
    });
  }

  // Check for missing interfaces
  if (analysis.category === 'domain' && !analysis.patterns.hasInterfaces) {
    analysis.exceptions.push({
      type: 'missing-interface',
      severity: 'warning',
      message: `Missing I${capitalize(analysis.name)}Api.ts (dependency injection pattern not used)`
    });
  }
}

/**
 * Print analysis summary
 */
function printSummary(analysis) {
  console.log('\n' + '='.repeat(80));
  console.log('Analysis Summary');
  console.log('='.repeat(80));

  console.log(`\nFeature: ${analysis.name}`);
  console.log(`Category: ${analysis.category.toUpperCase()}`);
  console.log(`\nStatistics:`);
  console.log(`  - Total Files: ${analysis.statistics.totalFiles}`);
  console.log(`  - Total Lines: ${analysis.statistics.totalLines}`);
  console.log(`  - Models: ${analysis.statistics.modelsCount}`);
  console.log(`  - Interfaces: ${analysis.statistics.interfacesCount}`);
  console.log(`  - Hooks: ${analysis.statistics.hooksCount}`);
  console.log(`  - Components: ${analysis.statistics.componentsCount}`);

  console.log(`\nPatterns Detected:`);
  console.log(`  - Has Models: ${analysis.patterns.hasModels ? '✅' : '❌'}`);
  console.log(`  - Has Hooks: ${analysis.patterns.hasHooks ? '✅' : '❌'}`);
  console.log(`  - Has Components: ${analysis.patterns.hasComponents ? '✅' : '❌'}`);
  console.log(`  - Has Slice: ${analysis.patterns.hasSlice ? '✅' : '❌'}`);
  console.log(`  - Has Sagas: ${analysis.patterns.hasSagas ? '✅' : '❌'}`);
  console.log(`  - Has Interfaces: ${analysis.patterns.hasInterfaces ? '✅' : '❌'}`);
  console.log(`  - Uses Composition: ${analysis.patterns.usesComposition ? '✅' : '❌'}`);

  if (analysis.exceptions.length > 0) {
    console.log(`\n⚠️  Exceptions/Outliers (${analysis.exceptions.length}):`);
    for (const exception of analysis.exceptions) {
      const severity = exception.severity || 'info';
      const icon = severity === 'error' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`  ${icon} ${exception.type}: ${exception.message}`);
    }
  } else {
    console.log(`\n✅ No exceptions detected - follows standard patterns`);
  }

  console.log('\n' + '='.repeat(80));
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Run if called directly
const isMainModule = process.argv[1]?.endsWith('analyze_feature.mjs');

if (isMainModule) {
  const featureName = process.argv[2];

  if (!featureName) {
    console.error('Usage: node analyze_feature.mjs <feature-name>');
    console.error('Example: node analyze_feature.mjs wallet');
    process.exit(1);
  }

  const analysis = analyzeFeature(featureName);

  // Optionally save to JSON
  if (process.argv.includes('--json')) {
    const outputPath = `analysis-${featureName}.json`;
    import('fs').then(fs => {
      fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
      console.log(`\n📄 Analysis saved to: ${outputPath}`);
    });
  }
}
