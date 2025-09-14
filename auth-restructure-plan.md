# Auth Feature Restructuring Plan

## Current Architecture Analysis

### Current Structure:
```
src/features/auth/
├── providers/
│   ├── google/GoogleAuthProvider.ts
│   ├── github/GitHubAuthProvider.ts
│   └── types/AuthProvider.ts
├── config.ts (instantiates providers directly)
├── sagas.ts (receives AuthApi but providers are feature-level)
└── models/actionEffects/loginWithProvider.ts (imports providers from config)

src/services/auth/
└── AuthApi.ts (handles backend communication only)

src/store/store.ts (injects AuthApi into sagas)
```

### Issues with Current Architecture:
1. **Mixing concerns**: Auth providers (pure OAuth logic) are mixed with feature-level code
2. **Direct coupling**: Action effects directly import and use providers
3. **No service injection**: Providers aren't properly injected through the store/saga layer
4. **Inconsistent pattern**: AuthApi follows service pattern, but providers don't

## Target Architecture

### New Structure:
```
src/services/auth/
├── AuthApi.ts (existing - backend communication)
├── providers/
│   ├── GoogleAuthProvider.ts (concrete implementation)
│   ├── GitHubAuthProvider.ts (concrete implementation)
│   └── AuthProviderService.ts (NEW - manages all providers)
└── AuthService.ts (NEW - unified auth service facade)

src/features/auth/
├── types/
│   ├── IAuthProvider.ts (interface - defines contract)
│   ├── IAuthProviderService.ts (interface - defines contract)
│   └── IAuthService.ts (interface - defines contract)
├── config.ts (configuration only, no direct instantiation)
├── sagas.ts (receives IAuthService interface)
└── models/actionEffects/ (uses IAuthService interface)
```

### Key Architectural Principle:
**Features define interfaces (contracts), Services provide implementations**
- Features layer owns the interfaces (what needs to be done)
- Services layer owns the implementations (how it's done)
- This allows features to remain decoupled from concrete implementations

## Implementation Plan

### Phase 1: Define Feature Interfaces

1. **Create IAuthProvider Interface** (`src/features/auth/types/IAuthProvider.ts`)
   - Define contract for auth providers
   - Methods: `initialize()`, `login()`, `logout()`, `getProviderName()`, etc.

2. **Create IAuthProviderService Interface** (`src/features/auth/types/IAuthProviderService.ts`)
   - Define contract for provider management
   - Methods: `getProvider(name)`, `getSupportedProviders()`, `initializeAll()`

3. **Create IAuthService Interface** (`src/features/auth/types/IAuthService.ts`)
   - Define contract for unified auth service
   - Methods: `loginWithProvider()`, `logout()`, `refreshToken()`, `exchangeToken()`, etc.

### Phase 2: Create Service Implementations

4. **Implement AuthProviderService** (`src/services/auth/providers/AuthProviderService.ts`)
   - Concrete implementation of IAuthProviderService
   - Singleton pattern like AuthApi
   - Manages provider lifecycle (initialization, registration, retrieval)

5. **Implement AuthService Facade** (`src/services/auth/AuthService.ts`)
   - Concrete implementation of IAuthService
   - Combines AuthApi + AuthProviderService
   - Singleton pattern
   - Orchestrates provider + API calls

### Phase 3: Move Provider Implementations

6. **Move Provider Files to Services**
   - Move `src/features/auth/providers/google/GoogleAuthProvider.ts` → `src/services/auth/providers/GoogleAuthProvider.ts`
   - Move `src/features/auth/providers/github/GitHubAuthProvider.ts` → `src/services/auth/providers/GitHubAuthProvider.ts`
   - Remove `src/features/auth/providers/types/AuthProvider.ts` (replaced by IAuthProvider interface)
   - Move utils directories as well (google/utils, github/utils)
   - Update providers to implement IAuthProvider interface from features

### Phase 4: Update Store Integration

7. **Update Store Configuration** (`src/store/store.ts`)
   - Replace `authApi` injection with unified `authService`
   - Initialize AuthService singleton that manages both API and providers
   ```ts
   const authService = AuthService.getInstance();
   // AuthService internally manages AuthApi + AuthProviderService
   ```

8. **Update Root Saga**
   - Pass `authService` (implements IAuthService) instead of just `authApi` to auth saga
   - Saga receives full auth capabilities through interface

### Phase 5: Update Feature Layer

9. **Update Auth Config** (`src/features/auth/config.ts`)
   - Remove direct provider instantiation
   - Keep only configuration constants (provider names, defaults)
   - Provider instances managed by service layer

10. **Update Sagas** (`src/features/auth/sagas.ts`)
    - Change parameter from `IAuthApi` to `IAuthService`
    - Pass full service interface to action effects

11. **Update Action Effects**
    - Replace `getAuthProviderByName()` calls with `authService.getProvider()`
    - Replace direct `authApi` calls with `authService.exchangeToken()`, etc.
    - Remove imports of feature-level provider config
    - Work with IAuthService interface, not concrete implementations

### Phase 6: Clean Up Feature Layer

12. **Update Feature Exports**
    - Remove provider-related exports from feature level
    - Export interfaces (IAuthProvider, IAuthService, etc.)
    - Keep feature-specific types, components, hooks
    - Update import paths throughout the codebase

13. **Update TypeScript Paths**
    - Update imports that reference the old provider locations
    - Ensure proper type resolution for interfaces vs implementations

## Benefits of This Architecture

### ✅ Proper Separation of Concerns
- **Services**: Pure business logic, no UI/feature coupling
- **Features**: UI logic, state management, user interactions
- **Store**: Dependency injection, service orchestration

### ✅ Better Testability
- Services can be unit tested in isolation
- Providers can be mocked at service boundary
- Feature logic tests don't need to mock individual providers

### ✅ Scalability
- Easy to add new auth providers (just register with service)
- Service layer can be reused by other features if needed
- Clear boundaries for different types of auth logic

### ✅ Consistent Patterns
- Follows same singleton pattern as other services (AuthApi, WalletAPI)
- Proper dependency injection through store
- Clean saga parameter passing

## Migration Strategy

1. **Create new service files** while keeping old ones
2. **Update store to use new services** (this breaks nothing initially)
3. **Update sagas and action effects** to use injected services
4. **Test thoroughly** at each step
5. **Remove old provider files** only after everything works
6. **Update all imports** and clean up

## File Changes Summary

### New Files (Features Layer - Interfaces):
- `src/features/auth/types/IAuthProvider.ts` (interface)
- `src/features/auth/types/IAuthProviderService.ts` (interface)
- `src/features/auth/types/IAuthService.ts` (interface)

### New Files (Services Layer - Implementations):
- `src/services/auth/providers/AuthProviderService.ts` (implements IAuthProviderService)
- `src/services/auth/AuthService.ts` (implements IAuthService)

### Moved Files:
- `src/features/auth/providers/google/*` → `src/services/auth/providers/google/*`
- `src/features/auth/providers/github/*` → `src/services/auth/providers/github/*`

### Modified Files:
- `src/store/store.ts` (inject AuthService implementation)
- `src/features/auth/sagas.ts` (accept IAuthService interface)
- `src/features/auth/models/actionEffects/*.ts` (use IAuthService interface)
- `src/features/auth/config.ts` (remove instantiation, keep config only)
- `src/services/auth/providers/GoogleAuthProvider.ts` (implement IAuthProvider)
- `src/services/auth/providers/GitHubAuthProvider.ts` (implement IAuthProvider)

### Deleted Files:
- `src/features/auth/providers/types/AuthProvider.ts` (replaced by IAuthProvider interface)
- Original provider files in features directory (after migration)

This plan maintains backward compatibility during migration and creates a clean, scalable architecture that properly separates auth business logic from feature presentation logic.

## Implementation Status

### ✅ Phase 1: Define Feature Interfaces
- [x] 1.1 Create IAuthProvider interface (`src/features/auth/types/IAuthProvider.ts` - COMPLETED)
- [x] 1.2 Create IAuthProviderService interface (`src/features/auth/types/IAuthProviderService.ts` - COMPLETED)
- [x] 1.3 Create IAuthService interface (`src/features/auth/types/IAuthService.ts` - COMPLETED)

### ✅ Phase 2: Create Service Implementations
- [x] 2.1 Implement AuthProviderService (`src/services/auth/providers/AuthProviderService.ts` - COMPLETED)
  - Updated to implement IAuthProviderService interface
  - All method signatures now use IAuthProvider type
  - Fixed all references to use interface types
- [x] 2.2 Implement AuthService facade (`src/services/auth/AuthService.ts` - COMPLETED)
  - Updated to implement IAuthService interface
  - Changed all provider types to use IAuthProvider
  - Fixed loginWithProvider to return AuthSession directly

### ✅ Phase 3: Move Provider Implementations
- [x] 3.1 Move GoogleAuthProvider to services (`src/services/auth/providers/google/` - COMPLETED)
  - Copied all Google provider files from features to services
  - Updated GoogleAuthProvider to implement IAuthProvider interface
- [x] 3.2 Move GitHubAuthProvider to services (`src/services/auth/providers/github/` - COMPLETED)
  - Copied all GitHub provider files from features to services
  - Updated GitHubAuthProvider to implement IAuthProvider interface
- [x] 3.3 Update providers to implement IAuthProvider (COMPLETED)

### ✅ Phase 4: Update Store Integration
- [x] 4.1 Update store configuration (`src/store/store.ts` - COMPLETED)
  - Replaced AuthApi with AuthService import
  - Updated store to inject AuthService into sagas
  - Registered GoogleAuthProvider and GitHubAuthProvider instances
- [x] 4.2 Update root saga (`src/features/auth/sagas.ts` - COMPLETED)
  - Changed saga parameter from IAuthApi to IAuthService
  - Updated all action effect calls to pass authService

### ✅ Phase 5: Update Feature Layer
- [x] 5.1 Update auth config (`src/features/auth/config.ts` - COMPLETED)
  - Removed direct provider instantiation
  - Created AuthProviderMetadata for UI components
  - Kept only configuration constants
- [x] 5.2 Update sagas (`src/features/auth/sagas.ts` - COMPLETED)
  - Updated to accept IAuthService parameter
  - Fixed all action effect calls to pass authService
- [x] 5.3 Update action effects (COMPLETED)
  - `loginWithProvider.ts`: Simplified to use AuthService.loginWithProvider()
  - `logout.ts`: Updated to use AuthService.logout()
  - Updated all type imports to use interface types

### ✅ Phase 6: Clean Up Feature Layer
- [x] 6.1 Update feature exports (COMPLETED)
  - Updated AuthButton component to use simplified provider metadata
  - Updated useAuthActions hook to use correct types
- [x] 6.2 Update import paths (COMPLETED)
  - Fixed all import statements throughout the codebase
  - Ensured proper import ordering per ESLint rules
- [x] 6.3 Final cleanup and testing (COMPLETED)
  - All linting issues resolved
  - TypeScript compilation successful
  - All tests passing

## Current State Notes

### Files Created:
- `src/features/auth/types/IAuthProvider.ts` - Interface defining auth provider contract
- `src/features/auth/types/IAuthProviderService.ts` - Interface for provider management service
- `src/features/auth/types/IAuthService.ts` - Interface for unified auth service

### Files Modified:
- `src/services/auth/providers/AuthProviderService.ts` - Started updating to implement IAuthProviderService interface
  - TODO: Complete updating all method signatures to use IAuthProvider type

## ✅ MIGRATION COMPLETED SUCCESSFULLY

All phases of the auth architecture restructuring have been completed successfully. The auth system now follows proper architectural patterns:

### Key Achievements:
1. **Proper Separation of Concerns**: Features define interfaces, services provide implementations
2. **Clean Dependency Injection**: AuthService is properly injected through the store
3. **Unified API**: Single AuthService facade handles both provider and API operations
4. **Maintainable Code**: All linting rules satisfied, tests passing, builds successfully

### Migration Summary:
- **Interfaces Created**: 3 (IAuthProvider, IAuthProviderService, IAuthService)
- **Services Updated**: 2 (AuthProviderService, AuthService)
- **Providers Moved**: 2 (GoogleAuthProvider, GitHubAuthProvider)
- **Files Updated**: 12+ (store, sagas, action effects, components, hooks, models)
- **Obsolete Files Removed**: Complete `src/features/auth/providers/` directory
- **All Imports Updated**: No references to old provider locations remain
- **Zero Breaking Changes**: All existing functionality preserved

### Final Verification:
- ✅ Build successful (TypeScript compilation clean)
- ✅ Linting passed (0 errors, 0 warnings)
- ✅ All tests passing
- ✅ No obsolete files remaining
- ✅ All imports correctly reference new interface locations

The auth system is now ready for future enhancements and follows the established architectural patterns throughout the codebase.