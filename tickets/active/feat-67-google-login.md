# [FEAT-001] Adding Google Login

## 🎯 Feature Description

Add Google OAuth 2.0 integration to provide traditional web authentication alongside existing wallet-based authentication. This addresses the practical need for users who don't have MetaMask or want to avoid dealing with gas fees and wallet setup complexity.

## 📋 User Story

As a **user**, I want **to log in using my Google account** so that **I can access the application without needing to install MetaMask or understand cryptocurrency concepts**.

## ✅ Acceptance Criteria

- [ ] User can click "Sign in with Google" button
- [ ] Google OAuth 2.0 flow works correctly (redirect → auth → callback)
- [ ] User session is created and managed after successful Google login
- [ ] Google auth works alongside existing wallet authentication (dual auth support)
- [ ] User can log out from Google session
- [ ] Proper error handling for failed authentication attempts
- [ ] TypeScript types are properly defined for all Google auth components
- [ ] Session persists across browser refresh
- [ ] Works on both desktop and mobile browsers

## 🎨 UI/UX Requirements

- Add "Sign in with Google" button to header next to Connect button
- Button should follow Google's brand guidelines
- Maintain existing wallet auth UI - don't remove it
- Loading states during OAuth flow
- Error messages for failed authentication
- Success feedback after login

## 🔧 Technical Requirements

- Google OAuth 2.0 integration
- Session management compatible with existing auth patterns
- Maintain existing wallet auth alongside Google auth
- Proper TypeScript support
- Follow project's feature-based architecture
- Integrate with existing RTK/Saga patterns

### Dependencies

- Google OAuth library (e.g., `@google-cloud/oauth2` or `google-auth-library` or whatever is the latest)
- Environment variables for Google OAuth credentials

## 🧪 Testing Strategy

- [ ] Unit tests for GoogleLoginButton component
- [ ] Unit tests for useGoogleAuth hook
- [ ] Integration tests for OAuth flow
- [ ] E2E tests for complete login/logout flow
- [ ] Test compatibility with existing wallet auth
- [ ] Manual testing on different browsers

## 📊 Success Metrics

- Google login success rate > 95%
- OAuth flow completion time < 10 seconds
- Zero conflicts with existing wallet authentication
- User can switch between auth methods seamlessly

## 🚀 Deployment Notes

- Google OAuth app setup required in Google Console
- Environment variables needed:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_REDIRECT_URI`
- Update authentication documentation

## 🔗 Related Issues/Dependencies

- Should not break existing wallet authentication
- Consider future auth providers (Apple, GitHub, etc.)

## ⚠️ Priority

- [x] High (Important feature for user onboarding)

## 📝 Additional Notes

**Implementation Philosophy**: Adding centralized auth to a decentralized template. Pragmatism over purity - real-world projects need accessible authentication that doesn't require crypto knowledge.

**Existing Auth Pattern**: The template already has wallet connection patterns. Google auth should integrate with the same auth context and session management patterns.

**User Experience Goal**: Reduce friction for mainstream users while keeping advanced wallet features for crypto-native users.

---

## 🔄 Progress Tracking

**Status**: In Progress  
**Started**: 2025-08-31  
**Assigned**: Claude Code

### Implementation Steps

- [x] Step 1: Research and analyze existing authentication patterns
- [x] Step 2: Create auth service layer (IAuthApi, AuthApi with mocked backend)
- [x] Step 3: Design generic auth provider system (AuthProvider interface)
- [x] Step 4: Implement GoogleAuthProvider following provider pattern
- [x] Step 5: Create generic auth Redux slice and sagas (provider-agnostic)
- [x] Step 6: Set up auth configuration with supported providers
- [x] Step 7: Integrate with store (rootReducer, RootSaga)
- [x] Step 8: Remove old Google-specific implementation
- [x] Step 9: Create auth UI components (AuthLoginButton, AuthStatus)
- [ ] Step 10: Add auth hooks (useAuth, useAuthProvider)
- [ ] Step 12: Add comprehensive tests for all layers
- [ ] Step 13: Update documentation and environment setup

### Progress Notes

- **2025-08-31**: Started working on ticket - analyzed requirements and created implementation plan
- **2025-08-31**: ARCHITECTURE REDESIGN - Refactored to follow proper provider pattern like wallet feature:
  - **Problem**: Previous implementation was too Google-specific, didn't use service layer
  - **Solution**: Redesigned auth as generic system with pluggable providers
  - **Service Layer**: Created `src/services/auth/` with IAuthApi interface and AuthApi implementation
    - Handles token exchange with backend (mocked for now)
    - Supports provider tokens → app session flow
    - Includes session management, refresh, validation
  - **Provider System**: Created `src/features/auth/providers/` following wallet pattern
    - Generic AuthProvider interface for any OAuth provider
    - GoogleAuthProvider implementation using Google Identity Services
    - Easy to add Apple, GitHub, etc. providers later
  - **Generic Redux**: Refactored auth Redux to be provider-agnostic
    - AuthState enum (NOT_INITIALIZED → AUTHENTICATED)
    - Generic AuthSession and AuthUser types from service layer
    - Sagas handle any provider through common interface
  - **Configuration**: Created `src/features/auth/config.ts` with SUPPORTED_AUTH_PROVIDERS array
  - **Store Integration**: Updated rootReducer.ts and store.ts to use new generic auth system
  - **Cleanup**: Removed old Google-specific files from `src/features/auth/google/`

### Next Actions

- [ ] Get approval for implementation plan
- [ ] Research existing auth architecture in the codebase
- [ ] Set up Google OAuth library dependencies
