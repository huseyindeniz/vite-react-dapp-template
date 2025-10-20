#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const ROOT = path.join(process.cwd(),'docs','architecture');
const ANALYSIS = path.join(ROOT,'analysis');
const META = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'scan.meta.json'),'utf8'));
const ISSUES = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'issues.json'),'utf8'));

function imgOrPuml(base) {
  const png = path.join('diagrams', base + '.png');
  if (fs.existsSync(path.join(ROOT, png))) return `![${base}](${png})`;
  return `\`diagrams/${base}.puml\``;
}

const md = `# Architecture Overview

**Generated:** ${new Date().toISOString()}
**Project:** ${META.package.name ?? 'unknown'} @ ${META.package.version ?? '0.0.0'}

## Executive Summary

### Project Metrics
- **Source Files:** ${META.counts.files}
- **Dependencies:** ${(META.package.deps||[]).length} production, ${(META.package.devDeps||[]).length} development
- **Scan Roots:** ${META.roots.join(', ')}

### Quality Scores

| Category | Score | Grade |
|----------|-------|-------|
| **Overall** | **${ISSUES.summary.overallScore}/100** | **${ISSUES.summary.overallScore >= 90 ? 'A' : ISSUES.summary.overallScore >= 75 ? 'B' : ISSUES.summary.overallScore >= 60 ? 'C' : ISSUES.summary.overallScore >= 45 ? 'D' : 'F'}** |
| Code Quality | ${ISSUES.summary.scores.codeQuality}/100 | ${ISSUES.summary.scores.codeQuality >= 90 ? 'A' : ISSUES.summary.scores.codeQuality >= 75 ? 'B' : ISSUES.summary.scores.codeQuality >= 60 ? 'C' : 'D'} |
| Architecture | ${ISSUES.summary.scores.architecture}/100 | ${ISSUES.summary.scores.architecture >= 90 ? 'A' : ISSUES.summary.scores.architecture >= 75 ? 'B' : ISSUES.summary.scores.architecture >= 60 ? 'C' : 'D'} |
| Testing | ${ISSUES.summary.scores.testing}/100 | ${ISSUES.summary.scores.testing >= 90 ? 'A' : ISSUES.summary.scores.testing >= 75 ? 'B' : ISSUES.summary.scores.testing >= 60 ? 'C' : 'D'} |
| Security | ${ISSUES.summary.scores.security}/100 | ${ISSUES.summary.scores.security >= 90 ? 'A' : ISSUES.summary.scores.security >= 75 ? 'B' : ISSUES.summary.scores.security >= 60 ? 'C' : 'D'} |
| Dependencies | ${ISSUES.summary.scores.dependencies}/100 | ${ISSUES.summary.scores.dependencies >= 90 ? 'A' : ISSUES.summary.scores.dependencies >= 75 ? 'B' : ISSUES.summary.scores.dependencies >= 60 ? 'C' : 'D'} |

### Issues Summary

**Total Issues:** ${ISSUES.summary.totalIssues}

- 🔴 **Critical:** ${ISSUES.summary.bySeverity.critical}
- 🟠 **High:** ${ISSUES.summary.bySeverity.high}
- 🟡 **Medium:** ${ISSUES.summary.bySeverity.medium}
- 🔵 **Low:** ${ISSUES.summary.bySeverity.low}

**By Category:**
${Object.entries(ISSUES.summary.byCategory).map(([cat, count]) => `- ${cat}: ${count}`).join('\n')}

${ISSUES.summary.bySeverity.critical > 0 ? `\n⚠️  **${ISSUES.summary.bySeverity.critical} CRITICAL issue(s) require immediate attention!**` : ''}
${ISSUES.summary.bySeverity.high > 0 ? `\n⚠️  **${ISSUES.summary.bySeverity.high} HIGH severity issue(s) should be addressed soon.**` : ''}

## Architecture Diagrams

### System Overview
${imgOrPuml('system-overview')}

### Component Architecture
${imgOrPuml('component-architecture')}

### Data Flow
${imgOrPuml('data-flow')}

### Dependencies
${imgOrPuml('dependencies-summary')}

## Next Steps

1. Review **[ARCHITECTURE_ISSUES.md](./ARCHITECTURE_ISSUES.md)** for detailed issue analysis
2. Check **[ARCHITECTURE_DETAILS.md](./ARCHITECTURE_DETAILS.md)** for comprehensive documentation
3. Address critical and high-severity issues first
4. Run skill again after fixes to track improvements

---

*For detailed analysis, see:*
- **Issues Report:** [ARCHITECTURE_ISSUES.md](./ARCHITECTURE_ISSUES.md)
- **Detailed Report:** [ARCHITECTURE_DETAILS.md](./ARCHITECTURE_DETAILS.md)
- **Raw Analysis Data:** [\`analysis/\`](./analysis/) directory
`;

fs.writeFileSync(path.join(ROOT,'ARCHITECTURE_OVERVIEW.md'), md);
console.log('assemble_overview: wrote ARCHITECTURE_OVERVIEW.md');
