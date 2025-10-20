#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const CWD = process.cwd();

const IGNORES = new Set([
  'node_modules','dist','build','coverage','.git','docs'
]);

const CANDIDATE_ROOTS = ['src', 'apps', 'packages'];
const EXT_RE = /\.(ts|tsx|js|jsx)$/i;
const IMPORT_RE = /^\s*import\s+.*?from\s+['"]([^'"]+)['"]/;

function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

function* walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const rel = path.relative(CWD, p);
    const st = fs.lstatSync(p);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) {
      const base = path.basename(p);
      if (IGNORES.has(base)) continue;
      if (rel.startsWith('docs/architecture')) continue;
      yield* walk(p);
    } else {
      if (EXT_RE.test(name)) yield p;
    }
  }
}

function resolveRoots() {
  const roots = [];
  if (exists(path.join(CWD,'src'))) roots.push(path.join(CWD,'src'));
  if (exists(path.join(CWD,'apps'))) {
    for (const d of fs.readdirSync(path.join(CWD,'apps'))) {
      const s = path.join(CWD,'apps',d,'src');
      if (exists(s)) roots.push(s);
    }
  }
  if (exists(path.join(CWD,'packages'))) {
    for (const d of fs.readdirSync(path.join(CWD,'packages'))) {
      const s = path.join(CWD,'packages',d,'src');
      if (exists(s)) roots.push(s);
    }
  }
  // fallback: project root (lightweight)
  return roots.length ? roots : [CWD];
}

const roots = resolveRoots();
const files = [];
const imports = {}; // file -> array of specifiers (bare module ids only)

for (const root of roots) {
  for (const f of walk(root)) {
    const relPath = path.relative(CWD, f);
    files.push(relPath);
    const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(IMPORT_RE);
      if (m) {
        const spec = m[1];
        // only collect bare module ids, not relative paths
        if (!spec.startsWith('.') && !spec.startsWith('/')) {
          (imports[relPath] ||= []).push(spec);
        }
      }
    }
  }
}

let pkg = {};
try {
  pkg = JSON.parse(fs.readFileSync(path.join(CWD,'package.json'),'utf8'));
} catch {}

const meta = {
  generatedAt: new Date().toISOString(),
  roots: roots.map(r=>path.relative(CWD,r)),
  counts: { files: files.length },
  files,
  imports, // module usage per file (bare modules)
  package: {
    name: pkg.name || null,
    version: pkg.version || null,
    deps: Object.keys(pkg.dependencies||{}),
    devDeps: Object.keys(pkg.devDependencies||{})
  }
};

fs.mkdirSync(path.join(CWD,'docs','architecture','diagrams'), { recursive:true });
fs.mkdirSync(path.join(CWD,'docs','architecture','analysis'), { recursive:true });
fs.writeFileSync(path.join(CWD,'docs','architecture','analysis','scan.meta.json'), JSON.stringify(meta, null, 2));
console.log(`scan_project: scanned ${files.length} files.`);
