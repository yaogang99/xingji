// tests/unit/systems/planet-system.test.ts
// 行星系统测试

import { describe, test, expect, beforeEach } from 'vitest'
import { PlanetSystem, CORE_PLANET_COUNT } from '../../../src/core/PlanetSystem'

describe('行星系统', () => {
  let planetSystem: PlanetSystem

  beforeEach(() => {
    planetSystem = new PlanetSystem()
  })

  test('初始化8个核心星球', () => {
    const planets = planetSystem.getAllPlanets()
    expect(planets.length).toBe(CORE_PLANET_COUNT)
  })

  test('地球默认解锁', () => {
    const earth = planetSystem.getPlanet('planet_0')
    expect(earth).toBeDefined()
    expect(earth!.name).toBe('地球')
    expect(earth!.unlocked).toBe(true)
    expect(earth!.unlockCost).toBe(0)
  })

  test('其他星球默认锁定', () => {
    const mars = planetSystem.getPlanet('planet_1')
    expect(mars!.unlocked).toBe(false)
    expect(mars!.unlockCost).toBeGreaterThan(0)
  })

  test('获取已解锁星球', () => {
    const unlocked = planetSystem.getUnlockedPlanets()
    expect(unlocked.length).toBe(1)
    expect(unlocked[0].id).toBe('planet_0')
  })

  test('获取锁定星球', () => {
    const locked = planetSystem.getLockedPlanets()
    expect(locked.length).toBe(7)
  })

  test('解锁星球需要足够信用点', () => {
    const mars = planetSystem.getPlanet('planet_1')!
    expect(mars.unlockCost).toBe(1000)
    
    expect(() => {
      planetSystem.unlockPlanet('planet_1', 500)
    }).toThrow()
  })

  test('解锁星球后状态改变', () => {
    const result = planetSystem.unlockPlanet('planet_1', 1000)
    expect(result).toBe(true)
    
    const mars = planetSystem.getPlanet('planet_1')!
    expect(mars.unlocked).toBe(true)
  })

  test('已解锁星球不能再解锁', () => {
    expect(() => {
      planetSystem.unlockPlanet('planet_0', 0)
    }).toThrow()
  })

  test('不存在的星球不能解锁', () => {
    expect(() => {
      planetSystem.unlockPlanet('nonexistent', 1000)
    }).toThrow()
  })

  test('按类型获取星球', () => {
    const terranPlanets = planetSystem.getPlanetsByType('terran')
    expect(terranPlanets.length).toBe(1)
    expect(terranPlanets[0].id).toBe('planet_0')
  })

  test('获取下一个可解锁星球', () => {
    const next = planetSystem.getNextUnlockablePlanet()
    expect(next).toBeDefined()
    expect(next!.id).toBe('planet_1') // 火星，成本最低
  })

  test('星球有资源定义', () => {
    const earth = planetSystem.getPlanet('planet_0')!
    expect(earth.resources.length).toBeGreaterThan(0)
    
    const iron = earth.resources.find(r => r.resourceId === 'iron_ore')
    expect(iron).toBeDefined()
    expect(iron!.abundance).toBeGreaterThan(0)
    expect(iron!.difficulty).toBeGreaterThanOrEqual(1)
  })

  test('获取资源丰度', () => {
    const abundance = planetSystem.getResourceAbundance('planet_0', 'iron_ore')
    expect(abundance).toBeGreaterThan(0)
    
    const zeroAbundance = planetSystem.getResourceAbundance('planet_0', 'nonexistent')
    expect(zeroAbundance).toBe(0)
  })

  test('获取开采难度', () => {
    const difficulty = planetSystem.getMiningDifficulty('planet_0', 'iron_ore')
    expect(difficulty).toBeGreaterThanOrEqual(1)
    expect(difficulty).toBeLessThanOrEqual(10)
  })

  test('生成外域星球', () => {
    const outerPlanet = planetSystem.generateOuterPlanet(0, 12345)
    
    expect(outerPlanet.id).toBe('planet_8')
    expect(outerPlanet.name).toBe('外域-1')
    expect(outerPlanet.unlocked).toBe(false)
    expect(outerPlanet.unlockCost).toBeGreaterThan(0)
    expect(outerPlanet.resources.length).toBeGreaterThan(0)
  })

  test('危险类型正确', () => {
    const mars = planetSystem.getPlanet('planet_1')!
    expect(mars.hazards).toContain('vacuum')
    expect(mars.hazards).toContain('cold')
  })
})
