---
name: architecture-documenter
description: Scans the codebase and generates PlantUML diagrams plus comprehensive architecture reports (Overview, Details, Issues) under docs/architecture.
---

# Purpose

Generate **comprehensive** architecture analysis with three reports:

- **ARCHITECTURE_OVERVIEW.md** - Quick summary with scores and diagrams
- **ARCHITECTURE_DETAILS.md** - Comprehensive documentation (tech stack, patterns, best practices)
- **ARCHITECTURE_ISSUES.md** - Actionable issues categorized by severity (Critical/High/Medium/Low)
- PlantUML diagrams (.puml + .png)
- Detailed analysis JSON files for tracking
- **No network** (except npm-check-updates for dependency analysis)
- **Write only** under `docs/architecture/**`

# Process

1. **Scan Phase:**
   - `node ./.claude/skills/architecture-documenter/scripts/scan_project.mjs`

2. **Diagram Generation:**
   - `node ./.claude/skills/architecture-documenter/scripts/gen_puml.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/render_png.mjs`

3. **Analysis Phase (5 analyzers):**
   - `node ./.claude/skills/architecture-documenter/scripts/analyze_code_quality.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/analyze_architecture.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/analyze_testing.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/analyze_security.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/analyze_dependencies.mjs`

4. **Issue Detection:**
   - `node ./.claude/skills/architecture-documenter/scripts/detect_issues.mjs`

5. **Report Assembly (3 reports):**
   - `node ./.claude/skills/architecture-documenter/scripts/assemble_overview.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/assemble_details.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/assemble_issues.mjs`

6. Outputs under `docs/architecture/`:
   - `ARCHITECTURE_OVERVIEW.md` - Quick summary
   - `ARCHITECTURE_DETAILS.md` - Full documentation
   - `ARCHITECTURE_ISSUES.md` - Actionable issues
   - `diagrams/*.puml` (always)
   - `diagrams/*.png` (if PlantUML available)
   - `analysis/*.json` (detailed metrics)

# Conventions

- Scan roots: `src/`, `apps/*/src/`, `packages/*/src/` if exist; otherwise project root fallback (ignoring heavy dirs).
- Ignore: `node_modules`, `dist`, `build`, `coverage`, `.git`, `docs/architecture`
- File types: `.ts`, `.tsx`, `.js`, `.jsx`

# Tools

- **Read**: repository files
- **Write**: `docs/architecture/**` only
- **Bash**: to invoke `node` if needed

# Safety

- Never modify source files outside `docs/architecture/**`
- No external calls; purely local analysis
- Scans are best-effort (regex import detection); report notes limitations
