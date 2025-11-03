#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function extractSummary(output, checkName) {
  const summaryMatch = output.match(/Summary: (\d+) violation\(s\)/);
  if (summaryMatch) {
    return `${summaryMatch[1]} violation(s)`;
  }

  // Check for circular dependencies
  if (checkName.includes('Circular')) {
    const circularMatch = output.match(/Found (\d+) potential circular/);
    if (circularMatch) {
      return `${circularMatch[1]} circular dependenc${circularMatch[1] === '1' ? 'y' : 'ies'}`;
    }
    return 'No circular dependencies';
  }

  return 'Unknown';
}

async function runAllChecks() {
  console.log('='.repeat(80));
  console.log('Architecture Audit - Running All Checks');
  console.log('='.repeat(80));
  console.log('');

  const checks = [
    {
      name: 'Core → Domain Dependency Check',
      script: path.join(__dirname, 'check_core_to_domain.mjs'),
    },
    {
      name: 'Service Import Check',
      script: path.join(__dirname, 'check_service_imports.mjs'),
    },
    {
      name: 'Service Boundaries Check',
      script: path.join(__dirname, 'check_service_boundaries.mjs'),
    },
    {
      name: 'Pages Boundaries Check',
      script: path.join(__dirname, 'check_pages_boundaries.mjs'),
    },
    {
      name: 'Model Internals Encapsulation Check',
      script: path.join(__dirname, 'check_model_internals.mjs'),
    },
    {
      name: 'Slice Import Check',
      script: path.join(__dirname, 'check_slice_imports.mjs'),
    },
    {
      name: 'Sagas Import Check',
      script: path.join(__dirname, 'check_sagas_imports.mjs'),
    },
    {
      name: 'Circular Dependency Check',
      script: path.join(__dirname, 'check_circular_deps.mjs'),
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
    console.log('🎉 All architecture checks passed!');
    console.log('');
    process.exit(0);
  } else {
    console.log('❌ Some architecture checks failed.');
    console.log('');
    console.log('💡 Tip: Run individual check scripts for detailed violation reports:');
    console.log('   node ./.claude/skills/arch-audit/scripts/check_core_to_domain.mjs');
    console.log('   node ./.claude/skills/arch-audit/scripts/check_service_imports.mjs');
    console.log('   node ./.claude/skills/arch-audit/scripts/check_service_boundaries.mjs');
    console.log('   node ./.claude/skills/arch-audit/scripts/check_pages_boundaries.mjs');
    console.log('   node ./.claude/skills/arch-audit/scripts/check_model_internals.mjs');
    console.log('   node ./.claude/skills/arch-audit/scripts/check_slice_imports.mjs');
    console.log('   node ./.claude/skills/arch-audit/scripts/check_sagas_imports.mjs');
    console.log('');
    process.exit(1);
  }
}

runAllChecks().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
