# Refactor: Make Wallet Feature Injectable from App

**Feature:** wallet
**Type:** Domain Feature (Deletable)
**Status:** Currently Hardcoded in Core Features
**Priority:** High

---

## Current State Analysis

The `wallet` feature is currently hardcoded in 3 core features, preventing users from deleting it:

### 1. APP Feature Dependencies

**Files:** `src/features/app/store/store.ts`, `src/features/app/store/rootReducer.ts`

```typescript
// store.ts - HARDCODED
import { watchWalletSaga } from '@/features/wallet/sagas';

// rootReducer.ts - HARDCODED
import { walletReducer } from '@/features/wallet/slice';
```

**Problem:** Redux store directly imports wallet saga and reducer.

---

### 2. ROUTER Feature Dependencies

**Files:** `src/features/router/Router.tsx`

```typescript
// Router.tsx - HARDCODED
import { withWalletProtection } from '@/features/wallet/hocs/withWalletProtection';
import { usePostLoginRedirect } from '@/features/wallet/hooks/usePostLoginRedirect';
```

**Problem:** Router directly imports wallet HOC and hook.

---

### 3. UI Feature Dependencies

**Files:** `src/features/ui/Layout/LayoutBase.tsx`

```typescript
// LayoutBase.tsx - HARDCODED
import { Wallet } from '@/features/wallet/components/Wallet';

// Usage in render:
<Wallet />
```

**Problem:** Layout directly imports and renders Wallet component.

---

## Problem Statement

Users cannot delete the `wallet` feature without manually modifying:
- 2 files in `app/store/`
- 1 file in `router/`
- 1 file in `ui/Layout/`

**Total:** 4 files across 3 core features

This violates the principle that domain features should be deletable by only removing the feature folder and updating app configuration.

---

## Refactoring Goals

1. **Remove all direct imports** of wallet from core features (app, router, ui)
2. **Centralize wallet registration** in app feature only
3. **Use dependency injection** to pass wallet components/HOCs/hooks to core features
4. **Enable easy deletion**: Users should only need to:
   - Delete `src/features/wallet/` folder
   - Remove wallet registration lines in `src/features/app/`

---

## Proposed Architecture

### Registration Point (Single Location)

**File:** `src/features/app/featureRegistry.ts` (SHARED with auth plan)

```typescript
import { watchWalletSaga } from '@/features/wallet/sagas';
import { walletReducer } from '@/features/wallet/slice';
import { withWalletProtection } from '@/features/wallet/hocs/withWalletProtection';
import { Wallet } from '@/features/wallet/components/Wallet';

export const featureRegistry = {
  // Redux
  reducers: {
    wallet: walletReducer,
    // Other domain features...
  },

  sagas: [
    watchWalletSaga,
    // Other domain features...
  ],

  // Router
  protectionHOCs: {
    wallet: withWalletProtection,
    // Other domain features...
  },

  routes: [
    // Wallet doesn't provide routes, but structure is here for consistency
  ],

  // UI
  layoutComponents: {
    walletSlot: Wallet,
    // Other domain features...
  },

  // Hooks (NEW - for router-specific hooks)
  routerHooks: {
    usePostLoginRedirect: usePostLoginRedirect,
  },
};
```

**To delete wallet:** Simply remove all wallet-related lines from this single file.

---

### Special Consideration: Router Hooks

The wallet feature exports `usePostLoginRedirect` hook that is used by the Router. This is a special case that needs careful handling:

**Option A: Make it optional in Router**
```typescript
// Router can work without this hook
const { postLoginRedirect } = routerHooks?.usePostLoginRedirect?.() ?? {};
```

**Option B: Provide default implementation**
```typescript
// Default no-op implementation if wallet not present
const defaultPostLoginRedirect = () => ({ redirect: null });
```

**Chosen Approach:** Option A - Make it fully optional

---

### Injection Mechanism

#### 1. Redux Store (APP Feature)

**File:** `src/features/app/store/store.ts`

```typescript
// BEFORE (Hardcoded)
import { watchWalletSaga } from '@/features/wallet/sagas';
const sagaMiddleware = createSagaMiddleware();
sagaMiddleware.run(watchWalletSaga);

// AFTER (Injectable)
import { featureRegistry } from '../featureRegistry';
const sagaMiddleware = createSagaMiddleware();
featureRegistry.sagas.forEach(saga => sagaMiddleware.run(saga));
```

**File:** `src/features/app/store/rootReducer.ts`

```typescript
// BEFORE (Hardcoded)
import { walletReducer } from '@/features/wallet/slice';
export const rootReducer = combineReducers({
  wallet: walletReducer,
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
  routerHooks?: {
    usePostLoginRedirect?: () => any;
    // Other router-specific hooks...
  };
  additionalRoutes?: PageType[];
}
```

```typescript
// BEFORE (Hardcoded)
import { withWalletProtection } from '@/features/wallet/hocs/withWalletProtection';
import { usePostLoginRedirect } from '@/features/wallet/hooks/usePostLoginRedirect';

const ProtectedComponent = withWalletProtection(SomeComponent);
const { redirect } = usePostLoginRedirect();

// AFTER (Injectable)
export function Router({
  protectionHOCs = {},
  routerHooks = {},
  additionalRoutes = []
}: RouterProps) {
  // Apply protection dynamically
  const applyProtection = (component, protection) => {
    if (protection === 'wallet' && protectionHOCs.wallet) {
      return protectionHOCs.wallet(component);
    }
    return component;
  };

  // Use hook if provided
  const postLoginData = routerHooks.usePostLoginRedirect?.() ?? null;

  // Use applyProtection and postLoginData instead of direct imports
}
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
import { Wallet } from '@/features/wallet/components/Wallet';

export function LayoutBase() {
  return (
    <AppShell>
      <Wallet />
    </AppShell>
  );
}

// AFTER (Injectable)
export function LayoutBase({
  authSlot: AuthComponent,
  walletSlot: WalletComponent
}: LayoutBaseProps) {
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
        routerHooks={featureRegistry.routerHooks}
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

### Phase 1: Update Feature Registry (APP)

**Step 1.1:** Update `src/features/app/featureRegistry.ts`
- Add wallet imports
- Add `walletReducer` to reducers
- Add `watchWalletSaga` to sagas
- Add `withWalletProtection` to protectionHOCs
- Add `Wallet` component to layoutComponents
- Add `usePostLoginRedirect` to routerHooks (NEW section)

**Step 1.2:** Update TypeScript interfaces
- Add `routerHooks` field to `FeatureRegistry` interface
- Define `RouterHooks` interface

**Files to Modify:**
- `src/features/app/featureRegistry.ts`
- `src/features/app/types/FeatureRegistry.ts` (if separate)

---

### Phase 2: Refactor Redux Store (APP)

**Same as auth plan - already handles multiple features via loop**

**Step 2.1:** Verify `src/features/app/store/rootReducer.ts`
- Confirm it spreads `featureRegistry.reducers`
- Wallet reducer will be included automatically

**Step 2.2:** Verify `src/features/app/store/store.ts`
- Confirm it loops through `featureRegistry.sagas`
- Wallet saga will be run automatically

**Files to Verify (no changes if auth plan already done):**
- `src/features/app/store/rootReducer.ts`
- `src/features/app/store/store.ts`

---

### Phase 3: Refactor Router (ROUTER)

**Step 3.1:** Add `routerHooks` prop to Router component
- Update `RouterProps` interface with `routerHooks` field
- Make prop optional with default empty object

**Step 3.2:** Refactor `usePostLoginRedirect` usage
- Remove direct import of `usePostLoginRedirect`
- Call hook from `routerHooks` prop if provided
- Handle case where hook is not provided (wallet deleted)

**Step 3.3:** Update protection logic
- Ensure `withWalletProtection` is applied via `applyProtection()` utility
- Remove direct import of `withWalletProtection`

**Step 3.4:** Test Router without wallet
- Router must work when `routerHooks.usePostLoginRedirect` is undefined
- Router must work when `protectionHOCs.wallet` is undefined

**Files to Modify:**
- `src/features/router/Router.tsx`
- `src/features/router/types.ts` (add routerHooks to RouterProps)

---

### Phase 4: Refactor UI Layout (UI)

**Same as auth plan - already handles multiple slots**

**Step 4.1:** Verify `src/features/ui/Layout/LayoutBase.tsx`
- Confirm it accepts `walletSlot` prop
- Confirm it conditionally renders wallet component
- Wallet component will be passed from featureRegistry automatically

**Files to Verify (no changes if auth plan already done):**
- `src/features/ui/Layout/LayoutBase.tsx`

---

### Phase 5: Wire Everything in App (APP)

**Step 5.1:** Update `src/features/app/App.tsx`
- Pass `routerHooks` to Router component (NEW)
- Pass `protectionHOCs` to Router
- Pass `layoutComponents.walletSlot` to LayoutBase

**Step 5.2:** Verify prop drilling
- Ensure `routerHooks` reaches Router
- Ensure `walletSlot` reaches LayoutBase

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
- Verify wallet connection works
- Verify wallet-protected routes work
- Verify Wallet component renders in layout
- Verify post-login redirect works

**Step 6.3:** Test deletion scenario
- Comment out all wallet lines in `featureRegistry.ts`
- Verify app builds and runs without wallet
- Verify no wallet UI appears
- Verify wallet-protected routes are not accessible
- Uncomment and verify it works again

---

### Phase 7: Update Documentation

**Step 7.1:** Update CLAUDE.md
- Document `routerHooks` pattern in featureRegistry
- Update "How to delete wallet feature" instructions

**Step 7.2:** Add code comments
- Comment the routerHooks pattern
- Explain why hooks need special handling

**Files to Modify:**
- `CLAUDE.md`
- `README.md` (if applicable)

---

## Files Summary

### Files to Create (0)
- None (featureRegistry.ts created in auth plan)

### Files to Modify (4)
1. `src/features/app/featureRegistry.ts` (add wallet)
2. `src/features/app/App.tsx` (pass routerHooks)
3. `src/features/router/Router.tsx` (accept and use routerHooks)
4. `CLAUDE.md` (document routerHooks)

### Files Already Modified by Auth Plan (4)
1. `src/features/app/store/store.ts` (already loops sagas)
2. `src/features/app/store/rootReducer.ts` (already spreads reducers)
3. `src/features/ui/Layout/LayoutBase.tsx` (already accepts slots)
4. `src/features/router/Router.tsx` (already accepts protectionHOCs)

### Files to NOT Modify
- All files in `src/features/wallet/` (leave as-is)
- All files in `src/features/auth/` (separate plan)
- All files in `src/features/blog-demo/` (separate plan)
- All files in `src/features/i18n/` (no changes needed)
- All files in `src/features/slice-manager/` (no changes needed)

---

## Testing Strategy

### Unit Tests
- Test Router works when `routerHooks` not provided
- Test Router works when `routerHooks.usePostLoginRedirect` is undefined
- Test Router calls `usePostLoginRedirect` when provided
- Test LayoutBase doesn't render Wallet when `walletSlot` not provided
- Test wallet protection applies correctly when HOC provided

### Integration Tests
- Test wallet connection flow end-to-end
- Test wallet-protected route access
- Test post-login redirect works correctly
- Test store correctly includes wallet reducer
- Test wallet saga runs correctly

### Regression Tests
- All existing tests must pass
- No TypeScript errors
- Linting passes with 0 warnings
- Build succeeds

### Deletion Test (Manual)
1. Comment out wallet in `featureRegistry.ts`
2. Run `npm run build` - should succeed
3. Run `npm run test` - should pass (or skip wallet tests)
4. Start dev server - should work without wallet
5. Verify no wallet UI appears
6. Verify wallet-protected routes don't work
7. Uncomment wallet
8. Verify everything works again

---

## Success Criteria

✅ **Wallet is only imported in app/featureRegistry.ts**
✅ **Router accepts routerHooks via props**
✅ **Router works without wallet hooks**
✅ **UI accepts walletSlot via props**
✅ **All tests pass**
✅ **Build succeeds**
✅ **Lint passes with 0 warnings**
✅ **Commenting out wallet in featureRegistry makes it deletable**
✅ **No hardcoded wallet imports remain in core features**

---

## Migration Guide for Users

### Before (Hard to Delete)
```
❌ To delete wallet:
1. Delete src/features/wallet/
2. Modify src/features/app/store/store.ts
3. Modify src/features/app/store/rootReducer.ts
4. Modify src/features/router/Router.tsx
5. Modify src/features/ui/Layout/LayoutBase.tsx
6. Fix TypeScript errors in 4+ files
```

### After (Easy to Delete)
```
✅ To delete wallet:
1. Delete src/features/wallet/
2. Remove wallet lines from src/features/app/featureRegistry.ts
   - Remove walletReducer from reducers
   - Remove watchWalletSaga from sagas
   - Remove withWalletProtection from protectionHOCs
   - Remove Wallet from layoutComponents
   - Remove usePostLoginRedirect from routerHooks
3. Done! ✨
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hook calling rules violated | High | Call hooks at top level, use optional chaining |
| Router breaks without wallet | High | Test thoroughly without wallet, provide fallbacks |
| Post-login redirect logic complex | Medium | Keep logic in wallet feature, router just calls it |
| TypeScript inference breaks for hook return types | Medium | Explicitly type routerHooks interface |
| Multiple HOCs interact unexpectedly | Low | Document HOC application order, test combinations |

---

## Special Considerations

### Router Hooks Pattern

Unlike components and HOCs, **hooks cannot be passed as props and called conditionally**. This requires special handling:

**Problem:**
```typescript
// ❌ WRONG - Violates Rules of Hooks
const MyHook = props.someHook;
if (MyHook) {
  const data = MyHook(); // Conditional hook call!
}
```

**Solution:**
```typescript
// ✅ CORRECT - Call at top level with optional chaining
const data = props.hooks?.usePostLoginRedirect?.() ?? null;
```

**Key Rules:**
1. Always call hooks at top level
2. Use optional chaining for optional hooks
3. Provide sensible defaults when hook not present
4. Document expected hook signatures in TypeScript

---

## Future Enhancements

1. **Hook registry validation:** Validate hook signatures at runtime
2. **Hook composition:** Allow features to compose multiple hooks
3. **Lazy hook loading:** Load hooks on-demand for performance
4. **Hook mocking:** Easier testing with mock hooks
5. **Hook documentation:** Auto-generate docs for registered hooks

---

**Next Steps:** Proceed with Phase 1 - Update Feature Registry
