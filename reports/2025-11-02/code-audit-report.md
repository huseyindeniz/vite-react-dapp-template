# Code Audit Report

**Generated:** 2025-11-02T09:26:26.045Z
**Project:** vite-react-dapp-template

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Checks** | 11 |
| **Passed** | ✅ 7 |
| **Failed** | ❌ 4 |
| **Success Rate** | 64% |

## Results by Check

| Check | Status | Summary |
|-------|--------|---------|
| Import Quality | ✅ PASSED | Check output |
| Export Quality | ✅ PASSED | Index files: 0, Default exports: 0 |
| Redux Abstraction | ✅ PASSED | useDispatch: 0, RootState: 0, useSelector: 0 |
| Service Import Boundaries | ❌ FAILED | Check output |
| i18n Coverage | ✅ PASSED | Check output |
| TypeScript "any" Usage | ❌ FAILED | 2 violation(s) |
| Linter/TypeScript Suppressions | ❌ FAILED | 2 total (Critical: 0, High: 2) |
| God Files (1 Entity Per File) | ✅ PASSED | 0 file(s), 0 entities to split |
| TODO/FIXME/HACK Comments | ❌ FAILED | 15 marker(s) |
| Console Usage | ✅ PASSED | No console usage |
| Redux Saga Patterns | ✅ PASSED | See details |

## Failed Checks (Detailed)

### ❌ Service Import Boundaries

**Summary:** Check output

<details>
<summary>View Details</summary>

```
Service Import Check (Dependency Injection Pattern)
================================================================================

Scanning 324 files in src/...

Service Import Violations
--------------------------------------------------------------------------------

❌ Found 2 service import violation(s)

  ❌ src/features/chat/runtime/useChatRuntime.ts (2 violation(s))
     Line 6: import { GoogleADKChatModelAdapter } from '@/services/chat/GoogleADKChatModelAdapter';
     Import: @/services/chat/GoogleADKChatModelAdapter
     Line 7: import { LangGraphChatModelAdapter } from '@/services/chat/LangGraphChatModelAdapter';
     Import: @/services/chat/LangGraphChatModelAdapter
     Rule: Services must ONLY be imported in src/features/app/config/services.ts
     Fix: Use dependency injection - receive service through interface

================================================================================
Summary

Service import violations: 2

❌ Service import violations found.

Dependency Injection Pattern:
  - Services are ONLY imported in: src/features/app/config/services.ts
  - Features receive services through interfaces (IFeatureApi)
  - This allows easy service swapping and testing

Why this matters:
  - Features don't depend on concrete service implementations
  - Easy to swap implementations (EthersV5 → EthersV6)
  - Easy to test (mock interfaces)
  - Clear separation of concerns
```

</details>

---

### ❌ TypeScript "any" Usage

**Summary:** 2 violation(s)

<details>
<summary>View Details</summary>

```
React TypeScript "any" Usage Check
================================================================================

Scanning 324 TypeScript files in src/...

TypeScript "any" Type Violations
--------------------------------------------------------------------------------

❌ Found 2 usage(s) of "any" type

  ❌ src/features/app/composeContextProviders.tsx (1 violation(s))
     Line 9: export const composeProviders = <TProviders extends Array<Provider<any>>>(
     Type: <any> (generic type)
     Rule: Never use "any" type - it defeats TypeScript's type safety
     Fix: Use proper types, generics, or "unknown" for truly dynamic types

  ❌ src/services/ethersV6/wallet/WalletAPI.ts (1 violation(s))
     Line 78: private _identifyWallet = (p: any) => {
     Type: : any (type annotation)
     Rule: Never use "any" type - it defeats TypeScript's type safety
     Fix: Use proper types, generics, or "unknown" for truly dynamic types

================================================================================
Summary

"any" type usages: 2 violation(s)

❌ "any" type violations found.

Why this matters:
  - "any" disables TypeScript type checking
  - Leads to runtime errors that could be caught at compile time
  - Makes refactoring dangerous and error-prone
  - Reduces code maintainability and documentation

Better alternatives:
  - Use specific types: string, number, MyInterface, etc.
  - Use generics: <T> for reusable type-safe code
  - Use "unknown" for truly dynamic types (forces type checking)
  - Use union types: string | number | null
  - Use conditional types for complex scenarios
```

</details>

---

### ❌ Linter/TypeScript Suppressions

**Summary:** 2 total (Critical: 0, High: 2)

<details>
<summary>View Details</summary>

```
React Linter/TypeScript Suppression Check
================================================================================

Scanning 324 files in src/...

Linter/TypeScript Suppression Violations
--------------------------------------------------------------------------------

❌ Found 2 suppression comment(s)

⚠️  HIGH SEVERITY VIOLATIONS (2)
--------------------------------------------------------------------------------
  ❌ src/features/app/composeContextProviders.tsx (1 suppression(s))
     Line 8: // eslint-disable-next-line @typescript-eslint/no-explicit-any
     Type: eslint-disable-next-line
     Rule: Never suppress linter or TypeScript errors
     Fix: Address the underlying issue instead of suppressing it

  ❌ src/services/ethersV6/wallet/WalletAPI.ts (1 suppression(s))
     Line 77: // eslint-disable-next-line @typescript-eslint/no-explicit-any
     Type: eslint-disable-next-line
     Rule: Never suppress linter or TypeScript errors
     Fix: Address the underlying issue instead of suppressing it

================================================================================
Summary

Total suppressions: 2
  Critical: 0
  High: 2
  Medium: 0
  Low: 0

❌ Suppression violations found.

Why this matters:
  - Suppressions hide real problems in the code
  - @ts-ignore and eslint-disable mask type errors and code quality issues
  - They accumulate technical debt
  - Make code harder to maintain and refactor

Better approach:
  - Fix the underlying issue instead of suppressing it
  - If truly necessary, use @ts-expect-error with a comment explaining why
  - @ts-expect-error is better than @ts-ignore (fails if error is fixed)
  - Document WHY the suppression is needed
```

</details>

---

### ❌ TODO/FIXME/HACK Comments

**Summary:** 15 marker(s)

<details>
<summary>View Details</summary>

```
Code Quality Check: TODO Comments
================================================================================

Scanning for TODO/FIXME/HACK comments (technical debt tracking)...

Technical Debt Markers
--------------------------------------------------------------------------------

❌ Found 15 technical debt marker(s)

By Type:
  - TODO:  15 (planned features/improvements)
  - FIXME: 0 (bugs to fix)
  - HACK:  0 (temporary workarounds)
  - Other: 0 (XXX, BUG, etc.)

🔵 Info: TODO Comments (Planned Work)
--------------------------------------------------------------------------------

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:57
  → // TODO: check plain step icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:78
  → // TODO: check error icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:100
  → // TODO: check loading icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:126
  → // TODO: check plain step icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:147
  → // TODO: check error icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:169
  → // TODO: check loading icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:196
  → // TODO: check plain step icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:217
  → // TODO: check error icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:239
  → // TODO: check loading icon

  src\features\wallet\components\ConnectionModal\Modal\Modal.test.tsx:266
  → // TODO: check plain step icon

  ...and 5 more TODO(s)

--------------------------------------------------------------------------------
Summary: 15 technical debt marker(s) found

Recommendation:
  1. Create GitHub issues for FIXME and HACK items
  2. Convert TODO comments to tracked work items
  3. Remove comments after completing the work
```

</details>

---

## Passed Checks

- ✅ **Import Quality** - Check output
- ✅ **Export Quality** - Index files: 0, Default exports: 0
- ✅ **Redux Abstraction** - useDispatch: 0, RootState: 0, useSelector: 0
- ✅ **i18n Coverage** - Check output
- ✅ **God Files (1 Entity Per File)** - 0 file(s), 0 entities to split
- ✅ **Console Usage** - No console usage
- ✅ **Redux Saga Patterns** - No violations found

## Recommendations

### Priority Actions

1. **Service Import Boundaries**: Check output
   - Run: `node ./.claude/skills/code-audit/scripts/service_import_boundaries.mjs`
   - See detailed output above for specific violations

2. **TypeScript "any" Usage**: 2 violation(s)
   - Run: `node ./.claude/skills/code-audit/scripts/typescript__any__usage.mjs`
   - See detailed output above for specific violations

3. **Linter/TypeScript Suppressions**: 2 total (Critical: 0, High: 2)
   - Run: `node ./.claude/skills/code-audit/scripts/linter_typescript_suppressions.mjs`
   - See detailed output above for specific violations

4. **TODO/FIXME/HACK Comments**: 15 marker(s)
   - Run: `node ./.claude/skills/code-audit/scripts/todo_fixme_hack_comments.mjs`
   - See detailed output above for specific violations

## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run `code-audit` after fixes to verify improvements
4. Consider running `arch-audit` for architecture-level checks

---

*Generated by code-audit skill*
