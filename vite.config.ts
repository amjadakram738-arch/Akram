import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'copy-assets',
      closeBundle() {
        if (!existsSync('dist')) mkdirSync('dist');
        copyFileSync('manifest.json', 'dist/manifest.json');
        if (existsSync('icons')) cpSync('icons', 'dist/icons', { recursive: true });
        if (existsSync('_locales')) cpSync('_locales', 'dist/_locales', { recursive: true });
        if (existsSync('offscreen.html')) copyFileSync('offscreen.html', 'dist/offscreen.html');
        if (existsSync('offscreen.js')) copyFileSync('offscreen.js', 'dist/offscreen.js');
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        content: resolve(__dirname, 'src/content/content.ts'),
        background: resolve(__dirname, 'background.js'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
