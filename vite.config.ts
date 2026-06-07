import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'
export default defineConfig({
  base: '/dfk-hero-viewer/',
  plugins: [react(), svgr()],
  server: { port: 5174 },
  build: {
    rollupOptions: {
      output: {
        // Split the heavy, rarely-changing vendor code into its own long-lived chunks. ethers is by far the largest dependency and the React runtime is stable across releases, so giving each a dedicated chunk keeps its content hash steady when only app code changes — returning visitors reload just the small app chunk and serve ethers/react from cache instead of re-downloading the whole bundle on every deploy.
        manualChunks: {
          ethers: ['ethers'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
