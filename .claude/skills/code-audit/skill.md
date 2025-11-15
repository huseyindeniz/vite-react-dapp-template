---
name: code-audit
description: Comprehensive static code analysis to enforce architectural patterns, conventions, and code quality standards.
---

# Purpose

Enforce code quality and consistency standards across the entire codebase through automated checks.

**What it checks (14 checks, each with its own script):**
1. Path alias usage (no relative imports to aliased dirs)
2. Export patterns (no default exports, no index files)
3. Redux abstraction (components use hooks, not direct Redux)
4. Service isolation (dependency injection pattern)
5. i18n coverage (all UI text wrapped in t())
6. Type safety (no "any" type)
7. No linter/TypeScript suppressions
8. No god files (1 entity per file)
9. No TODO/FIXME/HACK comments
10. No console usage (use loglevel instead)
11. Redux saga patterns (efficient parallelism)
12. No type assertions (no "as const", no "satisfies")
13. No re-exports (import directly from source)
14. No "type" keyword in imports (plain imports only)

**What it doesn't check:**
- Feature dependency rules (core → domain) - see `arch-audit` skill

# Architecture Context

This template uses a **core/domain separation**:
- **core/features/*** - Infrastructure features (app, i18n, router, slice-manager, ui, auth, components, layout)
- **domain/features/*** - Business features (wallet, oauth, blog-demo, ai-assistant, site)

Both follow the same patterns and rules. New features you create will be domain features.

# Running Checks

**All checks:**
```bash
node ./.claude/skills/code-audit/scripts/run_all_checks.mjs
```

**Generate report:**
```bash
node ./.claude/skills/code-audit/scripts/generate_report.mjs
```

**Individual checks:**
```bash
node ./.claude/skills/code-audit/scripts/check_imports.mjs
node ./.claude/skills/code-audit/scripts/check_exports.mjs
node ./.claude/skills/code-audit/scripts/check_redux_abstraction.mjs
node ./.claude/skills/code-audit/scripts/check_service_imports.mjs
node ./.claude/skills/code-audit/scripts/check_i18n_coverage.mjs
node ./.claude/skills/code-audit/scripts/check_any_usage.mjs
node ./.claude/skills/code-audit/scripts/check_suppressions.mjs
node ./.claude/skills/code-audit/scripts/check_god_files.mjs
node ./.claude/skills/code-audit/scripts/check_todos.mjs
node ./.claude/skills/code-audit/scripts/check_logs.mjs
node ./.claude/skills/code-audit/scripts/check_saga_patterns.mjs
node ./.claude/skills/code-audit/scripts/check_type_assertions.mjs
node ./.claude/skills/code-audit/scripts/check_reexports.mjs
node ./.claude/skills/code-audit/scripts/check_type_imports.mjs
```

# Quality Rules

## 1. Path Alias Imports

**RULE**: Use absolute path aliases (`@/features/*`, `@/services/*`, etc.) instead of relative imports when crossing directory boundaries.

**Why**: Makes imports clear, prevents broken paths when moving files, enables IDE navigation.

**Allowed**:
- ✅ Internal imports within same feature: `./slice.ts`, `../models/session/actions.ts`
- ✅ Imports within same service/page/hook directory

**Violations**:
- ❌ `import { useAuth } from '../../features/oauth/hooks/useAuth'`
- ❌ `import { api } from '../services/api'`

**Fix**:
- ✅ `import { useAuth } from '@/core/features/oauth/hooks/useAuth'`
- ✅ `import { api } from '@/services/api'`

---

## 2. Export Patterns

**RULE**: Use named exports only. No default exports, no index.ts barrel files.

**Why**: Makes refactoring safer, imports explicit, no ambiguity.

**Violations**:
- ❌ `export default function MyComponent() { ... }`
- ❌ `index.ts` files that re-export from other files

**Fix**:
- ✅ `export const MyComponent: React.FC = () => { ... }`
- ✅ Import directly from source file

**Exceptions**:
- Storybook files (`*.stories.tsx`) - require default exports
- Type definition files (`*.d.ts`) - may use default

---

## 3. Redux Abstraction

**RULE**: Components NEVER import `useDispatch`, `useSelector`, or `RootState` directly. They use feature hooks.

**Why**: Abstracts Redux implementation, components don't know about state management.

**Pattern**:
```
Components → Feature Hooks → Redux
(NEVER: Components → Redux directly)
```

**Violations**:
- ❌ Component imports `useDispatch` from `react-redux`
- ❌ Component imports `RootState`
- ❌ Component uses `useSelector`

**Fix**:
- ✅ Use feature action hooks: `useWalletActions()`, `useBlogActions()`
- ✅ Use feature state hooks: `useWallet()`, `useAuth()`
- ✅ Use `useTypedSelector` from `@/hooks/useTypedSelector` for cross-feature state

**Allowed files** (these ARE the abstraction layer):
- `(core|domain)/features/*/hooks/*.ts` - can use useDispatch, useSelector, RootState
- `src/hooks/*.ts` - can use useSelector, RootState
- `(core|domain)/features/*/models/*/actionEffects/*.ts` - can use RootState

---

## 4. Service Import Boundaries

**RULE**: Services (`@/services/*`) are ONLY imported in composition root (`src/config/(core|domain)/*/services.ts`).

**Why**: Dependency injection pattern - features receive services through interfaces, easy to swap implementations.

**Violations**:
- ❌ Feature imports `@/services/ethersV6/wallet/WalletAPI`
- ❌ Page imports `@/services/oauth/OAuthService`

**Fix**:
- ✅ Feature defines `IFeatureApi` interface
- ✅ Service instantiated in `src/config/(core|domain)/{feature}/services.ts`
- ✅ Feature receives service through interface

**Allowed files**:
- `src/config/services.ts` (root composition, if exists)
- `src/config/(core|domain)/*/services.ts` (feature-specific composition)

---

## 5. i18n Coverage

**RULE**: All user-facing text must be wrapped in `t()` function for translation.

**Why**: Enables multi-language support, i18next tooling extracts text.

**Violations**:
- ❌ `<Button>Click me</Button>`
- ❌ `const message = "Error occurred"`

**Fix**:
- ✅ `<Button>{t('Click me')}</Button>`
- ✅ `const message = t('Error occurred')`

**Excluded** (not user-facing):
- Log statements: `log.debug('...')`, `console.log('...')`
- HTML attributes: `className`, `id`, `href`, `src`
- CSS values, variable names, paths
- Infrastructure files (main.tsx, error boundaries, debug panels)

**Exception paths** (developer tools, not user UI):
- `core/features/slice-manager/components/SliceDebugPanel`
- `core/features/i18n/components/LangMenu/LangModal`
- `domain/layout/ErrorFallback`
- OAuth callback handlers

---

## 6. TypeScript "any" Type

**RULE**: Never use `any` type. Use proper types, generics, or `unknown`.

**Why**: Defeats TypeScript's type safety, allows runtime errors.

**Violations**:
- ❌ `function process(data: any) { ... }`
- ❌ `const items: any[] = [...]`

**Fix**:
- ✅ Define proper interfaces/types
- ✅ Use generics: `<T>` for reusable code
- ✅ Use `unknown` for truly dynamic types (forces type guards)

**Exceptions**:
- Type definition files (`*.d.ts`) for external libraries
- Test files (`*.test.ts`) for mocking (prefer typed mocks)

---

## 7. Linter/TypeScript Suppressions

**RULE**: Never suppress errors with comments. Fix the underlying issue.

**Why**: Suppressions hide real bugs, accumulate technical debt.

**Violations**:
- ❌ `// @ts-ignore`
- ❌ `// @ts-nocheck`
- ❌ `// eslint-disable`
- ❌ `// prettier-ignore`

**Fix**: Address the root cause, don't hide it.

**Exceptions**:
- Test files may have legitimate suppressions
- If absolutely necessary, use `@ts-expect-error` (fails if error is fixed) with detailed comment

---

## 8. God Files (1 Entity Per File)

**RULE**: Each file exports exactly ONE entity (interface, type, class, enum). File name matches entity name.

**Why**: Easy to find, clear purpose, follows Single Responsibility Principle.

**Violations**:
- ❌ File with multiple `export interface` declarations
- ❌ File with multiple `export type` declarations

**Fix**: Split into separate files.

**Examples**:
- `UserService.ts` → `export class UserService`
- `FeatureConfig.ts` → `export interface FeatureConfig`
- `ConnectionState.ts` → `export type ConnectionState`

**Exceptions**:
- Test files (`*.test.ts`, `*.spec.ts`)
- Type definitions (`*.d.ts`) for external libraries
- Storybook files (`*.stories.tsx`)
- React component files with props interfaces (e.g., `Breadcrumb.tsx` can have `BreadcrumbProps`)
- Specific exception paths (see script for list)

---

## 9. TODO/FIXME/HACK Comments

**RULE**: No technical debt markers in code. Track work in issue tracker instead.

**Why**: Markers indicate incomplete work, forgotten tasks, or known bugs.

**Detected**:
- `TODO`, `FIXME`, `HACK`, `XXX`, `BUG`

**Fix**: Create GitHub issues, complete work, remove comments.

---

## 10. Console Usage

**RULE**: No `console.*` statements in production code. Use `log.*` from loglevel.

**Why**: Console statements can't be controlled in production, expose debug info.

**Violations**:
- ❌ `console.log()`, `console.error()`, `console.warn()`

**Fix**:
- ✅ `log.debug()` - auto-disabled in production
- ✅ `log.info()`, `log.warn()`, `log.error()` - controlled log levels

---

## 11. Redux Saga Patterns

**RULE**: Use single `yield all([...])` for parallel operations. Multiple `yield all` in same function is inefficient.

**Why**: True parallelism requires combining effects into one `yield all`.

**Violation**:
```typescript
yield all([effect1, effect2]);
yield all([effect3, effect4]); // Sequential, not parallel!
```

**Fix**:
```typescript
yield all([effect1, effect2, effect3, effect4]); // Truly parallel
```

---

## 12. No Type Assertions

**RULE**: Never use `as const` or `satisfies`. Use proper types, interfaces, or enums instead.

**Why**: Type assertions are shortcuts that reduce code clarity, reusability, and maintainability. Proper type definitions are self-documenting and enforce better architecture.

**Violations**:
- ❌ `const colors = ["red", "blue"] as const`
- ❌ `const config = { ... } satisfies Config`
- ❌ `const options = { mode: "light" } as const`

**Fix**:
- ✅ Define proper types:
  ```typescript
  type Color = "red" | "blue";
  const colors: Color[] = ["red", "blue"];
  ```
- ✅ Use explicit type annotations:
  ```typescript
  const config: Config = { ... };
  ```
- ✅ Use enums for constant sets:
  ```typescript
  enum Mode {
    Light = "light",
    Dark = "dark"
  }
  const options = { mode: Mode.Light };
  ```

**Why This Matters**:
- `as const` and `satisfies` are lazy shortcuts
- They bypass proper type definition and reusability
- Makes code harder to understand and maintain
- Prevents type reuse across the codebase
- Reduces IDE autocomplete effectiveness

**Better alternatives**:
- `interface` for object shapes
- `type` for unions, intersections, and aliases
- `enum` for constant sets of values
- `const` with explicit type annotations
- Proper TypeScript types that are reusable and self-documenting

---

## 13. No Re-exports

**RULE**: Never use re-export statements. Import directly from source files instead of re-exporting from intermediate files.

**Why**: Re-exports create indirection, make code harder to navigate, and obscure actual dependencies. Direct imports make the codebase more transparent and easier to refactor.

**Violations**:
- ❌ `export { Something } from './somewhere'`
- ❌ `export * from './somewhere'`
- ❌ `export * as namespace from './somewhere'`
- ❌ `export type { TypeName } from './somewhere'`
- ❌ Index files that re-export: `index.ts` with re-exports

**Fix**:
- ✅ Import directly from source files:
  ```typescript
  // Instead of re-exporting in index.ts
  // ❌ export { UserService } from './UserService';

  // Import directly from source
  // ✅ import { UserService } from './path/to/UserService';
  ```

**Why This Matters**:
- Re-exports create unnecessary layers of indirection
- Makes it harder to find where code is actually defined
- IDE "Go to Definition" jumps to re-export, not actual source
- Refactoring becomes harder (must update re-export files)
- Violates "import from source" principle

**The Rule**:
- Import directly from the file where entity is defined
- No barrel files (index.ts with re-exports)
- No re-export statements anywhere in codebase

---

## 14. No "type" Keyword in Imports

**RULE**: Never use the `type` keyword in import statements. TypeScript automatically removes type-only imports during compilation.

**Why**: The `type` keyword is redundant visual noise. TypeScript's compiler can automatically detect and remove type-only imports without the keyword, making code cleaner and simpler.

**Violations**:
- ❌ `import type { User } from './types'`
- ❌ `import { type User } from './types'`
- ❌ `import { Data, type User } from './types'` (mixed)

**Fix**:
- ✅ Plain imports for everything:
  ```typescript
  import { User, Data } from './types';
  ```

**Why This Matters**:
- `type` keyword adds visual clutter without benefit
- TypeScript compiler handles type erasure automatically
- Simpler, cleaner import statements
- Consistent import style across entire codebase
- One less thing to think about when writing imports

**The Rule**:
- Always use plain import syntax
- Let TypeScript handle type-only import optimization
- No `import type { X }`
- No `import { type X }`
- Just use `import { X }`

---

# Output Format

Each check reports:
- File path and line number
- Violation description
- Suggested fix
- Count of total violations

Reports are saved to `reports/{date}/code-audit-report.md` when using `generate_report.mjs`.

# Tools

- **Bash**: Run Node.js scripts
- **Read**: Inspect source files
- **Write**: Generate reports (optional)

# Safety

- Read-only operation (unless generating reports)
- No source file modifications
- No external network calls
- Comprehensive scan of entire `src/` directory
