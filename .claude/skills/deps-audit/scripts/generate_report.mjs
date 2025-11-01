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
const REPORT_FILE = path.join(REPORT_DIR, 'deps-audit-report.md');

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
        stderr,
      });
    });

    process.on('error', (error) => {
      resolve({
        code: 1,
        output: error.message,
        error: error.message,
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
    details: output,
  };

  // Check if passed
  if (output.includes('✅')) {
    result.passed = true;
  }

  // Extract summaries
  if (checkName.includes('Outdated')) {
    const match = output.match(/Summary: (\d+) outdated package/);
    if (match) {
      result.summary = `${match[1]} outdated package(s)`;
    }
  } else if (checkName.includes('Unused')) {
    const match = output.match(/Summary: (\d+) potentially unused/);
    if (match) {
      result.summary = `${match[1]} potentially unused`;
    }
  }

  if (!result.summary) {
    result.summary = result.passed ? 'No issues' : 'See details';
  }

  return result;
}

/**
 * Main report generator
 */
async function generateReport() {
  console.log('='.repeat(80));
  console.log('Dependency Audit - Generating Report');
  console.log('='.repeat(80));
  console.log('');

  const checks = [
    { name: 'Outdated Dependencies', script: path.join(__dirname, 'check_outdated_deps.mjs') },
    { name: 'Unused Dependencies', script: path.join(__dirname, 'check_unused_deps.mjs') },
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

  let md = `# Dependency Audit Report

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
  const failedChecks = results.filter((r) => r.exitCode !== 0);

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
  const passedChecks = results.filter((r) => r.exitCode === 0);

  if (passedChecks.length > 0) {
    md += `## Passed Checks\n\n`;

    for (const result of passedChecks) {
      md += `- ✅ **${result.name}** - ${result.summary || 'No issues found'}\n`;
    }

    md += `\n`;
  }

  // Add dependency management principles
  md += `## Dependency Management Principles

This audit ensures the following dependency practices:

### ✅ Up-to-Date Dependencies
- Regular updates to get security patches
- Bug fixes and performance improvements
- Access to latest features
- Reduced technical debt

### ✅ Clean Dependency Tree
- Only necessary packages installed
- No bloated node_modules
- Faster installations
- Smaller bundle sizes

### ✅ Security Posture
- Fewer outdated packages = fewer vulnerabilities
- Regular dependency maintenance
- Proactive security management

`;

  // Add recommendations
  md += `## Recommendations

`;

  if (failedChecks.length > 0) {
    md += `### Priority Actions

`;
    failedChecks.forEach((result, idx) => {
      md += `${idx + 1}. **${result.name}**: ${result.summary}
   - Run: \`node ./.claude/skills/deps-audit/scripts/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mjs\`
   - See detailed output above for specific packages

`;
    });
  } else {
    md += `🎉 **All dependency checks passed!** Your dependencies are healthy.\n\n`;
  }

  md += `## Next Steps

1. Address failed checks in priority order
2. Review outdated packages and plan updates
3. Verify potentially unused dependencies before removing
4. Re-run \`deps-audit\` after changes to verify improvements
5. Consider using \`deps-minor\` skill for safe automated updates
6. Run \`security-audit\`, \`code-audit\`, and \`arch-audit\` for complete analysis

---

*Generated by deps-audit skill*
`;

  return md;
}

// Run report generation
generateReport().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
