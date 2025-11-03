#!/usr/bin/env node

import path from 'path';
import { analyzeFeature } from './analyze_feature.mjs';
import {
  getDocsOutputDir,
  ensureDocsOutputDir,
  writeFile,
  readFile,
  generateDirectoryTree,
  getFeaturePath
} from './utils/fileUtils.mjs';
import {
  heading,
  list,
  codeBlock,
  table,
  code,
  bold,
  cleanMarkdown,
  frontmatter
} from './utils/templateUtils.mjs';

/**
 * Generate documentation for a feature
 */
export function generateFeatureDocs(featureName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Generating Documentation: ${featureName}`);
  console.log('='.repeat(80));

  // Analyze the feature
  const analysis = analyzeFeature(featureName);

  // Generate documentation sections
  const docs = [];

  // Frontmatter
  docs.push(frontmatter({
    title: `${capitalize(featureName)} Feature`,
    category: analysis.category,
    models: analysis.statistics.modelsCount,
    generated: new Date().toISOString()
  }));

  // Title and overview
  docs.push(heading(1, `${capitalize(featureName)} Feature`));

  docs.push(table(
    ['Property', 'Value'],
    [
      ['Category', bold(analysis.category.toUpperCase())],
      ['Models', analysis.statistics.modelsCount || 'N/A'],
      ['Lines of Code', analysis.statistics.totalLines],
      ['Status', analysis.exceptions.length === 0 ? '✅ Standard' : '⚠️ Has Exceptions']
    ]
  ));

  // Overview section
  docs.push(heading(2, 'Overview'));

  if (analysis.category === 'core') {
    docs.push(`The ${code(featureName)} feature is a **core infrastructure feature** that provides essential functionality for the application.\n\n`);
    docs.push(`> **Note:** Core features have specialized structures optimized for their specific purposes and do not follow the standard model-based architecture pattern.\n\n`);
  } else {
    docs.push(`The ${code(featureName)} feature is a **domain feature** that implements business logic using the feature-model architecture pattern.\n\n`);
  }

  // Statistics section
  docs.push(heading(2, 'Statistics'));

  docs.push(table(
    ['Metric', 'Value'],
    [
      ['Total Files', analysis.statistics.totalFiles],
      ['Lines of Code', analysis.statistics.totalLines],
      ['Models', analysis.statistics.modelsCount],
      ['Interfaces', analysis.statistics.interfacesCount],
      ['Hooks', analysis.statistics.hooksCount],
      ['Components', analysis.statistics.componentsCount]
    ]
  ));

  // Architecture patterns section
  docs.push(heading(2, 'Architecture Patterns'));

  const patterns = [
    ['Model-Based Architecture', analysis.patterns.hasModels ? '✅' : '❌',
     analysis.patterns.hasModels ? 'Feature organizes code by models' : 'Not applicable (core feature)'],
    ['Hook Abstraction', analysis.patterns.hasHooks ? '✅' : '❌',
     analysis.patterns.hasHooks ? 'Components use feature hooks, not Redux directly' : 'No hooks directory'],
    ['Component Organization', analysis.patterns.hasComponents ? '✅' : '❌',
     analysis.patterns.hasComponents ? 'Feature provides React components' : 'No components directory'],
    ['Redux Slice', analysis.patterns.hasSlice ? '✅' : '❌',
     analysis.patterns.hasSlice ? 'Feature has Redux state management' : 'No slice.ts file'],
    ['Redux Saga', analysis.patterns.hasSagas ? '✅' : '❌',
     analysis.patterns.hasSagas ? 'Feature has async business logic' : 'No sagas.ts file'],
    ['Interface Architecture', analysis.patterns.hasInterfaces ? '✅' : '❌',
     analysis.patterns.hasInterfaces ? 'Feature defines interfaces for DI' : `No I${capitalize(featureName)}Api.ts`],
    ['Reducer Composition', analysis.patterns.usesComposition ? '✅' : '❌',
     analysis.patterns.usesComposition ? 'Uses combineReducers for models' : 'Single reducer or no composition']
  ];

  docs.push(table(['Pattern', 'Status', 'Description'], patterns));

  // Structure section
  docs.push(heading(2, 'Directory Structure'));

  const featurePath = getFeaturePath(featureName);
  const tree = generateDirectoryTree(featurePath, '', 3);
  docs.push(codeBlock(tree, ''));

  // Models section (for domain features)
  if (analysis.models.length > 0) {
    docs.push(heading(2, 'Models'));

    docs.push(`This feature contains ${analysis.models.length} ${analysis.models.length === 1 ? 'model' : 'models'}:\n\n`);

    for (const model of analysis.models) {
      docs.push(heading(3, capitalize(model.name)));

      const modelStatus = [
        ['Component', 'Status'],
        ['Interface', model.hasInterface ? '✅ Yes' : '❌ No'],
        ['Actions', model.hasActions ? `✅ ${model.actions.length}` : '❌ No'],
        ['Slice', model.hasSlice ? '✅ Yes' : '❌ No'],
        ['ActionEffects', model.hasActionEffects ? `✅ ${model.actionEffects.length}` : '❌ No'],
        ['Types', model.hasTypes ? `✅ ${model.types.length}` : '❌ No']
      ];

      docs.push(table(modelStatus[0], modelStatus.slice(1)));

      if (model.interface) {
        docs.push(`**Interface:** ${code(`I${capitalize(model.name)}Api`)}\n\n`);

        if (model.interface.methods && model.interface.methods.length > 0) {
          docs.push('**Methods:**\n\n');
          const methods = model.interface.methods.map(m =>
            `- ${code(m.name)}(${m.params}): ${m.returnType}`
          );
          docs.push(methods.join('\n') + '\n\n');
        }
      }

      if (model.actions && model.actions.length > 0) {
        docs.push(`**Actions:** ${model.actions.map(a => code(a.name)).join(', ')}\n\n`);
      }

      if (model.actionEffects && model.actionEffects.length > 0) {
        docs.push(`**Business Logic:** ${model.actionEffects.map(f => code(f)).join(', ')}\n\n`);
      }
    }
  }

  // Hooks section
  if (analysis.hooks.length > 0) {
    docs.push(heading(2, 'Hooks'));

    docs.push(`This feature provides ${analysis.hooks.length} custom ${analysis.hooks.length === 1 ? 'hook' : 'hooks'}:\n\n`);

    for (const hook of analysis.hooks) {
      docs.push(`- ${code(hook.name)} - ${hook.file}\n`);
    }

    docs.push('\n');
  }

  // Components section
  if (analysis.components.length > 0 && analysis.components.length <= 20) {
    // Only list components if there aren't too many
    docs.push(heading(2, 'Components'));

    docs.push(`This feature provides ${analysis.components.length} ${analysis.components.length === 1 ? 'component' : 'components'}:\n\n`);

    for (const component of analysis.components) {
      docs.push(`- ${code(component.name)}\n`);
    }

    docs.push('\n');
  } else if (analysis.components.length > 20) {
    docs.push(heading(2, 'Components'));
    docs.push(`This feature provides ${analysis.components.length} components. See the ${code('components/')} directory for details.\n\n`);
  }

  // Exceptions section
  if (analysis.exceptions.length > 0) {
    docs.push(heading(2, 'Exceptions & Outliers'));

    docs.push(`This feature has ${analysis.exceptions.length} architectural ${analysis.exceptions.length === 1 ? 'exception' : 'exceptions'}:\n\n`);

    for (const exception of analysis.exceptions) {
      const severity = exception.severity || 'info';
      const icon = severity === 'error' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️';
      docs.push(`${icon} **${exception.type}**: ${exception.message}\n\n`);
    }
  }

  // Usage example section
  if (analysis.hooks.length > 0) {
    docs.push(heading(2, 'Usage Example'));

    const hookName = analysis.hooks[0].name;
    const actionsHook = analysis.hooks.find(h => h.name.includes('Actions'));

    docs.push(codeBlock(`import { ${hookName} } from '@/features/${featureName}/hooks/${hookName}';
${actionsHook ? `import { ${actionsHook.name} } from '@/features/${featureName}/hooks/${actionsHook.name}';\n` : ''}
function MyComponent() {
  const ${featureName}State = ${hookName}();
  ${actionsHook ? `const ${featureName}Actions = ${actionsHook.name}();` : ''}

  // Use the feature state and actions
  return (
    <div>
      {/* Your component code */}
    </div>
  );
}`, 'typescript'));
  }

  // Key files section
  docs.push(heading(2, 'Key Files'));

  const keyFiles = [];

  if (analysis.patterns.hasSlice) {
    keyFiles.push(`- ${code('slice.ts')} - Redux reducer${analysis.patterns.usesComposition ? ' (combineReducers)' : ''}`);
  }

  if (analysis.patterns.hasSagas) {
    keyFiles.push(`- ${code('sagas.ts')} - Redux saga watchers`);
  }

  if (analysis.patterns.hasInterfaces) {
    keyFiles.push(`- ${code(`I${capitalize(featureName)}Api.ts`)} - Feature interface for DI`);
  }

  if (analysis.hooks.length > 0) {
    keyFiles.push(`- ${code('hooks/')} - Custom hooks for component abstraction`);
  }

  if (analysis.components.length > 0) {
    keyFiles.push(`- ${code('components/')} - React components`);
  }

  if (analysis.models.length > 0) {
    keyFiles.push(`- ${code('models/')} - Model-based code organization`);
  }

  docs.push(keyFiles.join('\n') + '\n\n');

  // Footer
  docs.push('---\n\n');
  docs.push('*Generated by docs-generator skill*\n');

  // Clean and save
  const markdown = cleanMarkdown(docs.join(''));

  // Determine output path
  const outputDir = ensureDocsOutputDir();
  const categoryDir = path.join(outputDir, 'features', analysis.category);
  const outputPath = path.join(categoryDir, `${featureName}.md`);

  writeFile(outputPath, markdown);

  console.log(`\n✅ Documentation generated: ${outputPath}`);
  console.log('='.repeat(80));

  return outputPath;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Run if called directly
const isMainModule = process.argv[1]?.endsWith('generate_feature_docs.mjs');

if (isMainModule) {
  const featureName = process.argv[2];

  if (!featureName) {
    console.error('Usage: node generate_feature_docs.mjs <feature-name>');
    console.error('Example: node generate_feature_docs.mjs wallet');
    process.exit(1);
  }

  try {
    generateFeatureDocs(featureName);
  } catch (error) {
    console.error(`\n❌ Error generating documentation: ${error.message}`);
    process.exit(1);
  }
}
