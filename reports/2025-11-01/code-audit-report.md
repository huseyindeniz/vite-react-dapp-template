# Code Audit Report

**Generated:** 2025-11-01T17:01:04.045Z
**Project:** vite-react-dapp-template

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Checks** | 11 |
| **Passed** | ✅ 2 |
| **Failed** | ❌ 9 |
| **Success Rate** | 18% |

## Results by Check

| Check | Status | Summary |
|-------|--------|---------|
| Import Quality | ❌ FAILED | 1 violation(s) |
| Export Quality | ❌ FAILED | Index files: 0, Default exports: 3 |
| Redux Abstraction | ✅ PASSED | useDispatch: 0, RootState: 0, useSelector: 0 |
| Service Import Boundaries | ❌ FAILED | Check output |
| i18n Coverage | ❌ FAILED | 45 violation(s) |
| TypeScript "any" Usage | ❌ FAILED | 2 violation(s) |
| Linter/TypeScript Suppressions | ❌ FAILED | 4 total (Critical: 2, High: 2) |
| God Files (1 Entity Per File) | ❌ FAILED | 5 file(s), 9 entities to split |
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

### ❌ i18n Coverage

**Summary:** 45 violation(s)

<details>
<summary>View Details</summary>

```
React i18n Coverage Check
================================================================================

Scanning 113 component files in src/...

Raw Text Violations (Missing t() Wrapper)
--------------------------------------------------------------------------------

❌ Found 45 raw text occurrence(s) in 25 file(s)

  File: src/features/auth/components/AuthButton/AuthButton.tsx

    ❌ Line 136 (JSX text content)
       Text: "Choose auth provider"
       Context: <Menu.Label>Choose auth provider</Menu.Label>
       Fix: Wrap in t() -> {t('Choose auth provider')}

  File: src/features/auth/components/AuthProtectionWarning/AuthProtectionWarning.tsx

    ❌ Line 30 (String literal)
       Text: "Sign in"
       Context: <List.Item>{t('Click the "Sign in" button below or in the header')}</List.Item>
       Fix: Wrap in t() -> {t('Sign in')}

  File: src/features/auth/pages/GithubCallback.tsx

    ❌ Line 47 (String literal)
       Text: "GitHub login failed"
       Context: error: 'GitHub login failed',
       Fix: Wrap in t() -> {t('GitHub login failed')}

    ❌ Line 67 (String literal)
       Text: "Invalid callback"
       Context: error: 'Invalid callback',
       Fix: Wrap in t() -> {t('Invalid callback')}

    ❌ Line 68 (String literal)
       Text: "Missing required parameters"
       Context: description: 'Missing required parameters',
       Fix: Wrap in t() -> {t('Missing required parameters')}

    ❌ Line 85 (String literal)
       Text: "You can close this window"
       Context: {window.opener ? 'You can close this window' : 'Redirecting...'}
       Fix: Wrap in t() -> {t('You can close this window')}

    ❌ Line 85 (String literal)
       Text: "Redirecting..."
       Context: {window.opener ? 'You can close this window' : 'Redirecting...'}
       Fix: Wrap in t() -> {t('Redirecting...')}

  File: src/features/auth/pages/GoogleCallback.tsx

    ❌ Line 38 (String literal)
       Text: "Google login failed"
       Context: error: 'Google login failed',
       Fix: Wrap in t() -> {t('Google login failed')}

    ❌ Line 70 (String literal)
       Text: "Invalid callback"
       Context: error: 'Invalid callback',
       Fix: Wrap in t() -> {t('Invalid callback')}

    ❌ Line 71 (String literal)
       Text: "Missing required parameters"
       Context: description: 'Missing required parameters'
       Fix: Wrap in t() -> {t('Missing required parameters')}

    ❌ Line 91 (String literal)
       Text: "Invalid callback"
       Context: error: 'Invalid callback',
       Fix: Wrap in t() -> {t('Invalid callback')}

    ❌ Line 92 (String literal)
       Text: "Missing required parameters"
       Context: description: 'Missing required parameters'
       Fix: Wrap in t() -> {t('Missing required parameters')}

  File: src/features/auth/routes.tsx

    ❌ Line 28 (String literal)
       Text: "Github Callback"
       Context: menuLabel: `Github Callback`,
       Fix: Wrap in t() -> {t('Github Callback')}

    ❌ Line 39 (String literal)
       Text: "Google Callback"
       Context: menuLabel: `Google Callback`,
       Fix: Wrap in t() -> {t('Google Callback')}

  File: src/features/blog-demo/components/Posts/PostEmptyList.tsx

    ❌ Line 5 (String literal)
       Text: "No Posts Available"
       Context: <Alert title="No Posts Available" color="gray">
       Fix: Wrap in t() -> {t('No Posts Available')}

  File: src/features/blog-demo/components/Posts/PostLoadMoreButton.tsx

    ❌ Line 22 (String literal)
       Text: "Loading..."
       Context: {loading ? 'Loading...' : 'Load More'}
       Fix: Wrap in t() -> {t('Loading...')}

    ❌ Line 22 (String literal)
       Text: "Load More"
       Context: {loading ? 'Loading...' : 'Load More'}
       Fix: Wrap in t() -> {t('Load More')}

  File: src/features/i18n/components/LangMenu/LangModal.tsx

    ❌ Line 38 (String literal)
       Text: "Language Selection"
       Context: <Modal opened={isOpen} onClose={onClose} title="Language Selection">
       Fix: Wrap in t() -> {t('Language Selection')}

  File: src/features/slice-manager/components/SliceDebugPanel.tsx

    ❌ Line 31 (JSX text content)
       Text: "Slice Status"
       Context: <h3>Slice Status</h3>
       Fix: Wrap in t() -> {t('Slice Status')}

  File: src/features/ui/mantine/components/ColorSchemeSwitch/ColorSchemeSwitch.tsx

    ❌ Line 19 (String literal)
       Text: "Toggle color scheme"
       Context: aria-label="Toggle color scheme"
       Fix: Wrap in t() -> {t('Toggle color scheme')}

  File: src/features/ui/mantine/components/ErrorFallback/ErrorFallback.tsx

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

  File: src/features/ui/mantine/theme.tsx

    ❌ Line 4 (String literal)
       Text: "Open Sans, sans-serif"
       Context: fontFamily: 'Open Sans, sans-serif',
       Fix: Wrap in t() -> {t('Open Sans, sans-serif')}

  File: src/features/wallet/components/ConnectionModal/CheckAccount/UnlockWaiting.tsx

    ❌ Line 14 (String literal)
       Text: "Please close this dialog, open your Web3 wallet, unlock it, and click connect button again."
       Context: 'Please close this dialog, open your Web3 wallet, unlock it, and click connect button again.'
       Fix: Wrap in t() -> {t('Please close this dialog, open your Web3 wallet, unlock it, and click connect button again.')}

  File: src/features/wallet/components/ConnectionModal/CheckNetwork/WrongNetwork.tsx

    ❌ Line 32 (String literal)
       Text: "If you want to continue, please switch to any supported network."
       Context: 'If you want to continue, please switch to any supported network.'
       Fix: Wrap in t() -> {t('If you want to continue, please switch to any supported network.')}

  File: src/features/wallet/components/ConnectionModal/CheckSign/NotSigned.tsx

    ❌ Line 24 (String literal)
       Text: "In order to use this app, you need to sign the login request in your wallet."
       Context: 'In order to use this app, you need to sign the login request in your wallet.'
       Fix: Wrap in t() -> {t('In order to use this app, you need to sign the login request in your wallet.')}

  File: src/features/wallet/components/ConnectionModal/CheckWallet/NotSupported.tsx

    ❌ Line 35 (String literal)
       Text: "Please install any compatible Web3 wallet extension for your browser from the official links below and try again to use this dapp."
       Context: 'Please install any compatible Web3 wallet extension for your browser from the official links below and try again to use this dapp.'
       Fix: Wrap in t() -> {t('Please install any compatible Web3 wallet extension for your browser from the official links below and try again to use this dapp.')}

  File: src/features/wallet/components/ConnectionModal/CheckWallet/WaitingSelection.tsx

    ❌ Line 40 (String literal)
       Text: "The following Web3 wallet extensions dedected in your browser. You can select the wallet you want to connect."
       Context: 'The following Web3 wallet extensions dedected in your browser. You can select the wallet you want to connect.'
       Fix: Wrap in t() -> {t('The following Web3 wallet extensions dedected in your browser. You can select the wallet you want to connect.')}

  File: src/features/wallet/components/ConnectionModal/Modal/Modal.tsx

    ❌ Line 40 (String literal)
       Text: "A supported Web3 wallet extension needs to be installed."
       Context: 'A supported Web3 wallet extension needs to be installed.'
       Fix: Wrap in t() -> {t('A supported Web3 wallet extension needs to be installed.')}

    ❌ Line 62 (String literal)
       Text: "A supported network needs to be selected in the Web3 wallet."
       Context: 'A supported network needs to be selected in the Web3 wallet.'
       Fix: Wrap in t() -> {t('A supported network needs to be selected in the Web3 wallet.')}

  File: src/features/wallet/components/ProfileDropdownMenu/ProfileDropdownMenu.tsx

    ❌ Line 42 (String literal)
       Text: "The address of your account has been copied to the clipboard."
       Context: 'The address of your account has been copied to the clipboard.'
       Fix: Wrap in t() -> {t('The address of your account has been copied to the clipboard.')}

  File: src/main.tsx

    ❌ Line 16 (String literal)
       Text: "pulse spinner"
       Context: <span className="pulse spinner">
       Fix: Wrap in t() -> {t('pulse spinner')}

  File: src/pages/AiChat/AiChat.tsx

    ❌ Line 12 (String literal)
       Text: "AI-powered chat interface for interactive conversations."
       Context: 'AI-powered chat interface for interactive conversations.'
       Fix: Wrap in t() -> {t('AI-powered chat interface for interactive conversations.')}

  File: src/pages/Blog/Blog.tsx

    ❌ Line 13 (String literal)
       Text: "Blog page"
       Context: <PageMeta title={t('Blog')} url="/blog" description="Blog page" />
       Fix: Wrap in t() -> {t('Blog page')}

  File: src/pages/Home/Home.tsx

    ❌ Line 76 (String literal)
       Text: "noopener noreferrer"
       Context: rel="noopener noreferrer"
       Fix: Wrap in t() -> {t('noopener noreferrer')}

    ❌ Line 86 (String literal)
       Text: "noopener noreferrer"
       Context: rel="noopener noreferrer"
       Fix: Wrap in t() -> {t('noopener noreferrer')}

  File: src/pages/Home/components/Environment.tsx

    ❌ Line 14 (JSX text content)
       Text: "Environment Variables"
       Context: <Table.Caption>Environment Variables</Table.Caption>
       Fix: Wrap in t() -> {t('Environment Variables')}

    ❌ Line 23 (JSX text content)
       Text: "Use Hash Router"
       Context: <Table.Th>Use Hash Router</Table.Th>
       Fix: Wrap in t() -> {t('Use Hash Router')}

    ❌ Line 29 (JSX text content)
       Text: "Wallet: Disable Sign"
       Context: <Table.Th>Wallet: Disable Sign</Table.Th>
       Fix: Wrap in t() -> {t('Wallet: Disable Sign')}

    ❌ Line 35 (JSX text content)
       Text: "Wallet: Sign Timeout"
       Context: <Table.Th>Wallet: Sign Timeout</Table.Th>
       Fix: Wrap in t() -> {t('Wallet: Sign Timeout')}

    ❌ Line 41 (JSX text content)
       Text: "Wallet: Slow Down"
       Context: <Table.Th>Wallet: Slow Down</Table.Th>
       Fix: Wrap in t() -> {t('Wallet: Slow Down')}

    ❌ Line 47 (JSX text content)
       Text: "Login Redirect"
       Context: <Table.Th>Login Redirect</Table.Th>
       Fix: Wrap in t() -> {t('Login Redirect')}

  File: src/pages/NotFound/NotFound.tsx

    ❌ Line 40 (String literal)
       Text: "not found"
       Context: alt="not found"
       Fix: Wrap in t() -> {t('not found')}

    ❌ Line 45 (String literal)
       Text: "not found"
       Context: alt="not found"
       Fix: Wrap in t() -> {t('not found')}

--------------------------------------------------------------------------------
Summary: 45 raw text occurrence(s) found

Rule: All user-facing text must be wrapped in t() for internationalization.

Examples:
  ❌ <Button>Click me</Button>
  ✅ <Button>{t('Click me')}</Button>

  ❌ const message = "Hello world";
  ✅ const message = t('Hello world');
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

**Summary:** 5 file(s), 9 entities to split

<details>
<summary>View Details</summary>

```
React "God File" Check (1 Entity Per File Rule)
================================================================================

Scanning 317 TypeScript files in src/...

"God File" Violations (Multiple Entities Per File)
--------------------------------------------------------------------------------

❌ Found 5 file(s) with multiple entities

  ❌ src/features/app/types/FeatureConfig.ts (3 entities)
     Line 8: interface FeatureStore
     Line 25: interface FeatureSaga
     Line 42: interface FeatureConfig
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/app/types/FeatureStore.ts
       - src/features/app/types/FeatureSaga.ts
       - src/features/app/types/FeatureConfig.ts

  ❌ src/features/auth/types/IAuthProvider.ts (3 entities)
     Line 4: type AuthProviderName
     Line 6: interface AuthProviderCredentials
     Line 16: interface IAuthProvider
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/auth/types/AuthProviderName.ts
       - src/features/auth/types/AuthProviderCredentials.ts
       - src/features/auth/types/IAuthProvider.ts

  ❌ src/features/i18n/types.ts (3 entities)
     Line 1: enum LangCode
     Line 6: type SupportedLang
     Line 11: type I18NConfig
     Rule: 1 entity per file - NO god files!
     Fix: Split into separate files:
       - src/features/i18n/LangCode.ts
       - src/features/i18n/SupportedLang.ts
       - src/features/i18n/I18NConfig.ts

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

Files with multiple entities: 5
Total entities that should be in separate files: 9

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

  ⚠️  src\services\auth\providers\google\GoogleAuthProvider.ts
     → 10 log.debug() statement(s)

  ⚠️  src\services\auth\providers\AuthProviderService.ts
     → 8 log.debug() statement(s)

  ⚠️  src\services\auth\AuthService.ts
     → 7 log.debug() statement(s)

  ⚠️  src\services\auth\providers\github\GitHubAuthProvider.ts
     → 7 log.debug() statement(s)

  ⚠️  src\services\auth\AuthApi.ts
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

4. **i18n Coverage**: 45 violation(s)
   - Run: `node ./.claude/skills/code-audit/scripts/i18n_coverage.mjs`
   - See detailed output above for specific violations

5. **TypeScript "any" Usage**: 2 violation(s)
   - Run: `node ./.claude/skills/code-audit/scripts/typescript__any__usage.mjs`
   - See detailed output above for specific violations

6. **Linter/TypeScript Suppressions**: 4 total (Critical: 2, High: 2)
   - Run: `node ./.claude/skills/code-audit/scripts/linter_typescript_suppressions.mjs`
   - See detailed output above for specific violations

7. **God Files (1 Entity Per File)**: 5 file(s), 9 entities to split
   - Run: `node ./.claude/skills/code-audit/scripts/god_files__1_entity_per_file_.mjs`
   - See detailed output above for specific violations

8. **TODO/FIXME/HACK Comments**: 15 marker(s)
   - Run: `node ./.claude/skills/code-audit/scripts/todo_fixme_hack_comments.mjs`
   - See detailed output above for specific violations

9. **Console & Debug Logs**: 97 statement(s)
   - Run: `node ./.claude/skills/code-audit/scripts/console___debug_logs.mjs`
   - See detailed output above for specific violations

## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run `code-audit` after fixes to verify improvements
4. Consider running `arch-audit` for architecture-level checks

---

*Generated by code-audit skill*
