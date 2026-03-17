// tests/e2e/aerospace-test.config.ts
// 航天级全自动游戏测试配置

export interface TestScenario {
  id: string
  name: string
  description: string
  steps: TestStep[]
  assertions: TestAssertion[]
  timeout: number // ms
}

export interface TestStep {
  action: 'click' | 'type' | 'wait' | 'navigate' | 'assert'
  target?: string // selector
  value?: string
  delay?: number
}

export interface TestAssertion {
  type: 'visible' | 'text' | 'value' | 'count'
  target: string
  expected: string | number | boolean
  operator?: 'eq' | 'gt' | 'lt' | 'contains'
}

// 航天级测试场景
export const AEROSPACE_TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'TC001',
    name: '游戏初始化测试',
    description: '验证游戏启动、资源加载、UI渲染',
    timeout: 10000,
    steps: [
      { action: 'navigate', value: '/?test=true' },
      { action: 'wait', delay: 3000 },
      { action: 'assert', target: '#root', value: 'loaded' },
    ],
    assertions: [
      { type: 'visible', target: '.header', expected: true },
      { type: 'text', target: '.header h1', expected: '星际贸易站', operator: 'contains' },
      { type: 'count', target: '.resource-item', expected: 30, operator: 'eq' },
    ],
  },
  {
    id: 'TC002',
    name: '资源交易测试',
    description: '验证资源出售、价格更新、货币增加',
    timeout: 15000,
    steps: [
      { action: 'click', target: '[data-resource="iron_ore"] .sell-btn', delay: 500 },
      { action: 'wait', delay: 1000 },
      { action: 'click', target: '[data-resource="copper_ore"] .sell-btn', delay: 500 },
      { action: 'wait', delay: 2000 },
    ],
    assertions: [
      { type: 'gt', target: '.credits', expected: 1000 },
      { type: 'lt', target: '[data-resource="iron_ore"] .amount', expected: 1 },
    ],
  },
  {
    id: 'TC003',
    name: '科技研究测试',
    description: '验证科技树显示、研究解锁、研究点消耗',
    timeout: 20000,
    steps: [
      { action: 'click', target: 'button:has-text("科技")', delay: 500 },
      { action: 'wait', delay: 1000 },
      { action: 'assert', target: '.tech-tree', expected: true },
      { action: 'click', target: '.tech-card:first-child .research-btn', delay: 500 },
      { action: 'wait', delay: 2000 },
    ],
    assertions: [
      { type: 'visible', target: '.tech-card.researched', expected: true },
      { type: 'text', target: '.research-points', expected: '研究点', operator: 'contains' },
    ],
  },
  {
    id: 'TC004',
    name: '行星解锁测试',
    description: '验证行星列表、解锁条件、解锁后状态',
    timeout: 15000,
    steps: [
      { action: 'click', target: 'button:has-text("行星")', delay: 500 },
      { action: 'wait', delay: 1000 },
      { action: 'assert', target: '.planet-panel', expected: true },
      { action: 'click', target: '.planet-card:first-child .unlock-btn', delay: 500 },
      { action: 'wait', delay: 2000 },
    ],
    assertions: [
      { type: 'count', target: '.planet-card.unlocked', expected: 2, operator: 'eq' },
      { type: 'visible', target: '.planet-card:first-child .status.unlocked', expected: true },
    ],
  },
  {
    id: 'TC005',
    name: '探险系统测试',
    description: '验证飞船列表、探险派遣、事件生成',
    timeout: 25000,
    steps: [
      { action: 'click', target: 'button:has-text("探险")', delay: 500 },
      { action: 'wait', delay: 1000 },
      { action: 'assert', target: '.expedition-panel', expected: true },
      { action: 'click', target: '.ship-card:first-child button:has-text("派遣")', delay: 500 },
      { action: 'wait', delay: 5000 },
      { action: 'click', target: '.complete-btn', delay: 500 },
      { action: 'wait', delay: 2000 },
    ],
    assertions: [
      { type: 'visible', target: '.expedition-events', expected: true },
      { type: 'gt', target: '.credits', expected: 1000 },
    ],
  },
  {
    id: 'TC006',
    name: '离线收益测试',
    description: '验证离线收益计算、时间补偿、事件生成',
    timeout: 20000,
    steps: [
      { action: 'navigate', value: '/?test=true&offline=3600' },
      { action: 'wait', delay: 3000 },
      { action: 'assert', target: '.offline-rewards', expected: true },
      { action: 'click', target: '.claim-rewards-btn', delay: 500 },
      { action: 'wait', delay: 2000 },
    ],
    assertions: [
      { type: 'gt', target: '.credits', expected: 1000 },
      { type: 'visible', target: '.offline-events', expected: true },
    ],
  },
  {
    id: 'TC007',
    name: '存档系统测试',
    description: '验证存档保存、加载、数据一致性',
    timeout: 20000,
    steps: [
      { action: 'click', target: 'button:has-text("设置")', delay: 500 },
      { action: 'wait', delay: 1000 },
      { action: 'click', target: 'button:has-text("保存游戏")', delay: 500 },
      { action: 'wait', delay: 2000 },
      { action: 'navigate', value: '/?test=true' },
      { action: 'wait', delay: 3000 },
    ],
    assertions: [
      { type: 'gt', target: '.credits', expected: 0 },
      { type: 'visible', target: '.resource-list', expected: true },
    ],
  },
  {
    id: 'TC008',
    name: 'UI响应测试',
    description: '验证界面响应、动画流畅、无卡顿',
    timeout: 15000,
    steps: [
      { action: 'click', target: 'button:has-text("行星")', delay: 200 },
      { action: 'click', target: 'button:has-text("科技")', delay: 200 },
      { action: 'click', target: 'button:has-text("探险")', delay: 200 },
      { action: 'click', target: 'button:has-text("成就")', delay: 200 },
      { action: 'click', target: 'button:has-text("设置")', delay: 200 },
      { action: 'click', target: 'h1', delay: 500 },
    ],
    assertions: [
      { type: 'visible', target: '.main', expected: true },
      { type: 'visible', target: '.header', expected: true },
    ],
  },
  {
    id: 'TC009',
    name: '错误处理测试',
    description: '验证异常输入、边界条件、错误恢复',
    timeout: 15000,
    steps: [
      { action: 'click', target: 'button:has-text("行星")', delay: 500 },
      { action: 'click', target: '.planet-card:last-child .unlock-btn', delay: 500 },
      { action: 'wait', delay: 1000 },
      { action: 'assert', target: '.error-message', expected: true },
    ],
    assertions: [
      { type: 'visible', target: '.error-message', expected: true },
      { type: 'text', target: '.error-message', expected: '不足', operator: 'contains' },
    ],
  },
  {
    id: 'TC010',
    name: '性能基准测试',
    description: '验证渲染性能、内存使用、响应时间',
    timeout: 30000,
    steps: [
      { action: 'navigate', value: '/?test=true&perf=true' },
      { action: 'wait', delay: 5000 },
      { action: 'click', target: 'button:has-text("行星")', delay: 100 },
      { action: 'click', target: 'button:has-text("科技")', delay: 100 },
      { action: 'click', target: 'button:has-text("探险")', delay: 100 },
      { action: 'wait', delay: 5000 },
    ],
    assertions: [
      { type: 'lt', target: '[data-fps]', expected: 60 },
      { type: 'lt', target: '[data-memory]', expected: 100 },
    ],
  },
]

// 测试执行配置
export const TEST_CONFIG = {
  // 基础配置
  baseURL: 'http://localhost:4173',
  headless: false,
  viewport: { width: 1280, height: 720 },
  
  // 重试配置
  retries: 2,
  retryDelay: 1000,
  
  // 性能阈值
  performance: {
    maxLoadTime: 3000,      // 3秒内加载完成
    maxMemoryUsage: 100,     // 100MB内存上限
    minFPS: 30,              // 最低30fps
    maxInputDelay: 100,      // 输入延迟<100ms
  },
  
  // 覆盖率要求
  coverage: {
    statements: 90,
    branches: 85,
    functions: 90,
    lines: 90,
  },
}

// 测试报告模板
export interface TestReport {
  timestamp: number
  duration: number
  total: number
  passed: number
  failed: number
  skipped: number
  scenarios: ScenarioReport[]
  performance: PerformanceMetrics
}

export interface ScenarioReport {
  id: string
  name: string
  status: 'passed' | 'failed' | 'skipped'
  duration: number
  steps: StepReport[]
  assertions: AssertionReport[]
  error?: string
}

export interface StepReport {
  action: string
  status: 'passed' | 'failed'
  duration: number
  error?: string
}

export interface AssertionReport {
  type: string
  target: string
  expected: unknown
  actual: unknown
  status: 'passed' | 'failed'
}

export interface PerformanceMetrics {
  loadTime: number
  maxMemory: number
  avgFPS: number
  maxInputDelay: number
}
