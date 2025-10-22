#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const ROOT = path.join(process.cwd(),'docs','architecture');
const ANALYSIS = path.join(ROOT,'analysis');
const META = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'scan.meta.json'),'utf8'));
const CODE_QUALITY = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'code-quality.json'),'utf8'));
const ARCHITECTURE = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'architecture-analysis.json'),'utf8'));
const TESTING = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'testing-analysis.json'),'utf8'));
const SECURITY = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'security-analysis.json'),'utf8'));
const DEPS = JSON.parse(fs.readFileSync(path.join(ANALYSIS,'dependencies-analysis.json'),'utf8'));

function imgOrPuml(base) {
  const png = path.join('diagrams', base + '.png');
  if (fs.existsSync(path.join(ROOT, png))) return `![${base}](${png})`;
  return '`diagrams/' + base + '.puml`';
}

function emoji(val, high, med) {
  return val > high ? '🔴 High' : val > med ? '🟡 Medium' : '🟢 Low';
}

// Build report sections
const scanRoots = META.roots.map(r => '`' + r + '`').join(', ');
const prodDeps = (META.package.deps||[]).sort().map(d => '- ' + d).join('\n') || '_none_';
const devDeps = (META.package.devDeps||[]).sort().slice(0, 30).map(d => '- ' + d).join('\n') || '_none_';
const devDepsMore = (META.package.devDeps||[]).length > 30 ? '\n_...and ' + ((META.package.devDeps||[]).length - 30) + ' more_' : '';

const typeIgnoresTop = CODE_QUALITY.typeIgnores.files.length > 0 ?
  '\n#### Type Safety Bypasses\n' + CODE_QUALITY.typeIgnores.files.slice(0,5).map(f => '- ' + f.file + ': ' + f.count + ' occurrence(s)').join('\n') : '';

const exportAllViolations = CODE_QUALITY.exportAll.files.length > 0 ?
  '\n#### Export All Violations (CLAUDE.md Rule Violation)\n' + CODE_QUALITY.exportAll.files.map(f => '- ❌ ' + f.file).join('\n') : '';

const singletonFiles = ARCHITECTURE.singletons.files.length > 0 ?
  '\n**Files with Singleton Usage:**\n' + ARCHITECTURE.singletons.files.slice(0,5).map(f => '- ' + f.file + ': ' + f.count + ' getInstance() call(s)').join('\n') : '';

const serviceInStoreIssue = ARCHITECTURE.serviceInStore.detected ?
  '⚠️ **Issue Detected:** Service initialization found in store configuration\n\n**Files:**\n' +
  ARCHITECTURE.serviceInStore.files.map(f => '- ' + f.file + '\n  - ' + f.issue).join('\n') +
  '\n\n**Recommendation:** Move service initialization to a dedicated composition layer.' :
  '✓ Clean separation between services and state management';

const sagaIssue = ARCHITECTURE.sagaPatterns.multipleYieldAll.length > 0 ?
  '⚠️ **Inefficient Pattern:** Multiple `yield all` statements detected\n\n' +
  ARCHITECTURE.sagaPatterns.multipleYieldAll.map(s => '- ' + s.file + ':' + s.line + '\n  - ' + s.issue).join('\n') :
  '✓ Efficient saga orchestration';

const circularDepsNote = ARCHITECTURE.circularDeps.potential.length > 0 ?
  '⚠️ **Potential circular dependencies:** ' + ARCHITECTURE.circularDeps.potential.length + '\n\nNote: This is a heuristic check and may include false positives.' :
  '✓ No obvious circular dependencies detected';

const testingWarning = TESTING.summary.testingScore < 60 ?
  '⚠️ **Testing coverage is below recommended levels.**\n\n**Action Items:**\n1. Increase unit test coverage for critical paths\n2. Add integration tests for feature workflows\n3. Complete TODO items in existing tests\n4. Aim for at least 60% coverage' :
  '✓ Testing coverage is adequate';

const testTodos = TESTING.testTodos.count > 0 ?
  '\n### Test TODOs\n' + TESTING.testTodos.items.slice(0,10).map(t => '- ' + t.file + ':' + t.line + '\n  `' + t.text + '`').join('\n') +
  (TESTING.testTodos.count > 10 ? '\n_...and ' + (TESTING.testTodos.count - 10) + ' more_' : '') : '';

const hardcodedSecrets = SECURITY.hardcodedSecrets.count > 0 ?
  '\n### ⚠️ Hardcoded Secrets Detected\n' + SECURITY.hardcodedSecrets.items.map(s => '- ' + s.file + ':' + s.line + ' [' + s.type + ']').join('\n') +
  '\n\n**Action Required:** Move all secrets to environment variables.' : '';

const debugLogsWarning = SECURITY.debugLogsInProd.count > 50 ?
  '\n### Debug Logging\n' + SECURITY.debugLogsInProd.count + ' debug log statements detected. Consider:\n- Conditional logging based on environment\n- Log level filtering for production\n- Using proper logging service' : '';

const outdatedDeps = DEPS.outdated.count > 0 ?
  '\n### Outdated Dependencies (' + DEPS.outdated.count + ')\n' +
  DEPS.outdated.packages.slice(0,15).map(p => '- ' + p.name + ': ' + p.current + ' → ' + p.available + ' [' + p.type + ']').join('\n') +
  (DEPS.outdated.count > 15 ? '\n_...and ' + (DEPS.outdated.count - 15) + ' more_' : '') +
  '\n\n**Recommendation:** Run `npm-minor-updater` skill to safely update minor versions.' :
  '✅ All dependencies are up to date';

const bestPracticesFollowed = [
  CODE_QUALITY.deepImports.count === 0 ? '- ✓ No deep imports (using path aliases)' : null,
  CODE_QUALITY.consoleLogs.count === 0 ? '- ✓ No console.log in source code (using proper logging)' : null,
  SECURITY.hardcodedSecrets.count === 0 ? '- ✓ No hardcoded secrets detected' : null,
  ARCHITECTURE.circularDeps.potential.length === 0 ? '- ✓ No obvious circular dependencies' : null,
].filter(Boolean).join('\n');

const areasForImprovement = [
  CODE_QUALITY.exportAll.count > 0 ? '- Replace export all patterns with named exports' : null,
  ARCHITECTURE.singletons.count > 5 ? '- Reduce singleton usage, prefer dependency injection' : null,
  ARCHITECTURE.serviceInStore.detected ? '- Move service initialization out of store' : null,
  TESTING.summary.testingScore < 60 ? '- Increase test coverage' : null,
  DEPS.outdated.count > 5 ? '- Update outdated dependencies' : null,
].filter(Boolean).join('\n');

const projectHealth = CODE_QUALITY.summary.qualityScore >= 75 && ARCHITECTURE.summary.architectureScore >= 75 && SECURITY.summary.securityScore >= 75 ?
  '✅ Good' :
  CODE_QUALITY.summary.qualityScore >= 60 && ARCHITECTURE.summary.architectureScore >= 60 && SECURITY.summary.securityScore >= 60 ?
  '⚠️ Fair - needs attention' : '🔴 Needs significant improvement';

const archPattern = ARCHITECTURE.summary.architectureScore >= 75 ? 'solid' : 'evolving';
const testCoverage = TESTING.summary.testingScore >= 60 ? 'adequate' : 'limited';
const securityStatus = SECURITY.summary.securityScore >= 90 ?
  'Security practices are strong.' :
  SECURITY.summary.securityScore >= 75 ?
  'Security is generally good but has some areas to address.' :
  'Security needs attention.';
const depsStatus = DEPS.summary.dependencyScore >= 80 ?
  'Dependency management is well maintained.' :
  'Dependencies require some updates.';

const md = `# Architecture Details Report

**Generated:** ${new Date().toISOString()}
**Project:** ${META.package.name ?? 'unknown'} v${META.package.version ?? '0.0.0'}

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Code Quality Analysis](#code-quality-analysis)
4. [Architecture Patterns](#architecture-patterns)
5. [Testing Strategy](#testing-strategy)
6. [Security Analysis](#security-analysis)
7. [Dependency Management](#dependency-management)
8. [Best Practices](#best-practices)
9. [Recommendations](#recommendations)

## Executive Summary

### Project Overview
- **Name:** ${META.package.name ?? 'unknown'}
- **Version:** ${META.package.version ?? '0.0.0'}
- **Source Files:** ${META.counts.files}
- **Scan Roots:** ${scanRoots}

### Technology Stack

#### Production Dependencies (${(META.package.deps||[]).length})
${prodDeps}

#### Development Dependencies (${(META.package.devDeps||[]).length})
${devDeps}${devDepsMore}

## System Architecture

### Overview
${imgOrPuml('system-overview')}

### Component Architecture
${imgOrPuml('component-architecture')}

The application follows a **feature-based architecture** with clear separation of concerns.

### Data Flow
${imgOrPuml('data-flow')}

### Dependencies Visualization
${imgOrPuml('dependencies-summary')}

## Code Quality Analysis

**Overall Score:** ${CODE_QUALITY.summary.qualityScore}/100 (Grade: ${CODE_QUALITY.summary.grade})

### Metrics

| Metric | Count | Impact |
|--------|-------|--------|
| Type Safety Bypasses | ${CODE_QUALITY.typeIgnores.count} | ${emoji(CODE_QUALITY.typeIgnores.count, 20, 10)} |
| ESLint Disables | ${CODE_QUALITY.eslintDisables.count} | ${emoji(CODE_QUALITY.eslintDisables.count, 15, 5)} |
| Any Type Usage | ${CODE_QUALITY.anyType.count} | ${emoji(CODE_QUALITY.anyType.count, 15, 5)} |
| TODO Comments | ${CODE_QUALITY.todos.count} | ${emoji(CODE_QUALITY.todos.count, 20, 10)} |
| Debug Logs | ${CODE_QUALITY.debugLogs.count} | ${emoji(CODE_QUALITY.debugLogs.count, 50, 20)} |
| Console Logs | ${CODE_QUALITY.consoleLogs.count} | ${CODE_QUALITY.consoleLogs.count > 0 ? '🔴 High' : '🟢 Low'} |
| Deep Imports | ${CODE_QUALITY.deepImports.count} | ${CODE_QUALITY.deepImports.count > 0 ? '🟡 Medium' : '✅ None'} |
| Export All Pattern | ${CODE_QUALITY.exportAll.count} | ${CODE_QUALITY.exportAll.count > 0 ? '🔴 Violation' : '✅ Compliant'} |

### Top Issues by File
${typeIgnoresTop}
${exportAllViolations}

## Architecture Patterns

**Architecture Score:** ${ARCHITECTURE.summary.architectureScore}/100 (Grade: ${ARCHITECTURE.summary.grade})

### Patterns Detected

#### Singleton Pattern
- **Usage Count:** ${ARCHITECTURE.singletons.count}
- **Assessment:** ${ARCHITECTURE.singletons.count > 5 ? '⚠️ Overused - consider dependency injection' : '✓ Acceptable'}
${singletonFiles}

#### Service Layer
${serviceInStoreIssue}

#### Saga Patterns
${sagaIssue}

#### Circular Dependencies
${circularDepsNote}

## Testing Strategy

**Testing Score:** ${TESTING.summary.testingScore}/100 (Grade: ${TESTING.summary.grade})

### Coverage Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Source Files | ${TESTING.summary.totalSourceFiles} | - |
| Test Files | ${TESTING.summary.testFiles} | - |
| Story Files | ${TESTING.summary.storyFiles} | - |
| Test Ratio | ${TESTING.summary.testRatio} | >50% |
| Story Ratio | ${TESTING.summary.storyRatio} | >20% |
| Coverage Estimate | ${TESTING.summary.coverageEstimate} | >60% |
| Test TODOs | ${TESTING.summary.testTodos} | 0 |

### Analysis

${testingWarning}
${testTodos}

## Security Analysis

**Security Score:** ${SECURITY.summary.securityScore}/100 (Grade: ${SECURITY.summary.grade})

### Security Metrics

| Category | Count | Severity |
|----------|-------|----------|
| Hardcoded Secrets | ${SECURITY.summary.warnings.hardcodedSecrets} | ${SECURITY.summary.warnings.hardcodedSecrets > 0 ? '🔴 Critical' : '✅ None'} |
| Eval Usage | ${SECURITY.summary.warnings.evalUsage} | ${SECURITY.summary.warnings.evalUsage > 0 ? '🔴 Critical' : '✅ None'} |
| Debug Logs (Prod) | ${SECURITY.summary.warnings.debugLogs} | ${SECURITY.summary.warnings.debugLogs > 50 ? '🟡 Medium' : '🟢 Low'} |
| Dangerous HTML | ${SECURITY.summary.warnings.dangerousHtml} | ${SECURITY.summary.warnings.dangerousHtml > 0 ? '🟡 Review' : '✅ None'} |
| Env Exposure | ${SECURITY.summary.warnings.envExposure} | ${SECURITY.summary.warnings.envExposure > 0 ? '🟡 Review' : '✅ None'} |
${hardcodedSecrets}
${debugLogsWarning}

## Dependency Management

**Dependency Score:** ${DEPS.summary.dependencyScore}/100 (Grade: ${DEPS.summary.grade})

### Dependency Health

| Metric | Value |
|--------|-------|
| Total Packages | ${DEPS.summary.totalPackages} |
| Outdated | ${DEPS.summary.outdated} (${DEPS.summary.outdatedPercentage}) |
| Potentially Unused | ${DEPS.summary.potentiallyUnused} |
${outdatedDeps}

## Best Practices

### ✅ Followed Practices
${bestPracticesFollowed}

### ⚠️ Areas for Improvement
${areasForImprovement}

## Recommendations

### Immediate Actions (Quick Wins)
1. ${CODE_QUALITY.exportAll.count > 0 ? 'Fix export all pattern violations in test-utils' : 'Code quality: Address type safety bypasses'}
2. ${ARCHITECTURE.sagaPatterns.multipleYieldAll.length > 0 ? 'Combine multiple yield all statements in sagas' : 'Review singleton pattern usage'}
3. ${DEPS.outdated.count > 5 ? 'Update outdated dependencies using npm-minor-updater skill' : 'Review dependency health'}

### Medium-term Improvements
1. ${TESTING.summary.testingScore < 60 ? 'Increase test coverage to 60%+' : 'Maintain high test coverage'}
2. ${ARCHITECTURE.serviceInStore.detected ? 'Refactor service initialization to composition layer' : 'Review architecture patterns'}
3. ${CODE_QUALITY.todos.count > 10 ? 'Address ' + CODE_QUALITY.todos.count + ' TODO comments' : 'Continue code quality improvements'}

### Long-term Enhancements
1. ${ARCHITECTURE.singletons.count > 5 ? 'Migrate from singleton to dependency injection pattern' : 'Consider advanced state management'}
2. Implement automated architecture testing (ArchUnit, dependency-cruiser)
3. Add performance monitoring and bundle size tracking
4. Enhance documentation coverage

## Conclusion

**Overall Project Health:** ${projectHealth}

The project demonstrates ${archPattern} architectural patterns with ${testCoverage} test coverage. ${securityStatus} ${depsStatus}

For actionable items, see [ARCHITECTURE_ISSUES.md](./ARCHITECTURE_ISSUES.md).

---

*Generated by architecture-documenter skill*
*For overview, see [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)*
`;

fs.writeFileSync(path.join(ROOT,'ARCHITECTURE_DETAILS.md'), md);
console.log('assemble_details: wrote ARCHITECTURE_DETAILS.md');
