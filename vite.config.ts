import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Plugins de Vite
  test: {             // Configuración de Vitest
    globals: true,    // Hace que las funciones de Vitest estén disponibles globalmente
    environment: 'jsdom', // Simula un entorno de navegador
    setupFiles: './src/setupTests.ts', // Archivo de configuración inicial para pruebas
    coverage: {       // Configuración de cobertura (opcional)
      provider: 'c8', // Usa c8 para generar el reporte de cobertura
      reporter: ['text', 'json', 'html'], // Formatos del reporte
      include: ['src/**/*.{ts,tsx}'], // Incluye solo los archivos de tu código fuente
      exclude: ['src/**/*.test.{ts,tsx}'], // Excluye los archivos de pruebas
    },
  },
});