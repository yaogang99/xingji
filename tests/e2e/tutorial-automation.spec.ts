// tests/e2e/tutorial-automation.spec.ts
// 新手引导全自动化测试 - 使用Playwright

import { test, expect } from '@playwright/test'

test.describe('新手引导自动化测试', () => {
  test.beforeEach(async ({ page }) => {
    // 清除localStorage确保引导从新开始
    await page.goto('http://localhost:8888')
    await page.evaluate(() => {
      localStorage.removeItem('star_trade_station_tutorial')
    })
    await page.reload()
  })

  test('完整12步引导流程', async ({ page }) => {
    // Step 1: 欢迎界面
    console.log('Step 1: 检查欢迎界面')
    await expect(page.locator('.tutorial-tooltip')).toBeVisible()
    await expect(page.locator('text=欢迎来到星际贸易站')).toBeVisible()
    
    // 点击下一步
    await page.click('button:has-text("下一步")')
    
    // Step 2: 资源采集介绍
    console.log('Step 2: 检查资源采集介绍')
    await expect(page.locator('text=资源采集')).toBeVisible()
    await page.click('button:has-text("下一步")')
    
    // Step 3: 出售资源
    console.log('Step 3: 检查出售资源')
    await expect(page.locator('text=出售资源')).toBeVisible()
    await page.click('button:has-text("下一步")')
    
    // Step 4: 货币与研究点
    console.log('Step 4: 检查货币介绍')
    await expect(page.locator('text=货币与研究点')).toBeVisible()
    await page.click('button:has-text("下一步")')
    
    // Step 5: 行星导航 - 关键修复点
    console.log('Step 5: 检查行星导航（关键测试点）')
    await expect(page.locator('text=探索行星')).toBeVisible()
    
    // 验证高亮元素是否存在（使用data-nav属性）
    const planetBtn = page.locator('.nav-btn[data-nav="planets"]')
    await expect(planetBtn).toBeVisible()
    
    // 点击下一步
    await page.click('button:has-text("下一步")')
    
    // Step 6: 解锁星球
    console.log('Step 6: 检查解锁星球')
    await expect(page.locator('text=解锁星球')).toBeVisible()
    await page.click('button:has-text("下一步")')
    
    // Step 7: 科技导航
    console.log('Step 7: 检查科技导航（关键测试点）')
    await expect(page.locator('text=科技研究')).toBeVisible()
    
    // 验证高亮元素
    const techBtn = page.locator('.nav-btn[data-nav="tech"]')
    await expect(techBtn).toBeVisible()
    
    await page.click('button:has-text("下一步")')
    
    // Step 8: 研究科技
    console.log('Step 8: 检查研究科技')
    await expect(page.locator('text=研究科技')).toBeVisible()
    await page.click('button:has-text("下一步")')
    
    // Step 9: 探险导航
    console.log('Step 9: 检查探险导航（关键测试点）')
    await expect(page.locator('text=派遣探险')).toBeVisible()
    
    // 验证高亮元素
    const expBtn = page.locator('.nav-btn[data-nav="expeditions"]')
    await expect(expBtn).toBeVisible()
    
    await page.click('button:has-text("下一步")')
    
    // Step 10: 开始探险
    console.log('Step 10: 检查开始探险')
    await expect(page.locator('text=开始探险')).toBeVisible()
    await page.click('button:has-text("下一步")')
    
    // Step 11: 成就系统
    console.log('Step 11: 检查成就系统（关键测试点）')
    await expect(page.locator('text=成就系统')).toBeVisible()
    
    // 验证高亮元素
    const achBtn = page.locator('.nav-btn[data-nav="achievements"]')
    await expect(achBtn).toBeVisible()
    
    await page.click('button:has-text("下一步")')
    
    // Step 12: 引导完成
    console.log('Step 12: 检查引导完成')
    await expect(page.locator('text=引导完成')).toBeVisible()
    
    // 点击完成按钮
    await page.click('button:has-text("完成引导")')
    
    // 验证引导已关闭
    await expect(page.locator('.tutorial-tooltip')).not.toBeVisible()
    
    console.log('✅ 完整12步引导测试通过！')
  })

  test('引导跳过功能', async ({ page }) => {
    console.log('测试引导跳过功能')
    
    // 点击跳过
    await page.click('button:has-text("跳过引导")')
    
    // 确认对话框 - 点击确定
    page.on('dialog', dialog => dialog.accept())
    
    // 验证引导已关闭
    await expect(page.locator('.tutorial-tooltip')).not.toBeVisible()
    
    // 验证localStorage已更新
    const tutorialState = await page.evaluate(() => {
      return localStorage.getItem('star_trade_station_tutorial')
    })
    expect(JSON.parse(tutorialState).skipped).toBe(true)
    
    console.log('✅ 跳过功能测试通过！')
  })

  test('引导奖励发放', async ({ page }) => {
    console.log('测试引导奖励发放')
    
    // 快速跳过到第11步
    for (let i = 0; i < 10; i++) {
      await page.click('button:has-text("下一步")')
      await page.waitForTimeout(100)
    }
    
    // 在第11步检查奖励显示
    await expect(page.locator('text=完成奖励')).toBeVisible()
    await expect(page.locator('text=💰 500 货币')).toBeVisible()
    
    // 完成引导
    await page.click('button:has-text("完成引导")')
    
    // 验证货币增加
    await expect(page.locator('text=1500')).toBeVisible() // 初始1000 + 奖励500
    
    console.log('✅ 奖励发放测试通过！')
  })

  test('CSS选择器兼容性检查', async ({ page }) => {
    console.log('检查所有引导步骤的CSS选择器')
    
    const steps = [
      { id: 'welcome', selector: null }, // center模式无高亮
      { id: 'resources_intro', selector: '.resources' },
      { id: 'sell_resource', selector: '.sell-btn' },
      { id: 'planets_nav', selector: '.nav-btn[data-nav="planets"]' },
      { id: 'tech_nav', selector: '.nav-btn[data-nav="tech"]' },
      { id: 'expedition_nav', selector: '.nav-btn[data-nav="expeditions"]' },
      { id: 'achievements', selector: '.nav-btn[data-nav="achievements"]' },
    ]
    
    for (const step of steps) {
      if (step.selector) {
        // 检查选择器是否有效
        const element = page.locator(step.selector)
        const count = await element.count()
        
        if (count === 0) {
          console.error(`❌ 步骤 ${step.id} 的选择器无效: ${step.selector}`)
          throw new Error(`CSS选择器无效: ${step.selector}`)
        } else {
          console.log(`✅ 步骤 ${step.id} 的选择器有效: ${step.selector}`)
        }
      }
    }
    
    console.log('✅ 所有CSS选择器兼容性检查通过！')
  })
})
