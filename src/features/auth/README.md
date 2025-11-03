# Auth Feature - Page-Level Protection System

The `auth` core feature provides a simple, configuration-driven system for **page-level route protection**. It's focused on one thing: protecting routes based on authentication requirements.

## Design Philosophy

**Router-Focused:** Auth feature exists solely for router's page-level protection needs.

**Direct Feature Hooks:** Components that need auth checks import hooks directly from features:
- `useWalletAuthentication` from `@/features/wallet`
- `useOAuthAuthentication` from `@/features/oauth` (when available)

**No Central Auth Hooks:** There's no `useAuth()` abstraction. Features manage their own authentication state.

## Configuration File

**All auth configuration lives in ONE file:** `src/features/app/config/auth.ts`

This file contains:
1. **ProtectionType enum** - defines available protection types
2. **Provider registration** - wires domain features to the auth system

```typescript
// src/features/app/config/auth.ts

export enum ProtectionType {
  NONE = 'none',
  OAUTH = 'oauth',
  WALLET = 'wallet',
  BOTH = 'both',
}

registerProtectionProvider(walletProtectionProvider);
registerProtectionProvider(oauthProtectionProvider);
```

## How It Works

### 1. Domain Features Export Providers

Each auth-capable feature exports a provider:

```typescript
// features/wallet/authProvider.ts
import { ProtectionType } from '@/features/app/config/auth';
import { IProtectionProvider } from '@/features/auth';

export const walletProtectionProvider: IProtectionProvider = {
  protectionType: ProtectionType.WALLET,
  withProtection: withWalletProtection, // HOC for route protection
  useAuthentication: useWalletAuthentication, // Optional
  usePostLoginRedirect: usePostLoginRedirect, // Optional
};
```

### 2. Providers Registered in Config

```typescript
// src/features/app/config/auth.ts
import { walletProtectionProvider } from '@/features/wallet/authProvider';

registerProtectionProvider(walletProtectionProvider);
```

### 3. Router Applies Protection

```typescript
// Router uses applyProtection utility
import { applyProtection, ProtectionType } from '@/features/auth';

const protectedElement = applyProtection(<MyPage />, ProtectionType.WALLET);
```

## Component Auth Checks

**Components import feature hooks directly:**

```typescript
// ❌ DON'T: No central useAuth() hook
import { useAuth } from '@/features/auth'; // Doesn't exist!

// ✅ DO: Import from features directly
import { useWalletAuthentication } from '@/features/wallet/hooks/useWalletAuthentication';

function MyComponent() {
  const { isAuthenticated } = useWalletAuthentication();

  if (!isAuthenticated) {
    return <div>Please connect wallet</div>;
  }

  return <div>Wallet connected!</div>;
}
```

## Adding a New Auth Provider

**3 simple steps:**

### Step 1: Add to ProtectionType

```typescript
// src/features/app/config/auth.ts
export enum ProtectionType {
  NONE = 'none',
  AUTH = 'auth',
  WALLET = 'wallet',
  WEB3AUTH = 'web3auth', // ← Add new type
  BOTH = 'both',
}
```

### Step 2: Create Provider in Feature

```typescript
// features/web3auth/authProvider.ts
import { ProtectionType } from '@/features/app/config/auth';
import { IProtectionProvider } from '@/features/auth';

export const web3authProtectionProvider: IProtectionProvider = {
  protectionType: ProtectionType.WEB3AUTH,
  withProtection: withWeb3AuthProtection,
  useAuthentication: useWeb3AuthStatus, // Optional
};
```

### Step 3: Register Provider

```typescript
// src/features/app/config/auth.ts
import { web3authProtectionProvider } from '@/features/web3auth/authProvider';

registerProtectionProvider(web3authProtectionProvider);
```

**Done!** Router can now protect routes with `ProtectionType.WEB3AUTH`.

## Removing an Auth Provider

**3 simple steps:**

### Step 1: Remove from ProtectionType

```typescript
// src/features/app/config/auth.ts
export enum ProtectionType {
  NONE = 'none',
  AUTH = 'auth',
  // WALLET = 'wallet', // ← Remove
  // BOTH = 'both',      // ← Remove if no longer needed
}
```

### Step 2: Remove Registration

```typescript
// src/features/app/config/auth.ts
// import { walletProtectionProvider } from '@/features/wallet/authProvider'; // ← Remove
// registerProtectionProvider(walletProtectionProvider); // ← Remove
```

### Step 3: Delete Feature Folder

```bash
rm -rf src/features/wallet/
```

**Done!** App now works without wallet authentication.

## Auth Feature Public API

The auth feature is minimal and focused. Import directly from source files:

```typescript
// Types
import { ProtectionType } from '@/features/app/config/auth';
import { IProtectionProvider } from '@/features/auth/types/IProtectionProvider';

// Registry (used in composition root)
import { registerProtectionProvider } from '@/features/auth/registry/protectionRegistry';

// Utils (used by router)
import { applyProtection } from '@/features/auth/utils/applyProtection';
import { getAuthRoutes } from '@/features/auth/utils/getAuthRoutes';
```

**No index file!** Import directly from source files. This follows the project's strict "no index files" rule.

## Architecture Benefits

✅ **Simple** - One config file for all auth setup
✅ **Focused** - Only handles page-level protection
✅ **Direct** - Components use feature hooks directly
✅ **Testable** - No central auth abstraction to mock
✅ **Maintainable** - Each feature owns its auth logic

## File Structure

```
src/features/
├── app/config/
│   └── auth.ts                    ← SINGLE SOURCE OF TRUTH
│       ├── ProtectionType enum
│       └── Provider registration
│
├── auth/                          ← Minimal core feature
│   ├── types/
│   │   └── IProtectionProvider.ts ← Contract
│   ├── registry/
│   │   └── protectionRegistry.ts  ← Provider registry
│   └── utils/
│       ├── applyProtection.tsx    ← Route protection
│       └── getAuthRoutes.ts       ← Route collection
│
├── wallet/                        ← Domain feature
│   ├── authProvider.ts            ← Implements IProtectionProvider
│   └── hooks/
│       └── useWalletAuthentication.ts ← Components import this
│
└── oauth/                         ← Domain feature
    ├── authProvider.ts            ← Implements IProtectionProvider
    └── hooks/
        └── useOAuthAuthentication.ts  ← Components import this
```

## Summary

- **Router:** Uses `applyProtection()` for page-level protection
- **Components:** Import feature hooks directly (`useWalletAuthentication`, etc.)
- **Configuration:** Everything in `app/config/auth.ts`
- **Providers:** Domain features export `IProtectionProvider` implementations
- **No abstraction:** No central `useAuth()` hook - keep it simple!
