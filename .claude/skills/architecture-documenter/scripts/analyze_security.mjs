#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const CWD = process.cwd();
const META_PATH = path.join(CWD,'docs','architecture','analysis','scan.meta.json');
const OUTPUT = path.join(CWD,'docs','architecture','analysis','security-analysis.json');

const META = JSON.parse(fs.readFileSync(META_PATH,'utf8'));

const results = {
  hardcodedSecrets: { count: 0, items: [] },
  debugLogsInProd: { count: 0, files: [] },
  unsafePatterns: { count: 0, items: [] },
  envVarExposure: { count: 0, items: [] },
  dangerousHtml: { count: 0, items: [] },
};

// Security patterns
const API_KEY_RE = /(api[_-]?key|apikey|access[_-]?token|secret[_-]?key)\s*[=:]\s*['"]\w{20,}['"]/gi;
const PASSWORD_RE = /password\s*[=:]\s*['"]\w+['"]/gi;
const DEBUG_LOG_RE = /log\.debug\(/g;
const DANGEROUS_HTML_RE = /dangerouslySetInnerHTML|innerHTML\s*=/gi;
const ENV_EXPOSE_RE = /import\.meta\.env\.\w+/g;
const EVAL_RE = /\beval\(/g;

for (const file of META.files) {
  const fullPath = path.join(CWD, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split(/\r?\n/);

  // Hardcoded secrets (API keys, passwords)
  lines.forEach((line, idx) => {
    const apiKeyMatch = line.match(API_KEY_RE);
    if (apiKeyMatch && !line.includes('process.env') && !line.includes('import.meta.env')) {
      results.hardcodedSecrets.count++;
      results.hardcodedSecrets.items.push({
        file,
        line: idx + 1,
        type: 'API_KEY',
        snippet: line.trim().substring(0, 80)
      });
    }

    const pwMatch = line.match(PASSWORD_RE);
    if (pwMatch && !line.includes('process.env') && !line.includes('import.meta.env')) {
      results.hardcodedSecrets.count++;
      results.hardcodedSecrets.items.push({
        file,
        line: idx + 1,
        type: 'PASSWORD',
        snippet: line.trim().substring(0, 80)
      });
    }
  });

  // Debug logs (production risk)
  const debugLogs = content.match(DEBUG_LOG_RE);
  if (debugLogs && !file.includes('.test.') && !file.includes('.stories.')) {
    results.debugLogsInProd.count += debugLogs.length;
    results.debugLogsInProd.files.push({ file, count: debugLogs.length });
  }

  // Dangerous HTML
  const dangerousHtml = content.match(DANGEROUS_HTML_RE);
  if (dangerousHtml) {
    results.dangerousHtml.count += dangerousHtml.length;
    lines.forEach((line, idx) => {
      if (DANGEROUS_HTML_RE.test(line)) {
        results.dangerousHtml.items.push({
          file,
          line: idx + 1,
          snippet: line.trim().substring(0, 80)
        });
      }
    });
  }

  // Eval usage
  const evalUsage = content.match(EVAL_RE);
  if (evalUsage) {
    results.unsafePatterns.count += evalUsage.length;
    lines.forEach((line, idx) => {
      if (EVAL_RE.test(line)) {
        results.unsafePatterns.items.push({
          file,
          line: idx + 1,
          type: 'EVAL',
          snippet: line.trim().substring(0, 80)
        });
      }
    });
  }

  // Check env var exposure in client code
  const envExposure = content.match(ENV_EXPOSE_RE);
  if (envExposure && !file.includes('vite.config') && !file.includes('.env')) {
    // Filter out safe patterns (VITE_ prefix is safe)
    const unsafeEnv = envExposure.filter(e => !e.includes('VITE_') && !e.includes('MODE') && !e.includes('DEV') && !e.includes('PROD'));
    if (unsafeEnv.length > 0) {
      results.envVarExposure.count += unsafeEnv.length;
      results.envVarExposure.items.push({
        file,
        count: unsafeEnv.length,
        vars: unsafeEnv
      });
    }
  }
}

// Sort by count
results.debugLogsInProd.files.sort((a, b) => b.count - a.count);

// Security score
const criticalIssues = {
  hardcodedSecrets: results.hardcodedSecrets.count * 50,
  evalUsage: results.unsafePatterns.items.filter(i => i.type === 'EVAL').length * 30,
  dangerousHtml: results.dangerousHtml.count * 10,
  envExposure: results.envVarExposure.count * 15,
  debugLogs: Math.min(results.debugLogsInProd.count / 10, 20),
};

const totalDeductions = Object.values(criticalIssues).reduce((a,b) => a+b, 0);
const securityScore = Math.max(0, 100 - totalDeductions);

results.summary = {
  securityScore: Math.round(securityScore),
  criticalIssues,
  grade: securityScore >= 90 ? 'A' : securityScore >= 75 ? 'B' : securityScore >= 60 ? 'C' : securityScore >= 45 ? 'D' : 'F',
  criticalCount: results.hardcodedSecrets.count + results.unsafePatterns.items.filter(i => i.type === 'EVAL').length,
  warnings: {
    hardcodedSecrets: results.hardcodedSecrets.count,
    debugLogs: results.debugLogsInProd.count,
    dangerousHtml: results.dangerousHtml.count,
    envExposure: results.envVarExposure.count,
    evalUsage: results.unsafePatterns.count,
  }
};

fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
console.log(`analyze_security: Score ${results.summary.securityScore}/100 (${results.summary.grade})`);
console.log(`  - Critical issues: ${results.summary.criticalCount}`);
console.log(`  - Hardcoded secrets: ${results.hardcodedSecrets.count}`);
console.log(`  - Debug logs: ${results.debugLogsInProd.count}`);
console.log(`  - Dangerous HTML: ${results.dangerousHtml.count}`);
console.log(`  - Eval usage: ${results.unsafePatterns.count}`);
