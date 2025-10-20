#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const CWD = process.cwd();
const ANALYSIS_DIR = path.join(CWD,'docs','architecture','analysis');
const OUTPUT = path.join(ANALYSIS_DIR,'issues.json');

// Load all analysis results
const codeQuality = JSON.parse(fs.readFileSync(path.join(ANALYSIS_DIR,'code-quality.json'),'utf8'));
const architecture = JSON.parse(fs.readFileSync(path.join(ANALYSIS_DIR,'architecture-analysis.json'),'utf8'));
const testing = JSON.parse(fs.readFileSync(path.join(ANALYSIS_DIR,'testing-analysis.json'),'utf8'));
const security = JSON.parse(fs.readFileSync(path.join(ANALYSIS_DIR,'security-analysis.json'),'utf8'));
const dependencies = JSON.parse(fs.readFileSync(path.join(ANALYSIS_DIR,'dependencies-analysis.json'),'utf8'));

const issues = {
  critical: [],
  high: [],
  medium: [],
  low: [],
};

// CRITICAL ISSUES

if (security.hardcodedSecrets.count > 0) {
  issues.critical.push({
    id: 'SEC-001',
    category: 'Security',
    title: 'Hardcoded Secrets Detected',
    description: `Found ${security.hardcodedSecrets.count} potential hardcoded secret(s) in source code`,
    severity: 'CRITICAL',
    impact: 'Credential exposure, security breach',
    files: security.hardcodedSecrets.items.map(i => `${i.file}:${i.line}`),
    recommendation: 'Move all secrets to environment variables (.env files)',
    effort: 'Low',
  });
}

if (security.unsafePatterns.count > 0) {
  const evalCount = security.unsafePatterns.items.filter(i => i.type === 'EVAL').length;
  if (evalCount > 0) {
    issues.critical.push({
      id: 'SEC-002',
      category: 'Security',
      title: 'Unsafe eval() Usage',
      description: `Found ${evalCount} eval() usage(s) which poses XSS risk`,
      severity: 'CRITICAL',
      impact: 'Code injection vulnerability',
      files: security.unsafePatterns.items.filter(i => i.type === 'EVAL').map(i => `${i.file}:${i.line}`),
      recommendation: 'Replace eval() with safer alternatives (JSON.parse, Function constructor with validation)',
      effort: 'Medium',
    });
  }
}

// HIGH SEVERITY ISSUES

if (architecture.serviceInStore.detected) {
  issues.high.push({
    id: 'ARCH-001',
    category: 'Architecture',
    title: 'Service Initialization in Store',
    description: 'Service initialization logic found in Redux store configuration',
    severity: 'HIGH',
    impact: 'Tight coupling, difficult testing, violates separation of concerns',
    files: architecture.serviceInStore.files.map(f => f.file),
    recommendation: 'Move service initialization to dedicated bootstrap/composition layer',
    effort: 'Medium',
  });
}

if (architecture.singletons.count >= 5) {
  issues.high.push({
    id: 'ARCH-002',
    category: 'Architecture',
    title: 'Excessive Singleton Pattern Usage',
    description: `${architecture.singletons.count} singleton usages detected across ${architecture.singletons.files.length} files`,
    severity: 'HIGH',
    impact: 'Difficult testing, hidden dependencies, poor testability',
    files: architecture.singletons.files.slice(0, 5).map(f => `${f.file} (${f.count}x)`),
    recommendation: 'Refactor to dependency injection pattern using React Context or props',
    effort: 'High',
  });
}

if (codeQuality.exportAll.count > 0) {
  issues.high.push({
    id: 'QUALITY-001',
    category: 'Code Quality',
    title: 'Export All Pattern Violation',
    description: `${codeQuality.exportAll.count} "export *" statement(s) found (violates CLAUDE.md rules)`,
    severity: 'HIGH',
    impact: 'Bundle size bloat, unclear dependencies, harder to tree-shake',
    files: codeQuality.exportAll.files.map(f => f.file),
    recommendation: 'Replace with explicit named exports',
    effort: 'Low',
    codeExample: 'Instead of: export * from "./module"\nUse: export { SpecificExport } from "./module"',
  });
}

if (testing.summary.testingScore < 50) {
  issues.high.push({
    id: 'TEST-001',
    category: 'Testing',
    title: 'Low Test Coverage',
    description: `Test coverage estimate: ${testing.summary.coverageEstimate}, Score: ${testing.summary.testingScore}/100`,
    severity: 'HIGH',
    impact: 'High risk of regressions, difficult refactoring, poor code confidence',
    files: testing.untested.files.slice(0, 10),
    recommendation: 'Increase test coverage to at least 60%, prioritize critical paths',
    effort: 'High',
  });
}

// MEDIUM SEVERITY ISSUES

if (architecture.sagaPatterns.multipleYieldAll.length > 0) {
  issues.medium.push({
    id: 'ARCH-003',
    category: 'Architecture',
    title: 'Inefficient Saga Pattern',
    description: `${architecture.sagaPatterns.multipleYieldAll.length} file(s) with multiple yield all statements`,
    severity: 'MEDIUM',
    impact: 'Performance overhead, unnecessary saga complexity',
    files: architecture.sagaPatterns.multipleYieldAll.map(s => `${s.file}:${s.line}`),
    recommendation: 'Combine multiple yield all into single statement: yield all([fork(...), fork(...)])',
    effort: 'Low',
  });
}

if (security.debugLogsInProd.count > 50) {
  issues.medium.push({
    id: 'SEC-003',
    category: 'Security',
    title: 'Excessive Debug Logging',
    description: `${security.debugLogsInProd.count} debug log statements in production code`,
    severity: 'MEDIUM',
    impact: 'Performance overhead, potential information leakage',
    files: security.debugLogsInProd.files.slice(0, 5).map(f => `${f.file} (${f.count}x)`),
    recommendation: 'Configure log level filtering for production, or use conditional logging',
    effort: 'Low',
  });
}

if (codeQuality.typeIgnores.count > 20) {
  issues.medium.push({
    id: 'QUALITY-002',
    category: 'Code Quality',
    title: 'Excessive Type Safety Bypasses',
    description: `${codeQuality.typeIgnores.count} @ts-ignore/@ts-nocheck directives found`,
    severity: 'MEDIUM',
    impact: 'Reduced type safety, potential runtime errors',
    files: codeQuality.typeIgnores.files.slice(0, 5).map(f => `${f.file} (${f.count}x)`),
    recommendation: 'Fix type errors properly instead of suppressing them',
    effort: 'Medium',
  });
}

if (dependencies.outdated.count > 5) {
  issues.medium.push({
    id: 'DEP-001',
    category: 'Dependencies',
    title: 'Outdated Dependencies',
    description: `${dependencies.outdated.count} package(s) have minor updates available`,
    severity: 'MEDIUM',
    impact: 'Missing bug fixes, security patches, performance improvements',
    files: dependencies.outdated.packages.slice(0, 10).map(p => `${p.name}: ${p.current} → ${p.available}`),
    recommendation: 'Update packages using npm-minor-updater skill or npm update',
    effort: 'Low',
  });
}

// LOW SEVERITY ISSUES

if (codeQuality.todos.count > 10) {
  issues.low.push({
    id: 'QUALITY-003',
    category: 'Code Quality',
    title: 'Technical Debt TODOs',
    description: `${codeQuality.todos.count} TODO/FIXME/HACK comments found`,
    severity: 'LOW',
    impact: 'Incomplete features, potential bugs, code maintainability',
    files: codeQuality.todos.items.slice(0, 10).map(i => `${i.file}:${i.line} - ${i.type}`),
    recommendation: 'Create issues for TODOs and address them systematically',
    effort: 'Varies',
  });
}

if (security.dangerousHtml.count > 0) {
  issues.low.push({
    id: 'SEC-004',
    category: 'Security',
    title: 'Dangerous HTML Usage',
    description: `${security.dangerousHtml.count} dangerouslySetInnerHTML or innerHTML usage(s)`,
    severity: 'LOW',
    impact: 'Potential XSS if not properly sanitized',
    files: security.dangerousHtml.items.map(i => `${i.file}:${i.line}`),
    recommendation: 'Ensure all HTML is properly sanitized using DOMPurify or similar',
    effort: 'Low',
  });
}

if (dependencies.unusedDeps.potential.length > 5) {
  issues.low.push({
    id: 'DEP-002',
    category: 'Dependencies',
    title: 'Potentially Unused Dependencies',
    description: `${dependencies.unusedDeps.potential.length} package(s) not found in import statements`,
    severity: 'LOW',
    impact: 'Bloated node_modules, increased install time',
    files: dependencies.unusedDeps.potential.slice(0, 10).map(d => d.name),
    recommendation: 'Review and remove if confirmed unused (may be indirect deps or build tools)',
    effort: 'Low',
  });
}

// Summary
const summary = {
  totalIssues: issues.critical.length + issues.high.length + issues.medium.length + issues.low.length,
  bySeverity: {
    critical: issues.critical.length,
    high: issues.high.length,
    medium: issues.medium.length,
    low: issues.low.length,
  },
  byCategory: {},
  overallScore: Math.round((
    codeQuality.summary.qualityScore * 0.25 +
    architecture.summary.architectureScore * 0.25 +
    testing.summary.testingScore * 0.20 +
    security.summary.securityScore * 0.20 +
    dependencies.summary.dependencyScore * 0.10
  )),
  scores: {
    codeQuality: codeQuality.summary.qualityScore,
    architecture: architecture.summary.architectureScore,
    testing: testing.summary.testingScore,
    security: security.summary.securityScore,
    dependencies: dependencies.summary.dependencyScore,
  }
};

// Count by category
[...issues.critical, ...issues.high, ...issues.medium, ...issues.low].forEach(issue => {
  summary.byCategory[issue.category] = (summary.byCategory[issue.category] || 0) + 1;
});

const result = { summary, issues };

fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
console.log(`detect_issues: Found ${summary.totalIssues} issues`);
console.log(`  - Critical: ${summary.bySeverity.critical}`);
console.log(`  - High: ${summary.bySeverity.high}`);
console.log(`  - Medium: ${summary.bySeverity.medium}`);
console.log(`  - Low: ${summary.bySeverity.low}`);
console.log(`  - Overall Score: ${summary.overallScore}/100`);
