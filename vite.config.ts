import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Electron 需要相对路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})