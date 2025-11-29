#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root (4 levels up from script location)
const projectRoot = path.resolve(__dirname, '../../../..');
const srcDir = path.join(projectRoot, 'src');

// Valid file extensions to scan
const validExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// Known stable values that should NOT be in dependency arrays
// These are guaranteed by React/libraries to have stable references
const STABLE_VALUES = [
  // React useState setters (pattern: setXxx)
  /^set[A-Z]/,
  // React useReducer dispatch
  'dispatch',
  // React Router
  'navigate',
  // i18next - t function is stable
  't',
  // Redux dispatch
  'dispatch',
  // Common stable hook returns
  'pageLink',
  'homeRoute',
  'pageRoutes',
  // Action dispatchers from our pattern
  'actions',
  // Refs
  /Ref$/,
];

// Hooks that use dependency arrays
const HOOKS_WITH_DEPS = [
  'useEffect',
  'useLayoutEffect',
  'useCallback',
  'useMemo',
  'useInsertionEffect',
];

// Known reactive values that SHOULD be in dependency arrays when used
// These are values that can change between renders
// Be specific to avoid false positives
const REACTIVE_PATTERNS = [
  // i18n - language can change (most important!)
  /i18n\.resolvedLanguage/,
  /i18n\.language/,
  // Props patterns (accessing props object)
  /props\.\w+/,
];

/**
 * Normalize path for consistent comparison (forward slashes)
 */
function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * Check if a file should be excluded
 */
function shouldExcludeFile(filePath) {
  const basename = path.basename(filePath);
  const normalizedPath = normalizePath(path.relative(projectRoot, filePath));

  // Exclude test files
  if (basename.includes('.test.') || basename.includes('.spec.')) {
    return true;
  }

  // Exclude Storybook files
  if (basename.includes('.stories.')) {
    return true;
  }

  // Exclude test-utils directory
  if (normalizedPath.startsWith('src/test-utils/')) {
    return true;
  }

  return false;
}

/**
 * Check if a value is known to be stable
 */
function isStableValue(value) {
  const trimmed = value.trim();

  for (const pattern of STABLE_VALUES) {
    if (pattern instanceof RegExp) {
      if (pattern.test(trimmed)) {
        return true;
      }
    } else if (trimmed === pattern) {
      return true;
    }
  }

  return false;
}

/**
 * Find reactive values used in effect body that might be missing from deps
 */
function findReactiveValuesInBody(effectBody) {
  const found = [];

  for (const pattern of REACTIVE_PATTERNS) {
    const matches = effectBody.match(new RegExp(pattern.source, 'g'));
    if (matches) {
      found.push(...matches);
    }
  }

  // Remove duplicates
  return [...new Set(found)];
}

/**
 * Extract effect body from hook call
 */
function extractEffectBody(content, hookStartIndex) {
  let depth = 0;
  let bodyStart = -1;
  let bodyEnd = -1;
  let inString = false;
  let stringChar = '';

  for (let i = hookStartIndex; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : '';

    // Handle string detection
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      if (bodyStart === -1) {
        bodyStart = i;
      }
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && bodyStart !== -1) {
        bodyEnd = i;
        break;
      }
    }
  }

  if (bodyStart === -1 || bodyEnd === -1) {
    return null;
  }

  return content.substring(bodyStart, bodyEnd + 1);
}

/**
 * Extract dependency array from a hook call
 * Pattern: }, [...]) - callback closes with }, then comma, then dep array, then )
 * Returns { deps: string[], startLine: number } or null
 */
function extractDependencyArray(content, hookMatch, startIndex) {
  // Find the hook call boundaries first
  let depth = 0;
  let hookEnd = -1;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '(') depth++;
    else if (char === ')') {
      depth--;
      if (depth === 0) {
        hookEnd = i;
        break;
      }
    }
  }

  if (hookEnd === -1) return null;

  // Get the full hook call
  const hookCall = content.substring(startIndex, hookEnd + 1);

  // Pattern: }, [...]) at the end - the dep array pattern
  // Match: }, followed by whitespace, then [...], then whitespace, then )
  const depArrayPattern = /\}\s*,\s*\[([^\]]*)\]\s*\)\s*$/;
  const match = hookCall.match(depArrayPattern);

  if (!match) return null;

  const arrayContent = match[1];

  // Parse the dependencies
  const deps = arrayContent
    .split(',')
    .map(d => d.trim())
    .filter(d => d.length > 0 && d !== '');

  // Calculate line number - find where the [ starts in the original content
  const arrayStartInHook = hookCall.lastIndexOf('[');
  const arrayStartInContent = startIndex + arrayStartInHook;
  const beforeArray = content.substring(0, arrayStartInContent);
  const startLine = (beforeArray.match(/\n/g) || []).length + 1;

  return {
    deps,
    startLine,
    raw: `[${arrayContent}]`,
  };
}

/**
 * Find dependency array issues in content
 */
function findDepArrayIssues(content, filePath) {
  const lines = content.split('\n');
  const violations = [];

  // Find all hook calls with dependency arrays
  for (const hookName of HOOKS_WITH_DEPS) {
    // Pattern to find hook calls
    const hookPattern = new RegExp(`${hookName}\\s*\\(`, 'g');
    let match;

    while ((match = hookPattern.exec(content)) !== null) {
      const hookStart = match.index;
      const depArray = extractDependencyArray(content, match[0], hookStart);

      if (!depArray) continue;

      const { deps, startLine, raw } = depArray;

      // Extract effect body for reactive value analysis
      const effectBody = extractEffectBody(content, hookStart);

      // Check 1: Missing dependencies (empty array but reactive values used)
      if (deps.length === 0 && effectBody) {
        const reactiveValuesUsed = findReactiveValuesInBody(effectBody);

        if (reactiveValuesUsed.length > 0) {
          violations.push({
            line: startLine,
            hook: hookName,
            type: 'missing-deps',
            deps: raw,
            reactiveValues: reactiveValuesUsed,
            message: `Empty [] but reactive values used: ${reactiveValuesUsed.join(', ')}`,
            suggestion: `Add reactive values to dependency array or use useEffectEvent for non-reactive logic`,
            severity: 'high',
          });
        }
      }

      // Check 2: Stable values in dependency array
      const stableViolations = deps.filter(dep => isStableValue(dep));

      if (stableViolations.length > 0) {
        violations.push({
          line: startLine,
          hook: hookName,
          type: 'stable-values',
          deps: raw,
          stableValues: stableViolations,
          message: `Stable values in dep array: ${stableViolations.join(', ')}`,
          suggestion: `Remove stable values - they never change between renders`,
          severity: 'high',
        });
      }

      // Check 3: Too many dependencies (4+ is suspicious)
      if (deps.length >= 4) {
        violations.push({
          line: startLine,
          hook: hookName,
          type: 'too-many-deps',
          deps: raw,
          count: deps.length,
          message: `${deps.length} dependencies - may indicate over-specification`,
          suggestion: `Review if all deps truly need to trigger re-runs. Consider extracting logic or using useReducer`,
          severity: 'warning',
        });
      }
    }
  }

  return violations;
}

// Patterns for direct API calls (NOT saga triggers like actions.fetch)
// Note: We only check for explicit fetch/axios - NOT .get()/.post() which have too many false positives
// (e.g., searchParams.get('code'), Map.get(), etc.)
const DIRECT_FETCH_PATTERNS = [
  /\bfetch\s*\(/,           // fetch()
  /\baxios\s*\./,           // axios.get, axios.post, etc.
  /\baxios\s*\(/,           // axios()
];

/**
 * Check for direct fetch/axios calls in useEffect (separate check)
 * This catches all direct API calls, not just empty array ones
 */
function findDirectFetchInEffect(content) {
  const violations = [];

  // Find useEffect calls
  const useEffectPattern = /useEffect\s*\(/g;
  let match;

  while ((match = useEffectPattern.exec(content)) !== null) {
    const hookStart = match.index;
    const effectBody = extractEffectBody(content, hookStart);

    if (!effectBody) continue;

    // Check if effect body contains direct fetch patterns
    for (const pattern of DIRECT_FETCH_PATTERNS) {
      if (pattern.test(effectBody)) {
        // Calculate line number
        const beforeMatch = content.substring(0, hookStart);
        const line = (beforeMatch.match(/\n/g) || []).length + 1;

        violations.push({
          line,
          hook: 'useEffect',
          type: 'direct-fetch',
          message: 'Direct data fetching in useEffect',
          suggestion: 'Consider using React Query, SWR, or Redux Saga for data fetching',
          severity: 'info',
        });

        // Only report once per useEffect
        break;
      }
    }
  }

  return violations;
}

/**
 * Check for side effects in useMemo/useCallback (architectural violation)
 * These hooks should NEVER contain side effects
 */
function findSideEffectsInMemoHooks(content) {
  const violations = [];

  // Hooks that should NOT have side effects
  const MEMO_HOOKS = ['useMemo', 'useCallback'];

  for (const hookName of MEMO_HOOKS) {
    const hookPattern = new RegExp(`${hookName}\\s*\\(`, 'g');
    let match;

    while ((match = hookPattern.exec(content)) !== null) {
      const hookStart = match.index;
      const hookBody = extractEffectBody(content, hookStart);

      if (!hookBody) continue;

      // Check for side effects
      for (const pattern of DIRECT_FETCH_PATTERNS) {
        if (pattern.test(hookBody)) {
          const beforeMatch = content.substring(0, hookStart);
          const line = (beforeMatch.match(/\n/g) || []).length + 1;

          violations.push({
            line,
            hook: hookName,
            type: 'side-effect-in-memo',
            message: `Side effect (fetch/API call) in ${hookName}`,
            suggestion: `${hookName} should be pure. Move side effects to useEffect or Redux Saga`,
            severity: 'high',
          });

          break;
        }
      }

      // Also check for console.log, localStorage, etc.
      const OTHER_SIDE_EFFECTS = [
        /console\.(log|warn|error|info)\s*\(/,
        /localStorage\./,
        /sessionStorage\./,
        /document\./,
        /window\.location/,
      ];

      for (const pattern of OTHER_SIDE_EFFECTS) {
        if (pattern.test(hookBody)) {
          const beforeMatch = content.substring(0, hookStart);
          const line = (beforeMatch.match(/\n/g) || []).length + 1;

          violations.push({
            line,
            hook: hookName,
            type: 'side-effect-in-memo',
            message: `Side effect in ${hookName}`,
            suggestion: `${hookName} should be pure. Move side effects to useEffect`,
            severity: 'warning',
          });

          break;
        }
      }
    }
  }

  return violations;
}

/**
 * Get all source files in a directory recursively
 */
function getSourceFiles(dir) {
  let results = [];

  try {
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (file === 'node_modules') {
          continue;
        }
        results = results.concat(getSourceFiles(filePath));
      } else {
        const ext = path.extname(file);
        if (validExtensions.includes(ext)) {
          results.push(filePath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return results;
}

/**
 * Main check function
 */
function checkDepArrays() {
  console.log('Dependency Array Check (useEffect/useCallback/useMemo)');
  console.log('='.repeat(80));
  console.log('');

  const files = getSourceFiles(srcDir);
  console.log(`Scanning ${files.length} source files in src/...`);
  console.log('');

  const allViolations = [];
  let missingCount = 0;
  let stableCount = 0;
  let tooManyCount = 0;
  let fetchCount = 0;
  let sideEffectCount = 0;

  for (const file of files) {
    if (shouldExcludeFile(file)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const fileViolations = findDepArrayIssues(content, file);

    // Also check for direct fetch in useEffect
    const fetchViolations = findDirectFetchInEffect(content);
    fileViolations.push(...fetchViolations);

    // Check for side effects in useMemo/useCallback
    const sideEffectViolations = findSideEffectsInMemoHooks(content);
    fileViolations.push(...sideEffectViolations);

    if (fileViolations.length > 0) {
      allViolations.push({
        file,
        violations: fileViolations,
      });

      for (const v of fileViolations) {
        if (v.type === 'missing-deps') missingCount++;
        if (v.type === 'stable-values') stableCount++;
        if (v.type === 'too-many-deps') tooManyCount++;
        if (v.type === 'direct-fetch') fetchCount++;
        if (v.type === 'side-effect-in-memo') sideEffectCount++;
      }
    }
  }

  if (allViolations.length === 0) {
    console.log('✅ No dependency array issues found!\n');
    console.log('='.repeat(80));
    console.log('Summary');
    console.log('='.repeat(80));
    console.log('');
    console.log('Missing dependencies: 0');
    console.log('Stable values in deps: 0');
    console.log('Side effects in useMemo/useCallback: 0');
    console.log('Over-specified arrays (4+ deps): 0');
    console.log('Direct fetch in useEffect: 0');
    console.log('');
    console.log('✅ All dependency array checks passed!');
    return true;
  }

  // Missing dependencies (empty array with reactive values)
  const missingDepsViolations = allViolations.filter(v =>
    v.violations.some(x => x.type === 'missing-deps')
  );

  if (missingDepsViolations.length > 0) {
    console.log('❌ HIGH: Missing Dependencies (Stale Closure Risk)');
    console.log('-'.repeat(80));
    console.log('');
    console.log('Empty [] but reactive values are used inside - will cause stale closures:');
    console.log('');

    for (const { file, violations } of missingDepsViolations) {
      const missing = violations.filter(v => v.type === 'missing-deps');
      if (missing.length === 0) continue;

      const relativePath = normalizePath(path.relative(projectRoot, file));

      for (const v of missing) {
        console.log(`  ❌ ${relativePath}:${v.line}`);
        console.log(`     ${v.hook}(..., ${v.deps})`);
        console.log(`     Reactive values used: ${v.reactiveValues.join(', ')}`);
        console.log(`     Fix: Add to dep array OR use useEffectEvent for non-reactive logic`);
        console.log('');
      }
    }
  }

  // Stable values in dependency array
  const stableViolationsFiles = allViolations.filter(v =>
    v.violations.some(x => x.type === 'stable-values')
  );

  if (stableViolationsFiles.length > 0) {
    console.log('❌ HIGH: Stable Values in Dependency Arrays');
    console.log('-'.repeat(80));
    console.log('');
    console.log('These values are guaranteed stable and should NOT be in dep arrays:');
    console.log('');

    for (const { file, violations } of stableViolationsFiles) {
      const stableViolations = violations.filter(v => v.type === 'stable-values');
      if (stableViolations.length === 0) continue;

      const relativePath = normalizePath(path.relative(projectRoot, file));

      for (const v of stableViolations) {
        console.log(`  ❌ ${relativePath}:${v.line}`);
        console.log(`     ${v.hook}(..., ${v.deps})`);
        console.log(`     Stable values: ${v.stableValues.join(', ')}`);
        console.log(`     Fix: Remove ${v.stableValues.join(', ')} from dependency array`);
        console.log('');
      }
    }
  }

  // Side effects in useMemo/useCallback
  const sideEffectViolationsFiles = allViolations.filter(v =>
    v.violations.some(x => x.type === 'side-effect-in-memo')
  );

  if (sideEffectViolationsFiles.length > 0) {
    console.log('❌ HIGH: Side Effects in useMemo/useCallback');
    console.log('-'.repeat(80));
    console.log('');
    console.log('useMemo and useCallback must be PURE - no side effects allowed:');
    console.log('');

    for (const { file, violations } of sideEffectViolationsFiles) {
      const sideEffects = violations.filter(v => v.type === 'side-effect-in-memo');
      if (sideEffects.length === 0) continue;

      const relativePath = normalizePath(path.relative(projectRoot, file));

      for (const v of sideEffects) {
        console.log(`  ❌ ${relativePath}:${v.line}`);
        console.log(`     ${v.hook}: ${v.message}`);
        console.log(`     Fix: ${v.suggestion}`);
        console.log('');
      }
    }
  }

  // Warning: Too many deps
  const warnings = allViolations.filter(v =>
    v.violations.some(x => x.type === 'too-many-deps')
  );

  if (warnings.length > 0) {
    console.log('⚠️  WARNING: Over-specified Dependency Arrays (4+ items)');
    console.log('-'.repeat(80));
    console.log('');

    for (const { file, violations } of warnings) {
      const tooManyViolations = violations.filter(v => v.type === 'too-many-deps');
      if (tooManyViolations.length === 0) continue;

      const relativePath = normalizePath(path.relative(projectRoot, file));

      for (const v of tooManyViolations) {
        console.log(`  ⚠️  ${relativePath}:${v.line}`);
        console.log(`     ${v.hook}(..., ${v.deps})`);
        console.log(`     ${v.count} dependencies - review if all are necessary`);
        console.log('');
      }
    }
  }

  // Info: Direct fetch in useEffect
  const infos = allViolations.filter(v =>
    v.violations.some(x => x.type === 'direct-fetch')
  );

  if (infos.length > 0) {
    console.log('ℹ️  INFO: Direct Data Fetching in useEffect');
    console.log('-'.repeat(80));
    console.log('');
    console.log('Direct fetch/axios calls detected. Consider data fetching libraries:');
    console.log('');

    for (const { file, violations } of infos) {
      const fetchViolations = violations.filter(v => v.type === 'direct-fetch');
      if (fetchViolations.length === 0) continue;

      const relativePath = normalizePath(path.relative(projectRoot, file));

      for (const v of fetchViolations) {
        console.log(`  ℹ️  ${relativePath}:${v.line}`);
        console.log(`     Consider: React Query, SWR, or Redux Saga for data fetching`);
        console.log('');
      }
    }

    console.log('  Why avoid direct fetch in useEffect?');
    console.log('  - No automatic caching or deduplication');
    console.log('  - Race conditions on fast navigation');
    console.log('  - No automatic retry on failure');
    console.log('  - Manual loading/error state management');
    console.log('  - No SSR/SSG support');
    console.log('');
    console.log('  Note: actions.fetchX() via Redux Saga is OK - it triggers saga, not direct API call');
    console.log('');
  }

  console.log('='.repeat(80));
  console.log('Summary');
  console.log('='.repeat(80));
  console.log('');
  console.log(`Missing dependencies: ${missingCount} (HIGH - stale closure risk)`);
  console.log(`Stable values in deps: ${stableCount} (HIGH - unnecessary)`);
  console.log(`Side effects in memo hooks: ${sideEffectCount} (HIGH - purity violation)`);
  console.log(`Over-specified arrays: ${tooManyCount} (WARNING - review)`);
  console.log(`Direct fetch in useEffect: ${fetchCount} (INFO - consider alternatives)`);
  console.log('');

  // Any issue (HIGH, WARNING, or INFO) should fail the check
  const hasIssues = missingCount > 0 || stableCount > 0 || sideEffectCount > 0 || tooManyCount > 0 || fetchCount > 0;

  if (hasIssues) {
    console.log('❌ Dependency array issues found.');
    console.log('');

    if (stableCount > 0) {
      console.log('Why stable values in dep arrays are bad:');
      console.log('  - They NEVER change, so they NEVER trigger re-runs');
      console.log('  - Adding them increases complexity exponentially');
      console.log('  - More deps = more potential false-positive re-runs');
      console.log('  - Clutters the dependency array with noise');
      console.log('');
      console.log('Known stable values (guaranteed by React/libraries):');
      console.log('  - useState setters: setX, setState, etc.');
      console.log('  - useReducer dispatch');
      console.log('  - useNavigate() from react-router');
      console.log('  - t from useTranslation (i18next)');
      console.log('  - Redux dispatch');
      console.log('  - Refs (useRef)');
      console.log('');
      console.log('The Rule:');
      console.log('  - ❌ }, [isAuthenticated, navigate, t, dispatch]);');
      console.log('  - ✅ }, [isAuthenticated]);');
      console.log('');
    }

    if (tooManyCount > 0) {
      console.log('Why 4+ dependencies is a warning:');
      console.log('  - Each dependency multiplies potential re-run triggers');
      console.log('  - Complex dependency arrays are hard to reason about');
      console.log('  - Often indicates the effect does too much');
      console.log('  - Consider splitting into multiple smaller effects');
      console.log('');
    }

    return false;
  }

  console.log('✅ No dependency array issues found.');
  return true;
}

// Run the check
const passed = checkDepArrays();
process.exit(passed ? 0 : 1);
