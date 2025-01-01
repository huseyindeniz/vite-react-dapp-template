const fs = require('fs');
const path = require('path');
const semver = require('semver');

const packagePath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Get the versionType from command line arguments
const versionType = process.argv[2];

if (!versionType || !['patch', 'minor', 'major'].includes(versionType)) {
    console.log('Invalid or missing version bump type. Please specify "patch", "minor", or "major".');
    process.exit(1);
}

const newVersion = semver.inc(pkg.version, versionType);
pkg.version = newVersion;

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Version updated to ${newVersion}`);
