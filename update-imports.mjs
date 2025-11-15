import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const replacements = [
  // Core features
  ["'@/features/app", "'@/core/features/app"],
  ["'@/features/auth", "'@/core/features/auth"],
  ["'@/features/i18n", "'@/core/features/i18n"],
  ["'@/features/router", "'@/core/features/router"],
  ["'@/features/slice-manager", "'@/core/features/slice-manager"],
  ["'@/features/layout", "'@/core/features/ui/layout"],
  ["'@/features/components", "'@/core/features/ui/components"],
  // Domain features
  ["'@/features/ai-assistant", "'@/domain/features/ai-assistant"],
  ["'@/features/blog-demo", "'@/domain/features/blog-demo"],
  ["'@/features/oauth", "'@/domain/features/oauth"],
  ["'@/features/wallet", "'@/domain/features/wallet"],
  // Pages & components
  ["'@/features/site/pages", "'@/core/pages"],
  ["'@/features/site/components", "'@/domain/components"],
  // Config
  ["'@/config/routes'", "'@/config/core/router/routes'"],
  ["'@/config/auth", "'@/config/core/auth"],
  ["'@/config/i18n", "'@/config/core/i18n"],
  ["'@/config/ui", "'@/config/core/ui"],
  // Double quotes versions
  ['"@/features/app', '"@/core/features/app'],
  ['"@/features/auth', '"@/core/features/auth'],
  ['"@/features/i18n', '"@/core/features/i18n'],
  ['"@/features/router', '"@/core/features/router'],
  ['"@/features/slice-manager', '"@/core/features/slice-manager'],
  ['"@/features/layout', '"@/core/features/ui/layout'],
  ['"@/features/components', '"@/core/features/ui/components'],
  ['"@/features/ai-assistant', '"@/domain/features/ai-assistant'],
  ['"@/features/blog-demo', '"@/domain/features/blog-demo'],
  ['"@/features/oauth', '"@/domain/features/oauth'],
  ['"@/features/wallet', '"@/domain/features/wallet'],
  ['"@/features/site/pages', '"@/core/pages'],
  ['"@/features/site/components', '"@/domain/components'],
  ['"@/config/routes"', '"@/config/core/router/routes"'],
  ['"@/config/auth', '"@/config/core/auth'],
  ['"@/config/i18n', '"@/config/core/i18n'],
  ['"@/config/ui', '"@/config/core/ui'],
  // Domain config paths
  ["'@/config/ai-assistant", "'@/config/domain/ai-assistant"],
  ["'@/config/blog-demo", "'@/config/domain/blog-demo"],
  ["'@/config/oauth", "'@/config/domain/oauth"],
  ["'@/config/wallet", "'@/config/domain/wallet"],
  ['"@/config/ai-assistant', '"@/config/domain/ai-assistant'],
  ['"@/config/blog-demo', '"@/config/domain/blog-demo'],
  ['"@/config/oauth', '"@/config/domain/oauth'],
  ['"@/config/wallet', '"@/config/domain/wallet'],
  // Relative paths for wallet tests
  ["'../../../../../config/wallet", "'../../../../../config/domain/wallet"],
  ['"../../../../../config/wallet', '"../../../../../config/domain/wallet'],
];

const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { ignore: ['**/node_modules/**'] });

let totalUpdates = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  let updated = false;

  replacements.forEach(([oldPath, newPath]) => {
    if (content.includes(oldPath)) {
      content = content.replaceAll(oldPath, newPath);
      updated = true;
      totalUpdates++;
    }
  });

  if (updated) {
    writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});

console.log(`\nTotal replacements made: ${totalUpdates}`);
console.log('Done!');
