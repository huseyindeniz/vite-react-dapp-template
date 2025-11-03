#!/usr/bin/env node

import { readFile } from './fileUtils.mjs';

/**
 * Parse imports from a TypeScript file
 */
export function parseImports(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return [];
  }

  const imports = [];
  const importRegex = /import\s+(?:{[^}]*}|[^"']*)\s+from\s+['"]([^'"]+)['"]/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      source: match[1],
      raw: match[0]
    });
  }

  return imports;
}

/**
 * Parse exports from a TypeScript file
 */
export function parseExports(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return [];
  }

  const exports = [];

  // Named exports: export const/function/interface/type/class/enum
  const namedExportRegex = /export\s+(const|function|interface|type|class|enum|abstract\s+class)\s+([A-Za-z0-9_]+)/g;

  let match;
  while ((match = namedExportRegex.exec(content)) !== null) {
    exports.push({
      type: match[1].replace('abstract ', 'abstract-'),
      name: match[2],
      isDefault: false
    });
  }

  // Default exports
  if (/export\s+default\s+/.test(content)) {
    exports.push({
      type: 'default',
      name: 'default',
      isDefault: true
    });
  }

  return exports;
}

/**
 * Parse interfaces from a TypeScript file
 */
export function parseInterfaces(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return [];
  }

  const interfaces = [];
  const interfaceRegex = /export\s+interface\s+([A-Za-z0-9_<>]+)(?:\s+extends\s+([A-Za-z0-9_<>,\s]+))?\s*{([^}]*)}/gs;

  let match;
  while ((match = interfaceRegex.exec(content)) !== null) {
    const name = match[1];
    const extendsClause = match[2] ? match[2].split(',').map(s => s.trim()) : [];
    const body = match[3];

    // Parse methods from interface body
    const methods = [];
    const methodRegex = /([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*:\s*([^;]+)/g;

    let methodMatch;
    while ((methodMatch = methodRegex.exec(body)) !== null) {
      methods.push({
        name: methodMatch[1],
        params: methodMatch[2].trim(),
        returnType: methodMatch[3].trim()
      });
    }

    interfaces.push({
      name,
      extends: extendsClause,
      methods,
      raw: match[0]
    });
  }

  return interfaces;
}

/**
 * Parse type aliases from a TypeScript file
 */
export function parseTypeAliases(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return [];
  }

  const types = [];
  const typeRegex = /export\s+type\s+([A-Za-z0-9_<>]+)\s*=\s*([^;]+);/g;

  let match;
  while ((match = typeRegex.exec(content)) !== null) {
    types.push({
      name: match[1],
      definition: match[2].trim(),
      raw: match[0]
    });
  }

  return types;
}

/**
 * Parse Redux actions from an actions.ts file
 */
export function parseActions(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return [];
  }

  const actions = [];

  // Look for action creator assignments
  const actionRegex = /export\s+const\s+([a-zA-Z0-9_]+)\s*=\s*(?:createAction|createAsyncThunk)/g;

  let match;
  while ((match = actionRegex.exec(content)) !== null) {
    actions.push({
      name: match[1],
      type: 'action-creator'
    });
  }

  return actions;
}

/**
 * Parse Redux slice from a slice.ts file
 */
export function parseSlice(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return null;
  }

  const slice = {
    name: null,
    initialState: null,
    reducers: [],
    exports: []
  };

  // Find slice name from createSlice call
  const sliceNameMatch = content.match(/createSlice\s*\(\s*{\s*name:\s*['"]([^'"]+)['"]/);
  if (sliceNameMatch) {
    slice.name = sliceNameMatch[1];
  }

  // Find exported reducer
  const exportReducerMatch = content.match(/export\s+const\s+([a-zA-Z0-9_]+Reducer)\s*=/);
  if (exportReducerMatch) {
    slice.exports.push(exportReducerMatch[1]);
  }

  // Find reducers in slice
  const reducersMatch = content.match(/reducers:\s*{([^}]+)}/s);
  if (reducersMatch) {
    const reducersBody = reducersMatch[1];
    const reducerRegex = /([a-zA-Z0-9_]+)\s*[:]\s*\(/g;

    let match;
    while ((match = reducerRegex.exec(reducersBody)) !== null) {
      slice.reducers.push(match[1]);
    }
  }

  return slice;
}

/**
 * Parse hooks from a hooks file
 */
export function parseHooks(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return [];
  }

  const hooks = [];

  // Find hook exports: export const useSomething or export function useSomething
  const hookRegex = /export\s+(?:const|function)\s+(use[A-Za-z0-9_]+)/g;

  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    const hookName = match[1];

    // Try to extract JSDoc comment
    const position = match.index;
    const beforeHook = content.substring(Math.max(0, position - 500), position);
    const jsdocMatch = beforeHook.match(/\/\*\*\s*\n([^*]|\*(?!\/))*\*\//);

    hooks.push({
      name: hookName,
      jsdoc: jsdocMatch ? jsdocMatch[0] : null
    });
  }

  return hooks;
}

/**
 * Parse React components from a file
 */
export function parseComponents(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return [];
  }

  const components = [];

  // Find component exports: export const MyComponent: React.FC or export function MyComponent
  const componentRegex = /export\s+(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/g;

  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    const componentName = match[1];

    // Check if it's likely a component (starts with capital letter)
    if (/^[A-Z]/.test(componentName)) {
      components.push({
        name: componentName,
        filePath
      });
    }
  }

  return components;
}

/**
 * Parse saga patterns from a saga file
 */
export function parseSagaPatterns(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return null;
  }

  const patterns = {
    takeEvery: [],
    takeLatest: [],
    takeLeading: [],
    generators: []
  };

  // Find takeEvery patterns
  const takeEveryRegex = /takeEvery\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  let match;
  while ((match = takeEveryRegex.exec(content)) !== null) {
    patterns.takeEvery.push({
      action: match[1].trim(),
      saga: match[2].trim()
    });
  }

  // Find takeLatest patterns
  const takeLatestRegex = /takeLatest\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  while ((match = takeLatestRegex.exec(content)) !== null) {
    patterns.takeLatest.push({
      action: match[1].trim(),
      saga: match[2].trim()
    });
  }

  // Find takeLeading patterns
  const takeLeadingRegex = /takeLeading\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  while ((match = takeLeadingRegex.exec(content)) !== null) {
    patterns.takeLeading.push({
      action: match[1].trim(),
      saga: match[2].trim()
    });
  }

  // Find generator functions
  const generatorRegex = /function\s*\*\s*([A-Za-z0-9_]+)/g;
  while ((match = generatorRegex.exec(content)) !== null) {
    patterns.generators.push(match[1]);
  }

  return patterns;
}

/**
 * Extract JSDoc comments from content
 */
export function extractJSDoc(content, beforePosition) {
  const before = content.substring(Math.max(0, beforePosition - 500), beforePosition);
  const jsdocMatch = before.match(/\/\*\*\s*\n([^*]|\*(?!\/))*\*\//);

  if (!jsdocMatch) {
    return null;
  }

  const jsdoc = jsdocMatch[0];

  // Parse description and tags
  const lines = jsdoc.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim());
  const description = [];
  const tags = [];

  let inDescription = true;

  for (const line of lines) {
    if (line.startsWith('@')) {
      inDescription = false;
      const [tag, ...rest] = line.split(/\s+/);
      tags.push({
        tag: tag.substring(1),
        value: rest.join(' ')
      });
    } else if (inDescription && line && line !== '/**' && line !== '*/') {
      description.push(line);
    }
  }

  return {
    raw: jsdoc,
    description: description.join(' '),
    tags
  };
}

/**
 * Check if file has specific pattern
 */
export function hasPattern(filePath, pattern) {
  const content = readFile(filePath);

  if (!content) {
    return false;
  }

  if (pattern instanceof RegExp) {
    return pattern.test(content);
  }

  return content.includes(pattern);
}

/**
 * Count lines of code (excluding comments and blank lines)
 */
export function countLinesOfCode(filePath) {
  const content = readFile(filePath);

  if (!content) {
    return 0;
  }

  const lines = content.split('\n');
  let count = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip blank lines and comment lines
    if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
      count++;
    }
  }

  return count;
}
