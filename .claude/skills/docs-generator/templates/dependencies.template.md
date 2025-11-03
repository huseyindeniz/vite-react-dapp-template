# Dependency Analysis and Recommendations

**Generated:** {{generatedDate}}
**Version:** {{version}}

## Executive Summary

- **Total Dependencies**: {{totalDeps}} ({{prodCount}} production, {{devCount}} development)
- **Up-to-date**: {{upToDateCount}} ✅
- **Outdated**: {{outdatedCount}} ⚠️
- **Unknown**: {{unknownCount}} ❓

## Production Dependencies Analysis

### Core Framework Dependencies

#### React Ecosystem

```json
{
{{#reactEcosystem}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/reactEcosystem}}
}
```

**Status**: {{reactStatus}}

#### State Management

```json
{
{{#stateManagement}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/stateManagement}}
}
```

**Status**: {{stateStatus}}

#### UI Framework

```json
{
{{#uiFramework}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/uiFramework}}
}
```

**Status**: {{uiStatus}}

#### Web3 Integration

```json
{
{{#web3}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/web3}}
}
```

**Status**: {{web3Status}}

#### Internationalization

```json
{
{{#i18n}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/i18n}}
}
```

**Status**: {{i18nStatus}}

#### Utilities

```json
{
{{#utilities}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/utilities}}
}
```

**Status**: {{utilitiesStatus}}

## Development Dependencies Analysis

### Build Tools

```json
{
{{#buildTools}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/buildTools}}
}
```

**Status**: {{buildToolsStatus}}

### TypeScript

```json
{
{{#typescript}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/typescript}}
}
```

**Status**: {{typescriptStatus}}

### Testing

```json
{
{{#testing}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/testing}}
}
```

**Status**: {{testingStatus}}

### Code Quality

```json
{
{{#codeQuality}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/codeQuality}}
}
```

**Status**: {{codeQualityStatus}}

### Documentation

```json
{
{{#documentation}}
  "{{name}}": "{{current}}"{{#latest}}, // {{status}} {{#latestVersion}}Latest: {{latestVersion}}{{/latestVersion}}{{/latest}}
{{/documentation}}
}
```

**Status**: {{documentationStatus}}

## Dependency Categories

{{#categories}}
### {{categoryName}} ({{count}} packages)

| Package | Current | Latest | Status |
|---------|---------|--------|--------|
{{#packages}}
| {{name}} | {{current}} | {{latest}} | {{statusIcon}} {{status}} |
{{/packages}}

{{/categories}}

## Outdated Dependencies

{{#hasOutdated}}
### Production Dependencies

{{#outdatedProd}}
#### {{name}}

- **Current**: {{current}}
- **Latest**: {{latest}}
- **Category**: {{category}}
- **Update Command**: `npm install {{name}}@{{latest}}`

{{/outdatedProd}}

### Development Dependencies

{{#outdatedDev}}
#### {{name}}

- **Current**: {{current}}
- **Latest**: {{latest}}
- **Category**: {{category}}
- **Update Command**: `npm install -D {{name}}@{{latest}}`

{{/outdatedDev}}

{{/hasOutdated}}

{{^hasOutdated}}
## ✅ All Dependencies Up-to-Date

All production and development dependencies are using the latest stable versions!

{{/hasOutdated}}

## Recommendations

### High Priority

{{#highPriorityUpdates}}
- **{{name}}**: Update from {{current}} to {{latest}}
  - Reason: {{reason}}
  - Breaking Changes: {{breakingChanges}}
{{/highPriorityUpdates}}

{{^highPriorityUpdates}}
✅ No high-priority updates required
{{/highPriorityUpdates}}

### Medium Priority

{{#mediumPriorityUpdates}}
- **{{name}}**: Update from {{current}} to {{latest}}
  - Reason: {{reason}}
{{/mediumPriorityUpdates}}

{{^mediumPriorityUpdates}}
✅ No medium-priority updates required
{{/mediumPriorityUpdates}}

### Low Priority

{{#lowPriorityUpdates}}
- **{{name}}**: Update from {{current}} to {{latest}}
  - Reason: {{reason}}
{{/lowPriorityUpdates}}

{{^lowPriorityUpdates}}
✅ No low-priority updates required
{{/lowPriorityUpdates}}

## Security Considerations

### Audit Recommendations

Run regular security audits:

```bash
npm audit                  # Check for vulnerabilities
npm audit fix              # Auto-fix vulnerabilities
npm audit fix --force      # Force fix (may have breaking changes)
```

### Known Vulnerabilities

{{#vulnerabilities}}
- **{{package}}** ({{severity}}): {{description}}
  - Fix: {{fix}}
{{/vulnerabilities}}

{{^vulnerabilities}}
✅ No known vulnerabilities detected
{{/vulnerabilities}}

## Dependency Management Strategy

### Update Policy

1. **Patch Updates** (x.y.Z): Apply immediately
   - Bug fixes and security patches
   - No breaking changes

2. **Minor Updates** (x.Y.z): Review and apply monthly
   - New features (backward compatible)
   - Minimal risk

3. **Major Updates** (X.y.z): Plan and test thoroughly
   - Breaking changes expected
   - Requires migration planning

### Testing Before Updates

Always run before committing updates:

```bash
npm run lint               # Linting check
npm run type-check         # TypeScript check
npm run test               # Unit tests
npm run build              # Production build
```

---

*Generated by docs-generator skill on {{generatedDate}}*
