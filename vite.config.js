import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Указываем base для правильной работы путей на GitHub Pages
  // При деплое на username.github.io/world-forge/ ассеты будут грузиться корректно
  base: '/world-forge/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        spaceMap: resolve(__dirname, 'space-map/index.html')
      }
    }
  }
});
