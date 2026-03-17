// playwright.config.ts
// Playwright E2E测试配置 - 航天级测试标准

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  
  // 完全并行运行 - AI可同时处理多个测试
  fullyParallel: true,
  
  // 失败重试2次 - 确保结果稳定
  retries: 2,
  
  // 同时运行4个工作进程
  workers: 4,
  
  // 测试报告器
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
  ],
  
  use: {
    // 基础URL
    baseURL: 'http://localhost:4173',
    
    // 收集所有跟踪信息
    trace: 'on',
    
    // 收集视频
    video: 'on-first-retry',
    
    // 收集截图
    screenshot: 'only-on-failure',
    
    // 视口设置
    viewport: { width: 1280, height: 720 },
    
    // 超时设置
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },
  
  // 项目配置 - 多浏览器测试
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Web服务器配置
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
