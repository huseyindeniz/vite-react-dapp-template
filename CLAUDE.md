# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compilation and Vite build)
- `npm run lint` - Run ESLint with zero warnings tolerance
- `npm run test` - Run unit tests with Vitest
- `npm run coverage` - Run tests with coverage report

### Storybook
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build Storybook for production

### Internationalization
- `npm run extract` - Extract translation keys from source files
- `npm run check-translations` - Validate translation completeness

### Release
- `npm run release` - Bump version using custom script
- `npm run prepare` - Setup Husky git hooks

## Architecture Overview

This is a React dApp template built with Vite, designed for Web3/blockchain frontend applications.

### Tech Stack
- **Build Tool**: Vite with React plugin and TypeScript paths
- **UI Framework**: Mantine (v7) - switched from Chakra UI in v0.7.0
- **State Management**: Redux Toolkit + Redux Saga for async operations
- **Routing**: React Router DOM v7
- **Web3**: Ethers.js v6 (configurable to v5)
- **Testing**: Vitest + React Testing Library + Storybook
- **Internationalization**: i18next with browser language detection

### Project Structure

#### Feature-Based Organization
- `src/features/` - Core application features:
  - `app/` - Main app component and provider composition
  - `wallet/` - Web3 wallet integration with Redux state management
  - `ui/` - Mantine-based UI components and theme
  - `router/` - Routing configuration and utilities
  - `i18n/` - Internationalization setup and components

#### Pages and Services
- `src/pages/` - Application pages with route definitions
- `src/services/` - External service integrations (Ethers.js, AVVY domains)
- `src/store/` - Redux store configuration with root reducer

### Web3 Integration

The wallet system uses a sophisticated state machine with three main models:
- **Provider**: Detects and manages Web3 wallet connections
- **Network**: Handles chain switching and network validation  
- **Account**: Manages user authentication and signing

Supported wallets: MetaMask, Core, Coinbase, Rabby
Supported chains: Ethereum, Polygon, Avalanche, BSC (+ testnets)

### Key Configuration Files
- `src/features/wallet/config.ts` - Wallet and network configuration
- `src/features/ui/mantine/theme.tsx` - Mantine theme customization
- `vite.config.ts` - Build configuration with manual chunking
- `vitest.config.ts` - Test configuration with coverage thresholds

### Import Path Aliases
Uses TypeScript path mapping for clean imports:
- `@/features/*` - Feature modules
- `@/services/*` - Service layer
- `@/pages/*` - Page components
- `@/hooks/*` - Custom hooks
- `@/store/*` - Redux store
- `@test-utils` - Testing utilities

### Testing Strategy
- Unit tests with Vitest (globals enabled)
- Component testing with React Testing Library
- Storybook for component documentation and visual testing
- Coverage thresholds set to 30% across all metrics

### Development Notes
- Uses React 19 with strict mode
- Lazy loading for main App component
- Provider composition pattern for context management
- Redux Saga for complex async flows
- Supports both Ethers v5 and v6 (currently configured for v6)