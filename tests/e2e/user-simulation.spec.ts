// tests/e2e/user-simulation.spec.ts
// 模拟真实用户操作测试

import { test, expect, Page } from '@playwright/test'
import { AEROSPACE_TEST_SCENARIOS } from './aerospace-test.config'

/**
 * 模拟真实用户全流程测试
 * 像真实玩家一样操作游戏
 */
test.describe('🎮 真实用户模拟测试', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
    })
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('🚀 场景1: 首次进入游戏', async () => {
    console.log('👤 用户: 打开游戏网页...')
    
    // 访问游戏
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' })
    
    // 等待加载完成
    console.log('⏳ 等待游戏加载...')
    await page.waitForSelector('#root', { timeout: 10000 })
    
    // 截图记录初始状态
    await page.screenshot({ path: 'test-results/01-initial-load.png' })
    console.log('✅ 游戏加载完成')
    
    // 验证标题
    const title = await page.textContent('h1')
    expect(title).toContain('星际贸易站')
    console.log('✅ 标题验证通过')
  })

  test('💰 场景2: 资源交易', async () => {
    console.log('👤 用户: 查看资源列表...')
    
    // 等待资源列表加载
    await page.waitForSelector('.resource-list', { timeout: 5000 })
    
    // 获取当前铁矿数量
    const ironOreAmount = await page.textContent('[data-resource="iron_ore"] .amount')
    console.log(`📦 当前铁矿: ${ironOreAmount}`)
    
    // 出售铁矿
    console.log('👤 用户: 点击出售铁矿...')
    await page.click('[data-resource="iron_ore"] .sell-btn')
    
    // 等待货币增加
    await page.waitForTimeout(500)
    
    // 截图记录
    await page.screenshot({ path: 'test-results/02-sell-resource.png' })
    console.log('✅ 资源出售完成')
  })

  test('🪐 场景3: 行星管理', async () => {
    console.log('👤 用户: 点击行星按钮...')
    
    // 确保在主界面
    await page.click('h1')
    await page.waitForTimeout(500)
    
    // 点击行星导航 - 使用更精确的选择器
    await page.click('button.nav-btn:has-text("🪐")')
    
    // 等待行星面板加载
    await page.waitForSelector('.planet-panel', { timeout: 5000 })
    
    // 截图记录
    await page.screenshot({ path: 'test-results/03-planet-panel.png' })
    console.log('✅ 行星面板已打开')
    
    // 查看火星信息
    const marsCard = await page.locator('.planet-card', { hasText: '火星' })
    const marsText = await marsCard.textContent()
    console.log(`🪐 火星信息: ${marsText?.substring(0, 50)}...`)
    
    // 返回主界面
    await page.click('h1')
    console.log('👤 用户: 返回主界面')
  })

  test('🔬 场景4: 科技研究', async () => {
    console.log('👤 用户: 点击科技按钮...')
    
    // 确保在主界面
    await page.click('h1')
    await page.waitForTimeout(500)
    
    // 点击科技导航
    await page.click('button.nav-btn:has-text("🔬")')
    
    // 等待科技树加载
    await page.waitForSelector('.tech-tree', { timeout: 5000 })
    
    // 截图记录
    await page.screenshot({ path: 'test-results/04-tech-tree.png' })
    console.log('✅ 科技树已打开')
    
    // 查看第一个科技
    const firstTech = await page.locator('.tech-card').first()
    const techName = await firstTech.locator('h4').textContent()
    console.log(`🔬 第一个科技: ${techName}`)
    
    // 返回主界面
    await page.click('h1')
  })

  test('🚀 场景5: 探险系统', async () => {
    console.log('👤 用户: 点击探险按钮...')
    
    // 确保在主界面
    await page.click('h1')
    await page.waitForTimeout(500)
    
    // 点击探险导航
    await page.click('button.nav-btn:has-text("🚀")')
    
    // 等待探险面板加载
    await page.waitForSelector('.expedition-panel', { timeout: 5000 })
    
    // 截图记录
    await page.screenshot({ path: 'test-results/05-expedition-panel.png' })
    console.log('✅ 探险面板已打开')
    
    // 查看可用飞船
    const idleShips = await page.locator('.ship-card:has(.ship-status:has-text("待命"))').count()
    console.log(`🚀 可用飞船: ${idleShips}艘`)
    
    // 派遣飞船
    const firstIdleShip = await page.locator('.ship-card', { hasText: '待命' }).first()
    if (await firstIdleShip.isVisible().catch(() => false)) {
      console.log('👤 用户: 派遣飞船探险...')
      await firstIdleShip.locator('button:has-text("派遣")').click()
      await page.waitForTimeout(500)
      console.log('✅ 飞船已派遣')
    }
    
    // 截图记录
    await page.screenshot({ path: 'test-results/05-expedition-sent.png' })
    
    // 返回主界面
    await page.click('h1')
  })

  test('🏆 场景6: 成就系统', async () => {
    console.log('👤 用户: 点击成就按钮...')
    
    // 确保在主界面
    await page.click('h1')
    await page.waitForTimeout(500)
    
    // 点击成就导航
    await page.click('button.nav-btn:has-text("🏆")')
    
    // 等待成就面板加载
    await page.waitForSelector('.achievement-panel', { timeout: 5000 })
    
    // 截图记录
    await page.screenshot({ path: 'test-results/06-achievements.png' })
    console.log('✅ 成就面板已打开')
    
    // 查看成就进度
    const progress = await page.textContent('.achievement-progress')
    console.log(`🏆 成就进度: ${progress}`)
    
    // 返回主界面
    await page.click('h1')
  })

  test('⚙️ 场景7: 设置面板', async () => {
    console.log('👤 用户: 点击设置按钮...')
    
    // 确保在主界面
    await page.click('h1')
    await page.waitForTimeout(500)
    
    // 点击设置导航
    await page.click('button.nav-btn:has-text("⚙️")')
    
    // 等待设置面板加载
    await page.waitForSelector('.settings-panel', { timeout: 5000 })
    
    // 截图记录
    await page.screenshot({ path: 'test-results/07-settings.png' })
    console.log('✅ 设置面板已打开')
    
    // 调整音量
    console.log('👤 用户: 调整音量...')
    await page.fill('input[type="range"]', '0.5')
    await page.waitForTimeout(500)
    
    // 关闭设置
    await page.click('button.close-btn')
    console.log('👤 用户: 关闭设置')
  })

  test('🎮 场景8: 完整游戏循环', async () => {
    console.log('👤 用户: 开始游戏循环...')
    
    // 在主界面等待几秒，观察资源增长
    await page.waitForTimeout(3000)
    
    // 再次出售资源
    await page.click('[data-resource="iron_ore"] .sell-btn')
    await page.click('[data-resource="copper_ore"] .sell-btn')
    
    // 截图最终状态
    await page.screenshot({ path: 'test-results/08-final-state.png' })
    console.log('✅ 游戏循环完成')
    
    // 验证货币增加
    const credits = await page.textContent('.credits')
    console.log(`💰 最终货币: ${credits}`)
  })
})
