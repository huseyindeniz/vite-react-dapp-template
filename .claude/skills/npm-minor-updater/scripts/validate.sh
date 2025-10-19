#!/usr/bin/env bash
set -e

has_script() {
  node -e "const p=require('./package.json');process.exit(p.scripts && p.scripts['$1']?0:1)" >/dev/null 2>&1
}

if has_script lint;  then npm run lint;  fi
if has_script test;  then npm run test;  fi
if has_script build; then npm run build; fi
