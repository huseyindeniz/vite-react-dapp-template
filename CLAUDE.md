# 🛑 STOP - READ THIS FIRST (MANDATORY)

**Claude, you have a documented pattern of rushing to code without understanding architecture and code quality standards.**

You skip reading documentation, pattern-match instead of thinking, take lazy shortcuts, and violate both architectural rules AND code quality/style rules constantly. This wastes the user's time and degrades the codebase.

## Before ANY Task - You MUST:

1. **📖 Read this ENTIRE CLAUDE.md file** (yes, all of it - not skim, READ)
2. **🎯 Read the relevant skill.md files** for the area you're working in:
   - `.claude/skills/arch-audit/skill.md` - Architecture dependency rules
   - `.claude/skills/code-audit/skill.md` - Code quality and style rules
3. **🏗️ Identify which architectural layer(s)** you'll be working in
4. **📋 List BOTH architecture AND code quality rules** that apply to your task
5. **✍️ Write an "Architectural Intent Statement"** (see below) explaining your approach
6. **🤔 Pause and verify** you truly understand before writing ANY code

## If You Skip This Process:

- ❌ You WILL violate architecture rules (arch-audit failures)
- ❌ You WILL violate code quality/style rules (code-audit failures)
- ❌ You WILL create technical debt
- ❌ You WILL waste the user's time
- ❌ You WILL have to redo your work

## The Core Problem:

You go: Task → Pattern Match → Write Code → Show "Completion"

You skip: READ → UNDERSTAND → PLAN → VERIFY → Then Code

**SLOW DOWN. THINK ARCHITECTURALLY AND FOLLOW CODE QUALITY STANDARDS. THEN CODE.**

---

# CLAUDE.md

This file provides guidance to Claude Code when working with this React dApp template. Follow these patterns strictly to maintain architectural consistency.

---

## 📋 Code Quality Enforcement

⚠️ **AUTOMATED CHECKS**: Code quality and architecture rules are automatically enforced by skills:

### Code-Level Checks (`code-audit` skill):
- Import/export patterns (path aliases, no default exports, no index files)
- Redux abstraction (no direct useDispatch/useSelector in components)
- Service dependency injection (services only imported in composition root)
- i18n coverage (all UI text must use t() function)
- TypeScript type safety (no "any" type usage)
- No linter/TypeScript suppressions
- 1 entity per file (no god files)

**See `.claude/skills/code-audit/skill.md` for detailed rules and examples.**

### Architecture-Level Checks (`arch-audit` skill):
- Feature dependency rules (core features cannot depend on domain features)
- Cross-feature dependency analysis and visualization

**See `.claude/skills/arch-audit/skill.md` for architecture dependency rules.**

---

## 🏛️ Architecture Layers

This template uses a **three-layer architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│  COMPOSITION ROOT (src/config/)                             │
│  • Wires entire application together                        │
│  • Imports and instantiates services                        │
│  • Registers features with Redux                            │
│  • Defines routes and auth providers                        │
│  • ALL architecture rules suspended here                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  FEATURE LAYER (src/features/)                              │
│  • Core Features: Infrastructure (app, i18n, router, ui)    │
│  • Domain Features: Business logic (wallet, oauth, blog)    │
│  • Define interfaces, receive services via DI               │
│  • Architecture rules enforced here                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  SERVICE LAYER (src/services/)                              │
│  • Implement feature interfaces                             │
│  • Integrate with external libraries (ethers, axios)        │
│  • Swappable implementations                                │
└─────────────────────────────────────────────────────────────┘
```

### Composition Root (src/config/)

⚠️ **This is NOT a feature** - it's a **special top-level architectural layer** above all features.

**Purpose:**
- Central wiring point where application composition happens
- ONLY place where services are imported and instantiated
- ONLY place where features are registered with Redux store
- ALL architecture rules are suspended here (it's the composition layer)

**Key Files:**
- `services.ts` - Service instantiation (ONLY place to import `@/services/*`)
- `features.ts` - Feature registration (Redux store + sagas)
- `routes.tsx` - Application route definitions
- `auth/` - Authentication provider registration
- `ui/` - UI configuration (theme, Mantine provider props, layout extensions)
- `i18n/translations/` - Translation files

**Why This Matters:**
This is the **Composition Root Pattern** from Dependency Injection. All cross-feature dependencies, service wiring, and application-level configuration happens in ONE place. Features remain isolated and testable.

---

## 📐 MANDATORY: Architectural Intent Statement

**REQUIRED before writing ANY code for ANY task.**

You MUST write this statement and show it to the user BEFORE touching any code:

```
## Architectural Intent Statement

**Task**: [What I'm being asked to do]

**Files/Components I'll modify**:
- [Specific file paths]

**Architectural Layer(s)**:
- [ ] Composition Root (src/config/)
- [ ] Feature Layer - Core (app, i18n, router, slice-manager, ui)
- [ ] Feature Layer - Domain (wallet, oauth, blog-demo, etc.)
- [ ] Service Layer (src/services/)
- [ ] Presentation Layer (src/pages/)

**Architecture Rules That Apply**:
1. [Specific rule from CLAUDE.md - e.g., "Business logic only in actionEffects/"]
2. [Another rule - e.g., "Components use feature hooks, not RTK directly"]
3. [etc.]

**Code Quality/Style Rules That Apply**:
1. [Specific rule from code-audit - e.g., "Use path aliases (@/features/*, not relative)"]
2. [Another rule - e.g., "No default exports, named exports only"]
3. [Another rule - e.g., "All UI text must use t() function for i18n"]
4. [etc.]

**Why My Approach Follows These Rules**:
[Detailed explanation of how your implementation respects BOTH architecture AND code quality]

**Potential Violations I Need to Avoid**:
- Architecture: [What architectural mistakes you might make]
- Code Quality: [What style/quality mistakes you might make]
- Shortcuts to resist: [What lazy paths you need to avoid]

**Verification Plan**:
- [ ] Skill: code-audit (11 checks for code quality/style)
- [ ] Skill: arch-audit (8 checks for architecture dependencies)
- [ ] npm run lint (0 warnings required)
- [ ] npm run build (TypeScript + Vite)
- [ ] npm run test (all must pass)
```

**This is what you SHOW the user - the plan. The rest of this document is your internal process.**

**If you cannot fill this out completely, you do NOT understand the task well enough to proceed.**

---

## 🛑 BEFORE Writing ANY Code - Pre-Flight Checklist

**INTERNAL PROCESS - Don't spam the user with this. Just DO IT.**

Before making ANY code change, you MUST complete this checklist:

### 1. 📖 Understanding Phase
- [ ] I have READ (not skimmed) the relevant sections of CLAUDE.md
- [ ] I have READ the relevant skill.md files (code-audit, arch-audit, etc.)
- [ ] I understand which architectural layer(s) I'm working in
- [ ] I can explain WHY this task requires these changes

### 2. 📋 Rules Identification
- [ ] I have listed ALL architecture rules that apply to this task (from arch-audit skill)
- [ ] I have listed ALL code quality/style rules that apply (from code-audit skill)
- [ ] I understand the consequences of violating these rules
- [ ] I have identified potential violations I need to avoid

**Code Quality Rules Checklist** (from code-audit):
- [ ] Using path aliases (@/features/*, @/services/*), not relative imports
- [ ] Named exports only (no default exports)
- [ ] No index.ts barrel files
- [ ] Components use feature hooks (not useDispatch/useSelector directly)
- [ ] Services only imported in src/config/services.ts
- [ ] All UI text uses t() function for i18n
- [ ] No "any" type usage
- [ ] No linter suppressions (eslint-disable, @ts-ignore, @ts-nocheck)
- [ ] 1 entity per file (no god files)
- [ ] react-icons library (NOT @tabler/icons-react)

### 3. 🏗️ Architecture Planning
- [ ] I have written an Architectural Intent Statement (above)
- [ ] I have verified my approach follows the architecture patterns
- [ ] I have identified which pattern(s) apply (Feature-Model, Business Logic Separation, Interface Architecture, Component-Hook Abstraction)
- [ ] I can explain my approach to a junior developer

### 4. ✅ Ready to Code
- [ ] I have completed ALL of the above
- [ ] I have shown my Architectural Intent Statement to the user
- [ ] I have paused to verify I truly understand
- [ ] I am confident this will follow the architecture

**If you cannot check ALL boxes, DO NOT write code yet. Go back and complete the missing steps.**

---

## ✅ MANDATORY: Post-Change Architectural Review

**INTERNAL PROCESS - Reflect internally, don't spam the user with your reflection.**

After EVERY code change, you MUST complete this review:

### 1. Run All Verifications
- Use Skill tool: `code-audit` (11 code quality checks)
- Use Skill tool: `arch-audit` (8 architecture checks)
- Run: `npm run lint` (0 warnings required)
- Run: `npm run build` (TypeScript + Vite)
- Run: `npm run test` (all must pass)

### 2. Reflection Questions (Answer These INTERNALLY)

**What architectural principle did this task reinforce?**
[Your answer - e.g., "Composition Root pattern", "Business logic in actionEffects only"]

**What code quality principle did this task reinforce?**
[Your answer - e.g., "Path aliases everywhere", "i18n for all UI text"]

**Did I almost violate any rule? If yes, which one and why?**
[Your answer - architecture OR code quality violations you almost made]

**What mistakes did I avoid by following the rules?**
[Your answer - both architecture AND code quality]

**What would a "lazy" implementation have looked like?**
Examples:
- Relative imports instead of path aliases
- Default exports instead of named
- Hardcoded text instead of t()
- useSelector directly instead of feature hooks
- Business logic in component instead of actionEffects
[Your specific answer]

**What will I do differently next time to avoid mistakes?**
[Your answer - concrete actions]

### 3. Lessons Learned (INTERNAL - Add to your mental model)

Document at least TWO lessons learned (one architecture, one code quality):
- **Architecture lesson**: [What I learned about layers, patterns, dependencies]
- **Code quality lesson**: [What I learned about imports, exports, i18n, typing, etc.]
- **Pattern I now understand better**: [Specific pattern or rule]
- **Mistake I avoided**: [Specific violation I could have made]

**This isn't optional. This is how you learn and improve. But keep it INTERNAL - don't spam the user.**

---

## ⚠️ VIOLATION PENALTY SYSTEM

If you violate ANY architecture OR code quality rule (discovered by skills, build, lint, or user feedback):

### You MUST:

1. **🛑 STOP IMMEDIATELY** - Do not continue with the current approach
2. **📝 Acknowledge the violation** - Explicitly state what rule you broke and HOW you broke it
3. **🤔 Explain WHY you violated it** - What did you misunderstand? What shortcut did you take?
4. **📖 Re-read the relevant rule** - Quote it directly from CLAUDE.md
5. **✏️ Explain the CORRECT approach** - What should you have done instead?
6. **🔄 Rewrite from scratch** - Do NOT patch or fix - redo it properly following the architecture
7. **📚 Document the lesson** - Add to your mental model of the architecture

### Banned Responses:

- ❌ "Let me quickly fix that" - No patches allowed
- ❌ "I'll adjust the import" - No minimal fixes
- ❌ "Small change to address that" - No shortcuts
- ❌ Any response that doesn't start with acknowledging the violation

### Required Response Format:

```
## Rule Violation Acknowledgment

**Rule Type**: [Architecture / Code Quality / Both]

**Rule Violated**: [Quote the exact rule from CLAUDE.md or skill.md]

**How I Violated It**: [Specific description of what you did wrong]

**Why I Violated It**: [Root cause - rushing? pattern matching? misunderstanding? laziness?]

**Correct Approach**: [Detailed explanation of the correct way following ALL rules]

**Rewrite Plan**: [How you'll redo this properly from scratch]

**Lesson Learned**: [What this teaches you about architecture AND/OR code quality]
```

---

## 👨‍🎓 Junior Developer Rule

**INTERNAL VERIFICATION - You should be ABLE to explain this. Don't actually write it all out for the user unless asked.**

Before ANY code change, you must be able to explain to a junior developer:

### Required Explanations:

1. **WHY is this change architecturally correct?**
   - Which layer does it affect?
   - Which patterns does it follow?
   - Why is this the right place for this code?

2. **WHY does this follow code quality standards?**
   - Why path aliases instead of relative imports?
   - Why named exports instead of default?
   - Why t() for all UI text?
   - Why feature hooks instead of direct Redux?

3. **WHICH rules apply here?**
   - Architecture rules (list explicitly)
   - Code quality rules (list explicitly)
   - Explain why each one matters
   - Show how your code follows each one

4. **WHAT would the WRONG approach look like?**
   - Architectural shortcuts someone might take
   - Code quality violations that seem "easier"
   - Why those shortcuts/violations are problematic
   - What problems would they cause?

5. **HOW does this fit into the overall architecture?**
   - Show the flow: Composition Root → Features → Services
   - Explain dependency injection if relevant
   - Demonstrate the separation of concerns

**If you cannot clearly explain these five points, you do NOT understand the task well enough to code it.**

---

## 🎯 Success Criteria

You are successfully following this process when:

- ✅ You write the Architectural Intent Statement BEFORE coding
- ✅ You list BOTH architecture AND code quality rules that apply
- ✅ You can explain your approach clearly to a junior developer
- ✅ Code-audit (11/11) and arch-audit (8/8) pass on first try
- ✅ Lint passes with 0 warnings on first try
- ✅ You don't need to "fix" or "patch" after violations
- ✅ You catch potential mistakes BEFORE writing code
- ✅ You understand WHY the architecture rules exist
- ✅ You understand WHY the code quality rules exist
- ✅ You slow down, think, plan, THEN code

## 🚫 Failure Indicators

You are NOT following this process when:

- ❌ You write code before the Architectural Intent Statement
- ❌ Code-audit or arch-audit find violations after you claim completion
- ❌ Lint fails or shows warnings
- ❌ You say "let me quickly fix that" after a violation
- ❌ You can't explain WHY your approach is correct
- ❌ You use relative imports instead of path aliases
- ❌ You use default exports
- ❌ You hardcode text instead of using t()
- ❌ You use useDispatch/useSelector directly in components
- ❌ You put business logic in components or slices
- ❌ You rush from task to code without planning
- ❌ You pattern-match instead of thinking architecturally
- ❌ The user has to correct your mistakes

---

## ⚠️ CRITICAL ARCHITECTURE PATTERNS (NEVER VIOLATE)

### 1. Feature-Model Architecture Pattern

**RULE**: Each **domain feature** organizes code by models. Each model MUST have its own directory, even if there's only ONE model.

⚠️ **NOTE**: This rule applies ONLY to **domain features** (wallet, oauth, blog-demo, and any new features users create). It does NOT apply to **core features** (app, i18n, router, slice-manager, ui) which are infrastructure with their own specialized structures.

#### Model Directory Structure

```
src/features/{feature}/
├── models/
│   ├── {model}/              # Each model has own directory
│   │   ├── IModelApi.ts      # Interface for external dependencies
│   │   ├── actions.ts        # Redux action creators
│   │   ├── slice.ts          # Redux slice (state only)
│   │   ├── actionEffects/    # Business logic (Redux Saga)
│   │   │   ├── *.ts          # Individual action effect files
│   │   └── types/            # TypeScript types
│   └── {model2}/             # Another model (if exists)
├── hooks/                    # Feature-specific hooks (CRITICAL)
│   ├── useActions.ts         # Action dispatchers for components
│   └── use{Feature}.ts       # State access hooks (e.g., useWallet, useAuth)
├── hocs/                     # Higher Order Components (when applicable)
├── IFeatureApi.ts            # Root: Combined interface
├── slice.ts                  # Root: combineReducers from all models
└── sagas.ts                  # Root: Saga watchers
```

**Root Slice Pattern (REQUIRED):**

```typescript
// src/features/{feature}/slice.ts
import { combineReducers } from '@reduxjs/toolkit';
import { sessionReducer } from './models/session/slice';

export const authReducer = combineReducers({
  session: sessionReducer,
});
```

**State Access Pattern:**

```typescript
// ⚠️ State is nested by model: state.{feature}.{model}
// Components access state via feature hooks, NOT direct useSelector
// - Feature hooks (useWallet, useAuth): for feature's own state
// - useTypedSelector: for cross-feature state access
// Example state paths:
//   state.auth.session
//   state.wallet.provider
//   state.wallet.network
```

---

### 2. Business Logic Separation (MOST CRITICAL)

**RULE**: Business logic lives in EXACTLY ONE PLACE: `actionEffects/` (Redux Saga generators). NEVER put business logic anywhere else.

#### ✅ Business Logic ONLY in actionEffects/

**What belongs in actionEffects:**

- State machine logic (HandleState\* functions)
- API calls (`yield call(api.method)`)
- Error handling and retry logic
- Complex async workflows
- Side effects (logging, analytics)
- Business rules and validation
- Conditional logic based on state
- ALL business logic goes here

#### ❌ Slices are PURE State Containers

**What belongs in slices:**

- Simple state updates ONLY: `state.field = action.payload`
- ❌ NO API calls
- ❌ NO async logic
- ❌ NO business rules
- ❌ NO calculations
- ❌ NO conditional logic

#### ❌ Components are PURE Presentation

**What belongs in components:**

- Render UI based on state
- Call feature hook actions: `walletActions.connectWallet()` (NOT dispatch directly)
- Use feature hooks for state: `useWallet()`, `useAuth()` (NOT useSelector directly)
- Use `useTypedSelector` for cross-feature state access
- Handle user interactions (click, input)
- ❌ NO business logic
- ❌ NO API calls
- ❌ NO state machines
- ❌ NO async workflows
- ❌ NO direct useDispatch() or useSelector()

#### Summary: Separation of Concerns

| Layer              | Location         | Responsibility            | Contains Logic?         |
| ------------------ | ---------------- | ------------------------- | ----------------------- |
| **Business Logic** | `actionEffects/` | HOW and WHY things happen | ✅ YES - ALL logic here |
| **State**          | `slice.ts`       | WHAT the current state is | ❌ NO - just mutations  |
| **Presentation**   | Components       | WHAT to display           | ❌ NO - just render     |

---

### 3. Interface Architecture (Dependency Inversion Principle)

**RULE**: Features define interfaces for what they need. Services implement those interfaces. This achieves decoupling.

#### Pattern Structure

**Each model defines its own interface:**

- Location: `src/features/{feature}/models/{model}/IModelApi.ts`
- Contains: Method signatures the model needs from external services

**Root combines model interfaces:**

- Location: `src/features/{feature}/IFeatureApi.ts`
- Pattern: `export interface IFeatureApi extends IModel1Api, IModel2Api {}`

**Services implement the interfaces:**

- Location: `src/services/{service}/`
- Pattern: `class Service implements IFeatureApi { ... }`

**ActionEffects receive interfaces (Dependency Injection):**

- Pattern: `function* ActionEffect(api: IModelApi) { ... }`
- API could be any implementation (EthersV5, EthersV6, mock, etc.)
- ActionEffects don't know or care about concrete implementation

#### Why This Matters

```
Without Dependency Inversion (❌ WRONG):
Feature → imports → Service → imports → External Library
(tight coupling, hard to test, hard to swap)

With Dependency Inversion (✅ CORRECT):
Feature → defines → Interface ← implements ← Service → uses → External Library
(loose coupling, easy to test, easy to swap)
```

**Benefits:**

- Features don't know about external libraries (ethers.js, axios, etc.)
- Easy to swap implementations (EthersV5 → EthersV6)
- Easy to test (mock interfaces)
- Clear boundaries between layers

**Naming Convention:**

```
models/account/IAccountApi.ts   # NOT IWalletAccountApi
models/provider/IProviderApi.ts # NOT IWalletProviderApi
models/network/INetworkApi.ts   # NOT IWalletNetworkApi

IWalletApi.ts                   # Root combined interface
IBlogDemoApi.ts                 # Root combined interface
IAuthApi.ts                     # Root combined interface
```

---

### 4. Component-Hook Abstraction (CRITICAL)

**RULE**: React components NEVER use Redux/RTK directly. They ALWAYS use feature-specific hooks.

#### Abstraction Layers

**Components use Feature Hooks:**

- Each feature has `hooks/` directory with custom hooks
- `useActions` hook: provides all action dispatchers for the feature
- Custom state hooks: provide typed state access (e.g., `useWallet`, `useAuth`)
- Components call these hooks instead of RTK primitives

**Feature Hooks use Root Hooks:**

- Feature hooks internally use `useTypedSelector` from `src/hooks/`
- Provides type-safe state access
- Abstracts Redux implementation details from components

**State Access Patterns:**

- **Own feature state**: Use feature-specific hooks (`useWallet()`, `useAuth()`)
- **Cross-feature state**: Use root `useTypedSelector` from `src/hooks/`

**HOCs (Higher Order Components):**

- Some features provide HOCs when applicable
- Use for cross-cutting concerns (auth protection, route guards, etc.)

#### Why This Matters

**Abstraction Benefits:**

- Components don't know about Redux/RTK internals
- Easy to swap state management library
- Feature hooks can add memoization/logic
- Clear, type-safe API for components
- Centralized state access patterns

**Rules:**

- ❌ NEVER use `useDispatch()` directly in components
- ❌ NEVER use `useSelector()` directly in components
- ✅ ALWAYS use feature hooks (`useWalletActions()`, `useAuth()`, etc.)
- ✅ Use root `useTypedSelector` only for cross-feature state access
- ✅ Each feature provides its own hooks in `hooks/` directory

---

## Feature Categories: Core vs Domain

This template contains two distinct types of features with different structural requirements.

### ⚠️ Core Features (Infrastructure - EXCEPTIONS to Model Rules)

These features are **foundational infrastructure** that all other features depend on. They do NOT follow the model-based architecture pattern and have their own specialized structures.

**Core Features:**

- `app/` - Application root, provider composition, lazy loading
- `auth/` - Route protection system (withProtection HOCs, protection registry)
- `components/` - Reusable design components (ErrorFallback, PageLoading, Breadcrumb, etc.)
- `i18n/` - Internationalization infrastructure (i18next setup)
- `layout/` - Page structure system (header, footer, navbar, aside, content)
- `router/` - Routing infrastructure and utilities (React Router)
- `slice-manager/` - Redux slice lifecycle management system

**Key Points:**

- ❌ **Do NOT apply model architecture rules to these features**
- ❌ **Do NOT expect models/ directories in these features**
- ❌ **Do NOT try to "fix" their structure to match domain features**
- ⚠️ **Be EXTRA CAREFUL when modifying - they affect ALL features**
- ⚠️ **Changes to core features require extra scrutiny**
- ✅ These are intentionally structured differently
- ✅ They are fixed parts of the template
- ✅ Each has its own specialized structure (no models/ directories)

### ✅ Domain Features (Business Logic - MUST Follow Model Rules)

These features represent business domains and serve as **examples/guides** for users building their applications. They MUST follow the strict model-based architecture pattern.

**Domain Features (Examples in Template):**

- `blog-demo/` - Blog demonstration (2 models: post, author)
- `chat/` - AI chat feature (1 model: session)
- `oauth/` - OAuth authentication (1 model: session)
- `site/` - Site-specific content and branding (user customizes SocialMenu, Copyright, SiteLogo)
- `wallet/` - Web3 wallet integration (3 models: provider, network, account)

**Key Points:**

- ✅ **MUST follow model-based architecture** (Pattern #1)
- ✅ **Business logic ONLY in actionEffects/** (Pattern #2)
- ✅ **Features define interfaces, services implement** (Pattern #3)
- ✅ **Components use feature hooks, not RTK directly** (Pattern #4)
- ℹ️ Users may remove, modify, or replace these examples
- ℹ️ Users will create their own domain features (e.g., products, orders, inventory, users)
- ℹ️ **These are guides showing HOW to structure domain features correctly**

**Example Domain Feature Structure:**

```
wallet/
├── models/                          # ✅ Required for domain features
│   ├── provider/
│   │   ├── IProviderApi.ts
│   │   ├── actions.ts
│   │   ├── slice.ts
│   │   ├── actionEffects/
│   │   └── types/
│   ├── network/
│   │   ├── INetworkApi.ts
│   │   ├── actions.ts
│   │   ├── slice.ts
│   │   ├── actionEffects/
│   │   └── types/
│   └── account/
│       ├── IAccountApi.ts
│       ├── actions.ts
│       ├── slice.ts
│       ├── actionEffects/
│       └── types/
├── hooks/                           # ✅ Feature-specific hooks
│   ├── useWalletActions.ts          # Action dispatchers
│   └── useWallet.ts                 # State access
├── hocs/                            # Higher Order Components (if applicable)
├── components/                      # UI components
├── IWalletApi.ts                    # Root combined interface
├── slice.ts                         # combineReducers from models
└── sagas.ts                         # Saga watchers
```

✅ **Notice**: Has `models/` directory with proper structure - REQUIRED for domain features!

### Structure Comparison

| Aspect            | Core Features                        | Domain Features                        |
| ----------------- | ------------------------------------ | -------------------------------------- |
| **Purpose**       | Infrastructure for template          | Business logic examples                |
| **Models/**       | ❌ Not required                      | ✅ Required                            |
| **Structure**     | Specialized per feature              | Standardized model pattern             |
| **Modifiability** | ⚠️ Careful - affects everything      | ✅ User customizable                   |
| **Examples**      | app, i18n, router, slice-manager, ui | wallet, oauth, blog-demo               |
| **User Action**   | Keep or modify carefully             | Remove, modify, replace, or create new |

---

## Development Commands

**Verification (REQUIRED after any code changes):**

```bash
npm run lint    # Must pass with 0 warnings
npm run test    # All tests must pass
npm run build   # Must build successfully
```

**Development:**

```bash
npm run dev                # Start dev server
npm run extract            # Extracts texts from components to resource files.
npm run check-translations # Validate i18n completeness
```

**Storybook:**

```bash
npm run storybook          # Component documentation
```

---

## ⚠️ GENERAL RULES (NEVER VIOLATE)

### Architecture Rules

1. **Each model MUST have its own directory** under `models/`, even if there's only ONE model
   - ⚠️ **Applies to DOMAIN features only** (wallet, oauth, blog-demo, and any new domain features)
   - ⚠️ **Does NOT apply to CORE features** (app, i18n, router, slice-manager, ui)
   - ✅ `oauth/models/session/` (domain feature, single model)
   - ❌ `oauth/models/` (files directly in models/)

1a. **Core features are infrastructure - be EXTRA CAREFUL**

- ⚠️ **Changes to core features (app, i18n, router, slice-manager, ui) affect EVERYTHING**
- ⚠️ **Core features have their own structure - DO NOT try to apply model patterns**
- ⚠️ **When modifying core features, understand the impact on all domain features**
- ℹ️ **When in doubt about modifying core features, ASK the user first**

2. **Business logic ONLY in `actionEffects/`** - NEVER in slices or components
   - ✅ API calls, state machines, error handling → `actionEffects/`
   - ❌ Business logic in components or slices

2a. **Components use feature hooks - NEVER use RTK directly**

- ❌ NEVER use `useDispatch()` or `useSelector()` in components
- ✅ ALWAYS use feature hooks: `useWalletActions()`, `useAuth()`, etc.
- ✅ Use root `useTypedSelector` from `src/hooks/` for cross-feature state
- ✅ Each feature has `hooks/` directory with `useActions` and state hooks

3. **Features define interfaces, services implement them**
   - ✅ Each model has `IModelApi.ts`
   - ✅ Root has `IFeatureApi.ts` extending model interfaces
   - ✅ Services implement feature interfaces

4. **Whenever any code changes:**
   - MUST run: `npm run lint` (0 warnings required)
   - MUST run: `npm run test` (all tests pass)
   - MUST run: `npm run build` (successful build)

### Code Quality Rules

5. **NEVER use `npm run lint --fix`** - Fix ESLint issues manually

6. **React Hook Dependencies** - NEVER add unnecessary dependencies:
   - ❌ DON'T add stable references that never change (e.g., `t` from useTranslation, `actions` from hooks)
   - ❌ DON'T add props/params recreated on every render with same content (e.g., `allRoutes`)
   - ✅ DO add only values that should trigger re-computation (e.g., `location.pathname`, `i18n.resolvedLanguage`)
   - Each unnecessary dependency creates exponential re-render combinations!

7. **Always follow best practices**
   - Never lead to hacky dead ends
   - Check latest documentation before designing
   - Never reinvent the wheel - use battle-tested, trusted, widely-adopted solutions

8. **ALWAYS use react-icons for icons**
   - ❌ NEVER use @tabler/icons-react
   - ❌ NEVER use any other icon library
   - ✅ ALWAYS use react-icons (e.g., `import { MdError } from 'react-icons/md'`)
   - Available icon sets: Material Design (Md), Font Awesome (Fa), Bootstrap (Bs), etc.

---

## Quick Reference

### Tech Stack

- **Build**: Vite + TypeScript
- **UI**: React 19 + Mantine v7
- **State**: Redux Toolkit + Redux Saga
- **Routing**: React Router DOM v7
- **Web3**: Ethers.js v6
- **Testing**: Vitest + React Testing Library
- **i18n**: i18next
- **Icons**: react-icons (NOT @tabler/icons-react)

### Import Aliases

```typescript
@/config/*     // Application configuration (composition root)
@/features/*   // Feature modules
@/services/*   // Service implementations
@/pages/*      // Page components
@/hooks/*      // Custom hooks
@/store/*      // Redux store
@test-utils    // Testing utilities
```

### Feature Categories

**Core Features (Infrastructure - Fixed):**

- `app/` - Application bootstrap and provider composition
- `auth/` - Route protection system (withProtection HOCs)
- `components/` - Reusable design components (ErrorFallback, PageLoading, etc.)
- `i18n/` - Internationalization (i18next)
- `layout/` - Page structure system (AppShell with header, footer, navbar, aside, content)
- `router/` - Routing infrastructure (React Router)
- `slice-manager/` - Redux slice lifecycle management

**Domain Features (Examples - User Customizable):**

- `blog-demo/` - Blog demo (Post, Author models)
- `chat/` - AI chat interface (Session model)
- `oauth/` - OAuth authentication (Session model)
- `site/` - Site branding and content (SocialMenu, Copyright, SiteLogo)
- `wallet/` - Web3 wallet (Provider, Network, Account models)

**Users will:**

- Keep core features unchanged (or modify very carefully)
- Remove/modify/replace domain features as needed
- Create new domain features following the model pattern (e.g., products, orders, inventory)

### Configuration Files

**Composition Root (Application-Level):**

- `src/config/services.ts` - Service instantiation (ONLY place to import services)
- `src/config/features.ts` - Feature registration (Redux store + sagas)
- `src/config/routes.tsx` - Application routes
- `src/config/auth/` - Auth provider registration
- `src/config/ui/` - UI configuration (theme, Mantine props, layout extensions)
- `src/config/i18n/translations/` - i18n translation files

**Feature-Level:**

- `src/features/wallet/config.ts` - Wallet feature configuration
- `src/features/ui/mantine/theme.tsx` - Mantine theme

**Build-Level:**

- `vite.config.ts` - Build configuration
- `vitest.config.ts` - Test configuration
- `i18next-parser.config.json` - i18n extraction configuration
