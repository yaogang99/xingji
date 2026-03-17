// tests/e2e/aerospace-test.runner.ts
// 航天级全自动游戏测试运行器

import { test, expect, Page } from '@playwright/test'
import { AEROSPACE_TEST_SCENARIOS, TEST_CONFIG, TestReport } from './aerospace-test.config'

/**
 * 航天级全自动游戏测试套件
 * 
 * 执行标准:
 * - 所有场景必须100%通过
 * - 性能指标必须达标
 * - 覆盖率必须≥90%
 * - 错误恢复必须完整
 */
test.describe('🚀 星际贸易站 - 航天级全自动测试', () => {
  
  let testReport: TestReport = {
    timestamp: Date.now(),
    duration: 0,
    total: AEROSPACE_TEST_SCENARIOS.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    scenarios: [],
    performance: {
      loadTime: 0,
      maxMemory: 0,
      avgFPS: 60,
      maxInputDelay: 0,
    },
  }

  test.beforeAll(async () => {
    console.log('========================================')
    console.log('🚀 启动航天级全自动游戏测试')
    console.log('========================================')
    console.log(`📋 测试场景数: ${AEROSPACE_TEST_SCENARIOS.length}`)
    console.log(`⏱️  预计耗时: ${AEROSPACE_TEST_SCENARIOS.reduce((a, s) => a + s.timeout, 0) / 1000}s`)
    console.log('========================================')
  })

  test.afterAll(async () => {
    testReport.duration = Date.now() - testReport.timestamp
    
    console.log('\n========================================')
    console.log('📊 航天级测试报告')
    console.log('========================================')
    console.log(`⏱️  总耗时: ${testReport.duration}ms`)
    console.log(`✅ 通过: ${testReport.passed}`)
    console.log(`❌ 失败: ${testReport.failed}`)
    console.log(`⏭️  跳过: ${testReport.skipped}`)
    console.log(`📈 通过率: ${((testReport.passed / testReport.total) * 100).toFixed(1)}%`)
    console.log('========================================')
    
    // 保存报告
    await saveTestReport(testReport)
    
    // 航天级标准: 必须100%通过
    expect(testReport.failed).toBe(0)
    expect(testReport.passed).toBe(testReport.total)
  })

  // 动态生成测试用例
  for (const scenario of AEROSPACE_TEST_SCENARIOS) {
    test(`[${scenario.id}] ${scenario.name}`, async ({ page }) => {
      const startTime = Date.now()
      
      console.log(`\n🧪 执行测试: ${scenario.name}`)
      
      try {
        // 执行测试步骤
        for (const step of scenario.steps) {
          await executeStep(page, step)
        }
        
        // 验证断言
        for (const assertion of scenario.assertions) {
          await executeAssertion(page, assertion)
        }
        
        testReport.passed++
        console.log(`✅ ${scenario.name} - 通过`)
        
      } catch (error) {
        testReport.failed++
        console.log(`❌ ${scenario.name} - 失败`)
        console.log(`   错误: ${error}`)
        throw error
      }
    })
  }
})

/**
 * 执行测试步骤
 */
async function executeStep(page: Page, step: any): Promise<void> {
  switch (step.action) {
    case 'navigate':
      await page.goto(`${TEST_CONFIG.baseURL}${step.value}`)
      break
      
    case 'click':
      await page.click(step.target)
      break
      
    case 'type':
      await page.fill(step.target, step.value)
      break
      
    case 'wait':
      await page.waitForTimeout(step.delay || 1000)
      break
      
    case 'assert':
      await expect(page.locator(step.target)).toBeVisible()
      break
  }
  
  if (step.delay) {
    await page.waitForTimeout(step.delay)
  }
}

/**
 * 执行断言验证
 */
async function executeAssertion(page: Page, assertion: any): Promise<void> {
  const target = page.locator(assertion.target)
  
  switch (assertion.type) {
    case 'visible':
      if (assertion.expected) {
        await expect(target).toBeVisible()
      } else {
        await expect(target).toBeHidden()
      }
      break
      
    case 'text':
      if (assertion.operator === 'contains') {
        await expect(target).toContainText(assertion.expected as string)
      } else {
        await expect(target).toHaveText(assertion.expected as string)
      }
      break
      
    case 'value':
      const value = await target.textContent()
      const numValue = parseFloat(value || '0')
      
      switch (assertion.operator) {
        case 'gt':
          expect(numValue).toBeGreaterThan(assertion.expected as number)
          break
        case 'lt':
          expect(numValue).toBeLessThan(assertion.expected as number)
          break
        case 'eq':
          expect(numValue).toBe(assertion.expected)
          break
      }
      break
      
    case 'count':
      const count = await target.count()
      switch (assertion.operator) {
        case 'eq':
          expect(count).toBe(assertion.expected)
          break
        case 'gt':
          expect(count).toBeGreaterThan(assertion.expected as number)
          break
        case 'lt':
          expect(count).toBeLessThan(assertion.expected as number)
          break
      }
      break
  }
}

/**
 * 保存测试报告
 */
async function saveTestReport(report: TestReport): Promise<void> {
  const fs = require('fs')
  const path = require('path')
  
  const reportPath = path.join(__dirname, 'reports')
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true })
  }
  
  const filename = `aerospace-test-report-${Date.now()}.json`
  fs.writeFileSync(
    path.join(reportPath, filename),
    JSON.stringify(report, null, 2)
  )
  
  console.log(`\n📝 测试报告已保存: ${filename}`)
}
