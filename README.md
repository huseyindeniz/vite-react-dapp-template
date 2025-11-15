# Vite React dApp Template

![version](https://img.shields.io/github/package-json/version/huseyindeniz/vite-react-dapp-template)
![GitHub stars](https://img.shields.io/github/stars/huseyindeniz/vite-react-dapp-template?style=social) ![GitHub forks](https://img.shields.io/github/forks/huseyindeniz/vite-react-dapp-template?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/huseyindeniz/vite-react-dapp-template?style=plastic) ![GitHub language count](https://img.shields.io/github/languages/count/huseyindeniz/vite-react-dapp-template?style=plastic) ![GitHub top language](https://img.shields.io/github/languages/top/huseyindeniz/vite-react-dapp-template?style=plastic) ![GitHub last commit](https://img.shields.io/github/last-commit/huseyindeniz/vite-react-dapp-template?color=red&style=plastic)

A sophisticated, production-ready React application template with enterprise-grade architecture. Build **traditional Web2 apps**, **Web3 dApps**, or **AI-powered applications** - all with the same robust foundation.

> **🚀 Version 1.1.0 - Architecture Refinement & Enhanced Features**
> Complete directory restructuring with clearer Core vs Domain separation (578+ files reorganized), enhanced AI Assistant with suggestions and artifacts, improved Blog Demo with single post viewing, comprehensive theme/UI refinements, plus built-in quality enforcement tooling with 26 automated checks.

🚀 **[Live Demo](https://snazzy-sorbet-15dcef.netlify.app)** | 📚 **[Documentation](https://huseyindeniz.github.io/react-dapp-template-documentation/)**

## Quick Start

```bash
npx degit huseyindeniz/vite-react-dapp-template my-app
cd my-app
npm install
npm run dev
```

## Why Choose This Template?

### 🌐 Universal Application Foundation

Build ANY web application architecture:

- **Web2 Applications**: Traditional apps with OAuth authentication, REST APIs
- **Web3 dApps**: Blockchain apps with multi-wallet and multi-chain support
- **AI Agent Applications**: AI-powered apps with chat interfaces and agent integration
- **Hybrid Applications**: Combine Web2 + Web3 + AI in a single architecture

### 🏗️ Core vs Domain Architecture

**Core Features** (`src/core/features/` - Infrastructure, keep these):

- React 19, TypeScript 5, Vite 7
- Redux Toolkit + Redux Saga with automatic lifecycle management
- Mantine UI component library with customizable theming
- i18next internationalization with automatic key extraction
- React Router with lazy loading and code splitting
- Reusable design components (ErrorFallback, PageLoading, Breadcrumb)
- Flexible layout system (AppShell with header, footer, navbar, aside)

**Domain Features** (`src/domain/features/`):

- `ai-assistant/` - AI chat interface with LangGraph/Google ADK support (optional, removable)
- `blog-demo/` - REST API integration example (optional, removable)
- `oauth/` - OAuth 2.0 authentication (optional, removable)
- `site/` - **Your site branding** (customize: logo, social links, copyright)
- `wallet/` - Web3 integration (optional, removable)

Optional features are self-contained and removable. Site branding should be customized for your app.

### ⚡ Key Capabilities

- **Modern Stack**: React 19, TypeScript 5, Vite 7
- **Enterprise State Management**: Redux Toolkit + Redux Saga with automatic lifecycle management
- **Feature-Based Architecture**: Clear boundaries, dependency injection, interface-driven design
- **UI/UX**: Mantine components, responsive design, dark/light mode, accessibility
- **Built-in CI/CD**: GitHub Actions workflows for automated code quality & architecture checks (26 checks total)
- **Testing & Quality**: Vitest, React Testing Library, Storybook, ESLint, Prettier
- **AI-Ready**: Pre-built chat interface with LangGraph and Google ADK support

## What's Included

### 🏗️ Core Features (Infrastructure - Required)

Located in `src/core/features/` - These are foundational features that all applications need.

#### Application Bootstrap (`app/`)

- Centralized configuration system via composition root (`src/config/`)
- Provider composition with automatic dependency injection
- Redux store configuration and feature registration
- Lazy loading and code splitting support

#### Reusable Components (`components/`)

- Error boundaries and fallback components (`ErrorFallback`)
- Loading states (`PageLoading`)
- Navigation aids (`Breadcrumb`)
- Consistent design patterns across the application

#### Internationalization (`i18n/`)

- Multi-language support (English, Turkish - easily extensible)
- Browser language detection and locale switching
- Feature-based translation namespaces
- Automatic key extraction from components (`npm run extract`)

#### Layout System (`layout/`)

- Mantine AppShell-based structure (header, footer, navbar, aside, main)
- Responsive layout with breakpoint-aware design
- Customizable layout extensions via composition root
- Dark/light mode support

#### Routing (`router/`)

- React Router with lazy loading and code splitting
- Automatic menu generation from route configuration
- Flexible route protection system for authenticated routes
- Type-safe route definitions

#### Slice Manager (`slice-manager/`)

- Automatic Redux slice lifecycle management
- 5 cleanup strategies: Component, Route, Cached, Persistent, Manual
- Memory leak prevention with automatic cleanup
- Feature slice registration and teardown

#### UI System (`ui/`)

- Mantine v8 component library
- Customizable theme with CSS variables
- Responsive design with mobile-first approach
- Dark/light mode with system preference detection
- Accessible components (WCAG compliant)

### 🎯 Domain Features

Located in `src/domain/features/` - Business domain features. Most are optional examples you can remove. Site branding is where you customize your app's identity.

#### Web3 Wallet Integration (`wallet/`)

- Multi-wallet: MetaMask, Core, Coinbase, Rabby
- Multi-chain: Ethereum, Polygon, Avalanche, BSC + testnets
- Three-model state machine: Provider, Network, Account
- Wallet-based authentication with optional message signing

#### OAuth Authentication (`oauth/`)

- Providers: Google OAuth 2.0, GitHub OAuth
- Token management and profile pages
- Works independently or alongside wallet auth

#### AI Chat Interface (`ai-assistant/`) - Enhanced in v1.1

- Complete chat UI with message threading and empty state
- LangGraph and Google ADK adapters
- Suggestion system with categorized quick actions
- Artifact support (images, files, markdown) with copy/paste
- Python backend examples in `dev/backend/`

#### Blog Demo (`blog-demo/`) - Enhanced in v1.1

- REST API integration example (JSONPlaceholder)
- Two-model architecture: Posts and Authors
- Single post viewing with dedicated `useBlogPost` hook
- Improved styling and navigation between list and detail views
- Reference implementation for building new features

#### Site Branding (`site/`)

- **Customize this for your own branding!**
- Replace logo, social media links, copyright text with your own
- Default implementations provided as examples
- Components used in layout extensions (header, footer)

### 🧪 Development & Testing

- **Testing**: Vitest + React Testing Library for unit/integration tests
- **Documentation**: Storybook for interactive component development
- **CI/CD**: GitHub Actions workflows (code-audit.yml + arch-audit.yml) - runs automatically on PRs
- **Local Audits**: Claude Code Skills (`/skill code-audit`, `/skill arch-audit`)
- **Code Quality**: ESLint + Prettier with pre-commit hooks (zero warnings tolerance)

## Technology Stack

| Technology                   | Purpose                 |
| ---------------------------- | ----------------------- |
| **React (19.x)**             | UI framework            |
| **TypeScript (5.x)**         | Type safety             |
| **Vite (7.x)**               | Build tool              |
| **Mantine (8.x)**            | UI component library    |
| **Redux Toolkit (2.x)**      | State management        |
| **Redux Saga (1.x)**         | Side effect management  |
| **React Router (7.x)**       | Client-side routing     |
| **i18next (25.x)**           | Internationalization    |
| **Vitest (3.x)**             | Testing framework       |
| **Storybook (8.x)**          | Component documentation |
| **React Testing Lib (16.x)** | Component testing       |
| **ESLint (9.x)**             | Code linting            |
| **Prettier (3.x)**           | Code formatting         |

**Optional Domain Dependencies** (only if you keep the features):

| Technology                       | Feature         | Purpose                     |
| -------------------------------- | --------------- | --------------------------- |
| **Ethers.js (6.x)**              | `wallet/`       | Web3/blockchain integration |
| **Axios (1.x)**                  | `blog-demo/`    | REST API integration        |
| **@assistant-ui/react**          | `ai-assistant/` | AI chat UI components       |
| **@assistant-ui/react-markdown** | `ai-assistant/` | Markdown rendering in chat  |

## Project Structure

### Three-Layer Architecture

```
src/
├── config/            # 🏛️ COMPOSITION ROOT (top-level layer)
│   ├── services.ts    # Service instantiation & dependency injection
│   ├── features.ts    # Feature registration with Redux store
│   ├── pages/         # Page component extensions
│   ├── core/          # Core infrastructure configuration
│   │   ├── auth/      # Auth provider registration
│   │   ├── i18n/      # Translations for core features
│   │   ├── router/    # Route definitions
│   │   └── ui/        # UI configuration (theme, layout)
│   └── domain/        # Domain feature configuration
│       ├── ai-assistant/  # AI assistant config & services
│       ├── blog-demo/     # Blog demo config & services
│       ├── oauth/         # OAuth config & services
│       └── wallet/        # Wallet config & services
│
├── core/              # ⚙️ CORE FEATURE LAYER (Infrastructure)
│   └── features/
│       ├── app/           # Application bootstrap
│       ├── components/    # Reusable design components
│       ├── i18n/          # Internationalization infrastructure
│       ├── layout/        # Page structure (header, footer, navbar, etc.)
│       ├── router/        # Routing infrastructure
│       ├── slice-manager/ # Redux lifecycle management
│       └── ui/            # Mantine-based design system
│
├── domain/            # 🎯 DOMAIN FEATURE LAYER (Business Logic)
│   └── features/
│       ├── ai-assistant/  # 📦 AI chat interface (optional)
│       ├── blog-demo/     # 📦 REST API example (optional)
│       ├── oauth/         # 📦 OAuth auth (optional)
│       ├── site/          # 📦 Site branding (optional)
│       └── wallet/        # 📦 Web3 wallet (optional)
│
├── services/          # 🔌 SERVICE LAYER
│   ├── chat/          # Chat service implementations (optional)
│   ├── ethersV6/      # Web3 service implementation (optional)
│   ├── http/          # HTTP service utilities
│   ├── jsonplaceholder/ # REST API service (optional)
│   └── oauth/         # OAuth service implementation (optional)
│
├── pages/             # 🎨 PRESENTATION LAYER
└── hooks/             # 🪝 Global React hooks
```

**Layer Responsibilities:**

- **Composition Root** (`src/config/`): Wires the entire application together. ONLY place where services are imported and features are registered. Split into `core/` (infrastructure config) and `domain/` (business feature config).
- **Core Features** (`src/core/features/`): Infrastructure features required by all applications (app bootstrap, i18n, routing, UI system, layout, components, slice manager).
- **Domain Features** (`src/domain/features/`): Business domain features that are optional and removable (wallet, oauth, ai-assistant, blog-demo, site). Define interfaces, receive services via dependency injection.
- **Service Layer** (`src/services/`): Implement domain feature interfaces. Integrate with external libraries (ethers.js, axios, etc.).
- **Presentation Layer** (`src/pages/`): Route entry points. Orchestrate UI using feature components and hooks.

## Development Commands

```bash
# Core
npm run dev          # Development server with HMR
npm run build        # Production build
npm run test         # Unit tests
npm run lint         # ESLint (zero warnings tolerance)
npm run coverage     # Test coverage
npm run preview      # Preview production build

# Storybook
npm run storybook         # Component development
npm run build-storybook   # Build static Storybook

# Internationalization
npm run extract             # Extract translation keys
npm run check-translations  # Validate translations

# Quality Audits (requires Claude Code)
/skill code-audit    # Run 18 code quality checks
/skill arch-audit    # Run 8 architecture dependency checks

# Release
npm run release      # Version bump and release
npm run prepare      # Setup git hooks
```

## Code Quality & Architecture Enforcement

This template enforces enterprise-grade quality standards with **26 automated checks**:

**🔍 Code Quality (18 checks):**

- Import/export patterns, Redux abstraction, service boundaries
- i18n coverage, TypeScript safety, code organization
- React best practices, code cleanliness

**🏗️ Architecture (8 checks):**

- Feature isolation, composition root pattern
- Service layer boundaries, circular dependency detection

**How to Run:**

- **Locally**: `/skill code-audit` and `/skill arch-audit` (Claude Code)
- **CI/CD**: Automatically on every PR via included GitHub Actions workflows
  - `.github/workflows/code-audit.yml`
  - `.github/workflows/arch-audit.yml`

**Quality Standards (Zero Tolerance):**

- ✅ ESLint: 0 warnings (not just errors)
- ✅ TypeScript: No "any", no suppressions
- ✅ i18n: All UI text uses `t()`
- ✅ Redux: Components use feature hooks (not RTK directly)
- ✅ Services: Only imported in composition root
- ✅ Architecture: No boundary violations
- ✅ React: Proper keys (stable, unique identifiers)

## Configuration

### Composition Root Pattern (New in v1.0)

The `src/config/` directory is the **Composition Root** - a top-level architectural layer where the entire application is wired together.

**What is the Composition Root?**

This is NOT just a config folder - it's a **fundamental architectural pattern** where:

- ALL services are instantiated and injected into features
- ALL features are registered with the Redux store
- ALL routes are defined and configured
- ALL cross-feature dependencies are resolved
- Architecture rules are suspended here (this is the ONE place where cross-boundary imports are allowed)

**Structure:**

```
src/config/
├── services.ts             # Service instantiation (ONLY place to import services)
├── features.ts             # Feature registration (Redux store + sagas)
├── pages/                  # Page component extensions
├── core/                   # Core infrastructure configuration
│   ├── auth/               # Authentication configuration
│   │   ├── auth.ts         # Auth provider registration
│   │   └── ProtectionType.ts  # Protection type definitions
│   ├── i18n/               # Internationalization
│   │   ├── config.ts       # i18n configuration
│   │   └── translations/   # Translation files by namespace
│   ├── router/             # Routing configuration
│   │   └── routes.tsx      # Application route definitions
│   └── ui/                 # UI configuration
│       ├── mantineProviderProps.ts    # Mantine provider configuration
│       ├── theme/          # Theme customization
│       └── layout-extensions/  # Header/navbar/footer customization
└── domain/                 # Domain feature configuration
    ├── ai-assistant/       # AI assistant feature config
    ├── blog-demo/          # Blog demo feature config
    ├── oauth/              # OAuth feature config
    └── wallet/             # Wallet feature config
```

**Why This Matters:**

By centralizing all wiring in one place:

- Features remain isolated and don't know about each other
- Services are injected rather than hard-coded
- Easy to swap implementations (e.g., EthersV5 → EthersV6)
- Clear single source of truth for application composition
- Follows Dependency Injection best practices

### Environment Variables

```bash
# Router
VITE_ROUTER_USE_HASH=false

# Wallet (optional - only if using wallet feature)
VITE_WALLET_SIGN_TIMEOUT_IN_SEC=60
VITE_WALLET_DISABLE_SIGN=false
VITE_WALLET_POST_LOGIN_REDIRECT_PATH=/wallet-profile

# OAuth (optional - only if using oauth feature)
VITE_OAUTH_GOOGLE_CLIENT_ID=your_client_id
VITE_OAUTH_GITHUB_CLIENT_ID=your_client_id
VITE_OAUTH_POST_LOGIN_REDIRECT_PATH=/oauth-profile
```

### TypeScript Path Aliases

```typescript
"paths": {
  "@/core/*": ["./src/core/*"],           // Core features and infrastructure
  "@/domain/*": ["./src/domain/*"],       // Domain features (business logic)
  "@/config/*": ["./src/config/*"],       // Configuration and composition root
  "@/services/*": ["./src/services/*"],   // Service implementations
  "@/pages/*": ["./src/pages/*"],         // Page components
  "@/hooks/*": ["./src/hooks/*"],         // Global React hooks
  "@test-utils": ["./src/test-utils/index.ts"]  // Test utilities
}
```

## Removing Domain Features

### Remove Wallet Feature

1. Delete `src/domain/features/wallet/` directory
2. Delete `src/services/ethersV6/` directory
3. Delete `src/config/domain/wallet/` directory
4. Remove wallet routes from `src/config/core/router/routes.tsx`
5. Remove wallet feature from `src/config/features.ts`
6. Remove wallet service from `src/config/services.ts`
7. Remove wallet auth from `src/config/core/auth/auth.ts`
8. Remove wallet page extension from `src/config/pages/`
9. Uninstall: `npm uninstall ethers @metamask/jazzicon`

### Remove OAuth Feature

1. Delete `src/domain/features/oauth/` directory
2. Delete `src/services/oauth/` directory
3. Delete `src/config/domain/oauth/` directory
4. Remove OAuth routes from `src/config/core/router/routes.tsx`
5. Remove OAuth feature from `src/config/features.ts`
6. Remove OAuth service from `src/config/services.ts`
7. Remove OAuth auth from `src/config/core/auth/auth.ts`
8. Remove OAuth page extension from `src/config/pages/`

### Remove AI Assistant Feature

1. Delete `src/domain/features/ai-assistant/` directory
2. Delete `src/services/chat/` directory
3. Delete `src/config/domain/ai-assistant/` directory
4. Remove AI assistant routes from `src/config/core/router/routes.tsx`
5. Remove AI assistant feature from `src/config/features.ts`
6. Remove chat service from `src/config/services.ts`
7. Uninstall: `npm uninstall @assistant-ui/react @assistant-ui/react-markdown axios` (if not used by other features)

### Remove Blog Demo Feature

1. Delete `src/domain/features/blog-demo/` directory
2. Delete `src/services/jsonplaceholder/` directory
3. Delete `src/config/domain/blog-demo/` directory
4. Remove blog routes from `src/config/core/router/routes.tsx`
5. Remove blog feature from `src/config/features.ts`
6. Remove blog service from `src/config/services.ts`
7. Uninstall: `npm uninstall axios` (if not used by other features)

## Customizing Your Application

### Site Branding

The `src/domain/features/site/` directory contains branding components you should customize:

1. **SiteLogo** - Replace with your own logo component
2. **SocialMenu** - Update social media links (GitHub, Twitter, LinkedIn, etc.)
3. **Copyright** - Update copyright text and year

These components are referenced in layout extensions:
- `src/config/core/ui/layout-extensions/headerExtension.tsx` (SiteLogo)
- `src/config/core/ui/layout-extensions/footerExtension.tsx` (SocialMenu, Copyright)

## Release Notes

### v1.1.0 - Architecture Refinement & Enhanced Features (Current)

**🏗️ Major Architecture Refactoring:**

1. **Core vs Domain Separation** - Complete directory restructuring for clearer boundaries
   - `src/core/features/` - Infrastructure features (app, i18n, router, ui, components, layout, slice-manager)
   - `src/domain/features/` - Business domain features (wallet, oauth, ai-assistant, blog-demo, site)
   - `src/config/core/` - Core infrastructure configuration (auth, i18n, router, ui, translations)
   - `src/config/domain/` - Domain feature configuration (wallet, oauth, ai-assistant, blog-demo)
   - Much better isolation between infrastructure and business logic
   - Clearer responsibilities and easier feature management

**✨ Feature Enhancements:**

2. **AI Assistant Improvements**
   - Empty state component with categorized suggestions
   - Enhanced chat interface with better UX and agent selection
   - Improved artifact handling (image, file, markdown) with copy/paste notifications
   - Assistant branding support (logo image)
   - Consistent notification patterns across all artifact types

3. **Blog Demo Enhancements**
   - Single post viewing capability (new `GetPost` action effect)
   - Dedicated `useBlogPost` hook for individual post access
   - Improved post item styling with custom CSS modules
   - Better navigation between posts list and detail views
   - Enhanced author integration

4. **Theme & UI Refinements**
   - Enhanced CSS variables resolver for better theming
   - Improved Mantine provider configuration
   - Redesigned language selection modal with better UX
   - Better responsive design patterns and layout customization
   - HTTP service abstraction (`IHttpService` type)

**🔒 Code Quality & Type Safety:**

5. **Quality Enforcement Tooling**
   - Claude Code skills for automated audits (`code-audit`, `arch-audit`)
   - GitHub Actions workflows included in template (runs on PRs automatically)
   - 26 automated checks total (18 code quality + 8 architecture)

6. **Type Safety Improvements**
   - MenuType architecture refined (menuLabel now required, better keys)
   - Proper React key patterns (stable, unique identifiers throughout)
   - Stricter TypeScript enforcement across entire codebase
   - Better type definitions for HTTP services and configurations

**Migration Notes:**

- **Breaking**: Directory structure changed - features split into `core/` and `domain/` subdirectories
- **Breaking**: Config structure changed - configs split into `config/core/` and `config/domain/`
- **Breaking**: Path aliases changed - `@/features/*` replaced with `@/core/*` and `@/domain/*`
- Import paths must be updated to new aliases (e.g., `@/core/features/app/*`, `@/domain/features/wallet/*`)
- All files reorganized - affects 578+ files across the template

### v1.0.0 - Universal Template (Major Architectural Changes)

1. **Auth Feature Split**: The `auth` feature split into two separate features:
   - `oauth/` - OAuth 2.0 authentication (Google, GitHub)
   - `wallet/` - Web3 wallet authentication
   - Both are now **optional** and removable independently

2. **Centralized Configuration**: All configuration moved to `src/config/`
   - Route definitions: `src/config/routes.tsx`
   - Service injection: `src/config/services.ts`
   - Feature registration: `src/config/features.ts`

3. **Protection Provider System**: New pluggable authentication
   - `withWalletProtection` HOC for wallet-protected routes
   - `withOAuthProtection` HOC for OAuth-protected routes
   - Register custom auth providers in `src/config/auth/auth.ts`

4. **AI Chat Feature Added**: New optional AI-powered chat interface
   - Complete chat UI (`ai-assistant/` feature)
   - LangGraph and Google ADK adapters
   - Python backend examples in `dev/backend/`

5. **Store Configuration**: Redux store moved to `src/features/app/store/store.ts`
   - Removed centralized `src/store/` directory

6. **Translation Files**: Reorganized to `src/config/i18n/translations/{namespace}/{lang}.json`
   - Feature-based namespaces for better organization

**Note**: v1.1.0 further refined this structure by splitting features into `core/` and `domain/` subdirectories.

## Alternative Versions

- **[Create React App Version](https://github.com/huseyindeniz/cra-template-dapp)**: CRA-based template (deprecated)
- **Legacy Versions**: v0.6.x and earlier used Chakra UI

## Contributing

We welcome contributions from the community!

- 💬 **Discussions**: [GitHub Discussions](https://github.com/huseyindeniz/vite-react-dapp-template/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/huseyindeniz/vite-react-dapp-template/issues)
- 🔧 **Pull Requests**: [GitHub PRs](https://github.com/huseyindeniz/vite-react-dapp-template/pulls)

### Development Setup

```bash
git clone https://github.com/huseyindeniz/vite-react-dapp-template.git
cd vite-react-dapp-template
npm install
npm run dev
```

## License

This project is licensed under the [MIT License](./LICENSE).

---

**🚀 Ready to build your next application?**

Whether you're building a traditional SaaS, a Web3 dApp, or an AI agent platform - this template has you covered.

[Get Started Now](https://huseyindeniz.github.io/react-dapp-template-documentation/) | [View Live Demo](https://snazzy-sorbet-15dcef.netlify.app) | [Star on GitHub ⭐](https://github.com/huseyindeniz/vite-react-dapp-template)
