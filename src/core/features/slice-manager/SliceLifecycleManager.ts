import log from 'loglevel';

import { FeatureRouteConfig } from './types/FeatureRouteConfig';
import { SliceConfig } from './types/SliceConfig';
import { SliceState } from './types/SliceState';

export class SliceLifecycleManager {
  private slices = new Map<string, SliceConfig>();
  private sliceStates = new Map<string, SliceState>();
  private featureRoutes = new Map<string, FeatureRouteConfig>();
  private componentSliceRegistry = new Map<string, Set<string>>(); // componentId -> sliceNames
  private dispatch: (action: { type: string; payload?: unknown }) => void;
  private currentPath: string = '';

  constructor(dispatch: (action: { type: string; payload?: unknown }) => void) {
    this.dispatch = dispatch;
  }

  // ============================================================================
  // CONFIGURATION METHODS
  // ============================================================================

  registerFeature(config: FeatureRouteConfig): void {
    this.featureRoutes.set(config.name, config);
    log.debug(
      `📁 Feature registered: ${config.name} with ${config.slices.length} slices`
    );
  }

  registerSlice(config: SliceConfig): void {
    this.slices.set(config.name, config);
    if (!this.sliceStates.has(config.name)) {
      this.sliceStates.set(config.name, {
        activeComponents: new Set(),
        isRouteActive: false,
        lastAccessed: Date.now(),
        isPinned: false,
      });
    }
    log.debug(
      `🔧 Slice registered: ${config.feature}/${config.name} (strategy: ${config.cleanupStrategy})`
    );
  }

  // ============================================================================
  // COMPONENT REGISTRATION
  // ============================================================================

  registerComponent(componentId: string, sliceNames: string[]): void {
    // Register component -> slices mapping
    this.componentSliceRegistry.set(componentId, new Set(sliceNames));

    // Add component to each slice's active components
    sliceNames.forEach(sliceName => {
      const state = this.sliceStates.get(sliceName);
      if (state) {
        state.activeComponents.add(componentId);
        state.lastAccessed = Date.now();

        // Cancel any pending cleanup since component is now using it
        if (state.cleanupTimeout) {
          clearTimeout(state.cleanupTimeout);
          state.cleanupTimeout = undefined;
          log.debug(
            `⏹️  Cleanup cancelled for ${sliceName} - component registered`
          );
        }
      }
    });

    log.debug(
      `🔗 Component ${componentId} registered with slices: [${sliceNames.join(', ')}]`
    );
  }

  unregisterComponent(componentId: string): void {
    const sliceNames = this.componentSliceRegistry.get(componentId);
    if (sliceNames) {
      sliceNames.forEach(sliceName => {
        const state = this.sliceStates.get(sliceName);
        if (state) {
          state.activeComponents.delete(componentId);
          // Check if this slice should be cleaned up
          this.evaluateSliceCleanup(sliceName, 'component');
        }
      });
      this.componentSliceRegistry.delete(componentId);
      log.debug(`🔌 Component ${componentId} unregistered`);
    }
  }

  // ============================================================================
  // ROUTE MANAGEMENT
  // ============================================================================

  handleRouteChange(newPath: string): void {
    const previousPath = this.currentPath;
    this.currentPath = newPath;

    // Determine which features/slices should be active based on route
    const activeFeatures = new Set<string>();
    const activeSlices = new Set<string>();

    this.featureRoutes.forEach((config, featureName) => {
      const isFeatureActive = config.routes.some(pattern =>
        pattern.test(newPath)
      );

      if (isFeatureActive) {
        activeFeatures.add(featureName);
        config.slices.forEach(sliceName => activeSlices.add(sliceName));
      }
    });

    // Update slice states based on route activity
    this.sliceStates.forEach((state, sliceName) => {
      const wasActive = state.isRouteActive;
      const isActive = activeSlices.has(sliceName);

      if (wasActive !== isActive) {
        state.isRouteActive = isActive;

        if (!isActive) {
          // Route is no longer active, evaluate cleanup
          this.evaluateSliceCleanup(sliceName, 'route');
        } else {
          // Route became active, cancel any pending cleanup
          if (state.cleanupTimeout) {
            clearTimeout(state.cleanupTimeout);
            state.cleanupTimeout = undefined;
            log.debug(
              `⏹️  Cleanup cancelled for ${sliceName} - route became active`
            );
          }
          state.lastAccessed = Date.now();
        }
      }
    });

    log.debug(`🛣️  Route changed: ${previousPath} -> ${newPath}`);
    log.debug(`🟢 Active features: [${Array.from(activeFeatures).join(', ')}]`);
  }

  // ============================================================================
  // SLICE CLEANUP EVALUATION
  // ============================================================================

  private evaluateSliceCleanup(
    sliceName: string,
    trigger: 'component' | 'route' | 'manual'
  ): void {
    const config = this.slices.get(sliceName);
    const state = this.sliceStates.get(sliceName);

    if (!config || !state || state.isPinned) {
      return; // Skip if pinned or config missing
    }

    // Determine if slice should be cleaned up based on its strategy
    let shouldCleanup = false;
    let cleanupDelay = config.cleanupDelay || 0;

    switch (config.cleanupStrategy) {
      case 'component':
        // Cleanup when no components are using it
        shouldCleanup = state.activeComponents.size === 0;
        cleanupDelay = config.cleanupDelay || 2000; // Short delay for component cleanup
        break;

      case 'route':
        // Cleanup when route is inactive AND no components using it
        shouldCleanup =
          !state.isRouteActive && state.activeComponents.size === 0;
        cleanupDelay = config.cleanupDelay || 5000; // Longer delay for route cleanup
        break;

      case 'cached': {
        // Only cleanup after timeout, regardless of usage
        const cacheTimeout = config.cacheTimeout || 300000; // 5 minutes default
        const timeSinceAccess = Date.now() - state.lastAccessed;
        shouldCleanup =
          timeSinceAccess > cacheTimeout && state.activeComponents.size === 0;
        cleanupDelay = 0; // Immediate cleanup if cache expired
        break;
      }

      case 'persistent':
        // Never cleanup automatically
        shouldCleanup = false;
        break;

      case 'manual':
        // Only cleanup when manually triggered
        shouldCleanup = trigger === 'manual';
        cleanupDelay = 0;
        break;
    }

    if (shouldCleanup) {
      if (cleanupDelay > 0) {
        // Schedule delayed cleanup
        if (state.cleanupTimeout) {
          clearTimeout(state.cleanupTimeout);
        }

        state.cleanupTimeout = setTimeout(() => {
          // Double-check conditions before cleanup
          this.executeSliceCleanup(sliceName);
        }, cleanupDelay);

        log.debug(`⏳ Cleanup scheduled for ${sliceName} in ${cleanupDelay}ms`);
      } else {
        // Immediate cleanup
        this.executeSliceCleanup(sliceName);
      }
    }
  }

  private executeSliceCleanup(sliceName: string): void {
    const config = this.slices.get(sliceName);
    const state = this.sliceStates.get(sliceName);

    if (!config || !state) {
      return;
    }

    // Final check - don't cleanup if conditions changed
    if (
      state.isPinned ||
      (config.cleanupStrategy === 'component' &&
        state.activeComponents.size > 0) ||
      (config.cleanupStrategy === 'route' &&
        (state.isRouteActive || state.activeComponents.size > 0))
    ) {
      log.debug(`🛑 Cleanup aborted for ${sliceName} - conditions changed`);
      return;
    }

    // Clear timeout
    if (state.cleanupTimeout) {
      clearTimeout(state.cleanupTimeout);
      state.cleanupTimeout = undefined;
    }

    // Dispatch cleanup action to the slice
    this.dispatch({
      type: `${config.feature}/${sliceName}/${config.cleanupReducerName || 'reset'}`,
      payload: {
        sliceName,
        feature: config.feature,
        timestamp: Date.now(),
        trigger: 'lifecycle',
      },
    });

    log.debug(`🗑️  Slice cleaned up: ${config.feature}/${sliceName}`);
  }

  // ============================================================================
  // MANUAL CONTROLS
  // ============================================================================

  pinSlice(sliceName: string): void {
    const state = this.sliceStates.get(sliceName);
    if (state) {
      state.isPinned = true;
      if (state.cleanupTimeout) {
        clearTimeout(state.cleanupTimeout);
        state.cleanupTimeout = undefined;
      }
      log.debug(`📌 Slice pinned: ${sliceName}`);
    }
  }

  unpinSlice(sliceName: string): void {
    const state = this.sliceStates.get(sliceName);
    if (state) {
      state.isPinned = false;
      // Re-evaluate cleanup now that it's unpinned
      this.evaluateSliceCleanup(sliceName, 'manual');
      log.debug(`📌❌ Slice unpinned: ${sliceName}`);
    }
  }

  manualCleanup(sliceName: string): void {
    log.debug(`🔧 Manual cleanup requested for: ${sliceName}`);
    this.executeSliceCleanup(sliceName);
  }

  cleanupFeature(featureName: string): void {
    const featureConfig = this.featureRoutes.get(featureName);
    if (featureConfig) {
      featureConfig.slices.forEach(sliceName => {
        this.manualCleanup(sliceName);
      });
      log.debug(`🗑️  Feature cleaned up: ${featureName}`);
    }
  }

  cleanupAllInactive(): void {
    this.sliceStates.forEach((state, sliceName) => {
      if (
        !state.isRouteActive &&
        state.activeComponents.size === 0 &&
        !state.isPinned
      ) {
        this.manualCleanup(sliceName);
      }
    });
  }

  // ============================================================================
  // PUBLIC API FOR SAGA INTEGRATION
  // ============================================================================

  getSliceConfig(sliceName: string): SliceConfig | undefined {
    return this.slices.get(sliceName);
  }

  updateSliceAccess(sliceName: string): void {
    const state = this.sliceStates.get(sliceName);
    if (state) {
      state.lastAccessed = Date.now();
    }
  }

  isSliceCachingEnabled(sliceName: string): boolean {
    const config = this.slices.get(sliceName);
    return config?.cleanupStrategy === 'cached';
  }

  getSliceLastAccessed(sliceName: string): number {
    const state = this.sliceStates.get(sliceName);
    return state?.lastAccessed || 0;
  }

  // ============================================================================
  // STATUS & DEBUGGING
  // ============================================================================

  getSliceStatus(): Record<string, unknown> {
    const status: Record<string, unknown> = {};

    this.sliceStates.forEach((state, sliceName) => {
      const config = this.slices.get(sliceName);
      status[sliceName] = {
        feature: config?.feature,
        strategy: config?.cleanupStrategy,
        activeComponents: state.activeComponents.size,
        componentIds: Array.from(state.activeComponents),
        isRouteActive: state.isRouteActive,
        isPinned: state.isPinned,
        lastAccessed: new Date(state.lastAccessed).toISOString(),
        hasCleanupTimeout: !!state.cleanupTimeout,
      };
    });

    return status;
  }

  getFeatureStatus(): Record<string, unknown> {
    const status: Record<string, unknown> = {};

    this.featureRoutes.forEach((config, featureName) => {
      const sliceStatuses = config.slices.map(sliceName => {
        const state = this.sliceStates.get(sliceName);
        return {
          name: sliceName,
          active:
            state?.isRouteActive || (state?.activeComponents.size || 0) > 0,
          components: state?.activeComponents.size || 0,
          pinned: state?.isPinned || false,
        };
      });

      status[featureName] = {
        slices: sliceStatuses,
        isAnySliceActive: sliceStatuses.some(s => s.active),
      };
    });

    return status;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let sliceManagerInstance: SliceLifecycleManager | null = null;
let featuresConfigured = false;

export const initializeSliceManager = (
  dispatch: (action: { type: string; payload?: unknown }) => void,
  configureFeatures?: () => void
): SliceLifecycleManager => {
  if (!sliceManagerInstance) {
    sliceManagerInstance = new SliceLifecycleManager(dispatch);
  }

  // Configure features only once, even if initializeSliceManager is called multiple times
  if (!featuresConfigured && configureFeatures) {
    configureFeatures();
    featuresConfigured = true;
  }

  return sliceManagerInstance;
};

export const getSliceManager = (): SliceLifecycleManager => {
  if (!sliceManagerInstance) {
    throw new Error(
      'Slice Manager not initialized. Call initializeSliceManager first.'
    );
  }
  return sliceManagerInstance;
};
