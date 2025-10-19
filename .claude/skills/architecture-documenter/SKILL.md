---
name: architecture-documenter
description: Scans the codebase and generates PlantUML diagrams plus a concise architecture report under docs/architecture.
---

# Purpose

Generate **deterministic** architecture outputs without prompts or modes:

- Analyze project structure and imports
- Create PlantUML diagrams (.puml)
- Produce `ARCHITECTURE_REPORT.md`
- **No rendering** (only .puml sources)
- **No network**
- **Write only** under `docs/architecture/**`

# Process

1. Ensure output dirs: `docs/architecture/diagrams`
2. Run:
   - `node ./.claude/skills/architecture-documenter/scripts/scan_project.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/gen_puml.mjs`
   - `node ./.claude/skills/architecture-documenter/scripts/render_png.mjs` ← tries PNG render
   - `node ./.claude/skills/architecture-documenter/scripts/assemble_report.mjs`
3. Outputs under `docs/architecture/`:
   - `diagrams/*.puml` (always)
   - `diagrams/*.png` (if renderer available)
   - `ARCHITECTURE_REPORT.md` (prefers PNG if present)

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
