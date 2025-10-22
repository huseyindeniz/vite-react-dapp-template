# CLAUDE.md

This file provides guidance to Claude Code when working with this React dApp template. Follow these patterns strictly to maintain architectural consistency.

---

## ⚠️ CRITICAL ARCHITECTURE PATTERNS (NEVER VIOLATE)

### 1. Feature-Model Architecture Pattern

**RULE**: Each **domain feature** organizes code by models. Each model MUST have its own directory, even if there's only ONE model.

⚠️ **NOTE**: This rule applies ONLY to **domain features** (wallet, auth, blog-demo, and any new features users create). It does NOT apply to **core features** (app, i18n, router, slice-manager, ui) which are infrastructure with their own specialized structures.

#### Model Directory Structure

```
src/features/{feature}/
├── models/
│   ├── {model}/              # Each model has own directory
│   │   ├── IModelApi.ts      # Interface for external dependencies
│   │   ├── actions.ts        # Redux action creators
│   │   ├── slice.ts          # Redux slice (state only)
│   │   ├── actionEffects/    # Business logic (Redux Saga)
│   │   │   ├── *.ts          # Individual action effect files
│   │   └── types/            # TypeScript types
│   └── {model2}/             # Another model (if exists)
├── hooks/                    # Feature-specific hooks (CRITICAL)
│   ├── useActions.ts         # Action dispatchers for components
│   └── use{Feature}.ts       # State access hooks (e.g., useWallet, useAuth)
├── hocs/                     # Higher Order Components (when applicable)
├── IFeatureApi.ts            # Root: Combined interface
├── slice.ts                  # Root: combineReducers from all models
└── sagas.ts                  # Root: Saga watchers
```

**Root Slice Pattern (REQUIRED):**

```typescript
// src/features/{feature}/slice.ts
import { combineReducers } from '@reduxjs/toolkit';
import { sessionReducer } from './models/session/slice';

export const authReducer = combineReducers({
  session: sessionReducer,
});
```

**State Access Pattern:**

```typescript
// ⚠️ State is nested by model: state.{feature}.{model}
// Components access state via feature hooks, NOT direct useSelector
// - Feature hooks (useWallet, useAuth): for feature's own state
// - useTypedSelector: for cross-feature state access
// Example state paths:
//   state.auth.session
//   state.wallet.provider
//   state.wallet.network
```

---

### 2. Business Logic Separation (MOST CRITICAL)

**RULE**: Business logic lives in EXACTLY ONE PLACE: `actionEffects/` (Redux Saga generators). NEVER put business logic anywhere else.

#### ✅ Business Logic ONLY in actionEffects/

**What belongs in actionEffects:**

- State machine logic (HandleState\* functions)
- API calls (`yield call(api.method)`)
- Error handling and retry logic
- Complex async workflows
- Side effects (logging, analytics)
- Business rules and validation
- Conditional logic based on state
- ALL business logic goes here

#### ❌ Slices are PURE State Containers

**What belongs in slices:**

- Simple state updates ONLY: `state.field = action.payload`
- ❌ NO API calls
- ❌ NO async logic
- ❌ NO business rules
- ❌ NO calculations
- ❌ NO conditional logic

#### ❌ Components are PURE Presentation

**What belongs in components:**

- Render UI based on state
- Call feature hook actions: `walletActions.connectWallet()` (NOT dispatch directly)
- Use feature hooks for state: `useWallet()`, `useAuth()` (NOT useSelector directly)
- Use `useTypedSelector` for cross-feature state access
- Handle user interactions (click, input)
- ❌ NO business logic
- ❌ NO API calls
- ❌ NO state machines
- ❌ NO async workflows
- ❌ NO direct useDispatch() or useSelector()

#### Summary: Separation of Concerns

| Layer              | Location         | Responsibility            | Contains Logic?         |
| ------------------ | ---------------- | ------------------------- | ----------------------- |
| **Business Logic** | `actionEffects/` | HOW and WHY things happen | ✅ YES - ALL logic here |
| **State**          | `slice.ts`       | WHAT the current state is | ❌ NO - just mutations  |
| **Presentation**   | Components       | WHAT to display           | ❌ NO - just render     |

---

### 3. Interface Architecture (Dependency Inversion Principle)

**RULE**: Features define interfaces for what they need. Services implement those interfaces. This achieves decoupling.

#### Pattern Structure

**Each model defines its own interface:**

- Location: `src/features/{feature}/models/{model}/IModelApi.ts`
- Contains: Method signatures the model needs from external services

**Root combines model interfaces:**

- Location: `src/features/{feature}/IFeatureApi.ts`
- Pattern: `export interface IFeatureApi extends IModel1Api, IModel2Api {}`

**Services implement the interfaces:**

- Location: `src/services/{service}/`
- Pattern: `class Service implements IFeatureApi { ... }`

**ActionEffects receive interfaces (Dependency Injection):**

- Pattern: `function* ActionEffect(api: IModelApi) { ... }`
- API could be any implementation (EthersV5, EthersV6, mock, etc.)
- ActionEffects don't know or care about concrete implementation

#### Why This Matters

```
Without Dependency Inversion (❌ WRONG):
Feature → imports → Service → imports → External Library
(tight coupling, hard to test, hard to swap)

With Dependency Inversion (✅ CORRECT):
Feature → defines → Interface ← implements ← Service → uses → External Library
(loose coupling, easy to test, easy to swap)
```

**Benefits:**

- Features don't know about external libraries (ethers.js, axios, etc.)
- Easy to swap implementations (EthersV5 → EthersV6)
- Easy to test (mock interfaces)
- Clear boundaries between layers

**Naming Convention:**

```
models/account/IAccountApi.ts   # NOT IWalletAccountApi
models/provider/IProviderApi.ts # NOT IWalletProviderApi
models/network/INetworkApi.ts   # NOT IWalletNetworkApi

IWalletApi.ts                   # Root combined interface
IBlogDemoApi.ts                 # Root combined interface
IAuthApi.ts                     # Root combined interface
```

---

### 4. Component-Hook Abstraction (CRITICAL)

**RULE**: React components NEVER use Redux/RTK directly. They ALWAYS use feature-specific hooks.

#### Abstraction Layers

**Components use Feature Hooks:**
- Each feature has `hooks/` directory with custom hooks
- `useActions` hook: provides all action dispatchers for the feature
- Custom state hooks: provide typed state access (e.g., `useWallet`, `useAuth`)
- Components call these hooks instead of RTK primitives

**Feature Hooks use Root Hooks:**
- Feature hooks internally use `useTypedSelector` from `src/hooks/`
- Provides type-safe state access
- Abstracts Redux implementation details from components

**State Access Patterns:**
- **Own feature state**: Use feature-specific hooks (`useWallet()`, `useAuth()`)
- **Cross-feature state**: Use root `useTypedSelector` from `src/hooks/`

**HOCs (Higher Order Components):**
- Some features provide HOCs when applicable
- Use for cross-cutting concerns (auth protection, route guards, etc.)

#### Why This Matters

**Abstraction Benefits:**
- Components don't know about Redux/RTK internals
- Easy to swap state management library
- Feature hooks can add memoization/logic
- Clear, type-safe API for components
- Centralized state access patterns

**Rules:**
- ❌ NEVER use `useDispatch()` directly in components
- ❌ NEVER use `useSelector()` directly in components
- ✅ ALWAYS use feature hooks (`useWalletActions()`, `useAuth()`, etc.)
- ✅ Use root `useTypedSelector` only for cross-feature state access
- ✅ Each feature provides its own hooks in `hooks/` directory

---

## Feature Categories: Core vs Domain

This template contains two distinct types of features with different structural requirements.

### ⚠️ Core Features (Infrastructure - EXCEPTIONS to Model Rules)

These features are **foundational infrastructure** that all other features depend on. They do NOT follow the model-based architecture pattern and have their own specialized structures.

**Core Features:**

- `app/` - Application root, provider composition, lazy loading
- `i18n/` - Internationalization infrastructure (i18next setup)
- `router/` - Routing infrastructure and utilities (React Router)
- `slice-manager/` - Redux slice lifecycle management system
- `ui/` - Mantine theme configuration and design system components

**Key Points:**

- ❌ **Do NOT apply model architecture rules to these features**
- ❌ **Do NOT expect models/ directories in these features**
- ❌ **Do NOT try to "fix" their structure to match domain features**
- ⚠️ **Be EXTRA CAREFUL when modifying - they affect ALL features**
- ⚠️ **Changes to core features require extra scrutiny**
- ✅ These are intentionally structured differently
- ✅ They are fixed parts of the template
- ✅ Each has its own specialized structure (no models/ directories)

### ✅ Domain Features (Business Logic - MUST Follow Model Rules)

These features represent business domains and serve as **examples/guides** for users building their applications. They MUST follow the strict model-based architecture pattern.

**Domain Features (Examples in Template):**

- `wallet/` - Web3 wallet integration (3 models: provider, network, account)
- `auth/` - Authentication (1 model: session)
- `blog-demo/` - Blog demonstration (2 models: post, author)

**Key Points:**

- ✅ **MUST follow model-based architecture** (Pattern #1)
- ✅ **Business logic ONLY in actionEffects/** (Pattern #2)
- ✅ **Features define interfaces, services implement** (Pattern #3)
- ✅ **Components use feature hooks, not RTK directly** (Pattern #4)
- ℹ️ Users may remove, modify, or replace these examples
- ℹ️ Users will create their own domain features (e.g., products, orders, inventory, users)
- ℹ️ **These are guides showing HOW to structure domain features correctly**

**Example Domain Feature Structure:**

```
wallet/
├── models/                          # ✅ Required for domain features
│   ├── provider/
│   │   ├── IProviderApi.ts
│   │   ├── actions.ts
│   │   ├── slice.ts
│   │   ├── actionEffects/
│   │   └── types/
│   ├── network/
│   │   ├── INetworkApi.ts
│   │   ├── actions.ts
│   │   ├── slice.ts
│   │   ├── actionEffects/
│   │   └── types/
│   └── account/
│       ├── IAccountApi.ts
│       ├── actions.ts
│       ├── slice.ts
│       ├── actionEffects/
│       └── types/
├── hooks/                           # ✅ Feature-specific hooks
│   ├── useWalletActions.ts          # Action dispatchers
│   └── useWallet.ts                 # State access
├── hocs/                            # Higher Order Components (if applicable)
├── components/                      # UI components
├── IWalletApi.ts                    # Root combined interface
├── slice.ts                         # combineReducers from models
└── sagas.ts                         # Saga watchers
```

✅ **Notice**: Has `models/` directory with proper structure - REQUIRED for domain features!

### Structure Comparison

| Aspect            | Core Features                        | Domain Features                        |
| ----------------- | ------------------------------------ | -------------------------------------- |
| **Purpose**       | Infrastructure for template          | Business logic examples                |
| **Models/**       | ❌ Not required                      | ✅ Required                            |
| **Structure**     | Specialized per feature              | Standardized model pattern             |
| **Modifiability** | ⚠️ Careful - affects everything      | ✅ User customizable                   |
| **Examples**      | app, i18n, router, slice-manager, ui | wallet, auth, blog-demo                |
| **User Action**   | Keep or modify carefully             | Remove, modify, replace, or create new |

---

## Development Commands

**Verification (REQUIRED after any code changes):**

```bash
npm run lint    # Must pass with 0 warnings
npm run test    # All tests must pass
npm run build   # Must build successfully
```

**Development:**

```bash
npm run dev                # Start dev server
npm run check-translations # Validate i18n completeness
```

**Storybook:**

```bash
npm run storybook          # Component documentation
```

---

## ⚠️ GENERAL RULES (NEVER VIOLATE)

### Architecture Rules

1. **Each model MUST have its own directory** under `models/`, even if there's only ONE model
   - ⚠️ **Applies to DOMAIN features only** (wallet, auth, blog-demo, and any new domain features)
   - ⚠️ **Does NOT apply to CORE features** (app, i18n, router, slice-manager, ui)
   - ✅ `auth/models/session/` (domain feature, single model)
   - ❌ `auth/models/` (files directly in models/)

1a. **Core features are infrastructure - be EXTRA CAREFUL**

- ⚠️ **Changes to core features (app, i18n, router, slice-manager, ui) affect EVERYTHING**
- ⚠️ **Core features have their own structure - DO NOT try to apply model patterns**
- ⚠️ **When modifying core features, understand the impact on all domain features**
- ℹ️ **When in doubt about modifying core features, ASK the user first**

2. **Business logic ONLY in `actionEffects/`** - NEVER in slices or components
   - ✅ API calls, state machines, error handling → `actionEffects/`
   - ❌ Business logic in components or slices

2a. **Components use feature hooks - NEVER use RTK directly**
   - ❌ NEVER use `useDispatch()` or `useSelector()` in components
   - ✅ ALWAYS use feature hooks: `useWalletActions()`, `useAuth()`, etc.
   - ✅ Use root `useTypedSelector` from `src/hooks/` for cross-feature state
   - ✅ Each feature has `hooks/` directory with `useActions` and state hooks

3. **Features define interfaces, services implement them**
   - ✅ Each model has `IModelApi.ts`
   - ✅ Root has `IFeatureApi.ts` extending model interfaces
   - ✅ Services implement feature interfaces

4. **One entity per file** - No index.ts files that export everything
   - ✅ `actions.ts` exports only actions
   - ❌ `index.ts` that re-exports everything in a folder

5. **Whenever any code changes:**
   - MUST run: `npm run lint` (0 warnings required)
   - MUST run: `npm run test` (all tests pass)
   - MUST run: `npm run build` (successful build)

### Code Quality Rules

6. **NEVER use `npm run lint --fix`** - Fix ESLint issues manually

7. **React Hook Dependencies** - NEVER add unnecessary dependencies:
   - ❌ DON'T add stable references that never change (e.g., `t` from useTranslation, `actions` from hooks)
   - ❌ DON'T add props/params recreated on every render with same content (e.g., `allRoutes`)
   - ✅ DO add only values that should trigger re-computation (e.g., `location.pathname`, `i18n.resolvedLanguage`)
   - Each unnecessary dependency creates exponential re-render combinations!

8. **Always follow best practices**
   - Never lead to hacky dead ends
   - Check latest documentation before designing
   - Never reinvent the wheel - use battle-tested, trusted, widely-adopted solutions

---

## Quick Reference

### Tech Stack

- **Build**: Vite + TypeScript
- **UI**: React 19 + Mantine v7
- **State**: Redux Toolkit + Redux Saga
- **Routing**: React Router DOM v7
- **Web3**: Ethers.js v6
- **Testing**: Vitest + React Testing Library
- **i18n**: i18next

### Import Aliases

```typescript
@/features/*   // Feature modules
@/services/*   // Service implementations
@/pages/*      // Page components
@/hooks/*      // Custom hooks
@/store/*      // Redux store
@test-utils    // Testing utilities
```

### Feature Categories

**Core Features (Infrastructure - Fixed):**

- `app/` - Application bootstrap and provider composition
- `i18n/` - Internationalization (i18next)
- `router/` - Routing infrastructure (React Router)
- `slice-manager/` - Redux slice lifecycle management
- `ui/` - Mantine theme and design system

**Domain Features (Examples - User Customizable):**

- `wallet/` - Web3 wallet (Provider, Network, Account models)
- `auth/` - Authentication (Session model)
- `blog-demo/` - Blog demo (Post, Author models)

**Users will:**

- Keep core features unchanged (or modify very carefully)
- Remove/modify/replace domain features as needed
- Create new domain features following the model pattern (e.g., products, orders, inventory)

### Configuration Files

- `src/features/wallet/config.ts` - Wallet configuration
- `src/features/ui/mantine/theme.tsx` - Mantine theme
- `vite.config.ts` - Build configuration
- `vitest.config.ts` - Test configuration
