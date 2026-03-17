// debug-test.spec.ts - 调试测试
import { test, expect } from '@playwright/test'

test('调试页面渲染', async ({ page }) => {
  // 监听控制台日志
  const logs: string[] = []
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`
    logs.push(text)
    console.log(text)
  })
  
  page.on('pageerror', error => {
    console.error('[Page Error]', error.message)
  })

  console.log('打开游戏...')
  await page.goto('http://localhost:4173')
  
  console.log('等待页面加载...')
  await page.waitForLoadState('networkidle')
  
  // 等待几秒让React渲染
  await page.waitForTimeout(5000)
  
  // 截图
  await page.screenshot({ path: 'test-results/debug-screenshot.png', fullPage: true })
  console.log('已截图')
  
  // 检查HTML内容
  const html = await page.content()
  console.log('HTML长度:', html.length)
  
  // 检查root元素的内容
  const rootContent = await page.evaluate(() => {
    const root = document.getElementById('root')
    return {
      exists: !!root,
      childCount: root?.children.length || 0,
      innerHTML: root?.innerHTML?.substring(0, 500) || 'empty'
    }
  })
  console.log('Root元素:', JSON.stringify(rootContent, null, 2))
  
  // 检查是否有加载动画还在显示
  const loading = await page.locator('#loading').isVisible().catch(() => false)
  console.log('加载动画显示:', loading)
  
  // 检查错误提示
  const error = await page.locator('#error.visible').isVisible().catch(() => false)
  console.log('错误提示显示:', error)
  
  console.log('\n=== 控制台日志 ===')
  logs.forEach(log => console.log(log))
  
  expect(rootContent.exists).toBe(true)
})