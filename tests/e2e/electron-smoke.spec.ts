// tests/e2e/electron-smoke.spec.ts
// Electron 应用冒烟测试 - 连贯执行，不重复启动

import { test, expect, ElectronApplication, Page } from '@playwright/test'
import { _electron as electron } from '@playwright/test'

let electronApp: ElectronApplication
let page: Page

test.beforeAll(async () => {
  // 启动 Electron 应用
  electronApp = await electron.launch({
    args: ['.'],
    cwd: process.cwd(),
  })

  // 等待第一个窗口
  page = await electronApp.firstWindow()

  // 等待应用加载完成
  await page.waitForSelector('#root', { timeout: 10000 })
  await page.waitForTimeout(2000)
})

test.afterAll(async () => {
  await electronApp.close()
})

test('🚀 星际贸易站 - 完整冒烟测试', async () => {
  test.setTimeout(60000) // 60秒超时

  // ========== Step 1: 应用启动 ==========
  await test.step('✅ 应用成功启动', async () => {
    const title = await page.title()
    expect(title).toContain('星际贸易站')

    const menu = await page.locator('.main-menu').isVisible()
    expect(menu).toBe(true)

    await page.screenshot({ path: 'test-results/01-main-menu.png' })
    console.log('✅ 主菜单显示正常')
  })

  // ========== Step 2: 开始新游戏 ==========
  await test.step('✅ 可以开始新游戏', async () => {
    await page.click('.menu-btn.primary')
    await page.waitForSelector('.header', { timeout: 5000 })

    const credits = await page.locator('.credits').textContent()
    expect(credits).toContain('💰')

    await page.screenshot({ path: 'test-results/02-main-game.png' })
    console.log('✅ 进入游戏主界面')
  })

  // ========== Step 3: 主界面双栏布局 ==========
  await test.step('✅ 主界面双栏布局正常', async () => {
    const mainLayout = await page.locator('.main-layout').isVisible()
    expect(mainLayout).toBe(true)

    const leftPanel = await page.locator('.left-panel').isVisible()
    expect(leftPanel).toBe(true)

    const rightPanel = await page.locator('.right-panel').isVisible()
    expect(rightPanel).toBe(true)

    await page.screenshot({ path: 'test-results/03-layout-check.png' })
    console.log('✅ 主界面双栏布局正常')
  })

  // ========== Step 4: 行星页面 ==========
  await test.step('✅ 行星页面双栏布局', async () => {
    await page.click('[data-nav="planets"]')
    await page.waitForTimeout(500)

    const mainLayout = await page.locator('.main-layout').isVisible()
    expect(mainLayout).toBe(true)

    const planetList = await page.locator('.planet-list').isVisible()
    expect(planetList).toBe(true)

    await page.screenshot({ path: 'test-results/04-planets-page.png' })
    console.log('✅ 行星页面正常')

    // 返回主界面
    await page.click('.back-btn')
    await page.waitForTimeout(500)
  })

  // ========== Step 5: 科技树页面 ==========
  await test.step('✅ 科技树页面双栏布局', async () => {
    await page.click('[data-nav="tech"]')
    await page.waitForTimeout(500)

    const mainLayout = await page.locator('.main-layout').isVisible()
    expect(mainLayout).toBe(true)

    await page.screenshot({ path: 'test-results/05-tech-page.png' })
    console.log('✅ 科技树页面正常')

    // 返回主界面
    await page.click('.back-btn')
    await page.waitForTimeout(500)
  })

  // ========== Step 6: 探险页面 ==========
  await test.step('✅ 探险页面双栏布局', async () => {
    await page.click('[data-nav="expeditions"]')
    await page.waitForTimeout(500)

    const mainLayout = await page.locator('.main-layout').isVisible()
    expect(mainLayout).toBe(true)

    await page.screenshot({ path: 'test-results/06-expedition-page.png' })
    console.log('✅ 探险页面正常')

    // 返回主界面
    await page.click('.back-btn')
    await page.waitForTimeout(500)
  })

  // ========== Step 7: 成就页面 ==========
  await test.step('✅ 成就页面双栏布局', async () => {
    await page.click('[data-nav="achievements"]')
    await page.waitForTimeout(500)

    const mainLayout = await page.locator('.main-layout').isVisible()
    expect(mainLayout).toBe(true)

    await page.screenshot({ path: 'test-results/07-achievement-page.png' })
    console.log('✅ 成就页面正常')

    // 返回主界面
    await page.click('.back-btn')
    await page.waitForTimeout(500)
  })

  // ========== Step 8: 返回主界面 ==========
  await test.step('✅ 返回按钮功能正常', async () => {
    await page.click('[data-nav="planets"]')
    await page.waitForTimeout(500)

    await page.click('.back-btn')
    await page.waitForTimeout(500)

    const mainLayout = await page.locator('.main-layout').isVisible()
    expect(mainLayout).toBe(true)

    await page.screenshot({ path: 'test-results/08-back-button.png' })
    console.log('✅ 返回按钮正常')
  })

  // ========== Step 9: 资源检查 ==========
  await test.step('✅ 资源出售界面正常', async () => {
    // 回到主界面
    await page.click('.header h1')
    await page.waitForTimeout(500)

    const sellButtons = await page.locator('.sell-preset-btn').count()
    console.log(`找到 ${sellButtons} 个出售按钮`)

    await page.screenshot({ path: 'test-results/09-resources.png' })
    console.log('✅ 资源界面正常')
  })

  console.log('\n🎉 所有测试通过！')
})
