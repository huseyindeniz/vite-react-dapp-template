#!/usr/bin/env bash
set -e

echo "🔍 Checking for minor updates..."
npx ncu --target minor --jsonAll > outdated.json

echo "🧹 Filtering excluded packages (i18next*, storybook*)..."
# jq çoğu ortamda mevcut değilse, node ile filtrele
if command -v jq >/dev/null 2>&1; then
  jq 'with_entries(select(.key | test("i18next|18next|storybook") | not))' outdated.json > filtered.json
else
  node -e "const fs=require('fs');const o=JSON.parse(fs.readFileSync('outdated.json','utf8'));
  const f=Object.fromEntries(Object.entries(o).filter(([k])=>!/(i18next|18next|storybook)/.test(k)));
  fs.writeFileSync('filtered.json',JSON.stringify(f,null,2));"
fi

echo "📦 Preparing backup..."
mkdir -p .backup
cp package.json .backup/package.json
cp package-lock.json .backup/package-lock.json

# paket listesini oku
echo "🔢 Reading package list..."
packages=$(node -e "console.log(Object.keys(require('./filtered.json')).join(' '))")

if [ -z "$packages" ]; then
  echo "✅ No minor updates available."
  exit 0
fi

# batch işlemi: hem bash hem zsh uyumlu
batch_size=8
set -- $packages
while [ "$#" -gt 0 ]; do
  batch=""
  count=0
  while [ "$#" -gt 0 ] && [ "$count" -lt "$batch_size" ]; do
    batch="$batch $1"
    shift
    count=$((count+1))
  done
  echo "➡️  Updating:$batch"
  npx ncu -u $batch --target minor
  npm install --no-audit --no-fund
  ./scripts/validate.sh || {
    echo "❌ Validation failed, reverting batch..."
    cp .backup/package.json package.json
    cp .backup/package-lock.json package-lock.json
    npm install --no-audit --no-fund
    exit 1
  }
done

echo "✅ All minor updates validated successfully."
