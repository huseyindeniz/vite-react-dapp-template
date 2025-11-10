import React from 'react';

export interface ProviderEntry {
  Component: React.ComponentType<{ children?: React.ReactNode }>;
  props?: Record<string, unknown>;
}
