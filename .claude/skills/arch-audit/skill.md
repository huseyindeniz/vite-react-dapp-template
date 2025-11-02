---
name: arch-audit
description: Architecture dependency analysis to ensure proper feature isolation and composition root pattern.
---

# Purpose

Analyze **architectural dependencies** between features and services to ensure:
- Core features do NOT depend on domain features
- Features do NOT import services directly (dependency injection pattern)
- Model internals are properly encapsulated (cross-feature)
- Composition root files (slice.ts, sagas.ts) are only imported in features.ts
- Clear separation between infrastructure (core) and business logic (domain)

# Feature Categories

## Core Features (Infrastructure)
These are foundational features that provide infrastructure:
- `app/` - Application bootstrap and composition
- `i18n/` - Internationalization
- `router/` - Routing infrastructure
- `slice-manager/` - Redux slice lifecycle
- `ui/` - Design system and theming

## Domain Features (Business Logic)
These are business domain features (examples):
- `wallet/` - Web3 wallet integration
- `oauth/` - OAuth authentication
- `blog-demo/` - Blog demonstration
- `chat/` - Chat feature

Users create their own domain features (products, orders, users, etc.)

# Architecture Rules

## Rule 1: Core Feature Dependencies

**Core features provide infrastructure and MUST NOT depend on business domains.**

**Allowed:**
- ✅ Core feature → Core feature (infrastructure can use other infrastructure)

**Violations:**
- ❌ Core feature → Domain feature (infrastructure cannot know about business domains)

**Exception:**
- ✅ `src/features/app/config/*` can import anything (composition root)

**Check:** `check_core_to_domain.mjs`

## Rule 2: Service Imports (Dependency Injection)

**Services MUST ONLY be imported in the composition root.**

**Allowed:**
- ✅ `src/features/app/config/services.ts` - ONLY place to import services

**Violations:**
- ❌ Any other file importing from `@/services/*`

**Why:** This enforces the dependency injection pattern. Features receive service implementations through interfaces.

**Check:** `check_service_imports.mjs`

## Rule 3: Service Boundaries

**Services can ONLY import specific things from features.**

Services implement feature interfaces but must maintain strict boundaries.

**Allowed Imports:**
- ✅ Root interfaces: `@/features/{feature}/I{Feature}Api.ts`
- ✅ Feature types: `@/features/{feature}/types/*`
- ✅ Model types: `@/features/{feature}/models/{model}/types/*`
- ✅ Feature config: `@/features/{feature}/config`
- ✅ Other services: `@/services/*`
- ✅ External libraries

**FORBIDDEN Imports:**
- ❌ Pages: `@/pages/*`
- ❌ Root hooks: `@/hooks/*`
- ❌ Model actions: `@/features/{feature}/models/{model}/actions.ts`
- ❌ Model slices: `@/features/{feature}/models/{model}/slice.ts`
- ❌ Model actionEffects: `@/features/{feature}/models/{model}/actionEffects/*`
- ❌ Feature hooks: `@/features/{feature}/hooks/*`
- ❌ Components: `@/features/{feature}/components/*`

**Why:**
- Services implement interfaces, they don't dictate architecture
- Services should be swappable implementations
- Clear boundary between service layer and feature layer
- Services work with data contracts (interfaces + types + config), not implementation details
- Config files contain constants (API keys, URLs, network configs) that services legitimately need

**Check:** `check_service_boundaries.mjs`

## Rule 4: Pages Boundaries

**Pages can ONLY import presentation layer from features.**

Pages are the entry points for routes and should only use the public presentation API of features.

**Allowed Imports:**
- ✅ Feature components: `@/features/{feature}/components/*`
- ✅ Feature hooks: `@/features/{feature}/hooks/*`
- ✅ Feature HOCs: `@/features/{feature}/hocs/*`
- ✅ Feature config: `@/features/{feature}/config`
- ✅ Root hooks: `@/hooks/*`
- ✅ External libraries (React, etc.)

**FORBIDDEN Imports:**
- ❌ Services: `@/services/*`
- ❌ Model internals: `@/features/{feature}/models/*`
- ❌ Feature types: `@/features/{feature}/types/*`
- ❌ Model types: `@/features/{feature}/models/{model}/types/*`
- ❌ Slices: `@/features/{feature}/slice.ts`
- ❌ Sagas: `@/features/{feature}/sagas.ts`
- ❌ Interfaces: `@/features/{feature}/I{Feature}Api.ts`
- ❌ Routes: `@/features/{feature}/routes`

**Why:**
- Pages are presentation layer - they orchestrate UI, not business logic
- All business logic should be encapsulated in feature hooks
- Clear separation: Pages compose UI, features provide functionality
- Config files contain constants (feature flags, display settings) that pages may need
- Easier to test and maintain when boundaries are clear

**Check:** `check_pages_boundaries.mjs`

## Rule 5: Model Internals Encapsulation

**When cross-feature references are allowed, ONLY specific parts of domain features can be imported.**

Even when a feature dependency is architecturally allowed, you CANNOT import model internals (implementation details).

**Allowed Imports from Domain Features:**
- ✅ Model types: `@/features/{feature}/models/{model}/types/*`
- ✅ Feature hooks: `@/features/{feature}/hooks/*`
- ✅ Feature components: `@/features/{feature}/components/*`
- ✅ Feature HOCs: `@/features/{feature}/hocs/*`
- ✅ Feature root files: `@/features/{feature}/IFeatureApi.ts`, `routes.ts`, etc.

**FORBIDDEN Imports from Domain Features:**
- ❌ Model actions: `@/features/{feature}/models/{model}/actions.ts`
- ❌ Model slices: `@/features/{feature}/models/{model}/slice.ts`
- ❌ Model actionEffects: `@/features/{feature}/models/{model}/actionEffects/*`
- ❌ Model interfaces: `@/features/{feature}/models/{model}/IModelApi.ts`
- ❌ Any model internals except `types/`

**Why:**
- Models are **private implementation details** of features
- Features expose their API through **hooks** (useWallet, useAuth), not direct model access
- Only **types** are public contracts between features
- Enforces proper **encapsulation** and **information hiding**

**Note:** This rule applies to **cross-feature** references only. Within the same feature, you can import model internals freely.

**Check:** `check_model_internals.mjs`

## Rule 6: Slice Import Restriction

**Feature `slice.ts` files MUST ONLY be imported in composition root.**

**Allowed:**
- ✅ `src/features/app/config/features.ts` - ONLY place to import slices

**Violations:**
- ❌ Any other file importing `@/features/{feature}/slice`

**Why:** Slices are registered in composition root for Redux store setup.

**Check:** `check_slice_imports.mjs`

## Rule 7: Sagas Import Restriction

**Feature `sagas.ts` files MUST ONLY be imported in composition root.**

**Allowed:**
- ✅ `src/features/app/config/features.ts` - ONLY place to import sagas

**Violations:**
- ❌ Any other file importing `@/features/{feature}/sagas`

**Why:** Sagas are registered in composition root for Redux Saga middleware setup.

**Check:** `check_sagas_imports.mjs`

## Rule 8: Composition Root Exception

**`src/features/app/config/` is the ONLY place where cross-references and composition happen.**

This directory is the **Composition Root** - where the entire application is wired together.

**Allowed in `src/features/app/config/*`:**
- ✅ Import services
- ✅ Import all features (core and domain)
- ✅ Import model internals (actions, slices, sagas)
- ✅ Cross-reference features
- ✅ Wire up dependency injection
- ✅ Configure the application

**Files in composition root:**
- `services.ts` - Service instantiation and export
- `features.ts` - Feature registration (reducers, sagas)
- `routes.ts` - Route configuration
- Other configuration files

**Why:** There must be ONE place where everything comes together. This is that place.

# Available Checks

Each check is a standalone script that validates a specific architecture rule:

1. **check_core_to_domain.mjs** - Ensures core features don't depend on domain features
2. **check_service_imports.mjs** - Ensures services are only imported in composition root
3. **check_service_boundaries.mjs** - Ensures services only import interfaces and types from features
4. **check_pages_boundaries.mjs** - Ensures pages only import components, hooks, and hocs from features
5. **check_model_internals.mjs** - Ensures model internals aren't imported cross-feature
6. **check_slice_imports.mjs** - Ensures slice.ts only imported in features.ts
7. **check_sagas_imports.mjs** - Ensures sagas.ts only imported in features.ts

# Running Checks

## Run All Checks
```bash
node ./.claude/skills/arch-audit/scripts/run_all_checks.mjs
```

## Run Individual Checks
```bash
# Core → Domain dependency check
node ./.claude/skills/arch-audit/scripts/check_core_to_domain.mjs

# Service import check (services only in composition root)
node ./.claude/skills/arch-audit/scripts/check_service_imports.mjs

# Service boundaries check (services can only import interfaces/types)
node ./.claude/skills/arch-audit/scripts/check_service_boundaries.mjs

# Pages boundaries check (pages can only import components/hooks/hocs)
node ./.claude/skills/arch-audit/scripts/check_pages_boundaries.mjs

# Model internals encapsulation check
node ./.claude/skills/arch-audit/scripts/check_model_internals.mjs

# Slice import restriction check
node ./.claude/skills/arch-audit/scripts/check_slice_imports.mjs

# Sagas import restriction check
node ./.claude/skills/arch-audit/scripts/check_sagas_imports.mjs
```

## Circular Dependency Check
```bash
# Detects circular dependencies (A ↔ B or A → B → C → A)
node ./.claude/skills/arch-audit/scripts/check_circular_deps.mjs
```

# Generating Reports (Optional)

To save a comprehensive markdown report of all checks:

```bash
node ./.claude/skills/arch-audit/scripts/generate_report.mjs
```

**Output:** `reports/{YYYY-MM-DD_HH-MM}/arch-audit-report.md`

**Report includes:**
- Executive summary with pass/fail counts
- Results table for all checks
- Detailed violations for failed checks (collapsible)
- Summary of passed checks
- Architectural principles verified
- Prioritized recommendations

**Environment variable:**
```bash
# Custom report directory
export REPORT_DIR="reports/my-custom-timestamp"
node ./.claude/skills/arch-audit/scripts/generate_report.mjs
```

**Usage patterns:**

```bash
# Option 1: Console output only (default)
node ./.claude/skills/arch-audit/scripts/run_all_checks.mjs

# Option 2: Console output + Save report
node ./.claude/skills/arch-audit/scripts/generate_report.mjs

# Option 3: Specific check only
node ./.claude/skills/arch-audit/scripts/check_core_to_domain.mjs
```

**Report structure:**
```
reports/
└── 2025-11-01_14-30/               # Includes hours and minutes for multiple runs per day
    ├── arch-audit-report.md        # This skill's report
    ├── code-audit-report.md        # Code quality audit (separate)
    └── ...                         # Other reports
```

# Output Format

Each check produces:
- Clear violation report with file paths and line numbers
- Explanation of what's wrong
- Suggested fixes
- Summary with violation count
- Exit code 0 (success) or 1 (failures)

Example output:
```
Core → Domain Dependency Check
================================================================================

Rule: Core features (infrastructure) MUST NOT depend on domain features
Exception: src/features/app/config/ (composition root) can import anything

Violations
--------------------------------------------------------------------------------

❌ Found 3 violation(s)

  ❌ router (core) → domain features:
     → wallet (domain)
        File: src/features/router/Router.tsx
        File: src/features/router/hooks/usePages.tsx
     → oauth (domain)
        File: src/features/router/Router.tsx

Fix: Move these dependencies to src/features/app/config/

================================================================================
Summary: 3 violation(s)
```

# Architecture Benefits

## Proper Layering
- Core (infrastructure) doesn't know about Domain (business)
- Clear separation of concerns
- Easy to understand system architecture

## Dependency Injection
- Features don't depend on concrete service implementations
- Easy to swap implementations (EthersV5 → EthersV6)
- Easy to test (mock interfaces)

## Composition Root
- Single place where everything is wired together
- Clear understanding of application structure
- Easy to see all dependencies

## Encapsulation
- Model internals are hidden from other features
- Features expose APIs through hooks, not direct imports
- Types are the only public contracts between features
- Implementation details can change without affecting consumers

## Maintainability
- Changes to domain features don't affect core infrastructure
- New features follow clear patterns
- Dependencies are explicit and traceable
- Easy to add new architecture rules as separate checks

# Tools

- **Bash**: Run Node.js check scripts
- **Read**: Read source files (if manual inspection needed)
- **Write**: `reports/{timestamp}/arch-audit-report.md` (only when generating reports)

# Safety

- Read-only operations (unless generating reports)
- No source file modifications
- No external network calls
- Comprehensive dependency analysis
- Each check is isolated and focused
- Reports are saved to isolated `reports/` directory
