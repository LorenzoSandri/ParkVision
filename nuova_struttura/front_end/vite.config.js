import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Questo permette di usare '@' come scorciatoia per la cartella front_end
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    port: 5173, // La porta dove vedrai il sito
    proxy: {
      '/API': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});