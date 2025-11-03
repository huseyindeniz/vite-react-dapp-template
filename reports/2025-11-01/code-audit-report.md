# Code Audit Report

**Generated:** 2025-11-01T21:11:33.634Z
**Project:** vite-react-dapp-template

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Checks** | 11 |
| **Passed** | ✅ 3 |
| **Failed** | ❌ 8 |
| **Success Rate** | 27% |

## Results by Check

| Check | Status | Summary |
|-------|--------|---------|
| Import Quality | ❌ FAILED | 1 violation(s) |
| Export Quality | ❌ FAILED | Index files: 0, Default exports: 3 |
| Redux Abstraction | ✅ PASSED | useDispatch: 0, RootState: 0, useSelector: 0 |
| Service Import Boundaries | ❌ FAILED | Check output |
| i18n Coverage | ✅ PASSED | Check output |
| TypeScript "any" Usage | ❌ FAILED | 2 violation(s) |
| Linter/TypeScript Suppressions | ❌ FAILED | 4 total (Critical: 2, High: 2) |
| God Files (1 Entity Per File) | ❌ FAILED | 6 file(s), 17 entities to split |
| TODO/FIXME/HACK Comments | ❌ FAILED | 15 marker(s) |
| Console & Debug Logs | ❌ FAILED | 97 statement(s) |
| Redux Saga Patterns | ✅ PASSED | See details |

## Failed Checks (Detailed)

### ❌ Import Quality

**Summary:** 1 violation(s)

<details>
<summary>View Details</summary>

```
React Quality Check
================================================================================

Scanning 317 files in src/...

Path Alias Violations
--------------------------------------------------------------------------------

❌ Found 1 violation(s)

FROM: features/i18n

  ❌ src/features/i18n/useI18nWatchers.ts:6
     import { isHashRouter } from '../router/config'
     → Violates: Feature → Feature (cross-feature: i18n → router)
     Fix: import ... from '@/features/router/config'

--------------------------------------------------------------------------------
Summary: 1 violation(s) found

Rule: All imports to aliased directories (@/features, @/services, @/pages, @/hooks)
      must use absolute path aliases.
Exception: Internal imports within the same feature/page/service/hook are allowed.
```

</details>

---

### ❌ Export Quality

**Summary:** Index files: 0, Default exports: 3

<details>
<summary>View Details</summary>

```
React Export Quality Check
================================================================================

Scanning 317 files in src/...

1. Index File Violations
--------------------------------------------------------------------------------

✅ No index files found!

2. Default Export Violations
--------------------------------------------------------------------------------

❌ Found 3 default export(s)

  ⚠️ src/features/app/store/store.ts
     Line 63: export default store;
     Rule: Never use default exports
     Fix: Use named exports instead (export const ComponentName = ...)

  ⚠️ src/features/i18n/i18n.ts
     Line 37: export default i18n;
     Rule: Never use default exports
     Fix: Use named exports instead (export const ComponentName = ...)

  ⚠️ src/hooks/useTypedSelector.ts
     Line 7: export default useTypedSelector;
     Rule: Never use default exports
     Fix: Use named exports instead (export const ComponentName = ...)

================================================================================
Summary

Index files: 0 violation(s)
Default exports: 3 violation(s)

❌ Export quality violations found.

Rules:
  1. Never use index files (index.ts, index.tsx, etc.)
  2. Never use default exports (especially for components)
  3. Always use named exports
```

</details>

---

### ❌ Service Import Boundaries

**Summary:** Check output

<details>
<summary>View Details</summary>

```
Service Import Check (Dependency Injection Pattern)
================================================================================

Scanning 317 files in src/...

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

Scanning 317 TypeScript files in src/...

TypeScript "any" Type Violations
--------------------------------------------------------------------------------

❌ Found 2 usage(s) of "any" type

  ❌ src/features/app/composeContextProviders.tsx (1 violation(s))
     Line 9: export const composeProviders = <TProviders extends Array<Provider<any>>>(
     Type: <any> (generic type)
     Rule: Never use "any" type - it defeats TypeScript's type safety
     Fix: Use proper types, generics, or "unknown" for truly dynamic types

  ❌ src/services/ethersV6/wallet/WalletAPI.ts (1 violation(s))
     Line 80: private _identifyWallet = (p: any) => {
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

**Summary:** 4 total (Critical: 2, High: 2)

<details>
<summary>View Details</summary>

```
React Linter/TypeScript Suppression Check
================================================================================

Scanning 317 files in src/...

Linter/TypeScript Suppression Violations
--------------------------------------------------------------------------------

❌ Found 4 suppression comment(s)

🚨 CRITICAL VIOLATIONS (2)
--------------------------------------------------------------------------------
  ❌ src/features/app/composeContextProviders.tsx (1 suppression(s))
     Line 8: // eslint-disable-next-line @typescript-eslint/no-explicit-any
     Type: eslint-disable
     Rule: Never suppress linter or TypeScript errors
     Fix: Address the underlying issue instead of suppressing it

  ❌ src/services/ethersV6/wallet/WalletAPI.ts (1 suppression(s))
     Line 79: // eslint-disable-next-line @typescript-eslint/no-explicit-any
     Type: eslint-disable
     Rule: Never suppress linter or TypeScript errors
     Fix: Address the underlying issue instead of suppressing it

⚠️  HIGH SEVERITY VIOLATIONS (2)
--------------------------------------------------------------------------------
  ❌ src/features/app/composeContextProviders.tsx (1 suppression(s))
     Line 8: // eslint-disable-next-line @typescript-eslint/no-explicit-any
     Type: eslint-disable-next-line
     Rule: Never suppress linter or TypeScript errors
     Fix: Address the underlying issue instead of suppressing it

  ❌ src/services/ethersV6/wallet/WalletAPI.ts (1 suppression(s))
     Line 79: // eslint-disable-next-line @typescript-eslint/no-explicit-any
     Type: eslint-disable-next-line
     Rule: Never suppress linter or TypeScript errors
     Fix: Address the underlying issue instead of suppressing it

================================================================================
Summary

Total suppressions: 4
  Critical: 2
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

### ❌ God Files (1 Entity Per File)

**Summary:** 6 file(s), 17 entities to split

<details>
<summary>View Details</summary>

```
React "God File" Check (1 Entity Per File Rule)
================================================================================

Scanning 317 TypeScript files in src/...

"God File" Violations (Multiple Entities Per File)
--------------------------------------------------------------------------------

❌ Found 6 file(s) with multiple entities

  ❌ src/services/oauth/providers/google/types.ts (9 entities)
     Line 1: interface GoogleOAuth2CodeClientConfig
     Line 10: interface GoogleOAuth2CodeClient
     Line 14: interface GoogleOAuth2CodeResponse
     Line 21: interface GoogleOAuth2Error
     Line 26: interface GoogleIdConfiguration
     Line 35: interface GoogleIdCredentialResponse
     Line 40: interface GoogleIdRenderButtonOptions
     Line 52: interface PromptMomentNotification
     Line 67: interface GoogleUserProfile
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/services/oauth/providers/google/GoogleOAuth2CodeClientConfig.ts
       - src/services/oauth/providers/google/GoogleOAuth2CodeClient.ts
       - src/services/oauth/providers/google/GoogleOAuth2CodeResponse.ts
       - src/services/oauth/providers/google/GoogleOAuth2Error.ts
       - src/services/oauth/providers/google/GoogleIdConfiguration.ts
       - src/services/oauth/providers/google/GoogleIdCredentialResponse.ts
       - src/services/oauth/providers/google/GoogleIdRenderButtonOptions.ts
       - src/services/oauth/providers/google/PromptMomentNotification.ts
       - src/services/oauth/providers/google/GoogleUserProfile.ts

  ❌ src/features/app/types/FeatureConfig.ts (3 entities)
     Line 8: interface FeatureStore
     Line 25: interface FeatureSaga
     Line 42: interface FeatureConfig
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/app/types/FeatureStore.ts
       - src/features/app/types/FeatureSaga.ts
       - src/features/app/types/FeatureConfig.ts

  ❌ src/features/i18n/types.ts (3 entities)
     Line 1: enum LangCode
     Line 6: type SupportedLang
     Line 11: type I18NConfig
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/i18n/LangCode.ts
       - src/features/i18n/SupportedLang.ts
       - src/features/i18n/I18NConfig.ts

  ❌ src/features/oauth/types/IOAuthProvider.ts (3 entities)
     Line 4: type OAuthProviderName
     Line 6: interface OAuthProviderCredentials
     Line 16: interface IOAuthProvider
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/oauth/types/OAuthProviderName.ts
       - src/features/oauth/types/OAuthProviderCredentials.ts
       - src/features/oauth/types/IOAuthProvider.ts

  ❌ src/features/wallet/models/provider/IProviderApi.ts (3 entities)
     Line 3: enum SupportedWallets
     Line 10: type InstalledWallets
     Line 12: interface IProviderApi
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/wallet/models/provider/SupportedWallets.ts
       - src/features/wallet/models/provider/InstalledWallets.ts
       - src/features/wallet/models/provider/IProviderApi.ts

  ❌ src/features/ui/mantine/components/Breadcrumb/Breadcrumb.tsx (2 entities)
     Line 6: interface BreadcrumbItem
     Line 11: interface BreadcrumbProps
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/ui/mantine/components/Breadcrumb/BreadcrumbItem.ts
       - src/features/ui/mantine/components/Breadcrumb/BreadcrumbProps.ts

================================================================================
Summary

Files with multiple entities: 6
Total entities that should be in separate files: 17

❌ God file violations found.

Why this matters:
  - God files become hard to navigate and understand
  - Makes it difficult to find specific entities
  - Encourages poor code organization
  - Violates Single Responsibility Principle
  - Makes imports less clear and specific
  - Harder to reuse individual entities

The Rule:
  - 1 entity per file
  - File name should match entity name (e.g., UserService.ts for UserService class)
  - Each file has a clear, focused purpose
  - Easy to find and understand
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

### ❌ Console & Debug Logs

**Summary:** 97 statement(s)

<details>
<summary>View Details</summary>

```
Code Quality Check: Console & Debug Logs
================================================================================

Scanning for console.log and log.debug statements...

Production Logging Issues
--------------------------------------------------------------------------------

❌ Found 97 logging statement(s) in production code

Summary:
  - log.debug():     97 in 30 file(s)
  - console.log():   0 in 0 file(s)

🟡 Warning: log.debug() Usage (Performance & Security Risk)
--------------------------------------------------------------------------------

  ⚠️  src\services\ethersV6\wallet\WalletAPI.ts
     → 18 log.debug() statement(s)

  ⚠️  src\features\slice-manager\SliceLifecycleManager.ts
     → 15 log.debug() statement(s)

  ⚠️  src\services\oauth\providers\google\GoogleOAuthProvider.ts
     → 10 log.debug() statement(s)

  ⚠️  src\services\oauth\providers\OAuthProviderService.ts
     → 8 log.debug() statement(s)

  ⚠️  src\services\oauth\OAuthService.ts
     → 7 log.debug() statement(s)

  ⚠️  src\services\oauth\providers\github\GitHubOAuthProvider.ts
     → 7 log.debug() statement(s)

  ⚠️  src\services\oauth\OAuthApi.ts
     → 4 log.debug() statement(s)

  ⚠️  src\services\chat\LangGraphChatModelAdapter.ts
     → 2 log.debug() statement(s)

  ⚠️  src\services\chat\GoogleADKChatModelAdapter.ts
     → 2 log.debug() statement(s)

  ⚠️  src\features\slice-manager\lib\smart-fetch\shouldFetchData.ts
     → 2 log.debug() statement(s)

  ...and 20 more file(s) with log.debug()

--------------------------------------------------------------------------------
Summary: 97 logging statement(s) found

Issues:
  - console.log() exposes information in browser console
  - log.debug() may leak sensitive data if not filtered
  - Performance overhead in production builds

Recommendation:
  1. Remove console.log() statements (use proper logger)
  2. Configure log level filtering for production
  3. Use environment-based conditional logging
  4. Consider using a proper logging library with levels
```

</details>

---

## Passed Checks

- ✅ **Redux Abstraction** - useDispatch: 0, RootState: 0, useSelector: 0
- ✅ **i18n Coverage** - Check output
- ✅ **Redux Saga Patterns** - No violations found

## Recommendations

### Priority Actions

1. **Import Quality**: 1 violation(s)
   - Run: `node ./.claude/skills/code-audit/scripts/import_quality.mjs`
   - See detailed output above for specific violations

2. **Export Quality**: Index files: 0, Default exports: 3
   - Run: `node ./.claude/skills/code-audit/scripts/export_quality.mjs`
   - See detailed output above for specific violations

3. **Service Import Boundaries**: Check output
   - Run: `node ./.claude/skills/code-audit/scripts/service_import_boundaries.mjs`
   - See detailed output above for specific violations

4. **TypeScript "any" Usage**: 2 violation(s)
   - Run: `node ./.claude/skills/code-audit/scripts/typescript__any__usage.mjs`
   - See detailed output above for specific violations

5. **Linter/TypeScript Suppressions**: 4 total (Critical: 2, High: 2)
   - Run: `node ./.claude/skills/code-audit/scripts/linter_typescript_suppressions.mjs`
   - See detailed output above for specific violations

6. **God Files (1 Entity Per File)**: 6 file(s), 17 entities to split
   - Run: `node ./.claude/skills/code-audit/scripts/god_files__1_entity_per_file_.mjs`
   - See detailed output above for specific violations

7. **TODO/FIXME/HACK Comments**: 15 marker(s)
   - Run: `node ./.claude/skills/code-audit/scripts/todo_fixme_hack_comments.mjs`
   - See detailed output above for specific violations

8. **Console & Debug Logs**: 97 statement(s)
   - Run: `node ./.claude/skills/code-audit/scripts/console___debug_logs.mjs`
   - See detailed output above for specific violations

## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run `code-audit` after fixes to verify improvements
4. Consider running `arch-audit` for architecture-level checks

---

*Generated by code-audit skill*
