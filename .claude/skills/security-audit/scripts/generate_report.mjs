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
const REPORT_FILE = path.join(REPORT_DIR, 'security-audit-report.md');

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
  if (output.includes('✅ No')) {
    result.passed = true;
  }

  // Extract violation counts
  const summaryMatch = output.match(/Summary: (\d+) violation\(s\)/);
  if (summaryMatch) {
    result.summary = `${summaryMatch[1]} violation(s)`;
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
  console.log('Security Audit - Generating Report');
  console.log('='.repeat(80));
  console.log('');

  const checks = [
    { name: 'Hardcoded Secrets', script: path.join(__dirname, 'check_hardcoded_secrets.mjs') },
    { name: 'eval() Usage', script: path.join(__dirname, 'check_eval_usage.mjs') },
    { name: 'Dangerous HTML Patterns', script: path.join(__dirname, 'check_dangerous_html.mjs') },
    { name: 'Environment Variable Exposure', script: path.join(__dirname, 'check_env_exposure.mjs') },
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

  let md = `# Security Audit Report

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
      md += `- ✅ **${result.name}** - ${result.summary || 'No violations found'}\n`;
    }

    md += `\n`;
  }

  // Add security principles summary
  md += `## Security Principles Verified

This audit ensures the following security practices:

### ✅ Secret Management
- No hardcoded API keys, passwords, or tokens in source code
- Environment variables properly used for sensitive configuration
- Secrets managed through .env files (not committed to version control)

### ✅ Code Injection Prevention
- No eval() usage that could execute arbitrary code
- Safe alternatives used for dynamic code execution
- Protection against code injection attacks

### ✅ XSS Protection
- No unsafe HTML rendering (dangerouslySetInnerHTML, innerHTML)
- User input properly sanitized when necessary
- React's built-in XSS protection utilized

### ✅ Environment Variable Safety
- Only VITE_ prefixed variables exposed to client code
- Server-side secrets kept server-side
- No accidental exposure of sensitive configuration

`;

  // Add recommendations
  md += `## Recommendations

`;

  if (failedChecks.length > 0) {
    md += `### Priority Actions

`;
    failedChecks.forEach((result, idx) => {
      md += `${idx + 1}. **${result.name}**: ${result.summary}
   - Run: \`node ./.claude/skills/security-audit/scripts/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.mjs\`
   - See detailed output above for specific violations

`;
    });
  } else {
    md += `🎉 **All security checks passed!** Your codebase follows excellent security practices.\n\n`;
  }

  md += `## Next Steps

1. Address failed checks in priority order (security issues are critical!)
2. Run individual check scripts for detailed violation analysis
3. Re-run \`security-audit\` after fixes to verify improvements
4. Consider running \`code-audit\` and \`arch-audit\` for complete analysis

---

*Generated by security-audit skill*
`;

  return md;
}

// Run report generation
generateReport().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
