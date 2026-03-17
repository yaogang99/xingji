// tests/unit/systems/offline-earnings.test.ts
// 离线收益系统测试 - 三段式收益计算

import { describe, test, expect } from 'vitest'
import { OfflineEarnings } from '../../../src/core/OfflineEarnings'

describe('离线收益系统', () => {
  const offlineEarnings = new OfflineEarnings()

  const mockFacilities = [
    { baseOutput: 10, outputType: 'iron_ore', count: 1 },
    { baseOutput: 5, outputType: 'copper_ore', count: 2 },
  ]

  test('8小时内100%收益', () => {
    // 4小时离线
    const result = offlineEarnings.calculateEarnings(4 * 3600, mockFacilities)
    
    expect(result.rate).toBe(1.0)
    expect(result.capped).toBe(false)
    expect(result.duration).toBe(4 * 3600)
  })

  test('16小时80%收益', () => {
    // 16小时离线
    const result = offlineEarnings.calculateEarnings(16 * 3600, mockFacilities)
    
    expect(result.rate).toBe(0.8)
    expect(result.capped).toBe(false)
  })

  test('72小时以上50%收益且capped', () => {
    // 100小时离线
    const result = offlineEarnings.calculateEarnings(100 * 3600, mockFacilities)
    
    expect(result.rate).toBe(0.5)
    expect(result.capped).toBe(true)
    expect(result.duration).toBe(72 * 3600)
  })

  test('零离线时间应返回零收益', () => {
    const result = offlineEarnings.calculateEarnings(0, mockFacilities)
    
    expect(result.rate).toBe(1.0)
    expect(result.capped).toBe(false)
    Object.values(result.resources).forEach(amount => {
      expect(amount).toBe(0)
    })
  })

  test('长时间离线应生成事件', () => {
    // 48小时离线，应生成事件
    const result = offlineEarnings.calculateEarnings(48 * 3600, mockFacilities)
    
    expect(result.events.length).toBeGreaterThan(0)
    expect(result.events.length).toBeLessThanOrEqual(5)
  })

  test('短时间离线不应生成事件', () => {
    // 4小时离线，不应生成事件
    const result = offlineEarnings.calculateEarnings(4 * 3600, mockFacilities)
    
    expect(result.events.length).toBe(0)
  })

  test('研究设施应产生研究点', () => {
    const researchFacilities = [
      { baseOutput: 5, outputType: 'research', count: 1 },
    ]
    
    const result = offlineEarnings.calculateEarnings(8 * 3600, researchFacilities)
    
    expect(result.researchPoints).toBeGreaterThan(0)
  })

  test('负时间应抛出错误', () => {
    expect(() => {
      offlineEarnings.calculateEarnings(-1, mockFacilities)
    }).toThrow()
  })

  test('收益计算正确', () => {
    // 8小时，100%倍率
    const result = offlineEarnings.calculateEarnings(8 * 3600, mockFacilities)
    
    // 设施1: 10 * 1.0 * 8 * 1 = 80
    // 设施2: 5 * 1.0 * 8 * 2 = 80
    expect(result.resources['iron_ore']).toBeGreaterThanOrEqual(70)
    expect(result.resources['copper_ore']).toBeGreaterThanOrEqual(70)
  })
})
