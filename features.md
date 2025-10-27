# Feature Dependencies Analysis Report

This document provides a comprehensive analysis of all cross-feature dependencies in the vite-react-dapp-template project.

---

## Feature Dependency Matrix

### 1. APP FEATURE (Core Infrastructure - Root Composition)

**Location:** `src/features/app/`

**Dependencies:** auth, wallet, blog-demo, router, ui, i18n, slice-manager

| Imported From | What | File | Purpose |
|---|---|---|---|
| @/features/router | Router component | App.tsx | Main routing component |
| @/features/ui | Mantine theme | App.tsx | UI theme configuration |
| @/features/i18n | i18n initialization | App.tsx | Language setup |
| @/features/auth | authSaga, authReducer | store.ts, rootReducer.ts | Redux store integration |
| @/features/wallet | watchWalletSaga, walletReducer | store.ts, rootReducer.ts | Redux store integration |
| @/features/blog-demo | watchBlogDemoSaga, blogDemoReducer | store.ts, rootReducer.ts | Redux store integration |

**Key Role:** Root composition layer that initializes the entire application

---

### 2. ROUTER FEATURE (Core Infrastructure - Route Coordinator)

**Location:** `src/features/router/`

**Dependencies:** auth, wallet, blog-demo, i18n, slice-manager, ui

| Imported From | What | File | Purpose |
|---|---|---|---|
| @/features/auth | withAuthProtection HOC, getAuthRoutes() | Router.tsx, useRoutes.tsx | Route protection & auth routes |
| @/features/wallet | withWalletProtection HOC, usePostLoginRedirect | Router.tsx | Route protection & redirect |
| @/features/blog-demo | configureBlogFeature() | Router.tsx | Feature registration |
| @/features/slice-manager | useSliceManagerInit | Router.tsx | Slice manager initialization |
| @/features/i18n | i18nConfig | Router.tsx, usePages.tsx, usePageLink.tsx, useBreadcrumb.tsx, useActiveRoute.tsx | Language-aware routing |
| @/features/ui | LayoutBase component | Router.tsx | Main layout component |

**Key Role:** Central orchestrator for all routing, protection, and feature configuration

**Router Types Exported (used by other features):**
- MenuType - UI menu components, all router hooks
- PageType - Auth routes definition
- ProtectionType - Auth and wallet protection definitions

---

### 3. UI FEATURE (Core Infrastructure - Visual Composition)

**Location:** `src/features/ui/`

**Dependencies:** auth, wallet, i18n, router

| Imported From | What | File | Purpose |
|---|---|---|---|
| @/features/auth | Auth component | Layout/LayoutBase.tsx | Auth UI in header/navbar |
| @/features/wallet | Wallet component | Layout/LayoutBase.tsx | Wallet UI in header/navbar |
| @/features/i18n | LangMenu, useI18nWatcher | Layout/LayoutBase.tsx | Language switching |
| @/features/router | useActiveRoute, useBreadcrumb, usePageLink, usePages hooks | Layout/LayoutBase.tsx | Route info, breadcrumbs, links |
| @/features/router | MenuType type | MainMenu.tsx, SideNav.tsx, SecondaryMenu.tsx | Menu item structure |

**Key Role:** Main visual shell that composes auth and wallet components

---

### 4. AUTH FEATURE (Domain Feature - Authentication)

**Location:** `src/features/auth/`

**Dependencies:** app, router

| Imported From | What | File | Purpose |
|---|---|---|---|
| @/features/app | RootState type | hooks/useAuth.ts, actionEffects/logout.ts | State access |
| @/features/router | PageType, ProtectionType types | routes.tsx | Route configuration |

**Exported & Referenced By:**
- useAuth hook → wallet, chat, components
- withAuthProtection HOC → router
- getAuthRoutes() → router
- Auth component → ui layout

**Key Role:** Manages authentication state and provides protection wrappers

---

### 5. WALLET FEATURE (Domain Feature - Web3 Wallet)

**Location:** `src/features/wallet/`

**Dependencies:** app, router

| Imported From | What | File | Purpose |
|---|---|---|---|
| @/features/app | RootState type | hooks/usePostLoginRedirect.ts, actionEffects/*.ts | State access |
| @/features/router | usePageLink hook, usePages hook | hooks/usePostLoginRedirect.ts, components/ProfileDropdownMenu.tsx | Navigation, route info |

**Exported & Referenced By:**
- withWalletProtection HOC → router
- usePostLoginRedirect hook → router
- Wallet component → ui layout
- useWalletAuthentication hook → router hooks

**Key Role:** Manages Web3 wallet connections and network switching

---

### 6. BLOG-DEMO FEATURE (Domain Feature - Example Blog)

**Location:** `src/features/blog-demo/`

**Dependencies:** app, router, slice-manager, i18n

| Imported From | What | File | Purpose |
|---|---|---|---|
| @/features/slice-manager | getSliceManager, FeatureRouteConfig, SliceConfig, smartFetch | configureBlogFeature.ts, actionEffects/GetPosts.ts | Slice management & data fetching |
| @/features/app | RootState type | actionEffects/GetPosts.ts | State selectors |
| @/features/i18n | i18n object | hooks/useBlogPosts.ts | Language tracking |
| @/features/router | usePageLink hook | components/Posts/PostItem.tsx | Navigation links |

**Exported & Referenced By:**
- configureBlogFeature() → router
- useBlogPosts hook → components

**Key Role:** Example domain feature demonstrating proper architecture pattern

---

### 7. CHAT FEATURE (Domain Feature - AI Chat)

**Location:** `src/features/chat/`

**Dependencies:** auth

| Imported From | What | File | Purpose |
|---|---|---|---|
| @/features/auth | useAuth hook | runtime/useChatRuntime.ts | User identification |

**Key Role:** Minimal coupling example - only uses auth for user context

---

### 8. I18N FEATURE (Core Infrastructure - Localization)

**Location:** `src/features/i18n/`

**Dependencies:** None from @/features

**Referenced By:** app, router (all hooks), ui, wallet, blog-demo

**Key Role:** Pure infrastructure feature providing localization singleton

---

### 9. SLICE-MANAGER FEATURE (Core Infrastructure - Dynamic State Management)

**Location:** `src/features/slice-manager/`

**Dependencies:** None from @/features

**Referenced By:** router, blog-demo

**Key Role:** Pure infrastructure feature providing slice lifecycle management and smartFetch utility

---

## Dependency Flow Diagram

```
Root Composition:
                          ┌──────────────────────┐
                          │      APP (Root)      │
                          │ Combines all features│
                          └──────────┬───────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
         ┌─────────┐          ┌─────────┐          ┌───────────────┐
         │ ROUTER  │◄────────→│  UI     │          │ SLICE-MANAGER │
         │ (Core)  │          │ (Core)  │          │ (Core)        │
         │Orchestr.│          │Composit.│          │               │
         └────┬────┘          └────┬────┘          └────┬──────────┘
              │                    │                    │
    ┌─────────┼────────┬──────────┘                    │
    ▼         ▼        ▼                               ▼
┌────────┐┌────────┐┌──────────┐                 ┌──────────┐
│ AUTH   ││WALLET  ││BLOG-DEMO │                 │ I18N     │
│(Domain)││(Domain)││(Domain)  │                 │ (Core)   │
└────────┘└────────┘└──────────┘                 └──────────┘

Minimal Domain Feature:
┌────────────┐
│ CHAT       │
│ (Domain)   │
│ auth-only  │
└────────────┘
     │
     ▼
   AUTH
```

---

## Import Analysis by File Type

### Redux Store Files (app/store/) - 3 files
- `store.ts`: Imports 3 sagas + 3 services
- `rootReducer.ts`: Imports 3 reducers
- Total cross-feature imports: 6

### Router/Navigation Files (router/) - 6 files
- `Router.tsx`: 6 feature imports
- `useRoutes.tsx`: 2 feature imports
- `usePages.tsx`: 2 feature imports
- `usePageLink.tsx`: 1 feature import
- `useBreadcrumb.tsx`: 2 feature imports
- `useActiveRoute.tsx`: 1 feature import
- Total cross-feature imports: 14

### UI Layout Files (ui/) - 4 files
- `LayoutBase.tsx`: 7 feature imports
- `MainMenu.tsx`: 1 feature import
- `SideNav.tsx`: 1 feature import
- `SecondaryMenu.tsx`: 1 feature import
- Total cross-feature imports: 10

### Domain Feature Files - 9 files
- Auth (2): useAuth.ts, routes.tsx - 2 imports
- Wallet (3): usePostLoginRedirect.ts, ProfileDropdownMenu.tsx, switchNetwork.ts - 3 imports
- Blog-demo (3): configureBlogFeature.ts, GetPosts.ts, useBlogPosts.ts - 6 imports
- Chat (1): useChatRuntime.ts - 1 import
- Total cross-feature imports: 12

**Grand Total: 22 files with cross-feature dependencies**

---

## Critical Dependency Insights

### 1. Hub Pattern: Router as Orchestrator
The Router feature acts as the central hub coordinating multiple domain features:
- Routes auth protection: `withAuthProtection()`
- Routes wallet protection: `withWalletProtection()`
- Initializes blog configuration: `configureBlogFeature()`
- Sets up slice management: `useSliceManagerInit()`

### 2. Type Exports for Consistency
Router types define interface for other features:
- **MenuType**: Used by UI menus and all router hooks
- **PageType**: Used by auth routes definition
- **ProtectionType**: Used for auth/wallet protection configuration

### 3. RootState Central Point
App's RootState is the single source of truth accessed by:
- auth: useAuth hook
- wallet: usePostLoginRedirect, actionEffects
- blog-demo: GetPosts actionEffect

### 4. Hook Composition Pattern
Router hooks are widely reused:
- `usePageLink()`: wallet, blog-demo components (i18n-aware navigation)
- `usePages()`: wallet hooks, router usePages (route collection)
- `useActiveRoute()`: ui layout (current route detection)
- `useBreadcrumb()`: ui layout (breadcrumb generation)

### 5. Clean Separation: Core vs Domain
- **Core features**: Never import from domain features
- **Domain features**: Only import from app, router, i18n, slice-manager
- **Avoids circular dependencies**: Domain features only go "up" to core

### 6. Minimal Chat Feature Example
The chat feature demonstrates minimal coupling:
- Only imports `useAuth` from auth
- No router, no slice-manager dependencies
- Pure UI feature that uses auth for context

---

## Dependency Summary Table

| Feature | Type | Total Imports | Key Dependencies | Primary Roles |
|---------|------|---------------|-----------------|---------------|
| **app** | Core | 7 | auth, wallet, blog-demo, router, ui | Root composition, store init |
| **router** | Core | 14 | auth, wallet, blog-demo, i18n, slice-manager | Route orchestration |
| **ui** | Core | 10 | router, auth, wallet, i18n | Visual composition |
| **i18n** | Core | 0 | (none) | Pure infrastructure |
| **slice-manager** | Core | 0 | (none) | Pure infrastructure |
| **auth** | Domain | 2 | app, router | Authentication |
| **wallet** | Domain | 2 | app, router | Web3 management |
| **blog-demo** | Domain | 6 | app, router, slice-manager, i18n | Example feature |
| **chat** | Domain | 1 | auth | Minimal example |

**Total Cross-Feature Dependencies: 42**

---

## Quick Reference

### Feature Dependencies (Summary)

**app** uses:
- router
- ui
- i18n
- auth
- wallet
- blog-demo
- slice-manager

**router** uses:
- auth
- wallet
- blog-demo
- i18n
- slice-manager
- ui

**ui** uses:
- auth
- wallet
- i18n
- router

**auth** uses:
- app (RootState)
- router (types)

**wallet** uses:
- app (RootState)
- router

**blog-demo** uses:
- app (RootState)
- router
- slice-manager
- i18n

**chat** uses:
- auth

**i18n** uses:
- (no feature dependencies - pure infrastructure)

**slice-manager** uses:
- (no feature dependencies - pure infrastructure)

---

## Recommendations for New Features

When creating new domain features, follow this pattern:

1. **Structure**: Use `models/` directory with models for each domain entity
2. **Dependencies**: Import only from `app`, `router`, `i18n`, `slice-manager` if needed
3. **Exports**: Create `useActions` and state hooks for external access
4. **Routes**: Define PageType routes and register with router
5. **Types**: Export feature API interface (IFeatureApi) for type safety
6. **Sagas**: Register sagas with app store at initialization time

This ensures minimal coupling and maintains the clean core→domain dependency flow.

---

**Analysis Date:** 2025-10-27
**Project:** vite-react-dapp-template
**Base Path:** `D:\github\vite-react-dapp-template\src\features\`

---

## PROBLEM: Core Features Depend on Domain Features

### Issue Statement

The current architecture has a critical problem: **Core features directly import domain features**, which prevents users from easily deleting domain features (auth, wallet, blog-demo, chat) from the template.

**Core Features (should be stable infrastructure):**
- app
- i18n
- ui
- slice-manager
- router

**Domain Features (should be deletable by users):**
- auth
- wallet
- blog-demo
- chat

### Current Direct Dependencies (PROBLEM)

The following core features have hardcoded imports from domain features:

---

#### 1. APP Feature (Core) → Imports Domain Features

**Location:** `src/features/app/`

| Domain Feature | What is Imported | Files | Impact |
|---|---|---|---|
| **auth** | `authSaga`, `authReducer` | `store/store.ts`, `store/rootReducer.ts` | Redux store hardcoded |
| **wallet** | `watchWalletSaga`, `walletReducer` | `store/store.ts`, `store/rootReducer.ts` | Redux store hardcoded |
| **blog-demo** | `watchBlogDemoSaga`, `blogDemoReducer` | `store/store.ts`, `store/rootReducer.ts` | Redux store hardcoded |

**Problem:** Cannot delete auth/wallet/blog-demo without modifying app's Redux store setup files.

---

#### 2. ROUTER Feature (Core) → Imports Domain Features

**Location:** `src/features/router/`

| Domain Feature | What is Imported | Files | Impact |
|---|---|---|---|
| **auth** | `withAuthProtection` HOC | `Router.tsx` | Route protection hardcoded |
| **auth** | `getAuthRoutes()` | `Router.tsx`, `hooks/useRoutes.tsx` | Auth routes hardcoded |
| **wallet** | `withWalletProtection` HOC | `Router.tsx` | Route protection hardcoded |
| **wallet** | `usePostLoginRedirect` | `Router.tsx` | Post-login logic hardcoded |
| **blog-demo** | `configureBlogFeature()` | `Router.tsx` | Feature config hardcoded |

**Problem:** Cannot delete auth/wallet/blog-demo without modifying router's core routing logic.

---

#### 3. UI Feature (Core) → Imports Domain Features

**Location:** `src/features/ui/`

| Domain Feature | What is Imported | Files | Impact |
|---|---|---|---|
| **auth** | `Auth` component | `Layout/LayoutBase.tsx` | Auth UI hardcoded in header |
| **wallet** | `Wallet` component | `Layout/LayoutBase.tsx` | Wallet UI hardcoded in header |

**Problem:** Cannot delete auth/wallet without modifying UI's base layout component.

---

#### 4. I18N Feature (Core) → No Domain Imports ✅

**Status:** Clean - No domain feature dependencies

---

#### 5. SLICE-MANAGER Feature (Core) → No Domain Imports ✅

**Status:** Clean - No domain feature dependencies

---

### Summary: Core Features with Domain Dependencies

| Core Feature | Imports Domain Features | Affected Files Count | Deletability Issue |
|---|---|---|---|
| **app** | auth, wallet, blog-demo | 2 files (store.ts, rootReducer.ts) | Cannot delete without modifying Redux setup |
| **router** | auth, wallet, blog-demo | 2 files (Router.tsx, useRoutes.tsx) | Cannot delete without modifying routing logic |
| **ui** | auth, wallet | 1 file (LayoutBase.tsx) | Cannot delete without modifying layout |
| **i18n** | (none) | 0 files | ✅ Clean |
| **slice-manager** | (none) | 0 files | ✅ Clean |

**Total Problem Files:** 5 files across 3 core features

---

### Required Refactoring Scope

To make domain features deletable, these core features need dependency injection:

1. **app/store/store.ts** - Must accept sagas array from outside
2. **app/store/rootReducer.ts** - Must accept reducers object from outside
3. **router/Router.tsx** - Must accept HOCs and feature configs from outside
4. **router/hooks/useRoutes.tsx** - Must accept route arrays from outside
5. **ui/Layout/LayoutBase.tsx** - Must accept component slots from outside

**Goal:** Users should only need to:
1. Delete the feature folder (e.g., `src/features/auth/`)
2. Remove registration lines in `app/` feature (central configuration)

**No modifications** should be needed in router, ui, i18n, or slice-manager core features.
