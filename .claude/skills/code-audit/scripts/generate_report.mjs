#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CWD = process.cwd();

// Get date-only timestamp for report (YYYY-MM-DD)
// Reports on the same day will overwrite (useful for iterative fix workflow)
const date = new Date();
const timestamp = date.toISOString().slice(0, 10);
const REPORT_DIR = process.env.REPORT_DIR || path.join(CWD, 'reports', timestamp);
const REPORT_FILE = path.join(REPORT_DIR, 'code-audit-report.md');

// Ensure report directory exists
fs.mkdirSync(REPORT_DIR, { recursive: true });

/**
 * Run a check script and capture full output
 */
function runCheck(scriptPath) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';

    const process = spawn('node', [scriptPath], {
      stdio: 'pipe',
      shell: true,
    });

    process.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      // Also write to console in real-time
      process.stdout.write(text);
    });

    process.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    process.on('close', (code) => {
      resolve({
        code,
        output: stdout + stderr,
        stdout,
        stderr
      });
    });

    process.on('error', (error) => {
      resolve({
        code: 1,
        output: error.message,
        error: error.message
      });
    });
  });
}

/**
 * Extract key information from check output
 */
function parseCheckResult(output, checkName) {
  const result = {
    name: checkName,
    passed: false,
    summary: '',
    details: output
  };

  // Check if passed
  if (output.includes('✅ No') || output.includes('✅ All') || output.includes('Great!')) {
    result.passed = true;
  }

  // Extract violation counts
  if (checkName.includes('Import')) {
    const match = output.match(/Summary: (\d+) violation\(s\) found/);
    result.summary = match ? `${match[1]} violation(s)` : 'Check output';
  } else if (checkName.includes('Export')) {
    const indexMatch = output.match(/Index files: (\d+) violation\(s\)/);
    const defaultMatch = output.match(/Default exports: (\d+) violation\(s\)/);
    if (indexMatch || defaultMatch) {
      result.summary = `Index files: ${indexMatch?.[1] || 0}, Default exports: ${defaultMatch?.[1] || 0}`;
    }
  } else if (checkName.includes('Redux')) {
    const dispatchMatch = output.match(/Direct useDispatch: (\d+) violation\(s\)/);
    const stateMatch = output.match(/Direct RootState: (\d+) violation\(s\)/);
    const selectorMatch = output.match(/Direct useSelector: (\d+) violation\(s\)/);
    if (dispatchMatch || stateMatch || selectorMatch) {
      result.summary = `useDispatch: ${dispatchMatch?.[1] || 0}, RootState: ${stateMatch?.[1] || 0}, useSelector: ${selectorMatch?.[1] || 0}`;
    }
  } else if (checkName.includes('Service Import')) {
    const match = output.match(/Found (\d+) service import violation/i);
    result.summary = match ? `${match[1]} violation(s)` : 'Check output';
  } else if (checkName.includes('i18n')) {
    const match = output.match(/Summary: (\d+) raw text occurrence\(s\) found/);
    result.summary = match ? `${match[1]} violation(s)` : 'Check output';
  } else if (checkName.includes('any')) {
    const match = output.match(/"any" type usages: (\d+) violation\(s\)/);
    result.summary = match ? `${match[1]} violation(s)` : 'Check output';
  } else if (checkName.includes('Suppression')) {
    const totalMatch = output.match(/Total suppressions: (\d+)/);
    const criticalMatch = output.match(/Critical: (\d+)/);
    const highMatch = output.match(/High: (\d+)/);
    if (totalMatch) {
      result.summary = `${totalMatch[1]} total (Critical: ${criticalMatch?.[1] || 0}, High: ${highMatch?.[1] || 0})`;
    }
  } else if (checkName.includes('God File')) {
    const filesMatch = output.match(/Files with multiple entities: (\d+)/);
    const entitiesMatch = output.match(/Total entities that should be in separate files: (\d+)/);
    if (filesMatch) {
      result.summary = `${filesMatch[1]} file(s), ${entitiesMatch?.[1] || '?'} entities to split`;
    }
  } else if (checkName.includes('TODO')) {
    const match = output.match(/Found (\d+) technical debt marker/);
    result.summary = match ? `${match[1]} marker(s)` : 'No markers';
  } else if (checkName.includes('Console')) {
    const match = output.match(/Found (\d+) console\.\* statement/);
    result.summary = match ? `${match[1]} statement(s)` : 'No console usage';
  } else if (checkName.includes('Saga')) {
    const match = output.match(/Found (\d+) file.*inefficient/);
    result.summary = match ? `${match[1]} file(s) with patterns` : 'No pattern issues';
  }

  return result;
}

/**
 * Main report generator
 */
async function generateReport() {
  console.log('='.repeat(80));
  console.log('Code Audit - Generating Report');
  console.log('='.repeat(80));
  console.log('');

  const checks = [
    { name: 'Import Quality', script: path.join(__dirname, 'check_imports.mjs') },
    { name: 'Export Quality', script: path.join(__dirname, 'check_exports.mjs') },
    { name: 'Redux Abstraction', script: path.join(__dirname, 'check_redux_abstraction.mjs') },
    { name: 'Service Import Boundaries', script: path.join(__dirname, 'check_service_imports.mjs') },
    { name: 'i18n Coverage', script: path.join(__dirname, 'check_i18n_coverage.mjs') },
    { name: 'TypeScript "any" Usage', script: path.join(__dirname, 'check_any_usage.mjs') },
    { name: 'Linter/TypeScript Suppressions', script: path.join(__dirname, 'check_suppressions.mjs') },
    { name: 'God Files (1 Entity Per File)', script: path.join(__dirname, 'check_god_files.mjs') },
    { name: 'TODO/FIXME/HACK Comments', script: path.join(__dirname, 'check_todos.mjs') },
    { name: 'Console Usage', script: path.join(__dirname, 'check_logs.mjs') },
    { name: 'Redux Saga Patterns', script: path.join(__dirname, 'check_saga_patterns.mjs') },
  ];

  const results = [];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const check of checks) {
    console.log(`\nRunning: ${check.name}...`);
    console.log('-'.repeat(80));

    const { code, output } = await runCheck(check.script);
    const result = parseCheckResult(output, check.name);
    result.exitCode = code;

    results.push(result);

    if (result.exitCode === 0) {
      totalPassed++;
      console.log(`\n✅ PASSED: ${check.name}`);
    } else {
      totalFailed++;
      console.log(`\n❌ FAILED: ${check.name} - ${result.summary}`);
    }
  }

  // Generate markdown report
  const reportContent = generateMarkdown(results, totalPassed, totalFailed);

  // Write report
  fs.writeFileSync(REPORT_FILE, reportContent);

  console.log('');
  console.log('='.repeat(80));
  console.log('Report Generation Complete');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Report saved to: ${REPORT_FILE}`);
  console.log('');
  console.log(`Summary: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('');

  process.exit(totalFailed > 0 ? 1 : 0);
}

/**
 * Generate markdown report content
 */
function generateMarkdown(results, totalPassed, totalFailed) {
  const timestamp = new Date().toISOString();

  let md = `# Code Audit Report

**Generated:** ${timestamp}
**Project:** ${path.basename(CWD)}

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Checks** | ${results.length} |
| **Passed** | ✅ ${totalPassed} |
| **Failed** | ❌ ${totalFailed} |
| **Success Rate** | ${Math.round((totalPassed / results.length) * 100)}% |

`;

  // Add status by category
  md += `## Results by Check

| Check | Status | Summary |
|-------|--------|---------|
`;

  for (const result of results) {
    const status = result.exitCode === 0 ? '✅ PASSED' : '❌ FAILED';
    const summary = result.summary || 'See details';
    md += `| ${result.name} | ${status} | ${summary} |\n`;
  }

  md += `\n`;

  // Add detailed results for failed checks
  const failedChecks = results.filter(r => r.exitCode !== 0);

  if (failedChecks.length > 0) {
    md += `## Failed Checks (Detailed)\n\n`;

    for (const result of failedChecks) {
      md += `### ❌ ${result.name}\n\n`;
      md += `**Summary:** ${result.summary}\n\n`;

      // Clean up the output for markdown
      const cleanOutput = result.details
        .replace(/\x1B\[\d+m/g, '') // Remove color codes
        .trim();

      md += `<details>\n<summary>View Details</summary>\n\n\`\`\`\n${cleanOutput}\n\`\`\`\n\n</details>\n\n`;
      md += `---\n\n`;
    }
  }

  // Add passed checks summary
  const passedChecks = results.filter(r => r.exitCode === 0);

  if (passedChecks.length > 0) {
    md += `## Passed Checks\n\n`;

    for (const result of passedChecks) {
      md += `- ✅ **${result.name}** - ${result.summary || 'No violations found'}\n`;
    }

    md += `\n`;
  }

  // Add recommendations
  md += `## Recommendations

`;

  if (failedChecks.length > 0) {
    md += `### Priority Actions

`;
    failedChecks.forEach((result, idx) => {
      md += `${idx + 1}. **${result.name}**: ${result.summary}
   - Run: \`node ./.claude/skills/code-audit/scripts/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mjs\`
   - See detailed output above for specific violations

`;
    });
  } else {
    md += `🎉 **All checks passed!** Your code quality is excellent.\n\n`;
  }

  md += `## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run \`code-audit\` after fixes to verify improvements
4. Consider running \`arch-audit\` for architecture-level checks

---

*Generated by code-audit skill*
`;

  return md;
}

// Run report generation
generateReport().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
