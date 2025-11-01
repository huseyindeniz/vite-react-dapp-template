# Architecture Audit Report

**Generated:** 2025-11-01T19:57:21.577Z
**Project:** vite-react-dapp-template

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Checks** | 8 |
| **Passed** | ✅ 4 |
| **Failed** | ❌ 4 |
| **Success Rate** | 50% |

## Results by Check

| Check | Status | Summary |
|-------|--------|---------|
| Core → Domain Dependency | ❌ FAILED | 7 violation(s) |
| Service Import Boundaries | ❌ FAILED | 2 violation(s) |
| Service Boundaries | ❌ FAILED | 1 violation(s) |
| Pages Boundaries | ❌ FAILED | 1 violation(s) |
| Model Internals Encapsulation | ✅ PASSED | 0 violation(s) |
| Slice Import Rules | ✅ PASSED | 0 violation(s) |
| Sagas Import Rules | ✅ PASSED | 0 violation(s) |
| Circular Dependencies | ✅ PASSED | No circular dependencies |

## Failed Checks (Detailed)

### ❌ Core → Domain Dependency

**Summary:** 7 violation(s)

<details>
<summary>View Details</summary>

```
Core → Domain Dependency Check
================================================================================

Rule: Core features (infrastructure) MUST NOT depend on domain features
Exception: src/features/app/config/ (composition root) can import anything

Violations
--------------------------------------------------------------------------------

❌ Found 7 violation(s)

  ❌ router (core) → domain features:
     → wallet (domain)
        File: src/features/router/hooks/usePages.tsx
        File: src/features/router/Router.tsx
        File: src/features/router/Router.tsx
     → oauth (domain)
        File: src/features/router/hooks/useRoutes.tsx
        File: src/features/router/Router.tsx

  ❌ ui (core) → domain features:
     → oauth (domain)
        File: src/features/ui/mantine/Layout/LayoutBase.tsx
     → wallet (domain)
        File: src/features/ui/mantine/Layout/LayoutBase.tsx

Fix: Move these dependencies to src/features/app/config/

================================================================================
Summary: 7 violation(s)
```

</details>

---

### ❌ Service Import Boundaries

**Summary:** 2 violation(s)

<details>
<summary>View Details</summary>

```
Service Import Check (Dependency Injection)
================================================================================

Rule: Services MUST ONLY be imported in src/features/app/config/
Why: Enforce dependency injection pattern

Violations
--------------------------------------------------------------------------------

❌ Found 2 violation(s)

  ❌ src/features/chat/runtime/useChatRuntime.ts
     Line 6: @/services/chat/GoogleADKChatModelAdapter
     Line 7: @/services/chat/LangGraphChatModelAdapter
     Fix: Move service instantiation to src/features/app/config/services.ts
          Use dependency injection - features receive services through interfaces

================================================================================
Summary: 2 violation(s)
```

</details>

---

### ❌ Service Boundaries

**Summary:** 1 violation(s)

<details>
<summary>View Details</summary>

```
Service Boundaries Check
================================================================================

Rule: Services can ONLY import:
  ✅ @/features/{feature}/I{Feature}Api.ts - Root-level interfaces
  ✅ @/features/{feature}/types/* - Feature types
  ✅ @/features/{feature}/models/{model}/types/* - Model types
  ✅ @/services/* - Other services
  ✅ External libraries

Services CANNOT import:
  ❌ @/pages/*
  ❌ @/hooks/*
  ❌ @/features/{feature}/models/{model}/actions.ts
  ❌ @/features/{feature}/models/{model}/slice.ts
  ❌ @/features/{feature}/models/{model}/actionEffects/*
  ❌ @/features/{feature}/hooks/*
  ❌ @/features/{feature}/components/*
  ❌ @/features/{feature}/config

Violations
--------------------------------------------------------------------------------

❌ Found 1 violation(s)

  ❌ src/services/oauth/OAuthService.ts
     Line 3: @/features/oauth/config
     Issue: Services can only import root I*Api interfaces and types from features
     Fix: Services should only import:
          - Root interfaces: @/features/{feature}/I{Feature}Api
          - Types: @/features/{feature}/types/* or .../models/{model}/types/*
          - Other services: @/services/*
          - External libraries

================================================================================
Summary: 1 violation(s)
```

</details>

---

### ❌ Pages Boundaries

**Summary:** 1 violation(s)

<details>
<summary>View Details</summary>

```
Pages Boundaries Check
================================================================================

Rule: Pages can ONLY import:
  ✅ @/features/{feature}/components/* - Feature components
  ✅ @/features/{feature}/hooks/* - Feature hooks
  ✅ @/features/{feature}/hocs/* - Feature HOCs
  ✅ @/hooks/* - Root hooks
  ✅ External libraries (React, etc.)

Pages CANNOT import:
  ❌ @/services/*
  ❌ @/features/{feature}/models/*
  ❌ @/features/{feature}/types/*
  ❌ @/features/{feature}/slice.ts
  ❌ @/features/{feature}/sagas.ts
  ❌ @/features/{feature}/I{Feature}Api.ts
  ❌ @/features/{feature}/config
  ❌ @/features/{feature}/routes

Violations
--------------------------------------------------------------------------------

❌ Found 1 violation(s)

  ❌ src/pages/Home/components/Environment.tsx
     Line 3: @/features/router/config
     Issue: Pages can only import components, hooks, and hocs from features
     Fix: Pages should only import:
          - Feature components: @/features/{feature}/components/*
          - Feature hooks: @/features/{feature}/hooks/*
          - Feature HOCs: @/features/{feature}/hocs/*
          - Root hooks: @/hooks/*

================================================================================
Summary: 1 violation(s)
```

</details>

---

## Passed Checks

- ✅ **Model Internals Encapsulation** - 0 violation(s)
- ✅ **Slice Import Rules** - 0 violation(s)
- ✅ **Sagas Import Rules** - 0 violation(s)
- ✅ **Circular Dependencies** - No circular dependencies

## Architectural Principles Verified

This audit ensures the following architectural patterns:

### ✅ Feature Isolation
- Core features (infrastructure) don't depend on domain features
- Domain features can depend on core features
- Features use proper boundaries and interfaces

### ✅ Dependency Injection
- Services are only imported in composition root (`src/features/app/config/services.ts`)
- Features receive services through dependency injection
- No direct service imports scattered throughout the codebase

### ✅ Model-Based Architecture
- Domain features organize code by models
- Each model has its own directory
- Models expose proper interfaces for cross-model communication

### ✅ Encapsulation
- Model internals (actionEffects, types) are not imported externally
- Slice and saga files follow proper import rules
- Pages and services maintain proper boundaries

### ✅ Circular Dependency Prevention
- Module dependencies form a proper DAG (Directed Acyclic Graph)
- No circular imports that cause bundling or runtime issues

## Recommendations

### Priority Actions

1. **Core → Domain Dependency**: 7 violation(s)
   - Run: `node ./.claude/skills/arch-audit/scripts/core___domain_dependency.mjs`
   - See detailed output above for specific violations

2. **Service Import Boundaries**: 2 violation(s)
   - Run: `node ./.claude/skills/arch-audit/scripts/service_import_boundaries.mjs`
   - See detailed output above for specific violations

3. **Service Boundaries**: 1 violation(s)
   - Run: `node ./.claude/skills/arch-audit/scripts/service_boundaries.mjs`
   - See detailed output above for specific violations

4. **Pages Boundaries**: 1 violation(s)
   - Run: `node ./.claude/skills/arch-audit/scripts/pages_boundaries.mjs`
   - See detailed output above for specific violations

## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run `arch-audit` after fixes to verify improvements
4. Consider running `code-audit` for code quality checks

---

*Generated by arch-audit skill*
