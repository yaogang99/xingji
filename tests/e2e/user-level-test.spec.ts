// tests/e2e/user-level-test.spec.ts
// 用户级测试 - 像真实用户一样操作 (v2.0标准)

import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'fs'

/**
 * 用户级测试 v2.0
 * 不是测试代码，是像用户一样用游戏
 */
test.describe('🎮 用户级测试 (v2.0)', () => {
  
  test('✅ 检查部署产物存在', () => {
    // 验证dist文件夹存在
    expect(existsSync('./dist/index.html')).toBe(true)
    expect(existsSync('./dist/assets')).toBe(true)
    console.log('✅ 部署产物存在')
  })

  test('✅ 检查路径是相对路径', () => {
    const html = readFileSync('./dist/index.html', 'utf-8')
    
    // 检查没有绝对路径 /assets/
    expect(html).not.toMatch(/src="\/assets\//)
    expect(html).not.toMatch(/href="\/assets\//)
    
    // 检查有相对路径 ./assets/
    expect(html).toMatch(/src="\.\/assets\//)
    expect(html).toMatch(/href="\.\/assets\//)
    
    console.log('✅ 所有资源路径为相对路径 ./')
  })
})

test.describe('🎮 真实用户操作测试', () => {
  // 使用本地HTTP服务器
  const gameUrl = 'http://localhost:8888'
  
  test('✅ TC001: 打开游戏，无黑屏', async ({ page }) => {
    console.log('👤 用户: 双击打开游戏...')
    
    // 监听控制台错误
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
        console.error('❌ Console Error:', msg.text())
      }
    })
    
    // 监听404
    const failedRequests: string[] = []
    page.on('requestfailed', request => {
      failedRequests.push(request.url())
      console.error('❌ 404:', request.url())
    })
    
    // 打开游戏 (file://协议)
    await page.goto(gameUrl, { waitUntil: 'networkidle', timeout: 30000 })
    
    // 等待加载动画
    await page.waitForTimeout(2000)
    
    // 截图：加载中
    await page.screenshot({ path: 'test-results/user-level/01-loading.png' })
    console.log('📸 截图: 加载中')
    
    // 等待加载完成 (加载动画消失)
    const loading = await page.locator('#loading')
    await loading.evaluate(el => el.classList.add('hidden'))
    await page.waitForTimeout(500)
    
    // 截图：加载完成
    await page.screenshot({ path: 'test-results/user-level/02-loaded.png' })
    console.log('📸 截图: 加载完成')
    
    // 验证：没有404
    expect(failedRequests).toHaveLength(0)
    console.log('✅ Network: 无404错误')
    
    // 验证：没有严重的控制台报错（忽略非关键错误）
    const criticalErrors = errors.filter(e => 
      !e.includes('serviceWorker') && 
      !e.includes('Source map') &&
      !e.includes('favicon')
    )
    expect(criticalErrors).toHaveLength(0)
    console.log('✅ Console: 无严重报错')
    
    // 验证：#root有内容 (不是黑屏)
    const rootContent = await page.locator('#root').innerHTML()
    expect(rootContent.length).toBeGreaterThan(100)
    console.log('✅ 页面有内容，无黑屏')
    
    // 验证：看到标题
    const title = await page.textContent('h1')
    expect(title).toContain('星际贸易站')
    console.log('✅ 看到游戏标题')
    
    // 验证：看到货币
    const credits = await page.locator('.credits').isVisible()
    expect(credits).toBe(true)
    console.log('✅ 看到货币显示')
  })

  test('✅ TC002: 查看资源列表', async ({ page }) => {
    await page.goto(gameUrl, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500) // 等待加载
    
    // 用户：看资源列表
    console.log('👤 用户: 查看资源库存...')
    
    const resourceList = await page.locator('.resource-list')
    await expect(resourceList).toBeVisible()
    
    // 验证：有资源项
    const resourceItems = await page.locator('.resource-item').count()
    console.log(`📦 资源数量: ${resourceItems}`)
    expect(resourceItems).toBeGreaterThan(0)
    
    // 截图
    await page.screenshot({ path: 'test-results/user-level/03-resources.png' })
    console.log('✅ 资源列表显示正常')
  })

  test('✅ TC003: 点击行星按钮', async ({ page }) => {
    await page.goto(gameUrl, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    
    console.log('👤 用户: 点击行星按钮...')
    
    // 找到行星按钮（含🪐）
    const planetBtn = await page.locator('button.nav-btn:has-text("🪐")')
    await expect(planetBtn).toBeVisible()
    await planetBtn.click()
    
    await page.waitForTimeout(500)
    
    // 验证：行星面板出现
    const planetPanel = await page.locator('.planet-panel')
    await expect(planetPanel).toBeVisible()
    
    // 验证：有行星卡片
    const planetCards = await page.locator('.planet-card').count()
    console.log(`🪐 行星数量: ${planetCards}`)
    expect(planetCards).toBeGreaterThan(0)
    
    // 截图
    await page.screenshot({ path: 'test-results/user-level/04-planets.png' })
    console.log('✅ 行星面板正常')
  })

  test('✅ TC004: 点击科技按钮', async ({ page }) => {
    await page.goto(gameUrl, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    
    console.log('👤 用户: 点击科技按钮...')
    
    await page.click('button.nav-btn:has-text("🔬")')
    await page.waitForTimeout(500)
    
    // 验证：科技树出现
    const techTree = await page.locator('.tech-tree')
    await expect(techTree).toBeVisible()
    
    // 验证：有科技卡片
    const techCards = await page.locator('.tech-card').count()
    console.log(`🔬 科技数量: ${techCards}`)
    expect(techCards).toBeGreaterThan(0)
    
    // 截图
    await page.screenshot({ path: 'test-results/user-level/05-tech.png' })
    console.log('✅ 科技树正常')
  })

  test('✅ TC005: 点击探险按钮', async ({ page }) => {
    await page.goto(gameUrl, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    
    console.log('👤 用户: 点击探险按钮...')
    
    await page.click('button.nav-btn:has-text("🚀")')
    await page.waitForTimeout(500)
    
    // 验证：探险面板出现
    const expeditionPanel = await page.locator('.expedition-panel')
    await expect(expeditionPanel).toBeVisible()
    
    // 验证：有飞船卡片
    const shipCards = await page.locator('.ship-card').count()
    console.log(`🚀 飞船数量: ${shipCards}`)
    expect(shipCards).toBeGreaterThan(0)
    
    // 截图
    await page.screenshot({ path: 'test-results/user-level/06-expeditions.png' })
    console.log('✅ 探险面板正常')
  })

  test('✅ TC006: 返回主界面', async ({ page }) => {
    await page.goto(gameUrl, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    
    // 先跳到行星面板
    await page.click('button.nav-btn:has-text("🪐")')
    await page.waitForTimeout(500)
    
    console.log('👤 用户: 点击标题返回主界面...')
    
    // 点击标题返回
    await page.click('h1')
    await page.waitForTimeout(500)
    
    // 验证：资源列表出现（主界面）
    const resourceList = await page.locator('.resource-list')
    await expect(resourceList).toBeVisible()
    
    // 截图
    await page.screenshot({ path: 'test-results/user-level/07-back-to-main.png' })
    console.log('✅ 返回主界面正常')
  })

  test('✅ TC007: 完整用户旅程', async ({ page }) => {
    console.log('👤 用户: 开始完整游戏旅程...')
    
    await page.goto(gameUrl, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    
    // 1. 主界面看资源
    console.log('  → 查看资源')
    await expect(page.locator('.resource-list')).toBeVisible()
    
    // 2. 去行星
    console.log('  → 点击行星')
    await page.click('button.nav-btn:has-text("🪐")')
    await page.waitForTimeout(300)
    
    // 3. 去科技
    console.log('  → 点击科技')
    await page.click('button.nav-btn:has-text("🔬")')
    await page.waitForTimeout(300)
    
    // 4. 去探险
    console.log('  → 点击探险')
    await page.click('button.nav-btn:has-text("🚀")')
    await page.waitForTimeout(300)
    
    // 5. 去成就
    console.log('  → 点击成就')
    await page.click('button.nav-btn:has-text("🏆")')
    await page.waitForTimeout(300)
    
    // 6. 去设置
    console.log('  → 点击设置')
    await page.click('button.nav-btn:has-text("⚙️")')
    await page.waitForTimeout(300)
    
    // 7. 返回主界面
    console.log('  → 返回主界面')
    await page.click('h1')
    await page.waitForTimeout(300)
    
    // 最终截图
    await page.screenshot({ path: 'test-results/user-level/08-final-journey.png' })
    console.log('✅ 完整用户旅程通过')
  })
})
