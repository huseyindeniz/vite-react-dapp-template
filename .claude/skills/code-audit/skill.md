---
name: code-audit
description: Comprehensive static code analysis to enforce architectural patterns, conventions, and code quality standards.
---

# Purpose

Enforce code quality and consistency standards across the entire codebase through automated checks.

**What it checks (20 checks, each with its own script):**
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
15. No dangerouslySetInnerHTML (XSS vulnerability)
16. React key patterns (no array index as key, no missing keys)
17. No magic numbers (use named constants)
18. No magic strings (use named constants/enums for identifiers, paths, URLs, statuses)
19. TypeScript strict mode enabled (tsconfig.json)
20. Dependency array patterns (useEffect, useMemo, useCallback)

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
node ./.claude/skills/code-audit/scripts/check_dangerous_html.mjs
node ./.claude/skills/code-audit/scripts/check_react_keys.mjs
node ./.claude/skills/code-audit/scripts/check_magic_numbers.mjs
node ./.claude/skills/code-audit/scripts/check_magic_strings.mjs
node ./.claude/skills/code-audit/scripts/check_strict_mode.mjs
node ./.claude/skills/code-audit/scripts/check_dep_arrays.mjs
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

## 15. No dangerouslySetInnerHTML

**RULE**: Never use `dangerouslySetInnerHTML` - it bypasses React's XSS protection.

**Why**: Opens XSS vulnerabilities, allows arbitrary HTML injection, user-controlled content can execute malicious scripts.

**Violations**:
- ❌ `<div dangerouslySetInnerHTML={{ __html: userContent }} />`
- ❌ Any use of dangerouslySetInnerHTML prop

**Fix**:
- ✅ Use React's default rendering (auto-escapes):
  ```typescript
  <div>{content}</div>
  ```
- ✅ If HTML rendering is absolutely required, sanitize first:
  ```typescript
  import DOMPurify from 'dompurify';
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  ```

**Why This Matters**:
- React automatically escapes all content by default (XSS protection)
- dangerouslySetInnerHTML bypasses this protection
- Critical security vulnerability if user input is rendered
- Name literally says "dangerous" for a reason

**The Rule**:
- Avoid dangerouslySetInnerHTML entirely if possible
- If absolutely necessary, sanitize with DOMPurify
- Never use with user-controlled content without sanitization

---

## 16. React Key Patterns

**RULE**: Always use stable, unique identifiers as keys in lists. Never use array index or omit keys.

**Why**: Using array index as key causes bugs when list order changes. Missing keys cause React warnings and unpredictable re-renders.

**Violations**:
- ❌ Array index as key:
  ```typescript
  items.map((item, index) => <Item key={index} />)
  ```
- ❌ Missing key entirely:
  ```typescript
  items.map(item => <Item {...item} />)
  ```

**Fix**:
- ✅ Use stable unique identifier from data:
  ```typescript
  items.map(item => <Item key={item.id} {...item} />)
  ```

**Why This Matters**:
- **Index as key**: When list order changes (sort, filter, reorder), React cannot track which element is which
- Leads to wrong elements being re-rendered or updated
- Can cause state to be attached to wrong elements
- Performance issues from unnecessary re-renders
- **Missing key**: React shows warnings, unpredictable behavior, poor reconciliation

**The Rule**:
- Always provide a `key` prop when rendering lists with `.map()`
- Use a stable, unique identifier (usually `item.id`)
- Never use array index as key
- Key must be unique among siblings

---

## 17. No Magic Numbers

**RULE**: Never use magic numbers - use named constants instead.

**Why**: Magic numbers make code harder to understand, difficult to maintain and update, no semantic meaning without context.

**Focus**: Time-related values (setTimeout, setInterval, delays)

**Violations**:
- ❌ Magic number in setTimeout:
  ```typescript
  setTimeout(callback, 3600000); // What is 3600000?
  ```
- ❌ Magic number in delay/retry logic:
  ```typescript
  await delay(5000); // 5000 what?
  ```

**Fix**:
- ✅ Named constant:
  ```typescript
  const ONE_HOUR_MS = 3600000;
  setTimeout(callback, ONE_HOUR_MS);

  const FIVE_SECONDS_MS = 5000;
  await delay(FIVE_SECONDS_MS);
  ```

**Why This Matters**:
- Self-documenting code
- Easy to find and update all usages
- Clear intent and meaning
- Prevents errors from typos
- Easier maintenance

**Detection Focus**:
- setTimeout/setInterval with values >= 1000ms (1 second)
- Delay/wait/retry functions with large values
- Config files are exempted (often contain configuration numbers)

**The Rule**:
- Use named constants for time values
- Format: `{VALUE}_{UNIT}_MS` (e.g., `ONE_HOUR_MS`, `30_SECONDS_MS`)
- Exception: Very small, obvious values (e.g., `setTimeout(fn, 0)`)

---

## 18. No Magic Strings

**RULE**: Never use magic strings - use named constants or enums for string identifiers, paths, URLs, status values, and any other semantically meaningful strings.

**Why**: Magic strings make code harder to understand, prone to typos, difficult to maintain, and error-prone when refactoring.

**What are Magic Strings**:
String literals used directly in code that represent identifiers, types, statuses, paths, or any semantic meaning.

**Violations**:
- ❌ Type/Status identifiers:
  ```typescript
  type: "success"  // What if you typo "sucess"?
  status: "pending"
  role: "admin"
  ```
- ❌ Path/URL strings:
  ```typescript
  src={`assets/images/agents/${value}.webp`}
  fetch("/api/users")
  ```
- ❌ Event names:
  ```typescript
  element.addEventListener("click", handler)
  ```
- ❌ Configuration keys:
  ```typescript
  config.get("database.host")
  ```

**Fix**:
- ✅ Use enums for identifiers:
  ```typescript
  enum AlertType {
    SUCCESS = "success",
    ERROR = "error"
  }
  type: AlertType.SUCCESS

  enum Status {
    PENDING = "pending",
    COMPLETED = "completed"
  }
  status: Status.PENDING

  enum Role {
    ADMIN = "admin",
    USER = "user"
  }
  role: Role.ADMIN
  ```
- ✅ Use named constants for paths:
  ```typescript
  const AGENT_ICON_PATH = "assets/images/agents";
  src={`${AGENT_ICON_PATH}/${value}.webp`}

  const API_BASE_URL = "/api";
  fetch(`${API_BASE_URL}/users`)
  ```

**Why This Matters**:
- **Type Safety**: Enums provide compile-time checking, catch typos
- **Refactoring**: Change string value in ONE place, not everywhere
- **Autocomplete**: IDE helps you with enum/constant names
- **Self-Documenting**: `AlertType.SUCCESS` is clearer than `"success"`
- **Maintainability**: Easy to find all usages and update

**Detection Focus**:
- Type/status/role identifiers used as string literals
- Repeated path/URL strings
- Configuration keys as strings
- Event names as strings

**The Rule**:
- Use enums for identifiers (types, statuses, roles, categories)
- Use named constants for paths, URLs, and repeated strings
- Format: `SCREAMING_SNAKE_CASE` for constants, `PascalCase` for enums
- Exception: UI text (use i18n `t()` function instead), very short obvious strings like empty string `""`

---

## 19. TypeScript Strict Mode

**RULE**: TypeScript's `strict` mode must be enabled in tsconfig.json.

**Why**: Enables 8+ critical type safety checks, catches errors at compile time, industry best practice.

**Violation**:
- ❌ `tsconfig.json` missing `"strict": true`
- ❌ `"strict": false` in compilerOptions
- ❌ No compilerOptions in tsconfig.json

**Fix**:
- ✅ In tsconfig.json, add or update:
  ```json
  {
    "compilerOptions": {
      "strict": true
    }
  }
  ```

**What Strict Mode Includes**:
1. **noImplicitAny** - Prevents implicit "any" types
2. **noImplicitThis** - Requires explicit "this" typing
3. **alwaysStrict** - ECMAScript strict mode in all files
4. **strictBindCallApply** - Validates call/bind/apply arguments
5. **strictNullChecks** - Enforces null/undefined checking
6. **strictFunctionTypes** - Stricter function type checking
7. **strictPropertyInitialization** - Ensures class properties are initialized
8. **useUnknownInCatchVariables** - Catch variables are "unknown" not "any"

**Why This Matters**:
- Catches type errors at compile time instead of runtime
- Better IDE autocomplete and intellisense
- Self-documenting code with explicit types
- Easier refactoring with type safety
- Industry best practice for professional TypeScript projects

**The Rule**:
- Always enable `"strict": true` in tsconfig.json
- Required for production-ready TypeScript code
- Cannot be disabled or set to false

---

## 20. React Hook Dependency Arrays

**RULE**: Dependency arrays must be correct - no missing reactive values, no stable values, no side effects in memoization hooks.

**Why**: Incorrect dependency arrays cause stale closures, unnecessary re-renders, memory leaks, and bugs that are hard to debug.

### 5 Sub-Checks:

#### CHECK 1: Missing Dependencies (HIGH)
Empty `[]` but reactive values are used inside - will cause stale closures.

**Violations**:
- ❌ Using `i18n.resolvedLanguage` with empty array:
  ```typescript
  useEffect(() => {
    actions.fetchPosts({ language: i18n.resolvedLanguage });
  }, []); // i18n.resolvedLanguage is used but not in deps!
  ```

**Fix**:
- ✅ Add reactive values to dependency array:
  ```typescript
  useEffect(() => {
    actions.fetchPosts({ language: i18n.resolvedLanguage });
  }, [i18n.resolvedLanguage]); // Will re-run when language changes
  ```

**Reactive Patterns Detected**:
- `i18n.resolvedLanguage`, `i18n.language` (language changes)
- `props.*` (prop access)

**Note**: `t` function is stable and should NOT be in deps. If you need to react to language changes, use `i18n.resolvedLanguage`.

#### CHECK 2: Stable Values in Dependencies (HIGH)
These values are guaranteed stable by React/libraries and should NOT be in dependency arrays.

**Violations**:
- ❌ Stable values in deps:
  ```typescript
  useEffect(() => {
    navigate('/home');
  }, [isAuthenticated, navigate]); // navigate is stable!
  ```

**Fix**:
- ✅ Remove stable values:
  ```typescript
  useEffect(() => {
    navigate('/home');
  }, [isAuthenticated]); // Only reactive values
  ```

**Known Stable Values**:
- `useState` setters: `setX`, `setState`, etc.
- `useReducer` dispatch
- `useNavigate()` from react-router: `navigate`
- `useTranslation()` from i18next: `t`
- Redux dispatch: `dispatch`
- Custom action hooks: `actions` (from `useActions()`)
- Route hooks: `pageLink`, `homeRoute`, `pageRoutes`
- Refs: any variable ending with `Ref`

#### CHECK 3: Side Effects in useMemo/useCallback (HIGH)
These hooks must be PURE - no side effects allowed.

**Violations**:
- ❌ Fetch in useMemo:
  ```typescript
  const data = useMemo(() => {
    fetch('/api/data'); // WRONG! Side effect in useMemo
    return processData();
  }, [deps]);
  ```
- ❌ Console.log in useCallback:
  ```typescript
  const handler = useCallback(() => {
    console.log('clicked'); // Side effect
    doSomething();
  }, []);
  ```

**Fix**:
- ✅ Move side effects to useEffect or Redux Saga:
  ```typescript
  // useMemo should be pure
  const processed = useMemo(() => processData(rawData), [rawData]);

  // Side effects go in useEffect
  useEffect(() => {
    fetch('/api/data').then(setData);
  }, []);
  ```

**Side Effects Detected**:
- `fetch()`, `axios.*` calls
- `console.log/warn/error/info`
- `localStorage.*`, `sessionStorage.*`
- `document.*`, `window.location`

#### CHECK 4: Over-specified Arrays (WARNING)
4+ dependencies may indicate over-specification or a need to refactor.

**Warning**:
- ⚠️ 4+ deps:
  ```typescript
  useEffect(() => {
    // Complex logic
  }, [a, b, c, d, e]); // Too many deps - review
  ```

**Fix**:
- Consider extracting logic to a custom hook
- Consider using `useReducer` for complex state
- Review if all deps are truly needed

#### CHECK 5: Direct Fetch in useEffect (INFO)
Direct API calls in useEffect miss caching, deduplication, and proper error handling.

**Info**:
- ℹ️ Direct fetch detected:
  ```typescript
  useEffect(() => {
    fetch('/api/users').then(setUsers); // Direct fetch
  }, []);
  ```

**Consider**:
- React Query or SWR for data fetching
- Redux Saga for side effects (project pattern)

**Note**: `actions.fetchX()` via Redux Saga is OK - it triggers saga, not direct API call.

**Why Avoid Direct Fetch**:
- No automatic caching or deduplication
- Race conditions on fast navigation
- No automatic retry on failure
- Manual loading/error state management
- No SSR/SSG support

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
