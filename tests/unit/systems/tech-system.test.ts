// tests/unit/systems/tech-system.test.ts
// 科技系统测试

import { describe, test, expect, beforeEach } from 'vitest'
import { TechSystem } from '../../../src/core/TechSystem'

describe('科技系统', () => {
  let techSystem: TechSystem

  beforeEach(() => {
    techSystem = new TechSystem()
  })

  test('初始化40个科技', () => {
    const technologies = techSystem.getAllTechnologies()
    expect(technologies.length).toBe(40)
  })

  test('T1科技默认解锁', () => {
    const t1Techs = techSystem.getAllTechnologies().filter(t => t.tier === 1)
    const availableTechs = techSystem.getAvailableTechs()
    
    // T1科技应该都已解锁
    t1Techs.forEach(tech => {
      expect(tech.unlocked).toBe(true)
      expect(tech.prerequisites.length).toBe(0)
    })
    
    expect(availableTechs.length).toBe(6) // T1有6个
  })

  test('高阶科技默认锁定', () => {
    const t2Tech = techSystem.getTechnology('advanced_smelting')
    expect(t2Tech!.unlocked).toBe(false)
    expect(t2Tech!.prerequisites.length).toBeGreaterThan(0)
  })

  test('研究科技需要足够研究点', () => {
    const tech = techSystem.getTechnology('basic_automation')
    const canResearch = techSystem.canResearch('basic_automation')
    
    expect(tech!.cost).toBe(100)
    expect(canResearch).toBe(false) // 没有研究点
  })

  test('添加研究点后可以研究', () => {
    techSystem.addResearchPoints(200)
    
    const canResearch = techSystem.canResearch('basic_automation')
    expect(canResearch).toBe(true)
  })

  test('研究成功后科技标记为已研究', () => {
    techSystem.addResearchPoints(200)
    techSystem.research('basic_automation')
    
    const tech = techSystem.getTechnology('basic_automation')
    expect(tech!.researched).toBe(true)
    expect(techSystem.getResearchPoints()).toBe(100)
  })

  test('研究后解锁依赖科技', () => {
    techSystem.addResearchPoints(1000)
    
    // advanced_smelting 需要 basic_smelting
    const before = techSystem.getTechnology('advanced_smelting')!
    expect(before.unlocked).toBe(false)
    
    techSystem.research('basic_smelting')
    
    const after = techSystem.getTechnology('advanced_smelting')!
    expect(after.unlocked).toBe(true)
  })

  test('已研究的科技不能再研究', () => {
    techSystem.addResearchPoints(200)
    techSystem.research('basic_automation')
    
    expect(() => {
      techSystem.research('basic_automation')
    }).toThrow()
  })

  test('获取已研究科技列表', () => {
    techSystem.addResearchPoints(500)
    techSystem.research('basic_automation')
    techSystem.research('efficient_mining')
    
    const researched = techSystem.getResearchedTechs()
    expect(researched.length).toBe(2)
    expect(researched.map(t => t.id)).toContain('basic_automation')
    expect(researched.map(t => t.id)).toContain('efficient_mining')
  })

  test('研究进度统计', () => {
    techSystem.addResearchPoints(500)
    techSystem.research('basic_automation')
    
    const progress = techSystem.getResearchProgress()
    expect(progress.total).toBe(40)
    expect(progress.researched).toBe(1)
  })

  test('科技效果加成计算', () => {
    techSystem.addResearchPoints(500)
    techSystem.research('basic_automation') // +10% 所有产出
    
    const multiplier = techSystem.getEffectMultiplier('production_boost', 'all')
    expect(multiplier).toBe(1.1) // 1 + 0.1
  })

  test('多个相同类型效果叠加', () => {
    techSystem.addResearchPoints(1000)
    techSystem.research('basic_automation') // +10% all
    techSystem.research('efficient_mining') // +15% mining
    
    const miningMultiplier = techSystem.getEffectMultiplier('production_boost', 'mining')
    expect(miningMultiplier).toBe(1.25) // 1 + 0.1 + 0.15
  })

  test('不能添加负研究点', () => {
    expect(() => {
      techSystem.addResearchPoints(-100)
    }).toThrow()
  })
})
