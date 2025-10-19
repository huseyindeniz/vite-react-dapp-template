#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const CWD = process.cwd();
const DIAG = path.join(CWD, 'docs', 'architecture', 'diagrams');
const VENDOR_JAR = path.join(CWD, '.claude', 'skills', 'architecture-documenter', 'vendor', 'plantuml.jar');

// Ayar: npx fallback’a izin ver (online gerekebilir)
const ALLOW_NPX_FALLBACK = true;

function hasCmd(cmd) {
  const res = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { stdio: 'ignore' });
  return res.status === 0;
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: 'inherit' });
  return res.status === 0;
}

function pumlFiles() {
  if (!fs.existsSync(DIAG)) return [];
  return fs.readdirSync(DIAG)
    .filter(f => f.endsWith('.puml'))
    .map(f => path.join(DIAG, f));
}

const files = pumlFiles();
if (files.length === 0) {
  console.log('render_png: no .puml files to render.');
  process.exit(0);
}

// 1) plantuml komutu varsa direkt kullan
if (hasCmd('plantuml')) {
  console.log('render_png: using system "plantuml"');
  if (!run('plantuml', ['-tpng', ...files])) process.exit(1);
  process.exit(0);
}

// 2) Java + vendor jar varsa kullan
if (hasCmd('java') && fs.existsSync(VENDOR_JAR)) {
  console.log('render_png: using vendor plantuml.jar');
  if (!run('java', ['-jar', VENDOR_JAR, '-tpng', ...files])) process.exit(1);
  process.exit(0);
}

// 3) Opsiyonel: npx @plantuml/cli (Java gerektirebilir, network gerekebilir)
if (ALLOW_NPX_FALLBACK) {
  console.log('render_png: trying "npx @plantuml/cli" fallback...');
  if (run('npx', ['-y', '@plantuml/cli', '-tpng', ...files])) process.exit(0);
}

// 4) Olmadı: PNG üretilemedi, .puml ile devam
console.warn('render_png: PNG render skipped (no plantuml/java/cli). Report will reference .puml files.');
process.exit(0);
