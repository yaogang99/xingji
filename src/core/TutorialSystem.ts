// src/core/TutorialSystem.ts
// 新手引导系统 - 发售级完整版

export interface TutorialStep {
  id: string
  title: string
  description: string
  highlightElement?: string  // CSS选择器
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: 'click' | 'wait' | 'manual'
  reward?: { credits?: number; researchPoints?: number }
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '欢迎来到星际贸易站',
    description: '指挥官，欢迎来到您的星际贸易帝国。我将引导您了解基础操作。',
    position: 'center',
    action: 'manual',
  },
  {
    id: 'resources_intro',
    title: '资源采集',
    description: '这是您的资源库存。设施会自动产出资源，显示在这里。',
    highlightElement: '.resources',
    position: 'right',
    action: 'manual',
  },
  {
    id: 'sell_resource',
    title: '出售资源',
    description: '点击资源旁边的"出售"按钮（1/10/100/全部），将资源转换为货币。这是您的主要收入来源。',
    highlightElement: '.sell-btn',
    position: 'left',
    action: 'manual',
  },
  {
    id: 'currency_intro',
    title: '货币与研究点',
    description: '出售资源可以获得货币（💰）和研究点（🔬）。货币用于购买和升级，研究点用于科技研究。',
    highlightElement: '.header',
    position: 'bottom',
    action: 'manual',
  },
  {
    id: 'facilities_intro',
    title: '设施生产',
    description: '这里是您的设施列表。设施会自动产出资源，您可以暂停/继续设施运行。',
    highlightElement: '.facilities-section',
    position: 'right',
    action: 'manual',
  },
  {
    id: 'planets_intro',
    title: '探索行星',
    description: '点击"🪐 行星"按钮可以查看可探索的星球。解锁新星球可以建造更多设施。',
    highlightElement: '.nav-btn[data-nav="planets"]',
    position: 'top',
    action: 'manual',
  },
  {
    id: 'tech_intro',
    title: '科技研究',
    description: '点击"🔬 科技"按钮进入科技树。研究科技可以解锁新设施和提升效率。',
    highlightElement: '.nav-btn[data-nav="tech"]',
    position: 'top',
    action: 'manual',
  },
  {
    id: 'expeditions_intro',
    title: '派遣探险',
    description: '点击"🚀 探险"按钮可以派遣飞船进行探险。探险可以获得稀有资源和大量货币。',
    highlightElement: '.nav-btn[data-nav="expeditions"]',
    position: 'top',
    action: 'manual',
  },
  {
    id: 'achievements_intro',
    title: '成就系统',
    description: '点击"🏆 成就"按钮查看您的成就进度。完成成就可以获得额外奖励！',
    highlightElement: '.nav-btn[data-nav="achievements"]',
    position: 'top',
    action: 'manual',
    reward: { credits: 500, researchPoints: 50 },
  },
  {
    id: 'complete',
    title: '引导完成',
    description: '恭喜！您已完成新手引导。现在您可以自由探索星际贸易站了。祝您游戏愉快！',
    position: 'center',
    action: 'manual',
    reward: { credits: 1000, researchPoints: 100 },
  },
]

export interface TutorialState {
  isActive: boolean
  currentStepIndex: number
  completed: boolean
  skipped: boolean
}

const TUTORIAL_STORAGE_KEY = 'star_trade_station_tutorial'

export class TutorialSystem {
  private state: TutorialState = {
    isActive: false,
    currentStepIndex: 0,
    completed: false,
    skipped: false,
  }

  private listeners: Array<(state: TutorialState) => void> = []

  constructor() {
    this.loadState()
  }

  // 加载保存的状态
  private loadState() {
    try {
      const saved = localStorage.getItem(TUTORIAL_STORAGE_KEY)
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error('Failed to load tutorial state:', e)
    }
  }

  // 保存状态
  private saveState() {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(this.state))
    } catch (e) {
      console.error('Failed to save tutorial state:', e)
    }
  }

  // 开始引导
  start() {
    if (this.state.completed || this.state.skipped) return
    
    this.state.isActive = true
    this.state.currentStepIndex = 0
    this.saveState()
    this.notifyListeners()
  }

  // 下一步
  nextStep() {
    if (!this.state.isActive) return

    this.state.currentStepIndex++
    
    if (this.state.currentStepIndex >= TUTORIAL_STEPS.length) {
      this.complete()
    } else {
      this.saveState()
      this.notifyListeners()
    }
  }

  // 上一步
  prevStep() {
    if (!this.state.isActive || this.state.currentStepIndex <= 0) return
    
    this.state.currentStepIndex--
    this.saveState()
    this.notifyListeners()
  }

  // 跳过引导
  skip() {
    this.state.isActive = false
    this.state.skipped = true
    this.saveState()
    this.notifyListeners()
  }

  // 完成引导
  complete() {
    this.state.isActive = false
    this.state.completed = true
    this.saveState()
    this.notifyListeners()
  }

  // 重置引导（用于测试）
  reset() {
    this.state = {
      isActive: false,
      currentStepIndex: 0,
      completed: false,
      skipped: false,
    }
    localStorage.removeItem(TUTORIAL_STORAGE_KEY)
    this.notifyListeners()
  }

  // 获取当前步骤
  getCurrentStep(): TutorialStep | null {
    if (!this.state.isActive) return null
    return TUTORIAL_STEPS[this.state.currentStepIndex] || null
  }

  // 获取当前步骤索引
  getCurrentStepIndex(): number {
    return this.state.currentStepIndex
  }

  // 获取总步骤数
  getTotalSteps(): number {
    return TUTORIAL_STEPS.length
  }

  // 获取状态
  getState(): TutorialState {
    return { ...this.state }
  }

  // 是否已完成
  isCompleted(): boolean {
    return this.state.completed
  }

  // 是否已跳过
  isSkipped(): boolean {
    return this.state.skipped
  }

  // 是否进行中
  isActive(): boolean {
    return this.state.isActive
  }

  // 添加状态变化监听器
  addListener(listener: (state: TutorialState) => void) {
    this.listeners.push(listener)
  }

  // 移除监听器
  removeListener(listener: (state: TutorialState) => void) {
    const index = this.listeners.indexOf(listener)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  // 通知所有监听器
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()))
  }

  // 获取当前步骤的奖励
  getCurrentStepReward(): { credits?: number; researchPoints?: number } | null {
    const step = this.getCurrentStep()
    return step?.reward || null
  }

  // 检查是否应该显示引导（首次游戏）
  static shouldShowTutorial(): boolean {
    try {
      const saved = localStorage.getItem(TUTORIAL_STORAGE_KEY)
      if (!saved) return true
      
      const state = JSON.parse(saved)
      return !state.completed && !state.skipped
    } catch (e) {
      return true
    }
  }
}

export default TutorialSystem
