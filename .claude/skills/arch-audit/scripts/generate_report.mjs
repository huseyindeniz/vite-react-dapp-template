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
const REPORT_FILE = path.join(REPORT_DIR, 'arch-audit-report.md');

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
  const summaryMatch = output.match(/Summary: (\d+) violation\(s\)/);
  if (summaryMatch) {
    result.summary = `${summaryMatch[1]} violation(s)`;
  }

  // Check for circular dependencies
  if (checkName.includes('Circular')) {
    const circularMatch = output.match(/Found (\d+) potential circular/);
    if (circularMatch) {
      result.summary = `${circularMatch[1]} circular dependenc${circularMatch[1] === '1' ? 'y' : 'ies'}`;
    } else if (result.passed) {
      result.summary = 'No circular dependencies';
    }
  }

  if (!result.summary) {
    result.summary = result.passed ? 'No violations' : 'See details';
  }

  return result;
}

/**
 * Main report generator
 */
async function generateReport() {
  console.log('='.repeat(80));
  console.log('Architecture Audit - Generating Report');
  console.log('='.repeat(80));
  console.log('');

  const checks = [
    { name: 'Core → Domain Dependency', script: path.join(__dirname, 'check_core_to_domain.mjs') },
    { name: 'Service Import Boundaries', script: path.join(__dirname, 'check_service_imports.mjs') },
    { name: 'Service Boundaries', script: path.join(__dirname, 'check_service_boundaries.mjs') },
    { name: 'Pages Boundaries', script: path.join(__dirname, 'check_pages_boundaries.mjs') },
    { name: 'Model Internals Encapsulation', script: path.join(__dirname, 'check_model_internals.mjs') },
    { name: 'Slice Import Rules', script: path.join(__dirname, 'check_slice_imports.mjs') },
    { name: 'Sagas Import Rules', script: path.join(__dirname, 'check_sagas_imports.mjs') },
    { name: 'Circular Dependencies', script: path.join(__dirname, 'check_circular_deps.mjs') },
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

  let md = `# Architecture Audit Report

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

  // Add architectural principles summary
  md += `## Architectural Principles Verified

This audit ensures the following architectural patterns:

### ✅ Feature Isolation
- Core features (infrastructure) don't depend on domain features
- Domain features can depend on core features
- Features use proper boundaries and interfaces

### ✅ Dependency Injection
- Services are only imported in composition root (\`src/features/app/config/services.ts\`)
- Features receive services through dependency injection
- No direct service imports scattered throughout the codebase

### ✅ Model-Based Architecture
- Domain features organize code by models
- Each model has its own directory
- Models expose proper interfaces for cross-model communication

### ✅ Encapsulation
- Model internals (actionEffects, types) are not imported externally
- Slice and saga files follow proper import rules
- Pages and services maintain proper boundaries

### ✅ Circular Dependency Prevention
- Module dependencies form a proper DAG (Directed Acyclic Graph)
- No circular imports that cause bundling or runtime issues

`;

  // Add recommendations
  md += `## Recommendations

`;

  if (failedChecks.length > 0) {
    md += `### Priority Actions

`;
    failedChecks.forEach((result, idx) => {
      md += `${idx + 1}. **${result.name}**: ${result.summary}
   - Run: \`node ./.claude/skills/arch-audit/scripts/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mjs\`
   - See detailed output above for specific violations

`;
    });
  } else {
    md += `🎉 **All architecture checks passed!** Your codebase follows excellent architectural patterns.\n\n`;
  }

  md += `## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run \`arch-audit\` after fixes to verify improvements
4. Consider running \`code-audit\` for code quality checks

---

*Generated by arch-audit skill*
`;

  return md;
}

// Run report generation
generateReport().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
