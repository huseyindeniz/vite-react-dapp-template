import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    __VITE_REACT_DAPP_TEMPLATE_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    modulePreload: {
      resolveDependencies: (_url, _deps, _context) => {
        return [];
      },
    },
    rollupOptions: {
      output: {
        sourcemap: false,
        manualChunks: {
          ethers: ['ethers'],
          router: ['react-router-dom'],
          rtk: ['@reduxjs/toolkit'],
          redux: ['react-redux'],
          mantine: ['@mantine/core', '@mantine/hooks'],
        },
      },
    },
  },
});
