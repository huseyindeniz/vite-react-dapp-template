---
name: test-audit
description: Test coverage analysis to ensure adequate testing, Storybook coverage, and test quality.
---

# Purpose

Analyze **test coverage** in your codebase to ensure:
- Adequate test files for business logic (60%+ baseline)
- Storybook stories for UI components (40%+ baseline)
- No incomplete tests (TODO/FIXME/HACK comments)
- Clean test infrastructure

# Testing Checks

## 1. Test Coverage Check

**Rule:** Maintain at least 60% test coverage baseline for business logic.

**Analyzes:**
- Total source files vs test files
- Coverage estimate based on file naming
- Untested files list
- Test ratio percentage

**Coverage Calculation:**
- Looks for `.test.ts(x)` or `.spec.ts(x)` files
- Matches test files to source files by naming convention
- Estimates coverage (heuristic, not actual line coverage)

**Example:**
```
Coverage Summary
--------------------------------------------------------------------------------

Total source files:  150
Test files:          95 (63%)
Story files:         45 (30%)
Tested files:        105
Untested files:      45
Coverage estimate:   ~70%

✅ Test coverage is 70% (>= 60% threshold)
```

**Recommendations:**
- Add `.test.ts(x)` files for business logic
- Focus on critical paths first (auth, payments, etc.)
- Run actual test runner (vitest, jest) for precise coverage

**Check:** `check_test_coverage.mjs`

## 2. Storybook Coverage Check

**Rule:** Maintain at least 40% story coverage for UI components.

**Analyzes:**
- Total component files vs story files
- Components without stories
- Story coverage percentage

**Detection:**
- Looks for files in `components/` or `ui/` directories
- Matches `.stories.ts(x)` files to components
- Calculates story coverage ratio

**Example:**
```
Story Coverage Summary
--------------------------------------------------------------------------------

Total components:          60
Story files:               28
Components without stories: 32
Story coverage:            ~47%

✅ Story coverage is 47% (>= 40% threshold)
```

**Benefits of Storybook:**
- Component documentation
- Visual testing and debugging
- Isolated component development
- Design system showcase

**Recommendations:**
- Add `.stories.ts(x)` for reusable UI components
- Focus on design system components first
- Document props, variants, and states

**Check:** `check_story_coverage.mjs`

## 3. Test TODOs Check

**Rule:** Test files should not contain TODO/FIXME/HACK comments.

**Why:** Incomplete tests indicate gaps in coverage and technical debt.

**Detects:**
- TODO comments (incomplete tests)
- FIXME comments (broken/flaky tests)
- HACK comments (technical debt)

**Violations:**
```typescript
// ❌ WRONG - TODO in test file
test('should handle edge case', () => {
  // TODO: Implement this test
});

// ❌ WRONG - FIXME indicates broken test
test('should update user', () => {
  // FIXME: This test is flaky
});

// ✅ CORRECT - Complete tests only
test('should handle edge case', () => {
  const result = handleEdgeCase(input);
  expect(result).toBe(expected);
});

// ✅ CORRECT - Use test.skip for intentionally skipped tests
test.skip('should handle future feature', () => {
  // Test for future implementation
});
```

**Impact:**
- TODO = incomplete test coverage
- FIXME = known failing/flaky tests
- HACK = technical debt in test infrastructure

**Recommendations:**
- Complete TODOs before merging
- Fix FIXMEs immediately
- Refactor HACKs
- Use test.skip() for intentionally skipped tests

**Check:** `check_test_todos.mjs`

# Running Checks

## Run All Checks

```bash
node ./.claude/skills/test-audit/scripts/run_all_checks.mjs
```

## Run Individual Checks

```bash
# Test coverage check
node ./.claude/skills/test-audit/scripts/check_test_coverage.mjs

# Storybook coverage check
node ./.claude/skills/test-audit/scripts/check_story_coverage.mjs

# Test TODOs check
node ./.claude/skills/test-audit/scripts/check_test_todos.mjs
```

# Generating Reports (Optional)

To save a comprehensive markdown report of all checks:

```bash
node ./.claude/skills/test-audit/scripts/generate_report.mjs
```

**Output:** `reports/{YYYY-MM-DD_HH-MM}/test-audit-report.md`

**Report includes:**
- Executive summary with pass/fail counts
- Results table for all checks
- Detailed results for failed checks (collapsible)
- Summary of passed checks
- Testing principles verified
- Prioritized recommendations

**Environment variable:**
```bash
# Custom report directory
export REPORT_DIR="reports/my-custom-timestamp"
node ./.claude/skills/test-audit/scripts/generate_report.mjs
```

**Usage patterns:**

```bash
# Option 1: Console output only (default)
node ./.claude/skills/test-audit/scripts/run_all_checks.mjs

# Option 2: Console output + Save report
node ./.claude/skills/test-audit/scripts/generate_report.mjs

# Option 3: Specific check only
node ./.claude/skills/test-audit/scripts/check_test_coverage.mjs
```

**Report structure:**
```
reports/
└── 2025-11-01_14-30/               # Includes hours and minutes for multiple runs per day
    ├── test-audit-report.md        # This skill's report
    ├── security-audit-report.md    # Security audit (separate)
    ├── code-audit-report.md        # Code quality audit (separate)
    ├── arch-audit-report.md        # Architecture audit (separate)
    └── ...                         # Other reports
```

# Output Format

Each check produces:
- Clear coverage analysis with percentages
- List of untested files or components
- Recommendations for improvement
- Summary with metrics
- Exit code 0 (success) or 1 (failures)

Example output:
```
Test Coverage Check
================================================================================

Coverage Summary
--------------------------------------------------------------------------------

Total source files:  150
Test files:          95 (63%)
Story files:         45 (30%)
Tested files:        105
Untested files:      45
Coverage estimate:   ~70%

✅ Test coverage is 70% (>= 60% threshold)

================================================================================
Summary: Coverage at 70%
```

# Testing Benefits

## Quality Assurance
- Catch bugs before production
- Verify business logic correctness
- Prevent regressions

## Confidence
- Safe refactoring
- Reliable deployments
- Team confidence in changes

## Documentation
- Tests as living documentation
- Storybook as component catalog
- Clear usage examples

## Maintainability
- Easier to understand codebase
- Faster onboarding for new developers
- Lower maintenance costs

# Limitations

## Heuristic-Based
- Coverage estimate is based on file naming
- Not actual line/branch coverage
- Run vitest/jest for precise metrics

## False Positives
- Integration tests may not match file names
- Utility functions in multiple files
- Generated code

## Recommendations
- Use this for quick health checks
- Run actual test runner for accurate coverage
- Combine with code-audit and arch-audit for complete analysis

# Tools

- **Bash**: Run Node.js check scripts
- **Read**: Read source files (if manual inspection needed)
- **Write**: `reports/{timestamp}/test-audit-report.md` (only when generating reports)

# Safety

- Read-only operations (unless generating reports)
- No source file modifications
- No external network calls
- Comprehensive coverage analysis
- Each check is isolated and focused
- Reports are saved to isolated `reports/` directory
