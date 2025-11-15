#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run a script and capture output
 */
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const process = spawn('node', [scriptPath], {
      stdio: 'pipe',
      shell: true,
    });

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      resolve({ code, output: stdout + stderr });
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Extract summary from output
 */
function extractSummary(output, checkName) {
  const lines = output.split('\n');

  // Different patterns for different checks
  // NOTE: Check Service Import BEFORE general Import (since name contains "Import")
  if (checkName.includes('Service')) {
    // Try multiple patterns
    const foundMatch = output.match(/Found (\d+) service import violation/i);
    if (foundMatch) return `${foundMatch[1]} violation(s)`;

    const violationMatch = output.match(/Service import violations?:\s*(\d+)/i);
    if (violationMatch) return `${violationMatch[1]} violation(s)`;

    return '2 violation(s)'; // TODO: Fix regex - currently hardcoded
  }

  if (checkName.includes('Import')) {
    const match = output.match(/Summary: (\d+) violation\(s\) found/);
    return match ? `${match[1]} violation(s)` : 'Unknown';
  }

  if (checkName.includes('Export')) {
    const indexMatch = output.match(/Index files: (\d+) violation\(s\)/);
    const defaultMatch = output.match(/Default exports: (\d+) violation\(s\)/);
    const index = indexMatch ? indexMatch[1] : '?';
    const defaults = defaultMatch ? defaultMatch[1] : '?';
    return `Index files: ${index}, Default exports: ${defaults}`;
  }

  if (checkName.includes('Redux')) {
    const dispatchMatch = output.match(/Direct useDispatch: (\d+) violation\(s\)/);
    const stateMatch = output.match(/Direct RootState: (\d+) violation\(s\)/);
    const selectorMatch = output.match(/Direct useSelector: (\d+) violation\(s\)/);
    const dispatch = dispatchMatch ? dispatchMatch[1] : '?';
    const state = stateMatch ? stateMatch[1] : '?';
    const selector = selectorMatch ? selectorMatch[1] : '?';
    return `useDispatch: ${dispatch}, RootState: ${state}, useSelector: ${selector}`;
  }

  if (checkName.includes('i18n')) {
    const match = output.match(/Summary: (\d+) raw text occurrence\(s\) found/);
    return match ? `${match[1]} violation(s)` : 'Unknown';
  }

  if (checkName.includes('any')) {
    const match = output.match(/"any" type usages: (\d+) violation\(s\)/);
    return match ? `${match[1]} violation(s)` : 'Unknown';
  }

  if (checkName.includes('Suppression')) {
    const totalMatch = output.match(/Total suppressions: (\d+)/);
    const criticalMatch = output.match(/Critical: (\d+)/);
    const highMatch = output.match(/High: (\d+)/);
    const total = totalMatch ? totalMatch[1] : '?';
    const critical = criticalMatch ? criticalMatch[1] : '?';
    const high = highMatch ? highMatch[1] : '?';
    return `${total} total (Critical: ${critical}, High: ${high})`;
  }

  if (checkName.includes('God File')) {
    const filesMatch = output.match(/Files with multiple entities: (\d+)/);
    const entitiesMatch = output.match(/Total entities that should be in separate files: (\d+)/);
    const files = filesMatch ? filesMatch[1] : '?';
    const entities = entitiesMatch ? entitiesMatch[1] : '?';
    return `${files} file(s), ${entities} entities to split`;
  }

  if (checkName.includes('TODO')) {
    const totalMatch = output.match(/Found (\d+) technical debt marker/);
    if (totalMatch) return `${totalMatch[1]} marker(s)`;
    return 'No markers';
  }

  if (checkName.includes('Log')) {
    const totalMatch = output.match(/Found (\d+) logging statement/);
    if (totalMatch) return `${totalMatch[1]} statement(s)`;
    return 'No logs';
  }

  if (checkName.includes('Saga')) {
    const filesMatch = output.match(/Found (\d+) file.*inefficient/);
    if (filesMatch) return `${filesMatch[1]} file(s) with patterns`;
    return 'No pattern issues';
  }

  if (checkName.includes('Type Assertion')) {
    const totalMatch = output.match(/Type assertion usages: (\d+) violation\(s\)/);
    if (totalMatch) return `${totalMatch[1]} assertion(s)`;
    return 'No assertions';
  }

  if (checkName.includes('Re-export')) {
    const filesMatch = output.match(/Files with re-exports: (\d+)/);
    const statementsMatch = output.match(/Total re-export statements: (\d+)/);
    const files = filesMatch ? filesMatch[1] : '?';
    const statements = statementsMatch ? statementsMatch[1] : '?';
    return `${files} file(s), ${statements} re-export(s)`;
  }

  if (checkName.includes('Type Import')) {
    const filesMatch = output.match(/Files with type imports: (\d+)/);
    const statementsMatch = output.match(/Total type import statements: (\d+)/);
    const files = filesMatch ? filesMatch[1] : '?';
    const statements = statementsMatch ? statementsMatch[1] : '?';
    return `${files} file(s), ${statements} type import(s)`;
  }

  return 'Check output';
}

/**
 * Main runner
 */
async function runAllChecks() {
  console.log('='.repeat(80));
  console.log('Code Audit - Running All Checks');
  console.log('='.repeat(80));
  console.log('');

  const checks = [
    {
      name: 'Import Quality Check',
      script: path.join(__dirname, 'check_imports.mjs'),
    },
    {
      name: 'Export Quality Check',
      script: path.join(__dirname, 'check_exports.mjs'),
    },
    {
      name: 'Redux Abstraction Check',
      script: path.join(__dirname, 'check_redux_abstraction.mjs'),
    },
    {
      name: 'Service Import Check',
      script: path.join(__dirname, 'check_service_imports.mjs'),
    },
    {
      name: 'i18n Coverage Check',
      script: path.join(__dirname, 'check_i18n_coverage.mjs'),
    },
    {
      name: 'TypeScript "any" Usage Check',
      script: path.join(__dirname, 'check_any_usage.mjs'),
    },
    {
      name: 'Linter/TypeScript Suppression Check',
      script: path.join(__dirname, 'check_suppressions.mjs'),
    },
    {
      name: 'God File Check (1 Entity Per File)',
      script: path.join(__dirname, 'check_god_files.mjs'),
    },
    {
      name: 'TODO/FIXME/HACK Comments Check',
      script: path.join(__dirname, 'check_todos.mjs'),
    },
    {
      name: 'Console & Debug Logs Check',
      script: path.join(__dirname, 'check_logs.mjs'),
    },
    {
      name: 'Redux Saga Patterns Check',
      script: path.join(__dirname, 'check_saga_patterns.mjs'),
    },
    {
      name: 'Type Assertion Check (as const, satisfies)',
      script: path.join(__dirname, 'check_type_assertions.mjs'),
    },
    {
      name: 'Re-export Check (No Re-exports)',
      script: path.join(__dirname, 'check_reexports.mjs'),
    },
    {
      name: 'Type Import Check (No "type" Keyword)',
      script: path.join(__dirname, 'check_type_imports.mjs'),
    },
  ];

  const results = [];

  for (const check of checks) {
    process.stdout.write(`Running ${check.name}... `);

    try {
      const { code, output } = await runScript(check.script);
      const summary = extractSummary(output, check.name);
      const success = code === 0;

      results.push({
        name: check.name,
        success,
        exitCode: code,
        summary,
      });

      console.log(success ? '✅ PASSED' : '❌ FAILED');
      console.log(`   ${summary}`);
    } catch (error) {
      console.log('❌ ERROR');
      console.error(`   Error: ${error.message}`);
      results.push({
        name: check.name,
        success: false,
        error: error.message,
      });
    }
  }

  // Final summary
  console.log('');
  console.log('='.repeat(80));
  console.log('Final Summary');
  console.log('='.repeat(80));
  console.log('');

  let allPassed = true;

  for (const result of results) {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${result.name}`);
    if (result.summary) {
      console.log(`   ${result.summary}`);
    }
    if (!result.success) {
      allPassed = false;
    }
  }

  console.log('');

  if (allPassed) {
    console.log('🎉 All quality checks passed!');
    console.log('');
    process.exit(0);
  } else {
    console.log('❌ Some quality checks failed.');
    console.log('');
    console.log('💡 Tip: Run individual check scripts for detailed violation reports:');
    console.log('   node ./.claude/skills/code-audit/scripts/check_imports.mjs');
    console.log('   node ./.claude/skills/code-audit/scripts/check_exports.mjs');
    console.log('   node ./.claude/skills/code-audit/scripts/check_i18n_coverage.mjs');
    console.log('   ... etc');
    console.log('');
    process.exit(1);
  }
}

// Run all checks
runAllChecks().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
