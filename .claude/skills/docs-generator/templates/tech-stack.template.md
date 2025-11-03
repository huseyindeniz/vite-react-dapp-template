# Technology Stack Analysis

**Generated:** {{generatedDate}}
**Version:** {{version}}

## Core Technologies

### Build System & Development

| Technology     | Version          | Purpose                          | Configuration    |
| -------------- | ---------------- | -------------------------------- | ---------------- |
| **Vite**       | {{viteVersion}}  | Fast dev server and build tool   | `vite.config.ts` |
| **TypeScript** | {{tsVersion}}    | Type safety and DX               | `tsconfig.json`  |
| **Node.js**    | {{nodeVersion}}  | Runtime environment              | volta/engines    |
| **npm**        | {{npmVersion}}   | Package manager                  | package-lock.json|

### Frontend Framework

| Technology           | Version            | Purpose             | Notes                       |
| -------------------- | ------------------ | ------------------- | --------------------------- |
| **React**            | {{reactVersion}}   | Core UI framework   | Latest with Concurrent mode |
| **React DOM**        | {{reactDomVersion}}| DOM rendering       | Server-side rendering ready |
| **React Router DOM** | {{routerVersion}}  | Client-side routing | Latest v7 with improvements |

### State Management

| Technology        | Version               | Purpose                | Pattern                     |
| ----------------- | --------------------- | ---------------------- | --------------------------- |
| **Redux Toolkit** | {{reduxVersion}}      | State management       | Modern Redux, less code     |
| **React Redux**   | {{reactReduxVersion}} | React-Redux bindings   | Hooks-based API             |
| **Redux Saga**    | {{sagaVersion}}       | Side effect management | Generator-based async flow  |
| **Immer**         | Built-in RTK          | Immutable updates      | Automatic immutable updates |

### UI Framework

| Technology                | Version               | Purpose             | Migration Notes                   |
| ------------------------- | --------------------- | ------------------- | --------------------------------- |
| **Mantine Core**          | {{mantineVersion}}    | Component library   | Modern, accessible components     |
| **Mantine Hooks**         | {{mantineVersion}}    | Utility hooks       | Form handling, utilities          |
| **Mantine Notifications** | {{mantineVersion}}    | Notification system | Toast notifications and alerts    |
| **React Icons**           | {{iconsVersion}}      | Icon library        | Comprehensive icon set            |

### Web3 Integration

| Technology            | Version           | Purpose                | Configuration        |
| --------------------- | ----------------- | ---------------------- | -------------------- |
| **Ethers.js**         | {{ethersVersion}} | Blockchain interaction | Configurable support |
| **MetaMask Jazzicon** | {{jazziconVersion}}| Avatar generation     | Wallet visualization |

### Internationalization

| Technology                           | Version          | Purpose             | Features                  |
| ------------------------------------ | ---------------- | ------------------- | ------------------------- |
| **i18next**                          | {{i18nVersion}}  | Core i18n framework | Namespace, interpolation  |
| **react-i18next**                    | {{reactI18nVersion}}| React integration| Hook-based API, Suspense  |
| **i18next-browser-languagedetector** | {{detectorVersion}} | Language detection | Browser language detect |
| **i18next-parser**                   | {{parserVersion}}| Translation extract | CLI tool for keys         |

### Testing Stack

| Technology                      | Version             | Purpose               | Configuration      |
| ------------------------------- | ------------------- | --------------------- | ------------------ |
| **Vitest**                      | {{vitestVersion}}   | Test runner           | `vitest.config.ts` |
| **@testing-library/react**      | {{rtlVersion}}      | Component testing     | React utilities    |
| **@testing-library/jest-dom**   | {{jestDomVersion}}  | DOM matchers          | Extended matchers  |
| **@testing-library/user-event** | {{userEventVersion}}| User interactions     | Realistic events   |
| **jsdom**                       | {{jsdomVersion}}    | DOM environment       | Browser simulation |
| **@vitest/coverage-v8**         | {{coverageVersion}} | Code coverage         | V8 coverage        |

### Development Tools

| Technology            | Version           | Purpose         | Configuration       |
| --------------------- | ----------------- | --------------- | ------------------- |
| **ESLint**            | {{eslintVersion}} | Code linting    | `eslint.config.mjs` |
| **Prettier**          | {{prettierVersion}}| Code formatting | `.prettierrc`       |
| **Husky**             | {{huskyVersion}}  | Git hooks       | `.husky/` directory |
| **TypeScript ESLint** | {{tsEslintVersion}}| TS linting     | Strict checking     |

### Documentation & Visual Testing

| Technology           | Version              | Purpose                  | Configuration |
| -------------------- | -------------------- | ------------------------ | ------------- |
| **Storybook**        | {{storybookVersion}} | Component documentation  | `.storybook/` |
| **Storybook React**  | {{storybookVersion}} | React integration        | Component stories |
| **Storybook Addons** | Various              | Enhanced functionality   | a11y, interactions |

## Technology Categories

{{#categories}}
### {{categoryName}}

{{#packages}}
- **{{name}}** ({{version}}){{#purpose}} - {{purpose}}{{/purpose}}
{{/packages}}

{{/categories}}

## Version Status

### Production Dependencies

- **Total**: {{prodTotal}}
- **Up-to-date**: {{prodUpToDate}} ✅
- **Outdated**: {{prodOutdated}} ⚠️

### Development Dependencies

- **Total**: {{devTotal}}
- **Up-to-date**: {{devUpToDate}} ✅
- **Outdated**: {{devOutdated}} ⚠️

{{#hasOutdated}}
## Outdated Packages

### Production

{{#outdatedProd}}
- **{{name}}**: {{current}} → {{latest}}
{{/outdatedProd}}

### Development

{{#outdatedDev}}
- **{{name}}**: {{current}} → {{latest}}
{{/outdatedDev}}

{{/hasOutdated}}

## Key Technology Decisions

### Why Vite?

- ⚡ Lightning-fast HMR
- 📦 Optimized production builds
- 🔧 Excellent TypeScript support
- 🎯 Modern ESM-first approach

### Why Mantine?

- ♿ Accessibility built-in
- 🎨 Extensive component library
- 🔧 Highly customizable theming
- 📱 Responsive by default

### Why Redux Toolkit + Saga?

- 📊 Complex state management needs
- ⚡ Advanced async workflows
- 🔄 Side effect orchestration
- 🧪 Testable business logic

### Why Ethers.js?

- 🔒 Security-focused
- 📚 Well-documented
- 🎯 TypeScript support
- 🌐 Multi-provider support

---

*Generated by docs-generator skill on {{generatedDate}}*
