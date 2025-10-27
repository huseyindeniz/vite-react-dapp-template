# Feature Injection Refactoring - Master Plan

**Objective:** Make all domain features deletable by centralizing their registration in the `app` feature only.

**Problem:** Core features (app, router, ui) currently have hardcoded imports of domain features (auth, wallet, blog-demo, chat), making them impossible to delete without modifying multiple core files.

**Solution:** Implement dependency injection pattern where all domain features are registered in `app/featureRegistry.ts` and injected into core features via props.

---

## Overview

### Current Architecture (PROBLEM)

```
┌─────────────────────────────────────────────────────────────┐
│                     CORE FEATURES                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   APP    │  │  ROUTER  │  │    UI    │                  │
│  │          │  │          │  │          │                  │
│  │ import   │  │ import   │  │ import   │                  │
│  │ auth ❌  │  │ auth ❌  │  │ auth ❌  │                  │
│  │ wallet ❌│  │ wallet ❌│  │ wallet ❌│                  │
│  │ blog ❌  │  │ blog ❌  │  │          │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
         ↓              ↓              ↓
┌─────────────────────────────────────────────────────────────┐
│                   DOMAIN FEATURES                            │
│     ┌──────┐  ┌────────┐  ┌───────────┐  ┌──────┐         │
│     │ Auth │  │ Wallet │  │ Blog-Demo │  │ Chat │         │
│     └──────┘  └────────┘  └───────────┘  └──────┘         │
│                                                              │
│  ❌ CANNOT DELETE - Core features break!                   │
└─────────────────────────────────────────────────────────────┘
```

### Target Architecture (SOLUTION)

```
┌─────────────────────────────────────────────────────────────┐
│                     CORE FEATURES                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   APP    │  │  ROUTER  │  │    UI    │                  │
│  │          │  │          │  │          │                  │
│  │ NO       │  │ Accepts  │  │ Accepts  │                  │
│  │ domain   │  │ props ✅ │  │ props ✅ │                  │
│  │ imports  │  │          │  │          │                  │
│  └─────┬────┘  └──────────┘  └──────────┘                  │
│        │                                                     │
│    ┌───▼────────────┐                                       │
│    │FeatureRegistry │ ◄─── ONLY place domain features      │
│    │    (NEW)       │      are imported                     │
│    └───┬────────────┘                                       │
│        │ Injects via props                                  │
└────────┼─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   DOMAIN FEATURES                            │
│     ┌──────┐  ┌────────┐  ┌───────────┐  ┌──────┐         │
│     │ Auth │  │ Wallet │  │ Blog-Demo │  │ Chat │         │
│     └──────┘  └────────┘  └───────────┘  └──────┘         │
│                                                              │
│  ✅ CAN DELETE - Just remove from registry!                │
└─────────────────────────────────────────────────────────────┘
```

---

## Problem Analysis Summary

### Core Features with Domain Dependencies

| Core Feature | Depends On | Files Affected | Priority |
|--------------|------------|----------------|----------|
| **app** | auth, wallet, blog-demo | 2 files (store.ts, rootReducer.ts) | High |
| **router** | auth, wallet, blog-demo | 2 files (Router.tsx, useRoutes.tsx) | High |
| **ui** | auth, wallet | 1 file (LayoutBase.tsx) | High |
| **i18n** | (none) | 0 files ✅ | N/A |
| **slice-manager** | (none) | 0 files ✅ | N/A |

**Total Problem Files:** 5 files across 3 core features

---

## Refactoring Strategy

### Phase 0: Planning (CURRENT PHASE)

**Status:** ✅ Complete

**Deliverables:**
- ✅ Feature dependency analysis (features.md)
- ✅ Problem identification report (features.md)
- ✅ Individual refactoring plans:
  - ✅ Auth feature injection plan
  - ✅ Wallet feature injection plan
  - ✅ Blog-demo feature injection plan
  - ✅ Chat feature injection plan
- ✅ Master plan (this document)

---

### Phase 1: Create Feature Registry (APP)

**Priority:** Critical - Foundation for all other work

**Goal:** Create central registration point for all domain features.

**New File:** `src/features/app/featureRegistry.ts`

**Structure:**
```typescript
export const featureRegistry = {
  // Redux
  reducers: {
    auth: authReducer,
    wallet: walletReducer,
    blogDemo: blogDemoReducer,
  },

  sagas: [
    authSaga,
    watchWalletSaga,
    watchBlogDemoSaga,
  ],

  // Router
  protectionHOCs: {
    auth: withAuthProtection,
    wallet: withWalletProtection,
  },

  routes: [
    ...getAuthRoutes(),
  ],

  routerHooks: {
    usePostLoginRedirect: usePostLoginRedirect,
  },

  featureConfigurators: [
    configureBlogFeature,
  ],

  // UI
  layoutComponents: {
    authSlot: Auth,
    walletSlot: Wallet,
  },
};
```

**Deliverables:**
- Create `featureRegistry.ts`
- Define TypeScript interfaces
- Import all domain features
- Export single registry object

**Testing:**
- Registry exports correct structure
- All domain features imported correctly
- TypeScript validates registry shape

**Estimated Effort:** 2-4 hours

**Dependencies:** None

**See:** `issues/refactor-auth-feature-injection.md` (Phase 1)

---

### Phase 2: Refactor Redux Store (APP)

**Priority:** High - Enables domain feature deletion from store

**Goal:** Make Redux store accept reducers and sagas from feature registry.

**Files to Modify:**
- `src/features/app/store/store.ts`
- `src/features/app/store/rootReducer.ts`

**Changes:**
```typescript
// Before
import { authReducer } from '@/features/auth/slice';
import { authSaga } from '@/features/auth/sagas';

// After
import { featureRegistry } from '../featureRegistry';

// Loop through registered reducers and sagas
const rootReducer = combineReducers({
  ...featureRegistry.reducers,
});

featureRegistry.sagas.forEach(saga => sagaMiddleware.run(saga));
```

**Deliverables:**
- Remove direct domain feature imports
- Import from featureRegistry
- Dynamic reducer registration
- Dynamic saga registration

**Testing:**
- All existing Redux tests pass
- Store contains all registered reducers
- All registered sagas run
- State shape remains correct

**Estimated Effort:** 2-3 hours

**Dependencies:** Phase 1 (Feature Registry)

**See:**
- `issues/refactor-auth-feature-injection.md` (Phase 2)
- `issues/refactor-wallet-feature-injection.md` (Phase 2)
- `issues/refactor-blog-demo-feature-injection.md` (Phase 2)

---

### Phase 3: Refactor Router (ROUTER)

**Priority:** High - Enables domain feature deletion from routing

**Goal:** Make Router accept HOCs, hooks, routes, and configurators via props.

**Files to Modify:**
- `src/features/router/Router.tsx`
- `src/features/router/hooks/useRoutes.tsx`
- `src/features/router/types.ts`

**Changes:**
```typescript
// New props interface
interface RouterProps {
  protectionHOCs?: Record<string, HOC>;
  routerHooks?: Record<string, Hook>;
  additionalRoutes?: PageType[];
  featureConfigurators?: Array<(config: FeatureConfig) => void>;
}

// Dynamic HOC application
const applyProtection = (component, protectionType) => {
  const hoc = protectionHOCs[protectionType];
  return hoc ? hoc(component) : component;
};

// Execute feature configurators
featureConfigurators.forEach(configurator => {
  configurator({ routes, protections });
});
```

**Deliverables:**
- Add RouterProps interface
- Accept injected HOCs, hooks, routes
- Remove direct domain feature imports
- Dynamic protection application
- Feature configurator execution

**Testing:**
- Router works with all props provided
- Router works with empty props
- Protected routes work correctly
- Auth routes appear correctly
- Blog-demo configuration works

**Estimated Effort:** 4-6 hours

**Dependencies:** Phase 1 (Feature Registry)

**See:**
- `issues/refactor-auth-feature-injection.md` (Phase 3)
- `issues/refactor-wallet-feature-injection.md` (Phase 3)
- `issues/refactor-blog-demo-feature-injection.md` (Phase 3)

---

### Phase 4: Refactor UI Layout (UI)

**Priority:** High - Enables domain feature deletion from UI

**Goal:** Make LayoutBase accept component slots via props.

**Files to Modify:**
- `src/features/ui/Layout/LayoutBase.tsx`

**Changes:**
```typescript
// New props interface
interface LayoutBaseProps {
  authSlot?: React.ComponentType;
  walletSlot?: React.ComponentType;
}

// Conditional rendering
export function LayoutBase({ authSlot: AuthComponent, walletSlot: WalletComponent }) {
  return (
    <AppShell>
      {AuthComponent && <AuthComponent />}
      {WalletComponent && <WalletComponent />}
    </AppShell>
  );
}
```

**Deliverables:**
- Add LayoutBaseProps interface
- Accept component slots
- Remove direct domain feature imports
- Conditional slot rendering

**Testing:**
- Layout renders with all slots provided
- Layout renders with no slots provided
- Auth component appears when provided
- Wallet component appears when provided

**Estimated Effort:** 1-2 hours

**Dependencies:** Phase 1 (Feature Registry)

**See:**
- `issues/refactor-auth-feature-injection.md` (Phase 4)
- `issues/refactor-wallet-feature-injection.md` (Phase 4)

---

### Phase 5: Wire Everything Together (APP)

**Priority:** Critical - Connects registry to core features

**Goal:** Pass all registered values from featureRegistry to core features.

**Files to Modify:**
- `src/features/app/App.tsx`

**Changes:**
```typescript
import { featureRegistry } from './featureRegistry';

export function App() {
  return (
    <Provider store={store}>
      <Router
        protectionHOCs={featureRegistry.protectionHOCs}
        routerHooks={featureRegistry.routerHooks}
        additionalRoutes={featureRegistry.routes}
        featureConfigurators={featureRegistry.featureConfigurators}
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

**Deliverables:**
- Import featureRegistry
- Pass all values to core features
- Verify prop drilling works

**Testing:**
- All features work end-to-end
- Auth login/logout works
- Wallet connection works
- Blog-demo pages load
- Protected routes work

**Estimated Effort:** 1-2 hours

**Dependencies:** Phases 1-4 (All previous phases)

**See:**
- `issues/refactor-auth-feature-injection.md` (Phase 5)
- `issues/refactor-wallet-feature-injection.md` (Phase 5)
- `issues/refactor-blog-demo-feature-injection.md` (Phase 5)

---

### Phase 6: Testing & Verification

**Priority:** Critical - Ensures refactoring didn't break anything

**Goal:** Comprehensive testing of all functionality.

**Test Categories:**

1. **Unit Tests**
   - Feature registry structure
   - Router protection application
   - Layout slot rendering
   - All existing unit tests

2. **Integration Tests**
   - Auth flow (login, logout, protected routes)
   - Wallet flow (connect, disconnect, protected routes)
   - Blog-demo (navigation, data fetching)
   - Redux state management
   - Saga execution

3. **Regression Tests**
   - `npm run test` - All tests pass
   - `npm run lint` - 0 warnings
   - `npm run build` - Successful build
   - Manual smoke testing

4. **Deletion Tests** (Critical - Main Goal)
   - Comment out auth in featureRegistry
   - Verify app builds and runs
   - Uncomment and verify it works
   - Repeat for wallet, blog-demo, chat

**Deliverables:**
- All tests pass
- No TypeScript errors
- No ESLint warnings
- Successful production build
- Domain features are deletable

**Estimated Effort:** 4-6 hours

**Dependencies:** Phase 5 (Wiring Complete)

**See:** All individual plans (Phase 6)

---

### Phase 7: Documentation Updates

**Priority:** Medium - Helps users understand new patterns

**Goal:** Document new architecture and usage patterns.

**Files to Modify:**
- `CLAUDE.md`
- `README.md`
- Inline code comments

**New Documentation Sections:**

1. **Feature Registry Pattern**
   - What it is
   - How to register features
   - How to delete features

2. **Domain Feature Deletion Guide**
   - Step-by-step instructions
   - Before/after comparison
   - Common pitfalls

3. **Creating New Domain Features**
   - When to use registry
   - What to register
   - Best practices

4. **Architecture Diagrams**
   - Old vs new architecture
   - Dependency flow
   - Injection mechanism

**Deliverables:**
- Updated CLAUDE.md
- Updated README.md
- Inline code comments
- Architecture diagrams

**Estimated Effort:** 3-4 hours

**Dependencies:** Phase 6 (Testing Complete)

**See:** All individual plans (Phase 7)

---

### Phase 8: Chat Feature (Optional Low Priority)

**Priority:** Low - Chat already has minimal coupling

**Goal:** Make chat work with or without auth.

**Current State:**
- Chat imports `useAuth` from auth feature (domain-to-domain)
- Chat doesn't pollute core features ✅
- Chat is already easy to delete ✅

**Changes:**
- Make auth optional in `useChatRuntime()`
- Provide anonymous mode fallback
- No core feature changes needed

**Deliverables:**
- Optional auth in chat runtime
- Anonymous mode support
- Documentation of pattern

**Estimated Effort:** 1-2 hours

**Dependencies:** None (can be done independently)

**See:** `issues/refactor-chat-feature-injection.md`

---

## Implementation Order

### Sequential Phases (Must be done in order)

```
Phase 1: Feature Registry
    ↓
Phase 2: Redux Store
    ↓
Phase 3: Router ────────┐
    ↓                   │
Phase 4: UI Layout ─────┤
    ↓                   │
Phase 5: Wire Together ←┘
    ↓
Phase 6: Testing
    ↓
Phase 7: Documentation
```

### Parallel Work (Can be done simultaneously)

- Phase 3 (Router) and Phase 4 (UI) can be done in parallel
- Phase 8 (Chat) can be done anytime independently

---

## Effort Estimation

| Phase | Description | Hours | Critical Path |
|-------|-------------|-------|---------------|
| **1** | Feature Registry | 2-4 | ✅ |
| **2** | Redux Store | 2-3 | ✅ |
| **3** | Router | 4-6 | ✅ |
| **4** | UI Layout | 1-2 | ✅ |
| **5** | Wiring | 1-2 | ✅ |
| **6** | Testing | 4-6 | ✅ |
| **7** | Documentation | 3-4 | ✅ |
| **8** | Chat (Optional) | 1-2 | ❌ |
| **Total (Critical)** | | **17-27 hours** | |
| **Total (With Chat)** | | **18-29 hours** | |

**Estimated Calendar Time:**
- **Fast Track:** 3-4 days (full-time focus)
- **Normal Pace:** 1-2 weeks (part-time)
- **Careful Approach:** 2-3 weeks (thorough testing)

---

## Success Criteria

### Must Have (Required)

✅ **Architecture:**
- [ ] Domain features only imported in `featureRegistry.ts`
- [ ] Core features accept everything via props
- [ ] No hardcoded domain imports in core features

✅ **Functionality:**
- [ ] All existing features work correctly
- [ ] Auth login/logout/protection works
- [ ] Wallet connect/disconnect/protection works
- [ ] Blog-demo pages load and work
- [ ] Chat works (with or without auth)

✅ **Quality:**
- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No console errors in browser

✅ **Deletability (MAIN GOAL):**
- [ ] Can delete auth by removing from registry only
- [ ] Can delete wallet by removing from registry only
- [ ] Can delete blog-demo by removing from registry only
- [ ] Can delete chat by removing folder only
- [ ] App works without deleted features

### Nice to Have (Optional)

✅ **Documentation:**
- [ ] CLAUDE.md updated with new patterns
- [ ] README.md updated
- [ ] Inline code comments added
- [ ] Architecture diagrams created

✅ **Developer Experience:**
- [ ] Clear TypeScript errors if registry misconfigured
- [ ] Helper types for registry structure
- [ ] Validation at runtime (optional)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| TypeScript inference breaks | Medium | High | Explicit types, thorough testing |
| State shape changes | Low | High | Careful reducer spreading, tests |
| HOC application order issues | Medium | Medium | Document order, test combinations |
| Hook calling rules violated | Low | High | Call hooks at top level always |
| Circular dependencies | Low | Medium | Keep featureRegistry in app only |
| Performance degradation | Low | Low | Benchmark before/after |
| Breaking changes for users | Medium | High | Thorough testing, clear migration guide |
| Increased complexity | Medium | Medium | Good documentation, clear examples |

**Overall Risk Level:** Medium

**Key Mitigations:**
1. Comprehensive testing at each phase
2. Maintain backwards compatibility during refactor
3. Clear documentation of new patterns
4. Incremental changes with verification

---

## Rollback Plan

If critical issues arise during refactoring:

### Phase-Level Rollback

Each phase is isolated and can be rolled back independently:

1. **Phase 1-2 Issues:** Revert featureRegistry and store changes
2. **Phase 3 Issues:** Revert Router changes, keep store changes
3. **Phase 4 Issues:** Revert UI changes, keep store and router changes
4. **Phase 5+ Issues:** Revert App.tsx wiring

### Full Rollback

Use git to revert all changes:
```bash
git log --oneline  # Find commit before refactoring
git revert <commit-hash>
```

### Mitigation Before Rollback

Before rolling back, try:
1. Review error messages and logs
2. Check TypeScript errors
3. Run tests to identify failures
4. Review individual phase plans for guidance

---

## Post-Refactoring Benefits

### For Template Maintainers

✅ **Cleaner Architecture:**
- Clear separation between core and domain
- Single source of truth for feature registration
- Easier to add new features

✅ **Easier Maintenance:**
- Changes to core features don't affect domain features
- Changes to domain features don't affect core features
- Testing is more isolated

✅ **Better Onboarding:**
- New contributors see clear patterns
- Documentation explains architecture
- Easy to understand feature boundaries

### For Template Users

✅ **Easy Customization:**
- Delete unwanted features in 2 steps
- Add new features with clear pattern
- No need to modify core infrastructure

✅ **Reduced Complexity:**
- Only work with features they need
- Clear understanding of dependencies
- Faster build times (fewer features = smaller bundle)

✅ **Confidence:**
- Know they can customize without breaking things
- Clear migration path from template
- Template provides good starting point, not a straitjacket

---

## Next Actions

### Immediate (Start Now)

1. **Review this master plan** - Understand full scope
2. **Review individual feature plans** - Understand detailed steps
3. **Create feature branch** - `git checkout -b refactor/feature-injection`
4. **Begin Phase 1** - Create feature registry

### Short Term (This Week)

1. **Complete Phases 1-5** - Core refactoring work
2. **Begin Phase 6** - Testing
3. **Daily progress updates** - Track what's working

### Medium Term (Next Week)

1. **Complete Phase 6** - Thorough testing
2. **Complete Phase 7** - Documentation
3. **Create PR** - Get review from team
4. **Merge to main** - Deploy changes

### Optional (Future)

1. **Phase 8** - Chat feature refinement
2. **Additional enhancements** - Feature flags, lazy loading, etc.
3. **Developer tools** - Visualize feature dependencies

---

## Questions & Answers

### Q: Can I do this refactoring in a different order?

**A:** Phases 1-2 must come first (foundation). Phases 3-4 can be done in parallel or reversed. Phase 5 must come after 2-4. Phases 6-7 must be last. Phase 8 is independent.

### Q: What if I only want to refactor one feature (e.g., just auth)?

**A:** You still need Phases 1-2 (registry and store). Then you can do just auth-specific changes in Phases 3-5. But it's recommended to do all features at once for consistency.

### Q: How do I test if features are really deletable?

**A:** Comment out the feature lines in `featureRegistry.ts`, run `npm run build`, and verify the app works. This is covered in Phase 6 deletion tests.

### Q: What if users already have customizations based on the old architecture?

**A:** Provide a migration guide showing before/after patterns. Most changes are localized to core features, so user code in domain features shouldn't need changes.

### Q: Can this pattern support lazy-loaded features?

**A:** Yes! The registry could support dynamic registration. Features could be loaded on-demand. This would be a future enhancement.

### Q: How does this affect bundle size?

**A:** Neutral initially. But it enables future optimizations like lazy loading and dead code elimination when features are removed.

---

## Related Documents

- **Problem Analysis:** `features.md`
- **Auth Plan:** `issues/refactor-auth-feature-injection.md`
- **Wallet Plan:** `issues/refactor-wallet-feature-injection.md`
- **Blog-Demo Plan:** `issues/refactor-blog-demo-feature-injection.md`
- **Chat Plan:** `issues/refactor-chat-feature-injection.md`

---

**Document Version:** 1.0
**Last Updated:** 2025-10-27
**Status:** Planning Complete - Ready for Implementation
