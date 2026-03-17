// tests/unit/data/resources.test.ts
// 资源数据完整性测试

import { describe, test, expect } from 'vitest'
import resourcesData from '../../../dist/data/resources.json'

describe('资源数据完整性', () => {
  test('资源总数必须为30', () => {
    expect(resourcesData.length).toBe(30)
  })

  test('所有资源ID必须唯一', () => {
    const ids = resourcesData.map(r => r.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  test('所有资源必须有完整字段', () => {
    resourcesData.forEach(resource => {
      expect(resource.id).toBeDefined()
      expect(typeof resource.id).toBe('string')
      expect(resource.id.length).toBeGreaterThan(0)

      expect(resource.name).toBeDefined()
      expect(typeof resource.name).toBe('string')
      expect(resource.name.length).toBeGreaterThan(0)

      expect(resource.type).toBeDefined()
      expect(['raw', 'processed', 'product', 'luxury']).toContain(resource.type)

      expect(resource.tier).toBeDefined()
      expect(resource.tier).toBeGreaterThanOrEqual(1)
      expect(resource.tier).toBeLessThanOrEqual(5)

      expect(resource.baseValue).toBeDefined()
      expect(typeof resource.baseValue).toBe('number')
      expect(resource.baseValue).toBeGreaterThan(0)

      expect(resource.marketVolatility).toBeDefined()
      expect(typeof resource.marketVolatility).toBe('number')
      expect(resource.marketVolatility).toBeGreaterThanOrEqual(0)
      expect(resource.marketVolatility).toBeLessThanOrEqual(1)

      expect(resource.storagePerUnit).toBeDefined()
      expect(typeof resource.storagePerUnit).toBe('number')
      expect(resource.storagePerUnit).toBeGreaterThan(0)

      expect(resource.icon).toBeDefined()
      expect(typeof resource.icon).toBe('string')

      expect(resource.color).toBeDefined()
      expect(resource.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })

  test('T1资源数量正确', () => {
    const t1Resources = resourcesData.filter(r => r.tier === 1)
    expect(t1Resources.length).toBe(8)
  })

  test('T2资源数量正确', () => {
    const t2Resources = resourcesData.filter(r => r.tier === 2)
    expect(t2Resources.length).toBe(8)
  })

  test('T3资源数量正确', () => {
    const t3Resources = resourcesData.filter(r => r.tier === 3)
    expect(t3Resources.length).toBe(8)
  })

  test('T4资源数量正确', () => {
    const t4Resources = resourcesData.filter(r => r.tier === 4)
    expect(t4Resources.length).toBe(4)
  })

  test('T5资源数量正确', () => {
    const t5Resources = resourcesData.filter(r => r.tier === 5)
    expect(t5Resources.length).toBe(2)
  })

  test('原始资源必须正确分类', () => {
    const rawResources = resourcesData.filter(r => r.type === 'raw')
    const expectedRaw = ['iron_ore', 'copper_ore', 'aluminum_ore', 'ice', 'silicon_ore', 'carbon', 'hydrogen', 'helium']
    
    expectedRaw.forEach(id => {
      const resource = resourcesData.find(r => r.id === id)
      expect(resource).toBeDefined()
      expect(resource!.type).toBe('raw')
    })
  })

  test('奢侈品必须有高价值', () => {
    const luxuryResources = resourcesData.filter(r => r.type === 'luxury')
    luxuryResources.forEach(r => {
      expect(r.baseValue).toBeGreaterThanOrEqual(5000)
    })
  })

  test('价格波动率必须在合理范围', () => {
    resourcesData.forEach(r => {
      expect(r.marketVolatility).toBeGreaterThanOrEqual(0.05)
      expect(r.marketVolatility).toBeLessThanOrEqual(1.0)
    })
  })
})
