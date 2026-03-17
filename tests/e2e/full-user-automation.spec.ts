// tests/e2e/full-user-automation.spec.ts
// 用户级全自动化测试 - 使用Playwright
// 运行方式: npx playwright test tests/e2e/full-user-automation.spec.ts --headed

import { test, expect, Page } from '@playwright/test'

// 测试配置
const BASE_URL = 'http://localhost:8888'

// 辅助函数: 等待引导步骤
async function waitForTutorialStep(page: Page, stepTitle: string) {
  await expect(page.locator('.tutorial-tooltip')).toBeVisible()
  await expect(page.locator(`text=${stepTitle}`)).toBeVisible()
}

// 辅助函数: 点击下一步
async function clickNext(page: Page) {
  await page.click('button:has-text("下一步")')
  await page.waitForTimeout(300)
}

// 辅助函数: 检查高亮元素
async function verifyHighlight(page: Page, selector: string, description: string) {
  const element = page.locator(selector)
  await expect(element).toBeVisible()
  
  // 检查是否有高亮遮罩
  const highlight = page.locator('.tutorial-highlight')
  await expect(highlight).toBeVisible()
  
  console.log(`  ✅ ${description} 高亮显示正常`)
}

test.describe('🎮 星际贸易站 - 用户级全自动化测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 清除localStorage确保测试环境干净
    await page.goto(BASE_URL)
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('📖 完整新手引导12步流程', async ({ page }) => {
    console.log('\n=== 开始新手引导测试 ===\n')
    
    // Step 1: 欢迎界面
    console.log('Step 1/12: 欢迎界面')
    await waitForTutorialStep(page, '欢迎来到星际贸易站')
    await clickNext(page)
    
    // Step 2: 资源采集介绍
    console.log('Step 2/12: 资源采集介绍')
    await waitForTutorialStep(page, '资源采集')
    await verifyHighlight(page, '.resources', '资源区域')
    await clickNext(page)
    
    // Step 3: 出售资源
    console.log('Step 3/12: 出售资源')
    await waitForTutorialStep(page, '出售资源')
    await clickNext(page)
    
    // Step 4: 货币与研究点
    console.log('Step 4/12: 货币与研究点')
    await waitForTutorialStep(page, '货币与研究点')
    await clickNext(page)
    
    // Step 5: 行星导航 (关键修复点)
    console.log('Step 5/12: 行星导航 (关键测试点)')
    await waitForTutorialStep(page, '探索行星')
    await verifyHighlight(page, '.nav-btn[data-nav="planets"]', '行星按钮')
    await clickNext(page)
    
    // Step 6: 解锁星球
    console.log('Step 6/12: 解锁星球')
    await waitForTutorialStep(page, '解锁星球')
    await clickNext(page)
    
    // Step 7: 科技导航 (关键修复点)
    console.log('Step 7/12: 科技导航 (关键测试点)')
    await waitForTutorialStep(page, '科技研究')
    await verifyHighlight(page, '.nav-btn[data-nav="tech"]', '科技按钮')
    await clickNext(page)
    
    // Step 8: 研究科技
    console.log('Step 8/12: 研究科技')
    await waitForTutorialStep(page, '研究科技')
    await clickNext(page)
    
    // Step 9: 探险导航 (关键修复点)
    console.log('Step 9/12: 探险导航 (关键测试点)')
    await waitForTutorialStep(page, '派遣探险')
    await verifyHighlight(page, '.nav-btn[data-nav="expeditions"]', '探险按钮')
    await clickNext(page)
    
    // Step 10: 开始探险
    console.log('Step 10/12: 开始探险')
    await waitForTutorialStep(page, '开始探险')
    await clickNext(page)
    
    // Step 11: 成就系统 (关键修复点)
    console.log('Step 11/12: 成就系统 (关键测试点)')
    await waitForTutorialStep(page, '成就系统')
    await verifyHighlight(page, '.nav-btn[data-nav="achievements"]', '成就按钮')
    
    // 验证奖励显示
    await expect(page.locator('text=完成奖励')).toBeVisible()
    await expect(page.locator('text=💰 500 货币')).toBeVisible()
    await clickNext(page)
    
    // Step 12: 引导完成
    console.log('Step 12/12: 引导完成')
    await waitForTutorialStep(page, '引导完成')
    await page.click('button:has-text("完成引导")')
    
    // 验证引导关闭
    await expect(page.locator('.tutorial-tooltip')).not.toBeVisible()
    
    // 验证货币增加 (1000 + 500 = 1500)
    await expect(page.locator('text=1500')).toBeVisible()
    
    console.log('\n✅ 完整12步引导测试通过！\n')
  })

  test('🎮 主菜单功能测试', async ({ page }) => {
    console.log('\n=== 主菜单功能测试 ===\n')
    
    // 跳过引导
    await page.click('button:has-text("跳过引导")')
    await page.on('dialog', dialog => dialog.accept())
    
    // 测试: 新游戏
    console.log('测试: 新游戏按钮')
    await page.click('button:has-text("🎮 新游戏")')
    await expect(page.locator('text=星际贸易站')).toBeVisible()
    await expect(page.locator('text=💰 1,000')).toBeVisible()
    console.log('  ✅ 新游戏启动成功')
    
    // 测试: 设置按钮
    console.log('测试: 设置按钮')
    await page.click('button:has-text("⚙️ 设置")')
    await expect(page.locator('text=⚙️ 设置')).toBeVisible()
    console.log('  ✅ 设置面板打开成功')
    
    // 测试: 返回按钮
    console.log('测试: 返回按钮')
    await page.click('button:has-text("← 返回")')
    await expect(page.locator('button:has-text("🎮 新游戏")')).toBeVisible()
    console.log('  ✅ 返回功能正常')
    
    // 测试: 关于按钮
    console.log('测试: 关于按钮')
    await page.click('button:has-text("ℹ️ 关于")')
    await expect(page.locator('text=关于游戏')).toBeVisible()
    console.log('  ✅ 关于面板打开成功')
    
    console.log('\n✅ 主菜单功能测试通过！\n')
  })

  test('⚙️ 设置系统全功能测试', async ({ page }) => {
    console.log('\n=== 设置系统全功能测试 ===\n')
    
    // 跳过引导
    await page.click('button:has-text("跳过引导")')
    await page.on('dialog', dialog => dialog.accept())
    await page.click('button:has-text("🎮 新游戏")')
    
    // 打开设置
    await page.click('button:has-text("⚙️ 设置")')
    
    // 测试: 音频设置
    console.log('测试: 音频设置')
    await expect(page.locator('text=🎵 音频设置')).toBeVisible()
    
    // 调整音量滑块
    const volumeSlider = page.locator('input[type="range"]').first()
    await volumeSlider.fill('0.5')
    console.log('  ✅ 音量滑块可调节')
    
    // 测试: 显示设置
    console.log('测试: 显示设置')
    await page.click('button:has-text("🖥️ 显示")')
    await expect(page.locator('text=🖥️ 显示设置')).toBeVisible()
    
    // 测试分辨率选择
    await page.selectOption('select', '1280x720')
    console.log('  ✅ 分辨率可选择')
    
    // 测试: 游戏设置
    console.log('测试: 游戏设置')
    await page.click('button:has-text("🎮 游戏")')
    await expect(page.locator('text=🎮 游戏设置')).toBeVisible()
    console.log('  ✅ 游戏设置标签正常')
    
    // 测试: 辅助功能
    console.log('测试: 辅助功能')
    await page.click('button:has-text("♿ 辅助")')
    await expect(page.locator('text=♿ 辅助功能')).toBeVisible()
    console.log('  ✅ 辅助功能标签正常')
    
    console.log('\n✅ 设置系统全功能测试通过！\n')
  })

  test('🪐 行星系统功能测试', async ({ page }) => {
    console.log('\n=== 行星系统功能测试 ===\n')
    
    // 跳过引导并进入游戏
    await page.click('button:has-text("跳过引导")')
    await page.on('dialog', dialog => dialog.accept())
    await page.click('button:has-text("🎮 新游戏")')
    
    // 进入行星面板
    console.log('测试: 进入行星面板')
    await page.click('button:has-text("🪐 行星")')
    await expect(page.locator('text=🪐 行星管理')).toBeVisible()
    console.log('  ✅ 行星面板打开成功')
    
    // 检查地球已解锁
    console.log('测试: 检查行星列表')
    await expect(page.locator('text=地球')).toBeVisible()
    await expect(page.locator('text=✅ 已解锁')).toBeVisible()
    console.log('  ✅ 地球显示为已解锁')
    
    // 检查火星可解锁
    await expect(page.locator('text=火星')).toBeVisible()
    console.log('  ✅ 火星显示在列表中')
    
    console.log('\n✅ 行星系统功能测试通过！\n')
  })

  test('🔬 科技树功能测试', async ({ page }) => {
    console.log('\n=== 科技树功能测试 ===\n')
    
    // 跳过引导并进入游戏
    await page.click('button:has-text("跳过引导")')
    await page.on('dialog', dialog => dialog.accept())
    await page.click('button:has-text("🎮 新游戏")')
    
    // 进入科技树
    console.log('测试: 进入科技树')
    await page.click('button:has-text("🔬 科技")')
    await expect(page.locator('text=🔬 科技树')).toBeVisible()
    console.log('  ✅ 科技树打开成功')
    
    // 检查科技等级
    console.log('测试: 检查科技等级显示')
    await expect(page.locator('text=T1 科技')).toBeVisible()
    console.log('  ✅ T1科技显示正常')
    
    console.log('\n✅ 科技树功能测试通过！\n')
  })

  test('💾 存档系统功能测试', async ({ page }) => {
    console.log('\n=== 存档系统功能测试 ===\n')
    
    // 跳过引导
    await page.click('button:has-text("跳过引导")')
    await page.on('dialog', dialog => dialog.accept())
    
    // 测试: 读取存档界面
    console.log('测试: 读取存档界面')
    await page.click('button:has-text("💾 读取存档")')
    await expect(page.locator('text=📂 读取存档')).toBeVisible()
    console.log('  ✅ 存档选择界面打开成功')
    
    // 检查10个档位
    console.log('测试: 检查10个档位')
    for (let i = 1; i <= 10; i++) {
      await expect(page.locator(`text=档位 ${i}`)).toBeVisible()
    }
    console.log('  ✅ 10个档位都显示正常')
    
    // 测试返回
    await page.click('button:has-text("← 返回")')
    await expect(page.locator('button:has-text("🎮 新游戏")')).toBeVisible()
    console.log('  ✅ 返回功能正常')
    
    console.log('\n✅ 存档系统功能测试通过！\n')
  })

  test('🎵 音频系统测试', async ({ page }) => {
    console.log('\n=== 音频系统测试 ===\n')
    
    // 跳过引导并进入游戏
    await page.click('button:has-text("跳过引导")')
    await page.on('dialog', dialog => dialog.accept())
    await page.click('button:has-text("🎮 新游戏")')
    
    // 打开设置测试音频
    await page.click('button:has-text("⚙️ 设置")')
    
    console.log('测试: 音频设置面板')
    await expect(page.locator('text=🎵 音频设置')).toBeVisible()
    await expect(page.locator('text=主音量')).toBeVisible()
    await expect(page.locator('text=背景音乐')).toBeVisible()
    await expect(page.locator('text=音效')).toBeVisible()
    console.log('  ✅ 音频设置项都显示正常')
    
    console.log('\n✅ 音频系统测试通过！\n')
  })

  test('🏆 成就系统测试', async ({ page }) => {
    console.log('\n=== 成就系统测试 ===\n')
    
    // 跳过引导并进入游戏
    await page.click('button:has-text("跳过引导")')
    await page.on('dialog', dialog => dialog.accept())
    await page.click('button:has-text("🎮 新游戏")')
    
    // 进入成就面板
    console.log('测试: 进入成就面板')
    await page.click('button:has-text("🏆 成就")')
    await expect(page.locator('text=🏆 成就')).toBeVisible()
    console.log('  ✅ 成就面板打开成功')
    
    // 检查进度条
    console.log('测试: 检查成就进度')
    await expect(page.locator('.progress-bar')).toBeVisible()
    console.log('  ✅ 成就进度条显示正常')
    
    console.log('\n✅ 成就系统测试通过！\n')
  })

  test('🔍 CSS选择器兼容性最终验证', async ({ page }) => {
    console.log('\n=== CSS选择器兼容性最终验证 ===\n')
    
    // 进入引导
    console.log('验证: 引导步骤高亮元素')
    
    const steps = [
      { name: 'Step 5 - 行星导航', selector: '.nav-btn[data-nav="planets"]' },
      { name: 'Step 7 - 科技导航', selector: '.nav-btn[data-nav="tech"]' },
      { name: 'Step 9 - 探险导航', selector: '.nav-btn[data-nav="expeditions"]' },
      { name: 'Step 11 - 成就系统', selector: '.nav-btn[data-nav="achievements"]' },
    ]
    
    // 快速跳过到关键步骤验证
    for (let i = 0; i < 4; i++) {
      await page.click('button:has-text("下一步")')
      await page.waitForTimeout(200)
    }
    
    // Step 5验证
    await expect(page.locator(steps[0].selector)).toBeVisible()
    console.log(`  ✅ ${steps[0].name}: 选择器有效`)
    
    // 继续到Step 7
    for (let i = 0; i < 2; i++) {
      await page.click('button:has-text("下一步")')
      await page.waitForTimeout(200)
    }
    await expect(page.locator(steps[1].selector)).toBeVisible()
    console.log(`  ✅ ${steps[1].name}: 选择器有效`)
    
    console.log('\n✅ CSS选择器兼容性最终验证通过！\n')
  })
})

// 测试报告
test.afterAll(async () => {
  console.log('\n==================================')
  console.log('🎉 全自动化测试套件执行完毕！')
  console.log('==================================\n')
})
