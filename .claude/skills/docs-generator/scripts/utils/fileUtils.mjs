#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the project root directory
 */
export function getProjectRoot() {
  return process.cwd();
}

/**
 * Get all features in src/features/
 */
export function getAllFeatures() {
  const featuresDir = path.join(getProjectRoot(), 'src', 'features');

  if (!fs.existsSync(featuresDir)) {
    return [];
  }

  return fs.readdirSync(featuresDir)
    .filter(item => {
      const itemPath = path.join(featuresDir, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .sort();
}

/**
 * Get core features (infrastructure)
 */
export function getCoreFeatures() {
  return ['app', 'auth', 'i18n', 'router', 'slice-manager', 'ui'];
}

/**
 * Get domain features (business logic)
 */
export function getDomainFeatures() {
  const allFeatures = getAllFeatures();
  const coreFeatures = getCoreFeatures();
  return allFeatures.filter(f => !coreFeatures.includes(f));
}

/**
 * Check if a feature exists
 */
export function featureExists(featureName) {
  const featurePath = path.join(getProjectRoot(), 'src', 'features', featureName);
  return fs.existsSync(featurePath);
}

/**
 * Get feature path
 */
export function getFeaturePath(featureName) {
  return path.join(getProjectRoot(), 'src', 'features', featureName);
}

/**
 * Check if feature is core (infrastructure)
 */
export function isCoreFeature(featureName) {
  return getCoreFeatures().includes(featureName);
}

/**
 * Check if feature is domain (business logic)
 */
export function isDomainFeature(featureName) {
  return !isCoreFeature(featureName) && featureExists(featureName);
}

/**
 * Get feature structure (directory tree)
 */
export function getFeatureStructure(featureName) {
  const featurePath = getFeaturePath(featureName);

  if (!fs.existsSync(featurePath)) {
    return null;
  }

  const structure = {
    name: featureName,
    path: featurePath,
    directories: [],
    files: []
  };

  const scan = (dir, relative = '') => {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const relativePath = path.join(relative, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        structure.directories.push(relativePath);
        scan(itemPath, relativePath);
      } else {
        structure.files.push(relativePath);
      }
    }
  };

  scan(featurePath);

  return structure;
}

/**
 * Get models in a feature (for domain features)
 */
export function getFeatureModels(featureName) {
  const modelsPath = path.join(getFeaturePath(featureName), 'models');

  if (!fs.existsSync(modelsPath)) {
    return [];
  }

  return fs.readdirSync(modelsPath)
    .filter(item => {
      const itemPath = path.join(modelsPath, item);
      return fs.statSync(itemPath).isDirectory();
    })
    .sort();
}

/**
 * Get all TypeScript files in a directory
 */
export function getTypeScriptFiles(dir, recursive = true) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const scan = (currentDir) => {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory() && recursive) {
        scan(itemPath);
      } else if (stat.isFile() && /\.(ts|tsx)$/.test(item)) {
        files.push(itemPath);
      }
    }
  };

  scan(dir);

  return files;
}

/**
 * Read file content
 */
export function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Write file content
 */
export function writeFile(filePath, content) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Get output directory for documentation (date-based)
 */
export function getDocsOutputDir() {
  const date = new Date();
  const timestamp = date.toISOString().slice(0, 10); // YYYY-MM-DD
  return process.env.DOCS_DIR || path.join(getProjectRoot(), 'docs', timestamp);
}

/**
 * Ensure output directory exists
 */
export function ensureDocsOutputDir() {
  const outputDir = getDocsOutputDir();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return outputDir;
}

/**
 * Get relative path from project root
 */
export function getRelativePath(absolutePath) {
  return path.relative(getProjectRoot(), absolutePath);
}

/**
 * Check if file exists
 */
export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Get file extension
 */
export function getFileExtension(filePath) {
  return path.extname(filePath);
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Generate directory tree structure (for documentation)
 */
export function generateDirectoryTree(dir, prefix = '', maxDepth = 5, currentDepth = 0) {
  if (currentDepth >= maxDepth || !fs.existsSync(dir)) {
    return '';
  }

  let output = '';
  const items = fs.readdirSync(dir).sort();

  items.forEach((item, index) => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    const isLast = index === items.length - 1;
    const connector = isLast ? '└──' : '├──';
    const newPrefix = prefix + (isLast ? '    ' : '│   ');

    output += `${prefix}${connector} ${item}`;

    if (stat.isDirectory()) {
      output += '/\n';
      output += generateDirectoryTree(itemPath, newPrefix, maxDepth, currentDepth + 1);
    } else {
      output += '\n';
    }
  });

  return output;
}
