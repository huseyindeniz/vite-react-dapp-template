---
name: deps-audit
description: Dependency health analysis to detect outdated packages and unused dependencies.
---

# Purpose

Analyze **dependency health** in your project to ensure:
- Dependencies are up-to-date (minor versions)
- No unused dependencies bloating node_modules
- Clean and maintainable package.json
- Reduced security vulnerabilities

# Dependency Checks

## 1. Outdated Dependencies Check

**Rule:** Keep dependencies up-to-date to get security patches, bug fixes, and improvements.

**Detects:**
- Packages with available minor version updates
- Both production and dev dependencies
- Percentage of outdated packages

**How it works:**
- Uses `npm-check-updates` to check for available updates
- Targets minor versions (e.g., 1.2.0 → 1.3.0, not 1.x → 2.x)
- Safe updates that shouldn't break compatibility

**Example Output:**
```
Outdated Packages
--------------------------------------------------------------------------------

⚠️  Found 5 outdated package(s) (12% of total)

  Production Dependencies (2):
    react: ^18.2.0 → ^18.3.0
    axios: ^1.4.0 → ^1.7.0

  Dev Dependencies (3):
    vitest: ^1.0.0 → ^1.5.0
    typescript: ^5.2.0 → ^5.4.0
    eslint: ^8.50.0 → ^8.57.0
```

**Benefits of updating:**
- Security vulnerability patches
- Bug fixes
- Performance improvements
- New features
- Reduced technical debt

**Recommendations:**
1. Review release notes before updating
2. Update dev dependencies first (lower risk)
3. Run tests after updating
4. Consider using `deps-minor` skill for safe automated updates

**Threshold:** Fails if more than 20% of packages are outdated

**Check:** `check_outdated_deps.mjs`

## 2. Unused Dependencies Check

**Rule:** Remove unused dependencies to keep node_modules clean and secure.

**Detects:**
- Dependencies not found in import statements
- Both production and dev dependencies
- Heuristic-based detection

**How it works:**
- Scans all source files for import statements
- Extracts imported package names
- Compares with package.json dependencies
- Excludes known build tools and CLI packages

**Example Output:**
```
Potentially Unused Dependencies
--------------------------------------------------------------------------------

⚠️  Found 3 potentially unused dependencies (8%)

  Production Dependencies (1):
    lodash

  Dev Dependencies (2):
    jest
    webpack
```

**Important Warnings:**
- **HEURISTIC CHECK** - may have false positives
- Verify before removing any package
- May miss:
  - Packages used only in config files
  - Transitive dependencies
  - Type-only packages (@types/*)
  - Build script dependencies

**Verification Steps:**
1. Search codebase: `grep -r "package-name" src/`
2. Check config files (vite.config.ts, tsconfig.json, etc.)
3. Check if it's a peer dependency
4. If truly unused: `npm uninstall package-name`

**Benefits of removal:**
- Smaller node_modules (faster installs)
- Reduced security surface area
- Cleaner package.json
- Lower maintenance burden

**Threshold:** Fails if more than 10% of dependencies appear unused

**Check:** `check_unused_deps.mjs`

# Running Checks

## Run All Checks

```bash
node ./.claude/skills/deps-audit/scripts/run_all_checks.mjs
```

## Run Individual Checks

```bash
# Outdated dependencies check
node ./.claude/skills/deps-audit/scripts/check_outdated_deps.mjs

# Unused dependencies check
node ./.claude/skills/deps-audit/scripts/check_unused_deps.mjs
```

# Generating Reports (Optional)

To save a comprehensive markdown report of all checks:

```bash
node ./.claude/skills/deps-audit/scripts/generate_report.mjs
```

**Output:** `reports/{YYYY-MM-DD_HH-MM}/deps-audit-report.md`

**Report includes:**
- Executive summary with pass/fail counts
- Results table for all checks
- Detailed lists of outdated and unused packages
- Summary of passed checks
- Dependency management principles
- Prioritized recommendations

**Environment variable:**
```bash
# Custom report directory
export REPORT_DIR="reports/my-custom-timestamp"
node ./.claude/skills/deps-audit/scripts/generate_report.mjs
```

**Usage patterns:**

```bash
# Option 1: Console output only (default)
node ./.claude/skills/deps-audit/scripts/run_all_checks.mjs

# Option 2: Console output + Save report
node ./.claude/skills/deps-audit/scripts/generate_report.mjs

# Option 3: Specific check only
node ./.claude/skills/deps-audit/scripts/check_outdated_deps.mjs
```

**Report structure:**
```
reports/
└── 2025-11-01_14-30/               # Includes hours and minutes for multiple runs per day
    ├── deps-audit-report.md        # This skill's report
    ├── security-audit-report.md    # Security audit (separate)
    ├── test-audit-report.md        # Test audit (separate)
    ├── code-audit-report.md        # Code quality audit (separate)
    ├── arch-audit-report.md        # Architecture audit (separate)
    └── ...                         # Other reports
```

# Output Format

Each check produces:
- Clear package lists with current and available versions
- Percentage of affected packages
- Actionable recommendations
- Update commands
- Summary with metrics
- Exit code 0 (success) or 1 (failures)

Example output:
```
Outdated Dependencies Check
================================================================================

Total packages: 42

Running npm-check-updates (this may take a moment)...

Outdated Packages
--------------------------------------------------------------------------------

⚠️  Found 5 outdated package(s) (12% of total)

  Production Dependencies (2):
    react: ^18.2.0 → ^18.3.0
    axios: ^1.4.0 → ^1.7.0

Update commands:
  # Update specific package
  npm install package-name@latest

  # Update all minor versions (use with caution)
  npx npm-check-updates -u --target minor && npm install

================================================================================
Summary: 5 outdated package(s) (12%)
```

# Dependency Management Benefits

## Security
- Outdated packages may have known vulnerabilities
- Regular updates reduce security risks
- Proactive security posture

## Maintainability
- Smaller, cleaner dependency tree
- Easier to understand project dependencies
- Less technical debt

## Performance
- Bug fixes and optimizations in newer versions
- Faster installs with fewer packages
- Smaller bundle sizes

## Developer Experience
- Access to latest features
- Better documentation
- Active community support

# Integration with Other Skills

## deps-minor Skill
- Automated safe minor version updates
- Validates with lint/test/build
- Automatic rollback on failure
- Use after identifying outdated packages

## security-audit Skill
- Checks for hardcoded secrets
- Complements dependency security
- Together provide comprehensive security analysis

## Combined Analysis
Run all audit skills for complete health check:
```bash
# Security vulnerabilities
node ./.claude/skills/security-audit/scripts/run_all_checks.mjs

# Test coverage
node ./.claude/skills/test-audit/scripts/run_all_checks.mjs

# Dependency health
node ./.claude/skills/deps-audit/scripts/run_all_checks.mjs

# Code quality
node ./.claude/skills/code-audit/scripts/run_all_checks.mjs

# Architecture patterns
node ./.claude/skills/arch-audit/scripts/run_all_checks.mjs
```

# Limitations

## Outdated Check
- Only checks minor versions (not major)
- Requires npm-check-updates (auto-installed with npx)
- Requires network access
- Release notes review still needed

## Unused Check
- Heuristic-based (may have false positives)
- Doesn't analyze config files thoroughly
- Doesn't track transitive dependencies
- May miss indirect usage patterns

## Recommendations
- Always verify before removing packages
- Read release notes before updating
- Run tests after dependency changes
- Use version control to track changes

# Tools

- **Bash**: Run Node.js check scripts and npm-check-updates
- **Read**: Read package.json and source files
- **Write**: `reports/{timestamp}/deps-audit-report.md` (only when generating reports)

# Safety

- Read-only operations (unless generating reports)
- No automatic package installations or removals
- No package.json modifications
- Network call only for npm-check-updates
- Comprehensive dependency analysis
- Each check is isolated and focused
- Reports are saved to isolated `reports/` directory
