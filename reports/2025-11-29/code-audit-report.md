# Code Audit Report

**Generated:** 2025-11-29T09:34:01.490Z
**Project:** vite-react-dapp-template

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Checks** | 20 |
| **Passed** | ✅ 19 |
| **Failed** | ❌ 1 |
| **Success Rate** | 95% |

## Results by Check

| Check | Status | Summary |
|-------|--------|---------|
| Import Quality | ✅ PASSED | Check output |
| Export Quality | ✅ PASSED | Index files: 0, Default exports: 0 |
| Redux Abstraction | ✅ PASSED | useDispatch: 0, RootState: 0, useSelector: 0 |
| Service Import Boundaries | ✅ PASSED | Check output |
| i18n Coverage | ✅ PASSED | Check output |
| TypeScript "any" Usage | ✅ PASSED | 0 violation(s) |
| Linter/TypeScript Suppressions | ✅ PASSED | 0 total (Critical: 0, High: 0) |
| God Files (1 Entity Per File) | ✅ PASSED | 0 file(s), 0 entities to split |
| TODO/FIXME/HACK Comments | ✅ PASSED | No markers |
| Console Usage | ✅ PASSED | No console usage |
| Redux Saga Patterns | ✅ PASSED | See details |
| Type Assertion (as const, satisfies) | ✅ PASSED | 0 assertion(s) |
| Re-export Check (No Re-exports) | ✅ PASSED | 0 file(s), 0 re-export(s) |
| Type Import Check (No "type" Keyword) | ✅ PASSED | Check output |
| Dangerous HTML (No dangerouslySetInnerHTML) | ✅ PASSED | 0 file(s), 0 violation(s) |
| React Key Patterns | ✅ PASSED | 0 file(s), Index: 0, Missing: 0 |
| Magic Numbers | ✅ PASSED | 0 file(s), 0 violation(s) |
| Magic Strings | ❌ FAILED | See details |
| TypeScript Strict Mode | ✅ PASSED | strict: true (enabled) |
| Dependency Array (useEffect/useMemo/useCallback) | ✅ PASSED | Missing: 0, Stable: 0, SideEffect: 0, Over-spec: 0, Fetch: 0 |

## Failed Checks (Detailed)

### ❌ Magic Strings

**Summary:** 

<details>
<summary>View Details</summary>

```
Magic Strings Check (Duplicate String Detection)
================================================================================

Scanning 409 source files in src/...

Duplicate Magic Strings Found
--------------------------------------------------------------------------------

Strings appearing in 2+ files should be extracted to constants/enums.

  ❌ "cached" (found in 3 files)
     src/core/features/slice-manager/hocs/withSliceCache.ts:32
       const useSagaCache = config?.cleanupStrategy === 'cached';
     src/core/features/slice-manager/SliceLifecycleManager.ts:329
       return config?.cleanupStrategy === 'cached';
     src/core/features/slice-manager/smart-fetch/shouldFetchData.ts:72
       if (config.cleanupStrategy === 'cached') {
     Suggestion: Extract to enum/constant

  ❌ "image" (found in 3 files)
     src/domain/features/ai-assistant/components/ChatComposer/ImageAttachment.tsx:16
       attachment.type === 'image' && attachment.file
     src/services/chat/DemoChatModelAdapter.ts:65
       if (response.type === 'image') {
     src/services/chat/SimpleAttachmentAdapter.ts:103
       attachment.type === 'image'
     Suggestion: Extract to enum/constant

  ❌ "error" (found in 3 files)
     src/domain/features/wallet/components/ConnectionModal/Modal/Modal.tsx:43
       color={activeStep === 0 && stepState === 'error' ? 'red' : 'blue'}
     src/domain/features/wallet/components/ConnectionModal/Modal/Modal.tsx:53
       color={activeStep === 1 && stepState === 'error' ? 'red' : 'blue'}
     src/domain/features/wallet/components/ConnectionModal/Modal/Modal.tsx:65
       color={activeStep === 2 && stepState === 'error' ? 'red' : 'blue'}
     src/domain/features/wallet/components/ConnectionModal/Modal/Modal.tsx:87
       color={activeStep === 3 && stepState === 'error' ? 'red' : 'blue'}
     src/services/chat/GoogleADKChatModelAdapter.ts:103
       } else if (event.type === 'error') {
     src/services/chat/LangGraphChatModelAdapter.ts:109
       } else if (event.type === 'error') {
     Suggestion: Extract to enum/constant

  ❌ "user" (found in 3 files)
     src/services/chat/DemoChatModelAdapter.ts:26
       .find(msg => msg.role === 'user');
     src/services/chat/DemoChatModelAdapter.ts:28
       if (!lastUserMessage || lastUserMessage.role !== 'user') {
     src/services/chat/GoogleADKChatModelAdapter.ts:28
       .find(msg => msg.role === 'user');
     src/services/chat/GoogleADKChatModelAdapter.ts:30
       if (!lastUserMessage || lastUserMessage.role !== 'user') {
     src/services/chat/LangGraphChatModelAdapter.ts:28
       .find(msg => msg.role === 'user');
     src/services/chat/LangGraphChatModelAdapter.ts:30
       if (!lastUserMessage || lastUserMessage.role !== 'user') {
     Suggestion: Extract to enum/constant

  ❌ "text" (found in 3 files)
     src/services/chat/DemoChatModelAdapter.ts:33
       .filter(part => part.type === 'text')
     src/services/chat/DemoChatModelAdapter.ts:34
       .map(part => (part.type === 'text' ? part.text : ''))
     src/services/chat/DemoChatModelAdapter.ts:44
       if (response.type === 'text') {
     src/services/chat/GoogleADKChatModelAdapter.ts:35
       .filter(part => part.type === 'text')
     src/services/chat/GoogleADKChatModelAdapter.ts:36
       .map(part => (part.type === 'text' ? part.text : ''))
     src/services/chat/LangGraphChatModelAdapter.ts:35
       .filter(part => part.type === 'text')
     src/services/chat/LangGraphChatModelAdapter.ts:36
       .map(part => (part.type === 'text' ? part.text : ''))
     Suggestion: Extract to enum/constant

  ❌ "application/pdf" (found in 2 files)
     src/domain/features/ai-assistant/components/Artifacts/FileArtifact.tsx:78
       if (mimeType === 'application/pdf') {
     src/services/chat/SimpleAttachmentAdapter.ts:66
       file.type === 'application/pdf' ||
     Suggestion: Extract to enum/constant

  ❌ "token" (found in 2 files)
     src/services/chat/GoogleADKChatModelAdapter.ts:87
       if (event.type === 'token') {
     src/services/chat/LangGraphChatModelAdapter.ts:87
       if (event.type === 'token') {
     Suggestion: Extract to enum/constant

  ❌ "end" (found in 2 files)
     src/services/chat/GoogleADKChatModelAdapter.ts:100
       } else if (event.type === 'end') {
     src/services/chat/LangGraphChatModelAdapter.ts:106
       } else if (event.type === 'end') {
     Suggestion: Extract to enum/constant

================================================================================
Summary
================================================================================

Duplicate strings: 8
Total occurrences: 31

❌ Duplicate magic strings found.

Why this matters:
  - Same string in multiple files = typo risk
  - No type safety or autocomplete
  - Refactoring requires finding all occurrences
  - Extract to enum/constant for safety

The Rule:
  - ❌ status === "success" (in multiple files)
  - ✅ enum Status { SUCCESS = "success" }
  - ✅ status === Status.SUCCESS

  - ❌ fetch("/api/users") (in multiple files)
  - ✅ const API_USERS = "/api/users";
  - ✅ fetch(API_USERS)
```

</details>

---

## Passed Checks

- ✅ **Import Quality** - Check output
- ✅ **Export Quality** - Index files: 0, Default exports: 0
- ✅ **Redux Abstraction** - useDispatch: 0, RootState: 0, useSelector: 0
- ✅ **Service Import Boundaries** - Check output
- ✅ **i18n Coverage** - Check output
- ✅ **TypeScript "any" Usage** - 0 violation(s)
- ✅ **Linter/TypeScript Suppressions** - 0 total (Critical: 0, High: 0)
- ✅ **God Files (1 Entity Per File)** - 0 file(s), 0 entities to split
- ✅ **TODO/FIXME/HACK Comments** - No markers
- ✅ **Console Usage** - No console usage
- ✅ **Redux Saga Patterns** - No violations found
- ✅ **Type Assertion (as const, satisfies)** - 0 assertion(s)
- ✅ **Re-export Check (No Re-exports)** - 0 file(s), 0 re-export(s)
- ✅ **Type Import Check (No "type" Keyword)** - Check output
- ✅ **Dangerous HTML (No dangerouslySetInnerHTML)** - 0 file(s), 0 violation(s)
- ✅ **React Key Patterns** - 0 file(s), Index: 0, Missing: 0
- ✅ **Magic Numbers** - 0 file(s), 0 violation(s)
- ✅ **TypeScript Strict Mode** - strict: true (enabled)
- ✅ **Dependency Array (useEffect/useMemo/useCallback)** - Missing: 0, Stable: 0, SideEffect: 0, Over-spec: 0, Fetch: 0

## Recommendations

### Priority Actions

1. **Magic Strings**: 
   - Run: `node ./.claude/skills/code-audit/scripts/magic_strings.mjs`
   - See detailed output above for specific violations

## Next Steps

1. Address failed checks in priority order
2. Run individual check scripts for detailed violation analysis
3. Re-run `code-audit` after fixes to verify improvements
4. Consider running `arch-audit` for architecture-level checks

---

*Generated by code-audit skill*
