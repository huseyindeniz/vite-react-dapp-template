#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const ROOT = path.join(process.cwd(),'docs','architecture');
const DIAG = path.join(ROOT,'diagrams');
const META = JSON.parse(fs.readFileSync(path.join(ROOT,'scan.meta.json'),'utf8'));

function imgOrPuml(base) {
  const png = path.join('diagrams', base + '.png');
  const puml = path.join('diagrams', base + '.puml');
  if (fs.existsSync(path.join(ROOT, png))) return `![${base}](${png})`;
  return `\`${puml}\` (PNG not available)`;
}

const md = `# Architecture Report

Generated: ${META.generatedAt}

## 1. Executive Summary
- Project: **${META.package.name ?? 'unknown'}** @ ${META.package.version ?? '0.0.0'}
- Source files scanned: **${META.counts.files}**
- Roots: ${META.roots.length? META.roots.map(r=>'\`'+r+'\`').join(', ') : '_root_'}

## 2. System Architecture Overview
${imgOrPuml('system-overview')}

## 3. Component Architecture
${imgOrPuml('component-architecture')}

## 4. Data Flow
${imgOrPuml('data-flow')}

## 5. Dependencies Snapshot
${imgOrPuml('dependencies-summary')}

## 6. Technical Stack
**Dependencies**
${(META.package.deps||[]).sort().map(d=>`- ${d}`).join('\n') || '_none_'}

**Dev Dependencies**
${(META.package.devDeps||[]).sort().map(d=>`- ${d}`).join('\n') || '_none_'}

## 7. Dependency Signals (imported bare modules)
Detected by regex on import lines (heuristic, best-effort).

${
  Object.entries(META.imports)
    .slice(0, 50)
    .map(([file,mods])=>`- **${path.relative(process.cwd(), file)}** → ${Array.from(new Set(mods)).slice(0,10).join(', ')}`)
    .join('\n') || '_no bare module imports detected_'
}

## 8. Notes & Limitations
- PNG rendering requires PlantUML (CLI or jar) and may require Graphviz (\`dot\`) for some diagram types.
- If not available, \`.puml\` sources are provided for later rendering (VS Code extension or CI).
`;
fs.writeFileSync(path.join(ROOT,'ARCHITECTURE_REPORT.md'), md);
console.log('assemble_report: wrote ARCHITECTURE_REPORT.md (prefers PNGs if present)');
