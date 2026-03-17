// vite.config.ts - Electron 优化配置
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // 关键：相对路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Electron 需要禁用模块预加载
    modulePreload: false,
    // 输出格式兼容 Electron
    rollupOptions: {
      output: {
        // 禁用代码分割，避免动态导入问题
        inlineDynamicImports: true,
        // 确保输出格式兼容
        format: 'iife',
      }
    }
  },
  // 优化 Electron 加载
  optimizeDeps: {
    exclude: ['electron']
  }
})
