const fs = require('fs');
const path = require('path');
const semver = require('semver');
const prompts = require('prompts');

const packagePath = path.resolve(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

(async () => {
    const response = await prompts({
        type: 'select',
        name: 'versionType',
        message: 'Select the type of version bump:',
        choices: [
            { title: 'Patch (e.g., 0.7.1 -> 0.7.2)', value: 'patch' },
            { title: 'Minor (e.g., 0.7.1 -> 0.8.0)', value: 'minor' },
            { title: 'Major (e.g., 0.7.1 -> 1.0.0)', value: 'major' },
        ],
    });

    if (!response.versionType) {
        console.log('No version bump selected. Exiting...');
        process.exit(0);
    }

    const newVersion = semver.inc(pkg.version, response.versionType);
    pkg.version = newVersion;

    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

    console.log(`Version updated to ${newVersion}`);
})();
