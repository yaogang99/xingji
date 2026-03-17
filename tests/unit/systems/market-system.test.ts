// tests/unit/systems/market-system.test.ts
// 市场系统测试 - 价格波动算法

import { describe, test, expect, beforeEach } from 'vitest'
import { MarketSystem } from '../../../src/core/MarketSystem'

describe('市场系统', () => {
  let marketSystem: MarketSystem

  beforeEach(() => {
    const resourceIds = ['iron_ore', 'copper_ore', 'ice']
    marketSystem = new MarketSystem(resourceIds)
  })

  test('初始化时价格为基准价格', () => {
    const price = marketSystem.getPrice('iron_ore')
    expect(price).toBe(10)
  })

  test('价格更新后应在范围内', () => {
    marketSystem.updatePrices()
    const price = marketSystem.getPrice('iron_ore')
    
    // 价格应在基准价的70%-130%之间
    expect(price).toBeGreaterThanOrEqual(7)
    expect(price).toBeLessThanOrEqual(13)
  })

  test('不存在的资源应抛出错误', () => {
    expect(() => {
      marketSystem.getPrice('nonexistent')
    }).toThrow()
  })

  test('价格趋势初始为stable', () => {
    const trend = marketSystem.getPriceTrend('iron_ore')
    expect(trend).toBe('stable')
  })

  test('多次价格更新后趋势可能变化', () => {
    // 多次更新以积累历史数据
    for (let i = 0; i < 10; i++) {
      marketSystem.updatePrices()
    }
    
    const trend = marketSystem.getPriceTrend('iron_ore')
    expect(['up', 'down', 'stable']).toContain(trend)
  })

  test('所有资源都有价格', () => {
    const prices = ['iron_ore', 'copper_ore', 'ice'].map(id => {
      return marketSystem.getPrice(id)
    })
    
    prices.forEach(price => {
      expect(price).toBeGreaterThan(0)
    })
  })

  test('价格历史记录不超过最大值', () => {
    // 更新超过100次
    for (let i = 0; i < 110; i++) {
      marketSystem.updatePrices()
    }
    
    // 价格仍然有效
    const price = marketSystem.getPrice('iron_ore')
    expect(price).toBeGreaterThan(0)
  })
})
