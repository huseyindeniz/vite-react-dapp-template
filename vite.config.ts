import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: 'build',
    sourcemap: false,
    modulePreload: {
      resolveDependencies: (url, deps, context) => {
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
          chakra: ['@chakra-ui/react'],
        },
      },
    },
  },
});
