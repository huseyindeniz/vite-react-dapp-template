# Code Audit Report

**Generated:** 2025-11-10T20:49:38.043Z
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
| Redux Abstraction | ❌ FAILED | useDispatch: 4, RootState: 0, useSelector: 0 |
| Service Import Boundaries | ❌ FAILED | Check output |
| i18n Coverage | ❌ FAILED | 3 violation(s) |
| TypeScript "any" Usage | ✅ PASSED | 0 violation(s) |
| Linter/TypeScript Suppressions | ✅ PASSED | 0 total (Critical: 0, High: 0) |
| God Files (1 Entity Per File) | ❌ FAILED | 1 file(s), 1 entities to split |
| TODO/FIXME/HACK Comments | ✅ PASSED | No markers |
| Console Usage | ✅ PASSED | No console usage |
| Redux Saga Patterns | ✅ PASSED | See details |

## Failed Checks (Detailed)

### ❌ Redux Abstraction

**Summary:** useDispatch: 4, RootState: 0, useSelector: 0

<details>
<summary>View Details</summary>

```
React Redux Abstraction Check
================================================================================

Scanning 388 files in src/...

1. Direct useDispatch Usage Violations
--------------------------------------------------------------------------------

❌ Found 4 direct useDispatch import(s)

  ❌ src/core/features/slice-manager/hooks/useSliceManagerInit.tsx:3
     import { useDispatch } from 'react-redux';
     Rule: React components should never import useDispatch
     Fix: Use feature action hooks (useWalletActions, useBlogActions, etc.)

  ❌ src/domain/features/blog-demo/hooks/useActions.ts:2
     import { useDispatch } from 'react-redux';
     Rule: React components should never import useDispatch
     Fix: Use feature action hooks (useWalletActions, useBlogActions, etc.)

  ❌ src/domain/features/oauth/hooks/useActions.ts:2
     import { useDispatch } from 'react-redux';
     Rule: React components should never import useDispatch
     Fix: Use feature action hooks (useWalletActions, useBlogActions, etc.)

  ❌ src/domain/features/wallet/hooks/useActions.ts:2
     import { useDispatch } from 'react-redux';
     Rule: React components should never import useDispatch
     Fix: Use feature action hooks (useWalletActions, useBlogActions, etc.)


2. Direct RootState Import Violations
--------------------------------------------------------------------------------

✅ No direct RootState imports found!

3. Direct useSelector Usage Violations
--------------------------------------------------------------------------------

✅ No direct useSelector usage found!

================================================================================
Summary

Direct useDispatch: 4 violation(s)
Direct RootState: 0 violation(s)
Direct useSelector: 0 violation(s)

❌ Redux abstraction violations found.

Rules:
  1. React components should never import useDispatch, useSelector, or RootState
  2. Components should use feature hooks (useWallet, useAuth, etc.)
  3. Components should use useTypedSelector for cross-feature state access

Allowed:
  - features/*/hooks/*.ts can use useDispatch, useSelector, RootState
  - src/hooks/*.ts can use useSelector, RootState
  - features/*/models/*/actionEffects/*.ts can use RootState

Pattern:
  Components → Feature Hooks → Redux
  (Never: Components → Redux directly)
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

Scanning 388 files in src/...

Service Import Violations
--------------------------------------------------------------------------------

❌ Found 10 service import violation(s)

  ❌ src/config/domain/ai-assistant/services.ts (5 violation(s))
     Line 1: import { ChatService } from '@/services/chat/ChatService';
     Import: @/services/chat/ChatService
     Line 2: import { DemoChatModelAdapter } from '@/services/chat/DemoChatModelAdapter';
     Import: @/services/chat/DemoChatModelAdapter
     Line 3: import { GoogleADKChatModelAdapter } from '@/services/chat/GoogleADKChatModelAdapter';
     Import: @/services/chat/GoogleADKChatModelAdapter
     Line 4: import { LangGraphChatModelAdapter } from '@/services/chat/LangGraphChatModelAdapter';
     Import: @/services/chat/LangGraphChatModelAdapter
     Line 5: import { SimpleAttachmentAdapter } from '@/services/chat/SimpleAttachmentAdapter';
     Import: @/services/chat/SimpleAttachmentAdapter
     Rule: Services must ONLY be imported in composition root (src/config/*/services.ts)
     Fix: Use dependency injection - receive service through interface

  ❌ src/config/domain/blog-demo/services.ts (1 violation(s))
     Line 1: import { BlogDemoApi } from '@/services/jsonplaceholder/BlogDemoApi';
     Import: @/services/jsonplaceholder/BlogDemoApi
     Rule: Services must ONLY be imported in composition root (src/config/*/services.ts)
     Fix: Use dependency injection - receive service through interface

  ❌ src/config/domain/oauth/services.ts (3 violation(s))
     Line 1: import { OAuthService } from '@/services/oauth/OAuthService';
     Import: @/services/oauth/OAuthService
     Line 2: import { GitHubOAuthProvider } from '@/services/oauth/providers/github/GitHubOAuthProvider';
     Import: @/services/oauth/providers/github/GitHubOAuthProvider
     Line 3: import { GoogleOAuthProvider } from '@/services/oauth/providers/google/GoogleOAuthProvider';
     Import: @/services/oauth/providers/google/GoogleOAuthProvider
     Rule: Services must ONLY be imported in composition root (src/config/*/services.ts)
     Fix: Use dependency injection - receive service through interface

  ❌ src/config/domain/wallet/services.ts (1 violation(s))
     Line 1: import { EthersV6WalletAPI } from '@/services/ethersV6/wallet/WalletAPI';
     Import: @/services/ethersV6/wallet/WalletAPI
     Rule: Services must ONLY be imported in composition root (src/config/*/services.ts)
     Fix: Use dependency injection - receive service through interface

================================================================================
Summary

Service import violations: 10

❌ Service import violations found.

Dependency Injection Pattern:
  - Services are ONLY imported in composition root:
    - src/config/services.ts (root, if exists)
    - src/config/{feature}/services.ts (feature-specific)
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

### ❌ i18n Coverage

**Summary:** 3 violation(s)

<details>
<summary>View Details</summary>

```
React i18n Coverage Check
================================================================================

Scanning 136 component files in src/...

Raw Text Violations (Missing t() Wrapper)
--------------------------------------------------------------------------------

❌ Found 3 raw text occurrence(s) in 1 file(s)

  File: src/domain/layout/ErrorFallback/ErrorFallback.tsx

    ❌ Line 12 (JSX text content)
       Text: "Opps!"
       Context: <strong>Opps!</strong> An unexpected error occured!
       Fix: Wrap in t() -> {t('Opps!')}

    ❌ Line 16 (JSX text content)
       Text: "Back To Home?"
       Context: <p>Back To Home?</p>
       Fix: Wrap in t() -> {t('Back To Home?')}

    ❌ Line 38 (JSX text content)
       Text: "Full Error Message"
       Context: <caption> Full Error Message</caption>
       Fix: Wrap in t() -> {t('Full Error Message')}

--------------------------------------------------------------------------------
Summary: 3 raw text occurrence(s) found

Rule: All user-facing text must be wrapped in t() for internationalization.

Examples:
  ❌ <Button>Click me</Button>
  ✅ <Button>{t('Click me')}</Button>

  ❌ const message = "Hello world";
  ✅ const message = t('Hello world');
```

</details>

---

### ❌ God Files (1 Entity Per File)

**Summary:** 1 file(s), 1 entities to split

<details>
<summary>View Details</summary>

```
React "God File" Check (1 Entity Per File Rule)
================================================================================

Scanning 388 TypeScript files in src/...

"God File" Violations (Multiple Entities Per File)
--------------------------------------------------------------------------------

❌ Found 1 file(s) with multiple entities

  ❌ src/domain/layout/components/Breadcrumb/Breadcrumb.tsx (2 entities)
     Line 6: interface BreadcrumbItem
     Line 11: interface BreadcrumbProps
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/domain/layout/components/Breadcrumb/BreadcrumbItem.ts
       - src/domain/layout/components/Breadcrumb/BreadcrumbProps.ts

================================================================================
Summary

Files with multiple entities: 1
Total entities that should be in separate files: 1

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

## Passed Checks

- ✅ **Import Quality** - Check output
- ✅ **Export Quality** - Index files: 0, Default exports: 0
- ✅ **TypeScript "any" Usage** - 0 violation(s)
- ✅ **Linter/TypeScript Suppressions** - 0 total (Critical: 0, High: 0)
- ✅ **TODO/FIXME/HACK Comments** - No markers
- ✅ **Console Usage** - No console usage
- ✅ **Redux Saga Patterns** - No violations found

## Recommendations

### Priority Actions

1. **Redux Abstraction**: useDispatch: 4, RootState: 0, useSelector: 0
   - Run: `node ./.claude/skills/code-audit/scripts/redux_abstraction.mjs`
   - See detailed output above for specific violations

2. **Service Import Boundaries**: Check output
   - Run: `node ./.claude/skills/code-audit/scripts/service_import_boundaries.mjs`
   - See detailed output above for specific violations

3. **i18n Coverage**: 3 violation(s)
   - Run: `node ./.claude/skills/code-audit/scripts/i18n_coverage.mjs`
   - See detailed output above for specific violations

4. **God Files (1 Entity Per File)**: 1 file(s), 1 entities to split
   - Run: `node ./.claude/skills/code-audit/scripts/god_files__1_entity_per_file_.mjs`
   - See detailed output above for specific violations

## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run `code-audit` after fixes to verify improvements
4. Consider running `arch-audit` for architecture-level checks

---

*Generated by code-audit skill*
