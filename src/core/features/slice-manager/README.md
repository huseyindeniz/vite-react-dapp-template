# Slice Manager

Automatic Redux slice lifecycle management with smart caching and cleanup strategies.

## Quick Start

Most common pattern: API data with pagination using `cached` strategy.

**1. Create configuration** (`configureMyFeature.ts`):
```typescript
import { getSliceManager } from '@/features/slice-manager/SliceLifecycleManager';

export const configureMyFeature = () => {
  const manager = getSliceManager();

  manager.registerSlice({
    name: 'posts',
    feature: 'blog',
    cleanupStrategy: 'cached',
    cacheTimeout: 1000 * 60 * 10, // 10 minutes
    cleanupReducerName: 'cleanup',
  });
};
```

**2. Add to Router.tsx**:
```typescript
import { configureMyFeature } from '@/features/my-feature/configureMyFeature';

// Add your configureMyFeature() call in the existing useEffect
useEffect(() => {
  if (sliceManager) {
    configureBlogFeature();
    configureMyFeature();  // Add here
  }
}, [sliceManager]);
```

**3. Use smartFetch in your saga**:
```typescript
import { smartFetch } from '@/features/slice-manager/sagas/smartFetch';

export function* getPosts({ payload: { start, limit } }) {
  const posts = yield* smartFetch(
    'posts',
    { start, limit },
    (state) => state.blog.posts.items,
    function* () { return yield call(api.getPosts, start, limit); },
    { lastFetchParamsSelector: (state) => state.blog.posts.lastFetchParams }
  );

  if (posts) {
    yield put(actions.setPosts(posts));
    yield put(actions.setLastFetchParams({ start, limit }));
  }
}
```

Done! Your data will cache for 10 minutes and automatically refetch when params change.

---

## Important: ALL Strategies Use smartFetch

**Critical**: ALL cleanup strategies MUST use `smartFetch` in sagas to prevent redundant API calls. The cleanup strategy only controls WHEN data is cleaned up from Redux, not whether smartFetch is used.

Without smartFetch, your saga will call the API every single time an action is dispatched!

---

## Cleanup Strategies Guide

Choose the right strategy for your data's lifecycle.

### 1. `cached` - API Data with Time-Based Caching

**When to use**: Paginated lists, filtered data, API responses that should cache temporarily and support parameter tracking.

**Cleanup trigger**: Time-based (after cacheTimeout expires).

**What you need**:
- ✅ MUST use `smartFetch` in sagas
- ✅ MUST track `lastFetchParams` in state (for pagination/filters)
- ✅ MUST dispatch `setLastFetchParams` after successful fetch

**Configuration**:
```typescript
{
  name: 'posts',
  feature: 'blog',
  cleanupStrategy: 'cached',
  cacheTimeout: 1000 * 60 * 10, // Cache for 10 minutes
  cleanupReducerName: 'cleanup',
  cleanupDelay: 3000, // Wait 3s before cleanup
}
```

**State shape**:
```typescript
interface PostsState {
  items: Post[];
  language: string | null;
  lastFetchParams?: Record<string, unknown>; // Required!
  loadingStatus: LoadingStatusType;
  error: string | null;
}
```

**Reducers**:
```typescript
const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setLastFetchParams: (state, { payload }: PayloadAction<Record<string, unknown>>) => {
      state.lastFetchParams = payload;
    },
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
    },
    cleanup: (state) => {
      return initialState;
    },
  },
});
```

**Saga**:
```typescript
import { smartFetch } from '@/features/slice-manager/sagas/smartFetch';

export function* getPosts({ payload: { language, start, limit } }) {
  const posts = yield* smartFetch(
    'posts',
    { language, start, limit }, // All params that affect data
    (state) => postsSelectors.selectAll(state.blog.posts),
    function* () {
      return yield call([api, api.getPosts], language, start, limit);
    },
    {
      languageSelector: (state) => state.blog.posts.language,
      lastFetchParamsSelector: (state) => state.blog.posts.lastFetchParams,
    }
  );

  if (posts) {
    yield put(sliceActions.addPosts(posts));
    yield put(sliceActions.setLanguage(language));
    yield put(sliceActions.setLastFetchParams({ language, start, limit }));
  }
}
```

**How it works**:
- smartFetch checks if params changed → refetch
- smartFetch checks if cache expired (cacheTimeout) → refetch
- Otherwise uses cached data in Redux
- After 10 minutes of inactivity, data is cleaned up from Redux

**Use case**: Paginated posts, filtered product lists, search results with changing parameters.

---

### 2. `route` - Feature Route Data

**When to use**: Data only relevant when viewing specific feature pages.

**Cleanup trigger**: When user leaves feature routes.

**What you need**:
- ✅ MUST use `smartFetch` in sagas (prevents redundant API calls)
- ✅ MUST register feature routes
- ❌ No special code in components
- ❌ Usually no params tracking needed (unless you have pagination)

**Configuration**:
```typescript
{
  name: 'blogSettings',
  feature: 'blog',
  cleanupStrategy: 'route',
  cleanupReducerName: 'cleanup',
  cleanupDelay: 1000, // Wait 1s before cleanup
}

// Also register feature routes:
manager.registerFeature({
  name: 'blog',
  routes: [/^\/blog($|\/)/], // Cleanup when leaving /blog
  slices: ['posts', 'authors', 'blogSettings'],
});
```

**State shape**:
```typescript
interface BlogSettingsState {
  settings: Settings | null;
  loadingStatus: LoadingStatusType;
  error: string | null;
}
```

**Reducers**:
```typescript
const slice = createSlice({
  name: 'blogSettings',
  initialState,
  reducers: {
    setSettings: (state, { payload }) => {
      state.settings = payload;
    },
    cleanup: (state) => {
      return initialState;
    },
  },
});
```

**Saga**:
```typescript
import { smartFetch } from '@/features/slice-manager/sagas/smartFetch';

export function* getBlogSettings() {
  const settings = yield* smartFetch(
    'blogSettings',
    {}, // No params for simple data
    (state) => state.blog.blogSettings.settings,
    function* () {
      return yield call([api, api.getBlogSettings]);
    }
  );

  if (settings) {
    yield put(sliceActions.setSettings(settings));
  }
}
```

**How it works**:
- User visits `/blog` → slice stays active, smartFetch prevents redundant API calls
- User navigates to `/home` → slice cleans up after 1 second
- User returns to `/blog` within 1s → cleanup cancelled, data still there
- User returns to `/blog` after 1s → data cleaned up, smartFetch fetches fresh data

**Use case**: Feature-specific settings, filters, UI state that's only relevant on feature pages.

---

### 3. `component` - Component Lifecycle Data

**When to use**: Data tied to specific component lifecycle (mount/unmount).

**Cleanup trigger**: When component unmounts (after unpinSlice).

**What you need**:
- ✅ MUST use `smartFetch` in sagas (prevents redundant API calls)
- ✅ MUST use `pinSlice` on component mount
- ✅ MUST use `unpinSlice` on component unmount
- ✅ Use `useSliceManager` hook

**Configuration**:
```typescript
{
  name: 'userProfile',
  feature: 'user',
  cleanupStrategy: 'component',
  cleanupReducerName: 'cleanup',
  cleanupDelay: 5000, // Wait 5s after unpinSlice
}
```

**State shape**:
```typescript
interface UserProfileState {
  profile: UserProfile | null;
  loadingStatus: LoadingStatusType;
  error: string | null;
}
```

**Reducers**:
```typescript
const slice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setProfile: (state, { payload }) => {
      state.profile = payload;
    },
    cleanup: (state) => {
      return initialState;
    },
  },
});
```

**Saga**:
```typescript
import { smartFetch } from '@/features/slice-manager/sagas/smartFetch';

export function* getUserProfile({ payload: { userId } }) {
  const profile = yield* smartFetch(
    'userProfile',
    { userId },
    (state) => state.user.userProfile.profile,
    function* () {
      return yield call([api, api.getUserProfile], userId);
    }
  );

  if (profile) {
    yield put(sliceActions.setProfile(profile));
  }
}
```

**Component**:
```typescript
import { useEffect } from 'react';
import { useSliceManager } from '@/features/slice-manager/hooks/useSliceManager';

export const UserProfile = ({ userId }) => {
  const { pinSlice, unpinSlice } = useSliceManager();

  useEffect(() => {
    // Pin on mount - prevents cleanup
    pinSlice('userProfile');

    return () => {
      // Unpin on unmount - allows cleanup after delay
      unpinSlice('userProfile');
    };
  }, [pinSlice, unpinSlice]);

  useEffect(() => {
    dispatch(actions.getUserProfile({ userId }));
  }, [userId]);

  // ... rest of component
};
```

**How it works**:
- Component mounts → `pinSlice` called → slice won't clean up, smartFetch prevents redundant API calls
- Component unmounts → `unpinSlice` called → cleanup after 5 seconds
- If component re-mounts within 5 seconds → cleanup cancelled, data still there
- If re-mounted after 5s → data cleaned up, smartFetch fetches fresh data

**Use case**: User-specific dashboards, component-specific temporary data, modal content.

---

### 4. `persistent` - Never Cleanup

**When to use**: Global settings, frequently used reference data.

**Cleanup trigger**: Never (unless manually called).

**What you need**:
- ✅ MUST use `smartFetch` in sagas (prevents redundant API calls)
- ❌ No special component code
- ❌ Never cleans up automatically

**Configuration**:
```typescript
{
  name: 'appSettings',
  feature: 'app',
  cleanupStrategy: 'persistent',
  cleanupReducerName: 'cleanup', // Only used for manual cleanup
}
```

**State shape**:
```typescript
interface AppSettingsState {
  settings: AppSettings | null;
  loadingStatus: LoadingStatusType;
  error: string | null;
}
```

**Reducers**:
```typescript
const slice = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setSettings: (state, { payload }) => {
      state.settings = payload;
    },
    cleanup: (state) => {
      return initialState;
    },
  },
});
```

**Saga**:
```typescript
import { smartFetch } from '@/features/slice-manager/sagas/smartFetch';

export function* getAppSettings() {
  const settings = yield* smartFetch(
    'appSettings',
    {},
    (state) => state.app.appSettings.settings,
    function* () {
      return yield call([api, api.getAppSettings]);
    }
  );

  if (settings) {
    yield put(sliceActions.setSettings(settings));
  }
}
```

**How it works**:
- Data loads once via smartFetch and stays in Redux forever
- smartFetch prevents redundant API calls - only calls API if data doesn't exist
- Only cleans up if you explicitly call `cleanupSlice('appSettings')`

**Use case**: User preferences, app configuration, frequently used lookups, categories.

---

### 5. `manual` - Explicit Control

**When to use**: When YOU decide when to cleanup (admin data, rare operations).

**Cleanup trigger**: When you explicitly call `cleanupSlice`.

**What you need**:
- ✅ MUST use `smartFetch` in sagas (prevents redundant API calls)
- ✅ MUST call `cleanupSlice` yourself when you want to refresh
- ✅ Use `useSliceManager` hook

**Configuration**:
```typescript
{
  name: 'adminData',
  feature: 'admin',
  cleanupStrategy: 'manual',
  cleanupReducerName: 'cleanup',
}
```

**State shape**:
```typescript
interface AdminDataState {
  data: AdminData | null;
  loadingStatus: LoadingStatusType;
  error: string | null;
}
```

**Reducers**:
```typescript
const slice = createSlice({
  name: 'adminData',
  initialState,
  reducers: {
    setData: (state, { payload }) => {
      state.data = payload;
    },
    cleanup: (state) => {
      return initialState;
    },
  },
});
```

**Saga**:
```typescript
import { smartFetch } from '@/features/slice-manager/sagas/smartFetch';

export function* getAdminData() {
  const data = yield* smartFetch(
    'adminData',
    {},
    (state) => state.admin.adminData.data,
    function* () {
      return yield call([api, api.getAdminData]);
    }
  );

  if (data) {
    yield put(sliceActions.setData(data));
  }
}
```

**Component**:
```typescript
import { useSliceManager } from '@/features/slice-manager/hooks/useSliceManager';

export const AdminPanel = () => {
  const { cleanupSlice } = useSliceManager();

  const handleRefresh = () => {
    cleanupSlice('adminData'); // Manually trigger cleanup
    dispatch(actions.getAdminData()); // Then refetch
  };

  return <button onClick={handleRefresh}>Refresh Data</button>;
};
```

**How it works**:
- No automatic cleanup ever
- smartFetch prevents redundant API calls during session
- You control when cleanup happens by calling `cleanupSlice`
- After cleanup, next action triggers smartFetch which fetches fresh data

**Use case**: Admin dashboards, one-time operations, data that needs explicit refresh button.

---

## State Requirements Summary

### All Strategies (Required)

```typescript
interface MySliceState {
  // Your data
  data: MyData | null;

  // Standard states
  loadingStatus: LoadingStatusType;
  error: string | null;
}

// Required reducer
cleanup: (state) => {
  return initialState; // or use adapter.removeAll(state)
}
```

### For `cached` Strategy with Params (Additional Requirements)

```typescript
interface MySliceState {
  data: MyData[];
  language: string | null;           // For i18n support
  lastFetchParams?: Record<string, unknown>; // For pagination/filtering
  loadingStatus: LoadingStatusType;
  error: string | null;
}

// Additional reducers
setLanguage: (state, { payload }: PayloadAction<string>) => {
  state.language = payload;
},
setLastFetchParams: (state, { payload }: PayloadAction<Record<string, unknown>>) => {
  state.lastFetchParams = payload;
},
```

---

## API Reference

### Directory Structure

```
slice-manager/
├── SliceLifecycleManager.ts    # Main manager (PUBLIC)
├── types/                       # Type definitions (PUBLIC)
├── hooks/                       # React hooks (PUBLIC)
├── components/                  # Components (PUBLIC)
├── sagas/                       # Saga helpers (PUBLIC)
└── lib/                         # INTERNAL - do not import!
```

**Important**: Never import from `lib/` - it's internal implementation.

---

### Types

#### `SliceConfig`

```typescript
interface SliceConfig {
  name: string;                    // Slice name
  feature: string;                 // Feature name
  cleanupStrategy: 'component' | 'route' | 'manual' | 'cached' | 'persistent';
  cleanupReducerName: string;      // Reducer action for cleanup
  cleanupDelay?: number;           // Delay before cleanup (ms)
  cacheTimeout?: number;           // Cache expiry for 'cached' (ms)
  routes?: RegExp[];               // Routes for route-based cleanup
  dependencies?: string[];         // Dependent slices
}
```

#### `FeatureRouteConfig`

```typescript
interface FeatureRouteConfig {
  name: string;                    // Feature name
  routes: RegExp[];                // Route patterns
  slices: string[];                // Slice names in this feature
}
```

#### `SmartFetchOptions`

```typescript
interface SmartFetchOptions {
  forceRefresh?: boolean;          // Skip cache, force fresh fetch
  ttl?: number;                    // Cache TTL override
  languageSelector?: StateSelector<string | null>;
  lastFetchParamsSelector?: StateSelector<Record<string, unknown> | undefined>;
}
```

---

### Hooks

#### `useSliceManagerInit()`

**Already used in Router.tsx** - you don't need this hook.

#### `useSliceManager()`

Get slice manager utilities:

```typescript
const {
  getSliceStatus,    // Get all slice statuses
  getFeatureStatus,  // Get all feature statuses
  cleanupAll,        // Cleanup all inactive slices
  pinSlice,          // Pin slice (component strategy)
  unpinSlice,        // Unpin slice (component strategy)
  cleanupSlice,      // Manual cleanup (manual strategy)
  cleanupFeature,    // Cleanup entire feature
} = useSliceManager();
```

#### `useSlices()`

Access slice metadata (rarely needed).

---

### Sagas

#### `smartFetch<T>`

**REQUIRED FOR ALL STRATEGIES** - Smart data fetching that prevents redundant API calls.

```typescript
function* smartFetch<T>(
  sliceName: string,
  params: Record<string, unknown>,
  dataSelector: StateSelector<T>,
  apiCall: () => ApiCallGenerator<T>,
  options?: SmartFetchOptions
): Generator<..., T | null, unknown>
```

**Parameters**:
- `sliceName` - Name of the slice
- `params` - Fetch parameters (use `{}` if no params)
- `dataSelector` - Selector to get current data from state
- `apiCall` - Generator function that calls the API
- `options` - Optional: languageSelector, lastFetchParamsSelector, forceRefresh

See strategy sections for complete examples.

#### Other Sagas

```typescript
// Clear cache for specific slice
clearSliceCacheSaga({ payload: { sliceName: 'posts' } })

// Get cache statistics
getCacheStatsSaga()

// Clean expired cache entries
cleanExpiredCacheSaga()
```

---

### Components

#### `SliceDebugPanel`

Development tool for debugging slice lifecycle:

```typescript
import { SliceDebugPanel } from '@/features/slice-manager/components/SliceDebugPanel';

<SliceDebugPanel /> // Shows real-time slice status
```

---

## Examples

Complete working example: `src/features/blog-demo/`

Shows:
- Feature configuration with multiple strategies
- `cached` strategy with smartFetch + pagination
- `persistent` strategy for categories
- State management with `createEntityAdapter`
- Proper params tracking

---

## Troubleshooting

### API called every time action is dispatched

**Problem**: Every dispatch triggers an API call.

**Solution**: You MUST use `smartFetch` in your saga. All strategies require smartFetch!

### Load More not fetching new data

**Problem**: Pagination doesn't work, always shows same data.

**Solution**:
1. Use `cached` strategy (not `route` or `persistent`)
2. Pass ALL params to smartFetch: `{ language, start, limit }`
3. Pass `lastFetchParamsSelector` in options
4. Dispatch `setLastFetchParams` after successful fetch

### Component data not cleaning up

**Problem**: Data persists after component unmount.

**Solution**:
1. Use `component` strategy
2. Call `pinSlice` on mount
3. Call `unpinSlice` on unmount
4. Check `cleanupDelay` is reasonable

### Cache not working

**Problem**: Always fetching fresh data.

**Solution**:
1. Use `cached` strategy (not `route`)
2. Don't use `forceRefresh: true`
3. Check `cacheTimeout` is set
4. Verify params aren't changing unexpectedly
