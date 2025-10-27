# Refactor: Make Auth Feature Injectable from App

**Feature:** auth
**Type:** Domain Feature (Deletable)
**Status:** Currently Hardcoded in Core Features
**Priority:** High

---

## Current State Analysis

The `auth` feature is currently hardcoded in 3 core features, preventing users from deleting it:

### 1. APP Feature Dependencies

**Files:** `src/features/app/store/store.ts`, `src/features/app/store/rootReducer.ts`

```typescript
// store.ts - HARDCODED
import { authSaga } from '@/features/auth/sagas';

// rootReducer.ts - HARDCODED
import { authReducer } from '@/features/auth/slice';
```

**Problem:** Redux store directly imports auth saga and reducer.

---

### 2. ROUTER Feature Dependencies

**Files:** `src/features/router/Router.tsx`, `src/features/router/hooks/useRoutes.tsx`

```typescript
// Router.tsx - HARDCODED
import { withAuthProtection } from '@/features/auth/hocs/withAuthProtection';
import { getAuthRoutes } from '@/features/auth/routes';

// useRoutes.tsx - HARDCODED
import { getAuthRoutes } from '@/features/auth/routes';
```

**Problem:** Router directly imports auth HOC and routes.

---

### 3. UI Feature Dependencies

**Files:** `src/features/ui/Layout/LayoutBase.tsx`

```typescript
// LayoutBase.tsx - HARDCODED
import { Auth } from '@/features/auth/components/Auth';

// Usage in render:
<Auth />
```

**Problem:** Layout directly imports and renders Auth component.

---

## Problem Statement

Users cannot delete the `auth` feature without manually modifying:
- 2 files in `app/store/`
- 2 files in `router/`
- 1 file in `ui/Layout/`

**Total:** 5 files across 3 core features

This violates the principle that domain features should be deletable by only removing the feature folder and updating app configuration.

---

## Refactoring Goals

1. **Remove all direct imports** of auth from core features (app, router, ui)
2. **Centralize auth registration** in app feature only
3. **Use dependency injection** to pass auth components/HOCs/routes to core features
4. **Enable easy deletion**: Users should only need to:
   - Delete `src/features/auth/` folder
   - Remove auth registration lines in `src/features/app/`

---

## Proposed Architecture

### Registration Point (Single Location)

**File:** `src/features/app/featureRegistry.ts` (NEW)

```typescript
import { authSaga } from '@/features/auth/sagas';
import { authReducer } from '@/features/auth/slice';
import { withAuthProtection } from '@/features/auth/hocs/withAuthProtection';
import { getAuthRoutes } from '@/features/auth/routes';
import { Auth } from '@/features/auth/components/Auth';

export const featureRegistry = {
  // Redux
  reducers: {
    auth: authReducer,
    // Other domain features...
  },

  sagas: [
    authSaga,
    // Other domain features...
  ],

  // Router
  protectionHOCs: {
    auth: withAuthProtection,
    // Other domain features...
  },

  routes: [
    ...getAuthRoutes(),
    // Other domain features...
  ],

  // UI
  layoutComponents: {
    authSlot: Auth,
    // Other domain features...
  },
};
```

**To delete auth:** Simply remove all auth-related lines from this single file.

---

### Injection Mechanism

#### 1. Redux Store (APP Feature)

**File:** `src/features/app/store/store.ts`

```typescript
// BEFORE (Hardcoded)
import { authSaga } from '@/features/auth/sagas';
const sagaMiddleware = createSagaMiddleware();
sagaMiddleware.run(authSaga);

// AFTER (Injectable)
import { featureRegistry } from '../featureRegistry';
const sagaMiddleware = createSagaMiddleware();
featureRegistry.sagas.forEach(saga => sagaMiddleware.run(saga));
```

**File:** `src/features/app/store/rootReducer.ts`

```typescript
// BEFORE (Hardcoded)
import { authReducer } from '@/features/auth/slice';
export const rootReducer = combineReducers({
  auth: authReducer,
  // ...
});

// AFTER (Injectable)
import { featureRegistry } from '../featureRegistry';
export const rootReducer = combineReducers({
  ...featureRegistry.reducers,
  // Core reducers if any...
});
```

---

#### 2. Router Protection (ROUTER Feature)

**File:** `src/features/router/Router.tsx`

**New Prop Interface:**
```typescript
interface RouterProps {
  protectionHOCs?: {
    auth?: (component: React.ComponentType) => React.ComponentType;
    wallet?: (component: React.ComponentType) => React.ComponentType;
    // Extensible...
  };
  additionalRoutes?: PageType[];
}
```

```typescript
// BEFORE (Hardcoded)
import { withAuthProtection } from '@/features/auth/hocs/withAuthProtection';
const ProtectedComponent = withAuthProtection(SomeComponent);

// AFTER (Injectable)
export function Router({ protectionHOCs = {}, additionalRoutes = [] }: RouterProps) {
  const applyProtection = (component, protection) => {
    if (protection === 'auth' && protectionHOCs.auth) {
      return protectionHOCs.auth(component);
    }
    // ... other protections
    return component;
  };

  // Use applyProtection instead of direct HOC calls
}
```

**File:** `src/features/router/hooks/useRoutes.tsx`

```typescript
// BEFORE (Hardcoded)
import { getAuthRoutes } from '@/features/auth/routes';
const authRoutes = getAuthRoutes();

// AFTER (Injectable)
// Receives routes from Router props, no direct import
```

---

#### 3. UI Layout Components (UI Feature)

**File:** `src/features/ui/Layout/LayoutBase.tsx`

**New Prop Interface:**
```typescript
interface LayoutBaseProps {
  authSlot?: React.ComponentType;
  walletSlot?: React.ComponentType;
  // Other optional slots...
}
```

```typescript
// BEFORE (Hardcoded)
import { Auth } from '@/features/auth/components/Auth';

export function LayoutBase() {
  return (
    <AppShell>
      <Auth />
    </AppShell>
  );
}

// AFTER (Injectable)
export function LayoutBase({ authSlot: AuthComponent, walletSlot: WalletComponent }: LayoutBaseProps) {
  return (
    <AppShell>
      {AuthComponent && <AuthComponent />}
      {WalletComponent && <WalletComponent />}
    </AppShell>
  );
}
```

---

#### 4. Root App Composition (APP Feature)

**File:** `src/features/app/App.tsx`

```typescript
// Wire everything together
import { featureRegistry } from './featureRegistry';
import { Router } from '@/features/router';
import { LayoutBase } from '@/features/ui/Layout/LayoutBase';

export function App() {
  return (
    <Provider store={store}>
      <Router
        protectionHOCs={featureRegistry.protectionHOCs}
        additionalRoutes={featureRegistry.routes}
      >
        <LayoutBase
          authSlot={featureRegistry.layoutComponents.authSlot}
          walletSlot={featureRegistry.layoutComponents.walletSlot}
        />
      </Router>
    </Provider>
  );
}
```

---

## Detailed Implementation Steps

### Phase 1: Create Feature Registry (APP)

**Step 1.1:** Create `src/features/app/featureRegistry.ts`
- Define registry structure
- Import all domain features (auth, wallet, blog-demo)
- Export single `featureRegistry` object

**Step 1.2:** Add TypeScript interfaces
- `FeatureRegistry` interface
- `ProtectionHOCs` interface
- `LayoutComponents` interface

**Files to Create:**
- `src/features/app/featureRegistry.ts`
- `src/features/app/types/FeatureRegistry.ts` (optional, for types)

---

### Phase 2: Refactor Redux Store (APP)

**Step 2.1:** Modify `src/features/app/store/rootReducer.ts`
- Remove direct imports of `authReducer`, `walletReducer`, `blogDemoReducer`
- Import `featureRegistry`
- Spread `featureRegistry.reducers` into `combineReducers()`

**Step 2.2:** Modify `src/features/app/store/store.ts`
- Remove direct imports of sagas
- Import `featureRegistry`
- Loop through `featureRegistry.sagas` to run all sagas

**Step 2.3:** Update `RootState` type inference
- Ensure TypeScript correctly infers state shape from dynamic reducers

**Files to Modify:**
- `src/features/app/store/rootReducer.ts`
- `src/features/app/store/store.ts`

---

### Phase 3: Refactor Router (ROUTER)

**Step 3.1:** Add props to Router component
- Add `RouterProps` interface with `protectionHOCs` and `additionalRoutes`
- Make props optional with defaults

**Step 3.2:** Create protection resolver utility
- Function `applyProtection(component, protectionType, hocs)`
- Dynamically applies HOCs based on route protection config

**Step 3.3:** Refactor route protection logic
- Remove direct `withAuthProtection`, `withWalletProtection` imports
- Use `applyProtection()` with injected HOCs

**Step 3.4:** Integrate additional routes
- Merge `additionalRoutes` prop with core routes
- Remove direct `getAuthRoutes()` import

**Step 3.5:** Update `useRoutes` hook
- Remove direct imports of domain feature routes
- Access routes from context or parent

**Files to Modify:**
- `src/features/router/Router.tsx`
- `src/features/router/hooks/useRoutes.tsx`
- `src/features/router/types.ts` (add RouterProps)

---

### Phase 4: Refactor UI Layout (UI)

**Step 4.1:** Add props to LayoutBase
- Add `LayoutBaseProps` interface with component slots
- `authSlot?: React.ComponentType`
- `walletSlot?: React.ComponentType`

**Step 4.2:** Refactor component rendering
- Remove direct imports of Auth, Wallet
- Conditionally render slot components if provided

**Step 4.3:** Update layout composition
- Use optional rendering: `{AuthComponent && <AuthComponent />}`

**Files to Modify:**
- `src/features/ui/Layout/LayoutBase.tsx`

---

### Phase 5: Wire Everything in App (APP)

**Step 5.1:** Update `src/features/app/App.tsx`
- Import `featureRegistry`
- Pass `protectionHOCs` to Router
- Pass `additionalRoutes` to Router
- Pass component slots to LayoutBase

**Step 5.2:** Verify prop drilling
- Ensure all injected values reach their destinations

**Files to Modify:**
- `src/features/app/App.tsx`

---

### Phase 6: Testing & Verification

**Step 6.1:** Run existing tests
```bash
npm run test
npm run lint
npm run build
```

**Step 6.2:** Manual testing
- Verify auth login/logout works
- Verify protected routes work
- Verify Auth component renders in layout

**Step 6.3:** Test deletion scenario
- Comment out all auth lines in `featureRegistry.ts`
- Verify app builds and runs without auth
- Uncomment and verify it works again

---

### Phase 7: Update Documentation

**Step 7.1:** Update CLAUDE.md
- Document new `featureRegistry.ts` pattern
- Update "How to delete a domain feature" instructions

**Step 7.2:** Add code comments
- Comment the registry pattern in `featureRegistry.ts`
- Add JSDoc to new prop interfaces

**Files to Modify:**
- `CLAUDE.md`
- `README.md` (if applicable)

---

## Files Summary

### Files to Create (1)
- `src/features/app/featureRegistry.ts`

### Files to Modify (7)
1. `src/features/app/store/store.ts`
2. `src/features/app/store/rootReducer.ts`
3. `src/features/app/App.tsx`
4. `src/features/router/Router.tsx`
5. `src/features/router/hooks/useRoutes.tsx`
6. `src/features/ui/Layout/LayoutBase.tsx`
7. `CLAUDE.md`

### Files to NOT Modify
- All files in `src/features/auth/` (leave as-is)
- All files in `src/features/wallet/` (separate plan)
- All files in `src/features/blog-demo/` (separate plan)
- All files in `src/features/i18n/` (no changes needed)
- All files in `src/features/slice-manager/` (no changes needed)

---

## Testing Strategy

### Unit Tests
- Test `featureRegistry` exports correct structure
- Test Router applies protections correctly when HOCs provided
- Test Router works without protections when HOCs not provided
- Test LayoutBase renders slots when provided
- Test LayoutBase works without slots when not provided

### Integration Tests
- Test auth login flow end-to-end
- Test protected route access
- Test store correctly includes auth reducer
- Test auth saga runs correctly

### Regression Tests
- All existing tests must pass
- No TypeScript errors
- Linting passes with 0 warnings
- Build succeeds

### Deletion Test (Manual)
1. Comment out auth in `featureRegistry.ts`
2. Run `npm run build` - should succeed
3. Run `npm run test` - should pass (or skip auth tests)
4. Start dev server - should work without auth
5. Uncomment auth
6. Verify everything works again

---

## Success Criteria

✅ **Auth is only imported in app/featureRegistry.ts**
✅ **Router accepts HOCs and routes via props**
✅ **UI accepts component slots via props**
✅ **All tests pass**
✅ **Build succeeds**
✅ **Lint passes with 0 warnings**
✅ **Commenting out auth in featureRegistry makes it deletable**
✅ **No hardcoded auth imports remain in core features**

---

## Migration Guide for Users

### Before (Hard to Delete)
```
❌ To delete auth:
1. Delete src/features/auth/
2. Modify src/features/app/store/store.ts
3. Modify src/features/app/store/rootReducer.ts
4. Modify src/features/router/Router.tsx
5. Modify src/features/router/hooks/useRoutes.tsx
6. Modify src/features/ui/Layout/LayoutBase.tsx
7. Fix TypeScript errors in 5+ files
```

### After (Easy to Delete)
```
✅ To delete auth:
1. Delete src/features/auth/
2. Remove auth lines from src/features/app/featureRegistry.ts
   - Remove authReducer from reducers
   - Remove authSaga from sagas
   - Remove withAuthProtection from protectionHOCs
   - Remove getAuthRoutes() from routes
   - Remove Auth from layoutComponents
3. Done! ✨
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| TypeScript inference breaks for RootState | High | Explicitly type featureRegistry.reducers |
| HOC application order matters | Medium | Document HOC application order, test edge cases |
| Props drilling becomes complex | Low | Keep registry flat, consider context if needed |
| Circular dependencies | Medium | Keep featureRegistry in app, imports flow one direction |
| Performance impact from dynamic checks | Low | HOC resolution happens once at render, negligible impact |

---

## Future Enhancements

1. **Auto-discovery:** Scan features/ directory and auto-register (advanced)
2. **Feature flags:** Enable/disable features at runtime
3. **Lazy loading:** Load domain features on-demand
4. **Plugin system:** Third-party features can register themselves
5. **CLI tool:** `npm run remove-feature auth` automated deletion

---

**Next Steps:** Proceed with Phase 1 - Create Feature Registry
