# Test Audit Report

**Generated:** 2025-11-01T20:00:24.391Z
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

 ✓ src/features/ui/mantine/components/ErrorFallback/ErrorFallback.test.tsx (1 test) 638ms
       ✓ should be visible and show error message  635ms
 ✓ src/features/ui/mantine/components/CookieConsent/CookieConsentMessage.test.tsx (2 tests) 899ms
       ✓ should render with default props  589ms
       ✓ should render with debug enabled  305ms
 ❯ src/features/wallet/components/ConnectionModal/CheckSign/CheckSign.test.tsx (6 tests | 6 failed) 20ms
         × should be empty 10ms
         × should be visible and show info 1ms
         × should be visible and show information 1ms
         × should be visible and show error 1ms
         × should be visible and show error 1ms
         × should be visible and show error 1ms
 ✓ src/features/wallet/components/ConnectionModal/CheckAccount/CheckAccount.test.tsx (6 tests) 1371ms
         ✓ should be visible and show error  442ms
         ✓ should be visible and show error  343ms
 ✓ src/features/wallet/components/ConnectButton/ConnectButton.test.tsx (1 test) 421ms
       ✓ should be visible and enabled  417ms
 ✓ src/features/wallet/components/WalletProtectionWarning/WalletProtectionWarning.test.tsx (1 test) 588ms
         ✓ should be visible and clickable  583ms
 ✓ src/features/wallet/components/ConnectionModal/CheckNetwork/CheckNetwork.test.tsx (6 tests) 2626ms
         ✓ should be visible and show error  353ms
         ✓ should be visible and show error  924ms
         ✓ should be visible and show error  751ms
 ✓ src/features/wallet/models/account/actionEffects/signIn.test.ts (6 tests | 4 skipped) 56ms
 ✓ src/pages/Home/Home.test.tsx (1 test) 295ms
 ✓ src/features/ui/mantine/components/SocialMenu/SocialMenu.test.tsx (1 test) 182ms
 ✓ src/features/wallet/components/ConnectionModal/Modal/Modal.test.tsx (14 tests | 13 skipped) 194ms
 ✓ src/features/ui/mantine/components/PageMeta/PageMeta.test.tsx (1 test) 179ms
 ✓ src/features/ui/mantine/components/PageLoding/PageLoading.test.tsx (1 test) 145ms
 ✓ src/features/wallet/models/network/actionEffects/loadNetwork.test.ts (4 tests) 40ms
 ✓ src/features/wallet/components/Wallet.test.tsx (1 test) 185ms
 ✓ src/features/wallet/models/account/actionEffects/unlockWallet.test.ts (6 tests) 26ms
 ✓ src/features/wallet/models/network/actionEffects/switchNetwork.test.ts (6 tests) 25ms
 ✓ src/features/wallet/models/network/actionEffects/latestBlock.test.ts (2 tests) 21ms
 ✓ src/features/wallet/models/account/actionEffects/loadAccount.test.ts (4 tests) 23ms
 ✓ src/features/wallet/models/account/actionEffects/disconnectWallet.test.ts (2 tests) 21ms
 ✓ src/features/wallet/models/account/slice.test.ts (7 tests) 16ms
 ✓ src/features/wallet/models/network/slice.test.ts (5 tests) 14ms
 ✓ src/features/wallet/models/provider/slice.test.ts (2 tests) 12ms
 ↓ src/features/router/hooks/usePageLink.test.tsx (2 tests | 2 skipped)
 ↓ src/features/wallet/models/provider/actionEffects/loadProvider.test.ts (5 tests | 5 skipped)
 ✓ src/features/i18n/useChangeLanguage.test.ts (6 tests | 1 skipped) 10ms
 ↓ src/pages/NotFound/NotFound.test.tsx (1 test | 1 skipped)

  Snapshots  5 obsolete
             ↳ src/features/wallet/components/ConnectionModal/CheckSign/CheckSign.test.tsx
               · Feature: Wallet > Component: ConnectionModal/Steps/CheckSign > Scenario: NotSigned > should be visible and show info 1
               · Feature: Wallet > Component: ConnectionModal/Steps/CheckSign > Scenario: SignFailed > should be visible and show error 1
               · Feature: Wallet > Component: ConnectionModal/Steps/CheckSign > Scenario: SignRejected > should be visible and show error 1
               · Feature: Wallet > Component: ConnectionModal/Steps/CheckSign > Scenario: SignRequested > should be visible and show information 1
               · Feature: Wallet > Component: ConnectionModal/Steps/CheckSign > Scenario: SignTimedOut > should be visible and show error 1

 Test Files  1 failed | 23 passed | 3 skipped (27)
      Tests  6 failed | 68 passed | 26 skipped (100)
   Start at  21:59:53
   Duration  29.16s (transform 6.24s, setup 8.18s, collect 69.92s, tests 8.01s, environment 65.43s, prepare 1.98s)



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
