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

# Architecture Layers

## Composition Root (Top-Level Configuration)
**Location:** `src/config/`

This is NOT a feature - it's a **special top-level architectural layer** above all features.

**Purpose:**
- Wires the entire application together
- Imports and instantiates services
- Registers features with Redux store
- Defines application routes
- Cross-feature dependency composition

**Files:**
- `services.ts` - Service instantiation (ONLY place to import `@/services/*`)
- `features.ts` - Feature registration (slices, sagas)
- `routes.tsx` - Route configuration
- `auth/` - Auth provider registration
- `ui/` - UI configuration (theme, Mantine props)

**Key Point:** This is where ALL architecture rules are ALLOWED to be broken, because it's the composition layer.

## Core Features (Infrastructure)
These are foundational features that provide infrastructure:
- `app/` - Application bootstrap (App.tsx, store, context providers)
- `auth/` - Route protection system (withProtection HOCs, protection registry)
- `i18n/` - Internationalization
- `router/` - Routing infrastructure
- `slice-manager/` - Redux slice lifecycle
- `ui/` - Design system and theming (Mantine components)

## Domain Features (Business Logic)
These are business domain features (examples):
- `wallet/` - Web3 wallet integration
- `oauth/` - OAuth authentication
- `blog-demo/` - Blog demonstration
- `chat/` - AI chat feature

Users create their own domain features (products, orders, users, etc.)

# Architecture Rules

## Rule 1: Core Feature Dependencies

**Core features provide infrastructure and MUST NOT depend on business domains.**

**Allowed:**
- ✅ Core feature → Core feature (infrastructure can use other infrastructure)

**Violations:**
- ❌ Core feature → Domain feature (infrastructure cannot know about business domains)

**Note on Composition Root:**
- `src/config/` is NOT checked by this rule - it's not a feature at all
- `src/config/` sits above the feature layer and can import anything
- Only code in `src/features/` is subject to this rule

**Check:** `check_core_to_domain.mjs`

## Rule 2: Service Imports (Dependency Injection)

**Services MUST ONLY be imported in the composition root.**

**Allowed:**
- ✅ `src/config/services.ts` - ONLY place to import services

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
- ✅ `src/config/features.ts` - ONLY place to import slices

**Violations:**
- ❌ Any other file importing `@/features/{feature}/slice`

**Why:** Slices are registered in composition root for Redux store setup.

**Check:** `check_slice_imports.mjs`

## Rule 7: Sagas Import Restriction

**Feature `sagas.ts` files MUST ONLY be imported in composition root.**

**Allowed:**
- ✅ `src/config/features.ts` - ONLY place to import sagas

**Violations:**
- ❌ Any other file importing `@/features/{feature}/sagas`

**Why:** Sagas are registered in composition root for Redux Saga middleware setup.

**Check:** `check_sagas_imports.mjs`

## Rule 8: Composition Root (Top-Level Configuration Layer)

**`src/config/` is NOT a feature - it's a top-level architectural layer where ALL rules are suspended.**

This directory sits ABOVE the feature layer and is responsible for wiring the entire application together.

**Architectural Position:**
```
src/
├── config/              ← Composition Root (THIS LAYER)
│   ├── services.ts      ← Service instantiation
│   ├── features.ts      ← Feature registration
│   ├── routes.tsx       ← Route definitions
│   ├── auth/            ← Auth configuration
│   └── ui/              ← UI configuration
├── features/            ← Feature Layer (Core + Domain)
├── services/            ← Service Layer (Implementations)
├── pages/               ← Presentation Layer
└── hooks/               ← Shared Hooks
```

**Allowed in `src/config/*` (ALL rules suspended):**
- ✅ Import services directly (`@/services/*`)
- ✅ Import all features (core and domain)
- ✅ Import model internals (actions, slices, sagas, actionEffects)
- ✅ Cross-reference between any features
- ✅ Wire up dependency injection
- ✅ Break any other architecture rule

**Why:**
- Every application needs ONE place where everything is composed together
- This is the "main()" function of the architecture
- All dependency injection happens here
- All feature registration happens here
- This is intentionally outside the feature hierarchy

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
Exception: src/config/ (composition root) can import anything

Violations
--------------------------------------------------------------------------------

❌ Found 3 violation(s)

  ❌ router (core) → domain features:
     → wallet (domain)
        File: src/features/router/Router.tsx
        File: src/features/router/hooks/usePages.tsx
     → oauth (domain)
        File: src/features/router/Router.tsx

Fix: Move these dependencies to src/config/

================================================================================
Summary: 3 violation(s)
```

# Architecture Benefits

## Layered Architecture
```
┌─────────────────────────────────────┐
│  Composition Root (src/config/)     │ ← Top Layer: Wiring & Configuration
├─────────────────────────────────────┤
│  Feature Layer (src/features/)      │ ← Middle Layer: Core + Domain Features
│  - Core: app, i18n, router, ui      │
│  - Domain: wallet, oauth, blog      │
├─────────────────────────────────────┤
│  Service Layer (src/services/)      │ ← Bottom Layer: External Integrations
│  - EthersV6, OAuth, API clients     │
└─────────────────────────────────────┘
```

**Benefits:**
- Clear separation: Composition → Features → Services
- Core infrastructure doesn't know about business domains
- Easy to understand system architecture at a glance

## Dependency Injection
- Features don't depend on concrete service implementations
- Easy to swap implementations (EthersV5 → EthersV6)
- Easy to test (mock interfaces)
- All wiring happens in `src/config/services.ts`

## Composition Root Pattern
- Single top-level place (`src/config/`) where everything is wired together
- Not part of any feature - sits above the feature layer
- Clear understanding of application structure
- Easy to see all dependencies and composition logic

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
