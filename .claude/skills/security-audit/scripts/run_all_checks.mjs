#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = [
  {
    name: 'Hardcoded Secrets Check',
    script: path.join(__dirname, 'check_hardcoded_secrets.mjs'),
  },
  {
    name: 'eval() Usage Check',
    script: path.join(__dirname, 'check_eval_usage.mjs'),
  },
  {
    name: 'Dangerous HTML Patterns Check',
    script: path.join(__dirname, 'check_dangerous_html.mjs'),
  },
  {
    name: 'Environment Variable Exposure Check',
    script: path.join(__dirname, 'check_env_exposure.mjs'),
  },
];

/**
 * Run a single check script
 */
function runCheck(scriptPath) {
  return new Promise((resolve) => {
    const process = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      resolve(code);
    });

    process.on('error', (error) => {
      console.error(`Error running ${scriptPath}:`, error);
      resolve(1);
    });
  });
}

/**
 * Main runner
 */
async function runAllChecks() {
  console.log('='.repeat(80));
  console.log('Security Audit - Running All Checks');
  console.log('='.repeat(80));
  console.log('');

  let totalPassed = 0;
  let totalFailed = 0;

  for (const check of checks) {
    console.log(`\nRunning: ${check.name}...`);
    console.log('-'.repeat(80));

    const exitCode = await runCheck(check.script);

    if (exitCode === 0) {
      totalPassed++;
      console.log(`\n✅ PASSED: ${check.name}`);
    } else {
      totalFailed++;
      console.log(`\n❌ FAILED: ${check.name}`);
    }
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('Security Audit Complete');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Summary: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('');

  if (totalFailed > 0) {
    console.log('⚠️  Security issues detected. Review the output above for details.');
    console.log('');
    console.log('To save a report:');
    console.log('  node ./.claude/skills/security-audit/scripts/generate_report.mjs');
    console.log('');
  }

  process.exit(totalFailed > 0 ? 1 : 0);
}

runAllChecks().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
