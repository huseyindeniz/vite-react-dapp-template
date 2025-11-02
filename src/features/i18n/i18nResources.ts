/**
 * Auto-discover and load translation files
 *
 * Structure: i18n/translations/{namespace}/{locale}.json
 *
 * Examples:
 * - i18n/translations/feature-wallet/en-US.json → namespace: 'feature-wallet', locale: 'en-US'
 * - i18n/translations/page-home/tr-TR.json → namespace: 'page-home', locale: 'tr-TR'
 */

// Import all translation files
const translationModules = import.meta.glob<Record<string, string>>(
  './translations/*/*.json',
  { eager: true, import: 'default' }
);

interface Resources {
  [locale: string]: {
    [namespace: string]: Record<string, string>;
  };
}

/**
 * Extract namespace and locale from file path
 *
 * Path format: ./translations/{namespace}/{locale}.json
 * Example: ./translations/feature-wallet/en-US.json
 *   → namespace: 'feature-wallet'
 *   → locale: 'en-US'
 */
function parseTranslationPath(filePath: string): { namespace: string; locale: string } {
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Match: ./translations/{namespace}/{locale}.json
  const match = normalizedPath.match(/\.\/translations\/([^/]+)\/([^/]+)\.json/);

  if (!match) {
    throw new Error(`Invalid translation path: ${filePath}`);
  }

  const [, namespace, locale] = match;

  return { namespace, locale };
}

// Build resources object from discovered translation files
export const resources: Resources = Object.entries(translationModules).reduce(
  (acc, [filePath, translations]) => {
    const { namespace, locale } = parseTranslationPath(filePath);

    if (!acc[locale]) {
      acc[locale] = {};
    }

    acc[locale][namespace] = translations;

    return acc;
  },
  {} as Resources
);
