// playwright.electron.config.ts
// Electron 自动化测试配置

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  
  // Electron 测试只需要单进程
  fullyParallel: false,
  workers: 1,
  
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  
  use: {
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  
  // 只运行 Electron 测试
  testMatch: /electron-.*\.spec\.ts/,
})
