#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const tsconfigPath = path.join(projectRoot, 'tsconfig.json');

/**
 * Check if TypeScript strict mode is enabled
 */
function checkStrictMode() {
  console.log('TypeScript Strict Mode Check');
  console.log('='.repeat(80));
  console.log('');

  // Check if tsconfig.json exists
  if (!fs.existsSync(tsconfigPath)) {
    console.log('❌ tsconfig.json not found!');
    console.log('');
    console.log('Expected location:', tsconfigPath);
    console.log('');
    console.log('Why this matters:');
    console.log('  - TypeScript configuration file is required');
    console.log('  - Cannot verify strict mode without tsconfig.json');
    console.log('');
    return false;
  }

  console.log(`Reading: ${path.relative(projectRoot, tsconfigPath)}`);
  console.log('');

  let tsconfig;
  try {
    const content = fs.readFileSync(tsconfigPath, 'utf-8');

    // Remove comments from JSON (TypeScript allows comments in tsconfig.json)
    const cleanedContent = content
      .split('\n')
      .map(line => {
        // Remove single-line comments
        const commentIndex = line.indexOf('//');
        if (commentIndex !== -1) {
          return line.substring(0, commentIndex);
        }
        return line;
      })
      .join('\n')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '');

    tsconfig = JSON.parse(cleanedContent);
  } catch (error) {
    console.log('❌ Failed to parse tsconfig.json');
    console.log('');
    console.log('Error:', error.message);
    console.log('');
    return false;
  }

  // Check for compilerOptions
  if (!tsconfig.compilerOptions) {
    console.log('❌ No compilerOptions found in tsconfig.json');
    console.log('');
    console.log('Why this matters:');
    console.log('  - compilerOptions is required for TypeScript configuration');
    console.log('  - Cannot enable strict mode without compilerOptions');
    console.log('');
    return false;
  }

  // Check for strict mode
  const isStrictEnabled = tsconfig.compilerOptions.strict === true;

  if (!isStrictEnabled) {
    console.log('❌ TypeScript strict mode is NOT enabled!');
    console.log('');
    console.log('Current setting:');
    if (tsconfig.compilerOptions.strict === false) {
      console.log('  "strict": false');
    } else if (tsconfig.compilerOptions.strict === undefined) {
      console.log('  "strict" is not defined (defaults to false)');
    } else {
      console.log(`  "strict": ${tsconfig.compilerOptions.strict}`);
    }
    console.log('');
    console.log('='.repeat(80));
    console.log('Why This Matters');
    console.log('='.repeat(80));
    console.log('');
    console.log('TypeScript strict mode enables 8+ critical type safety checks:');
    console.log('  - noImplicitAny: Prevents implicit "any" types');
    console.log('  - noImplicitThis: Requires explicit "this" typing');
    console.log('  - alwaysStrict: ECMAScript strict mode in all files');
    console.log('  - strictBindCallApply: Validates call/bind/apply arguments');
    console.log('  - strictNullChecks: Enforces null/undefined checking');
    console.log('  - strictFunctionTypes: Stricter function type checking');
    console.log('  - strictPropertyInitialization: Ensures class properties are initialized');
    console.log('  - useUnknownInCatchVariables: Catch variables are "unknown" instead of "any"');
    console.log('');
    console.log('Benefits:');
    console.log('  ✅ Catches type errors at compile time instead of runtime');
    console.log('  ✅ Better IDE autocomplete and intellisense');
    console.log('  ✅ Self-documenting code with explicit types');
    console.log('  ✅ Easier refactoring with type safety');
    console.log('  ✅ Industry best practice for professional TypeScript projects');
    console.log('');
    console.log('How to fix:');
    console.log('  1. Open tsconfig.json');
    console.log('  2. In "compilerOptions", add or update:');
    console.log('     "strict": true');
    console.log('  3. Fix any type errors that appear after enabling strict mode');
    console.log('');
    console.log('Example tsconfig.json:');
    console.log('  {');
    console.log('    "compilerOptions": {');
    console.log('      "strict": true,  // ← Enable this');
    console.log('      // ... other options');
    console.log('    }');
    console.log('  }');
    console.log('');
    return false;
  }

  // Success!
  console.log('✅ TypeScript strict mode is enabled!');
  console.log('');
  console.log('Current configuration:');
  console.log('  "strict": true');
  console.log('');
  console.log('Strict mode includes:');
  console.log('  ✅ noImplicitAny');
  console.log('  ✅ noImplicitThis');
  console.log('  ✅ alwaysStrict');
  console.log('  ✅ strictBindCallApply');
  console.log('  ✅ strictNullChecks');
  console.log('  ✅ strictFunctionTypes');
  console.log('  ✅ strictPropertyInitialization');
  console.log('  ✅ useUnknownInCatchVariables');
  console.log('');
  console.log('='.repeat(80));
  console.log('Summary');
  console.log('='.repeat(80));
  console.log('');
  console.log('✅ TypeScript strict mode check passed!');
  console.log('');
  return true;
}

// Run the check
const passed = checkStrictMode();
process.exit(passed ? 0 : 1);
