import path from 'path';

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, ViteUserConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()] as ViteUserConfig['plugins'],
  resolve: {
    alias: {
      '@test-utils': path.resolve(__dirname, './src/test-utils'),
    },
  },
  test: {
    // some paths to the files that are test files
    include: ['./**/*.test.ts', './**/*.test.tsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!<rootDir>/node_modules/',
        '!<rootDir>/services/ethersV6',
      ],
      thresholds: {
        branches: 30,
        functions: 30,
        lines: 30,
        statements: 30,
      },
    },
  },
});
