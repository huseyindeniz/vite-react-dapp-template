---
name: security-audit
description: Security vulnerability analysis to detect hardcoded secrets, dangerous patterns, and unsafe code practices.
---

# Purpose

Analyze **security vulnerabilities** in your codebase to ensure:
- No hardcoded secrets (API keys, passwords, tokens)
- No eval() usage (code injection risk)
- No dangerous HTML patterns (XSS risk)
- Safe environment variable exposure (VITE_ prefix only)

# Security Checks

## 1. Hardcoded Secrets Check

**Rule:** Never hardcode secrets in source code. Use environment variables.

**Detects:**
- API keys / access tokens
- Passwords
- Secret keys

**Violations:**
```typescript
// ❌ WRONG - Hardcoded API key
const API_KEY = "sk_live_1234567890abcdef";
const password = "mypassword123";

// ✅ CORRECT - Use environment variables
const API_KEY = import.meta.env.VITE_API_KEY;
const password = process.env.PASSWORD; // Server-side only
```

**Fix:**
1. Move secrets to .env file
2. Use import.meta.env.VITE_* for client-safe values
3. Never commit .env to version control

**Check:** `check_hardcoded_secrets.mjs`

## 2. eval() Usage Check

**Rule:** Never use eval() - it's a major security risk.

**Security risks:**
- Code injection vulnerabilities
- XSS (Cross-Site Scripting) attacks
- Arbitrary code execution
- Performance issues

**Violations:**
```typescript
// ❌ WRONG - eval() is dangerous
const result = eval(userInput);
eval("alert('XSS')");

// ✅ CORRECT - Use safe alternatives
const result = JSON.parse(jsonString);
const func = new Function('return ' + code)(); // Still risky, use carefully
```

**Fix:**
- Replace with JSON.parse() for JSON data
- Use direct function calls
- Use template literals
- If dynamic code is required, use sandboxed environment

**Check:** `check_eval_usage.mjs`

## 3. Dangerous HTML Patterns Check

**Rule:** Avoid dangerouslySetInnerHTML and innerHTML - they can cause XSS attacks.

**Security risks:**
- XSS (Cross-Site Scripting) vulnerabilities
- Malicious script injection
- DOM-based attacks

**Violations:**
```typescript
// ❌ WRONG - Direct HTML injection
element.innerHTML = userContent;
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ CORRECT - Use React rendering
<div>{content}</div>

// ✅ ACCEPTABLE - Sanitized HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHTML);
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

**Fix:**
- Use React's built-in rendering (safest)
- If HTML rendering required, sanitize with DOMPurify first
- Never trust user input

**Check:** `check_dangerous_html.mjs`

## 4. Environment Variable Exposure Check

**Rule:** Only expose environment variables prefixed with VITE_ to client code.

**Safe variables:**
- `import.meta.env.VITE_*` - Explicitly safe for client
- `import.meta.env.MODE` - Vite built-in
- `import.meta.env.DEV` - Vite built-in
- `import.meta.env.PROD` - Vite built-in

**Violations:**
```typescript
// ❌ WRONG - Exposing non-VITE_ variable to client
const secret = import.meta.env.API_SECRET;
const key = import.meta.env.DATABASE_URL;

// ✅ CORRECT - Use VITE_ prefix for client-safe values
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

**Fix:**
1. Rename variables to start with VITE_ prefix (if safe to expose)
2. If variable contains secrets, keep it server-side only
3. Use server-side API endpoints for sensitive operations

**Check:** `check_env_exposure.mjs`

# Running Checks

## Run All Checks

```bash
node ./.claude/skills/security-audit/scripts/run_all_checks.mjs
```

## Run Individual Checks

```bash
# Hardcoded secrets check
node ./.claude/skills/security-audit/scripts/check_hardcoded_secrets.mjs

# eval() usage check
node ./.claude/skills/security-audit/scripts/check_eval_usage.mjs

# Dangerous HTML patterns check
node ./.claude/skills/security-audit/scripts/check_dangerous_html.mjs

# Environment variable exposure check
node ./.claude/skills/security-audit/scripts/check_env_exposure.mjs
```

# Generating Reports (Optional)

To save a comprehensive markdown report of all checks:

```bash
node ./.claude/skills/security-audit/scripts/generate_report.mjs
```

**Output:** `reports/{YYYY-MM-DD_HH-MM}/security-audit-report.md`

**Report includes:**
- Executive summary with pass/fail counts
- Results table for all checks
- Detailed violations for failed checks (collapsible)
- Summary of passed checks
- Security principles verified
- Prioritized recommendations

**Environment variable:**
```bash
# Custom report directory
export REPORT_DIR="reports/my-custom-timestamp"
node ./.claude/skills/security-audit/scripts/generate_report.mjs
```

**Usage patterns:**

```bash
# Option 1: Console output only (default)
node ./.claude/skills/security-audit/scripts/run_all_checks.mjs

# Option 2: Console output + Save report
node ./.claude/skills/security-audit/scripts/generate_report.mjs

# Option 3: Specific check only
node ./.claude/skills/security-audit/scripts/check_hardcoded_secrets.mjs
```

**Report structure:**
```
reports/
└── 2025-11-01_14-30/               # Includes hours and minutes for multiple runs per day
    ├── security-audit-report.md    # This skill's report
    ├── code-audit-report.md        # Code quality audit (separate)
    ├── arch-audit-report.md        # Architecture audit (separate)
    └── ...                         # Other reports
```

# Output Format

Each check produces:
- Clear violation report with file paths and line numbers
- Code snippets showing the issue
- Explanation of security risks
- Suggested fixes with examples
- Summary with violation count
- Exit code 0 (success) or 1 (failures)

Example output:
```
Hardcoded Secrets Check
================================================================================

Rule: Never hardcode secrets (API keys, passwords, tokens) in source code

Violations
--------------------------------------------------------------------------------

❌ Found 2 hardcoded secret(s)

  API_KEY (1 occurrence(s)):
    File: src/services/api.ts:15
    Snippet: const API_KEY = "sk_live_1234567890abcdef";

  PASSWORD (1 occurrence(s)):
    File: src/config/database.ts:8
    Snippet: password: "mypassword123"

Fix:
  1. Move secrets to environment variables
  2. Use .env file for local development (never commit .env!)
  3. Use process.env.API_KEY or import.meta.env.VITE_API_KEY

================================================================================
Summary: 2 violation(s)
```

# Security Benefits

## Defense in Depth
- Multiple layers of security checks
- Catches common vulnerabilities early
- Prevents security issues before production

## OWASP Top 10 Coverage
- **A03: Injection** - Detects eval() and SQL injection risks
- **A07: XSS** - Detects dangerous HTML patterns
- **A05: Security Misconfiguration** - Detects exposed secrets

## Secure Development
- Enforces security best practices
- Educates team on security risks
- Catches vulnerabilities in CI/CD pipeline

## Compliance
- Helps meet security audit requirements
- Provides evidence of security practices
- Tracks security improvements over time

# Tools

- **Bash**: Run Node.js check scripts
- **Read**: Read source files (if manual inspection needed)
- **Write**: `reports/{timestamp}/security-audit-report.md` (only when generating reports)

# Safety

- Read-only operations (unless generating reports)
- No source file modifications
- No external network calls
- Comprehensive vulnerability analysis
- Each check is isolated and focused
- Reports are saved to isolated `reports/` directory
