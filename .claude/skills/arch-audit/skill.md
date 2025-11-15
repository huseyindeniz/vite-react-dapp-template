---
name: arch-audit
description: Architecture dependency analysis to ensure proper feature isolation and composition root pattern.
---

# Purpose

Enforce **architectural boundaries** and **dependency rules** across the codebase.

**What it checks (8 checks, each with its own script):**
1. Core → Domain dependencies (core features cannot depend on domain features)
2. Service imports (services only imported in composition root)
3. Service boundaries (services can only import interfaces/types/config from features)
4. Pages boundaries (pages can only import components/hooks/hocs from features)
5. Model internals encapsulation (cross-feature cannot import model internals)
6. Slice imports (slice.ts only imported in composition root)
7. Sagas imports (sagas.ts only imported in composition root)
8. Circular dependencies (A ↔ B or A → B → C → A)

**What it doesn't check:**
- Code quality patterns (relative imports, exports, etc.) - see `code-audit` skill

# Architecture Context

This template uses **core/domain separation** and **composition root pattern**:

**Composition Root** (`src/config/`)
- Top-level wiring layer (NOT a feature)
- Imports services, registers features, defines routes
- ALL architecture rules suspended here

**Core Features** (`src/core/features/`)
- Infrastructure: app, auth, components, i18n, layout, router, slice-manager
- Auto-discovered by scanning directory

**Domain Features** (`src/domain/features/`)
- Business logic: wallet, oauth, blog-demo, ai-assistant, site
- Auto-discovered by scanning directory
- Users create their own (products, orders, inventory, etc.)

# Running Checks

**All checks:**
```bash
node ./.claude/skills/arch-audit/scripts/run_all_checks.mjs
```

**Generate report:**
```bash
node ./.claude/skills/arch-audit/scripts/generate_report.mjs
```

**Individual checks:**
```bash
node ./.claude/skills/arch-audit/scripts/check_core_to_domain.mjs
node ./.claude/skills/arch-audit/scripts/check_service_imports.mjs
node ./.claude/skills/arch-audit/scripts/check_service_boundaries.mjs
node ./.claude/skills/arch-audit/scripts/check_pages_boundaries.mjs
node ./.claude/skills/arch-audit/scripts/check_model_internals.mjs
node ./.claude/skills/arch-audit/scripts/check_slice_imports.mjs
node ./.claude/skills/arch-audit/scripts/check_sagas_imports.mjs
node ./.claude/skills/arch-audit/scripts/check_circular_deps.mjs
```

# Architecture Rules

## 1. Core → Domain Dependencies

**RULE**: Core features (infrastructure) MUST NOT depend on domain features (business logic).

**Allowed:**
- ✅ Core → Core (infrastructure can use infrastructure)
- ✅ Domain → Core (business can use infrastructure)

**Violations:**
- ❌ Core → Domain (infrastructure cannot know about business)

**Exception:**
- `src/config/` is composition root, can import anything

**Check:** `check_core_to_domain.mjs`

---

## 2. Service Imports (Dependency Injection)

**RULE**: Services (`@/services/*`) MUST ONLY be imported in composition root (`src/config/`).

**Allowed:**
- ✅ `src/config/services.ts` (root services)
- ✅ `src/config/{feature}/services.ts` (feature-specific services)

**Violations:**
- ❌ Any file OUTSIDE `src/config/` importing `@/services/*`

**Why:** Enforces dependency injection pattern - features receive services through interfaces.

**Check:** `check_service_imports.mjs`

---

## 3. Service Boundaries

**RULE**: Services can ONLY import interfaces, types, and config from features.

**Allowed:**
- ✅ `@/(core|domain)/features/{feature}/I{Feature}Api.ts` (interfaces)
- ✅ `@/(core|domain)/features/{feature}/types/*` (feature types)
- ✅ `@/(core|domain)/features/{feature}/models/{model}/types/*` (model types)
- ✅ `@/(core|domain)/features/{feature}/config` (feature config)
- ✅ `@/services/*` (other services)
- ✅ External libraries

**Violations:**
- ❌ `@/pages/*`
- ❌ `@/hooks/*`
- ❌ `@/(core|domain)/features/{feature}/models/{model}/actions.ts`
- ❌ `@/(core|domain)/features/{feature}/models/{model}/slice.ts`
- ❌ `@/(core|domain)/features/{feature}/models/{model}/actionEffects/*`
- ❌ `@/(core|domain)/features/{feature}/hooks/*`
- ❌ `@/(core|domain)/features/{feature}/components/*`

**Why:** Services implement interfaces - they work with data contracts (interfaces + types + config), not implementation details.

**Check:** `check_service_boundaries.mjs`

---

## 4. Pages Boundaries

**RULE**: Pages can ONLY import presentation layer (components, hooks, hocs) from features.

**Allowed:**
- ✅ `@/(core|domain)/features/{feature}/components/*`
- ✅ `@/(core|domain)/features/{feature}/hooks/*`
- ✅ `@/(core|domain)/features/{feature}/hocs/*`
- ✅ `@/(core|domain)/features/{feature}/config`
- ✅ `@/hooks/*` (root hooks)
- ✅ External libraries

**Violations:**
- ❌ `@/services/*`
- ❌ `@/(core|domain)/features/{feature}/models/*`
- ❌ `@/(core|domain)/features/{feature}/types/*`
- ❌ `@/(core|domain)/features/{feature}/slice.ts`
- ❌ `@/(core|domain)/features/{feature}/sagas.ts`
- ❌ `@/(core|domain)/features/{feature}/I{Feature}Api.ts`

**Why:** Pages are presentation layer - they orchestrate UI, not business logic. All business logic should be in feature hooks.

**Check:** `check_pages_boundaries.mjs`

---

## 5. Model Internals Encapsulation

**RULE**: Cross-feature imports CANNOT access model internals (actions, slice, actionEffects).

**Allowed (cross-feature):**
- ✅ `@/(core|domain)/features/{feature}/models/{model}/types/*` (types only)
- ✅ `@/(core|domain)/features/{feature}/hooks/*` (feature hooks)
- ✅ `@/(core|domain)/features/{feature}/components/*`
- ✅ `@/(core|domain)/features/{feature}/hocs/*`

**Violations (cross-feature):**
- ❌ `@/(core|domain)/features/{feature}/models/{model}/actions.ts`
- ❌ `@/(core|domain)/features/{feature}/models/{model}/slice.ts`
- ❌ `@/(core|domain)/features/{feature}/models/{model}/actionEffects/*`
- ❌ `@/(core|domain)/features/{feature}/models/{model}/IModelApi.ts`

**Why:** Models are private implementation details. Features expose APIs through hooks, not direct model access.

**Note:** Within same feature, you can import model internals freely.

**Check:** `check_model_internals.mjs`

---

## 6. Slice Import Restriction

**RULE**: Feature `slice.ts` files MUST ONLY be imported in `src/config/features.ts`.

**Allowed:**
- ✅ `src/config/features.ts`

**Violations:**
- ❌ Any other file importing `@/(core|domain)/features/{feature}/slice`

**Why:** Slices are registered in composition root for Redux store setup.

**Check:** `check_slice_imports.mjs`

---

## 7. Sagas Import Restriction

**RULE**: Feature `sagas.ts` files MUST ONLY be imported in `src/config/features.ts`.

**Allowed:**
- ✅ `src/config/features.ts`

**Violations:**
- ❌ Any other file importing `@/(core|domain)/features/{feature}/sagas`

**Why:** Sagas are registered in composition root for Redux Saga middleware setup.

**Check:** `check_sagas_imports.mjs`

---

## 8. Circular Dependencies

**RULE**: Module dependencies must form a DAG (Directed Acyclic Graph). No circular imports.

**Detected:**
- Direct cycles: A ↔ B
- Deep cycles: A → B → C → A

**Why:** Circular dependencies cause bundling issues, hard to understand, difficult to test.

**Check:** `check_circular_deps.mjs`

---

# Architecture Layers

```
┌──────────────────────────────────────────┐
│  Composition Root (src/config/)          │ ← Wires everything together
├──────────────────────────────────────────┤
│  Core Features (src/core/features/)      │ ← Infrastructure
│  Domain Features (src/domain/features/)  │ ← Business Logic
├──────────────────────────────────────────┤
│  Service Layer (src/services/)           │ ← External integrations
└──────────────────────────────────────────┘
```

**Benefits:**
- Clear separation of concerns
- Core infrastructure doesn't know about business domains
- Easy to swap implementations (dependency injection)
- Features properly encapsulated

# Output Format

Each check reports:
- File paths and line numbers of violations
- What's wrong
- How to fix it
- Violation count
- Exit code 0 (success) or 1 (failures)

Reports are saved to `reports/{date}/arch-audit-report.md` when using `generate_report.mjs`.

# Tools

- **Bash**: Run Node.js scripts
- **Read**: Inspect source files
- **Write**: Generate reports (optional)

# Safety

- Read-only operation (unless generating reports)
- No source file modifications
- No external network calls
- Comprehensive dependency analysis
