import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Configuración de Vite para React y del entorno de pruebas del proyecto.
export default defineConfig({
  plugins: [react()],
  server: {
    open: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
