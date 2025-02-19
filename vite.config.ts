import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { UserConfig as VitestUserConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Configura el alias @ para apuntar a 
  // eslint-disable-next-line no-irregular-whitespace
   },
},
      
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: "./setupTests.ts",
    coverage: {
      provider: 'v8', // Usa Istanbul para el reporte de cobertura
      reporter: ['text', 'json', 'html'], // Formatos de reporte
      include: ['src/**/*.{ts,tsx}'], // Incluye solo archivos TypeScript/TSX
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx'], // Excluye archivos de prueba y el punto de entrada
    },
  },
} as VitestUserConfig);