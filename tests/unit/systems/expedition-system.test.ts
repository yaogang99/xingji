// tests/unit/systems/expedition-system.test.ts
// 探险系统测试

import { describe, test, expect, beforeEach } from 'vitest'
import { ExpeditionSystem } from '../../../src/core/ExpeditionSystem'

describe('探险系统', () => {
  let expeditionSystem: ExpeditionSystem

  beforeEach(() => {
    expeditionSystem = new ExpeditionSystem()
  })

  test('默认初始化55艘飞船，前3艘可用', () => {
    const ships = expeditionSystem.getAllShips()
    expect(ships.length).toBe(55)
    
    const unlockedShips = expeditionSystem.getUnlockedShips()
    expect(unlockedShips.length).toBe(3)
  })

  test('获取飞船信息', () => {
    const ship = expeditionSystem.getShip('ship_t1_explorer_001')
    expect(ship).toBeDefined()
    expect(ship!.name).toBe('侦察者I型')
    expect(ship!.status).toBe('idle')
  })

  test('获取空闲飞船', () => {
    const idleShips = expeditionSystem.getIdleShips()
    expect(idleShips.length).toBe(3)
  })

  test('派遣探险后飞船状态改变', () => {
    const expedition = expeditionSystem.startExpedition('ship_t1_explorer_001', 'mars')
    
    expect(expedition).toBeDefined()
    expect(expedition.status).toBe('ongoing')
    
    const ship = expeditionSystem.getShip('ship_t1_explorer_001')
    expect(ship!.status).toBe('expedition')
  })

  test('探险中的飞船不能再派遣', () => {
    expeditionSystem.startExpedition('ship_t1_explorer_001', 'mars')
    
    expect(() => {
      expeditionSystem.startExpedition('ship_t1_explorer_001', 'europa')
    }).toThrow()
  })

  test('不存在的飞船不能派遣', () => {
    expect(() => {
      expeditionSystem.startExpedition('nonexistent', 'mars')
    }).toThrow()
  })

  test('探险完成返回事件', async () => {
    const expedition = expeditionSystem.startExpedition('ship_t1_explorer_001', 'mars')
    
    // 模拟时间流逝（探险持续时间）
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 修改探险开始时间为过去，使其可完成
    expedition.startTime = Date.now() - 600000 // 10分钟前
    
    const events = expeditionSystem.completeExpedition(expedition.id)
    
    expect(events).toBeDefined()
    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events.length).toBeLessThanOrEqual(3)
  })

  test('完成探险后飞船状态为returning', async () => {
    const expedition = expeditionSystem.startExpedition('ship_t1_explorer_001', 'mars')
    expedition.startTime = Date.now() - 600000
    
    expeditionSystem.completeExpedition(expedition.id)
    
    const ship = expeditionSystem.getShip('ship_t1_explorer_001')
    expect(ship!.status).toBe('returning')
  })

  test('返回后飞船状态恢复idle', async () => {
    const expedition = expeditionSystem.startExpedition('ship_t1_explorer_001', 'mars')
    expedition.startTime = Date.now() - 600000
    
    expeditionSystem.completeExpedition(expedition.id)
    expeditionSystem.returnShip('ship_t1_explorer_001')
    
    const ship = expeditionSystem.getShip('ship_t1_explorer_001')
    expect(ship!.status).toBe('idle')
    expect(ship!.currentExpedition).toBeUndefined()
  })

  test('获取进行中的探险', () => {
    expeditionSystem.startExpedition('ship_t1_explorer_001', 'mars')
    
    const ongoing = expeditionSystem.getOngoingExpeditions()
    expect(ongoing.length).toBe(1)
    expect(ongoing[0].shipId).toBe('ship_t1_explorer_001')
  })

  test('删除飞船后不能再获取', () => {
    // 添加新飞船然后删除
    const newShip = {
      id: 'ship_test',
      name: '测试船',
      cargo: 100,
      speed: 10,
      combatPower: 50,
      equipment: [],
      status: 'idle' as const,
    }
    
    expeditionSystem.addShip(newShip)
    expect(expeditionSystem.getShip('ship_test')).toBeDefined()
    
    expeditionSystem.removeShip('ship_test')
    expect(expeditionSystem.getShip('ship_test')).toBeUndefined()
  })

  test('探险中的飞船不能被删除', () => {
    expeditionSystem.startExpedition('ship_t1_explorer_001', 'mars')
    
    expect(() => {
      expeditionSystem.removeShip('ship_t1_explorer_001')
    }).toThrow()
  })
})
