const fs = require('fs');
const path = require('path');

/**
 * Validate translation completeness
 *
 * Structure: i18n/translations/{namespace}/{locale}.json
 */

const translationsDir = './src/config/i18n/translations';
const languages = ['en-US', 'tr-TR'];

/**
 * Get all namespaces (directories in translations/)
 */
function getNamespaces() {
  if (!fs.existsSync(translationsDir)) {
    throw new Error(`Missing translations directory: ${translationsDir}`);
  }

  return fs.readdirSync(translationsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
}

/**
 * Load a translation file
 */
function loadNamespace(namespace, language) {
  const filePath = path.join(translationsDir, namespace, `${language}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Validate translations
 */
function validateTranslations() {
  console.log('=== Validating Translations ===\n');

  const namespaces = getNamespaces();
  const errors = [];

  console.log(`Found ${namespaces.length} namespace(s):\n`);

  namespaces.forEach((namespace) => {
    console.log(`  Checking: ${namespace}`);

    // Check if all locales exist
    languages.forEach((language) => {
      const filePath = path.join(translationsDir, namespace, `${language}.json`);

      if (!fs.existsSync(filePath)) {
        errors.push(`Missing locale "${language}" for namespace "${namespace}"`);
        return;
      }
    });

    // If all locales exist, validate keys
    if (languages.every((language) => {
      const filePath = path.join(translationsDir, namespace, `${language}.json`);
      return fs.existsSync(filePath);
    })) {
      const baseLanguage = languages[0];
      const baseTranslations = loadNamespace(namespace, baseLanguage);

      // Check ALL languages including base language
      languages.forEach((language) => {
        const translations = loadNamespace(namespace, language);

        // Check for missing keys
        Object.keys(baseTranslations).forEach((key) => {
          if (!translations.hasOwnProperty(key)) {
            errors.push(
              `Missing key "${key.substring(0, 30)}..." in namespace "${namespace}" for locale "${language}"`
            );
          } else if (translations[key] === '') {
            errors.push(
              `Empty value for key "${key.substring(0, 30)}..." in namespace "${namespace}" for locale "${language}"`
            );
          }
        });

        // Check for extra keys (only for non-base languages)
        if (language !== baseLanguage) {
          Object.keys(translations).forEach((key) => {
            if (!baseTranslations.hasOwnProperty(key)) {
              errors.push(
                `Extra key "${key.substring(0, 30)}..." in namespace "${namespace}" for locale "${language}" (not in base locale)`
              );
            }
          });
        }
      });
    }
  });

  // Report results
  console.log('\n=== Validation Results ===\n');

  if (errors.length > 0) {
    console.error(`❌ Found ${errors.length} error(s):\n`);
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  } else {
    console.log('✅ All translations are valid and complete!\n');
  }
}

// Run validation
validateTranslations();
