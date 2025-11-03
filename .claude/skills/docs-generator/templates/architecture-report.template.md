# {{projectName}} - Architecture Report v{{version}}

**Generated:** {{generatedDate}}
**Version:** {{version}}
**Template:** React dApp Template for Web3/Blockchain Applications

## Executive Summary

The {{projectName}} is a sophisticated, production-ready template for building decentralized applications (dApps) with modern React architecture. The template emphasizes developer experience, type safety, and maintainable code structure while providing comprehensive Web3 integration capabilities.

### Key Architectural Decisions

- **Feature-Based Architecture**: Organized by business domains rather than technical layers
- **Advanced State Management**: Redux Toolkit with Redux Saga for complex async operations
- **Sophisticated Slice Lifecycle Management**: Automatic cleanup strategies for optimal memory usage
- **Multi-Wallet Web3 Integration**: {{walletSupport}}
- **Multi-Chain Support**: {{chainSupport}}
- **Component-Driven Development**: Storybook integration with comprehensive testing

### Technology Stack Summary

| Category                 | Technology         | Version         | Purpose                                  |
| ------------------------ | ------------------ | --------------- | ---------------------------------------- |
| **Build Tool**           | {{buildTool}}      | {{buildVersion}} | Fast development and optimized builds   |
| **UI Framework**         | {{uiFramework}}    | {{uiVersion}}    | Component-based UI with latest features |
| **UI Library**           | {{uiLibrary}}      | {{uiLibVersion}} | Modern component library                |
| **State Management**     | {{stateManagement}}| {{stateVersion}} | Predictable state with async flows      |
| **Routing**              | {{router}}         | {{routerVersion}}| Client-side routing with lazy loading   |
| **Web3 Integration**     | {{web3Library}}    | {{web3Version}}  | Blockchain interaction and wallets      |
| **Testing**              | {{testFramework}}  | {{testVersion}}  | Unit, integration, visual testing       |
| **Internationalization** | {{i18n}}           | {{i18nVersion}}  | Multi-language support                  |
| **TypeScript**           | {{typescript}}     | {{tsVersion}}    | Type safety and developer experience    |

## System Architecture Overview

![System Architecture](./diagrams/system-overview.png)

The application follows a layered architecture with clear separation of concerns:

### Architecture Layers

1. **Presentation Layer** (React Components)
   - {{uiLibrary}}-based UI components
   - Feature-specific component libraries
   - Layout and navigation components

2. **Business Logic Layer** (Redux + Saga)
   - Feature-specific Redux slices
   - Saga orchestration for complex workflows
   - State machine patterns

3. **Service Layer** (API Integration)
   - {{web3Library}} Web3 service abstraction
   - External service interfaces
   - Dependency injection pattern

4. **Infrastructure Layer**
   - {{buildTool}} build configuration
   - Testing utilities and mocks
   - Development tooling

## Feature Architecture

![Feature Architecture](./diagrams/feature-architecture.png)

The codebase is organized around **{{totalFeatures}} features** ({{coreCount}} core, {{domainCount}} domain):

### Core Features (Infrastructure)

{{#coreFeatures}}
#### {{index}}. {{name}} Feature (`src/features/{{slug}}/`)

- **Purpose**: {{purpose}}
- **Key Components**: {{components}}
- **Responsibilities**: {{responsibilities}}

{{/coreFeatures}}

### Domain Features (Business Logic)

{{#domainFeatures}}
#### {{index}}. {{name}} Feature (`src/features/{{slug}}/`)

- **Purpose**: {{purpose}}
- **Models**: {{models}}
- **Architecture**: {{architecture}}
- **Key Components**: {{components}}

{{/domainFeatures}}

## Architecture Patterns

### Feature-Model Pattern

Domain features organize code by **models**, with each model having its own directory:

```
src/features/{feature}/
├── models/
│   ├── {model}/
│   │   ├── IModelApi.ts      # Interface for dependencies
│   │   ├── actions.ts         # Action creators
│   │   ├── slice.ts           # State slice
│   │   ├── actionEffects/     # Business logic (Sagas)
│   │   └── types/             # TypeScript types
├── hooks/                     # Feature-specific hooks
├── components/                # UI components
├── IFeatureApi.ts             # Root interface
├── slice.ts                   # combineReducers
└── sagas.ts                   # Saga watchers
```

**Adoption**: {{patternAdoption.featureModel}} domain features

### Dependency Injection Pattern

Features define interfaces, services implement them:

```typescript
// Feature defines what it needs
export interface IWalletApi {
  connectWallet(): Promise<void>;
}

// Service implements the interface
class EthersService implements IWalletApi {
  async connectWallet() { /* implementation */ }
}

// Composition root wires them together
const api = new EthersService();
walletSaga(api);
```

**Adoption**: {{patternAdoption.dependencyInjection}} domain features

### Component Abstraction Pattern

Components never use Redux directly - always through feature hooks:

```typescript
// ❌ WRONG: Direct Redux usage
const dispatch = useDispatch();
const wallet = useSelector(state => state.wallet);

// ✅ CORRECT: Feature hooks
const walletActions = useWalletActions();
const wallet = useWallet();
```

**Adoption**: {{patternAdoption.hookAbstraction}} domain features

## Data Flow

![Data Flow](./diagrams/data-flow.png)

The application uses Redux Saga for business logic orchestration:

1. **Component** calls feature hook action
2. **Feature Hook** dispatches Redux action
3. **Redux Saga** intercepts action
4. **ActionEffect** executes business logic with injected API
5. **Service API** performs actual work
6. **Redux Slice** updates state (success/failure)
7. **Component** re-renders with new state

## Redux Architecture

![Redux Architecture](./diagrams/redux-architecture.png)

Features use Redux Toolkit for state management:

- **Slices**: Pure state containers (no logic)
- **Actions**: Action creators (no logic)
- **ActionEffects**: All business logic (Redux Saga generators)
- **Sagas**: Watcher functions (route actions to effects)

## Component Hierarchy

![Component Hierarchy](./diagrams/component-hierarchy.png)

Components follow strict abstraction rules:

- Use feature hooks for actions and state
- No direct `useDispatch()` or `useSelector()`
- Pure presentation logic only
- Business logic in `actionEffects/`

## Architecture Health

### Current Status

- **Total Features**: {{totalFeatures}} ({{coreCount}} core, {{domainCount}} domain)
- **Architecture Violations**: {{violationCount}}
- **Pattern Adoption**: {{overallAdoption}}%

### Violations

{{#violations}}
- **{{type}}** ({{severity}}): {{message}} - {{count}} occurrences
{{/violations}}

{{^violations}}
✅ No architectural violations detected!
{{/violations}}

### Recommendations

{{#recommendations}}
{{index}}. **[{{priority}}]** {{message}}
{{/recommendations}}

## Development Workflow

### Commands

```bash
# Development
npm run dev                # Start dev server
npm run build              # Production build
npm run preview            # Preview production build

# Testing
npm run test               # Run unit tests
npm run test:ui            # Test UI
npm run storybook          # Component documentation

# Code Quality
npm run lint               # Lint code (no auto-fix)
npm run type-check         # TypeScript check

# i18n
npm run extract            # Extract translation keys
npm run check-translations # Validate translations
```

### Quality Standards

- **ESLint**: Zero warnings required
- **TypeScript**: Strict mode enabled
- **Testing**: Comprehensive coverage
- **Storybook**: Component documentation

## Deployment

### Build Optimization

- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Unused code elimination
- **Minification**: Production optimized bundles
- **Source Maps**: Available for debugging

### Environment Variables

Required environment variables for deployment:

```env
# Add your environment variables here
VITE_APP_NAME={{projectName}}
# ... other vars
```

---

*Generated by docs-generator skill on {{generatedDate}}*
