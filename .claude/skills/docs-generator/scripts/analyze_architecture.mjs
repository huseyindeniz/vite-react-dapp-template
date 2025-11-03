#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import {
  getAllFeatures,
  getCoreFeatures,
  getDomainFeatures,
  getFeaturePath,
  getTypeScriptFiles,
  getProjectRoot
} from './utils/fileUtils.mjs';
import { parseImports, parseInterfaces } from './utils/astUtils.mjs';

/**
 * Analyze overall architecture patterns
 */
export function analyzeArchitecture() {
  console.log('\n' + '='.repeat(80));
  console.log('ARCHITECTURE ANALYSIS');
  console.log('='.repeat(80));

  const analysis = {
    timestamp: new Date().toISOString(),
    features: {
      total: 0,
      core: [],
      domain: []
    },
    dependencies: {
      coreToDomain: [],
      domainToCore: [],
      domainToDomain: [],
      coreToCore: []
    },
    patterns: {
      featureModelArchitecture: {
        adopted: [],
        notAdopted: []
      },
      dependencyInjection: {
        used: [],
        notUsed: []
      },
      hookAbstraction: {
        used: [],
        notUsed: []
      },
      compositionRoot: {
        files: [],
        imports: []
      }
    },
    statistics: {
      totalFiles: 0,
      totalLines: 0,
      totalModels: 0,
      totalHooks: 0,
      totalComponents: 0,
      totalInterfaces: 0
    },
    violations: [],
    recommendations: []
  };

  // Get all features
  const allFeatures = getAllFeatures();
  const coreFeatures = getCoreFeatures();
  const domainFeatures = getDomainFeatures();

  analysis.features.total = allFeatures.length;
  analysis.features.core = coreFeatures;
  analysis.features.domain = domainFeatures;

  console.log(`\n📊 Features: ${allFeatures.length} total (${coreFeatures.length} core, ${domainFeatures.length} domain)`);

  // Analyze feature dependencies
  console.log('\n🔗 Analyzing feature dependencies...');
  analyzeDependencies(allFeatures, coreFeatures, domainFeatures, analysis);

  // Analyze architectural patterns
  console.log('\n🏗️  Analyzing architectural patterns...');
  analyzePatterns(allFeatures, coreFeatures, domainFeatures, analysis);

  // Analyze composition root
  console.log('\n⚙️  Analyzing composition root...');
  analyzeCompositionRoot(analysis);

  // Detect violations
  console.log('\n🔍 Detecting architectural violations...');
  detectViolations(analysis);

  // Generate recommendations
  console.log('\n💡 Generating recommendations...');
  generateRecommendations(analysis);

  // Print summary
  printArchitectureSummary(analysis);

  return analysis;
}

/**
 * Analyze dependencies between features
 */
function analyzeDependencies(allFeatures, coreFeatures, domainFeatures, analysis) {
  for (const feature of allFeatures) {
    const featurePath = getFeaturePath(feature);
    const tsFiles = getTypeScriptFiles(featurePath, true);

    for (const file of tsFiles) {
      const imports = parseImports(file);

      for (const imp of imports) {
        const importSource = imp.source;

        // Check if it's a feature import
        const featureMatch = importSource.match(/@\/features\/([^\/]+)/);
        if (featureMatch) {
          const targetFeature = featureMatch[1];

          if (targetFeature === feature) continue; // Skip self-imports

          const isCoreSource = coreFeatures.includes(feature);
          const isCoreTarget = coreFeatures.includes(targetFeature);

          const dependency = {
            from: feature,
            to: targetFeature,
            file: path.relative(getProjectRoot(), file),
            import: importSource
          };

          if (isCoreSource && !isCoreTarget) {
            // Core → Domain (VIOLATION)
            analysis.dependencies.coreToDomain.push(dependency);
          } else if (!isCoreSource && isCoreTarget) {
            // Domain → Core (OK)
            analysis.dependencies.domainToCore.push(dependency);
          } else if (!isCoreSource && !isCoreTarget) {
            // Domain → Domain (OK)
            analysis.dependencies.domainToDomain.push(dependency);
          } else {
            // Core → Core (OK)
            analysis.dependencies.coreToCore.push(dependency);
          }
        }
      }
    }
  }

  console.log(`  - Core → Domain: ${analysis.dependencies.coreToDomain.length}`);
  console.log(`  - Domain → Core: ${analysis.dependencies.domainToCore.length}`);
  console.log(`  - Domain → Domain: ${analysis.dependencies.domainToDomain.length}`);
  console.log(`  - Core → Core: ${analysis.dependencies.coreToCore.length}`);
}

/**
 * Analyze architectural patterns
 */
function analyzePatterns(allFeatures, coreFeatures, domainFeatures, analysis) {
  for (const feature of domainFeatures) {
    const featurePath = getFeaturePath(feature);

    // Check for models directory
    const modelsPath = path.join(featurePath, 'models');
    const hasModels = fs.existsSync(modelsPath);

    if (hasModels) {
      analysis.patterns.featureModelArchitecture.adopted.push(feature);
    } else {
      analysis.patterns.featureModelArchitecture.notAdopted.push(feature);
    }

    // Check for interface (DI pattern)
    const interfacePath = path.join(featurePath, `I${capitalize(feature)}Api.ts`);
    const hasInterface = fs.existsSync(interfacePath);

    if (hasInterface) {
      analysis.patterns.dependencyInjection.used.push(feature);
    } else {
      analysis.patterns.dependencyInjection.notUsed.push(feature);
    }

    // Check for hooks directory
    const hooksPath = path.join(featurePath, 'hooks');
    const hasHooks = fs.existsSync(hooksPath);

    if (hasHooks) {
      analysis.patterns.hookAbstraction.used.push(feature);
    } else {
      analysis.patterns.hookAbstraction.notUsed.push(feature);
    }
  }

  console.log(`  - Feature-Model Architecture: ${analysis.patterns.featureModelArchitecture.adopted.length}/${domainFeatures.length} adopted`);
  console.log(`  - Dependency Injection: ${analysis.patterns.dependencyInjection.used.length}/${domainFeatures.length} using`);
  console.log(`  - Hook Abstraction: ${analysis.patterns.hookAbstraction.used.length}/${domainFeatures.length} using`);
}

/**
 * Analyze composition root
 */
function analyzeCompositionRoot(analysis) {
  const compositionRootPath = path.join(getProjectRoot(), 'src', 'features', 'app', 'config');

  if (fs.existsSync(compositionRootPath)) {
    const configFiles = fs.readdirSync(compositionRootPath)
      .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

    analysis.patterns.compositionRoot.files = configFiles;

    // Analyze imports in composition root
    for (const file of configFiles) {
      const filePath = path.join(compositionRootPath, file);
      const imports = parseImports(filePath);

      for (const imp of imports) {
        if (imp.source.startsWith('@/')) {
          analysis.patterns.compositionRoot.imports.push({
            file,
            import: imp.source
          });
        }
      }
    }

    console.log(`  - Composition root files: ${configFiles.length}`);
    console.log(`  - Cross-feature imports: ${analysis.patterns.compositionRoot.imports.length}`);
  }
}

/**
 * Detect architectural violations
 */
function detectViolations(analysis) {
  // Core → Domain violations
  if (analysis.dependencies.coreToDomain.length > 0) {
    analysis.violations.push({
      type: 'core-to-domain',
      severity: 'error',
      count: analysis.dependencies.coreToDomain.length,
      message: 'Core features depend on domain features (architectural violation)',
      details: analysis.dependencies.coreToDomain
    });
  }

  // Missing feature-model architecture
  if (analysis.patterns.featureModelArchitecture.notAdopted.length > 0) {
    analysis.violations.push({
      type: 'missing-models',
      severity: 'error',
      count: analysis.patterns.featureModelArchitecture.notAdopted.length,
      message: 'Domain features missing models/ directory',
      details: analysis.patterns.featureModelArchitecture.notAdopted
    });
  }

  // Missing dependency injection
  if (analysis.patterns.dependencyInjection.notUsed.length > 0) {
    analysis.violations.push({
      type: 'missing-di',
      severity: 'warning',
      count: analysis.patterns.dependencyInjection.notUsed.length,
      message: 'Domain features not using dependency injection pattern',
      details: analysis.patterns.dependencyInjection.notUsed
    });
  }

  // Missing hook abstraction
  if (analysis.patterns.hookAbstraction.notUsed.length > 0) {
    analysis.violations.push({
      type: 'missing-hooks',
      severity: 'warning',
      count: analysis.patterns.hookAbstraction.notUsed.length,
      message: 'Domain features without hook abstraction',
      details: analysis.patterns.hookAbstraction.notUsed
    });
  }

  console.log(`  - Total violations: ${analysis.violations.length}`);
  analysis.violations.forEach(v => {
    const icon = v.severity === 'error' ? '❌' : '⚠️';
    console.log(`    ${icon} ${v.type}: ${v.count} (${v.severity})`);
  });
}

/**
 * Generate recommendations
 */
function generateRecommendations(analysis) {
  // Prioritized recommendations
  if (analysis.violations.length === 0) {
    analysis.recommendations.push({
      priority: 'info',
      message: '✅ Architecture is clean! No violations detected.'
    });
  } else {
    // Sort by severity
    const errors = analysis.violations.filter(v => v.severity === 'error');
    const warnings = analysis.violations.filter(v => v.severity === 'warning');

    if (errors.length > 0) {
      analysis.recommendations.push({
        priority: 'high',
        message: `Fix ${errors.length} critical architectural error${errors.length > 1 ? 's' : ''}`,
        violations: errors
      });
    }

    if (warnings.length > 0) {
      analysis.recommendations.push({
        priority: 'medium',
        message: `Address ${warnings.length} architectural warning${warnings.length > 1 ? 's' : ''}`,
        violations: warnings
      });
    }
  }

  // Pattern adoption recommendations
  const modelAdoptionRate = analysis.patterns.featureModelArchitecture.adopted.length / analysis.features.domain.length;
  if (modelAdoptionRate < 1.0) {
    analysis.recommendations.push({
      priority: 'high',
      message: `Adopt feature-model architecture in remaining ${analysis.patterns.featureModelArchitecture.notAdopted.length} domain features`,
      features: analysis.patterns.featureModelArchitecture.notAdopted
    });
  }

  const diAdoptionRate = analysis.patterns.dependencyInjection.used.length / analysis.features.domain.length;
  if (diAdoptionRate < 0.8) {
    analysis.recommendations.push({
      priority: 'medium',
      message: `Implement dependency injection in ${analysis.patterns.dependencyInjection.notUsed.length} domain features`,
      features: analysis.patterns.dependencyInjection.notUsed
    });
  }

  console.log(`  - Recommendations: ${analysis.recommendations.length}`);
}

/**
 * Print architecture summary
 */
function printArchitectureSummary(analysis) {
  console.log('\n' + '='.repeat(80));
  console.log('ARCHITECTURE SUMMARY');
  console.log('='.repeat(80));

  console.log('\n📊 Features:');
  console.log(`  Total: ${analysis.features.total}`);
  console.log(`  Core: ${analysis.features.core.length}`);
  console.log(`  Domain: ${analysis.features.domain.length}`);

  console.log('\n🔗 Dependencies:');
  console.log(`  Core → Domain: ${analysis.dependencies.coreToDomain.length} ${analysis.dependencies.coreToDomain.length > 0 ? '❌' : '✅'}`);
  console.log(`  Domain → Core: ${analysis.dependencies.domainToCore.length} ✅`);
  console.log(`  Domain → Domain: ${analysis.dependencies.domainToDomain.length} ✅`);
  console.log(`  Core → Core: ${analysis.dependencies.coreToCore.length} ✅`);

  console.log('\n🏗️  Patterns:');
  console.log(`  Feature-Model: ${analysis.patterns.featureModelArchitecture.adopted.length}/${analysis.features.domain.length}`);
  console.log(`  Dependency Injection: ${analysis.patterns.dependencyInjection.used.length}/${analysis.features.domain.length}`);
  console.log(`  Hook Abstraction: ${analysis.patterns.hookAbstraction.used.length}/${analysis.features.domain.length}`);

  if (analysis.violations.length > 0) {
    console.log('\n⚠️  Violations:');
    analysis.violations.forEach(v => {
      const icon = v.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${icon} ${v.message} (${v.count})`);
    });
  } else {
    console.log('\n✅ No architectural violations detected!');
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
const isMainModule = process.argv[1]?.endsWith('analyze_architecture.mjs');

if (isMainModule) {
  const analysis = analyzeArchitecture();

  // Save to JSON if requested
  if (process.argv.includes('--json')) {
    const outputPath = 'architecture-analysis.json';
    import('fs').then(fs => {
      fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
      console.log(`\n📄 Analysis saved to: ${outputPath}`);
    });
  }
}
