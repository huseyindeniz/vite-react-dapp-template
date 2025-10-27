# Refactor: Make Chat Feature Injectable from App

**Feature:** chat
**Type:** Domain Feature (Deletable Example)
**Status:** Minimal Core Dependencies - Already Nearly Injectable
**Priority:** Low (Minimal Changes Required)

---

## Current State Analysis

The `chat` feature has **minimal coupling** to core features, demonstrating best practices:

### 1. No APP Feature Dependencies ✅

**Status:** Chat does NOT import from app feature
- No saga registration needed (chat doesn't use Redux)
- No reducer registration needed (chat doesn't use Redux)

**This is GOOD:** Chat is a self-contained feature.

---

### 2. No ROUTER Feature Dependencies ✅

**Status:** Chat does NOT import from router feature
- No route protection needed
- No router hooks needed
- Routes can be simple static routes

**This is GOOD:** Chat doesn't need router-specific features.

---

### 3. No UI Feature Dependencies ✅

**Status:** Chat does NOT import from ui feature
- No layout slots needed
- Chat is rendered as a separate page, not in layout

**This is GOOD:** Chat is a standalone page component.

---

### 4. AUTH Feature Dependency ⚠️

**File:** `src/features/chat/runtime/useChatRuntime.ts`

```typescript
// DOMAIN-TO-DOMAIN DEPENDENCY
import { useAuth } from '@/features/auth/hooks/useAuth';

// Usage:
const { user } = useAuth();
```

**Problem:** Chat (domain) imports from Auth (domain).

**Note:** This is a **domain-to-domain** dependency, not a **core-to-domain** dependency. This is less critical but still should be handled for consistency.

---

## Problem Statement

Unlike auth, wallet, and blog-demo, chat has **minimal architectural problems**:

❌ **Current Issue:**
- Chat depends on auth (domain-to-domain dependency)
- If user deletes auth, chat will break
- Chat cannot work standalone without auth

✅ **What's Already Good:**
- Chat doesn't pollute core features
- Chat is self-contained
- Chat is easy to delete (just remove folder)

**Goal:** Make chat work with OR without auth feature.

---

## Refactoring Goals

1. **Make auth optional** for chat feature
2. **Provide fallback behavior** when auth not available
3. **Keep chat self-contained** (no core feature changes needed)
4. **Enable easy deletion**: Users should only need to:
   - Delete `src/features/chat/` folder
   - Remove chat routes from app configuration (if we add route registration)

---

## Proposed Architecture

### Option A: Make Auth Optional in Chat (Recommended)

**Strategy:** Chat checks if auth is available and adapts behavior.

```typescript
// src/features/chat/runtime/useChatRuntime.ts

// BEFORE (Hardcoded auth dependency)
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useChatRuntime() {
  const { user } = useAuth();

  return {
    userId: user?.id ?? 'anonymous',
  };
}

// AFTER (Optional auth dependency)
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useChatRuntime() {
  // Try to get auth, but handle if not available
  let user = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch {
    // Auth not available, use anonymous mode
  }

  return {
    userId: user?.id ?? 'anonymous',
  };
}
```

**Pros:**
- Simple to implement
- Chat remains self-contained
- No core feature changes needed
- Works with or without auth

**Cons:**
- Try-catch pattern for optional feature is non-standard
- May violate Rules of Hooks (hooks must be called unconditionally)

---

### Option B: Inject Auth Hook via Props (More Complex)

**Strategy:** Chat accepts auth hook as optional prop.

```typescript
// src/features/chat/runtime/useChatRuntime.ts

// AFTER (Injected auth)
interface ChatRuntimeOptions {
  useAuth?: () => { user?: { id: string } };
}

export function useChatRuntime(options: ChatRuntimeOptions = {}) {
  const { useAuth } = options;

  // Call hook if provided, otherwise use anonymous
  const auth = useAuth?.();
  const user = auth?.user;

  return {
    userId: user?.id ?? 'anonymous',
  };
}
```

**Usage in Chat component:**
```typescript
// With auth
import { useAuth } from '@/features/auth/hooks/useAuth';
const runtime = useChatRuntime({ useAuth });

// Without auth
const runtime = useChatRuntime(); // Anonymous mode
```

**Pros:**
- Follows dependency injection pattern
- Explicit about dependencies
- Doesn't violate Rules of Hooks
- Easy to test

**Cons:**
- More boilerplate
- Chat components need to know about auth injection

---

### Option C: Create Chat-Specific Auth Adapter (Most Robust)

**Strategy:** Abstract auth behind chat-specific interface.

```typescript
// src/features/chat/adapters/authAdapter.ts

export interface ChatAuthAdapter {
  getUserId: () => string;
}

// Default adapter (no auth)
export const defaultChatAuthAdapter: ChatAuthAdapter = {
  getUserId: () => 'anonymous',
};

// Auth-integrated adapter
export function createAuthChatAdapter(useAuth: () => any): ChatAuthAdapter {
  return {
    getUserId: () => {
      const { user } = useAuth();
      return user?.id ?? 'anonymous';
    },
  };
}
```

**Registration in app/featureRegistry.ts:**
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';
import { createAuthChatAdapter } from '@/features/chat/adapters/authAdapter';

export const featureRegistry = {
  // ...

  // Chat adapters
  chatAdapters: {
    auth: createAuthChatAdapter(useAuth),
  },
};
```

**Pros:**
- Clean separation of concerns
- Chat defines its own interface
- Auth is completely optional
- Easy to mock for testing
- Follows adapter pattern

**Cons:**
- Most complex solution
- Requires adapter layer
- More files to maintain

---

## Recommended Approach: Option B (Inject Auth Hook)

**Reasoning:**
- Balances simplicity and correctness
- Follows dependency injection pattern (consistent with other features)
- Doesn't violate React Rules of Hooks
- Chat remains self-contained
- Easy to delete

---

## Detailed Implementation Steps

### Phase 1: Update Chat Runtime (CHAT)

**Step 1.1:** Modify `src/features/chat/runtime/useChatRuntime.ts`
- Add `ChatRuntimeOptions` interface
- Accept `useAuth` as optional parameter
- Call `useAuth()` only if provided
- Use 'anonymous' as fallback user ID

**Step 1.2:** Update chat components
- Pass `useAuth` to `useChatRuntime()` where used
- Test chat works with and without auth

**Files to Modify:**
- `src/features/chat/runtime/useChatRuntime.ts`
- Any components that call `useChatRuntime()`

---

### Phase 2: Update App Configuration (APP)

**Step 2.1:** Update `src/features/app/featureRegistry.ts` (OPTIONAL)
- Add chat routes to registry (if centralizing routes)
- This step is optional since chat doesn't have core dependencies

**Step 2.2:** Document chat as standalone feature
- Add comments explaining chat's minimal coupling
- Show chat as an example of best practices

**Files to Modify (OPTIONAL):**
- `src/features/app/featureRegistry.ts`

---

### Phase 3: Testing & Verification

**Step 3.1:** Run existing tests
```bash
npm run test
npm run lint
npm run build
```

**Step 3.2:** Manual testing
- Test chat with auth logged in
- Test chat with auth logged out
- Test chat page loads correctly

**Step 3.3:** Test with auth deleted (simulation)
- Modify chat to not pass `useAuth`
- Verify chat works in anonymous mode
- Verify no errors occur

---

### Phase 4: Update Documentation

**Step 4.1:** Update CLAUDE.md
- Add chat as example of minimal coupling
- Document optional auth pattern
- Explain when to use domain-to-domain dependencies

**Step 4.2:** Add code comments
- Comment the optional auth pattern in chat
- Explain anonymous mode fallback

**Files to Modify:**
- `CLAUDE.md`
- Chat runtime file (inline comments)

---

## Files Summary

### Files to Create (0)
- None

### Files to Modify (3)
1. `src/features/chat/runtime/useChatRuntime.ts` (make auth optional)
2. Components using `useChatRuntime()` (pass useAuth if needed)
3. `CLAUDE.md` (document pattern)

### Files to NOT Modify
- No core features need changes (app, router, ui, i18n, slice-manager)
- All files in `src/features/auth/` (leave as-is)
- All files in `src/features/wallet/` (leave as-is)
- All files in `src/features/blog-demo/` (leave as-is)

---

## Testing Strategy

### Unit Tests
- Test `useChatRuntime()` with `useAuth` provided
- Test `useChatRuntime()` without `useAuth` provided
- Test anonymous user ID is used when auth not available
- Test user ID from auth is used when auth available

### Integration Tests
- Test chat page loads with auth
- Test chat page loads without auth
- Test chat functionality works in both modes

### Regression Tests
- All existing tests must pass
- No TypeScript errors
- Linting passes with 0 warnings
- Build succeeds

### Deletion Test (Manual)
1. Delete `src/features/chat/` folder
2. Remove chat routes from app (if registered)
3. Run `npm run build` - should succeed
4. Run `npm run test` - should pass
5. Start dev server - should work without chat

---

## Success Criteria

✅ **Chat works with auth**
✅ **Chat works without auth (anonymous mode)**
✅ **No core features import chat**
✅ **Chat doesn't require modifications to core features**
✅ **All tests pass**
✅ **Build succeeds**
✅ **Lint passes with 0 warnings**
✅ **Deleting chat folder doesn't break app (after removing routes)**

---

## Migration Guide for Users

### Before (Tightly Coupled to Auth)
```
❌ To delete chat:
1. Delete src/features/chat/
2. Chat depends on auth - can't work standalone
3. If you delete auth, chat breaks
```

### After (Loosely Coupled)
```
✅ To delete chat:
1. Delete src/features/chat/
2. Remove chat routes from app configuration
3. Done! ✨

✅ Chat works with OR without auth:
- With auth: Shows user identity
- Without auth: Works in anonymous mode
```

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rules of Hooks violation | High | Call useAuth at top level with optional param |
| Anonymous mode insufficient for some use cases | Medium | Document when auth is required, provide clear errors |
| Domain-to-domain dependencies proliferate | Low | Document when they're acceptable, keep minimal |
| Testing complexity increases | Low | Clear test cases for both modes |

---

## Special Considerations

### Domain-to-Domain Dependencies

Chat demonstrates a **domain-to-domain dependency** (chat → auth). This is different from core-to-domain dependencies:

**Core-to-Domain (❌ BAD):**
- Core features should NEVER depend on domain features
- Violates architectural layers
- Makes domain features non-deletable

**Domain-to-Domain (⚠️ USE CAREFULLY):**
- Domain features CAN depend on other domain features
- Should be made optional when possible
- Document the dependency clearly
- Provide fallback behavior

**Best Practice:**
- Keep domain features independent when possible
- Use optional dependencies with fallbacks
- Document when features work together

**Chat Example:**
```
Chat works standalone (anonymous mode)
Chat works better with Auth (user identity)
This is ACCEPTABLE because:
  - Auth is optional
  - Fallback provided
  - Clear documentation
```

---

## Future Enhancements

1. **Plugin system:** Chat registers auth adapter dynamically
2. **Feature flags:** Enable/disable auth integration at runtime
3. **Adapter registry:** Centralized registry for feature adapters
4. **Automatic fallbacks:** Framework-level support for optional dependencies
5. **Dependency graph:** Visualize feature dependencies in dev tools

---

## Key Insights: Chat as a Model Feature

Chat demonstrates **ideal domain feature characteristics**:

✅ **No core feature pollution:**
- Doesn't add to app store setup
- Doesn't add to router configuration
- Doesn't add to UI layout

✅ **Self-contained:**
- All logic within feature folder
- Clear boundaries
- Easy to understand

✅ **Optional dependencies:**
- Works with or without auth
- Graceful fallbacks
- No hard requirements

✅ **Easy to delete:**
- Delete folder
- Remove routes
- Done

**Recommendation:** Use chat as template for new features when they don't need Redux or route protection.

---

## Documentation Updates for Users

### New Section in CLAUDE.md: Domain-to-Domain Dependencies

```markdown
## Domain-to-Domain Dependencies

Domain features can depend on other domain features, but should do so carefully:

### When It's OK

✅ Feature provides fallback when dependency missing
✅ Dependency is documented
✅ Feature works in degraded mode without dependency
✅ Example: Chat uses Auth for identity, falls back to anonymous

### When It's NOT OK

❌ Hard requirement on other domain feature
❌ No fallback behavior
❌ Cascading deletions (deleting A breaks B, C, D...)
❌ Circular dependencies between domain features

### Best Practices

1. Make dependencies optional
2. Provide clear fallbacks
3. Document the relationship
4. Test both modes (with and without dependency)

### Example: Chat Feature

See `src/features/chat/` for an example of optional auth integration.
```

---

**Next Steps:** Proceed with Phase 1 - Update Chat Runtime

---

## Comparison with Other Features

| Aspect | Auth | Wallet | Blog-Demo | Chat |
|--------|------|--------|-----------|------|
| **Core Dependencies** | 3 features | 3 features | 2 features | 0 features ✅ |
| **Redux Needed** | Yes | Yes | Yes | No ✅ |
| **Route Protection** | Provides it | Provides it | No | No ✅ |
| **UI Slots** | Yes (header) | Yes (header) | No | No ✅ |
| **Domain Dependencies** | 0 ✅ | 0 ✅ | 0 ✅ | 1 (auth) |
| **Refactor Complexity** | High | High | Medium | **Low** ✅ |
| **Deletability** | Hard → Easy | Hard → Easy | Hard → Easy | **Already Easy** ✅ |

**Chat is the IDEAL domain feature:** Minimal coupling, self-contained, easy to delete.

---

**Recommendation:** Prioritize auth, wallet, and blog-demo refactoring first. Chat refactoring is low priority since it's already well-architected.
