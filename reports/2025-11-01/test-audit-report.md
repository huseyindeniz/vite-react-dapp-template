# Test Audit Report

**Generated:** 2025-11-01T17:01:30.455Z
**Project:** vite-react-dapp-template

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Checks** | 3 |
| **Passed** | ✅ 0 |
| **Failed** | ❌ 3 |
| **Success Rate** | 0% |

## Results by Check

| Check | Status | Summary |
|-------|--------|---------|
| Test Coverage | ❌ FAILED | See details |
| Storybook Coverage | ❌ FAILED | See details |
| Test TODOs | ❌ FAILED | 15 TODO(s) |

## Failed Checks (Detailed)

### ❌ Test Coverage

**Summary:** See details

<details>
<summary>View Details</summary>

```
================================================================================
Test Coverage Check
================================================================================

Running test coverage (this may take a moment)...


Coverage command output:

> vitedapp@0.9.1 coverage
> vitest run --coverage


 RUN  v4.0.4 D:/github/vite-react-dapp-template
      Coverage enabled with v8

 ✓ src/features/ui/mantine/components/ErrorFallback/ErrorFallback.test.tsx (1 test) 526ms
       ✓ should be visible and show error message  520ms
 ✓ src/features/ui/mantine/components/CookieConsent/CookieConsentMessage.test.tsx (2 tests) 800ms
       ✓ should render with default props  528ms
 ✓ src/features/wallet/components/ConnectionModal/CheckAccount/CheckAccount.test.tsx (6 tests) 1171ms
         ✓ should be visible and show error  389ms
         ✓ should be visible and show error  311ms
 ❯ src/features/wallet/components/WalletProtectionWarning/WalletProtectionWarning.test.tsx (1 test | 1 failed) 202ms
         × should be visible and clickable 198ms
 ✓ src/features/wallet/components/ConnectButton/ConnectButton.test.tsx (1 test) 369ms
       ✓ should be visible and enabled  364ms
 ✓ src/features/wallet/components/ConnectionModal/CheckSign/CheckSign.test.tsx (6 tests) 1249ms
         ✓ should be visible and show info  371ms
 ✓ src/features/wallet/components/ConnectionModal/CheckNetwork/CheckNetwork.test.tsx (6 tests) 2602ms
         ✓ should be visible and show error  413ms
         ✓ should be visible and show error  868ms
         ✓ should be visible and show error  642ms
 ✓ src/features/wallet/models/account/actionEffects/signIn.test.ts (6 tests | 4 skipped) 41ms
 ✓ src/pages/Home/Home.test.tsx (1 test) 293ms
 ✓ src/features/ui/mantine/components/SocialMenu/SocialMenu.test.tsx (1 test) 160ms
 ✓ src/features/ui/mantine/components/PageMeta/PageMeta.test.tsx (1 test) 181ms
 ✓ src/features/wallet/components/ConnectionModal/Modal/Modal.test.tsx (14 tests | 13 skipped) 174ms
 ✓ src/features/ui/mantine/components/PageLoding/PageLoading.test.tsx (1 test) 119ms
 ✓ src/features/wallet/components/Wallet.test.tsx (1 test) 183ms
 ✓ src/features/wallet/models/account/actionEffects/unlockWallet.test.ts (6 tests) 28ms
 ✓ src/features/wallet/models/network/actionEffects/loadNetwork.test.ts (4 tests) 25ms
 ✓ src/features/wallet/models/account/actionEffects/loadAccount.test.ts (4 tests) 19ms
 ✓ src/features/wallet/models/account/actionEffects/disconnectWallet.test.ts (2 tests) 19ms
 ✓ src/features/wallet/models/network/actionEffects/switchNetwork.test.ts (6 tests) 26ms
 ✓ src/features/wallet/models/network/actionEffects/latestBlock.test.ts (2 tests) 19ms
 ✓ src/features/wallet/models/account/slice.test.ts (7 tests) 16ms
 ✓ src/features/wallet/models/network/slice.test.ts (5 tests) 10ms
 ✓ src/features/wallet/models/provider/slice.test.ts (2 tests) 14ms
 ↓ src/features/router/hooks/usePageLink.test.tsx (2 tests | 2 skipped)
 ↓ src/features/wallet/models/provider/actionEffects/loadProvider.test.ts (5 tests | 5 skipped)
 ✓ src/features/i18n/useChangeLanguage.test.ts (6 tests | 1 skipped) 12ms
 ↓ src/pages/NotFound/NotFound.test.tsx (1 test | 1 skipped)

  Snapshots  1 obsolete
             ↳ src/features/wallet/components/WalletProtectionWarning/WalletProtectionWarning.test.tsx
               · Feature: Wallet > Component: ConnectButton/WalletProtectionWarning > Scenario: Default > should be visible and clickable 1

 Test Files  1 failed | 23 passed | 3 skipped (27)
      Tests  1 failed | 73 passed | 26 skipped (100)
   Start at  19:01:04
   Duration  25.42s (transform 4.61s, setup 8.41s, collect 56.77s, tests 8.26s, environment 58.62s, prepare 1.78s)



❌ Could not parse coverage output
```

</details>

---

### ❌ Storybook Coverage

**Summary:** See details

<details>
<summary>View Details</summary>

```
================================================================================
Storybook Coverage Check
================================================================================

Analyzing Storybook story files for UI components...

Story Coverage Summary
--------------------------------------------------------------------------------

Total components:         0
Story files:              13
Components without stories: 0
Story coverage:           ~0%

⚠️  Story coverage is 0% (< 40% threshold)

Recommendations:
  1. Add .stories.ts(x) files for reusable UI components
  2. Document component props, variants, and states
  3. Use Storybook for visual regression testing
  4. Focus on design system components first (buttons, inputs, etc.)

Benefits of Storybook:
  - Component documentation
  - Visual testing and debugging
  - Isolated component development
  - Design system showcase

================================================================================
Summary: Story coverage at 0% (target: 40%)
================================================================================
```

</details>

---

### ❌ Test TODOs

**Summary:** 15 TODO(s)

<details>
<summary>View Details</summary>

```
================================================================================
Test TODOs Check
================================================================================

Rule: Test files should not contain TODO/FIXME/HACK comments
Incomplete tests indicate gaps in test coverage

TODOs in Test Files
--------------------------------------------------------------------------------

⚠️  Found 15 TODO(s) in test files

  TODO (15 occurrence(s)):
    File: src\features\wallet\components\ConnectionModal\CheckNetwork\CheckNetwork.test.tsx:69
    Text: // TODO: check if network combobox exist with correct items

    File: src\features\wallet\components\ConnectionModal\CheckNetwork\CheckNetwork.test.tsx:107
    Text: // TODO: check if network combobox exist with correct items

    File: src\features\wallet\components\ConnectionModal\CheckSign\CheckSign.test.tsx:52
    Text: // TODO: check the signCounter if possible

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:57
    Text: // TODO: check plain step icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:78
    Text: // TODO: check error icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:100
    Text: // TODO: check loading icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:126
    Text: // TODO: check plain step icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:147
    Text: // TODO: check error icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:169
    Text: // TODO: check loading icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:196
    Text: // TODO: check plain step icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:217
    Text: // TODO: check error icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:239
    Text: // TODO: check loading icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:266
    Text: // TODO: check plain step icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:287
    Text: // TODO: check error icon

    File: src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:309
    Text: // TODO: check loading icon

Impact:
  - TODO in tests = incomplete test coverage
  - FIXME in tests = known failing or flaky tests
  - HACK in tests = technical debt in test infrastructure

Recommendations:
  1. Complete TODOs before merging to main branch
  2. Fix FIXMEs - they indicate broken or flaky tests
  3. Refactor HACKs - technical debt compounds over time
  4. If test is truly skipped, use test.skip() instead of TODO

================================================================================
Summary: 15 TODO(s) in test files
================================================================================
```

</details>

---

## Testing Principles Verified

This audit ensures the following testing practices:

### ✅ Test Coverage
- Adequate test files for business logic
- Reasonable baseline coverage (60%+)
- Critical paths tested

### ✅ Visual Testing
- Storybook stories for UI components
- Component documentation and examples
- Design system coverage

### ✅ Test Quality
- No incomplete tests (TODOs)
- Tests are maintained and up-to-date
- Test infrastructure is clean

## Recommendations

### Priority Actions

1. **Test Coverage**: See details
   - Run: `node ./.claude/skills/test-audit/scripts/test_coverage.mjs`
   - See detailed output above for specific gaps

2. **Storybook Coverage**: See details
   - Run: `node ./.claude/skills/test-audit/scripts/storybook_coverage.mjs`
   - See detailed output above for specific gaps

3. **Test TODOs**: 15 TODO(s)
   - Run: `node ./.claude/skills/test-audit/scripts/test_todos.mjs`
   - See detailed output above for specific gaps

## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed analysis
3. Re-run `test-audit` after improvements to verify progress
4. Run your test runner (vitest, jest) for accurate coverage metrics
5. Consider running `code-audit` and `arch-audit` for complete analysis

---

*Generated by test-audit skill*
