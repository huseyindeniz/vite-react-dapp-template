---
name: docs-generator
description: Comprehensive documentation generation through automated codebase analysis, pattern detection, and diagram creation.
---

# Purpose

Generate **comprehensive, up-to-date documentation** by analyzing the codebase to:
- Detect architectural patterns AND exceptions/outliers
- Document high-level architecture and low-level implementation details
- Analyze feature structures (core vs domain features)
- Map state management patterns (Redux, Sagas, Slices)
- Document component patterns and organization
- Generate Mermaid diagrams for visual understanding
- Create organized, navigable documentation structure
- Output to date-based directories (`docs/YYYY-MM-DD/`)

**Problem Solved:** After major refactoring, documentation becomes obsolete. This skill regenerates comprehensive documentation automatically by analyzing the actual codebase, ensuring docs always match reality.

**Target Audience:** Developers who will use this React template as a starter for their projects.

# Scope

- Analyzes entire codebase structure
- Detects patterns in:
  - Feature organization (feature-model architecture)
  - State management (Redux Toolkit + Redux Saga)
  - Component patterns and hooks abstraction
  - Dependency injection and interfaces
  - Business logic separation
  - Testing patterns
- Generates multiple organized documentation files (NOT one god file)
- Creates Mermaid diagrams for architecture visualization
- Outputs to `docs/YYYY-MM-DD/` (same day overwrites)
- Incremental generation: analyze one feature at a time

# Documentation Structure

```
docs/YYYY-MM-DD/
├── README.md                         # Main navigation and overview
├── architecture/
│   ├── README.md                     # Architecture overview
│   ├── feature-model-pattern.md      # Core architectural pattern
│   ├── dependency-injection.md       # DI and interface pattern
│   ├── state-management.md           # Redux/Saga patterns
│   ├── business-logic-separation.md  # ActionEffects pattern
│   └── diagrams/
│       ├── architecture-overview.mmd
│       ├── feature-structure.mmd
│       ├── data-flow.mmd
│       └── dependency-graph.mmd
├── features/
│   ├── README.md                     # Features overview
│   ├── core/
│   │   ├── README.md                 # Core features summary
│   │   ├── app.md                    # Application bootstrap
│   │   ├── i18n.md                   # Internationalization
│   │   ├── router.md                 # Routing infrastructure
│   │   ├── slice-manager.md          # Redux slice lifecycle
│   │   └── ui.md                     # Design system
│   └── domain/
│       ├── README.md                 # Domain features summary
│       ├── wallet.md                 # Wallet feature (3 models)
│       ├── oauth.md                  # OAuth feature (1 model)
│       └── blog-demo.md              # Blog demo (2 models)
├── patterns/
│   ├── README.md                     # Patterns overview
│   ├── component-patterns.md         # Component organization
│   ├── hook-patterns.md              # Custom hooks patterns
│   ├── testing-patterns.md           # Test organization
│   └── code-quality.md               # Code quality patterns
├── guides/
│   ├── README.md                     # Guides overview
│   ├── getting-started.md            # Quick start guide
│   ├── adding-new-feature.md         # How to add domain feature
│   ├── creating-new-model.md         # How to add model to feature
│   ├── testing-guide.md              # Testing best practices
│   └── deployment.md                 # Deployment guide
└── api-reference/
    ├── README.md                     # API reference overview
    ├── hooks.md                      # All custom hooks
    ├── services.md                   # Service implementations
    ├── types.md                      # Important type definitions
    └── utilities.md                  # Utility functions
```

# Analysis Scripts

Each script performs specific analysis and generates structured data for documentation.

## 1. Feature Analysis (`analyze_feature.mjs`)

**Purpose:** Analyze a single feature's structure, patterns, and implementation.

**What it detects:**
- Feature category (core vs domain)
- Models (for domain features)
- Directory structure and organization
- Interfaces and their relationships
- Redux slice structure
- Saga patterns and action effects
- Component organization
- Hook abstractions
- Exception cases and outliers

**Output:** JSON structure with feature metadata

**Usage:**
```bash
node ./.claude/skills/docs-generator/scripts/analyze_feature.mjs <feature-name>
```

## 2. Architecture Analysis (`analyze_architecture.mjs`)

**Purpose:** Analyze overall architectural patterns across all features.

**What it detects:**
- Feature dependency graph
- Core vs domain feature relationships
- Composition root pattern usage
- Dependency injection patterns
- Interface architecture patterns
- Common patterns across features
- Architectural outliers/exceptions

**Output:** JSON structure with architecture metadata

## 3. State Management Analysis (`analyze_state_management.mjs`)

**Purpose:** Analyze Redux/Saga patterns and state structure.

**What it detects:**
- Redux slice organization
- Saga patterns (takeEvery, takeLatest, etc.)
- Action creator patterns
- State shape and nesting
- Selector patterns
- Business logic location (actionEffects)

**Output:** JSON structure with state management patterns

## 4. Component Analysis (`analyze_components.mjs`)

**Purpose:** Analyze React component patterns.

**What it detects:**
- Component organization by feature
- Hook usage patterns (useActions, useTypedSelector)
- Component composition patterns
- Props interfaces
- HOC usage
- Storybook coverage

**Output:** JSON structure with component patterns

## 5. Diagram Generation (`generate_diagrams.mjs`)

**Purpose:** Generate Mermaid diagrams for visual documentation.

**Diagrams generated:**
- Architecture overview (features and relationships)
- Feature structure (model-based organization)
- Data flow (Redux → Saga → API)
- Dependency graph (feature dependencies)
- State shape (Redux store structure)

**Output:** `.mmd` files in `docs/YYYY-MM-DD/architecture/diagrams/`

## 6. Main Documentation Generator (`generate_docs.mjs`)

**Purpose:** Orchestrate all analysis scripts and generate final documentation.

**Process:**
1. Run all analysis scripts
2. Collect structured data (JSON)
3. Apply documentation templates
4. Generate markdown files
5. Create diagrams
6. Output to `docs/YYYY-MM-DD/`

**Usage:**
```bash
# Generate full documentation
node ./.claude/skills/docs-generator/scripts/generate_docs.mjs

# Generate for specific feature only
node ./.claude/skills/docs-generator/scripts/generate_docs.mjs --feature wallet
```

# Incremental Generation Strategy

As requested, documentation generation should be **incremental** (one feature at a time):

## Phase 1: Core Infrastructure
1. Analyze `app/` feature (composition root, providers)
2. Analyze `i18n/` feature (internationalization)
3. Analyze `router/` feature (routing)
4. Analyze `slice-manager/` feature (Redux lifecycle)
5. Analyze `ui/` feature (Mantine theme)

## Phase 2: Domain Features (Examples)
1. Analyze `wallet/` feature (3 models: provider, network, account)
2. Analyze `oauth/` feature (1 model: session)
3. Analyze `blog-demo/` feature (2 models: post, author)

## Phase 3: Cross-Cutting Concerns
1. Architecture patterns (dependency injection, interfaces)
2. State management patterns (Redux/Saga)
3. Component patterns (hooks abstraction)
4. Testing patterns

## Phase 4: Diagrams
1. Architecture overview diagram
2. Feature structure diagrams
3. Data flow diagrams
4. Dependency graphs

## Phase 5: Guides
1. Getting started guide
2. Adding new feature guide
3. Creating new model guide
4. Testing guide

# Pattern Detection

The analysis scripts should detect both **common patterns** and **exceptions/outliers**.

## Common Patterns (Expected)

### Feature-Model Pattern
- Domain features have `models/` directory
- Each model has own directory
- Model structure: `IModelApi.ts`, `actions.ts`, `slice.ts`, `actionEffects/`, `types/`
- Root has `IFeatureApi.ts`, `slice.ts` (combineReducers), `sagas.ts`

### Business Logic Separation
- All business logic in `actionEffects/` (Redux Saga)
- Slices are pure state containers
- Components are pure presentation

### Interface Architecture
- Models define interfaces: `IModelApi.ts`
- Root combines: `IFeatureApi.ts extends IModel1Api, IModel2Api`
- Services implement interfaces
- ActionEffects receive injected APIs

### Component-Hook Abstraction
- Components use feature hooks (NOT Redux directly)
- Each feature has `hooks/` with `useActions` and state hooks
- NO direct `useDispatch()` or `useSelector()` in components

## Outliers/Exceptions (Detected)

### Core Features
- Do NOT follow model pattern (specialized structures)
- `app/`, `i18n/`, `router/`, `slice-manager/`, `ui/`
- Each has unique structure optimized for its purpose

### Single Model Features
- Some features may have only ONE model
- Still must follow directory structure: `models/session/`
- Example: `oauth/` has only `session` model

### Composition Root
- `src/features/app/config/` is special exception
- Can import anything (services, model internals, etc.)
- This is intentional for dependency injection

### Special Cases
- Storybook files: require default exports (exception to rule)
- Type definition files: may use "any" type (exception)
- Test files: different structure and rules

# Documentation Templates

Templates provide structure for consistent documentation generation.

## Feature Template

```markdown
# {Feature Name}

**Category:** {Core | Domain}
**Models:** {List of models or "N/A"}
**Purpose:** {Brief description}

## Overview

{Detailed description of feature purpose and responsibility}

## Structure

{Directory tree}

## Models

{For domain features - document each model}

### {Model Name}

**Purpose:** {Model responsibility}
**State:** {State shape}
**Actions:** {Key actions}
**Business Logic:** {ActionEffects overview}

## API

### Hooks

- `use{Feature}()` - {Description}
- `use{Feature}Actions()` - {Description}

### Interfaces

- `I{Feature}Api` - {Description}
- `I{Model}Api` - {Description}

## Usage Example

```typescript
{Code example}
```

## Implementation Details

{Key implementation patterns}

## Testing

{Testing patterns for this feature}
```

## Architecture Pattern Template

```markdown
# {Pattern Name}

## Overview

{Pattern description and purpose}

## Problem Solved

{What problem this pattern solves}

## Implementation

{How it's implemented in this codebase}

## Examples

{Real examples from codebase}

## Benefits

{Why this pattern is used}

## Common Pitfalls

{Things to avoid}
```

# Process

## Step 1: Invoke Skill

User invokes: `docs-generator` skill

## Step 2: Initial Setup

1. Check if `docs/` directory exists, create if needed
2. Determine date-based output directory: `docs/YYYY-MM-DD/`
3. If same day directory exists, confirm overwrite with user
4. Create output directory structure

## Step 3: Feature Analysis (Incremental)

Start with ONE feature (as requested by user):

```bash
# Example: Start with wallet feature
node ./.claude/skills/docs-generator/scripts/analyze_feature.mjs wallet
```

This generates:
- Feature structure analysis (JSON)
- Model documentation (if domain feature)
- Hook documentation
- Component documentation
- Feature-specific diagram

## Step 4: Expand to All Features

Once single-feature generation works:

```bash
# Generate all features
node ./.claude/skills/docs-generator/scripts/generate_docs.mjs --all
```

## Step 5: Architecture Analysis

```bash
node ./.claude/skills/docs-generator/scripts/analyze_architecture.mjs
```

Generates:
- Architecture overview
- Pattern documentation
- Dependency graphs
- Architectural diagrams

## Step 6: Generate Guides

```bash
node ./.claude/skills/docs-generator/scripts/generate_guides.mjs
```

Generates:
- Getting started guide
- How-to guides
- Best practices
- API reference

## Step 7: Verification

1. Check all files generated successfully
2. Verify Mermaid diagrams render correctly
3. Check internal links work
4. Validate markdown formatting

## Output Format

```
Documentation Generation Report
================================================================================

Analysis Phase:
  ✅ Feature Analysis: 8 features analyzed
  ✅ Architecture Analysis: Complete
  ✅ State Management Analysis: Complete
  ✅ Component Analysis: Complete

Generation Phase:
  ✅ Feature Documentation: 8 files generated
  ✅ Architecture Documentation: 5 files generated
  ✅ Pattern Documentation: 4 files generated
  ✅ Guides: 5 files generated
  ✅ API Reference: 4 files generated
  ✅ Diagrams: 5 Mermaid diagrams generated

Output: docs/2025-11-02/

Summary:
  - Total Files: 31
  - Total Diagrams: 5
  - Features Documented: 8 (5 core, 3 domain)
  - Patterns Documented: 4 core patterns

✅ Documentation generation complete!
```

# Tools

- **Bash**: Run Node.js analysis scripts
- **Read**: Read source files for analysis
- **Write**: Generate documentation files in `docs/YYYY-MM-DD/`
- **Glob**: Find files by pattern for analysis
- **Grep**: Search for code patterns

# Safety

- Read-only analysis (except documentation output)
- No source file modifications
- No external network calls
- Documentation isolated in `docs/` directory
- Same-day overwrites are intentional (iterative workflow)

# Implementation Notes

## TypeScript AST Parsing

Scripts use TypeScript Compiler API for accurate code analysis:
- Parse interfaces and types
- Detect exports and imports
- Analyze function signatures
- Extract JSDoc comments

## Pattern Detection Algorithm

1. **Scan all features**: Analyze directory structure
2. **Identify common patterns**: What 80% of features do
3. **Flag exceptions**: What 20% of features do differently
4. **Categorize exceptions**: Core features vs genuine outliers
5. **Document both**: Patterns as rules, exceptions as special cases

## Diagram Generation

Use Mermaid syntax for diagrams:
- `graph TD` for architecture diagrams
- `classDiagram` for interface relationships
- `sequenceDiagram` for data flow
- `flowchart` for process flows

## Template Application

1. Load template
2. Replace placeholders with analyzed data
3. Generate markdown
4. Write to output directory

# Usage Examples

## Generate Full Documentation

```bash
# Run the docs-generator skill
# This will analyze entire codebase and generate comprehensive docs
```

## Generate Single Feature Documentation

```bash
# Analyze and document wallet feature only
node ./.claude/skills/docs-generator/scripts/analyze_feature.mjs wallet
```

## Regenerate After Refactoring

```bash
# After major refactoring, regenerate all docs
# Same-day output will overwrite previous documentation
node ./.claude/skills/docs-generator/scripts/generate_docs.mjs --all
```

## Custom Output Directory

```bash
# Generate docs to custom directory
export DOCS_DIR="docs/custom-timestamp"
node ./.claude/skills/docs-generator/scripts/generate_docs.mjs
```

# Success Criteria

✅ **Comprehensive**: Covers all features, patterns, and architecture
✅ **Accurate**: Generated from actual code, not assumptions
✅ **Organized**: Multiple categorized files, not one huge file
✅ **Visual**: Includes Mermaid diagrams for complex concepts
✅ **Navigable**: Clear structure with README files and links
✅ **Up-to-date**: Regenerates from current codebase state
✅ **Incremental**: Can generate one feature at a time
✅ **Pattern-aware**: Detects both patterns AND exceptions
✅ **Developer-focused**: Written for template users, not just maintainers
