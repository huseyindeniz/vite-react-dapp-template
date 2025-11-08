# Vite React dApp Template

![version](https://img.shields.io/github/package-json/version/huseyindeniz/vite-react-dapp-template)
![GitHub stars](https://img.shields.io/github/stars/huseyindeniz/vite-react-dapp-template?style=social) ![GitHub forks](https://img.shields.io/github/forks/huseyindeniz/vite-react-dapp-template?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/huseyindeniz/vite-react-dapp-template?style=plastic) ![GitHub language count](https://img.shields.io/github/languages/count/huseyindeniz/vite-react-dapp-template?style=plastic) ![GitHub top language](https://img.shields.io/github/languages/top/huseyindeniz/vite-react-dapp-template?style=plastic) ![GitHub last commit](https://img.shields.io/github/last-commit/huseyindeniz/vite-react-dapp-template?color=red&style=plastic)

A sophisticated, production-ready React application template with enterprise-grade architecture. Build **traditional Web2 apps**, **Web3 dApps**, or **AI-powered applications** - all with the same robust foundation.

> **🚀 Version 1.0.0 - Universal Template**
> This release represents a fundamental architectural evolution. The template is now **truly universal** - Web3 wallet integration, OAuth, and AI chat are all **optional domain features** that can be easily removed. Build anything from a traditional SaaS app to a cutting-edge AI agent platform.

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

**Core Features** (Infrastructure - Keep these):

- React 19, TypeScript 5, Vite 7
- Redux Toolkit + Redux Saga
- Mantine UI component library
- i18next internationalization
- React Router with lazy loading
- Automatic slice lifecycle management

**Domain Features** (Examples - Remove/Replace as needed):

- `wallet/` - Web3 integration (MetaMask, Core, Coinbase, Rabby)
- `oauth/` - OAuth 2.0 authentication (Google, GitHub)
- `chat/` - AI agent chat interface (LangGraph/Google ADK)
- `blog-demo/` - REST API integration example (JSONPlaceholder)

Each domain feature is completely self-contained and removable.

### ⚡ Key Capabilities

- **Modern Stack**: React 19, TypeScript 5, Vite 7
- **Enterprise State Management**: Redux Toolkit + Redux Saga with automatic lifecycle management
- **Feature-Based Architecture**: Clear boundaries, dependency injection, interface-driven design
- **UI/UX**: Mantine components, responsive design, dark/light mode, accessibility
- **Testing & Quality**: Vitest, React Testing Library, Storybook, ESLint, Prettier
- **AI-Ready**: Pre-built chat interface with LangGraph and Google ADK support

## What's Included

### 🏗️ Core Features (Infrastructure - Required)

#### Application Bootstrap (`app/`)

- Centralized configuration system (`src/config/`)
- Provider composition and service dependency injection
- Lazy loading and code splitting

#### Internationalization (`i18n/`)

- Multi-language support (English, Turkish - easily extensible)
- Browser language detection and feature-based namespaces
- Automatic key extraction from components

#### Routing (`router/`)

- React Router with lazy loading and code splitting
- Automatic menu generation from route configuration
- Flexible protection system for authenticated routes

#### UI System (`ui/`)

- Mantine component library with customizable theme
- Responsive layout components and dark/light mode support

#### Slice Manager (`slice-manager/`)

- Automatic Redux slice lifecycle management
- 5 cleanup strategies: Component, Route, Cached, Persistent, Manual
- Memory leak prevention

### 🎯 Domain Features (Optional - Examples)

#### Web3 Wallet Integration (`wallet/`)

- Multi-wallet: MetaMask, Core, Coinbase, Rabby
- Multi-chain: Ethereum, Polygon, Avalanche, BSC + testnets
- Three-model state machine: Provider, Network, Account
- Wallet-based authentication with optional message signing

#### OAuth Authentication (`oauth/`)

- Providers: Google OAuth 2.0, GitHub OAuth
- Token management and profile pages
- Works independently or alongside wallet auth

#### AI Chat Interface (`chat/`) - New in v1.0

- Complete chat UI with message threading
- LangGraph and Google ADK adapters
- Python backend examples in `dev/backend/`

#### Blog Demo (`blog-demo/`)

- REST API integration example (JSONPlaceholder)
- Two-model architecture: Posts and Authors
- Reference implementation for building new features

### 🧪 Development & Testing

- Vitest + React Testing Library
- Storybook for component documentation
- Claude Code Skills for automated audits
- ESLint + Prettier with pre-commit hooks

## Technology Stack

| Technology                    | Purpose                 |
| ----------------------------- | ----------------------- |
| **React (19.x)**              | UI framework            |
| **TypeScript (5.x)**          | Type safety             |
| **Vite (7.x)**                | Build tool              |
| **Mantine (8.x)**             | UI component library    |
| **Redux Toolkit (2.x)**       | State management        |
| **Redux Saga (1.x)**          | Side effect management  |
| **React Router (7.x)**        | Client-side routing     |
| **i18next (25.x)**            | Internationalization    |
| **Vitest (3.x)**              | Testing framework       |
| **Storybook (8.x)**           | Component documentation |
| **React Testing Lib (16.x)**  | Component testing       |
| **ESLint (9.x)**              | Code linting            |
| **Prettier (3.x)**            | Code formatting         |

**Optional Domain Dependencies** (only if you keep the features):

| Technology           | Feature      | Purpose                     |
| -------------------- | ------------ | --------------------------- |
| **Ethers.js (6.x)**  | `wallet/`    | Web3/blockchain integration |
| **Axios (1.x)**      | `blog-demo/` | REST API integration        |

## Project Structure

### Three-Layer Architecture

```
src/
├── config/            # 🏛️ COMPOSITION ROOT (top-level layer)
│   ├── services.ts    # Service instantiation & dependency injection
│   ├── features.ts    # Feature registration with Redux store
│   ├── routes.tsx     # Application route definitions
│   ├── auth/          # Auth provider registration
│   ├── ui/            # UI configuration (theme, layout)
│   └── i18n/          # Translation files
│
├── features/          # ⚙️ FEATURE LAYER
│   ├── app/           # Application bootstrap
│   ├── i18n/          # Internationalization infrastructure
│   ├── router/        # Routing infrastructure
│   ├── ui/            # Mantine-based design system
│   ├── slice-manager/ # Redux lifecycle management
│   ├── wallet/        # 📦 Web3 wallet (optional domain feature)
│   ├── oauth/         # 📦 OAuth auth (optional domain feature)
│   └── blog-demo/     # 📦 REST API example (optional domain feature)
│
├── services/          # 🔌 SERVICE LAYER
│   ├── ethersV6/      # Web3 service implementation (optional)
│   ├── oauth/         # OAuth service implementation (optional)
│   └── jsonplaceholder/ # REST API service (optional)
│
├── pages/             # 🎨 PRESENTATION LAYER
└── hooks/             # 🪝 Global React hooks
```

**Layer Responsibilities:**

- **Composition Root** (`src/config/`): Wires the entire application together. ONLY place where services are imported and features are registered.
- **Feature Layer** (`src/features/`): Business logic and infrastructure features. Define interfaces, receive services via dependency injection.
- **Service Layer** (`src/services/`): Implement feature interfaces. Integrate with external libraries (ethers.js, axios, etc.).
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

# Release
npm run release      # Version bump and release
npm run prepare      # Setup git hooks
```

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
├── routes.tsx              # Application route definitions
├── auth/                   # Authentication configuration
│   ├── auth.ts             # Auth provider registration
│   └── ProtectionType.ts   # Protection type definitions
├── ui/                     # UI configuration
│   ├── mantineProviderProps.ts    # Mantine provider configuration
│   └── layout-extensions/         # Header/navbar customization
└── i18n/                   # Internationalization
    └── translations/       # Translation files by namespace
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
  "@/config/*": ["./src/config/*"],
  "@/features/*": ["./src/features/*"],
  "@/services/*": ["./src/services/*"],
  "@/pages/*": ["./src/pages/*"],
  "@/hooks/*": ["./src/hooks/*"],
  "@test-utils": ["./src/test-utils/index.ts"]
}
```

## Removing Domain Features

### Remove Wallet Feature

1. Delete `src/features/wallet/` directory
2. Delete `src/services/ethersV6/` directory
3. Remove wallet routes from `src/config/routes.tsx`
4. Remove wallet service from `src/config/services.ts`
5. Remove wallet auth from `src/config/auth/auth.ts`
6. Uninstall: `npm uninstall ethers @metamask/jazzicon`

### Remove OAuth Feature

1. Delete `src/features/oauth/` directory
2. Delete `src/services/oauth/` directory
3. Remove OAuth routes from `src/config/routes.tsx`
4. Remove OAuth service from `src/config/services.ts`
5. Remove OAuth auth from `src/config/auth/auth.ts`

### Remove Chat Feature

1. Delete `src/features/chat/` directory
2. Delete `src/services/chat/` directory
3. Remove chat routes from `src/config/routes.tsx`
4. Remove chat service from `src/config/services.ts`
5. Uninstall: `npm uninstall axios` (if not used by other features)

### Remove Blog Demo Feature

1. Delete `src/features/blog-demo/` directory
2. Delete `src/services/jsonplaceholder/` directory
3. Remove blog routes from `src/config/routes.tsx`
4. Remove blog service from `src/config/services.ts`
5. Uninstall: `npm uninstall axios` (if not used by other features)

## Breaking Changes from v0.x

### v1.0.0 - Major Architectural Changes

1. **Auth Feature Split**: The `auth` feature split into two separate features:
   - `oauth/` - OAuth 2.0 authentication (Google, GitHub)
   - `wallet/` - Web3 wallet authentication
   - Both are now **optional** and removable independently

2. **Centralized Configuration**: All configuration moved to `src/config/`
   - Route definitions: `config/routes.tsx`
   - Service injection: `config/services.ts`
   - Feature registration: `config/features.ts`

3. **Protection Provider System**: New pluggable authentication
   - `withWalletProtection` HOC for wallet-protected routes
   - `withOAuthProtection` HOC for OAuth-protected routes
   - Register custom auth providers in `config/auth/auth.ts`

4. **Chat Feature Added**: New optional AI chat feature
   - Complete chat UI with LangGraph and Google ADK adapters
   - Python backend examples in `dev/backend/`

5. **Store Configuration**: Redux store now in `src/features/app/store/store.ts`
   - Removed centralized `src/store/` directory

6. **Translation Files**: Reorganized to `src/config/i18n/translations/{namespace}/{lang}.json`
   - Feature-based namespaces for better organization

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
