import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Configuración mínima de Vite para React. No hace falta modificar este archivo.
export default defineConfig({
  plugins: [react()],
  server: {
    open: false,
  },
})
