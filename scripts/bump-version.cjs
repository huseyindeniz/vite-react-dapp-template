const fs = require('fs');
const path = require('path');
const semver = require('semver');

const packagePath = path.resolve(__dirname, '../package.json');
const viteConfigPath = path.resolve(__dirname, '../vite.config.ts');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Get the versionType from command line arguments
const versionType = process.argv[2];

if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
    console.log('Invalid or missing version bump type. Please specify "patch", "minor", or "major".');
    process.exit(1);
}

const newVersion = semver.inc(pkg.version, versionType);
pkg.version = newVersion;

// Update package.json
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

// Update vite.config.ts - replace the hardcoded template version
let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
viteConfig = viteConfig.replace(
    /__VITE_REACT_DAPP_TEMPLATE_VERSION__: JSON\.stringify\(['"](.*?)['"]\)/,
    `__VITE_REACT_DAPP_TEMPLATE_VERSION__: JSON.stringify('${newVersion}')`
);
fs.writeFileSync(viteConfigPath, viteConfig);

console.log(`Version updated to ${newVersion}`);
console.log(`Updated files: package.json, vite.config.ts`);
