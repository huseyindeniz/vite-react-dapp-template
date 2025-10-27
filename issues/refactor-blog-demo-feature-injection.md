# Refactor: Make Blog-Demo Feature Injectable from App

**Feature:** blog-demo
**Type:** Domain Feature (Deletable Example)
**Status:** Currently Hardcoded in Core Features
**Priority:** Medium

---

## Current State Analysis

The `blog-demo` feature is currently hardcoded in 2 core features, preventing users from deleting it:

### 1. APP Feature Dependencies

**Files:** `src/features/app/store/store.ts`, `src/features/app/store/rootReducer.ts`

```typescript
// store.ts - HARDCODED
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';

// rootReducer.ts - HARDCODED
import { blogDemoReducer } from '@/features/blog-demo/slice';
```

**Problem:** Redux store directly imports blog-demo saga and reducer.

---

### 2. ROUTER Feature Dependencies

**Files:** `src/features/router/Router.tsx`

```typescript
// Router.tsx - HARDCODED
import { configureBlogFeature } from '@/features/blog-demo/configureBlogFeature';

// Usage:
configureBlogFeature({
  routes: routeConfigs,
  protections: protectionHOCs,
});
```

**Problem:** Router directly imports and calls blog feature configuration.

---

## Special Context: Blog-Demo is an Example Feature

The `blog-demo` feature serves as an **example** of how to structure a domain feature with:
- Dynamic slice registration (via slice-manager)
- Feature configuration pattern
- Multiple models (post, author)
- Lazy-loaded routes

**Key Difference from auth/wallet:**
- Auth/wallet are **infrastructure-like** domain features (most apps need them)
- Blog-demo is a **pure example** (users will delete or replace it)

**User Intent:** Users should easily delete blog-demo to replace with their own features (e.g., products, orders, inventory).

---

## Problem Statement

Users cannot delete the `blog-demo` feature without manually modifying:
- 2 files in `app/store/`
- 1 file in `router/`

**Total:** 3 files across 2 core features

This violates the principle that domain features should be deletable by only removing the feature folder and updating app configuration.

---

## Refactoring Goals

1. **Remove all direct imports** of blog-demo from core features (app, router)
2. **Centralize blog-demo registration** in app feature only
3. **Use dependency injection** to pass blog configuration to core features
4. **Enable easy deletion**: Users should only need to:
   - Delete `src/features/blog-demo/` folder
   - Remove blog-demo registration lines in `src/features/app/`

---

## Proposed Architecture

### Registration Point (Single Location)

**File:** `src/features/app/featureRegistry.ts` (SHARED with auth/wallet plans)

```typescript
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';
import { blogDemoReducer } from '@/features/blog-demo/slice';
import { configureBlogFeature } from '@/features/blog-demo/configureBlogFeature';

export const featureRegistry = {
  // Redux
  reducers: {
    blogDemo: blogDemoReducer,
    // Other domain features...
  },

  sagas: [
    watchBlogDemoSaga,
    // Other domain features...
  ],

  // Router - Feature configurations
  featureConfigurators: [
    configureBlogFeature,
    // Other feature configurators...
  ],

  // Rest of registry...
};
```

**To delete blog-demo:** Simply remove all blog-demo-related lines from this single file.

---

### Injection Mechanism

#### 1. Redux Store (APP Feature)

**File:** `src/features/app/store/store.ts`

```typescript
// BEFORE (Hardcoded)
import { watchBlogDemoSaga } from '@/features/blog-demo/sagas';
const sagaMiddleware = createSagaMiddleware();
sagaMiddleware.run(watchBlogDemoSaga);

// AFTER (Injectable)
import { featureRegistry } from '../featureRegistry';
const sagaMiddleware = createSagaMiddleware();
featureRegistry.sagas.forEach(saga => sagaMiddleware.run(saga));
```

**File:** `src/features/app/store/rootReducer.ts`

```typescript
// BEFORE (Hardcoded)
import { blogDemoReducer } from '@/features/blog-demo/slice';
export const rootReducer = combineReducers({
  blogDemo: blogDemoReducer,
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

#### 2. Router Feature Configuration (ROUTER Feature)

**File:** `src/features/router/Router.tsx`

**New Prop Interface:**
```typescript
interface RouterProps {
  protectionHOCs?: Record<string, (c: React.ComponentType) => React.ComponentType>;
  routerHooks?: Record<string, () => any>;
  additionalRoutes?: PageType[];
  featureConfigurators?: Array<(config: FeatureConfig) => void>; // NEW
}

// FeatureConfig is what gets passed to configureBlogFeature
interface FeatureConfig {
  routes: RouteConfig[];
  protections: Record<string, HOC>;
  // Extensible for other features...
}
```

```typescript
// BEFORE (Hardcoded)
import { configureBlogFeature } from '@/features/blog-demo/configureBlogFeature';

export function Router() {
  const routeConfigs = // ... route configurations
  const protectionHOCs = // ... protection HOCs

  // Direct call
  configureBlogFeature({
    routes: routeConfigs,
    protections: protectionHOCs,
  });
}

// AFTER (Injectable)
export function Router({
  protectionHOCs = {},
  featureConfigurators = [],
  // ... other props
}: RouterProps) {
  const routeConfigs = // ... route configurations

  // Call all feature configurators
  const featureConfig = {
    routes: routeConfigs,
    protections: protectionHOCs,
  };

  featureConfigurators.forEach(configurator => {
    configurator(featureConfig);
  });

  // Router continues with its logic...
}
```

---

#### 3. Root App Composition (APP Feature)

**File:** `src/features/app/App.tsx`

```typescript
// Wire everything together
import { featureRegistry } from './featureRegistry';
import { Router } from '@/features/router';

export function App() {
  return (
    <Provider store={store}>
      <Router
        protectionHOCs={featureRegistry.protectionHOCs}
        routerHooks={featureRegistry.routerHooks}
        additionalRoutes={featureRegistry.routes}
        featureConfigurators={featureRegistry.featureConfigurators} // NEW
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
- Add blog-demo imports
- Add `blogDemoReducer` to reducers
- Add `watchBlogDemoSaga` to sagas
- Add `configureBlogFeature` to featureConfigurators (NEW section)

**Step 1.2:** Update TypeScript interfaces
- Add `featureConfigurators` field to `FeatureRegistry` interface
- Define `FeatureConfigurator` type: `(config: FeatureConfig) => void`
- Define `FeatureConfig` interface

**Files to Modify:**
- `src/features/app/featureRegistry.ts`
- `src/features/app/types/FeatureRegistry.ts` (if separate)

---

### Phase 2: Refactor Redux Store (APP)

**Same as auth/wallet plans - already handles multiple features via loop**

**Step 2.1:** Verify `src/features/app/store/rootReducer.ts`
- Confirm it spreads `featureRegistry.reducers`
- Blog-demo reducer will be included automatically

**Step 2.2:** Verify `src/features/app/store/store.ts`
- Confirm it loops through `featureRegistry.sagas`
- Blog-demo saga will be run automatically

**Files to Verify (no changes if auth/wallet plans already done):**
- `src/features/app/store/rootReducer.ts`
- `src/features/app/store/store.ts`

---

### Phase 3: Refactor Router (ROUTER)

**Step 3.1:** Add `featureConfigurators` prop to Router component
- Update `RouterProps` interface with `featureConfigurators` field
- Make prop optional with default empty array

**Step 3.2:** Create feature configuration object
- Collect all configuration data that features might need:
  - Route configurations
  - Protection HOCs
  - Any other router context

**Step 3.3:** Execute feature configurators
- Loop through `featureConfigurators` array
- Call each configurator with the configuration object
- Remove direct import and call of `configureBlogFeature`

**Step 3.4:** Test Router without blog-demo
- Router must work when `featureConfigurators` is empty array
- No feature configuration should not break router

**Files to Modify:**
- `src/features/router/Router.tsx`
- `src/features/router/types.ts` (add featureConfigurators to RouterProps)

---

### Phase 4: Wire Everything in App (APP)

**Step 4.1:** Update `src/features/app/App.tsx`
- Pass `featureConfigurators` to Router component (NEW)
- Ensure all other props are passed correctly

**Step 4.2:** Verify prop drilling
- Ensure `featureConfigurators` reaches Router
- Ensure configurators execute at the right time

**Files to Modify:**
- `src/features/app/App.tsx`

---

### Phase 5: Testing & Verification

**Step 5.1:** Run existing tests
```bash
npm run test
npm run lint
npm run build
```

**Step 5.2:** Manual testing
- Verify blog-demo pages load correctly
- Verify blog-demo routes are registered
- Verify slice-manager integration works
- Verify blog posts fetch and display

**Step 5.3:** Test deletion scenario
- Comment out all blog-demo lines in `featureRegistry.ts`
- Verify app builds and runs without blog-demo
- Verify no blog-demo routes appear
- Verify no blog-demo UI appears
- Uncomment and verify it works again

---

### Phase 6: Update Documentation

**Step 6.1:** Update CLAUDE.md
- Document `featureConfigurators` pattern in featureRegistry
- Update "How to delete blog-demo feature" instructions
- Update "How to create a new feature like blog-demo" instructions

**Step 6.2:** Add code comments
- Comment the featureConfigurators pattern
- Explain when features should use configurators vs. simple routes
- Explain blog-demo as an example users will replace

**Files to Modify:**
- `CLAUDE.md`
- `README.md` (if applicable)

---

## Files Summary

### Files to Create (0)
- None (featureRegistry.ts created in auth plan)

### Files to Modify (4)
1. `src/features/app/featureRegistry.ts` (add blog-demo)
2. `src/features/app/App.tsx` (pass featureConfigurators)
3. `src/features/router/Router.tsx` (accept and execute featureConfigurators)
4. `CLAUDE.md` (document featureConfigurators)

### Files Already Modified by Auth/Wallet Plans (4)
1. `src/features/app/store/store.ts` (already loops sagas)
2. `src/features/app/store/rootReducer.ts` (already spreads reducers)
3. `src/features/ui/Layout/LayoutBase.tsx` (no blog-demo dependency)
4. `src/features/router/Router.tsx` (already accepts protectionHOCs, routerHooks)

### Files to NOT Modify
- All files in `src/features/blog-demo/` (leave as-is)
- All files in `src/features/auth/` (separate plan)
- All files in `src/features/wallet/` (separate plan)
- All files in `src/features/i18n/` (no changes needed)
- All files in `src/features/slice-manager/` (no changes needed)

---

## Testing Strategy

### Unit Tests
- Test Router works when `featureConfigurators` not provided
- Test Router works when `featureConfigurators` is empty array
- Test Router calls all configurators with correct config object
- Test configurator receives routes and protections correctly

### Integration Tests
- Test blog-demo pages load correctly
- Test blog-demo routes are registered
- Test slice-manager integration works
- Test blog posts fetch and display
- Test blog-demo saga runs correctly

### Regression Tests
- All existing tests must pass
- No TypeScript errors
- Linting passes with 0 warnings
- Build succeeds

### Deletion Test (Manual)
1. Comment out blog-demo in `featureRegistry.ts`
2. Run `npm run build` - should succeed
3. Run `npm run test` - should pass (or skip blog-demo tests)
4. Start dev server - should work without blog-demo
5. Verify no blog-demo routes appear
6. Verify no blog-demo UI appears
7. Uncomment blog-demo
8. Verify everything works again

---

## Success Criteria

✅ **Blog-demo is only imported in app/featureRegistry.ts**
✅ **Router accepts featureConfigurators via props**
✅ **Router works without configurators**
✅ **All tests pass**
✅ **Build succeeds**
✅ **Lint passes with 0 warnings**
✅ **Commenting out blog-demo in featureRegistry makes it deletable**
✅ **No hardcoded blog-demo imports remain in core features**

---

## Migration Guide for Users

### Before (Hard to Delete)
```
❌ To delete blog-demo:
1. Delete src/features/blog-demo/
2. Modify src/features/app/store/store.ts
3. Modify src/features/app/store/rootReducer.ts
4. Modify src/features/router/Router.tsx
5. Fix TypeScript errors in 3+ files
```

### After (Easy to Delete)
```
✅ To delete blog-demo:
1. Delete src/features/blog-demo/
2. Remove blog-demo lines from src/features/app/featureRegistry.ts
   - Remove blogDemoReducer from reducers
   - Remove watchBlogDemoSaga from sagas
   - Remove configureBlogFeature from featureConfigurators
3. Done! ✨
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Configurators execute in wrong order | Medium | Document execution order, make configurators idempotent |
| Configurator side effects interfere | Medium | Keep configurators pure, document expectations |
| Config object shape changes break features | Low | Version the config interface, validate at runtime |
| TypeScript inference breaks for configurators | Low | Explicitly type FeatureConfigurator signature |
| Slice-manager integration breaks | Medium | Test slice-manager thoroughly with/without blog-demo |

---

## Special Considerations

### Feature Configurators Pattern

The `featureConfigurators` pattern is more powerful than simple route registration:

**When to use `featureConfigurators`:**
- Feature needs to set up dynamic routing (like blog-demo with slice-manager)
- Feature needs to access router's internal context
- Feature needs to register multiple things at once
- Feature has complex initialization logic

**When to use simple `routes` array:**
- Feature has static routes
- Feature doesn't need router internals
- Feature initialization is straightforward

**Blog-Demo Example:**
```typescript
export function configureBlogFeature(config: FeatureConfig) {
  // Complex initialization with slice-manager
  const sliceManager = getSliceManager();

  sliceManager.registerSlice({
    // ... slice config
    routes: config.routes, // Uses router's route configs
  });
}
```

**Simple Feature Example:**
```typescript
// Just export routes, no configurator needed
export const getMyFeatureRoutes = (): PageType[] => [
  { path: '/my-feature', component: MyFeature },
];
```

---

## Future Enhancements

1. **Async configurators:** Support `Promise`-returning configurators
2. **Configurator dependencies:** Allow features to depend on other features
3. **Configurator validation:** Validate config object before passing to features
4. **Configurator lifecycle:** Add phases (early, normal, late) for execution order
5. **Configurator debugging:** Dev tools to visualize configurator execution

---

## Documentation Updates for Users

### New Section in CLAUDE.md: Feature Configurators

```markdown
## Feature Configurators

Features can use configurators for complex initialization:

### When to Use Configurators

- Dynamic route registration (via slice-manager)
- Access to router context
- Complex setup logic

### How to Create a Configurator

1. Export a configurator function from your feature:
   ```typescript
   export function configureMyFeature(config: FeatureConfig) {
     // Your initialization logic
   }
   ```

2. Register in `app/featureRegistry.ts`:
   ```typescript
   featureConfigurators: [
     configureMyFeature,
   ],
   ```

3. Feature will be configured when Router initializes

### Example: Blog-Demo Feature

See `src/features/blog-demo/configureBlogFeature.ts` for a complete example.
```

---

**Next Steps:** Proceed with Phase 1 - Update Feature Registry
