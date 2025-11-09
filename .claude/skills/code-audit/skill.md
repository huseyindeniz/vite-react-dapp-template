---
name: code-audit
description: Comprehensive static code analysis to enforce architectural patterns, conventions, and code quality standards.
---

# Purpose

Perform **comprehensive static code analysis** on the codebase to ensure:
- ALL imports to aliased directories use absolute path aliases (`@/...`)
- NO relative imports that cross into aliased directories
- NO default exports or index files
- NO direct Redux usage in components (use abstraction hooks)
- Services ONLY imported in composition root (dependency injection pattern)
- NO raw text in UI (all text must use i18n `t()` function)
- NO usage of TypeScript "any" type (use proper types or "unknown")
- NO linter or TypeScript suppression comments
- NO god files - 1 entity per file (interface, type, class, enum)
- Code quality standards are maintained

**Note:** Feature-to-feature dependency rules (core → domain violations) are enforced by the `arch-audit` skill.

# Scope

- Scans entire codebase
- Checks all aliased directories:
  - `src/features/` → `@/features/*`
  - `src/services/` → `@/services/*`
  - `src/pages/` → `@/pages/*`
  - `src/hooks/` → `@/hooks/*`
- Checks TypeScript/JavaScript files (`.ts`, `.tsx`, `.js`, `.jsx`)
- Reports violations with file paths and line numbers

# Quality Checks

## 1. Path Alias Import Rule (CRITICAL)

**RULE**: Any relative import that resolves to an aliased directory MUST use the absolute alias instead.

**Aliased Directories:**
```typescript
{
  "@/features/*": ["./src/features/*"],
  "@/services/*": ["./src/services/*"],
  "@/pages/*": ["./src/pages/*"],
  "@/hooks/*": ["./src/hooks/*"]
}
```

**Exception**: Internal imports within the SAME aliased directory are allowed:
- Feature: `./slice.ts`, `../models/session/actions.ts` within same feature
- Page: `./Home.tsx`, `./components/Header.tsx` within same page
- Service: `./AuthApi.ts`, `./providers/GoogleAuth.ts` within same service
- Hook: `./useCustomHook.ts` within same hook directory

## Violations Detected

### From Features:
- ❌ Feature → Other Feature (relative)
- ❌ Feature → Services (relative)
- ❌ Feature → Pages (relative)
- ❌ Feature → Hooks (relative)
- ✅ Feature → Same Feature (relative) - ALLOWED

### From Services:
- ❌ Service → Features (relative)
- ❌ Service → Other Services (relative)
- ❌ Service → Pages (relative)
- ❌ Service → Hooks (relative)
- ✅ Service → Same Service (relative) - ALLOWED

### From Pages:
- ❌ Page → Features (relative)
- ❌ Page → Services (relative)
- ❌ Page → Other Pages (relative)
- ❌ Page → Hooks (relative)
- ✅ Page → Same Page (relative) - ALLOWED

### From Hooks:
- ❌ Hook → Features (relative)
- ❌ Hook → Services (relative)
- ❌ Hook → Pages (relative)
- ❌ Hook → Other Hooks (relative)
- ✅ Hook → Same Hook directory (relative) - ALLOWED

### From Anywhere:
- ❌ ANY file → ANY aliased directory (relative, except internal feature imports)

## Examples

```typescript
// ❌ WRONG - Relative import to aliased directory
import { useAuth } from '../../features/oauth/hooks/useAuth'
import { api } from '../services/api'
import { Home } from '../../pages/Home'
import { useTypedSelector } from '../hooks/useTypedSelector'

// ✅ CORRECT - Absolute alias
import { useAuth } from '@/features/oauth/hooks/useAuth'
import { api } from '@/services/api'
import { Home } from '@/pages/Home'
import { useTypedSelector } from '@/hooks/useTypedSelector'

// ✅ CORRECT - Internal feature import (allowed)
import { sessionReducer } from './models/session/slice'  // within same feature
import { actions } from '../models/account/actions'      // within same feature
```

## 2. Export Pattern Rules (CRITICAL)

**RULES**:
1. **Never use index files** (`index.ts`, `index.tsx`, etc.) to export from directories
2. **Never use default exports** (especially for components)
3. **Always use named exports**

### Rule 2a: No Index Files

**Why**: Index files create ambiguity and make it harder to understand module structure.

**Violations:**
```typescript
// ❌ WRONG - index.ts that re-exports everything
// src/features/wallet/index.ts
export * from './components/Wallet';
export * from './hooks/useWallet';

// ✅ CORRECT - Import directly from source
import { Wallet } from '@/features/wallet/components/Wallet';
import { useWallet } from '@/features/wallet/hooks/useWallet';
```

### Rule 2b: No Default Exports

**Why**: Default exports make refactoring harder and create inconsistency in imports.

**Violations:**
```typescript
// ❌ WRONG - Default export
export default function MyComponent() { ... }
export default store;
export default useCustomHook;

// ✅ CORRECT - Named export
export const MyComponent: React.FC = () => { ... }
export const store = configureStore({ ... });
export const useCustomHook = () => { ... }
```

**Exceptions**:
- Storybook files (`*.stories.tsx`) require default exports
- Type definition files (`*.d.ts`) may use default exports

## 3. Redux Abstraction Rules (CRITICAL)

**RULE**: React components must NEVER access Redux directly. They must use abstraction layers.

### Rule 3a: No Direct useDispatch in Components

**Why**: Components should not know about Redux. Action dispatching should go through feature hooks.

**Violations:**
```typescript
// ❌ WRONG - Component using useDispatch directly
import { useDispatch } from 'react-redux';

function MyComponent() {
  const dispatch = useDispatch();
  dispatch(walletActions.connectWallet());
}

// ✅ CORRECT - Component using feature hook
import { useWalletActions } from '@/features/wallet/hooks/useWalletActions';

function MyComponent() {
  const walletActions = useWalletActions();
  walletActions.connectWallet();
}
```

### Rule 3b: No Direct RootState/useSelector in Components

**Why**: Components should not know about Redux state structure.

**Violations:**
```typescript
// ❌ WRONG - Component using useSelector and RootState directly
import { useSelector } from 'react-redux';
import { RootState } from '@/features/app/store/store';

function MyComponent() {
  const wallet = useSelector((state: RootState) => state.wallet);
}

// ✅ CORRECT - Component using feature hook or useTypedSelector
import { useWallet } from '@/features/wallet/hooks/useWallet';
// OR
import useTypedSelector from '@/hooks/useTypedSelector';

function MyComponent() {
  const wallet = useWallet(); // Feature hook
  // OR
  const wallet = useTypedSelector(state => state.wallet); // Typed selector
}
```

### Allowed Files

These files MUST access Redux directly (they are the abstraction layer):
- `features/*/hooks/*.ts` - Feature hooks (can use useDispatch, useSelector, RootState)
- `src/hooks/*.ts` - Root hooks like useTypedSelector (can use useSelector, RootState)
- `features/*/models/*/actionEffects/*.ts` - Business logic (can use RootState)

### Architecture Pattern

```
React Components
    ↓ (use)
Feature Hooks (useWallet, useAuth, useWalletActions, etc.)
    ↓ (use)
Redux (useDispatch, useSelector, RootState)
```

**Never:** Components → Redux directly

## 4. i18n Coverage Rules (CRITICAL)

**RULE**: All user-facing text must be wrapped in `t()` function for internationalization.

### Rule 4: No Raw Text in UI

**Why**: Hard-coded text can't be translated and won't be detected by i18n tooling.

**Violations:**
```typescript
// ❌ WRONG - Raw text in JSX
<Button>Click me</Button>
<div>Hello world</div>
<Menu.Label>Choose auth provider</Menu.Label>

// ✅ CORRECT - Text wrapped in t()
<Button>{t('Click me')}</Button>
<div>{t('Hello world')}</div>
<Menu.Label>{t('Choose auth provider')}</Menu.Label>

// ❌ WRONG - Raw text in string literals
const message = "Error occurred";
const title = "Loading...";

// ✅ CORRECT - Text wrapped in t()
const message = t('Error occurred');
const title = t('Loading...');
```

### What is Detected

- JSX text content: `<div>text</div>`
- String literals that look like user-facing text
- Error messages, labels, titles
- Multi-word phrases

### What is Excluded (Not User-Facing)

- Log statements: `log.debug('...')`, `console.log('...')`
- Import/export statements
- HTML attributes: `className`, `id`, `href`, `src`, `alt`, `rel`
- CSS values: `rgba(...)`, `calc(...)`, `#fff`, `1px solid`
- Variable names and paths
- Template literal variables: `${...}`
- Regex patterns

## 5. TypeScript "any" Type Rules (CRITICAL)

**RULE**: Never use the TypeScript "any" type. It defeats type safety and leads to runtime errors.

### Rule 5: No "any" Type Usage

**Why**: The "any" type disables TypeScript's type checking, making your code as unsafe as plain JavaScript.

**Violations:**
```typescript
// ❌ WRONG - Using "any" type
function processData(data: any) {
  return data.value; // No type checking, runtime error if data has no value
}

const items: any[] = [1, 2, 3]; // No type checking on array items
const result = someFunction() as any; // Defeats type checking

// ✅ CORRECT - Use proper types
interface Data {
  value: string;
}

function processData(data: Data) {
  return data.value; // Type-safe
}

const items: number[] = [1, 2, 3]; // Type-safe array
const result = someFunction() as string; // Type-safe assertion

// ✅ CORRECT - Use "unknown" for truly dynamic types
function processUnknown(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as Data).value; // Forces type checking
  }
  throw new Error('Invalid data');
}

// ✅ CORRECT - Use generics for reusable type-safe code
function identity<T>(value: T): T {
  return value;
}
```

**Better Alternatives:**
- **Specific types**: `string`, `number`, `boolean`, interfaces, type aliases
- **Generics**: `<T>` for reusable type-safe functions and components
- **Unknown type**: `unknown` for truly dynamic types (forces type guards)
- **Union types**: `string | number | null` for multiple possible types
- **Conditional types**: For complex type transformations
- **Record types**: `Record<string, SomeType>` instead of `Record<string, any>`

**Exceptions:**
- Type definition files (`*.d.ts`) for external libraries may legitimately use `any`
- Test files (`*.test.ts`, `*.spec.ts`) may use `any` for mocking (but prefer typed mocks)

**Impact:**
- ❌ Disables compile-time type checking
- ❌ Allows runtime errors that could be caught at compile time
- ❌ Makes refactoring dangerous
- ❌ Reduces code documentation value
- ❌ Makes IDE autocomplete less useful

## 6. Linter/TypeScript Suppression Rules (CRITICAL)

**RULE**: Never suppress linter or TypeScript errors using comments. Fix the underlying issue instead.

### Rule 6: No Suppression Comments

**Why**: Suppression comments hide real problems and accumulate technical debt. They make code harder to maintain and refactor.

**Violations:**
```typescript
// ❌ WRONG - Suppressing TypeScript errors
// @ts-ignore
const value = someFunction();

// @ts-nocheck
function unsafeFunction() {
  // entire file ignored by TypeScript
}

// ❌ WRONG - Suppressing ESLint errors
// eslint-disable-next-line
const unused = 'this variable is never used';

/* eslint-disable */
// Multiple lines of code that violate ESLint rules
/* eslint-enable */

// ❌ WRONG - Suppressing Prettier
// prettier-ignore
const obj={a:1,b:2}; // Unformatted code

// ✅ CORRECT - Fix the underlying issue
const value = someFunction() as ExpectedType; // Proper type assertion

function safeFunction() {
  // Properly typed function
}

const used = 'this variable is used';
console.log(used);

const obj = { a: 1, b: 2 }; // Properly formatted
```

**Detected Suppressions:**
- **Critical Severity:**
  - `// @ts-ignore` - Completely ignores TypeScript errors (dangerous)
  - `// @ts-nocheck` - Disables TypeScript for entire file (very dangerous)
  - `// eslint-disable` - Disables ESLint rules (accumulates tech debt)
  - `/* eslint-disable */` - Block-level ESLint disable

- **High Severity:**
  - `// eslint-disable-next-line` - Disables ESLint for one line
  - `// @ts-expect-error` - Better than @ts-ignore but still a code smell

- **Medium Severity:**
  - `// prettier-ignore` - Suppresses formatting

**If Suppressions Are Truly Necessary:**
1. Prefer `@ts-expect-error` over `@ts-ignore` (fails if error is fixed)
2. Add a detailed comment explaining WHY it's necessary
3. Consider if the suppression indicates a design problem
4. Plan to remove it in the future

**Exceptions:**
- Test files (`*.test.ts`, `*.spec.ts`) may have legitimate suppressions for test utilities
- Configuration files for build tools may need some suppressions

**Impact:**
- ❌ Hides real bugs and type errors
- ❌ Accumulates technical debt
- ❌ Makes refactoring dangerous
- ❌ Reduces code quality over time
- ❌ Makes it harder to catch regressions

## 7. God File Rules (CRITICAL)

**RULE**: One entity per file. No god files with multiple interfaces, types, classes, or enums.

### Rule 7: 1 Entity Per File

**Why**: God files become hard to navigate, violate Single Responsibility Principle, and make code harder to maintain.

**Violations:**
```typescript
// ❌ WRONG - Multiple entities in one file (FeatureConfig.ts)
export interface FeatureStore<TState = unknown> {
  stateKey: string;
  reducer: Reducer<TState>;
}

export interface FeatureSaga {
  saga: Saga;
  dependencies?: unknown[];
}

export interface FeatureConfig<TState = unknown> {
  enabled: boolean;
  store: FeatureStore<TState>;
  saga: FeatureSaga;
}

// ✅ CORRECT - Each entity in its own file

// FeatureStore.ts
export interface FeatureStore<TState = unknown> {
  stateKey: string;
  reducer: Reducer<TState>;
}

// FeatureSaga.ts
export interface FeatureSaga {
  saga: Saga;
  dependencies?: unknown[];
}

// FeatureConfig.ts
export interface FeatureConfig<TState = unknown> {
  enabled: boolean;
  store: FeatureStore<TState>;
  saga: FeatureSaga;
}
```

**What Counts as an Entity:**
- `export interface` - Interface declaration
- `export type` - Type alias
- `export class` - Class declaration
- `export abstract class` - Abstract class
- `export enum` - Enum declaration
- `export const enum` - Const enum

**Naming Convention:**
- File name MUST match entity name
- `UserService.ts` → `export class UserService`
- `FeatureConfig.ts` → `export interface FeatureConfig`
- `ConnectionState.ts` → `export type ConnectionState`

**Exceptions:**
- Test files (`*.test.ts`, `*.spec.ts`) - can have multiple test entities
- Type definition files (`*.d.ts`) - external library typings
- Storybook files (`*.stories.tsx`) - component stories
- React component files - can have props interfaces (e.g., `BreadcrumbItem`, `BreadcrumbProps` with `Breadcrumb` component)
- External library type files - for third-party SDK types (e.g., Google OAuth types)

**Impact:**
- ❌ God files are hard to navigate and understand
- ❌ Difficult to find specific entities
- ❌ Encourages poor code organization
- ❌ Violates Single Responsibility Principle
- ❌ Makes imports less clear
- ❌ Harder to reuse individual entities
- ✅ 1 entity per file = clear, focused, easy to find

---

# Process

## Running All Checks

Run the comprehensive code audit:
```bash
node ./.claude/skills/code-audit/scripts/run_all_checks.mjs
```

Or run individual checks:

### 1. Import Quality Check
```bash
node ./.claude/skills/code-audit/scripts/check_imports.mjs
```
- Scans all TypeScript/JavaScript files
- Checks for relative imports to aliased directories
- Reports violations with suggested fixes

### 2. Export Quality Check
```bash
node ./.claude/skills/code-audit/scripts/check_exports.mjs
```
- Scans all TypeScript/JavaScript files
- Checks for index files
- Checks for default exports
- Reports violations with suggested fixes

### 3. Redux Abstraction Check
```bash
node ./.claude/skills/code-audit/scripts/check_redux_abstraction.mjs
```
- Scans React components
- Checks for direct useDispatch usage
- Checks for direct RootState imports
- Checks for direct useSelector usage
- Reports violations with suggested fixes

### 4. Service Import Check
```bash
node ./.claude/skills/code-audit/scripts/check_service_imports.mjs
```
- Scans ALL source files in src/ (features, pages, hooks, everywhere)
- Checks for service imports from @/services/*
- Ensures services are ONLY imported in composition root:
  - `src/config/services.ts` (root services file, if exists)
  - `src/config/{feature}/services.ts` (feature-specific service files)
- Reports violations with explanation

### 5. i18n Coverage Check
```bash
node ./.claude/skills/code-audit/scripts/check_i18n_coverage.mjs
```
- Scans React component files (.tsx, .jsx)
- Checks for raw text not wrapped in t()
- Detects JSX text content and string literals
- Excludes log statements, CSS values, HTML attributes
- Reports violations with suggested fixes

### 6. TypeScript "any" Usage Check
```bash
node ./.claude/skills/code-audit/scripts/check_any_usage.mjs
```
- Scans all TypeScript files (.ts, .tsx)
- Checks for usage of the "any" type
- Detects patterns: `: any`, `as any`, `any[]`, `Array<any>`, `Record<any, ...>`, etc.
- Excludes type definition files (*.d.ts) and test files
- Reports violations with suggested alternatives

### 7. Linter/TypeScript Suppression Check
```bash
node ./.claude/skills/code-audit/scripts/check_suppressions.mjs
```
- Scans all source files (.ts, .tsx, .js, .jsx)
- Checks for suppression comments: `@ts-ignore`, `@ts-nocheck`, `eslint-disable`, etc.
- Categorizes by severity: Critical, High, Medium, Low
- Excludes test files (*.test.ts, *.spec.ts)
- Reports violations grouped by severity level

### 8. God File Check (1 Entity Per File)
```bash
node ./.claude/skills/code-audit/scripts/check_god_files.mjs
```
- Scans all TypeScript files (.ts, .tsx)
- Checks for multiple exported entities (interface, type, class, enum) in one file
- Detects: `export interface`, `export type`, `export class`, `export enum`
- Excludes test files, type definitions (*.d.ts), and Storybook files
- Reports violations with suggested file splits

### 9. TODO/FIXME/HACK Comments Check
```bash
node ./.claude/skills/code-audit/scripts/check_todos.mjs
```
- Scans all source files for technical debt markers
- Detects: TODO, FIXME, HACK, XXX, BUG comments
- Categorizes by severity: FIXME (critical), HACK (warning), TODO (info)
- Reports violations with line numbers and context
- Helps track incomplete features and technical debt

### 10. Console Usage Check
```bash
node ./.claude/skills/code-audit/scripts/check_logs.mjs
```
- Scans production code for `console.*` statements (FORBIDDEN in this project)
- Detects: `console.log()`, `console.error()`, `console.warn()`, etc.
- **Note**: `log.debug()` from loglevel is perfectly fine (disabled in production)
- Excludes test files and story files
- Reports violations by file with occurrence counts
- Recommends replacing console.* with log.* from loglevel

### 11. Redux Saga Patterns Check
```bash
node ./.claude/skills/code-audit/scripts/check_saga_patterns.mjs
```
- Scans saga files for inefficient patterns
- Detects: Multiple `yield all` statements in same function
- Recommends combining into single `yield all` for true parallelism
- Reports violations with line numbers and recommendations
- Improves saga performance and structure

# Generating Reports (Optional)

To save a comprehensive markdown report of all checks:

```bash
node ./.claude/skills/code-audit/scripts/generate_report.mjs
```

**Output:** `reports/{YYYY-MM-DD_HH-MM}/code-audit-report.md`

**Report includes:**
- Executive summary with pass/fail counts
- Results table for all checks
- Detailed violations for failed checks (collapsible)
- Summary of passed checks
- Prioritized recommendations

**Environment variable:**
```bash
# Custom report directory
export REPORT_DIR="reports/my-custom-timestamp"
node ./.claude/skills/code-audit/scripts/generate_report.mjs
```

**Usage patterns:**

```bash
# Option 1: Console output only (default)
node ./.claude/skills/code-audit/scripts/run_all_checks.mjs

# Option 2: Console output + Save report
node ./.claude/skills/code-audit/scripts/generate_report.mjs

# Option 3: Specific check only
node ./.claude/skills/code-audit/scripts/check_imports.mjs
```

**Report structure:**
```
reports/
└── 2025-11-01_14-30/               # Includes hours and minutes for multiple runs per day
    ├── code-audit-report.md        # This skill's report
    ├── arch-audit-report.md        # Architecture audit (separate)
    └── ...                         # Other reports
```

# Output Format

```
Code Audit Results
==================

Path Alias Violations: X found

FROM: features/wallet
  ❌ src/features/wallet/components/Wallet.tsx:5
     import { useAuth } from '../../oauth/hooks/useAuth'
     → Violates: Feature → Feature (cross-feature)
     Fix: import { useAuth } from '@/features/oauth/hooks/useAuth'

FROM: pages/Home
  ❌ src/pages/Home/Home.tsx:3
     import { Wallet } from '../../features/wallet/components/Wallet'
     → Violates: Page → Feature
     Fix: import { Wallet } from '@/features/wallet/components/Wallet'

Summary: X violations found
```

# Tools

- **Bash**: run Node.js scripts
- **Read**: inspect source files
- **Write**: `reports/{timestamp}/code-audit-report.md` (only when generating reports)

# Safety

- Read-only operation (unless generating reports)
- No source file modifications
- No external network calls
- Comprehensive scan of all imports
- Reports are saved to isolated `reports/` directory
