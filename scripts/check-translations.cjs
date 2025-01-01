const fs = require('fs');
const path = require('path');

const translationsDir = './src/features/i18n/translations'; // Path to your translations directory
const languages = ['en-US', 'tr-TR']; // Add all supported languages

function loadNamespace(language, namespace) {
    const filePath = path.join(translationsDir, language, `${namespace}.json`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getNamespaces(language) {
    const dirPath = path.join(translationsDir, language);
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Missing language folder: ${dirPath}`);
    }
    return fs.readdirSync(dirPath).map((file) => path.basename(file, '.json'));
}

function validateTranslations() {
    const baseLanguage = languages[0]; // Use the first language as the reference
    const baseNamespaces = getNamespaces(baseLanguage);

    const errors = [];

    languages.forEach((language) => {
        const languageNamespaces = getNamespaces(language);

        // Check if all namespaces exist in this language
        baseNamespaces.forEach((namespace) => {
            if (!languageNamespaces.includes(namespace)) {
                errors.push(`Missing namespace "${namespace}" in language "${language}"`);
                return; // Skip further checks for this namespace
            }

            // Load and compare translations for the namespace
            const baseTranslations = loadNamespace(baseLanguage, namespace);
            const translations = loadNamespace(language, namespace);

            Object.keys(baseTranslations).forEach((key) => {
                if (!translations.hasOwnProperty(key)) {
                    errors.push(`Missing key "${key.substring(0, 20)}..." in namespace "${namespace}" for language "${language}"`);
                } else if (translations[key] === '') {
                    errors.push(`Empty value for key "${key.substring(0, 20)}..." in namespace "${namespace}" for language "${language}"`);
                }
            });
        });
    });

    if (errors.length > 0) {
        console.error('Translation validation errors found:');
        console.error('Number of errors:', errors.length);
        errors.forEach((error) => console.error(error));
        process.exit(1); // Exit with error code
    } else {
        console.log('All translations are valid.');
    }
}

validateTranslations();
