#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const ROOT = path.join(process.cwd(),'docs','architecture');
const ANALYSIS = path.join(ROOT,'analysis');
const ISSUES_DATA = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'issues.json'),'utf8'));

function formatIssue(issue, index) {
  const emoji = {
    CRITICAL: '🔴',
    HIGH: '🟠',
    MEDIUM: '🟡',
    LOW: '🔵'
  }[issue.severity] || '⚪';

  return `### ${emoji} ${issue.id}: ${issue.title}

**Severity:** ${issue.severity}
**Category:** ${issue.category}
**Effort:** ${issue.effort}

#### Description
${issue.description}

#### Impact
${issue.impact}

${issue.files && issue.files.length > 0 ? `#### Affected Files
${issue.files.slice(0, 10).map(f => `- \`${f}\``).join('\n')}
${issue.files.length > 10 ? `\n_...and ${issue.files.length - 10} more_` : ''}
` : ''}

#### Recommendation
${issue.recommendation}

${issue.codeExample ? `#### Example
\`\`\`typescript
${issue.codeExample}
\`\`\`
` : ''}

---
`;
}

const md = `# Architecture Issues Report

**Generated:** ${new Date().toISOString()}

## Summary

**Total Issues:** ${ISSUES_DATA.summary.totalIssues}
**Overall Score:** ${ISSUES_DATA.summary.overallScore}/100

### Issues by Severity

| Severity | Count | Priority |
|----------|-------|----------|
| 🔴 Critical | ${ISSUES_DATA.summary.bySeverity.critical} | **Fix Immediately** |
| 🟠 High | ${ISSUES_DATA.summary.bySeverity.high} | Fix Soon |
| 🟡 Medium | ${ISSUES_DATA.summary.bySeverity.medium} | Plan to Fix |
| 🔵 Low | ${ISSUES_DATA.summary.bySeverity.low} | Nice to Have |

### Issues by Category

${Object.entries(ISSUES_DATA.summary.byCategory)
  .sort((a, b) => b[1] - a[1])
  .map(([cat, count]) => `- **${cat}:** ${count}`)
  .join('\n')}

### Quality Scores

| Category | Score |
|----------|-------|
| Code Quality | ${ISSUES_DATA.summary.scores.codeQuality}/100 |
| Architecture | ${ISSUES_DATA.summary.scores.architecture}/100 |
| Testing | ${ISSUES_DATA.summary.scores.testing}/100 |
| Security | ${ISSUES_DATA.summary.scores.security}/100 |
| Dependencies | ${ISSUES_DATA.summary.scores.dependencies}/100 |

${ISSUES_DATA.summary.bySeverity.critical > 0 ? `
## ⚠️ CRITICAL ISSUES

**These issues require immediate attention and may pose security or stability risks.**

${ISSUES_DATA.issues.critical.map((issue, idx) => formatIssue(issue, idx)).join('\n')}
` : '## ✅ No Critical Issues\n\nGreat! No critical issues were detected.\n'}

${ISSUES_DATA.summary.bySeverity.high > 0 ? `
## 🟠 HIGH SEVERITY ISSUES

**Address these issues in the near term to improve code quality and maintainability.**

${ISSUES_DATA.issues.high.map((issue, idx) => formatIssue(issue, idx)).join('\n')}
` : '## ✅ No High Severity Issues\n'}

${ISSUES_DATA.summary.bySeverity.medium > 0 ? `
## 🟡 MEDIUM SEVERITY ISSUES

**Plan to address these issues to prevent technical debt accumulation.**

${ISSUES_DATA.issues.medium.map((issue, idx) => formatIssue(issue, idx)).join('\n')}
` : ''}

${ISSUES_DATA.summary.bySeverity.low > 0 ? `
## 🔵 LOW SEVERITY ISSUES

**Nice-to-have improvements that can be addressed when time permits.**

${ISSUES_DATA.issues.low.map((issue, idx) => formatIssue(issue, idx)).join('\n')}
` : ''}

## Action Plan

### Step 1: Address Critical Issues (Priority: IMMEDIATE)
${ISSUES_DATA.summary.bySeverity.critical > 0 ? `
${ISSUES_DATA.issues.critical.map((issue, idx) => `${idx + 1}. [${issue.id}] ${issue.title} (Effort: ${issue.effort})`).join('\n')}
` : '✅ No critical issues to address'}

### Step 2: Fix High Severity Issues (Priority: THIS SPRINT)
${ISSUES_DATA.summary.bySeverity.high > 0 ? `
${ISSUES_DATA.issues.high.map((issue, idx) => `${idx + 1}. [${issue.id}] ${issue.title} (Effort: ${issue.effort})`).join('\n')}
` : '✅ No high severity issues'}

### Step 3: Plan Medium Severity Fixes (Priority: NEXT SPRINT)
${ISSUES_DATA.summary.bySeverity.medium > 0 ? `
${ISSUES_DATA.issues.medium.map((issue, idx) => `${idx + 1}. [${issue.id}] ${issue.title} (Effort: ${issue.effort})`).join('\n')}
` : '✅ No medium severity issues'}

### Step 4: Address Low Priority Items (Priority: BACKLOG)
${ISSUES_DATA.summary.bySeverity.low > 0 ? `
${ISSUES_DATA.issues.low.map((issue, idx) => `${idx + 1}. [${issue.id}] ${issue.title} (Effort: ${issue.effort})`).join('\n')}
` : '✅ No low priority issues'}

## Quick Wins (Low Effort, High Impact)

${[...ISSUES_DATA.issues.critical, ...ISSUES_DATA.issues.high, ...ISSUES_DATA.issues.medium]
  .filter(i => i.effort === 'Low')
  .map(i => `- [${i.id}] ${i.title} (${i.severity})`)
  .join('\n') || 'No quick wins available - most issues require Medium to High effort'}

## Tracking Progress

After fixing issues:
1. Run the \`architecture-documenter\` skill again
2. Compare the new Overall Score with current: **${ISSUES_DATA.summary.overallScore}/100**
3. Verify critical and high severity counts decrease
4. Track quality score improvements per category

## Next Steps

1. **Review this report** with your team
2. **Prioritize issues** based on severity and effort
3. **Create tasks** for critical and high-severity issues
4. **Fix issues** systematically, starting from critical
5. **Re-run analysis** to track progress

---

*For more details:*
- **Overview:** [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)
- **Full Report:** [ARCHITECTURE_DETAILS.md](./ARCHITECTURE_DETAILS.md)
- **Raw Data:** [\`analysis/\`](./analysis/) directory
`;

fs.writeFileSync(path.join(ROOT,'ARCHITECTURE_ISSUES.md'), md);
console.log('assemble_issues: wrote ARCHITECTURE_ISSUES.md');
